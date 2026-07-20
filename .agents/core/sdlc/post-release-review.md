# Post-Release Review

Canonical procedure behind the `post-release-review` skill.

## Purpose

Capture what actually happened after a release went out, and convert lessons
into concrete follow-ups — the closing stage of the SDLC loop (idea →
discovery → architecture review → feature plan → implementation → change
audit → test strategy → docs sync → release readiness → PR summary → CI/CD →
deployment → **post-release review**), feeding back into
`core/sdlc/feature-planning.md` for the next cycle.

## When to use

- Shortly after a release/deployment has gone out.
- After an incident tied to a recent release.
- Periodically for larger releases, even without an incident.

## Inputs to inspect

- The feature folder(s) covered by the release
- The PR summary / release notes
- CI/CD run logs and deployment records
- Monitoring/alerts/incident reports from the release window
- User/support reports, if any
- `core/sdlc/release-readiness.md` output for the release, if it exists

## Process

1. Identify what was actually released (features, fixes, infra changes) and
   when.
2. Compare planned scope (feature folder) against what shipped — note
   deviations.
3. Check monitoring/alerts/incident reports for the release window for
   anything that went wrong.
4. Note what went well (smooth rollout, caught issues pre-release, etc.)
   with specifics, not generic praise.
5. Note what failed or was risky, and why — root cause where known,
   otherwise mark as open.
6. Turn each issue into a concrete follow-up task (owner/stage to invoke,
   not just a complaint).
7. Identify documentation left stale or inaccurate by the release.
8. Identify whether this repo's own process (a skill, rule, or template)
   should change as a result — only propose this, don't edit the standards
   repo yourself.

## Expected outputs

- Release summary (what changed, when)
- What went well
- What failed or was risky
- Follow-up tasks (feed into feature planning for the next cycle)
- Documentation updates needed
- Standards updates to propose (skill/rule/template changes), if any

## Safety rules

- No code, infrastructure, or deployment changes.
- No direct edits to adapter skills/rules or `core/` standards files —
  propose changes, don't make them here.
- Never read, print, or commit secrets, including from incident logs or
  support tickets.

## Things not to do

- Don't assign blame to individuals — focus on process and system causes.
- Don't silently drop a failure because it was later fixed — record it and
  the fix.
- Don't implement the follow-up tasks in this stage — hand off to feature
  planning/implementation.

## Final response format

- Release summary
- What went well
- What failed or was risky
- Follow-up tasks (list, ready to feed into feature planning)
- Documentation updates needed
- Proposed standards updates (if any)
