---
paths:
  - "**/*"
---
# Workflow Rules

> Canonical agent-neutral text: `core/standards/workflow.md`. Keep both in
> sync — this file exists as a real, loaded copy because Claude Code reads
> `.claude/rules/*.md` content directly, not by following links.

For non-trivial changes, do not jump straight into implementation.

Required order:

1. Explore existing project structure, docs, and similar implementations.
2. Summarize current behavior and affected files.
3. Create a dedicated branch, per `core/standards/git/branching.md` —
   before creating or updating a feature folder or any other repository
   content. Never work directly on `main` or on another task's active
   branch. This applies even when the work is only planning documentation
   (a `features/<name>/spec.md`/`plan.md`/`audit.md`); see
   `.claude/rules/git-workflow.md`.
4. Create or update a feature folder under `features/`.
5. Propose a minimal implementation plan.
6. Implement in small, reviewable steps.
7. Run relevant checks.
8. Update docs when needed.
9. Once the first logical commit exists, push and open an early Draft PR
   per `core/standards/git/pull-requests.md`.
10. Summarize risks, verification, and follow-up items.

Ask questions only when implementation would be unsafe or materially ambiguous. Otherwise make reasonable assumptions and mark them explicitly.
