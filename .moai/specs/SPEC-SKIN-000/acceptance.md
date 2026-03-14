# SPEC-SKIN-000: 마스터 플랜 - 인수 조건

> **SPEC ID**: SPEC-SKIN-000
> **문서 유형**: 인수 조건 (acceptance.md)

## 1. Phase 1 완료 조건

### Given-When-Then

**Scenario: Phase 1 쇼핑몰 사용자 플로우 완성**
- **Given** 모든 Phase 1 SPEC (001~004)이 구현되었을 때
- **When** 사용자가 회원가입 → 로그인 → 상품탐색 → 주문 → 결제를 수행하면
- **Then** 전체 구매 여정이 정상 동작해야 한다

## 2. Phase 2 완료 조건

**Scenario: Phase 2 관리자 백오피스 완성**
- **Given** 모든 Phase 2 SPEC (005~008)이 구현되었을 때
- **When** 관리자가 주문확인 → 파일검수 → 상태변경 → 배송처리를 수행하면
- **Then** 전체 운영 플로우가 정상 동작해야 한다

## 3. 품질 게이트

- [ ] 모든 페이지 Mobile/Desktop 반응형 동작
- [ ] Huni 디자인 토큰 일관 적용
- [ ] Shopby API 연동 정상 동작
- [ ] 주요 사용자 시나리오 E2E 테스트 통과
