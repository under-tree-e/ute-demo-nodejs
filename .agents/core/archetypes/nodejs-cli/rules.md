# Rules — Node.js CLI

## Command structure

- Use subcommands for distinct actions (`mytool deploy`, `mytool rollback`),
  not one command with a dozen unrelated flags.
- Keep flag naming consistent across subcommands: same concept, same flag
  name and shorthand everywhere (`--dry-run` everywhere, not `--dry-run` here
  and `--simulate` there).
- Support `--help` on every command and subcommand, not just the root.

## Argument validation

- Validate all arguments before doing any work; fail fast.
- Error messages state what was wrong and what a valid value looks like —
  never a raw stack trace to a user for expected input errors.
- Exit with a non-zero code on any failure; never exit 0 after printing an
  error.

## Safety

- Anything that mutates state (writes files, calls an API, deletes data,
  deploys) supports `--dry-run` that prints what would happen and does
  nothing.
- Destructive actions are never the default behavior — require an explicit
  flag (`--force`, `--yes`) or an interactive confirmation.
- Default behavior on missing/ambiguous input is to stop and ask or error,
  not to guess and proceed.

## Config

- Support project-level config (e.g. `mytool.config.json` in the repo) and
  user-level config (e.g. `~/.config/mytool/config.json`).
- Document precedence explicitly (recommended: CLI flags > project config >
  user config > built-in defaults) in the project's own docs.

## Output

- Human-readable output is the default (formatted text, colors ok if TTY).
- Provide `--json` for scripting/CI consumption; JSON output goes to stdout,
  human/status/progress messages go to stderr.
- Do not mix machine-readable and human-readable output on the same stream.

## CI/CD expectations

Use dedicated CI/CD templates from approved UTE repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
instead of hand-rolling build/test/publish pipeline logic in this repo.
Document the selected delivery model in `docs/ci-cd.md` — see
`core/standards/ci-cd.md`.

---
These are recommendations and checks for this archetype, not mandates — an
existing project is not required to restructure to match them.
