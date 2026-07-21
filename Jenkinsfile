@Library('ute-jenkins-library') _

uteNodeContainerRelease(
  sharedConfigFileId: 'ute-demo-nodejs-cicd-config',
  imageName: 'under-tree-e/ute-demo-nodejs',
  registry: 'ghcr.io',
  testPort: '3101',
  deploymentId: 'UTE-DPL-0001',
  smokeTestEnv: [
    SESSION_SECRET: 'ci-smoke-session-secret',
    SESSION_COOKIE_SECURE: 'false',
  ],
)
