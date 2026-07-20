# Standards Gap Audit

Canonical procedure for auditing an agent *run* against `core/`, `skills/`,
and `core/archetypes/` themselves — not against a feature spec
(`change-audit.md`) and not against a release (`post-release-review.md`).
Exists so a human doesn't have to re-read every response from a test run to
find out why the agent guessed, skipped something, or produced a thin
result — the Agent Run Report each key skill now ends with (see
`docs/evaluation-loop.md`) surfaces the raw material; this stage turns it
into a classified, actionable list.

## When to run

- A skill's Agent Run Report lists non-trivial "Missing inputs",
  "Assumptions made", "Project documentation gaps", or "standards gaps".
- A skill's output was unclear, thin, or inconsistent and it isn't obvious
  why.
- During a pilot/evaluation pass after installing agent standards into a
  project — see `docs/evaluation-loop.md`.
- Periodically, to turn gaps that keep recurring across projects into a
  standards update instead of re-explaining the same thing to the agent
  every time.

## Inputs

- The Agent Run Report(s) from the skill run(s) being audited.
- The skill outputs themselves (docs produced, findings, plans, diffs).
- The project's own documentation (`docs/*.md`) — needed to tell a project
  documentation gap apart from a standards gap.
- The relevant `core/standards/`, `core/sdlc/`, `core/archetypes/`, and
  `skills/` files the run should have been able to rely on.

## Process

1. Collect every "Missing input", "Assumption made", "Project documentation
   gap", and "standards gap" line from the Agent Run Report(s) under
   audit. If no Agent Run Report exists (older run, or an ad hoc question),
   reconstruct the same list from the raw output: where did the agent guess,
   hedge, or say "not documented"?
2. For each item, classify it using the gap types below. Read the file the
   gap type points at before writing the finding — do not guess whether a
   rule already exists there.
3. For each finding, record: the area affected, concrete evidence (quote or
   close paraphrase — not a vague restatement), the gap type, the specific
   file that should change (fix target), and a priority (high/medium/low)
   based on how often this is likely to recur across projects.
4. Separate findings that are not a standards gap at all: things that belong
   to the project itself (its own missing docs, its own code issues), or to
   a different repository entirely (CI/CD template repos, deployment/
   infrastructure repos — see `core/standards/ci-cd.md` for the ownership
   boundary).
5. Do not edit `skills/`, `core/`, or `core/archetypes/` as part of this
   audit unless the user explicitly asks for the fix to be applied — the
   output is a report and a recommendation list, not a patch.

## Gap types

| Type | Meaning | Typical fix target |
| --- | --- | --- |
| `project-doc-gap` | The project's own documentation doesn't cover something the agent needed; this repo's standards/skills gave enough guidance to know what to ask for. | The project's `docs/*.md` (not this repo) |
| `agent-skill-gap` | A skill's goal/inputs/process/required-outputs section is ambiguous, incomplete, or missing a step, so the agent had to guess how to proceed. | `skills/<name>/SKILL.md` |
| `core-standard-gap` | A policy or rule question `core/standards/` should answer either doesn't exist there or is ambiguous. | `core/standards/<name>.md` |
| `archetype-gap` | No `core/archetypes/<type>/` matches the project's stack, or an existing archetype is missing or wrong about a stack-specific convention. | `core/archetypes/<type>/` |
| `ci-cd-boundary-gap` | Confusion about pipeline ownership — application repo vs. `ute-ci-templates`/`ute-jenkins-library`/`ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`. | `core/standards/ci-cd.md` |
| `vendor-skill-gap` | A third-party skill/pattern would close the gap and is worth reviewing for import. | `docs/vendor-skill-mapping.md`, `vendor-skills/` (see `docs/vendor-skills-policy.md`) |
| `not-agent-standards` | The gap belongs to the project itself, or to a different repository's domain entirely — nothing in this repo should change. | N/A — note only |

## Required output

```md
## Standards Gap Audit

| Area | Problem | Evidence | Gap type | Fix target | Priority |
|---|---|---|---|---|---|

## Recommended Updates

1. Update `core/archetypes/...`
2. Update `skills/.../SKILL.md`
3. Update `core/standards/...`

## Not a Standards Gap

- Items that belong to the project itself.
- Items that belong to CI/CD repos.
- Items that belong to deployment/infrastructure repos.
```

Every row in the table must have a gap type from the list above. Every item
in "Recommended Updates" must trace back to at least one table row. Findings
classified `not-agent-standards` go under "Not a Standards Gap", never in
the table.

## Safety constraints

Read-only analysis by default — do not modify `skills/`, `core/`, or
`core/archetypes/` unless the user explicitly asks for the recommended fix
to be applied as a follow-up step. Do not label a finding
`ci-cd-boundary-gap` or `not-agent-standards` without checking
`core/standards/ci-cd.md` first — that boundary is easy to get backwards.
Never invent a gap to pad the report; if evidence is thin, say so and lower
the priority instead of dropping or inflating the finding.

## References

- `docs/evaluation-loop.md` — where this stage fits in a pilot/evaluation
  pass
- `core/standards/ci-cd.md` — CI/CD ownership boundary this audit checks
  `ci-cd-boundary-gap` findings against
- `docs/vendor-skills-policy.md` — process for `vendor-skill-gap` findings
- `core/sdlc/post-release-review.md` — audits a release; this stage audits
  an agent run against the standards themselves, a different scope
