"""Export settings metadata and reviewed guide text to the website JSON."""
import argparse
import hashlib
import json
import re
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
parser.add_argument('--require-help', action='store_true', help='Fail if any setting lacks reviewed extended help.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
help_entries = json.loads((root / 'settings-help.json').read_text(encoding='utf-8-sig'))
source = (args.source / 'crates/ui/src/settings/settings_rows.rs').read_text(encoding='utf-8')
pattern = r'\b(?:row|block)\(\s*Page::(\w+),\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*(&\[[^\]]*\]|KEYMAP)'
rows = []
for page, section, name, note, keys in re.findall(pattern, source):
    note = re.sub(r'\s*\(\[docs/[^)]*\)', '', note)
    saved_keys = re.findall(r'"([^"]+)"', keys) if keys != 'KEYMAP' else ['keymap.json']
    entry_id = f'{page}/{section}/' + (','.join(saved_keys) or name)
    fingerprint = hashlib.sha256(json.dumps([page, section, name, note, saved_keys], ensure_ascii=False).encode()).hexdigest()
    help_entry = help_entries.get(entry_id, {})
    reviewed = help_entry.get('sourceFingerprint') == fingerprint
    if reviewed:
        if 'summary' in help_entry and (not isinstance(help_entry['summary'], str) or not help_entry['summary'].strip()):
            raise SystemExit(f'Invalid summary: {entry_id}')
        if not isinstance(help_entry.get('description'), str) or not help_entry['description'].strip():
            raise SystemExit(f'Missing description: {entry_id}')
        if not isinstance(help_entry.get('whenToChange'), str) or not help_entry['whenToChange'].strip():
            raise SystemExit(f'Missing whenToChange: {entry_id}')
        options = help_entry.get('options')
        if not isinstance(options, list) or any(not isinstance(o, dict) or not isinstance(o.get('name'), str) or not o['name'].strip() or not isinstance(o.get('description'), str) or not o['description'].strip() for o in options):
            raise SystemExit(f'Invalid options: {entry_id}')
        references = help_entry.get('references')
        if not isinstance(references, list) or not references or any(not isinstance(ref, str) or not ref.strip() for ref in references):
            raise SystemExit(f'Missing references: {entry_id}')
        if not isinstance(help_entry.get('workInProgress', False), bool):
            raise SystemExit(f'Invalid workInProgress: {entry_id}')
    guide_note = help_entry.get('summary', note) if reviewed else note
    rows.append(dict(id=entry_id, page=page, section=section, name=name, note=guide_note, keys=saved_keys,
                     sourceFingerprint=fingerprint, helpStatus='reviewed' if reviewed else 'needs-review',
                     description=help_entry.get('description', '') if reviewed else '',
                     options=help_entry.get('options', []) if reviewed else [],
                     whenToChange=help_entry.get('whenToChange', '') if reviewed else '',
                     workInProgress=help_entry.get('workInProgress', False) if reviewed else False))
if not rows:
    raise SystemExit('No settings parsed; source format may have changed.')
if len({r['id'] for r in rows}) != len(rows):
    raise SystemExit('Duplicate setting IDs; export needs updating.')
missing = [r['id'] for r in rows if r['helpStatus'] != 'reviewed']
if args.require_help and missing:
    raise SystemExit('Extended help needs review:\n' + '\n'.join(missing))
target = root / 'public/settings.json'
target.parent.mkdir(exist_ok=True)
target.write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Wrote {len(rows)} entries; {len(missing)} need extended help review.')
