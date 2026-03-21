---
id: SPEC-DESIGN-001
version: "1.0.0"
status: draft
created: "2026-03-19"
updated: "2026-03-19"
author: MoAI
priority: P1
issue_number: 0
tags: [SPEC-DESIGN-001, design-system, component-design, design-tokens, design-first]
related_specs: [SPEC-SCREEN-001, SPEC-LAYOUT-001, SPEC-LAYOUT-002, SPEC-DS-009, SPEC-SKIN-005]
---

# SPEC-DESIGN-001: 후니프린팅 디자인 시스템 확장 및 UI 컴포넌트 디자인

## 1. 개요

SPEC-SCREEN-001(88개 화면 마스터 플랜)에서 도출된 **신규 38개 컴포넌트**의 디자인 및 구현, **45개 도메인별 디자인 토큰** 확장을 수행한다. **디자인-퍼스트** 접근법을 채택하여 Pencil MCP를 활용한 시각 디자인을 선행하고, 디자인 기반으로 React 컴포넌트를 구현한다.

### 범위 요약

| 구분 | 수량 | 설명 |
|------|------|------|
| 신규 디자인 토큰 | 45개 | 6개 카테고리 (주문상태/생산상태/SNS/관리자/z-index/차트) |
| Design System 확장 | 2개 | DateRangePicker, StepIndicator |
| 쇼핑몰 도메인 컴포넌트 | 23개 | 인증 9 + 주문/결제 7 + 인쇄특화 5 + 프린팅머니 3 |
| 관리자 도메인 컴포넌트 | 8개 | 인쇄 생산관리 4 + 공통 표준화 4 |
| 정보/가이드 컴포넌트 | 5개 | 회사소개/지도/법률문서/이미지뷰어/목차 |
| **합계** | **38+45** | |

### 제외 항목 (별도 제작 불필요)

| 컴포넌트 | 이유 |
|----------|------|
| MegaMenuCategories | shopby 기본 카테고리 메가메뉴. CSS 스타일링만 필요 |
| AdminLayout/Sidebar | 이미 완전 구현 (SPEC-SKIN-005) |
| DataTable/SearchBar | 이미 완전 구현, 7+ 페이지에서 재사용 중 |
| PrintConfigurator | 이미 6개 서브컴포넌트 완전 구현 |
| 관리자 도메인 35종 | 상품관리/회계/게시판/쿠폰/회원/통계/거래처 이미 구현 |

### 벤치마크 참조

| 사이트 | 역할 | 참조 포인트 |
|--------|------|-----------|
| **buysangsang.com** | 후니프린팅 현재 사이트 (이전 대상) | UX 패턴, 카테고리 구조, 주문 플로우, 상품 구성 |
| 레드프린팅 | 경쟁사 (모바일=에디터, PC=파일주문) | 디바이스별 주문 분리 전략 |
| Vistaprint | 글로벌 벤치마크 | Wizard 단계형 UI, 파일 업로드 |
| 와우프레스/프린트시티 | 국내 인쇄 경쟁사 | 옵션 선택 UI, 가격 표시 |

### 참조 문서

- `research.md`: 코드베이스 분석, 갭 분석, 토큰 확장 계획
- SPEC-SCREEN-001: 88개 화면 설계 마스터 플랜
- SPEC-DS-009: 기존 토큰 표준화 마이그레이션
- SPEC-LAYOUT-001/002: 반응형 레이아웃 시스템

---

## 2. 핵심 원칙

### [HARD] 디자인-퍼스트 워크플로우

시스템은 **항상** 다음 순서를 따라야 한다:
1. 디자인 토큰 정의 → 2. Pencil 디자인 → 3. React 구현 → 4. 시각 검증

### [HARD] Huni Design Token 사용

시스템은 **항상** `--huni-*` 네이밍 표준을 따라야 한다. `--po-*` deprecated 토큰은 신규 개발에서 사용 금지한다.

### [HARD] Atomic Design 계층 준수

시스템은 **항상** 디자인 시스템 계층을 따라야 한다:
- Atoms: 기본 요소 (토큰 직접 참조)
- Molecules: Atom 조합
- Organisms: Molecule 조합
- 도메인 컴포넌트: Design System 컴포넌트 조합

### [HARD] 기존 컴포넌트 우선 재사용

시스템은 **항상** 기존 Design System 컴포넌트(24종)와 Layout 컴포넌트(4종)를 우선 활용하고, 신규 컴포넌트는 기존 컴포넌트를 조합하여 구성해야 한다.

### [HARD] 태스크별 최적 뷰포트 설계 (buysangsang.com 기반)

시스템은 **항상** 화면의 복잡도에 따라 최적 뷰포트 전략을 적용해야 한다. 인쇄 사이트는 일반 이커머스와 달리 PC 중심 사용 패턴을 가지므로 "모바일 우선"을 맹목적으로 적용하지 않는다.

**PC 우선 (Desktop-first)**: 인쇄 상품 주문, 파일 업로드, 가격 매트릭스, 상품 상세 옵션
- 복잡한 다단계 옵션 선택은 넓은 화면이 필수
- PDF/AI 파일 업로드 및 검증 미리보기는 PC에서 수행
- 모바일에서는 간소화된 주문 또는 PC 전환 안내 제공

**반응형 (양쪽 대응)**: 로그인, 마이페이지, 주문 조회/추적, 고객센터, 공지사항, 상품 목록 탐색
- 모바일에서도 완전한 기능 제공 (단, 레이아웃 적응)

**모바일 특화**: 간편 재주문, 주문 상태 푸시 알림, SNS 로그인

> 참조: buysangsang.com(후니프린팅 현재 사이트)은 데스크톱 중심 레이아웃으로 운영 중이며, 이를 shopby로 이전하는 것이 본 프로젝트의 목표이다. 기존 오로라스킨의 일반 쇼핑몰 형태가 아닌, 인쇄 전문 사이트 UX를 유지해야 한다.

---

## 3. 요구사항

### Module 0: 기존 스킨 정합성 복원 (전수 조사 결과 반영)

> 전수 감사 결과 현재 스킨의 디자인 토큰 적용 일관성이 매우 낮음 (18개 페이지 중 3개만 토큰 일관)

#### REQ-AUDIT-01: 하드코딩 색상 토큰화

**WHEN** 페이지에서 하드코딩된 색상 값이 발견되면 **THEN** 대응하는 `--huni-*` 토큰으로 변환해야 한다.

대상: 12개 페이지, 주요 하드코딩 패턴:
| 하드코딩 | 토큰 | 발견 수 |
|---------|------|---------|
| `#424242` | `--huni-color-text-dark` | 9 페이지 |
| `#5538B6` | `--huni-color-primary` | 8 페이지 |
| `#979797` | `--huni-color-text-muted` | 6 페이지 |
| `#F6F6F6` | `--huni-color-bg-section` | 5 페이지 |
| `#565656` | `--huni-color-text-medium` | 4 페이지 |
| `#CACACA` | `--huni-color-border-default` | 3 페이지 |

#### REQ-AUDIT-02: PageShell 표준화

**WHEN** 쇼핑몰 콘텐츠 페이지를 렌더링할 때 **THEN** 반드시 PageShell 컴포넌트를 사용해야 한다.

현재 상태: 18개 페이지 중 **2개만** PageShell 사용 (Terms, Reviews)
목표: 모든 콘텐츠 페이지에 PageShell 적용

대상 페이지: BulkInquiry, BusinessConsultation, DesignConsultation, AboutUs, Directions, WorkGuide, ExperienceGroup, MemberModification

#### REQ-AUDIT-03: 비표준 너비 통일

**WHEN** 페이지에 `max-w-[숫자px]` 같은 비표준 너비가 사용되면 **THEN** PageShell의 표준 maxWidth prop으로 교체해야 한다.

현재 문제: Directions, WorkGuide, ExperienceGroup이 `max-w-[1200px]` 사용
목표: PageShell maxWidth="xl" (1280px) 또는 적절한 표준 값으로 교체

#### REQ-AUDIT-04: 미정의 CSS 변수 해소 (P0 Critical)

**WHEN** 코드에서 CSS 변수를 참조할 때 **THEN** 반드시 `src/design-system/tokens/`에 해당 변수가 정의되어 있어야 한다.

현재 **23개 CSS 변수**가 30+ 파일에서 사용되지만 토큰 파일에 미정의 상태:

해결 전략 (택1):
- **A. Alias 레이어 추가**: `--huni-text-primary: var(--huni-color-text-dark)` 형태로 호환 alias 생성
- **B. 코드 측 수정**: 미정의 변수를 정의된 토큰으로 일괄 교체
- **C. 혼합**: 자주 사용되는 것은 alias, 소수 사용은 코드 수정

#### REQ-AUDIT-05: Tailwind JIT 위험 패턴 해소

**WHEN** Tailwind 클래스에서 CSS 변수를 참조할 때 **THEN** `bg-[var(--huni-bg-muted)]` 형식(var() 포함)을 사용하거나, `style={{}}` prop을 사용해야 한다.

현재 위험 패턴: `className="bg-[--huni-bg-muted]"` (var() 없이 사용) → 20+ 파일

#### REQ-AUDIT-06: buysangsang.com 구조 매핑

**WHEN** 화면을 설계/구현할 때 **THEN** buysangsang.com의 기존 UX 패턴을 기준으로 참조해야 한다.

매핑 필요 항목:
- 12개 카테고리 → shopby 카테고리 매핑
- 상품 카드 (카테고리 경로 + "부가세 별도" 표시) → shopby ProductThumbItem 확장
- 컨텐츠 최대 너비 1320px → PageShell maxWidth 기준 검토
- hkgroteskpro 폰트 → 브랜드 폰트 최종 결정 필요
- 다크 섹션 배경 → 디자인 토큰 확장 검토

### Module 1: 디자인 토큰 확장

#### REQ-DT-01: 주문 상태 토큰

**WHEN** 주문 상태를 표시할 때 **THEN** 다음 semantic 토큰을 사용해야 한다:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--huni-status-pending` | `var(--huni-yellow-500)` | 입금대기 |
| `--huni-status-confirmed` | `var(--huni-blue-500)` | 결제완료 |
| `--huni-status-processing` | `var(--huni-purple-500)` | 제작중 |
| `--huni-status-shipping` | `var(--huni-orange-500)` | 배송중 |
| `--huni-status-delivered` | `var(--huni-green-500)` | 배송완료 |
| `--huni-status-cancelled` | `var(--huni-red-500)` | 취소 |
| `--huni-status-refunded` | `var(--huni-red-500)` | 반품 |

#### REQ-DT-02: 인쇄 생산 상태 토큰

**WHEN** 인쇄 생산 상태를 표시할 때 **THEN** 다음 토큰을 사용해야 한다:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--huni-production-received` | `#6366F1` | 접수 |
| `--huni-production-file-check` | `#8B5CF6` | 파일접수 |
| `--huni-production-validated` | `#A78BFA` | 파일검수 |
| `--huni-production-ready` | `#3B82F6` | 제작접수 |
| `--huni-production-printing` | `#F59E0B` | 인쇄중 |
| `--huni-production-finishing` | `#F97316` | 후가공 |
| `--huni-production-shipped` | `#10B981` | 출고 |
| `--huni-production-delivering` | `#22C55E` | 배송중 |

#### REQ-DT-03: SNS 브랜드 토큰

**WHEN** SNS 로그인 버튼을 렌더링할 때 **THEN** 각 SNS 공식 브랜드 색상을 사용해야 한다:

| 토큰 | 값 |
|------|-----|
| `--huni-sns-kakao` / `--huni-sns-kakao-text` | `#FEE500` / `#191919` |
| `--huni-sns-naver` / `--huni-sns-naver-text` | `#03C75A` / `#FFFFFF` |
| `--huni-sns-google-bg` / `--huni-sns-google-border` / `--huni-sns-google-text` | `#FFFFFF` / `#DADCE0` / `#3C4043` |
| `--huni-sns-apple` / `--huni-sns-apple-text` | `#000000` / `#FFFFFF` |

#### REQ-DT-04: 관리자 전용 토큰

**WHEN** 관리자 화면을 렌더링할 때 **THEN** 관리자 전용 색상 토큰을 사용해야 한다:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--huni-admin-sidebar-bg` | `var(--huni-gray-900)` | 사이드바 배경 |
| `--huni-admin-sidebar-text` | `var(--huni-gray-0)` | 사이드바 텍스트 |
| `--huni-admin-sidebar-active` | `var(--huni-purple-500)` | 활성 메뉴 |
| `--huni-admin-header-bg` | `var(--huni-gray-0)` | 헤더 배경 |
| `--huni-admin-header-border` | `var(--huni-gray-200)` | 헤더 하단 테두리 |
| `--huni-admin-table-header` | `var(--huni-gray-50)` | 테이블 헤더 |
| `--huni-admin-table-stripe` | `var(--huni-gray-50)` | 테이블 짝수행 |
| `--huni-admin-table-hover` | `var(--huni-purple-50)` | 테이블 호버 |

#### REQ-DT-05: z-index 스케일 토큰

**WHEN** 레이어링이 필요한 UI 요소를 배치할 때 **THEN** 표준 z-index 토큰을 사용해야 한다:

| 토큰 | 값 |
|------|-----|
| `--huni-z-base` | `0` |
| `--huni-z-dropdown` | `100` |
| `--huni-z-sticky` | `200` |
| `--huni-z-drawer` | `300` |
| `--huni-z-modal` | `400` |
| `--huni-z-toast` | `500` |
| `--huni-z-tooltip` | `600` |

#### REQ-DT-06: 차트 팔레트 토큰

**WHEN** 통계 차트를 렌더링할 때 **THEN** 표준 차트 팔레트를 사용해야 한다:

| 토큰 | 값 |
|------|-----|
| `--huni-chart-1` ~ `--huni-chart-6` | Purple, Teal, Gold, Blue, Orange, Green |

---

### Module 2: Design System 컴포넌트 확장

#### REQ-DS-01: DateRangePicker

**WHEN** 사용자가 기간을 선택해야 할 때 **THEN** 시작일/종료일 선택과 빠른 기간 프리셋을 제공해야 한다.

- Props: startDate, endDate, onChange, presets(오늘/1주/1월/3월/직접입력)
- 관리자/쇼핑몰 양쪽에서 재사용 가능
- 기존 DatePicker(관리자) 기능 통합 + 범용화

#### REQ-DS-02: StepIndicator

**WHEN** 다단계 프로세스를 표시할 때 **THEN** 현재 단계, 완료 단계, 대기 단계를 시각적으로 구분해야 한다.

- Props: steps[], currentStep, orientation(horizontal/vertical)
- 모바일: 수직 레이아웃, 데스크톱: 수평 레이아웃
- 인쇄 상품 Wizard(6단계), 주문 추적 타임라인(8단계)에서 사용
- Vistaprint Wizard 패턴 벤치마크

---

### Module 3: 쇼핑몰 도메인 컴포넌트

#### REQ-SHOP-01: 인증 컴포넌트 (9개)

**WHEN** 사용자가 로그인/회원가입 화면을 볼 때 **THEN** 다음 컴포넌트를 제공해야 한다:

1. `LoginForm` - 이메일+비밀번호, 아이디 저장, 로그인 유지
2. `SNSLoginButtons` - 카카오 > 네이버 > 구글 순서, 모바일 전체 너비/데스크톱 550px 카드
3. `FindIdForm` - 휴대폰 SMS 인증 기반
4. `FindPwForm` - 이메일 인증 기반
5. `VerificationInput` - 6자리 입력 + 타이머 카운트다운
6. `SignUpForm` - 이메일/비밀번호/휴대폰 + 사업자 정보 확장
7. `TermsAgreement` - 전체 동의 + 개별 동의, 필수/선택 구분
8. `PhoneVerification` - SMS 인증 요청/확인 플로우
9. `BusinessInfoForm` - 사업자등록번호/상호/대표자 폼

레이아웃: `PageShell maxWidth="lg"` + 카드 스타일 (SPEC-LAYOUT-002)

#### REQ-SHOP-02: 주문/결제 컴포넌트 (7개)

**WHEN** 사용자가 주문/결제 플로우를 진행할 때 **THEN** 다음 컴포넌트를 제공해야 한다:

1. `OrderTrackerTimeline` - 8단계 타임라인 (모바일: 수직, 데스크톱: 수평), WebSocket 실시간 업데이트
2. `DropzoneUploader` - 드래그앤드롭 + 파일 선택, 디자인 있음/없음 토글
3. `FileValidationAlert` - 해상도/CMYK/블리드/서체 실시간 검증 피드백
4. `PreviewRenderer` - PDF/이미지 미리보기 (확대/축소/회전)
5. `CartItemCard` - 인쇄사양 전체 표시 (사이즈/용지/코팅/마감/수량/단가)
6. `PaperSampleCard` - 용지/코팅 시각적 미리보기 카드 (경쟁사 대비 차별화)
7. `QuantityPricingTable` - 수량별 단가 테이블 (단가 포함)

#### REQ-SHOP-03: 프린팅머니 컴포넌트 (3개)

**WHEN** 사용자가 프린팅머니 관련 기능을 사용할 때 **THEN** 다음 컴포넌트를 제공해야 한다:

1. `AccountBalanceWidget` - 잔액 표시 + 충전/사용 내역 링크
2. `TransactionHistory` - 입금/출금/이월 거래 내역 리스트 + 기간 필터
3. `ChargeAmountSelector` - 10,000원 단위 충전 금액 선택 (프리셋 + 직접입력)

#### REQ-SHOP-04: 마이페이지 컴포넌트 (4개)

**WHEN** 사용자가 마이페이지를 볼 때 **THEN** 다음 컴포넌트를 제공해야 한다:

1. `OrderCard` - 주문 카드 (썸네일+상태뱃지+액션버튼), 기간 필터(1/3/6/직접)
2. `SavedOptionCard` - 옵션 보관함 카드 (재주문 버튼, 파일 미리보기)
3. `RealTimePriceWidget` - HuniPriceCalculator 확장 (Sticky + 스크롤 추적, < 500ms 업데이트)
4. `ProductRecommendGrid` - 상품 추천 그리드 (ProductSectionListRouter 기반)

---

### Module 4: 관리자 도메인 컴포넌트

#### REQ-ADMIN-01: 인쇄 생산관리 컴포넌트 (4개)

**WHEN** 관리자가 인쇄 생산 현황을 관리할 때 **THEN** 다음 컴포넌트를 제공해야 한다:

1. `StageKanban` - 접수/검증/인쇄/후가공/출고 5단계 칸반 보드, 카드 드래그앤드롭
2. `QualityChecklist` - 색감/정렬/명확성 검수 체크리스트, 승인/반려 폼
3. `ComparisonViewer` - 원본/출력 파일 나란히 비교 뷰어
4. `WorkerAssignment` - 작업자 배정 드롭다운 + 예상 완료 시간

#### REQ-ADMIN-02: 공통 표준화 컴포넌트 (4개)

**WHEN** 관리자 화면에서 공통 UI 패턴을 적용할 때 **THEN** 다음 표준 컴포넌트를 사용해야 한다:

1. `FilterSection` - AdminLayout 내 검색 필터 영역 표준화 (접기/펼치기, 초기화/조회)
2. `StatusFilterTabs` - 상태별 탭 필터 (건수 뱃지 포함)
3. `DetailDrawer` - OrderDetailPanel을 일반화한 공통 우측 드로어 (640px)
4. `TreeView` - CategoryTree를 일반화한 공통 트리 컴포넌트

---

### Module 5: 정보/가이드 컴포넌트

#### REQ-INFO-01: 정보 페이지 컴포넌트 (5개)

**WHEN** 정보/가이드 페이지를 렌더링할 때 **THEN** 다음 컴포넌트를 제공해야 한다:

1. `TimelineHistory` - 회사 연혁 타임라인 (세로형, 년도+이벤트)
2. `KakaoMap` - 카카오 맵 API 임베드 (마커+교통편 정보)
3. `ImageZoom` - 이미지 확대/축소 (가이드 상세 이미지용)
4. `LegalDocument` - 법률 문서 뷰어 (섹션별 앵커, 목차 연동)
5. `TOCNav` - 목차 네비게이션 (스크롤 위치 기반 하이라이트)

---

## 4. 디자인-퍼스트 워크플로우

### Phase 1: 디자인 토큰 정의 (Module 1)

1. `src/design-system/tokens/` 하위에 토큰 CSS 파일 추가
2. `index.css`에 새 토큰 파일 import 추가
3. Storybook `tokens/` 스토리에 시각화 추가

### Phase 2: 컴포넌트 디자인 (Pencil MCP)

1. 각 컴포넌트의 `.pen` 파일 생성 (모바일 + 데스크톱 뷰)
2. 디자인 토큰 적용 확인
3. 컴포넌트 상태 (default/hover/active/disabled/error) 디자인
4. 사용자 리뷰 및 피드백 수렴

### Phase 3: React 구현

1. 디자인 기반 React 컴포넌트 구현
2. Props 인터페이스 정의
3. Storybook 스토리 작성
4. 반응형 동작 구현

### Phase 4: 시각 검증

1. Pencil 디자인과 React 구현 비교
2. 모바일/데스크톱 양쪽 검증
3. 디자인 시스템 일관성 확인

---

## 5. 추적성

| 태그 | 대상 |
|------|------|
| SPEC-DESIGN-001 | 본 디자인 시스템 확장 SPEC |
| SPEC-SCREEN-001 | 88개 화면 마스터 플랜 (상위 참조) |
| SPEC-DS-009 | 기존 토큰 표준화 |
| SPEC-LAYOUT-001/002 | 반응형 레이아웃 시스템 |
| SPEC-SKIN-005 | 관리자 백오피스 기반 |

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 토큰 45개, 컴포넌트 38개, 5개 모듈 |
| 2026-03-19 | 1.0.1 | 뷰포트 전략 수정 - 모바일 우선 → 태스크별 최적 뷰포트 (buysangsang.com 기반), 벤치마크 참조 추가 |
| 2026-03-19 | 1.1.0 | Module 0 추가 - 기존 스킨 정합성 복원 (전수 감사: 12/18 페이지 하드코딩, PageShell 불일치, buysangsang.com 구조 매핑) |
| 2026-03-19 | 1.2.0 | P0 이슈 추가 - 미정의 CSS 변수 23개(REQ-AUDIT-04), Tailwind JIT 위험 패턴 20+ 파일(REQ-AUDIT-05) |
