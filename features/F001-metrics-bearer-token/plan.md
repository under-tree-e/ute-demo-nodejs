# F001 — Plan

## Applicable standards

- `.agents/core/standards/security.md` — token handling and authorization.
- `.agents/core/standards/configuration.md` — optional environment variable.
- `.agents/core/standards/testing.md` — positive, negative and regression requests.
- `.agents/core/standards/documentation.md` — configuration and validation instructions.
- `.agents/core/standards/git/branching.md`, `commits.md`, `pull-requests.md` — one branch and draft PR, no merge.

## Checklist

- [x] Inspect metrics registration, package scripts, request tests and project documentation.
- [x] Create dedicated branch from current origin/main; confirm no tracked feature folders require cleanup and no historical feature numbers exist.
- [ ] Push the first planning commit and open the one draft PR when GitHub API access is available.
- [ ] Obtain review of this spec and plan before implementation.
- [ ] Add HTTP requests for both modes and malformed/wrong credentials; run against the original server to confirm protected-mode assertions fail.
- [ ] Inspect installed Prometheus middleware path handling; add the route guard with constant-time comparison and safe handling of different byte lengths.
- [ ] Run metrics requests against unset, empty, configured, and disabled configurations; include a non-ASCII token check and unaffected routes.
- [ ] Update .env.example, request-test instructions, architecture security model and actual local validation gates.
- [ ] Run baseline HTTP tests and formatting check from src using the package scripts.
- [ ] Apply change-audit and docs-sync, record audit.md, and update this draft PR with verification results and remaining review steps.

## Gates

`docs/ci-cd.md` currently lists make targets, but the repository has no Makefile. Verified package scripts in `src/package.json` define:

- `cd src && npm run lint` — Prettier check.
- `cd src && npm test` — httpyac base requests; requires a running app on the test base URL.
- `cd src && npm start` — app startup; optional integrations must be unset for baseline tests.

During implementation, document the installed httpyac CLI invocation for the new metrics request file and execute every acceptance Verify line. No deployment commands.

## Docs impact

- `.env.example` — optional METRICS_TOKEN; empty disables authentication; startup configuration.
- `src/tests/readme.md` — run public and protected configurations using a disposable test-only value and supplied URLs.
- `docs/architecture.md` — /metrics authorization and constant-time comparison.
- `docs/ci-cd.md` — replace unavailable make gates with existing package scripts and document metrics test invocation.

## Next step

Review the spec and plan. Implementation waits for explicit plan acceptance; GitHub draft creation additionally requires working GitHub API access.
