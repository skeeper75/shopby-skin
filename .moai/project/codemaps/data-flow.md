# 데이터 흐름 - @shopby/react-skin (Aurora Skin)

> 생성일: 2026-03-14

---

## 전체 데이터 흐름 개요

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. 앱 초기화                                                          │
│    public/environment.json → clientId, profile, tc 획득              │
│    → apiCreator() SDK 초기화 → React DOM 마운트                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Provider 체인 초기화                                               │
│    MallProvider → AuthProvider → OrderConfigProvider → ...           │
│    각 Provider가 Shopby API 호출하여 초기 상태 로드                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. 페이지 렌더링                                                       │
│    Router → 현재 경로에 맞는 페이지 컴포넌트 렌더                       │
│    페이지는 useXxxStateContext()로 Context 상태 구독                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. 사용자 인터랙션                                                     │
│    액션 발생 → useXxxActionContext().someAction() 호출                │
│    → fetchHttpRequest() API 호출                                     │
│    → 응답으로 Context 상태 업데이트 → 리렌더링                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1단계: 앱 초기화 흐름 (index.js)

```
브라우저에서 index.js 실행
        │
        ▼
fetch('/environment.json')
        │
        ▼
apiCreator({ baseURL, storageURL, headerOption, tokenConfig })
  ← API SDK 전역 초기화 (@shopby/shared)
        │
        ▼
URL 파라미터 파싱 (trackingKey, channelType)
  setTrackingKey(trackingKey)
  setChannelType(channelType)
        │
        ▼
setPolyfill()
        │
        ▼
createRoot(document.getElementById('app'))
  .render(<BrowserRouter><App clientId profile tc /></BrowserRouter>)
```

---

## 2단계: Provider 체인 상태 초기화

각 Provider는 마운트 시 또는 필요 시점에 Shopby API를 호출하여 상태를 채웁니다.

| Provider | 로드 시점 | 로드 데이터 |
|---|---|---|
| `MallProvider` | 마운트 즉시 | 쇼핑몰 기본 정보 (이름, 로고, 테마 등) |
| `AuthProvider` | 마운트 즉시 | 로그인 상태, 회원 프로필 |
| `OrderConfigProvider` | `BannerContent` 마운트 시 | 주문 관련 설정값 |
| `BoardConfigurationProvider` | `Layout` 마운트 시 | 게시판 설정 |
| `NaverShoppingConfigurationProvider` | `Layout` 마운트 시 | 네이버 쇼핑 연동 설정 |
| `BannerProvider` | `BannerContent` 마운트 시 | 배너 데이터 (메모리 캐시 180초) |
| `CartProvider` | 인증 상태 변경 시 | 장바구니 상품 수 |

---

## 3단계: 페이지별 데이터 흐름

### 상품 상세 페이지 (`ProductDetail`)

```
URL: /product-detail?productNo=12345
        │
        ▼
ProductDetailProvider (Layout 내, productNo prop 전달)
  → Shopby API: GET /products/{productNo}
        │
        ▼
ProductDetail 페이지 컴포넌트
  → useProductDetailStateContext() 로 상태 구독
  → 상품 이미지, 옵션, 가격, 리뷰 표시
        │ 사용자가 "장바구니 담기" 클릭
        ▼
useCartActionContext().addToCart({ productNo, ... })
  → Shopby API: POST /cart
        │
        ▼
CartProvider 상태 업데이트 (장바구니 수량 변경)
  → Header 장바구니 아이콘 숫자 업데이트 (리렌더링)
```

### 주문서 작성 페이지 (`OrderSheet`)

```
URL: /order/:orderSheetNo
        │
        ▼
OrderSheet 페이지 마운트
  → fetchHttpRequest({ url: 'order-sheets/:orderSheetNo' })
  → 주문자 정보, 배송지, 결제 수단 상태 로드
        │ 사용자 폼 입력
        ▼
로컬 상태(useState) 업데이트 (폼 필드)
        │ "결제하기" 클릭
        ▼
fetchHttpRequest({ url: 'order-sheets/:orderSheetNo/orders', method: 'POST' })
        │
        ▼
성공 → /order/confirm 리다이렉트
실패 → 에러 처리 (openAlert 모달)
```

### 마이페이지 (`MyPage` - 로그인 필수)

```
URL: /my-page
        │
        ▼
MemberRoute 가드 확인
  isSignedIn() === false → /sign-in 리다이렉트 (state.from 보존)
  isSignedIn() === true  → 계속
        │
        ▼
useAuthStateContext() → 회원 프로필 정보 구독
  → 회원 등급, 포인트 요약 표시
        │ 하위 메뉴 클릭
        ▼
해당 마이페이지 서브 경로로 네비게이션
  (my-page/coupon, my-page/like 등)
```

---

## API 요청 생명주기 (fetchHttpRequest)

```
컴포넌트에서 fetchHttpRequest() 호출
        │
        ▼
makeApiUrl() - URL 구성
  ├── baseURL ?? API_BASE_URL_MAP.SHOP[profile]
  └── query 파라미터를 URL searchParams에 추가
        │
        ▼
makeHeaderOption() - 헤더 구성
  ├── Content-Type: application/json
  ├── clientId (environment.json에서 로드된 값)
  ├── version: '1.0'
  ├── platform: 'MOBILE_WEB' | 'PC' (react-device-detect)
  └── Authorization: {JWT 토큰} (로그인 상태이고 Shop API 요청인 경우)
        │
        ▼
fetch(uri, request) 실행
        │
   ┌────┴────────────────────┐
   │                         │
   ▼                         ▼
204 응답               기타 응답
   │                         │
   ▼                   KCP 결제?
 return null          ┌──────┴──────┐
                      │             │
                      ▼             ▼
                  response      response
                  .text()       .json()
                      │             │
                      └──────┬──────┘
                             │
                      401 에러?
                      ┌──────┴──────┐
                      │             │
                      ▼             ▼
                 토큰 갱신 후    response.ok?
                 재요청          ┌───┴───┐
                 (reRequestShop) │       │
                                 ▼       ▼
                              return   throw data
                              data     (에러 처리)
```

---

## 상태 관리 패턴

### Context 기반 전역 상태

Aurora Skin은 전용 상태 관리 라이브러리(Redux, Zustand 등)를 사용하지 않습니다. 모든 전역 상태는 `@shopby/react-components`에서 제공하는 Context Provider를 통해 관리합니다.

**상태 읽기 패턴**:
```
컴포넌트 내부
  const { profile, isSignedIn } = useAuthStateContext();
```

**상태 변경 패턴**:
```
컴포넌트 내부
  const { signIn, signOut } = useAuthActionContext();
  // 이벤트 핸들러에서
  await signIn({ loginId, password });
```

### 로컬 상태 (useState)

각 페이지/컴포넌트 내부의 폼 입력, UI 토글 등 페이지 수명과 같은 상태는 `useState`로 관리합니다.

### 캐시 전략

Layout 내 BannerContent와 CartContent에서 메모리 캐시를 활용합니다:
- `cacheOption: { type: 'MEMORY', timeBySeconds: 180 }` - 배너 및 주문 설정을 3분간 캐시
- 캐시 처리는 `@shopby/react-components` Provider 내부에서 수행

---

## 토큰 갱신 흐름 (`useSyncTokenExpiryWithLocation`)

```
라우트(pathname) 변경 감지
        │
        ▼
useAuthStateContext().profile 확인
  profile 없음 또는 keepLogin 활성 또는
  keepDefaultTokenTime 비활성 → 종료
        │
        ▼
memberAuth.get() → 현재 액세스 토큰 확인
  토큰 없음 → 종료
        │
        ▼
memberAuth.set({
  value: currentAuth,
  expires: memberAuth.defaultExpires()
})
  → 토큰 만료 시간을 기본값으로 재설정
  → 페이지 탐색 시마다 세션 유지
```

---

## i18n 데이터 흐름

```
브라우저 언어 감지 (i18next-browser-languagedetector)
        │
        ▼
i18next-http-backend로 번역 파일 비동기 로드
  (public/locales/{언어}/translation.json)
        │
        ▼
컴포넌트에서 useTranslation() 훅 사용
  const { t } = useTranslation();
  t('key') → 번역된 문자열 반환
```
