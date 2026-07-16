# Recommended Files — Docker Compose App

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in, plus `docs/adr/` for architecture
decision records if this project uses them. Also add:

## Compose and env

- `docker-compose.yml` (base), plus `docker-compose.override.yml` and/or
  `docker-compose.prod.yml` if the project has more than one environment.
- `.env.example` — committed, kept in sync with every variable actually
  used.
- `.dockerignore` per build context, to keep images small and avoid leaking
  local files (including `.env`) into image layers.

## Per service

- A `Dockerfile` per service, with a pinned base image tag.
- A short README or comment block noting what the service does and its
  runtime dependencies, if not obvious from `docker-compose.yml` alone.

## Docs

- `docs/environments.md` — filled in with which compose file combination
  runs in each environment and where secrets/`.env` values come from.
- `docs/ci-cd.md` — filled in with build/scan/push/deploy steps and the
  approval gate for prod.
- A backup/restore procedure for each stateful service — can live in
  `docs/environments.md` or a dedicated `docs/backup-restore.md`.

## Not required by this archetype

- No mandate on registry choice or specific CI provider — document whatever
  the team already uses.
