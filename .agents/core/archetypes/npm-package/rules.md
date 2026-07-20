# Rules — npm Package

The decision to extract code into a package (vs. keeping it as an in-repo
module) and the general SemVer policy are cross-stack and live in
`core/standards/packages-modules.md`. The rules below are this archetype's
concrete package.json/registry/dependency rules.

## Package boundaries

- Define what's public API (stable contract, covered by semver) vs internal
  (implementation detail, free to change) — don't let consumers deep-import
  internal files.
- Keep the public surface small; it's easier to add to a minimal API later
  than to remove from a broad one without a breaking release.

## `exports` field discipline

- Use `package.json` `exports` to enforce the boundary — only list the
  entry points meant to be public; internal paths become unimportable.
- Keep `types` (or per-entry `types` in `exports`) accurate for every public
  entry point.

## Semantic versioning

- `major` — breaking change to any public API (signature, behavior,
  removal).
- `minor` — backward-compatible additions.
- `patch` — backward-compatible fixes.
- Treat a change as breaking if any documented/public behavior changes, even
  if types still compile.

## Changelog maintenance

- Maintain `CHANGELOG.md` in Keep a Changelog style (or an equivalent
  auto-generated changelog from conventional commits) — every release has an
  entry before it's published.
- Entries describe user-facing impact, not internal refactor detail.

## Publishing checklist

1. Build (`dist/` regenerated from current `src/`).
2. Test suite passes.
3. Version bumped per semver in `package.json`.
4. `CHANGELOG.md` updated.
5. Git tag created matching the published version.
6. Publish to the registry.
7. Verify the published package (install it fresh, or check the registry
   listing) before announcing.

- Publish only from `main` or a release tag, and only through controlled
  CI/CD or an explicitly approved release process — never manually from a
  local machine without that approval.
- CI must pass and the build must succeed before publish.

## Public vs private packages

- Public packages: scope `@ute`, publish to npmjs, ensure `private` is
  absent or `false`, and treat published content as permanent — assume it
  can't be fully deleted. Publishing a public package requires an explicit
  decision from the owner or release owner — never a default action.
- Private packages: scope `@under-tree-e`, publish to GitHub Packages, set
  `"private": true` in `package.json` if the package must never be
  accidentally published to a public registry.
- `private` must be set correctly for the package's actual publish status —
  an incorrect value here is a forbidden pattern regardless of intent.
- `publishConfig` must point to the registry matching the package's scope
  and visibility (see the scope → registry → visibility table in
  `structure.md`) — a public-scoped package pointed at the private registry
  (or vice versa) is a forbidden pattern.

## Required package.json fields

- `name` — `@<scope>/<type>-<name>` format.
- `version` — SemVer.
- `private` — `true`/`false`, matching actual publish status.
- `description`, `author`, `license` (must match the `LICENSE` file).
- `scripts` — at minimum `lint`, `test`, `build`, `format:check`.
- `repository` — Git URL, required if the package is publishable.
- Recommended: `packageManager` (stable installs), `engines` (when Node/npm
  version matters), `contributors` (when relevant).
- Consider an internal metadata block (`internal.type`, `platform`, `area`,
  `owner`, `visibility`, `registry`, `deployable`) for automation/CI/registry
  tooling to key off of.

## Dependency categorization

- Runtime dependencies the package needs to function → `dependencies`.
- Build/test tooling (linters, test runners, bundlers, type stubs) →
  `devDependencies`.
- Host framework requirements the package expects the consumer to already
  provide (e.g. Angular, React) → `peerDependencies`, so the package doesn't
  bundle its own copy of the framework. If the package fully manages a
  dependency itself rather than expecting the host to provide it, it may
  live in `dependencies` instead.

## Registry considerations

- Scope `.npmrc` to the specific registry/scope needed
  (`@ute:registry=https://...`) — don't set a blanket default registry that
  silently redirects unrelated installs.
- Add `.npmrc` to a repo only if that repo actually uses registry config.
- Never commit auth tokens or literal secrets in `.npmrc` or anywhere else —
  supply them only via environment variables or a secret manager (CI
  secrets / Vault).
- Every package must have a defined owner, a `README.md` describing usage,
  and an up-to-date `LICENSE` file before it is published.

## CI/CD expectations

Use dedicated CI/CD templates from approved repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
for the build/test/publish pipeline in this repo, rather than hand-rolling
it. Document the selected delivery model in `docs/ci-cd.md` — see
`core/standards/ci-cd.md`.

## Forbidden patterns

- No clear/identifiable scope, or a name like `common`/`utils`/`shared`
  without a specific, clarified purpose.
- Public package in a private scope without justification, or a private
  package in a public scope without an explicit decision.
- Tokens/secrets committed inside `.npmrc`.
- Publishing or maintaining a package without a `LICENSE`, without a
  `README.md`, or without a defined owner.
- Incorrect `private` value, or `publishConfig` pointing at the wrong
  registry for the package's scope/visibility.
- Duplicating shared logic across multiple packages instead of consolidating
  it.
- Shipping a breaking change without a MAJOR version bump or migration
  notes.

---
These are recommendations and checks for this archetype, not mandates — an
existing project is not required to restructure to match them.
