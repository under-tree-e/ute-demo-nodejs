## Release v0.1.11

No application change. Fixes a content-loss bug in
`deploy/secrets/runtime.env.sops`: the committed file held a bare
base64 value instead of a valid `SESSION_SECRET=<value>` entry, which
made `ansible`'s `compose_release` role fail at `parse_dotenv`.
Re-encrypted with a correctly formatted `SESSION_SECRET`, same
recipient.

### Deployment notes

- Purely a `deploy/secrets/runtime.env.sops` content fix -- no other
  change since `v0.1.10`.

## Release v0.1.10

No application change. Re-encrypts `deploy/secrets/runtime.env.sops`
under the current SOPS age key. A release's pinned secrets file must
be encrypted under the key live at deploy time, since this platform's
`compose_release` role checks out the release's own immutable git tag
for its secrets file and cannot decrypt it under a rotated-away key.

### Deployment notes

- Purely a re-tag of current `main` -- no other change since `v0.1.9`.

## Release v0.1.9

No application change. Verifies the release pipeline end-to-end on
the platform's self-hosted Jenkins controller instead of the
operator's previous personal Jenkins instance: checkout, secret scan,
dependency install, lint, HTTP integration tests, image build,
container smoke test, SonarQube analysis and Quality Gate, supply-chain
scan and SBOM, GHCR publish, and Semaphore-delegated deployment, all on
a `ci-standard` pool agent.

### Deployment notes

- Deploys via the Jenkins-controller release path; the previous
  personal-Jenkins-based path remains available as a rollback option.

## Release v0.1.8

Fixes a variable-name mismatch between this repo's release compose
file and the Ansible-rendered `deployment.env`, which made
`docker compose config -q` fail during a real deploy.

### Fixed

- `deploy/compose/docker-compose.release.yml`, `deploy/compose/README.md`:
  drop the `UTE_` prefix on all 4 interpolation variables.

### Deployment notes

- Deployments must target `v0.1.8` or later; earlier tags' compose file
  cannot resolve the variables `deployment.env` actually contains.

## Release v0.1.7

Fixes 3 HIGH-severity CVEs surfaced by the release pipeline's
vulnerability scan, in transitive dependencies pulled in via `ejs` and
`mongodb`'s optional `socks` peer dependency. `v0.1.6` never produced a
pushed image and cannot be deployed.

### Fixed

- `src/package.json`: bumped the existing pinned `overrides` for
  `brace-expansion` (`1.1.16` -> `1.1.18` under `jake`, `2.1.2` ->
  `2.1.4` under `filelist`) and added a new override pinning
  `ip-address` to `10.3.1` under `socks`. `src/package-lock.json`
  regenerated to match.
- Verified locally: `npm ci --omit=dev` succeeds, and a local
  `docker build` + `aquasec/trivy image --severity HIGH,CRITICAL` scan
  of the resulting image shows 0 findings.

### Deployment notes

- Deployments must target `v0.1.7`, not `v0.1.6` (which has no image).

## Release v0.1.6

Rotates `deploy/secrets/runtime.env.sops`'s age keypair and
`SESSION_SECRET` value. The previous age private key had no durable
backup and could not be recovered. `SESSION_SECRET` is a purely
internal session/cookie-signing value with no other system depending
on its exact bytes, so rotating both is safe.

### Added

- Nothing new in `src/`; identical application code to `v0.1.5`.

### Fixed

- `deploy/secrets/runtime.env.sops`: re-encrypted with a new age
  keypair and a new `SESSION_SECRET`. The new private key must be
  provided to the Semaphore deployment executor as `SOPS_AGE_KEY`
  before this tag can be deployed.

### Deployment notes

- Any deployment still pinned to `v0.1.5` or earlier will fail
  `compose_release`'s SOPS decrypt step once `ansible`'s fail-closed
  age-key check ships, since the old key is permanently lost.
  Re-point deployments at `v0.1.6` or later.

## Release v0.1.5

Adds gitleaks, SonarQube, containerized Trivy/Syft, and k6 CI/CD
quality and security tooling.

### Added

- `tests/load/smoke.js`: a minimal k6 load-test script exercising
  `/healthz`, `/readyz`, and `/info` under light concurrent load. No
  thresholds defined -- advisory only, never fails the build.

### Fixed

- No additional fixes in this release beyond what already shipped to
  `main`.

### Changed

- Nothing beyond the version bump, this changelog entry, and the new
  k6 script.

### Known issues

- No performance threshold is defined for this demo app; the k6 stage
  is informational only and archives a JSON summary for review.

### Deployment notes

- Exercises the release-tag-gated k6 performance-test stage
  (`PERFORMANCE_TEST_ENABLED=true`).

## Release v0.1.4

Fixes a Semaphore deployment payload mismatch: the trigger script sent
Ansible-style flags that the deployment template does not accept.

### Added

- Nothing new in `src/`; identical application code to `v0.1.3`.

### Fixed

- `scripts/trigger_semaphore_deployment.py`: now sends
  `deploy-compose-release`'s actual accepted flags (`--deployment-id`,
  `--inventory-ref`, `--artifact-version`, `--image-ref`, `--source-ref`,
  `--mode apply`) instead of `--extra-vars`.

### Changed

- Nothing beyond the version bump and this changelog entry.

### Known issues

- None known beyond the pre-existing items already listed under
  `v0.1.0`/`v0.1.1`.

### Deployment notes

- Completes the Jenkins release-tag pipeline: GHCR publish, inventory
  resolve, and Semaphore-delegated deployment to the sandbox host all
  succeeding in one build.

## Release v0.1.3

Re-cuts the release tag after fixing the Jenkins Credentials entries
and Config File value that blocked `v0.1.2`'s inventory-resolve and
Semaphore-delegation stages (operational configuration, not code).

### Added

- Nothing new in `src/`; identical application code to `v0.1.2`.

### Fixed

- Nothing in `src/`; the fixes were infrastructure/configuration, not
  code, and already apply to this commit.

### Changed

- Nothing beyond the version bump and this changelog entry.

### Known issues

- None known beyond the pre-existing items already listed under
  `v0.1.0`/`v0.1.1`.

### Deployment notes

- Exercises the Jenkins release-tag pipeline's inventory-resolve and
  Semaphore deployment-delegation stages.

## Release v0.1.2

Migrates the Jenkinsfile onto the shared `nodeContainerRelease`
pipeline step; Jenkins is the CI/CD path, GitHub Actions is the
fallback path. Fixes two bugs surfaced by exercising that pipeline
against a real target host.

### Added

- Nothing new in `src/`; packages CI/CD-path and monitoring fixes
  already on `main` as the first release-tag build to run through the
  Jenkins controller.

### Fixed

- `/api/monitoringdata`: container memory stats now read the cgroup v2
  unified hierarchy (`/sys/fs/cgroup/memory.current` /
  `memory.max`) first, falling back to the legacy cgroup v1 paths, and
  falling back further to `os.totalmem()` when the limit is unset --
  previously used only the cgroup v1 path, which fails on cgroup v2
  hosts.
- `src/tests/health-tests.http`: removed quotes from httpyac string
  equality assertions (`?? body status == ok` /
  `?? body status == ready`) -- httpyac treats the RHS as a literal
  token, so quoting it always failed the assertion regardless of the
  actual response.

### Changed

- `Jenkinsfile` now delegates to the shared `nodeContainerRelease`
  step instead of an inline pipeline; CI/CD configuration values are
  sourced from a Jenkins Config File Provider entry
  (`ute-demo-nodejs-cicd-config`) instead of folder/job-level
  environment variables (Environment Injector doesn't support
  Multibranch Pipeline/Folder jobs).
- `docker-compose.yml`: explicit `container_name` set to stop Compose's
  double-prefixed auto-naming; dev-compose `node_modules` volume
  renamed to the concise `<container>_<subcategory>_volume` convention.
- `docs/ci-cd.md` rewritten to document the Config File Provider
  mechanism.
- Docs prose no longer uses the `UTE`-prefixed brand name (functional
  identifiers unchanged).

### Known issues

- None known beyond the pre-existing items already listed under
  `v0.1.0`/`v0.1.1`.

### Deployment notes

- Exercises the Jenkins release-tag pipeline's deploy-delegation stage
  against the sandbox host.

## Release v0.1.1

Adds the `deploy/secrets/` SOPS-encrypted runtime secret convention so
the image can carry a real `SESSION_SECRET` into production. No
application code change.

### Added

- `deploy/secrets/README.md` and `deploy/secrets/runtime.env.sops`:
  the SOPS-encrypted-file secret-delivery convention, including a
  mandatory rotation-on-handoff policy.

### Fixed

- Nothing application-level; this release exists solely to publish an
  image/tag whose checkout includes the `deploy/secrets/` convention
  added after `v0.1.0` was cut.

### Changed

- Nothing in `src/`; only `deploy/secrets/` and this changelog/version
  bump.

### Known issues

- Not deployed anywhere yet.

### Deployment notes

- Not applicable -- no deployment performed as part of cutting this
  release itself.

## Release v0.1.0

First release of this demo app under this platform's release path.
Version reset from the inherited upstream fork's `4.9.9` to `0.1.0`.

### Added

- Packages the release-path adaptations already on `main` (see
  Changed) as the first tagged, published image.

### Fixed

- Prettier/lint formatting drift across 8 source files that was
  failing CI.

### Changed

- Adds health/readiness endpoints (`/healthz`, `/readyz`) and
  proxy-aware, secure production session/cookie configuration.

### Known issues

- Built and published to `ghcr.io/under-tree-e/ute-demo-nodejs:0.1.0`
  but not deployed anywhere yet.
- The Jenkins multibranch release path has not been verified against a
  live Jenkins controller; GitHub Actions is the only verified path.

### Deployment notes

- Not applicable -- no deployment performed as part of this release.
