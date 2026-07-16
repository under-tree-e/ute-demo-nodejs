# Recommended Structure — Node.js CLI

This is a recommendation, not a requirement. Do not restructure an existing,
working project to match this layout — apply it to new projects or when a
project is already being reorganized for other reasons.

```
.
├── bin/
│   └── mytool.js          # thin entry point, resolves to src/cli.ts
├── src/
│   ├── cli.ts              # argument parsing + command registration
│   ├── commands/
│   │   ├── init.ts
│   │   ├── deploy.ts
│   │   └── ...
│   ├── lib/                 # business logic, importable without the CLI shell
│   └── config/
│       └── load-config.ts   # project-config + user-config resolution
├── tests/
│   ├── commands/             # invoke the built CLI, assert stdout/stderr/exit
│   └── lib/
├── docs/
├── package.json               # "bin" field, "files" allowlist
└── CLAUDE.md
```

Key idea: `src/commands/*` are thin — they parse flags and call into
`src/lib/*`, which is plain, testable logic with no `process.argv` or
`process.exit` calls. This is what makes command behavior testable without
spawning a subprocess for every unit test.
