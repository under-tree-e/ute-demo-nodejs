# Recommended Files — Angular App

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in.

## Required

- `docs/product-overview.md`, `docs/architecture.md`, `docs/environments.md`,
  `docs/ci-cd.md` — base set, filled in for this app.
- `src/environments/environment.ts` + per-env variants, with no secrets
  committed (secrets injected at build/deploy time).
- `angular.json` (or equivalent build config) kept current with the actual
  structure in use.

## Recommended

- `docs/ui-states.md` or a section in `architecture.md` documenting the
  app's loading/error/empty state convention, if non-obvious.
- `.editorconfig` / lint config (`eslint`, `stylelint`) checked in and
  enforced in CI, not just local defaults.
- A short accessibility checklist (can live in `docs/architecture.md`) for
  reviewers, if the app has any public-facing or compliance-sensitive
  surface.
- `README.md` at repo root with local dev setup (`npm install`, `ng serve`,
  required env vars).
