# Change Audit

Canonical procedure behind the `change-audit` skill.

## Purpose

Independently audit implemented changes against a feature folder/spec — used
after implementation, or when asked to review/check/audit another agent's
changes. Do not fix code during this stage unless explicitly requested.

## Process

1. Read the feature folder.
2. Inspect current git diff/status.
3. Check each acceptance criterion.
4. Check security, compatibility, tests, docs, deployment, rollback, and
   operational risks (see `core/standards/git/code-review.md`).
5. Write findings as actionable tasks.
6. Produce a verdict: pass, pass with notes, needs fixes, or blocked.

## Audit output

- Summary
- What was checked
- Findings by severity
- Missing tests/checks
- Documentation gaps
- Deployment/rollback risks
- Final verdict
