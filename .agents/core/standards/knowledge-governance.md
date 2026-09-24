# Knowledge Governance

## Purpose

Every kind of project knowledge (what a feature must do, why an approach
was chosen, how the system is structured, what exists right now) has
exactly one authoritative document type that owns it. Agent memory, prior
conversations, and search-result ranking (newest, largest, most similar
title) are never that authority — they can help locate the authoritative
artifact, never replace it. This standard defines the ownership model,
the `Decision Record` artifact several other standards already assume
exists (see Source Documents), a lightweight `Change Contract` format for
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
  see `core/sdlc/feature-planning.md`.
- The architecture-review process and its output —
  see `core/sdlc/architecture-review.md`.
- Docs-sync mechanics (deciding which docs to update after a change) —
  see `core/sdlc/docs-sync.md`.
- PR/handover state and its four-section block —
  see `core/standards/task-handover.md`.
- Test/acceptance content itself —
  see `core/sdlc/test-strategy.md`.
- The project-level current-state entry point
  (`docs/product-overview.md`, `docs/architecture.md`, etc.) and how it's
  built — see `core/sdlc/project-discovery.md`. This standard classifies
  those docs as authoritative sources; it does not redefine their shape.
- The mandatory order of operations for non-trivial work —
  see `core/standards/workflow.md`. This standard adds a classification
  step inside that order (Recommended Rules below), it does not add a
  second mandatory sequence.

## Source Documents

- "UTE Project Knowledge & Change Governance Standard" (status: Draft,
  supplied 2026-09-23) — knowledge-class taxonomy and authority model
  (source §§1-3), Decision Record promotion (source §8), the Change
  Contract concept (source §§5-6), and the conflict-handling taxonomy
  (source §12) are extracted below. The source's universal change-model
  diagram (§4), per-task-type context lists (§11), and project-level
  current-state entry point (§16) are intentionally **not** ingested —
  they restate the pipeline already defined in `docs/sdlc-workflow.md`
  and the doc set `core/sdlc/project-discovery.md` already produces; see
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
| What a feature must do | `features/FXXX-.../feature.md` + `requirements.md` + `acceptance-criteria.md` |
| Why a technical/architectural approach was chosen | Decision Record (see below) |
| How components/boundaries are structured, right now | `docs/architecture.md` (built by `project-discovery.md`, kept current by `architecture-review.md` + `docs-sync.md`) |
| How an accepted change will be implemented | `features/FXXX-.../implementation-plan.md` |
| How something is deployed or operated | `docs/operations.md`, plus `core/sdlc/rollback-plan.md` output for risky changes |
| What proves a change is complete | `acceptance-criteria.md` + `core/sdlc/test-strategy.md` output |
| What exists right now | Code, configuration, and deployed state. This never silently redefines what *should* exist — a gap against any row above is drift or a defect, not an automatic requirement change (see Conflict Handling). |

### Decision Records

`core/standards/ci-cd.md`, `core/standards/jenkins.md`, and
`core/sdlc/release-readiness.md`/`project-discovery.md` already accept
"an ADR" as a valid documented exception, but this repo never defined
what that is. This closes that gap:

- A Decision Record lives at `docs/decisions/ADR-<seq>-<short-slug>.md`,
  sequential per project.
- Required content: Context, Alternatives considered, Selected approach,
  Rationale, Consequences, Status (`Proposed` / `Accepted` /
  `Superseded`).
- Once a decision reaches `Accepted`, its resulting current state MUST be
  reflected in the owning authoritative artifact from the table above
  (e.g. `docs/architecture.md`) in the same change. The Decision Record
  itself then answers "why was this decided", never "what currently
  exists" — do not point a reader at an ADR to learn current behavior.
- Any place in this repo's standards that accepts "a documented ADR" as
  an exception means a Decision Record in this exact shape and location.

### Change Contract

For a change small enough that `architecture-review.md`'s "not needed for
small, contained, single-module changes" applies, and whose acceptance
criteria fit in a handful of bullets, a delta-shaped Change Contract MAY
stand in for `feature.md` + `requirements.md` + `acceptance-criteria.md` +
`risks.md` combined. `implementation-plan.md` and `docs-impact.md` are
still produced separately, since `implementation-pass.md` and
`docs-sync.md` consume them directly — see Open Questions for whether
`feature-planning.md` should adopt this explicitly.

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
  owned knowledge type (e.g. an `implementation-plan.md` defining a new
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
- An Implementation Plan, Runbook, or Decision Record introducing a new
  product or architecture requirement inline instead of routing it
  through the artifact that owns that knowledge type.
- Silently resolving a true authority conflict by picking one of the two
  disagreeing documents instead of surfacing it and pausing affected
  work.
- A Decision Record reaching `Accepted` whose conclusion was never
  promoted into its owning current-state artifact — leaving the ADR as
  the only place the decision is reflected.
- Citing "an ADR" as a documented exception (per `ci-cd.md`,
  `jenkins.md`, `release-readiness.md`, `project-discovery.md`) without a
  real `docs/decisions/ADR-*.md` file in the required shape existing.

## Agent Must Check

- Before writing new project knowledge: does an authoritative artifact
  for this knowledge type already exist per the table above?
- Is this fact being duplicated into a new document instead of
  cross-referenced from the one that owns it?
- Is agent memory, a prior conversation summary, or "most recent/most
  similar" search ranking being treated as the source of truth for
  something a repository document should own?
- When a standard's exception clause cites "an ADR", does
  `docs/decisions/ADR-<seq>-<slug>.md` actually exist with the required
  content?
- After a Decision Record reaches `Accepted`, was its conclusion promoted
  into the owning current-state artifact in the same change?
- When two documents disagree, has the disagreement been classified
  (stale duplication / authority violation / implementation drift / true
  authority conflict) before choosing an action?

## Agent Must Not Do

- Must not treat agent memory, cached context, or search-result
  freshness/similarity as authoritative over the document that owns a
  knowledge type per the table above.
- Must not let an Implementation Plan, Runbook, or Decision Record
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
- `docs-sync` — the mechanism that promotes an `Accepted` Decision
  Record's conclusion into its owning current-state doc.
- `standards-gap-audit` — use when a gap in this ownership model itself
  (an unowned knowledge type, an artifact with no clear owner) is found.

## Related Archetypes

N/A — ownership applies uniformly regardless of project stack.

## Related Repositories

N/A — this is a documentation/process standard; it does not delegate
ownership to another repository.

## Open Questions

- Whether `docs/decisions/` is the right single location for Decision
  Records project-wide, versus a per-feature `features/FXXX/decisions/`
  — left open pending a real example with more than a couple of ADRs.
- Whether `core/sdlc/feature-planning.md` should be amended to formally
  offer the Change Contract format as a documented alternative output for
  small changes, or whether it stays an informal option layered on top
  until adopted deliberately — needs a decision before treating Change
  Contract as binding on `feature-plan`.
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
