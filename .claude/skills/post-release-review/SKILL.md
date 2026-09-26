---
name: post-release-review
description: Capture what happened after a release and turn lessons into follow-up tasks and standards updates. Use shortly after a release/deployment has gone out, as the closing step of the SDLC loop.
---
# Post-Release Review

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/post-release-review/SKILL.md`, `adapters/codex/skills/post-release-review/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Capture what actually happened after a release and convert lessons into
concrete follow-ups — the closing stage of the SDLC loop, feeding back into
`feature-plan`.

## When to use

- Shortly after a release/deployment has gone out.
- After an incident tied to a recent release.
- Periodically for larger releases, even without an incident.

## Inputs

Feature folder(s) or PRs covered by the release, release notes, CI/CD run
logs and deployment records, monitoring/alerts/incident reports from the
release window, user/support reports, `release-readiness` output if it
exists.

## Process

1. Identify what was actually released (features, fixes, infra changes) and
   when.
2. Compare planned scope against what shipped — note deviations.
3. Check monitoring/alerts/incident reports for the release window.
4. Note what went well, with specifics, not generic praise.
5. Note what failed or was risky, and why — root cause where known,
   otherwise mark as open. Do not drop a failure because it was later
   fixed; record it and the fix.
6. Turn each issue into a concrete follow-up task (owner/skill to invoke).
   Do not implement follow-ups here.
7. Identify documentation left stale or inaccurate by the release.
8. Propose (don't make) any standards updates.

Focus on process and system causes; never assign blame to individuals.

## Required outputs

Release summary, what went well, what failed or was risky, follow-up tasks
ready for `feature-plan`, documentation updates needed, proposed standards
updates if any.

## Safety constraints

No code, infrastructure, or deployment changes. No direct edits to adapter
skills/rules or `.agents/core/` — propose changes only. Never read, print, or commit
secrets, including from incident logs or support tickets.

## References

- `feature-plan` — where follow-ups land
