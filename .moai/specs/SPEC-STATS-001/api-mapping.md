# SPEC-STATS-001: API Mapping Table

> shopby Enterprise API 및 CUSTOM API 매핑 - B7-STATISTICS 도메인 화면설계 기준 문서
>
> 작성일: 2026-03-20 | 작성: manager-spec (MoAI)

---

## 1. Screen-to-API Matrix

### 1.1 월별 매출통계 (NATIVE - shopby 기본)

| 화면 | 사용자 액션 | API / Provider | Endpoint | Method | Request | Response | Error Cases |
|------|------------|----------------|----------|--------|---------|----------|-------------|
| SalesPage | 월별 매출 조회 | shopby Admin 매출통계 | `/admin/statistics/sales` | GET | `{ startDate, endDate, period }` | `{ salesData[], totalAmount, orderCount }` | 400: 기간 오류, 403: 권한 없음 |
| SalesPage | 결제수단별 분포 | shopby Admin 매출통계 | `/admin/statistics/sales/payment-method` | GET | `{ startDate, endDate }` | `{ paymentMethods[] }` | 400: 기간 오류 |

### 1.2 대시보드 (CUSTOM)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| Dashboard | KPI 카드 조회 | CUSTOM | `/api/stats/dashboard/kpi` | GET | (없음) | `{ todaySales, monthSales, momGrowth, orderCount }` | 503: Redis 장애 |
| Dashboard | 매출 추이 조회 | CUSTOM | `/api/stats/dashboard/sales-trend` | GET | `{ months: 12 }` | `{ currentYear[], prevYear[] }` | 500: 집계 미완료 |
| Dashboard | 상품군 비율 조회 | CUSTOM | `/api/stats/dashboard/product-ratio` | GET | `{ period }` | `{ printing, binding, goods, package, handcraft }` | 500: 집계 미완료 |
| Dashboard | 팀별 실적 조회 | CUSTOM | `/api/stats/dashboard/team-performance` | GET | (없음) | `{ teams[{ name, sales, target, rate }] }` | 404: 팀 미등록 |
| Dashboard | 최근 주문 10건 | shopby Admin | `/admin/orders?limit=10&sort=recent` | GET | `{ limit: 10 }` | `{ orders[{ id, product, amount, status }] }` | 403: 권한 없음 |
| Dashboard | 인기 상품 TOP 10 | CUSTOM | `/api/stats/dashboard/top-products` | GET | `{ limit: 10, period }` | `{ products[{ name, count, amount }] }` | 500: 집계 미완료 |
| Dashboard | 외주 현황 | CUSTOM | `/api/stats/dashboard/vendor-status` | GET | (없음) | `{ totalOrders, unsettled, unsettledAmount }` | 500: 데이터 오류 |

### 1.3 인쇄/제본 상품통계 (CUSTOM)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| PrintingPage | 인쇄 통계 조회 | CUSTOM | `/api/stats/printing` | GET | `{ startDate, endDate, dimension, category }` | `{ data[{ dimensionValue, orderCount, amount }], total }` | 400: 파라미터 오류 |
| PrintingPage | 제본 통계 조회 | CUSTOM | `/api/stats/binding` | GET | `{ startDate, endDate, dimension }` | 동일 | 동일 |
| PrintingPage | 테이블 데이터 | CUSTOM | `/api/stats/printing/table` | GET | `{ startDate, endDate, page, size, sort, order }` | `{ rows[], total, page, size }` | 400: 파라미터 오류 |

### 1.4 굿즈 상품통계 (SKIN)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| GoodsPage | 기본 통계 | shopby Admin + CUSTOM 확장 | `/admin/statistics/products?category=goods` + `/api/stats/goods` | GET | `{ startDate, endDate, dimension }` | shopby 기본 + `{ printMethod[] }` 확장 | 400: 기간 오류 |

### 1.5 패키지 상품통계 (CUSTOM)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| PackagePage | 패키지 통계 조회 | CUSTOM | `/api/stats/package` | GET | `{ startDate, endDate, dimension }` | `{ data[{ dimensionValue, orderCount, amount }], total }` | 400: 파라미터 오류 |

### 1.6 수작 상품통계 (SKIN)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| HandcraftPage | 기본 통계 | shopby Admin + CUSTOM 확장 | `/admin/statistics/products?category=handcraft` + `/api/stats/handcraft` | GET | `{ startDate, endDate, dimension }` | shopby 기본 + `{ process[], duration[] }` 확장 | 400: 기간 오류 |

### 1.7 굿즈 발주/정산 (SKIN)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| SettlementPage | 거래처별 정산 조회 | CUSTOM | `/api/stats/settlement/vendors` | GET | `{ startDate, endDate, page, size }` | `{ vendors[{ id, name, orderAmount, settledAmount, marginRate, unsettled, count }] }` | 400: 기간 오류 |
| VendorDetail | 거래처 상세 발주 | CUSTOM | `/api/stats/settlement/vendors/:vendorId` | GET | `{ startDate, endDate, page, size }` | `{ orders[{ product, orderDate, orderPrice, sellPrice, margin, status }] }` | 404: 거래처 없음 |
| VendorDetail | 납기 준수율 | CUSTOM | `/api/stats/settlement/vendors/:vendorId/delivery-rate` | GET | `{ startDate, endDate }` | `{ rate, onTime, late, total }` | 404: 거래처 없음 |

### 1.8 팀별 통계 (CUSTOM)

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| TeamPage | 팀별 매출 조회 | CUSTOM | `/api/stats/team` | GET | `{ period }` | `{ teams[{ id, name, sales, count, target, rate }] }` | 403: 운영자 타팀 접근 |
| TeamDetail | 담당자별 실적 | CUSTOM | `/api/stats/team/:teamId/members` | GET | `{ period }` | `{ members[{ id, name, sales, count, target, rate, avgTime }] }` | 403: 운영자 타팀, 404: 팀 없음 |
| TargetSetting | 목표 조회 | CUSTOM | `/api/stats/team/targets` | GET | `{ period }` | `{ targets[{ teamId, memberId, amount, count }] }` | 403: 관리자만 |
| TargetSetting | 목표 설정 | CUSTOM | `/api/stats/team/targets` | POST | `{ teamId, memberId, period, targetAmount, targetCount }` | `{ id, created }` | 400: 유효성, 403: 관리자만 |
| TargetSetting | 목표 수정 | CUSTOM | `/api/stats/team/targets/:targetId` | PUT | `{ targetAmount, targetCount }` | `{ updated }` | 400: 유효성, 403: 관리자만 |

---

## 2. 엑셀 내보내기 API

| 화면 | 사용자 액션 | API | Endpoint | Method | Request | Response | Error Cases |
|------|------------|-----|----------|--------|---------|----------|-------------|
| 전체 통계 | 엑셀 다운로드 | CUSTOM | `/api/stats/export` | POST | `{ type, startDate, endDate, fields[], conditions }` | `{ fileUrl }` (즉시) 또는 `{ jobId }` (비동기) | 403: 관리자만, 400: 파라미터 |
| 전체 통계 | 비동기 상태 확인 | CUSTOM | `/api/stats/export/:jobId/status` | GET | (없음) | `{ status, progress, fileUrl }` | 404: 작업 없음 |

---

## 3. CUSTOM API 엔드포인트 요약

| 분류 | Endpoint | Method | 인증 | RBAC |
|------|----------|--------|------|------|
| 대시보드 | `/api/stats/dashboard/*` | GET | 관리자 토큰 | 운영자 이상 |
| 인쇄/제본 | `/api/stats/printing`, `/api/stats/binding` | GET | 관리자 토큰 | 관리자 이상 |
| 굿즈 확장 | `/api/stats/goods` | GET | 관리자 토큰 | 관리자 이상 |
| 패키지 | `/api/stats/package` | GET | 관리자 토큰 | 관리자 이상 |
| 수작 확장 | `/api/stats/handcraft` | GET | 관리자 토큰 | 관리자 이상 |
| 발주/정산 | `/api/stats/settlement/*` | GET | 관리자 토큰 | 관리자 이상 |
| 팀별 | `/api/stats/team/*` | GET/POST/PUT | 관리자 토큰 | 역할별 차등 |
| 내보내기 | `/api/stats/export/*` | POST/GET | 관리자 토큰 | 관리자 이상 |

---

## 4. 공통 요청/응답 패턴

### 4.1 기간 필터 파라미터 (공통)

```
startDate: string (YYYY-MM-DD)
endDate: string (YYYY-MM-DD)
period?: 'day' | 'week' | 'month' | 'quarter' | 'year'
```

### 4.2 페이징 파라미터 (테이블 조회)

```
page: number (1부터 시작)
size: number (기본 20)
sort: string (정렬 필드)
order: 'asc' | 'desc'
```

### 4.3 에러 응답 포맷

```
{
  "error": {
    "code": "FORBIDDEN",
    "message": "접근 권한이 없습니다",
    "details": "운영자는 본인 팀 통계만 조회할 수 있습니다"
  }
}
```

### 4.4 dimension 파라미터 값

| category | dimension 값 |
|----------|-------------|
| printing | paper, coating, finishing, quantity_range, color, size, product_type |
| binding | method, page_count, cover_paper, plate_type, copy_count |
| goods | product_type, print_method, purpose, moq |
| package | shape, material, thomson, finishing |
| handcraft | process, duration, unit_price |
