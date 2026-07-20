# Configuration Standard

## Purpose

Define how application configuration (non-secret) is classified,
committed, and structured across repos, so an agent can tell "safe to
commit as an example" from "must never appear in the repo" without
guessing. Secret storage, rotation, and access control are a separate
concern — see [Does Not Cover](#does-not-cover).

## Applies To

- Frontend apps (`angular-app` and equivalent) — runtime/build-time config.
- Backend services, APIs, workers (`nodejs-api`, `nodejs-worker` and
  equivalent) — centralized env-driven config.
- Docker/deployment repos and infra repos that define env variables for a
  service they package (not the infra tooling itself).
- Any repo with a `.env`, `.env.example`, or environment/runtime config
  file.

## Does Not Cover

- Secret storage, secret managers, Vault, rotation process, and access
  control — see `core/standards/security.md`. This file governs
  configuration; it does not duplicate secret-handling rules.
- CI/CD pipeline definitions and how secrets are injected into a pipeline
  run — see `core/standards/ci-cd.md`. Pipeline YAML/Groovy is out of
  scope for this repo entirely.
- Full repo structure — see the relevant `core/archetypes/*/structure.md`.
- Git/PR/CI-CD workflow, Jenkinsfile templates, package publishing rules.

## Source Documents

- Environment & Secrets Standard (Draft, dated 2026-05-21) — CONFIG-side
  rules only. Secret-side rules from the same source live in
  `core/standards/security.md`, not here.

## Required Rules

- Classify every config value as one of three types before deciding how
  to store it: **public config**, **environment config**, or **secret**.
  This three-way split determines the commit rule below.

| Type | Definition | Commit rule |
| --- | --- | --- |
| Public config | Non-sensitive, safe to expose (feature flags, API base URL, app name, build metadata) | OK to commit with real values |
| Environment config | Varies per environment but isn't sensitive on its own (port, log level, timeouts, non-secret service URLs) | Commit only as an example (`.env.example`); never with real per-environment values |
| Secret | Sensitive by definition (tokens, passwords, private keys, connection strings with credentials, JWT signing secrets) | Never commit in any form — see `core/standards/security.md` |

- Repos MAY contain configuration examples; they MUST NOT contain real
  secrets (real tokens, passwords, private keys, production DB URLs,
  service account keys, JWT secrets, real OAuth secrets, or a `.env` with
  real values).
- Provide `.env.example` for: backend services, API services, workers,
  Docker/deployment repos, and infra repos that expose env variables for
  the service they package.
- Provide `.env.example` (or an equivalent named example file) for
  frontend apps that have runtime/env config, unless another example file
  already exists.
- `.env.example` values MUST stay empty or mock/local-only. Production
  values MUST NOT appear in it. Every required variable MUST be present.
- Local `.env` files MUST be listed in `.gitignore`.
- Frontend applications MUST NOT contain secrets — anything shipped in a
  browser bundle is public by nature. Frontend config is public config;
  route secret-shaped values through a backend instead. See
  `core/archetypes/angular-app/`.
- Backend config MUST be read through a centralized config layer (single
  config module/directory, e.g. `src/config/`), not scattered direct
  `process.env` access throughout the codebase. See
  `core/archetypes/nodejs-api/`.
- Required env variables MUST be validated at application startup; config
  errors MUST fail fast at startup, not during a runtime request.
- Config MUST have a typed structure when TypeScript is used.
- Env variable names MUST be uppercase, follow `<AREA>_<NAME>` format, and
  be stable and self-explanatory — not generic/context-free (`TOKEN`,
  `KEY`, `SECRET`, `PASS`, `URL`, `TEST`, `MY_VAR`).
- Dockerfile and docker-compose MAY declare config keys but MUST NOT
  contain real secret values (build-time or otherwise). Secret injection
  at container runtime is a `security.md` concern, not a config-file
  concern.

## Recommended Rules

- Mark optional variables in `.env.example` with a comment.
- Access config via a config abstraction (imported config object), not
  direct `process.env` calls, in service/controller/repository code.
- One env variable name per one value; avoid project-specific
  abbreviations.
- Frontend example config files follow conventional names:
  `config.example.json`, `runtime-config.example.json`,
  `app-config.example.json`, `src/environments/environment.example.ts`.
- Config that can change after build uses a runtime config file rather
  than a build-time env value; config needed only at build time uses
  Angular-style `environment.ts`/`environment.prod.ts` (see
  `core/archetypes/angular-app/`).

## Forbidden Patterns

- Committing `.env` files with real values.
- Placing production values inside `.env.example`.
- Using generic, context-free env variable names (`TOKEN`, `KEY`, `PASS`,
  `SECRET`, `URL`, `TEST`, `MY_VAR`).
- Scattering direct `process.env.X` reads across backend business logic
  instead of a centralized config layer.
- Treating a frontend build/runtime config value as a safe place for
  anything secret-shaped.

Secret-specific forbidden patterns (hardcoded pipeline tokens, secrets in
Dockerfiles/docker-compose, committed service-account JSON or private
keys, secrets in README/PR/chat) are defined once in
`core/standards/security.md` — not repeated here.

## Agent Must Check

- Is this value public config, environment config, or a secret? If unsure,
  treat it as a secret and stop.
- Does the repo type require a `.env.example` (see Required Rules), and if
  so, does one exist with all required variables listed and no real
  values?
- Is `.env` (and variants) present in `.gitignore`?
- Does backend config route through a single config module rather than
  ad hoc `process.env` access?
- Are env variable names uppercase `<AREA>_<NAME>`, not generic?
- For frontend changes: does the new config value belong in a public
  runtime/build-time config, or is it actually secret-shaped and therefore
  wrong to add to the frontend at all?

## Agent Must Not Do

- Must not add a real secret, token, password, private key, or credential
  string to any file in the repo, including `.env.example`, README, docs,
  or code comments.
- Must not add secret-shaped config to a frontend/browser-bundled config
  file.
- Must not introduce new scattered `process.env` reads in a backend repo
  that already has a centralized config layer.
- Must not silently skip creating/updating `.env.example` when adding a
  new required env variable to a repo type that requires one.

## Related Skills

- `project-discovery` — establishes whether a project has a config layer
  and `.env.example` already, before further changes.
- `release-readiness` — checks config/secrets exposure before release.
- `docs-sync` — README configuration section must stay in sync with actual
  config files/variables.

## Related Archetypes

- `core/archetypes/angular-app/` — frontend runtime/build-time config is
  public by nature.
- `core/archetypes/nodejs-api/` — backend centralized config layer
  (`src/config/`), startup validation.
- `core/archetypes/nodejs-worker/`, `core/archetypes/docker-compose-app/` —
  same `.env.example` requirement as backend services.

## Related Repositories

- `ute-ci-templates` / `ute-jenkins-library` / `ute-jenkins` — own secret
  injection into pipeline runs; not config classification.
- `ute-ansible` / `ute-automation` / `ute-infra` / `ute-gitops` — own
  runtime secret delivery to deployed environments.

## Open Questions

- Source document is Draft (2026-05-21) — confirm before treating its
  rules as final/required rather than provisional.
- No separate Vault/secret-manager naming-convention standard was found to
  cross-reference from `security.md`; flag if one should exist.
- Build-time frontend config (e.g. `environment.prod.ts`) committed with
  values filled in by CI at build time — clarify in `security.md` how this
  interacts with "frontend must never contain secrets" if a build pipeline
  writes into it before commit vs. before bundling only.
