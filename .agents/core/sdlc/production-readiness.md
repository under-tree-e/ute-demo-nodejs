# Production Readiness

Canonical procedure behind the `production-readiness` skill.

## Purpose

Assess whether a service/app is operationally safe for production-like
usage — a broader, longer-lived check of the system itself, independent of
any single change.

## When to use

- Before a first production go-live.
- Periodic operational health check.
- When on-call/ops has raised concerns about a service's reliability.
- Not for checking a single PR — use `core/sdlc/release-readiness.md` for
  that.

## Inputs to inspect

- `docs/architecture.md`, `docs/environments.md`, `docs/operations.md`,
  `docs/ci-cd.md` if present
- Health check / readiness / liveness endpoints
- Logging configuration and structured-log coverage
- Metrics/dashboards configuration
- Tracing setup, if the stack uses distributed tracing
- Alerting rules/configuration
- Backup/restore scripts, schedules, and last-verified restore
- Resource limits (container/pod CPU/memory limits, connection pool sizes)
- Dependency versions and update process (renovate/dependabot config,
  lockfile age)
- Security headers, rate limiting, auth on public endpoints
- Migration strategy for schema/data changes
- Any existing runbooks

## Process

1. Check for health/readiness/liveness endpoints and what they actually
   verify.
2. Check logging: structured format, log levels, whether errors carry
   enough context.
3. Check metrics: what's exported, whether key paths (latency, error rate,
   saturation) are covered.
4. Check tracing, if the architecture spans multiple services.
5. Check alerting: whether alerts exist for the failure modes that matter,
   and whether they're actionable.
6. Check backup/restore: existence, schedule, and evidence of a tested
   restore.
7. Check resource limits and whether they're set at all vs. unbounded.
8. Check dependency update strategy (automated tooling vs. manual, lockfile
   staleness).
9. Check security headers/rate limits on public-facing endpoints, where
   relevant.
10. Check migration strategy for safety under rollback/rollout.
11. Check deployment observability — can a deploy's success/failure and its
    effect on the running system actually be seen (deploy markers on
    dashboards, deploy events in logs), not just inferred after the fact.
12. Check that CI/CD and deployment automation ownership is documented
    (`docs/ci-cd.md` — GitHub Actions via `ute-ci-templates`, Jenkins via
    `ute-jenkins-library`, or a documented exception; deployment execution
    via `ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`) — see
    `core/standards/ci-cd.md`. Undocumented ownership is an operational risk
    in its own right, independent of the pipeline's technical quality.
13. Walk through 2-3 plausible failure scenarios (dependency down, disk
    full, bad deploy) and note what happens, including whether a rollback
    path exists and who/what executes it.
14. Identify runbook gaps — failure scenarios with no documented response.

## Expected outputs

- Findings per area: health checks, logging, metrics, tracing, alerts,
  backup/restore, resource limits, dependency strategy, security posture,
  migration strategy, deployment observability, failure/rollback path,
  CI/CD and deployment automation ownership
- Failure scenario walkthrough
- Runbook gaps
- Prioritized list of operational risks

## Safety rules

- No code, config, or infrastructure changes.
- No deployment, restart, or destructive actions — do not trigger a real
  backup/restore/failover test.
- Never read, print, or commit secrets, including from env files or secret
  managers.

## Things not to do

- Don't test a backup/restore by actually running it — assess the evidence
  of one, don't perform one.
- Don't conflate this with `core/sdlc/release-readiness.md` — that's a
  per-change gate, this is the system's standing posture.
- Don't recommend specific vendor tools unless the project already uses
  something comparable.

## Final response format

- Overall posture summary (one paragraph)
- Findings by area
- Failure scenario walkthrough
- Prioritized operational risks
- Runbook gaps
