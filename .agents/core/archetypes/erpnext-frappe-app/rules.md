# Rules — ERPNext / Frappe App

## App structure

- A custom app is a Python package installed into one or more bench-managed
  sites — keep app-specific logic inside the app's own package, not patched
  into ERPNext core or a different app.

## Fixtures

- Fixtures are exported configuration data (not user/transactional data)
  and are version-controlled like code — review a fixture diff the same way
  as a code diff before it's committed.
- Don't export a fixture straight from a live/production site without
  checking it for anything environment-specific or sensitive first.

## DocTypes

- A DocType's schema is defined in code (its JSON definition) and changes
  to it are shipped through Frappe's migration mechanism — never edit a
  DocType's underlying database table by hand.
- Field type/structure changes to an existing DocType need a plan for what
  happens to existing records, not just the new schema.

## Patches and migrations

- Patches are one-way, forward-only migrations, listed in order in
  `patches.txt` — don't write a patch that assumes it can be rolled back
  automatically.
- Test every patch against a copy of real data before it runs against a
  production site.

## `hooks.py`

- `hooks.py` is the central place where an app registers itself with
  Frappe (event handlers, scheduled jobs, overrides, and similar
  integration points) — document what's registered there so a reviewer
  doesn't have to reverse-engineer it from the file alone.

## Tests

- App tests run through Frappe's own test framework, executed via bench,
  against a test site — not against a production or shared dev site.

## Bench commands

- Framework/site lifecycle actions (migrating a site's schema, rebuilding
  assets, restarting workers, and similar) are run through bench — treat
  these as examples of the kind of operation involved, not a full command
  reference.

## Backups before migrations

- Take a backup of the site (via bench's backup mechanism or equivalent)
  immediately before running any patch or migration against real data —
  mandatory, not optional, regardless of how small the patch looks.

## App install/update checklist

- Before installing or updating an app on a real site: confirm a recent
  backup exists, review pending patches, run the update against a staging
  copy first, and confirm the test suite passes there before touching the
  real site.

## Claude and production mutations

- Claude must never directly mutate a live production site or its database
  — no in-place migration, no manual SQL against production, no editing a
  DocType record directly — without explicit human approval, and must
  always propose a plan (DocType/patch changes plus a migration/test plan)
  first. This is enforced by `.claude/rules/devops/infra-rules.md` and
  `.claude/rules/security.md`, already installed in this project — the
  rules here are additive detail, not a replacement for those.

## CI/CD expectations

Use dedicated CI/CD templates from approved UTE repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
to run bench-based build/test/migrate stages, instead of hand-rolling
pipeline logic in this repo. Document the selected delivery model in
`docs/ci-cd.md` — see `core/standards/ci-cd.md`.

These are recommendations and review checks for this archetype, not
mandates — an existing project is not required to restructure to match them.
