---
name: rollback-plan
description: Create a rollback plan for a release, deployment, database migration, infrastructure change, or risky production-impacting change.
---
# Rollback Plan

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/rollback-plan/SKILL.md`, `adapters/codex/skills/rollback-plan/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Produce a practical, operationally clear rollback plan for a release,
deployment, database migration, infrastructure change, or risky
production-impacting change.

## Inputs

Change summary, affected systems, current backup/snapshot posture.

## Process

1. Write each required section below grounded in what the project actually
   has (backup tooling, deployment mechanism, data stores).
2. Prefer operational clarity over theory — concrete commands and steps over
   generic advice.
3. Apply `.agents/core/standards/release-versioning.md`'s rollback/hotfix
   expectations (patch/hotfix versioning, tagging) when the plan involves a
   release or hotfix.

## Required outputs

Change summary, affected systems, pre-change backup/snapshot requirements,
rollback trigger conditions, step-by-step rollback, data/state
considerations, verification after rollback, communication notes, risks and
limitations.

## Safety constraints

This skill produces a plan — it does not execute a rollback, backup, or
restore. Rollback execution belongs to deployment tooling
(`ansible`/`automation`/`infra`/`gitops`, or the owning CI/CD pipeline via
`ci-templates`/`jenkins-library`). Do not execute a production rollback
unless the user explicitly instructs it for this specific change and safe
tooling exists (dry-run support, a tested rollback command, non-production
target) — see `.agents/core/standards/ci-cd.md`. Absent both, hand the plan to a
human or the owning pipeline. Never read, print, or commit secrets.

## References

- `.agents/core/standards/git/releases.md`, `.agents/core/standards/git/tags.md` — release context
- `.agents/core/standards/ci-cd.md` — execution boundary and pipeline/tooling ownership
- `.agents/core/standards/release-versioning.md` — rollback/hotfix versioning and tagging
- `production-readiness` — the standing operational posture this plan assumes
