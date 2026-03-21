# SPEC-PRODUCT-001: API Mapping Table

> NestJS BFF API + shopby Enterprise API 매핑 - A10B4-PRODUCT 도메인
>
> 작성일: 2026-03-20 | 작성: MoAI (manager-spec)

---

## 1. NestJS BFF API (CUSTOM)

### 1.1 옵션 마스터 API

| 화면 | 사용자 액션 | BFF Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|--------|---------|----------|-------------|
| SCR-PRD-001 | 사이즈 목록 조회 | `/api/admin/option-master/sizes` | GET | `{ productTypeId?, active?, search?, page, limit }` | `{ items: Size[], total, page }` | 401: 미인증, 403: 권한 없음 |
| SCR-PRD-002 | 사이즈 등록 | `/api/admin/option-master/sizes` | POST | `{ productTypeId, name, code, widthMm, heightMm, sortOrder }` | `{ id, ...fields }` | 400: 유효성 오류, 409: 코드 중복 |
| SCR-PRD-002 | 사이즈 수정 | `/api/admin/option-master/sizes/:id` | PUT | `{ name?, widthMm?, heightMm?, sortOrder? }` | `{ id, ...fields }` | 404: 미존재 |
| SCR-PRD-001 | 사이즈 활성/비활성 | `/api/admin/option-master/sizes/:id/active` | PATCH | `{ active: boolean }` | `{ id, active }` | 404: 미존재 |
| SCR-PRD-003 | 소재 목록 조회 | `/api/admin/option-master/materials` | GET | `{ productTypeId?, active?, search? }` | `{ items: Material[], total }` | 401, 403 |
| SCR-PRD-004 | 소재 등록 | `/api/admin/option-master/materials` | POST | `{ productTypeId, name, description, sizeIds: number[] }` | `{ id, ...fields }` | 400, 409 |
| SCR-PRD-004 | 소재 수정 | `/api/admin/option-master/materials/:id` | PUT | `{ name?, description?, sizeIds? }` | `{ id, ...fields }` | 404 |
| SCR-PRD-005 | 용지 목록 조회 | `/api/admin/option-master/papers` | GET | `{ productTypeId?, active?, weightGsm?, coatingType? }` | `{ items: Paper[], total }` | 401, 403 |
| SCR-PRD-006 | 용지 등록 | `/api/admin/option-master/papers` | POST | `{ productTypeId, name, weightGsm, coatingType, sizeIds: number[] }` | `{ id, ...fields }` | 400, 409 |
| SCR-PRD-006 | 용지 수정 | `/api/admin/option-master/papers/:id` | PUT | `{ name?, weightGsm?, coatingType?, sizeIds? }` | `{ id, ...fields }` | 404 |
| SCR-PRD-008 | 엑셀 일괄 업로드 | `/api/admin/option-master/bulk-import` | POST | `FormData { file, type: 'size'|'material'|'paper' }` | `{ imported: number, errors: Error[] }` | 400: 파일 형식 오류 |

### 1.2 종속옵션 API

| 화면 | 사용자 액션 | BFF Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|--------|---------|----------|-------------|
| SCR-PRD-022 | 상품유형 목록 | `/api/admin/cascading/product-types` | GET | - | `{ items: ProductType[] }` | 401 |
| SCR-PRD-009 | 사이즈 팝업 데이터 | `/api/admin/cascading/sizes` | GET | `{ productTypeId }` | `{ items: Size[] }` (active만) | 400: productTypeId 누락 |
| SCR-PRD-010 | 소재 팝업 데이터 | `/api/admin/cascading/materials` | GET | `{ sizeId }` | `{ items: Material[] }` (매핑+active만) | 400: sizeId 누락 |
| SCR-PRD-011 | 용지 팝업 데이터 | `/api/admin/cascading/papers` | GET | `{ sizeId }` | `{ items: Paper[] }` (매핑+active만) | 400: sizeId 누락 |
| SCR-PRD-022 | 후가공 목록 | `/api/admin/cascading/finishings` | GET | `{ productTypeId }` | `{ items: Finishing[] }` | 400 |
| SCR-PRD-022 | 옵션 조합 검증 | `/api/admin/cascading/validate` | POST | `{ productTypeId, sizeIds, materialIds?, paperIds? }` | `{ valid: boolean, conflicts: string[] }` | 400 |

### 1.3 가격 엔진 API

| 화면 | 사용자 액션 | BFF Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|--------|---------|----------|-------------|
| SCR-PRD-007 | 가격 코드 목록 | `/api/admin/price/codes` | GET | - | `{ items: PriceCode[] }` | 401 |
| SCR-PRD-014~017 | 가격 매트릭스 조회 | `/api/admin/price/matrix/:priceCode` | GET | `{ sizeId?, paperId? }` | `{ matrix: PriceMatrix[], version }` | 404: 코드 미존재 |
| SCR-PRD-014~017 | 가격 매트릭스 저장 | `/api/admin/price/matrix/:priceCode` | PUT | `{ rows: PriceRow[], version }` | `{ success, newVersion }` | 409: 버전 충돌 |
| SCR-PRD-019 | 가격 시뮬레이션 | `/api/admin/price/simulate` | POST | `{ priceCode, sizeId, paperId?, coatingType, printSide, quantity, finishingIds?, bindingType?, pageCount?, isExpress? }` | `{ total, unitPrice, breakdown: { output, paper, coating, finishing, binding, surcharge } }` | 400: 필수 파라미터 누락 |
| SCR-PRD-007 | 가격 변경 이력 | `/api/admin/price/change-log/:priceCode` | GET | `{ page, limit, from?, to? }` | `{ items: ChangeLog[], total }` | 404 |
| SCR-PRD-018 | 후가공 가격 목록 | `/api/admin/price/finishings` | GET | - | `{ items: FinishingPrice[] }` | 401 |
| SCR-PRD-018 | 후가공 가격 수정 | `/api/admin/price/finishings/:id` | PUT | `{ unitPrice, quantityDiscount }` | `{ id, ...fields }` | 404 |
| SCR-PRD-018 | 제본 가격 목록 | `/api/admin/price/bindings` | GET | - | `{ items: BindingPrice[] }` | 401 |
| SCR-PRD-018 | 제본 가격 수정 | `/api/admin/price/bindings/:id` | PUT | `{ pageRangePrices }` | `{ id, ...fields }` | 404 |

### 1.4 상품 관리 API

| 화면 | 사용자 액션 | BFF Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|--------|---------|----------|-------------|
| SCR-PRD-020 | 인쇄 상품 목록 | `/api/admin/product/print` | GET | `{ productTypeId?, status?, search?, page, limit }` | `{ items: PrintProduct[], total }` | 401, 403 |
| SCR-PRD-021~023 | 인쇄 상품 등록 | `/api/admin/product/print` | POST | `{ name, productTypeId, priceCode, optionSets: [...], defaultOptions, expressSurchargeRate?, guidelinePdfUrl? }` | `{ id, shopbyProductNo }` | 400: 유효성 오류 |
| SCR-PRD-021~023 | 인쇄 상품 수정 | `/api/admin/product/print/:id` | PUT | (동일 + id) | `{ id, shopbyProductNo }` | 404, 400 |
| SCR-PRD-025 | 상품 복제 | `/api/admin/product/print/:id/duplicate` | POST | `{ newName? }` | `{ id, shopbyProductNo }` | 404 |
| SCR-PRD-020 | 상태 변경 | `/api/admin/product/print/:id/status` | PATCH | `{ status: 'active'|'inactive' }` | `{ id, status }` | 404 |
| SCR-PRD-026 | 임시저장 | `/api/admin/product/print/:id/auto-save` | POST | `{ formData: any }` | `{ savedAt }` | 400 |
| SCR-PRD-026 | 임시저장 조회 | `/api/admin/product/print/:id/auto-save` | GET | - | `{ formData, savedAt }` | 404: 임시저장 없음 |
| SCR-PRD-024 | 미리보기 데이터 | `/api/admin/product/print/:id/preview` | GET | - | `{ product, options, priceMatrix }` | 404 |

### 1.5 쇼핑몰 프론트 BFF API (모듈 6: 옵션 엔진)

> 쇼핑몰 주문페이지에서 사용하는 BFF API. 관리자 인증 불필요, 공개 API.

| 화면 | 사용자 액션 | BFF Endpoint | Method | Request | Response | Error Cases |
|------|------------|-------------|--------|---------|----------|-------------|
| SCR-PRD-033~043 | 주문페이지 진입 (옵션 설정 로드) | `/api/storefront/options/config` | GET | `{ productType: string }` | `{ optionGroups: OptionGroup[], dependencies: Dependency[], priceSummary: PriceSummaryConfig, uploadPattern: "A"\|"B"\|"C"\|"D"\|"E" }` | 400: productType 누락, 404: 미존재 상품유형 |
| SCR-PRD-033~043 | 종속옵션 변경 (하위 옵션 조회) | `/api/storefront/options/cascading` | GET | `{ productType, parentCode, parentValue }` | `{ childOptions: OptionValue[], availableFinishings?: Finishing[] }` | 400: 필수 파라미터 누락 |
| SCR-PRD-044 | 가격 계산 (실시간) | `/api/storefront/price/calculate` | POST | `{ productType, options: { size, paper?, coating?, print?, spotColors?, cutting?, folding?, qty, designCount?, finishings?, foil?, emboss?, binding?, pageCount?, customWidth?, customHeight?, packaging? } }` | `{ total: number, tax: number, subtotal: number, unitPrice: number, breakdown: { output, paper, coating, spotColor, cutting, folding, finishing, foilEmboss, binding, packaging, surcharge }, discount?: number }` | 400: 유효하지 않은 옵션 조합, 422: 범위 초과 |
| SCR-PRD-045 | 구간할인 테이블 조회 | `/api/storefront/price/volume-discount` | GET | `{ productType, options: { size, paper?, material? } }` | `{ tiers: [{ qty: number, unitPrice: number, totalPrice: number }] }` | 400 |
| SCR-PRD-033~043 | 옵션 조합 유효성 검증 | `/api/storefront/options/validate` | POST | `{ productType, selectedOptions: Record<string, string> }` | `{ valid: boolean, conflicts: string[], suggestions: string[] }` | 400 |

#### 쇼핑몰 프론트 API 특이사항

- **인증 불필요**: 공개 API (AdminAuthGuard 미적용)
- **Rate Limiting**: IP 기반 분당 100 요청 제한
- **캐싱**: Redis 캐시 우선, TTL 기반 자동 갱신
- **가격 보안**: 가격 매트릭스 원본 미노출, 계산 결과만 반환
- **debounce 권장**: 클라이언트에서 300ms debounce 후 가격 계산 API 호출

---

## 2. shopby Enterprise API 연동

### 2.1 상품 등록/수정 시 shopby API 호출

| BFF 내부 호출 시점 | shopby API Endpoint | Method | Request Body | Response | 비고 |
|-------------------|-------------------|--------|-------------|----------|------|
| 인쇄 상품 등록 | `/admin/products` | POST | `{ productName, salePrice, images, categoryNos, ... }` | `{ productNo }` | 기본 상품 정보만 shopby에 등록 |
| 인쇄 상품 수정 | `/admin/products/:productNo` | PUT | `{ productName?, salePrice?, ... }` | `{ productNo }` | 기본 정보 동기화 |
| 상품 상태 변경 | `/admin/products/:productNo/sale-status` | PUT | `{ saleStatusType: 'ON_SALE'|'STOP' }` | `{ productNo }` | 판매 상태 동기화 |
| 굿즈 카테고리 조회 | `/admin/categories` | GET | `{ depth, parentNo }` | `{ categories }` | NATIVE 활용 |
| 굿즈 카테고리 등록 | `/admin/categories` | POST | `{ categoryName, parentNo }` | `{ categoryNo }` | NATIVE 활용 |
| 굿즈 상품 등록 | `/admin/products` | POST | `{ productName, optionType: 'COMBINATION', ... }` | `{ productNo }` | shopby 옵션 조합형 |

### 2.2 shopby API 인증

| 항목 | 값 |
|------|------|
| 인증 방식 | shopby Admin API Key + Secret |
| 헤더 | `X-Shopby-Admin-Key: {key}`, `X-Shopby-Admin-Secret: {secret}` |
| Base URL | `https://api.shopby.co.kr/admin` |
| Rate Limit | 분당 300 요청 |
| 타임아웃 | 10초 |

---

## 3. API 공통 사항

### 3.1 인증/인가

- 모든 `/api/admin/*` 엔드포인트에 `AdminAuthGuard` 적용
- shopby Admin API 토큰 검증
- 역할 검증: `SUPER_ADMIN`, `PRODUCT_ADMIN`

### 3.2 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "유효성 검증 오류",
  "errors": [
    { "field": "name", "message": "상품명은 필수입니다" },
    { "field": "priceCode", "message": "가격 코드를 선택해주세요" }
  ]
}
```

### 3.3 페이지네이션 응답 형식

```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```
