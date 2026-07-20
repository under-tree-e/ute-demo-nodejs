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
- Prefer Frappe's own `FrappeTestCase` (or equivalent base class) so each
  test runs inside a rolled-back transaction — don't hand-roll setup/
  teardown that leaves state behind for the next test.

## Bench commands

- Framework/site lifecycle actions (migrating a site's schema, rebuilding
  assets, restarting workers, and similar) are run through bench — treat
  these as examples of the kind of operation involved, not a full command
  reference.
- Use bare `bench`, never a full/venv-qualified path — bench's own
  environment activation depends on being invoked this way.
- Always pass `--site <site>` explicitly — never rely on an implicit
  default site.
- Don't run `bench --version`/`--help` or similar discovery commands to
  "check" the environment first; locate the bench root directly
  (`apps/`, `sites/`, `Procfile`) instead of probing for it.
- Don't manually create a DocType's folder/files — `bench migrate`
  generates them from the DocType's JSON definition; hand-created
  scaffolding drifts from what Frappe expects.
- Run `bench start` only as a background process, and check first whether
  it's already running in another terminal — a second instance competes
  for the same ports/workers.

## Application-development conventions (day-to-day Frappe API usage)

This section is Frappe/ERPNext-specific, day-to-day coding guidance for
this archetype only — it does not apply to any other archetype, and
none of it belongs in `core/standards/*`, which stays framework-neutral.

### Whitelisted APIs

- Only mark an endpoint `allow_guest=True` when anonymous access is
  actually required — default to authenticated-only.
- Validate and type-cast every parameter read from `frappe.form_dict` or
  function arguments before using it; never trust raw request input for a
  DocType name, filter, or SQL fragment.
- Don't disable CSRF checking to make a whitelisted endpoint easier to
  call — fix the caller instead.

### Database access

- Use `frappe.qb` or `frappe.db.get_all`/`get_list` with parameterized
  filters; never build `frappe.db.sql()` by string-concatenating
  user-controlled input — that's SQL injection.
- Any `frappe.db.set_value`/`frappe.db.delete` call must have a concrete,
  non-empty filter — a `None` or empty name/filter matches (and mutates)
  every row in the table. Treat this as a correctness bug, not a style
  nit, during review.
- Don't call `frappe.db.commit()`/`frappe.db.rollback()` in the middle of
  a request handler's transaction — it silently ends the transaction and
  can leave partial state (e.g. a submitted document with no matching
  ledger entry).

### Permissions

- A change to `has_permission`/permission-query-condition logic needs a
  test proving a user without the role/condition still cannot see or
  modify the record — not just that an authorized user can.
- Loosening a DocType's default permission level requires the same
  risk-note as any other permission change under
  `.claude/rules/security.md` — Frappe's own permission system doesn't
  exempt it.

### Background jobs and realtime

- A job passed to `frappe.enqueue` must be safe to run twice (idempotent)
  — queues retry on failure, and a non-idempotent job that partially ran
  before failing will corrupt state on retry.
- Log job failures explicitly; a background job that swallows its own
  exception fails silently with no user-visible signal.
- `publish_realtime` calls must target an explicit `user`/`room` scoped to
  the data's owner — never broadcast tenant-specific data on a shared or
  global channel by default.

### Caching

- Invalidate `frappe.cache` entries explicitly at the point data changes;
  don't rely on a short TTL to paper over a missing invalidation for
  business data that must stay consistent.

### Frontend surface

- Pick one of Desk (framework-generated forms/list views), a Vue SPA
  (`frappe-ui`-based custom app UI), or portal pages (public-facing,
  server-rendered) based on the audience — internal operational UI can
  usually stay on Desk; a purpose-built end-user product experience is
  where a Vue SPA earns its extra complexity.

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

Use dedicated CI/CD templates from approved repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
to run bench-based build/test/migrate stages, instead of hand-rolling
pipeline logic in this repo. Document the selected delivery model in
`docs/ci-cd.md` — see `core/standards/ci-cd.md`.

These are recommendations and review checks for this archetype, not
mandates — an existing project is not required to restructure to match them.
