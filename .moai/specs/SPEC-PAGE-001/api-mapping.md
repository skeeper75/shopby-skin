# SPEC-PAGE-001: API Mapping Table

> shopby Enterprise API 및 외부 API 매핑 - Pages + A7A8-CONTENT + A5-PAYMENT 도메인
>
> 작성일: 2026-03-20 | 작성: MoAI (manager-spec)

---

## 1. Screen-to-API Matrix

### 1.1 메인 페이지 (Main)

| 화면 | 사용자 액션 | shopby Provider / API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|---------------------|----------|--------|---------|----------|-------------|
| Main | 메인 배너 로드 | shopby 메인배너 API | `/display/banners` | GET | `{ type: 'MAIN' }` | `{ banners: [{ imageUrl, linkUrl, title }] }` | 500: 서버 오류 |
| Main | 인기상품 로드 | shopby 상품진열 API | `/display/products` | GET | `{ sectionNo, order: 'POPULAR', limit: 8 }` | `{ products: [{ productNo, name, salePrice, imageUrl }] }` | 500: 서버 오류 |
| Main | 신규상품 로드 | shopby 상품진열 API | `/display/products` | GET | `{ sectionNo, order: 'RECENT', limit: 8 }` | `{ products: [...] }` | 500: 서버 오류 |
| Main | 이벤트/기획전 로드 | shopby 기획전 API | `/display/events` | GET | `{ status: 'ING' }` | `{ events: [{ eventNo, imageUrl, title }] }` | - |
| Main | 최근 리뷰 로드 | shopby 상품후기 API | `/display/product-reviews` | GET | `{ order: 'RECENT', hasImage: true, limit: 6 }` | `{ reviews: [{ content, imageUrl, rating }] }` | - |

### 1.2 상품목록 (ProductList / LIST)

| 화면 | 사용자 액션 | shopby Provider / API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|---------------------|----------|--------|---------|----------|-------------|
| LIST | 카테고리별 상품 조회 | shopby 상품목록 API | `/products` | GET | `{ categoryNo, order, pageNo, pageSize: 20 }` | `{ totalCount, products: [...] }` | 404: 카테고리 없음 |
| LIST | 정렬 변경 | shopby 상품목록 API | `/products` | GET | `{ order: 'POPULAR' / 'LOW_PRICE' / 'RECENT' }` | 동일 | - |
| LIST | 카테고리 트리 조회 | shopby 카테고리 API | `/categories` | GET | `{ depth: 2 }` | `{ categories: [{ categoryNo, name, children }] }` | - |
| LIST | 검색 | shopby 검색 API | `/products/search` | GET | `{ keyword, categoryNo, order, pageNo }` | 동일 | - |

### 1.3 상품상세 - 기타상품 (ProductDetail - SKIN)

| 화면 | 사용자 액션 | shopby Provider / API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|---------------------|----------|--------|---------|----------|-------------|
| Detail | 상품 정보 로드 | `ProductProvider` | `/products/{productNo}` | GET | - | `{ productNo, name, salePrice, images, options, content }` | 404: 상품 없음 |
| Detail | 옵션 선택 (SKIN) | `ProductOptionProvider` | `/products/{productNo}/options` | GET | - | `{ options: [{ optionNo, name, values }] }` | - |
| Detail | 장바구니 담기 | `CartProvider` > `useCartActionContext().addToCart()` | `/cart` | POST | `{ productNo, optionNo, quantity }` | `{ cartNo }` | 400: 옵션 미선택 |
| Detail | 리뷰 목록 | `ProductReviewProvider` | `/products/{productNo}/reviews` | GET | `{ pageNo, pageSize, order }` | `{ totalCount, reviews: [...] }` | - |
| Detail | 상품 문의 목록 | `ProductInquiryProvider` | `/products/{productNo}/inquiries` | GET | `{ pageNo, pageSize }` | `{ totalCount, inquiries: [...] }` | - |

### 1.4 상품상세 - 출력상품 (ProductDetail - option_NEW CUSTOM)

| 화면 | 사용자 액션 | API (CUSTOM) | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|----------|--------|---------|----------|-------------|
| Detail | 상품 옵션 설정 로드 | CUSTOM 옵션 엔진 | `/api/options/config/{productCategoryId}` | GET | - | `{ sections: [{ type, label, items }] }` | 404: 설정 없음 |
| Detail | 종속 옵션 조회 | CUSTOM 옵션 엔진 | `/api/options/dependent` | GET | `{ parentOptionId, parentValue }` | `{ options: [{ id, label, values }] }` | 400: 잘못된 부모 옵션 |
| Detail | 가격 계산 | CUSTOM 가격 매트릭스 | `/api/price/calculate` | POST | `{ categoryId, options: { size, paper, quantity, ... } }` | `{ unitPrice, totalPrice, breakdown: [...] }` | 400: 필수 옵션 누락 |
| Detail | 장바구니 담기 (출력상품) | CUSTOM + shopby | `/api/cart/printing` | POST | `{ productNo, optionSet, quantity, price }` | `{ cartNo }` | 400: 옵션 미완성 |
| Detail | 바로구매 (출력상품) | CUSTOM + shopby | `/api/order/direct` | POST | `{ productNo, optionSet, quantity, price }` | `{ orderToken }` | 400: 옵션 미완성 |

### 1.5 콘텐츠 페이지 (Content)

| 화면 | 사용자 액션 | shopby Provider / API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|---------------------|----------|--------|---------|----------|-------------|
| About | 회사소개 로드 | shopby 기본 페이지 API | `/pages/{pageNo}` | GET | - | `{ title, content (HTML) }` | 404: 페이지 없음 |
| Terms | 이용약관 로드 | shopby 약관 API | `/terms` | GET | `{ termsTypes: 'USE' }` | `{ terms: [{ title, contents }] }` | - |
| Privacy | 개인정보보호 로드 | shopby 약관 API | `/terms` | GET | `{ termsTypes: 'PI_PROCESS' }` | `{ terms: [{ title, contents }] }` | - |
| Location | 카카오맵 로드 | 카카오맵 JS SDK | 외부 SDK | - | `appKey, lat, lng` | 지도 인스턴스 | SDK 로드 실패 |

### 1.6 수동카드결제 (ManualPayment - CUSTOM)

| 화면 | 사용자 액션 | API (CUSTOM) | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|----------|--------|---------|----------|-------------|
| Payment | 관리자 인증 확인 | CUSTOM 인증 | `/api/admin/auth/check` | GET | (Authorization 헤더) | `{ role, name }` | 401: 미인증, 403: 권한 부족 |
| Payment | 주문 조회 | shopby + CUSTOM | `/api/admin/orders/{orderNo}` | GET | - | `{ orderNo, productName, amount, status, ordererName }` | 404: 주문 없음 |
| Payment | 수동결제 실행 | CUSTOM (이니시스) | `/api/admin/payments/manual` | POST | `{ orderNo, amount, idempotencyKey }` | `{ paymentNo, approvalNo, paidAt }` | 400: 금액 불일치, 502: PG 오류 |
| Payment | 결제 내역 조회 | CUSTOM | `/api/admin/payments/history` | GET | `{ orderNo, dateFrom, dateTo }` | `{ payments: [{ paymentNo, amount, status, processedBy }] }` | - |

---

## 2. 외부 API 의존성

### 2.1 카카오맵 JavaScript SDK

| 항목 | 사양 |
|------|------|
| SDK URL | `//dapi.kakao.com/v2/maps/sdk.js?appkey={KEY}` |
| 인증 | JavaScript App Key (도메인 제한) |
| 주요 API | `kakao.maps.Map`, `kakao.maps.Marker`, `kakao.maps.InfoWindow` |
| 무료 할당 | 월 30만건 |
| 에러 핸들링 | SDK 로드 실패 시 주소 텍스트 폴백 |

### 2.2 이니시스 PG 관리자 결제 API

| 항목 | 사양 |
|------|------|
| API 방식 | 서버 사이드 호출 (Node.js/Python) |
| 인증 | Merchant ID + API Key |
| 주요 API | 키인결제(수동결제) |
| 보안 | HTTPS 필수, IP 허용 목록 |
| 응답 코드 | `00`: 성공, 기타: 실패 (코드별 메시지) |

---

## 3. Provider 매핑 요약

| 도메인 | shopby Provider | 사용 화면 |
|-------|----------------|----------|
| 메인 배너 | `MainBannerProvider` | SCR-PG-001 |
| 상품 진열 | `DisplaySectionProvider` | SCR-PG-001 |
| 상품 목록 | `ProductListProvider` | SCR-PG-004 |
| 카테고리 | `CategoryProvider` | SCR-PG-004 |
| 상품 상세 | `ProductProvider` | SCR-PG-006, SCR-PG-007 |
| 상품 옵션 | `ProductOptionProvider` | SCR-PG-006 (기타상품) |
| 장바구니 | `CartProvider` | SCR-PG-006, SCR-PG-007 |
| 상품후기 | `ProductReviewProvider` | SCR-PG-018 |
| 상품문의 | `ProductInquiryProvider` | SCR-PG-019 |
| 약관 | `TermsProvider` | SCR-PG-022, SCR-PG-023 |
| 기획전 | `EventProvider` | SCR-PG-003 |
| (CUSTOM) 옵션 엔진 | 자체 API | SCR-PG-007~015 |
| (CUSTOM) 수동결제 | 자체 API | SCR-PG-027~031 |
