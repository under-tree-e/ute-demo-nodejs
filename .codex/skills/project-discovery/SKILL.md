---
name: project-discovery
description: Analyze a new or existing project to establish baseline understanding of its stack, structure, and docs. Entry-point skill — run first on any project this repo is installed into, before planning or implementing anything.
---
# Project Discovery

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/project-discovery/SKILL.md`, `adapters/codex/skills/project-discovery/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Build (or refresh) the baseline understanding of a project: what it is,
its stack, how it's built/tested/deployed, and where documentation is
missing.

## When to use

- First pass on a project after an agent adapter is installed.
- Project docs are missing, empty, or clearly stale.
- Before architecture review, feature planning, or any non-trivial change
  on an unfamiliar codebase.

## Inputs

Repo root layout, `README*`, `docs/`, `CLAUDE.md`/`AGENTS.md`; package
manifests (`package.json`, `pyproject.toml`/`requirements*.txt`, `go.mod`,
`*.csproj`, `Gemfile`, …); build/test/lint tooling (scripts, Makefile,
Taskfile, tox/nox); CI/CD config (`.github/workflows/`, `Jenkinsfile`,
other pipelines); `Dockerfile*`, `docker-compose*`; Terraform, Ansible,
Helm, k8s manifests; migrations, ORM config, connection variable *names*;
`.env.example` and config loaders (names only).

## Process

1. Walk the repo tree to map top-level structure; identify project type(s)
   from manifests and code, never from folder or repo names.
2. Confirm language, framework, and package manager from manifests and
   lockfiles.
3. Locate entry points (main/server/index/cmd, Dockerfile
   `ENTRYPOINT`/`CMD`).
4. Extract real build/test/lint/deploy commands — never invent ones.
5. Detect Docker, CI/CD provider(s), infra-as-code, deployment targets,
   database technology.
6. List the config surface from `.env*` — variable names only.
7. Compare findings against existing `docs/*.md`; note what's missing,
   outdated, or contradicted by the code — as open questions, not guesses.
8. Run CI/CD discovery (below) and record it in `docs/ci-cd.md`.
9. Detect which `.agents/core/standards/*` and `.agents/core/archetypes/*` apply: check repo
   shape against `.agents/core/standards/repository.md` and
   `.agents/core/standards/repository-architecture.md`, match the stack to a
   `.agents/core/archetypes/<type>/`. Record the applicable set without restating
   it.
10. Create or update the docs below with concrete findings; write anything
    that can't be determined as an explicit open question.

## CI/CD discovery

Classify only — never generate or propose `.github/workflows/*` or
`Jenkinsfile` content. Check `.github/workflows/*`, `Jenkinsfile`,
Makefile/Taskfile/`package.json` build/deploy wrappers, `Dockerfile` /
`docker-compose*`, existing `docs/ci-cd.md`, `sonar-project.properties`,
`deploy/` or `infra/`. Record in `docs/ci-cd.md`:

```text
CI/CD model: GitHub Actions | Jenkins | both | unknown | project-local exception
Recommended pipeline owner: ci-templates | jenkins-library |
  project-specific exception (must have an entry in docs/architecture.md
  "Exceptions" — core/standards/knowledge-governance.md)
```

## Required outputs

Create or update with real findings — there is no template file; these are
the expected sections:

- `docs/product-overview.md` — first paragraph: the project essence in one
  or two sentences (what it is, who uses it), which `feature-plan` reuses
  so the user never retypes it; then Purpose, Users, Main workflows,
  Non-goals, Current status.
- `docs/architecture.md` — Overview, Components, Data flow, External
  integrations, Environments, Security model, Deployment model,
  Observability, Known limitations, Constraints, Exceptions — current
  state only, updated per `.agents/core/standards/knowledge-governance.md`
  "Architecture document".
- `docs/environments.md` — each real tier (Local/Dev/Stage/Production or the
  project's names), Secrets and configuration, Access model.
- `docs/ci-cd.md` — CI/CD model, Pipeline owner, Source control flow, Build,
  Test, Image/package publishing, Deployment, Rollback, Required
  credentials, and **Local gates**: the exact commands (tests, type check,
  lint, build) that `implementation-pass` and `change-audit` run before
  and during audit, taken from what the repository actually defines
  (`.agents/core/standards/ci-cd.md` "Required project documentation").
- `docs/operations.md` — Health checks, Logging, Metrics and alerts, Backup
  and restore, Runbooks, Known failure modes — only when the project runs
  services; otherwise skip with a note.

Then reply with: stack summary (one paragraph), docs created/updated, key
findings per doc, open questions, recommended next skill (usually
`architecture-review` or `feature-plan`). Never leave template headings
empty.

## Safety constraints

Read-only exploration: no code, config, dependency, CI, or `features/`
changes. No deployment or infrastructure actions. Never read, print, or
commit secret values — variable names only. Never state something as fact
unless verified in the repo.

## References

- `.agents/core/archetypes/` — stack-specific overlays; pick the matching `<type>/`
- `.agents/core/standards/ci-cd.md` — CI/CD ownership model
- `.agents/core/standards/repository.md`, `.agents/core/standards/repository-architecture.md` — repo-shape expectations
