---
name: test-strategy
description: Define a realistic, risk-prioritized test strategy (unit/integration/e2e/manual/regression) for a feature, release, refactor, or project. Use when planning how something will be tested, before or during implementation.
---
# Test Strategy

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/test-strategy/SKILL.md`, `adapters/codex/skills/test-strategy/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/test-strategy.md`. Read it before running
this skill.

## Goal

Define what should be tested, at what level, and in what order, grounded in
the project's actual test tooling.

## Inputs

Feature folder, existing test suites/conventions, real test/lint commands
from `package.json`/`Makefile`/CI, test data fixtures, affected code areas.

## Process

1. Read `.agents/core/sdlc/test-strategy.md` for the planning process, and apply
   `.agents/core/standards/testing.md` for the baseline testing expectations it
   sets.
2. If the project matches a known archetype, read that archetype's
   `validation.md` testing expectations first — frontend/backend/app-vs-
   library testing shape differs; it sets the baseline before generic
   advice applies.
3. Identify test commands that actually exist — never invent ones.
4. Rank affected areas by risk/impact.
5. Draft unit/integration/e2e/manual/regression plans in that priority
   order.
6. Note test data requirements (never real secrets/PII).

## Required outputs

Risk ranking, test plan by level, test data needs, commands found (or
"none found — manual only"), gaps/open questions.

## Safety constraints

No code changes — this skill plans tests. No deployment or destructive
actions. Never use real secrets/PII as test data.

## References

- `.agents/core/sdlc/test-strategy.md` — full process
- `.agents/core/standards/testing.md` — baseline testing expectations
- `.agents/core/archetypes/` — stack-specific testing expectations (`validation.md`), if applicable

## Required Final Output: Agent Run Report

Every run of this skill must end with:

### Agent Run Report

- Skill:
- Project type/archetype:
- Confidence: high / medium / low
- Inputs used:
- Applicable standards used:
- Missing inputs:
- Assumptions made:
- Project documentation gaps:
- Standards gaps:
- Recommended updates to `ute-agent-standards`:
- Items that belong to other repositories:
- Follow-up questions, if any:
