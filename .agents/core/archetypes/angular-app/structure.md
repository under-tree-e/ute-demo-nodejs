# Recommended Structure — Angular App

This is a recommendation for new projects or major reorganizations, not a
requirement. Do not blindly restructure an existing Angular app that already
works with a different layout — that's a refactor with its own risk/cost,
not a side effect of an unrelated feature.

```text
src/app/core/         # singleton services, interceptors, guards, app-wide state/config
src/app/shared/       # reusable components/pipes/directives/models used by 2+ features
src/app/layout/       # shells, header/footer, nav — structure only, no business logic
src/app/features/     # one folder per feature/domain area — business logic lives here
src/app/app.config.ts, app.routes.ts, app.component.ts/html/scss
src/assets/           # icons, images, i18n, mock data
src/environments/     # environment.ts, environment.prod.ts (build-time config)
src/styles/           # base, themes, utilities, index.scss — global styles only
docs/
features/             # UTE feature folders (see feature-plan) — repo-root planning
                       # docs, not the same thing as src/app/features/ below
```

`core/`, `shared/`, `layout/`, `features/` are the four stable top-level
zones under `src/app/`. Each has exactly one job — see `rules.md` for what
belongs where and what's forbidden in each.

## core/ and shared/ internals

```text
src/app/core/
  config/  constants/  guards/  interceptors/  models/  services/  state/  utils/

src/app/shared/
  components/  directives/  pipes/  ui/  models/  types/  utils/

src/app/layout/
  components/          # shells, navigation, header/footer
```

## Feature-internal structure

A feature is self-contained: its routes, services, models, and (if needed)
store live inside its own folder, not scattered across `core/`/`shared/` or
another feature.

Full feature:

```text
src/app/features/<feature>/
  components/     # feature-local, reusable within the feature
  pages/           # route-level components for this feature
  services/
  models/
  store/           # only if this feature actually needs shared/cross-component state
  mappers/         # + dto/ when the API response is complex or diverges from the UI model
  utils/
  <feature>.routes.ts
  index.ts
```

Minimal feature (small/simple — e.g. a settings page with one endpoint):

```text
src/app/features/<feature>/
  pages/
  services/
  models/
  <feature>.routes.ts
  index.ts
```

Route-level/page components do not live in a global top-level
`src/app/pages/` — they live under `features/<feature>/pages/`. This keeps
each feature's routes, pages, and services next to each other instead of
spread across the app.

## Assets, environments, styles

- `src/assets/` — icons, images, i18n files, mock data. Feature-specific
  assets used by exactly one feature may live next to that feature instead,
  if that's clearer than the shared `assets/` tree.
- `src/environments/` — build-time config only (`environment.ts`,
  `environment.prod.ts`, ...). Runtime config (values that can change after
  build, e.g. loaded from a JSON file at app start) is a separate mechanism
  — see `rules.md` and `core/standards/configuration.md`.
- `src/styles/` — global/base styles, themes, utilities, `index.scss`.
  Feature-specific styles stay next to their component/page, not in this
  global tree.

## Monorepo placement

In a monorepo, only the filesystem *path* to an Angular app changes — its
internal `core/shared/layout/features` structure inside `src/app/` does not:

```text
product/
  apps/
    web/src/app/{core,shared,layout,features}
    admin/src/app/{core,shared,layout,features}
  packages/
    ui/         # shared across apps — not automatically the same as
    contracts/  # any one app's own src/app/shared/
    shared/
  docs/
  infra/
```

A `packages/` shared library is for code genuinely needed by 2+
applications. It is not automatically merged into, or a substitute for, a
single app's own `shared/`.

## Notes

- `core/` should stay small and singleton-only — do not dump every service
  there. Feature-specific services live inside their feature folder.
- `shared/` is for genuinely reused UI, not a dumping ground — if something
  is used by one feature, it belongs in that feature.
- Standalone components (modern Angular) or `NgModule`-per-feature (older
  Angular) both fit this layout — this structure does not assume one over
  the other. Follow whatever the project's Angular version already uses.
- If the API response is simple, `models/` alone is enough — add `dto/` and
  `mappers/` only when the backend response is complex or diverges from the
  UI model (see `rules.md`).
