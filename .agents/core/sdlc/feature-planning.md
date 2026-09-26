# Feature Planning

Stage summary. The procedure is the `feature-plan` skill; folder
rules are `core/standards/features.md`.

## Purpose

Turn an idea, change request, bug, refactor, documentation,
infrastructure, or CI/CD task into `features/FXXX-short-name/spec.md` and
`plan.md` before implementation. Trivial, easily reversible changes skip
this stage.

## Rules

- No code changes and no deployment actions in this stage.
- No secrets.
- Scope items are tagged `[EXISTS]`/`[MODIFY]`/`[NEW]` from the code.
- Ask questions only if implementation would be unsafe or materially
  ambiguous.
