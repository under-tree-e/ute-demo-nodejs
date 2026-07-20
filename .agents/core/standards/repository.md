# Repository Standard

## Purpose

A repository must be self-sufficient: a new developer (or agent) can
understand what it is, run it locally, and open a PR without verbal
explanation, private notes, or undocumented manual steps.

## Applies To

- Every repository, regardless of stack (Node.js, Angular, npm
  package, infra, docs-only, deployment).
- New repositories at creation time, and existing repositories during
  `project-discovery`/readiness checks.

## Does Not Cover

- Mono/multi/split-repo decisions.
- Git branching/commit rules — see `core/standards/git/branching.md`,
  `core/standards/git/commits.md`.
- PR process and template content — see
  `core/standards/git/pull-requests.md`.
- Full frontend/backend code structure — see `core/archetypes/`.
- CI/CD pipeline implementation — see `core/standards/ci-cd.md`.

## Source Documents

- Repository Standard (company-wide minimum repo standard).
- Repository Template Blueprint (base template + optional profiles).

## Required Rules

### Naming

- Format: `<company>_<name>.<platform>`, all lowercase.
- Platform suffix must match the repo's actual technical role (e.g.
  `.angular`, `.ngx`, `.node`, `.ionic`, `.python`, `.npm`, `.infra`,
  `.docs`).
- Repo name and package name must be logically related (not necessarily
  identical).

### Mandatory files (every repository)

| File | Purpose |
| --- | --- |
| `README.md` | Single entry point — see Docs Expectations below |
| `.gitignore` | Excludes local/secret/build artifacts |
| `.editorconfig` | Baseline editor consistency |
| `.prettierrc.json` | Formatting config |
| `.prettierignore` | Formatting exclusions |
| `LICENSE` | Legal status, even for private repos |
| CI config (`Jenkinsfile` or `.github/workflows/*`) | See `core/standards/ci-cd.md` — this file states checks only |
| PR template (`.github/pull_request_template.md`) | See `core/standards/git/pull-requests.md` |

### README (single entry point)

- README is the main entry point — it must not be a purely formal file
  with no practical usefulness.
- Minimal 8-section structure: Purpose, Local Setup, Configuration,
  Commands, Integrations, CI/CD, Deployment, Troubleshooting.
- Must describe: what the repo is, why it exists, how to run it locally,
  required env/config variables, commands used, integrations, how to run
  tests/build, and how/where deployment is described.
- Full content rules live in `core/standards/documentation.md` — do not
  restate them here, follow them.

### Environment/config example

- Mandatory whenever the repo needs env vars/runtime config to
  run/build/deploy: backend/API/service repos, docker/deployment/infra
  repos with variables, frontend apps with runtime config.
- Not needed: Angular app using standard `environment.ts`, Angular
  library/npm package/SDK without runtime config, docs-only repo.
- Values in the example file must stay empty/mock/local-only — never
  real or production values.
- Required config variables must be documented in README.
- Secrets go in a secret manager/Vault/CI credentials store, never
  committed. Local `.env` files must be listed in `.gitignore`.

### LICENSE and package metadata

- Every repository must have a `LICENSE` stating its legal status, even
  if private.
- `package.json.license` must match the `LICENSE` file.
- Node.js/Angular/npm repos: `package.json` must include `name`,
  `version`, `private`, `description`, `author`, `contributors`,
  `license`, `scripts`, plus `engines`/`packageManager`/`repository` when
  relevant.
- `description` must not be empty or purely formal.
- `private` must be set correctly (`true` for apps/private repos, to
  prevent accidental publish).
- If the repo has CI, `package.json.scripts` must define the commands CI
  actually invokes.
- Metadata must be kept up to date, not left stale.

### CI/CD expectations (checks only — not implementation)

- Every repository must have a CI config in place; what it must check,
  who owns the pipeline definition, and what an agent may/must not do
  with pipeline files is defined in `core/standards/ci-cd.md` — follow
  that document, do not restate its rules here.
- Minimum checks every repo's pipeline must run: install dependencies,
  lint/format check, type check (if applicable), unit tests (if
  applicable), build verification, artifact generation (if applicable).
- Production repos additionally require: security scan, dependency
  check, container scan (if Docker is used), static analysis (e.g.
  SonarQube, if integrated), release/deployment pipeline.
- This standard never specifies pipeline syntax (YAML/Groovy) — that
  belongs to `ute-ci-templates`/`ute-jenkins-library` per
  `core/standards/ci-cd.md`.

### Pull requests

- Every repository must have a PR template at
  `.github/pull_request_template.md`.
- Section content, required fields, and process rules are owned by
  `core/standards/git/pull-requests.md` — this file only requires that
  the template file exists.

### Formatting/quality tooling

- Every repo enforces `.editorconfig`, `.prettierrc.json`,
  `.prettierignore`, a formatter command, and a lint command if a linter
  is configured.
- CI checks formatting automatically — do not rely on manual review.

### Branch protection and ownership

- `main` must have branch protection: no direct push, merge only via PR,
  required CI checks, minimum 1 approval, squash merge as default,
  delete branch after merge.
- Production/critical repos additionally require: CODEOWNERS, 2
  approvals for critical areas, protected tags, restricted access to
  secrets, access audits.
- Every repository must have a clearly defined owner (tech lead, team,
  platform owner, or dev lead) accountable for README, config examples,
  LICENSE, package metadata, PR template, CI/CD health, base structure,
  removing stale files, and CODEOWNERS updates.

## Recommended Rules

- Recommended files for team/production/long-lived repos: `CODEOWNERS`,
  `CONTRIBUTING.md`, `CHANGELOG.md`, `.gitattributes`, `docs/`,
  `sonar-project.properties`, `SECURITY.md`.
  - `CODEOWNERS` when the repo has real ownership/critical areas, and
    must reflect real owners — never a placeholder.
  - `CONTRIBUTING.md` when team-based or open to contractors.
  - `SECURITY.md` when production-facing, client-facing, or a published
    package.
  - `CHANGELOG.md` when release history is maintained.
  - `.gitattributes` when stable Git behavior is required.
- Optional files (`Dockerfile`, `docker-compose.yml`, `VERSION`,
  `.env.example`, `config.example.json`, `.npmrc`,
  `commitlint.config.*`, `infra/`, `scripts/`) — add only when the repo
  actually uses that technology/process (see Forbidden Patterns).
- `package.json` should include a custom `internal` metadata block
  (`type`, `platform`, `area`, `owner`, `visibility`, `ci`, `deployable`)
  so internal tooling can identify repo characteristics without asking a
  developer.
- Client-specific repos may use a client/project prefix in the name.
- Standardize on one word-separator style (underscore) across repo
  names.
- `scripts/` for repeatable local/CI commands: names in English,
  idempotent where possible, no secrets, must work both locally and in
  CI, documented in README.
- `docs/` when the repo has architecture/deployment/integrations/
  decisions content that doesn't fit README — README links to `docs/`,
  it does not duplicate it (see `core/standards/documentation.md`).

## Forbidden Patterns

- No repository without a README or without a LICENSE.
- No mandatory runtime/env config requirement without a corresponding
  example file — and no example file with real/production values.
- No secrets committed to the repository; no production credentials in
  example configs.
- No direct push to `main`; no merge without a PR; no merge without a
  passing CI run.
- No repository without a defined owner.
- No chaotic/undocumented directory structure.
- No Node.js-based `package.json` missing `description`, `author`,
  `license`, or `scripts`.
- No optional files added "just in case" without real, current usage —
  e.g. no `Dockerfile` without a real container need, no `.env.example`
  on a package/library with no runtime config, no `Jenkinsfile` unless
  the project uses Jenkins, no GitHub Actions workflow added without
  understanding what it checks, no CODEOWNERS without real accountable
  owners, no scripts nobody runs.
- No Jenkins and GitHub Actions added to the same repo without a clear,
  documented separation of responsibility.
- No local/undocumented instructions that aren't captured in the
  repository itself.
- No generic, ownership-less repository names (`core`, `utils`,
  `new-project`, `test-repo`, `backend`, `frontend`, `final`, `common`).
- No committing `.npmrc` tokens, personal tokens, or mixed
  public/private registry tokens into repository files.

## Agent Must Check

- README exists, is filled (not boilerplate), and covers the 8-section
  structure.
- `.gitignore`, `.editorconfig`, `.prettierrc.json`, `.prettierignore`,
  `LICENSE` are present.
- A CI config file exists at the expected path for the project's chosen
  path (Jenkins or GitHub Actions) — content ownership per
  `core/standards/ci-cd.md`.
- A PR template exists at `.github/pull_request_template.md`.
- If the repo needs runtime/env config, an example file exists, is
  documented in README, and contains no real values.
- No secrets are present in tracked files; `.env` (if any) is
  gitignored.
- `package.json` (if Node/npm) has the required fields filled and
  `license` matches `LICENSE`.
- Optional/recommended files present in the repo actually correspond to
  real, current usage (not leftover scaffolding).
- An owner is identifiable for the repo (doc, CODEOWNERS, or team
  record).

## Agent Must Not Do

- Must not author or install pipeline YAML/Groovy as part of satisfying
  this standard — defer to `core/standards/ci-cd.md` and the owning
  repo.
- Must not add a `Dockerfile`, `.env.example`, `CODEOWNERS`, or any other
  optional/recommended file "just in case" without a real, current need.
- Must not fabricate LICENSE, owner, or CODEOWNERS content — flag as an
  open gap instead of inventing a placeholder that looks authoritative.
- Must not put real/production values into an example config file.
- Must not restate the full rules from `core/standards/ci-cd.md`,
  `core/standards/git/pull-requests.md`, or
  `core/standards/documentation.md` here — cross-reference them.

## Related Skills

- `project-discovery` — establishes baseline repo understanding,
  including readiness gaps against this standard.
- `release-readiness` — gates release on required files/checks being in
  place.
- `docs-sync` — keeps README/docs in sync with changes.

## Related Archetypes

- `core/archetypes/*/recommended-files.md` — stack-specific files beyond
  this base standard (npm-package, angular-app, angular-library,
  nodejs-api, nodejs-cli, nodejs-worker, devops-infra,
  docker-compose-app, erpnext-frappe-app).

## Related Repositories

- `ute-ci-templates` — GitHub Actions pipeline implementation.
- `ute-jenkins-library` / `ute-jenkins` — Jenkins pipeline implementation
  and controller/runtime.
- `ute-ansible` / `ute-automation` / `ute-infra` / `ute-gitops` —
  deployment, infrastructure, and desired-state execution.

## Open Questions

- Source document status was "On Review" (not finalized) — confirm
  whether these rules are adopted or provisional pending sign-off.
- No company-approved SPDX license list exists yet for public npm
  packages.
- No decision rule for which owner role (tech lead/team/platform
  owner/dev lead) applies to which repo type.
- Unclear whether merge strategies other than squash are permitted under
  exceptional, approved circumstances.
- `sonar-project.properties`, `Dockerfile`, and `docker-compose.yml`
  templates from the Repository Template Blueprint are illustrative
  content owned by `ute-ci-templates`/`ute-ansible`/`ute-infra` — this
  repo does not ship them as installable templates; confirm no example
  copies exist elsewhere in this repo that could be mistaken for
  installable ones.
