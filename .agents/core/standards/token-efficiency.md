# Token Efficiency Standard

## Purpose

Keep agent runs cheap without losing correctness: read only what the task
needs, delegate wide or mechanical work to the right tier, stop review
loops early, and keep persistent context small.

## Applies To

Every agent run in every repository, including subagents and skill runs.

## Does Not Cover

- Feature folder size and lifecycle — see `core/standards/features.md`.
- What a skill must output — see each `SKILL.md` and the Missing skills
  note in `core/standards/workflow.md`.

## Required Rules

### Reading

- Search before reading: locate the relevant files and lines with a
  search tool, then read only that part of a large file.
- Do not re-read a file already read in the same session unless it changed.
- Read only feature folders touched by an open PR. Do not recover closed
  features from git history unless the user asks.
- Read CI and test logs from the failing step only (for GitHub Actions:
  `gh run view <id> --log-failed | tail -n 200`), never the full log.
- Filter command output before it enters the context (`head`, `tail`,
  `grep`, `wc`, `--quiet` flags).

### Delegation

- Delegate a broad search across many files or repositories to a read-only
  search subagent that returns conclusions, not file contents.
- Run mechanical work (renames, comment cleanup, compressing documents,
  format migrations) on the cheapest model tier that can do it, with an
  explicit, narrow file list per subagent.
- Do not repeat a search yourself that a subagent is already running.

### Review loops

- One audit and at most one re-audit per change. If blocking findings
  remain after the re-audit, stop and report them to the user instead of
  starting another round.

### Output

- Skills produce only their required output plus, when relevant, the
  Missing skills note. No run reports.
- Replies state results and next steps; they do not restate content the
  user already has on screen.

### Persistent context

- Persistent agent memory holds current state, open items, and
  non-obvious facts only. Rewrite a memory entry in place; never append
  session logs. Target: 3 KB per entry, 1.5 KB once the work is closed.
- Point to a repository path instead of restating what the repository
  records.
- Start a fresh session or clear the context between unrelated tasks.

## Forbidden Patterns

- Reading a whole large file, full CI log, or full command output when a
  search or filter would answer the question.
- Three or more audit rounds on the same change.
- A premium model tier used for a mechanical bulk edit.
- Memory entries or planning documents used as session diaries.

## Agent Must Check

- Before reading: is there a narrower search or line range that answers
  this?
- Before delegating: is this read-only search, mechanical work, or
  judgment work — and is the model tier and file list matched to it?
- Before a second re-audit: stop and report instead.

## Related Skills

- `change-audit` — audit round limit.
- `standards-gap-audit` — consumes the Missing skills note.
