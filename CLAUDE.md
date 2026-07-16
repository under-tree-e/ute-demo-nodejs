# UTE Agent Standards — Claude Adapter

This is the Claude Code adapter for the UTE AI Agent Standards. Canonical,
agent-neutral standards live in `core/` (at the repository root, one level
up from `adapters/claude/`); this file and `.claude/` translate them into
what Claude Code actually reads.

## Core principles

- Prefer small, reviewable changes.
- Explore before editing.
- Plan before non-trivial implementation.
- Implement the minimal safe diff.
- Verify with tests/checks where available.
- Update documentation when behavior, architecture, deployment,
  configuration, or operational procedures change.
- Never read, print, generate, or commit secrets.

Full text: `core/standards/workflow.md`, `core/standards/security.md`,
`core/standards/documentation.md`, `core/standards/testing.md`,
`core/standards/git/branching.md`, `core/standards/git/commits.md`,
`core/standards/git/pull-requests.md`.

## Mandatory workflow for non-trivial work

1. Explore current code and documentation (`/project-discovery` if this
   is the first pass over an unfamiliar project).
2. Summarize the current state.
3. Review architecture/deployment impact for major changes
   (`/architecture-review`).
4. Create a dedicated branch (per `core/standards/git/branching.md`) —
   before creating or updating a feature/spec folder or any other
   repository content. Never work directly on `main` or on another task's
   active branch. This applies even when the work is only planning
   documentation (a `features/<name>/spec.md`/`plan.md`/`audit.md`); see
   `.claude/rules/git-workflow.md`.
5. Create or update a feature/spec folder.
6. Prepare an implementation plan.
7. Implement in small steps.
8. Run relevant validation, including a test strategy for non-trivial work
   (`/test-strategy`).
9. Audit the diff.
10. Sync docs.
11. Check release readiness before merging/shipping
    (`/release-readiness`).
12. Once the first logical commit exists, push and open an early Draft PR
    (per `core/standards/git/pull-requests.md`), then prepare the PR
    summary (`/pr-summary`).

## Recommended skills

Pipeline (see `core/sdlc/README.md` for the full picture):

- `/project-discovery` — build baseline understanding of a project (run
  first).
- `/architecture-review` — review architecture/deployment impact before
  major changes.
- `/feature-plan` — convert idea/task into feature documentation.
- `/implementation-pass` — implement an approved feature plan.
- `/change-audit` — independently audit implemented changes.
- `/test-strategy` — define a test strategy for a feature, release, or
  refactor.
- `/docs-sync` — update docs after changes.
- `/release-readiness` — check whether a feature/PR/project is ready to
  release.
- `/pr-summary` — prepare PR description.
- `/post-release-review` — capture lessons after release, feed into the
  next cycle.

Ad hoc — use whenever relevant, not fixed pipeline steps:

- `/devops-review` — review infrastructure/CI/CD/deployment changes.
- `/rollback-plan` — prepare rollback plan for risky changes.
- `/production-readiness` — check a service's operational posture,
  independent of any one change.
- `/standards-gap-audit` — analyze a confusing or gap-riddled agent run and
  classify whether the fix belongs in the project, a skill, a standard, an
  archetype, or another UTE repo (see `docs/evaluation-loop.md`).

Stack-specific overlays live in `core/archetypes/` (see
`core/archetypes/README.md`) — optional, pick the closest match if one
applies.

## What belongs here vs. in `core/`

If it's true regardless of which AI agent is used, it belongs in `core/`.
If it's how Claude Code specifically discovers/loads/enforces that content
(slash-invoked skills, path-scoped rules, hooks, `permissions.deny`), it
belongs here in `adapters/claude/`. Keep this file short — put reusable
procedures in `.claude/skills/`, file/path-specific rules in
`.claude/rules/`.
