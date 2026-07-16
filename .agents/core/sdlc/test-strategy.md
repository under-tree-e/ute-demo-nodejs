# Test Strategy

Canonical procedure behind the `test-strategy` skill.

## Purpose

Define what should be tested, at what level, and in what order, for a
feature, release, refactor, or project — grounded in the project's actual
test tooling, not generic advice.

## When to use

- Alongside or right after feature planning, before implementation starts.
- When a refactor or release needs a test plan and none exists.
- When existing tests don't obviously cover a risk area.

## Inputs to inspect

- Feature folder (`feature.md`, `requirements.md`, `acceptance-criteria.md`,
  `risks.md`) if present
- Existing test suites and their structure/conventions
- `package.json`/`Makefile`/CI config for test/lint commands actually
  defined
- Test data fixtures/factories/seed scripts
- Areas of the codebase the change touches (from diff or plan)
- `core/archetypes/<type>/validation.md`, if the project matches a known
  archetype — frontend and backend testing shapes differ (e.g. Angular's
  Karma/Jasmine or Jest plus Cypress/Playwright vs. a Node API's
  integration/contract-test emphasis), and the archetype's own testing
  expectations take precedence over generic advice

## Process

1. Read the feature/change description and existing tests for the affected
   area.
2. If the project matches a known archetype, read that archetype's
   `validation.md` testing expectations first (`docs/archetypes-index.md`)
   — it sets the stack-appropriate baseline (frontend vs. backend, app vs.
   library) before generic advice applies.
3. Identify what test commands already exist — never invent commands that
   aren't defined in the project.
4. Rank affected areas by risk/impact (data loss, auth, payments, public
   API > internal utility).
5. Draft a unit test plan for the highest-risk logic first.
6. Draft an integration test plan for cross-component/service paths.
7. Draft an e2e/smoke test plan for user-facing or deployment-critical
   flows.
8. Draft a manual QA checklist for anything not automatable given current
   tooling.
9. Draft a regression checklist for previously-fixed or fragile areas
   nearby.
10. Note test data requirements (fixtures, seed data, anonymized samples —
    never real secrets/PII).
11. Order everything by risk-based priority: what to run/write first if time
    is short.

## Expected outputs

- Unit test plan
- Integration test plan
- E2E/smoke test plan
- Manual QA checklist
- Regression checklist
- Test data requirements
- Risk-based priority order
- Commands to run, only if discoverable from the project

## Safety rules

- No code changes — this stage plans tests; implementation (or an explicit
  follow-up) writes them.
- No deployment or destructive actions (no running migrations/seeds against
  real environments).
- Never use or request real secrets/PII as test data.

## Things not to do

- Don't invent test/build commands the project doesn't actually have.
- Don't propose e2e coverage for flows the project has no way to exercise
  (no browser/e2e harness) — flag the gap instead.
- Don't treat this as a substitute for `core/sdlc/change-audit.md`, which
  checks what was actually done.

## Final response format

- Risk ranking of affected areas
- Test plan by level (unit/integration/e2e/manual/regression)
- Test data needs
- Commands found (or "none found — manual only")
- Gaps/open questions
