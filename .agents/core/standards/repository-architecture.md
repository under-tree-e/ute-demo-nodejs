# Repository Architecture Standard

## Purpose

Decide repository boundaries — single repository, monorepo, or multiple
repositories — by lifecycle, ownership, and deployment, never by
technology stack alone. Prevent unjustified repo splitting and unjustified
monorepo sprawl.

## Applies To

- `project-discovery` and `architecture-review` when a project's repo
  layout is being assessed or a new repo/split is proposed.
- Any decision to create a new repository, merge repositories, or
  extract a module/service/package into its own repository.

## Does Not Cover

- Repo naming rules (deferred to a separate naming-conventions document —
  not yet authored; see Open Questions).
- Internal directory structure within a repo (see `core/archetypes/<type>/`
  for stack-specific structure).
- Git branch/commit/PR rules (see `core/standards/git/`).
- CI/CD pipeline rules (see `core/standards/ci-cd.md`).
- README/LICENSE/Jenkinsfile/`.npmrc` templates.

## Source Documents

- "Repository Architecture Policy" (Policy; status: On Review, not yet
  finalized/approved as of ingestion — see Open Questions).

## Required Rules

- Determine repository boundaries by lifecycle, responsibility, and
  deployment method — never by technology stack alone.
- Do not split code into separate repositories merely because the system
  has a frontend, backend, mobile app, admin panel, API, worker, or shared
  code — split only if these parts do not change, deploy, scale, or get
  maintained together.
- Keep parts that change, deploy, scale, and are maintained together in one
  repository; split parts that do not.
- Give a shared service its own repository only if it is genuinely used by
  multiple products, or has independent deploy, its own database, its own
  team/owner, independent scaling, security-critical status, or a stable
  API contract — not merely because it is a backend module.
- Give a shared package/library its own repository only if it is reused
  across multiple repositories/products, has its own version, is published
  to a registry, or has its own release cycle.
- Create a new repository only for a genuine architectural or operational
  reason, evaluated via the Decision Flow below.
- Apply the Decision Flow before creating a repository — do not split or
  create ad hoc.
- Maintain clear boundaries between `apps/`, `packages/`, `docs/`, and
  `infra/` inside any monorepo — a monorepo must not become an unstructured
  dump of everything.

## Recommended Rules

- Use a **single repository** for MVPs, small/medium products, and
  products maintained by one team/developer with a unified lifecycle and no
  independent deploy/scaling/security boundaries.
- Use a **monorepo** when multiple apps/services/packages must evolve in
  sync: shared DTOs/contracts, frequently cross-cutting changes, need for a
  single PR across parts, important version synchronization, or a
  single/centralized team.
- Prefer **splitting into multiple repositories** when parts deploy
  separately, run on different runtimes, change at different frequencies,
  have different owners/teams, need independent scaling, have their own
  database, have a separate API contract, sit in a separate security zone,
  or the service is consumed by multiple products.
- Allow a package to remain inside a monorepo if it is used by only one
  product, changes together with that product, has no independent
  versioning, and needs no separate publish process.

### Decision Flow

Score each candidate split by counting "yes" answers:

| Question | Yes contributes to split score |
| --- | --- |
| Separate product? | 1 |
| Separate deploy/runtime? | 1 |
| Own database? | 1 |
| Independent scaling needed? | 1 |
| Separate owner/team? | 1 |
| Used by multiple products? | 1 |
| Separate API contract? | 1 |
| Security boundary? | 1 |

| Strong-reason count | Outcome |
| --- | --- |
| 0-1 | Keep in existing repository. |
| 2-3 | May split only if it simplifies maintenance. |
| 4+ | Create a separate repository. |

### Reference Trees

- **Single Product Repository**: `product/` with `web/`, `api/`, `admin/`,
  `mobile/`, `shared/`, `docs/`, `infra/`.
- **Monorepo**: `product/` with `apps/{web/, admin/, mobile/, api/}`,
  `packages/{contracts/, ui/, shared/}`, `docs/`, `infra/`.
- **Split Architecture**: `product-web`, `product-api`, `product-mobile`,
  `auth-service`, `user-service`, `notification-service`, `ui-package`,
  `api-client-package` as separate repositories.

### Worked Examples

| Scenario | Score drivers | Outcome |
| --- | --- | --- |
| Angular + Node app, one product, one lifecycle | 0-1 | Single repository |
| Web + mobile + shared contracts changing in sync | Cross-cutting sync need | Monorepo |
| Auth service used by multiple products | Multiple products, own contract | Separate repository |
| Notification service with independent deploy | Separate deploy/runtime | Separate repository |
| UI library used by multiple frontends | Reused across repos, own release | Separate package repository |
| Small backend with auth/users/profile modules, one deploy | 0-1 | Single repository |
| Backend with separate services, DBs, deploys | 4+ | Multiple repositories |
| Package used by one product only | 0-1 | Keep inside product repo |

## Forbidden Patterns

- Splitting frontend and backend into separate repositories solely because
  they use different technologies.
- Creating microservices without an actual operational need.
- Moving backend modules into separate repositories without a
  deploy/DB/ownership justification.
- Duplicating shared logic across multiple repositories instead of
  extracting a shared package repository.
- Creating a separate repository for every small part of the system.
- Mixing unrelated products inside one repository.
- Creating a shared package that is not actually used anywhere else.
- Performing a split-architecture reorganization without ownership clarity
  and CI/CD readiness in place (see `core/standards/ci-cd.md` for the
  pipeline-ownership model a split must land into).

## Agent Must Check

- Lifecycle of each part (does it change/deploy/scale together with the
  rest) is clear before proposing a repo boundary.
- What deploys together vs. separately is clear.
- Independent-scaling need is clear.
- Separate owners/teams, if any, are identified.
- Cross-product shared usage is identified before extracting a shared
  service or package repository.
- Security boundaries are identified.
- The Decision Flow score for any proposed split or merge, and record it in
  the architecture-review output.
- No split is being proposed on technology grounds alone.
- No unnecessary microservices are being introduced.
- No shared logic is duplicated across repos as an alternative to a shared
  package repository.

## Agent Must Not Do

- Must not recommend creating a new repository without running the
  Decision Flow and recording the score.
- Must not recommend splitting a repo based solely on differing
  technologies, languages, or frameworks between parts.
- Must not recommend extracting a shared service or package repo that has
  no actual multi-consumer usage today.
- Must not recommend a split-architecture reorganization while ownership or
  CI/CD readiness is undetermined — flag as an open question instead.
- Must not author or scaffold pipeline YAML/Groovy/Terraform/Ansible as
  part of a repository-split recommendation — that belongs to
  `ute-ci-templates`/`ute-jenkins-library`/`ute-ansible`/`ute-automation`/
  `ute-infra`/`ute-gitops` per `core/standards/ci-cd.md`.

## Related Skills

- `core/sdlc/project-discovery.md` — establishes current repo layout and
  lifecycle/ownership facts this standard's Decision Flow consumes.
- `core/sdlc/architecture-review.md` — the gate where a proposed repo
  split/merge/extraction must be scored and justified before
  implementation.
- `core/sdlc/standards-gap-audit.md` — use if a repo-boundary decision
  produced confusion or a guess, to classify whether the gap is in this
  standard.

## Related Archetypes

- `core/archetypes/npm-package/` — the shared package/library repository
  pattern this standard's package-extraction criteria feed into.
- `core/archetypes/devops-infra/` — relevant when a proposed split
  introduces its own infra/deploy repo.
- All other `core/archetypes/<type>/` entries describe internal structure
  once a repository boundary is already decided — not a substitute for
  this standard's boundary decision.

## Related Repositories

- `ute-ci-templates`, `ute-jenkins-library`, `ute-jenkins` — own the CI/CD
  readiness a split-architecture reorganization must have in place; this
  standard never authors their pipeline content (see
  `core/standards/ci-cd.md`).
- `ute-ansible`, `ute-automation`, `ute-infra`, `ute-gitops` — own
  deployment/infra execution a repo split may introduce; this standard
  never defines their content.

## Open Questions

- Source policy status is "On Review" (not yet finalized/approved) —
  confirm approval before treating this standard as binding.
- The source policy defers repo naming rules, internal directory structure
  rules, Git branch/commit/PR rules, CI/CD rules, and README/LICENSE/
  Jenkinsfile/`.npmrc` templates to separate documents. No repo-naming
  document exists in this repo yet — confirm whether one still needs to be
  authored/ingested.
- "CI/CD readiness," used as a split-architecture prerequisite, is not
  defined in the source policy — confirm whether its definition should live
  in `core/standards/ci-cd.md` or in `ute-ci-templates`/
  `ute-jenkins-library` with a cross-reference added here.
- The 2-3 strong-reason "may split if it simplifies maintenance" band is
  qualitative with no hard metric — confirm whether borderline cases always
  require human sign-off rather than an agent-only decision.
