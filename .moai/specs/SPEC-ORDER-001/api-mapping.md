# SPEC-ORDER-001: API Mapping Table

> shopby Enterprise API 및 커스텀 BFF API 매핑 - A6B8-ORDER 도메인
>
> 작성일: 2026-03-20 | 작성: manager-spec (MoAI)

---

## 1. shopby Provider 매핑 (Tier 1)

### 1.1 주문서 작성 (OrderSheet)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error |
|------|------------|-----------------|-------------|--------|---------|----------|-------|
| 주문서 | 주문서 진입 | `OrderSheetProvider` > `useOrderSheetStateContext()` | `/order/sheets` | POST | `{ products: [{productNo, optionNo, quantity}] }` | `{ orderSheetNo, deliveryGroups, payInfo }` | 400: 상품 품절 |
| 주문서 | 배송지 목록 | `ShippingAddressProvider` > `useShippingAddressStateContext()` | `/profile/shipping-addresses` | GET | - | `{ items: [{addressNo, receiverName, address, ...}] }` | - |
| 주문서 | 배송지 추가 | `ShippingAddressProvider` > `useShippingAddressActionContext().registerAddress()` | `/profile/shipping-addresses` | POST | `{ receiverName, zipCode, address, detailAddress, ... }` | `{ addressNo }` | 400: 필수값 누락 |
| 주문서 | 배송지 수정 | `ShippingAddressProvider` > `useShippingAddressActionContext().modifyAddress()` | `/profile/shipping-addresses/{addressNo}` | PUT | 동일 | `{ result: boolean }` | 404: 배송지 없음 |

### 1.2 결제 (Payment)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error |
|------|------------|-----------------|-------------|--------|---------|----------|-------|
| 주문서 | 결제하기 | `PaymentProvider` > 결제 모듈 호출 | shopby 결제 모듈 -> KG이니시스 | POST | `{ orderSheetNo, payType, pgType: 'INICIS', ... }` | `{ orderNo, paymentInfo }` | PG 결제 실패 코드 |
| 주문서 | 네이버페이 | `NaverPayProvider` | shopby 결제 모듈 -> 네이버페이 | POST | `{ orderSheetNo, payType: 'NAVER_PAY' }` | `{ orderNo, paymentInfo }` | 네이버페이 오류 |

### 1.3 주문 완료 / 조회

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error |
|------|------------|-----------------|-------------|--------|---------|----------|-------|
| 주문완료 | 주문 정보 조회 | `OrderCompleteProvider` | `/orders/{orderNo}` | GET | - | `{ orderNo, payInfo, deliveryInfo, products }` | 404: 주문 없음 |
| 장바구니 | 장바구니 목록 | `CartProvider` > `useCartStateContext()` | `/cart` | GET | - | `{ items: [{cartNo, productNo, quantity, ...}] }` | - |
| 장바구니 | 장바구니 추가 | `CartProvider` > `useCartActionContext().addToCart()` | `/cart` | POST | `{ products: [{productNo, optionNo, quantity}] }` | `{ cartNo }` | 400: 재고 부족 |

### 1.4 관리자 주문관리

| 화면 | 관리자 액션 | shopby API | Endpoint | Method | Request | Response | Error |
|------|-----------|------------|----------|--------|---------|----------|-------|
| 주문관리 | 주문 목록 | Admin API | `/admin/orders` | GET | `{ orderStatus, startDate, endDate, page }` | `{ items: [...], totalCount }` | - |
| 주문상세 | 주문 상세 | Admin API | `/admin/orders/{orderNo}` | GET | - | `{ orderDetail, products, payments }` | 404 |
| 주문관리 | 상태 변경 | Admin API | `/admin/orders/{orderNo}/status` | PUT | `{ orderStatus, memo }` | `{ result: boolean }` | 400: 유효하지 않은 상태 |
| 주문관리 | 일괄 상태변경 | Admin API | `/admin/orders/status/batch` | PUT | `{ orderNos: [...], orderStatus }` | `{ successCount, failCount }` | - |

---

## 2. 커스텀 BFF API (Tier 2)

### 2.1 파일 업로드/검증

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 파일업로드 | Presigned URL 요청 | `/api/files/presigned-url` | POST | `{ fileName, fileSize, contentType, orderNo? }` | `{ uploadUrl, uploadId, s3Key, fields }` | 400: 포맷/크기 초과 |
| 파일업로드 | 검증 요청 | `/api/files/validate` | POST | `{ s3Key, productNo }` | `{ fileId, status: 'processing' }` | 500: PitStop 장애 |
| 파일업로드 | 검증 결과 조회 | `/api/files/validate/{fileId}` | GET | - | `{ status, result: { resolution, colorMode, bleed, font, ... } }` | 404 |
| 상품상세 | PDF 가이드라인 | `/api/files/template/{productNo}` | GET | - | PDF 파일 스트림 | 404: 템플릿 없음 |

### 2.2 옵션보관함

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 보관함 | 목록 조회 | `/api/storage` | GET | `{ page, size }` | `{ items: [{id, productNo, options, fileId, expiresAt}], total }` | - |
| 보관함 | 저장 | `/api/storage` | POST | `{ productNo, printOptions, fileId }` | `{ storageId, expiresAt }` | 400 |
| 보관함 | 삭제 | `/api/storage/{id}` | DELETE | - | `{ result: boolean }` | 404 |
| 보관함 | 재주문 데이터 | `/api/storage/{id}/reorder` | GET | - | `{ productNo, options, fileId, fileUrl }` | 404, 410: 만료 |

### 2.3 인쇄 공정 상태

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 주문상세 | 공정 상태 조회 | `/api/orders/{orderNo}/status` | GET | - | `{ printStatus, statusHistory: [...], shopbyStatus }` | 404 |
| 관리자 | 상태 변경 | `/api/orders/{orderNo}/status` | PUT | `{ newStatus, notify: boolean, memo? }` | `{ result, notificationId }` | 400: 역방향, 403 |
| 관리자 | 일괄 상태변경 | `/api/orders/status/batch` | PUT | `{ orderNos: [...], newStatus, notify }` | `{ success: n, failed: m, errors: [...] }` | - |

### 2.4 파일확인/재업로드 (관리자)

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 파일확인 | 대기 목록 | `/api/file-review` | GET | `{ page, size }` | `{ items: [{orderNo, fileId, uploadedAt, pitStopResult}], total }` | - |
| 파일확인 | 파일 승인 | `/api/file-review/{orderNo}/approve` | POST | `{ memo? }` | `{ result, newStatus: 'PRINT_READY' }` | 400 |
| 파일확인 | 재업로드 요청 | `/api/file-review/{orderNo}/reupload` | POST | `{ reason, reasonDetail?, channels: ['ALIMTALK','SMS'] }` | `{ result, reuploadToken, notificationId }` | 400 |
| 재업로드 | 고객 재업로드 | `/api/reupload/{token}` | POST | multipart/form-data (파일) | `{ fileId, validationStatus }` | 401: 토큰 만료/무효 |

### 2.5 알림/SMS

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 관리자 | 개별 SMS | `/api/notifications/send` | POST | `{ orderNo, channel, templateId?, message? }` | `{ notificationId, status }` | 400 |
| 관리자 | 일괄 SMS | `/api/notifications/batch` | POST | `{ orderNos: [...], channel, templateId?, message? }` | `{ sent: n, failed: m }` | - |

### 2.6 후불결제

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 후불관리 | 미결제 목록 | `/api/b2b/deferred` | GET | `{ status, partnerNo?, page }` | `{ items: [...], totalAmount, total }` | - |
| 후불관리 | 정산 처리 | `/api/b2b/deferred/{id}/settle` | PUT | `{ paidAt, paymentMethod, memo? }` | `{ result, newStatus: 'PAID' }` | 400 |

### 2.7 증빙서류

| 화면 | 액션 | BFF Endpoint | Method | Request | Response | Error |
|------|------|-------------|--------|---------|----------|-------|
| 증빙관리 | 세금계산서 발급 | `/api/receipts/tax-invoice` | POST | `{ orderNo, businessInfo, supplyAmount, taxAmount }` | `{ invoiceNo, popbillUrl }` | 400, 500: 팝빌 오류 |
| 증빙관리 | 현금영수증 발급 | `/api/receipts/cash-receipt` | POST | `{ orderNo, identityNo, amount }` | `{ receiptNo }` | 400, 500 |

---

## 3. API 인증 정리

| API 그룹 | 인증 방식 | 토큰 위치 |
|----------|----------|----------|
| shopby 쇼핑몰 API | JWT accessToken | Authorization: Bearer {token} |
| shopby Admin API | Admin Token | X-Shopby-Admin-Token |
| BFF 회원 API | shopby accessToken 검증 | Authorization: Bearer {token} |
| BFF 관리자 API | Admin Token + Role 검증 | X-Admin-Token + X-Admin-Role |
| 재업로드 페이지 | Reupload Token (1회용) | Query: ?token=XXX |
| S3 파일 접근 | Presigned URL | URL에 서명 포함 (15분 만료) |
