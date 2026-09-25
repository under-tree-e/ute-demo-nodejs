# Workflow Standard

Agent-neutral version of the mandatory workflow. Adapters translate this into
their own rule-loading mechanism (`adapters/claude/.claude/rules/workflow.md`,
`adapters/codex/AGENTS.md`).

For non-trivial changes, do not jump straight into implementation. A
trivial, easily reversible change (single-purpose fix, rename, docs-only
edit, dependency bump) needs only steps 1, 3, 6–9.

Required order:

1. Explore existing project structure, docs, and similar implementations.
2. Summarize current behavior and affected files.
3. Create a dedicated branch, per `core/standards/git/branching.md` —
   before creating or updating a feature folder or any other repository
   content. Never work directly on `main` or on another task's active
   branch. Planning-only work (`features/<name>/spec.md`/`plan.md`) is
   still a task, not an exemption.
4. Create or update a feature folder per `core/standards/features.md`.
   Before creating one, remove every folder under `features/` that no
   open PR changes, in one separate commit on this feature's branch:
   folders you created (same GitHub login) without asking; folders
   created by anyone else only after the user confirms. A
   cross-repository feature has one folder, in the owning repository.
   Read only folders touched by open PRs.
5. Propose a minimal implementation plan.
6. Implement in small, reviewable steps, test first
   (`core/standards/testing.md`).
7. Run relevant checks.
8. Update docs when needed.
9. Once the first logical commit exists, push and open an early Draft PR,
   per `core/standards/git/pull-requests.md`.
10. One feature is one PR, never merged before the audit passes. Then set
    `Status: done` in it; the folder is deleted at the start of the next
    feature. No PR only for closing.

Ask questions only when implementation would be unsafe or materially
ambiguous. Otherwise make reasonable assumptions and mark them explicitly.

## Missing skills note

Skills end with their own required output only; there is no run report.
When a skill, standard, or archetype that does not exist would have
materially changed the result, add a separate short note after the
output:

```text
Missing skills:
- <skill or standard name> — <what it would cover, one line>
```

Omit the note when nothing is missing.

See `core/sdlc/README.md` for how this maps onto the full pipeline of
these skills.
