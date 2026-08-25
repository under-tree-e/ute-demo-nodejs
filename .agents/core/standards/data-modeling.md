# Data Modeling Standard

## Purpose

Define one baseline rule for how records are identified across any
database or datastore: every table/collection carries a dedicated `uid`
as its globally unique identifier, and both cross-table relationships and
external-facing references prefer `uid` over an internal sequential/auto-
increment `id`. This is a migration-safety decision, not a style
preference — sequential IDs collide across environments (dev/stage/prod),
across merges, and across restores from separate backups; a
non-sequential unique identifier does not.

## Applies To

- Any relational schema (tables, foreign keys) in any language/framework.
- Any document/NoSQL collection where records need a stable external
  identifier.
- API responses, inter-service references, and any place a record is
  referenced from outside its own table/collection.

## Does Not Cover

- Secret/credential storage — see `core/standards/security.md`.
- Backend layering (where DB access code lives) — see
  `core/standards/development.md` and the relevant archetype's `rules.md`.
- Migration tooling/process itself (how a migration runs, rollback) — each
  archetype's own migration mechanism (e.g. Frappe patches, an ORM's
  migration tool) still applies; this file only governs identifier shape.

## Source Documents

- Operator decision (2026-08-03), recorded directly here — a strategic
  rule drawn from prior migration incidents, not derived from an external
  standards memo.

## Required Rules

- Every table/collection MUST have a `uid` field: a globally unique,
  non-sequential identifier (UUID/ULID or an equivalent collision-resistant
  value), generated independently of any internal auto-increment/sequential
  primary key the storage engine or ORM still uses.
- Foreign keys, joins, and any reference from one table/collection to
  another MUST use `uid`, not the internal sequential `id`.
- Anything exposed outside the datastore — API responses, URLs, logs,
  cross-service references, export/import payloads — MUST reference
  records by `uid`, never by the internal sequential `id`.
- An internal auto-increment `id` MAY still exist (e.g. because the ORM or
  storage engine requires one as its physical primary key), but it MUST
  stay internal to that single table — it MUST NOT be relied on for joins,
  API contracts, or cross-environment references.
- `uid` MUST be indexed/unique-constrained at the database level, not only
  enforced in application code.

## Recommended Rules

- Generate `uid` at record-creation time in application code (or a DB
  default backed by a UUID/ULID function), not left nullable and
  backfilled later.
- Prefer a sortable identifier format (e.g. ULID) over a plain random UUID
  when creation-order matters for the table (audit trails, event logs).
- Keep `uid` immutable for the lifetime of the record — never regenerate
  or reassign it.

## Forbidden Patterns

- A table/collection with no `uid` field.
- Using the internal sequential `id` as a foreign key target for a new
  relationship.
- Exposing the internal sequential `id` in an API response, URL, or
  cross-service call instead of `uid`.
- Enforcing `uid` uniqueness only in application code with no database-
  level unique constraint/index.

## Agent Must Check

- Before creating a new table/collection: does its schema include a `uid`
  field with a database-level unique constraint?
- Before adding a foreign key or join: does it reference `uid`, not the
  internal sequential `id`?
- Before adding or changing an API response, export, or cross-service
  payload: does it expose `uid` rather than the internal sequential `id`?
- For a framework whose ORM/primary-key mechanism already produces a
  non-sequential, globally unique primary key (e.g. Frappe DocTypes'
  `name` field when autoname is hash/UUID-based) — is a redundant `uid`
  actually needed, or does the existing primary key already satisfy this
  standard's intent? See the relevant archetype's `rules.md` for the
  concrete answer where one exists (e.g.
  `core/archetypes/erpnext-frappe-app/rules.md`).

## Agent Must Not Do

- Must not introduce a new table/collection without a `uid` field.
- Must not wire a new relationship or API contract through the internal
  sequential `id` when `uid` is available.
- Must not treat this standard as satisfied by an application-level-only
  uniqueness check with no database constraint.

## Related Skills

- `architecture-review` — schema/data-model decisions are in scope before
  non-trivial implementation.
- `feature-plan` — new tables/collections proposed in a feature plan
  should already show `uid` in the schema sketch.
- `implementation-pass` — DB migrations implementing a plan must include
  `uid`.
- `change-audit` — flags a schema change or new relationship that skips
  `uid`.

## Related Archetypes

- `nodejs-api`, `nodejs-worker` — most direct fit; see the DB-access
  section of each `rules.md`.
- `erpnext-frappe-app` — DocTypes already key on `name`, which is often
  non-sequential by default; see that archetype's `rules.md` for how this
  standard applies there without duplicating a redundant identifier.

## Related Repositories

- N/A — this is a schema-design standard, not a pipeline/infra ownership
  concern.

## Open Questions

- No existing project has been audited yet for retrofitting `uid` onto
  tables that predate this standard — a live schema without `uid` is not
  automatically a violation to fix reactively; treat it as a gap to raise
  in `architecture-review`/`feature-plan` the next time that table is
  touched, not a mandatory standalone migration.
- Exact identifier format (UUIDv4 vs UUIDv7 vs ULID) is left to each
  project/archetype to decide — this standard fixes the *role* (`uid` as
  the join/reference key), not the generation algorithm.
