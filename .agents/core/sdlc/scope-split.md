# Scope Split

Canonical procedure behind the `scope-split` skill.

## Purpose

Catch out-of-scope work surfaced while analyzing a task — bugs,
refactors, doc/test gaps, infrastructure debt, anything not needed to
meet the current task's acceptance criteria — before it either bleeds
into the current diff or gets silently dropped. Each confirmed item
becomes its own `features/FXXX-short-name/` folder instead of expanding
the scope of the feature being planned.

This is not a standalone pipeline stage. It runs embedded inside
`feature-planning.md` (see that file's Process, and
`skills/feature-plan/SKILL.md`), after the current feature's scope has
been drafted and before its documents are finalized. It has no
independent entry point in `core/sdlc/README.md`'s pipeline diagram.

## Inputs

- The in-progress `feature.md` / `implementation-plan.md` draft (or
  equivalent analysis context) for the task currently being planned.
- Anything else noticed while reading code/docs during that analysis:
  existing feature folders (to check an item isn't already tracked),
  `core/standards/*` (to judge whether a finding is a real deviation or
  expected behavior).

## Process

1. While drafting the current feature's documents, list anything
   observed that is not required to satisfy this feature's acceptance
   criteria.
2. For each item, write one line: what it is, why it's out of scope for
   the current feature, and which repository/area it likely belongs to.
3. Drop anything already tracked in an existing `features/` folder or
   already filed elsewhere — do not duplicate.
4. Present the remaining candidates to the user and ask which ones to
   spin off. Do not create anything before the user responds.
5. For each confirmed item, create `features/FXXX-short-name/` using the
   same six-document structure and templates as `feature-planning.md`
   (`feature.md`, `requirements.md`, `acceptance-criteria.md`,
   `implementation-plan.md`, `risks.md`, `docs-impact.md`).
6. Leave declined items out of any feature folder; note them in the
   current feature's Agent Run Report instead so they aren't silently
   lost.
7. Do not let a spun-off item's presence change the scope, requirements,
   or acceptance criteria of the feature currently being planned.

## Required output structure

Same as `feature-planning.md`, once per confirmed item:

```text
features/FXXX-short-name/
  feature.md
  requirements.md
  acceptance-criteria.md
  implementation-plan.md
  risks.md
  docs-impact.md
```

## Rules

- No code changes.
- No deployment actions.
- No secrets.
- Never create a feature folder for an item the user hasn't confirmed.
- Never let this check block or delay finishing the current feature's
  own documents — it runs alongside that work, not instead of it.
- If nothing out-of-scope turns up, say so explicitly; an empty result
  is a valid outcome, not a sign the check was skipped.
