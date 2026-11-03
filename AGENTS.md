# ute-demo-nodejs

Node.js Express demo web app (EJS views, optional MongoDB todo app, Redis
sessions, Microsoft Entra ID login, App Insights and Prometheus metrics). It is
the reference implementation of the delegated Docker Compose release path.

## Stack and layout

- Node.js 20 (`engines: >=20`), ES modules; application code in `src/`
  (`server.mjs`, `routes/`, `views/`, `todo/`, `public/`).
- HTTP integration tests are httpYac `.http` files in `src/tests/`; the k6 load
  test is `tests/load/smoke.js`.
- Container: `Dockerfile`; local stack `docker-compose.yml`; release stack and
  Kubernetes/Azure assets in `deploy/`.
- Configuration is read from environment variables; `.env.example` lists them.

## Commands

- `make install` — `npm ci` in `src/`.
- `make lint` — Prettier check (`npm run lint` in `src/`).
- `make run` — start the app with nodemon on port 3000 (`PORT` overrides).
- `make test` / `make test-health` — httpYac tests against a running app
  (`TEST_BASE_URL`, default `http://127.0.0.1:3000`).
- `make image` / `make image-smoke` — build the OCI image and wait for its
  Docker healthcheck.

## Gates

- GitHub Actions `CI` (`.github/workflows/ci.yml`) calls
  `ute-workspace/ci-templates` `node-ci.yml@v1` with Node 20 in `src/`.
- Jenkins (`Jenkinsfile`) calls `jenkins-library` `nodeContainerRelease`:
  install, lint, HTTP tests, image build and healthcheck on every branch and
  pull request; gitleaks, SonarQube and Trivy/Syft when enabled in the Config
  File. See `docs/ci-cd.md`.

## Project rules

- Stage logic belongs in `jenkins-library`; keep the `Jenkinsfile` a thin call.
- Releases are annotated `vX.Y.Z` tags; deployment runs through Semaphore with
  an immutable GHCR digest (`docs/delivery.md`, `docs/deployment.md`,
  `docs/rollback.md`). Jenkins never connects to a deployment target.
- The Jenkins Config File names credential IDs only, never secret values.
- Runtime secrets for releases live SOPS-encrypted in `deploy/secrets/`;
  `SESSION_SECRET` is required when `NODE_ENV=production`.
- Known gitleaks findings are recorded in `.gitleaks-baseline.json`.
- `CHANGELOG.md` is for releases only.
- `.claude/settings.json` denies reading or editing env files, secrets and keys
  and destructive commands; keep it.
