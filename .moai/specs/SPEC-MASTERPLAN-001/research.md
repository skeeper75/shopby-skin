# SPEC-MASTERPLAN-001 Research: Aurora Skin → Next.js Headless 마이그레이션

## 1. Aurora Skin 아키텍처 분석 결과

### 핵심 발견: 100% Provider 의존 아키텍처
- 85+ 커스텀 훅 (@shopby/react-components)
- 10단계 중첩 Provider 체인
- 모든 비즈니스 로직이 shopby 서버에 존재
- 프론트엔드는 순수 UI 렌더링만 담당

### Provider → API 매핑 (Headless 재구현 대상)

| Provider | 역할 | shopby API 엔드포인트 | 재구현 복잡도 |
|----------|------|---------------------|-------------|
| AuthProvider | 인증/토큰 | oauth2, members/* | 높음 |
| MallProvider | 몰 설정 | malls/{mallNo} | 낮음 |
| CartProvider | 장바구니 | carts/* | 중 |
| OrderSheetProvider | 주문 | order-sheets/*, orders/* | 높음 |
| ProductDetailProvider | 상품 상세 | products/{productNo} | 중 |
| ProductSearchProvider | 검색 | products/search, categories/* | 중 |
| MemberModificationProvider | 회원 수정 | members/{memberId}/* | 중 |
| MyShippingAddressProvider | 배송지 | shipping-addresses/* | 낮음 |
| ClaimProvider | 클레임 | claims/* | 중 |
| BoardConfigProvider | 게시판 | boards/* | 낮음 |

### Headless 마이그레이션에서 제거되는 것

| Aurora Skin 의존성 | 대체 방안 |
|-------------------|----------|
| @shopby/react-components | shopby REST API 직접 호출 |
| @shopby/shared (memberAuth) | 자체 JWT 관리 (쿠키 기반) |
| Webpack 5 + Babel | Next.js Turbopack |
| React Router 6 | Next.js App Router |
| 10단계 Provider 체인 | Zustand 스토어 3-4개 |
| Plain CSS | Tailwind CSS + shadcn/ui |
| JSX | TypeScript |
| ShopbyExternalScript | 자체 analytics 연동 |
| Netfunnel | 제거 또는 대체 |

## 2. shopby API 서비스 레이어 설계

### lib/shopby/ 구조

```typescript
// lib/shopby/client.ts
- createShopbyClient(clientId, profile)
- 자동 토큰 주입/갱신
- 에러 핸들링 (401 → 토큰 리프레시)

// lib/shopby/auth.ts
- signIn(email, password) → token
- signUp(memberData) → member
- refreshToken() → newToken
- signOut()

// lib/shopby/products.ts
- getProducts(filters) → ProductList
- getProduct(productNo) → ProductDetail
- getProductOptions(productNo) → Options
- searchProducts(keyword, filters) → SearchResult

// lib/shopby/cart.ts
- getCart() → CartDetail
- addToCart(productNo, optionNo, qty) → CartItem
- updateCartItem(cartNo, qty)
- removeCartItem(cartNo)

// lib/shopby/orders.ts
- createOrderSheet(cartNos[]) → OrderSheet
- getOrderSheet(orderSheetNo) → OrderSheetDetail
- updateOrdererInfo(orderSheetNo, info)
- updateShippingAddress(orderSheetNo, address)
- placeOrder(orderData) → Order
- getOrder(orderNo) → OrderDetail

// lib/shopby/members.ts
- getMember(memberId) → MemberProfile
- updateMember(memberId, data)
- getShippingAddresses(memberId) → Address[]
- getCoupons(memberId) → Coupon[]
- getAccumulation(memberId) → number

// lib/shopby/boards.ts
- getArticles(boardId, page) → ArticleList
- createInquiry(data) → Inquiry
```

## 3. 인쇄 특화 API 설계 (Custom BFF)

### app/api/ 구조

```typescript
// app/api/print-options/route.ts
GET /api/print-options?productType=PRINT&category=명함
→ 종속 옵션 트리 반환 (사이즈→종이→인쇄→후가공)

// app/api/price-calculate/route.ts
POST /api/price-calculate
body: { productType, size, paper, printing, finishing, quantity }
→ { unitPrice, totalPrice, breakdown }

// app/api/file-upload/route.ts
POST /api/file-upload
→ { presignedUrl, fileId } (S3 presigned URL)

// app/api/file-validate/route.ts
POST /api/file-validate
body: { fileId }
→ { status: PASS|WARNING|FAIL, issues[] }

// app/api/order-meta/route.ts
POST /api/order-meta
body: { shopbyOrderNo, printOptions, fileUrls }
→ 인쇄 메타데이터 저장

GET /api/order-meta/{shopbyOrderNo}
→ 인쇄 메타데이터 조회

// app/api/production-status/route.ts (MES 프록시, 2차)
GET /api/production-status/{orderNo}
→ { status, currentStep, estimatedCompletion }
```

## 4. 데이터 동기화 전략

### shopby 주문 ↔ 인쇄 메타데이터

```
주문 생성 시:
1. 프론트 → shopby Order API (주문 생성) → shopbyOrderNo
2. 프론트 → Custom API /api/order-meta (메타데이터 저장)
   payload: {
     shopbyOrderNo,
     printOptions: { size, paper, printing, finishing... },
     fileUrls: ["s3://..."],
     priceBreakdown: { print: 10000, finishing: 5000 }
   }

관리자 조회 시:
1. shopby API → 주문 기본 정보 (배송, 결제)
2. Custom API → 인쇄 메타데이터 (옵션, 파일, 공정 상태)
3. 프론트에서 병합하여 표시

상태 변경 시:
1. 관리자 → shopby API (주문 상태 변경)
2. 관리자 → Custom API (공정 상태 변경)
3. (2차) Custom API → MES (자동 동기화)
```

## 5. 8주 일정에서 추가로 필요한 작업

### W1에 추가 (shopby API 검증)
- shopby API 문서 기반 TypeScript 타입 생성 (1일)
- 핵심 API 5개 엔드포인트 연동 테스트 (1일)
  - 상품 목록, 상품 상세, 장바구니, 회원 인증, 주문 생성
- shopby 테스트 환경 상품 데이터 등록

### W3에 추가 (BFF + DB)
- PostgreSQL (Supabase/Neon) 셋업 (0.5일)
- 인쇄 옵션 데이터 모델 설계 + 시드 데이터 (1일)
- 가격 매트릭스 데이터 입력 (명함/전단/포스터 3종)

### W6에 추가 (Edicus/MES 인터페이스)
- Edicus SDK 문서 확인 + 인터페이스 TypeScript 정의
- MES 연동 프로토콜 문서 확인 + API 스텁 작성
- 연동 테스트는 2차 개발로 연기

## 6. 위험 요소

| 위험 | 영향 | 대응 |
|------|------|------|
| shopby API 미문서화 엔드포인트 | 기능 구현 불가 | DevTools로 Aurora Skin 네트워크 탭 분석 |
| shopby API 인증 토큰 정책 변경 | 인증 실패 | shopby 측과 사전 확인 |
| 주문 생성 시 필수 필드 누락 | 주문 실패 | shopby 테스트 환경에서 선행 검증 |
| Edicus SDK 미제공 | 에디터 통합 불가 | 2차 개발로 연기, 파일 업로드만 MVP |
| MES 연동 프로토콜 미확정 | 생산 연동 불가 | 관리자 수동 상태 변경으로 MVP |
