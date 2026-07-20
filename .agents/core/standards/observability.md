# Observability Standard

## Purpose

Define what must be observable (logs, metrics, traces, audit trail) so
production behavior — including security-sensitive actions — can be
debugged and reviewed after the fact. This file is a synthesized standard:
no dedicated Observability Standard source document exists yet. It draws
narrowly from the API & Integration Standard (logging/audit/retry
expectations for integrations) and the Security & Access Control Policy
(audit-log requirements). See Open Questions for what is intentionally
not covered.

## Applies To

- Any service, API, or integration adapter running in a shared,
  staging, or production environment.
- Security-sensitive operations: auth, permissions, secrets, production
  deploys, access grants/revocations, service-account/key changes.
- External/service-to-service integrations and webhook handlers.

## Does Not Cover

- Alerting rules, on-call/paging policy, SLIs/SLOs, error budgets — no
  source material grounds these; see Open Questions.
- Log storage/retention infrastructure, metrics backend, or tracing
  vendor choice — implementation detail, not a rule.
- CI/CD pipeline logs — see `core/standards/ci-cd.md`.
- API contract/error-format design — see `core/standards/api-integration.md`
  (planned; not yet present in this repo).
- Access-grant mechanics (roles, CODEOWNERS, service accounts) — see
  `core/standards/security.md`.

## Source Documents

- API & Integration Standard — logging, integration observability,
  webhook logging constraints, retry/idempotency behavior worth logging.
- Security & Access Control Policy — audit-log requirements for
  security-sensitive actions.

## Required Rules

- Anything worth debugging in production must emit logs, metrics, or
  traces — this restates and expands the Observability bullet in
  `core/standards/git/code-review.md`; reviewers check for it there, this
  file defines what "enough" means.
- Log requestId, userId/actorId, endpoint, method, status code, duration,
  provider name, external event id, error code, retry count, and
  environment for every integration call (API & Integration Standard).
- Do not log secrets, tokens, private keys, full authorization headers,
  payment card data, unneeded full personal data, provider secrets, or
  raw sensitive webhook bodies (API & Integration Standard).
- Do not log full sensitive webhook payloads; log enough to identify and
  dedupe the event (external event id), not the payload contents.
- Log an audit trail — minimally who, what, when, where, and the
  justifying ticket/reason — for every security-sensitive action:
  repo/admin permission changes, branch-protection changes, secrets
  changes, production deploys, tag creation/deletion, service-account
  changes, access grants/removals, CI/CD credential changes, permission
  escalation (Security & Access Control Policy).
- For production deploy/operation audit entries, additionally record
  release tag, commit SHA, operator, approval, environment, deployment
  result, and rollback status where the platform captures it (Security &
  Access Control Policy).
- Audit logs for security-sensitive actions must be available for
  incident response: revoke first, then use audit logs to identify
  affected repos/environments during investigation (Security & Access
  Control Policy incident-response sequence).
- Do not treat "we can add logging later" as acceptable for a
  security-sensitive operation or an external integration call — the
  logging/audit fields above are part of the operation's definition of
  done, not a follow-up.

## Recommended Rules

- Prefer structured (JSON) logs over free-text where the runtime/logging
  library supports it, so requestId/userId/errorCode fields above are
  queryable.
- Correlate a single logical operation (e.g. a webhook → job → external
  call chain) with one requestId/traceId propagated across the hops.
- Emit a metric (count/duration) for every external integration call in
  addition to the log line, so retry/timeout behavior is visible without
  reading logs.

## Forbidden Patterns

- Logging secrets, tokens, private keys, authorization headers, payment
  card data, or raw webhook bodies.
- Shipping an integration adapter, webhook handler, or security-sensitive
  operation with no logging/audit trail at all.
- Relying on application logs as a substitute for the audit-log fields
  required for security-sensitive actions (who/what/when/where/why).

## Agent Must Check

- Does a new/changed external integration call log the required fields
  (requestId, actor, endpoint, status, duration, provider, error code,
  retry count)?
- Does a new/changed security-sensitive operation (permission change,
  secret change, deploy, tag, service-account/key change, access
  grant/revoke) write an audit-log entry with who/what/when/where/why?
- Does any diff add a log statement that could contain a secret, token,
  auth header, payment data, or raw webhook body?
- Does the code-review Observability check (`core/standards/git/code-review.md`)
  pass for this change — i.e., is anything worth debugging in production
  actually observable?

## Agent Must Not Do

- Must not add a log line containing a secret, token, private key, full
  authorization header, payment card data, or raw sensitive webhook
  payload.
- Must not skip audit logging for a security-sensitive action on the
  grounds that it's "internal only" or "just for now."
- Must not invent alerting thresholds, SLOs, or paging rules and present
  them as an established standard — none are grounded in source
  material; flag as a gap instead (see Open Questions).

## Related Skills

- `production-readiness` — checks operational posture including
  logging/metrics/audit trail for a service.
- `devops-review` — flags missing observability in infra/deployment
  changes.
- `change-audit` — uses the code-review Observability check against a
  diff.

## Related Archetypes

- N/A — no archetype-specific observability overlays exist yet.

## Related Repositories

- `ute-ansible` / `ute-automation` / `ute-infra` / `ute-gitops` — own any
  log-shipping, metrics-backend, or tracing infrastructure; this standard
  defines what must be emitted, not how it is collected or stored.
- `ute-jenkins-library` / `ute-ci-templates` — own pipeline-level logging,
  out of scope here (see `core/standards/ci-cd.md`).

## Open Questions

- No dedicated Observability Standard source document exists — this file
  is synthesized narrowly from API/integration logging rules and the
  security audit-log policy; broader observability practice (structured
  logging conventions, trace propagation, dashboards) is not yet
  standardized.
- No alerting/paging policy is grounded in any source — do not add one
  without a source document or explicit user decision.
- No SLI/SLO/error-budget policy is grounded in any source — same
  caveat.
- No named owning repo/system is specified for where logs, metrics, or
  audit logs are actually stored/queried (e.g. a log aggregator, a SIEM,
  Vault audit device) — needs a decision or mapping to a repo.
- `core/standards/api-integration.md` is referenced here but does not yet
  exist in this repo as of this writing (see
  `features/F003-source-standards-ingestion/mapping.md`) — update this
  file's link/section once that standard lands.
