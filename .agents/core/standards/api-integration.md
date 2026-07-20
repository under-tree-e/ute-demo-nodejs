# API & Integration Standard

## Purpose

Define mandatory and recommended rules for designing, implementing, and
maintaining API endpoints, contracts, and integrations (backend APIs,
frontend-backend contracts, SDKs, webhooks, service-to-service and external
provider integrations) so that APIs are stable, secure, and safe to evolve.

## Applies To

- Public APIs (external consumers).
- Internal APIs (service-to-service within this platform).
- Frontend-facing APIs (backend serving this platform's frontend).
- Admin APIs.
- SDK/client-library APIs.
- Webhook receivers and senders.
- External provider integrations (payment, email/SMS, third-party services).

## Does Not Cover

- Backend repo structure — see `core/archetypes/nodejs-api/structure.md`.
- Git/PR/CI-CD rules — see `core/standards/git/`, `core/standards/ci-cd.md`.
- Jenkinsfile/pipeline templates — owned by `ute-jenkins-library`/`ute-ci-templates`, not this repo (see `core/standards/ci-cd.md`).
- Secrets storage mechanics (vaults, secret managers) — see `core/standards/security.md`.
- Repo naming and package publishing — see relevant archetype/tooling docs.
- Test-planning process — see `core/sdlc/test-strategy.md`.
- Logging/metrics/tracing implementation — see observability guidance under `core/sdlc/production-readiness.md` (no dedicated `core/standards/observability.md` exists yet; see Open Questions).

## Source Documents

- API & Integration Standard (internal standard; naming, HTTP methods,
  request/response shape, error format, status codes, validation,
  authorization, pagination, versioning, DTOs/mappers, integration
  adapters, secrets/config, timeouts/retries/idempotency, webhooks,
  logging, documentation, testing, breaking-change governance).

## Required Rules

**Type and ownership**

- Determine the API/integration type — public, internal, frontend, admin,
  SDK, webhook receiver, webhook sender, external provider, or
  service-to-service — before implementation; type determines security,
  testing, and documentation rules.
- Assign every API or integration a single owner responsible for contract
  accuracy, validation rules, error format, security/permissions, backward
  compatibility, documentation, test coverage, breaking-change release
  notes, and consumer communication.

**Naming and HTTP methods**

- Use nouns and plural resource names for endpoint paths.
- Use lowercase (kebab-case where needed) for paths; do not mix naming
  styles.
- Do not expose internal table names in endpoint paths unless that is the
  intended public contract.
- Choose the HTTP method to match operation intent (GET/POST/PUT/
  PATCH/DELETE per their defined semantics).
- Do not change server state via GET requests.
- Treat DELETE as requiring care for destructive/soft-delete operations.

**Request validation**

- Accept only explicitly allowed request fields, checked by a validation
  layer or resource policy; reject wildcard/unlisted fields.
- Do not pass frontend query parameters directly into database queries.
- Require a permission check before accepting fields like `role`,
  `ownerId`, or `status` from a request.
- Do not allow clients to set internal/system fields.
- Do not trust frontend-side validation as a substitute for backend
  validation.
- Validation must check: required fields, allowed fields, types, string
  length, enums, number ranges, date formats, email/URL formats, nested
  objects, array limits, file limits, and applicable business constraints.
- Validation must not trust the frontend, must not allow unknown fields
  without justification, must not perform database mutation itself, and
  must not bypass/hide permission checks.

**Authorization**

- Check authentication, role, permission, resource ownership,
  tenant/client boundary, environment boundary, and action-specific policy
  for every API call — authentication alone does not imply authorization.
- Do not check only `isAuthenticated` as the sole authorization gate.
- Do not rely on frontend hiding of UI elements as an authorization
  control.
- Do not accept `ownerId` (or similar) from the request body without
  independently verifying it.
- Do not allow role escalation via request body fields.
- Do not allow access to other users' resources via ID guessing — enforce
  ownership/permission checks.

**Response shape and error format**

- Ensure API responses are stable, predictable, and never leak private/
  internal fields.
- Do not return password hashes, internal tokens, service credentials,
  private provider payloads, unneeded internal audit fields, or full
  database entities without going through a mapper.
- Use the same error response format (`code`, `message`, `details`,
  `requestId`) across all endpoints.
- Do not leak internal error details (e.g. raw SQL/database errors) to
  API consumers.
- Map HTTP status codes to result category; use `error.code` to convey
  the exact reason.

**Pagination, filtering, sorting**

- Define a default page-size limit and enforce a maximum limit on list
  endpoints.
- Whitelist allowed filter fields and allowed sort fields; do not pass
  filters directly into database queries.
- Do not expose sensitive fields for filtering/sorting without a clear
  need.

**Versioning and breaking changes**

- Introduce API versioning when the API has external or independent
  consumers and breaking changes are unavoidable.
- Treat as breaking: field removal, field type change, field meaning
  change, error-format change, auth/permission behavior change, endpoint
  removal, required-field changes.
- A breaking change must be explicitly described in the PR, approved by
  the owner, accompanied by migration notes and release notes,
  version-bumped if the API/package is versioned, communicated to
  consumers, and paired with a rollback or compatibility plan before
  release.

**DTOs and mappers**

- API response DTOs must not be the raw database model; map database
  entities to response DTOs via a mapper, and map request DTOs to service
  input via validation.

**Integration adapters and config/secrets**

- Isolate each external integration in a dedicated integration adapter
  rather than spreading provider logic across services/controllers.
- Do not let business services depend on provider-specific details beyond
  what is necessary.
- Separate public config, environment config, and secrets for
  integrations (secrets storage mechanics: see `core/standards/security.md`).
- Do not commit secrets; `.env.example` files must contain only keys, not
  real values.
- Do not use production credentials locally.
- Read provider config through a config layer, not ad hoc.
- Do not log secrets.
- Keep sandbox and production credentials separated.

**Reliability — timeouts, retries, idempotency**

- Apply a timeout to every external API call so it cannot hang
  indefinitely.
- Do not retry a mutation-causing external call without an idempotency
  mechanism.
- Use an idempotency key (`Idempotency-Key`, `operationId`, or
  `requestId`) for mutating external calls.
- Do not retry payment charges, order creation, other irreversible
  provider actions, or email/SMS sends without an idempotency key.

**Webhooks**

- Verify webhook signatures before trusting webhook payloads.
- Do not accept a webhook without signature verification.
- Do not perform payment/order mutations from a webhook without
  idempotency protection.
- Handle duplicate webhook delivery (store external event id, dedupe).
- Respond to webhooks quickly; move heavy processing to a queue/job
  rather than long synchronous handling.
- Do not log full sensitive webhook payloads.

**Logging**

- Do not log passwords, tokens, private keys, full authorization headers,
  payment card data, unneeded full personal data, provider secrets, or
  raw sensitive webhook bodies (full logging field set: see
  `core/sdlc/production-readiness.md` / observability guidance, not
  restated here).

**Documentation and testing**

- API documentation must describe the contract (endpoint, method, auth
  requirements, permissions, request/response shape, error codes,
  pagination/filtering, examples, breaking changes, webhooks), not
  internal implementation.
- API tests must cover, at minimum: successful request, validation error,
  unauthorized, forbidden, not-found, critical business case, mapper
  output, error format, and pagination/filtering (for list endpoints).
  Full test-planning process: see `core/sdlc/test-strategy.md`.
- Integration tests must cover: provider request mapping, provider
  response mapping, provider error mapping, timeout behavior, retry
  behavior, webhook signature verification, and duplicate webhook events.

**Frontend contract dependency**

- Frontend code must depend only on documented DTOs, the API client/SDK,
  generated types, and the stable response shape — not on internal
  backend/database structure.
- Frontend must not know database table names, use private/internal
  fields, build arbitrary database queries, expect undocumented fields,
  or independently decide security rules.
- If backend exposes a dynamic/resource-style API, it must still enforce
  whitelisted fields, allowed filters, allowed actions, a permission
  policy, a response mapper, and a documented resource contract.

## Recommended Rules

- Apply a stricter contract for public/external API boundaries; internal
  boundaries should still be documented but may evolve faster.
- Use path-based versioning (`/api/v1/...`) or header-based versioning
  (`Accept: application/vnd.company.v1+json`) for public APIs; internal
  API versioning can be simpler as long as breaking changes are agreed
  upon.
- Treat adding an optional field, adding a new endpoint, adding a new
  optional filter, or extending an enum (when consumers tolerate unknown
  values) as non-breaking changes.
- Set default external request timeouts in the 5-15 second range, with
  explicitly configured timeouts for critical providers.
- Allow retries for network timeouts, 502/503/504 responses, and rate
  limiting with backoff, and for idempotent operations.
- Provide contract tests for public/SDK APIs.
- Verify webhook timestamps when the provider supports it, in addition to
  signature verification.

## Forbidden Patterns

- Performing mutations via GET requests.
- Shipping an API without validation.
- Shipping an API without permission checks.
- Returning a database entity directly instead of through a mapper/DTO.
- Returning password hashes, tokens, or other private fields in API
  responses.
- Accepting arbitrary filter fields without a whitelist.
- Passing frontend query parameters directly into database queries.
- Using a different error format on different endpoints.
- Logging secrets or authorization headers.
- Making an external API call with no timeout.
- Retrying a payment or order mutation without an idempotency mechanism.
- Accepting a webhook without signature verification.
- Embedding provider-specific logic directly in a controller instead of
  an integration adapter.
- Including secrets in integration documentation or config examples.
- Shipping a breaking change without release notes or owner approval.
- Making frontend code depend on internal database fields.

## Agent Must Check

- Endpoint naming is clear and matches convention.
- HTTP method matches operation intent.
- Request validation is present and whitelists fields.
- Permissions/ownership are checked, not just authentication.
- Response DTO is not the raw DB model; private fields are not returned.
- Error format and status codes are standard.
- Pagination/filtering/sorting are whitelisted where applicable.
- External integrations are isolated in an adapter, have a timeout, and
  use safe or disabled retries.
- Webhooks verify signatures and handle duplicate delivery.
- Secrets are not logged or present in docs/config examples.
- Breaking changes are documented, owner-approved, and have migration/
  rollback notes.
- Docs and tests are updated for any contract change.

## Agent Must Not Do

- Must not author or copy pipeline YAML/Groovy/Jenkinsfile content into
  this repo or a consuming API's docs — that belongs to
  `ute-ci-templates`/`ute-jenkins-library` (see `core/standards/ci-cd.md`).
- Must not generate an API endpoint that skips validation or permission
  checks as a shortcut.
- Must not treat an internal API as exempt from documentation just
  because it has no external consumers.
- Must not silently mark a breaking change as non-breaking to avoid the
  approval step.
- Must not add retry logic to a mutating external call without also
  adding or confirming an idempotency mechanism.

## Related Skills

- `core/sdlc/architecture-review.md` — review contract/integration design
  before major API changes.
- `core/sdlc/test-strategy.md` — plan API/integration test coverage.
- `core/sdlc/change-audit.md` — audit a diff against this standard.
- `core/sdlc/release-readiness.md` — gate breaking-change releases.
- `core/sdlc/docs-sync.md` — keep API docs in sync with contract changes.

## Related Archetypes

- `core/archetypes/nodejs-api/` — primary backend-API archetype; apply
  this standard alongside its `rules.md`/`structure.md`/`validation.md`.
- `core/archetypes/nodejs-worker/` — for consumers that call external
  providers/webhooks from a worker process.
- `core/archetypes/angular-app/`, `core/archetypes/angular-library/` —
  frontend consumers; apply the "Frontend contract dependency" rules
  above.

## Related Repositories

- `ute-ci-templates` / `ute-jenkins-library` / `ute-jenkins` — own any
  pipeline that builds/tests/publishes an API or SDK; this standard does
  not define that pipeline (see `core/standards/ci-cd.md`).
- `ute-ansible` / `ute-automation` / `ute-infra` / `ute-gitops` — own
  deployment of the services that implement these APIs.

## Open Questions

- No dedicated `core/standards/observability.md` exists yet; logging
  field requirements currently live only under `core/sdlc/
  production-readiness.md`. Confirm whether a standalone observability
  standard should be created and have this document point to it instead.
- No documented process for how an API owner is assigned or transferred,
  or what happens operationally when an API is found to have no owner.
- Internal API breaking changes "must be agreed upon" per source
  material, but the agreement mechanism (who approves, what forum) is
  unspecified — may need a decision or explicit pointer to the
  breaking-change process.
- No concrete rate-limiting policy, defaults, or 429 backoff strategy is
  defined beyond mentioning it conditionally.
- No stated ownership for OpenAPI/schema-generation tooling or how
  generated types/SDKs referenced in the frontend-contract section are
  produced and kept in sync.
- No required webhook signature algorithm/standard or key-rotation policy
  is specified; left to provider specifics.
