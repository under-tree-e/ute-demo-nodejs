---
name: feature-plan
description: Create a compatible feature folder from an idea, change request, bug, refactor, documentation task, infrastructure task, or CI/CD task. Use before implementation when work needs planning, requirements, acceptance criteria, risks, and documentation impact.
---
# Feature Plan

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/feature-plan/SKILL.md`, `adapters/codex/skills/feature-plan/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Folder rules: `.agents/core/standards/features.md`.

## Goal

Create or update `features/FXXX-short-name/` from an idea, task, or bug,
before implementation.

## When not to use

A trivial, easily reversible change (single-purpose fix, rename,
docs-only edit, dependency bump) needs no folder. Say so and proceed
with a branch and a PR instead.

## Process

1. Take the project essence from the first paragraph of
   `docs/product-overview.md` (written by `project-discovery`) — do not ask
   the user to restate it. Ask only for what is missing: the purpose (the
   outcome for the end user), the tasks with concrete paths/routes/IDs,
   the existing pattern to build on, and what is out of scope. Treat any
   approach the user proposes as a starting hypothesis to improve, not an
   instruction to copy. Read `CLAUDE.md`/`AGENTS.md` and the `docs/*.md`
   files the task touches.
2. Close finished features (`.agents/core/standards/features.md`, Closure at the
   next feature start): keep only folders touched by open PRs; of the rest,
   delete the ones you created (same GitHub login) without asking, list
   the ones created by anyone else with their author and delete only those
   the user confirms — all in one separate commit on this feature's branch.
   For a cross-repository feature, create the
   folder only in the owning repository. Use the remaining folders to
   avoid duplicating tracked work. The new `FXXX` is one above the highest
   `F` number among existing folders and deleted ones
   (`git log --all --diff-filter=D --name-only -- features/ | grep -oE '^features/F[0-9]{3}' | sort -u | tail -1`);
   folders under another naming scheme don't count toward numbering.
3. Inspect the code the task touches. Tag every scope item `[EXISTS]`,
   `[MODIFY]`, or `[NEW]` from what the code shows, not from memory.
4. Identify which `.agents/core/standards/*` files the change touches (config →
   `configuration.md`, auth → `security.md`, external API →
   `api-integration.md`, pipelines → `ci-cd.md`, always `testing.md`) and
   list them in `plan.md`.
5. Write `spec.md` and `plan.md` from this skill's `templates/`. Keep
   `spec.md` under 200 lines. Every acceptance criterion gets a `Verify:`
   line (exact command or manual step → expected result). Cut low-value
   complexity into "Deferred"; never defer correctness, security, data
   integrity, or concurrency. `plan.md` checklist puts the failing test
   before each implementation step.
6. Run the embedded scope-split check (`skills/scope-split/SKILL.md`).
   Declined items go to `spec.md` "Out of scope".
7. Separate blockers from assumptions. Put only real blockers in
   "Open questions", each as a decision with a `Recommendation:`; "None."
   is a valid answer. Ask them as structured choices when the agent
   supports it (Claude Code: `AskUserQuestion`, recommendation first and
   marked "(Recommended)"), otherwise as a numbered list the user can
   answer in one line.
8. Set `Status: awaiting-answers` while questions are open. Move answers
   to "Decisions", then set `approved` once the user approves.

## Required outputs

```text
features/FXXX-short-name/
  spec.md
  plan.md
```

`audit.md` is created later by `change-audit`.

## Safety constraints

No code changes, no deployment actions, no secrets. Ask questions only if
implementation would be unsafe or materially ambiguous.
