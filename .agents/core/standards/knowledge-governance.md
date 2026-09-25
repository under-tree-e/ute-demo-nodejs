# Knowledge Governance

## Purpose

Every kind of project knowledge (what a feature must do, why an approach
was chosen, how the system is structured, what exists right now) has
exactly one authoritative document type that owns it. Agent memory, prior
conversations, and search-result ranking (newest, largest, most similar
title) are never that authority — they can help locate the authoritative
artifact, never replace it. This standard defines the ownership model,
how `docs/architecture.md` records decisions as current state (no
separate decision-record files), a lightweight `Change Contract` format for
changes too small to justify the full feature-folder structure, and how
an agent must classify and handle a contradiction between two documents.

## Applies To

- Any project knowledge that is meant to outlive a single conversation or
  session, in any repository following this standard: feature
  specifications, architecture docs, decisions, API/data contracts,
  runbooks, and the current-state docs `project-discovery.md` produces.
- Any human or AI agent authoring, updating, or reading project
  documentation as part of a change.
- Applies alongside the existing feature-folder, architecture-review, and
  docs-sync mechanics — it classifies and arbitrates between them, it does
  not replace any of them.

## Does Not Cover

- The feature-folder file structure and its content —
  see the `feature-plan` skill.
- The architecture-review process and its output —
  see the `architecture-review` skill.
- Docs-sync mechanics (deciding which docs to update after a change) —
  see the `docs-sync` skill.
- PR/handover state and its four-section block —
  see `core/standards/task-handover.md`.
- Test/acceptance content itself —
  see the `test-strategy` skill.
- The project-level current-state entry point
  (`docs/product-overview.md`, `docs/architecture.md`, etc.) and how it's
  built — see the `project-discovery` skill. This standard classifies
  those docs as authoritative sources and defines how
  `docs/architecture.md` is updated (Architecture document, below).
- The mandatory order of operations for non-trivial work —
  see `core/standards/workflow.md`. This standard adds a classification
  step inside that order (Recommended Rules below), it does not add a
  second mandatory sequence.

## Source Documents

- "UTE Project Knowledge & Change Governance Standard" (status: Draft,
  supplied 2026-09-23) — knowledge-class taxonomy and authority model
  (source §§1-3), decision promotion into current state (source §8), the Change
  Contract concept (source §§5-6), and the conflict-handling taxonomy
  (source §12) are extracted below. The source's universal change-model
  diagram (§4), per-task-type context lists (§11), and project-level
  current-state entry point (§16) are intentionally **not** ingested —
  they restate the pipeline already defined in `docs/sdlc-workflow.md`
  and the doc set the `project-discovery` skill already produces; see
  Open Questions for the one piece (a completion-summary contract,
  source §15) left for a separate decision instead of silently dropped or
  silently duplicated.

## Required Rules

### Ownership table

One knowledge type has exactly one authoritative artifact. Other
documents may mention the fact; they must cross-reference the owner
instead of restating it (this generalizes the duplication rule already in
`core/standards/documentation.md`'s Forbidden Patterns beyond `docs/` to
every knowledge artifact below).

| Knowledge type | Authoritative artifact |
| --- | --- |
| What an open feature must do | `features/FXXX-.../spec.md` (exists only while the feature is open, see `core/standards/features.md`) |
| Why a technical/architectural approach was chosen | The description of the PR that changed `docs/architecture.md` (its `Why` section), found via the PR reference next to the statement |
| How components/boundaries are structured, right now | `docs/architecture.md` (built by `project-discovery.md`, kept current by `architecture-review.md` + `docs-sync.md`) |
| How an accepted change will be implemented | `features/FXXX-.../plan.md` (while open) |
| Documented exceptions to a standard | `docs/architecture.md` "Exceptions" section |
| How something is deployed or operated | `docs/operations.md`, plus the `rollback-plan` skill output for risky changes |
| What proves a change is complete | `spec.md` Acceptance criteria + the `test-strategy` skill output |
| What changed, and when | Git history of the base branch (`git log --first-parent`); `CHANGELOG.md` for releases only |
| What exists right now | Code, configuration, and deployed state. This never silently redefines what *should* exist — a gap against any row above is drift or a defect, not an automatic requirement change (see Conflict Handling). |

### Architecture document

There are no decision-record files: no `docs/decisions/`, `ADR-*.md`, or
`decisions.md` registry. The outcome of a decision is written into
`docs/architecture.md` as current state; the reasoning stays in the PR
that made the change.

- **One document per area.** The architecture document is
  `docs/architecture.md`. A repository that already keeps its architecture
  elsewhere, or split by area, keeps that location; "Constraints" and
  "Exceptions" may be sections of it or one dedicated file each within
  the same set (for example a `rules.md` next to it). Never a second copy
  of the same area.
- **Current state by section.** A change edits the section it belongs to.
  A new section is added only for a new topic. No "Updates", "Changes",
  or "History" sections.
- **Constraints.** A decision that forbids or requires something is
  recorded as a dry, checkable rule in a "Constraints" section, e.g.
  "Destroy runs only on sandbox hosts. (#123)". That is enough to keep an
  agent from undoing it; the reason is in the PR.
- **Exceptions.** A documented exception to a standard (the kind
  `ci-cd.md`, `jenkins.md`, `release-readiness` and `project-discovery`
  accept) is an entry in an "Exceptions" section: what is exempt, its
  scope, the PR, and the condition for removing it. An exception whose
  removal condition is met is deleted.
- **PR references, latest only.** A statement carries the PR that last
  changed it — `(#123)`, or `(ansible#228)` across repositories. When the
  statement changes, the reference is replaced, never appended. Full
  history: `git log -L` on the file.
- **Size.** Past about 500 lines, split by area (for example
  `docs/architecture/<area>.md`), still current state only.
- **Open decisions** live in the open feature's `spec.md` ("Open
  questions", "Decisions") and reach `docs/architecture.md` when the
  feature's PR merges.
- The PR that changes `docs/architecture.md` states the reason in its
  description (`Why` section, see the `pr-summary` skill).

### Change Contract

For a change small enough that `architecture-review.md`'s "not needed for
small, contained, single-module changes" applies, and whose acceptance
criteria fit in a handful of bullets, a delta-shaped Change Contract MAY
replace the body of `spec.md` (keep its Status header). `plan.md` is still
produced.

Required shape when used — describe before/after, not the whole feature:

```text
CHANGE CONTRACT

Goal
Current State
Target State
Added / Changed / Removed / Unchanged
Affected Components / Interfaces / Data
Dependencies
Behavioral & Technical Invariants
Required Implementation Changes
Required Tests
Required Documentation Changes
Open Questions
Explicit Non-Goals
```

Omit sections that don't apply; do not restate the full product to fill
space.

### Conflict handling

An agent that finds two documents disagreeing MUST classify the
disagreement before acting:

- **Stale duplication** — an authoritative source exists per the table
  above, and another document holds an outdated copy. Action: use the
  authoritative source; update or remove the stale copy.
- **Authority violation** — a document states something outside its
  owned knowledge type (e.g. a `plan.md` defining a new
  API contract inline). Action: move the decision into the artifact that
  owns it, replace the violating content with a cross-reference.
- **Implementation drift** — current code/config/deployed state
  disagrees with an accepted requirement. Action: report the drift; fix
  it if in scope, otherwise flag it explicitly — never treat the current
  implementation as having silently redefined the requirement.
- **True authority conflict** — two currently-active authoritative
  documents (both from the table above, neither superseded) state
  incompatible requirements. An agent MUST NOT silently pick one. Report
  it and leave dependent work unresolved/blocked until a human resolves
  it — this is a stricter, narrower case than `change-audit.md`'s
  "needs fixes"/"blocked" verdicts, and should be reported using that
  same verdict language when it surfaces during a change audit.

## Recommended Rules

- Before authoring a new piece of project knowledge, identify its
  knowledge type from the table above and check whether an authoritative
  artifact for it already exists, before deciding which file to write
  into. This is a classification step inside the existing mandatory order
  in `core/standards/workflow.md`, not a second mandatory sequence.
- Prefer a one-line cross-reference ("Authentication is performed via
  OIDC — see `docs/architecture.md`.") over re-explaining an
  already-owned fact, even briefly.
- When a small change's Change Contract later grows (new dependencies,
  new invariants, scope creep discovered), promote it to the full
  feature-folder structure rather than letting one file quietly carry
  more than the delta-shaped format was meant for.

## Forbidden Patterns

- Two independent documents both defining behavior for the same
  interface, architecture boundary, or data contract, maintained
  independently instead of one owning it and the other cross-referencing.
- Treating current code/config/deployed state as if it silently redefines
  a requirement, instead of flagging the mismatch as drift.
- An Implementation Plan or Runbook introducing a new
  product or architecture requirement inline instead of routing it
  through the artifact that owns that knowledge type.
- Silently resolving a true authority conflict by picking one of the two
  disagreeing documents instead of surfacing it and pausing affected
  work.
- Decision-record files or directories (`docs/decisions/`, `ADR-*.md`,
  a `decisions.md` registry).
- An "Updates"/"Changes"/"History" section, or a list of several PR
  references on one statement, in `docs/architecture.md`.
- A documented exception without a removal condition, or one kept after
  its removal condition is met.
- Citing a documented exception that has no entry in the
  `docs/architecture.md` "Exceptions" section.

## Agent Must Check

- Before writing new project knowledge: does an authoritative artifact
  for this knowledge type already exist per the table above?
- Is this fact being duplicated into a new document instead of
  cross-referenced from the one that owns it?
- Is agent memory, a prior conversation summary, or "most recent/most
  similar" search ranking being treated as the source of truth for
  something a repository document should own?
- When a standard's exception clause is used, does the
  `docs/architecture.md` "Exceptions" section have the entry, with scope,
  PR, and removal condition?
- When a change alters architecture, does `docs/architecture.md` change
  in the owning section in the same PR, with that PR as the statement's
  only reference?
- When two documents disagree, has the disagreement been classified
  (stale duplication / authority violation / implementation drift / true
  authority conflict) before choosing an action?

## Agent Must Not Do

- Must not treat agent memory, cached context, or search-result
  freshness/similarity as authoritative over the document that owns a
  knowledge type per the table above.
- Must not create decision-record files; record the outcome in
  `docs/architecture.md` and the reasoning in the PR.
- Must not let an Implementation Plan or Runbook
  silently introduce a new product or architecture requirement — route it
  back to the artifact that owns it.
- Must not silently resolve a true authority conflict between two active
  documents by picking one; must report it and leave dependent work
  blocked until a human resolves it.
- Must not treat "what the code/config currently does" as automatically
  correct when it conflicts with an accepted requirement — report it as
  drift instead.

## Related Skills

- `feature-plan` — owns the Feature Specification / Implementation Plan
  artifacts this standard classifies; candidate to adopt the Change
  Contract format for small changes (see Open Questions).
- `architecture-review` — refreshes the Architecture artifact this
  standard treats as authoritative for "how components are structured".
- `change-audit` — the place a true authority conflict or implementation
  drift is most likely first noticed during review.
- `docs-sync` — updates `docs/architecture.md` per the Architecture
  document rules.
- `standards-gap-audit` — use when a gap in this ownership model itself
  (an unowned knowledge type, an artifact with no clear owner) is found.

## Related Archetypes

N/A — ownership applies uniformly regardless of project stack.

## Related Repositories

N/A — this is a documentation/process standard; it does not delegate
ownership to another repository.

## Open Questions

- The source document's completion-contract concept (its §15: a compact
  summary an agent produces after finishing significant work) partially
  overlaps `change-audit.md`'s existing "Audit output" and
  `task-handover.md`'s PR handover block. Not ingested here pending a
  decision on whether it becomes a third artifact or folds into one of
  those two.
- Source material is a single Draft document with no separate
  memo/policy/standard split — unlike other entries in
  `docs/source-standards-manifest.md`, there is no separate upstream
  status to track beyond this file itself.
