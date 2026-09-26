# Agent Standards — Codex

This is the durable guidance entry point for Codex (or any similarly-driven
agent) working on a project. Canonical, agent-neutral standards live in
`.agents/core/` (installed alongside this file by
`install-agent-standards.sh`) — this file is the Codex-specific translation
of them, the way `adapters/claude/CLAUDE.md` is the Claude-specific
translation. When in doubt, `.agents/core/` wins; this file should never
contradict it.

## Repository identity

You are working on a project using the **AI Agent Standards**
(`.agents/core/`, `adapters/claude/`, `adapters/codex/`). Claude is the first-class
adapter this standard set was originally built around; Codex is the second
first-class adapter. Both read the same `.agents/core/` content — they differ only
in how it's packaged and invoked.

## Required workflow

For any non-trivial change, follow this order — do not jump straight to
implementation:

1. **Discovery** (first pass on an unfamiliar project only) — see
   the `project-discovery` skill.
2. **Architecture review** for changes crossing module/service boundaries or
   touching infrastructure — see the `architecture-review` skill.
3. **Branch first** — create a dedicated branch per
   `.agents/core/standards/git/branching.md` before creating or updating anything
   under `features/<name>/`, or any other repository content. Never work
   directly on `main` or on another task's active branch. Creating or
   updating a feature's `spec.md`/`plan.md`/`audit.md` is itself work that
   requires its own branch — planning documentation is not exempt.
4. **Feature planning** — create/update `features/<name>/` with the
   `feature-plan` skill, per `.agents/core/standards/features.md`, before
   writing code. Before creating one, remove every folder under
   `features/` that no open PR changes, in one separate commit on this
   feature's branch: folders you created (same GitHub login) without
   asking; folders created by anyone else only after the user confirms.
   A cross-repository feature has one
   folder, in the owning repository. Read only folders touched by open
   PRs.
5. **Implementation** — implement the reviewed plan with the
   `implementation-pass` skill, test first, in small reviewable steps.
6. **Change audit** — audit the diff with the `change-audit` skill.
7. **Test strategy** — per the `test-strategy` skill, scaled to risk.
8. **Docs sync** — per the `docs-sync` skill.
9. **Release readiness** — per the `release-readiness` skill, before
   merging/shipping.
10. **Draft PR early, PR summary at handoff** — open a Draft PR as soon as
    the first logical commit is pushed (per
    `.agents/core/standards/git/pull-requests.md`), don't wait until the task is
    finished; write the PR summary per `.agents/core/standards/git/pull-requests.md`.

11. **One feature, one PR** — never merged before the audit passes; then
    set `Status: done` in it; the folder is deleted at the start of the next feature. No PR
    only for closing.
    `CHANGELOG.md` is for releases only.

Not every change needs every stage — a trivial, easily reversible change
needs no feature folder and skips straight to implementation and docs sync. Scale to risk and size, per
`.agents/core/standards/workflow.md`.

Use the `rollback-plan` skill, the `production-readiness` skill, and
the DevOps review process (`.agents/core/archetypes/devops-infra/`) ad hoc, whenever
a change touches infrastructure, is risky enough to need an explicit
rollback plan, or the question is about a service's ongoing operational
posture.

Use the `standards-gap-audit` skill
whenever a run reports missing skills or non-trivial assumptions, or a
run's output is unclear — it classifies
whether the fix belongs in the project, a skill, a standard, an archetype,
or a different repository. See `docs/evaluation-loop.md`.

## Use `.agents/core/` as the canonical source

Do not restate or reinvent standards already defined in `.agents/core/`. When a task
maps to a `.agents/core/sdlc/<stage>.md` file or a `.agents/core/standards/` file, read it
and follow it. `adapters/codex/skills/` gives you short, Codex-shaped
summaries with pointers back to the canonical text — read the canonical
file, don't guess from the summary alone for anything non-trivial. Where a
`.agents/core/sdlc/<stage>.md` file says its procedure is a skill, the
skill is the canonical procedure.

## PR granularity

One PR per intent. Small corrections in the same area go into the current
PR as their own commit; refinements of an open decision go into the same
open PR; pins are bumped once per feature in the consumer's feature PR;
never open a PR only for a pin bump, a progress note, or a temporary
operational flip. See `.agents/core/standards/git/pull-requests.md`.

## Code comments

Comments state only facts about how the code works: what a function does,
its parameters, return value, and errors; what a variable controls, its
allowed values, default, and unit. Never put feature/ticket IDs,
phase names, dates, decisions, change history, or debugging stories in
comments or in names of files, variables, jobs, or UI labels — see
`.agents/core/standards/code-quality.md` (Comment content). Fix existing
violations without asking in code the team owns; ask first in vendored,
third-party, or another team's code.

## Token efficiency

Search before reading and read only the needed part of large files; read
CI logs from the failing step only; delegate broad searches and mechanical
bulk edits to the cheapest capable model tier with a narrow file list; one
audit plus at most one re-audit, then report. See
`.agents/core/standards/token-efficiency.md`.

## Missing skills note

Skills have no run report. When a skill, standard, or archetype that does
not exist would have materially changed the result, add a short separate
`Missing skills:` list after the output (name — what it would cover).
Omit it otherwise.

## Do not bypass feature specs

Do not implement non-trivial changes without a reviewed feature folder
(`features/<name>/`, per `.agents/core/standards/features.md`). If one doesn't
exist yet, create it first and get it reviewed before implementing — this
is not optional for anything beyond a small, contained fix.

## Do not run destructive or deploy commands

Never run `terraform apply`, `terraform destroy`, `kubectl delete`,
`docker system prune`, `rm -rf`, force-pushes, or production
deploy/release/migration commands unless the user has explicitly asked for
that exact action and the rollback path is clear. See
`.agents/core/standards/security.md`. Codex has no built-in equivalent of Claude's
`permissions.deny`/hooks mechanism as of this writing — this file is the
only enforcement layer available to Codex, so treat it as load-bearing, not
advisory.

## Documentation sync rules

When a change alters behavior, architecture, environments, CI/CD,
deployment, secrets, rollback, observability, or operational flow, update
the relevant docs in the same change — see `.agents/core/standards/documentation.md`
and the `docs-sync` skill. Never leave a change's docs impact as a silent
gap.

## Testing expectations

Prefer project-native test/validation commands; never invent commands that
aren't defined in the project. Add tests for new behavior where test
infrastructure exists, and a regression test for bug fixes when practical.
If tests cannot be run in this environment, say exactly why and what should
be run manually. See `.agents/core/standards/testing.md` and
the `test-strategy` skill.

## Git / PR rules

Follow `.agents/core/standards/git/branching.md`, `.agents/core/standards/git/commits.md`,
and `.agents/core/standards/git/pull-requests.md`. Read all three before creating a
branch or PR for non-trivial work.

Any new feature, enhancement, fix, or documentation/planning task gets its
own dedicated branch and an early Draft PR (opened once the first logical
commit is pushed) — never work directly on `main`, and never on another
task's active branch. This includes purely planning work: creating or
updating a `features/<name>/spec.md`, `plan.md`, or `audit.md` already
counts as work requiring its own branch.

Keep diffs small and reviewable. Do not force-push or rewrite history
unless explicitly requested. Validate branch names and commit messages with
`scripts/validate-branch-name.sh` / `scripts/validate-commit-message.sh`
when available.

## Vendor-skills policy

Do not import, embed, or reproduce third-party skill content into this
repository or a consuming project's Codex skills. `vendor-skills/` at the
repository root is the only place reviewed/attributed third-party skills may
eventually live, and as of this writing nothing has been imported there —
see `docs/vendor-skills-policy.md`. Never copy content from a marketplace,
catalog, or another team's shared-skills archive directly into
`adapters/codex/skills/`.

## Unknowns must be marked explicitly

If something about the project, its conventions, or the right course of
action cannot be determined from the repo or explicit user instruction,
state it as an open question rather than guessing or inventing an answer.
This applies to build/test/deploy commands, architectural assumptions, and
anything security- or deployment-sensitive.

## Skills

See `adapters/codex/skills/` for the full list (mirrors the Claude adapter's
the shared skill set in spirit — see `adapters/codex/README.md` for what's
intentionally different).
