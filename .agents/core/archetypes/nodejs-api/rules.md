# Rules — Node.js API

## Config validation

- Validate all required environment variables at startup (schema-based —
  e.g. `zod`/`joi`/`envalid` — not ad hoc `if (!process.env.X)` checks
  scattered through the codebase).
- Fail fast: the process should refuse to start with a clear error rather
  than run with missing/invalid config and fail later at request time.
- Access configuration only through the centralized config layer
  (`src/config/`). `process.env.*` reads scattered anywhere else in the
  codebase are a forbidden pattern — reroute them through config, add a
  new typed field if needed, don't inline a new `process.env.X` read to
  save time.
- Make config values typed and give required values explicit validation;
  make defaults explicit rather than relying on implicit `undefined`
  fallbacks.
- Never log secrets from config; never commit production config values to
  the repository.

## Layering and business logic placement

- Business logic belongs in `services/` (or a module's service file), not
  in routes/controllers. Controllers accept the request, call a service,
  and return the response — they don't contain decision logic themselves.
- Database access goes through the repository layer; calls to external
  systems go through the integration layer (`src/integrations/` — clients/
  adapters, provider SDKs initialized only there). A service should not
  call a provider SDK directly or run a query itself.
- `core/`/`middlewares/` is for technical, domain-agnostic code (errors,
  logging, http helpers, security helpers). Domain/business-specific logic
  (e.g. a `users` service) does not belong there — it belongs under
  `modules/` or the matching `services/`/`repositories/` folder.
- If the project uses `db/` for centralized connection setup, create the
  connection once there — not a separate connection per module. Keep
  migrations in the repo but separate from runtime business logic; keep
  seed/demo data separate from production data.

## Request validation

- Validate all external input (body, query, params, headers) at the
  boundary, before it reaches business logic — reuse the project's existing
  validation library rather than introducing a new one.
- Reject invalid input with a clear 4xx response; don't let malformed input
  reach the service/repository layer.

## Error handling

- Centralize error handling in one place (error-handling middleware / global
  exception filter), not repeated try/catch-and-format in every route.
- Never leak internal error details (stack traces, SQL errors, file paths)
  to API responses. Map internal errors to safe, generic client-facing
  messages.
- Distinguish operational errors (expected — validation, not found, auth)
  from programmer errors (bugs) in how they're logged and reported.

## Logging

- Structured logging (JSON or a consistent structured format), not raw
  `console.log`.
- Never log secrets, tokens, passwords, or full PII payloads. Redact or omit
  sensitive fields before logging request/response bodies.
- Include enough context (request id, route, status) to trace a request
  without needing to reproduce it.

## Health checks

- Expose a health/readiness endpoint (e.g. `/health`) that doesn't require
  auth and reflects real dependency status (DB reachable, etc.) where
  practical — not just "process is up."

## API docs

- Keep API documentation (OpenAPI spec or a README section) close to the
  routes it describes, and update it in the same PR as a contract change —
  not as a separate, easily-forgotten follow-up.

## Forbidden directory patterns

- No chaotic catch-all `utils/`: a `utils/`/`helpers/` folder is fine only
  with a clear, stated boundary (e.g. "pure string/date helpers, no
  business logic"); it must not become a dumping ground for unrelated code
  that doesn't fit elsewhere. If it's accumulating domain-specific logic,
  move that logic into the owning module/service instead.
- No single global `controllers/`+`services/` pair standing in for module
  boundaries on a project that's otherwise organized by domain — pick
  layer-first or module-first (see `structure.md`) and stay consistent.
- No `misc/`, `tmp/`, `temp/`, `new/`, `final/`, `other/`, `stuff/`
  directories — these signal an unresolved structure decision, not a real
  boundary; find (or create) the folder that actually owns the code.

## CI/CD expectations

Use dedicated CI/CD templates from approved repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
instead of hand-rolling build/test/deploy pipeline logic in this repo.
Document the selected delivery model in `docs/ci-cd.md` — see
`core/standards/ci-cd.md`.

---

These are recommendations and checks for this archetype, not mandates. An
existing project that already works differently is not required to
restructure to match.
