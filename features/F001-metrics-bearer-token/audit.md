# F001 — Audit

Verdict: needs fixes
Audited: feature/UND-7-metrics-bearer-token@d6f4223ce912920a3c76e08ccbce1a50e126bed8

This verdict is the independent round 1 audit (Reviewer, UND-10; Security,
UND-11). Round 2 independent review of the remediation is pending. Only the
auditor replaces this verdict.

## Findings (round 1, independent)

1. **[P1] blocking (Reviewer); high (Security): the public `/info` page
   exposes the metrics credential.** `src/views/info.ejs:90-101` lists every
   `process.env` entry unless its name contains SECRET, PWD, PASSWORD, KEY,
   CONNSTR, PATH or NPM_. `METRICS_TOKEN` matched none, so an
   unauthenticated `GET /info` returned 200 with the configured value, and
   that value then returned 200 from `/metrics`. The value stays visible when
   `DISABLE_METRICS=true`. The PR risk note ("never logged or echoed") was
   wrong for this path. Required: the token name and value never appear on
   `/info` with metrics enabled or disabled; `/info` stays public; regression
   requests fail on d6f4223 and pass after the fix; all protected requests
   still pass.
2. **[P2] blocking (Reviewer): the documented protected-mode command cannot
   run.** `docs/ci-cd.md:89` used `--var metricsToken=<test-only value>`;
   the shell reads `<` as a redirection and `bash -n` exits 2. Required: a
   literal disposable value matching `src/tests/readme.md`
   (`local-test-token`), a shell syntax check, and a successful run.

Security hardening notes with no verdict impact (not in scope): leading or
trailing whitespace in `METRICS_TOKEN` can never match (fails closed); no
token length or randomness guidance; `README.md` and
`deploy/env/runtime.env.example` do not list `METRICS_TOKEN`; `--var` puts
the value in shell history and the process list, acceptable for test-only
values.

## Acceptance criteria (round 1, independent, at d6f4223)

- AC1: PASS — unset and empty configurations each passed both public requests.
- AC2: PASS — protected requests 17/17; additional path and HEAD probes passed.
- AC3: PASS — equal-size SHA-256 digests with `timingSafeEqual`; exact UTF-8 passed, wrong bytes and lengths rejected.
- AC4: PASS — `/`, `/healthz`, `/readyz` public; disabled metrics 404.
- AC5: NEEDS FIXES — `docs/ci-cd.md:89` not executable as written.
- AC6: PARTIAL — one open draft PR targets `main`; `audit.md` was missing.
- Goal/security: FAIL — `/info` exposed the configured token.

Round 1 evidence: `ci / node-ci` passed on d6f4223; Reviewer ran Node
22.23.3 with locked dependencies and a sanitized environment (`npm test`
4/4, health 2/2, lint pass, 51 extra runtime assertions); Security did a
static review including the locked `express-prometheus-middleware@1.2.0`
source and found no other issue.

## Remediation revalidation (implementer, not an independent verdict)

Commits b008795 (filter and regression requests) and 321f462 (docs). Run
from `src/` on Node 22.23.3 after `npm ci`, each server started with
`env -i PATH HOME PORT=<port> <config> node server.mjs`.

- Finding 1: `src/views/info.ejs` now also skips names containing `TOKEN`.
  New requests in the protected and disabled tags assert `/info` is 200 and
  contains neither `METRICS_TOKEN` nor the configured value.
  - Red on d6f4223: protected 17/18 (new `/info` request fails both
    exposure assertions); disabled 1/2 (same).
  - Green after fix: protected 18/18; disabled 2/2; public 2/2 with the
    token unset and 2/2 with it empty.
  - Unicode token `tëst-tøken-✓`: `/info` 200 without the name or value.
- Finding 2: the old line fails `bash -n` (exit 2); the new command block
  passes `bash -n` (exit 0). The three documented `docs/ci-cd.md` commands,
  run verbatim against a server on port 3000: public 2/2, protected 18/18,
  disabled 2/2.
- AC1–AC4: public, protected and disabled tags as above. Raw-socket checks
  with the Unicode token: exact UTF-8 200; latin1 `ë`/`ø` 401; ASCII-folded
  401; last byte differs 401; one character shorter 401; longer 401; HEAD
  without auth 401; HEAD with token 200; `/%6Detrics` 404; `/healthz` 200.
- AC5: `npm test` 4/4; `npx httpyac tests/health-tests.http --all` 2/2;
  `npm run lint` passes.
- AC6: one open draft PR (#47) targets `main`, unmerged; this file is in it.

## Open questions

None. Round 2 Reviewer and Security verdicts decide whether `Status: done`
can be set.
