# Recommended Structure — Angular Library

This is a recommendation for new projects or major reorganizations, not a
requirement. Do not blindly restructure an existing library that already
works differently.

```text
projects/<lib-name>/
  src/lib/                # implementation — components, services, pipes
  src/public-api.ts       # the ONLY intentional export surface
  ng-package.json
  package.json            # published package metadata, peerDependencies
projects/demo/            # optional sandbox app consuming the library locally
docs/
features/                 # feature folders (see feature-plan)
```

## Notes

- `src/lib/` internals are free-form — organize by feature/component as
  needed. What matters is that nothing inside is reachable except through
  `public-api.ts`.
- The demo app (`projects/demo/`) is optional but strongly recommended for
  any library with UI components — it's how the library gets exercised
  during development without publishing first.
- A single-purpose repo (one library, no workspace) can flatten this to
  `src/lib/` + `src/public-api.ts` at the repo root — the workspace layout
  above is for Nx/multi-project setups.
