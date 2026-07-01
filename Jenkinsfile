import groovy.json.JsonSlurperClassic

boolean isReleaseTag() {
  return (env.TAG_NAME ?: '') ==~ /^v[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?$/
}

void requireEnvironment(List<String> names) {
  def missing = names.findAll { !(env[it] ?: '').trim() }
  if (missing) {
    error("Missing required Jenkins environment variable(s): ${missing.join(', ')}")
  }
}

void checkoutPrivateRepository(String directory, String repository, String ref, String credentialsId) {
  dir(directory) {
    deleteDir()
    checkout([
      $class: 'GitSCM',
      branches: [[name: ref]],
      doGenerateSubmoduleConfigurations: false,
      extensions: [[
        $class: 'CloneOption',
        shallow: true,
        depth: 1,
        noTags: false,
        honorRefspec: false,
      ]],
      userRemoteConfigs: [[
        url: "https://github.com/${repository}.git",
        credentialsId: credentialsId,
      ]],
    ])
  }
}

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
  }

  environment {
    IMAGE_REGISTRY = 'ghcr.io'
    IMAGE_REPOSITORY = 'under-tree-e/ute-demo-nodejs'
    UTE_DEPLOYMENT_ID = 'UTE-DPL-0001'
    TEST_PORT = '3101'
  }

  stages {
    stage('Checkout application') {
      steps {
        checkout scm
        script {
          env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short=12 HEAD', returnStdout: true).trim()
          env.LOCAL_IMAGE = "${env.IMAGE_REGISTRY}/${env.IMAGE_REPOSITORY}:ci-${env.GIT_COMMIT_SHORT}"
        }
      }
    }

    stage('Install exact dependencies') {
      steps {
        sh 'cd src && npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'cd src && npm run lint'
      }
    }

    stage('HTTP integration tests') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          rm -f .ci-app.pid app-test.log
          (
            cd src
            PORT="$TEST_PORT" NODE_ENV=test npm start
          ) > app-test.log 2>&1 &
          echo $! > .ci-app.pid

          cleanup() {
            if [ -f .ci-app.pid ]; then
              kill "$(cat .ci-app.pid)" >/dev/null 2>&1 || true
              rm -f .ci-app.pid
            fi
          }
          trap cleanup EXIT

          for attempt in $(seq 1 30); do
            if curl --fail --silent --show-error "http://127.0.0.1:$TEST_PORT/healthz" >/dev/null; then
              break
            fi
            sleep 1
            if [ "$attempt" = 30 ]; then
              cat app-test.log >&2 || true
              exit 1
            fi
          done

          src/node_modules/.bin/httpyac src/tests/base-tests.http --all --output short --var "baseUrl=http://127.0.0.1:$TEST_PORT"
          src/node_modules/.bin/httpyac src/tests/health-tests.http --all --output short --var "baseUrl=http://127.0.0.1:$TEST_PORT"
        '''
      }
    }

    stage('Build immutable candidate image') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          docker build --pull --file Dockerfile --tag "$LOCAL_IMAGE" \
            --build-arg VERSION="${TAG_NAME:-ci-$GIT_COMMIT_SHORT}" \
            --build-arg VCS_REF="$GIT_COMMIT" \
            .
        '''
      }
    }

    stage('Container smoke test') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          name="ute-demo-nodejs-smoke-$BUILD_NUMBER"
          docker rm -f "$name" >/dev/null 2>&1 || true
          docker run --detach --rm --name "$name" \
            --env SESSION_SECRET=ci-smoke-session-secret \
            --env SESSION_COOKIE_SECURE=false \
            "$LOCAL_IMAGE" >/dev/null

          cleanup() {
            docker rm -f "$name" >/dev/null 2>&1 || true
          }
          trap cleanup EXIT

          for attempt in $(seq 1 30); do
            status="$(docker inspect --format '{{.State.Health.Status}}' "$name")"
            if [ "$status" = healthy ]; then
              exit 0
            fi
            if [ "$status" = unhealthy ]; then
              docker logs "$name" >&2 || true
              exit 1
            fi
            sleep 2
          done

          docker logs "$name" >&2 || true
          echo 'Timed out waiting for Docker healthcheck' >&2
          exit 1
        '''
      }
    }

    stage('SonarQube analysis') {
      when {
        expression { (env.UTE_SONARQUBE_ENABLED ?: 'false').toBoolean() }
      }
      steps {
        script {
          requireEnvironment(['UTE_SONARQUBE_SERVER'])
        }
        withSonarQubeEnv("${env.UTE_SONARQUBE_SERVER}") {
          sh 'sonar-scanner -Dproject.settings=sonar-project.properties'
        }
      }
    }

    stage('Supply-chain scan and SBOM') {
      when {
        expression { (env.UTE_SUPPLY_CHAIN_SCAN_ENABLED ?: 'false').toBoolean() }
      }
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          command -v trivy >/dev/null || { echo 'trivy is required when UTE_SUPPLY_CHAIN_SCAN_ENABLED=true' >&2; exit 2; }
          command -v syft >/dev/null || { echo 'syft is required when UTE_SUPPLY_CHAIN_SCAN_ENABLED=true' >&2; exit 2; }
          mkdir -p artifacts
          trivy image --exit-code 1 --severity HIGH,CRITICAL "$LOCAL_IMAGE"
          syft "$LOCAL_IMAGE" -o cyclonedx-json > artifacts/ute-demo-nodejs.sbom.cdx.json
        '''
      }
    }

    stage('Validate release integration configuration') {
      when {
        expression { isReleaseTag() }
      }
      steps {
        script {
          requireEnvironment([
            'UTE_GHCR_PUBLISH_CREDENTIALS_ID',
            'UTE_INVENTORY_REPOSITORY',
            'UTE_INVENTORY_REF',
            'UTE_INVENTORY_GIT_CREDENTIALS_ID',
            'UTE_PLATFORM_API_GIT_CREDENTIALS_ID',
            'UTE_SEMAPHORE_API_TOKEN_CREDENTIALS_ID',
            'SEMAPHORE_URL',
            'SEMAPHORE_PROJECT_ID',
            'SEMAPHORE_TEMPLATE_ID',
          ])
        }
      }
    }

    stage('Publish release image') {
      when {
        expression { isReleaseTag() }
      }
      steps {
        script {
          env.RELEASE_IMAGE = "${env.IMAGE_REGISTRY}/${env.IMAGE_REPOSITORY}:${env.TAG_NAME}"
        }
        withCredentials([
          usernamePassword(
            credentialsId: env.UTE_GHCR_PUBLISH_CREDENTIALS_ID,
            usernameVariable: 'GHCR_USERNAME',
            passwordVariable: 'GHCR_TOKEN',
          ),
        ]) {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            echo "$GHCR_TOKEN" | docker login "$IMAGE_REGISTRY" --username "$GHCR_USERNAME" --password-stdin
            if docker manifest inspect "$RELEASE_IMAGE" >/dev/null 2>&1; then
              echo "Refusing to overwrite existing release image tag: $RELEASE_IMAGE" >&2
              exit 1
            fi
            docker tag "$LOCAL_IMAGE" "$RELEASE_IMAGE"
            docker push "$RELEASE_IMAGE"
            docker pull "$RELEASE_IMAGE"
            IMAGE_REF="$(docker image inspect --format '{{index .RepoDigests 0}}' "$RELEASE_IMAGE")"
            case "$IMAGE_REF" in
              *@sha256:*) ;;
              *) echo "Registry did not return an immutable image digest" >&2; exit 1 ;;
            esac
            printf '%s\n' "$IMAGE_REF" > image-ref.txt
            docker logout "$IMAGE_REGISTRY" || true
          '''
        }
        script {
          env.IMAGE_REF = readFile('image-ref.txt').trim()
        }
      }
    }

    stage('Resolve deployment request from inventory') {
      when {
        expression { isReleaseTag() }
      }
      steps {
        script {
          checkoutPrivateRepository(
            'ute-inventory',
            env.UTE_INVENTORY_REPOSITORY,
            env.UTE_INVENTORY_REF,
            env.UTE_INVENTORY_GIT_CREDENTIALS_ID,
          )
          sh 'python3 -m pip install -r ute-inventory/requirements.txt'
          def rawContract = sh(
            script: 'cd ute-inventory && python3 scripts/resolve_contract_lock.py --format json',
            returnStdout: true,
          ).trim()
          def contract = new JsonSlurperClassic().parseText(rawContract)
          env.UTE_PLATFORM_CONTRACT_REPOSITORY = contract.repository as String
          env.UTE_PLATFORM_CONTRACT_REF = contract.ref as String
          checkoutPrivateRepository(
            'ute-platform-api',
            env.UTE_PLATFORM_CONTRACT_REPOSITORY,
            env.UTE_PLATFORM_CONTRACT_REF,
            env.UTE_PLATFORM_API_GIT_CREDENTIALS_ID,
          )
        }
        withEnv(["UTE_PLATFORM_API_PATH=${env.WORKSPACE}/ute-platform-api"]) {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            python3 ute-inventory/scripts/validate_against_contract.py
            python3 ute-inventory/scripts/validate_inventory.py
            python3 ute-inventory/scripts/export_deployment_request.py \
              --deployment-id "$UTE_DEPLOYMENT_ID" \
              --artifact-version "$TAG_NAME" \
              --source-ref "$TAG_NAME" \
              --image-ref "$IMAGE_REF" \
              --requested-by "jenkins:$JOB_NAME#$BUILD_NUMBER" \
              --change-ref "refs/tags/$TAG_NAME" \
              --output deployment-request.json
          '''
        }
      }
    }

    stage('Delegate deployment to Semaphore') {
      when {
        expression { isReleaseTag() }
      }
      steps {
        withCredentials([
          string(
            credentialsId: env.UTE_SEMAPHORE_API_TOKEN_CREDENTIALS_ID,
            variable: 'SEMAPHORE_API_TOKEN',
          ),
        ]) {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            python3 scripts/trigger_semaphore_deployment.py \
              --request deployment-request.json \
              --timeout-seconds "${UTE_SEMAPHORE_DEPLOY_TIMEOUT_SECONDS:-900}"
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker rm -f "ute-demo-nodejs-smoke-$BUILD_NUMBER" >/dev/null 2>&1 || true'
      archiveArtifacts allowEmptyArchive: true, artifacts: 'app-test.log,image-ref.txt,deployment-request.json,artifacts/**'
    }
  }
}
