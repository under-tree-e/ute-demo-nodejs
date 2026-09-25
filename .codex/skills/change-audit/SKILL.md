---
name: change-audit
description: Independently audit implemented changes against a feature folder/spec. Use after implementation or when the user asks to review/check/audit another agent's changes.
---
# Change Audit

> Canonical portable skill (agent-neutral). Adapter copies: `adapters/claude/.claude/skills/change-audit/SKILL.md`, `adapters/codex/skills/change-audit/SKILL.md` — keep in sync with this file. See `docs/portable-skills.md`.

## Goal

Independently audit a diff against `spec.md`. Do not fix code unless
explicitly requested. Run in a context separate from the implementer: on
Claude Code, the `auditor` subagent; on other agents, a fresh session.

## Process

1. Read `spec.md`, `plan.md`, the PR description's implementation report,
   and the diff (`git diff <base>...HEAD`).
2. Run every `Verify:` line in `spec.md` and every command in
   `docs/ci-cd.md` "Local gates"; record each command's actual result. A
   criterion is met only by recorded output, not by reading code. Then
   judge intent: does the result serve the `spec.md` Goal's user, beyond
   the letter of the criteria?
3. Check each behavior change has a test that fails without it.
4. Check every ticked `plan.md` item against the diff; a ticked item with
   no matching change is critical.
5. Compare the diff with the implementation report: declared deviations
   are judged on merit; an undeclared deviation is critical. Building a
   "Deferred" item is a finding.
6. For changes that write data or expose an endpoint, probe the error
   branches, permission checks, and concurrency (repeat a mutating
   request, race two concurrent claims).
7. If the diff adds or changes a user interface, verify it in a real
   browser against the running application: changed screens render,
   changed flows work, no new console errors. Missing browser
   verification blocks a pass verdict.
8. Check the diff against the Forbidden Patterns and Agent Must Not Do
   sections of each applicable `.agents/core/standards/*` file and
   `.agents/core/standards/git/code-review.md`.
9. Check added and changed comments and names against
   `.agents/core/standards/code-quality.md` Comment content: no feature
   identifiers, phases, dates, decisions, or change history.
10. Minimality: name anything in the diff that could be removed or
    replaced by an existing capability without losing a requirement; also
    name missing rigor where correctness, security, data integrity, or
    concurrency need it.
11. New tasks the user attaches to the audit request, and every blocking
    finding, go into `plan.md` as unchecked items with exact file paths and
    concrete instructions.
12. Open questions carry a `Recommendation:` and are asked as structured
    choices where the agent supports it.
13. Write `audit.md` from `skills/feature-plan/templates/audit.md`. On a
    re-audit, replace it: resolved findings are removed, not kept as
    history. At most one re-audit per change; if blocking findings remain
    after it, report them to the user instead of starting another round
    (`.agents/core/standards/token-efficiency.md`).
14. Set `spec.md` `Status`: `needs-fixes` for needs fixes or blocked,
    `done` for pass or pass with notes.

## Verdicts

- pass — every criterion met, no findings.
- pass with notes — criteria met, only non-blocking findings.
- needs fixes — a criterion unmet or a blocking finding.
- blocked — a true authority conflict or missing access prevents a
  verdict (`.agents/core/standards/knowledge-governance.md`).

## Safety constraints

No code changes unless explicitly requested. Never read, print, or commit
secrets found in the diff.
