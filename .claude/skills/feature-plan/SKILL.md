---
name: feature-plan
description: Create a compatible feature folder from an idea, change request, bug, refactor, documentation task, infrastructure task, or CI/CD task. Use before implementation when work needs planning, requirements, acceptance criteria, risks, and documentation impact.
---
# Feature Plan

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/feature-plan/SKILL.md`, `adapters/codex/skills/feature-plan/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/feature-planning.md`. Read it before running
this skill.

## Goal

Create or update a feature folder under `features/` from an idea/task/bug,
before implementation.

## Inputs

User idea/request, existing docs, existing code conventions, existing
feature folders.

## Process

1. Read `.agents/core/sdlc/feature-planning.md` in full.
2. Read project `CLAUDE.md`/`AGENTS.md` and relevant `docs/*.md`.
3. Inspect existing feature folders to follow naming/format.
4. Identify which `.agents/core/standards/*` files the proposed feature touches
   before drafting `implementation-plan.md` — e.g. config changes ->
   `.agents/core/standards/configuration.md`, auth/permissions ->
   `.agents/core/standards/security.md`, external API integration ->
   `.agents/core/standards/api-integration.md` (see other files in
   `.agents/core/standards/` for further matches: `ci-cd.md`, `testing.md`,
   `observability.md`, `release-versioning.md`, etc.). List the
   applicable standards in `implementation-plan.md` and let them shape
   the plan.
5. Write the six documents below using the starter shapes bundled with this
   skill in its own `templates/` directory (installed alongside
   `SKILL.md` — no separate opt-in step).
6. Mark assumptions and open questions explicitly. No code changes.

## Required outputs

```text
features/FXXX-short-name/
  feature.md
  requirements.md
  acceptance-criteria.md
  implementation-plan.md
  risks.md
  docs-impact.md
```

## Safety constraints

No code changes, no deployment actions, no secrets. Ask questions only if
implementation would be unsafe or materially ambiguous.

## References

- `.agents/core/sdlc/feature-planning.md` — full process
- `templates/` (this skill's own directory) — starter document shapes,
  installed automatically with this skill, same as any other skill file
- `.agents/core/standards/` — check for the specific standards implicated by the
  feature (e.g. `configuration.md`, `security.md`, `api-integration.md`,
  `ci-cd.md`, `testing.md`, `observability.md`, `release-versioning.md`)

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
- Standards gaps:
- Recommended updates to `ute-agent-standards`:
- Items that belong to other repositories:
- Follow-up questions, if any:
