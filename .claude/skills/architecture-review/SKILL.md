---
name: architecture-review
description: Review architecture and deployment impact before major implementation or infrastructure changes — modules, boundaries, data flow, scaling, security-sensitive areas. Use before starting non-trivial implementation or infra work, not for routine small changes.
---
# Architecture Review

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/architecture-review/SKILL.md`, `adapters/codex/skills/architecture-review/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Assess architectural and deployment impact before major implementation or
infrastructure work begins — the gate for changes that cross module/service
boundaries or affect how the system runs.

## When to use

- Before implementing a feature that touches multiple modules/services.
- Before an infrastructure or deployment-model change.
- When a feature's `spec.md` Risks section flags architectural uncertainty.
- Not needed for small, contained, single-module changes.

## Inputs

`docs/architecture.md`, `docs/environments.md`, `docs/ci-cd.md` if present;
module/service boundaries; dependency graph; data stores and data flow; API
contracts; per-environment configuration; secrets/config loading;
deployment manifests (Docker, k8s, Terraform, Ansible); observability and
backup/restore setup; the proposed change; `.agents/core/archetypes/<type>/`
`structure.md` and `rules.md` if the stack matches a known archetype.

## Process

1. Read existing architecture docs and the proposed change.
2. Map which modules/boundaries the change touches.
3. Trace runtime and data flow through the affected path.
4. Check API boundaries for compatibility impact.
5. Check environment separation — does behavior differ per environment.
6. Check secrets/config handling for anything the change introduces.
7. Assess deployment impact — rolling update, migration ordering, downtime —
   and the scaling assumptions the change relies on or breaks. Don't guess
   capacity numbers not evidenced in the repo or docs.
8. Check observability — will a failure of this change be visible in
   logs/metrics.
9. Check backup/restore and rollback assumptions for anything stateful.
10. Flag security-sensitive areas (auth, tenant isolation, payments,
    secrets) — do not resolve them here.
11. If the project matches a known archetype, compare the affected
    boundaries against its `structure.md`/`rules.md`, and the repo's
    boundaries against `.agents/core/standards/repository-architecture.md` — flag
    drift as an open question, don't mandate a restructure.
12. Write the assessment only; do not implement anything.

## Required outputs

Summary of the change, affected boundaries, data/runtime flow summary,
ranked risks with rationale, security-sensitive areas touched, open
questions, recommended handoff: `devops-review` for infra/CI mechanics,
`rollback-plan` for stateful or production-impacting changes.

## Safety constraints

No code, config, infrastructure, or deployment changes. Never read, print,
or commit secrets. Flag but do not resolve auth/permission/tenant-isolation
weakening — see `.agents/core/standards/security.md`. Don't re-run a DevOps
checklist or write a rollback procedure here — hand off instead.

## References

- `.agents/core/archetypes/<type>/structure.md` and `rules.md` — stack-specific alignment
- `.agents/core/standards/repository-architecture.md` — single-repo/monorepo/split criteria
- `devops-review`, `rollback-plan` — handoff skills
