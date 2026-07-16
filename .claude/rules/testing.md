---
paths:
  - "**/*"
---
# UTE Testing Rules

> Canonical agent-neutral text: `core/standards/testing.md`. Keep both in
> sync.

- Prefer project-native validation commands.
- Add tests for new behavior where test infrastructure exists.
- For bug fixes, add a regression test when practical.
- For infrastructure/CI/CD changes, validate syntax and describe manual verification steps.
- If tests cannot be run, state exactly why and what should be run manually.
