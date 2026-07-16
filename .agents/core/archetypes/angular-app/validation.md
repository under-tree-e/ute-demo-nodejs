# Validation — Angular App

## Testing expectations

- Unit/component tests for services, pipes, and non-trivial components
  (Karma/Jasmine or Jest).
- E2E tests for critical user flows (login, checkout, core CRUD path — 
  whatever the app's primary journey is) via Cypress or Playwright, where
  present.
- New/changed UI states (loading, error, empty) get at least one test each,
  not just the happy path.

## Structure definition-of-done

Before calling an Angular app's structure (or a new feature) done, check:

- `src/app/` is built around `core/`, `shared/`, `layout/`, `features/` —
  each with one clear responsibility (see `rules.md`).
- Every feature's pages live in `features/<feature>/pages/` and its
  components in `features/<feature>/components/` — not in a global
  top-level `src/app/pages/` or `src/app/components/`.
- Feature services live in `features/<feature>/services/` — no single
  global `api.service.ts`.
- `core/` interceptors/guards/config are not mixed in with feature-specific
  logic.
- `shared/` contains no feature-specific business logic.
- Routing is split per feature (`<feature>.routes.ts`), with `app.routes.ts`
  holding only top-level/lazy-loaded routes.
- `models/`/`dto/`/`mappers/` are used where the backend response is
  complex or diverges from the UI model; skipped only when the response is
  simple and stable.
- Any state beyond component-local has an actual reason to exist and lives
  at the right scope (feature `store/` vs `core/state/`) — not a global
  store added preemptively.
- Styles are structured (`src/styles/` for global, feature-local styles
  next to their component/page).
- Environment/runtime config is documented — build-time
  (`src/environments/`) vs runtime config file, per
  `core/standards/configuration.md`.
- It's clear from the README/docs how to run the app locally.
- `package.json` defines `start`, `lint`, `test`, and `build` scripts.

## CI/CD expectations

- Lint, typecheck, and unit tests run on every PR before merge.
- Production build (`ng build` or equivalent) succeeds in CI, not just
  locally — catches AOT/type errors that dev-mode misses.
- Bundle size is checked or at least visible in CI output for a production
  build; flag unexpected large increases.
- E2E suite runs in CI if it exists, even if only on a subset of flows.

## Common risks

- Silent breakage from `any`-typed API responses drifting from the real
  backend contract — a missing mapper layer lets this reach the UI
  unnoticed.
- Memory leaks from unsubscribed Observables/subscriptions in components
  with a long lifecycle.
- Route guards/resolvers that fail closed vs. fail open inconsistently.
- Accessibility regressions that no automated test catches — spot-check
  keyboard navigation and screen-reader landmarks on changed views.
- Environment config (`src/environments/`) drifting between dev/stage/prod,
  or secrets accidentally committed into an environment or runtime config
  file.
- Structure drift: business logic creeping into `core/`/`shared/`, a
  global `components/`/`services/` directory reappearing, or the same
  logic duplicated across two features instead of shared once.
- A state management library adopted for one feature "just in case" and
  never actually needed — extra complexity with no corresponding
  requirement.
