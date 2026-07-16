# UTE Testing Standard

## Purpose

Define what tests a UTE repo must have, where they live, what blocks merge,
and how testing connects to CI/CD — so tests verify important system
behavior (critical logic, auth, payments, data transforms, API contracts,
regression-prone areas), not just raise a coverage number.

## Applies To

- Every UTE repo with test infrastructure: backend services, Angular apps,
  packages/libraries, SDK/API clients, infrastructure repos.
- Both human and agent-authored changes.
- Backend- and Angular-specific depth lives in the matching archetype's
  `validation.md` (`core/archetypes/nodejs-api/validation.md`,
  `core/archetypes/angular-app/validation.md`, etc.) — this document sets
  the cross-stack floor, archetypes set the stack-specific detail.

## Does Not Cover

- Pipeline implementation/stage sequencing — see `core/standards/ci-cd.md`
  and the owning repos (`ute-ci-templates`, `ute-jenkins-library`).
- The literal Jenkins Pipeline Blueprint or any PR/CI-CD memo referenced by
  source material — those are implementation artifacts owned elsewhere, not
  restated here.
- Risk-prioritized test planning process — see `core/sdlc/test-strategy.md`.
- Stack-specific test tooling/layout depth — see the relevant
  `core/archetypes/<type>/validation.md` and `structure.md`.

## Source Documents

- "Testing Standard" (UTE, status: Draft, dated 2026-05-21) — normalized
  extract used to build this file. Treat rules below as binding once the
  source is confirmed finalized (see Open Questions).

## Required Rules

- Tests must verify important behavior (core logic, critical scenarios,
  safe-to-merge, safe-to-release, fast defect localization) — not merely
  raise a coverage number.
- Prefer project-native validation commands; never invent test/build
  commands a project doesn't actually have.
- Add tests for new behavior where test infrastructure exists; add a
  regression test for bug fixes when practical.
- Build verification is mandatory for every repo type, including MVP repos
  — an MVP may shrink its test set but must never drop build verification.
- Match test type to what needs verifying:

  | Type | Verifies | Typical use |
  | --- | --- | --- |
  | Unit | Single function/service/mapper | Needed almost everywhere |
  | Integration | Multi-part interaction (API, DB, external adapter) | Backend, cross-service paths |
  | E2E | Full user/system flow | Critical flows only, not every PR |
  | Contract | API contract between systems | Shared API/SDK/FE-BE boundary |
  | Smoke | Basic post-deploy check | Staging/production deploys |
  | Regression | Previously-broken scenario | After a defect is fixed |
  | Snapshot | Stable output/UI fragment | Only when genuinely useful |

- Minimum test set is repo-type-specific; do not restate archetype
  detail here — check the matching archetype's `validation.md`:

  | Repo type | Archetype doc |
  | --- | --- |
  | Backend service | `core/archetypes/nodejs-api/validation.md` |
  | Angular app | `core/archetypes/angular-app/validation.md` |
  | Angular library | `core/archetypes/angular-library/validation.md` |
  | Package/library | `core/archetypes/npm-package/validation.md` |
  | CLI | `core/archetypes/nodejs-cli/validation.md` |
  | Worker | `core/archetypes/nodejs-worker/validation.md` |
  | Infrastructure | `core/archetypes/devops-infra/validation.md` |
  | Compose app | `core/archetypes/docker-compose-app/validation.md` |
  | ERPNext/Frappe app | `core/archetypes/erpnext-frappe-app/validation.md` |

  All of the above still require unit tests plus build verification as a
  floor; SDK/API client repos add contract/example tests; infrastructure
  repos add validate/lint/plan checks; critical production repos add
  integration and smoke checks.
- Merge to main must be blocked when: unit tests fail, build fails, type
  check fails, critical integration tests fail, a required smoke check
  fails, mandatory contract tests fail, the test command fails to run, a
  test fails intermittently without explanation, or the pipeline does not
  complete.
- Merge may proceed despite a non-blocking test issue only if all of: the
  failing test is informational, risk is low, the reason is documented in
  the PR, a reviewer/tech lead agreed, and a follow-up fix step exists.
- Integration tests must use test databases, docker-compose, mocked
  externals, local emulators, fixtures, or seeded data — never production
  services or production data.
- Test names follow `should <expected behavior> when <condition>` (e.g.
  "should reject request when token is expired") — not "test 1", "works",
  "user", "should be ok".
- Location: colocate `*.spec` files next to the unit under test
  (services/policies/mappers/guards); put integration/e2e/fixtures/helpers
  under a top-level `tests/` (or archetype-specified) directory. Exact
  layout is archetype-specific — see the archetype's `structure.md`.
- If a coverage threshold is used, document it in the README or CI config.
  Coverage is a diagnostic signal (finds untested zones, tracks
  regressions) — not a pass/fail gate by itself.
- A discovered flaky test must be recorded, reproduced, and fixed. It may
  be marked skipped only temporarily, and only with a ticket, a documented
  reason, an assigned owner, a plan to re-enable it, and confirmation it is
  not release-critical.
- Reviewers must check: new logic has tests, existing tests were updated
  (not silently removed), coverage quality wasn't degraded, missing-test
  cases are explained, and risky changes carry regression tests.
- When tests are intentionally not added, the PR must state why (docs-only,
  formatting-only, comments-only, behavior-neutral config rename, dead-code
  removal, no-runtime-impact dependency bump, explicitly marked prototype).
- A package/library is publish-ready only if tests pass, build passes, the
  public API isn't broken, versioning matches the changes, and README
  examples match the actual API.
- Test data must be explicit, controlled, and separated from production
  data — no real user data, no real payment transactions as fixtures.
- CI/CD enforces these gates on every PR/release; how it does so (pipeline
  stages, runners, YAML/Groovy) is owned by `core/standards/ci-cd.md` and
  the repos it points to — do not author or restate pipeline steps here.
- For infrastructure/CI/CD changes without a runnable test, validate syntax
  and describe manual verification steps.
- If tests cannot be run, state exactly why and what should be run
  manually.
- If tests are missing or intentionally skipped for a change, explain why
  in the PR and, for anything risk-bearing, in the feature's `risks.md`
  (see `core/sdlc/release-readiness.md`) — `release-readiness` must not
  return a plain "ready" verdict over unexplained test gaps.

## Recommended Rules

- Prioritize test depth by risk: critical business logic, auth/permissions,
  payments/billing, data transformations, API contracts, release-critical
  flows, then regression-prone areas — not everything needs equally deep
  testing.
- Not every project needs every test type; pick types by the risk that
  actually needs covering.
- Reserve E2E for critical flows (login/logout, registration,
  checkout/payment, critical admin actions, permission-sensitive flows,
  file upload/download, main happy path, release-critical regressions), not
  as a duplicate of unit coverage. E2E should not be the sole test type,
  should not be excessively slow/flaky, should not depend on production
  data, and should not be mandatory on every small PR when heavy.
- Apply differentiated coverage expectations: none/low for MVP, a threshold
  on critical modules for production apps, a higher threshold on public API
  for packages/libraries, a threshold on services/policies/mappers for
  critical backends.
- Skip unit-testing trivial DTOs, trivial getters/setters, framework
  bootstrap without logic, generated code, or thin wrappers with no logic
  of their own (backend); avoid over-testing plain markup without logic,
  generated Angular boilerplate, purely visual components, or framework
  behavior itself (Angular).

## Forbidden Patterns

- Merging with failed tests.
- Deleting tests without explanation.
- Writing tests that don't actually verify anything.
- Using production data or real user data in tests.
- Using real payment/email/SMS services without a sandbox.
- Ignoring flaky tests, or using a skip marker without a ticket and a
  documented reason.
- Relying solely on manual testing.
- Relying solely on E2E tests.
- Requiring 100% coverage without a clear rationale.
- Testing framework behavior instead of the team's own logic.
- Shipping a release for a production-critical project without
  smoke/verification checks.
- Using shared mutable test state without resetting it between tests.
- Introducing flakiness via an unmanaged dependency on an external service.

## Agent Must Check

- Test command exists in `package.json`/equivalent project tooling.
- PR pipeline actually runs tests (per `core/standards/ci-cd.md`'s
  ownership model — not a local run standing in for CI).
- Build verification passes.
- Critical services/mappers/validators/policies have tests.
- Auth/permissions logic is tested if present.
- API contract is checked if an FE-BE or SDK boundary exists.
- Smoke checks exist for production deploys where applicable.
- Test data contains no production secrets or real user data.
- Flaky tests are not silently skipped without a ticket.
- A reviewer can tell what is and isn't covered from the PR alone.
- Absence of tests is explained in the PR (and in `risks.md` if
  risk-bearing) when acceptable.

## Agent Must Not Do

- Must not manually re-run lint, format, standard unit tests, or build
  verification in place of CI — that's CI/CD's job, not the reviewer's or
  the agent's.
- Must not author pipeline YAML/Groovy/stage sequencing here or in this
  repo — see `core/standards/ci-cd.md`.
- Must not treat a coverage percentage as sufficient evidence a change is
  safe — check what the tests actually assert.
- Must not mark a change "ready" (`release-readiness`) when tests are
  missing/failing and unexplained.
- Must not invent test or build commands a project doesn't have.

## Related Skills

- `/test-strategy` (`core/sdlc/test-strategy.md`) — risk-prioritized test
  planning process; reads the matching archetype's `validation.md` first.
- `/release-readiness` (`core/sdlc/release-readiness.md`) — gates release on
  test status and unexplained gaps.
- `/change-audit` (`core/sdlc/change-audit.md`) — audits whether planned
  tests were actually added.
- Code review checklist — `core/standards/git/code-review.md`.

## Related Archetypes

- `core/archetypes/nodejs-api` — backend service testing expectations.
- `core/archetypes/angular-app` — Angular app testing expectations.
- `core/archetypes/angular-library`, `core/archetypes/npm-package` —
  package/library testing + publish-readiness.
- `core/archetypes/nodejs-cli`, `core/archetypes/nodejs-worker` — CLI/worker
  testing expectations.
- `core/archetypes/devops-infra`, `core/archetypes/docker-compose-app`,
  `core/archetypes/erpnext-frappe-app` — infra/compose/Frappe testing
  expectations.

## Related UTE Repositories

- `ute-ci-templates` — owns GitHub Actions pipeline stages that run these
  test gates.
- `ute-jenkins-library` / `ute-jenkins` — owns Jenkins pipeline steps that
  run these test gates.
- Neither is duplicated here — this document states the testing
  requirement, not the pipeline that enforces it.

## Open Questions

- Source document status is "Draft" (2026-05-21) — confirm finalized before
  treating its rules as binding governance.
- No org-wide default coverage threshold is defined; source only requires
  documenting a threshold if one is used. Decide whether
  `ute-agent-standards` should set a default or leave it fully per-project.
- "MVP" is used as a qualifying condition (minimum test set, coverage) but
  isn't formally defined in the source — needs a definition or a
  cross-reference to wherever MVP is defined.
- No required test framework/tool defaults (Jest, Playwright, Cypress,
  etc.) are specified — decide whether agent guidance should name defaults
  or stay tool-agnostic.
