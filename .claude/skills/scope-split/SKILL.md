---
name: scope-split
description: Identify out-of-scope items surfaced while analyzing a task — bugs, refactors, doc/test gaps, infra debt not needed for the current feature's acceptance criteria — and, with explicit user confirmation, spin each one off into its own feature folder instead of letting it expand the current diff. Runs as an embedded step of feature-plan, not a standalone pipeline stage.
---
# Scope Split

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/scope-split/SKILL.md`, `adapters/codex/skills/scope-split/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

While `feature-plan` drafts a feature, separate what the feature needs
from what it does not, and turn confirmed out-of-scope items into their
own feature folders instead of expanding scope or dropping the finding.

## Process

1. While drafting, list anything observed that the current acceptance
   criteria do not require.
2. For each item write one line: what it is, why it is out of scope, and
   which repository it belongs to.
3. Drop items already tracked in an open feature folder.
4. Ask the user which items to spin off. Create nothing before the
   answer.
5. For each confirmed item, create `features/FXXX-short-name/spec.md` and
   `plan.md` from `skills/feature-plan/templates/`, in the repository that
   owns it.
6. Record declined items in the current `spec.md` "Out of scope" section.
7. Never let a spun-off item change the current feature's scope,
   requirements, or acceptance criteria.

## Safety constraints

No code changes, no deployment actions, no secrets. Never create a
feature folder for an unconfirmed item.
