# Agent notes

- Install: `make install` (runs `npm ci` in `src/`); Node 20.
- Lint: `make lint` (Prettier check only); `npm run lint-fix` in `src/` formats. `CONTRIBUTING.md` names `make lint-fix`, which the makefile does not define.
- Tests: `make test` and `make test-health` need a running app; start it with `cd src && npm start` in another shell (no `SESSION_SECRET` needed outside production).
- Image: `make image image-smoke` needs Docker.
- `.claude/settings.json` denies reads of `**/secrets/**`, so `deploy/secrets/` is not readable by Claude Code.
- Without GNU make, run the target recipes from the makefile directly (for example `src/node_modules/.bin/httpyac src/tests/base-tests.http --all --output short`).
