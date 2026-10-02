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
- Files without functions (config, compose, Dockerfile, state, templates):
  a header only when the purpose is not clear from the path, one line; no
  comparisons with other files.
- A module docstring that is a CLI's `--help`: one sentence on what it does,
  then only what is needed to run it (env vars, hidden inputs/outputs,
  behavior that changes the result). No examples, rationale, or advice.
- No run instructions (they belong in the runbook), no project-level design
  statements (who manages or schedules what), no "Contract: docs/…"
  pointers (the architecture document owns them).
- Never put in comments or in names of files, variables, jobs, templates,
  or UI labels: feature/ticket IDs, phase/step/slice names, dates, people,
  decisions or their reasons, alternatives, what changed, what was found or
  fixed, debugging stories, or links to planning documents. Those belong in
  the commit or PR; a lasting rule goes into the architecture document in
  the project's chosen form (`core/standards/knowledge-governance.md`).
- Existing comments that break these rules: fix them without asking in code
  the team owns; in vendored, third-party, or another team's code, list them
  and ask first.
