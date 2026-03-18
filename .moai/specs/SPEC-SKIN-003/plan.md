# SPEC-SKIN-003 v2 구현 계획

> **SPEC**: SPEC-SKIN-003
> **버전**: 2.0.0
> **작성일**: 2026-03-17
> **개발 모드**: DDD (ANALYZE-PRESERVE-IMPROVE)

## 1. 마일스톤

### Primary Goal (P0 - 8 TAGs)

핵심 구매 플로우: 종속옵션 -> 가격계산 -> 장바구니 -> 파일업로드 -> 결제 -> 주문완료

| 순서 | TAG | 기능 | 규모 | 의존성 |
|------|-----|------|------|--------|
| 1 | TAG-001 | 종속옵션 엔진 | XL | 없음 (핵심) |
| 2 | TAG-002 | 가격 매트릭스 계산 | L | TAG-001 |
| 3 | TAG-003 | 옵션 저장/견적서 | M | TAG-001, TAG-002 |
| 4 | TAG-004 | 상품 목록/필터 | M | 없음 (독립) |
| 5 | TAG-005 | 장바구니 | M | TAG-001, TAG-002 |
| 6 | TAG-006 | 파일 업로드 | L | 없음 (독립) |
| 7 | TAG-008 | 배송정보 입력 | S | 없음 (독립) |
| 8 | TAG-009 | 결제 연동 | L | TAG-005, TAG-008 |

### Secondary Goal (P1 - 4 TAGs)

| 순서 | TAG | 기능 | 규모 | 의존성 |
|------|-----|------|------|--------|
| 9 | TAG-010 | 주문완료 | S | TAG-009 |
| 10 | TAG-011 | 비회원 주문 | M | TAG-009 |
| 11 | TAG-012 | 주문 상태 관리 | M | TAG-010 |
| 12 | TAG-007 | 파일 검수/재업로드 (관리자) | L | TAG-006 |

### Optional Goal (P2)

- 빠른주문 숏컷 (HuniQuickOrder)
- 디자인 의뢰
- 포장재/굿즈/수작 상품 주문
- 무한 스크롤

## 2. 파일별 변경 계획

### 2.1 TAG-001: 종속옵션 엔진 (PrintConfigurator)

**ANALYZE**: 기존 PrintConfigurator 구조 파악, 옵션 종속관계 로직 확인

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/PrintConfigurator/index.tsx` | 수정 | RadioGroup/Checkbox/Field 통합, data-* 상태 |
| `src/components/PrintConfigurator/OptionStep.tsx` | 수정 | 각 단계별 옵션 렌더링, RadioGroup 적용 |
| `src/components/PrintConfigurator/FinishSection.tsx` | 수정 | 후가공 다중선택 Checkbox 적용 |
| `src/components/PrintConfigurator/CoatingSection.tsx` | 수정 | 코팅 선택 RadioGroup 적용 |
| `src/components/PrintConfigurator/QuantityInput.tsx` | 수정 | CounterInput (34+155+34px RULE-3) |
| `src/components/PrintConfigurator/CustomSizeInput.tsx` | 신규 | 비규격 사이즈 입력 (2단계 대비) |
| `src/hooks/usePrintOptions.ts` | 수정 | 종속옵션 트리 API 연동 |
| `src/types/print-options.ts` | 수정 | 옵션 타입 정의 확장 |
| `src/api/custom/print-options.ts` | 수정 | `/custom/print-options/tree` API |

### 2.2 TAG-002: 가격 매트릭스 계산

**ANALYZE**: 기존 HuniPriceCalculator, usePrintPrice 훅 파악

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/HuniPriceCalculator/index.tsx` | 수정 | `--huni-*` 토큰 적용, 스티키 레이아웃 |
| `src/components/HuniPriceCalculator/PriceBreakdown.tsx` | 수정 | 가격 상세 내역 (기본+후가공+코팅+급행) |
| `src/components/HuniPriceCalculator/MobilePriceSheet.tsx` | 신규 | 모바일 고정 바텀시트 |
| `src/hooks/usePrintPrice.ts` | 수정 | 가격 매트릭스 API 연동, debounce 300ms |
| `src/api/custom/print-price.ts` | 수정 | `POST /custom/print-price` |

### 2.3 TAG-003: 옵션 저장/견적서

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/PrintConfigurator/OptionActions.tsx` | 수정 | 옵션저장/견적서 버튼 (`--huni-*` 토큰) |
| `src/components/QuoteDialog/index.tsx` | 수정 | Dialog 컴포넌트 적용 |
| `src/components/QuoteDialog/QuoteContent.tsx` | 수정 | 견적서 내용 렌더링 |
| `src/api/custom/print-options.ts` | 수정 | `POST /custom/print-options` 저장 |
| `src/api/custom/quotation.ts` | 수정 | `GET /custom/quotation` PDF |

### 2.4 TAG-004: 상품 목록/필터

**ANALYZE**: 기존 DisplayCategoryList, ProductList 파악

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/DisplayCategoryList/index.tsx` | 수정 | Tabs(카테고리), Pagination, Skeleton 적용 |
| `src/components/ProductList/ProductCard.tsx` | 수정 | 가격범위 표시, HuniBadge, `--huni-*` |
| `src/components/ProductList/FilterSidebar.tsx` | 수정 | Checkbox/RadioGroup 필터 |
| `src/components/ProductList/FilterBottomSheet.tsx` | 신규 | 모바일 필터 바텀시트 |
| `src/components/HuniSkeletonCard/index.tsx` | 유지 | 로딩 스켈레톤 |

### 2.5 TAG-005: 장바구니

**ANALYZE**: 기존 Cart 페이지 구조 파악

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Cart/index.tsx` | 수정 | Dialog(이동확인), Snackbar, Chip(옵션표시) |
| `src/pages/Cart/CartItem.tsx` | 수정 | 인쇄옵션 Chip 표시, Divider |
| `src/pages/Cart/CartSummary.tsx` | 수정 | 가격 분석행, `--huni-*` 토큰 |

### 2.6 TAG-006: 파일 업로드

**ANALYZE**: 기존 PrintFileUpload, useFileUpload 파악

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/PrintFileUpload/index.tsx` | 수정 | Field 래핑, 드래그앤드롭 |
| `src/components/PrintFileUpload/FilePreview.tsx` | 수정 | 파일 미리보기 Dialog |
| `src/components/PrintFileUpload/UploadProgress.tsx` | 수정 | 진행률 바 |
| `src/hooks/useFileUpload.ts` | 수정 | S3 Presigned URL 방식 |
| `src/api/custom/files.ts` | 수정 | presigned-url, complete API |

### 2.7 TAG-007: 파일 검수/재업로드 (관리자)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/admin/FileCheck/index.tsx` | 수정 | 검수 대기 목록, 결과 표시 |
| `src/pages/admin/FileCheck/FileReview.tsx` | 수정 | 수동 검수 체크리스트 |
| `src/pages/admin/FileCheck/ReuploadRequest.tsx` | 수정 | 재업로드 요청 발송 |
| `src/hooks/useFileCheck.ts` | 신규 | 파일 검수 상태 관리 |

### 2.8 TAG-008: 배송정보 입력

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/OrderSheet/ShippingInfo.tsx` | 수정 | TextField/Field 적용 |
| `src/pages/OrderSheet/AddressSearch.tsx` | 수정 | 카카오 주소 API 연동 |
| `src/hooks/useIslandShipping.ts` | 유지 | 도서산간 배송비 계산 |

### 2.9 TAG-009: 결제 연동

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/OrderSheet/PaymentSection.tsx` | 수정 | RadioGroup(결제수단), `--huni-*` |
| `src/pages/OrderSheet/CouponSection.tsx` | 수정 | Dialog(쿠폰선택), TextField(코드입력) |
| `src/pages/OrderSheet/PrintingMoneySection.tsx` | 수정 | TextField(사용금액), Snackbar |
| `src/hooks/usePayment.ts` | 수정 | 이니시스 SDK + 간편결제 SDK |
| `src/hooks/useCoupon.ts` | 유지 | 쿠폰 적용 로직 |
| `src/libs/payment/inicis.ts` | 수정 | 이니시스 SDK 래퍼 |
| `src/libs/payment/naver-pay.ts` | 신규 | 네이버페이 SDK 래퍼 |
| `src/libs/payment/kakao-pay.ts` | 신규 | 카카오페이 SDK 래퍼 |
| `src/libs/payment/toss-pay.ts` | 신규 | 토스페이 SDK 래퍼 |

### 2.10 TAG-010: 주문완료

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/OrderConfirm/index.tsx` | 수정 | Snackbar, `--huni-*` 토큰 적용 |

### 2.11 TAG-011: 비회원 주문

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/OrderSheet/GuestInfo.tsx` | 신규 | 비회원 주문자 정보 입력 (TextField/Field) |
| `src/pages/GuestOrderLookup/index.tsx` | 수정 | 비회원 주문조회 (TextField/Field) |

### 2.12 TAG-012: 주문 상태 관리

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/components/OrderStatus/StatusChip.tsx` | 수정 | Chip 컴포넌트 적용 |
| `src/components/OrderStatus/StatusTimeline.tsx` | 수정 | 11/9단계 매핑 |
| `src/hooks/useOrderStatus.ts` | 수정 | 상태 전환 로직 |
| `src/constants/order-status.ts` | 수정 | 11단계 내부 + 9단계 고객 매핑 |

## 3. 기술 접근 방식

### 3.1 종속옵션 엔진 아키텍처

```
사용자 옵션 선택
    |
    v
usePrintOptions hook
    |-- GET /custom/print-options/tree (초기 로딩)
    |-- 상위 옵션 변경 시 하위 필터링 (클라이언트 로직)
    |-- 비활성 옵션: data-disabled attribute
    v
PrintConfigurator (RadioGroup/Checkbox/Field)
    |
    v
usePrintPrice hook
    |-- POST /custom/print-price (debounce 300ms)
    |-- 결과: 기본단가 + 후가공 + 코팅 + 급행
    v
HuniPriceCalculator (스티키 바)
```

### 3.2 파일 업로드 아키텍처

```
사용자 파일 선택/드롭
    |
    v
클라이언트 검증 (확장자, 크기)
    |
    v
POST /custom/files/presigned-url
    |-- Response: { url, fields, fileId }
    v
브라우저 -> S3 직접 PUT (XMLHttpRequest, progress 이벤트)
    |
    v
POST /custom/files/complete { fileId }
    |-- 서버: 자동 검증 파이프라인 트리거
    v
WebSocket 알림 (PASS/WARNING/FAIL)
```

### 3.3 결제 연동 아키텍처

```
결제수단 선택 (RadioGroup)
    |
    +--> 이니시스: inicis.requestPay({ payMethod, amount, ... })
    |       |-- callback: POST /payments -> POST /orders/confirm
    |
    +--> 네이버페이: NaverPay.open({ productName, totalPayAmount })
    |       |-- returnUrl -> POST /orders/confirm
    |
    +--> 카카오페이: KakaoPay.ready({ item_name, total_amount })
    |       |-- redirect -> POST /orders/confirm
    |
    +--> 토스페이: TossPay.requestPayment({ amount, orderId })
    |       |-- successUrl -> POST /orders/confirm
    |
    +--> 프린팅머니 전액: POST /orders/confirm (PG 미경유)
```

## 4. 리스크 분석

| 리스크 | 영향 | 완화 전략 |
|--------|------|----------|
| 간편결제 3종 SDK 동시 통합 | 높음 | 1종씩 순차 통합, 공통 래퍼 인터페이스 설계 |
| 종속옵션 데이터 부재 | 높음 | 목업 데이터로 UI 먼저 개발, API 후 연동 |
| 가격 매트릭스 미확정 | 중간 | 어드민 가격 관리 팝업 (SPEC-SKIN-006) 선행 |
| S3 Presigned URL CORS | 중간 | 개발 초기 CORS 설정 확인 |
| 이니시스 SDK 테스트 환경 | 중간 | 이니시스 테스트 가맹점 키 확보 |
| 모바일 옵션 UX 복잡도 | 중간 | 바텀시트 + 단계별 UI로 단순화 |
| 기존 Aurora 코드 충돌 | 낮음 | DDD ANALYZE 단계에서 충분한 분석 |

## 5. Aurora 기존 코드 재사용

| Aurora 파일 | 재사용 범위 | 변경 사항 |
|------------|-----------|----------|
| pages/ProductDetail/ | 페이지 구조 | PrintConfigurator 통합, `--huni-*` 토큰 |
| pages/Cart/ | 장바구니 로직 | Dialog/Snackbar/Chip 적용 |
| pages/OrderSheet/ | 주문서 구조 | 파일업로드 + 배송비 + 결제 확장 |
| pages/OrderConfirm/ | 주문완료 구조 | `--huni-*` 디자인 적용 |
| pages/DisplayCategoryList/ | 카테고리 목록 | Tabs/Pagination/Skeleton 적용 |
| components/ProductList/ | 상품 카드 | 가격범위 + HuniBadge + `--huni-*` |

## 6. 병렬 실행 가능 그룹

독립적으로 병렬 개발 가능한 TAG 그룹:

**Group A** (옵션/가격): TAG-001, TAG-002, TAG-003
**Group B** (목록): TAG-004
**Group C** (파일): TAG-006, TAG-007
**Group D** (결제): TAG-009 (TAG-005, TAG-008 완료 후)

## 7. 품질 기준

- TRUST 5 전체 적용
- Huni DS v2 컴포넌트 100% 사용 (직접 input/select/modal 금지)
- `--po-*` CSS 변수 0건 (전량 `--huni-*`)
- data-* state attribute 패턴 준수
- Compound Component dot notation 사용
