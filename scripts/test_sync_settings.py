"""Checks for authored-help publication and the strict documentation gate."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


class ExportTests(unittest.TestCase):
    def test_review_and_invalidation(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'scripts').mkdir()
            shutil.copyfile(Path(__file__).with_name('sync-settings.py'), root / 'scripts/sync-settings.py')
            source = root / 'native/crates/ui/src/settings/settings_rows.rs'
            source.parent.mkdir(parents=True)
            source.write_text('row(Page::General, "Projects", "Open", "Choose how to open", &["open"], control)', encoding='utf-8')
            help_file = root / 'settings-help.json'
            help_file.write_text('{}', encoding='utf-8')

            def run(*flags):
                return subprocess.run([sys.executable, str(root / 'scripts/sync-settings.py'), '--source', str(root / 'native'), *flags], capture_output=True, text=True)

            self.assertEqual(run().returncode, 0)
            row = json.loads((root / 'public/settings.json').read_text())[0]
            self.assertEqual(row['helpStatus'], 'needs-review')
            self.assertNotEqual(run('--require-help').returncode, 0)
            help_file.write_text(json.dumps({row['id']: {
                'sourceFingerprint': row['sourceFingerprint'], 'summary': 'Choose whether another project opens in a tab.', 'description': 'Keeps projects in tabs.',
                'options': [], 'whenToChange': 'When comparing projects.',
                'references': ['crates/ui/src/settings/settings_rows.rs'], 'workInProgress': True
            }}), encoding='utf-8')
            self.assertEqual(run('--require-help').returncode, 0)
            published = json.loads((root / 'public/settings.json').read_text())[0]
            self.assertEqual(published['description'], 'Keeps projects in tabs.')
            self.assertEqual(published['note'], 'Choose whether another project opens in a tab.')
            self.assertTrue(published['workInProgress'])
            authored = json.loads(help_file.read_text())
            for field, invalid in [('options', [{'name': '', 'description': 'Empty label'}]), ('references', []), ('workInProgress', 'yes')]:
                broken = json.loads(json.dumps(authored))
                broken[row['id']][field] = invalid
                help_file.write_text(json.dumps(broken), encoding='utf-8')
                self.assertNotEqual(run('--require-help').returncode, 0, field)
            help_file.write_text(json.dumps(authored), encoding='utf-8')
            source.write_text(source.read_text().replace('Choose how to open', 'Choose a different behavior'), encoding='utf-8')
            self.assertEqual(run().returncode, 0)
            stale = json.loads((root / 'public/settings.json').read_text())[0]
            self.assertEqual(stale['helpStatus'], 'needs-review')
            self.assertEqual(stale['description'], '')
            self.assertFalse(stale['workInProgress'])
            self.assertEqual(stale['note'], 'Choose a different behavior')
            self.assertNotEqual(run('--require-help').returncode, 0)


if __name__ == '__main__':
    unittest.main()
