---
name: release-readiness
description: Check whether a feature, PR, or project is ready for release — acceptance criteria, tests, docs, migrations, rollback, secrets exposure. Use before merging/releasing a specific change, not for ongoing production posture.
---
# UTE Release Readiness

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/release-readiness/SKILL.md`, `adapters/codex/skills/release-readiness/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/release-readiness.md`. Read it before
running this skill.

## Goal

Go/no-go gate for one change (not the system's ongoing operational
posture — see `production-readiness` for that).

## Inputs

Feature folder acceptance criteria, current diff, test results, docs,
migrations, config/env changes, existing rollback plan, changelog location.

## Process

1. Read `.agents/core/sdlc/release-readiness.md`.
2. Check acceptance criteria, test status, docs sync, migration/config
   risk, rollback plan status.
3. Check the CI/CD ownership gate — see below.
4. Scan the diff for accidental secrets — flag location only, never print
   values.
5. Build a post-deploy smoke-check list.
6. Render a verdict.

## CI/CD ownership gate

Pipeline ownership must be clear before release (`.agents/core/standards/ci-cd.md`):
GitHub Actions via `ute-ci-templates`, Jenkins via `ute-jenkins-library`, or
a documented project-specific exception. Absent one of these, do not return
a plain "ready" verdict.

## Release versioning gate

Apply `.agents/core/standards/release-versioning.md` explicitly before returning a
"ready" verdict: tags, RC tags, SemVer compliance, and the
release-from-main-only rule. Absent compliance, do not return a plain
"ready" verdict.

## Checklist

- lint/typecheck/tests/build completed by approved CI path
- artifact/image built immutably
- deployment path documented
- rollback documented
- release notes prepared
- docs synced
- versioning/tagging complies with `.agents/core/standards/release-versioning.md`

## Required outputs

Verdict (ready / ready-with-notes / not-ready), blocking items, notes,
checklist results by category (including the CI/CD ownership gate).

## Safety constraints

No code changes, no merging, no tagging, no deployment. Never print/copy a
suspected secret value.

## References

- `.agents/core/sdlc/release-readiness.md` — full process
- `.agents/core/sdlc/rollback-plan.md` — produces the rollback plan this checks for
- `.agents/core/standards/ci-cd.md` — CI/CD ownership gate this checks against
- `.agents/core/standards/release-versioning.md` — release versioning gate this
  checks against (tags, RC tags, SemVer, release-from-main-only)

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
