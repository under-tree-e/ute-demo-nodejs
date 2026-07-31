---
name: scope-split
description: Identify out-of-scope items surfaced while analyzing a task — bugs, refactors, doc/test gaps, infra debt not needed for the current feature's acceptance criteria — and, with explicit user confirmation, spin each one off into its own feature folder instead of letting it expand the current diff. Runs as an embedded step of feature-plan, not a standalone pipeline stage.
---
# Scope Split

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/scope-split/SKILL.md`, `adapters/codex/skills/scope-split/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/scope-split.md`. Read it before running
this skill.

## Goal

While `feature-plan` is drafting a feature, separate what belongs to that
feature from what doesn't — and turn confirmed out-of-scope items into
their own `features/` folders, with the user's explicit sign-off, instead
of silently expanding scope or silently dropping the finding.

## Inputs

The current feature's in-progress `feature.md`/`implementation-plan.md`
draft, whatever else was noticed while analyzing it, existing `features/`
folders (to avoid duplicating an already-tracked item), and
`.agents/core/standards/*` (to judge whether something is a real deviation or
expected behavior).

## Process

1. Read `.agents/core/sdlc/scope-split.md` in full.
2. During (not after) drafting the current feature's documents, list
   anything observed that the current feature's acceptance criteria do
   not require.
3. For each item, write: what it is, why it's out of scope here, and
   which repository/area it likely belongs to.
4. Drop anything already tracked in an existing feature folder.
5. Present the remaining candidates to the user and ask which to spin
   off. Create nothing before the user answers.
6. For each confirmed item, write the six documents below using this
   skill's own `templates/` directory — the same shapes `feature-plan`
   uses.
7. Note declined items in the current feature's Agent Run Report so
   they aren't lost, but do not create a folder for them.
8. Never let a spun-off item change the requirements, scope, or
   acceptance criteria of the feature currently being planned.

## Required outputs

Per confirmed item:

```text
features/FXXX-short-name/
  feature.md
  requirements.md
  acceptance-criteria.md
  implementation-plan.md
  risks.md
  docs-impact.md
```

Plus, in the current feature's own Agent Run Report: a short list of
out-of-scope items found, which were spun off, and which were declined.

## Safety constraints

No code changes, no deployment actions, no secrets. Never create a
feature folder for an unconfirmed item. Never delay or block the current
feature's own documents to chase a spun-off item — this check runs
alongside that work.

## References

- `.agents/core/sdlc/scope-split.md` — full process
- `templates/` (this skill's own directory) — same starter document
  shapes `feature-plan` uses, installed automatically with this skill
- `skills/feature-plan/SKILL.md` — the skill this one is embedded in

## Required Final Output: Agent Run Report

Every run of this skill must end with:

### Agent Run Report

- Skill:
- Project type/archetype:
- Confidence: high / medium / low
- Inputs used:
- Out-of-scope items found:
- Items spun off (with feature folder path):
- Items declined by the user:
- Missing inputs:
- Assumptions made:
- Project documentation gaps:
- Standards gaps:
- Recommended updates to `ute-agent-standards`:
- Items that belong to other repositories:
- Follow-up questions, if any:
