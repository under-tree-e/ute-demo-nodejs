# Validation — Node.js CLI

## Testing expectations

- Test command behavior, not just internal functions: invoke the built CLI
  (subprocess, or an in-process runner that captures stdout/stderr/exit code)
  and assert on all three.
- Cover: valid input happy path, invalid input error message + exit code,
  `--dry-run` performs no mutation, `--json` output is valid/parseable JSON.
- Unit-test `src/lib/*` logic directly where subprocess round-trips would be
  slow or redundant.

## CI/CD expectations

- Lint, typecheck (if TS), and run the test suite on every PR.
- Build the `bin` artifact and smoke-test `--help` / `--version` in CI, not
  just locally.
- If published to a registry, publish only from a tagged release, after
  tests pass — see `archetypes/npm-package/validation.md` if this CLI is also
  distributed as an installable package.

## Common risks

- Destructive default behavior (e.g. `mytool clean` deleting more than
  expected without confirmation).
- Silent failures — command exits 0 despite an internal error being swallowed.
- Flag combinations that aren't validated together (e.g. `--json` with
  `--interactive`) and produce broken or ambiguous output.
- Platform-specific path/shell assumptions (POSIX-only paths, relying on a
  shell that may not exist in CI or on Windows).
- Config precedence bugs — user config silently overriding project config or
  vice versa, contrary to documented precedence.
