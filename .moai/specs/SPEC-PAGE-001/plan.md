---
id: SPEC-PAGE-001
artifact: plan
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-PAGE-001: 구현 계획서

> Pages + A7A8-CONTENT + A5-PAYMENT 도메인 구현 전략

---

## 1. 구현 개요

### 1.1 범위

후니프린팅 shopby Enterprise 기반 Pages/Content/Payment 도메인의 9개 기능을 4개 Phase로 나누어 구현한다. shopby SKIN 스킨 커스터마이징을 최대한 활용하되, 출력상품 옵션과 수동결제는 CUSTOM 개발로 구현한다.

### 1.2 접근 방식

- **SKIN 우선**: shopby 스킨 시스템의 컴포넌트/섹션 관리를 최대한 활용
- **최소 CUSTOM**: 출력상품 옵션(option_NEW)과 수동결제만 자체 개발
- **PC 우선 설계**: 인쇄 업종 특성상 PC 주문 비중이 높으므로 PC 최적화 후 모바일 대응
- **컴포넌트 재사용**: option_NEW 10개 컴포넌트 타입을 12개 상품 카테고리에 재사용

### 1.3 개발 방법론

DDD (ANALYZE-PRESERVE-IMPROVE) 방식 적용. 기존 Aurora Skin 코드베이스의 상품 상세/메인 페이지 코드가 존재하므로 기존 동작을 보존하면서 점진적으로 개선한다.

---

## 2. 아키텍처 결정사항

### 2.1 3-Tier Hybrid 배치

| Tier | 해당 기능 | 구현 방식 |
|------|----------|----------|
| Tier 1 (NATIVE) | 회사소개, 이용약관, 개인정보보호 | shopby 기본 페이지/약관 관리 |
| Tier 1 (SKIN) | 메인, 서브메인, LIST, 찾아오시는 길, 상품상세(기타상품) | shopby 스킨 커스텀 |
| Tier 2 (CUSTOM) | 상품상세(출력상품 옵션), 수동카드결제 | 자체 개발 |

### 2.2 option_NEW 컴포넌트 아키텍처

- 10개 컴포넌트 타입을 독립 모듈로 개발
- 상품 카테고리별 옵션 구성은 JSON 설정으로 관리
- 종속 옵션 연동은 SPEC-PRODUCT-001의 옵션 엔진 API 활용
- 가격 계산은 SPEC-PRODUCT-001의 가격 매트릭스 API 활용

### 2.3 카카오맵 연동 전략

- 카카오맵 JavaScript SDK v3 사용
- API Key는 환경변수로 관리 (도메인 제한 설정)
- 지도 컴포넌트는 lazy loading으로 초기 로딩 영향 최소화

### 2.4 수동결제 보안 아키텍처

- HTTPS 필수 전송
- CSRF 토큰 적용
- 관리자 세션 인증 확인
- 결제 멱등성 키로 이중 결제 방지
- 결제 로그 전체 기록

---

## 3. 마일스톤 (우선순위 기반)

### Phase 1: 핵심 SKIN 페이지 [Primary Goal]

> 메인 + 상품목록 + 기본 상품상세

| TAG ID | 기능 | 구현 방식 | 크기 | 팀 |
|--------|------|----------|------|-----|
| TAG-PG-001 | 메인 페이지 (히어로배너, 카테고리, 인기/신규상품) | SKIN | M | FE |
| TAG-PG-002 | 상품목록 LIST (정렬, 필터, 페이지네이션) | SKIN | M | FE |
| TAG-PG-003 | 상품상세 - 기타상품 옵션 (SKIN 기본) | SKIN | M | FE |

**완료 기준**: 메인에서 카테고리 클릭 -> LIST -> 상품상세(기타상품) 전체 흐름 동작

### Phase 2: 출력상품 옵션 CUSTOM [Secondary Goal]

> option_NEW 단일 페이지 폼

| TAG ID | 기능 | 구현 방식 | 크기 | 팀 |
|--------|------|----------|------|-----|
| TAG-PG-004 | option_NEW 10개 컴포넌트 타입 개발 | CUSTOM | L | FE |
| TAG-PG-005 | 종속 옵션 연동 (옵션 엔진 API) | CUSTOM | L | FE+BE |
| TAG-PG-006 | 실시간 가격 갱신 (가격 매트릭스 API) | CUSTOM | M | FE+BE |

**완료 기준**: 12개 상품 카테고리별 option_NEW 폼 정상 동작, 종속 옵션/가격 갱신

**의존성**: SPEC-PRODUCT-001 옵션 엔진 + 가격 매트릭스 API 완료 필요

### Phase 3: 콘텐츠 + 서브메인 [Tertiary Goal]

> 정적 콘텐츠 페이지 + 서브메인

| TAG ID | 기능 | 구현 방식 | 크기 | 팀 |
|--------|------|----------|------|-----|
| TAG-PG-007 | 회사소개 (NATIVE) | NATIVE | S | 기획 |
| TAG-PG-008 | 이용약관 + 개인정보보호 (NATIVE) | NATIVE | S | 기획 |
| TAG-PG-009 | 서브메인 랜딩페이지 (기획전) | SKIN | M | FE |

**완료 기준**: 콘텐츠 페이지 정상 노출, 서브메인에서 상품 상세 이동

### Phase 4: 부가 기능 [Optional Goal]

> 찾아오시는 길 + 수동카드결제

| TAG ID | 기능 | 구현 방식 | 크기 | 팀 |
|--------|------|----------|------|-----|
| TAG-PG-010 | 찾아오시는 길 (카카오맵 SDK) | SKIN | S | FE |
| TAG-PG-011 | 수동카드결제 (이니시스 PG API) | CUSTOM | M | BE |

**완료 기준**: 카카오맵 마커/인포윈도우 동작, 수동결제 성공/실패 처리

---

## 4. 기술 접근 방식

### 4.1 메인 페이지 기술 스택

- shopby Aurora Skin 기반 메인 템플릿
- 히어로 배너: shopby 메인배너 컴포넌트 (자동 슬라이드 5초)
- 상품 진열: shopby 상품진열 API (`/display/products`)
- 이미지: WebP 변환 + lazy loading + CDN

### 4.2 option_NEW 기술 스택

- React 컴포넌트 (shopby Aurora Skin 내부)
- 상태 관리: React useState/useReducer (폼 상태)
- API: shopby 상품 옵션 API + CUSTOM 가격 엔진 API
- 종속 옵션: 옵션 변경 시 하위 옵션 목록 재조회
- 가격 계산: 옵션 조합별 가격 매트릭스 실시간 조회

### 4.3 카카오맵 연동

- `@types/kakao.maps` TypeScript 타입
- 카카오맵 SDK 동적 로딩 (lazy load)
- 마커, 인포윈도우, 줌 컨트롤

### 4.4 수동결제

- 이니시스 관리자 결제 API (Server-side)
- 주문번호 기반 결제금액 자동 조회
- 멱등성 키: UUID 기반 중복 결제 방지
- 결제 로그: 일시/금액/처리자/결과 전체 기록

---

## 5. 리스크 및 대응 계획

| 리스크 | 영향도 | 확률 | 대응 방안 |
|-------|-------|------|----------|
| SPEC-PRODUCT-001 옵션 엔진 미완성 | High | Medium | Phase 2 지연, Mock API로 UI 먼저 개발 |
| option_NEW 폼 UX 검증 필요 | Medium | Low | 피그마 프로토타입으로 사전 검증 완료 |
| 카카오맵 API 할당량 초과 | Low | Low | 월 30만건 무료, 트래픽 모니터링 |
| 수동결제 이니시스 API 계약 미완 | Medium | Medium | P3이므로 PG 계약 완료 후 개발 |

---

## 6. 품질 기준

| 항목 | 기준 |
|------|------|
| 테스트 커버리지 | CUSTOM 모듈 85% 이상 |
| LCP | 메인/상품목록: 2.5초 이내 |
| SEO | 전체 페이지 메타 태그 필수 |
| 접근성 | 키보드 네비게이션, alt 텍스트 |
| 코드 품질 | TRUST 5 프레임워크 통과 |
