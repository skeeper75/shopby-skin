# SPEC-SKIN-000: 마스터 플랜 - 구현 계획

> **SPEC ID**: SPEC-SKIN-000
> **문서 유형**: 구현 계획 (plan.md)

## 1. 마일스톤 (우선순위 기반)

### Primary Goal: Phase 1 - 사용자 쇼핑몰
- SPEC-SKIN-001 → SPEC-SKIN-003 → SPEC-SKIN-002 → SPEC-SKIN-004

### Secondary Goal: Phase 2 - 관리자 백오피스
- SPEC-SKIN-005 → SPEC-SKIN-006 → SPEC-SKIN-007 → SPEC-SKIN-008

## 2. 기술적 접근

- Aurora Skin 기반 확장: 기존 페이지 구조 재활용
- Huni 디자인 토큰: Tailwind CSS config에 통합
- shadcn/ui 컴포넌트: Aurora + Huni 스타일 오버라이드
- Shopby API: 기존 API 최대 활용, 커스텀 최소화

## 3. 리스크

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| @shopby/react-components 제약 | High | 소스 분석 후 확장 가능 범위 파악 |
| PG 연동 복잡도 | High | 이니시스 SDK 문서 사전 검토 |
| 알림톡 서비스 계약 | Medium | 비밀번호 찾기 기능 지연 가능 |
| 관리자 백엔드 부재 | High | 커스텀 API 서버 구축 필요 여부 판단 |
