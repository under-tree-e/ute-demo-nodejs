# Docs Sync

Canonical procedure behind the `docs-sync` skill.

## Purpose

Check whether documentation must be updated after code, infrastructure,
deployment, CI/CD, API, configuration, or behavior changes. Use near the end
of a task or before PR creation.

## Check docs impact for

- Product behavior
- Architecture
- Environments
- CI/CD
- Deployment
- Rollback
- Secrets/configuration
- Observability/logging
- Operations/runbooks
- API contracts
- User-facing workflows

## Process

1. Inspect git diff.
2. Identify affected docs.
3. Update only relevant docs.
4. If no docs need updates, state why.
5. Summarize documentation changes.

See `core/standards/documentation.md` for what a good doc answers.
