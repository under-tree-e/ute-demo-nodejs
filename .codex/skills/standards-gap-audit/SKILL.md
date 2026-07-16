---
name: standards-gap-audit
description: Analyze the result of an agent run (typically another skill's Agent Run Report) to classify why it was incomplete, guessed, or unclear — project doc gap, weak skill, missing standard, missing archetype, CI/CD boundary confusion, or not a standards gap at all. Use when a skill's output is unclear or its Agent Run Report lists non-trivial gaps/assumptions, not as a routine pipeline step.
---
# UTE Standards Gap Audit

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/standards-gap-audit/SKILL.md`, `adapters/codex/skills/standards-gap-audit/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

Canonical procedure: `.agents/core/sdlc/standards-gap-audit.md`. Read it before
running this skill — this file only adds the Claude-specific wrapper.

## Goal

Turn a confusing, thin, or gap-riddled agent run into a short, classified
list of what's actually wrong: the live project, its missing documentation,
a weak skill, a missing standard, a missing archetype, a CI/CD boundary
mistake, or nothing this repo owns at all. Exists so gaps get fixed at the
right layer instead of being silently re-guessed on every run — see
`docs/evaluation-loop.md`.

## Inputs

The Agent Run Report(s) from the run(s) being audited (or the raw output if
no report exists), the skill outputs themselves, the project's own
`docs/*.md`, and the relevant `.agents/core/standards/`, `.agents/core/sdlc/`,
`.agents/core/archetypes/`, and `skills/` files. Full list:
`.agents/core/sdlc/standards-gap-audit.md`.

## Process

1. Read `.agents/core/sdlc/standards-gap-audit.md` in full.
2. Pull every "Missing input", "Assumption made", "Project documentation
   gap", and "UTE standards gap" line out of the Agent Run Report(s) under
   audit.
3. Classify each item against the gap types below — check the file a gap
   type points at before writing the finding; don't guess whether it
   already covers the case.
4. Separate anything that isn't a standards gap: it belongs to the project
   itself, or to a different UTE repository (CI/CD template repo,
   deployment/infra repo — see `.agents/core/standards/ci-cd.md`).
5. Do not edit `skills/`, `.agents/core/`, or `.agents/core/archetypes/` as part of this
   audit unless explicitly asked to apply a fix afterward.

## Gap types

- `project-doc-gap` — the project's own docs don't cover it; standards gave
  enough guidance to know what was missing. Fix: the project's `docs/`.
- `agent-skill-gap` — a skill's process/outputs are ambiguous or
  incomplete. Fix: `skills/<name>/SKILL.md`.
- `core-standard-gap` — a policy question `.agents/core/standards/` should answer
  doesn't, or is ambiguous. Fix: `.agents/core/standards/<name>.md`.
- `archetype-gap` — no archetype matches the stack, or an existing one is
  wrong/incomplete. Fix: `.agents/core/archetypes/<type>/`.
- `ci-cd-boundary-gap` — confusion about pipeline ownership vs.
  `ute-ci-templates`/`ute-jenkins-library`/`ute-ansible`/`ute-automation`/
  `ute-infra`/`ute-gitops`. Fix: `.agents/core/standards/ci-cd.md`.
- `vendor-skill-gap` — a third-party skill/pattern would close it and is
  worth reviewing for import. Fix: `docs/vendor-skill-mapping.md`,
  `vendor-skills/`.
- `not-agent-standards` — belongs to the project or a different UTE
  repository entirely. No fix here — note only.

## Required outputs

```md
## Standards Gap Audit

| Area | Problem | Evidence | Gap type | Fix target | Priority |
|---|---|---|---|---|---|

## Recommended Updates

1. Update `.agents/core/archetypes/...`
2. Update `skills/.../SKILL.md`
3. Update `.agents/core/standards/...`

## Not a Standards Gap

- Items that belong to the project itself.
- Items that belong to CI/CD repos.
- Items that belong to deployment/infrastructure repos.
```

Every table row needs a gap type from the list above and real evidence
(quote or close paraphrase), not a vague restatement. Every item under
"Recommended Updates" must trace back to at least one table row.
`not-agent-standards` findings go under "Not a Standards Gap", never in the
table.

## Required Final Output: Agent Run Report

Every run of this skill must end with the Standards Gap Audit output above,
followed by:

### Agent Run Report

- Skill:
- Project type/archetype:
- Confidence: high / medium / low
- Inputs used:
- Applicable standards used: standards consulted to classify gaps (e.g.
  `.agents/core/standards/ci-cd.md` for boundary calls)
- Missing inputs:
- Assumptions made:
- Project documentation gaps:
- UTE standards gaps: only true `core-standard-gap`/`archetype-gap` findings,
  not project or CI/CD items
- Recommended updates to `ute-agent-standards`:
- Items that belong to other UTE repositories: project/CI/CD/infra ownership,
  kept separate from agent-standard ownership
- Follow-up questions, if any:

## Safety constraints

Read-only analysis. Do not modify `skills/`, `.agents/core/`, or
`.agents/core/archetypes/` unless explicitly asked to apply the fix as a follow-up.
Check `.agents/core/standards/ci-cd.md` before labeling anything
`ci-cd-boundary-gap` or `not-agent-standards`. Never invent a gap to pad the
report — if evidence is thin, say so and lower the priority instead.

## References

- `.agents/core/sdlc/standards-gap-audit.md` — full process and gap-type table
- `docs/evaluation-loop.md` — where this fits in a pilot/evaluation pass
- `.agents/core/standards/ci-cd.md` — CI/CD ownership boundary
- `docs/vendor-skills-policy.md` — process for `vendor-skill-gap` findings
- `docs/standards-to-agent-guidance.md` — the "reference, don't duplicate"
  rule this audit's fix targets (`.agents/core/standards/`, `.agents/core/archetypes/`,
  `skills/`) must keep following
