# Architecture

## Overview

A single Express process serves server-rendered EJS pages, a small JSON
API, and a Prometheus metrics endpoint. All optional integrations
(Redis, MongoDB, Entra ID/MSAL, OpenWeather, Application Insights) are
enabled or disabled purely by which environment variables are set; the
app starts and runs with none of them configured. See
`docs/product-overview.md` for what each page/feature does.

## Components

- `src/server.mjs` — process entry point: Express app setup, session
  middleware, health/readiness endpoints, error handling.
- `src/routes/pages.mjs` — server-rendered HTML pages (home, info,
  monitor, weather, tools).
- `src/routes/api.mjs` — JSON endpoints: weather proxy, container/host
  monitoring data.
- `src/routes/auth.mjs` — Entra ID (MSAL) sign-in, callback, and account
  page; only mounted when `ENTRA_APP_ID` is set.
- `src/routes/metrics.mjs` — mounts the Prometheus `/metrics` endpoint;
  skipped when `DISABLE_METRICS=true`.
- `src/todo/routes.mjs` — Todo list CRUD API and page, backed by
  MongoDB; only mounted when `TODO_MONGO_CONNSTR` is set.
- `src/graph.mjs` — thin Microsoft Graph API client used by the account
  page.
- `src/views/*.ejs` — page templates.

## Data flow

1. A request reaches the Express app; session middleware attaches the
   signed session cookie (backed by Redis when configured, otherwise
   in-memory).
2. Page and API routers handle the request; optional routers (auth, todo)
   are only registered when their required environment variable is set.
3. `pages.mjs`/`api.mjs` may call the OpenWeather HTTP API; `auth.mjs`
   calls Microsoft identity/Graph endpoints; `todo/routes.mjs` reads and
   writes a MongoDB collection.
4. When configured, request telemetry, exceptions, and a few custom
   events/metrics are sent to Azure Application Insights.
5. `/metrics` exposes default Node.js process metrics plus HTTP request
   duration/size histograms for Prometheus scraping.

## External integrations

- OpenWeather API — current weather lookup for the Weather page
  (`WEATHER_API_KEY`).
- Microsoft identity platform / Microsoft Graph — Entra ID sign-in and
  the account page (`ENTRA_APP_ID`).
- MongoDB — Todo app storage (`TODO_MONGO_CONNSTR`, `TODO_MONGO_DB`).
- Redis — session store (`REDIS_SESSION_HOST`).
- Azure Application Insights — telemetry
  (`APPLICATIONINSIGHTS_CONNECTION_STRING`).
- GHCR — container image registry for published releases.
- `inventory`, Semaphore, and Ansible — deployment delegation (see
  Deployment model).

## Environments

- Local: `docker-compose.yml`, mounts `src/` for live reload, plain HTTP,
  insecure cookies, no Traefik TLS.
- Sandbox: deployed via the Compose release path onto a real sandbox
  host behind Traefik, or via the Kubernetes GitOps promotion path into a
  sandbox cluster; the two paths are independent and use different
  manifests (`deploy/compose/`, `deploy/kubernetes/`).
- Production: not yet in use for this application.

## Security model

- Sessions use an `httpOnly`, `sameSite=lax` cookie; `secure` is enabled
  only when `SESSION_COOKIE_SECURE=true` (set in production-like
  environments). `trust proxy` is enabled only when `TRUST_PROXY=true`.
- `SESSION_SECRET` must be injected via environment for a production
  runtime; the process refuses to start without one outside development.
- Runtime secrets are delivered as a SOPS-encrypted file
  (`deploy/secrets/runtime.env.sops`), decrypted only on the Ansible
  executor and merged with non-secret values into the target host's
  `/opt/runtime/<service>.env`; the plaintext is never written to the
  target host's git checkout or to this repository.
- The container image drops the `npm`/`npx` binaries and npm's own
  bundled dependencies at build time; the running container never
  invokes `npm`.

## Deployment model

```text
Jenkins (build/test) → GHCR (immutable digest) → inventory request
→ Semaphore task → Ansible (compose_release) → Docker Compose → healthcheck
```

- Jenkins is the primary CI/CD path (`Jenkinsfile`, shared
  `nodeContainerRelease` pipeline step); GitHub Actions
  (`.github/workflows/ci.yml`, `release.yml`) is the compatible fallback
  path and must use protected environments for any deployment action.
- Every branch and pull request: dependency install, lint, HTTP
  integration tests, image build, container healthcheck.
- An annotated `vX.Y.Z` tag: publishes an immutable GHCR digest, resolves
  the deployment through `inventory`, and hands it to Semaphore as a
  non-secret deployment request; Semaphore runs the Ansible playbook
  against the target host and reports the result back to Jenkins.
  Jenkins never connects to a deployment target directly.
- A separate, manually dispatched GitHub Actions workflow
  (`promote-kubernetes-sandbox.yml`) opens a PR against the `gitops`
  repository's Kustomize overlay for an image digest; Argo CD reconciles
  only the merged state.
- Only an immutable release tag or `@sha256:` digest is ever deployed,
  never `latest`.
- Sandbox host provisioning, inventory, and destroy-safety rules are
  defined once in the platform repository and apply here unchanged (see
  `platform` `docs/platform/host-lifecycle/rules.md`).

## Observability

- `/healthz` — liveness only; always returns 200 once the process is up.
- `/readyz` — readiness; also reflects whether the configured session
  store (Redis) has connected.
- `/metrics` — Prometheus endpoint (default Node.js process metrics plus
  HTTP request duration/size histograms); disabled by `DISABLE_METRICS=true`.
- The container image defines a Docker `HEALTHCHECK` against `/healthz`.
- Azure Application Insights, when configured, receives request
  telemetry, exceptions, and a small number of custom events/metrics
  (login events, weather temperature readings).

## Known limitations

- The k6 load test (`tests/load/smoke.js`) defines no thresholds; it is
  advisory only and never fails a build.
- Weather, Todo, and Entra ID sign-in are demo-grade integrations without
  their own test coverage beyond the base HTTP integration tests.
- Sessions are held in-memory (lost on restart) unless Redis is
  configured.

## Constraints

- Deployment uses only an immutable release tag or digest, never a
  moving branch or `latest` (`docs/delivery.md`).
- Secrets are decrypted only on the Ansible executor, never written
  in plaintext to the target host or to this repository
  (`deploy/secrets/README.md`).
- The Compose and Kubernetes GitOps deployment paths are independent;
  promoting an image to one does not affect the other.

## Exceptions

None currently recorded for this repository.
