# Jenkins Standard

## Purpose

Define how Jenkins is used as a quality gate and deployment orchestrator
across projects. This is governance only — rules, naming conventions,
and checklists an agent must follow/check. It does not implement, ship, or
template any Jenkinsfile.

## Applies To

- Any repo whose CI/CD model (per `docs/ci-cd.md`, see `core/standards/ci-cd.md`)
  is Jenkins.
- Agent actions that create, review, or modify a `Jenkinsfile`, Jenkins
  shared-library calls, or Jenkins job configuration in a consuming repo.
- PR, Main, Release, Package Publish, and Infra pipeline profiles.

## Does Not Cover

- General CI/CD ownership boundaries and supported delivery paths — see
  `core/standards/ci-cd.md` (this file specializes that policy for Jenkins;
  it does not restate or override it).
- GitHub Actions — see `core/ci-cd.md` / `ute-ci-templates`.
- Deployment/infra execution mechanics (Ansible, Terraform, GitOps) — see
  `ute-ansible`, `ute-automation`, `ute-infra`, `ute-gitops`.
- Infra Pipeline profile stage detail — source Blueprint lists it as a
  pipeline type (infra repo changes / plan-apply) but does not define its
  stages; scoping against the Terraform/Ansible ownership boundary is an
  open question (see below).

## Source Documents

- Jenkins Pipeline Blueprint (Draft, as of 2026-05-21) — defines PR, Main,
  Release, and Package Publish pipeline profiles for frontend/backend/
  package/infra repos.
- CI-CD memo and CI/CD System Policy (general CI/CD policy, referenced by
  the Blueprint but not restated here — see `core/standards/ci-cd.md`).

## Required Rules

**Role of Jenkins**

- Jenkins is a quality gate and deployment orchestrator. It must not become
  a dumping ground for chaotic, ad hoc manual scripts.
- Jenkins must not alter Git history and must not perform merges itself —
  merging is the PR platform's responsibility.
- Jenkins must not duplicate application business logic.

**Pipeline coverage**

- Every repository must have at minimum a PR Pipeline.
- Every production repository must additionally have a Release Pipeline.

**Pipeline profile behavior**

| Profile | Trigger | Must | Must Not |
| --- | --- | --- | --- |
| PR Pipeline | PR opened/pushed to a feature branch | Validate the change is mergeable (checkout, prepare, policy checks, static checks, tests, build, quality gate) | Deploy anything, anywhere |
| Main Pipeline | Merge to `main` | Validate post-merge main-branch stability; may produce a deployable artifact | Deploy to production without a release tag |
| Release Pipeline | Valid release tag pushed, or manual release job | Validate the tag format before doing anything else; build the release artifact; deploy per tag type (see below) | Run against a missing or invalid tag |
| Package Publish Pipeline | Release tag, or approved manual publish job | Validate package metadata; build; publish only after build success | Publish an unbuilt/unvalidated package, or use a token not sourced from Credentials/secret manager |
| Infra Pipeline | Infra repo change, or manual run | Plan/apply infrastructure per the owning infra repo's rules | N/A — see Does Not Cover |

- The PR Pipeline must never deploy code; its only output is a merge/no-merge
  signal.
- The Release Pipeline must run only when triggered by a tag matching
  `vMAJOR.MINOR.PATCH` or `vMAJOR.MINOR.PATCH-rc.N`, and must fail if no tag
  or an invalid tag format is present.
- RC tags (`vX.Y.Z-rc.N`) must deploy only to staging/client-staging.
- Final release tags (`vX.Y.Z`) must deploy to production only after an
  explicit approval step.
- Production deployment must require a manual approval gate in addition to
  any deploy-enable parameter.

**Stage naming**

- Stage names must be short, written in English, and consistent across
  projects — this is a naming convention, not a literal step sequence.
- Recommended stage vocabulary (use as applicable per profile): Init,
  Checkout, Prepare, Policy Checks, Static Checks, Unit Tests, Integration
  Tests, Build, Security Scans, Quality Gate, Package, Publish, Deploy to
  Staging, Approval for Production, Deploy to Production, Verify, Cleanup.

**Quality gates**

- The pipeline must end in a failed state if any mandatory check does not
  pass.
- PR merge must be blocked if a mandatory stage failed, the pipeline is
  incomplete, skipped, or unstable, or a required status check is missing.

**Secrets**

- The Jenkinsfile must never contain tokens, passwords, private keys, or
  production credentials.
- Secrets must live in Jenkins Credentials or a secret manager and be
  injected into steps via environment/credential-binding mechanisms (e.g.
  `withCredentials`) — never hardcoded in the pipeline definition.
- The pipeline must not log secret values.
- Production secrets must be accessible only to the production pipeline.
- Dev, staging, and production secrets must be kept separate.
- Credentials used by pipelines must have minimal required permissions.

**Artifacts**

- Artifacts must be named so project, version, build number, and commit are
  identifiable: `<project>-<version>-<build-number>-<commit-sha>`.
- Each build must produce minimum artifact metadata: `VERSION.txt`,
  `COMMIT.txt`, `BUILD.txt`, `BUILD_DATE.txt`.
- Docker images must be tagged with both `<registry>/<project>:<version>`
  and `<registry>/<project>:<commit-sha>`.

**Template ownership**

- This repo ships no Jenkinsfile template, no reusable Jenkins pipeline
  step, and no Groovy pipeline code of any kind.
- A project's Jenkinsfile must use the `ute-jenkins-library` shared library,
  or record a documented exception (ADR/`risks.md`) if it does not.
- `ute-jenkins` owns the controller/agent/runtime that executes pipelines;
  it is out of scope here.

## Recommended Rules

- Treat only genuinely non-critical items as non-blocking: optional
  metrics, low-severity lint hints, optional E2E on early branches,
  informational reports, non-critical documentation checks.
- Run a cleanup stage at the end of the pipeline when temporary resources
  need removal.
- Keep pipeline logs sufficient to diagnose a failure without re-running it.
- Document in the repository README which pipeline profile(s) the project
  uses.

## Forbidden Patterns

- Secrets committed inside the Jenkinsfile, or tokens embedded in
  pipeline/Groovy code.
- Production deploy without a release tag, or without approval.
- Deploying from the PR Pipeline.
- Merging code via Jenkins instead of the PR platform.
- Skipping mandatory checks or silently bypassing CI.
- Manual deploys run from a local machine instead of through the pipeline.
- Pipeline logs that are not sufficient to diagnose a failure.
- Meaningless or vague stage names (e.g. "Do stuff", "Build all", "Test
  maybe", "Deploy something", "Final step", "Script", "Run").
- Missing artifact version/commit metadata.
- A single Jenkinsfile that chaotically mixes PR, release, and manual logic
  without clear, separated rules per profile.
- Authoring a Jenkinsfile, Jenkins shared-library step, or any Groovy
  pipeline code inside `ute-agent-standards` (`core/` or
  `core/archetypes/`) — that belongs in `ute-jenkins-library`/`ute-jenkins`.

## Agent Must Check

Pipeline-readiness checklist — before treating a repo's Jenkins setup as
"ready":

- Jenkinsfile lives in the repo.
- Stages have clear, short English names.
- Has a Checkout stage.
- Has a Prepare/install stage.
- Has a Static Checks stage.
- Has a Tests stage.
- Has a Build stage.
- Has a Quality Gate.
- A failed mandatory stage blocks merge/deploy.
- Secrets are not stored in the Jenkinsfile.
- Artifacts are archived when needed, named per convention, with required
  metadata files present.
- The Release Pipeline runs only from valid release tags.
- Production deploy has an approval gate or other explicit control.
- Logs are sufficient for diagnosis.
- Cleanup runs when needed.
- README documents which pipeline profile(s) are in use.
- Jenkinsfile uses `ute-jenkins-library`, or an explicit documented
  exception exists.

## Agent Must Not Do

- Must not author or transcribe Jenkinsfile/Groovy pipeline code into
  `ute-agent-standards` under any path, including as an "example".
- Must not copy pipeline code from a source document (Blueprint, memo,
  existing Jenkinsfile) verbatim into this repo — convert it into a rule or
  checklist item, or a named reference to `ute-jenkins-library`/
  `ute-jenkins`.
- Must not generate a full Jenkinsfile from scratch for a consuming project
  as a default action — point to `ute-jenkins-library` instead, unless the
  user explicitly asks for a one-off/local script and accepts it as a
  documented exception.
- Must not approve a "ready" verdict for a repo whose production deploy
  lacks an approval gate or whose Jenkinsfile stores secrets.
- Must not let a PR Pipeline that deploys code pass review silently.

## Related Skills

- `/devops-review` — review Jenkins/Jenkinsfile changes for correctness,
  risk, validation, rollback.
- `/release-readiness` — gate release on pipeline ownership/approval-gate
  compliance.
- `/production-readiness` — check operational posture including deploy
  approval controls.

## Related Archetypes

- N/A — no archetype currently encodes Jenkins-specific overlays; if one is
  added, it must follow the same no-pipeline-code rule as this file.

## Related Repositories

| Repo | Owns |
| --- | --- |
| `ute-jenkins-library` | Shared library, reusable pipeline steps, Jenkinsfile templates |
| `ute-jenkins` | Jenkins controller, agents, runtime configuration |
| `ute-ansible` / `ute-automation` | Deployment execution once an artifact/image exists |
| `ute-infra` | Terraform-defined infrastructure |
| `ute-gitops` | Desired-state / GitOps reconciliation |

## Open Questions

- General CI/CD policy is deferred to the "CI-CD memo" and "CI/CD System
  Policy" documents referenced by the Blueprint — confirm these are already
  ingested into `ute-agent-standards` (likely as `core/standards/ci-cd.md`)
  and cross-link rather than duplicate; flag to a human if a separate
  ingestion is still needed.
- The Blueprint does not name the authoritative owner of canonical
  Jenkinsfile templates as clearly as `core/standards/ci-cd.md` does
  (`ute-jenkins-library` for shared library, `ute-jenkins` for
  controller/runtime) — this file follows `ci-cd.md`'s existing split;
  confirm with a human if the Blueprint intends a different split.
- Infra Pipeline profile has no detailed stage blueprint in the source and
  its relationship to `ute-ansible`/`ute-automation`/`ute-infra`/
  `ute-gitops` ownership is unresolved — needs a separate source or an
  explicit scoping note before adding required rules for it.
- Source Blueprint status is "Draft" (2026-05-21) — rules derived here
  should be treated as provisional pending the Blueprint's finalization;
  revisit when it is finalized.
- Whether the Package Publish Pipeline's inline `.npmrc` leaked-token check
  should become a required governance rule (vs. staying an implementation
  detail owned by `ute-jenkins-library`) is unresolved — not included as a
  required rule here pending a human decision.
