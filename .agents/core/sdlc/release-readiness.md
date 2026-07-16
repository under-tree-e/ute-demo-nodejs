# Release Readiness

Canonical procedure behind the `release-readiness` skill.

## Purpose

Check whether a specific feature, PR, or project state is ready to release —
a go/no-go gate for one change, not an ongoing operational audit (see
`core/sdlc/production-readiness.md` for that).

## When to use

- Before merging a PR intended for release.
- Before cutting a release/tag.
- When asked "is this ready to ship."

## Inputs to inspect

- Feature folder (`acceptance-criteria.md` especially) if one exists
- Current diff/git status
- Test suite and results
- Docs (`docs/*.md`) for sync with the change
- Migration files / schema changes
- Config/env var changes
- Existing rollback plan (`core/sdlc/rollback-plan.md` output) if present
- Changelog/release notes location, if the project has one

## Process

1. Read the feature folder's acceptance criteria, if any, and check each one
   against the diff.
2. Check whether tests exist and pass for the change; note anything
   untested.
3. Check whether docs affected by the change (per
   `core/standards/documentation.md`) were updated.
4. Check migrations for backward compatibility and safe ordering.
5. Check config/env changes for anything requiring manual setup in target
   environments.
6. Check whether a rollback plan exists for anything stateful or
   production-impacting.
7. Scan the diff for accidental secrets/credentials exposure — do not print
   any values found, only flag the location.
8. Check whether changelog/release notes were updated where the project
   maintains them.
9. Check CI/CD pipeline ownership (gate below) — a release cannot pass
   without it.
10. Build a smoke-check list for after deployment.
11. Render a verdict.

## CI/CD ownership gate

Pipeline ownership must be clear before release — see
`core/standards/ci-cd.md`. One of the following must hold, or the verdict
cannot be a plain "ready":

- GitHub Actions via an approved `ute-ci-templates` reusable workflow, or
- Jenkins via an approved `ute-jenkins-library` shared library, or
- a documented project-specific exception (ADR or `risks.md` entry).

## Checklist

- lint/typecheck/tests/build completed by the approved CI path (not a local
  run standing in for CI, unless the project has no CI yet — flag that gap)
- artifact/image built immutably (versioned/tagged, not rebuilt-in-place at
  deploy time)
- deployment path documented (which tool/repo actually deploys —
  `ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`, or the project's
  documented equivalent)
- rollback documented (see `core/sdlc/rollback-plan.md`)
- release notes prepared
- docs synced (per `core/standards/documentation.md`)

## Expected outputs

A go/no-go verdict:

- **ready** — all criteria met, including the CI/CD ownership gate
- **ready-with-notes** — shippable, minor gaps listed
- **not-ready** — blocking items listed

With supporting detail: acceptance criteria status, test status, docs sync
status, migration/config risk, rollback plan status, secrets exposure
result, CI/CD ownership gate result, smoke checklist.

## Safety rules

- No code changes, no merging, no tagging, no deployment.
- If a suspected secret is found in the diff, flag its file/location only —
  never print or copy the value.
- Do not downgrade a blocking item to a note without stating why.

## Things not to do

- Don't mark "ready" when acceptance criteria can't be verified — mark
  not-ready or ready-with-notes instead.
- Don't write a full rollback plan here — check whether one exists and call
  out its absence; use `core/sdlc/rollback-plan.md` to produce it.
- Don't confuse this with `core/sdlc/production-readiness.md` — this is one
  change, not the system's ongoing operational posture.
- Don't return "ready" when pipeline ownership is undocumented — see the
  CI/CD ownership gate above.

## Final response format

- Verdict (ready / ready-with-notes / not-ready)
- Blocking items (if any)
- Notes (if any)
- Checklist results by category
