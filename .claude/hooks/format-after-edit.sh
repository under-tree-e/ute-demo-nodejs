#!/usr/bin/env bash
set -euo pipefail

# Optional project-specific formatter hook.
# Keep this conservative. Prefer project-native commands when available.

if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  npm run format --if-present >/dev/null 2>&1 || true
fi

exit 0
