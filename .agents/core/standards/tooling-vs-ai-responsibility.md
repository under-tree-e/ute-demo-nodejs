# Tooling vs. AI Agent Responsibility

An AI coding agent (Claude, Codex, or any other assistant following these
standards) is a reasoning and drafting layer, not an enforcement layer. The
`core/sdlc/` procedures produce analysis, plans, and drafts a human reviews —
they are not a substitute for deterministic checks that must be true every
time, without depending on an LLM's judgment on a given run.

## An AI agent is good for

- Analysis — reading a codebase and explaining what it does and why.
- Planning — turning an idea into requirements, acceptance criteria, and an
  implementation plan (`core/sdlc/feature-planning.md`).
- Documentation — drafting and syncing docs from real findings
  (`core/sdlc/project-discovery.md`, `core/sdlc/docs-sync.md`).
- Review — auditing a diff against intent, checking for gaps a human might
  skim past (`core/sdlc/change-audit.md`, `core/standards/git/code-review.md`).
- Risk identification — architecture, deployment, rollback, and security risk
  reasoning (`core/sdlc/architecture-review.md`, `core/sdlc/rollback-plan.md`,
  the `devops-review` skill).
- Checklist generation — test strategy, release readiness, production
  readiness (`core/sdlc/test-strategy.md`, `core/sdlc/release-readiness.md`,
  `core/sdlc/production-readiness.md`).
- PR summary — turning a diff and feature docs into a reviewable description
  (the `pr-summary` skill).
- Release-readiness reasoning — synthesizing scattered signals (tests, docs,
  migrations, rollback plan) into a go/no-go call for a human to ratify.

The agent's output in all of the above is a draft or a recommendation. A
human approves the plan, merges the PR, and triggers the deploy.

## Tools/CI should enforce, not the agent

These must hold every time, independent of whether an agent session
correctly remembered to check — put them in CI, hooks, or platform config,
not in a skill's checklist as the only line of defense:

- Branch naming — `scripts/validate-branch-name.sh` in CI/a hook, not a
  reminder in a skill.
- Commit format — `scripts/validate-commit-message.sh` as a `commit-msg`
  hook or CI step; a `commitlint` config later if the team adopts one.
- Lint / typecheck — the project's own linter/compiler, run in CI.
- Tests — the project's own test runner, run in CI, required to pass.
- Build — the project's own build must succeed before merge/deploy.
- Coverage — a coverage gate in CI, if the team uses one.
- Secret scanning — a dedicated scanner (gitleaks, trufflehog, GitHub's
  native scanning, etc.) — `core/standards/security.md` and each adapter's
  own deny/permission mechanism are a second layer, not a replacement.
- Dependency audit — `npm audit`/`pip-audit`/Dependabot/Renovate or
  equivalent, run on a schedule and in CI.
- Sonar / code-quality gates — whatever static-analysis gate the team
  already runs.
- Deployment gates — the CD platform's own approval/gate mechanism.
- Protected branches — the git host's branch protection rules (required
  reviews, required status checks, no force-push to main).

## Why the split matters

An agent session can be interrupted, given incomplete context, or simply
reason incorrectly on a given run — that's true of any LLM-based tool
(Claude, Codex, or otherwise), not something specific to one vendor. A CI
gate either ran and passed, or it didn't; there's no "the agent forgot to run
it" failure mode. Put the non-negotiable checks where they can't be skipped,
and reserve the agent for the judgment-heavy work that a fixed rule can't
express well (is this test strategy actually risk-appropriate? does this PR
summary accurately describe the change?).
