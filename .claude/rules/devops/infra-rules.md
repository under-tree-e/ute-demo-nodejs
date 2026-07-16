---
paths:
  - "terraform/**"
  - "ansible/**"
  - "infra/**"
  - ".github/workflows/**"
  - "Jenkinsfile"
  - "Dockerfile"
  - "docker-compose*.yml"
  - "semaphore/**"
---
# UTE DevOps / Infrastructure Rules

Before infrastructure, CI/CD, Docker, Jenkins, Semaphore, Ansible, or Terraform changes:

1. Identify affected environment: local, dev, stage, prod.
2. Identify affected runtime: app, database, network, secrets, registry, runner, host.
3. Explain deployment impact.
4. Explain rollback path.
5. Do not run `terraform apply`, `terraform destroy`, production deploys, or destructive Docker/Kubernetes commands without explicit user approval.

Required notes for risky changes:

- State impact
- State validation method
- State rollback path
- State secrets/state implications
