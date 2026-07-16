# Architecture Review

Canonical procedure behind the `architecture-review` skill.

## Purpose

Assess architectural and deployment impact before major implementation or
infrastructure work begins — the pre-implementation gate for changes that
cross module/service boundaries or affect how the system runs.

## When to use

- Before implementing a feature that touches multiple modules/services.
- Before an infrastructure or deployment-model change.
- When a feature plan's `risks.md` flags architectural uncertainty.
- Not needed for small, contained, single-module changes.

## Inputs to inspect

- `docs/architecture.md`, `docs/environments.md`, `docs/ci-cd.md` if present
- Module/service boundaries in the code
- Dependency graph (internal packages, external services, third-party APIs)
- Data stores and data flow between components
- API contracts (REST/GraphQL/gRPC/queue schemas)
- Environment configuration and how it differs across local/dev/stage/prod
- Secrets/config loading approach
- Deployment manifests (Docker, k8s, Terraform, Ansible)
- Existing observability (logging, metrics, tracing) and backup/restore setup
- The proposed change (feature folder, ticket, or user description)
- `core/archetypes/<type>/structure.md` and `rules.md`, if the project's
  stack matches a known archetype (`docs/archetypes-index.md`)

## Process

1. Read existing architecture docs and the proposed change.
2. Map which modules/boundaries the change touches.
3. Trace runtime and data flow through the affected path.
4. Check API boundaries for compatibility impact.
5. Check environment separation — does behavior differ per environment.
6. Check secrets/config handling for anything the change introduces.
7. Assess deployment model impact — rolling update, migration ordering,
   downtime.
8. Assess scaling assumptions the change relies on or breaks.
9. Check observability — will a failure of this change be visible in
   logs/metrics.
10. Check backup/restore and rollback assumptions for anything stateful.
11. Flag security-sensitive areas (auth, tenant isolation, payments,
    secrets).
12. If the project matches a known archetype, compare the affected
    boundaries against that archetype's `structure.md`/`rules.md` and note
    drift as an open question — not a mandate to restructure (see
    `docs/archetypes-index.md`).
13. Write the assessment; do not implement anything.

## Expected outputs

A written architecture-impact assessment:

- Affected boundaries/modules
- Data/runtime flow summary for the change
- Risks (ranked)
- Security-sensitive areas touched
- Open questions
- Handoff recommendation: the `devops-review` skill for infra/CI-specific
  detail, `core/sdlc/rollback-plan.md` for a full rollback procedure when the
  change is stateful or production-impacting

## Safety rules

- No code, config, or infrastructure changes.
- No deployment actions.
- Never read, print, or commit secrets.
- Flag but do not resolve any auth/permission/tenant-isolation weakening —
  that requires explicit approval per `core/standards/security.md`.

## Things not to do

- Don't re-run a full DevOps checklist here — hand off to `devops-review`
  for CI/CD and infra-specific mechanics.
- Don't write a step-by-step rollback procedure here — hand off to
  `core/sdlc/rollback-plan.md`.
- Don't wave through risks without listing them.
- Don't guess at scaling/capacity numbers not evidenced in the repo or docs.

## Final response format

- Summary of the proposed change
- Affected boundaries
- Risks (ranked, with rationale)
- Open questions
- Recommended handoff stage(s)
