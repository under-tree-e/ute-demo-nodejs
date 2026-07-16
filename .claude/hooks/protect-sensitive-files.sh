#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"
path="$(printf '%s' "$payload" | python3 -c 'import json,sys; data=json.load(sys.stdin); ti=data.get("tool_input",{}); print(ti.get("file_path") or ti.get("path") or "")' 2>/dev/null || true)"

case "$path" in
  *.env|*.env.*|*secrets/*|*credentials*|*.pem|*.key|*.p12|*.pfx)
    cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Sensitive file access blocked by UTE Claude hook."
  }
}
JSON
    exit 0
    ;;
esac

exit 0
