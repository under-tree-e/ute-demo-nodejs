# Feature Folder Standard

## Purpose

Keep `features/` small, current, and trustworthy. One feature is one
branch and one PR. A feature folder is needed only while its PR is open:
once the PR is merged or closed, the folder is deleted at the start of the
next feature, on the next feature's branch — never in a PR opened only to
close something. Git history keeps everything
else. `CHANGELOG.md` is for releases only
(`core/standards/release-versioning.md`) and gets no feature entries.

## Applies To

Every repository that uses `features/`, for every agent and human who
creates, updates, implements, audits, or closes a feature folder.

## Does Not Cover

- What `docs/` must contain — see `core/standards/documentation.md`.
- How `docs/architecture.md` records decisions — see `core/standards/knowledge-governance.md`.
- Release notes format — see `core/standards/release-versioning.md`.

## Required Rules

### When a folder is needed

- Create a feature folder only for multi-step, cross-repository, or
  risk-bearing work.
- A trivial, easily reversible change (single-purpose fix, rename,
  docs-only edit, dependency bump) gets no folder: branch, commit, and PR
  description are enough.
- One feature = one branch = one PR: `spec.md`, `plan.md`, the
  implementation, and `audit.md` all land in the same PR, which merges with
  `Status: done`.
- A feature that changes several repositories has exactly one folder, in
  the repository that owns the change (platform-wide work: `platform`).
  Other repositories get no feature folder; each gets one PR whose
  description references the owner (`platform#F041`). The owning
  repository's PR merges last, after the other repositories' PRs.

### Structure

```text
features/FXXX-short-name/
  spec.md    what and why: status, scope, acceptance criteria with Verify lines, deferred cuts, risks, questions, decisions
  plan.md    current checklist, docs impact, next step
  audit.md   written only by the auditor; latest verdict
```

- No other files. Supporting material that must outlive the feature goes
  to `docs/`; runbooks go to `docs/**/runbooks/`, never into `features/`.
- `features/` contains only feature folders — no index `README.md`; the
  folder listing is the index.
- `spec.md` target: under 200 lines. `plan.md` target: under 150 lines.
  A folder that outgrows this is a sign to split the feature.

### Status

`spec.md` starts with a header block:

```text
Status: draft | awaiting-answers | approved | in-progress | in-audit | needs-fixes | done | abandoned
Branch: <branch name>
Repositories: <this repo, plus any other repo the feature changes>
```

- `Status` holds exactly one value from the list. No free text, no dates,
  no qualifiers.
- `awaiting-answers`: open questions block the next step. Implementation
  does not start while any question in `spec.md` is unanswered.

### Acceptance criteria and Verify lines

- Every acceptance criterion carries a `Verify:` line: an exact command or
  manual step and its expected result. The implementer runs every Verify
  line before `in-audit`; the auditor runs every one again and records the
  output.
- Every open question carries a `Recommendation:`. Answers move to
  `Decisions`, and the question leaves `Open questions`.

### Deferred cuts

`spec.md` "Deferred" lists what this feature deliberately does not build
(the low-value 20%). Building a Deferred item is a defect, not initiative.
Correctness, security, data integrity, and concurrency are never deferred.

### Implementation report

The implementation report lives in the feature's PR description, not in
`plan.md`, so it survives the folder's deletion. It covers what was built
and why, deviations from `spec.md` with their reason, additions beyond
`spec.md`, deferred or not-done items, and how to verify. A deviation
found by the audit that the report does not declare is a critical
finding.

A PR is not merged before `change-audit` returns pass or pass with notes.
- Update `Status` in the same commit that changes the state.

### Scope tags

Every scope item in `spec.md` carries one tag:

- `[EXISTS]` — already present, relied on unchanged.
- `[MODIFY]` — present, will change.
- `[NEW]` — does not exist yet.

The implementer re-checks every tag against the repository before
starting. A tag that no longer matches the code is corrected in
`spec.md` before any code change.

### Current state, not history

- `plan.md` and `spec.md` describe the current state. Edit them in place;
  never append dated progress logs, "found/fixed" stories, or per-session
  reports.
- A completed checklist item is ticked, not narrated.
- Progress history lives in commit messages and the PR.
- `audit.md` holds the latest verdict and its open findings. A re-audit
  replaces resolved findings instead of appending a new round.

### Closure at the next feature start

A folder is kept only while an open PR changes it. Before creating a new
feature folder:

1. List entries under `features/` touched by open PRs, whatever their
   naming scheme:

   ```bash
   for n in $(gh pr list --state open --limit 1000 --json number --jq '.[].number'); do
     gh pr diff "$n" --name-only
   done | grep -oE '^features/[^/]+' | sort -u
   ```

2. For every other entry under `features/` — any status, including legacy
   folders and an index `README.md` — find who created it, by GitHub login
   (a person's local and GitHub no-reply emails resolve to the same login):

   ```bash
   me=$(gh api user --jq .login)
   repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
   sha=$(git log --diff-filter=A --format=%H -- "features/<entry>" | tail -1)
   gh api "repos/$repo/commits/$sha" --jq '.author.login // "unknown"'
   ```

   - Created by `$me`: delete without asking.
   - Created by anyone else, or `unknown`: list them with their author for
     the user, and delete only the ones the user confirms.
3. Put the deletions in one separate commit on the new feature's branch
   (`chore(features): remove closed feature folders`), inside the new
   feature's PR.

Never read a deleted folder's contents as current requirements.

`docs/` is updated during implementation, whenever behavior,
configuration, deployment, or operations change — not as a closure step.

### Checking closure

The base branch is the source of truth, whoever or whatever merged, and
whether PRs are squash-merged or merged with merge commits. The base
branch is the repository's default branch
(`gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`, or
`git remote show origin | sed -n 's/.*HEAD branch: //p'`) — for example
`main` or `dev`. Below, `<base>` is that branch and `<folder>` is the
folder's actual name.

| Question | Check |
| --- | --- |
| Is the feature finished? | Its `spec.md` on `origin/<base>` says `Status: done`. |
| Was its PR merged, not just closed? | `gh api repos/<owner>/<repo>/pulls/<N>` → `merged: true`. A PR closed unmerged never put the folder on the base branch. |
| Which commit removed the folder? | `git log origin/<base> --first-parent --diff-filter=D -1 -- 'features/<folder>'` — `--first-parent` returns the squash commit or the merge commit that landed on the base branch. |
| Which PR was that? | `gh api repos/<owner>/<repo>/commits/<sha>/pulls --jq '.[].number'` — works for squash and merge commits. |
| Done or abandoned? | The last `Status` before removal: `git show <sha>^:features/<folder>/spec.md \| head -5`. |

### Identifiers

- `FXXX` is sequential per repository, assigned once, never reused — also
  not after the folder is deleted; count deleted folders from git history.
- A reference from another repository qualifies the owner:
  `platform#F041`.
- Feature identifiers appear only in `features/`, commit messages, and PR
  text — never in code, comments, file names, or
  live resource names (see `core/standards/code-quality.md`).

## Forbidden Patterns

- A feature folder on the base branch after the next feature's PR merged,
  unless an open PR still changes it.
- A second feature folder for the same feature in another repository.
- A runbook or index `README.md` inside `features/`.
- A PR whose only purpose is closing features.
- A feature split across several PRs in the same repository.
- An archive directory for closed features (`features/_archive/`,
  `features/done/`, and similar).
- Dated progress sections, session logs, or "Round N" audit sections in
  `spec.md`, `plan.md`, or `audit.md`.
- Two sections of the same folder that contradict each other about the
  state of the same item.
- A free-text `Status` value.

## Agent Must Check

- Before creating a feature folder: run the closure step above.
- Before reading a feature folder: it is touched by an open PR; otherwise
  skip it.
- Before implementing: every scope tag still matches the code.
- Before finishing a feature: `Status: done` is set in the feature's PR.

## Agent Must Not Do

- Must not treat a closed feature's deleted files, recovered from git
  history, as current requirements unless the user asks for them.
- Must not create a feature folder for a trivial change.
- Must not add a feature entry to `CHANGELOG.md`.
- Must not open a PR whose only purpose is closing features.
- Must not delete a feature folder created by someone else without the
  user's confirmation.
- Must not delete a feature's own folder in that feature's PR.
- Must not copy feature identifiers into code, comments, or resource
  names.

## Related Skills

- `feature-plan`
- `implementation-pass`
- `change-audit`
- `docs-sync`
