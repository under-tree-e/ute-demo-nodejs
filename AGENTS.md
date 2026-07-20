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
   `.agents/core/sdlc/project-discovery.md`.
2. **Architecture review** for changes crossing module/service boundaries or
   touching infrastructure — see `.agents/core/sdlc/architecture-review.md`.
3. **Branch first** — create a dedicated branch per
   `.agents/core/standards/git/branching.md` before creating or updating anything
   under `features/<name>/`, or any other repository content. Never work
   directly on `main` or on another task's active branch. Creating or
   updating a feature's `spec.md`/`plan.md`/`audit.md` is itself work that
   requires its own branch — planning documentation is not exempt.
4. **Feature planning** — create/update `features/<name>/` per
   `.agents/core/sdlc/feature-planning.md` before writing code.
5. **Implementation** — implement the reviewed plan per
   `.agents/core/sdlc/implementation-pass.md`, in small reviewable steps.
6. **Change audit** — self-audit the diff per `.agents/core/sdlc/change-audit.md`.
7. **Test strategy** — per `.agents/core/sdlc/test-strategy.md`, scaled to risk.
8. **Docs sync** — per `.agents/core/sdlc/docs-sync.md`.
9. **Release readiness** — per `.agents/core/sdlc/release-readiness.md`, before
   merging/shipping.
10. **Draft PR early, PR summary at handoff** — open a Draft PR as soon as
    the first logical commit is pushed (per
    `.agents/core/standards/git/pull-requests.md`), don't wait until the task is
    finished; write the PR summary per `.agents/core/standards/git/pull-requests.md`.

Not every change needs every stage — a one-line docs fix skips straight to
implementation and docs sync. Scale to risk and size, per
`.agents/core/standards/workflow.md`.

Use `.agents/core/sdlc/rollback-plan.md`, `.agents/core/sdlc/production-readiness.md`, and
the DevOps review process (`.agents/core/archetypes/devops-infra/`) ad hoc, whenever
a change touches infrastructure, is risky enough to need an explicit
rollback plan, or the question is about a service's ongoing operational
posture.

Use `.agents/core/sdlc/standards-gap-audit.md` (`standards-gap-audit` skill)
whenever a skill's Agent Run Report shows non-trivial missing
inputs/assumptions/gaps, or a run's output is unclear — it classifies
whether the fix belongs in the project, a skill, a standard, an archetype,
or a different repository. See `docs/evaluation-loop.md`.

## Use `.agents/core/` as the canonical source

Do not restate or reinvent standards already defined in `.agents/core/`. When a task
maps to a `.agents/core/sdlc/<stage>.md` file or a `.agents/core/standards/` file, read it
and follow it. `adapters/codex/skills/` gives you short, Codex-shaped
summaries with pointers back to the canonical text — read the canonical
file, don't guess from the summary alone for anything non-trivial.

## Do not bypass feature specs

Do not implement non-trivial changes without a reviewed feature folder
(`features/<name>/`, per `.agents/core/sdlc/feature-planning.md`). If one doesn't
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
and `.agents/core/sdlc/docs-sync.md`. Never leave a change's docs impact as a silent
gap.

## Testing expectations

Prefer project-native test/validation commands; never invent commands that
aren't defined in the project. Add tests for new behavior where test
infrastructure exists, and a regression test for bug fixes when practical.
If tests cannot be run in this environment, say exactly why and what should
be run manually. See `.agents/core/standards/testing.md` and
`.agents/core/sdlc/test-strategy.md`.

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
