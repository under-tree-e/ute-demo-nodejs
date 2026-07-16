# Validation — npm Package

## Testing expectations

- Unit-test the public API surface directly (import from the same entry
  points a consumer would use), not just internal functions.
- Add a type-level test (e.g. compile a small consumer snippet, or use
  `tsd`/`expect-type`) if the package ships TypeScript types — a behavior
  test can pass while the types are wrong or too loose.
- For CLI-shaped or framework-integration packages, add a minimal consumer
  smoke test that installs/links the built package and imports it, to catch
  packaging bugs unit tests inside the repo miss.

## CI/CD expectations

- Lint, typecheck, and test on every PR, against `src/`.
- Build `dist/` and run at least the smoke test against the built output in
  CI — testing only against `src/` can hide packaging bugs (wrong `exports`,
  missing files).
- Publish only from CI, from a tagged release, after the full checklist in
  `rules.md` passes — never publish from a local machine for a real release.

## Publish-readiness checklist

Before any publish (manual approval or CI-triggered), confirm:

- [ ] Package name follows `@<scope>/<type>-<name>`.
- [ ] Scope matches the intended registry and visibility.
- [ ] `README.md` clearly describes usage.
- [ ] `LICENSE` present and up to date.
- [ ] `package.json` has all required fields (`name`, `version`, `private`,
      `description`, `author`, `license`, `scripts`, `repository`).
- [ ] `private` is set correctly for actual publish status.
- [ ] `publishConfig` is set and points at the correct registry, if
      publishable.
- [ ] No registry tokens/secrets committed anywhere in the repo.
- [ ] `build` command exists and succeeds.
- [ ] `lint`/`format:check` commands exist and pass.
- [ ] `test` command exists and passes, or its absence is explicitly
      justified.
- [ ] Dependencies are split correctly across `dependencies`/
      `devDependencies`/`peerDependencies`.
- [ ] Package has a defined owner.
- [ ] Version bumped per SemVer for the change type before publish.
- [ ] Publish happens via CI/CD or an explicitly approved release process,
      from `main` or a release tag — never an unapproved local publish.
- [ ] Published tarball contains no secrets, local configs, or test
      artifacts.

## Common risks

- Breaking a consumer without a major version bump (signature change,
  removed export, changed default behavior).
- `files`/`exports` misconfigured so the published tarball is missing
  compiled output, or leaks source/tests/internal files.
- Type definitions out of sync with runtime behavior.
- Publishing a `dist/` built from a dirty or stale working tree (not
  matching the tagged commit).
- Leaked registry token via a committed `.npmrc` or CI log output.
- `publishConfig`/scope mismatch causing a private package to publish to a
  public registry, or vice versa.
- No defined owner, so a failing publish or a needed deprecation has no one
  to act on it.
