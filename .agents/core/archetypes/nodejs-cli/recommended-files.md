# Recommended Files — Node.js CLI

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in.
Add the following for a CLI project:

## Required

- `README.md` — install instructions, usage examples for every subcommand,
  exit code meanings.
- `package.json` — correct `bin` field, `files` allowlist (don't ship source
  maps, tests, or internal scripts to installers).

## Recommended

- `CHANGELOG.md` — required if the CLI is published or installed by other
  teams; see `archetypes/npm-package/rules.md` if it's also an npm package.
- `docs/commands.md` or generated `--help` output committed as a reference,
  kept in sync via `docs-sync`.
- `docs/config.md` — documents config file schema, locations, and precedence
  (project vs user vs flags), matching `rules.md`.
- `.env.example` if the CLI reads environment variables — never commit real
  values.

## Situational

- `docs/adr/` for decisions on argument-parsing library choice, config
  format, or breaking flag changes.
- Man page or shell completion scripts, if the CLI is widely distributed.
