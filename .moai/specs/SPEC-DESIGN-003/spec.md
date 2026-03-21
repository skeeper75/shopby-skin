---
id: SPEC-DESIGN-003
version: "1.0.0"
status: completed
created: "2026-03-21"
updated: "2026-03-21"
author: MoAI
priority: P1
issue_number: 0
type: design-spec
tags: [design-system, pen-components, consistency, screen-design]
related_specs: [SPEC-PLAN-001, SPEC-SCREEN-001, SPEC-DESIGN-001, SPEC-DESIGN-002, SPEC-MEMBER-001, SPEC-MYPAGE-001, SPEC-ORDER-001, SPEC-CS-001, SPEC-PAGE-001, SPEC-PRODUCT-001, SPEC-STATS-001]
---

# SPEC-DESIGN-003: 화면설계 일관성 통일 및 컴포넌트 표준화

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2026-03-21 | MoAI | 최초 작성 - shared-* 커버리지 분석, 도메인별 컴포넌트 매핑, 작업 계획 |

---

## 1. 개요

### 1.1 배경

Phase A에서 shared-*.pen 4개 파일(tokens, layout, forms, feedback)이 완성되어 38개 이상의 기초 컴포넌트가 구축되었다. 그러나 기존 도메인별 .pen 파일들은 모두 인라인 방식으로 작성되어 있어 일관성이 보장되지 않으며, Pages/Stats 도메인은 .pen 파일 자체가 없다.

### 1.2 목적

1. **도메인별 *-components.pen 표준화**: 각 도메인의 특화 컴포넌트를 reusable로 정의
2. **기존 .pen 파일 일관성 정리**: shared-* 기준으로 인라인 컴포넌트를 검증/수정
3. **Pages 도메인 신규 작성**: SPEC-PAGE-001 기반 15개+ 화면의 .pen 작성
4. **작업 순서 및 의존성 체계화**: 효율적 순차 작업 계획 수립

### 1.3 범위

| 구분 | 포함 | 제외 |
|------|------|------|
| 대상 .pen | member, mypage, order, cs, page, admin-product, stats | product-*-order.pen (완료) |
| 작업 유형 | 컴포넌트 표준화, 일관성 정리, 신규 화면 작성 | 코드 개발, API 설계 |
| 기준 문서 | shared-*.pen, product-components.pen (SSOT) | Figma (이미 반영 완료) |

### 1.4 핵심 제약사항

**[HARD] Pencil 파일 간 ref 불가**
> Pencil 스키마: "You cannot reference components across files"

따라서 shared-*.pen은 **디자인 명세 SSOT**이며, 각 도메인 .pen 파일은 자체적으로 컴포넌트를 reusable로 정의하거나 인라인으로 작성해야 한다.

---

## 2. 현황 분석

### 2.1 shared-* 컴포넌트 인벤토리 (38개)

| 파일 | Section | 컴포넌트 | 수량 |
|------|---------|----------|------|
| shared-tokens.pen | - | 디자인 변수 (9 color + spacing + typography) | 68 vars |
| shared-layout.pen | Layout | Header, Breadcrumb, Footer, Tab, Pagination, KakaoChat, MegaMenu, PageTitle, CategoryListHeader, ProductCard, SectionDivider, MypageSidebar, Accordion, SplitLayout, NotificationBar | ~15 |
| shared-forms.pen | Sec 1-7 | FinishButton(2), Button-Outline/Primary/Dark, TextField, Checkbox(2), RadioButton(2), OptionButton(2), OptionSelect, SelectDropdown-Open, CounterInput, FinishTitleBar(2), FinishSelect, FinishInput, ColorChip(2), MiniColorChip(2), ImageChip(2), LargeColorChip, ColorBadgeSelect, AreaInput, PageCounterInput, QuantitySlider, VolumeDiscountCard | 31 |
| shared-feedback.pen | Sec 1-2 | Badge(추천), Badge-BEST, Badge-NEW, Badge-UP, Callout, HelpIcon, StarRating | 7 |

### 2.2 기존 .pen 파일 현황

| 도메인 | .pen 파일 | reusable 컴포넌트 | 상태 |
|--------|-----------|-------------------|------|
| Member | auth, components, management, registration (4) | 0개 (인라인) | 정리 필요 |
| Mypage | account, activity, components, orders (4) | 0개 (인라인) | 정리 필요 |
| Order | cart, components, upload-flow, admin-billing, admin-file-review, admin-management (6) | 0개 (인라인) | 정리 필요 |
| CS | components, experience, front, admin-board, admin-management (5) | 0개 (인라인) | 정리 필요 |
| Product Admin | components, master, master-2, price, registration (5) | 0개 (인라인) | 정리 필요 |
| Product | product-components (1) | **46개** (SSOT) | 완료 |
| Pages | (없음) | - | **신규 필요** |
| Stats | (없음) | - | **신규 필요** |

### 2.3 도메인별 shared-* 커버율

| 도메인 | shared-* 커버 | 추가 필요 도메인 특화 컴포넌트 |
|--------|--------------|-------------------------------|
| Member | 70% | SNSLoginButton, PhoneVerification, TermsAccordion, PasswordStrength |
| Mypage | 50% | OrderCard, CouponCard, BalanceWidget, TransactionRow, ReviewCard, MemberGradeBar |
| Order | 40% | CartItemCard, DropzoneUploader, FilePreview, ShippingForm, PGWidget, OrderSummaryCard |
| CS | 60% | AccordionFAQ, NoticeListItem, InquiryForm, GuestOrderForm, BulkQuoteForm |
| Pages | 30% | HeroBanner, CategoryGrid, ProductListCard, MapEmbed, LegalDoc, GuideCard, ReviewMasonry |
| Product Admin | 40% | AdminTable, AdminForm, PriceMatrixTable, StockEditor, CategoryTree |
| Stats | 30% | ChartContainer, StatCard, DateRangeSelector, DataTable, ExportButton |

---

## 3. EARS 요구사항

### Module 1: 도메인별 *-components.pen 표준화

**REQ-DS3-001** [Ubiquitous] 컴포넌트 정의 원칙
각 도메인의 *-components.pen 파일은 항상 해당 도메인에서 2회 이상 사용되는 UI 패턴을 reusable 컴포넌트로 정의해야 한다.

**REQ-DS3-002** [Ubiquitous] shared-* 일관성 원칙
도메인 *-components.pen의 공통 컴포넌트(버튼, 입력, 선택 등)는 항상 shared-*.pen의 스펙(크기, 색상, 간격, 폰트)과 일치해야 한다.

**REQ-DS3-003** [Ubiquitous] 디자인 토큰 사용 원칙
모든 *-components.pen 파일은 항상 shared-tokens.pen에 정의된 동일한 9개 색상 변수를 사용해야 한다. 하드코딩 색상은 도메인 특화 요소에만 허용한다.

**REQ-DS3-004** [Ubiquitous] 네이밍 규칙
도메인 특화 컴포넌트는 항상 `CMP-{Domain}-{Name}` 패턴(예: CMP-MYP-OrderCard, CMP-CS-FAQAccordion)을 따라야 한다. shared-*와 동일한 공통 컴포넌트는 원본 이름을 유지한다(예: CMP-TextField).

---

### Module 2: 기존 .pen 일관성 정리

**REQ-DS3-010** [Event-Driven] 일관성 검증 프로세스
WHEN 도메인 .pen 파일의 일관성 정리 작업을 시작하면, THEN 먼저 해당 파일의 모든 폼 요소를 shared-forms.pen 스펙과 비교하고 불일치 항목 목록을 작성해야 한다.

**REQ-DS3-011** [Unwanted] 구조 파괴 금지
시스템은 기존 .pen 파일의 화면 레이아웃 구조를 변경하지 않아야 한다. 컴포넌트 속성(색상, 크기, 간격)의 수정만 허용한다.

**REQ-DS3-012** [State-Driven] 정리 완료 기준
IF 도메인 .pen 파일의 모든 공통 컴포넌트가 shared-*.pen 스펙과 일치하면, THEN 해당 파일을 '정리 완료' 상태로 표시해야 한다.

---

### Module 3: Pages 도메인 신규 작성

**REQ-DS3-020** [Ubiquitous] Pages .pen 파일 구조
Pages 도메인은 항상 다음 .pen 파일로 구성해야 한다:
- page-components.pen: 도메인 특화 reusable 컴포넌트
- page-main.pen: 메인 페이지 화면
- page-list.pen: 상품 목록/검색 결과
- page-content.pen: 회사소개, 약관, 개인정보, 찾아오시는길
- page-guide.pen: 작업 가이드 (11종)

**REQ-DS3-021** [Ubiquitous] Pages 컴포넌트 기준
page-components.pen은 항상 shared-*.pen의 공통 컴포넌트를 기반으로 하되, Pages 도메인 특화 컴포넌트(HeroBanner, CategoryGrid, ProductListCard 등)를 추가 정의해야 한다.

**REQ-DS3-022** [Unwanted] Step Wizard 금지
시스템은 상품 옵션 페이지에서 Step Wizard 패턴을 사용하지 않아야 한다. option_NEW 단일 페이지 스크롤 폼 패턴만 허용한다.

---

## 4. 작업 계획

### Phase 1: 도메인별 *-components.pen 표준화 (5개 도메인)

작업 순서: member → mypage → cs → order → admin-product

| 단계 | 대상 파일 | 작업 내용 | 추가할 도메인 특화 컴포넌트 |
|------|-----------|----------|---------------------------|
| 1-1 | member-components.pen | shared-* 공통 + 도메인 특화 정의 | SNSLoginButton(카카오/네이버), PhoneVerification, TermsAccordion, PasswordStrength, SignUpComplete |
| 1-2 | mypage-components.pen | shared-* 공통 + 도메인 특화 정의 | OrderCard, OrderStatusBadge, CouponCard, BalanceWidget, TransactionRow, ReviewCard, MemberGradeBar, SideMenuActive/Inactive |
| 1-3 | cs-components.pen | shared-* 공통 + 도메인 특화 정의 | FAQAccordion, NoticeListItem, InquiryWriteForm, GuestOrderForm, BulkQuoteForm, DesignConsultForm |
| 1-4 | order-components.pen | shared-* 공통 + 도메인 특화 정의 | CartItemCard, DropzoneUploader, FilePreview, FileValidationAlert, ShippingAddressCard, PGPaymentWidget, OrderSummaryCard, OrderCompleteCard |
| 1-5 | admin-product-components.pen | shared-* 공통 + 도메인 특화 정의 | AdminTable, AdminTableRow, AdminForm, PriceMatrixTable, CategoryTree, StockBadge, AdminSearchBar |

### Phase 2: 기존 화면 .pen 일관성 정리

각 도메인의 *-components.pen 표준화 완료 후, 해당 도메인의 화면 .pen 파일을 순차적으로 정리한다.

| 단계 | 대상 파일 | 검증 항목 |
|------|-----------|----------|
| 2-1 | member-auth.pen, member-registration.pen, member-management.pen | 색상 토큰, 버튼 스펙, 입력 필드 크기, 간격 |
| 2-2 | mypage-orders.pen, mypage-account.pen, mypage-activity.pen | 색상 토큰, 탭 스펙, 카드 레이아웃, 페이지네이션 |
| 2-3 | cs-front.pen, cs-experience.pen, cs-admin-board.pen, cs-admin-management.pen | 색상 토큰, 게시판 리스트, 폼 레이아웃 |
| 2-4 | order-cart.pen, order-upload-flow.pen, order-admin-*.pen | 색상 토큰, 버튼, 테이블 스펙 |
| 2-5 | admin-product-master.pen, admin-product-master-2.pen, admin-product-price.pen, admin-product-registration.pen | 색상 토큰, 관리자 테이블, 폼 |

### Phase 3: Pages 도메인 신규 작성

| 단계 | 대상 파일 | 화면 (SPEC-SCREEN-001 기준) |
|------|-----------|---------------------------|
| 3-0 | page-components.pen | HeroBanner, CategoryGrid, ProductListCard, MapEmbed, LegalDoc, GuideCard, ReviewMasonry, LandingSection |
| 3-1 | page-main.pen | SCR-메인 (히어로배너, 카테고리, 인기/신규 상품, 프로모션, 리뷰) |
| 3-2 | page-list.pen | SCR-LIST (검색결과, 카테고리 필터, 상품 그리드, 정렬) |
| 3-3 | page-content.pen | SCR-A7-ABOUT, TERMS, PRIVACY, DIRECTIONS |
| 3-4 | page-guide.pen | SCR-A8-GUIDE (작업 가이드 목록/상세) |

### Phase 4: Stats 도메인 (후순위)

SPEC-STATS-001 확정 후 진행. 관리자 대시보드/통계 화면.

---

## 5. 수용 기준

### AC-DS3-001: 도메인 *-components.pen 표준화 완료
**Given** 도메인의 *-components.pen 파일이 존재할 때
**When** 해당 파일의 reusable 컴포넌트를 확인하면
**Then** 도메인 특화 컴포넌트가 모두 reusable로 정의되어 있어야 하고, 공통 컴포넌트(버튼/입력/선택)는 shared-*.pen 스펙과 pixel-perfect 일치해야 한다

### AC-DS3-002: 기존 .pen 색상 토큰 통일
**Given** 기존 화면 .pen 파일이 있을 때
**When** 해당 파일의 모든 색상 값을 검사하면
**Then** shared-tokens.pen의 9개 변수($color-primary, $color-text-dark 등)로 100% 대체되어 있어야 한다 (도메인 특화 색상 제외)

### AC-DS3-003: Pages 도메인 .pen 완성
**Given** SPEC-PAGE-001의 화면 목록이 있을 때
**When** designs/ 폴더를 확인하면
**Then** page-components.pen + page-main.pen + page-list.pen + page-content.pen + page-guide.pen 5개 파일이 존재하고, 각 파일에 해당 화면이 포함되어 있어야 한다

### AC-DS3-004: 스크린샷 일관성 검증
**Given** 모든 도메인의 .pen 파일이 정리 완료되었을 때
**When** 동일한 컴포넌트(예: CMP-TextField)를 서로 다른 .pen 파일에서 스크린샷으로 비교하면
**Then** 크기, 색상, 간격, 폰트가 시각적으로 동일해야 한다

---

## 6. 기술 접근

### 6.1 작업 규칙

1. **[HARD] 순차 작업**: .pen 작업은 메인 컨텍스트에서 1파일씩 순차 처리
2. **[HARD] 빈 파일 선저장**: 새 .pen 파일 작업 시 Write("{}")로 먼저 저장 → open_document
3. **[HARD] 스크린샷 검증**: 각 섹션 완료 후 get_screenshot으로 시각 검증
4. **[HARD] product-print-order.pen 기준**: 인쇄 상품 주문 화면이 디자인 일관성의 SSOT

### 6.2 도메인 *-components.pen 구조 표준

```
1. 파일 헤더 (타이틀 + 설명)
2. 디자인 변수 (shared-tokens.pen과 동일한 9개 색상)
3. 공통 컴포넌트 (shared-*에서 복제, reusable=true)
4. 도메인 특화 컴포넌트 (CMP-{Domain}-{Name}, reusable=true)
5. 각 컴포넌트는 default/active/disabled 상태 포함
```

### 6.3 일관성 검증 체크리스트

| 항목 | 기준값 (shared-*.pen) |
|------|----------------------|
| Primary 색상 | $color-primary (#5538B6) |
| 텍스트 색상 | $color-text-dark (#424242) |
| 보조 텍스트 | $color-text-muted (#979797) |
| 테두리 | $color-border (#CACACA) |
| 버튼 높이 | 50px |
| 입력 필드 높이 | 44~50px |
| 모서리 반경 | 4px (폼), 5px (버튼) |
| 폰트 | Noto Sans |
| 기본 글꼴 크기 | 14px |
| 라벨 글꼴 크기 | 16px (500) |

---

## 7. 의존성 맵

```
SPEC-DESIGN-003 (본 문서)
  ├─ 참조: SPEC-PLAN-001 (마스터 기획서, 88개 기능 로드맵)
  ├─ 참조: SPEC-SCREEN-001 (88개 화면 레이아웃 가이드)
  ├─ 입력: shared-*.pen (Phase A 완료, 38개 기초 컴포넌트)
  ├─ 입력: product-components.pen (46개 컴포넌트 SSOT)
  │
  ├─ Phase 1 출력: 5개 도메인 *-components.pen 표준화
  ├─ Phase 2 출력: 19개 기존 .pen 파일 일관성 정리
  ├─ Phase 3 출력: 5개 Pages 도메인 .pen 신규
  └─ Phase 4 출력: Stats 도메인 .pen (SPEC-STATS-001 후행)
```

---

## 8. 추적 매트릭스

| 요구사항 | Phase | 수용기준 | 구현 TAG |
|---------|-------|---------|----------|
| REQ-DS3-001~004 | Phase 1 | AC-DS3-001 | TAG-DS3-001 |
| REQ-DS3-010~012 | Phase 2 | AC-DS3-002 | TAG-DS3-002 |
| REQ-DS3-020~022 | Phase 3 | AC-DS3-003 | TAG-DS3-003 |
| 전체 | Phase 1~3 | AC-DS3-004 | TAG-DS3-004 |
