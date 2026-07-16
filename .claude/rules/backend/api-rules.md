---
paths:
  - "backend/**"
  - "server/**"
  - "api/**"
  - "src/**/*.py"
  - "src/**/*.ts"
  - "src/**/*.js"
  - "src/**/*.go"
---
# UTE Backend / API Rules

- Keep API contracts explicit.
- Validate input at boundaries.
- Do not expose internal errors to users.
- Preserve backward compatibility unless the feature explicitly changes the contract.
- Consider idempotency for write operations.
- Consider concurrency and transaction safety for data-changing operations.
- Log useful operational context without logging secrets or sensitive payloads.
