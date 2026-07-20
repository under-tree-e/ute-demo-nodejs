# Commits

## Purpose
Keep history readable and safe: every commit states its type, scope, and
ticket in one predictable shape, and never carries a secret.

## Applies To
- Every commit on every branch type defined in
  `core/standards/git/branching.md`.
- The squash-merge commit that actually lands on `main`.

## Does Not Cover
- Branch naming / one-task-per-branch — see
  `core/standards/git/branching.md`.
- PR description content and readiness checklist — see
  `core/standards/git/pull-requests.md`.
- Secrets handling in general (rotation, storage, scanning ownership) —
  see `core/standards/security.md`.
- Tagging/versioning a release — see `core/standards/git/tags.md` and
  `core/standards/git/releases.md`.

## Source Documents
- Git memo (status: **On Review**) — commit format, scope conventions,
  forbidden messages, secrets-in-git rule.

## Required Rules
- Format: `<type>(<scope>): <short description> (<ticket>)`.
  ```
  feat(scope): short description
  fix(scope): short description
  hotfix(scope): short description
  refactor(scope): short description
  docs(scope): short description
  test(scope): short description
  chore(scope): short description
  perf(scope): short description
  infra(scope): short description
  ci(scope): short description
  ```
- Accepted types: `feat`, `fix`, `hotfix`, `refactor`, `chore`, `docs`,
  `test`, `perf` — plus previously accepted `infra`, `ci`, `build`,
  `revert` (retained).
- Use `feat` (not `feature`) as the commit type — the branch type is
  `feature`, the commit type is `feat`.
- Type + scope + short, imperative description; one logical change per
  commit where practical.
- Only a clear, understandable squash commit from a Pull Request may land
  on `main` — not a raw list of WIP commits.
- The ticket ID must appear in the branch name or the commit message.
- Scope is lowercase, 1-2 words, no spaces (kebab-case allowed):
  - module/domain: `auth`, `users`, `payments`
  - package/project: `web`, `api`, `admin`, `mobile`
  - technical area: `db`, `ci`, `build`, `lint`, `ui`
  - feature/component: `timer`, `profile`, `dashboard`
- When a change spans many areas, use the single most central scope rather
  than stacking multiple scopes.
- Never commit or push secrets, tokens, `.env` files, or private keys to
  the repository — see `core/standards/security.md`.
- Confirm no secrets appear in the PR diff before requesting review.
- Use a release tag for a version bump, not a version-bump commit — see
  `core/standards/git/tags.md`.
- Examples:
  ```
  feat(auth): add OAuth login via Google (PROJ-451)
  fix(checkout): handle null cart on guest session (GP-88)
  infra(ci): add branch name validation step (NO-TICKET)
  ```

## Recommended Rules
- Reuse recurring, predictable scope names across commits (`auth`, `web`,
  `api`, `db`, `ci`, `timer`) so history stays scannable.
- No strict body/footer rules enforced yet, and no required
  breaking-change markers (`!` / `BREAKING CHANGE:`) — kept intentionally
  light so a project can adopt `commitlint` (or equivalent) later without
  rewriting history, since the type/scope/description shape already
  matches conventional-commit tooling.

## Forbidden Patterns
- Meaningless/generic commit messages: `update`, `fix`, `wip`, `save`,
  `temp`, `final`, `0.0.1-5`, `dev-update`.
- Version-bump commits used in place of a release tag.
- Committing or pushing secrets, tokens, or `.env` files.

## Agent Must Check
- Commit message matches `<type>(<scope>): <short description> (<ticket>)`
  — run `scripts/validate-commit-message.sh` if present. Accepted types:
  `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`, `perf`,
  `infra`, `ci`, `build`, `revert`.
- No secrets, tokens, keys, or `.env` content in the staged diff before
  committing — never read, print, generate, or commit secrets
  (`core/standards/security.md`).
- Ticket ID is present somewhere in the branch name or commit message
  before marking a task ready for review.
- The squash-merge message onto `main` is a single clear summary, not raw
  WIP history.

## Agent Must Not Do
- Must not commit or push secrets, tokens, `.env` files, or private keys
  under any circumstance.
- Must not author a version-bump commit in place of a release tag.
- Must not use placeholder/meaningless commit messages.

## Related Skills
- `pr-summary` — builds the PR description from commit history.
- `release-readiness` — checks commit/tag hygiene before release.

## Related Archetypes
- N/A

## Related Repositories
- N/A — commit-message and secrets-in-diff validation are
  agent-standards-owned and CI-agnostic. See `core/standards/ci-cd.md` for
  pipeline ownership boundaries and `core/standards/security.md` for
  secrets ownership generally.

## Open Questions
- Git memo status is "On Review" — confirm finalized before treating as
  binding.
- The release-tag process implied by "no version commits instead of
  release tags" is referenced but not defined in the memo — confirm
  `core/standards/git/tags.md` fully covers it.
