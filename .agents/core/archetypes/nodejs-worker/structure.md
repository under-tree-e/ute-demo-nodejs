# Recommended Structure — Node.js Worker

This is a recommendation, not a requirement. Do not restructure an existing,
working project to match this layout — apply it to new projects or when a
project is already being reorganized for other reasons.

```
.
├── src/
│   ├── index.ts               # process bootstrap, signal handlers
│   ├── consumers/
│   │   ├── order-created.ts    # one consumer per queue/topic
│   │   └── ...
│   ├── handlers/                # message -> business logic, pure/testable
│   ├── lib/
│   │   ├── queue-client.ts
│   │   ├── retry.ts
│   │   └── metrics.ts
│   └── config/
├── tests/
│   ├── handlers/                 # unit tests, no real broker
│   └── integration/               # against a local broker/emulator
├── docs/
│   └── queues.md                    # message contracts, DLQ, replay runbook
├── Dockerfile
└── CLAUDE.md
```

Key idea: `consumers/*` own the queue-specific wiring (ack/nack, backpressure,
concurrency limits); `handlers/*` are plain functions that take a decoded
message and do the work, so they can be unit-tested without a real broker.
