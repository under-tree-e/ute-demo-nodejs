# Rules — Node.js Worker

## Queue/message processing

- Use a consumer pattern that pulls (or is pushed) messages with an explicit
  concurrency limit — never process unbounded messages in parallel.
- Apply backpressure: stop pulling new messages when downstream
  dependencies (DB, API, disk) are saturated or erroring, instead of piling
  up in-memory work.

## Retries

- Retries are bounded (a max attempt count), never infinite.
- Use backoff (exponential or the broker's native retry/visibility-timeout
  mechanism) between attempts, not immediate tight-loop retries.
- Distinguish retryable failures (transient: network, timeout) from
  non-retryable ones (bad payload, validation error) — don't retry the
  latter, send it straight to the dead-letter path.

## Idempotency

- Processing the same message twice (redelivery, retry, at-least-once
  delivery) must be safe — dedupe by message ID, use upserts, or make the
  underlying operation naturally idempotent.
- Never assume exactly-once delivery from the broker unless it's explicitly
  guaranteed and configured that way.

## Dead-letter handling

- Define where failed messages go (DLQ, dead-letter topic, failed-jobs
  table) after retries are exhausted.
- Document how a failed message is inspected and replayed — this must not
  require reading broker internals or writing one-off scripts under
  pressure.

## Observability

- Log structured, per-message/per-job entries (message ID, queue name,
  outcome, duration) — not just process-level lifecycle logs.
- Expose metrics on throughput, failure rate, retry count, and queue
  depth/lag where the broker supports it.

## Graceful shutdown

- On `SIGTERM`, stop pulling new messages, let in-flight work finish (up to
  a bounded timeout), then exit — don't kill in-flight processing abruptly.
- Health/readiness checks reflect shutdown state so orchestrators (k8s, ECS)
  stop routing new work during drain.

---
These are recommendations and checks for this archetype, not mandates — an
existing project is not required to restructure to match them.
