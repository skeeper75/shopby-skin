---
id: SPEC-SCREEN-001
version: "2.0.0"
status: in-review
created: "2026-03-19"
updated: "2026-03-19"
author: MoAI
priority: P1
issue_number: 0
tags: [SPEC-SCREEN-001, master-plan, screen-design, responsive, printing]
related_specs: [SPEC-LAYOUT-001, SPEC-LAYOUT-002, SPEC-SKIN-004, SPEC-SKIN-005, SPEC-MASTERPLAN-001]
---

# SPEC-SCREEN-001: 후니프린팅 리뉴얼 전체 화면 설계 마스터 플랜

## 1. 개요

후니프린팅 리뉴얼 프로젝트의 **전체 화면 설계 마스터 플랜**이다. 전체 95개 기능 중 **25개 회색 영역(shopby 기본 제공으로 커스터마이징 불필요)을 제외**한 **88개 기능**에 대한 화면 설계 가이드를 제공하며, 각 화면의 shopby 분류(NATIVE/SKIN/CUSTOM/EXTERNAL), 우선순위, 개발 규모, 레이아웃 전략, 핵심 UI 컴포넌트, 벤치마크 참조를 정의한다.

본 SPEC은 개별 화면 구현 SPEC의 상위 참조 문서로서, `/moai:2-run`에서 개별 SPEC 단위로 구현될 때 화면별 설계 가이드라인을 제공한다.

### 기능 범위 요약

| 구분 | 전체 | 제외(회색) | 구현 대상 |
|------|------|-----------|----------|
| 쇼핑몰(A) | 50개 | 12개 | **38개** |
| 관리자(B) | 45개 | 13개 | **50개** |
| **합계** | **95개** | **25개** | **88개** |

> 회색 제외 기준: shopby 기본 제공 기능 중 스킨 커스터마이징 없이 그대로 사용 가능한 항목 (관리자 등록/관리, 약관 관리, 운영자 설정, 기본 게시판 CRUD 등)

### 참조 문서

- `research.md`: 코드베이스 현황, shopby API 역량, 벤치마크 종합 리서치
- `skin-vs-headless-analysis.md`: Aurora Skin vs Headless 전략 의사결정 보고서
- `ecommerce-erp-screen-patterns.md`: 이커머스/ERP 화면 UI/UX 패턴 리서치
- `shopby-admin-screen-analysis.md`: shopby 관리자 화면 구성요소 분석
- `SPEC-LAYOUT-001`: 반응형 레이아웃 시스템 (PageShell, ResponsiveGrid, SplitLayout, FormLayout)
- `SPEC-LAYOUT-002`: 시각 검증 기반 레이아웃 개선
- `SPEC-SKIN-004`: 고객센터/정보/마케팅 화면
- `SPEC-SKIN-005`: 관리자 백오피스 기반

---

## 2. 아키텍처 결정: Hybrid 전략

### 결정 사항

**권장안: Hybrid 전략 유지 (Aurora Skin + CUSTOM 독립 모듈)**

가중 평가 결과 Hybrid(7.55) > Skin 유지(7.05) > Headless 전환(6.45)으로 Hybrid 전략이 최고 점수를 기록했다.

### 핵심 근거

1. **기존 자산**: 308개 파일, ~59,000줄의 JSX 코드가 Aurora Skin 기반으로 동작 중
2. **CSS 충돌 경미**: `!important` 사용 7건(2개 파일)에 불과, 모두 레이아웃 너비 조정
3. **CUSTOM 독립성**: 인쇄 특화 25개 기능은 shopby와 무관하게 독립 모듈로 설계
4. **전환 비용**: Headless 전환 시 60개 화면 재구축 필요 (4~6주 추가 소요)

### 3-Tier 아키텍처

```
쇼핑몰 NATIVE/SKIN (53개 화면)
  --> Aurora Skin 유지
  --> PageShell/ResponsiveGrid 레이아웃 통일
  --> shopby Provider + API 래퍼 활용
  --> CSS 오버라이드는 @MX:WARN으로 관리

인쇄 특화 CUSTOM (25개 화면)
  --> 완전 독립 모듈
  --> Tailwind CSS + Radix UI
  --> 커스텀 API (NestJS BFF + AWS S3 + PitStop)
  --> shopby 의존성 제로

관리자 백오피스 (35개 화면)
  --> Tailwind CSS + shadcn/ui 패턴
  --> AdminLayout 독자 체계 (SPEC-SKIN-005)
  --> shopby Server API 직접 호출
```

### 장기 전환 옵션 (Exit Strategy)

향후 필요 시 점진적 Headless 전환 경로가 열려 있다:
- Phase 1 (현재): Aurora Skin으로 빠르게 런칭
- Phase 2 (런칭 후 6개월): 트래픽 데이터 기반 SEO 필요성 재평가
- Phase 3 (필요 시): 트래픽 높은 페이지부터 Next.js SSR로 점진 전환

> 상세 분석: `skin-vs-headless-analysis.md` 참조

---

## 3. 핵심 원칙

### [HARD] shopby NATIVE 기능 제약

시스템은 **항상** shopby NATIVE 기능에 대해 스킨 커스터마이징만 수행해야 한다. shopby Core API 변경, DB 스키마 변경, PG 변경은 금지된다.

- 가능: 레이아웃 변경, 컴포넌트 재배치, 데이터 변환, 유효성 검사 추가
- 불가: Core API 변경, DB 스키마 변경, PG 변경

### [HARD] 모바일 우선 설계

시스템은 **항상** 모바일(375px)을 기본으로 설계하고, `lg+(1024px)` 브레이크포인트에서 데스크톱으로 확장해야 한다.

- 브레이크포인트: sm(640px), md(768px), lg(1024px), xl(1280px)
- 터치 타겟: 최소 44x44px
- 데스크톱 확장: `lg:` prefix로 레이아웃 변경

### [HARD] SPEC-LAYOUT-001/002 레이아웃 시스템 준수

시스템은 **항상** 기존 레이아웃 컴포넌트를 사용해야 한다.

- `PageShell`: 모든 페이지 컨테이너 (maxWidth 4xl~7xl, 반응형 패딩)
- `ResponsiveGrid`: 뷰포트별 컬럼 수 자동 조정
- `SplitLayout`: main 8/12 + aside 4/12 (데스크톱 lg+ 활성화)
- `FormLayout`: 모바일 스택 / 데스크톱 수평 배치

### [HARD] 디자인 토큰 통일

시스템은 **항상** `src/design-system/tokens/`의 표준 토큰을 사용해야 한다.

- breakpoints.css: 반응형 기준점
- responsive.css: clamp() 기반 타이포그래피
- 관리자 영역: Tailwind CSS + Huni Design Tokens (브랜드 컬러 #5538B6)

---

## 4. 미결정 정책 기본값

**IF** 아래 정책이 미결정 상태라면 **THEN** 다음 **권장 기본값**을 적용하고 추후 변경 가능하도록 설계해야 한다. 정책 결정 대기 없이 구현을 진행한다.

### 4.1 배송비 정책

| 항목 | 권장 기본값 | 설정 위치 | 비고 |
|------|-----------|----------|------|
| 무료배송 기준 금액 | **100,000원 이상 무료** | 환경변수/설정 | 인쇄업 특성상 높은 기준 |
| 기본 배송비 | **3,000원** | 환경변수/설정 | 업계 표준 |
| 제주/도서산간 추가비 | **제주 5,000원 추가** | 환경변수/설정 | 인쇄물 무게 반영 |
| 퀵배송 옵션 | 미제공 (추후 확장) | - | 1순위 제외 |
| 분할배송 허용 | 불가 | - | 인쇄물 특성 |
| 해외배송 | 미지원 | - | 국내 전용 |

### 4.2 결제 정책

| 항목 | 권장 기본값 | 설정 위치 | 비고 |
|------|-----------|----------|------|
| PG사 | **이니시스** | shopby 설정 | shopby 기본 지원 |
| 간편결제 | **카카오페이 --> 네이버페이 --> 토스페이** 순차 도입 | PG 설정 | 사용률 기반 우선순위 |
| 후불결제 한도 | 거래처별 설정 (기본 500만원) | 관리자 설정 | B2B 전용 |
| 선불충전 단위 | 10,000원 단위 | 환경변수 | |
| 최소충전 금액 | 10,000원 | 환경변수 | |
| 수동카드결제 | 관리자 전용 | 권한 설정 | PCI-DSS 준수 |
| 프린팅머니 유효기간 | 무기한 | 설정 | 추후 변경 가능 |

### 4.3 쿠폰 정책

| 항목 | 권장 기본값 | 설정 위치 | 비고 |
|------|-----------|----------|------|
| 신규가입 쿠폰 | **10,000원** (50,000원 이상 주문 시) | 프로모션 설정 | 첫 주문 유도 |
| 리뷰 쿠폰 | **5,000원** | 프로모션 설정 | 리뷰 활성화 |
| 동시 사용 가능 쿠폰 | **최대 3개** | 결제 로직 | |
| 쿠폰 중복 사용 | 불가 (1주문 1쿠폰 유형) | 결제 로직 | |
| 쿠폰+프린팅머니 동시 | 허용 | 결제 로직 | |
| 자동 발급 | 수동 발급만 (1차) | 프로모션 설정 | |
| 생일/등급별/추천인 쿠폰 | 미제공 (1차) | - | 추후 확장 |
| 카테고리 제한 쿠폰 | 미제공 (1차) | - | 추후 확장 |
| 최소 주문금액 | 쿠폰별 설정 | 프로모션 설정 | |
| 최대 할인금액 | 쿠폰별 설정 | 프로모션 설정 | |

### 4.4 리뷰 정책

| 항목 | 권장 기본값 | 설정 위치 | 비고 |
|------|-----------|----------|------|
| 리뷰 노출 | **즉시 노출** (관리자 사후 검수) | 게시판 설정 | 빠른 피드백 |
| 리뷰 작성 보상 | **5,000원 쿠폰** | 프로모션 연동 | 프린팅머니 대신 쿠폰 |
| 포토리뷰 추가 보상 | 일반 리뷰와 동일 (1차) | - | 추후 차등 |
| 리뷰 삭제 시 보상 | **자동 회수** | 적립금 로직 | |
| 리뷰 작성 기간 | 배송완료 후 **30일** | 게시판 설정 | |
| 리뷰 수정/삭제 | 1회 수정 가능, 삭제 가능 | 게시판 설정 | |

---

## 5. 전체 화면 인벤토리

### 5.1 화면 분류 기준 (88개 구현 대상)

| 분류 | 설명 | 개수 | 구현 전략 |
|------|------|------|----------|
| NATIVE | shopby 기본 제공 + 스킨 래핑 | 28개 | PageShell 래핑 + 반응형 스타일 오버라이드 |
| SKIN | shopby API + 커스텀 UI | 25개 | shopby Provider 활용 + 인쇄 특화 컴포넌트 |
| CUSTOM | 전체 커스텀 개발 | 33개 | 독립 모듈 (파일업로드, 가격엔진, 보관함 등) |
| EXTERNAL | 외부 서비스 연동 | 2개 | 외부 SDK/API 연동 |

---

### A. 쇼핑몰 화면 (~38개 구현 대상)

#### A-1. 로그인/회원 (6 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A1-LOGIN | 일반 로그인 | NATIVE | 1순위 | S | FE | `POST /auth/token` | PageShell maxWidth="lg" + 카드 스타일 (SPEC-LAYOUT-002) | LoginForm, SNSLoginButtons | shopby 기본 + 카드 UI |
| SCR-A1-FIND-ID | 아이디 찾기 | NATIVE | 1순위 | S | FE | `POST /members/find-id` | PageShell maxWidth="lg" + 카드 스타일 | FindIdForm, VerificationInput | shopby 기본 |
| SCR-A1-FIND-PW | 비밀번호 찾기 | NATIVE | 1순위 | S | FE | `POST /members/find-password` | PageShell maxWidth="lg" + 카드 스타일 | FindPwForm, VerificationInput | shopby 기본 |
| SCR-A1-SIGNUP | 회원가입 | NATIVE | 1순위 | M | FE | `POST /members` | PageShell maxWidth="xl" + FormLayout | TermsAgreement, SignUpForm, PhoneVerification | shopby 기본 + 사업자 정보 확장 |
| SCR-A1-SNS-LOGIN | SNS 로그인 (카카오/네이버) | NATIVE | 2순위 | S | FE | OAuth redirect | - (모달/리다이렉트) | SNSLoginButtons | shopby 기본 |
| SCR-A1-SNS-EXT | SNS 로그인 (구글/애플) | EXTERNAL | 3순위 | M | FE | OAuth redirect | - (모달/리다이렉트) | SNSLoginButtons | shopby 확장 |

#### A-3. 마이페이지 (16 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A3-ORDER-LIST | 주문 조회 | NATIVE | 1순위 | M | FE | `GET /profile/orders` | PageShell + SplitLayout (데스크톱) | OrderCard, DateRangeFilter, StatusBadge | shopby 기본 |
| SCR-A3-ORDER-DETAIL | 주문 상세 | SKIN | 1순위 | L | FE | `GET /profile/orders/{orderNo}` | PageShell maxWidth="xl" | OrderTrackerTimeline, OrderItemCard, FilePreview | Vistaprint 주문추적 |
| SCR-A3-OPTION-STORAGE | 옵션 보관함 | CUSTOM | 1순위 | L | FE+BE | 커스텀 API | PageShell + ResponsiveGrid cols={1,2,3} | SavedOptionCard, ReorderButton, FilePreview | MOO 디자인 라이브러리 |
| SCR-A3-COUPON | 쿠폰 관리 | NATIVE | 2순위 | S | FE | `GET /coupons` | PageShell + ResponsiveGrid | CouponCard, CouponRegisterForm | shopby 기본 |
| SCR-A3-PRINTING-MONEY | 프린팅머니 | CUSTOM | 1순위 | M | FE+BE | 커스텀 MyPay API | PageShell + SplitLayout | AccountBalanceWidget, TransactionHistory | Vistaprint 크레딧 |
| SCR-A3-MONEY-CHARGE | 프린팅머니 충전 | CUSTOM | 1순위 | L | FE+BE | 커스텀 MyPay + PG | PageShell maxWidth="lg" | ChargeAmountSelector, PGPaymentWidget | 선불 충전 패턴 |
| SCR-A3-PRODUCT-QA | 상품 Q&A | NATIVE | 2순위 | S | FE | `GET /boards/product-inquiries` | PageShell + FormLayout | BoardList, WriteForm | shopby 기본 |
| SCR-A3-MY-REVIEW | 나의 리뷰 | NATIVE | 2순위 | S | FE | `GET /profile/product-reviews` | PageShell + ResponsiveGrid | ReviewCard, PhotoUploader | shopby 기본 |
| SCR-A3-EXPERIENCE-TEAM | 체험단 활동 | CUSTOM | 3순위 | M | FE+BE | 커스텀 API | PageShell + ResponsiveGrid | ExperienceCard, StatusBadge | 자체 설계 |
| SCR-A3-INQUIRY | 1:1 문의 | NATIVE | 2순위 | S | FE | `GET /boards/personal-inquiries` | PageShell + FormLayout | InquiryList, WriteForm, FileAttach | shopby 기본 |
| SCR-A3-MEMBER-EDIT | 회원정보 수정 | NATIVE | 1순위 | M | FE | `PUT /members` | PageShell maxWidth="xl" + FormLayout | MemberEditForm, BusinessInfoForm | shopby 기본 |
| SCR-A3-PW-CHANGE | 비밀번호 변경 | NATIVE | 2순위 | S | FE | `PUT /members/password` | PageShell maxWidth="lg" + 카드 스타일 | PasswordChangeForm | shopby 기본 |
| SCR-A3-WITHDRAWAL | 회원 탈퇴 | NATIVE | 3순위 | S | FE | `DELETE /members` | PageShell maxWidth="lg" | WithdrawalForm, ConfirmDialog | shopby 기본 |
| SCR-A3-RECEIPTS | 증빙서류 | SKIN | 2순위 | M | FE | `GET /profile/orders/{orderNo}` + 커스텀 | PageShell + FormLayout | ReceiptTypeSelector, ReceiptViewer | 자체 설계 |
| SCR-A3-BIZ-INFO | 사업자 정보 | SKIN | 2순위 | S | FE | `GET /config/member-extra-info` | PageShell + FormLayout | BusinessInfoForm, FileUploader | 자체 설계 |
| SCR-A3-CASH-RECEIPT | 현금영수증 정보 | SKIN | 2순위 | S | FE | 커스텀 필드 | PageShell + FormLayout | CashReceiptForm | 자체 설계 |

#### A-4. 고객센터 (7 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A4-NOTICE | 공지사항 | NATIVE | 2순위 | S | FE | `GET /boards/notices` | PageShell + ResponsiveGrid | NoticeList, CategoryFilter | shopby 기본 |
| SCR-A4-FAQ | FAQ | NATIVE | 2순위 | S | FE | `GET /boards/faqs` | PageShell | FAQAccordion, CategoryTabs, SearchBar | shopby 기본 (SPEC-LAYOUT-002 수정 완료) |
| SCR-A4-PRODUCT-QA | 상품 Q&A | NATIVE | 2순위 | S | FE | `GET /boards/product-inquiries` | PageShell + FormLayout | QAList, WriteForm | shopby 기본 |
| SCR-A4-BULK-QUOTE | 대량주문 견적 | SKIN | 2순위 | M | FE | 커스텀 게시판 API | PageShell maxWidth="xl" + FormLayout | BulkQuoteForm (회사/담당자/연락처/인쇄물/수량/파일) | 자체 설계 |
| SCR-A4-CORP-CONSULT | 기업인쇄 상담 | SKIN | 2순위 | M | FE | 커스텀 게시판 API | PageShell maxWidth="xl" + FormLayout | CorpConsultForm | 자체 설계 |
| SCR-A4-DESIGN-CONSULT | 디자인 상담 | SKIN | 2순위 | M | FE | 커스텀 게시판 API | PageShell maxWidth="xl" + FormLayout | DesignConsultForm, FileAttach | 자체 설계 |
| SCR-A4-GUEST-ORDER | 비회원 주문조회 | NATIVE | 2순위 | S | FE | `POST /guest/orders` | PageShell maxWidth="lg" + 카드 스타일 | GuestOrderForm (주문번호+이메일+휴대폰) | shopby 기본 |

#### A-6. 주문 (7 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A6-FILE-UPLOAD | 파일/편집정보 입력 | CUSTOM | 1순위 | XL | FE+BE | AWS S3 + PitStop API | PageShell maxWidth="xl" | DropzoneUploader, FileValidationAlert, PreviewRenderer, DesignRequestToggle | Vistaprint 업로드 + 실시간 검증 |
| SCR-A6-CART | 보관함/장바구니 | SKIN | 1순위 | M | FE | `GET /cart`, `PUT /cart` | PageShell + SplitLayout | CartItemCard (인쇄사양 전체 표시), CartSummary, FilePreview | MOO 장바구니 (사양+미리보기+단가) |
| SCR-A6-SHIPPING | 배송 정보 | NATIVE | 1순위 | M | FE | `GET /order-sheet` | PageShell maxWidth="xl" + FormLayout | ShippingForm, AddressSearch | shopby 기본 |
| SCR-A6-ADDRESS-LIST | 배송지 목록 | NATIVE | 1순위 | S | FE | `GET /profile/shipping-addresses` | PageShell | AddressListCard, AddressForm (모달) | shopby 기본 |
| SCR-A6-PAYMENT | 결제하기 | NATIVE | 1순위 | L | FE | `POST /payments/reserve` (이니시스) | PageShell maxWidth="xl" + SplitLayout | PaymentMethodSelector, OrderSummary, B2BPaymentOptions | shopby 기본 + B2B 후불 확장 |
| SCR-A6-ORDER-COMPLETE | 주문 완료 | NATIVE | 1순위 | S | FE | `GET /profile/orders/{orderNo}` | PageShell maxWidth="lg" | OrderCompleteCard, NextActionButtons | shopby 기본 |
| SCR-A6-DESIGN-REQUEST | 디자인 의뢰 | CUSTOM | 2순위 | M | FE+BE | 커스텀 API | PageShell maxWidth="xl" + FormLayout | DesignRequestForm, ReferenceUploader | 비즈하우스 디자인 연동 |

#### A-7/A-8. 정보/가이드 (15 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A7-ABOUT | 회사 소개 | SKIN | 3순위 | M | FE | - (정적) | PageShell maxWidth="xl" | TimelineHistory, StatsBanner, CompanyHero | 자체 브랜드 |
| SCR-A7-TERMS | 이용약관 | NATIVE | 3순위 | S | FE | `GET /terms` | PageShell maxWidth="xl" | LegalDocument, TOCNav | shopby 기본 |
| SCR-A7-PRIVACY | 개인정보보호 | NATIVE | 3순위 | S | FE | `GET /terms` | PageShell maxWidth="xl" | LegalDocument, TOCNav | shopby 기본 |
| SCR-A7-DIRECTIONS | 찾아오시는 길 | SKIN | 3순위 | S | FE | - (정적) | PageShell maxWidth="xl" | KakaoMap, TransportInfo | 자체 설계 |
| SCR-A8-GUIDE-01~11 | 작업 가이드 (11종) | SKIN | 3순위 | M | FE | - (정적/CMS) | PageShell maxWidth="xl" + ResponsiveGrid | GuideCardGrid (목록), GuideDetailPage (상세), ImageZoom | 레드프린팅 작업가이드 |

#### A-9. 마케팅 (7 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A9-LANDING-PAPER | 랜딩: 종이 | SKIN | 3순위 | M | FE | `GET /products` (카테고리 필터) | PageShell maxWidth="7xl" (풀와이드) | HeroBanner, ProductRecommendGrid, CTAButton | Vistaprint 카테고리 랜딩 |
| SCR-A9-LANDING-BIND | 랜딩: 제본 | SKIN | 3순위 | M | FE | 상동 | 상동 | 상동 | 상동 |
| SCR-A9-LANDING-CAL | 랜딩: 캘린더 | SKIN | 3순위 | M | FE | 상동 | 상동 | 상동 | 상동 |
| SCR-A9-LANDING-POUCH | 랜딩: 파우치 | SKIN | 3순위 | M | FE | 상동 | 상동 | 상동 | 상동 |
| SCR-A9-LANDING-STICKER | 랜딩: 스티커 | SKIN | 3순위 | M | FE | 상동 | 상동 | 상동 | 상동 |
| SCR-A9-REVIEW-MAIN | 이용후기 메인 | SKIN | 3순위 | M | FE | `GET /product-reviews` | PageShell + ResponsiveGrid | MasonryGrid (포토리뷰), RatingDistribution | 자체 설계 |
| SCR-A9-EXPERIENCE | 체험단 모집 | CUSTOM | 3순위 | L | FE+BE | 커스텀 API | PageShell + ResponsiveGrid | ExperienceListCard, ExperienceDetail, ApplicationForm | 자체 설계 |

#### A-10. 상품 (11 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | shopby API | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|-----------|---------|---------|---------|
| SCR-A10-PRINT-PRODUCT-1~4 | 출력상품 (명함/전단/포스터/스티커) | CUSTOM | 1순위 | XL | FE+BE | `GET /products/{no}/options` + 커스텀 가격엔진 | PageShell maxWidth="xl" + SplitLayout | StepIndicator (Wizard), OptionSelector, PaperSampleCard, QuantityPricingTable, RealTimePriceWidget | Vistaprint Wizard + 와우프레스 옵션 |
| SCR-A10-PACKAGING | 포장재 | SKIN | 2순위 | M | FE | `GET /products/{no}` | PageShell maxWidth="xl" + SplitLayout | ProductConfigurator (간소화), OptionSelector | shopby 기본 확장 |
| SCR-A10-GOODS | 굿즈+파우치백 | SKIN | 2순위 | M | FE | `GET /products/{no}` | PageShell maxWidth="xl" + SplitLayout | ProductConfigurator, OptionSelector | shopby 기본 확장 |
| SCR-A10-HANDMADE | 수작 상품 | SKIN | 2순위 | M | FE | `GET /products/{no}` | PageShell maxWidth="xl" + SplitLayout | ProductDetail, OptionSelector | shopby 기본 확장 |
| SCR-A10-MAIN | 메인 페이지 | SKIN | 1순위 | L | FE | `GET /display/sections` | PageShell maxWidth="7xl" (SPEC-LAYOUT-002 풀와이드) | HeroBanner, CategoryNav, ProductRecommendGrid, PromotionBanner | shopby 기본 + 인쇄 특화 |
| SCR-A10-SUB-MAIN | 서브 메인 | SKIN | 2순위 | M | FE | `GET /display/sections` | PageShell maxWidth="xl" | CategoryHeader, ProductGrid, SubCategoryNav | shopby 기본 |
| SCR-A10-LIST | 상품 목록 | NATIVE | 1순위 | M | FE | `GET /products` | PageShell + ResponsiveGrid cols={2,3,4} | ProductCard, FilterSidebar, SortSelector, Pagination | shopby 기본 |
| SCR-A10-DETAIL | 상품 상세 | SKIN | 1순위 | L | FE | `GET /products/{no}` | PageShell maxWidth="xl" + SplitLayout | ProductImageGallery, ProductInfo, TabPanel (상세/리뷰/Q&A), AddToCartWidget | shopby 기본 + 인쇄 옵션 확장 |

---

### B. 관리자 화면 (~50개 구현 대상)

> 관리자 영역은 Desktop 전용 (>=1024px), Tailwind CSS + shadcn/ui 패턴, Huni Design Tokens 사용

#### B-1. 관리자 (2 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B1-ADMIN-REG | 관리자 등록 | CUSTOM | 2순위 | M | FE+BE | AdminLayout + FormLayout | AdminRegisterForm, RoleSelector | 자체 설계 (SPEC-SKIN-005) |
| SCR-B1-ADMIN-MGMT | 관리자 관리 | CUSTOM | 2순위 | M | FE+BE | AdminLayout + DataTable | DataTable, StatusBadge, SearchBar | 자체 설계 (SPEC-SKIN-005) |

#### B-2. 거래처 (2 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B2-VENDOR-MGMT | 거래처 관리 | CUSTOM | 2순위 | L | FE+BE | AdminLayout + DataTable | DataTable, VendorDetailPanel, CreditInfoCard | 자체 설계 |
| SCR-B2-VENDOR-BOARD | 매장 게시판 | CUSTOM | 3순위 | M | FE+BE | AdminLayout + DataTable | BoardDataTable, WriteEditor | 자체 설계 |

#### B-3. 원장관리 (3 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B3-ACCOUNT | 계좌 관리 | CUSTOM | 2순위 | M | FE+BE | AdminLayout + DataTable | AccountDataTable, AccountForm | 자체 설계 |
| SCR-B3-LEDGER | 원장 관리 | CUSTOM | 2순위 | XL | FE+BE | AdminLayout + DataTable + SplitLayout | LedgerDataTable, TransactionDetail, DateRangeFilter | ERP 원장 패턴 |
| SCR-B3-RECEIVABLES | 업체별 미수금 | CUSTOM | 2순위 | L | FE+BE | AdminLayout + DataTable | ReceivablesDataTable, VendorSummaryCard, AlertBadge | 자체 설계 |

#### B-4. 상품관리 (18 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B4-PRINT-REG | 인쇄/제본 상품등록 | CUSTOM | 1순위 | XL | FE+BE | AdminLayout + FormLayout (멀티스텝) | StepForm, OptionDependencyBuilder, PreviewPanel | 자체 설계 |
| SCR-B4-SIZE-POPUP | 사이즈 팝업 | CUSTOM | 1순위 | S | FE+BE | 모달/팝업 | SizeEditForm, DataTable | 자체 설계 |
| SCR-B4-MATERIAL-POPUP | 소재 팝업 | CUSTOM | 1순위 | S | FE+BE | 모달/팝업 | MaterialEditForm, DataTable | 자체 설계 |
| SCR-B4-PAPER-POPUP | 종이 팝업 | CUSTOM | 1순위 | S | FE+BE | 모달/팝업 | PaperEditForm, DataTable | 자체 설계 |
| SCR-B4-PRICE-POPUP-1~8 | 가격관리 팝업 (8종) | CUSTOM | 1순위 | L | FE+BE | 모달/팝업 | PriceMatrix (수량x옵션 그리드), BulkEditToolbar | 자체 설계 |
| SCR-B4-SIZE-MASTER | 사이즈 마스터 | CUSTOM | 1순위 | M | FE+BE | AdminLayout + DataTable | MasterDataTable, CRUD 모달 | 자체 설계 |
| SCR-B4-MATERIAL-MASTER | 소재 마스터 | CUSTOM | 1순위 | M | FE+BE | AdminLayout + DataTable | MasterDataTable, CRUD 모달 | 자체 설계 |
| SCR-B4-PAPER-MASTER | 용지 마스터 | CUSTOM | 1순위 | M | FE+BE | AdminLayout + DataTable | MasterDataTable, CRUD 모달 | 자체 설계 |
| SCR-B4-PRICE-MASTER | 가격 마스터 | CUSTOM | 1순위 | L | FE+BE | AdminLayout + DataTable + SplitLayout | PriceMasterTable, PriceRuleEditor | 자체 설계 |
| SCR-B4-GOODS-CAT | 굿즈 카테고리 | SKIN | 2순위 | S | FE | AdminLayout + TreeView | CategoryTree, DragDropReorder | shopby 카테고리 관리 |
| SCR-B4-GOODS-REG | 굿즈 등록 | SKIN | 2순위 | M | FE | AdminLayout + FormLayout | ProductRegForm, ImageUploader | shopby 상품등록 확장 |
| SCR-B4-HANDMADE-REG | 수작 등록 | SKIN | 2순위 | M | FE | AdminLayout + FormLayout | ProductRegForm, ImageUploader | shopby 상품등록 확장 |
| SCR-B4-PACKAGING-REG | 포장재 등록 | SKIN | 2순위 | M | FE | AdminLayout + FormLayout | ProductRegForm, ImageUploader | shopby 상품등록 확장 |
| SCR-B4-DESIGN-REG | 디자인 등록 | CUSTOM | 2순위 | M | FE+BE | AdminLayout + FormLayout | DesignRegForm, DesignPreview, TagInput | 자체 설계 |

#### B-5. 게시판관리 (9 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B5-NOTICE | 공지사항 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | BoardDataTable, RichEditor, StatusToggle | shopby 게시판 관리 |
| SCR-B5-FAQ | FAQ 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | FAQDataTable, CategoryManager, RichEditor | shopby 게시판 관리 |
| SCR-B5-BULK-QUOTE | 대량견적 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | QuoteDataTable, DetailPanel, ReplyEditor | 자체 설계 |
| SCR-B5-CORP-CONSULT | 기업상담 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | ConsultDataTable, DetailPanel, ReplyEditor | 자체 설계 |
| SCR-B5-DESIGN-CONSULT | 디자인상담 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | ConsultDataTable, FilePreview, ReplyEditor | 자체 설계 |
| SCR-B5-PRODUCT-QA | 상품Q&A 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | QADataTable, ReplyEditor | shopby 게시판 관리 |
| SCR-B5-INQUIRY | 1:1문의 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | InquiryDataTable, ReplyEditor | shopby 게시판 관리 |
| SCR-B5-EXPERIENCE | 체험단 관리 | CUSTOM | 3순위 | L | FE+BE | AdminLayout + DataTable | ExperienceDataTable, ApplicationReview, StatusManager | 자체 설계 |
| SCR-B5-REVIEW | 이용후기 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | ReviewDataTable, PhotoPreview, ReplyEditor | shopby 게시판 관리 |

#### B-6. 회원관리 (6 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B6-MEMBER | 회원 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | MemberDataTable, MemberDetailPanel, GradeBadge | shopby 회원관리 |
| SCR-B6-WITHDRAWN | 탈퇴 회원 | SKIN | 3순위 | S | FE | AdminLayout + DataTable | WithdrawnDataTable | shopby 회원관리 |
| SCR-B6-PRINTING-MONEY | 프린팅머니 관리 | CUSTOM | 2순위 | L | FE+BE | AdminLayout + DataTable + SplitLayout | MoneyDataTable, ManualAdjustForm, BalanceSummary | 자체 설계 |
| SCR-B6-COUPON-MGMT | 쿠폰 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | CouponDataTable, CouponCreateForm | shopby 쿠폰 관리 |
| SCR-B6-COUPON-ISSUE | 쿠폰 등록 내역 | SKIN | 3순위 | S | FE | AdminLayout + DataTable | IssueHistoryDataTable | shopby 쿠폰 관리 |
| SCR-B6-COUPON-USE | 쿠폰 사용 내역 | SKIN | 3순위 | S | FE | AdminLayout + DataTable | UseHistoryDataTable | shopby 쿠폰 관리 |

#### B-7. 통계 (8 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B7-PRINT-STATS | 인쇄 통계 | CUSTOM | 3순위 | L | FE+BE | AdminLayout + ResponsiveGrid | StatCard, ChartPanel (Bar/Line), DateRangeFilter | 자체 설계 |
| SCR-B7-BIND-STATS | 제본 통계 | CUSTOM | 3순위 | L | FE+BE | AdminLayout + ResponsiveGrid | 상동 | 자체 설계 |
| SCR-B7-GOODS-STATS | 굿즈 통계 | CUSTOM | 3순위 | M | FE+BE | AdminLayout + ResponsiveGrid | StatCard, ChartPanel | 자체 설계 |
| SCR-B7-PACKAGE-STATS | 패키지 통계 | CUSTOM | 3순위 | M | FE+BE | AdminLayout + ResponsiveGrid | StatCard, ChartPanel | 자체 설계 |
| SCR-B7-HANDMADE-STATS | 수작 통계 | CUSTOM | 3순위 | M | FE+BE | AdminLayout + ResponsiveGrid | StatCard, ChartPanel | 자체 설계 |
| SCR-B7-MONTHLY-SALES | 월별 매출 | CUSTOM | 3순위 | L | FE+BE | AdminLayout + SplitLayout | SalesChart, ComparisonTable, ExportButton | 자체 설계 |
| SCR-B7-SETTLEMENT | 굿즈 발주/정산 | CUSTOM | 3순위 | L | FE+BE | AdminLayout + DataTable | SettlementDataTable, SummaryCard | 자체 설계 |
| SCR-B7-TEAM-STATS | 팀별 통계 | CUSTOM | 3순위 | M | FE+BE | AdminLayout + ResponsiveGrid | TeamComparisonChart, TeamDataTable | 자체 설계 |

#### B-8. 주문관리 (10 화면)

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B8-PRINT-ORDER | 인쇄 주문관리 | CUSTOM | 1순위 | XL | FE+BE | AdminLayout + DataTable + SplitLayout | OrderDataTable (검색/필터/페이징), OrderDetailPanel, BulkActionBar | SPEC-SKIN-005 확장 |
| SCR-B8-BIND-ORDER | 제본 주문관리 | CUSTOM | 1순위 | L | FE+BE | AdminLayout + DataTable | 상동 (필터 변경) | SPEC-SKIN-005 확장 |
| SCR-B8-GOODS-ORDER | 굿즈 주문관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | OrderDataTable | shopby 주문관리 |
| SCR-B8-FILE-CHECK | 파일 확인 처리 | CUSTOM | 1순위 | XL | FE+BE | AdminLayout + SplitLayout | FilePreview (PDF 뷰어), ValidationChecklist, ApproveRejectActions | SPEC-SKIN-005 + PitStop 연동 |
| SCR-B8-REUPLOAD | 재업로드 요청 | CUSTOM | 1순위 | M | FE+BE | AdminLayout + DataTable | ReuploadDataTable, ReasonEditor, AlimtalkTrigger | 자체 설계 |
| SCR-B8-ORDER-PRINT | 주문서 출력 | SKIN | 1순위 | M | FE | AdminLayout + PrintSheet | PrintSheet (A4 최적화), BrowserPrint | SPEC-SKIN-005 |
| SCR-B8-STATUS-CHANGE | 주문 상태 변경 | CUSTOM | 1순위 | L | FE+BE | AdminLayout + DataTable | StatusChangeForm, BulkStatusUpdate, StageTimeline | SPEC-SKIN-005 + 8단계 상태 |
| SCR-B8-DEFERRED-PAY | 후불결제 관리 | CUSTOM | 2순위 | L | FE+BE | AdminLayout + DataTable | DeferredPayDataTable, PaymentConfirmForm | 자체 설계 |
| SCR-B8-RECEIPTS | 증빙서류 관리 | SKIN | 2순위 | M | FE | AdminLayout + DataTable | ReceiptsDataTable, IssueForm | SPEC-SKIN-005 |
| SCR-B8-SMS | SMS/알림톡 발송 | CUSTOM | 2순위 | M | FE+BE | AdminLayout + FormLayout | SMSDialog, TemplateSelector, RecipientSelector | SPEC-SKIN-005 |

#### B-9. 후니프린팅 특화 추가 화면 (4 화면)

> shopby 관리자 분석 결과 도출된 인쇄 업종 특화 화면

| 화면 ID | 화면명 | 분류 | 우선순위 | 규모 | 담당 | 레이아웃 | 핵심 UI | 벤치마크 |
|---------|--------|------|---------|------|------|---------|---------|---------|
| SCR-B9-FILE-DASHBOARD | 파일검증 대시보드 | CUSTOM | 1순위 | L | FE+BE | AdminLayout + ResponsiveGrid + DataTable | StatusFilterTabs (검증중/완료/오류), ErrorTypeSummary, FileDetailPanel | PitStop 연동 자체 설계 |
| SCR-B9-PRINT-STATUS | 인쇄작업 현황 | CUSTOM | 1순위 | L | FE+BE | AdminLayout + DataTable + SplitLayout | StageKanban (접수/검증/인쇄/후가공/출고), WorkerAssignment, EstimatedCompletion | 생산관리 MES 패턴 |
| SCR-B9-QUALITY-CHECK | 품질검수 관리 | CUSTOM | 2순위 | M | FE+BE | AdminLayout + SplitLayout | QualityChecklist (색감/정렬/명확성), ApproveRejectForm, ComparisonViewer | 자체 설계 |
| SCR-B9-OUTSOURCE | 외주 인쇄소 관리 | CUSTOM | 2순위 | L | FE+BE | AdminLayout + DataTable | OutsourceDataTable, OrderTracker, CostSummary, SettlementCard | 이카운트 ERP 외주관리 |

---

## 6. 화면별 설계 가이드라인

### 6.1 NATIVE 화면 (28개) - shopby 기본 + 스킨 래핑

**WHEN** 화면이 NATIVE 분류일 때 **THEN** 다음 패턴을 적용한다:

1. `PageShell` 컴포넌트로 래핑 (maxWidth 지정)
2. shopby Aurora Skin Provider 활용 (ProductDetailProvider, CartProvider 등)
3. SPEC-LAYOUT-002 반응형 스타일 오버라이드 적용
4. 데스크톱 카드 스타일 (인증 페이지) 또는 SplitLayout (목록/상세 페이지)

### 6.2 SKIN 화면 (25개) - shopby API + 커스텀 UI

**WHEN** 화면이 SKIN 분류일 때 **THEN** 다음 패턴을 적용한다:

1. shopby API 직접 호출 + 커스텀 데이터 변환
2. 인쇄 특화 UI 컴포넌트 추가 (PaperSampleCard, FilePreview 등)
3. `ResponsiveGrid` 또는 `SplitLayout`으로 레이아웃 구성
4. 관리자 영역: AdminLayout + DataTable + shadcn/ui 패턴

### 6.3 CUSTOM 화면 (33개) - 전체 커스텀 개발

**WHEN** 화면이 CUSTOM 분류일 때 **THEN** 다음 패턴을 적용한다:

1. 독립 모듈로 설계 (별도 API, 상태 관리, 데이터 모델)
2. 백엔드 API 연동 필수 (AWS S3, PitStop, 커스텀 DB)
3. 복잡한 인터랙션: Wizard(StepIndicator), 실시간 가격 계산, 파일 검증
4. 관리자 CUSTOM: DataTable + SplitLayout + BulkActionBar 패턴

---

## 7. 공통 디자인 패턴

### 7.1 Product Configurator (인쇄 상품 주문)

**WHEN** 사용자가 출력상품을 주문할 때 **THEN** 단계형 Wizard 패턴을 적용한다:

```
규격/사이즈 --> 인쇄도수 --> 용지 선택 --> 코팅/후가공 --> 수량 --> 추가옵션
```

- `StepIndicator`: 현재 단계 표시 (Vistaprint 패턴)
- Progressive Disclosure: 기본 옵션 노출, "더 보기" 토글로 고급 옵션
- 상위 옵션 변경 시 하위 옵션 자동 초기화 + 안내 문구 (국내 인쇄 공통 패턴)
- `PaperSampleCard`: 용지/코팅 시각적 미리보기 (경쟁사 대비 차별화)

### 7.2 실시간 가격 표시

**WHILE** 사용자가 옵션을 선택하는 동안 **THEN** 실시간으로 가격을 업데이트해야 한다:

- `RealTimePriceWidget`: 고정 위치 가격 표시 (스크롤 추적)
- `QuantityPricingTable`: 수량별 단가 테이블 (단가 포함 - Baymard 조사: 86% 사용자 요구)
- 가격 계산 응답: < 500ms
- 할인/프로모션 적용 가격 실시간 반영

### 7.3 파일 업로드

**WHEN** 사용자가 인쇄 파일을 업로드할 때 **THEN** 드래그앤드롭 + 실시간 검증을 제공한다:

- `DropzoneUploader`: 드래그앤드롭 영역 + 파일 선택 버튼
- `FileValidationAlert`: 실시간 검증 피드백 (해상도/CMYK/블리드/서체 아웃라인)
- `PreviewRenderer`: 업로드 파일 미리보기
- 하이브리드 진입점: "디자인 있음" --> 업로드, "디자인 없음" --> 템플릿/의뢰
- PitStop 자동 검수: 수동 검수 대비 즉각 피드백 (경쟁사 대비 차별화)

### 7.4 주문 추적

**WHEN** 사용자가 주문 상태를 확인할 때 **THEN** 8단계 생산 타임라인을 표시한다:

```
접수 --> 파일접수 --> 파일검수 --> 제작접수 --> 인쇄중 --> 후가공 --> 출고 --> 배송중
```

- `OrderTrackerTimeline`: 수평/수직 타임라인 (모바일: 수직, 데스크톱: 수평)
- Job 상태 매핑: STAT_010~STAT_900 --> UI 단계
- "주문 보류" 상태: 파일 오류 시 자동 전환 + 알림톡 발송 + 재업로드 플로우
- WebSocket 실시간 업데이트 (경쟁사 대비 차별화)

### 7.5 B2B 패턴

**IF** 사용자가 B2B 거래처일 때 **THEN** B2B 전용 기능을 제공한다:

- PO 결제 (발주서 기반 결제)
- 후불/외상 관리 (Net Terms)
- 예산 한도 관리
- 다단계 승인 워크플로우
- 전용 가격 체계 (회원등급 기반)

### 7.6 한국 쇼핑몰 표준 패턴 (이커머스 리서치 기반)

> 출처: `ecommerce-erp-screen-patterns.md`

**로그인/회원가입:**
- SNS 로그인 버튼 순서: 카카오(#FEE500) > 네이버(#03C75A) > 구글(흰+테두리)
- 모바일: 전체 너비 버튼 세로 스택, 데스크톱: 중앙 550px 카드
- 본인인증: 휴대폰 SMS 인증 + 타이머 카운트다운

**장바구니/결제:**
- 간편결제 최상단 배치: 카카오페이 > 네이버페이 > 토스페이
- 장바구니 포기율 70% 대응: 진행 단계 최소 3단계
- 배송비 조기 표시: 장바구니 단계부터 정확한 배송비
- 결제 요약: 데스크톱 우측 sticky, 모바일 하단 고정

**마이페이지:**
- 상단 프로필: 회원등급 뱃지 + 다음 등급 프로그레스 바
- 주문 카드: 상품 썸네일 + 상태 뱃지(색상 코딩) + 액션 버튼
- 기간 필터: 1개월/3개월/6개월/직접입력

**색상 코딩 표준:**
- 입금대기: warning (노랑)
- 결제완료: primary (파랑)
- 배송중: warning-dark (주황)
- 배송완료: success (초록)
- 취소/반품: error (빨강)

### 7.7 관리자 DataTable 표준 패턴 (이커머스/ERP 리서치 기반)

> 출처: `ecommerce-erp-screen-patterns.md`, `shopby-admin-screen-analysis.md`

**공통 UI 구조: 필터/검색 --> DataTable --> 상세/모달**

```
AdminPageShell
+-- Header (로고, 사용자 메뉴)
+-- Sidebar (메뉴 네비게이션)
+-- Main Content
    +-- FilterSection (필터 폼)
    |   +-- 검색어 타입 선택 (드롭다운)
    |   +-- 날짜 범위 피커 (최대 기간 제한)
    |   +-- 다중 선택 드롭다운 (상태, 카테고리)
    |   +-- 상세검색 토글 (접기/펼치기)
    |   +-- 초기화/조회 CTA
    +-- ResultsSection (DataTable)
    |   +-- 상태별 탭 (빠른 필터, 건수 뱃지)
    |   +-- 체크박스 일괄 선택
    |   +-- 정렬 가능 컬럼 헤더
    |   +-- 페이지네이션 (20/50/100건)
    |   +-- 행 hover 액션 (수정/삭제)
    |   +-- 엑셀 다운로드 버튼
    +-- DetailPanel (우측 Drawer 640px)
        +-- 정보 카드 섹션
        +-- 편집 가능 필드
        +-- 저장/취소 버튼
```

**DataTable 설계 원칙:**
1. 고정 헤더: 스크롤 시 컬럼 헤더 항상 표시
2. 체크박스 일괄 처리: 여러 항목 선택 후 액션 버튼 활성화
3. 상태 탭 + 필터: 상태별 탭 (빠른 필터) + 상세 검색 폼 조합
4. 행 hover 액션: 마우스 오버 시 수정/삭제 버튼 표시 (공간 절약)
5. 우측 슬라이드 패널: 상세 보기 시 페이지 이동 없이 패널 오픈
6. 제브라 스트라이프: 대량 데이터 행 구분 위한 홀짝 행 배경색 교차
7. 톱니바퀴 아이콘: 사용자별 컬럼 설정 가능

---

## 8. 관리자 화면 구성요소 참조 (shopby Admin 분석)

> 출처: `shopby-admin-screen-analysis.md`

### 8.1 shopby 관리자 공통 UI 패턴

shopby Enterprise 관리자 43개 화면 분석 결과 도출된 공통 패턴:

**필터/검색 컴포넌트:**
- 쇼핑몰 선택 (드롭다운)
- 검색어 입력 (선택 가능한 타입: 번호, 명칭, 코드 등)
- 기간 검색 (date range picker, 최대 3개월)
- 상태/카테고리 선택 (드롭다운, 멀티셀렉트)
- 상세검색 (접기/펼치기)
- 초기화/조회 CTA

**결과 리스트 컴포넌트:**
- DataTable (고정 헤더, 스크롤 가능)
- 행 선택 체크박스 (일괄 작업용)
- 정렬 가능 컬럼 헤더
- 톱니바퀴 아이콘 (컬럼 설정)
- 페이지네이션 ("30/50/100/200개 보기")
- 엑셀 다운로드

**상세보기 컴포넌트:**
- 제목 + 기본정보 영역
- 탭 또는 섹션 구분 (정보 카테고리별)
- 읽기전용 정보 + 편집 가능 필드
- 저장/임시저장/취소 버튼
- 관련 정보 링크 (CRM, 상품 수정 등)

### 8.2 후니프린팅 특화 추가 화면 (4개)

shopby 관리자에 없는 인쇄 업종 특화 화면으로, B 섹션 B-9에 정의:

| 화면 | 핵심 목적 | shopby에 없는 이유 |
|------|----------|------------------|
| **파일검증 대시보드** | 업로드 파일의 해상도/재단선/색상모드 검증 현황 | 인쇄 파일 검수는 일반 이커머스에 없는 기능 |
| **인쇄작업 현황** | 접수~출고 전 과정의 생산 현황 (MES 패턴) | 제조업 생산관리 영역 |
| **품질검수 관리** | 색감, 정렬, 텍스트 명확성 등 품질 검수 | 인쇄물 품질 관리 전용 |
| **외주 인쇄소 관리** | 외주 발주, 비용/수수료, 정산 관리 | 내부 제조 + 외주 하이브리드 운영 |

### 8.3 shopby Admin과 후니프린팅 매핑

| shopby 화면 | 후니프린팅 용도 | 추가 필요 사항 |
|-----------|--------------|--------------|
| 주문 조회 | 인쇄 주문 추적 | 파일 상태, 검증 결과 필드 추가 |
| 주문 상세 | 주문 상세 + 첨부 파일 | 파일 목록 섹션, 처리 이력 |
| 상품 등록 | 인쇄 템플릿 등록 | 다단계 종속 옵션, 가격 매트릭스 (CUSTOM) |
| 회원 조회 | 고객/거래처 관리 | B2B 필드 (신용등급, 거래한도) |
| 1:1문의 | 품질 문의 관리 | 문의유형에 "인쇄 품질" 추가 |
| 파트너 관리 | 외주 인쇄소 관리 | 거래처 유형 구분, 정산 관리 |

---

## 9. 추적성

| 태그 | 대상 |
|------|------|
| SPEC-SCREEN-001 | 본 마스터 플랜 |
| SPEC-LAYOUT-001 | 반응형 레이아웃 시스템 |
| SPEC-LAYOUT-002 | 시각 검증 기반 개선 |
| SPEC-SKIN-004 | 고객센터/정보/마케팅 |
| SPEC-SKIN-005 | 관리자 백오피스 기반 |
| SPEC-MASTERPLAN-001 | 전체 마스터플랜 (아키텍처) |

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 80+ 화면 인벤토리 및 설계 가이드라인 |
| 2026-03-19 | 2.0.0 | Annotation Cycle 업데이트 - 7개 보조 리서치 통합: 회색 제외(25개, 88개 구현 대상), Hybrid 아키텍처 결정(7.55점), 미결정 정책 기본값 확정, 이커머스/ERP 패턴 통합, shopby Admin 분석 반영, 후니프린팅 특화 4개 추가 화면 |
