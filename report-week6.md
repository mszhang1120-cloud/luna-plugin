# 6주차 실습 리포트 — report-week6.md

## LAB별 증거 캡처 및 관찰

### LAB 01 — CLAUDE.md 헌법 승격
- **증거**: `CLAUDE.md` 생성 (4원칙·자동관리·팀운영 3원칙, 21줄)
- **관찰**: "35줄 이내 compass 원칙 덕분에 팀 헌법이 문서가 아닌 내비게이션이 됐다"

### LAB 02 — AI-Ready 채점 (repo-grade)
- **증거**: `repo-grade` 스킬 + `grade.js` 제작, **47점 → 67점** 향상 (package.json 추가 후)
- **ROI 1위**: Tribal Knowledge (5/20) — `_brain/` 부재, 2위: Verification Gates (0→15/15) — test/lint/build 스크립트 추가로 해결
- **관찰**: "점수 자체가 목적인 게 아니라, 병목(ROI 상위 1-2개)을 찾아 고치는 루프가 핵심이다"

### LAB 06 — TDD 가드 훅
- **증거**: `.claude/hooks/tdd-guard.sh` + `settings.json` PreToolUse[Edit|Write] 등록
- **차단 목격**: `src/hello.js` 작성 시 "테스트 파일 없음" 친절 deny 메시지로 차단됨
- **RED→GREEN**: `src/hello.test.js` 생성 후 `src/hello.js` 작성 통과
- **관찰**: "거절에 이유와 처방(예상 테스트 경로)까지 주니 에이전트가 화내지 않고 순순히 테스트부터 짰다"

### LAB 10 — Guardrails 3층 방어
- **Prevent**: Bash 4패턴(`rm -rf`, `push --force`, `reset --hard`, `DROP TABLE`) 차단 확인 — `BLOCKED` 메시지 출력
- **Detect**: PostToolUse `audit.log` 기록 작동 — `2026-09-1714:32:36 | ls -la` 타임스탬프+명령 남음
- **Contain**: `git worktree` 격리 구조 준비 (훅 공유 확인)
- **관찰**: "Prevent에서 죽은 명령은 Detect 로그에 안 남는다 — 층의 순서를 로그의 부재로 배웠다"

### LAB 05 — luna-toolkit v0.2.0 패키징
- **증거**: `luna-toolkit/` 하위 `commands/`, `skills/`, `hooks.json`, `scripts/`, `plugin.json`, `marketplace.json` 완성
- **설치 2줄**: `/plugin marketplace add ...` + `/plugin install luna-toolkit@luna`
- **관찰**: "자산 11개를 한 그릇에 담으니 '노트북에만 있으면 도구, /plugin install 한 줄이면 표준'이 실감났다"

---

## 종합 관찰 3줄

1. **Agentic 축**: "규칙을 '지켜 주세요'(문서)에서 '어기면 기계가 막는다'(훅)로 바꾸니 에이전트 행동이 즉시 교정된다 — 선의가 아닌 구조가 작동한다"
2. **Harness 축**: "수동으로 SDD 5단계·TDD 사이클·가드 설치를 해보니 execute.py 자동화의 설계 이유(요약 누적·자가교정·상태기록)를 몸으로 이해했다"
3. **다음 항해**: "7-8주차 최종 프로젝트에서 이 플러그인을 내 미니 SaaS에 장착해 '연료계(토큰) + 검문소(리뷰) + 구명장비(가드레일) + 당직봇(온콜)' 4종 중 2종 이상을 달고 출항하겠다"

---

## 제출 링크 (예시)

1. 제품 저장소 (mini SaaS + report-week7.md): `https://github.com/mszhang1120-cloud/my-mini-saas`
2. luna-plugin 저장소 (v0.2.0 포함): `https://github.com/mszhang1120-cloud/luna-plugin`
