---
name: pr-summary
description: Prepare a concise Pull Request summary for projects, including purpose, changed areas, validation, risks, docs impact, and rollback notes.
---
# PR Summary

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/pr-summary/SKILL.md`, `adapters/codex/skills/pr-summary/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/standards/git/pull-requests.md`. Read it before
running this skill (there is no dedicated `.agents/core/sdlc/` file for this one —
it's Git/PR process, not a lifecycle stage).

## Goal

Prepare a PR description from the current diff and feature docs.

## Inputs

Current diff, feature folder (if one exists), test/validation results.

## Process

1. Read and apply `.agents/core/standards/git/pull-requests.md`.
2. When producing a GitHub-ready PR description, write directly to the "PR
   description — required sections" list in
   `.agents/core/standards/git/pull-requests.md` rather than inventing sections —
   this repo does not ship a `.github/` PR template file; a project's own
   PR template (if any) is that project's own concern.
3. Summarize purpose, changes, verification actually run, docs impact,
   risks, and rollback notes from the real diff and feature docs.
4. Be specific — do not claim checks passed unless they actually ran.

## Required outputs

```md
## Purpose

## Changes

## Verification

## Docs impact

## Risks

## Rollback

## Notes for reviewer
```

## Safety constraints

Never fabricate test/verification results. Never include secrets found in
the diff.

## References

- `.agents/core/standards/git/pull-requests.md` — required sections and rationale

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
