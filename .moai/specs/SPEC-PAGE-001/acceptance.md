---
id: SPEC-PAGE-001
artifact: acceptance
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-PAGE-001: 수용 기준

> Pages + A7A8-CONTENT + A5-PAYMENT 도메인 인수 테스트 시나리오

---

## 1. 모듈별 수용 기준

### 1.1 모듈 1: 페이지 (Pages)

#### AC-PAGE-001: 메인 페이지 핵심 섹션 노출

```gherkin
GIVEN 사용자가 후니프린팅 메인 페이지에 접속하고
WHEN 페이지가 로딩되면
THEN 히어로 배너, 카테고리 네비게이션, 인기 상품, 신규 상품, 이벤트 영역이 모두 표시되고
AND 히어로 배너가 5초마다 자동 전환된다
```

- 관련 요구사항: REQ-PAGE-001, REQ-PAGE-002, REQ-PAGE-006
- 검증 방법: E2E 테스트 (Playwright)

#### AC-PAGE-002: 카테고리 네비게이션 동작

```gherkin
GIVEN 메인 페이지가 로드되었고
WHEN 사용자가 "인쇄" 카테고리 아이콘을 클릭하면
THEN 인쇄 카테고리 상품목록(LIST) 페이지로 이동하고
AND 좌측 카테고리 트리에 인쇄 하위 카테고리가 표시된다
```

- 관련 요구사항: REQ-PAGE-005, REQ-PAGE-022
- 검증 방법: E2E 테스트

#### AC-PAGE-003: 상품목록 정렬 변경

```gherkin
GIVEN 상품목록(LIST) 페이지가 인기순으로 기본 로드되었고
WHEN 사용자가 정렬 기준을 "가격순"으로 변경하면
THEN 상품 카드가 가격 오름차순으로 즉시 재정렬되고
AND 정렬 드롭다운에 "가격순"이 선택 표시된다
```

- 관련 요구사항: REQ-PAGE-020, REQ-PAGE-021
- 검증 방법: E2E 테스트

#### AC-PAGE-004: 상품 카드 정보 표시

```gherkin
GIVEN 상품목록(LIST) 페이지가 로드되었고
WHEN 상품 카드가 화면에 표시되면
THEN 각 카드에 대표 이미지, 상품명, 기본 가격(최저가), 리뷰 수가 표시되고
AND 대표 이미지는 WebP 포맷으로 로드된다
```

- 관련 요구사항: REQ-PAGE-024, REQ-COMMON-004
- 검증 방법: E2E 테스트 + 이미지 포맷 검증

#### AC-PAGE-005: 출력상품 option_NEW 폼 노출

```gherkin
GIVEN 인쇄 카테고리 상품의 상세 페이지에 접속하고
WHEN 페이지가 로드되면
THEN option_NEW 단일 페이지 스크롤 폼이 표시되고
AND 사이즈, 종이, 인쇄옵션, 코팅, 수량 섹션이 순서대로 노출되고
AND Step Wizard(단계별 마법사) 패턴이 사용되지 않는다
```

- 관련 요구사항: REQ-PAGE-031, REQ-PAGE-033, REQ-PAGE-035
- 검증 방법: E2E 테스트 + UI 패턴 검증

#### AC-PAGE-006: 기타상품 SKIN 옵션 표시

```gherkin
GIVEN 굿즈 카테고리 상품의 상세 페이지에 접속하고
WHEN 페이지가 로드되면
THEN shopby 기본 SKIN 옵션 UI가 표시되고
AND option_NEW 폼이 아닌 표준 옵션 선택 방식이 사용된다
```

- 관련 요구사항: REQ-PAGE-032
- 검증 방법: E2E 테스트

#### AC-PAGE-007: 종속 옵션 연동

```gherkin
GIVEN 출력상품 option_NEW 폼이 표시되고
WHEN 사용자가 사이즈 "A4"를 선택하면
THEN 종이 선택 옵션이 A4에 사용 가능한 종이 목록으로 갱신되고
AND 코팅 옵션이 해당 조합에 가능한 코팅으로 갱신된다
```

- 관련 요구사항: REQ-PAGE-036
- 검증 방법: 통합 테스트 + E2E 테스트

#### AC-PAGE-008: 실시간 가격 갱신

```gherkin
GIVEN 출력상품 option_NEW 폼에서 사이즈 "A4", 종이 "아트지 250g"이 선택되고
WHEN 사용자가 수량을 100에서 200으로 변경하면
THEN 가격 요약 테이블의 금액이 1초 이내에 갱신되고
AND 변경 전후 가격 차이가 명확히 표시된다
```

- 관련 요구사항: REQ-PAGE-034
- 검증 방법: 통합 테스트

#### AC-PAGE-009: 장바구니 담기

```gherkin
GIVEN 로그인 상태에서 출력상품 option_NEW 폼의 모든 필수 옵션이 선택되고
WHEN 사용자가 "장바구니" 버튼을 클릭하면
THEN 선택한 옵션 조합과 가격이 장바구니에 저장되고
AND "장바구니에 담겼습니다" 확인 토스트가 표시된다
```

- 관련 요구사항: REQ-PAGE-037
- 검증 방법: E2E 테스트

#### AC-PAGE-010: 비로그인 주문 시도

```gherkin
GIVEN 비로그인 상태에서 출력상품 옵션을 모두 선택하고
WHEN 사용자가 "바로구매" 버튼을 클릭하면
THEN 로그인 페이지로 이동하고
AND 로그인 후 상품 상세 페이지로 돌아온다
```

- 관련 요구사항: REQ-PAGE-039
- 검증 방법: E2E 테스트

#### AC-PAGE-011: 서브메인 랜딩 페이지

```gherkin
GIVEN 인쇄 카테고리의 서브메인(랜딩) 페이지에 접속하고
WHEN 페이지가 로드되면
THEN 관리자가 등록한 프로모션 이미지가 표시되고
AND 큐레이션 상품 카드를 클릭하면 해당 상품 상세 페이지로 이동한다
```

- 관련 요구사항: REQ-PAGE-010, REQ-PAGE-011, REQ-PAGE-012
- 검증 방법: E2E 테스트

---

### 1.2 모듈 2: 콘텐츠 (Content)

#### AC-CONTENT-001: 회사소개 페이지

```gherkin
GIVEN 사용자가 회사소개 페이지에 접속하고
WHEN 페이지가 로드되면
THEN 회사 개요, 연혁, 보유 장비, 인증서 섹션이 표시되고
AND 관리자가 HTML 편집기로 수정한 내용이 반영되어 있다
```

- 관련 요구사항: REQ-CONTENT-001, REQ-CONTENT-002
- 검증 방법: 수동 테스트

#### AC-CONTENT-002: 이용약관 인쇄 특화 조항

```gherkin
GIVEN 사용자가 이용약관 페이지에 접속하고
WHEN 약관 내용을 확인하면
THEN 인쇄물 색상 차이 면책 조항이 포함되어 있고
AND 파일 보관 기간(30일) 조항이 명시되어 있고
AND 재제작 기준 및 인쇄 불량 판정 기준이 포함되어 있다
```

- 관련 요구사항: REQ-CONTENT-003, REQ-CONTENT-004
- 검증 방법: 수동 테스트 (법무 검토)

#### AC-CONTENT-003: 개인정보보호 위탁 업체

```gherkin
GIVEN 사용자가 개인정보처리방침 페이지에 접속하고
WHEN 위탁 업체 항목을 확인하면
THEN PG사(이니시스), 배송업체, 알림톡(카카오) 업체 목록이 포함되어 있고
AND 수집 항목, 보유 기간, 파기 절차가 명시되어 있다
```

- 관련 요구사항: REQ-CONTENT-005, REQ-CONTENT-006
- 검증 방법: 수동 테스트 (법무 검토)

#### AC-CONTENT-004: 찾아오시는 길 카카오맵

```gherkin
GIVEN 사용자가 찾아오시는 길 페이지에 접속하고
WHEN 페이지가 로드되면
THEN 카카오맵이 후니프린팅 위치에 마커를 표시하고
AND 마커를 클릭하면 회사명, 주소, 전화번호가 인포윈도우에 표시되고
AND 지도 확대/축소/이동이 정상 동작한다
```

- 관련 요구사항: REQ-CONTENT-007, REQ-CONTENT-008, REQ-CONTENT-009
- 검증 방법: E2E 테스트

---

### 1.3 모듈 3: 수동결제 (Manual Payment)

#### AC-PAYMENT-001: 수동결제 접근 제한

```gherkin
GIVEN 일반 사용자(비관리자)가 로그인한 상태에서
WHEN 수동카드결제 페이지 URL에 직접 접근하면
THEN 접근이 거부되고
AND 권한 없음 안내 페이지가 표시된다
```

- 관련 요구사항: REQ-PAYMENT-002, REQ-PAYMENT-007
- 검증 방법: E2E 테스트

#### AC-PAYMENT-002: 수동결제 성공

```gherkin
GIVEN 관리자가 수동카드결제 페이지에 접속하고
AND 주문번호를 입력하여 주문 정보를 조회하고
WHEN 결제금액을 확인하고 결제 버튼을 클릭하면
THEN 이니시스 PG API를 통해 결제가 처리되고
AND 주문 상태가 "결제완료"로 변경되고
AND 결제 확인서가 화면에 표시되고
AND 결제 내역이 로그에 기록된다
```

- 관련 요구사항: REQ-PAYMENT-001, REQ-PAYMENT-003, REQ-PAYMENT-004, REQ-PAYMENT-006
- 검증 방법: 통합 테스트 + E2E 테스트

#### AC-PAYMENT-003: 수동결제 실패 및 재시도

```gherkin
GIVEN 관리자가 수동카드결제를 시도하고
WHEN 결제가 PG 오류로 실패하면
THEN PG 오류 코드와 메시지가 화면에 표시되고
AND "재시도" 버튼이 제공되고
AND 재시도 시 새로운 멱등성 키로 결제가 시도된다
```

- 관련 요구사항: REQ-PAYMENT-005
- 검증 방법: 통합 테스트

---

### 1.4 공통 (Cross-cutting)

#### AC-COMMON-001: SEO 메타 태그

```gherkin
GIVEN 메인, 상품목록, 상품상세, 회사소개 페이지 각각에 접속하고
WHEN 페이지 소스를 확인하면
THEN title, description, og:image 메타 태그가 모두 포함되어 있다
```

- 관련 요구사항: REQ-COMMON-001
- 검증 방법: 자동화 테스트 (메타 태그 크롤링)

#### AC-COMMON-002: 반응형 레이아웃

```gherkin
GIVEN 메인 페이지에 PC(1280px) 화면으로 접속하고
WHEN 브라우저 크기를 768px(태블릿), 375px(모바일)로 순차 변경하면
THEN 각 브레이크포인트에 맞게 레이아웃이 적응적으로 변경되고
AND 콘텐츠 가독성이 유지된다
```

- 관련 요구사항: REQ-PAGE-003, REQ-PAGE-004
- 검증 방법: E2E 테스트 (Playwright viewport 변경)

#### AC-COMMON-003: 페이지 성능

```gherkin
GIVEN 메인 페이지가 프로덕션 환경에 배포되고
WHEN Lighthouse 성능 측정을 실행하면
THEN LCP(Largest Contentful Paint)가 2.5초 이내이고
AND 이미지가 lazy loading으로 로드된다
```

- 관련 요구사항: REQ-COMMON-003, REQ-COMMON-004
- 검증 방법: Lighthouse CI

---

## 2. Definition of Done (DoD)

### 2.1 전체 SPEC 완료 조건

- [ ] 9개 기능 전체 구현 완료
- [ ] 모든 수용 기준(AC) 통과
- [ ] CUSTOM 모듈 테스트 커버리지 85% 이상
- [ ] 전 페이지 LCP 2.5초 이내
- [ ] SEO 메타 태그 전체 적용
- [ ] 반응형 3단(PC/태블릿/모바일) 검증
- [ ] TRUST 5 품질 게이트 통과
- [ ] 코드 리뷰 완료

### 2.2 Phase별 완료 조건

| Phase | 완료 조건 |
|-------|----------|
| Phase 1 | AC-PAGE-001~004, AC-COMMON-001~003 통과 |
| Phase 2 | AC-PAGE-005~010 통과 |
| Phase 3 | AC-CONTENT-001~003, AC-PAGE-011 통과 |
| Phase 4 | AC-CONTENT-004, AC-PAYMENT-001~003 통과 |
