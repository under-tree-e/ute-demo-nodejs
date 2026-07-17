# SOPS-encrypted runtime secrets

This directory holds this application's SOPS-encrypted runtime secret
file(s) — the no-Vault delivery path (`ute-workspace` F016 Mode B,
`secret_delivery_mode: sops-encrypted-file`) for hosts that don't run
Vault Agent.

## Why here, not `ute-gitops` or `ute-automation`

Decided during `ute-workspace` feature
[`F017-first-end-to-end-demo-deployment`](https://github.com/ute-homelab/ute-workspace/tree/main/features/F017-first-end-to-end-demo-deployment)
(Option B):

- **`ute-gitops`** is Kubernetes/Kustomize-only and, per its own
  `README.md`/`SECURITY.md`, holds no secrets of any kind — not even
  encrypted ones.
- **`ute-automation`** (and `ute-ansible`) are fetched at a moving `main`
  ref during a real deploy, not a pinned immutable SHA/tag — this
  application's own repo, by contrast, is always checked out at a pinned
  `--source-ref` (a real Git tag, e.g. `v0.1.0`) during deploy, matching
  this project's immutable-reviewed-manifest invariant. Putting secret
  material in an unpinned-ref repo would break that guarantee.

## How it's consumed

`ute-inventory`'s `UteDeployment.spec.externalRuntimeSecretRef` points at
a `UteSecretReference` (`provider.type: sops`, `provider.path` = the
logical path to the file in this directory, e.g.
`deploy/secrets/runtime.env.sops`). At deploy time,
`ute-ansible`'s `ute_compose_release` role decrypts it **on the Ansible
executor only** (never on the target host), merges it with this
deployment's `nonSecretEnv`, and writes the combined result to the
target's canonical `/opt/runtime/<service>.env`.

## Rotation is mandatory on any ownership handoff

**A SOPS-encrypted file is only as safe as who holds the matching `age`
private key.** If this repository (including this directory) is ever
handed off — to a client, a different contractor, or any new
owner — the ciphertext committed here must be treated as disposable, not
carried forward as-is:

1. The new owner generates their **own** `age` keypair.
2. Ideally, rotate the actual secret value too (don't just re-encrypt the
   same value under a new key).
3. Re-encrypt into a file at this same path/convention with the new
   public key.
4. **Never** hand over the private key used to encrypt the existing
   file(s) here — that key must stay with whoever encrypted them, and
   the old ciphertext becomes unreadable (by design) the moment
   ownership changes hands without it.

Handing over this repo's `deploy/secrets/` convention (the directory,
the naming, how the compose manifest references it) is the whole point —
it's the *logic* a new team/contractor should reuse. Handing over the
*existing encrypted value itself* as something they can actually decrypt
is a separate action that should not happen by default.

## Encrypting a new value

```bash
# One-time: generate a keypair (never done by an AI agent — see this
# project's own security rule against generating secrets).
age-keygen -o keys.txt

# Encrypt (only the *public* key is needed for this step):
sops --encrypt --age <age1...public-key> \
  --input-type dotenv --output-type dotenv \
  --output deploy/secrets/runtime.env.sops \
  /path/to/a/local/plaintext/file.env
# Never commit the plaintext input file.
```
