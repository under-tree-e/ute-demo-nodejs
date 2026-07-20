# Rules — Angular App

## Zones of responsibility

- `core/`, `shared/`, `layout/`, `features/` are the four stable top-level
  directories under `src/app/` — see `structure.md`. Each has exactly one
  job:
  - `core/` — singleton services, interceptors, guards, app-wide
    state/config. Not a dumping ground for arbitrary/unrelated code.
  - `shared/` — reusable UI/pipes/directives/models used by 2+ features.
    Not a dumping ground, and never a home for one feature's business
    logic.
  - `layout/` — page/app structure only (shells, header, sidebar, topbar,
    navigation). No business logic.
  - `features/` — where business logic actually lives. The app scales by
    adding features, not by adding to global `components/` or `services/`
    directories.
- Do not create catch-all directories named `misc`, `common2`, `tmp`,
  `new`, or `final` anywhere under `src/app/`.
- Do not duplicate the same logic across multiple features — if two
  features need it, it belongs in `shared/` (UI) or `core/` (app-wide
  service/state), not copy-pasted.

## Feature self-containment

- Business logic for a specific business area lives in
  `features/<feature>/`, not in `core/` or `shared/`.
- A feature owns its own pages, components, services, models, routes, and
  (if needed) store. Don't keep pages, models, or API logic floating
  without a feature boundary.
- A feature component is reusable *within its feature*, named for what it
  does, and as simple as possible — it must not depend directly on global
  app context unless that's actually required.

## Pages vs components vs services

- A page (route-level) component wires feature services together, manages
  loading/error state, composes feature components, reads route params,
  and dispatches store actions. It does not contain complex business
  logic itself.
- A feature component holds presentation/interaction for its feature; keep
  it thin and reusable within that feature.
- A service holds the actual logic and I/O. Components call services;
  services call `HttpClient`. Don't call `HttpClient` directly from a
  component.

## Routing

- Route boundaries align with `features/` — a feature's routes live
  together in its own `<feature>.routes.ts`, not scattered across the
  router config.
- `app.routes.ts` holds only top-level routes, typically lazy-loading each
  feature via `loadChildren` into that feature's own routes file.
- Guard/resolve at the route level for auth and data preconditions, not
  inside component constructors.

## API services

- One service (or small set of services) per backend domain, under the
  owning feature, or under `core/` only if genuinely app-wide.
- Do not create a single global `api.service.ts` shared by all features —
  each feature owns its own service(s).
- Components call services; services call HTTP. Don't call `HttpClient`
  directly from components.

## Models / DTO / mappers

- Don't bind UI directly to an unstable or complex backend response. Use a
  `models/` (+ `dto/` and `mappers/` when needed) layer to translate the
  backend response into a UI model.
- If the API response is simple and stable, `models/` alone is enough —
  skip `dto/`/`mappers/` rather than adding ceremony with no payoff.
- Use `dto/` and `mappers/` when the API response is complex or diverges
  from the shape the UI actually needs.

## State management

- Default to component/service state (plain properties, RxJS subjects, or
  Angular signals).
- Add state only when a feature or the whole app actually needs it:
  - Local to one component → component state.
  - Shared within one feature → `features/<feature>/store/`.
  - Needed application-wide → `core/state/`.
- Do not add a global state store (NgRx or otherwise) preemptively or
  "just in case." Introducing one for real cross-cutting shared state is
  an architectural decision — flag it in a feature plan, don't default to
  it.

## Configuration (build-time vs runtime)

- General config classification (public/environment/secret, commit rules,
  `.env.example`) is defined once in `core/standards/configuration.md` —
  this section only covers the Angular-specific mechanics.
- Build-time config (baked into the bundle at `ng build`) uses
  `src/environments/environment.ts` / `environment.prod.ts`.
- Config that must be able to change *after* build (without a rebuild) is
  runtime config, not an environment file — load it from a JSON file
  (`config.example.json`, `runtime-config.example.json`, or
  `app-config.example.json`, per `core/standards/configuration.md`) at app
  start instead of overloading `src/environments/`.
- Frontend config, build-time or runtime, is public by nature (anything
  shipped to a browser bundle is public) — never route secret-shaped
  values through either mechanism.

## Naming conventions

- Directory names reveal the role of the code without opening the file:
  `core`, `shared`, `layout`, `features`, `pages`, `components`,
  `services`, `models`, `dto`, `mappers`, `store`, `utils`, `guards`,
  `interceptors`, `pipes`, `directives`.
- File suffixes: `*.component.ts`, `*.service.ts`, `*.model.ts`,
  `*.dto.ts`, `*.mapper.ts`, `*.store.ts`, `*.routes.ts`, `*.guard.ts`,
  `*.interceptor.ts`, `*.pipe.ts`, `*.directive.ts`.

## Monorepo placement

- An app's internal `core/shared/layout/features` structure does not
  change in a monorepo — only the filesystem path to the app does (see
  `structure.md`).
- A `packages/` shared library is for code genuinely needed by 2+
  applications. Don't treat it as, or merge it into, a single app's own
  `shared/`.

## Components

- Standalone components or module-based structure — follow whatever the
  project's Angular version and existing codebase already use. Don't migrate
  one to the other as a side effect of a feature.
- Keep page/route components thin; push logic into services or
  feature-specific components.

## UI states

- Every view that loads async data handles loading, error, and empty states
  explicitly — not just the happy path.
- Disable/indicate in-flight state on actions that trigger network calls
  (buttons, forms) to prevent double-submits.

## Accessibility

- Use semantic HTML elements before reaching for ARIA.
- Every form control has an associated label.
- Manage focus on route change and after modal/dialog open-close.
- Maintain sufficient color contrast; don't rely on color alone to convey
  state (error/success/etc.).

## Testing

- Unit/component tests via Karma/Jasmine or Jest — either is acceptable,
  follow what the project already uses.
- E2E via Cypress or Playwright for critical user flows, if the project has
  e2e coverage at all.

## CI/CD expectations

Use dedicated CI/CD templates from approved repositories
(`ute-ci-templates` for GitHub Actions, `ute-jenkins-library` for Jenkins)
instead of hand-rolling build/test/deploy pipeline logic in this repo.
Document the selected delivery model in `docs/ci-cd.md` — see
`core/standards/ci-cd.md`.

---

These are recommendations and checks for this archetype, not mandates. An
existing project that already works differently is not required to
restructure to match.
