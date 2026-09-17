---
description: "AI-Ready 코드베이스 채점 — 5×20 루브릭, JSON+HTML 대시보드 + ROI 액션 리스트 출력"
---

# repo-grade — AI-Ready 채점 스킬

## 채점 차원 (7 카테고리, 100점)

| 카테고리 | 배점 | 핵심 질문 |
|----------|------|-----------|
| A. Navigation & Coverage | 15 | 핵심 모듈 1-2 hop 내 도달? |
| B. Context Doc Quality | 20 | 간결(25-35줄)·명령어·핵심파일 3-5·함정·상호참조 |
| C. Tribal Knowledge | 20 | 숨은 규칙·실패 패턴이 문서에 있는가? |
| D. Dependency & Data Flow | 15 | 모듈 간 흐름이 지도에 있는가? |
| E. Verification Gates | 15 | 테스트·빌드·린트가 검증 루프를 지탱하는가? |
| F. Freshness | 10 | 문서가 코드와 함께 갱신되는가? |
| G. Agent Outcomes | 5 | 실제 작업 성공률·재작업률 |

각 항목에 **Auto / Heuristic / Manual** 신뢰도 태그 부여.

## 실행 흐름

1. **Sanity 선행** — 죽은 코드·중복 제거, 테스트 통과, 구조 일관, 빌드 통과
2. **Cartography 가속** — 진입점·의존성 지도·용어집·함정 표지판
3. 채점 → `repo-grade-report.json` + `repo-grade-dashboard.html` 출력
4. **ROI 상위 1-2개** 개선 제안 (점수가 목적이 아니라 병목 제거가 목적)

## 트리거 방식

- 수동: `/repo-grade`
- 훅: PreToolUse[git commit] 또는 cron 주기 자동 실행
