---
name: test-strategy
description: Define a realistic, risk-prioritized test strategy (unit/integration/e2e/manual/regression) for a feature, release, refactor, or project. Use when planning how something will be tested, before or during implementation.
---
# Test Strategy

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/test-strategy/SKILL.md`, `adapters/codex/skills/test-strategy/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Define what should be tested, at what level, and in what order, for a
feature, release, refactor, or project — grounded in the project's actual
test tooling.

## When to use

- Alongside or right after feature planning, before implementation.
- When a refactor or release needs a test plan and none exists.
- When existing tests don't obviously cover a risk area.

## Inputs

Open feature folder (`spec.md`); existing test suites and conventions;
test/lint commands actually defined in `package.json`/`Makefile`/CI; test
data fixtures/factories/seed scripts; affected code areas.

## Process

1. Read the change description and existing tests for the affected area.
   Apply `.agents/core/standards/testing.md` (test-first for every behavior change,
   real-browser verification for UI changes).
2. If the project matches a known archetype, read its
   `.agents/core/archetypes/<type>/validation.md` first — it sets the
   stack-appropriate baseline before generic advice applies.
3. Identify test commands that actually exist — never invent ones.
4. Rank affected areas by risk/impact (data loss, auth, payments, public
   API > internal utility).
5. If a security-critical trust boundary is in scope (authentication,
   authorization/permissions, secrets or credential handling, a new or
   widened privileged API/credential surface, key/cert enrollment or trust
   establishment, tenant isolation), draft a **Bad-Path Test Matrix**
   (`# | Scenario | Required behavior`) per `.agents/core/standards/testing.md`:
   unauthorized/unknown identity, a legitimate identity in a disallowed
   state, stale/superseded authorization, conflicting/duplicate claims,
   time-of-check-to-time-of-use gaps, malformed/injection-shaped input,
   and (if retryable) a never-resolved-attempt policy, plus boundary-specific
   scenarios. Every row must be demonstrated, not merely written.
6. Draft, in risk order: unit plan for the highest-risk logic, integration
   plan for cross-component paths, e2e/smoke plan for user-facing or
   deployment-critical flows, manual QA checklist for what can't be
   automated, regression checklist for fragile nearby areas. Don't propose
   e2e coverage the project has no harness for — flag the gap.
7. Note test data requirements — never real secrets/PII.
8. Order everything by what to write/run first if time is short.

## Required outputs

Risk ranking; test plan by level (unit/integration/e2e/manual/regression);
Bad-Path Test Matrix when a security-critical trust boundary is in scope
(otherwise "not applicable"); test data needs; commands found (or "none
found — manual only"); gaps/open questions.

## Safety constraints

No code changes — this skill plans tests. No deployment or destructive
actions (no migrations/seeds against real environments). Never use or
request real secrets/PII as test data.

## References

- `.agents/core/standards/testing.md` — baseline testing expectations
- `.agents/core/archetypes/<type>/validation.md` — stack-specific testing expectations
- `change-audit` — checks what was actually done; this skill only plans
