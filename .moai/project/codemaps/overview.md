# Shopby.skin 아키텍처 개요

## 프로젝트 개요

**shopby.skin**은 Shopby 전자상거래 플랫폼을 위한 스킨 커스터마이징 React 애플리케이션입니다. 고객 쇼핑 경험(45개 페이지)과 관리자 시스템(13개 관리자 페이지)을 통합하는 단일 페이지 애플리케이션(SPA)입니다.

### 핵심 통계
- **총 JS/JSX 파일**: 796개
- **컴포넌트 디렉토리**: 92개
- **디자인 시스템**: 26개 컴포넌트 (원자 설계 방법론)
  - Atoms: 8개 (BadgeLabel, InfoTooltip, ColorChip, Divider, Icon, Skeleton, Checkbox, RadioGroup, Switch, Chip)
  - Molecules: 10개 (OptionLabel, SizeOptionChip, RadioOption, DropdownSelect, CounterOption, SizeInput, QuantityInput, CTAButton, Field, TextField, Tabs, Pagination)
  - Organisms: 5개 (CollapsibleSection, PriceSummary, Dialog, Snackbar, SnackbarProvider/useSnackbar)
  - Utilities: 4개 (createSlotRecipeContext, getStateDataAttributes/dataSelectors, useFocusVisible/focusRingClass/focusRingStyle, cn)
- **페이지**: 45개 고객 페이지 + 13개 관리자 페이지
- **서비스 레이어**: 14개 관리자 서비스 모듈
- **커스텀 훅**: 12개 (usePrintOptionsV2 포함)
- **라우트**: 60+ (React Router v6)

## 아키텍처 다이어그램

### 계층화된 아키텍처

```
┌─────────────────────────────────────────────────────┐
│              Pages/UI Layer                          │
│   (45 customer pages + 13 admin pages)               │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│   Components (92 dirs, 796 JS/JSX) + Design System  │
│   (Atoms/8 + Molecules/10 + Organisms/5 + Utils/4)  │
│   ├── admin/ (AdminLayout, Sidebars, Tables)        │
│   ├── product/ (PrintConfigurator, Calculators)     │
│   └── ui/ (Shadcn/ui-based Primitives)              │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│              Custom Hooks Layer (12)                 │
│   (useAdminAuth, usePrintOptions, usePrintOptionsV2)│
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│        Services Layer (14 admin modules)             │
│   (auth, product, accounting, board, coupon, etc)   │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│              API Layer                                │
│   (api.js, printPrice.js, custom/)                   │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│    Shopby Enterprise APIs                             │
│   (@shopby/react-components, @shopby/shared)         │
└─────────────────────────────────────────────────────┘
```

## 핵심 아키텍처 패턴

### 1. 계층화된 모듈 구조 (Layered Architecture)
- **UI 계층**: 페이지 및 컴포넌트
- **로직 계층**: 커스텀 훅 및 유틸리티
- **서비스 계층**: 비즈니스 로직 및 API 호출
- **API 계층**: 외부 API 통신

### 2. 원자 설계 방법론 (Atomic Design)
- **Atoms**: 기본 UI 요소 (BadgeLabel, Icon, Skeleton, Checkbox, RadioGroup, Switch, Chip)
- **Molecules**: 조합된 컴포넌트 (OptionLabel, SizeOptionChip, RadioOption, DropdownSelect, CounterOption, SizeInput, QuantityInput, CTAButton, Field, TextField, Tabs, Pagination)
- **Organisms**: 복합 구조 (CollapsibleSection, PriceSummary, Dialog, Snackbar)
- **Utilities**: 공유 유틸리티 함수 및 컨텍스트 (cn, createSlotRecipeContext, focusRing utilities)

### 3. 도메인 기반 컴포넌트 구성
```
components/
├── admin/          # 관리자 페이지 컴포넌트 + 서브디렉토리
│   ├── board/      # 게시판 관리
│   ├── coupon/     # 쿠폰 관리
│   ├── member/     # 회원 관리
│   ├── product/    # 상품 관리 (general, master)
│   ├── accounting/ # 회계/원장/응수금
│   ├── statistics/ # 통계 (product, sales, settlement, team)
│   └── vendor/     # 거래처/가맹점 (VendorPage, VendorDetail, StoreBoard)
├── product/        # 상품 관련 컴포넌트 (PrintConfigurator, HuniPriceCalculator)
├── ui/             # Shadcn/ui 기반 UI 프리미티브 (button, card, input, Dialog, Checkbox, etc)
├── Layout/         # 레이아웃 컴포넌트
└── [92개 디렉토리 총합]
```

### 4. 관리자 시스템 서비스 계층
14개 관리자 서비스 모듈이 비즈니스 로직을 캡슐화:
- 인증 (auth.js)
- 상품 관리 (product.js)
- 주문 관리 (orders.js)
- 회원 관리 (member.js, members.js)
- 통계 및 회계 (accounting.js, statistics.js, vendor.js)
- 게시판 (board.js)
- 쿠폰 (coupon.js)

## 기술 스택

### 프론트엔드 프레임워크
- **React**: 18.2.0
- **React Router**: v6.4.3 (60+ 라우트)
- **상태 관리**: Context API

### 스타일링 및 UI
- **Tailwind CSS**: 3.4.19
- **Radix UI**: 10+ 패키지
- **CVA**: 클래스 기반 변수
- **clsx/tailwind-merge**: 클래스 유틸리티

### 주요 라이브러리
- **Lucide React**: 0.577.0 (아이콘)
- **Recharts**: 3.8.0 (차트/그래프)
- **Embla Carousel**: 8.6.0 (회전식 바)
- **i18next**: 22.0.6 (국제화)
- **Dayjs**: 1.11.7 (날짜 처리)
- **Lodash-es**: 4.17.21 (유틸리티)
- **DOMPurify**: XSS 방지

### Shopby 통합
- **@shopby/react-components**: 1.16.5
- **@shopby/shared**: 1.16.5 (git package)

### 빌드 및 개발 도구
- **Webpack**: 5.75.0
- **Babel**: 7
- **Vitest**: 3.2.4 (테스트 프레임워크)
- **@testing-library/react**: 16.3.2
- **ESLint**: 코드 검사
- **PostCSS**: 8.5.8
- **Prettier**: 코드 포맷팅

## 디렉토리 구조

```
src/
├── __tests__/              # 테스트 (특성화 + 기능 테스트)
├── api/                    # API 계층
│   ├── api.js             # 메인 API 설정
│   ├── printPrice.js      # 인쇄 가격 API
│   └── custom/            # 커스텀 API
├── assets/                 # 정적 이미지/아이콘
├── components/             # 92개 컴포넌트 디렉토리
│   ├── admin/             # 관리자 컴포넌트 + 서브디렉토리
│   ├── product/           # 상품 컴포넌트 (NEW)
│   ├── ui/                # UI 컴포넌트 (NEW - shadcn/ui)
│   └── Layout/            # 레이아웃 컴포넌트
├── constants/              # 상수 및 i18n
│   └── i18n/kr/           # 한국어 번역
├── design-system/          # 디자인 시스템
│   ├── components/
│   │   ├── atoms/         # 8개 원자 컴포넌트
│   │   ├── molecules/     # 10개 분자 컴포넌트
│   │   └── organisms/     # 5개 유기체 컴포넌트
│   ├── tokens/            # 타이포그래피
│   ├── utils/             # cn, focusRing, createSlotRecipeContext
│   └── index.js           # @MX:ANCHOR (fan_in >= 13)
├── hooks/                  # 12개 커스텀 훅 (usePrintOptionsV2 NEW)
├── lib/                    # 공유 유틸리티
├── pages/                  # 페이지 컴포넌트
│   ├── ProductDetail/      # ProductDetail 확장 (index.jsx, ProductSummary.jsx)
│   ├── Cart/               # Cart 페이지 (NEW)
│   ├── OrderSheet/         # OrderSheet 페이지 (NEW)
│   └── admin/              # 13개+ 관리자 페이지 + 서브디렉토리
├── router/                 # React Router 설정 (60+ 라우트)
├── services/admin/         # 14개 서비스 모듈
├── types/                  # 타입 정의 (print-options.js NEW)
├── utils/                  # 12개 유틸리티 모듈
├── App.jsx                 # 루트 컴포넌트
├── index.js                # 진입점
└── i18n.js                 # i18next 설정
```

## 데이터 흐름

### 고객 쇼핑 플로우

```
User Action
    ↓
Route Handler (React Router)
    ↓
Page Component (ProductDetail, Cart, OrderSheet 포함)
    ↓
Custom Hook (useResponsive, usePrintOptions, usePrintOptionsV2)
    ↓
Component Composition (Atoms → Molecules → Organisms)
    ↓
API Call (api.js)
    ↓
Shopby Enterprise API
    ↓
Response → State Update → Re-render
```

### 관리자 데이터 관리 플로우

```
Admin Action
    ↓
Admin Page Component (13개 페이지 + 서브디렉토리)
    ↓
Admin Service Module (auth.js, product.js, orders.js, etc)
    ↓
API Layer (api.js)
    ↓
Shopby Enterprise API
    ↓
Response → Component State Update → UI Re-render
```

## 핵심 의존성

### 내부 모듈 의존성
```
Pages → Components + Design System → Custom Hooks → Services → API Layer
Admin Pages → Admin Components → Admin Services → API Layer
Design System (index.js) ← 13개 이상의 컴포넌트에서 참조 (@MX:ANCHOR)
components/ui (index.js) ← shadcn/ui 프리미티브 barrel export
```

### 외부 패키지 의존성
- **React 생태계**: react, react-router-dom, react-dom
- **Tailwind 생태계**: tailwindcss, radix-ui/*, cva, clsx
- **데이터 처리**: recharts, dayjs, lodash-es
- **국제화**: i18next, i18next-browser-languagedetector
- **보안**: dompurify
- **Shopby**: @shopby/react-components, @shopby/shared

## 주요 엔트리 포인트

### 애플리케이션 진입점
- **index.js**: `src/index.js` (initializeShopApi 호출)
- **App.jsx**: `src/App.jsx` (Provider tree: Modal, Error, Mall, Auth, Terms, etc)

### 라우터 설정
- **router/config.js**: 60+ 라우트 정의
- **pages/**: 고객 및 관리자 페이지

### API 구성
- **api.js**: API 인스턴스 및 설정
- **services/admin/**: 14개 비즈니스 로직 모듈

## 개발 원칙

### 1. 컴포넌트 설계
- 단일 책임 원칙 (Single Responsibility)
- 재사용 가능한 작은 컴포넌트 (Atoms → Molecules → Organisms)
- Props를 통한 명확한 인터페이스

### 2. 상태 관리
- Context API 사용
- 필요시 커스텀 훅으로 로직 캡슐화
- 부작용(side effects) 최소화

### 3. 코드 조직
- 도메인별 폴더 구조
- 공유 컴포넌트는 설계 시스템에 집중
- 서비스 레이어로 비즈니스 로직 분리

### 4. 성능 최적화
- 코드 분할 (Code Splitting)
- 이미지 최적화
- 메모이제이션 (React.memo, useMemo, useCallback)

## 페이지 분류

### 고객 페이지 (45개)
- **인증**: SignIn, SignUp, FindId, FindPassword, ChangePassword (6개)
- **쇼핑**: ProductDetail, Cart, OrderSheet, OrderConfirm, OrderDetail (8개)
- **마이페이지**: 회원정보, 주문, 리뷰, 문의, 포인트, 배송지, 클레임 등 (12개)
- **고객지원**: FAQ, 공지사항, 클레임, 문의, 이벤트 (5개)
- **정보**: 약관, 소개, 가이드, 워크가이드, 방문 안내, 소개글 (6개)
- **특별**: NotFound, NoAccess, ServiceCheck, ExpiredMall, MemberOnly 등 (2개)

### 관리자 페이지 (13개+)
- **기본**: Login, Dashboard (2개)
- **핵심**: 회원, 주문, 상품, 쿠폰, 게시판, 통계 (9개+)
- **SPEC-SKIN-008 확장**:
  - accounting/ (Account, Ledger, Receivable)
  - statistics/ (Product, Sales, Settlement, Team)
  - vendor/ (VendorPage, VendorDetail, StoreBoard)
  - board/, coupon/, member/, product/ (subdirectories)

## 다음 단계

자세한 정보는 다음 문서를 참고하세요:
- **modules.md**: 각 모듈의 책임 및 주요 파일
- **dependencies.md**: 모듈 간 의존성 그래프
- **entry-points.md**: 진입점 및 라우팅
- **data-flow.md**: 주요 데이터 흐름
