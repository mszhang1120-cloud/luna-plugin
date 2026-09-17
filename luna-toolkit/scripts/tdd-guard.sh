#!/bin/bash
# tdd-guard.sh — TDD 강제 훅 (PreToolUse[Edit|Write])
# stdin: JSON {tool_name, tool_input: {file_path, ...}}
# stdout: deny JSON 또는 통과 (exit 0)

set -euo pipefail

# stdin에서 JSON 읽기
input=$(cat)

# jq가 없으면 grep/sed로 file_path 추출
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

# 파일 경로가 없으면 통과
[ -z "$file_path" ] && exit 0

# 테스트/스펙/설정/타입/프레임워크 파일은 면제 (과녁 좁히기)
case "$file_path" in
  *.test.*|*.spec.*|*_test.*|*_spec.*) exit 0 ;;
  *__tests__/*|*__spec__/*|*/tests/*|*/spec/*) exit 0 ;;
  *.d.ts|*.config.*|*config*.json|*.md|*.txt|*.json) exit 0 ;;
esac

# 소스 파일인지 확인 (js/ts/py/rs/go 등)
if [[ ! "$file_path" =~ \.(js|ts|jsx|tsx|py|rs|go|java|rb|php)$ ]]; then
  exit 0
fi

# 대응하는 테스트 파일 탐색 (관대한 탐색)
dir=$(dirname "$file_path")
base=$(basename "$file_path" | sed 's/\.[^.]*$//')
ext="${file_path##*.}"

# 가능한 테스트 파일 패턴들
test_patterns=(
  "$dir/${base}.test.$ext"
  "$dir/${base}.spec.$ext"
  "$dir/${base}_test.$ext"
  "$dir/${base}_spec.$ext"
  "$dir/__tests__/${base}.test.$ext"
  "$dir/__tests__/${base}.spec.$ext"
  "$dir/__tests__/${base}_test.$ext"
  "$dir/__tests__/${base}_spec.$ext"
  "$dir/../__tests__/${base}.test.$ext"
  "$dir/../__tests__/${base}.spec.$ext"
  "$dir/../../__tests__/${base}.test.$ext"
)

# 테스트 파일 존재 확인
test_found=false
for pattern in "${test_patterns[@]}"; do
  if [ -f "$pattern" ]; then
    test_found=true
    break
  fi
done

if [ "$test_found" = true ]; then
  exit 0
fi

# 테스트 없음 → 친절한 deny JSON 출력 (stdout)
cat <<DENY
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "TDD 위반: 테스트 파일이 없습니다.\n\n예상 테스트 파일 위치 (하나만 만들면 됩니다):\n  - $dir/${base}.test.$ext\n  - $dir/${base}.spec.$ext\n  - $dir/__tests__/${base}.test.$ext\n\n먼저 테스트를 작성하세요 (RED), 그 후 구현하세요 (GREEN)."
  }
}
DENY
exit 0
