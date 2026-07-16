# Validation — DevOps / Infra

## Before proposing a change

- `terraform validate` and `terraform plan` (or `terraform plan -out` for a
  reviewable artifact) — no apply without a reviewed plan first.
- `ansible-playbook --check --diff` against the target inventory.
- Lint: `tflint`/`checkov` (or equivalent) for Terraform, `ansible-lint` for
  playbooks/roles.

## CI/CD expectations

- PRs trigger validate/lint/plan; the plan output is visible in the PR, not
  just run silently.
- Apply/deploy jobs run only on merge to a protected branch, and only after
  a manual approval gate — no auto-apply on every push.
- Prod applies are a separate, explicitly gated job from dev/stage applies.

## Common risks

- State drift: manual changes made outside Terraform/Ansible that the next
  plan doesn't expect — call this out if a plan looks bigger than the diff
  suggests.
- Unlocked/concurrent state writes corrupting state — confirm locking is
  enabled, don't work around a lock by force-unlocking without checking why.
- Secrets leaking through plan output, logs, or committed `.tfvars`.
- Environment bleed: an inventory or tfvars file accidentally pointing at
  the wrong environment's resources.
- Unpinned module/provider/role versions causing an unrelated apply to pull
  in unreviewed changes.

## Plan-before-apply is not optional

Treat "run plan/check-mode and show the diff" as a required step before any
apply/deploy recommendation — for prod changes, pair it with
`/rollback-plan`.
