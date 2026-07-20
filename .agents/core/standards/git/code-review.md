# Code Review Checklist

## Purpose

Defines the human (and agent-assisted) code-review process for PRs:
what a reviewer checks, how review comments are tagged and formatted, and
where reviewer responsibility ends and CI/CD responsibility begins.

## Applies To

- Every PR into a protected/main branch in a repo.
- Human reviewers, and any agent (`change-audit`, `/review`, `/code-review`)
  assisting with or auditing a review.
- Any PR size/risk level — depth of review scales with risk zone, not with
  whether a checklist item is skipped.

## Does Not Cover

- Automated/technical checks owned by CI/CD — build, unit tests, type
  check, static analysis, dependency scan, formatting. See
  `core/standards/ci-cd.md`. Reviewers must not manually re-perform these.
- The PR description template fields and PR-title format themselves (only
  referenced here as pre-review requirements) — owning document TBD, see
  Open Questions.
- CODEOWNERS file format/setup — this repo must not install one (see
  `core/standards/ci-cd.md`); real ownership data lives in the consuming
  project/workspace.
- Pipeline implementation (GitHub Actions YAML, Jenkinsfile/Groovy,
  Terraform/Ansible) — this document only tells a reviewer *what to check
  for* in such files, never how to author them. See `core/standards/ci-cd.md`
  for ownership.

## Source Documents

- Code Review Memo (Memo) — human code-review process and reviewer role at
  Scope: reviewer responsibility vs CI/CD responsibility, pre-review
  readiness, general checklist, blocking/non-blocking taxonomy, risk-zone
  table, domain checklists, split-PR and approval rules, forbidden
  practices.

## Required Rules

### Reviewer focus areas

- **Correctness** — does the change do what it claims; edge cases handled.
- **Security** — input validation, auth/authz, secrets handling, injection
  risks.
- **Error handling** — failures are caught, logged, and surfaced sensibly;
  no silent failure.
- **Tests** — new/changed behavior is covered; existing tests still make
  sense.
- **Observability** — logs/metrics/traces exist for anything worth
  debugging in production.
- **Documentation** — docs updated if behavior, API, config, or ops
  procedure changed.
- **Backwards compatibility** — API/schema/config changes don't silently
  break existing consumers.
- **Deployment risk** — migrations, feature flags, rollout order, and
  rollback path are considered.

### Explicit impact checks (every PR, not just risky ones)

- **Security** — does the diff touch auth, authz, input validation, or
  injection surface?
- **Permissions** — does it add, remove, or change a permission/role/
  ownership check?
- **Data** — can it cause data loss, a risky/incomplete migration, or a
  missing rollback for a DB change?
- **API** — does it break a public/consumer-facing contract (request/
  response shape, error format) without documenting the break?
- **Config** — does it change required env vars, defaults, or secrets
  handling?

Any "yes" here escalates the PR into the relevant risk zone below and
requires proportionally deeper review, not a rubber-stamp pass.

### Pre-review readiness (author, before requesting review)

- PR title matches the project's format and is suitable for a squash
  commit.
- Description filled: What was done / How to test / Current state / Risks
  & Notes (use "No known risks" explicitly if there are none — never leave
  blank).
- CI is green, or the failure is explained in the PR.
- No secrets, no stray/random files, no unrelated changes.
- Branch is up to date with main if the project requires it.
- Large/risky PRs call out "Focus review on: ..." for the reviewer.

### Reviewer checklist

- PR title is clear and squash-commit-friendly; description explains the
  change and matches the task.
- Diff has no unrelated changes (see Forbidden Patterns).
- Logic is correct; layer/architecture boundaries are respected.
- Error handling is sufficient for critical scenarios.
- Security/permissions impact checked (see Explicit impact checks above).
- DB/API/config changes are described and their impact understood.
- Tests are sufficient, or their absence is explicitly justified.
- CI is green, or the failure is explained/accepted.
- Risks are described; no unflagged production risk remains.

### Risk-zone depth table

| Risk zone | Review must cover |
| --- | --- |
| Auth/permissions | access, roles, ownership, bypass paths |
| Database | migration safety, data loss, rollback, indexes |
| API contract | backward compatibility, DTO shape, error format |
| Payments/billing | idempotency, audit trail, edge cases |
| CI/CD | secrets, deploy target, rollback |
| Config/env | secrets, defaults, required variables |
| Packages/libraries | public API surface, SemVer, dependencies |
| Frontend critical flow | routing, state, auth, error states |
| Backend services | business logic, transactions, validation |

### Domain checklists

- **Backend** — route/controller has no business logic; service layer
  holds application/business logic; repository owns data access;
  validation and permissions are applied; config is read via the config
  layer; secrets are not logged; no obvious query performance issue;
  transaction use is justified; DTO/mapper does not leak extra fields.
- **Frontend** — feature-specific logic stays under `features/`; `shared`
  holds no feature-specific business logic; `core` is not a dumping
  ground; page components carry no excess business logic; loading/error/
  empty states are handled; runtime config carries no secrets; the change
  does not break a critical flow.
- **Package/library** — public exports not accidentally broken; breaking
  changes documented; version bump matches SemVer; README usage updated;
  dependencies/peerDependencies and `publishConfig` correct; no secrets in
  the package; tests cover the public API; changelog/release notes updated
  if needed.
- **CI/CD & config** (security-sensitive, review even if "just config") —
  no secrets/real tokens in pipeline or config files; no unauthorized
  production-deploy trigger from a PR/feature branch; no disabled CI gate
  or removed required check without a documented exception; env/config
  examples carry no real values; rollback path documented for deployment
  changes.

### Comment taxonomy and format

- Every review comment carries exactly one tag: `blocking:`, `nit:`,
  `suggestion:`, `question:`, or `non-blocking:`.
- Every comment states, in this order: the problem, why it matters, and
  the desired action. Template:

  ```
  <tag>: <problem>
  Why it matters: <explanation>
  What to do: <concrete action>
  ```

- `blocking:` is reserved for: incorrect logic, a security issue, a
  missing/incorrect permission check, possible data loss, a broken API
  contract without documentation, a risky/incomplete DB migration, missing
  error handling for a critical scenario, missing tests for risky logic,
  an unexplained CI failure, secrets in the PR, unrelated changes in the
  PR, broken architecture/layer boundaries, or an unsafe production
  deploy.
- Everything else (naming preference, minor risk-free refactor,
  alternative style, future suggestion, non-critical optimization,
  non-critical clarifying question) is `nit:`, `suggestion:`, `question:`,
  or `non-blocking:` — never `blocking:`.

### Reviewer does not rewrite the author's code

- A reviewer may point to an existing standard, show a short illustrative
  snippet, or request a split/more tests — but must not rewrite the
  author's code or PR content in comments without the author's agreement.

### Unrelated changes are blocked

- A PR diff containing changes unrelated to its stated purpose (drive-by
  refactors, formatting-only churn bundled with logic, unrelated file
  edits) is a `blocking:` finding, not a style nit — request removal or a
  split (see Split-PR criteria below).

### Author response protocol

- A `blocking:` comment must not be marked resolved without a response:
  fix it, explain why it's not an issue, or agree and file a follow-up
  ticket.
- No force-push without necessity; no hiding or ignoring a failing CI.

### Split-PR criteria

- Request a split when: the PR bundles independent tasks; mixes feature +
  refactor + formatting; has an oversized diff without justification;
  bundles unrelated FE/BE/infra changes; or pairs a risky migration with
  unrelated UI changes.
- Do not request a split when: changes are logically connected; one
  feature genuinely needs FE+BE+contract together; splitting would
  increase risk; or the PR is large but well-structured and well-described.

### Approval rules

- May approve when: the change is understood; logic is correct; risks are
  acceptable; all blocking comments are resolved; CI is green or the
  exception is agreed; tests are sufficient or justified; the description
  matches the change; no secrets; no unflagged standard/policy violation.
- Must not approve when: the reviewer doesn't understand the change or
  hasn't reviewed the risky files; CI failed unexplained; unresolved
  blocking comments remain; the PR contains secrets; the PR carries
  unapproved production risk; or the description doesn't match the diff.

## Recommended Rules

- Point to an existing standard or a short example snippet rather than
  dictating an exact rewrite.
- Mark a comment resolved only after actually taking the corresponding
  action.
- Bring the branch up to date with main before review if the project
  requires it.
- For high-risk changes, consider requiring 2 reviewers, CODEOWNERS/tech
  lead approval, extra tests, staging verification, and a rollback plan —
  scale scrutiny to the risk zone, not a fixed rule for every PR.
- If a large refactor surfaces mid-review and the current PR's risk is
  acceptable without it, spin the refactor into a separate task/PR rather
  than blocking the current one.

## Forbidden Patterns

- Approving a PR without reviewing the diff.
- Approving a PR with failed CI and no explanation.
- Approving a PR that has no description.
- Merging with unresolved blocking comments.
- Blocking a PR based on personal style preference.
- Demanding a large unrelated refactor as a condition of approval.
- Unexplained shorthand comments ("bad", "wrong", "fix it") without
  justification.
- Manually re-performing checks CI/CD already owns (formatting, build,
  unit tests, type check, static analysis, dependency scan).
- Ignoring security/permissions/data/API/config impact during review.
- Resolving a blocking comment without a response.
- Reviewing strictly file-by-file without understanding the overall
  change flow.
- Letting review devolve into an unresolved architecture debate instead of
  filing a follow-up.
- Rewriting the author's code in review comments without their agreement.
- Approving a PR that carries unrelated changes instead of blocking them.

## Agent Must Check

- Whether the PR description is filled (What was done / How to test /
  Current state / Risks & Notes) and matches the actual diff.
- Whether CI is green, and if not, whether the failure is explained.
- Whether the diff contains secrets, stray files, or changes unrelated to
  the PR's stated purpose.
- Which risk zone(s) the diff touches (auth, database, API, payments,
  CI/CD, config, packages, frontend, backend) and whether review depth
  matches that zone.
- Whether every review comment it authors carries a tag (`blocking:`,
  `nit:`, `suggestion:`, `question:`, `non-blocking:`) and the
  problem/why-it-matters/what-to-do format.
- Whether all `blocking:` comments have a response before treating the PR
  as mergeable.
- Whether a PR should be flagged for split per the Split-PR criteria.
- For CI/CD or config diffs specifically: secrets/real tokens, unauthorized
  production-deploy triggers, disabled gates, or removed required checks —
  and flag to `core/standards/ci-cd.md` ownership boundaries, not fix
  inline.

Use this checklist alongside the feature folder's acceptance criteria when
running `change-audit`; not every item applies to every PR (e.g. a
docs-only change has no deployment risk) — record "n/a" rather than
skipping silently.

## Agent Must Not Do

- Must not approve a PR itself or represent an approval as final — human
  approval authority is not delegated to an agent by this document.
- Must not rewrite the author's code in a review comment without their
  agreement — same rule as a human reviewer.
- Must not tag a non-blocking preference (style, naming, non-critical
  optimization) as `blocking:`.
- Must not wave through unrelated changes, secrets, or an unexplained CI
  failure to speed up review.
- Must not manually re-run or restate checks owned by CI/CD as if they
  were the reviewer's own finding — reference CI's result instead.
- Must not author or suggest pipeline YAML/Groovy/Terraform/Ansible as the
  fix for a CI/CD or config finding — flag it and point to the owning repo
  (`core/standards/ci-cd.md`).

## Related Skills

- `.claude/skills/change-audit` — apply this checklist against a feature
  folder's acceptance criteria when auditing implemented changes.
- `.claude/skills/pr-summary` — PR description content this checklist
  expects to already be filled in before review.
- `.claude/skills/release-readiness` — blocks release on unresolved
  blocking comments / unclear pipeline ownership.
- `.claude/skills/devops-review` — deeper review pass for CI/CD,
  infrastructure, and deployment diffs flagged by the CI/CD & config
  domain checklist above.
- `.claude/skills/architecture-review` — for changes that surface a
  layer/architecture-boundary concern during review.

## Related Archetypes

- `core/archetypes/nodejs-api` — backend domain checklist (route/service/
  repository layering).
- `core/archetypes/angular-app` — frontend domain checklist
  (`features/`/`shared`/`core` boundaries).
- `core/archetypes/npm-package`, `core/archetypes/angular-library` —
  package/library domain checklist (SemVer, public API, changelog).
- `core/archetypes/devops-infra` — CI/CD & config domain checklist.

## Related Repositories

- `ute-ci-templates` — owns GitHub Actions pipeline implementation;
  CI/CD & config review checks for duplicated pipeline logic point here.
- `ute-jenkins-library` / `ute-jenkins` — owns Jenkins shared pipeline
  steps and controller/runtime config.
- `ute-ansible` / `ute-automation` / `ute-infra` / `ute-gitops` — own
  deployment execution and infrastructure/desired-state; a PR that
  triggers or performs deployment/infra changes directly is a review
  finding pointing here, not something to fix by rewriting the diff.

## Open Questions

- Source material is in Ukrainian; unclear whether it should be translated
  in full for the governance repo or referenced bilingually.
- The PR description template (What was done / How to test / Current
  state / Risks & Notes) and PR-title "squash-commit-friendly" format are
  referenced as pre-review requirements but not defined in the source —
  unclear which document should own that definition (candidate:
  `pr-summary` skill).
- "Release tag rules" are referenced in the source's split/approval
  sections without being defined — unclear which document owns that.
- High-risk approval mentions CODEOWNERS approval, but this repo must not
  install a CODEOWNERS file (see `core/standards/ci-cd.md`) — unclear how
  a consuming project is expected to satisfy this without one.
- Source memo targets human PR reviewers; unclear how far an agent should
  go beyond flagging/checking (e.g. should an agent ever post review
  comments directly, or only surface findings for a human to post).
- No explicit enforcement mechanism (branch protection, required review)
  is stated in the source — unclear if this document is aspirational or
  enforced policy.
