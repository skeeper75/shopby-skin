# SPEC-MYPAGE-001: API Mapping Table

> shopby Enterprise API 및 Provider 매핑 - A3-MYPAGE 도메인 화면설계 기준 문서
>
> 작성일: 2026-03-20 | 작성: manager-spec (MoAI)

---

## 1. Screen-to-API Matrix

### 1.1 주문조회 (Orders)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| 주문목록 | 주문 목록 조회 | `OrderListProvider` > `useOrderListContext()` | `/orders` | GET | `{ startDate, endDate, orderStatusType, pageNumber, pageSize }` | `{ items: [{ orderNo, orderStatusType, products, payInfo }], totalCount }` | 401: 미인증 |
| 주문목록 | 기간 필터 변경 | `OrderListProvider` > `useOrderListActionContext().fetchOrders()` | `/orders` | GET | `{ startDate, endDate }` | 동일 | - |
| 주문목록 | 상태 탭 변경 | `OrderListProvider` > `useOrderListActionContext().fetchOrders()` | `/orders` | GET | `{ orderStatusType }` | 동일 | - |
| 주문상세 | 주문 상세 조회 | `OrderDetailProvider` > `useOrderDetailContext()` | `/orders/{orderNo}` | GET | - | `{ orderNo, products, payInfo, deliveryInfo, orderStatusType }` | 404: 주문 없음 |
| 주문상세 | 주문 취소 | `OrderDetailProvider` > `useOrderDetailActionContext().cancelOrder()` | `/orders/{orderNo}/cancel` | PUT | `{ cancelReason }` | `{ result: boolean }` | 400: 취소 불가 상태 |
| 주문상세 | 재주문 | 자체 구현 (장바구니 API) | `/carts` | POST | `{ products: [{ productNo, optionNo, orderCnt }] }` | `{ cartNo }` | 400: 품절/옵션 없음 |

### 1.2 편집 미리보기 (CUSTOM)

| 화면 | 사용자 액션 | Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|----------|-------------|--------|---------|----------|-------------|
| 편집미리보기 | 썸네일 조회 | `CustomPreviewProvider` (자체) | `[Custom] /preview/{orderNo}/{productNo}` | GET | - | `{ thumbnailUrl, fileName, uploadDate }` | 404: 파일 없음 |

### 1.3 쿠폰관리 (Coupons)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| 쿠폰목록 | 쿠폰 목록 조회 | `CouponProvider` > `useCouponContext()` | `/coupons` | GET | `{ usable: true/false, pageNumber, pageSize }` | `{ items: [{ couponNo, couponName, discountAmt, minOrderAmt, expireDate }], totalCount }` | 401: 미인증 |
| 쿠폰등록 | 쿠폰 코드 등록 | `CouponProvider` > `useCouponActionContext().registerCoupon()` | `/coupons/register` | POST | `{ promotionCode }` | `{ result: boolean, couponNo }` | 400: 유효하지 않은 코드, 409: 이미 등록됨 |

### 1.4 프린팅머니 (Accumulation)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| 프린팅머니 | 잔액 조회 | `AccumulationProvider` > `useAccumulationContext()` | `/accumulations/summary` | GET | - | `{ totalAvailableAmt, totalExpiredAmt }` | 401: 미인증 |
| 프린팅머니 | 내역 조회 | `AccumulationProvider` > `useAccumulationActionContext().fetchHistory()` | `/accumulations/history` | GET | `{ startDate, endDate, accumulationType, pageNumber }` | `{ items: [{ type, amt, regDate, orderNo, reason }] }` | - |

### 1.5 프린팅머니 충전 (CUSTOM)

| 화면 | 사용자 액션 | Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|----------|-------------|--------|---------|----------|-------------|
| 머니충전 | 충전 요청 | `ChargeProvider` (자체) | `[Custom] /charge/request` | POST | `{ amount, paymentMethod }` | `{ chargeId, pgPaymentUrl }` | 400: 최소금액 미만 |
| 머니충전 | PG 결제 콜백 | `ChargeProvider` (자체) | `[Custom] /charge/callback` | POST | `{ chargeId, pgResult }` | `{ result, newBalance }` | 500: 적립금 전환 실패 |
| 머니충전 | 충전 결과 조회 | `ChargeProvider` (자체) | `[Custom] /charge/{chargeId}` | GET | - | `{ status, amount, newBalance, couponIssued }` | 404: 충전건 없음 |

### 1.6 리뷰 (Reviews)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| 나의리뷰 | 리뷰 목록 조회 | `ProductReviewProvider` > `useProductReviewContext()` | `/product-reviews/my` | GET | `{ pageNumber, pageSize }` | `{ items: [{ reviewNo, productName, content, rate, images, regDate }] }` | - |
| 리뷰작성 | 리뷰 등록 | `ProductReviewProvider` > `useProductReviewActionContext().registerReview()` | `/product-reviews` | POST | `{ orderOptionNo, rate, content, urls[] }` | `{ reviewNo }` | 400: 이미 작성됨, 403: 배송미완료 |
| 리뷰수정 | 리뷰 수정 | `ProductReviewProvider` > `useProductReviewActionContext().updateReview()` | `/product-reviews/{reviewNo}` | PUT | `{ rate, content, urls[] }` | `{ result: boolean }` | 404: 리뷰 없음 |
| 리뷰삭제 | 리뷰 삭제 | `ProductReviewProvider` > `useProductReviewActionContext().deleteReview()` | `/product-reviews/{reviewNo}` | DELETE | - | `{ result: boolean }` | 404: 리뷰 없음 |
| 리뷰작성 | 이미지 업로드 | (파일 업로드) | `/files/images` | POST | `FormData { file }` | `{ imageUrl }` | 413: 파일 크기 초과 |

### 1.7 리뷰 적립금 자동지급/회수 (CUSTOM)

| 화면 | 사용자 액션 | Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|----------|-------------|--------|---------|----------|-------------|
| 리뷰작성 후 | 적립금 자동 지급 | `RewardProvider` (자체) | `[Custom] /rewards/review` | POST | `{ reviewNo, reviewType: 'TEXT'|'PHOTO' }` | `{ rewardAmt, newBalance }` | 409: 이미 지급됨 |
| 리뷰삭제 후 | 적립금 자동 회수 | `RewardProvider` (자체) | `[Custom] /rewards/review/{reviewNo}/reclaim` | POST | - | `{ reclaimedAmt, newBalance }` | 404: 지급 내역 없음 |

### 1.8 증빙서류 (Documents - CUSTOM)

| 화면 | 사용자 액션 | Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|----------|-------------|--------|---------|----------|-------------|
| 증빙서류 | 발급 내역 조회 | `DocumentProvider` (자체) | `[Custom] /documents` | GET | `{ pageNumber, pageSize }` | `{ items: [{ docNo, orderNo, type, status, issuedDate, amount }] }` | - |
| 증빙서류 | 세금계산서 발급 | `DocumentProvider` (자체) | `[Custom] /documents/tax-invoice` | POST | `{ orderNo, businessInfoId }` | `{ docNo, status }` | 400: 사업자정보 필요, 409: 이미 발급 |
| 증빙서류 | 현금영수증 발급 | `DocumentProvider` (자체) | `[Custom] /documents/cash-receipt` | POST | `{ orderNo, identityNo }` | `{ docNo, status }` | 400: 현금결제 아님 |
| 증빙서류 | PDF 다운로드 | `DocumentProvider` (자체) | `[Custom] /documents/{docNo}/pdf` | GET | - | `Blob (PDF)` | 404: 미발급 |

### 1.9 사업자정보 (Business Info)

| 화면 | 사용자 액션 | Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|----------|-------------|--------|---------|----------|-------------|
| 사업자정보 | 목록 조회 | `BusinessInfoProvider` (자체) | `[Custom] /business-info` | GET | - | `{ items: [{ id, companyName, bizNo, ceoName }] }` | - |
| 사업자정보 | 등록 | `BusinessInfoProvider` (자체) | `[Custom] /business-info` | POST | `{ companyName, bizNo, ceoName, bizType, bizItem, address, email }` | `{ id }` | 400: 사업자번호 유효성 |
| 사업자정보 | 수정 | `BusinessInfoProvider` (자체) | `[Custom] /business-info/{id}` | PUT | 동일 | `{ result: boolean }` | 404: 미등록 |
| 사업자정보 | 삭제 | `BusinessInfoProvider` (자체) | `[Custom] /business-info/{id}` | DELETE | - | `{ result: boolean }` | 400: 사용중인 정보 |
| 현금영수증 | 정보 등록/수정 | `BusinessInfoProvider` (자체) | `[Custom] /cash-receipt-info` | PUT | `{ type: 'PERSONAL'|'BUSINESS', identityNo }` | `{ result: boolean }` | - |

### 1.10 1:1문의 (Inquiries)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| 1:1문의 | 문의 목록 조회 | `InquiryProvider` > `useInquiryContext()` | `/inquiries/my` | GET | `{ pageNumber, pageSize, answered }` | `{ items: [{ inquiryNo, title, regDate, answered }] }` | - |
| 문의작성 | 문의 등록 | `InquiryProvider` > `useInquiryActionContext().registerInquiry()` | `/inquiries` | POST | `{ inquiryTypeCode, title, content, urls[] }` | `{ inquiryNo }` | 400: 필수항목 누락 |
| 문의상세 | 문의 상세 조회 | `InquiryProvider` > `useInquiryActionContext().fetchInquiryDetail()` | `/inquiries/{inquiryNo}` | GET | - | `{ inquiryNo, title, content, answer, answeredDate }` | 404: 문의 없음 |

### 1.11 회원계정 (Account - SPEC-MEMBER-001 연계)

| 화면 | 사용자 액션 | shopby Provider | API Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----------------|-------------|--------|---------|----------|-------------|
| 비밀번호재확인 | 비밀번호 확인 | `MyProfileProvider` > `useMyProfileActionContext().verifyPassword()` | `/profile/verify-password` | POST | `{ password }` | `{ result: boolean }` | 400: 비밀번호 불일치 |
| 회원정보수정 | 프로필 조회 | `MyProfileProvider` > `useMyProfileContext()` | `/profile` | GET | - | `{ memberId, memberName, mobileNo, email, marketingAgree }` | - |
| 회원정보수정 | 프로필 수정 | `MyProfileProvider` > `useMyProfileActionContext().updateProfile()` | `/profile` | PUT | `{ memberName, mobileNo, smsAgreed }` | `{ result: boolean }` | 400: 유효성 오류 |
| 비밀번호변경 | 비밀번호 변경 | `ChangePasswordProvider` > `useChangePasswordActionContext().changePassword()` | `/profile/password` | PUT | `{ currentPassword, newPassword }` | `{ result: boolean }` | 400: 현재 비밀번호 불일치 |
| 회원탈퇴 | 탈퇴 처리 | `WithdrawalProvider` > `useWithdrawalActionContext().withdraw()` | `/profile/withdrawal` | POST | `{ reason, password }` | `{ result: boolean }` | 400: 비밀번호 불일치 |

---

## 2. API 분류 요약

| 분류 | API 수 | Provider 유형 |
|------|--------|-------------|
| shopby NATIVE | 15개 | shopby 공식 Provider |
| CUSTOM Server | 12개 | 자체 개발 Provider |
| 파일 업로드 | 1개 | shopby 파일 API |
| MEMBER 연계 | 5개 | SPEC-MEMBER-001 Provider |
| **합계** | **33개** | |

---

## 3. CUSTOM API Server 엔드포인트 요약

```
[Custom Server API]

/charge
  POST /charge/request          - 충전 요청 (PG 결제 시작)
  POST /charge/callback         - PG 결제 결과 콜백
  GET  /charge/{chargeId}       - 충전 결과 조회

/rewards
  POST /rewards/review          - 리뷰 적립금 자동 지급
  POST /rewards/review/{id}/reclaim  - 리뷰 적립금 자동 회수

/documents
  GET  /documents               - 증빙서류 내역
  POST /documents/tax-invoice   - 세금계산서 발급
  POST /documents/cash-receipt  - 현금영수증 발급
  GET  /documents/{id}/pdf      - PDF 다운로드

/business-info
  GET  /business-info           - 사업자정보 목록
  POST /business-info           - 사업자정보 등록
  PUT  /business-info/{id}      - 사업자정보 수정
  DELETE /business-info/{id}    - 사업자정보 삭제

/cash-receipt-info
  PUT  /cash-receipt-info       - 현금영수증 정보 등록/수정

/preview
  GET  /preview/{orderNo}/{productNo}  - 편집 미리보기 썸네일
```
