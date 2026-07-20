# Recommended Files — npm Package

Every the project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in.
Add the following for a published package:

## Required

- `CHANGELOG.md` — Keep a Changelog style or auto-generated; every release
  has an entry.
- `README.md` — install instructions, quick-start usage, link to full API
  docs.
- `LICENSE` — required for any package leaving the org's private boundary.
- `package.json` — correct `exports`, `types`, `files`, `version`, and
  `private`/`publishConfig` set deliberately.
- `.npmrc` — registry/scope config only; verify no tokens are present before
  every commit (never rely on memory alone — check the diff).

## Recommended

- `docs/api.md` — public API reference, generated (e.g. TypeDoc) or hand
  maintained, kept in sync via `docs-sync`.
- `docs/migration.md` — upgrade notes for each major version.
- `.npmignore` or a precise `files` field, so unpublished internals never
  ship.

## Situational

- `docs/adr/` for decisions on public API shape, breaking changes, or
  registry migration (e.g. moving from internal to public registry).
- CI publish workflow file, documented in `docs/ci-cd.md`, describing what
  triggers a publish (tag push, manual approval, etc.).
