---
name: change-audit
description: Independently audit implemented changes against a feature folder/spec. Use after implementation or when the user asks to review/check/audit another agent's changes.
---
# UTE Change Audit

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/change-audit/SKILL.md`, `adapters/codex/skills/change-audit/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/change-audit.md`. Read it before running
this skill.

## Goal

Independently audit a diff against feature intent. Do not fix code during
this skill unless explicitly requested.

## Inputs

Feature folder, current git diff/status, acceptance criteria.

## Process

1. Read `.agents/core/sdlc/change-audit.md` and the feature folder.
2. Inspect the diff; check each acceptance criterion.
3. Check security, compatibility, tests, docs, deployment, and rollback
   risk using `.agents/core/standards/git/code-review.md`.
4. Check the diff against the "Forbidden Patterns" and "Agent Must Not
   Do" sections of every applicable `.agents/core/standards/*` file (e.g.
   `security.md`, `ci-cd.md`, `testing.md`, `git/*`) — not only the
   feature's acceptance criteria. A change can satisfy every acceptance
   criterion and still violate a standard's forbidden patterns.
5. Write findings as actionable tasks with severity.
6. Render a verdict: pass, pass with notes, needs fixes, or blocked.

## Required outputs

Summary, what was checked, findings by severity, missing tests/checks,
documentation gaps, deployment/rollback risks, final verdict.

## Safety constraints

No code changes in this skill unless explicitly requested. Never read,
print, or commit secrets found in the diff.

## References

- `.agents/core/sdlc/change-audit.md` — full process
- `.agents/core/standards/git/code-review.md` — review checklist
- `.agents/core/standards/*` — check each applicable file's "Forbidden Patterns"
  and "Agent Must Not Do" sections against the diff (see
  `docs/standards-to-agent-guidance.md` for how standards map to skills)

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
