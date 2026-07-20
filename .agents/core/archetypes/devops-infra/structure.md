# Recommended Structure — DevOps / Infra

This is a recommendation for new repos or major reorganizations, not a
requirement. Do not blindly restructure an existing infra repo that already
works with a different layout — a state/inventory reshuffle is a risky
change in its own right, not a side effect of an unrelated task.

```text
terraform/
  modules/                # reusable modules, versioned, no environment logic
  environments/
    dev/                  # own backend config, own tfvars, own state
    stage/
    prod/
ansible/
  inventories/
    dev/
    stage/
    prod/                 # never merged with dev/stage inventory files
  playbooks/
  roles/
docs/
features/                 # feature folders (see feature-plan)
```

## Notes

- Each environment under `terraform/environments/` gets its own state and
  backend config — no shared state file across dev/stage/prod.
- `terraform/modules/` holds logic only; nothing environment-specific lives
  there (no hardcoded account IDs, no environment-specific defaults).
- Ansible inventories are environment-scoped directories, not a single
  inventory file with group-based environment branching — that pattern is
  how prod/stage/dev get mixed by accident.
- A repo that already separates environments by branch, workspace, or a
  different directory scheme instead of `environments/<env>/` doesn't need
  to change — the goal (isolated state and credentials per environment) is
  what matters, not this exact tree.
