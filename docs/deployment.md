# Sandbox deployment

A deployment starts only from a release tag and follows this chain:

```text
Jenkins → immutable GHCR digest → ute-inventory request
→ Semaphore task → Ansible → Docker Compose → healthcheck
```

The Ansible role receives a request containing the source tag, OCI digest,
compose manifest location, target host alias and non-secret runtime topology.
It checks out only the release tag to obtain `deploy/compose`, writes a local
`deployment.env`, pulls the image with a temporary Docker credential directory
and waits for the image healthcheck.

The server must already have:

- Docker Engine with Docker Compose v2;
- the external Traefik network declared by inventory;
- a `deploy` account used only by Semaphore/Ansible.

`ute-demo-nodejs` currently declares no secrets, so no Vault Agent, AppRole
or Vault policy is required for its first deploy: the `ute_compose_release`
Ansible role renders the deployment's `nonSecretEnv` values itself into the
canonical `/opt/runtime/ute-demo-nodejs.env` (mode `0600`). If a future
version of the service needs real secrets, Vault Agent would render them
into that same path separately, as its own follow-on step.
