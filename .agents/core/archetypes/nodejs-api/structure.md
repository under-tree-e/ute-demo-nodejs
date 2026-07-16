# Recommended Structure — Node.js API

This is a recommendation for new projects or major reorganizations, not a
requirement. Do not blindly restructure an existing API that already works
with a different layout.

```text
src/app/               # app assembly only: instance creation, global
                        # middleware init, route registration, bootstrap,
                        # graceful shutdown, healthcheck registration
src/config/            # env loading + validation, fails fast on startup —
                        # the only layer allowed to read process.env
src/core/              # technical foundation: errors, logger, http helpers,
                        # security helpers, shared types, constants
src/modules/           # domain modules, if organizing by feature/domain
src/routes/            # route/endpoint definitions
src/controllers/       # request/response handling, calls services
src/services/          # business logic
src/repositories/      # data access — the only layer touching the datastore
src/integrations/      # external systems (email, storage, queue, payments,
                        # Firebase, etc.) behind clients/adapters
src/db/                # centralized connection setup, migrations, seeds —
                        # one connection layer, not one per module
src/jobs/              # cron/queue/worker background processing, separate
                        # from the HTTP request flow
src/middlewares/       # auth, error handling, logging, etc.
src/validators/        # request/input validation schemas
src/tests/             # unit + integration tests
docs/
features/              # UTE feature folders (see feature-plan)
```

## Notes

- Layering matters more than the exact folder names: routes → controllers →
  services → repositories, each layer only calling the one below it.
  Controllers should not query the datastore directly, and routes should
  not contain business logic.
- `modules/` (domain-first) and `routes/`+`controllers/`+`services/`
  (layer-first) are two valid ways to organize the same layering — pick one
  and stay consistent; don't mix both without a reason.
- Small services can collapse `controllers/` and `services/` into one file
  per route if the separation adds no value — don't force layers that don't
  earn their keep.
- `app/`, `core/`, `integrations/`, `db/`, `jobs/` are additions for
  projects that have grown past the minimal layout above — add each only
  when it's actually needed, not up front. A small service can stay at
  `config/` + `modules/` (or `routes/`+`controllers/`+`services/`) +
  `middlewares/` + `tests/` indefinitely.
- Naming is not fixed: some source material for this archetype calls these
  same concerns `app/` (app assembly), `core/` (cross-cutting technical
  code), and `db/` (connections/migrations/seeds). Treat those as aliases
  for this repo's existing `middlewares/`-plus-bootstrap-code and
  `repositories/` concepts — don't rename an existing project's folders to
  match, and don't run both naming schemes side by side in the same repo.
- If a module owns its full stack end-to-end (routes, controller, service,
  repository, tests) it may live entirely under `modules/<name>/` instead
  of being split across the top-level `routes/`/`controllers/`/`services/`
  folders — pick one convention per project.
- Domain modules under `modules/` are for business logic, not for grouping
  arbitrary shared code — see `rules.md` for forbidden catch-all patterns.
