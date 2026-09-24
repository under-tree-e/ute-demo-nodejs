---
paths:
  - "**/*"
---
# Testing Rules

> Canonical agent-neutral text: `core/standards/testing.md`. Keep both in
> sync.

- Prefer project-native validation commands.
- Add tests for new behavior where test infrastructure exists.
- For bug fixes, add a regression test when practical.
- For infrastructure/CI/CD changes, validate syntax and describe manual verification steps.
- If tests cannot be run, state exactly why and what should be run manually.
- For any change touching a security-critical trust boundary (auth, secrets, permissions, a new privileged credential, enrollment/trust establishment), write and demonstrate a Bad-Path Test Matrix (deny-path scenarios, not just happy path) — see `core/standards/testing.md`.
