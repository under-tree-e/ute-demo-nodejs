# Recommended Structure — Docker Compose App

This is a recommendation for new projects or major reorganizations, not a
requirement. Do not blindly restructure an existing compose setup that
already works differently — merging/splitting compose files touches how
every environment starts up, which is its own risky change.

```text
docker-compose.yml            # base: services, networks, healthchecks — shared
docker-compose.override.yml   # local dev overrides (bind mounts, debug ports)
docker-compose.prod.yml       # production overrides (resource limits, replicas)
.env.example                  # committed template of required variables
.env                          # actual per-environment values — never committed
services/
  <service-name>/
    Dockerfile
docs/
features/                     # feature folders (see feature-plan)
```

## Notes

- `docker-compose.override.yml` is picked up automatically by `docker
  compose up` for local dev; production/stage explicitly select
  `-f docker-compose.yml -f docker-compose.prod.yml`.
- A project with only one environment (e.g. a small self-hosted app with no
  separate stage) can collapse to a single `docker-compose.yml` plus
  `.env` — don't force a three-file split where one file already covers it.
- Per-service Dockerfiles live next to the service's own source, not
  centralized, unless the project already centralizes them.
