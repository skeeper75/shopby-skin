# 아키텍처 개요 - @shopby/react-skin (Aurora Skin)

> 생성일: 2026-03-14
> 버전: 1.16.5
> 프레임워크: React 18.2 + React Router 6 + Webpack 5

---

## 프로젝트 소개

Aurora Skin은 Shopby 이커머스 플랫폼의 React 기반 프론트엔드 스킨입니다. 고객이 직접 쇼핑몰을 구성할 수 있는 화이트레이블(white-label) 스킨으로, `@shopby/react-components` 외부 컴포넌트 라이브러리를 핵심 기반으로 사용합니다.

---

## 시스템 경계

```
┌─────────────────────────────────────────────────────────────────┐
│                  브라우저 환경                                     │
│                                                                   │
│   ┌───────────────────────────────────────────────────────────┐  │
│   │               @shopby/react-skin (Aurora)                 │  │
│   │                                                           │  │
│   │   src/index.js  →  App.jsx  →  Router  →  Pages          │  │
│   │        │                                                   │  │
│   │   환경설정 로드 (public/environment.json)                  │  │
│   └───────────────────────────────────────────────────────────┘  │
│           │                        │                              │
│           ▼                        ▼                              │
│   ┌──────────────────┐    ┌────────────────────────────────────┐ │
│   │ @shopby/react-   │    │   Shopby Shop API                  │ │
│   │  components      │    │   (외부 REST API 서버)              │ │
│   │ (외부 컴포넌트    │    │   - alpha 환경                     │ │
│   │  라이브러리)      │    │   - real(운영) 환경                │ │
│   └──────────────────┘    └────────────────────────────────────┘ │
│           │                                                        │
│   ┌──────────────────┐                                            │
│   │  @shopby/shared  │                                            │
│   │ (공통 유틸/상수)  │                                            │
│   └──────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 핵심 설계 패턴

### 1. 중첩 Provider 패턴 (Nested Provider Pattern)

애플리케이션 전역 상태는 React Context API를 이용한 중첩 Provider 체인으로 관리합니다. App.jsx에서 최상위에 가까운 Provider일수록 더 전역적인 상태를 담당합니다.

Provider 중첩 순서 (바깥에서 안쪽):
1. `ModalProvider` - 모달 다이얼로그 전역 관리
2. `ErrorBoundary` - 런타임 에러 경계
3. `Netfunnel` - 트래픽 제어 (넷퍼넬 연동)
4. `MallProvider` - 쇼핑몰 기본 정보 (clientId, profile)
5. `OrderConfigProvider` - 주문 설정
6. `BoardConfigurationProvider` - 게시판 설정
7. `AuthProvider` - 회원 인증 상태
8. `TermsProvider` - 약관 정보
9. `TermsContent` - 약관 콘텐츠 렌더
10. `CurrencyWrap` - 다국적 통화 처리
11. `NaverShoppingConfigurationProvider` - 네이버 쇼핑 연동 설정
12. `DesignPopupProvider` - 디자인 팝업 설정
13. `EventProviderV2` - 이벤트 처리 v2

### 2. 상태-액션 컨텍스트 분리 패턴

각 Provider는 상태 읽기용(`useXxxStateContext`)과 액션 실행용(`useXxxActionContext`) 두 가지 Hook으로 분리되어 불필요한 리렌더링을 최소화합니다.

```
Provider
  ├── useXxxStateContext  → 상태 조회
  └── useXxxActionContext → 상태 변경 액션
```

### 3. 레이아웃 Provider 계층 (Layout 내부)

Layout 컴포넌트는 페이지 렌더링에 필요한 추가 Provider를 내부에서 초기화합니다:

- `BannerProvider` + `BannerContent` - 배너 데이터
- `CartProvider` + `CartContent` - 장바구니 상태
- `ProductDetailProvider` - 상품 상세 정보
- `OffCanvasProvider` - 오프캔버스 메뉴
- `SearchAddressProvider` - 주소 검색
- `LayoutProvider` - 레이아웃 설정 (하단 내비게이션 등)

### 4. 코드 스플리팅 (Code Splitting)

모든 페이지와 주요 컴포넌트는 `React.lazy()`로 동적 임포트되어 초기 번들 크기를 최소화합니다. `<Suspense>`로 로딩 상태를 처리합니다.

### 5. 보호된 라우트 패턴 (Protected Route Pattern)

세 가지 라우트 가드 컴포넌트로 접근 제어를 구현합니다:

| 컴포넌트 | 역할 |
|---|---|
| `MemberRoute` | 로그인 필수 페이지 보호 (미인증 시 /sign-in으로 리다이렉트) |
| `NotAccessLoggedInUserRouter` | 비로그인 전용 페이지 보호 (인증 시 접근 차단) |
| `IntroPageRoute` | 인트로 페이지 전용 라우트 |

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| UI 프레임워크 | React 18.2 |
| 라우팅 | React Router 6.4 |
| 번들러 | Webpack 5 |
| 컴파일러 | Babel 7 (preset-env, preset-react) |
| 국제화 | i18next 22, react-i18next 12 |
| 스타일 | CSS (mini-css-extract-plugin) |
| HTTP 클라이언트 | 브라우저 내장 Fetch API |
| 플랫폼 감지 | react-device-detect |
| 코드 품질 | ESLint + Prettier (pre-commit 훅) |
| 컴포넌트 라이브러리 | @shopby/react-components |
| 공통 유틸 | @shopby/shared |

---

## 빌드 환경

| 스크립트 | 설명 |
|---|---|
| `yarn start` | 개발 서버 (development 모드) |
| `yarn build` | 운영 빌드 (production 모드) |
| `yarn build:dev` | 개발 빌드 |
| `yarn build:beta` | 베타 빌드 |

환경 설정은 `public/environment.json`에서 런타임에 로드됩니다 (clientId, profile).

---

## 소스 디렉토리 구조

```
src/
├── index.js              # 애플리케이션 진입점 (DOM 마운트, API 초기화)
├── App.jsx               # 루트 컴포넌트 (전역 Provider 체인)
├── router/               # 라우팅 설정
│   ├── index.js          # 라우트 정의 (useRoutes)
│   ├── MemberRoute.jsx   # 인증 필수 라우트 가드
│   ├── NotAccessLoggedInUserRouter.jsx  # 비로그인 전용 가드
│   ├── IntroPageRoute.jsx
│   └── NotFoundRoute.jsx
├── components/           # 재사용 가능한 UI 컴포넌트 (73개 디렉토리)
├── pages/                # 페이지 컴포넌트 (34개 디렉토리)
├── hooks/                # 커스텀 훅 (5개)
├── utils/                # 유틸리티 함수
│   └── api.js            # HTTP 클라이언트 (fetchHttpRequest)
├── constants/            # 상수 정의
└── assets/               # 정적 자원 (style.css 등)
```
