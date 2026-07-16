# Validation — Node.js Worker

## Testing expectations

- Unit-test `handlers/*` directly with constructed message payloads —
  happy path, malformed payload, and idempotent-replay cases.
- Integration-test `consumers/*` against a local broker/emulator
  (LocalStack for SQS, a local RabbitMQ/Kafka container, or `bullmq` against
  local Redis) to cover ack/nack, retry, and DLQ wiring.
- Test graceful shutdown: send `SIGTERM` mid-processing and assert in-flight
  work completes before exit and no new work is pulled.

## CI/CD expectations

- Lint, typecheck (if TS), unit tests, and integration tests (against the
  emulator/container) run on every PR.
- Build and (if containerized) scan the image in CI before deploy.
- Deploys should support rolling restarts without message loss — verify
  graceful shutdown is wired into the orchestrator's stop signal, not just
  the process.

## Common risks

- Poison messages — a single malformed message retried forever and blocking
  the queue for everyone behind it.
- Unbounded retry loops with no backoff, hammering a struggling downstream
  dependency.
- Message loss on crash — work acknowledged before it was actually
  durably completed.
- No backpressure — unbounded concurrent processing causing memory
  exhaustion or downstream overload during a traffic spike.
- Non-idempotent side effects (e.g. sending a duplicate email or double
  charge) on redelivery.
- Silent DLQ growth with no alerting, so failures go unnoticed for days.
