# F002 — Plan

## Checklist

- [x] Discovery: `/api/*` routes live in `src/routes/api.mjs`, mounted at
      `/` in `src/server.mjs`; `server.mjs` reads `package.json` with
      `readFileSync(new URL(...))`; native checks are `npm run lint`
      (prettier) and httpyac request files against a running app.
- [x] Add the request for `/api/version` to `src/tests/base-tests.http`.
- [x] Add `GET /api/version` to `src/routes/api.mjs`.
- [x] Add one README line.
- [x] Run every Verify line in `spec.md`.

## Docs impact

- `README.md`: one line describing `/api/version`.
- `docs/`: none; the endpoint changes no architecture, deployment,
  configuration or operations.

## Next step

Independent review of the draft PR.
