# Recommended Structure — npm Package

This is a recommendation, not a requirement. Do not restructure an existing,
working project to match this layout — apply it to new projects or when a
project is already being reorganized for other reasons.

Whether a piece of code belongs in this repo at all (extracted, separately
published package) vs. staying inside an application repo (in-repo module)
is a cross-stack policy decision covered by
`core/standards/packages-modules.md`, not here. This document covers the
layout of a repo that has already been extracted.

```
.
├── src/
│   ├── index.ts             # public entry point — re-exports the public API only
│   ├── internal/              # implementation details, never exported
│   └── ...
├── dist/                        # build output, gitignored, published
├── tests/
├── docs/
│   └── api.md                    # generated or hand-written public API reference
├── .npmrc                          # registry/scope config only — no tokens; add only if the repo actually uses registry config
├── package.json                    # "name", "exports", "files", "types", "version", "private", "publishConfig"
├── LICENSE
├── README.md
├── CHANGELOG.md
└── CLAUDE.md
```

Key idea: everything importable by a consumer is re-exported from `src/index.ts`
(or the entry points listed in `exports`); everything under `internal/` is
implementation detail that can change without a semver bump because it was
never part of the contract.

## Naming format and package type

Package name format: `@<scope>/<type>-<name>` (e.g. `@ute/sdk-billing`,
`@under-tree-e/internal-logger`). The type must be evident from the name —
never arbitrary or marketing-driven. Package name and repository name are
not required to be identical, but must be logically related.

| Type | Purpose | Example name |
| --- | --- | --- |
| `ngx` | Angular library | `@ute/ngx-forms` |
| `server` | Backend/server-side module | `@under-tree-e/server-auth` |
| `sdk` | Client SDK for an external/internal API | `@ute/sdk-billing` |
| `ui` | Shared UI components | `@ute/ui-buttons` |
| `cli` | Command-line tool | `@under-tree-e/cli-deploy` |
| `internal` | Internal-only utility, not a public contract | `@under-tree-e/internal-logger` |
| `config` | Shared config (lint, tsconfig, etc.) | `@under-tree-e/config-eslint` |
| `contracts` | Shared types/interfaces/API contracts | `@ute/contracts-billing` |

## Scope → registry → visibility

| Scope | Registry | Visibility |
| --- | --- | --- |
| `@ute` | npmjs | Public |
| `@under-tree-e` | GitHub Packages | Private |

Do not mix public and private packages in the same scope.

## Entry points by package type

| Package type | Entry point convention |
| --- | --- |
| Node/TS package (`server-*`, `sdk-*`, `cli-*`, `internal-*`, `config-*`, `contracts-*`) | `src/index.ts`, with domain subfolders (`src/<domain>/...`) re-exported from it |
| Angular library (`ngx-*`) | `projects/<library-name>/src/public-api.ts` |
| UI component package (`ui-*`) | `src/index.ts` re-exporting components; no deep imports into component internals |
