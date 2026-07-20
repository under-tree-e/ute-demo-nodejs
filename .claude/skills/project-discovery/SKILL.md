---
name: project-discovery
description: Analyze a new or existing project to establish baseline understanding of its stack, structure, and docs. Entry-point skill — run first on any project this repo is installed into, before planning or implementing anything.
---
# Project Discovery

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/project-discovery/SKILL.md`, `adapters/codex/skills/project-discovery/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/project-discovery.md`. Read it before running
this skill — this file only adds the Claude-specific wrapper.

## Goal

Build (or refresh) the baseline understanding of a project: stack,
structure, build/test/deploy tooling, and where documentation is missing.

## Inputs

Repo layout, package manifests, CI/CD config, Dockerfiles, infra-as-code,
`.env.example` (names only), existing `docs/`, existing `features/`. Full
list: `.agents/core/sdlc/project-discovery.md`.

## Process

1. Read `.agents/core/sdlc/project-discovery.md` in full.
2. Walk the repo, confirm stack/framework from manifests (not folder names).
3. Extract real build/test/lint/deploy commands — never invent ones.
4. Compare findings against existing `docs/*.md`; note gaps as open
   questions, not guesses.
5. Run CI/CD discovery — classify the project's CI/CD model and recommended
   pipeline owner per the "CI/CD discovery" section of
   `.agents/core/sdlc/project-discovery.md`. Do not propose or scaffold pipeline
   files; classify only.
6. Detect which `.agents/core/standards/*` and `.agents/core/archetypes/*` apply to this
   project: check repo shape against `.agents/core/standards/repository.md` and
   `.agents/core/standards/repository-architecture.md`, and match the stack to the
   matching `.agents/core/archetypes/<type>/`. Record the applicable set — do not
   restate their content.
7. Create/update the docs listed below with real findings — there is no
   starter template file; see `.agents/core/sdlc/project-discovery.md`'s "Expected
   outputs" for the expected section shape of each doc.

## Required outputs

`docs/product-overview.md`, `docs/architecture.md`, `docs/environments.md`,
`docs/ci-cd.md` (including the CI/CD model + recommended pipeline owner
classification), and `docs/operations.md` when relevant — with real
findings, plus a summary, key findings, open questions, and a recommended
next skill.

## Safety constraints

Read-only exploration. No code/config/dependency changes. No deployment
actions. Never read, print, or commit secret values — variable names only.

## References

- `.agents/core/sdlc/project-discovery.md` — full process, including expected section shape per doc
- `.agents/core/archetypes/` — stack-specific overlays once the project type is known; pick the matching `<type>/` for this project's stack
- `.agents/core/standards/ci-cd.md` — CI/CD ownership model this discovery classifies against
- `.agents/core/standards/repository.md` — repo-shape expectations to check this project against
- `.agents/core/standards/repository-architecture.md` — repo-architecture expectations to check this project against

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
