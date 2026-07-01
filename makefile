IMAGE_REG ?= ghcr.io
IMAGE_REPO ?= under-tree-e/ute-demo-nodejs
IMAGE_TAG ?= dev
IMAGE := $(IMAGE_REG)/$(IMAGE_REPO):$(IMAGE_TAG)
SRC_DIR := src
TEST_BASE_URL ?= http://127.0.0.1:3000

.PHONY: help install lint test test-health image image-smoke push run clean
.DEFAULT_GOAL := help

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install exact Node dependencies from package-lock.json
	cd $(SRC_DIR) && npm ci

lint: install ## Check JavaScript formatting
	cd $(SRC_DIR) && npm run lint

test: install ## Run baseline HTTP integration tests against a running app
	$(SRC_DIR)/node_modules/.bin/httpyac $(SRC_DIR)/tests/base-tests.http --all --output short --var baseUrl=$(TEST_BASE_URL)

test-health: install ## Verify liveness and readiness endpoints against a running app
	$(SRC_DIR)/node_modules/.bin/httpyac $(SRC_DIR)/tests/health-tests.http --all --output short --var baseUrl=$(TEST_BASE_URL)

image: ## Build a local OCI image (override IMAGE_TAG or IMAGE)
	docker build --pull --file Dockerfile --tag $(IMAGE) \
		--build-arg VERSION=$(IMAGE_TAG) \
		--build-arg VCS_REF=$$(git rev-parse --short HEAD) .

image-smoke: ## Start the local image and wait for its Docker healthcheck
	@name=ute-demo-nodejs-smoke-$$RANDOM; \
	docker run --detach --rm --name $$name --publish 127.0.0.1::3000 $(IMAGE) >/dev/null; \
	trap 'docker rm -f $$name >/dev/null 2>&1 || true' EXIT; \
	for attempt in $$(seq 1 30); do \
		status=$$(docker inspect --format '{{.State.Health.Status}}' $$name); \
		if [ "$$status" = healthy ]; then exit 0; fi; \
		if [ "$$status" = unhealthy ]; then docker logs $$name; exit 1; fi; \
		sleep 2; \
	done; \
	docker logs $$name; \
	echo 'Timed out waiting for container healthcheck' >&2; \
	exit 1

push: ## Push a previously built image
	docker push $(IMAGE)

run: install ## Start the app locally with the development environment
	cd $(SRC_DIR) && npm run watch

clean: ## Remove local dependency and CI output directories
	rm -rf $(SRC_DIR)/node_modules artifacts reports coverage *.log *.pid *.xml deployment-request.json
