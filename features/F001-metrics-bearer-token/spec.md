# F001 — Optional metrics bearer token

Status: in-audit
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
- [MODIFY] `docs/ci-cd.md` — add the metrics request-test invocation to the local gates; the existing make targets are valid (`makefile` exists) and stay.
- [MODIFY] `src/views/info.ejs` — exclude environment variables whose names contain `TOKEN` from the public `/info` page; `/info` stays public.
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

None.

## Decisions

- Treat empty METRICS_TOKEN like unset, consistent with other optional environment configuration.
- Read configuration when registering metrics; changes require restart.
- Keep the PR draft and unmerged as explicitly requested.
- The owner accepted this plan (revision 56705f32-86c9-4627-b43e-1e8d4cd3ff35) before implementation.
- The 401 comes from a route guard on the main app, not the middleware's `authenticate` option, which answers 404 on failure.
- The guard decodes the header as latin1 to recover the raw bytes Node received and compares them with the UTF-8 bytes of `Bearer <METRICS_TOKEN>`.
- The `makefile` exists, so the make gates in `docs/ci-cd.md` stay; only the metrics invocation is added.
- `README.md` and `deploy/env/runtime.env.example` are outside the approved file list and are not changed.
- The owner approved adding `src/views/info.ejs` to the scope (plan revision 235d364e-ac91-4c03-8cf1-ded8f34ec0af) after review round 1 found `/info` exposed `METRICS_TOKEN`. The fix extends the existing name filter; `process.env` is not modified.
- The protected and disabled request tags check `/info` for both the `METRICS_TOKEN` name and the configured value, so the disabled tag is run with `METRICS_TOKEN` set and `--var metricsToken`.
