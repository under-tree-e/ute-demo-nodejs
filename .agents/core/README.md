# Core

Agent-neutral source of truth for the AI Agent Standards. Nothing in
this directory assumes a specific AI coding agent — `adapters/claude/` and
`adapters/codex/` translate this content into agent-specific mechanisms
(Claude skills/rules/hooks, Codex `AGENTS.md`/skills) instead of duplicating
it. See `docs/repository-layout.md` for the full map and
`docs/migration-to-agent-standards.md` for why this split exists.

Portable skills (`skills/<name>/SKILL.md`) treat a file under here as their
canonical procedure. In this repo, that reference reads `core/...` and
resolves directly since `core/` sits at the repo root. `install-agent-
standards.sh` installs a copy of this whole directory into a consuming
project at `<project>/.agents/core/`, and the installed skill copies
reference it as `.agents/core/...` accordingly (rewritten at sync time —
see `scripts/sync-portable-skills.sh`) — without that install step, those
references would be unresolvable outside this repo.

- `sdlc/` — the full lifecycle, one canonical doc per stage (discovery,
  architecture review, feature planning, implementation, change audit, test
  strategy, docs sync, release readiness, production readiness, rollback
  plan, post-release review). See `sdlc/README.md`.
- `standards/` — workflow, security, documentation, and testing rules that
  apply regardless of adapter, plus Git/GitHub process conventions under
  `standards/git/`.
- `archetypes/` — optional, stack-specific overlays (Angular app/library,
  Node.js API/CLI/worker, npm package, DevOps/infra, Docker Compose app,
  ERPNext/Frappe app). See `archetypes/README.md`.
- `templates/` — starter project docs, feature-folder templates, and
  example GitHub issue/PR templates. See `templates/README.md`.

## What does NOT live here

- Agent-specific config (`CLAUDE.md`, `.claude/`, `AGENTS.md`, Codex skill
  runtime wiring) — that's `adapters/<agent>/`.
- Reviewed/attributed third-party skill content — that's `vendor-skills/`,
  and as of this writing nothing has been imported there; see
  `docs/vendor-skills-policy.md`.
- Install/sync/validation tooling — that's `scripts/`.
