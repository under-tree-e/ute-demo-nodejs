# Documentation Standard

## Purpose

Documentation exists so a project's current state, rationale, usage,
constraints, and operational procedure can be understood without verbal
explanation, private notes, or undocumented manual steps.

## Applies To

- Root `README.md` of every repository.
- Repository-level docs (`docs/`, `CONTRIBUTING.md`, `CHANGELOG.md`,
  `SECURITY.md`, decision records).
- Keeping docs in sync with code, architecture, environment, CI/CD,
  deployment, secrets, rollback, and observability changes.

## Does Not Cover

- Full repository standard (naming convention, mandatory file list beyond
  documentation files, `package.json` metadata, minimum CI stages, branch
  protection, PR template contents) — not yet ingested as its own
  `core/standards/repository.md`; see Open Questions.
- Git/PR process and content rules — see `core/standards/git/`.
- CI/CD ownership and pipeline implementation — see
  `core/standards/ci-cd.md`.
- Environment/secrets storage rules — not yet ingested as a dedicated
  standard.

## Source Documents

- Repository Standard (status: On Review) — documentation-relevant
  requirements extracted here; non-documentation requirements (naming,
  `package.json`, CI minimums, branch protection) intentionally excluded.
- Developer Documentation Index (status: Draft) — cited only to confirm
  that a docs navigation/index concept exists; its content is not
  duplicated here (see Related Documents below).

## Required Rules

- Documentation should answer:
  - What exists now?
  - Why does it exist?
  - How is it used?
  - What are the constraints and risks?
  - How is it verified?
  - How can it be rolled back or operated?
- When code changes alter behavior, architecture, environments, CI/CD,
  deployment, secrets, rollback, observability, or operational flow,
  update the relevant docs.
- Prefer concise documents with clear sections over long generic
  explanations.
- Every repository must have `README.md` as its single entry point — a
  new contributor must be able to understand the repo's purpose, run it
  locally, and open a PR from the README alone, without verbal
  explanation.
- README must cover, at minimum: Purpose, Local Setup, Configuration,
  Commands, Integrations, CI/CD, Deployment, Troubleshooting. If a
  section doesn't apply, say so explicitly (e.g. "No deployment step —
  library published via CI") rather than omitting it silently.
- README must be practically useful, not a purely formal placeholder —
  real commands, real required env/config variables, real integration
  list.
- Any environment/runtime config variable required to run, build, or
  deploy must be documented (README or a linked config doc), with
  example values kept empty/mock/local-only — never real or production
  values.
- Keeping README and repository docs current is part of repository
  ownership accountability — an owner is responsible for noticing when
  docs drift from behavior.

## Recommended Rules

- Team, production, or long-lived repositories should additionally carry:
  `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, and a `docs/` folder
  (`architecture.md`, `deployment.md`, `integrations.md`, `decisions/`).
- When a repository's `docs/` grows past a handful of files, maintain a
  navigation/index doc so readers can find "which doc answers X" instead
  of duplicating rules across files. This repo's own equivalent of that
  navigation concept is `docs/source-standards-manifest.md` — it, not
  this file, is the place to add cross-doc navigation for
  `ute-agent-standards` itself.

## Forbidden Patterns

- No repository without a README.
- No README that is purely formal with no practical usefulness (missing
  real setup/commands/config).
- No silent skip of a docs update after a behavior/architecture/CI-CD/
  deployment/secrets/rollback/observability/ops-flow change.
- No duplicating another standard's or document's owned rule content
  instead of cross-referencing it — restate the pointer, not the rule.

## Agent Must Check

- Does the repo have a README, and does it cover the required sections
  (or explicit N/A) rather than omitting them silently?
- Are required env/config variables documented, with non-real example
  values?
- Did this change alter behavior, architecture, environments, CI/CD,
  deployment, secrets, rollback, or observability — if so, were the
  relevant docs updated (see `core/sdlc/docs-sync.md`)?
- Is content being duplicated across docs that should instead
  cross-reference a single source of truth?

## Agent Must Not Do

- Must not skip a documentation update after an operationally relevant
  change.
- Must not author or copy pipeline/infra implementation detail into
  documentation as a substitute for the owning repo — see
  `core/standards/ci-cd.md` for that boundary.
- Must not restate another document's full rule set here; point to the
  owning standard/doc instead.

## Related Skills

- `/docs-sync` (`core/sdlc/docs-sync.md`) — process for keeping docs in
  sync with a change.
- `/project-discovery` — establishes baseline doc state for a project.

## Related Archetypes

N/A — archetype-specific README/doc scaffolding lives under
`core/archetypes/<type>/`, not in this standard.

## Related Repositories

N/A — documentation practices apply within each repository; this standard
does not delegate ownership to another repo.

## Open Questions

- Repository Standard source is status "On Review" — confirm whether its
  non-documentation requirements (naming convention, `package.json`
  metadata, minimum CI stages, branch protection, PR template) should be
  ingested into a new `core/standards/repository.md`.
- Developer Documentation Index source is status "Draft" and assumes
  several documents (Git memo, PR memo, Repository Architecture Policy,
  Environment & Secrets Standard, Security & Access Control Policy,
  Testing Standard, Package & Module Standard) that may not yet exist in
  this repo — confirm before cross-referencing them by name.
- No definition yet of when a source document should be marked "legacy"
  vs. authoritative for ingestion purposes.
