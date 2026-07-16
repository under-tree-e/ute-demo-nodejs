# Pull Requests

## Purpose

Define the mandatory Pull Request workflow into `main`: Draft → Ready for
review → approved+green → squash merge, with fixed contracts for PR title,
PR description, merge gating, and author/reviewer/CI-CD responsibilities.

## Applies To

- Every UTE repo where `main`/`master` is the protected integration branch.
- Every change to `main`, regardless of size, and regardless of whether the
  author is a human or an agent.
- Both GitHub Actions and Jenkins delivery paths (this standard governs the
  PR/review layer, not the pipeline implementation).

## Does Not Cover

- Branch naming — see `standards/git/branching.md`.
- Commit message format — see `standards/git/commits.md`.
- Release/tag process — see `standards/git/releases.md`, `standards/git/tags.md`.
- Review focus areas/checklist depth — see `standards/git/code-review.md`.
- Pipeline implementation, check definitions, runners — see `standards/ci-cd.md`.
- Repository access rules, CODEOWNERS, branch protection config — owned by
  repo/team governance, not this file.

## Source Documents

- PR memo (Memo) — mandatory PR workflow, title/description contract, merge
  gating, forbidden practices, author/reviewer/CI-CD responsibilities.
- Pull Request Template Blueprint (Blueprint) — PR description model,
  template variants, Draft/Ready-for-review gating, forbidden anti-patterns.

## Required Rules

- Any change to `main` MUST go through a Pull Request; no direct pushes or
  direct merges to `main`.
- A PR MUST validate changes before merge, trigger CI/CD, enable code
  review, capture task context, and allow handoff without verbal
  explanation.
- A Draft PR MUST be opened early (first logical pushed state) to capture
  current state and enable early CI runs, before the underlying work is
  finished.
- A PR MUST move from Draft to **Ready for review** only when: core logic
  is implemented, CI passes (or any failure is explained), the description
  is filled in and current, there are no critical unexplained TODOs, and
  the diff is reviewable without additional explanation.
- PR title MUST follow the format `<type>(<scope>): <short description>
  (<ticket>)` and MUST be suitable as the squash-commit message (e.g.
  `feat(timer): implement per-task time tracking (AX-142)`).
- PR description MUST answer: what was done, how to test, current state
  (Ready / WIP-incomplete), next steps, and risks/notes — even for very
  small PRs (brief is fine, empty is not).
- PR description MUST be updated before Ready-for-review, after
  significant logic changes, before handoff to another developer, and
  before merge if it has gone stale.
- Merge to `main` MUST happen only after: reviewer approval, green CI, and
  all blocking comments resolved.
- Merge MUST additionally require: PR up to date with `main`, no merge
  conflicts, correctly formatted title, and filled/current description.
- Merge strategy MUST be **squash merge**: one PR = one logical commit in
  `main`, and the squash commit message MUST match the PR title.
- Branch MUST be deleted after merge.
- Code review MUST check: logic of changes, architectural decisions, edge
  cases, risk to existing functionality, diff clarity, and adequacy of the
  PR description (see `standards/git/code-review.md` for the full focus
  list).
- Code review MUST NOT manually re-check formatting, test execution, basic
  build, or static analysis — that is CI/CD's responsibility, not the
  reviewer's.
- Author responsibilities: open a PR for every task; keep the description
  current; fix CI failures; respond to review comments; keep the PR
  updated against `main`; move Draft → Ready for review only once actually
  ready.
- Reviewer responsibilities: check logic and architecture; use blocking
  comments only for critical problems, not for checks CI already covers;
  approve only after sufficient review.
- CI/CD responsibilities: automatically check lint/format, type checking,
  unit tests, build verification, and any additional configured checks
  (implementation owned by `ute-ci-templates`/`ute-jenkins-library`, see
  `standards/ci-cd.md`).
- Every PR, including Draft PRs, MUST use the repo's PR template.
- No secrets, tokens, `.env` files, private keys, or credentials MUST be
  committed in a PR.

### PR description — required sections

The PR description (and the PR template that produces it) MUST cover:

- Summary
- Related task/issue
- Type of change
- What changed
- Testing performed (how to test)
- Documentation impact
- Deployment impact
- Rollback notes
- Screenshots/logs when relevant
- Checklist
- Current state (Ready / WIP-incomplete)
- Next steps

## Recommended Rules

- Keep Draft PR description non-empty/current even if incomplete, as long
  as it reflects actual state.
- Use Draft PR to signal work-in-progress transparency and enable early
  handoff.
- Keep diffs free of extraneous files or debug changes before requesting
  review.
- Reviewer should limit blocking comments to critical issues only, not
  nitpicks CI already covers.
- Author should proactively keep the PR up to date with `main` to avoid
  merge conflicts.
- Be specific in "Testing performed" — don't claim checks passed unless
  they actually ran.
- "Deployment impact" and "Rollback notes" can be brief ("none") but must
  not be omitted — reviewers shouldn't have to ask.
- Link the feature folder (from the `feature-plan` skill) when one exists.
- State "Next steps" explicitly, or write "None. PR is ready for review"
  when there are none.
- Write "What was done" as a concrete description of the actual change,
  not vague phrases like "done", "fixed", or "as in ticket".

## Forbidden Patterns

- MUST NOT push directly to `main`.
- MUST NOT merge without an open PR.
- MUST NOT merge a Draft PR.
- MUST NOT merge your own PR without review when the team has more than
  one developer.
- MUST NOT merge when CI is failing (red), or hide/ignore a failed CI run.
- MUST NOT open or keep a PR with no description, or an empty "How to
  test" section with no explanation.
- MUST NOT keep a PR description that is stale/outdated relative to
  current changes.
- MUST NOT submit large PRs without an explanation of scope.
- MUST NOT do work without first opening a Draft PR.
- MUST NOT store task context only in personal/verbal messages (chat,
  standup, DM) instead of the PR.
- MUST NOT let WIP commits land in `main` as separate commits — final
  history in `main` must be squashed.
- MUST NOT use a generic/non-descriptive PR title ("Update", "Fix",
  "Changes", "WIP", "Final", "Temp", "Timer stuff", or similar).
- MUST NOT write "see ticket" instead of a short inline description in any
  PR section.
- MUST NOT commit secrets, tokens, `.env` files, private keys, or
  credentials.
- MUST NOT remove/omit the checklist for production PRs.

## Agent Must Check

- PR exists and targets `main` via the normal branch flow before treating
  any change as mergeable.
- PR title matches `<type>(<scope>): <short description> (<ticket>)`.
- PR description is present, current, and covers all required sections
  (see above) — not a restatement of the diff, not "see ticket".
- CI status before recommending/performing a merge: green, or a failure is
  explicitly explained in the PR.
- Reviewer approval and that all blocking comments are resolved before
  merge.
- PR is up to date with `main` and has no merge conflicts before merge.
- Risks/Notes section is filled for any risky PR (auth, secrets, CI/CD,
  infra, migrations, deployment).

## Agent Must Not Do

- Must not push directly to `main` or bypass the PR flow on behalf of a
  user, even for small/urgent changes.
- Must not mark or treat a Draft PR as mergeable.
- Must not merge, or advise merging, a PR with failing/red CI, unresolved
  blocking comments, or a stale/empty description.
- Must not generate a non-descriptive PR title ("Update", "Fix", "WIP",
  etc.) when drafting a PR on the user's behalf.
- Must not author pipeline YAML/Groovy inline to "fix" a red check — that
  belongs to `ute-ci-templates`/`ute-jenkins-library` (see
  `standards/ci-cd.md`).
- Must not commit or paste secrets/tokens/credentials into a PR
  description or diff.

## Related Skills

- `pr-summary` — generates a PR description in this shape from the current
  diff and feature docs.
- `code-review` / `change-audit` — reviewer-side and audit-side use of this
  standard.
- `release-readiness` — checks merge gating before a release ships.
- `rollback-plan` — feeds the "Rollback notes" / "Risks" sections for risky
  PRs.

## Related Archetypes

N/A — this standard applies uniformly regardless of project archetype.

## Related UTE Repositories

- `ute-ci-templates` — owns the GitHub Actions checks a PR's CI status
  reflects.
- `ute-jenkins-library` / `ute-jenkins` — owns the Jenkins checks a PR's CI
  status reflects on that delivery path.
- Deployment/infra repos (`ute-ansible`, `ute-automation`, `ute-infra`,
  `ute-gitops`) are out of scope for the PR itself; a PR's "Deployment
  impact" section may reference them.

## Open Questions

- No numeric/size threshold is given for what counts as a "large PR
  without explanation" — left to reviewer judgment.
- No exception process is defined for emergency/hotfix pushes that might
  need to bypass normal PR flow.
- "Merge own PR without review if team has more than one developer"
  implies solo-developer repos may self-merge, but no explicit process is
  defined for that case.
- No guidance on how conflicts between this standard and a stricter
  repo-specific policy should be resolved.
- Source material is bilingual/translated from Ukrainian originals — watch
  for future source updates that may refine exact English phrasing.

## Where this is used

This repo ships no `.github/pull_request_template.md` — a project's own
GitHub PR template (if it has one) is that project's own file, not
installed from here (see `core/standards/ci-cd.md`). The "PR description —
required sections" list above is the canonical shape either way: fill a
project's existing template against it, or write the PR description
directly from it if the project has no template (GitHub or otherwise —
Jenkins/Semaphore projects without a PR-template feature follow the same
structure by convention).
