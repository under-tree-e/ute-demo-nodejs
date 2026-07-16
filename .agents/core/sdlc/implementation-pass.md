# Implementation Pass

Canonical procedure behind the `implementation-pass` skill.

## Purpose

Implement an approved feature folder (`features/<feature>/`) — used when a
human points to a feature directory or asks to implement an existing feature
plan/spec.

## Required input files

- `feature.md`
- `requirements.md`
- `acceptance-criteria.md`
- `implementation-plan.md`
- `risks.md` when present
- `docs-impact.md` when present

## Process

1. Read the feature folder.
2. Read relevant project docs.
3. Inspect existing implementation patterns.
4. Update the implementation plan checklist as work progresses.
5. Implement minimal safe changes.
6. Add or update tests where practical.
7. Run validation commands.
8. Update docs if the implementation changes behavior, architecture, config,
   deployment, or operations (see `core/sdlc/docs-sync.md`).
9. Summarize changed files, validation, risks, and unresolved items.

## Rules

- Follow existing project conventions even if imperfect.
- Do not broaden scope without noting it.
- Do not run destructive commands.
- Do not deploy unless explicitly requested.
- Do not hide failed checks.
