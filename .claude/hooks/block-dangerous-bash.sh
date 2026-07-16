#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"
command="$(printf '%s' "$payload" | python3 -c 'import json,sys; data=json.load(sys.stdin); print(data.get("tool_input",{}).get("command", ""))' 2>/dev/null || true)"

case "$command" in
  *"rm -rf"*|*"terraform apply"*|*"terraform destroy"*|*"kubectl delete"*|*"docker system prune"*|*"git push --force"*)
    cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Dangerous command blocked by UTE Claude hook. Ask the user explicitly and provide rollback details."
  }
}
JSON
    exit 0
    ;;
esac

exit 0
