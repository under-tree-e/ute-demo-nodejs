# Recommended Files — Angular Library

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in.

## Required

- `docs/product-overview.md`, `docs/architecture.md`, `docs/ci-cd.md` — base
  set, filled in for this library (`environments.md` may be thin/omitted if
  the library has no runtime environments of its own).
- `projects/<lib-name>/src/public-api.ts` — the canonical export list.
- `projects/<lib-name>/package.json` — with correct `peerDependencies` and
  version.
- `CHANGELOG.md` at repo root, updated per release.

## Recommended

- `README.md` with install instructions and at least one working usage
  snippet per major exported component/service, kept in sync with
  `public-api.ts`.
- `projects/demo/` sandbox app for local development and manual
  verification, if the library has UI surface.
- `docs/api-reference.md` (or generated docs) for libraries with a large
  public surface where a hand-written README isn't enough.
- Migration notes for any deprecation, alongside the `CHANGELOG.md` entry.
