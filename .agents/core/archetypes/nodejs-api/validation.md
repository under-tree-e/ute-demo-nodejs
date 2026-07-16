# Validation — Node.js API

## Testing expectations

- Unit tests for services and validators (pure business logic, no I/O).
- Integration tests that hit real or realistic dependencies (a real test
  database/container, not just mocks) for repository and route-level
  behavior — mocks alone miss real query/schema bugs.
- Contract-level tests for critical endpoints covering success, validation
  failure, and auth failure paths, not just the happy path.
- Organize tests so it's clear what's being verified — unit vs integration
  vs e2e, and, if the project uses `modules/`, which module a test belongs
  to. Keep fixtures/test helpers separate from test logic rather than
  inlined in every test file.
- If the project has `src/jobs/` (cron/queue/worker code), test job logic
  separately from the HTTP request flow — a job's retry/error handling and
  a route handler's request/response cycle are different failure modes and
  shouldn't share test setup by accident.
- Never make tests depend on production credentials or real external
  provider accounts — integrations (`src/integrations/`) should be
  mockable/stubbable at the client boundary for tests.

## CI/CD expectations

- Lint, typecheck, and unit tests run on every PR.
- Integration tests run in CI against a disposable/test datastore
  (container or equivalent), not skipped because "it works locally."
- Migrations run and are verified against a clean database as part of CI,
  if the project uses them.
- Build/package step (Docker image, transpiled output) succeeds in CI
  before merge/deploy.

## Common risks

- Config drift between environments (dev/stage/prod) causing
  works-locally-fails-in-prod bugs — mitigated by startup config validation.
- Unhandled promise rejections/uncaught exceptions crashing the process
  without a clean shutdown or alert.
- N+1 queries or missing indexes surfacing only under real data volume,
  not caught by unit tests with mocked repositories.
- Secrets or PII leaking into logs or error responses.
- Migrations that aren't forward-only/reversible, making rollback of a bad
  deploy harder than it needs to be.
- Health check endpoint that always returns healthy regardless of real
  dependency state, masking outages from orchestration/monitoring.
- A background job (`src/jobs/`) with no retry/error handling failing
  silently — no log entry, no alert, no visibility that it stopped running.
  Destructive maintenance jobs (cleanup, bulk deletes) without extra
  safeguards (dry-run mode, confirmation, narrow scope) turning a bug into
  data loss.
- A per-module database connection instead of one centralized connection
  (`src/db/`) — harder to pool/tune correctly and can silently multiply
  connections under load.
- An external integration (`src/integrations/`) whose errors aren't
  normalized before reaching a service — callers end up branching on a
  specific provider SDK's error shape instead of a consistent internal
  error type.
- Scattered `process.env.*` reads outside the config layer making it hard
  to audit which env vars the app actually depends on, and easy to miss one
  during environment setup.
