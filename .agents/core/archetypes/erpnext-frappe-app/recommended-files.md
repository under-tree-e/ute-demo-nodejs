# Recommended Files — ERPNext / Frappe App

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in, plus `docs/adr/` for architecture
decision records if this project uses them. Also add:

## App package

- `hooks.py`, kept documented (inline comments or a companion doc) so a
  reviewer can see what's registered without tracing every reference.
- `patches.txt`, with each entry traceable to a reviewed change.
- `requirements.txt` (or equivalent dependency manifest) for the app's own
  Python dependencies.

## Docs

- `docs/environments.md` — filled in with which bench site(s) map to which
  environment, and where site-specific config/secrets live.
- `docs/ci-cd.md` — filled in with the test-site provisioning, migration
  rehearsal, and staged rollout steps.
- A short doc listing the app's DocTypes and what each represents, if the
  app has grown past a handful of them — can live in `docs/architecture.md`.
- A backup/restore runbook for the site(s) this app is installed on.

## Fixtures

- `fixtures/` reviewed like code, with a note on what environment each
  fixture was exported from and why it's shipped with the app.

## Not required by this archetype

- No mandate on which CI provider or bench version-management tool is used
  — document whatever the team already runs.
