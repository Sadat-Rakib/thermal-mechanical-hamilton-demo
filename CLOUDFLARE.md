# Cloudflare deployment

- Thermal Mechanical: https://thermal-mechanical-hamilton.pages.dev

Pushes to codex/demo deploy through GitHub Actions. One repository secret is required: CLOUDFLARE_API_TOKEN, scoped only to account 325a4e03343ac8e3ab542ee08a397fb4, with Cloudflare Pages Edit, Workers Scripts Edit and Account Settings Read. No OAuth login credential is stored in GitHub.

The initial configuration commit skips CI while the persistent token is unavailable. Add the secret and run the Cloudflare workflow to validate automatic deployment. Each client uses its own static asset directory; server-side credentials and unrelated files are excluded.
