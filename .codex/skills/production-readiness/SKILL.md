---
name: production-readiness
description: Assess a service/app's operational posture for production-like usage — health checks, logging, metrics, alerts, backup/restore, failure handling. Use for a periodic or pre-go-live operational check, not for gating a single change.
---
# UTE Production Readiness

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/production-readiness/SKILL.md`, `adapters/codex/skills/production-readiness/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/production-readiness.md`. Read it before
running this skill.

## Goal

Assess whether a service/app is operationally safe for production-like
usage — the system's standing posture, independent of any single change.

## Inputs

`docs/architecture.md`/`docs/environments.md`/`docs/operations.md`, health
endpoints, logging/metrics/tracing/alerting config, backup/restore evidence,
resource limits, dependency update process, existing runbooks.

## Process

1. Read `.agents/core/sdlc/production-readiness.md`.
2. Check health checks, logging, metrics, tracing, alerting, backup/restore
   evidence, resource limits, dependency strategy, security posture,
   migration strategy, deployment observability, failure/rollback path, and
   CI/CD and deployment automation ownership.
3. Walk through 2-3 plausible failure scenarios.
4. Identify runbook gaps.

## Required outputs

Overall posture summary, findings by area — including:

- healthchecks
- logs
- metrics
- alerts
- backups/restore
- resource limits
- deployment observability
- failure/rollback path
- ownership of CI/CD and deployment automation (`docs/ci-cd.md`, see
  `.agents/core/standards/ci-cd.md`)

— failure scenario walkthrough, prioritized operational risks, runbook
gaps.

## Safety constraints

No code, config, or infrastructure changes. No deployment, restart, or
destructive actions — assess evidence of backup/restore, don't perform one.
Never read, print, or commit secrets.

## References

- `.agents/core/sdlc/production-readiness.md` — full process
- `.agents/core/sdlc/release-readiness.md` — the per-change counterpart (do not confuse the two)
- `.agents/core/standards/ci-cd.md` — CI/CD and deployment automation ownership model
- `.agents/core/standards/observability.md` — operational logging/metrics expectations

## Required Final Output: Agent Run Report

Every run of this skill must end with:

### Agent Run Report

- Skill:
- Project type/archetype:
- Confidence: high / medium / low
- Inputs used:
- Applicable standards used:
- Missing inputs:
- Assumptions made:
- Project documentation gaps:
- UTE standards gaps:
- Recommended updates to `ute-agent-standards`:
- Items that belong to other UTE repositories:
- Follow-up questions, if any:
