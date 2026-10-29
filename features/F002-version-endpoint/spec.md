Status: in-audit
Branch: feat/UND-8-version-endpoint
Repositories: ute-demo-nodejs

# F002 — Version endpoint

## What and why

Expose the running application version as JSON at `GET /api/version` so
clients and operators can read it without parsing HTML or the liveness
probe. The value is the `version` field of `src/package.json`.

## Scope

- New route `GET /api/version` in `src/routes/api.mjs`.
- One request with assertions in `src/tests/base-tests.http`.
- One line in `README.md` describing the endpoint.

Out of scope: authentication, dependencies, deployment, infrastructure,
changes to `/healthz` or the package version itself.

## Acceptance criteria

1. `GET /api/version` returns HTTP 200, `Content-Type: application/json`
   and the body `{"version": "<src/package.json version>"}`.
   Verify: start the app (`cd src && NODE_ENV=test node server.mjs`), run
   `curl -si http://localhost:3000/api/version` (or the httpyac request
   below); expect `200`, `application/json` and the version equal to
   `node -p "require('./src/package.json').version"`.
2. The version is read from `src/package.json`; no version literal is
   added to source code.
   Verify: `git diff origin/main -- src/routes` shows no version string
   literal; the route reads `package.json`.
3. `src/tests/base-tests.http` contains a request for `/api/version`.
   Verify: `cd src && npx httpyac tests/base-tests.http --all --output short`
   against a running app; all requests pass.
4. `README.md` has one line describing the endpoint.
   Verify: `grep -n "/api/version" README.md` prints one line.
5. Formatting check passes.
   Verify: `cd src && npm run lint`; exit code 0.

## Deferred

- None.

## Risks

- The endpoint discloses the application version without authentication.
  This is the requested behavior; `/healthz` already returns the same
  value unauthenticated.

## Open questions

- None.

## Decisions

- The route lives in `src/routes/api.mjs` with the other `/api/*` JSON
  routes and reads `../package.json` once at module load, the same way
  `server.mjs` loads it.
