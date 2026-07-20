# AI-Assisted SDLC Workflow

The full lifecycle both the Claude and Codex adapters are built around, from
idea to lessons learned. Every stage below is agent-neutral process — each
adapter exposes it as a skill that a human invokes explicitly or
that the agent recognizes implicitly from the task description. Every stage
is assisted by an AI agent except the two that are always human/tooling
(CI/CD gates, deployment) — see `core/standards/tooling-vs-ai-responsibility.md`
for that split in detail.

```text
idea
 → project discovery        core/sdlc/project-discovery.md
 → architecture review      core/sdlc/architecture-review.md
 → feature planning         core/sdlc/feature-planning.md
 → implementation           core/sdlc/implementation-pass.md
 → change audit             core/sdlc/change-audit.md
 → test strategy            core/sdlc/test-strategy.md
 → docs sync                core/sdlc/docs-sync.md
 → release readiness        core/sdlc/release-readiness.md
 → PR summary                (pr-summary skill; see core/standards/git/pull-requests.md)
 → CI/CD gates               (tooling — lint/test/build/scan, not the agent)
 → deployment                (human-triggered, tooling-executed)
 → post-release review      core/sdlc/post-release-review.md
 → (follow-ups feed back into the next feature-planning pass)
```

Ad hoc stages — not fixed pipeline steps, invoke whenever relevant:

- `core/sdlc/production-readiness.md` (`production-readiness` skill) —
  periodic or pre-go-live operational check on a service, independent of any
  single change.
- `core/sdlc/rollback-plan.md` (`rollback-plan` skill) — before any
  risky/production-impacting change.
- `devops-review` skill — infrastructure, CI/CD, deployment changes (see
  `core/archetypes/devops-infra/`).
- `core/sdlc/standards-gap-audit.md` (`standards-gap-audit` skill) — when a
  skill's Agent Run Report shows non-trivial gaps/assumptions, or a run's
  output is unclear; classifies whether the gap is in the project, a skill,
  a standard, an archetype, or belongs to a different repo — see
  `docs/evaluation-loop.md`.

## Stage details

| Stage | Canonical doc | Input | Output |
| --- | --- | --- | --- |
| Discovery | `project-discovery.md` | Repo as-is | Baseline `docs/*.md` |
| Architecture review | `architecture-review.md` | Proposed change, current architecture | Architecture-impact assessment, open questions |
| Feature planning | `feature-planning.md` | Idea/task/issue | `features/<name>/` (feature, requirements, acceptance criteria, implementation plan, risks, docs impact) |
| Implementation | `implementation-pass.md` | Reviewed feature folder | Code changes, updated checklist |
| Change audit | `change-audit.md` | Diff + feature folder | Verdict: pass / pass with notes / needs fixes / blocked |
| Test strategy | `test-strategy.md` | Feature, release, or refactor | Unit/integration/e2e/manual/regression plan, risk priority |
| Docs sync | `docs-sync.md` | Diff | Updated docs, or explicit "no docs affected" |
| Release readiness | `release-readiness.md` | Feature/PR/project | Go / no-go verdict with blocking items |
| PR summary | (see `core/standards/git/pull-requests.md`) | Diff + feature docs | PR description |
| CI/CD gates | tooling | Push/PR | Pass/fail (lint, typecheck, test, build, scan) |
| Deployment | tooling + human approval | Green CI/CD | Deployed change |
| Post-release review | `post-release-review.md` | What shipped | Release summary, follow-up tasks, standards updates |

## Notes

- Not every change needs every stage. A one-line docs fix doesn't need
  architecture review or test strategy — use judgment, scaled to risk and
  size, per `core/standards/workflow.md`.
- Project discovery is the one stage that isn't per-change — run it once when
  an adapter is first installed into a project (or whenever docs have gone
  stale), not for every feature.
- Archetypes (`core/archetypes/<type>/`) narrow which stages matter most and
  add stack-specific detail for a given project type — they overlay this
  workflow, they don't replace it.
- This is the canonical source. `adapters/claude/.claude/skills/<name>/SKILL.md`
  and `adapters/codex/skills/<name>/SKILL.md` are thin, agent-specific wrappers
  around the files in this directory — see `docs/repository-layout.md`.
