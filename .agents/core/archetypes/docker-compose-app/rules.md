# Rules — Docker Compose App

## Compose file layout

- Base `docker-compose.yml` holds shared service definitions; per-
  environment overrides layer on top (`.override.yml` for dev,
  `.prod.yml`/`.stage.yml` for real environments).
- Don't duplicate whole service blocks across files to change one field —
  use overrides for the delta only.

## Env files

- One `.env` per environment; never commit an actual `.env`.
- Commit `.env.example` with every variable name and a placeholder/comment,
  kept in sync whenever a variable is added or removed.
- `.env` (and any per-environment variant) must be in `.gitignore` and
  `.dockerignore` — a build context that includes `.env` can bake real
  values into an image layer even if the Dockerfile never references it.
- A service's `environment:`/`env_file:` keys may name config variables;
  they must never carry real secret values inline in the compose file —
  see `core/standards/configuration.md` and `core/standards/security.md`
  for the full config-type classification and secret-storage rules; not
  restated here.

## Volumes

- Named volumes for anything stateful (databases, message queues, uploaded
  files) — never a bind mount to a host path for production state.
- Bind mounts are for local dev only (live-reload source code, local config
  overrides).

## Networks

- Explicit named networks per logical boundary (e.g. `frontend`, `backend`,
  `data`) — don't leave every service on the default network if some of
  them shouldn't be able to reach each other.
- A service that doesn't need to reach the database directly shouldn't share
  its network.

## Health checks and startup order

- Every long-running service gets a `healthcheck:` block.
- Use `depends_on` with `condition: service_healthy` for startup ordering —
  plain `depends_on` only waits for container start, not readiness.

## Logs

- Set an explicit log driver with rotation (e.g. `json-file` with
  `max-size`/`max-file`) — unbounded local logs will fill disk on a long-
  running host.

## Backup and restore

- Every stateful service needs a documented backup procedure (what's backed
  up, how often, where it's stored) and a restore procedure that's actually
  been tested, not just written down.

## Claude and destructive actions

- Claude must never run `docker compose down -v`, a production deploy/
  restart, or an in-place data migration against a real environment without
  explicit human approval, and must always prefer a dry-run/config-check
  first (e.g. `docker compose config`, reviewing the rendered/merged config
  before applying it). This is enforced by
  `.claude/rules/devops/infra-rules.md` and `.claude/rules/security.md`,
  already installed in this project — the rules here are additive detail,
  not a replacement for those.

These are recommendations and review checks for this archetype, not
mandates — an existing project is not required to restructure to match them.
