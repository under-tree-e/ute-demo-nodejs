# Release Docker Compose manifest

`docker-compose.release.yml` is consumed only by the delegated Ansible release
role. It does not mount source code, expose a host port or install dependencies.

The role writes a local, uncommitted `deployment.env` with the immutable image
digest and non-secret routing values. It points `UTE_RUNTIME_ENV_FILE` to the
canonical `/opt/runtime/ute-demo-nodejs.env`, which the same role renders
from the deployment's non-secret `nonSecretEnv` values — this service
currently declares no secrets, so no Vault Agent is involved.

Manual use for troubleshooting only:

```bash
docker compose \
  --project-name ute-demo-nodejs \
  --env-file deployment.env \
  --file docker-compose.release.yml \
  config -q
```

Never replace the image digest with a mutable tag such as `latest`.
