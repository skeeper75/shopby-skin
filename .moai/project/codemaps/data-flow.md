# 데이터 흐름 - @shopby/react-skin

## 전체 데이터 흐름 개요

```
┌─────────────────────────────────────────────────────────┐
│ 1. 앱 초기화                                              │
│    public/environment.json → clientId, profile, tc 획득  │
│    → apiCreator() SDK 초기화 → React DOM 마운트          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Provider 체인 초기화                                   │
│    MallProvider → AuthProvider → OrderConfig → ...      │
│    각 Provider가 Shopby API 호출하여 초기 상태 로드      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. 페이지 렌더링                                          │
│    Router → 현재 경로에 맞는 페이지 컴포넌트 렌더       │
│    페이지는 useXxxStateContext()로 Context 상태 구독    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. 사용자 인터랙션                                        │
│    액션 발생 → useXxxActionContext().someAction() 호출  │
│    → fetchHttpRequest() API 호출                        │
│    → 응답으로 Context 상태 업데이트 → 리렌더링          │
└─────────────────────────────────────────────────────────┘
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
  .render(<BrowserRouter><App .../></BrowserRouter>)
```

---

## 2단계: Provider 체인 상태 초기화

각 Provider는 마운트 시 또는 필요 시점에 Shopby API를 호출하여 상태를 채움.

| Provider | 로드 시점 | 로드 데이터 |
|----------|----------|-----------|
| MallProvider | 마운트 즉시 | 쇼핑몰 기본 정보 (이름, 로고, 테마) |
| AuthProvider | 마운트 즉시 | 로그인 상태, 회원 프로필 |
| OrderConfigProvider | BannerContent 마운트 시 | 주문 관련 설정값 |
| BoardConfigurationProvider | Layout 마운트 시 | 게시판 설정 |
| NaverShoppingConfigurationProvider | Layout 마운트 시 | 네이버 쇼핑 연동 설정 |
| BannerProvider | BannerContent 마운트 시 | 배너 데이터 (메모리 캐시 180초) |
| CartProvider | 인증 상태 변경 시 | 장바구니 상품 수 |
| ProductDetailProvider | ProductDetail 페이지 마운트 시 | 상품 상세 정보 |

---

## 3단계: 페이지별 데이터 흐름

### 상품 상세 페이지 (ProductDetail) - 확장

```
URL: /product-detail?productNo=12345
        │
        ▼
ProductDetailProvider (Layout 내, productNo prop 전달)
  → Shopby API: GET /products/{productNo}
  → 상품 이미지, 옵션, 가격 로드
        │
        ▼
ProductDetail 페이지 컴포넌트
  ├── ProductSummary (요약 정보)
  │   └── 5개 섹션 (Summary, Content, Purchase, Review, Inquiry)
  │
  ├── usePrintOptionsV2 훅 (NEW)
  │   └── 인쇄 옵션 및 가격 계산
  │
  └── usePrintOptions 훅
      └── 레거시 인쇄 옵션
        │
        ▼
사용자 상호작용 (옵션 선택, 파일 업로드, "장바구니 담기" 클릭)
        │
        ▼
useCartActionContext().addToCart({ productNo, ... })
  → Shopby API: POST /cart
        │
        ▼
CartProvider 상태 업데이트 (장바구니 수량 변경)
  → Header 장바구니 아이콘 숫자 업데이트 (리렌더링)
```

### 장바구니 페이지 (Cart) - NEW

```
URL: /cart
        │
        ▼
Cart 페이지 컴포넌트 마운트
        │
        ▼
useCartActionContext() 구독 (장바구니 상품 목록)
  → 상품 목록, 수량, 가격 표시
        │
        ▼
사용자 상호작용
  ├── 수량 변경
  │   └── useCartActionContext().updateQuantity()
  │       → API: PUT /cart/{cartNo}
  │
  ├── 상품 제거
  │   └── useCartActionContext().removeItem()
  │       → API: DELETE /cart/{cartNo}
  │
  └── "주문하기" 클릭
      └── /order/:orderSheetNo로 네비게이션
```

### 주문서 페이지 (OrderSheet) - NEW

```
URL: /order/:orderSheetNo
        │
        ▼
OrderSheet 페이지 마운트
        │
        ▼
useEffect 내에서 주문 데이터 로드
  → fetchHttpRequest({ url: 'order-sheets/:orderSheetNo' })
  → 주문자 정보, 배송지, 상품, 결제 수단 로드
        │
        ▼
OrderSheet UI 렌더링
  ├── 주문자 정보 섹션
  ├── 배송지 선택
  ├── 상품 목록
  ├── 결제 수단 선택
  └── 최종 가격 계산
        │
        ▼
사용자 상호작용 (주문 정보 입력 및 수정)
  └── 폼 입력 → useState로 로컬 상태 업데이트
        │
        ▼
"결제하기" 버튼 클릭
        │
        ▼
fetchHttpRequest({
  url: 'order-sheets/:orderSheetNo/orders',
  method: 'POST',
  requestBody: { 주문자, 배송지, 결제 정보 }
})
        │
        ▼
성공 응답 (orderId)
  → /order/confirm으로 리다이렉트 (orderId 전달)
        │
        ▼
OrderConfirm 페이지 (주문 완료 화면)
```

### 마이페이지 (MyPage) - 로그인 필수

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
  → 회원 등급, 포인트, 적립금 요약 표시
        │
        ▼
MyPage 메뉴 렌더링
  ├── 내 주문
  ├── 상품 리뷰
  ├── 상품 문의
  ├── 개인 문의
  ├── 쿠폰
  ├── 적립금
  ├── 찜 목록
  ├── 배송지 관리
  └── 회원 정보 수정
        │
        ▼
사용자가 메뉴 항목 선택
  → 해당 마이페이지 서브 경로로 네비게이션
```

### 관리자 페이지 (Admin)

```
관리자 로그인
URL: /admin/login
        │
        ▼
AdminLogin 페이지
  → 로그인 폼 입력
  → services/admin/auth.js → loginAdmin()
  → Shopby API: POST /admin/login
        │
        ▼
성공 응답 (관리자 토큰)
  → 토큰 저장 (localStorage)
  → /admin/dashboard로 리다이렉트
        │
        ▼
─────────────────────────
        │
        ▼
관리자 대시보드 및 기능 페이지
URL: /admin/dashboard, /admin/product/list, 등
        │
        ▼
AdminLayout 마운트
  ├── AdminSidebar (네비게이션)
  └── 페이지 컴포넌트 렌더링
        │
        ▼
useAdminAuth 훅으로 인증 확인
  → 토큰 유효성 검사
        │
        ▼
해당 Admin Service 모듈 호출
  ├── services/admin/product.js (상품 관리)
  ├── services/admin/orders.js (주문 관리)
  ├── services/admin/member.js (회원 관리)
  ├── services/admin/accounting.js (회계/원장)
  ├── services/admin/statistics.js (통계)
  ├── services/admin/vendor.js (거래처)
  ├── services/admin/board.js (게시판)
  ├── services/admin/coupon.js (쿠폰)
  └── [기타 6개 서비스]
        │
        ▼
Shopby API 호출
  → GET: 데이터 조회 (목록, 상세)
  → POST: 데이터 생성
  → PUT/PATCH: 데이터 수정
  → DELETE: 데이터 삭제
        │
        ▼
응답 처리
  → 성공: 상태 업데이트 → UI 리렌더링
  → 실패: 에러 메시지 표시
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
  ├── clientId (environment.json에서 로드)
  ├── version: '1.0'
  ├── platform: 'MOBILE_WEB' | 'PC'
  └── Authorization: {JWT 토큰}
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
                                 │       │
                                 ▼       ▼
                              return   throw data
                              data     (에러 처리)
```

---

## 상태 관리 패턴

### Context 기반 전역 상태

Aurora Skin은 Redux/Zustand 미사용. 모든 전역 상태는 `@shopby/react-components` Context로 관리.

**상태 읽기 패턴**:
```javascript
const { profile, isSignedIn } = useAuthStateContext();
const { cartItems } = useCartStateContext();
```

**상태 변경 패턴**:
```javascript
const { signIn, signOut } = useAuthActionContext();
const { addToCart, removeItem } = useCartActionContext();
// 이벤트 핸들러에서
await signIn({ loginId, password });
```

### 로컬 상태 (useState)

페이지/컴포넌트 내부의 폼 입력, UI 토글 등:
- OrderSheet 페이지: 주문자 정보, 배송지, 결제 수단 폼 입력
- ProductDetail 페이지: 선택된 옵션, 수량
- Cart 페이지: 각 상품의 수량 토글

### 캐시 전략

- `cacheOption: { type: 'MEMORY', timeBySeconds: 180 }` - 배너 및 주문 설정을 3분간 캐시
- 캐시 처리는 `@shopby/react-components` Provider 내부에서 수행

---

## 토큰 갱신 흐름 (useSyncTokenExpiryWithLocation)

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

---

## 인쇄 옵션 데이터 흐름 (NEW)

### usePrintOptionsV2 훅 초기화

```
ProductDetail 또는 OrderSheet 페이지에서 호출
        │
        ▼
usePrintOptionsV2()
  ├── types/print-options.js에서 타입 로드
  ├── services/admin/printOptions.js → 옵션 데이터 요청
  └── services/admin/printPrice.js → 가격 계산
        │
        ▼
PrintConfigurator 컴포넌트
  ├── 사용자가 인쇄 옵션 선택
  │   (용지, 크기, 색상, 특수처리 등)
  │
  ├── HuniPriceCalculator 호출
  │   → 선택된 옵션으로 가격 계산
  │
  └── PrintFileUpload
      → 인쇄 파일 업로드 및 검증
        │
        ▼
최종 가격 및 옵션 확정
  → 장바구니 또는 주문에 반영
```

---

## 컴포넌트 간 데이터 흐름 예시

### 상품 상세 → 장바구니 추가

```
ProductDetail 페이지
  ├── ProductSummary
  │   └── 상품 기본 정보 표시
  │
  ├── 옵션 선택 (PrintConfigurator)
  │   └── usePrintOptionsV2 저장
  │
  └── "장바구니 담기" 버튼 클릭
      │
      ▼
useCartActionContext().addToCart({
  productNo: 상품번호,
  quantity: 선택수량,
  options: PrintOptions 데이터
})
      │
      ▼
Shopby API: POST /cart
      │
      ▼
CartProvider 상태 업데이트
  → Header 컴포넌트 리렌더링
  → 장바구니 아이콘 숫자 변경
```

### 관리자 데이터 수정 흐름

```
AdminProductList 페이지
  ├── DataTable에 상품 목록 표시
  │   (services/admin/product.js → getProducts())
  │
  └── 상품 행 클릭
      │
      ▼
AdminProductDetail 페이지로 네비게이션
  ├── 상품 상세 데이터 로드
  │   (services/admin/product.js → getProduct(productNo))
  │
  └── 관리자가 정보 수정
      │
      ▼
"저장" 버튼 클릭
      │
      ▼
services/admin/product.js → updateProduct()
      │
      ▼
Shopby API: PUT /products/{productNo}
      │
      ▼
성공 응답
  → 목록 페이지로 돌아가기
  → 업데이트된 상품 표시
```

---

## 에러 처리 및 복구 흐름

```
API 요청 실패
        │
        ▼
fetchHttpRequest() catch 블록
        │
        ▼
401 (인증 오류)?
  ├─ YES: 토큰 갱신 시도
  │       └─ 재요청 (최대 1회)
  │           ├─ 성공: 데이터 반환
  │           └─ 실패: 에러 처리
  │
  └─ NO: 에러 메시지 포맷
          │
          ▼
useModalActionContext().openAlert({
  title: '오류',
  message: '요청 처리 중 오류가 발생했습니다',
  type: 'alert'
})
          │
          ▼
사용자에게 에러 알림 표시
```

---

## 성능 최적화 - 캐싱 및 메모이제이션

```
Component Render
        │
        ▼
React.memo 확인
  ├─ Props 변경 없음: 리렌더링 스킵
  └─ Props 변경: 리렌더링 진행
        │
        ▼
useMemo() 훅 확인
  ├─ 의존성 배열 미변경: 메모이제이션된 값 재사용
  └─ 의존성 배열 변경: 새로운 값 계산
        │
        ▼
useCallback() 훅 확인
  ├─ 의존성 배열 미변경: 메모이제이션된 함수 재사용
  └─ 의존성 배열 변경: 새로운 함수 생성
        │
        ▼
Context 업데이트
  ├─ 변경된 값만 구독하는 컴포넌트만 리렌더링
  └─ 구독하지 않는 컴포넌트는 리렌더링 스킵
```

---

## 비동기 작업 처리 흐름

```
async 함수 (useEffect 또는 이벤트 핸들러)
        │
        ▼
로딩 상태 = true
        │
        ▼
fetchHttpRequest() 또는 API 호출
        │
        ▼
응답 대기 (await)
        │
   ┌────┴────┐
   │          │
   ▼          ▼
성공         실패
   │          │
   ▼          ▼
데이터    에러 메시지
처리      표시
   │          │
   └────┬─────┘
        │
        ▼
로딩 상태 = false
        │
        ▼
UI 업데이트 완료
```
