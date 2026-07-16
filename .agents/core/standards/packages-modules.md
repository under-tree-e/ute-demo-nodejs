# Package & Module Standard

## Purpose

Decide when code stays an in-repo module versus becomes a separately
versioned/published package, and define how packages (npm, Angular
library, Node.js package, SDK, CLI) are named, typed, structured at a
high level, and published — so an agent never invents ad hoc naming or
publishes without the required gates.

## Applies To

- Any decision to extract code from an application repo into its own
  package/library repo.
- Naming, scoping, and `package.json` metadata for npm packages, Angular
  libraries, Node.js packages/SDKs/CLIs, and internal config/contracts
  packages.
- `.npmrc` handling and publish gating for any UTE package.
- `project-discovery` and `architecture-review` when a module-vs-package
  extraction is proposed.

## Does Not Cover

- Repository naming — deferred to a separate naming-conventions document
  (not yet authored; see `core/standards/repository-architecture.md` Open
  Questions).
- Concrete npm package repo layout (`src/`, `tests/`, `exports` field,
  etc.) — see `core/archetypes/npm-package/structure.md`. This file does
  not restate that layout.
- Application/backend/Angular repo structure — see the relevant
  `core/archetypes/*/structure.md`.
- Git branch/commit/PR rules — see `core/standards/git/`.
- CI/CD pipeline rules (how publish is triggered/executed) — see
  `core/standards/ci-cd.md`. This repo owns no pipeline implementation.
- SemVer mechanics (what MAJOR/MINOR/PATCH mean) — see
  `core/standards/git/releases.md` (Versioning section) and
  `core/archetypes/npm-package/rules.md` (Semantic versioning section).
  This file only states which change type triggers which bump for
  packages specifically.
- Repository-vs-repository split criteria (when to give code its own
  repo at all) — see `core/standards/repository-architecture.md`.

## Source Documents

- "Package & Module Standard" (Standard; status: On Review, not yet
  finalized/approved as of ingestion — see Open Questions).

## Required Rules

### Module vs. package

- Keep code as an in-repo module if it is used only by that application,
  has no independent versioning, and is not published to a registry.
- Extract code into its own package/repository only if at least one of:
  reused across 2+ repositories, needs its own version/release cycle, or
  must be published to a registry.
- Do not create a separate package for code used by only one application
  without a real reuse need.
- Consolidate shared logic into one package rather than duplicating it
  across multiple packages.

### Naming and typing

- Package type MUST be evident from its name, purpose, and metadata —
  never arbitrary or marketing-driven. Use one of the types below.
- Package name MUST follow the format `@<scope>/<type>-<name>`.
- Package name and repository name are not required to be identical but
  MUST be logically related.
- Do not name a package `common`, `utils`, or `shared` without a
  clarified, specific purpose.

| Type | Purpose | Example name |
| --- | --- | --- |
| `ngx` | Angular library | `@ute/ngx-form-controls` |
| `server` | Server-side/backend library | `@ute/server-logging` |
| `sdk` | Client SDK for an external/internal API | `@ute/sdk-billing` |
| `ui` | UI component library (non-Angular-specific) | `@ute/ui-icons` |
| `cli` | Command-line tool | `@ute/cli-scaffold` |
| `internal` | Internal-only tooling/library, not for reuse outside UTE | `@under-tree-e/internal-build-tools` |
| `config` | Shared config (lint, TS, build config) | `@ute/config-eslint` |
| `contracts` | Shared types/API contracts/schemas | `@ute/contracts-billing` |

### Scope, registry, visibility

- Public packages MUST be published to npmjs under the public scope
  (`@ute/...` pattern).
- Private packages MUST be published to GitHub Packages under the
  private scope (`@under-tree-e/...` pattern).
- Do not mix public and private packages within the same npm scope.
- Do not place a public package in a private scope without justification,
  or a private package in a public scope without an explicit decision.

| Scope | Registry | Visibility |
| --- | --- | --- |
| `@ute` | npmjs | public |
| `@under-tree-e` | GitHub Packages | private |

### `package.json` requirements

- MUST include: `name` (in `@scope/type-name` format), `version`
  (SemVer), `private` (correctly set `true`/`false`), `description`,
  `author`, `license` (matching the `LICENSE` file), and `scripts` with
  at minimum `lint`, `test`, `build`, and `format:check`.
- MUST include `repository` (Git URL) if the package is publishable.
- `private` field MUST accurately reflect the package's actual publish
  status.
- `publishConfig` MUST point to the correct registry for the package's
  scope and visibility (npmjs for `@ute`, GitHub Packages for
  `@under-tree-e`).

### `.npmrc` and secrets

- MUST NOT contain literal tokens/secrets. Secrets are supplied only via
  environment variables or a secret manager.
- Add `.npmrc` to a repo only if that repo actually uses registry config.
- Publish credentials MUST be stored in CI/CD secrets or a Vault, never
  committed.

### Publishing

- MUST be performed only through controlled CI/CD or an explicitly
  approved release process — never manually from a local machine without
  that approval.
- MUST occur only from `main` or a release tag.
- Before publish, all of the following MUST be true: version bumped, CI
  passing, package build passing, `LICENSE` present and up to date,
  `README.md` describes usage.
- Published package MUST NOT contain secrets, local configs, or test
  artifacts.
- Publishing a public package MUST require an explicit decision from the
  owner or release owner.

### Versioning

- Published packages MUST be versioned using SemVer
  (`MAJOR.MINOR.PATCH`) — see `core/standards/git/releases.md` for
  general SemVer/changelog mechanics.

| Change type | Bump |
| --- | --- |
| Breaking change | MAJOR |
| Backward-compatible feature | MINOR |
| Bug fix | PATCH |
| Internal-only, unpublished change | version may stay unchanged |

### Dependencies

- Runtime dependencies MUST go in `dependencies`.
- Build/test tooling MUST go in `devDependencies`.
- Host framework requirements MUST go in `peerDependencies` when the
  package should not bundle its own copy of the framework.

### Ownership and documentation

- Every package MUST have a defined owner.
- Every package MUST have a `README.md` and a `LICENSE` file.

## Recommended Rules

- Set `packageManager` in `package.json` for stable installs.
- Include `CHANGELOG.md` for published packages.
- Include `contributors` field when relevant.
- Set `engines` field when Node/npm version matters.
- Add an internal metadata block to `package.json` for internal
  automation/CI/registry tooling: `internal.type`, `platform`, `area`,
  `owner`, `visibility`, `registry`, `deployable`.
- If a package fully manages its own dependency (not expecting the host
  to provide it), that dependency MAY live in `dependencies` instead of
  `peerDependencies`.

## Forbidden Patterns

- Package without a clear/identifiable scope.
- Package named `common`, `utils`, or `shared` without a clarified,
  specific purpose.
- Public package placed in a private scope without justification.
- Private package placed in a public scope without an explicit decision.
- Manual publish from a local machine without an approved release
  process.
- Tokens/secrets committed inside `.npmrc`.
- Package published or maintained without a `LICENSE` file.
- Package published or maintained without a `README.md`.
- Package without a defined owner.
- Incorrect value in the `package.json` `private` field.
- `publishConfig` pointing to the wrong registry for the package's
  scope/visibility.
- Creating a separate package for code used by only one application
  without a real reuse need.
- Duplicating shared logic across multiple packages instead of
  consolidating it.
- Shipping breaking changes without a MAJOR version bump or migration
  notes.

## Agent Must Check

Before proposing/approving a package extraction or a publish, verify:

- Extraction is justified (reuse across 2+ repos, independent
  version/release cycle, or registry publish need) — not just "it looks
  reusable."
- Name format `@<scope>/<type>-<name>`; type matches the taxonomy table.
- Scope matches intended registry and visibility.
- `README.md` is clear; `LICENSE` is present.
- `package.json` has all required fields; `private` is set correctly;
  `publishConfig` is set if publishable.
- No registry tokens anywhere in the repo (check `.npmrc` and the diff,
  not memory).
- `build` command exists; `lint`/`format:check` exist; `test` command
  exists or its absence is explained.
- Dependencies are split correctly across `dependencies` /
  `devDependencies` / `peerDependencies`.
- Owner is defined for the package.
- Publish path is CI/CD or an approved release process — not a manual
  local publish.

## Agent Must Not Do

- Must not author or copy pipeline YAML/Groovy to perform the publish —
  that's `ute-ci-templates`/`ute-jenkins-library`'s job; see
  `core/standards/ci-cd.md`.
- Must not generate the concrete npm package repo layout here — defer to
  `core/archetypes/npm-package/structure.md`.
- Must not approve a manual local publish as a substitute for CI/CD or an
  approved release process.
- Must not let a package pass review without a defined owner, `LICENSE`,
  and `README.md`.
- Must not restate SemVer mechanics here — cross-reference
  `core/standards/git/releases.md` instead.

## Related Skills

- `project-discovery` — establishes whether a repo is already a package
  repo and what its publish model is.
- `architecture-review` — reviews a proposed module-to-package extraction
  before implementation.
- `release-readiness` — checks publish gates (version bump, CI green,
  `LICENSE`/`README.md` present) before a release ships.
- `docs-sync` — keeps `README.md`/`CHANGELOG.md` in sync after
  behavior/API changes.

## Related Archetypes

- `core/archetypes/npm-package/` — concrete repo structure, `exports`
  discipline, publishing checklist, registry considerations. This
  standard cross-references it rather than duplicating it.
- `core/archetypes/angular-library/` — Angular-specific library layout
  (e.g. `projects/<library-name>/src/public-api.ts`).
- `core/archetypes/nodejs-cli/` — CLI package structure.

## Related UTE Repositories

- `ute-ci-templates` — owns GitHub Actions publish workflows.
- `ute-jenkins-library` — owns Jenkins shared publish steps.
- Registry infrastructure (npmjs account/org, GitHub Packages org
  config) — owned outside this repo; not an agent-standards concern.

## Open Questions

- Scope naming inconsistency in the source material: the detailed rules
  use a generic placeholder pair `@company` (public) / `@company-git`
  (private), while the summary section uses concrete scopes `@ute`
  (public) and `@under-tree-e` (private). This file uses the concrete
  `@ute` / `@under-tree-e` pair — confirm these are the real, binding
  scopes.
- Source document status is "On Review" (not yet approved/finalized) —
  confirm whether this file should be treated as a binding required
  standard or held as draft/pending.
- No dedicated `release-versioning.md` exists in this repo yet; SemVer
  mechanics currently live in `core/standards/git/releases.md` and
  `core/archetypes/npm-package/rules.md`. Confirm those are the intended
  cross-reference targets, or whether a standalone
  `core/standards/release-versioning.md` should be created.
- No explicit rule distinguishes the `internal` package type from
  packages that merely have `visibility=private` — overlap/boundary
  between type and visibility is undefined in the source.
- No guidance given on package deprecation, retirement, or archiving once
  reuse need ends.
- Source repo-structure list includes "Jenkinsfile / `.github/workflows/*`"
  as a file present in a package repo. Per `core/standards/ci-cd.md`, this
  standard does not define pipeline content — only notes that such a file
  is expected to exist and is owned by `ute-ci-templates`/
  `ute-jenkins-library`, not authored here.
