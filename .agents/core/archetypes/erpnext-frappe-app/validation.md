# Validation — ERPNext / Frappe App

## Before proposing a change

- Run the app's test suite through Frappe's test framework against a
  disposable test site — never against a shared dev site or production.
- For any patch/migration, rehearse it against a copy of real data (a
  restored backup on a staging site) before it's proposed for production.

## CI/CD expectations

- CI provisions a disposable bench/site, installs the app, runs pending
  migrations, and runs the test suite — a green run means "works on a fresh
  site with current patches," not "safe against production data" by itself.
- App updates deploy to staging first; production update is a separate,
  explicitly gated step with a backup taken immediately before it runs.

## Common risks

- A patch that's irreversible in practice (dropped/renamed fields) with no
  fallback plan if something downstream still expects the old shape.
- A DocType field type or structure change breaking existing records that
  don't fit the new definition.
- Fixture drift: a fixture that was fine on the site it was exported from
  but conflicts with data already present on another site.
- Migrations run out of order, or a patch missing from `patches.txt` on one
  environment but present on another.
- Skipping the backup step because a patch "looks small."

## Backups are mandatory, not a suggestion

No patch or migration runs against a production site without a fresh backup
immediately beforehand — this applies regardless of how the change was
reviewed or how confident the plan is.
