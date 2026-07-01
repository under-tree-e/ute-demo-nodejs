# CI/CD contract

The Jenkins multibranch pipeline has two boundaries:

- every branch and pull request: exact dependency install, lint, HTTP tests,
  OCI build and a container healthcheck;
- an annotated semantic version tag (`vX.Y.Z`): a non-overwritable GHCR tag is
  published, converted to an immutable digest, resolved through `ute-inventory`
  and handed to Semaphore as a non-secret deployment request.

Jenkins never SSHes to a deployment target. Semaphore runs the Ansible playbook
and reports the final task result back to Jenkins.

## Jenkins folder/job configuration

Set these **non-secret environment variables** at the folder or job level:

| Variable | Value |
|---|---|
| `UTE_INVENTORY_REPOSITORY` | `ute-homelab/ute-inventory` while the temporary organization remains in use |
| `UTE_INVENTORY_REF` | `main` |
| `SEMAPHORE_URL` | Semaphore base URL without a trailing slash |
| `SEMAPHORE_PROJECT_ID` | numeric project ID for the UTE automation project |
| `SEMAPHORE_TEMPLATE_ID` | numeric Ansible deployment task-template ID |
| `UTE_SONARQUBE_ENABLED` | `true` only after scanner/tool configuration exists |
| `UTE_SONARQUBE_SERVER` | Jenkins SonarQube installation name when enabled |
| `UTE_SUPPLY_CHAIN_SCAN_ENABLED` | `true` only when the agent has `trivy` and `syft` |
| `UTE_SEMAPHORE_DEPLOY_TIMEOUT_SECONDS` | optional; default `900` |

Set these **credential IDs**, never token values, at the same scope:

| Variable | Credential type | Minimum access |
|---|---|---|
| `UTE_GHCR_PUBLISH_CREDENTIALS_ID` | Username/password | GHCR package write for `under-tree-e/ute-demo-nodejs` |
| `UTE_INVENTORY_GIT_CREDENTIALS_ID` | GitHub read credential | read `ute-homelab/ute-inventory` |
| `UTE_PLATFORM_API_GIT_CREDENTIALS_ID` | GitHub read credential | read `ute-homelab/ute-platform-api` |
| `UTE_SEMAPHORE_API_TOKEN_CREDENTIALS_ID` | Secret text | create/read only the required Semaphore deployment tasks |

The credentials themselves must originate in Vault and be injected into Jenkins
Credentials under the corresponding access policy.
