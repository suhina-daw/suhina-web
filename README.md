# Suhina web

The Suhina product guide and searchable settings reference. Built with Vue 3, TypeScript, Vite, plain CSS, and Motion for Vue. The existing visual design is kept in reusable Vue components.

## Development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Vite provides hot reload. Stop a server with Ctrl+C.

```sh
npm run build       # Type-check and build to dist/
npm run preview     # Serve the production build at http://127.0.0.1:4173
npm test            # Data validation and search checks (Node 22.12+)
python -m unittest discover -s scripts -p "test_*.py"
```

The output is static: deploy `dist/` to a static host. Production needs no Python, Node server, or backend. Vite's `base` option can be set when deploying under a subdirectory; the settings URL and brand assets follow it.

## Structure

- `src/components/`: header, sidebar, landing sections, settings reference and setting entries.
- `src/data/settings.ts`: typed data validation and search.
- `src/styles/main.css`: shared CSS and responsive design tokens.
- `public/assets/`: existing brand assets.
- `public/settings.json`: generated data, publicly served for the website and developer use.
- `settings-help.json`: reviewed extended explanations.

## Settings documentation

Generate data from Suhina's `crates/ui/src/settings/settings_rows.rs`:

```sh
python scripts/sync-settings.py --source ../suhina-ui-polish
```

Pass the path to another checkout when needed. The website fetches the generated `/settings.json`. Raw JSON source links are intentionally omitted from individual setting explanations. Multi-control panels remain grouped as in the native UI. Search includes setting names, saved keys, notes, options and extended explanations.

See `AGENTS.md` for authoring instructions. The current website export contains 73 entries with implementation-checked English help, including choices, dependencies, practical guidance and contributor references. See [the review notes](docs/settings-review.md) for source provenance and discrepancies in native specs. Authored `summary` text can replace a terse native UI note without modifying the application source. Run `python scripts/sync-settings.py --source ../suhina-ui-polish --require-help` during local authoring to check completeness against a native checkout. Native changes after the recorded review may require new help. The Pages workflow performs technical checks only and initially publishes by manual dispatch. Settings-content review belongs in the native repository; the website must not repeat it. See [publishing and Namecheap DNS instructions](docs/publishing.md).

`workInProgress: true` in an authored help entry displays a yellow Work in progress pill when that help's fingerprint matches. It describes an incomplete feature, independently of the documentation review status. Search also finds that phrase. It currently marks Warp mode and Plug-in library. Public release of AI-assisted text still requires maintainer review; the local `reviewed` status is not a release approval.

The proposed [versioned documentation data plan](docs/documentation-data-plan.md) moves settings and shortcut sources into the native repository, with schemas, coverage gates, pinned exports and human review before publication.

Only the setting list fades for 500 ms when changing categories; headings, search, filters, entry count and Reset filters stay in place. The opening hero and expanded help also use motion. All respect reduced-motion preferences. Fonts use Google Fonts with local fallbacks. External release links lead to pre-alpha nightly builds. The complete settings reference is one part of a broader product site; this is not yet a complete application manual.

## License and repository

Website-owned code and content are GPL-3.0-or-later; see LICENSE and NOTICE. Third-party materials retain their own licenses. The local Git repository uses `main` and its `origin` is `https://github.com/suhina-daw/suhina-web.git`. The user has made the repository public. GitHub Pages setup and the first website publication require completing the steps in `docs/publishing.md`. Review of settings prose belongs in the native repository, with no duplicate content approval in this repository.
