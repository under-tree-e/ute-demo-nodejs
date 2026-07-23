## Release v0.1.5

Carries the F021 CI/CD quality and security tooling work (gitleaks,
SonarQube, containerized Trivy/Syft, and now k6) through a clean release
tag, to exercise the new advisory k6 performance-test stage for the
first time — the last remaining unverified piece of `ute-workspace`
feature F021.

### Added

- `tests/load/smoke.js`: a minimal k6 load-test script exercising
  `/healthz`, `/readyz`, and `/info` under light concurrent load. No
  thresholds defined — advisory only, never fails the build.

### Fixed

- Nothing new in this release beyond what already shipped to `main`
  since `v0.1.4` (F021 Stage 1-3 fixes, already released as part of
  ongoing `main` commits, not their own tagged release).

### Changed

- Nothing beyond the version bump, this changelog entry, and the new
  k6 script.

### Known issues

- No performance budget/threshold has been agreed for this demo app yet
  — the k6 stage is purely informational (archives a JSON summary for
  human review), not a gate.

### Deployment notes

- This release is expected to be the first to exercise the k6
  performance-test stage for real (release-tag-gated,
  `UTE_PERFORMANCE_TEST_ENABLED=true`) — see `ute-workspace` feature
  F021 Stage 4.

## Release v0.1.4

Finishes the real Jenkins release-tag pipeline verification `v0.1.3`
started. `v0.1.3`'s Semaphore delegation stage ran for the first time ever
and correctly surfaced a real contract mismatch: `trigger_semaphore_deployment.py`
built its Semaphore task payload assuming the target template ran
`ansible-playbook` directly (`--extra-vars`), but the real "UTE - Deploy
Compose Release" template invokes `ute-automation`'s
`scripts/deploy-compose-release`, which deliberately rejects arbitrary
Ansible extra vars/limits and accepts exactly six specific flags. `v0.1.4`
carries the fixed script through a clean release tag.

### Added

- Nothing new in `src/`; identical application code to `v0.1.3`.

### Fixed

- `scripts/trigger_semaphore_deployment.py`: now sends
  `deploy-compose-release`'s actual accepted flags (`--deployment-id`,
  `--inventory-ref`, `--artifact-version`, `--image-ref`, `--source-ref`,
  `--mode apply`) instead of `--extra-vars` — reproduced live as the first
  real Semaphore delegation attempt from Jenkins, which failed with
  `--extra-vars is not accepted`.

### Changed

- Nothing beyond the version bump and this changelog entry.

### Known issues

- None known beyond the pre-existing items already listed under
  `v0.1.0`/`v0.1.1`.

### Deployment notes

- This release is expected to complete the first real, fully green
  Jenkins release-tag pipeline: GHCR publish, inventory resolve, and
  Semaphore-delegated deployment to `ute-sandbox-01` all succeeding in one
  build — see `ute-workspace` feature F020.

## Release v0.1.3

Re-cuts a release tag to finish proving the real Jenkins release-tag
pipeline end-to-end. `v0.1.2`'s first Jenkins build (build #1) correctly
surfaced two real infrastructure gaps — missing Jenkins Credentials
entries and a malformed `UTE_INVENTORY_REPOSITORY` value in the shared
Config File — both now fixed operationally (not code changes). Once
fixed, `v0.1.2` did successfully publish to GHCR, but its own
immutable-release guard then correctly refused to let a retry rebuild
overwrite that already-published tag, blocking the still-unproven
inventory-resolve/Semaphore-delegation stages. `v0.1.3` is a clean tag to
carry that already-fixed configuration through those remaining stages.

### Added

- Nothing new in `src/`; identical application code to `v0.1.2`.

### Fixed

- Nothing in `src/`; the real fixes (Jenkins Credentials, Config File
  value) were infrastructure/configuration, not code, and already apply
  to this commit.

### Changed

- Nothing beyond the version bump and this changelog entry.

### Known issues

- None known beyond the pre-existing items already listed under
  `v0.1.0`/`v0.1.1`.

### Deployment notes

- This release is expected to be the first to observe the Jenkins
  release-tag pipeline's inventory-resolve and Semaphore
  deployment-delegation stages succeed for real, completing the
  verification `v0.1.2` started — see `ute-workspace` feature F020.

## Release v0.1.2

Migrates this app's Jenkinsfile onto `ute-jenkins-library`'s shared
`uteNodeContainerRelease` step (`ute-workspace` F020 — Jenkins as the
mandatory CI/CD path, GitHub Actions as reserve) and fixes two real bugs
that F020's live-infrastructure testing surfaced. This is the first
release cut specifically to exercise the real Jenkins release-tag pipeline
(GHCR publish, inventory resolve, Semaphore deployment delegation)
end-to-end against `ute-sandbox-01`.

### Added

- Nothing new in `src/`; this release packages CI/CD-path and monitoring
  fixes already on `main` as the first release-tag build to run through
  the real Jenkins controller.

### Fixed

- `/api/monitoringdata`: container memory stats now read the cgroup v2
  unified hierarchy (`/sys/fs/cgroup/memory.current` /
  `memory.max`) first, falling back to the legacy cgroup v1 paths, and
  falling back further to `os.totalmem()` when the limit is unset —
  previously hardcoded the v1-only path, which silently failed on every
  cgroup v2 host (never caught before because prior CI never ran the app
  inside a plain container).
- `src/tests/health-tests.http`: removed quotes from httpyac string
  equality assertions (`?? body status == ok` /
  `?? body status == ready`) — httpyac treats the RHS as a literal token,
  so quoting it always failed the assertion regardless of the actual
  response.

### Changed

- `Jenkinsfile` now delegates to `ute-jenkins-library`'s
  `uteNodeContainerRelease` shared step instead of an inline pipeline,
  closing the template-ownership gap flagged in F020's audit; CI/CD
  configuration values are now sourced from a Jenkins Config File
  Provider entry (`ute-demo-nodejs-cicd-config`) rather than
  folder/job-level environment variables (Environment Injector doesn't
  support Multibranch Pipeline/Folder jobs).
- `docker-compose.yml`: explicit `container_name` set to stop Compose's
  double-prefixed auto-naming; dev-compose `node_modules` volume renamed
  to the concise `<container>_<subcategory>_volume` convention.
- `docs/ci-cd.md` rewritten to document the Config File Provider
  mechanism.
- Docs prose neutralized of `UTE`-prefixed brand language per the
  workspace-wide prefix-removal initiative (functional identifiers
  unchanged).

### Known issues

- None known beyond the pre-existing items already listed under `v0.1.0`/
  `v0.1.1`.

### Deployment notes

- This is the first release expected to actually exercise the Jenkins
  release-tag pipeline's deploy-delegation stage (Semaphore Task Template
  "UTE - Deploy Compose Release" against `ute-sandbox-01`) — see
  `ute-workspace` feature F020 for the live verification record.

## Release v0.1.1

Adds the `deploy/secrets/` SOPS-encrypted runtime secret convention (no
application code change) so the image can carry a real `SESSION_SECRET`
into production — `v0.1.0` was tagged before that convention existed, so
its checkout never contains `deploy/secrets/runtime.env.sops`, which real
`ute-workspace` F017 deployment attempts against `ute-sandbox-01` need at
the pinned release tag.

### Added

- `deploy/secrets/README.md` and `deploy/secrets/runtime.env.sops`: the
  SOPS-encrypted-file secret-delivery convention (`ute-workspace` F016
  Mode B / Option B — the encrypted file lives in this repo, not
  `ute-gitops`), including a mandatory rotation-on-handoff policy.

### Fixed

- Nothing application-level; this release exists solely to publish an
  image/tag whose checkout includes the `deploy/secrets/` convention
  added after `v0.1.0` was cut.

### Changed

- Nothing in `src/`; only `deploy/secrets/` and this changelog/version
  bump.

### Known issues

- Still not deployed anywhere as of this release being cut — the actual
  deploy attempt against `ute-sandbox-01` is `ute-workspace` F017,
  tracked separately.

### Deployment notes

- Not applicable — no deployment performed as part of cutting this
  release itself.

## Release v0.1.0

First UTE-controlled release of this demo Node.js app. Version reset from
the inherited upstream fork's `4.9.9` to `0.1.0`, since that number never
reflected a real UTE release — this is the actual first one.

### Added

- Nothing new in this release; it packages the UTE release-path
  adaptations already present on `main` (see Changed) as the platform's
  first real, tagged, published image.

### Fixed

- Prettier/Lint formatting drift across 8 source files, which had been
  the last blocker keeping every GitHub Actions run on `main` red since
  CI was first stabilized.

### Changed

- Health/readiness endpoints (`/healthz`, `/readyz`) and proxy-aware,
  secure production session/cookie configuration, adapting the original
  demo app for the UTE release path.

### Known issues

- This image is built and published to
  `ghcr.io/under-tree-e/ute-demo-nodejs:0.1.0`, but is **not deployed
  anywhere yet** — provisioning/deployment to a real UTE-managed server is
  separate, larger follow-up work (`ute-workspace` feature F010).
- The Jenkins multibranch release path has not been independently
  verified against a live Jenkins controller (no credentials available
  during the CI-stabilization pass) — GitHub Actions is the only verified
  path as of this release.

### Deployment notes

- Not applicable — no deployment performed as part of this release.
