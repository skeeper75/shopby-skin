# 의존성 그래프 - @shopby/react-skin

## 외부 패키지 의존성

### 프로덕션 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| @shopby/react-components | git#v1.16.5 | 핵심 UI 컴포넌트 및 Context Provider |
| @shopby/shared | git#v1.16.5 | 공유 유틸리티, API 설정, 스타일 |

### 주요 개발/빌드 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| react | 18.2.0 | UI 프레임워크 |
| react-dom | 18.2.0 | DOM 렌더링 |
| react-router-dom | 6.4.3 | 클라이언트 라우팅 |
| tailwindcss | 3.4.19 | CSS 프레임워크 |
| postcss | 8.5.8 | CSS 전처리 |
| webpack | 5.75.0 | 모듈 번들러 |
| babel-loader | 9.1.0 | JS 트랜스파일 |

### UI & 컴포넌트 라이브러리

| 패키지 | 버전 | 용도 |
|--------|------|------|
| radix-ui/* | 1.x | Headless UI 컴포넌트 (10+ 패키지) |
| class-variance-authority | - | CVA 클래스 관리 |
| lucide-react | 0.577.0 | 아이콘 라이브러리 |
| clsx | - | 클래스 유틸리티 |
| tailwind-merge | - | Tailwind 클래스 병합 |
| recharts | 3.8.0 | 차트/그래프 라이브러리 |
| embla-carousel-react | 8.6.0 | 캐러셀/슬라이더 |

### 국제화 및 날짜

| 패키지 | 버전 | 용도 |
|--------|------|------|
| i18next | 22.0.6 | i18n 코어 라이브러리 |
| react-i18next | 12.0.0 | React i18n 통합 |
| i18next-browser-languagedetector | 7.0.1 | 브라우저 언어 자동 감지 |
| i18next-http-backend | 2.0.1 | 서버에서 번역 파일 로드 |
| dayjs | 1.11.7 | 날짜 처리 |

### 보안 및 기타 유틸

| 패키지 | 버전 | 용도 |
|--------|------|------|
| dompurify | 3.0.1 | XSS 방지 HTML 새니타이징 |
| js-cookie | 3.0.1 | 쿠키 관리 |
| lodash-es | 4.17.21 | 유틸리티 함수 |
| react-device-detect | 2.2.3 | 모바일/PC 플랫폼 감지 |
| react-helmet | 6.1.0 | 문서 head 관리 (SEO) |

### 테스트 및 개발 도구

| 패키지 | 버전 | 용도 |
|--------|------|------|
| vitest | 3.2.4 | 테스트 프레임워크 |
| @testing-library/react | 16.3.2 | React 테스트 라이브러리 |
| playwright | 1.58.2 | E2E 테스트 자동화 |
| eslint | - | 코드 린트 |
| prettier | - | 코드 포맷팅 |

---

## @shopby/react-components 의존성

Aurora Skin이 임포트하는 주요 항목:

### Context Provider (App.jsx 및 Layout.jsx)

```
@shopby/react-components
  ├── Provider
  │   ├── AuthProvider          ← 인증 상태 전역 관리
  │   ├── MallProvider          ← 쇼핑몰 정보 전역 관리
  │   ├── ModalProvider         ← 모달 전역 관리
  │   ├── TermsProvider         ← 약관 데이터 전역 관리
  │   ├── DesignPopupProvider   ← 디자인 팝업 설정
  │   ├── BoardConfigurationProvider  ← 게시판 설정
  │   ├── NaverShoppingConfigurationProvider  ← 네이버 쇼핑 연동
  │   ├── OrderConfigProvider   ← 주문 설정
  │   ├── EventProviderV2       ← 이벤트 처리 v2
  │   ├── BannerProvider        ← 배너 데이터
  │   ├── CartProvider          ← 장바구니 상태
  │   ├── ProductDetailProvider ← 상품 상세 정보
  │   ├── OffCanvasProvider     ← 오프캔버스 메뉴
  │   └── SearchAddressProvider ← 주소 검색
  │
  ├── UI 컴포넌트
  │   ├── Modal                 ← 범용 모달 UI
  │   └── Icon                  ← 아이콘 컴포넌트
  │
  └── Context Hooks
      ├── useModalActionContext
      ├── useAuthStateContext
      ├── useBoardConfigurationContextAction
      ├── useNaverShoppingConfigurationActionContext
      ├── useBannerActionContext
      ├── useOrderConfigActionContext
      ├── useCartActionContext
      └── useRecentKeywordActionContext
```

---

## @shopby/shared 의존성

```
@shopby/shared
  ├── 상수
  │   ├── PLATFORM_TYPE
  │   ├── API_TYPE
  │   ├── API_BASE_URL_MAP
  │   ├── HTTP_REQUEST_METHOD
  │   ├── AUTHORIZATION_HEADER
  │   ├── REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION
  │   ├── CLIENT_ERROR
  │   └── CLIENT_ERROR_MESSAGE
  │
  ├── 유틸리티 함수
  │   ├── apiCreator             ← API SDK 인스턴스 생성
  │   ├── memberAuth             ← 액세스 토큰 관리 (get/set)
  │   ├── refreshAuth            ← 토큰 갱신
  │   ├── tokenConfig            ← 토큰 설정
  │   ├── isSignedIn             ← 로그인 상태 확인
  │   ├── setPolyfill            ← 폴리필 적용
  │   ├── setTrackingKey         ← 추적 키 설정
  │   └── setChannelType         ← 채널 타입 설정
  │
  └── 스타일 (CSS 번들)
      ├── @shopby/shared/styles/common
      ├── @shopby/shared/styles/component
      └── @shopby/shared/styles/aurora
```

---

## 내부 모듈 의존성 그래프

```
src/index.js
  └── src/App.jsx
        ├── src/router/index.js
        │     ├── src/router/MemberRoute.jsx
        │     ├── src/router/NotAccessLoggedInUserRouter.jsx
        │     ├── src/router/IntroPageRoute.jsx
        │     ├── src/router/NotFoundRoute.jsx
        │     └── src/pages/* (45+13 페이지, 모두 lazy 로드)
        │         ├── pages/ProductDetail/index.jsx
        │         ├── pages/ProductDetail/ProductSummary.jsx (NEW)
        │         ├── pages/Cart/index.jsx (NEW)
        │         ├── pages/OrderSheet/index.jsx (NEW)
        │         ├── pages/admin/* (13개+ 페이지 + 서브디렉토리)
        │         │   ├── pages/admin/board/
        │         │   ├── pages/admin/coupon/
        │         │   ├── pages/admin/member/
        │         │   ├── pages/admin/product/
        │         │   ├── pages/admin/accounting/
        │         │   ├── pages/admin/statistics/
        │         │   └── pages/admin/vendor/
        │         └── [기타 37개+ 페이지]
        │
        └── src/components/
              ├── components/admin/
              │   ├── AdminLayout
              │   ├── AdminSidebar
              │   ├── DataTable
              │   ├── components/admin/board/
              │   ├── components/admin/coupon/
              │   ├── components/admin/member/
              │   ├── components/admin/product/
              │   ├── components/admin/accounting/
              │   ├── components/admin/statistics/
              │   └── components/admin/vendor/
              ├── components/product/ (NEW)
              │   ├── PrintConfigurator
              │   ├── HuniPriceCalculator
              │   ├── OptionActions
              │   └── PrintFileUpload
              ├── components/ui/ (NEW)
              │   ├── Button
              │   ├── Card
              │   ├── Input
              │   ├── Dialog
              │   ├── Checkbox
              │   ├── Radio
              │   ├── Tabs
              │   └── Snackbar (index.js barrel export)
              ├── CurrencyWrap
              ├── ErrorBoundary
              ├── Netfunnel
              └── TermsContent

src/components/Layout/Layout.jsx
  ├── src/hooks/useSyncTokenExpiryWithLocation
  ├── src/hooks/useResponsive
  ├── src/utils/* (scrollToTop 등)
  ├── src/components/AdminBanner
  ├── src/components/BottomNav
  ├── src/components/CategoryNav
  ├── src/components/DesignPopup
  ├── src/components/Footer
  ├── src/components/Header
  ├── src/components/LayoutProvider
  ├── src/components/Meta
  └── src/components/SearchKeyword

src/pages/ProductDetail/index.jsx
  ├── src/pages/ProductDetail/ProductSummary.jsx
  ├── src/components/product/*
  ├── src/hooks/usePrintOptions
  ├── src/hooks/usePrintOptionsV2 (NEW)
  └── src/design-system/*

src/pages/Cart/index.jsx (NEW)
  ├── src/hooks/*
  ├── src/components/ui/*
  └── src/design-system/*

src/pages/OrderSheet/index.jsx (NEW)
  ├── src/hooks/*
  ├── src/components/*
  └── src/design-system/*

src/pages/admin/*/index.jsx (13개+)
  ├── src/services/admin/* (14개 모듈)
  ├── src/components/admin/*
  ├── src/hooks/useAdminAuth
  └── src/utils/api.js

src/utils/api.js
  ├── @shopby/shared (apiCreator, memberAuth, PLATFORM_TYPE 등)
  └── @shopby/react-components (useAuthStateContext)

src/hooks/useSyncTokenExpiryWithLocation.js
  ├── @shopby/react-components (useAuthStateContext)
  └── @shopby/shared (memberAuth, refreshAuth, tokenConfig)

src/hooks/usePrintOptionsV2.js (NEW)
  ├── src/types/print-options.js (NEW)
  ├── src/utils/api.js
  └── src/services/admin/printOptions.js

src/design-system/index.js (@MX:ANCHOR, fan_in >= 13)
  ├── src/design-system/components/atoms/*
  ├── src/design-system/components/molecules/*
  ├── src/design-system/components/organisms/*
  └── src/design-system/utils/*

src/design-system/components/*/index.js
  ├── @radix-ui/* (10+ 패키지)
  ├── tailwindcss
  ├── class-variance-authority
  ├── lucide-react
  ├── clsx/tailwind-merge
  └── src/design-system/utils/cn

src/services/admin/*.js (14개 모듈)
  └── src/utils/api.js
```

---

## 의존성 방향 요약

```
┌─────────────────────────────────────────────────────┐
│                  외부 서비스                          │
│             Shopby Shop API                          │
└────────────────────────┬────────────────────────────┘
                         │ HTTP (Fetch API)
                         ▼
┌─────────────────────────────────────────────────────┐
│          @shopby/shared (공통 유틸)                  │
│  apiCreator, memberAuth, 상수, 스타일               │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│  @shopby/react-components (컴포넌트 라이브러리)     │
│  Provider, Hook, UI 컴포넌트                        │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│       @shopby/react-skin (Aurora Skin)              │
│  src/ 내 모든 파일                                   │
│  ├── services/admin/ (14개 모듈)
│  ├── hooks/ (12개 훅)
│  ├── components/ (93개 디렉토리)
│  │   ├── admin/ (확장)
│  │   ├── product/ (NEW)
│  │   └── ui/ (NEW)
│  ├── pages/ (45개+ 디렉토리)
│  │   ├── ProductDetail/ (확장)
│  │   ├── Cart/ (NEW)
│  │   ├── OrderSheet/ (NEW)
│  │   └── admin/ (13개+ 확장)
│  ├── design-system/ (26개 컴포넌트)
│  ├── types/ (NEW)
│  └── utils/ & constants/
└─────────────────────────────────────────────────────┘
```

**핵심 특성**: Aurora Skin은 `@shopby/react-components`에 단방향으로 강하게 의존합니다. 라이브러리 역참조 없으므로 라이브러리 업그레이드는 버전 태그(`git#v1.16.5`) 변경으로 관리됩니다.

---

## 순환 의존성 현황

내부 모듈 간 순환 의존성 **없음**. 모든 의존성이 단방향:

- 페이지 → 컴포넌트 → 외부 라이브러리
- 훅 → 외부 라이브러리
- 유틸 → 외부 라이브러리
- 서비스 → API 계층 → 외부 라이브러리

---

## 고팬인 모듈 (MX:ANCHOR 후보)

| 모듈 | 임포트 수 | 용도 |
|------|----------|------|
| src/utils/api.js | 30+ | API 요청 추상화 |
| src/design-system/index.js | 13+ | 디자인 시스템 컴포넌트 배럴 export |
| src/lib/utils.js (cn) | 50+ | 클래스 병합 유틸 |
| src/hooks/useResponsive | 8+ | 반응형 미디어 쿼리 |
| src/components/admin/AdminLayout | 10+ | 관리자 페이지 레이아웃 |
| src/design-system/utils/cn | 50+ | Tailwind 클래스 병합 |
| src/components/ui/index.js | 20+ | UI 프리미티브 배럴 export (NEW) |

---

## 신규 의존성 추가 (2026-03-17)

| 추가 항목 | 타입 | 영향범위 |
|----------|------|---------|
| components/product/ | 컴포넌트 디렉토리 | ProductDetail, OrderSheet 페이지 |
| components/ui/ | 컴포넌트 디렉토리 | Admin pages, 일반 페이지 |
| pages/Cart/ | 페이지 | 라우팅, 장바구니 기능 |
| pages/OrderSheet/ | 페이지 | 라우팅, 주문서 기능 |
| pages/ProductDetail/ (확장) | 페이지 | ProductSummary 분리 |
| hooks/usePrintOptionsV2.js | 훅 | ProductDetail, OrderSheet |
| types/print-options.js | 타입 정의 | usePrintOptionsV2 |
| pages/admin/ (확장) | 페이지 + 서브디렉토리 | accounting, statistics, vendor 추가 |
| components/admin/ (확장) | 컴포넌트 + 서브디렉토리 | board, coupon, member, product, accounting, statistics, vendor |

---

## 의존성 감시 영역

**높은 변동성** (주의 필요):
- @shopby/react-components (Provider 업데이트 시 영향)
- React Router (라우팅 변경 시)

**중간 변동성** (모니터링):
- design-system 컴포넌트 (추가/삭제 시)
- admin 서비스 모듈 (API 변경 시)

**낮은 변동성** (안정):
- utils/api.js (API 클라이언트 인터페이스)
- constants (상수)
- hooks (기본 훅)
