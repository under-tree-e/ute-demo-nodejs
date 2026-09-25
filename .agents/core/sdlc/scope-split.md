# Scope Split

Stage summary. The procedure is the `scope-split` skill.

## Purpose

Catch out-of-scope work found while planning a feature — bugs, refactors,
doc/test gaps, infrastructure debt — before it expands the current diff or
gets lost. Confirmed items become their own feature folders; declined
items are listed in the current `spec.md` "Out of scope" section.

Runs embedded in `feature-plan`, not as a standalone pipeline stage.
