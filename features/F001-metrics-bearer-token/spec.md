# F001 — Optional metrics bearer token

Status: draft
Branch: feature/UND-7-metrics-bearer-token
Repositories: under-tree-e/ute-demo-nodejs

## Goal

Allow operators to require a bearer token for Prometheus scrapes while preserving public metrics when METRICS_TOKEN is unset. Deliver one draft PR for UND-7; do not merge.

## Scope

- [MODIFY] `src/routes/metrics.mjs` — register a route-local authorization guard before the existing Prometheus middleware; use Node's constant-time comparison.
- [MODIFY] `.env.example` — document optional METRICS_TOKEN without a real secret.
- [NEW] `src/tests/metrics-tests.http` — requests for a public server and a token-protected server, including rejection cases.
- [MODIFY] `src/tests/readme.md` — document starting and testing both configurations.
- [MODIFY] `docs/architecture.md` — describe the metrics authorization boundary.
- [MODIFY] `docs/ci-cd.md` — record executable local gates using the actual package scripts; its current make commands have no corresponding Makefile.
- [EXISTS] `src/server.mjs` — keep DISABLE_METRICS and all other routes unchanged.
- [EXISTS] `src/package.json` — reuse Node crypto, Express, httpyac, and Prettier; add no dependency.

## Acceptance criteria

- AC1: An unset or empty METRICS_TOKEN leaves metrics public, with existing Prometheus content.
  Verify: Start the app with METRICS_TOKEN unset, then empty; send GET /metrics without Authorization and with an arbitrary Authorization header → 200 with Prometheus metrics in both configurations.
- AC2: A configured token requires the exact Authorization value `Bearer <METRICS_TOKEN>`.
  Verify: Against a protected server, send missing, empty, malformed, wrong-scheme, incorrect same-length, shorter, and longer token headers → 401; send the correct token → 200 with Prometheus metrics. Include /metrics?probe=1.
- AC3: Secret comparison uses constant-time byte comparison without throwing for different token lengths or accepting Unicode byte mismatches.
  Verify: Inspect use of node:crypto timingSafeEqual with equal-sized buffers or digests; exercise mismatched lengths and non-ASCII configured tokens → 401 for incorrect credentials and 200 for the exact token.
- AC4: Authentication affects only metrics, and DISABLE_METRICS remains effective.
  Verify: With a token configured, GET /healthz, /readyz and / without Authorization → their existing successful responses. With DISABLE_METRICS=true, GET /metrics → 404.
- AC5: Documentation and request tests explain both modes without exposing secrets.
  Verify: Review `.env.example`, `src/tests/readme.md`, `docs/architecture.md`, and `docs/ci-cd.md`; run `npm test` and `npm run lint` from src against a running default server → pass, plus all metrics requests in both modes → expected statuses.
- AC6: Deliver exactly one draft PR, never merge.
  Verify: Inspect GitHub PR state → open and draft, targeting main, with plan, implementation and audit in the same PR.

## Deferred

- Token rotation without process restart; multiple accepted tokens; separate monitoring identity provider.

## Out of scope

- Deployment, secret provisioning, scraper configuration, CI pipeline ownership changes, other endpoint authentication.
- Unrelated discovery documentation expansion and existing documentation inconsistencies outside the local validation instructions.

## Risks

- Prometheus scrapes receive 401 after enabling the token unless the scraper sends the configured bearer header. Enable only after configuring the scraper.
- Express path variants must not bypass the guard; align matching with the installed Prometheus middleware during implementation.
- Rollback: unset or empty METRICS_TOKEN and restart to restore public metrics, or revert this PR. No data migration.

## Open questions

None. Plan review is required before implementation by AGENTS.md.

## Decisions

- Treat empty METRICS_TOKEN like unset, consistent with other optional environment configuration.
- Read configuration when registering metrics; changes require restart.
- Keep the PR draft and unmerged as explicitly requested.
