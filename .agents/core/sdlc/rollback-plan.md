# Rollback Plan

Canonical procedure behind the `rollback-plan` skill.

## Purpose

Create a practical rollback plan for a release, deployment, database
migration, infrastructure change, or risky production-impacting change.
Prefer operational clarity over theory.

## Required sections

- Change summary
- Affected systems
- Pre-change backup/snapshot requirements
- Rollback trigger conditions
- Step-by-step rollback
- Data/state considerations
- Verification after rollback
- Communication notes
- Risks and limitations

## Execution boundary

Rollback execution belongs to deployment tooling
(`ute-ansible`/`ute-automation`/`ute-infra`/`ute-gitops`, or the project's
CI/CD pipeline via `ute-ci-templates`/`ute-jenkins-library` — see
`core/standards/ci-cd.md`), not to agent standards. This skill documents a
rollback plan; it must not execute a production rollback itself unless the
user explicitly instructs it for this specific change and safe tooling
(dry-run support, a tested rollback command, non-production target) exists.
Absent both conditions, hand the documented plan to a human or to the
owning pipeline instead of running it.

See `core/standards/git/tags.md` and `core/standards/git/releases.md` for
how this fits into the release process, and `core/sdlc/production-readiness.md`
for the standing operational posture this plan assumes.
