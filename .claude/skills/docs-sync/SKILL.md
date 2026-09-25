---
name: docs-sync
description: Check whether documentation must be updated after code, infrastructure, deployment, CI/CD, API, configuration, or behavior changes. Use near the end of a task or before PR creation.
---
# Docs Sync

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/docs-sync/SKILL.md`, `adapters/codex/skills/docs-sync/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Review current changes and update documentation when needed.

## Inputs

Current git diff, existing `docs/*.md`.

## Process

1. Read `.agents/core/standards/documentation.md` (what a doc must answer) and
   `.agents/core/standards/repository.md` (where docs live, structure).
2. Inspect the diff and identify affected docs: product behavior,
   architecture, environments, CI/CD, deployment, rollback,
   secrets/configuration, observability/logging, operations/runbooks, API
   contracts, user-facing workflows.
3. Update only the relevant docs. If none need updates, state why.
   `docs/architecture.md` follows `.agents/core/standards/knowledge-governance.md`
   "Architecture document": edit the owning section in place, record
   decision outcomes as "Constraints" and exceptions in "Exceptions" (with
   a removal condition), give each changed statement this PR as its only
   reference, and never create decision-record files.
4. Summarize documentation changes made.

## Required outputs

Updated docs, or an explicit "no docs affected" statement with reasoning.

## Safety constraints

Never read, print, or commit secrets while inspecting the diff.

## References

- `.agents/core/standards/documentation.md` — what a doc must answer
- `.agents/core/standards/repository.md` — repo-level docs expectations
