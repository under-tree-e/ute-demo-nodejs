#!/usr/bin/env python3
"""Start and wait for a Semaphore deployment task from a safe inventory request.

Required environment variables:
  SEMAPHORE_URL
  SEMAPHORE_API_TOKEN
  SEMAPHORE_PROJECT_ID
  SEMAPHORE_TEMPLATE_ID

The selected Semaphore task template must point to the `ute-ansible` repository,
allow overridden Ansible arguments and run the playbook named in the request.
Secret values such as GHCR pull credentials stay in Semaphore/Vault and are not
included in this request or this client.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

SUCCESS_STATUSES = {"success"}
FAILURE_STATUSES = {"failed", "error", "stopped", "stop", "canceled", "cancelled"}


def required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise ValueError(f"{name} is required")
    return value


def request_json(url: str, token: str, method: str, payload: dict[str, Any] | None = None) -> Any:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    try:
        with urlopen(request, timeout=30) as response:
            content = response.read().decode("utf-8")
            return json.loads(content) if content else None
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise ValueError(f"Semaphore API {method} {url} returned HTTP {exc.code}: {body[:1000]}") from exc
    except URLError as exc:
        raise ValueError(f"cannot reach Semaphore API: {exc}") from exc


def load_deployment_request(path: Path) -> dict[str, Any]:
    try:
        request = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read deployment request {path}: {exc}") from exc
    if not isinstance(request, dict):
        raise ValueError("deployment request must be a JSON object")
    for key in ("deploymentId", "artifactVersion", "imageRef", "source", "target", "runtime"):
        if key not in request:
            raise ValueError(f"deployment request is missing {key}")
    if "@sha256:" not in str(request["imageRef"]):
        raise ValueError("deployment request must use an immutable image digest")
    return request


def ansible_extra_vars(deployment: dict[str, Any]) -> dict[str, Any]:
    source = deployment["source"]
    runtime = deployment["runtime"]
    target = deployment["target"]
    return {
        "ute_deployment_id": deployment["deploymentId"],
        "ute_artifact_version": deployment["artifactVersion"],
        "ute_image_ref": deployment["imageRef"],
        "ute_source_repository": source["repositoryUrl"],
        "ute_source_ref": source["ref"],
        "ute_source_path": source["path"],
        "ute_compose_manifest": source["manifest"],
        "ute_compose_project_name": runtime["composeProjectName"],
        "ute_compose_service_name": runtime["composeServiceName"],
        "ute_runtime_env_file": runtime["runtimeEnvFile"],
        "ute_traefik_network": runtime["traefikNetwork"],
        "ute_public_host": runtime["publicHost"],
        "ute_healthcheck_path": runtime["healthcheckPath"],
        "ute_ansible_limit": target["ansibleLimit"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--request", required=True, type=Path)
    parser.add_argument("--timeout-seconds", type=int, default=900)
    parser.add_argument("--poll-seconds", type=int, default=5)
    args = parser.parse_args()

    try:
        deployment = load_deployment_request(args.request)
        base_url = required_env("SEMAPHORE_URL").rstrip("/")
        token = required_env("SEMAPHORE_API_TOKEN")
        project_id = required_env("SEMAPHORE_PROJECT_ID")
        template_id = required_env("SEMAPHORE_TEMPLATE_ID")
        if not project_id.isdigit() or not template_id.isdigit():
            raise ValueError("SEMAPHORE_PROJECT_ID and SEMAPHORE_TEMPLATE_ID must be numeric")

        extra_vars = ansible_extra_vars(deployment)
        task_payload = {
            "template_id": int(template_id),
            "limit": extra_vars.pop("ute_ansible_limit"),
            "message": (
                f"{deployment['deploymentId']} {deployment['artifactVersion']} "
                f"{deployment['imageRef']}"
            ),
            # Semaphore forwards these to the template only when overriding task
            # arguments is enabled. JSON prevents shell interpolation in Jenkins.
            "arguments": json.dumps(["--extra-vars", json.dumps(extra_vars, separators=(",", ":"))]),
        }
        started = request_json(
            f"{base_url}/api/project/{project_id}/tasks",
            token,
            "POST",
            task_payload,
        )
        if not isinstance(started, dict) or not isinstance(started.get("id"), int):
            raise ValueError(f"Semaphore did not return a task ID: {started!r}")

        task_id = started["id"]
        print(f"Semaphore task queued: project={project_id} task={task_id}")
        deadline = time.monotonic() + args.timeout_seconds
        task_url = f"{base_url}/api/project/{project_id}/tasks/{task_id}"
        while time.monotonic() < deadline:
            task = request_json(task_url, token, "GET")
            status = str(task.get("status", "")).strip().lower() if isinstance(task, dict) else ""
            print(f"Semaphore task {task_id} status: {status or 'unknown'}")
            if status in SUCCESS_STATUSES:
                return 0
            if status in FAILURE_STATUSES:
                raise ValueError(f"Semaphore task {task_id} failed with status {status!r}")
            time.sleep(args.poll_seconds)
        raise ValueError(f"timed out waiting for Semaphore task {task_id}")
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
