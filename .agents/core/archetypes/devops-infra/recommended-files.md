# Recommended Files — DevOps / Infra

Every UTE project is expected to have the base doc set described in
`core/sdlc/project-discovery.md` (`product-overview.md`, `architecture.md`,
`environments.md`, `ci-cd.md`) filled in, plus `docs/adr/` for architecture
decision records if this project uses them. Also add:

## Docs

- `docs/environments.md` — filled in with per-environment backend/state
  config, credential scope, and access model (base template already has the
  section headers; this archetype expects them actually filled in).
- `docs/ci-cd.md` — filled in with plan/apply job structure and the manual
  approval gate for prod.
- A disaster-recovery/rollback runbook (can live in `docs/ci-cd.md`'s
  Rollback section or a dedicated `docs/disaster-recovery.md`).

## Terraform

- `versions.tf` (or equivalent) pinning Terraform and provider versions.
- Backend config per environment (`backend.tf` or `-backend-config`) —
  config only, no credentials in the file.
- A README per non-trivial module.

## Ansible

- `ansible.cfg` at the repo root.
- A README per inventory environment noting scope and any manual
  prerequisites.

## Secrets and lint config

- A short note (in `docs/environments.md` or a dedicated doc) naming which
  secret manager/vault is in use — not the secrets themselves.
- `.tflint.hcl`/`checkov` config and `.ansible-lint` if the project enforces
  specific rules beyond defaults.

## Not required by this archetype

- No mandate on ticketing/runbook tooling choice — document whatever the
  team already uses, don't introduce a new one just to fill this checklist.
