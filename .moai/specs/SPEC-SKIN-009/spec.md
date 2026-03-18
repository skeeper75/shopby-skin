---
id: SPEC-SKIN-009
version: 1.0.0
status: completed
created: 2026-03-18
updated: 2026-03-18
author: 지니
priority: P1
issue_number: 0
title: "shopby 관리자페이지 Playwright 자동 분석 및 기능 매트릭스"
---

# SPEC-SKIN-009: shopby 관리자페이지 Playwright 자동 분석 및 기능 매트릭스

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-03-18 | 지니 | 초기 SPEC 작성 |

---

## Environment (환경)

### 기술 스택

| 항목 | 현재 | 추가/변경 |
|------|------|-----------|
| 프레임워크 | React 18.2 | 유지 |
| 분석 도구 | - | Playwright 1.50+ |
| 스크린캡처 | - | Playwright screenshot API |
| 데이터 추출 | - | Playwright DOM selectors |

### 분석 대상

- **URL**: `$SHOPBY_ADMIN_URL` (https://service.shopby.co.kr/)
- **인증**: `$SHOPBY_ADMIN_ID` / `$SHOPBY_ADMIN_PW` (환경 변수)
- **예상 페이지 수**: 80~120 페이지 (12개 카테고리)
- **참조 문서**: `ref/shopby/shopby_enterprise_docs/` (160+ mdx 파일)

### 관련 SPEC

- SPEC-SKIN-005: 관리자 기반 및 주문관리 (완료)
- SPEC-SKIN-006: 관리자 상품관리 (부분 구현)
- SPEC-SKIN-007: 관리자 게시판/회원/쿠폰 (부분 구현)
- SPEC-SKIN-008: 관리자 거래처/원장/통계 (완료)

---

## Assumptions (가정)

### 기술적 가정

- [A1] shopby 관리자 페이지가 SPA(Single Page Application)로 구성되어 있으며, Playwright로 렌더링 후 DOM 접근이 가능하다
- [A2] 사이드바 메뉴에서 모든 하위 페이지 URL을 프로그래밍적으로 추출할 수 있다
- [A3] 로그인 세션이 크롤링 도중 만료되지 않는다 (또는 재인증 처리 가능)
- [A4] 환경 변수로 설정된 계정이 모든 관리자 메뉴에 접근 권한을 갖고 있다

### 비즈니스 가정

- [A5] shopby Native 관리자 UI를 그대로 사용할 수 있는 영역은 별도 Skin 개발이 불필요하다
- [A6] 인쇄업 특화 기능(가격 매트릭스, 마스터 데이터, 원장 등)만 커스텀 개발이 필요하다
- [A7] 이 분석 결과가 향후 개발 우선순위와 범위 결정의 기준이 된다

---

## Requirements (요구사항)

### R1: Playwright 관리자 페이지 자동 크롤러 [Event-Driven] — P1

**WHEN** 분석 스크립트가 실행될 때,
**THEN** 시스템은 shopby 관리자 페이지에 자동 로그인하고, 사이드바 메뉴를 탐색하여 모든 접근 가능한 페이지의 URL을 수집해야 한다.

**상세 요구사항:**

- [R1.1] 환경 변수(`$SHOPBY_ADMIN_URL`, `$SHOPBY_ADMIN_ID`, `$SHOPBY_ADMIN_PW`)를 사용하여 자동 로그인한다
- [R1.2] 사이드바 메뉴를 순회하여 모든 메뉴 항목과 URL을 추출한다
- [R1.3] 1depth/2depth/3depth 메뉴 구조를 JSON으로 저장한다
- [R1.4] 수집된 URL 목록을 `ref/shopby/admin-analysis/menu-map.json`에 저장한다
- [R1.5] 로그인 실패 시 재시도(최대 3회) 후 에러 보고한다

### R2: 전체 페이지 스크린캡처 [Event-Driven] — P1

**WHEN** 메뉴 맵이 수집된 후,
**THEN** 시스템은 각 페이지를 방문하여 풀 페이지 스크린샷을 카테고리별 디렉토리에 저장해야 한다.

**상세 요구사항:**

- [R2.1] 각 페이지를 방문하여 로딩 완료 후(networkidle) 풀 페이지 스크린샷을 캡처한다
- [R2.2] 스크린샷을 카테고리별 디렉토리에 저장한다: `ref/shopby/admin-screenshots/{category}/{page-name}.png`
- [R2.3] 페이지당 최대 30초 타임아웃을 설정하고, 실패 시 스킵하고 로그에 기록한다
- [R2.4] 스크린샷 해상도는 1920x1080 뷰포트 기준으로 한다
- [R2.5] 드롭다운, 모달 등 인터랙티브 요소가 있는 페이지는 기본 상태의 스크린샷만 캡처한다
- [R2.6] 진행률을 콘솔에 출력한다 (예: `[15/120] 상품관리 > 상품목록 캡처 완료`)

### R3: DOM 구조 분석 및 기능 추출 [Event-Driven] — P1

**WHEN** 각 페이지를 방문할 때,
**THEN** 시스템은 페이지의 DOM 구조를 분석하여 주요 UI 요소(폼, 테이블, 버튼, 탭 등)를 추출하고 JSON으로 저장해야 한다.

**상세 요구사항:**

- [R3.1] 각 페이지에서 다음 요소를 추출한다:
  - 페이지 제목 (h1, h2, breadcrumb)
  - 검색 폼 필드 (input, select, date picker)
  - 데이터 테이블 컬럼 헤더
  - 액션 버튼 (등록, 수정, 삭제, 엑셀 다운로드 등)
  - 탭 네비게이션
  - 모달/팝업 트리거
- [R3.2] 추출 결과를 `ref/shopby/admin-analysis/pages/{category}/{page-name}.json`에 저장한다
- [R3.3] 각 JSON에 페이지 URL, 제목, 카테고리, 추출 타임스탬프를 포함한다

### R4: 기능 매트릭스 생성 [State-Driven] — P1

**IF** 모든 페이지 분석이 완료된 상태라면,
**THEN** 시스템은 shopby 문서(`ref/shopby/shopby_enterprise_docs/`)와 실제 페이지 분석 결과를 대조하여 기능 매트릭스를 생성해야 한다.

**상세 요구사항:**

- [R4.1] 각 기능에 대해 다음을 분류한다:
  - **NATIVE**: shopby 관리자 UI를 그대로 사용 (개발 불필요)
  - **SKIN**: Skin 레벨 커스터마이징만 필요 (경량 개발)
  - **CUSTOM**: 별도 UI/API 개발 필요 (중량 개발)
  - **SKIP**: 인쇄업에 불필요한 기능 (개발 제외)
- [R4.2] 기능 매트릭스를 `ref/shopby/admin-analysis/feature-matrix.md`에 저장한다
- [R4.3] 각 분류에 대한 근거(스크린샷 참조, 문서 참조)를 명시한다
- [R4.4] 현재 SPEC-SKIN-005~008과의 중복/갭을 식별한다

### R5: 개발 권고안 및 우선순위 문서 [Event-Driven] — P2

**WHEN** 기능 매트릭스가 완성된 후,
**THEN** 시스템은 개발 필요/불필요 영역에 대한 권고안과 우선순위를 문서화해야 한다.

**상세 요구사항:**

- [R5.1] NATIVE/SKIP으로 분류된 기능 목록 — "개발하지 않아도 되는 기능"
- [R5.2] CUSTOM으로 분류된 기능 목록 — "반드시 개발해야 하는 기능"
- [R5.3] SKIN으로 분류된 기능 목록 — "경량 커스터마이징이 필요한 기능"
- [R5.4] 현재 SPEC-SKIN-005~008에서 중복 구현된 영역 식별
- [R5.5] 향후 SPEC 작성이 필요한 영역 제안
- [R5.6] 결과를 `ref/shopby/admin-analysis/recommendations.md`에 저장한다

---

## Specifications (명세)

### 기술 스택

| 패키지 | 버전 | 용도 |
|--------|------|------|
| @playwright/test | 1.50+ | 브라우저 자동화 |
| playwright | 1.50+ | 크롤링/스크린캡처 |

### 디렉토리 구조

```
scripts/
  admin-analyzer/
    crawl.js          — 메인 크롤러 스크립트
    login.js          — 로그인 모듈
    screenshot.js     — 스크린캡처 모듈
    dom-analyzer.js   — DOM 분석 모듈
    feature-matrix.js — 기능 매트릭스 생성
ref/shopby/
  admin-screenshots/
    product/          — 상품관리 스크린샷
    order/            — 주문관리 스크린샷
    claim-order/      — 클레임관리 스크린샷
    member/           — 회원관리 스크린샷
    promotion/        — 프로모션관리 스크린샷
    management/       — 운영관리 스크린샷
    statistic/        — 통계 스크린샷
    service/          — 서비스관리 스크린샷
    appearance/       — 전시관리 스크린샷
    partner/          — 파트너관리 스크린샷
  admin-analysis/
    menu-map.json     — 전체 메뉴 구조
    feature-matrix.md — 기능 매트릭스
    recommendations.md — 개발 권고안
    pages/            — 페이지별 DOM 분석 JSON
```

### 스코프

**포함:**

- shopby 관리자 페이지 전체 크롤링 및 스크린캡처
- DOM 구조 분석 및 기능 요소 추출
- 문서 대조 기반 기능 매트릭스 생성
- 개발 필요/불필요 영역 권고안

**제외:**

- shopby API 엔드포인트 직접 테스트 (별도 SPEC)
- 관리자 페이지 커스텀 UI 구현 (분석 결과 기반 후속 SPEC)
- 쇼핑몰 프론트엔드(구매자 화면) 분석 (별도 SPEC)

### 의존성 관계

```
R1 (크롤러/메뉴 수집)
  ├── R2 (스크린캡처) — R1의 URL 목록 기반
  ├── R3 (DOM 분석) — R1의 URL 목록 기반
  │
  └── R4 (기능 매트릭스) — R2, R3 결과 + 문서 대조
        └── R5 (권고안) — R4 결과 기반
```

---

## Constraints (제약사항)

- [C1] 환경 변수에 저장된 자격 증명만 사용한다 — 코드에 하드코딩 금지
- [C2] 스크린샷 파일은 `.gitignore`에 추가하여 Git에 포함하지 않는다
- [C3] 크롤링 속도는 페이지당 최소 2초 간격으로 서버 부하를 방지한다
- [C4] 분석 결과(JSON, MD)만 Git에 커밋한다 — 스크린샷은 로컬 참조용
- [C5] Playwright는 headless 모드로 실행한다 (CI/CD 호환)

---

## Traceability (추적성)

| TAG | 요구사항 | plan.md | acceptance.md |
|-----|----------|---------|---------------|
| SPEC-SKIN-009-R1 | Playwright 크롤러 | Phase 1 | AC-R1-* |
| SPEC-SKIN-009-R2 | 스크린캡처 | Phase 1 | AC-R2-* |
| SPEC-SKIN-009-R3 | DOM 분석 | Phase 1 | AC-R3-* |
| SPEC-SKIN-009-R4 | 기능 매트릭스 | Phase 2 | AC-R4-* |
| SPEC-SKIN-009-R5 | 개발 권고안 | Phase 2 | AC-R5-* |
