# Rules — DevOps / Infra

## Terraform

- Always `terraform plan` before `terraform apply`; review the plan output
  for unexpected destroys/replaces before proposing an apply.
- Use workspaces or per-environment directories/state — never apply the same
  state file against two environments.
- Pin module and provider versions; don't float on `latest`/unconstrained.

## Ansible

- Playbooks must be idempotent — re-running one with no drift should report
  no changes.
- Run in `--check` (dry-run) mode first for anything touching a real host.
- Roles/playbooks take an inventory as input; never inline environment
  branching logic where a scoped inventory would do.

## Inventory and environment separation

- One inventory tree per environment (dev/stage/prod); no shared inventory
  file with environment picked by a variable at runtime.
- Credentials, state, and secrets are isolated per environment — a dev
  credential must never have access to prod resources.

## State

- State is remote (S3/GCS/Terraform Cloud/etc.) with locking enabled.
- State files are never committed to git, ever — including `.tfstate`,
  `.tfstate.backup`, and `terraform.tfvars` if it contains secrets.

## Secrets

- Secrets live in an external secret manager/vault, referenced by
  reference/ID — never written into `.tfvars`, `group_vars`, or any file
  committed to git.

## Rollback and disaster recovery

- Every risky infra change needs a documented revert path: previous
  Terraform state/plan to reapply, or the Ansible playbook run that restores
  prior config.
- State itself needs a backup/versioning story (state backend versioning or
  periodic snapshot) independent of the infra it describes.

## Claude and destructive actions

- Claude must never run `apply`, `destroy`, or an in-place migrate/deploy
  command against real infrastructure without explicit human approval for
  that specific change, and must always prefer `plan`/dry-run first. This is
  enforced by `.claude/rules/devops/infra-rules.md` and
  `.claude/rules/security.md`, already installed in this project — the rules
  here are additive detail, not a replacement for those.
- Claude proposes plans/diffs; a human runs the apply/destroy.

## CI/CD expectations

Use dedicated CI/CD templates from approved UTE repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
to run `plan`/`apply`/`--check` stages — never hand-roll pipeline logic that
duplicates them. Deployment execution itself belongs to
`ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`, not to inline
pipeline steps or an AI-agent process. Document the selected delivery model
in `docs/ci-cd.md` — see `core/standards/ci-cd.md`.

These are recommendations and review checks for this archetype, not
mandates — an existing project is not required to restructure to match them.
