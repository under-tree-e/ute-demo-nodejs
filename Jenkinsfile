@Library('ute-jenkins-library') _

uteNodeContainerRelease(
  imageName: 'under-tree-e/ute-demo-nodejs',
  registry: 'ghcr.io',
  testPort: '3101',
  deploymentId: 'UTE-DPL-0001',
  smokeTestEnv: [
    SESSION_SECRET: 'ci-smoke-session-secret',
    SESSION_COOKIE_SECURE: 'false',
  ],
  registryCredentialsId: 'ghcr-under-tree-e-publish',
  inventoryRepository: 'ute-homelab/ute-inventory',
  inventoryRef: 'main',
  inventoryGitCredentialsId: 'github-ute-read',
  platformApiGitCredentialsId: 'github-ute-read',
  semaphoreApiTokenCredentialsId: 'semaphore-ute-main-dispatch',
  semaphoreUrl: 'http://192.168.50.89:5580',
  semaphoreProjectId: '1',
  semaphoreTemplateId: '3',
  sonarqubeEnabled: false,
  supplyChainScanEnabled: false,
)
