---
name: release-readiness
description: Check whether a feature, PR, or project is ready for release — acceptance criteria, tests, docs, migrations, rollback, secrets exposure. Use before merging/releasing a specific change, not for ongoing production posture.
---
# Release Readiness

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/release-readiness/SKILL.md`, `adapters/codex/skills/release-readiness/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Go/no-go gate for one feature, PR, or release — not the system's ongoing
operational posture (that is `production-readiness`).

## When to use

- Before merging a PR intended for release.
- Before cutting a release/tag.
- When asked "is this ready to ship."

## Inputs

Open feature folder (`spec.md` acceptance criteria), current diff/git
status, test results, `docs/*.md`, migrations/schema changes, config/env
changes, existing rollback plan, release notes location.

## Process

1. Check each acceptance criterion against the diff.
2. Check tests exist and pass for the change; note anything untested.
3. Check docs affected by the change were updated
   (`.agents/core/standards/documentation.md`).
4. Check migrations for backward compatibility and safe ordering.
5. Check config/env changes for manual setup needed in target environments.
6. Check a rollback plan exists for anything stateful or
   production-impacting; if missing, call it out (produce it with
   `rollback-plan`, not here).
7. Scan the diff for accidental secrets — flag the location only, never
   print the value.
8. Check release notes were prepared where the project keeps them
   (`.agents/core/standards/release-versioning.md`).
9. Apply the CI/CD ownership and release versioning gates below.
10. Build a post-deploy smoke-check list.
11. Render a verdict. Don't mark "ready" when acceptance criteria can't be
    verified, and don't downgrade a blocking item to a note without saying
    why.

## CI/CD ownership gate

Pipeline ownership must be clear before release (`.agents/core/standards/ci-cd.md`):
GitHub Actions via an approved `ci-templates` reusable workflow, Jenkins via
an approved `jenkins-library` shared library, or a documented
project-specific exception (an entry in the `docs/architecture.md` "Exceptions" section, see
`.agents/core/standards/knowledge-governance.md`). Absent one of these, do not
return a plain "ready" verdict.

## Release versioning gate

Apply `.agents/core/standards/release-versioning.md` before returning "ready": tags,
RC tags, SemVer compliance, and the release-from-main-only rule.

## Checklist

- lint/typecheck/tests/build completed by the approved CI path (not a local
  run standing in for CI, unless the project has no CI yet — flag that gap)
- artifact/image built immutably (versioned/tagged, not rebuilt at deploy
  time)
- deployment path documented (which tool/repo actually deploys)
- rollback documented
- release notes prepared
- docs synced
- versioning/tagging complies with `.agents/core/standards/release-versioning.md`

## Required outputs

Verdict (ready / ready-with-notes / not-ready), blocking items, notes,
checklist results by category — acceptance criteria, tests, docs,
migration/config risk, rollback plan, secrets scan, CI/CD ownership gate,
smoke checklist.

## Safety constraints

No code changes, no merging, no tagging, no deployment. Never print or copy
a suspected secret value.

## References

- `rollback-plan` — produces the rollback plan this checks for
- `.agents/core/standards/ci-cd.md` — CI/CD ownership gate
- `.agents/core/standards/release-versioning.md` — release versioning gate
