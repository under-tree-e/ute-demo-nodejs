---
name: implementation-pass
description: Implement an approved UTE feature folder. Use when the user points to a feature directory or asks to implement an existing feature plan/spec.
---
# UTE Implementation Pass

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/implementation-pass/SKILL.md`, `adapters/codex/skills/implementation-pass/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/implementation-pass.md`. Read it before
running this skill.

## Goal

Implement the feature described in `features/<feature>/` against its
reviewed plan.

## Inputs

`feature.md`, `requirements.md`, `acceptance-criteria.md`,
`implementation-plan.md`, `risks.md` and `docs-impact.md` when present, plus
relevant project docs and existing implementation patterns.

## Process

1. Read `.agents/core/sdlc/implementation-pass.md` in full and the feature folder.
2. Read the applicable `.agents/core/standards/*` files (e.g. `code-quality.md`,
   `security.md`, `testing.md`, `configuration.md`) and, if the project
   matches a known stack, its `.agents/core/archetypes/<type>/` files — not only
   the feature folder — before making changes.
3. Update the implementation plan checklist as work progresses.
4. Implement minimal safe changes, following existing conventions and the
   standards/archetype rules read above.
5. Add/update tests where practical; run validation commands.
6. Update docs per `.agents/core/sdlc/docs-sync.md` if behavior/architecture/config/
   deployment/operations changed.
7. Summarize changed files, validation run, risks, unresolved items.

## Required outputs

Code changes, updated implementation-plan checklist, a summary covering
changed files/validation/risks/unresolved items.

## Safety constraints

Do not broaden scope without noting it. No destructive commands. No
deployment unless explicitly requested. Never hide failed checks.

## References

- `.agents/core/sdlc/implementation-pass.md` — full process
- `.agents/core/sdlc/docs-sync.md` — docs-impact follow-up
- `.agents/core/standards/` — cross-cutting rules (code quality, security, testing,
  configuration, etc.) applicable regardless of feature; check before
  implementing
- `.agents/core/archetypes/<type>/` — stack-specific structure/rules/validation, if
  the project matches a known archetype

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
