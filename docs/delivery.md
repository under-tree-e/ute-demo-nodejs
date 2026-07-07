# Delivery contract

`ute-demo-nodejs` is the first reference workload for UTE delivery paths.

- Docker Compose: release image is deployed by `ute-ansible`. The server receives
  the canonical `/opt/runtime/ute-demo-nodejs.env`, rendered by the
  `ute_compose_release` role itself from the deployment's non-secret
  `nonSecretEnv` values — this service currently declares no secrets, so no
  Vault Agent or protected runtime file is required for its first deploy.
- Kubernetes: `ute-gitops` holds the selected immutable image digest and Argo CD
  reconciles it.
- Jenkins is the UTE default pipeline. GitHub Actions provides the client-compatible
  pipeline alternative and must use protected environments for deployment.

Do not deploy `latest`. Use an immutable release tag or `@sha256:` digest.

Promotion is separate from image publication: `promote-kubernetes-sandbox.yml` requires a protected GitHub Environment and opens a PR in `ute-gitops`; Argo CD reconciles only the merged state.
