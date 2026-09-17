# luna-plugin — LUNA Lab Vibe Coding 세미나 플러그인

## 설치 명령

```bash
/plugin marketplace add mszhang1120-cloud/luna-plugin
/plugin install luna-toolkit@luna
```

## 포함 도구 (v0.2.0)

### Commands
- `/review` — CLAUDE.md·GOLDEN_RULES.md 대조 5항목 리뷰 표
- `/risk-score` — 변경사항 5축(Security/Scope/Breaking/Tests/Migration) 채점 + 등급(🟢🟡🟠🔴)

### Skills
- `repo-grade` — AI-Ready 코드베이스 7카테고리 100점 채점 + ROI 액션 리스트

### Hooks (hooks.json)
- **TDD 가드** — PreToolUse[Edit|Write] test-first 강제, 친절 deny 메시지
- **Guardrails Prevent** — PreToolUse[Bash] 4패턴(rm -rf, push --force, reset --hard, DROP TABLE) 차단
- **Guardrails Detect** — PostToolUse[Bash] audit.log 기록 (마찰 0)
- **Token 리포트** — Stop 훅 세션 종료 시 토큰 사용량 요약 출력

### Scripts
- `scripts/repo-grade.js` — 채점 실행 스크립트
- `scripts/token-report.js` — JSONL 파싱 토큰 분석기
- `scripts/tdd-guard.sh` — TDD 가드 훅 스크립트

## 빠른 시작

1. 설치 후 새 세션 시작 (`/exit` 후 재시작)
2. `/review` 실행해 현재 변경사항 리뷰
3. `/risk-score` 실행해 위험도 확인
4. `npm run grade` 로 AI-Ready 채점
