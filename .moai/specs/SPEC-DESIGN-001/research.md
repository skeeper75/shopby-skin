---
id: SPEC-DESIGN-001
type: research
tags: [SPEC-DESIGN-001, design-system, component-analysis, design-tokens]
---

# SPEC-DESIGN-001: 디자인 시스템 확장 및 컴포넌트 디자인 리서치

## 1. 분석 개요

SPEC-SCREEN-001(88개 화면 마스터 플랜)에서 참조하는 UI 컴포넌트의 현재 구현 상태를 분석하고, 신규 제작이 필요한 컴포넌트와 디자인 토큰 확장 범위를 도출한다.

### 분석 범위

- **소스 디렉토리**: `src/components/` (75+ 디렉토리), `src/design-system/` (24 컴포넌트)
- **대상 화면**: 쇼핑몰 38개 + 관리자 50개 = 88개 구현 대상
- **참조 SPEC**: SPEC-SCREEN-001, SPEC-LAYOUT-001/002, SPEC-DS-009, SPEC-SKIN-005

---

## 2. 기존 디자인 시스템 현황

### 2.1 디자인 토큰 (8종 파일, `src/design-system/tokens/`)

| 토큰 파일 | 내용 | 네이밍 | 완성도 |
|-----------|------|--------|--------|
| `colors.css` | Huni palette(Purple 50-700, Gray 0-900), Semantic(bg/fg/stroke) | `--huni-color-*`, `--huni-bg-*`, `--huni-fg-*`, `--huni-stroke-*` | 완성 |
| `typography.css` | Noto Sans KR, t1-t10 스케일, weight 3종, leading | `--huni-typo-*` | 완성 |
| `spacing.css` | 4px grid, 0.5-16 스케일 | `--huni-space-*` | 완성 |
| `radius.css` | 0-full 8단계 | `--huni-radius-*` | 완성 |
| `elevation.css` | box-shadow sm-xl 4단계 | `--huni-shadow-*` | 완성 |
| `motion.css` | duration(fast/normal/slow), easing 3종 | `--huni-motion-*` | 완성 |
| `breakpoints.css` | sm(640)/md(768)/lg(1024)/xl(1280) | CSS Variables | 완성 |
| `responsive.css` | clamp() 기반 반응형 타이포그래피 | `.huni-heading-*` | 완성 |

**특이사항**: `--po-*` deprecated 호환 레이어 유지 중 (신규 개발은 `--huni-*` 사용)

### 2.2 Design System 컴포넌트 (24종, Atomic Design)

**Atoms (10종)**: BadgeLabel, Checkbox, Chip, ColorChip, Divider, Icon, InfoTooltip, Radio, Skeleton, Switch

**Molecules (12종)**: CTAButton, CounterOption, DropdownSelect, Field, OptionLabel, Pagination, QuantityInput, RadioOption, SizeInput, SizeOptionChip, Tabs, TextField

**Organisms (4종)**: CollapsibleSection, Dialog, PriceSummary, Snackbar

**유틸리티**: cn(), createSlotRecipeContext, focusRing, pseudo

### 2.3 레이아웃 컴포넌트 (4종, `src/components/Layout/`) - 100% 완성

| 컴포넌트 | 목적 | 주요 Props | fan_in |
|----------|------|-----------|--------|
| `PageShell` | 페이지 컨테이너 (maxWidth, 패딩) | maxWidth(sm~7xl), padding(responsive), as | 20 |
| `ResponsiveGrid` | 반응형 그리드 | cols({mobile,tablet,desktop}), gap | 다수 |
| `SplitLayout` | 좌우 분할 (main 8/12 + aside 4/12) | main, aside, asideSticky, reverse | 3 |
| `FormLayout` | 반응형 폼 (모바일 스택/데스크톱 수평) | children, FormLayout.Row(label, required) | 다수 |

---

## 3. 기존 인쇄 특화 컴포넌트

### 3.1 PrintConfigurator (6 서브 컴포넌트)

| 서브 컴포넌트 | 목적 | 비고 |
|-------------|------|------|
| `SizeSelector` | 사이즈 선택 (A4/A5/A3/B5/맞춤) | 맞춤 시 mm 입력 |
| `PaperSelector` | 용지 선택 (커스텀 드롭다운) | 5가지 옵션 |
| `CoatingSelector` | 코팅 선택 (용지 호환성 검증) | isValidCoatingForPaper |
| `FinishingSection` | 마감 옵션 (복수 선택, 접기/펴기) | 5가지 마감 |
| `CounterInput` | 수량 입력 (+/- 버튼) | 34+155+34px 레이아웃 |
| `OptionChipGroup` | 옵션 칩 그룹 | disabled 지원 |

### 3.2 기타 Huni 컴포넌트

| 컴포넌트 | 목적 | 위치 |
|----------|------|------|
| `HuniPriceCalculator` | 가격 계산 바 (sticky, 모바일 fixed) | `src/components/HuniPriceCalculator/` |
| `HuniBadge` | 상품 뱃지 (NEW/BEST/HOT/SALE) | `src/components/HuniBadge/` |
| `HuniOptionPreview` | 선택 옵션 요약 미리보기 | `src/components/HuniOptionPreview/` |
| `HuniSkeletonCard` | 상품 카드 스켈레톤 | `src/components/HuniSkeletonCard/` |
| `PrintFileUpload` | 인쇄 파일 업로드 | `src/components/PrintFileUpload/` |
| `PrintFilter` | 인쇄 필터 사이드바 | `src/components/PrintFilter/` |

---

## 4. 기존 관리자 컴포넌트 상세 분석

### 4.1 관리자 공통 (11종)

| 컴포넌트 | 목적 | fan_in | 주요 기능 |
|----------|------|--------|----------|
| `AdminLayout` | 관리자 레이아웃 | >=10 | 사이드바+헤더+콘텐츠 |
| `AdminSidebar` | 네비게이션 메뉴 | - | 9개 주메뉴, 서브메뉴 토글 |
| `DataTable` | 데이터 테이블 | 7 | 정렬, 체크박스, 페이징, 행 클릭 |
| `StatusBadge` | 상태 뱃지 | 7 | 11개 상태 → Chip variant |
| `SearchBar` | 검색 바 | - | 디바운스 300ms, HTML 제거 |
| `BulkActionBar` | 일괄 작업 바 | - | 상태변경/출력/SMS |
| `StatCard` | 통계 카드 | - | 아이콘+숫자+라벨 |
| `DatePicker` | 기간 선택 | - | 빠른 기간 선택(오늘/1주/1월/3월) |
| `FilePreview` | 파일 미리보기 | - | PDF/이미지, 확인/재업로드 |
| `OrderDetailPanel` | 주문 상세 패널 | - | 우측 슬라이드인, 5개 섹션 |
| `PrintSheet` | A4 인쇄 레이아웃 | - | @media print, page-break |
| `SMSDialog` | SMS/LMS 발송 | - | 템플릿 5종, 바이트 계산 |

### 4.2 관리자 도메인별 컴포넌트 (이미 존재)

| 도메인 | 컴포넌트 수 | 목록 |
|--------|-----------|------|
| 상품관리 | 10+ | ProductForm(Basic/Options/Defaults), GeneralProductForm, CategoryTree, MaterialSelectPopup, PaperSelectPopup, SizeSelectPopup, PriceBulkImport, PriceMatrixEditor, PricePopup |
| 회계관리 | 4 | InvoicePreview, LedgerForm, LedgerTable, ReceivableStatusChip |
| 게시판 | 4 | BoardList, BoardStatusChip, QuickReplyPanel, ReplyEditor |
| 쿠폰 | 3 | CouponForm, CouponMatchSelector, CouponStatusSwitch |
| 회원 | 4 | ActivityTimeline, MemberDetailDrawer, MemberSearchBar, MoneyAdjustDialog |
| 통계 | 7 | DailyLineChart, DateRangeFilter, KpiCard, ProductStatsTemplate, SalesBarChart, SalesDonutChart, TeamBarChart |
| 거래처 | 3 | VendorForm, VendorGradeChip, VendorTypeFilter |

**결론**: 관리자 영역은 예상보다 훨씬 완성도가 높음 (sub-domain 컴포넌트까지 구현)

---

## 5. MegaMenuCategories 분석

**파일**: `src/components/MegaMenuCategories/MegaMenuCategories.jsx`

**구조**:
- `usePrintCategories()` hook: shopby API 카테고리와 인쇄 카테고리 병합 (fallback 포함)
- `getCategoryUrl()`: 카테고리 URL 생성
- `DesktopPrintMegaMenu`: 데스크톱 메가메뉴 (상위 5개 카테고리 + 서브카테고리 그리드)
- `MobilePrintCategories`: 모바일 아코디언 목록
- `CategoryCard`: 카테고리 아이템 카드

**shopby 의존성**: `useMallStateContext` (높음), `NavigationMenu` UI

**결론**: 별도 컴포넌트 제작 불필요. CSS 스타일링(Huni Design Token)으로 브랜딩만 적용하면 됨.

---

## 6. 컴포넌트 갭 분석 결과

### 6.1 현황 요약

| 구분 | EXISTS | PARTIAL | NEW | 완성도 |
|------|--------|---------|-----|--------|
| 레이아웃 시스템 | 4 | 0 | 0 | **100%** |
| 디자인 시스템 (DS) | 24 | 0 | 2 | **92%** |
| 인쇄 특화 | 10 | 3 | 5 | **56%** |
| 쇼핑몰 기본 | 12 | 0 | 20 | **38%** |
| 관리자 공통 | 12 | 0 | 3 | **80%** |
| 관리자 도메인 | 35 | 0 | 8 | **81%** |
| **합계** | **97** | **3** | **38** | **72%** |

### 6.2 신규 제작 컴포넌트 (38개) - 최종 목록

**Design System 확장 (2개)**:
1. `DateRangePicker` - 기간 선택기 (관리자+쇼핑몰 공통)
2. `StepIndicator` - Wizard 단계 표시기

**쇼핑몰 도메인 (20개)**:
3. `LoginForm` - 로그인 폼
4. `SNSLoginButtons` - SNS 로그인 버튼 세트
5. `FindIdForm` / `FindPwForm` - 아이디/비밀번호 찾기
6. `VerificationInput` - 인증번호 입력 (타이머)
7. `SignUpForm` - 회원가입 폼
8. `TermsAgreement` - 약관 동의 세트
9. `PhoneVerification` - 휴대폰 SMS 인증
10. `BusinessInfoForm` - 사업자 정보 폼
11. `OrderCard` - 주문 카드 (마이페이지)
12. `OrderTrackerTimeline` - 8단계 생산 타임라인
13. `SavedOptionCard` - 옵션 보관함 카드
14. `AccountBalanceWidget` - 프린팅머니 잔액 위젯
15. `TransactionHistory` - 거래 내역 리스트
16. `ChargeAmountSelector` - 충전 금액 선택
17. `DropzoneUploader` - 드래그앤드롭 파일 업로더
18. `FileValidationAlert` - 파일 검증 피드백
19. `PreviewRenderer` - 파일 미리보기 렌더러
20. `CartItemCard` - 인쇄사양 장바구니 카드
21. `PaperSampleCard` - 용지/코팅 시각 미리보기
22. `QuantityPricingTable` - 수량별 단가 테이블

**쇼핑몰 확장 (3개 - 기존 컴포넌트 기반)**:
23. `RealTimePriceWidget` - HuniPriceCalculator 확장 (Sticky + 스크롤 추적)
24. `ProductRecommendGrid` - ProductSectionListRouter 확장
25. `MasonryGrid` - GalleryListPage 확장

**관리자 도메인 (8개)**:
26. `StageKanban` - 인쇄작업 칸반 보드
27. `QualityChecklist` - 품질검수 체크리스트
28. `ComparisonViewer` - 전후 파일 비교 뷰어
29. `WorkerAssignment` - 작업자 배정 UI
30. `FilterSection` - 관리자 공통 필터 섹션 (표준화)
31. `StatusFilterTabs` - 상태별 탭 필터
32. `DetailDrawer` - 관리자 공통 우측 드로어 (OrderDetailPanel 일반화)
33. `TreeView` - 카테고리 트리 뷰 (CategoryTree 일반화)

**정보/가이드 (5개)**:
34. `TimelineHistory` - 회사 연혁 타임라인
35. `KakaoMap` - 카카오 지도 임베드
36. `ImageZoom` - 이미지 확대/축소
37. `LegalDocument` - 법률 문서 뷰어
38. `TOCNav` - 목차 네비게이션

### 6.3 디자인 토큰 확장 필요 항목 (6개 토큰 파일)

| 토큰 분류 | 변수 수 | 용도 |
|-----------|---------|------|
| 주문 상태 (`--huni-status-*`) | 7 | 입금대기/결제완료/배송중/배송완료/취소/반품 등 |
| 인쇄 생산 상태 (`--huni-production-*`) | 8 | 접수/파일접수/파일검수/제작접수/인쇄중/후가공/출고/배송중 |
| SNS 브랜드 (`--huni-sns-*`) | 9 | 카카오/네이버/구글/애플 배경+텍스트 |
| 관리자 전용 (`--huni-admin-*`) | 8 | 사이드바/헤더/테이블 색상 |
| z-index 스케일 (`--huni-z-*`) | 7 | base/dropdown/sticky/drawer/modal/toast/tooltip |
| 차트 팔레트 (`--huni-chart-*`) | 6 | 통계 차트 6색 팔레트 |
| **합계** | **45** | |

---

## 7. 디자인-퍼스트 전략 권장사항

### 7.1 Pencil MCP 활용 워크플로우

```
Phase 1: Token Definition → Pencil에서 컬러 팔레트/타이포 시각화
Phase 2: Component Design → 각 컴포넌트의 .pen 파일 생성
Phase 3: Component Implementation → 디자인 기반 React 코드 구현
Phase 4: Page Assembly → 페이지에 컴포넌트 조합
Phase 5: Visual Validation → Pencil 스크린샷으로 시각 검증
```

### 7.2 디자인 우선순위

**P1 (핵심 구매 여정)**: OrderTrackerTimeline, DropzoneUploader, CartItemCard, StepIndicator, PaperSampleCard
**P2 (인증/마이페이지)**: LoginForm, SNSLoginButtons, AccountBalanceWidget, OrderCard
**P3 (관리자 특화)**: StageKanban, QualityChecklist, FilterSection, StatusFilterTabs
**P4 (정보/가이드)**: TimelineHistory, KakaoMap, LegalDocument

---

---

## 8. buysangsang.com vs 현재 스킨 비교 분석

### 8.1 buysangsang.com 핵심 구조

| 항목 | 값 |
|------|-----|
| 플랫폼 | WooCommerce + Elementor |
| 주 색상 | `rgb(75,63,150)` ≈ #4B3F96 (현재 스킨 #5538B6과 차이) |
| 폰트 | hkgroteskpro (커스텀 폰트) |
| 컨텐츠 최대 너비 | 1320px |
| 배경 | 다크 섹션 사용 (`#0a0a0a`, `#101010`) |
| 메가메뉴 | WooCommerce megaMenu (12개 대분류) |
| 슬라이더 | Revolution Slider (반응형) |
| 상품 카드 | 이미지 + 카테고리 경로 + 가격("부가세 별도") + 장바구니/옵션선택 |
| 프로모션 | BEST SELLERS 탭 필터, 프로모션 ZONE (New Arrival, 할인%) |
| 팝업 | `wd-promo-popup` (프로모션 팝업) |
| 카테고리 | 엽서/스티커/인쇄홍보물/포스터/사인/책자/캘린더/문구/아크릴굿즈/라이프/에코백/포장 |
| 모바일 대응 | 1024px 미만에서 모바일 메뉴 활성화 |

### 8.2 구조적 차이점 및 개선 필요 항목

| 영역 | buysangsang.com | 현재 shopby 스킨 | 개선 방향 |
|------|----------------|-----------------|----------|
| 컨텐츠 너비 | 1320px 고정 | 가변 (4xl~7xl, 1200px 혼재) | 통일 필요 |
| 색상 | #4B3F96 (진보라) | #5538B6 (Huni 보라) | 브랜드 색상 확인 |
| 폰트 | hkgroteskpro | Noto Sans KR | 폰트 결정 필요 |
| 다크 섹션 | 사용 | 미사용 | 다크 모드 토큰 추가 검토 |
| 카테고리 구조 | 12개 대분류 | shopby API 기반 | 매핑 정의 필요 |
| 상품 카드 | 카테고리 경로+부가세 별도 | shopby 기본 | 인쇄 특화 확장 필요 |
| 슬라이더 | Revolution Slider | CustomSlider | 비주얼 일치 검토 |
| 정적 페이지 | Elementor 비주얼 빌더 | React 컴포넌트 | 마이그레이션 전략 |

### 8.3 뷰포트 전략 재정의

buysangsang.com과 레드프린팅 등 인쇄 업계 분석 결과, "모바일 우선"이 아닌 **"태스크별 최적 뷰포트"** 전략이 필요하다:

- **PC 우선**: 인쇄 상품 주문(복잡한 옵션), 파일 업로드, 가격 매트릭스
- **반응형**: 로그인, 마이페이지, 주문 조회, 고객센터
- **모바일 특화**: 간편 재주문, 상태 알림, SNS 로그인

---

## 9. 현재 스킨 전수 감사 결과

### 9.1 페이지별 레이아웃 감사

18개 페이지 중 **PageShell 사용: 2개만** (Terms, Reviews). 나머지는 인라인 `max-w-*` 클래스를 직접 사용.

| 일관성 등급 | 페이지 수 | 해당 페이지 |
|-----------|----------|-----------|
| ✅ 토큰 일관 | 3 | Cart, ProductDetail, OrderSheet |
| ⚠️ 하드코딩 혼재 | 2 | Terms, Reviews |
| ❌ 하드코딩 심각 | 9 | BulkInquiry, BusinessConsult, DesignConsult, AboutUs, Directions, WorkGuide, ExperienceGroup, Admin Login, Admin Dashboard |
| 🔲 미구현/기본 | 4 | Main, DisplayCategoryList, PaperLanding, MemberModification |

### 9.2 색상 하드코딩 패턴 (반복 발견)

| 하드코딩 값 | 대응 토큰 | 발견 페이지 수 |
|-----------|----------|-------------|
| `#424242` | `--huni-color-text-dark` | 9개 |
| `#5538B6` | `--huni-color-primary` | 8개 |
| `#979797` | `--huni-color-text-muted` | 6개 |
| `#F6F6F6` | `--huni-color-bg-section` | 5개 |
| `#565656` | `--huni-color-text-medium` | 4개 |
| `#CACACA` | `--huni-color-border-default` | 3개 |

### 9.3 레이아웃 불일치 패턴

| 문제 | 발생 | 영향 |
|------|------|------|
| PageShell 미사용 | 16/18 페이지 | maxWidth 불일치 |
| 비표준 너비 (`max-w-[1200px]`) | 3 페이지 | Tailwind 표준 외 |
| Plain CSS + Tailwind 혼재 | MemberModification | 유지보수 어려움 |
| Admin `min-w-[1024px]` 강제 | 4 페이지 | 태블릿 미지원 |

### 9.4 토큰 전수 감사 결과 (P0 Critical)

#### 9.4.1 정의되지 않은 CSS 변수 (23개)

코드에서 사용되지만 `src/design-system/tokens/`에 정의되지 않은 변수. 런타임 시 fallback 없이 적용되지 않음.

| 미정의 변수 | 사용 파일 수 | 권장 매핑 |
|-----------|-----------|---------|
| `--huni-text-primary` | 15+ | `--huni-color-text-dark` |
| `--huni-text-secondary` | 15+ | `--huni-color-text-medium` |
| `--huni-text-muted` | 20+ | `--huni-color-text-muted` |
| `--huni-bg-muted` | 17+ | 신규 정의 필요 (`#F9FAFB`) |
| `--huni-bg-hover` | 2 | 신규 정의 필요 |
| `--huni-bg-surface` | 12+ | `--huni-bg-layer-default` |
| `--huni-border-subtle` | 2 | `--huni-stroke-neutral-weak` |
| `--huni-color-error` | 8+ | `--huni-fg-critical` |
| `--huni-fg-default` | 10+ | `--huni-fg-neutral` |
| `--huni-fg-muted` | 5+ | `--huni-fg-neutral-subtle` |
| `--huni-stroke-default` | 20+ | `--huni-stroke-neutral-muted` |
| `--huni-font-size-xs~xl` | 20~30+ | `--huni-typo-size-t1~t6` |
| `--huni-font-weight-semibold` | 10+ | `--huni-typo-weight-medium` |
| `--huni-spacing-xs~xl` | 15~30+ | `--huni-space-1~8` |
| `--huni-radius-xs~md` | 5~40+ | `--huni-radius-0_5~2` |

#### 9.4.2 Tailwind JIT 위험 패턴 (20+ 파일)

`className="bg-[--huni-bg-muted]"` 패턴이 Tailwind JIT 컴파일 시 동적 CSS 변수를 인식 못할 수 있음.

영향 파일: OrderSheet, VendorPage, Members, Chip, OptionActions, PrintFileUpload 등 20+

권장: `style={{ background: 'var(--huni-bg-muted)' }}`로 변경 또는 Tailwind `@apply` 유틸리티 사전 정의

#### 9.4.3 하드코딩 색상 (30+ 인스턴스)

주요 영향 파일:
- `MemberDetailDrawer.jsx`: 상태별 색상 13개 (`#fef3c7`, `#d1fae5`, `#fee2e2` 등)
- `MemberPage.jsx`: 등급별 색상 6개
- `ActivityTimeline.jsx`: 활동 유형별 4개 (`#10b981`, `#f59e0b` 등)
- `SalesBarChart.jsx`, `DailyLineChart.jsx`: 차트 색상
- Admin 페이지 전반: `#fff` 하드코딩 다수

#### 9.4.4 Admin 인라인 스타일 (600+)

MemberDetailDrawer(85+), BoardList(60+), QuickReplyPanel(80+), MemberPage(40+) 등 관리자 컴포넌트에서 인라인 `style={{}}` 사용이 심각함.

### 9.5 개선 우선순위

**P1 (즉시)**:
- 모든 페이지에 PageShell 적용 표준화
- 반복 하드코딩 색상 → `--huni-*` 토큰으로 전환

**P2 (단기)**:
- ResponsiveGrid/SplitLayout/FormLayout 적용 확대
- 비표준 너비(`[1200px]`) → 표준 breakpoint 전환

**P3 (장기)**:
- MemberModification Plain CSS → Tailwind 전환
- Admin 태블릿 대응 개선

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초기 리서치 - 코드베이스 분석, 갭 분석, 토큰 확장 계획 |
| 2026-03-19 | 1.1.0 | buysangsang.com 비교 분석, 페이지별 전수 감사, 뷰포트 전략 재정의 추가 |
