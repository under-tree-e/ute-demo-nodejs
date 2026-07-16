---
paths:
  - "**/*"
---
# UTE Git Workflow Rules

> Canonical agent-neutral text: `core/standards/git/`. Keep both in sync.

Before creating a branch or a PR for any non-trivial work, read and follow:

- `core/standards/git/branching.md` — branch naming (`<type>/<ticket>-<short-description>`), one-branch-one-task, `NO-TICKET` rules.
- `core/standards/git/commits.md` — commit message format (`<type>(<scope>): <short description> (<ticket>)`).
- `core/standards/git/pull-requests.md` — Draft → Ready-for-review → squash-merge flow, PR description requirements.

- Any new feature, enhancement, fix, or documentation/planning work is done
  on its own dedicated branch — never directly on `main`, and never on
  another task's active branch.
- This includes planning-only work: creating or updating a
  `features/<name>/spec.md`, `plan.md`, or `audit.md` (or any other
  planning artifact) already counts as work requiring its own branch. Do
  not author these directly on `main` or on a branch whose open PR belongs
  to a different task.
- Open an early Draft PR as soon as the first logical commit is pushed —
  do not accumulate work only locally for multiple days before a PR exists.
- Keep diffs small and reviewable.
- Do not force push.
- Do not rewrite history unless explicitly requested.
- Do not commit generated secrets, dumps, local config, temporary logs, or session notes.
- PR summaries must include: purpose, changed files, verification, risks, rollback notes if relevant.
