---
paths:
  - "**/*"
---
# Testing Rules

> Canonical agent-neutral text: `core/standards/testing.md`. Keep both in
> sync.

- Prefer project-native validation commands.
- Test first for every behavior change: write the test, confirm it fails for the expected reason, then implement until it passes. A bug fix starts with a regression test that reproduces it.
- When no automated test can express the behavior, say so in `plan.md` and the PR and name the manual or live check that replaces it.
- A change that adds or changes a user interface must be verified in a real browser against the running application (screens render, flows work, no new console errors) before it is reported done.
- For infrastructure/CI/CD changes, validate syntax and describe manual verification steps.
- If tests cannot be run, state exactly why and what should be run manually.
- For any change touching a security-critical trust boundary (auth, secrets, permissions, a new privileged credential, enrollment/trust establishment), write and demonstrate a Bad-Path Test Matrix (deny-path scenarios, not just happy path) — see `core/standards/testing.md`.
