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
