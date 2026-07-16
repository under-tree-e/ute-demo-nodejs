# Task Handover Standard

## Purpose

Task state must live in the repository and the Pull Request, not in an
author's head, private chat, or unpushed local commits. Litmus test: if the
task cannot be continued by someone else without the author, the handover
was done poorly.

## Applies To

- Any active task with in-progress code, whether or not a formal handover
  event has been triggered yet.
- Transfers between developers, absences, blocked tasks, stale Draft PRs,
  and routine end-of-workday state.
- Both human and AI-agent contributors picking up or pausing work.

## Does Not Cover

- Writing the PR description/summary itself — see `skills/pr-summary`.
- Deciding which docs need updating after a change — see `skills/docs-sync`.
- CI/CD pipeline definitions or execution — see `core/standards/ci-cd.md`.

## Source Documents

- Task Handover Memo (Draft, 2026-05-21).

## Required Rules

- Preserve task state via the repository and Pull Request — never via
  verbal explanation or private/personal messages.
- Create the task branch from `main`; push changes regularly instead of
  accumulating local-only commits.
- Open a Draft PR as soon as the first logical state of work is reached.
  The Draft PR is the handover point.
- Keep the PR description current regardless of the PR's status (Draft or
  Ready for review).
- Every PR description must contain a handover block with exactly these
  four sections:
  - **Current state** — what's implemented, verified, partially working,
    unfinished; temporary/interim decisions left in place; affected
    files/modules; any API/DB/config/env changes.
  - **How to run / test** — run commands, test commands, manual
    verification scenarios, required roles/permissions, required
    env/config, what tests do not cover.
  - **Next steps** — what to do next, highest-priority items, what's
    blocking completion, what needs clarification, what must happen before
    moving to Ready for review.
  - **Known issues / Risks** — what could break, known limitations,
    unverified edge cases, areas needing reviewer attention, any risk to
    production, database, auth, payments, or deployment.
- Trigger a handover (update the PR + handover block) before:
  - transferring the task to another developer;
  - pausing work on the task for more than 1 day;
  - vacation, sick leave, or other absence;
  - the task becomes blocked (as soon as it happens);
  - a Draft PR has gone more than one working day without an update;
  - end of workday, whenever there is active WIP;
  - changing the person responsible for the task;
  - recording an important temporary/interim decision.
- Author, before considering a handover complete, must verify:
  - all local changes are pushed;
  - the PR exists;
  - the PR description is current;
  - all four handover-block sections are filled in;
  - CI has been run, or the reason it wasn't is documented.
- Author must proactively report when a task becomes blocked — do not wait
  to be asked.
- New assignee, before continuing the work, must:
  - read the PR description and linked ticket;
  - check CI status;
  - run the project via the documented commands.
- New assignee must update the PR description after making their own
  significant changes.
- At end of workday, any active task must be left in the remote repository
  in an understandable state: changes pushed, Draft PR created/updated,
  Current state not stale, critical TODOs described, CI status clear.
- Task state must be understandable purely from: branch, commits, PR, PR
  description, CI status, comments/reviewer notes, and linked ticket — with
  no other channel required.
- Before treating a handover as complete, confirm all of: branch pushed;
  PR created; PR description current; all four sections filled; CI status
  clear; linked ticket accessible; no important unpushed local changes;
  temporary decisions described; blocking issues described; the new
  assignee can start work from the PR alone.

## Recommended Rules

- Update the handover block after a major change in logic, after
  discovering a new risk, after CI turns partially red/failing, or after
  the implementation plan changes.
- New assignee should feel entitled to request an updated PR description,
  request a push of all local changes, or decline the task if the handover
  is incomplete.
- Treat CI status as the objective technical state of the task, above any
  verbal claim of "it works."

## Forbidden Patterns

- Handing off a task without an existing Pull Request.
- Keeping important changes only in the local working copy (unpushed).
- Transferring task context only through personal/private messages.
- Vague, detail-free status entries ("done", "fix", "later", "need check").
- A stale/outdated Current state section.
- Omitting known blocking issues or known risks.
- A Draft PR left without an update for multiple days.
- Handing off a task without pushing the code.
- Substituting verbal explanation for the PR description.
- Hiding a red/failing CI, or not explaining its cause.
- Relying on the author's memory, private notes, personal messages, local
  unpushed changes, or "I'll explain later" as the mechanism for conveying
  task state.

## Agent Must Check

- Is there an open PR (Draft or Ready) for this task? If not, flag before
  proceeding with a handover.
- Does the PR description contain all four handover-block sections, each
  non-empty and non-generic?
- Are there local commits not yet pushed to the remote?
- Has the Draft PR gone stale (no update in more than one working day)?
- Is CI status visible and, if red, is the cause documented in Known
  issues / Risks?
- Is there a linked ticket, and is it reachable from the PR?

## Agent Must Not Do

- Must not report a task as "handed over" or "paused" while local changes
  remain unpushed.
- Must not accept or act on a task handover conveyed only through a chat
  message, when no PR/branch exists to back it.
- Must not write a handover block section that merely restates the section
  title or repeats "done"/"n/a" without substance when work is incomplete.
- Must not silently skip the end-of-workday handover update when there is
  active WIP.

## Related Skills

- `skills/pr-summary` — use it to draft/refresh the PR description this
  standard's handover block lives inside; do not restate its process here.
- `skills/docs-sync` — use it to decide whether project docs (as opposed to
  the PR's own handover block) need updating; do not restate its process
  here.

## Related Archetypes

- N/A

## Related UTE Repositories

- N/A — this standard governs PR/branch process, not any pipeline or
  infrastructure repo.

## Open Questions

- Source memo is still Draft (2026-05-21) — unclear if formally approved
  for governance-repo adoption.
- No criteria given for what makes CI status "clear" vs "unclear" beyond
  red/green — left to reviewer/agent judgment.
- Whether the handover-block template should be codified as an actual
  `.github/PULL_REQUEST_TEMPLATE.md` is out of scope for this repo (that
  artifact belongs to the consuming project or its CI/template repo, not
  this governance repo).
- No guidance on handover across multiple repos/services for a single task
  — relevant to UTE's multi-repo architecture but not addressed by source.
- "1 working day" thresholds (pause-before-handover, Draft PR staleness)
  are not quantified against a business-day calendar or timezone.
