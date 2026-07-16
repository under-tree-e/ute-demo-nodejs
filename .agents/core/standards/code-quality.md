# Code Quality Standard

## Purpose

Define what "quality" means when judging a change, as distinct from the
review *process* (`core/standards/git/code-review.md`) and from checks CI
already owns (`core/standards/tooling-vs-ai-responsibility.md`). Quality
here means: it builds, it fails loudly instead of silently, and a reviewer
can understand it without asking the author to explain it out loud.

## Applies To

Any code change in any UTE repo, evaluated by a human reviewer or by an
agent doing review/audit work (`change-audit`, `code-review` skill).

## Does Not Cover

- Review workflow, comment tags, approval rules, split-PR criteria — see
  `core/standards/git/code-review.md`.
- What CI must enforce vs. what an agent/human should reason about — see
  `core/standards/tooling-vs-ai-responsibility.md`.
- Test type selection, coverage philosophy, minimum test sets — see
  `core/standards/testing.md`.
- Pipeline ownership/implementation — see `core/standards/ci-cd.md`.

## Source Documents

- Code Review Memo
- Testing Standard (Draft, 2026-05-21)

## Required Rules

- Build MUST pass before merge. This is non-negotiable and is a CI
  gate, not something a reviewer/agent re-runs manually to confirm.
- Merge MUST be blocked on: failing unit tests, failing build, failing
  type check, failing critical integration tests, an unexplained
  intermittent (flaky) test failure, or a CI pipeline that did not
  complete.
- Errors MUST NOT be silently swallowed — no empty catch blocks, no
  caught exception that is discarded without logging/surfacing/handling,
  no missing error handling for a critical scenario (auth failure,
  payment failure, data-loss-risk operation).
- Formatting, linting, static analysis, dependency scanning, and basic
  build/unit-test execution are CI's responsibility, not a human
  reviewer's or an agent's. Reviewer/agent judgment is spent on logic,
  risk, and clarity — not re-verifying what CI already checked (see
  `core/standards/tooling-vs-ai-responsibility.md`).
- A change MUST NOT be sent for review if a reviewer cannot understand it
  from the diff and PR description alone, without a verbal walkthrough.
- Reviewer/agent MUST flag unclear naming, duplicated logic, and
  misplaced responsibility (business logic in a controller/route,
  data access outside the repository/service layer) as it directly
  affects whether the change is safe and clear to integrate — not as a
  personal style preference.
- Reviewer/agent MUST NOT manually re-run or re-perform checks CI already
  owns (formatting, basic build, standard unit test execution, type
  check, static analysis, dependency scan) in place of trusting/fixing
  CI.
- Reviewer/agent MUST NOT approve/accept a change with an unexplained CI
  failure, or with no test coverage explanation when tests are absent.

## Recommended Rules

- Prefer flagging a large duplication/readability problem as a follow-up
  task over blocking an otherwise safe, well-described change on it.
- Prefer pointing to an existing standard or a short example snippet over
  demanding an exact rewrite.
- Prefer naming that makes intent obvious without a comment; treat a
  needed comment explaining *what* code does (not *why*) as a naming
  smell worth flagging as non-blocking.
- Prefer test names in the form `should <expected behavior> when
  <condition>` — self-explanatory over needing the test body to
  understand intent.

## Forbidden Patterns

- Merging with a failing build, failing unit tests, or an unexplained CI
  failure.
- Empty catch blocks or exceptions caught and discarded without any
  logging, surfacing, or handling.
- Business logic embedded in a route/controller instead of the
  service/application layer.
- Data access performed outside the repository/data-access layer.
- Secrets logged, printed, or embedded in code, config, or test fixtures.
- A reviewer or agent manually re-performing a check (lint, format,
  build, standard unit test run) that CI already owns, as a substitute
  for fixing/trusting CI.
- Blocking a change on personal style preference rather than a concrete
  correctness/clarity/risk problem.

## Agent Must Check

- Build and test status is green in CI, or the failure is explained in
  the PR/change description — before treating a change as review-ready.
- No empty/discarding catch blocks or missing error handling around
  critical scenarios (auth, payments, data-loss-risk operations).
- Layer boundaries are respected (controller thin, service holds
  business logic, repository owns data access) where the project has
  such layers.
- Naming and duplication are flagged when they materially hurt
  readability or risk future defects, not on every minor stylistic
  nit.
- DTOs/mappers do not leak extra/unintended fields.

## Agent Must Not Do

- Must not manually re-run or re-derive formatting/lint/static-analysis
  results — defer to CI; if CI hasn't run, say so rather than
  substituting a manual check.
- Must not wave through a change with an unexplained CI failure.
- Must not treat a personal style preference as a blocking quality
  issue.
- Must not demand a large unrelated refactor as a condition for
  accepting an otherwise safe, clear change.

## Related Skills

- `code-review`
- `change-audit`
- `simplify`
- `release-readiness`

## Related Archetypes

N/A — quality expectations here are stack-agnostic; stack-specific
layering conventions live in `core/archetypes/<type>/`.

## Related UTE Repositories

- `ute-ci-templates` — owns the CI checks (build, lint, static analysis)
  this standard defers to; see `core/standards/ci-cd.md`.
- `ute-jenkins-library` / `ute-jenkins` — same, for the Jenkins path.

## Open Questions

- Source memo is written for human PR reviewers; degree to which an
  agent should apply the same bar autonomously (vs. only when asked to
  review) is not fully specified upstream.
- No default static-analysis/lint tool or threshold is named in source
  material — left to each project's own CI config.
