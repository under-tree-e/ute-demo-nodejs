# Development Standard

## Purpose

Baseline code-organization and dependency-hygiene rules that apply to any
repository, in any language, before and alongside stack-specific rules. This
file is deliberately stack-neutral — it states the cross-cutting principle
and routes the agent to the archetype or standard that covers the mechanics
for the stack in play.

## Applies To

- Any repository or module, regardless of language/framework.
- Decisions about adding files, folders, dependencies, or new top-level
  modules.
- Where configuration/environment access and business logic live inside a
  codebase.

## Does Not Cover

- Stack-specific file/folder layout — see the matching
  `core/archetypes/<type>/structure.md` and `rules.md`.
- Configuration mechanism (schema validation, secret loading, env-file
  precedence) — see `core/standards/configuration.md`.
- Repository-level scaffolding (README, LICENSE, CI config, PR template) —
  see the Repository Standard material folded into
  `core/standards/ci-cd.md` and `core/standards/git/`.
- Package/module extraction and publishing rules (when a module becomes its
  own versioned package, naming, registry, SemVer) — covered by the
  Package & Module Standard; not duplicated here.
- Security-specific rules — see `core/standards/security.md`.
- Testing strategy — see `core/standards/testing.md`.

## Source Documents

- Repository Standard (company-wide minimum repo standard; status: On
  Review) — module-vs-file hygiene and "no just-in-case" additions drawn
  from its forbidden-patterns list.
- Package & Module Standard (status: On Review) — module-vs-package
  decision principle and naming-clarity rules applied here to in-repo
  module organization.

## Required Rules

- Do not add a file, folder, dependency, or module "just in case" — add it
  when there is a real, current usage, not for anticipated future need.
- Keep code as an in-repo module (not a separate package, folder tree, or
  dependency) unless there is actual reuse across repos, an independent
  release lifecycle, or a real publish requirement — see the Package &
  Module Standard for the extraction decision.
- Access environment variables and runtime config through one centralized
  config layer, not scattered `process.env`/`os.environ`/global lookups
  throughout the codebase. See `core/standards/configuration.md` for the
  mechanism and the relevant archetype's `rules.md` for stack-specific
  wiring (e.g. `core/archetypes/nodejs-api/rules.md` config validation).
- Put business logic in dedicated modules/services — routes, controllers,
  and UI components call into that logic, they do not contain it. See the
  matching archetype's `structure.md`/`rules.md` for where that layer lives
  for the stack in play (e.g. service/repository layers for
  `nodejs-api`, containers/services for `angular-app`).
- Name modules/folders for what they specifically do; a name must make the
  module's purpose evident without opening it.
- Consolidate duplicated logic into one place instead of copy-pasting it
  across modules or packages.

## Recommended Rules

- When a "utils"-shaped folder already exists in a project you're editing,
  prefer moving genuinely misplaced logic to a named, purpose-specific
  module over adding one more unrelated function to it.
- Revisit optional/scaffold files periodically (recommended-files.md per
  archetype) and remove ones that never got real usage instead of leaving
  them as accumulated cruft.

## Forbidden Patterns

- Adding a dependency, file, or folder speculatively, with no current
  caller/usage.
- Chaotic, catch-all `utils`/`helpers`/`common`/`shared` folders/modules
  used as a dumping ground instead of a set of purpose-specific modules.
- Generic, purpose-less names for modules or packages (`utils`, `common`,
  `shared`, `misc`) without a clarified, specific responsibility.
- Business logic embedded directly in a route handler, controller action,
  or UI component instead of a dedicated module/service.
- Reading environment/global config ad hoc from arbitrary places in the
  codebase instead of through the project's centralized config layer.
- Extracting a module into its own package/repo with no real reuse,
  independent lifecycle, or publish need behind it.
- Duplicating the same logic across multiple modules/packages instead of
  consolidating it.

## Agent Must Check

- Before adding a new file/folder/dependency: is there a concrete, current
  usage for it, or is this speculative?
- Before adding to (or creating) a `utils`-style folder: does this belong
  in a purpose-specific module instead?
- Before writing config/env access: does this project already have a
  centralized config layer the new code should use instead of
  `process.env`/equivalent direct access?
- Before adding logic to a route/controller/UI component: does this belong
  in a service/domain module instead, per the project's archetype?
- Before extracting a module into a separate package: is there real reuse,
  an independent release cycle, or a publish requirement — or is the module
  fine staying where it is?

## Agent Must Not Do

- Must not create speculative files, folders, or dependencies with no
  current caller, "for later."
- Must not add new code to a generic `utils`/`common`/`shared` dumping
  ground when a purpose-specific module would do.
- Must not place business logic directly in a route/controller/UI component
  when the project's archetype defines a dedicated logic layer.
- Must not introduce a new, separate way of reading environment/config
  values when a centralized config layer already exists in the project.
- Must not extract a module into a standalone package without a real reuse
  or publish need — see the Package & Module Standard's extraction rule.

## Related Skills

- `architecture-review` — module boundaries and where logic should live are
  in scope before non-trivial implementation.
- `code-review` — reuse/simplification/efficiency review of a diff,
  including catch-all-folder and duplicated-logic checks.
- `project-discovery` — establishes the project's actual stack/archetype so
  this file's pointers resolve to the right archetype.

## Related Archetypes

- All `core/archetypes/<type>/structure.md` and `rules.md` files define
  where the config layer and business-logic layer actually live for that
  stack — this file states the principle, they state the mechanics.
- `nodejs-api`, `nodejs-worker`, `nodejs-cli` — service/domain layer vs.
  route/entrypoint separation.
- `angular-app`, `angular-library` — component vs. service separation.
- `npm-package` — module-vs-package extraction boundary in practice.

## Related Repositories

- N/A — this standard governs in-repo code organization; it does not
  allocate ownership to any pipeline/infra repo.

## Open Questions

- Both source documents (Repository Standard, Package & Module Standard)
  are status "On Review" — confirm whether the module-vs-package extraction
  rule and the "no just-in-case" rule should be treated as binding or
  provisional pending sign-off.
- `core/standards/configuration.md` is referenced here but does not exist
  yet in this repo — confirm it is being created so the cross-reference
  resolves.
- No dedicated `core/standards/` file yet exists for the Package & Module
  Standard's full content (naming, SemVer, publishing) — confirm where
  that material lands so this file's cross-reference has a concrete target.
