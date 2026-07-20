---
name: docs-sync
description: Check whether documentation must be updated after code, infrastructure, deployment, CI/CD, API, configuration, or behavior changes. Use near the end of a task or before PR creation.
---
# Docs Sync

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/docs-sync/SKILL.md`, `adapters/codex/skills/docs-sync/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/docs-sync.md`. Read it before running this
skill.

## Goal

Review current changes and update documentation when needed.

## Inputs

Current git diff, existing `docs/*.md`.

## Process

1. Read `.agents/core/sdlc/docs-sync.md`, `.agents/core/standards/documentation.md` (what a
   doc must answer), and `.agents/core/standards/repository.md` (repo-level docs
   expectations — where docs should live, structure).
2. Inspect the diff and identify affected docs (product behavior,
   architecture, environments, CI/CD, deployment, rollback, secrets,
   observability, operations, API contracts, user-facing workflows).
3. Update only the relevant docs, applying `.agents/core/standards/documentation.md`
   and `.agents/core/standards/repository.md`. If none need updates, state why.
4. Summarize documentation changes made.

## Required outputs

Updated docs, or an explicit "no docs affected" statement with reasoning.

## Safety constraints

Never read, print, or commit secrets while inspecting the diff.

## References

- `.agents/core/sdlc/docs-sync.md` — full process
- `.agents/core/standards/documentation.md` — what a doc must answer
- `.agents/core/standards/repository.md` — repo-level docs expectations

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
