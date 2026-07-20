# Core Standards

Agent-neutral standards every project follows, regardless of which AI
coding agent is in use.

| Standard | Purpose | Main users / skills |
| --- | --- | --- |
| [`repository.md`](repository.md) | Repository self-sufficiency: README, structure, mandatory/recommended/optional files | `docs-sync`, `project-discovery` |
| [`repository-architecture.md`](repository-architecture.md) | Single-repo vs. monorepo vs. split-repo decision criteria (lifecycle/ownership/deployment, not preference) | `architecture-review`, `project-discovery` |
| [`documentation.md`](documentation.md) | What docs must answer and when they must be updated | `docs-sync` |
| [`development.md`](development.md) | Baseline code-organization and dependency-hygiene rules for any repo/language | `implementation-pass`, `feature-plan` |
| [`code-quality.md`](code-quality.md) | What "quality" means for a change: build gate, no silent failure/error swallowing, readability/naming/duplication | `implementation-pass`, `change-audit` |
| [`configuration.md`](configuration.md) | Non-secret configuration classification and structure | `feature-plan`, `implementation-pass` |
| [`security.md`](security.md) | Security posture: secrets, deny-by-default, destructive-command guardrails | `architecture-review`, `devops-review`, `feature-plan`, `implementation-pass`, `change-audit` |
| [`observability.md`](observability.md) | What must be observable — logs, metrics, traces, audit trail | `production-readiness`, `feature-plan` |
| [`testing.md`](testing.md) | Testing floor, ownership, merge blockers, link to CI/CD | `test-strategy`, `implementation-pass`, `feature-plan`, `change-audit` |
| [`api-integration.md`](api-integration.md) | API/contract/integration design, error handling, validation | `feature-plan` |
| [`ci-cd.md`](ci-cd.md) | CI/CD standard — this repo owns no pipeline implementation; ownership boundaries vs. `ute-ci-templates`, `ute-jenkins-library`, `ute-jenkins`, `ute-ansible`/`ute-automation`, `ute-infra`, `ute-gitops`; required project docs and release-readiness gate | `devops-review`, `release-readiness`, `rollback-plan`, `production-readiness`, `project-discovery`, `standards-gap-audit` |
| [`jenkins.md`](jenkins.md) | Jenkins as quality gate/deployment orchestrator — governance only, no pipeline implementation | `devops-review` |
| [`release-versioning.md`](release-versioning.md) | SemVer, release tags as source of truth, RC/hotfix/changelog rules | `release-readiness`, `rollback-plan` |
| [`packages-modules.md`](packages-modules.md) | In-repo module vs. separately versioned/published package decision and packaging rules | `architecture-review`, `core/archetypes/npm-package/` |
| [`task-handover.md`](task-handover.md) | Task state lives in the repo/PR, never in private chat or unpushed local commits | `pr-summary`, `change-audit` |
| [`workflow.md`](workflow.md) | Agent-neutral mandatory order of operations for non-trivial changes | All skills (baseline) |
| [`tooling-vs-ai-responsibility.md`](tooling-vs-ai-responsibility.md) | What an AI agent should own vs. what deterministic CI/tooling must enforce | All skills (baseline) |
| [`git/branching.md`](git/branching.md) | One task = one branch, named so type/ticket are obvious | `pr-summary`, `change-audit` |
| [`git/commits.md`](git/commits.md) | Commit message shape — type, scope, ticket, no secrets | `pr-summary`, `change-audit` |
| [`git/code-review.md`](git/code-review.md) | Human/agent-assisted review process, comment tagging and blocking rules | `change-audit` |
| [`git/pull-requests.md`](git/pull-requests.md) | Mandatory PR workflow: Draft → Ready for review → approved+green → squash merge | `pr-summary` |
| [`git/releases.md`](git/releases.md) | Release candidate cut, fix-forward, and release-branch rules | `rollback-plan` |
| [`git/tags.md`](git/tags.md) | When and how to tag releases (RCs, production releases, hotfixes) | `rollback-plan` |

Notes:

- `core/standards/` contains normalized agent-readable rules.
- Skills should reference these standards instead of duplicating large rule blocks.
- CI/CD implementation remains outside this repository.

These are the canonical texts. `adapters/claude/` and `adapters/codex/`
translate them into agent-specific mechanisms (Claude rule files with
`paths:` frontmatter and hooks; Codex durable `AGENTS.md` guidance) instead
of duplicating the prose — see `docs/repository-layout.md`.
