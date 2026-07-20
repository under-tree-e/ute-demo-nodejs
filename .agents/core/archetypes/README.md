# Archetypes

`core/archetypes/<type>/` are optional, stack-specific overlays on top of the
generic workflow (`core/sdlc/README.md`) and `core/standards/`. They are
agent-neutral recommendations and checks — a project is never required to
restructure itself to match one, and using either the Claude or Codex adapter
does not require picking an archetype at all.

Each archetype folder has the same four files:

| File | Purpose |
| --- | --- |
| `structure.md` | Recommended repo layout (a suggestion, not a mandate) |
| `rules.md` | Practical conventions/rules specific to the stack |
| `validation.md` | Testing/CI expectations and common risks |
| `recommended-files.md` | Docs and config files worth having, beyond the base doc set in `core/sdlc/project-discovery.md` |

Which skill to reach for at each stage is agent-specific and lives in
each adapter instead of here — see `adapters/claude/.claude/skills/` and
`adapters/codex/skills/` — so an archetype only has to be written once and
both adapters point at it.

## Available archetypes

| Archetype | For |
| --- | --- |
| [`angular-app`](angular-app/structure.md) | Standalone Angular front-end application (SPA) |
| [`angular-library`](angular-library/structure.md) | Publishable Angular library (npm package) |
| [`nodejs-api`](nodejs-api/structure.md) | Node.js backend service exposing an HTTP-style API |
| [`nodejs-cli`](nodejs-cli/structure.md) | Node.js command-line tool |
| [`nodejs-worker`](nodejs-worker/structure.md) | Node.js background/queue-consuming worker |
| [`npm-package`](npm-package/structure.md) | Node.js/TypeScript library published as a package |
| [`devops-infra`](devops-infra/structure.md) | Terraform/Ansible/CI-pipeline infrastructure repo |
| [`docker-compose-app`](docker-compose-app/structure.md) | App shipped and run via Docker Compose |
| [`erpnext-frappe-app`](erpnext-frappe-app/structure.md) | Custom app on the Frappe/ERPNext framework |

## Using an archetype

1. Install an agent adapter first (`scripts/install-agent-standards.sh`) —
   archetypes build on top of that, they don't replace it.
2. Read the archetype's `structure.md`/`rules.md` to confirm it's a
   reasonable fit; nothing here auto-detects a project's type.
3. For an existing project, treat all four files as a checklist of gaps, not
   a rewrite plan.
4. Wire `validation.md`'s CI/testing expectations into the project's actual
   pipeline — this repo only documents them, it doesn't enforce them (see
   `core/standards/tooling-vs-ai-responsibility.md`).

## Adding a new archetype

Follow the same four-file shape. Keep each file practical and short — a
reviewer should be able to read all four in a few minutes. Add a row to the
table above. Legacy `archetypes/<type>/README.md` and
`archetypes/<type>/claude-usage.md` at the repository root remain as
Claude-specific compatibility content — see `docs/repository-layout.md`.
