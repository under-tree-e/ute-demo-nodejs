---
name: rollback-plan
description: Create a rollback plan for a release, deployment, database migration, infrastructure change, or risky production-impacting change.
---
# UTE Rollback Plan

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/rollback-plan/SKILL.md`, `adapters/codex/skills/rollback-plan/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/rollback-plan.md`. Read it before running
this skill.

## Goal

Produce a practical, operationally clear rollback plan.

## Inputs

Change summary, affected systems, current backup/snapshot posture.

## Process

1. Read `.agents/core/sdlc/rollback-plan.md`.
2. Write each required section (see below) grounded in what the project
   actually has (backup tooling, deployment mechanism, data stores).
3. Prefer operational clarity over theory — concrete commands/steps over
   generic advice.
4. Apply `.agents/core/standards/release-versioning.md`'s rollback/hotfix
   expectations (patch/hotfix versioning, tagging) when the plan involves
   a release or hotfix.

## Required outputs

Change summary, affected systems, pre-change backup/snapshot requirements,
rollback trigger conditions, step-by-step rollback, data/state
considerations, verification after rollback, communication notes, risks and
limitations.

## Safety constraints

This skill produces a plan — it does not execute a rollback, backup, or
restore. Rollback execution belongs to deployment tooling
(`ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`, or the owning
CI/CD pipeline), not to this skill. Do not execute a production rollback
unless the user explicitly instructs it for this specific change and safe
tooling exists (dry-run support, a tested rollback command, non-production
target) — see `.agents/core/standards/ci-cd.md`. Never read, print, or commit
secrets.

## References

- `.agents/core/sdlc/rollback-plan.md` — full process
- `.agents/core/standards/git/releases.md`, `.agents/core/standards/git/tags.md` — release context
- `.agents/core/standards/ci-cd.md` — execution boundary and pipeline/tooling ownership
- `.agents/core/standards/release-versioning.md` — rollback/hotfix versioning and tagging expectations

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
