# Feature Planning

Canonical procedure behind the `feature-plan` skill.

## Purpose

Create or update a feature folder under `features/` from an idea, change
request, bug, refactor, documentation task, infrastructure task, or CI/CD
task — before implementation, whenever work needs requirements, acceptance
criteria, risks, and documentation impact spelled out.

## Inputs

- User idea/request
- Existing docs
- Existing code conventions
- Existing feature folders

## Required output structure

```text
features/FXXX-short-name/
  feature.md
  requirements.md
  acceptance-criteria.md
  implementation-plan.md
  risks.md
  docs-impact.md
```

Starter shapes for each file are bundled with the `feature-plan` skill
itself (`skills/feature-plan/templates/`) — installed automatically with
the skill, no separate template tree to opt into.

## Process

1. Read the project's durable agent guidance (`CLAUDE.md` and/or
   `AGENTS.md`).
2. Read relevant docs, especially `docs/product-overview.md`,
   `docs/architecture.md`, `docs/environments.md`, and `docs/ci-cd.md` when
   they exist.
3. Inspect existing feature folders to follow naming and format.
4. Create a concise but complete feature plan.
5. Do not change production code.
6. Mark assumptions and open questions explicitly.

## Rules

- No code changes in this stage.
- No deployment actions.
- No secrets.
- Ask questions only if implementation would be unsafe or materially
  ambiguous.
- Prefer useful concrete acceptance criteria over generic statements.
