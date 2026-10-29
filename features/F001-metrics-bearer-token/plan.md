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
- [x] Push the first planning commit and open the one draft PR when GitHub API access is available.
- [x] Obtain review of this spec and plan before implementation.
- [x] Add HTTP requests for both modes and malformed/wrong credentials; run against the original server to confirm protected-mode assertions fail.
- [x] Inspect installed Prometheus middleware path handling; add the route guard with constant-time comparison and safe handling of different byte lengths.
- [x] Run metrics requests against unset, empty, configured, and disabled configurations; include a non-ASCII token check and unaffected routes.
- [x] Update .env.example, request-test instructions, architecture security model and actual local validation gates.
- [x] Run baseline HTTP tests and formatting check from src using the package scripts.
- [x] Apply docs-sync and update this draft PR with verification results; `audit.md` is written by the reviewer.
- [x] Review round 1: add `/info` exposure requests to the protected and disabled tags; confirm they fail on d6f4223.
- [x] Review round 1: exclude `TOKEN` names in `src/views/info.ejs`; rerun all tags, baseline tests and lint.
- [x] Review round 1: replace the shell-invalid placeholder in `docs/ci-cd.md`; check `bash -n` and run the documented commands.
- [x] Review round 1: commit the independent audit as `audit.md`.
- [ ] Review round 2 (Reviewer and Security) against the new head.

## Gates

Run from `src/` against an app started with the matching configuration:

- `npm run lint` — Prettier check.
- `npm test` — httpyac base requests against a default server.
- `npx httpyac tests/metrics-tests.http --tag public|protected|disabled [--var metricsToken=local-test-token]` — metrics requests per mode; protected and disabled need the token.

No deployment commands.

## Docs impact

- `.env.example` — optional METRICS_TOKEN; empty disables authentication; startup configuration.
- `src/tests/readme.md` — run public and protected configurations using a disposable test-only value and supplied URLs.
- `docs/architecture.md` — /metrics authorization and constant-time comparison.
- `docs/ci-cd.md` — document the metrics test invocation next to the existing make gates.

## Next step

Round 2 independent review and security review of the remediation; the auditor updates `audit.md` with the new verdict.
