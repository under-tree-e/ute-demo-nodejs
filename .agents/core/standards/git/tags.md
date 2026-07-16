# Tags

## When to tag

Tag releases, not every commit. A tag marks a point that was actually
shipped (or is being shipped) — RCs, production releases, hotfixes.

## Naming

Use `v<semver>` (e.g. `v1.4.0`) as the default. Projects with an existing
convention (build numbers, calendar versions, per-platform tags for games)
can keep it — don't force semver where it doesn't fit, just document
whatever convention is chosen in the project's own docs.

## Annotated vs lightweight

Prefer annotated tags (`git tag -a`) for anything release-related — they
carry a message, tagger, and date, and work correctly with `git describe`.
Lightweight tags are fine for throwaway/local markers only.

## Immutability

Once a tag is pushed, don't move it. Retagging a released version to point
at a different commit breaks anyone who already pulled it and makes
"what's actually in v1.4.0" ambiguous. If a release was wrong, cut a new
tag (`v1.4.1`) instead of rewriting `v1.4.0`.

## Relationship to releases

Tags are the artifact-level marker; `standards/git/releases.md` covers the
process around them (RC, changelog, smoke test, rollback, post-release
review). A tag without a documented release process is just a label.
