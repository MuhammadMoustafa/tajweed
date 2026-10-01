#!/usr/bin/env bash
# Runs xcodebuild for .github/workflows/ios.yml (macOS only):
#   bash scripts/ios-xcodebuild.sh <log-name> <xcodebuild arguments...>
# The full output goes to build/ios/logs/<log-name>.log (the workflow uploads it as a run
# artifact); the console gets it through xcbeautify when the runner has it (errors then show as
# annotations on the run), otherwise unchanged. On failure it repeats the log's error lines last,
# so the end of the step's output says what broke.
set -euo pipefail

name=$1
shift
mkdir -p build/ios/logs
log="build/ios/logs/$name.log"

echo "> xcodebuild $*"
echo "  (full log: $log)"
if command -v xcbeautify >/dev/null 2>&1; then
  format=(xcbeautify --renderer github-actions)
else
  format=(cat)
fi

status=0
xcodebuild "$@" 2>&1 | tee "$log" | "${format[@]}" || status=$?
if [ "$status" -ne 0 ]; then
  echo "::error::xcodebuild ($name) failed with exit code $status. Error lines from $log:"
  grep -E -A 3 'error:|\*\* [A-Z ]+ FAILED \*\*|The following build commands failed' "$log" | tail -60 || true
  exit "$status"
fi
echo "xcodebuild ($name) succeeded"
