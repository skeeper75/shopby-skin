# 의존성 그래프 - @shopby/react-skin (Aurora Skin)

> 생성일: 2026-03-14

---

## 외부 패키지 의존성

### 프로덕션 의존성

| 패키지 | 버전 | 용도 |
|---|---|---|
| `@shopby/react-components` | git#v1.16.5 | 핵심 UI 컴포넌트 및 Context Provider |

### 개발/빌드 의존성 (주요)

| 패키지 | 버전 | 용도 |
|---|---|---|
| `react` | ^18.2.0 | UI 프레임워크 |
| `react-dom` | ^18.2.0 | DOM 렌더링 |
| `react-router-dom` | ^6.4.3 | 클라이언트 사이드 라우팅 |
| `react-device-detect` | ^2.2.3 | 모바일/PC 플랫폼 감지 |
| `react-helmet` | ^6.1.0 | 문서 head 관리 (SEO) |
| `react-i18next` | ^12.0.0 | 국제화(i18n) |
| `i18next` | ^22.0.6 | i18n 코어 라이브러리 |
| `i18next-browser-languagedetector` | ^7.0.1 | 브라우저 언어 자동 감지 |
| `i18next-http-backend` | ^2.0.1 | 서버에서 번역 파일 로드 |
| `webpack` | ^5.75.0 | 모듈 번들러 |
| `babel-loader` | ^9.1.0 | JS 트랜스파일 |
| `dayjs` | ^1.11.7 | 날짜 처리 |
| `dompurify` | ^3.0.1 | XSS 방지 HTML 새니타이징 |
| `js-cookie` | ^3.0.1 | 쿠키 관리 |
| `lodash-es` | ^4.17.21 | 유틸리티 함수 |

---

## @shopby/react-components 의존성 (임포트 분석)

Aurora Skin이 `@shopby/react-components`에서 임포트하는 주요 항목:

### Context Provider (App.jsx 및 Layout.jsx에서 직접 사용)

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
      └── useRecentKeywordActionContext (hooks/useSearchKeyword.js에서)
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
        │     └── src/pages/* (34개 페이지, 모두 lazy 로드)
        │
        └── src/components/
              ├── CurrencyWrap
              ├── ErrorBoundary
              ├── Netfunnel
              └── TermsContent

src/components/Layout/Layout.jsx
  ├── src/hooks/useSyncTokenExpiryWithLocation
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

src/utils/api.js
  └── @shopby/shared (apiCreator, memberAuth, PLATFORM_TYPE 등)

src/hooks/useSyncTokenExpiryWithLocation.js
  └── @shopby/react-components (useAuthStateContext)
  └── @shopby/shared (memberAuth, refreshAuth, tokenConfig)
```

---

## 의존성 방향 요약

```
┌─────────────────────────────────────────────────────┐
│                    외부 서비스                        │
│               Shopby Shop API                        │
└────────────────────────┬────────────────────────────┘
                         │ HTTP (Fetch API)
                         ▼
┌─────────────────────────────────────────────────────┐
│              @shopby/shared (공통 유틸)              │
│    apiCreator, memberAuth, 상수, 스타일               │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│      @shopby/react-components (컴포넌트 라이브러리)  │
│    Provider, Hook, UI 컴포넌트                       │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           @shopby/react-skin (Aurora Skin)           │
│   src/ 내 모든 파일                                   │
└─────────────────────────────────────────────────────┘
```

**핵심 특성**: Aurora Skin은 `@shopby/react-components`에 단방향으로 강하게 의존합니다. 컴포넌트 라이브러리를 역참조하지 않으므로 라이브러리 업그레이드는 skin 버전 태그(`git#v1.16.5`) 변경으로 관리됩니다.

---

## 순환 의존성 현황

내부 모듈 간 순환 의존성 없음. 모든 의존성이 단방향으로 흐릅니다:

- 페이지 → 컴포넌트 → 외부 라이브러리
- 훅 → 외부 라이브러리
- 유틸 → 외부 라이브러리
