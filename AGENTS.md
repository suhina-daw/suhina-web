# Settings guide content

The website reads `/settings.json` from `public/settings.json`. Generate it with:

```sh
python scripts/sync-settings.py --source ../suhina-ui-polish
```

Never edit generated `public/settings.json` by hand. `settings-help.json` holds authored extended help keyed by the exported setting `id`.

## Website development

Use Vue 3 single-file components with TypeScript, Vite, plain CSS, and Motion for Vue (`motion-v`). Preserve the established warm paper palette, typography, spacing and responsive layout. Shared tokens and base styles live in `src/styles/main.css`; component-specific styles belong in scoped style blocks. Respect reduced motion and retain semantic keyboard-accessible controls. Treat JSON as untrusted data; validate it and render text through Vue interpolation, never `v-html`.

Run `npm run build`, `npm test`, and the Python exporter tests after changes to the data pipeline. `npm run dev` uses port 5173; `npm run preview` serves the production build on 4173. Check the production build in the browser. Do not manually edit `dist/` or commit dependencies, build output, or preview screenshots.

When asked to document settings, or when changing a setting's help:

1. Read the actual control in `crates/ui/src/settings/settings_rows.rs`, its implementation, and the relevant Suhina spec. A short UI note alone is insufficient evidence for extended help.
2. For every setting in scope, add an English `description` explaining its effect in plain language, `options` (an array of `{ "name": "...", "description": "..." }` for choices), and `whenToChange` giving a concrete reason to change it. Add `summary` when the native UI note is too terse for a standalone guide; the exporter uses it as the visible summary only while the help is reviewed. For non-choice controls use an empty options array. Multi-control panels need an explanation of their individual controls.
3. Explain unfamiliar terms before using them. Name the affected panel or action explicitly: avoid contextless wording such as “under the view” or “beside it”. Explain the visible before/after result of each option and any dependency on another setting. Do not simply repeat the summary. Do not invent behavior, defaults, limits, or performance claims. Verify defaults in code before documenting them. If evidence is missing, leave the entry pending and report it.
4. Copy the entry's current `sourceFingerprint` into the help entry only after checking it. Regenerate JSON. A changed fingerprint invalidates old help until reviewed. This detects metadata changes, not all implementation changes: review help whenever behavior changes too.
5. Verify the expanded page and search. For a complete-guide task run the exporter with `--require-help`; this must pass before claiming every setting is documented.

Keep explanatory text in JSON as plain text, not HTML. Do not add raw JSON source links to individual setting explanations; implementation references belong in contributor documentation. The generated JSON remains publicly accessible as the website's data source. Do not automatically publish unreviewed AI-generated prose.
