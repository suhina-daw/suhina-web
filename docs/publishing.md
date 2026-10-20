# Publishing to suhina.org

The GitHub repository is public. GitHub Pages can host the static Vite build; no server or Worker is required. Domain registration and DNS can stay at Namecheap.

## Verification and approval

`.github/workflows/pages.yml` runs technical checks on pushes and pull requests: Node data-validation/search tests, Python exporter tests and the production build. It uploads only `dist` as a Pages artifact. It does not check out the DAW source or repeat a settings-content review. The native repository owns that review and the settings-coverage gate.

Initial website publication is manual: run **Verify and publish website** from `main` and explicitly select **publish_reviewed_site** after release authorization. Ordinary pushes and pull requests do not deploy in this initial setup. Once the native export pipeline exists, source-approved data updates can deploy automatically after these technical checks; they must not require another human content review in the web repository.

Settings prose must be approved in the native repository, alongside its implementation. Local `helpStatus: reviewed` means the author checked implementation evidence; it is not proof of source-repository approval. The present prose still lives in this repository, so migration to the native repository is necessary before automatic synchronization can be enabled. This does not introduce a second review gate in the web repository.

## GitHub setup

1. In repository Settings → Pages, select GitHub Actions as the build source.
2. Verify ownership of `suhina.org` in the organization's Pages settings using the TXT record GitHub supplies. Its exact verification name and value come from GitHub and must not be guessed.
3. Set the repository's custom domain to `suhina.org` before pointing its DNS to GitHub. A custom Actions deployment does not require a `CNAME` file in the repository.
4. After content approval, manually dispatch the publishing workflow on `main`.
5. Once DNS validation and certificate issuance succeed, enable Enforce HTTPS.

## Namecheap DNS

In Domain List → suhina.org → Manage → Advanced DNS, replace only the conflicting parking or URL Redirect host records for `@` and `www` with:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |
| CNAME | www | suhina-daw.github.io | Automatic |

Keep unrelated records, particularly mail and domain-verification records. Do not change nameservers for this GitHub Pages setup. If an existing AAAA record points at another host, reconcile it before enabling the domain; optional GitHub IPv6 addresses are listed in the official instructions. The organization verification TXT record is additional to the host records above.

The custom domain serves the app at `/`, matching Vite's current base. Without a custom domain, this repository's default project URL is under `/suhina-web/` and requires a corresponding Vite base; do not use that URL as the final deployment test with the root-domain build.

## Finish checks

Check `https://suhina.org`, the `www` redirect, HTTPS, the brand assets and `settings.json`. Test search, categories, expanded explanations, keyboard controls and a mobile viewport. Record any outstanding content or layout review before approving the first public release.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [custom domain and DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
