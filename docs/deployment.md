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
- a `deploy` account used only by Semaphore/Ansible;
- Vault Agent rendering `/opt/ute/runtime/ute-demo-nodejs/runtime.env`;
- the runtime file containing a valid `SESSION_SECRET` and readable by the
  deployment account.
