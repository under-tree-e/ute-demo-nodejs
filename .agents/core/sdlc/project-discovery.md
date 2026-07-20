# Project Discovery

Canonical procedure behind the `project-discovery` skill.

## Purpose

Build (or refresh) the baseline understanding of a project: what it is, what
stack it runs, how it's built/tested/deployed, and where documentation is
missing.

## When to use

- First pass on a project after an agent adapter is installed.
- Project docs are missing, empty, or clearly stale.
- Before architecture review, feature planning, or any non-trivial change on
  an unfamiliar codebase.

## Inputs to inspect

- Repo root layout, `README*`, existing `docs/`, `CLAUDE.md`/`AGENTS.md`
- Package manifests: `package.json`, `pyproject.toml`/`requirements*.txt`,
  `go.mod`, `*.csproj`, `Gemfile`, etc.
- Build/test/lint tooling: npm/yarn/pnpm scripts, Makefile, Taskfile,
  tox/nox config
- CI/CD config: `.github/workflows/`, `Jenkinsfile`, `.semaphore/`, other
  pipeline definitions
- Containerization: `Dockerfile*`, `docker-compose*`, `.dockerignore`
- Infra/deployment: Terraform, Ansible, Helm, k8s manifests, Procfile
- Database: migration folders, ORM config, connection var *names* (not
  values)
- Env/config: `.env.example`, config loaders — variable names only
- Existing feature folders under `features/`, if present

## Process

1. Walk the repo tree to map top-level structure; identify likely project
   type(s) — do not assume from repo name alone.
2. Open manifests/lockfiles to confirm language, framework, package manager.
3. Locate entry points (main/server/index/cmd files, Dockerfile
   `ENTRYPOINT`/`CMD`).
4. Extract real build/test/lint commands from scripts/Makefile/CI — do not
   invent commands that aren't defined anywhere.
5. Detect Docker, CI/CD provider(s), infra-as-code, deployment targets,
   database technology.
6. Check `.env*` files for required config surface — variable names only,
   never values.
7. Compare findings against any existing `docs/*.md` — note what's missing,
   outdated, or contradicted by the code.
8. Run CI/CD discovery (below) and record the result in `docs/ci-cd.md`.
9. Create or update the docs below with concrete findings. Where something
   can't be determined from the repo, write it as an explicit open question
   instead of guessing.

## CI/CD discovery

Determine the project's CI/CD model — do not propose creating a pipeline as
part of discovery; see `core/standards/ci-cd.md` for the ownership model
this classification feeds into.

Check for:

- `.github/workflows/*`
- `Jenkinsfile`
- Makefile / Taskfile / `package.json` scripts that wrap build/test/deploy
- `Dockerfile` / `docker-compose*`
- `docs/ci-cd.md` (existing)
- `sonar-project.properties`
- `deploy/` or `infra/` directories

Classify and record in `docs/ci-cd.md`:

```text
CI/CD model:
- GitHub Actions
- Jenkins
- both
- unknown
- project-local exception

Recommended pipeline owner:
- ute-ci-templates
- ute-jenkins-library
- project-specific exception (must cite an ADR or risks.md entry)
```

Do not generate or propose new workflow/pipeline files as an output of this
skill — discovery only classifies what exists and who should own it going
forward.

## Expected outputs

Create or update, with real findings (not blank templates). There is no
starter template file to copy — this repo ships agent rules/skills/process
only, not project-scaffolding docs (see `core/standards/ci-cd.md`); the
section lists below are the expected shape, to write directly from
findings:

- `docs/product-overview.md` — Purpose, Users, Main workflows, Non-goals,
  Current status.
- `docs/architecture.md` — Overview, Components, Data flow, External
  integrations, Environments, Security model, Deployment model,
  Observability, Known limitations.
- `docs/environments.md` — Local, Dev, Stage, Production (or the project's
  actual tier names), Secrets and configuration, Access model.
- `docs/ci-cd.md` — CI/CD model, Pipeline owner, Source control flow,
  Build, Test, Image/package publishing, Deployment, Rollback, Required
  credentials — see "CI/CD discovery" above and `core/standards/ci-cd.md`'s
  "Required project documentation" section.
- `docs/operations.md` — Health checks, Logging, Metrics and alerts, Backup
  and restore, Runbooks, Known failure modes — when relevant (project has
  deployable/running services); otherwise skip with a note.

## Safety rules

- Read-only exploration — no code, config, or dependency changes.
- No deployment or infrastructure actions.
- Never read, print, or commit secret values — env var names only.
- Never state something about the project as fact unless verified in the
  repo; mark it as an open question otherwise.

## Things not to do

- Don't assume stack/framework from folder names, repo name, or habit —
  verify from manifests/code.
- Don't leave template headings with no content and call it done.
- Don't invent build/test/deploy commands that don't exist in the repo.
- Don't touch `features/`, application code, or CI config.
- Don't generate, scaffold, or propose new `.github/workflows/*` or
  `Jenkinsfile` content as a discovery output — classify the existing CI/CD
  model and recommended owner repo only (`core/standards/ci-cd.md`).

## Final response format

- Project type/stack summary (one paragraph)
- Docs created/updated (file list)
- Key findings per doc (bullets)
- Open questions / unknowns
- Recommended next stage (usually architecture review or feature planning)
