# Recommended Files — Node.js Worker

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in.
Add the following for a worker project:

## Required

- `docs/queues.md` — per-queue/topic message contract (schema, producer,
  expected volume), retry policy, and DLQ location.
- `docs/runbooks/dlq-replay.md` — step-by-step for inspecting and replaying
  dead-lettered messages; this is what an on-call engineer reaches for at
  2am, keep it concrete and copy-pasteable.

## Recommended

- `docs/environments.md` (from the base template) filled in with per-queue
  concurrency limits and connection settings per environment.
- `docs/observability.md` — where logs/metrics/traces land, key
  dashboards/alerts (throughput, failure rate, queue depth/lag).
- `.env.example` for broker connection settings — never commit real
  credentials.

## Situational

- `docs/adr/` for decisions on broker choice, retry/backoff strategy, or
  idempotency approach.
- `k8s/` or deployment manifests documenting graceful-shutdown timeout and
  `SIGTERM` handling expectations, if orchestrated.
