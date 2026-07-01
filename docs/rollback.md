# Rollback

The delegated Ansible release role retains the previous non-secret deployment
configuration before it replaces the current one. If the new Compose service
fails its Docker healthcheck, the role restores the previous Compose manifest
and `deployment.env`, then starts the previous immutable image.

For a manual rollback, run the separate Semaphore template that uses:

```text
playbooks/rollback-compose-release.yml
```

The template must target the same approved Sandbox host and should require a
release-manager approval. It does not accept an arbitrary image tag; it restores
the last known deployment state recorded on the server.
