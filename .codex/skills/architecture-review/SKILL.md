---
name: architecture-review
description: Review architecture and deployment impact before major implementation or infrastructure changes — modules, boundaries, data flow, scaling, security-sensitive areas. Use before starting non-trivial implementation or infra work, not for routine small changes.
---
# Architecture Review

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/architecture-review/SKILL.md`, `adapters/codex/skills/architecture-review/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/architecture-review.md`. Read it before
running this skill.

## Goal

Assess architectural and deployment impact before major implementation or
infrastructure work begins.

## Inputs

`docs/architecture.md`/`docs/environments.md`/`docs/ci-cd.md`, module/service
boundaries, data flow, API contracts, deployment manifests, observability
and backup/restore setup, the proposed change. Full list:
`.agents/core/sdlc/architecture-review.md`.

## Process

1. Read `.agents/core/sdlc/architecture-review.md` in full.
2. Map affected boundaries and trace runtime/data flow.
3. Check API compatibility, environment separation, secrets/config handling.
4. Assess deployment/scaling impact and observability of a failure.
5. Flag security-sensitive areas — do not resolve them here.
6. If the project matches a known archetype, compare the repo's actual
   structure against `.agents/core/archetypes/<type>/structure.md` and `rules.md`
   — flag drift, don't mandate a restructure.
7. Compare the repo's actual boundaries against
   `.agents/core/standards/repository-architecture.md` for whether a
   single-repo/monorepo/split decision is still justified — flag drift,
   don't mandate a restructure.
8. Write the assessment only; do not implement anything.

## Required outputs

Summary of the change, affected boundaries, ranked risks, security-sensitive
areas touched, open questions, recommended handoff skill.

## Safety constraints

No code, config, infrastructure, or deployment changes. Never read, print,
or commit secrets. Flag but do not resolve auth/tenant-isolation weakening —
see `.agents/core/standards/security.md`.

## References

- `.agents/core/sdlc/architecture-review.md` — full process
- `.agents/core/archetypes/<type>/structure.md` and `rules.md` — stack-specific structure/rules to check alignment against, if applicable
- `.agents/core/standards/repository-architecture.md` — single-repo/monorepo/split decision criteria
- `devops-review` — infra/CI-specific detail handoff
- `rollback-plan` (`.agents/core/sdlc/rollback-plan.md`) — rollback procedure handoff

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
