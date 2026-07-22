# CI/CD contract

The `Jenkinsfile` itself is a thin call into `ute-jenkins-library`'s
`uteNodeContainerRelease` shared step (`@Library('ute-jenkins-library') _`)
— stage logic lives there, not in this repo.

The shared step's first stage loads all non-secret config below from a
**Jenkins Config File Provider Properties file** (`sharedConfigFileId:
'ute-demo-nodejs-cicd-config'` in the `Jenkinsfile`, defined under the
`ute` Folder in Jenkins itself — Manage Jenkins has no
Environment Injector folder/job "Environment Variables" section usable
for Multibranch Pipeline items, so this is the mechanism instead) and
sets each key as an env var before any other stage runs. Every stage
downstream reads them the exact same way a folder-level env var would
have been read.

The Jenkins multibranch pipeline has two boundaries:

- every branch and pull request: exact dependency install, lint, HTTP tests,
  OCI build and a container healthcheck;
- an annotated semantic version tag (`vX.Y.Z`): a non-overwritable GHCR tag is
  published, converted to an immutable digest, resolved through `ute-inventory`
  and handed to Semaphore as a non-secret deployment request.

Jenkins never SSHes to a deployment target. Semaphore runs the Ansible playbook
and reports the final task result back to Jenkins.

## Config File contents (`ute-demo-nodejs-cicd-config`, Properties type)

Set these **non-secret environment variables** as `KEY=value` lines:

| Variable | Value |
|---|---|
| `UTE_INVENTORY_REPOSITORY` | `ute-homelab/ute-inventory` while the temporary organization remains in use |
| `UTE_INVENTORY_REF` | `main` |
| `SEMAPHORE_URL` | Semaphore base URL without a trailing slash |
| `SEMAPHORE_PROJECT_ID` | numeric project ID for the automation project |
| `SEMAPHORE_TEMPLATE_ID` | numeric Ansible deployment task-template ID |
| `UTE_SECRET_SCAN_ENABLED` | `true` to run the containerized gitleaks secret-scan stage (blocking — fails the build on any real finding) |
| `UTE_SONARQUBE_ENABLED` | `true` — the SonarQube installation, credential, and webhook are configured (Quality Gate blocks the build) |
| `UTE_SONARQUBE_SERVER` | `SonarQube` — the Jenkins SonarQube installation name (`Manage Jenkins` → `System` → `SonarQube servers`) |
| `UTE_SUPPLY_CHAIN_SCAN_ENABLED` | `true` to run containerized Trivy (HIGH/CRITICAL fails the build) and Syft (CycloneDX SBOM artifact) — no agent binary install needed |
| `UTE_SEMAPHORE_DEPLOY_TIMEOUT_SECONDS` | optional; default `900` |

Set these **credential IDs**, never token values, in the same file:

| Variable | Credential type | Minimum access |
|---|---|---|
| `UTE_GHCR_PUBLISH_CREDENTIALS_ID` | Username/password | GHCR package write for `under-tree-e/ute-demo-nodejs` |
| `UTE_INVENTORY_GIT_CREDENTIALS_ID` | GitHub read credential | read `ute-homelab/ute-inventory` |
| `UTE_PLATFORM_API_GIT_CREDENTIALS_ID` | GitHub read credential | read `ute-homelab/ute-platform-api` |
| `UTE_SEMAPHORE_API_TOKEN_CREDENTIALS_ID` | Secret text | create/read only the required Semaphore deployment tasks |

The credentials themselves (the actual Jenkins Credentials store entries these
IDs point at) must be created separately in Jenkins Credentials — this Config
File only ever names IDs, never values.

SonarQube's credential is a system-level exception to that: it lives on the
`SonarQube` installation itself (`Manage Jenkins` → `System` → `SonarQube
servers` → credential), not as a Config-File-referenced ID, because
`withSonarQubeEnv()` reads it from the installation, not an env var. That
SonarQube server must also have a webhook configured back to this Jenkins
controller (`<jenkins-url>/sonarqube-webhook/`) — without it,
`waitForQualityGate()` blocks for its full timeout on every build before
failing closed.
