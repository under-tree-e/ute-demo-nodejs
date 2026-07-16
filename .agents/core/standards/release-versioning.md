# Release & Versioning Standard

## Purpose

Defines how UTE fixes a product's version and moves a change from `main`
to production: Semantic Versioning rules, Git release tags as the single
source of truth, the Release Candidate → final release flow, hotfix
handling, package versioning, release notes, deployment-source
restrictions per environment, and rollback/ownership expectations.

## Applies To

- Every UTE application repo cutting a release (RC, final, or hotfix).
- Every UTE package/library repo publishing a versioned artifact.
- Any agent proposing a version bump, a release tag, a changelog entry, or
  a deployment triggered by a release.

## Does Not Cover

- Git branch/commit rules, PR workflow — see `core/standards/git/branching.md`,
  `core/standards/git/commits.md`, `core/standards/git/pull-requests.md`.
- Human/agent code-review process — see `core/standards/git/code-review.md`.
- Full CI/CD architecture and pipeline ownership — see
  `core/standards/ci-cd.md`.
- Package/module structure and registry conventions beyond versioning —
  see `core/standards/packages-modules.md` (planned; not yet created, see
  Open Questions).
- Rollback plan authoring — see `core/sdlc/rollback-plan.md` / the
  `rollback-plan` skill. This document states *when* a rollback plan is
  required, not how to build one.
- Actual pipeline execution (build, test-gate, artifact publish, deploy,
  post-deploy verification) — that is CI/CD implementation owned by
  `ute-ci-templates` / `ute-jenkins-library` / `ute-jenkins`, and
  deployment execution owned by `ute-ansible` / `ute-automation` /
  `ute-infra` / `ute-gitops`. This document describes the *stages
  conceptually* (what must happen, in what order) so an agent can check
  compliance; it never specifies how a pipeline implements them.

## Source Documents

- Release & Versioning Policy (Draft) — SemVer rules, release-tag-as-
  source-of-truth rule, RC → final release flow, hotfix process, package
  versioning, deployment-source allow-list, rollback expectations, and
  release-role ownership.

## Required Rules

### Version is fixed by the tag, not by agreement

- Fix product version via a Git release tag; never via a commit message,
  a branch name, or a verbal/manual agreement.
- Every release must be reproducible, tied to a specific commit, verified
  via CI, documented, and understandable for rollback.
- Never run a production deploy directly from a feature branch, a local
  machine, or an unknown/untagged commit. A release must come from `main`
  at a tagged commit.

### Semantic Versioning

- Use SemVer (`MAJOR.MINOR.PATCH`) for all release versions.

| Change type | Version segment |
| --- | --- |
| Breaking change | MAJOR |
| Backward-compatible feature | MINOR |
| Bug fix | PATCH |
| Internal-only change with no release | Unchanged |

### Release tags

- Fix every release with a Git tag formatted `vMAJOR.MINOR.PATCH` (see
  `core/standards/git/tags.md` for general tagging mechanics; this
  document is the source of truth for the `vMAJOR.MINOR.PATCH` format and
  the rules below).
- Create release tags only from `main`.
- A release tag must point to a commit that passed CI.
- Never modify a release tag after it is created. If a release was wrong,
  cut a new tag — do not retag.
- Tie production deploy to a release tag; a version-bump commit does not
  substitute for a release tag.

### Release Candidate (RC)

- Format RC tags `vMAJOR.MINOR.PATCH-rc.N`.
- RC is a fixed, testable pre-release version for staging/client-staging —
  not a long-lived branch model.
- Create a final release only after successful verification of `main` or
  an approved RC.

### Release readiness (final release)

Before cutting a final release tag, confirm:

- Required PRs merged to `main`.
- CI green on the commit being tagged.
- Release artifact built.
- Release notes prepared.
- Required staging/client-staging verification done.
- Required production approval obtained.
- Rollback path understood (see `core/sdlc/rollback-plan.md`).

After the final tag is created, the pipeline stage order is (implementation
owned by CI/CD repos — see Related UTE Repositories):

1. Run release-grade checks.
2. Build the release artifact.
3. Publish artifact/image/package.
4. Execute the deployment.
5. Run post-deploy verification.

### Hotfix release

- Use hotfix release only for critical production fixes, kept minimal in
  scope. Do not use it for ordinary feature or refactor work.
- Hotfix changes must go through: minimal fix only, priority review,
  mandatory CI, merge only via PR, and (usually) a PATCH version
  increment.
- Production deploy for a hotfix still goes through the standard release
  pipeline — no shortcut around CI/tag/deploy gating.
- Record the hotfix reason in the PR or release notes.

### Package versioning

- Version published packages separately from applications when the
  package has its own publish process. See
  `core/standards/packages-modules.md` (planned) for package/module
  structure; this document is the source of truth for package SemVer
  rules below.

| Change type | Version segment |
| --- | --- |
| Breaking API change | MAJOR |
| New backward-compatible API | MINOR |
| Bug fix | PATCH |
| Internal refactor without publish | May be unchanged |

- Before publishing a package, confirm: version bumped in `package.json`,
  current `LICENSE`, current README usage docs, build artifact produced,
  CI green, correct `publishConfig`, and a release notes/changelog entry
  if published externally.
- Publish private packages to a private registry and public packages to a
  public registry, per `core/standards/packages-modules.md` (planned).

### Release notes / changelog

- Every release must have a short description of changes sufficient to
  understand what was delivered. Release notes must match the actual
  release tag.
- Minimal template:

  ```
  ## Release vX.Y.Z

  ### Added
  ### Fixed
  ### Changed
  ### Known issues
  ### Deployment notes
  ```

### Deployment source per environment

Execute deployment only through the CI/CD pipeline, and only from the
allowed source for that environment:

| Environment | Allowed release source |
| --- | --- |
| dev | Branch/merge/manual pipeline run, if the project allows it |
| test/QA | `main` or a test build |
| staging | `main` or an RC tag |
| client-staging | RC tag |
| production | Final release tag |

- Production deploy must have at least one control: final release tag,
  manual approval, protected tag, restricted operator list, or a rollback
  plan.

### Rollback

- Before production deploy, know: the previous stable version, where the
  previous artifact is stored, whether there is a DB migration, whether
  that migration is reversible, who makes the rollback decision, and how
  to verify rollback. Build the actual plan with `core/sdlc/rollback-plan.md`
  / the `rollback-plan` skill — do not restate it here.
- If rollback is impossible, state that explicitly in the release/
  deployment notes.

### Ownership

- Every release process must have a clearly identified responsible owner.

| Role | Responsibility |
| --- | --- |
| Developer | Prepares changes/PR/tests/version bump |
| Reviewer / Tech Lead | Verifies release readiness |
| CI/CD | Builds, checks, publishes artifacts, deploys |
| Release Owner | Creates/confirms release, controls notes and approval |
| Product/Client | Confirms RC when acceptance testing is required |
| DevOps/Platform Owner | Maintains pipeline, registry, deploy infra, secrets |

### Secrets

- Do not store secrets in the repository or in pipeline config.
- Do not include secrets or local-only files in a published package.

## Recommended Rules

- Conduct a post-incident review after a hotfix that followed a production
  incident (see `core/sdlc/post-release-review.md`).
- Generate release notes automatically from PRs where possible,
  supplemented manually by the release owner.
- Store release notes in the platform's Release feature (GitHub Release /
  GitLab Release) or an internal portal, and duplicate them in
  `CHANGELOG.md` if the repository maintains one.

## Forbidden Patterns

- Version-bump commits used in place of release tags.
- Production deploy without a release tag or without required approval.
- Creating a release tag from a feature branch.
- Changing a release tag after it has been created.
- Deploying from a local machine.
- Deploying from a failed CI run.
- Using RC as a long-lived branch model.
- Publishing a package without CI.
- Publishing a package that contains local secrets.
- Publishing a public package without an explicit owner decision.
- Releasing without release notes when the release is production-facing or
  an external package.
- An undefined rollback strategy ("we'll figure it out later").
- Forbidden release-tag formats: `0.0.1-5`, `release-final`, `prod-latest`,
  `main-prod`.
- Forbidden deployment paths: local machine → production; feature branch →
  production; unknown commit → production; failed CI → deployment.

## Agent Must Check

- Whether the release/deployment is tied to a `vMAJOR.MINOR.PATCH` tag
  (or `-rc.N` for a pre-release) created from `main` at a commit that
  passed CI.
- Whether the version bump (MAJOR/MINOR/PATCH) matches the actual change
  type per the SemVer tables above.
- Whether release notes exist and match the tagged content.
- Whether the deployment target environment matches the allowed source
  for that environment (allow-list table above).
- Whether a rollback path is understood and documented before a
  production deploy, and flagged explicitly if impossible.
- Whether a hotfix stayed minimal, went through PR + CI, and is recorded
  with its reason.
- For a package release: version bump, LICENSE, README, build artifact,
  CI status, `publishConfig`, and changelog/release notes entry.
- Whether a release owner is identifiable for the release in question.

## Agent Must Not Do

- Must not treat a version-bump commit, a branch name, or a verbal
  agreement as sufficient to fix a release version — only a release tag
  does.
- Must not propose or execute a production deploy from a feature branch,
  local machine, or untagged/unknown commit.
- Must not propose retagging or moving an existing release tag — a
  correction requires a new tag.
- Must not author pipeline YAML/Groovy/Terraform/Ansible as the
  implementation of the release stages described here — that belongs to
  `ute-ci-templates` / `ute-jenkins-library` / `ute-ansible` /
  `ute-automation` / `ute-infra` / `ute-gitops` (see
  `core/standards/ci-cd.md`).
- Must not expand hotfix scope beyond the minimal critical fix.
- Must not publish or recommend publishing a package with secrets, a
  missing LICENSE/README, or failing CI.
- Must not skip release notes for a production-facing release or an
  externally published package.

## Related Skills

- `.claude/skills/rollback-plan` — build the rollback plan this document
  requires before a production deploy.
- `.claude/skills/release-readiness` — pre-merge/pre-release checklist
  that this document's release-readiness rules feed into.
- `.claude/skills/post-release-review` — post-incident/post-hotfix retro.
- `.claude/skills/devops-review` — deeper review of CI/CD/deployment diffs
  touching release mechanics.
- `.claude/skills/pr-summary` — carries rollback notes referenced by a
  hotfix or release PR.

## Related Archetypes

- `core/archetypes/npm-package`, `core/archetypes/angular-library` —
  package SemVer, publish readiness, and changelog conventions this
  document's package-versioning rules apply to.
- `core/archetypes/devops-infra` — CI/CD and deployment-source overlay
  this document's environment allow-list applies to.

## Related UTE Repositories

- `ute-ci-templates` — owns GitHub Actions implementation of the
  release-grade checks / build / publish / deploy / verify pipeline
  stages described conceptually above.
- `ute-jenkins-library` / `ute-jenkins` — owns the Jenkins equivalent.
- `ute-ansible` / `ute-automation` / `ute-infra` / `ute-gitops` — own
  actual deployment execution once an artifact/image is published.

## Open Questions

- Source document is marked Status: Draft — confirm whether it is
  approved/binding before treating its rules as enforceable governance.
- Source defers Git branch/commit rules, PR workflow, full CI/CD
  architecture, and repo/app structure to "separate documents" without
  naming them — cross-referenced here against best-guess existing docs
  (`core/standards/git/*`, `core/standards/ci-cd.md`); confirm these are
  the intended targets.
- Source references an external "Package & Module Standard" for private/
  public registry routing; `core/standards/packages-modules.md` does not
  yet exist in this repo — create it and resolve the cross-references
  above once it does.
- No guidance given for pre-release identifiers other than RC (e.g.
  alpha/beta/dev builds) — unclear if these are permitted.
- No mechanism specified for who decides/tracks that a given change is
  "internal-only" and therefore version-exempt.
- Owning repo(s) for the actual release-grade checks / artifact publish /
  deployment steps are not named in the source policy — this document
  assumes the standard `ute-ci-templates` / `ute-jenkins-library` /
  `ute-ansible` split used elsewhere in this repo; confirm.
