# Workflow Standard

Agent-neutral version of the mandatory workflow. Adapters translate this into
their own rule-loading mechanism (`adapters/claude/.claude/rules/workflow.md`,
`adapters/codex/AGENTS.md`).

For non-trivial changes, do not jump straight into implementation.

Required order:

1. Explore existing project structure, docs, and similar implementations.
2. Summarize current behavior and affected files.
3. Create a dedicated branch, per `core/standards/git/branching.md` —
   before creating or updating a feature folder or any other repository
   content. Never work directly on `main` or on another task's active
   branch. This applies even when the work is only planning documentation
   (a `features/<name>/spec.md`/`plan.md`/`audit.md`) — planning-only work
   is still a task, not an exemption.
4. Create or update a feature folder under `features/`.
5. Propose a minimal implementation plan.
6. Implement in small, reviewable steps.
7. Run relevant checks.
8. Update docs when needed.
9. Once the first logical commit exists, push and open an early Draft PR,
   per `core/standards/git/pull-requests.md`.
10. Summarize risks, verification, and follow-up items.

Ask questions only when implementation would be unsafe or materially
ambiguous. Otherwise make reasonable assumptions and mark them explicitly.

See `core/sdlc/README.md` for how this maps onto the full pipeline of
these skills.
