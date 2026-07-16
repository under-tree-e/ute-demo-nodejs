# Rules — Angular Library

## Public API boundary

- `public-api.ts` is the entire contract with consumers — export only what's
  intentionally public. Never widen it as a side effect of an internal
  refactor.
- Anything not exported from `public-api.ts` can be renamed, moved, or
  deleted without a breaking-change bump. Treat that boundary as load-bearing.
- Consumers must never be expected to deep-import from `src/lib/...` paths.

## Semantic versioning

- Patch: bug fixes, no API change.
- Minor: new exports/options, backward-compatible.
- Major: any removal or incompatible change to something in
  `public-api.ts` (including changed input/output signatures on exported
  components/directives).
- Deprecate before removing where practical — mark with `@deprecated` and a
  migration note at least one minor version ahead of removal.

## Peer dependencies

- Angular packages (`@angular/core`, `@angular/common`, etc.) are
  `peerDependencies`, not `dependencies` — the library must not bundle or
  pin its own copy of Angular.
- Keep the peer range as wide as realistically supported; don't pin to a
  single exact Angular version unless there's a real compatibility reason.

## Build/package validation

- Build with `ng-packagr` (or equivalent) before every publish, not just
  `ng build` of the demo app.
- Inspect the packaged output (`npm pack --dry-run` or install the tarball
  into the demo app) before publishing — a library that builds in the
  workspace can still produce a broken package (missing files, wrong entry
  points).

## Demo/sandbox app

- If the library has any UI surface, maintain a demo app that imports it the
  same way an external consumer would (via the package entry point, not a
  relative path into `src/lib/`).

## Documentation

- Keep README usage snippets in sync with the actual public API — a stale
  example that no longer compiles is worse than no example.

---

These are recommendations and checks for this archetype, not mandates. An
existing project that already works differently is not required to
restructure to match.
