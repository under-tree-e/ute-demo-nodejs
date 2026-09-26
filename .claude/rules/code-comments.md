---
paths:
  - "**/*"
---
# Code Comment Rules

> Canonical agent-neutral text: `core/standards/code-quality.md` (Comment
> content). Keep both in sync.

- Comments state only facts about how the code works: what a function
  does, its parameters, return value, and errors; what a variable controls,
  its allowed values, default, and unit.
- An inline comment is allowed only for a non-obvious fact about behavior,
  one line where possible.
- Never put in comments or in names of files, variables, jobs, templates,
  or UI labels: feature/ticket IDs, phase/step/slice names, dates, people,
  decisions or their reasons, alternatives, what changed, what was found or
  fixed, debugging stories, or links to planning documents. Those belong in
  the commit or PR; a lasting rule goes into `docs/architecture.md`
  "Constraints".
- Existing comments that break these rules: fix them without asking in code
  the team owns; in vendored, third-party, or another team's code, list them
  and ask first.
