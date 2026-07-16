# Validation — Angular Library

## Testing expectations

- Unit tests for every exported component/service/pipe's public behavior,
  not just internal implementation details.
- If a demo app exists, treat it as a manual/e2e-style smoke check for how
  the library actually behaves when consumed — not a replacement for unit
  tests.
- Test the public API surface as a consumer would import it, not via
  relative paths into `src/lib/`.

## CI/CD expectations

- Lint, typecheck, and unit tests run on every PR.
- `ng-packagr` build (or equivalent) runs in CI, not just the workspace
  build — this is what catches "works in the monorepo, broken as a
  package" issues.
- Before publish: verify package contents (e.g. `npm pack --dry-run`) and
  confirm `public-api.ts` exports match what's documented.
- Version bump and changelog entry are part of the same PR/release process,
  not an afterthought.

## Common risks

- Angular declared as a direct dependency instead of a peer dependency,
  causing duplicate Angular instances in consuming apps.
- Breaking change shipped as a minor/patch version because a
  non-`public-api.ts` file was assumed "internal" but was actually imported
  by a consumer via a deep path.
- Packaged output missing assets (styles, i18n files) that work fine in the
  workspace but aren't included by `ng-packagr` config.
- README/usage examples drifting from the real API after a refactor.
- Demo app silently depending on the source (`src/lib`) instead of the
  built package, masking packaging bugs until publish.
