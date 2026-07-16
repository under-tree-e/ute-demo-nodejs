# Branching

## Purpose
One task = one branch, named so its type and ticket are obvious at a
glance, never landing on `main` except through a reviewed, squashed PR.

## Applies To
- Every branch created for `feature`, `fix`, `hotfix`, `refactor`, `chore`,
  `docs`, `test`, or `infra` work in a UTE repository.
- Any developer or agent pushing branches to a UTE-managed remote.

## Does Not Cover
- Commit message format, scope, secrets-in-git — see
  `core/standards/git/commits.md`.
- PR structure/content and readiness checklist — see
  `core/standards/git/pull-requests.md`.
- Tag/release process — see `core/standards/git/tags.md` and
  `core/standards/git/releases.md`.
- Pipeline execution (what runs CI on a push) — see
  `core/standards/ci-cd.md`.

## Source Documents
- Git memo (status: **On Review**) — branch naming, one-branch-one-task,
  push cadence, forbidden practices.

## Required Rules
- One branch = one task, branched from `main`. Do not put more than one
  task's changes in a single branch.
- Planning-only work counts as a task. Creating or updating a feature's
  `spec.md`/`plan.md`/`audit.md` (or any other planning/governance
  artifact) is not exempt from "one branch = one task" just because no
  application code is involved yet — it happens on its own dedicated
  branch, never directly on `main` and never appended onto another task's
  active branch. See `core/sdlc/feature-planning.md`.
- Name branches `<type>/<ticket>-<short-description>`:
  ```
  feature/<ticket>-short-description
  fix/<ticket>-short-description
  hotfix/<ticket>-short-description
  refactor/<ticket>-short-description
  chore/<ticket>-short-description
  docs/<ticket>-short-description
  test/<ticket>-short-description
  infra/<ticket>-short-description
  ```
- Allowed branch types: `feature` (new functionality), `fix` (defect fix),
  `hotfix` (critical production fix), `refactor` (behavior-preserving
  refactor), `chore` (technical/config/deps changes), `docs`
  (documentation), `test` (tests) — plus `infra` (existing UTE convention,
  retained).
- Ticket: any tracker reference works (`GP-123`, `UTE-123`, `#123`). Use a
  real ticket when the work is tied to one. `NO-TICKET` is allowed only for
  small internal maintenance, throwaway experiments, or initial repo setup.
- Examples:
  ```
  feature/UTE-451-add-oauth-login
  fix/GP-88-null-pointer-on-checkout
  docs/NO-TICKET-fix-readme-typo
  hotfix/UTE-999-rollback-broken-migration
  ```
- Never push directly to `main`.
- Never force-push without explicit permission.
- Treat a push as a progress sync, not a final deliverable — only a
  squash commit from a reviewed PR lands on `main`.
- Do not leave work only on a local machine for multiple days without
  pushing.
- Do not keep a long-lived branch without an accompanying Draft PR once the
  first logical chunk of work exists.

## Recommended Rules
- Push after completing a logical step of work.
- Push at the end of the workday.
- Push before handing the task off to another developer.
- Push before creating or updating a Draft PR.
- Daily flow: checkout `main` -> pull -> branch -> work -> push -> Draft
  PR. Master flow end-to-end: Ticket -> Branch -> Push -> Draft PR -> CI ->
  Review -> Squash Merge.

## Forbidden Patterns
- Pushing directly to `main`.
- Force-pushing without permission.
- Putting more than one task in a single branch.
- Including a developer's name in a branch name (e.g.
  `angular-fields-AX-142-jsmith`).
- Informal/non-conforming names (e.g. `my-branch`, `test123`,
  `feature/timer` with no ticket).

## Agent Must Check
- Branch name matches `<type>/<ticket>-<short-description>` before pushing
  — run `scripts/validate-branch-name.sh` if present (`--ticket-prefix` to
  set the expected prefix per project, `--allow-no-ticket` to opt in to
  `NO-TICKET`). Run it locally before pushing, or wire it into the
  project's own CI (this repo ships the script, not a CI workflow —
  production CI/CD ownership is `ute-ci-templates`/`ute-jenkins-library`,
  see `core/standards/ci-cd.md`).
- Branch was created from an up-to-date `main`.
- Only one task's worth of change is on the branch.
- A Draft PR exists once the first logical push lands, if the task isn't
  ready for review yet.

## Agent Must Not Do
- Must not push to `main` directly, ever.
- Must not force-push without the user's explicit, in-conversation
  permission.
- Must not create or extend a branch carrying more than one task.
- Must not invent a ticket reference, or drop a real one in favor of
  `NO-TICKET`.

## Related Skills
- `feature-plan` — produces the ticket/feature folder a branch should
  reference.
- `pr-summary` — relies on branch naming to link back to the task.
- `release-readiness` — checks branch/PR hygiene before release.

## Related Archetypes
- N/A

## Related UTE Repositories
- N/A — branch naming and its validation script are agent-standards-owned
  and CI-agnostic. See `core/standards/ci-cd.md` for pipeline ownership
  boundaries (`ute-ci-templates`, `ute-jenkins-library`, etc.).

## Open Questions
- Git memo status is "On Review" — confirm these rules are finalized, not
  still subject to change, before treating them as binding.
- Who grants "permission" for a force-push, and through what mechanism, is
  not specified — needs an owner/process.
