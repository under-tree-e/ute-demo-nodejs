# Delivery contract

`ute-demo-nodejs` is the first reference workload for UTE delivery paths.

- Docker Compose: release image is deployed by `ute-ansible`; the server receives
  a Vault Agent-rendered `runtime.env` or a protected runtime file.
- Kubernetes: `ute-gitops` holds the selected immutable image digest and Argo CD
  reconciles it.
- Jenkins is the UTE default pipeline. GitHub Actions provides the client-compatible
  pipeline alternative and must use protected environments for deployment.

Do not deploy `latest`. Use an immutable release tag or `@sha256:` digest.

Promotion is separate from image publication: `promote-kubernetes-sandbox.yml` requires a protected GitHub Environment and opens a PR in `ute-gitops`; Argo CD reconciles only the merged state.
