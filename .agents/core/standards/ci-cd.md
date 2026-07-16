# CI/CD Standard

## Purpose

`ute-agent-standards` is an AI-agent governance layer, not a CI/CD
implementation repo. It defines *rules, skills, checklists, and SDLC
process* — it does not own pipeline definitions, runners, or deployment
execution. Dedicated repos own those (see Ownership below).

CI/CD itself exists to be an automated quality gate: check, build, and
controlled delivery before merge/release/deploy. **CI checks technical
correctness (build, lint, types, tests); it does not replace human code
review of logic, architecture, and risk.** See
`core/standards/git/code-review.md` for the review checklist — a green
pipeline is a precondition for merge, not a substitute for a reviewer
reading the diff.

## Applies To

- Every consuming UTE project with a CI/CD pipeline (GitHub Actions,
  Jenkins, or a documented project-specific exception).
- Pull requests, branch pushes, merges to `main`, release-tag creation, and
  deploys in those projects.
- Agent behavior when reviewing diffs, assessing release readiness, or
  advising on pipeline/deploy setup.

## Does Not Cover

Pipeline implementation itself. Ownership:

| Concern | Owner | Not here |
| --- | --- | --- |
| GitHub Actions reusable workflows | `ute-ci-templates` | This repo must not ship installable `.github/workflows/*` |
| Jenkins shared library / reusable pipeline primitives | `ute-jenkins-library` | This repo must not ship Jenkinsfiles or pipeline steps as installable templates |
| Jenkins controller/images/config | `ute-jenkins` | Runtime and controller config live there, not here |
| Deployment/provisioning execution | `ute-ansible`, `ute-automation` | This repo never runs deployments |
| Infrastructure | `ute-infra` (Terraform) | This repo never defines infrastructure |
| Desired-state / GitOps | `ute-gitops` | This repo never declares desired cluster state |

### Supported delivery paths

Every consuming project's CI/CD falls into one of these paths (see
`core/sdlc/project-discovery.md` for how an agent determines which one
applies), or an explicit, documented exception (see below).

**GitHub Actions** — owner `ute-ci-templates`. A project on this path calls
reusable workflows from `ute-ci-templates` rather than defining pipeline
logic inline.

**Jenkins** — owner `ute-jenkins-library` + `ute-jenkins`. A project on this
path calls shared library steps from `ute-jenkins-library`; `ute-jenkins`
owns the controller/agent/runtime that executes it.

**Deployment execution** — owner `ute-ansible` / `ute-automation` /
`ute-infra` / `ute-gitops`. Once a build/test pipeline produces an artifact
or image, the actual deployment — running Ansible, applying Terraform, or
reconciling GitOps state — happens in these repos, never inline in the
application repo's pipeline or in an AI-agent process.

Also out of scope: release-tag/versioning conventions in detail (see
`core/standards/git/tags.md`, `core/standards/git/releases.md`) and rollback
plan content in detail (see `core/sdlc/rollback-plan.md` / `rollback-plan`
skill) — this standard cross-references both, it doesn't restate them.

## Source Documents

- CI-CD memo (internal UTE memo, status: **On Review** at time of ingestion)
  — day-to-day rulebook defining CI triggers, required checks, merge/deploy
  gates, release-tag convention, standard workflow, readiness checklist, and
  forbidden practices. Diagrams in the source (PR flow, release flow) are
  conceptual sequences, not pipeline code — they are represented below as
  checklists, not copied as YAML/Groovy. See `excludedCiCdContent` for what
  was intentionally left out of this standard.

## Required Rules

**Triggers** — CI must run automatically on:

- push to `feature/*`, `fix/*`, `hotfix/*`, `refactor/*`, `docs/*`, `chore/*`
- Pull Request creation and every PR update
- merge to `main`
- release-tag creation
- manual trigger, reserved for documented exceptions only

**Required checks** (fail-fast — pipeline stops at first critical error):

- dependency install
- lint/format check
- type check, if the project is typed
- unit tests
- build verification

**Merge gate** — a PR must not be merged unless *all* of the following are
green:

- [ ] CI is green and the pipeline has completed
- [ ] all required checks passed
- [ ] the PR branch is up to date with `main`
- [ ] no blocking review comments remain
- [ ] reviewer approval exists

CI passing is necessary, not sufficient — see Purpose above and
`core/standards/git/code-review.md`.

**Responsibility split**:

| Role | Responsible for |
| --- | --- |
| Developer | fixing CI failures in their own PR |
| Reviewer | logic, architecture, and risk — not just CI status |
| CI/CD system | automatically checking quality, build, and rules |

**CD / deploy**:

- Deploys go through the pipeline only — never ad hoc, never from a local
  machine.
- Environment tiers, each with a distinct purpose: dev (fast integration
  check) → test/QA (functional check) → staging (pre-production check) →
  production (live).
- Promotion between environments is sequential per this tier order; don't
  skip a tier for a production-bound change.
- A production deploy requires at least one of: release tag, manual
  approval, protected branch/tag, restricted operator list, or a documented
  rollback plan.
- Every release with production impact needs a documented rollback plan
  before it ships — see `rollback-plan` skill / `core/sdlc/rollback-plan.md`.
  Do not restate rollback content here; cross-reference it.

**Release tags** — use git tags, never commit messages or branch names, to
mark a release. Full format/process detail lives in
`core/standards/git/tags.md` and `core/standards/git/releases.md`; the
CI/CD-relevant summary:

- an RC tag deploys to staging/client-staging
- a final release tag deploys to production only after confirmation

**Standard workflow** — apply uniformly: ticket → branch → push → CI
pipeline → draft PR → CI validation → ready for review → review → merge →
deploy → release tag (if a release is needed).

**Branch/repo hygiene**:

- `main` is protected by required checks.
- Secrets are never stored in the repository or hardcoded in pipeline
  config.

## Recommended Rules

- Add integration tests, e2e tests, static analysis, security scan,
  dependency checks, container scan, and coverage reporting as additional
  CI checks when the project's risk profile calls for them.
- Treat any CI/CD bypass as an exceptional path, not routine — it needs a
  named, accountable decision-maker and a documented reason (ADR or the
  feature's `risks.md`).

## Forbidden Patterns

- Do not merge with failed/red CI.
- Do not merge without a completed pipeline, or by skipping required
  checks.
- Do not deploy from a local machine or by any path that bypasses the
  pipeline.
- Do not perform a production deploy without a release tag or an
  equivalent approval.
- Do not store secrets in the repository or hardcode tokens directly in
  pipeline configuration.
- Do not bypass CI/CD without documenting the reason.

## Agent Must Check

- Treat `.github/workflows/`, `Jenkinsfile`, `.semaphore/`, and similar
  pipeline definitions in a *consuming* project as belonging to
  `ute-ci-templates` / `ute-jenkins-library` conventions, not as something
  to author from scratch or copy in from this repo.
- When a project needs CI/CD set up, point to the relevant dedicated repo
  instead of generating pipeline YAML/Groovy inline, unless the user
  explicitly asks for a one-off/local script.
- When reviewing a diff, flag pipeline logic duplicated inside an
  application repo (custom reusable workflows reimplementing what
  `ute-ci-templates` already provides, or shared Jenkins steps copy-pasted
  instead of pulled from `ute-jenkins-library`) as a standards violation
  needing an explicit, documented exception.
- Before returning a release-readiness "ready" verdict, check: pipeline
  runs on PR; `main` protected by required checks; lint/format check
  present; type check present if the project is typed; unit tests present;
  build verification present; failed CI blocks merge; deploy only via
  pipeline; production deploy has a release tag or approval; secrets not
  stored in repo; a rollback approach is documented (see
  `core/sdlc/release-readiness.md`, `core/sdlc/rollback-plan.md`).
- Confirm the merge-gate checklist above is actually satisfied before
  suggesting a PR is mergeable — don't infer "green" from partial signal.

Agents may:

- Ship validation *scripts* (`scripts/validate-*.sh`, `scripts/check-*.sh`)
  that are plain shell and CI-agnostic by design — any CI system can invoke
  them. Shipping the scripts is not the same as owning the pipeline that
  calls them.
- Install only agent-facing files into a consuming project via
  `install-agent-standards.sh`: `CLAUDE.md`/`AGENTS.md`, `.claude/`/`.codex/`
  (rules, skills — including each skill's own bundled resources, e.g.
  `feature-plan/templates/`, hooks). This repo does not ship, and no install
  path installs, project-scaffolding docs templates, GitHub issue/PR
  templates, or CI/CD workflow examples — see "Agent Must Not Do" below.

## Agent Must Not Do

- Must not author pipeline YAML/Groovy from scratch as a default action —
  that's `ute-ci-templates`'/`ute-jenkins-library`'s job, not this repo's or
  an agent's improvisation.
- Must not have `scripts/install-agent-standards.sh` write
  `.github/workflows/`, a `Jenkinsfile`, a `CODEOWNERS` file, project-doc
  scaffolding (e.g. `docs/architecture.md`), or a GitHub issue/PR template
  into a consuming project — this repo installs only agent-facing content
  (`CLAUDE.md`/`AGENTS.md`, `.claude/`/`.codex/`). CODEOWNERS and CI/CD
  pipeline definitions are project/team governance and dedicated-repo
  concerns respectively, never this repo's.
- Must not let duplicated pipeline logic in an application repo pass review
  silently — an application repo may embed its own pipeline logic instead
  of using `ute-ci-templates`/`ute-jenkins-library` only with an explicit,
  documented exception (recorded in an ADR or the feature's `risks.md`),
  never as a silent default.
- Must not execute a production deployment, rollback, or infrastructure
  apply/destroy directly from an AI-agent process — that belongs to
  `ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops` tooling, run by a
  human or by the pipeline itself, not by the agent.
- Must not treat a green CI run as equivalent to a completed code review,
  or wave a change through on CI status alone.
- Must not confirm a release/production deploy as ready without verifying a
  release tag or approval exists and a rollback plan is documented.

## Related Skills

- `rollback-plan` / `core/sdlc/rollback-plan.md`
- `release-readiness` / `core/sdlc/release-readiness.md`
- `devops-review`
- `change-audit` / `core/sdlc/change-audit.md`
- `docs-sync`

## Related Archetypes

N/A — CI/CD gating rules in this standard apply uniformly across
`core/archetypes/*`; no archetype currently overrides them. Archetype docs
may add stack-specific required checks (e.g. a linter for that language) on
top of, not instead of, this standard.

## Related UTE Repositories

- `ute-ci-templates` — GitHub Actions reusable workflows
- `ute-jenkins-library` — Jenkins shared library / pipeline primitives
- `ute-jenkins` — Jenkins controller/agent/runtime
- `ute-ansible`, `ute-automation` — deployment/provisioning execution
- `ute-infra` — infrastructure (Terraform)
- `ute-gitops` — desired-state / GitOps

## Required project documentation

Every consuming project must have a `docs/ci-cd.md` (produced/maintained by
`project-discovery`, see `core/sdlc/project-discovery.md`) that states:

- **CI/CD model** — GitHub Actions, Jenkins, both, unknown, or a documented
  project-local exception.
- **Recommended/actual pipeline owner** — `ute-ci-templates`,
  `ute-jenkins-library`, or the documented project-specific exception (with
  its ADR/`risks.md` reference).
- Build/test/deploy commands actually used, and where the deployment step
  hands off to `ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`.

## Release readiness expectations

Pipeline ownership must be unambiguous before a release ships — this is a
release gate, not a suggestion (see `core/sdlc/release-readiness.md`):

- GitHub Actions via approved `ute-ci-templates` reusable workflows, or
- Jenkins via approved `ute-jenkins-library` shared library steps, or
- a documented project-specific exception (ADR/`risks.md`).

Absent one of these, `release-readiness` must not return a plain "ready"
verdict. In addition, a release must not be marked ready unless the merge
gate and production-deploy control conditions in Required Rules above are
actually met, and a rollback plan is documented.

## Open Questions

- Source memo status was **On Review**, not finalized — rules here may
  still change once the memo is adopted as authoritative; re-check on next
  ingestion pass.
- The memo doesn't name which CI system (GitHub Actions, Jenkins, etc.)
  implements a given project's pipeline — mapping a specific rule to
  `ute-ci-templates` vs `ute-jenkins-library` requires the project's own
  `docs/ci-cd.md`, not inference from this standard alone.
- "Exceptional cases" justifying a manual CI run, and a documented CI/CD
  bypass, are not defined in the source — approval authority and
  documentation format need a human decision.
- "Required checks" and "blocking comments" are referenced as merge gates
  but not enumerated per project/language in the source — likely needs a
  per-archetype definition in `core/archetypes/*`.
