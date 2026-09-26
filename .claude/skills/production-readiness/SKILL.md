---
name: production-readiness
description: Assess a service/app's operational posture for production-like usage — health checks, logging, metrics, alerts, backup/restore, failure handling. Use for a periodic or pre-go-live operational check, not for gating a single change.
---
# Production Readiness

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/production-readiness/SKILL.md`, `adapters/codex/skills/production-readiness/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Assess whether a service/app is operationally safe for production-like
usage — the system's standing posture, independent of any single change.

## When to use

- Before a first production go-live.
- Periodic operational health check.
- When on-call/ops has raised reliability concerns.
- Not for a single PR — use `release-readiness` for that.

## Inputs

`docs/architecture.md`, `docs/environments.md`, `docs/operations.md`,
`docs/ci-cd.md` if present; health/readiness/liveness endpoints; logging,
metrics, tracing, and alerting configuration; backup/restore scripts,
schedules, and last-verified restore; resource limits; dependency update
process (Renovate/Dependabot config, lockfile age); security headers, rate
limiting, auth on public endpoints; migration strategy; existing runbooks.

## Process

1. Health/readiness/liveness endpoints — what they actually verify.
2. Logging — structured format, levels, enough context on errors.
3. Metrics — whether latency, error rate, and saturation of key paths are
   covered.
4. Tracing, if the architecture spans multiple services.
5. Alerting — alerts exist for the failure modes that matter and are
   actionable.
6. Backup/restore — existence, schedule, and evidence of a tested restore.
7. Resource limits — set at all vs. unbounded.
8. Dependency update strategy — automated vs. manual, lockfile staleness.
9. Security headers/rate limits on public endpoints, where relevant.
10. Migration strategy — safe under rollout and rollback.
11. Deployment observability — a deploy's success/failure and effect are
    visible (deploy markers, deploy events in logs), not inferred later.
12. CI/CD and deployment automation ownership documented in `docs/ci-cd.md`
    (`.agents/core/standards/ci-cd.md`) — undocumented ownership is a risk on its
    own.
13. Walk through 2-3 plausible failure scenarios (dependency down, disk
    full, bad deploy): what happens, whether a rollback path exists, and
    who/what executes it.
14. Identify runbook gaps — failure scenarios with no documented response.

Don't recommend specific vendor tools unless the project already uses
something comparable.

## Required outputs

Overall posture summary (one paragraph); findings by area (health checks,
logs, metrics, tracing, alerts, backup/restore, resource limits, dependency
strategy, security posture, migration strategy, deployment observability,
failure/rollback path, CI/CD and deployment automation ownership); failure
scenario walkthrough; prioritized operational risks; runbook gaps.

## Safety constraints

No code, config, or infrastructure changes. No deployment, restart, or
destructive actions — assess evidence of backup/restore/failover, never run
one. Never read, print, or commit secrets, including from env files or
secret managers.

## References

- `release-readiness` — the per-change counterpart (do not confuse the two)
- `.agents/core/standards/ci-cd.md` — CI/CD and deployment automation ownership
- `.agents/core/standards/observability.md` — logging/metrics expectations
