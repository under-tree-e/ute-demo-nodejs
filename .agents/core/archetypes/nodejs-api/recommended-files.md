# Recommended Files — Node.js API

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in.

## Required

- `docs/product-overview.md`, `docs/architecture.md`, `docs/environments.md`,
  `docs/ci-cd.md` — base set, filled in for this API.
- `.env.example` — every required environment variable listed, no real
  secret values.
- `src/config/` — config schema/validation module, matching what
  `.env.example` documents.
- API documentation: an OpenAPI spec (`openapi.yaml`/`.json`) or a
  `docs/api.md` kept next to the routes it describes.

## Recommended

- `docs/migrations.md` (or a section in `architecture.md`) documenting the
  migration tool/convention in use, if the project has a database.
- `docker-compose.yml` (or equivalent) for spinning up local dependencies
  (DB, cache, queue) for integration testing.
- `README.md` at repo root with local dev setup, required env vars, and how
  to run tests (unit vs. integration).
- Lint/format config (`eslint`, `prettier`) checked in and enforced in CI.
