# Releases

## Release candidate

Cut from a stable branch once the target scope is feature-complete and
passing CI. Fix-forward on the RC branch for release-blocking issues rather
than merging new scope.

## Changelog

Generate from commit messages/PR titles (see `core/standards/git/commits.md`) or
maintain a `CHANGELOG.md` per project. Group by type: features, fixes,
infra/CI, docs.

## Versioning

Follow semver (`MAJOR.MINOR.PATCH`) unless the project has an established
convention (e.g. calendar versioning for a game build). Be explicit about
which one a project uses in its own docs.

## Release notes

Human-readable summary for stakeholders, distinct from the changelog —
what changed and why it matters, not a commit list.

## Smoke test

Minimal manual or automated pass after deploy to confirm the release is
alive before declaring it done: key flows up, no error spike, health checks
green.

## Rollback plan

Every release with production impact needs one before it ships, not after
something breaks. See `core/standards/git/tags.md` and the `rollback-plan`
skill / `core/sdlc/rollback-plan.md`.

## Post-release review

Short retro after the release settles: what went well, what didn't, any
follow-up actions. See the `post-release-review` skill /
`core/sdlc/post-release-review.md`.

## Related

- `release-readiness` skill / `core/sdlc/release-readiness.md` — checks a
  release candidate is actually ready before it ships.
- `post-release-review` skill / `core/sdlc/post-release-review.md` —
  structured post-release retro.
