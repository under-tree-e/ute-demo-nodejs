# Product overview

`ute-demo-nodejs` is a small Node.js/Express demo web application, forked
from an upstream cloud-native sample, used as the reference workload that
exercises this platform's CI/CD and deployment paths end-to-end.

## Purpose

- Provide a real, runnable application (not a "hello world") to validate
  the platform's Jenkins/GitHub Actions build pipeline, GHCR image
  publishing, Semaphore-delegated Ansible deployment, and the SOPS
  secrets-delivery convention.
- Demonstrate common cloud-native application patterns: liveness/readiness
  probes, Prometheus metrics, session storage, optional external
  dependencies (database, third-party API, OAuth login).

## Users

- Platform engineers validating and demonstrating the release and
  deployment pipeline.
- Anyone wanting a working example of a containerized Node.js service with
  health checks, metrics, and session handling.

## Main workflows

- Home, Info, Monitor, and Tools pages, always available.
- `/healthz` and `/readyz` for liveness/readiness checks; `/metrics` for
  Prometheus scraping.
- Optional Weather page: looks up weather for the browser's geolocation via
  the OpenWeather API when `WEATHER_API_KEY` is set.
- Optional Todo app: a small CRUD list backed by MongoDB when
  `TODO_MONGO_CONNSTR` is set.
- Optional sign-in and account page via Microsoft Entra ID (MSAL,
  PKCE flow) when `ENTRA_APP_ID` is set.
- Optional session persistence via Redis when `REDIS_SESSION_HOST` is set;
  otherwise sessions are in-memory and do not survive a restart.
- Optional telemetry to Azure Application Insights when
  `APPLICATIONINSIGHTS_CONNECTION_STRING` is set.

## Non-goals

- Not a production business application; it carries no real domain data or
  business logic.
- The Weather, Todo, and Entra ID sign-in features exist only to
  demonstrate integration patterns and are not maintained as product
  features in their own right.
- Not the primary place for platform-wide CI/CD, deployment, or secrets
  conventions — those are defined once in the platform repository and
  exercised here.

## Current status

- Builds and tests run in CI on every branch and pull request.
- An annotated release tag publishes an image to GHCR and triggers a
  Semaphore-delegated Ansible deployment to a sandbox host via Docker
  Compose.
- A separate, manually triggered workflow can promote an image digest into
  the Kubernetes GitOps repository for an Argo CD-managed sandbox
  deployment; this path is independent of the Compose release path.
- A sample Helm-based Kubernetes manifest (`deploy/kubernetes/`) and an
  Azure Container Apps Bicep template (`deploy/container-app.bicep`) are
  provided as illustrative, unmanaged alternatives.
