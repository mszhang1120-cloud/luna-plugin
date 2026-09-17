---
description: "코드 리뷰 — CLAUDE.md·GOLDEN_RULES.md 대조 5항목 표 출력"
---

# /review — Pre-PR 리뷰 커맨드

CLAUDE.md와 GOLDEN_RULES.md를 읽은 뒤, `git diff` (스테이징 있으면 `--cached`, 없으면 최근 커밋)를 5항목으로 대조:

1. **헌법 4원칙 위반** (Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven)
2. **금지사항 저촉** (시크릿 하드코딩, 범위 밖 수정 등)
3. **테스트 동반 여부** (TDD 가드 통과 확인)
4. **범위 밖 변경** (Surgical Changes 위반)
5. **문서 갱신 필요** (README, CLAUDE.md, ADR 등)

출력 형식: `[항목|✅/❌|근거(파일:줄)|수정안]` 표 + 한 줄 총평. 칭찬 생략, 지적만 구체적으로.
