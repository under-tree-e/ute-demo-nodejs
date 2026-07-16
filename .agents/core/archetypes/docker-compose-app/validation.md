# Validation — Docker Compose App

## Before proposing a change

- `docker compose config` (with the right `-f` combination for the target
  environment) to render and review the merged config before anything runs.
- Build and start the stack locally/in a disposable environment before
  proposing it for stage/prod.

## CI/CD expectations

- CI builds images from this repo's Dockerfiles and scans them
  (vulnerability scan) before push to a registry.
- Image tags are immutable (commit SHA or semver, not floating `latest`) for
  anything deployed to stage/prod.
- Deploys pull a specific tag and run `docker compose up -d` (or equivalent)
  behind a manual approval gate for prod — no auto-deploy of every merge
  straight to prod.

## Common risks

- Floating `latest` tags causing an unreviewed image change on a routine
  restart.
- `docker compose down -v` (or manual volume deletion) destroying stateful
  data with no recent backup.
- Missing health checks causing the app service to start before its
  database is actually ready, producing flaky startup failures.
- Secrets baked into an image layer (e.g. copied `.env` at build time)
  instead of injected at runtime — see `core/standards/configuration.md`
  and `core/standards/security.md` for where secrets may actually live.
- Orphaned containers/networks from renamed services accumulating over
  time — `docker compose down --remove-orphans` as part of a real redeploy,
  not just `up -d`.

## Backup/restore must be tested

A written backup procedure with no verified restore is not validated —
periodically confirm the restore procedure actually works against a copy of
the data, not just that the backup job runs.
