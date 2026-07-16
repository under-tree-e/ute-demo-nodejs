---
name: post-release-review
description: Capture what happened after a release and turn lessons into follow-up tasks and standards updates. Use shortly after a release/deployment has gone out, as the closing step of the UTE SDLC loop.
---
# UTE Post-Release Review

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/post-release-review/SKILL.md`, `adapters/codex/skills/post-release-review/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/post-release-review.md`. Read it before
running this skill.

## Goal

Capture what actually happened after a release and convert lessons into
concrete follow-ups, feeding back into `feature-plan`.

## Inputs

Feature folder(s) covered by the release, PR summary/release notes, CI/CD
logs, monitoring/alerts/incident reports, `release-readiness` output if
it exists.

## Process

1. Read `.agents/core/sdlc/post-release-review.md`.
2. Compare planned scope vs. what shipped.
3. Check monitoring/incident reports for the release window.
4. Note what went well and what failed, with specifics.
5. Turn each issue into a concrete follow-up task.
6. Propose (don't make) any standards updates.

## Required outputs

Release summary, what went well, what failed or was risky, follow-up tasks,
documentation updates needed, proposed standards updates if any.

## Safety constraints

No code, infrastructure, or deployment changes. No direct edits to adapter
skills/rules or `.agents/core/` — propose changes only. Never read, print, or commit
secrets from incident logs/support tickets.

## References

- `.agents/core/sdlc/post-release-review.md` — full process
- `feature-plan` (`.agents/core/sdlc/feature-planning.md`) — where follow-ups land

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
