# CI/CD contract

The `Jenkinsfile` itself is a thin call into `ute-jenkins-library`'s
`uteNodeContainerRelease` shared step (`@Library('ute-jenkins-library') _`)
— stage logic lives there, not in this repo. Every non-secret config value
below (inventory repo/ref, Semaphore URL/project/template ID, credential
IDs, SonarQube/supply-chain toggles) is passed as an explicit argument to
`uteNodeContainerRelease(...)` directly in the `Jenkinsfile`, not a
folder/job-level environment variable — this controller has no
Environment Injector plugin installed, so that UI section doesn't exist
here. The shared step still accepts the equivalent `UTE_*`/`SEMAPHORE_*`
env var as a fallback if a `cfg` key is left unset, for a future install
that does wire up folder-level vars.

The Jenkins multibranch pipeline has two boundaries:

- every branch and pull request: exact dependency install, lint, HTTP tests,
  OCI build and a container healthcheck;
- an annotated semantic version tag (`vX.Y.Z`): a non-overwritable GHCR tag is
  published, converted to an immutable digest, resolved through `ute-inventory`
  and handed to Semaphore as a non-secret deployment request.

Jenkins never SSHes to a deployment target. Semaphore runs the Ansible playbook
and reports the final task result back to Jenkins.

## Configuration, set directly in `Jenkinsfile`

Non-secret values (all literal — none of these are token/password material):

| `uteNodeContainerRelease(...)` key | Value |
|---|---|
| `inventoryRepository` | `ute-homelab/ute-inventory` |
| `inventoryRef` | `main` |
| `semaphoreUrl` | Semaphore base URL without a trailing slash |
| `semaphoreProjectId` | numeric project ID for the automation project |
| `semaphoreTemplateId` | numeric Ansible deployment task-template ID |
| `sonarqubeEnabled` | `true` only after scanner/tool configuration exists |
| `sonarqubeServer` | Jenkins SonarQube installation name when enabled |
| `supplyChainScanEnabled` | `true` only when the agent has `trivy` and `syft` |
| `semaphoreDeployTimeoutSeconds` | optional; default `900` |

Credential **IDs** only, never token values — the credentials themselves
must already exist in the Jenkins Credentials store (created manually on
a controller with no Vault/JCasC wiring, or sourced from Vault on one
that has it):

| `uteNodeContainerRelease(...)` key | Credential type | Minimum access |
|---|---|---|
| `registryCredentialsId` | Username/password | GHCR package write for `under-tree-e/ute-demo-nodejs` |
| `inventoryGitCredentialsId` | GitHub read credential | read `ute-homelab/ute-inventory` |
| `platformApiGitCredentialsId` | GitHub read credential | read `ute-homelab/ute-platform-api` |
| `semaphoreApiTokenCredentialsId` | Secret text | create/read only the required Semaphore deployment tasks |
