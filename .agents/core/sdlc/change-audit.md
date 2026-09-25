# Change Audit

Stage summary. The procedure is the `change-audit` skill.

## Purpose

Independently audit implemented changes against the feature's `spec.md`:
acceptance criteria, test-first evidence, real-browser verification for UI
changes, standards' forbidden patterns, comment content, and minimality.
Produces `audit.md` and a verdict: pass, pass with notes, needs fixes, or
blocked. Does not fix code unless explicitly requested.
