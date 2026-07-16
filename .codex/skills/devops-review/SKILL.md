---
name: devops-review
description: Review Terraform, Ansible, Docker, Jenkins, GitHub Actions, Semaphore, deployment, infrastructure, or server operation changes for correctness, risk, validation, and rollback.
---
# UTE DevOps Review

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/devops-review/SKILL.md`, `adapters/codex/skills/devops-review/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Use for infrastructure and delivery pipeline changes. There is no dedicated
`.agents/core/sdlc/` file for this one — it draws on `.agents/core/archetypes/devops-infra/`
and `.agents/core/standards/security.md`.

## Goal

Review infra/CI/CD/deployment changes for risk, validation coverage, and
rollback path before they ship.

## Inputs

The diff/change under review, affected environment, deployment manifests,
CI/CD config.

## Process

1. Read `.agents/core/archetypes/devops-infra/rules.md` and
   `.agents/core/archetypes/devops-infra/validation.md` if the project matches that
   archetype.
2. Read `.agents/core/standards/ci-cd.md` for the CI/CD ownership model, and
   `.agents/core/standards/jenkins.md` for Jenkins-specific pipeline standards when
   the change touches a `Jenkinsfile` or Jenkins shared library.
3. Work through the review checklist below against the actual change.
4. Do not run apply/deploy/destroy commands unless explicitly requested.

## Required outputs

Findings against: affected environment, state impact, secrets impact,
network/security exposure, deployment impact, rollback path, validation
commands, idempotency, drift risk, observability/logging impact, failure
modes.

CI/CD boundary checks (see `.agents/core/standards/ci-cd.md` and, for Jenkins
changes, `.agents/core/standards/jenkins.md`):

- Pipeline logic is not duplicated in the application repo (no custom
  reusable workflow reimplementing what `ute-ci-templates` already
  provides, no Jenkins steps copy-pasted instead of pulled from
  `ute-jenkins-library`) — unless an explicit, documented exception exists.
- If GitHub Actions: the workflow calls an approved reusable workflow from
  `ute-ci-templates` rather than defining pipeline steps inline.
- If Jenkins: the `Jenkinsfile` uses an approved shared library from
  `ute-jenkins-library` rather than inlining pipeline steps.
- Build and deploy are separated — a build/test stage does not also push to
  a production target in the same undifferentiated step.
- Secrets are not passed via plain environment variables or files committed
  or logged anywhere in the pipeline — they come from a secret manager/CI
  secret store, referenced, never inlined.
- Deployment is not triggered directly from an AI-agent process — it runs
  through the pipeline or a human-invoked deployment tool
  (`ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`).
- A rollback strategy exists for this change (see `rollback-plan`).
- The CI/CD owner repo for this project is documented in `docs/ci-cd.md`
  (see `project-discovery`).

## Safety constraints

No apply/deploy/destroy/production commands unless explicitly requested and
the rollback path is clear — see `.agents/core/standards/security.md`.

## References

- `.agents/core/archetypes/devops-infra/` — stack-specific detail
- `.agents/core/standards/ci-cd.md` — CI/CD ownership boundaries this review checks against
- `.agents/core/standards/jenkins.md` — Jenkins-specific pipeline standards this review checks against
- `.agents/core/sdlc/architecture-review.md` — pre-implementation counterpart for infra changes
- `rollback-plan` (`.agents/core/sdlc/rollback-plan.md`) — rollback plan handoff

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
- UTE standards gaps:
- Recommended updates to `ute-agent-standards`:
- Items that belong to other UTE repositories:
- Follow-up questions, if any:
