---
name: implementation-pass
description: Implement an approved feature folder. Use when the user points to a feature directory or asks to implement an existing feature plan/spec.
---
# Implementation Pass

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/implementation-pass/SKILL.md`, `adapters/codex/skills/implementation-pass/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Folder rules: `.agents/core/standards/features.md`.

## Goal

Implement `features/<feature>/spec.md` following its `plan.md`.

## Process

1. Find the feature: the one the user names, otherwise the single feature
   folder changed on the current branch, otherwise the single folder with
   `Status: approved`/`in-progress`/`needs-fixes`. Ask only if several
   match. Read `spec.md` and `plan.md`. Stop and report if `Status` is not
   `approved`, `in-progress`, or `needs-fixes`, or if any open question is
   unanswered.
2. Re-check every `[EXISTS]`/`[MODIFY]`/`[NEW]` scope tag against the
   code. Correct `spec.md` before changing code if a tag is wrong.
3. Read the standards listed in `plan.md` and, if the project matches a
   known stack, its `.agents/core/archetypes/<type>/rules.md`.
4. Set `Status: in-progress`.
5. For each checklist item:
   1. Write the test and confirm it fails for the expected reason.
   2. Implement the smallest change that passes it. Prefer, in order:
      what the repository already has, the standard library, platform
      features, an installed dependency, then new code. Never build a
      "Deferred" item. A conflict between the spec and a better outcome
      is raised as a question, never a silent deviation.
   3. Refactor with the test green.
   4. Tick the item in `plan.md`. Edit `plan.md` in place; never append
      progress logs.
6. A UI change is verified in a real browser against the running
   application (`.agents/core/standards/testing.md`).
7. Write comments and names per `.agents/core/standards/code-quality.md` Comment
   content: facts about what the code does, no history or identifiers.
   Fix existing comments in touched files that break those rules.
8. Update `docs/` for changed behavior, architecture, configuration,
   deployment, or operations.
9. Commit each logical step with passing hooks; never bypass them. Stage
   only the task's own paths.
10. Self-verify: run every `Verify:` line in `spec.md` and every command in
    `docs/ci-cd.md` "Local gates". Fix failures before continuing.
11. Write the implementation report into the PR description (see
    `pr-summary`): what was built and why, deviations from `spec.md` with
    reasons, additions beyond `spec.md`, deferred/not done, how to verify.
    Repeat the deviations list verbatim in the final reply to the user.
12. Set `Status: in-audit` and hand off with repository, branch, and
    commit hash.

## Finishing the feature

One feature is one PR, and it is not merged before `change-audit` returns
pass or pass with notes. After that, `Status: done` is set in that PR and the PR title states what the
feature changed (`.agents/core/standards/git/commits.md`). Do not delete the
folder here: it is removed at the start of the next feature
(`.agents/core/standards/features.md`). No `CHANGELOG.md` entry.

## Safety constraints

Do not broaden scope without noting it in `spec.md`. No destructive
commands. No deployment unless explicitly requested. Never hide failed
checks.

## Audit handoff

After `Status: in-audit`, start the audit in a context separate from this
one, without waiting for the user to ask: on Claude Code, delegate to the
`auditor` subagent (`@"auditor (agent)"`) with the feature folder and
branch; on other agents, tell the user to run `change-audit` in a fresh
session. On `needs-fixes`, fix the new unchecked `plan.md` items and hand
off once more. If blocking findings remain after that re-audit, stop and
report them to the user (`.agents/core/standards/token-efficiency.md`).
