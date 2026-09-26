---
paths:
  - "**/*"
---
# Token Efficiency Rules

> Canonical agent-neutral text: `core/standards/token-efficiency.md`. Keep
> both in sync.

- Search first (Grep/Glob), then Read only the needed line range; never
  re-read an unchanged file.
- CI/test logs: failing step only (`gh run view <id> --log-failed | tail -n 200`).
  Filter command output with `head`/`tail`/`grep`/`wc`.
- Broad searches go to the Explore subagent. Mechanical bulk edits go to a
  subagent with `model: haiku` or `sonnet` and an explicit file list.
- One audit plus at most one re-audit; if blockers remain, report to the
  user instead of another round.
- Memory entries: current state only, rewritten in place, ≤3 KB (≤1.5 KB
  when closed); no session diaries.
- Suggest `/clear` to the user between unrelated tasks.
