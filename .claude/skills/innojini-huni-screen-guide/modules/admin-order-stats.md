# B-7~B-9: 통계/주문관리/특화 (22 화면)

## 목차

### B-7 통계 (8 화면)
- [SCR-B7-PRINT-STATS: 인쇄 통계](#scr-b7-print-stats)
- [SCR-B7-BIND-STATS: 제본 통계](#scr-b7-bind-stats) → PRINT-STATS 패턴 참조
- [SCR-B7-GOODS-STATS: 굿즈 통계](#scr-b7-goods-stats) → PRINT-STATS 패턴 참조
- [SCR-B7-PACKAGE-STATS: 패키지 통계](#scr-b7-package-stats) → PRINT-STATS 패턴 참조
- [SCR-B7-HANDMADE-STATS: 수작 통계](#scr-b7-handmade-stats) → PRINT-STATS 패턴 참조
- [SCR-B7-MONTHLY-SALES: 월별 매출](#scr-b7-monthly-sales)
- [SCR-B7-SETTLEMENT: 굿즈 발주/정산](#scr-b7-settlement)
- [SCR-B7-TEAM-STATS: 팀별 통계](#scr-b7-team-stats)

### B-8 주문관리 (10 화면)
- [SCR-B8-PRINT-ORDER: 인쇄 주문관리](#scr-b8-print-order)
- [SCR-B8-BIND-ORDER: 제본 주문관리](#scr-b8-bind-order) → PRINT-ORDER 패턴 참조
- [SCR-B8-GOODS-ORDER: 굿즈 주문관리](#scr-b8-goods-order)
- [SCR-B8-FILE-CHECK: 파일 확인 처리](#scr-b8-file-check)
- [SCR-B8-REUPLOAD: 재업로드 요청](#scr-b8-reupload)
- [SCR-B8-ORDER-PRINT: 주문서 출력](#scr-b8-order-print)
- [SCR-B8-STATUS-CHANGE: 주문 상태 변경](#scr-b8-status-change)
- [SCR-B8-DEFERRED-PAY: 후불결제 관리](#scr-b8-deferred-pay)
- [SCR-B8-RECEIPTS: 증빙서류 관리](#scr-b8-receipts)
- [SCR-B8-SMS: SMS/알림톡 발송](#scr-b8-sms)

### B-9 특화 (4 화면)
- [SCR-B9-FILE-DASHBOARD: 파일검증 대시보드](#scr-b9-file-dashboard)
- [SCR-B9-PRINT-STATUS: 인쇄작업 현황](#scr-b9-print-status)
- [SCR-B9-QUALITY-CHECK: 품질검수 관리](#scr-b9-quality-check)
- [SCR-B9-OUTSOURCE: 외주 인쇄소 관리](#scr-b9-outsource)

---

## 공통 어드민 패턴

모든 어드민 화면: **Desktop-only (>=1024px)**, Tailwind CSS + shadcn/ui

**8단계 주문 상태**: 접수 > 파일접수 > 파일검수 > 제작접수 > 인쇄중 > 후가공 > 출고 > 배송중

**AdminLayout 공통 구조**:
```
AdminLayout
  └── Sidebar (nav)
  └── Content
        ├── PageHeader (title + breadcrumb)
        ├── FilterSection (collapsible, Card)
        │     ├── ShopSelect, PartnerSelect
        │     ├── SearchInput, DateRangePicker
        │     └── Button[빨강] "검색" + Button[outline] "초기화"
        └── ResultSection
              ├── StatusTabs (뱃지 카운트)
              ├── ActionBar (일괄선택 + 상태변경 + SMS + 출력)
              ├── DataTable (checkbox + 정렬 + 행 액션)
              └── Pagination (30/100 + 엑셀 export)
```

---

## SCR-B7-PRINT-STATS

**인쇄 통계 | CUSTOM | 우선순위 3 | 규모 L**

### 1. 화면 개요

- ID: SCR-B7-PRINT-STATS
- 화면명: 인쇄 통계
- 분류: CUSTOM (자체 집계 API)
- 우선순위: 3 (통계 화면 공통 낮음)
- 규모: L (StatCard 4개 + 2개 차트 + 날짜 필터)
- 비고: 통계 계열 5개 화면(BIND/GOODS/PACKAGE/HANDMADE)은 이 화면의 필터·카드·차트 구성을 동일하게 사용, 품목별 지표만 교체

### 2. 와이어프레임 (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [인쇄 통계]                           [내보내기 CSV]   │ │
│  │ 홈 > 통계 > 인쇄 통계                                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ FilterSection (Card)                                   │ │
│  │  기간: [이번달 ▼] [2026-03-01] ~ [2026-03-31]         │ │
│  │  비교: [ ] 전년 동기 비교  쇼핑몰: [전체 ▼]           │ │
│  │                             [검색(빨강)]  [초기화]     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ StatCardRow (grid-cols-4 gap-4)                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │ 총 주문  │ │ 총 매출  │ │ 평균단가 │ │ 완료율   │ │ │
│  │  │  1,234건 │ │ ₩12.3M  │ │  ₩9,980 │ │  94.2%   │ │ │
│  │  │ ▲8% MoM │ │ ▲12% YoY│ │ ▼2%     │ │ ▲1.2%p   │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ ChartRow (grid-cols-2 gap-4)                           │ │
│  │  ┌─────────────────────┐ ┌─────────────────────┐      │ │
│  │  │ 일별 주문 추이 (Bar) │ │ 품목별 비중 (Pie)   │      │ │
│  │  │  [Recharts BarChart] │ │ [Recharts PieChart] │      │ │
│  │  │  x: 날짜, y: 건수   │ │  단면인쇄/양면/특수 │      │ │
│  │  │  전년비교 선(회색)   │ │  범례 우측          │      │ │
│  │  └─────────────────────┘ └─────────────────────┘      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ ChartRow2 (grid-cols-2 gap-4)                          │ │
│  │  ┌─────────────────────┐ ┌─────────────────────┐      │ │
│  │  │ 매출 추이 (Line)    │ │ 상위 10 고객 (Bar H)│      │ │
│  │  │  [Recharts LineChart]│ │  [Recharts BarChart] │      │ │
│  │  └─────────────────────┘ └─────────────────────┘      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PrintStatsPage
  ├── PageHeader (title, breadcrumb, ExportCsvButton)
  ├── StatsFilterSection
  │     ├── DateRangePreset (이번달/지난달/분기/연도)
  │     ├── DateRangePicker (start ~ end)
  │     ├── CompareToggle (전년 동기 비교 checkbox)
  │     └── ShopSelect
  ├── StatCardRow
  │     └── StatCard × 4 (총주문/총매출/평균단가/완료율)
  │           ├── value (숫자 포맷)
  │           ├── trend (▲▼ + %)
  │           └── trendLabel (MoM/YoY)
  └── ChartGrid (grid-cols-2)
        ├── DailyOrderBarChart (Recharts BarChart + 전년 비교 ReferenceLine)
        ├── CategoryPieChart (Recharts PieChart)
        ├── SalesTrendLineChart (Recharts LineChart)
        └── TopCustomersBarChart (horizontal Recharts BarChart)
```

### 4. Props / States

```typescript
// StatsFilterState
interface StatsFilter {
  startDate: string;        // ISO date
  endDate: string;
  compareYoY: boolean;      // 전년 동기 비교
  shopNo?: number;
}

// StatCard Props
interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;            // "건" | "원" | "%"
  trend?: number;           // 양수=상승, 음수=하락
  trendBase?: "MoM" | "YoY";
  loading?: boolean;
}

// Chart 공통 Props
interface ChartPanelProps {
  data: ChartDataPoint[];
  compareData?: ChartDataPoint[];  // 전년 데이터 (optional)
  loading?: boolean;
  title: string;
  exportEnabled?: boolean;
}
```

### 5. API 매핑

```
GET /admin/custom/stats/print
  Query: startDate, endDate, compareYoY, shopNo
  Response:
    summary: { totalOrders, totalSales, avgPrice, completionRate, trends{} }
    dailyOrders: [{ date, count, compareCount? }]
    categoryBreakdown: [{ category, count, ratio }]
    salesTrend: [{ date, amount, compareAmount? }]
    topCustomers: [{ memberId, name, orderCount, totalAmount }]
```

### 6. 데이터 플로우

```
StatsFilterSection → onSearch(filter) → useStatsQuery(filter)
  └── GET /admin/custom/stats/print
        ├── summary → StatCardRow 업데이트
        └── charts → ChartGrid 각 패널 업데이트

CompareToggle ON → API 재요청(compareYoY=true)
  └── 차트에 회색 비교선/막대 오버레이
```

### 7. 인터랙션 상태

| 상태 | 트리거 | UI |
|------|--------|----|
| 로딩 | 필터 검색 | StatCard Skeleton + Chart Spinner |
| 데이터 없음 | 조회 결과 0 | EmptyState "해당 기간 데이터 없음" |
| 전년비교 ON | CompareToggle | 차트 비교 계열 표시 |
| 차트 툴팁 | 데이터포인트 hover | 날짜·건수·금액 팝오버 |
| CSV 내보내기 | ExportCsvButton | 다운로드 시작 토스트 |

### 8. 에러 처리

- API 실패: 각 카드/차트 개별 ErrorBoundary → "데이터 불러오기 실패 [재시도]" 표시
- 날짜 범위 초과(>1년): 필터 inline 경고 "최대 1년 범위까지 조회 가능"
- 빈 기간: 검색 버튼 비활성화

### 9. 접근성

- StatCard: `role="region"` aria-label="총 주문 통계"
- 차트: `role="img"` aria-label="일별 주문 추이 차트" + 데이터 테이블 토글 버튼
- 색상 트렌드: 아이콘(▲▼) + 텍스트 병행 (색맹 고려)

---

## SCR-B7-BIND-STATS

**제본 통계 | CUSTOM | 우선순위 3 | 규모 L**

> **PRINT-STATS 패턴 동일 적용.** 차이점만 기재:
>
> - API endpoint: `GET /admin/custom/stats/binding`
> - StatCard 지표: 총주문 / 총매출 / 평균 페이지수 / 완료율
> - CategoryPieChart: 소프트커버 / 하드커버 / 스프링 / 기타
> - TopChart: 상위 10 품목 (binding_type 기준)

---

## SCR-B7-GOODS-STATS

**굿즈 통계 | CUSTOM | 우선순위 3 | 규모 M**

> **PRINT-STATS 패턴 적용 (규모 M = 차트 2개로 축소).**
>
> - API: `GET /admin/custom/stats/goods`
> - StatCard: 총주문 / 총매출 / 평균단가 / 재주문율
> - Chart 1: 일별 주문 추이 (Bar)
> - Chart 2: 굿즈 카테고리 비중 (Pie) — 머그/에코백/스티커/기타
> - 규모 M이므로 TopCustomers 차트 생략

---

## SCR-B7-PACKAGE-STATS

**패키지 통계 | CUSTOM | 우선순위 3 | 규모 M**

> **PRINT-STATS 패턴 적용.**
>
> - API: `GET /admin/custom/stats/package`
> - StatCard: 총주문 / 총매출 / 평균패키지단가 / 완료율
> - Chart 1: 월별 매출 (Line)
> - Chart 2: 패키지 구성 비중 — 인쇄+제본 / 인쇄+굿즈 / 3종 패키지

---

## SCR-B7-HANDMADE-STATS

**수작 통계 | CUSTOM | 우선순위 3 | 규모 M**

> **PRINT-STATS 패턴 적용.**
>
> - API: `GET /admin/custom/stats/handmade`
> - StatCard: 총주문 / 총매출 / 평균작업일수 / 완료율
> - Chart 1: 일별 주문 추이
> - Chart 2: 수작 종류 비중 — 손바느질제본 / 가죽커버 / 특수마감

---

## SCR-B7-MONTHLY-SALES

**월별 매출 | CUSTOM | 우선순위 3 | 규모 L**

### 1. 화면 개요

- 전체 카테고리 통합 월별 매출 집계 + 연도별 비교 + 엑셀 출력

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [월별 매출]                          [엑셀 내보내기]     │
├──────────────────────────────────────────────────────────┤
│ FilterSection                                            │
│  연도: [2026 ▼]  비교연도: [2025 ▼]  카테고리: [전체 ▼] │
│                                        [검색]  [초기화]  │
├──────────────────────────────────────────────────────────┤
│ SplitLayout (left 60% | right 40%)                      │
│  ┌───────────────────┐  ┌──────────────────────────┐   │
│  │ 월별 매출 (Bar)   │  │ 연도 비교 (Line)          │   │
│  │ x: 1~12월        │  │ 2026 실선 / 2025 점선     │   │
│  │ y: 매출액(만원)   │  │ x: 월, y: 매출 누계       │   │
│  │ 카테고리별 스택   │  │                           │   │
│  └───────────────────┘  └──────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│ ComparisonTable (월 × 카테고리 교차표)                  │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐   │
│  │  월  │ 인쇄 │ 제본 │ 굿즈 │ 패키지│ 수작 │ 합계 │   │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤   │
│  │  1월 │  3.2M│  1.1M│  0.5M│  0.8M│  0.3M│  5.9M│   │
│  │  ... │  ... │  ... │  ... │  ... │  ... │  ... │   │
│  │ 합계 │ 42.1M│ 14.2M│  6.3M│  9.5M│  3.8M│ 75.9M│   │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘   │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MonthlySalesPage
  ├── PageHeader + ExportExcelButton
  ├── MonthlySalesFilter (연도, 비교연도, 카테고리)
  ├── SplitLayout
  │     ├── MonthlySalesStackedBarChart (Recharts BarChart stacked)
  │     └── YearComparisonLineChart (Recharts LineChart)
  └── ComparisonTable
        ├── thead (카테고리 컬럼)
        ├── tbody (월별 행)
        └── tfoot (합계 행, 굵은 글씨)
```

### 4. Props / States

```typescript
interface MonthlySalesFilter {
  year: number;
  compareYear?: number;
  category?: "print" | "binding" | "goods" | "package" | "handmade" | "all";
}
interface MonthlySalesRow {
  month: number;
  print: number; binding: number; goods: number;
  package: number; handmade: number; total: number;
  compareTotal?: number;
}
```

### 5. API 매핑

```
GET /admin/custom/stats/monthly-sales
  Query: year, compareYear?, category?
  Response:
    currentYear: MonthlySalesRow[]
    compareYear?: MonthlySalesRow[]
    summary: { totalSales, growthRate, bestMonth, bestCategory }
```

### 6~9. (PRINT-STATS 패턴 적용, 엑셀 export = xlsx 라이브러리 사용)

---

## SCR-B7-SETTLEMENT

**굿즈 발주/정산 | CUSTOM | 우선순위 3 | 규모 L**

### 1. 화면 개요

- 외부 굿즈 발주 내역 + 정산 상태 관리. 발주금액 vs 정산완료금액 대조.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [굿즈 발주/정산]                                         │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 기간 / 정산상태[미정산/정산완료/전체] /   │
│                공급업체 / 품목                            │
├──────────────────────────────────────────────────────────┤
│ SummaryCard Row (grid-cols-3)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 총 발주금액 │ │ 정산완료    │ │ 미정산 잔액 │       │
│  │  ₩8,200,000 │ │  ₩6,500,000 │ │  ₩1,700,000 │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
├──────────────────────────────────────────────────────────┤
│ SettlementDataTable                                      │
│  [체크] 발주번호 │ 발주일 │ 품목 │ 공급업체 │ 금액 │    │
│         정산상태 │ 정산일 │ 메모 │ [영수증] [정산처리]  │
│  ─────────────────────────────────────────────────────  │
│  □  ORD-2026-001 │ 03-01 │ 머그컵 │ A업체 │ ₩120,000 │ │
│                  │       │        │       │ [미정산] │  │
│  ─────────────────────────────────────────────────────  │
│  [일괄 정산처리] [엑셀 내보내기]     < 1 2 3 ... >      │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
SettlementPage
  ├── SettlementFilter
  ├── SummaryCardRow (3x SummaryCard)
  └── SettlementDataTable
        ├── BulkActionBar (일괄 정산처리)
        ├── DataTable
        │     └── SettlementRow
        │           ├── StatusBadge (미정산/정산완료)
        │           ├── ReceiptButton → ReceiptViewDialog
        │           └── SettleButton → SettleConfirmDialog
        └── Pagination + ExcelExportButton
```

### 4. Props / States

```typescript
interface SettlementItem {
  orderId: string; orderDate: string; itemName: string;
  supplier: string; amount: number;
  status: "pending" | "settled"; settledDate?: string;
  receiptUrl?: string; memo?: string;
}
interface SettleConfirmPayload { orderIds: string[]; settledDate: string; }
```

### 5. API 매핑

```
GET  /admin/custom/settlement/goods     -- 목록
POST /admin/custom/settlement/settle    -- 정산처리 (body: SettleConfirmPayload)
GET  /admin/custom/settlement/summary   -- SummaryCard 집계
GET  /admin/custom/settlement/export    -- Excel 다운로드
```

### 6~9. (공통 패턴 적용, 정산처리 후 목록 refetch + 성공 토스트)

---

## SCR-B7-TEAM-STATS

**팀별 통계 | CUSTOM | 우선순위 3 | 규모 M**

### 1. 화면 개요

- 내부 팀(인쇄팀/제본팀/굿즈팀)별 처리 건수·매출·지연율 비교

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [팀별 통계]                                              │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 기간 / 팀[인쇄/제본/굿즈/전체]           │
├──────────────────────────────────────────────────────────┤
│ TeamComparisonChart (Recharts GroupedBarChart)           │
│  x: 팀명, y: 처리건수 / 매출 / 지연율 (탭 전환)         │
├──────────────────────────────────────────────────────────┤
│ TeamDataTable                                            │
│  팀명 │ 처리건수 │ 총매출 │ 평균처리일 │ 지연율 │ 만족도 │
└──────────────────────────────────────────────────────────┘
```

### 3~9. (PRINT-STATS 패턴 적용)

API: `GET /admin/custom/stats/team`
Query: startDate, endDate, teamCode

---

## SCR-B8-PRINT-ORDER

**인쇄 주문관리 | CUSTOM | 우선순위 1 | 규모 XL**

### 1. 화면 개요

- ID: SCR-B8-PRINT-ORDER
- 분류: CUSTOM (인쇄 주문 전용 필터 + 파일 상태 표시)
- 우선순위: 1 (핵심 운영 화면)
- 규모: XL (복잡 필터 + 대용량 DataTable + 우측 DetailPanel + BulkAction)
- 핵심 기능: 8단계 주문 상태 필터, 파일검수 상태 표시, 일괄 상태변경, SMS 발송, 주문 상세

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────────────┐
│ AdminLayout                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [인쇄 주문관리]                  [일괄처리 ▼] [SMS] [출력]│   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ FilterSection (Card, collapsible)                        │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ 주문번호/고객명/연락처  [검색어 입력]              │  │   │
│  │  │ 주문일: [2026-03-01] ~ [2026-03-19]  [이번달]      │  │   │
│  │  │ 쇼핑몰: [전체 ▼]  파트너: [전체 ▼]               │  │   │
│  │  │ 주문상태: □접수 □파일접수 □파일검수 □제작접수      │  │   │
│  │  │           □인쇄중 □후가공 □출고 □배송중            │  │   │
│  │  │ 파일상태: □대기 □처리중 □승인 □반려               │  │   │
│  │  │ 인쇄종류: [단면▼] [용지▼] [수량범위] [컬러▼]      │  │   │
│  │  │                          [검색(빨강)]  [초기화]     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ StatusTabs (Tabs)                                        │   │
│  │  [전체(1,234)] [접수(87)] [파일접수(43)] [파일검수(21)] │   │
│  │  [제작접수(156)] [인쇄중(234)] [후가공(98)] [출고(312)] │   │
│  │  [배송중(283)]                                           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ BulkActionBar                                            │   │
│  │  ☑ 23개 선택됨  [상태변경 ▼] [SMS 발송] [엑셀] [출력]  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ DataTable + DetailPanel (SplitLayout)                    │   │
│  │  ┌─────────────────────────┐ ┌─────────────────────┐   │   │
│  │  │ DataTable (65%)         │ │ DetailPanel (35%)    │   │   │
│  │  │ [체]주문번호│고객│상품  │ │ 주문번호: ORD-001    │   │   │
│  │  │     파일│상태│주문일│금액│ │ 고객: 홍길동 010-xxx │   │   │
│  │  │ ──────────────────────  │ │ 주문상품: A4 단면    │   │   │
│  │  │ □ ORD-001│홍길동│A4단면 │ │ ─────────────────── │   │   │
│  │  │         │[승인]│[제작접│ │ 파일 상태: [승인됨]  │   │   │
│  │  │          │      │수]    │ │ 파일명: design.pdf   │   │   │
│  │  │ □ ORD-002│김철수│A3양면 │ │ [파일 보기]          │   │   │
│  │  │         │[대기]│[접수]  │ │ ─────────────────── │   │   │
│  │  │ ...     │      │        │ │ 주문상태 타임라인    │   │   │
│  │  │                         │ │ ●접수 ●파일접수     │   │   │
│  │  │                         │ │ ○파일검수...        │   │   │
│  │  │                         │ │ ─────────────────── │   │   │
│  │  │                         │ │ [상태변경] [SMS]    │   │   │
│  │  └─────────────────────────┘ └─────────────────────┘   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Pagination: < 1 2 3 ... >  30개 보기 ▼  총 1,234건     │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PrintOrderPage
  ├── PageHeader
  │     └── GlobalActionMenu (일괄처리 드롭다운, SMS, 출력)
  ├── PrintOrderFilter (collapsible Card)
  │     ├── SearchInput (주문번호/고객명/연락처)
  │     ├── DateRangePicker
  │     ├── ShopSelect, PartnerSelect
  │     ├── OrderStatusCheckboxGroup (8개 상태)
  │     ├── FileStatusCheckboxGroup (4개 상태)
  │     └── PrintSpecFilter (종류/용지/수량/컬러)
  ├── StatusTabs (8단계 + 전체, 뱃지 카운트)
  ├── BulkActionBar
  │     ├── SelectAllCheckbox
  │     ├── SelectionCount
  │     ├── BulkStatusChangeDropdown → BulkStatusConfirmDialog
  │     ├── BulkSmsButton → SmsDialog
  │     └── ExcelExportButton, PrintButton
  └── SplitLayout
        ├── OrderDataTable (resizable 65%)
        │     ├── DataTableHeader (정렬 가능 컬럼)
        │     ├── OrderRow × N
        │     │     ├── Checkbox
        │     │     ├── OrderNumberLink → DetailPanel 활성화
        │     │     ├── CustomerCell
        │     │     ├── ProductCell (상품명 + 사양 요약)
        │     │     ├── FileStatusBadge
        │     │     ├── OrderStatusBadge
        │     │     └── RowActionMenu (상태변경/SMS/상세)
        │     └── Pagination
        └── OrderDetailPanel (35%, sliding)
              ├── OrderBasicInfo
              ├── FileStatusSection
              │     └── FilePreviewLink
              ├── OrderStatusTimeline (8단계 stepper)
              ├── PrintSpecDetail
              └── DetailActionBar (상태변경, SMS 발송)
```

### 4. Props / States

```typescript
interface PrintOrderFilter {
  keyword?: string;
  keywordType: "orderNo" | "customerName" | "phone";
  startDate: string; endDate: string;
  shopNo?: number; partnerNo?: number;
  orderStatuses: OrderStatus[];
  fileStatuses: FileStatus[];
  printType?: string; paperType?: string;
  qtyMin?: number; qtyMax?: number;
  colorType?: string;
  page: number; pageSize: 30 | 100;
}

type OrderStatus = "received"|"fileReceived"|"fileChecked"|"productionReceived"
                 |"printing"|"postProcess"|"shipped"|"delivering";
type FileStatus = "pending"|"processing"|"approved"|"rejected";

interface PrintOrderListItem {
  orderNo: string; orderDate: string;
  customerName: string; customerPhone: string;
  productName: string; printSpec: PrintSpec;
  fileStatus: FileStatus; orderStatus: OrderStatus;
  amount: number; shopName: string;
}

interface PrintOrderDetail extends PrintOrderListItem {
  files: FileItem[]; statusHistory: StatusHistoryItem[];
  deliveryInfo: DeliveryInfo; paymentInfo: PaymentInfo;
  memo?: string;
}

// 선택 상태
interface SelectionState {
  selectedIds: Set<string>;
  allSelected: boolean;
}
// 패널 상태
interface PanelState {
  activeOrderNo: string | null;
  detail: PrintOrderDetail | null;
  loading: boolean;
}
```

### 5. API 매핑

```
GET  /admin/custom/print-orders
  Query: PrintOrderFilter
  Response: { items: PrintOrderListItem[], total, statusCounts: Record<OrderStatus, number> }

GET  /admin/custom/print-orders/:orderNo
  Response: PrintOrderDetail

POST /admin/custom/print-orders/bulk-status
  Body: { orderNos: string[], targetStatus: OrderStatus, memo?: string }
  Response: { success: number, failed: number }

GET  /admin/custom/print-orders/export
  Query: PrintOrderFilter
  Response: Excel blob

POST /admin/custom/print-orders/:orderNo/sms
  Body: { templateId: string, customMessage?: string }
```

### 6. 데이터 플로우

```
필터 변경 → debounce(300ms) → GET /print-orders → 목록 갱신
StatusTabs 클릭 → orderStatuses=[탭상태] → GET /print-orders

행 클릭 → activeOrderNo 설정 → GET /print-orders/:orderNo → DetailPanel 표시

BulkStatusChange:
  1. 선택 orderNos 수집
  2. BulkStatusConfirmDialog 표시
  3. POST /bulk-status
  4. 성공 → 목록 refetch + 선택 초기화 + 토스트
  5. 부분 실패 → "N건 성공, M건 실패" 경고 다이얼로그
```

### 7. 인터랙션 상태

| 상태 | UI |
|------|----|
| 목록 로딩 | DataTable skeleton (5행) |
| 상세 로딩 | DetailPanel spinner |
| 행 선택 | 체크박스 + 행 배경 강조 |
| 전체 선택 | 헤더 체크박스 indeterminate → checked |
| 일괄변경 확인 | ConfirmDialog (변경 대상 건수 표시) |
| 부분 실패 | AlertDialog (실패 주문번호 목록) |
| 상태 뱃지 | 8색 컬러코드 (상태별 고유색) |

### 8. 에러 처리

- 목록 API 실패: 전체 ErrorBoundary → "주문 목록 조회 실패 [재시도]"
- 상세 API 실패: DetailPanel 내 인라인 에러
- 일괄 처리 실패: AlertDialog로 실패 항목 목록 표시
- 권한 없음 (403): "권한이 없습니다" 토스트 + 버튼 비활성화

### 9. 접근성

- DataTable: `role="grid"`, 행 클릭 → Enter/Space 키 지원
- StatusBadge: `aria-label="주문상태: 인쇄중"`
- BulkActionBar: 선택 건수 `aria-live="polite"` 업데이트
- DetailPanel: `role="complementary"` aria-label="주문 상세"

---

## SCR-B8-BIND-ORDER

**제본 주문관리 | CUSTOM | 우선순위 1 | 규모 L**

> **PRINT-ORDER 패턴 동일 적용.** 차이점만 기재:
>
> - API: `GET /admin/custom/binding-orders`
> - 필터 변경: 인쇄종류/용지 → 제본종류(소프트/하드/스프링)/페이지수 범위
> - FileStatus 없음 (제본은 파일 검수 단계 없이 인쇄완료 후 접수)
> - OrderStatusTimeline: 접수 > 제작접수 > 제본중 > 완료 > 출고 > 배송중 (6단계)
> - 규모 L: DetailPanel 없이 Drawer 방식으로 구현 가능

---

## SCR-B8-GOODS-ORDER

**굿즈 주문관리 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- SKIN 기반 (shopby 어드민 주문 관리 활용). 굿즈 카테고리 필터 추가.

### 2. 와이어프레임 (Desktop 1280px)

```
shopby 어드민 주문관리 화면 기반 + 굿즈 카테고리 필터 추가
(표준 shopby 주문관리 UI 상속, 커스텀 필터 오버레이)
```

### 5. API 매핑

```
shopby 표준 어드민 주문 API 활용:
GET /api/v2/admin/orders
  Query: category=GOODS, + 표준 필터
```

### 3~9. shopby 표준 어드민 패턴 적용

---

## SCR-B8-FILE-CHECK

**파일 확인 처리 | CUSTOM | 우선순위 1 | 규모 XL**

### 1. 화면 개요

- ID: SCR-B8-FILE-CHECK
- 분류: CUSTOM (PDF 뷰어 + PitStop 검증 연동)
- 우선순위: 1 (인쇄 품질 핵심 게이트)
- 규모: XL (PDF 뷰어 + 체크리스트 + 승인/반려 액션)
- 비고: 파일 검수 전용 화면. 주문 하나씩 처리.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────────────┐
│ [파일 확인 처리]  ORD-2026-001 | 홍길동 | A4 단면 500부          │
├──────────────────────────────────────────────────────────────────┤
│ SplitLayout (left 60% | right 40%)                              │
│  ┌────────────────────────────┐ ┌──────────────────────────┐   │
│  │ PDF Viewer (60%)           │ │ 검증 패널 (40%)           │   │
│  │                            │ │                          │   │
│  │  ┌──────────────────────┐  │ │ PitStop 자동검증 결과    │   │
│  │  │                      │  │ │  ┌────────────────────┐  │   │
│  │  │   [PDF 페이지 표시]   │  │ │  │ ✓ 해상도: 300dpi   │  │   │
│  │  │                      │  │ │  │ ✓ 컬러모드: CMYK   │  │   │
│  │  │                      │  │ │  │ ✗ 재단선: 누락     │  │   │
│  │  │                      │  │ │  │ ✓ 페이지수: 정상   │  │   │
│  │  │                      │  │ │  │ ✓ 폰트 임베드      │  │   │
│  │  └──────────────────────┘  │ │  └────────────────────┘  │   │
│  │  [1/3 페이지]  [< >] [줌]  │ │                          │   │
│  │  [전체화면] [다운로드]      │ │ 수동 검수 체크리스트      │   │
│  │                            │ │  □ 디자인 의도 확인       │   │
│  │  파일 목록                  │ │  □ 특수효과 지시 확인     │   │
│  │  ├ design_v2.pdf [현재]    │ │  □ 별색 처리 확인         │   │
│  │  └ design_v1.pdf [이전]    │ │  □ 기타 특이사항 없음     │   │
│  │                            │ │                          │   │
│  │                            │ │ 검수 메모                 │   │
│  │                            │ │  ┌────────────────────┐  │   │
│  │                            │ │  │ (검수 의견 입력)    │  │   │
│  │                            │ │  └────────────────────┘  │   │
│  │                            │ │                          │   │
│  │                            │ │  [승인]        [반려]     │   │
│  │                            │ │  (녹색 CTA)  (빨강 outline)│  │
│  └────────────────────────────┘ └──────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│ NavigationBar: [< 이전 주문]  처리현황: 5/23건  [다음 주문 >]   │
└──────────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
FileCheckPage
  ├── OrderHeader (주문번호, 고객, 상품 요약)
  ├── SplitLayout
  │     ├── PdfViewerPanel (left 60%)
  │     │     ├── PdfViewer (react-pdf 또는 iframe+pdfjs)
  │     │     ├── PageNavigator
  │     │     ├── ZoomControl
  │     │     └── FileList (버전 목록)
  │     └── ValidationPanel (right 40%)
  │           ├── PitStopResultSection
  │           │     └── ValidationItem × N (pass/fail 아이콘)
  │           ├── ManualChecklist
  │           │     └── ChecklistItem × N (체크박스)
  │           ├── MemoTextarea
  │           └── ApproveRejectActions
  │                 ├── ApproveButton → ApproveConfirmDialog
  │                 └── RejectButton → RejectReasonDialog
  └── NavigationBar (이전/다음 주문, 진행률)
```

### 4. Props / States

```typescript
interface FileCheckOrder {
  orderNo: string; customerName: string; productName: string;
  printSpec: PrintSpec;
  files: { id: string; name: string; url: string; version: number; isLatest: boolean }[];
  pitstopResult: PitStopValidation;
  currentStatus: FileStatus;
}

interface PitStopValidation {
  resolution: { pass: boolean; value?: string };
  colorMode: { pass: boolean; value?: string };
  bleedLine: { pass: boolean; message?: string };
  pageCount: { pass: boolean; expected?: number; actual?: number };
  fontEmbed: { pass: boolean };
  overallPass: boolean;
}

interface FileCheckState {
  currentOrderNo: string;
  pdfUrl: string;
  currentPage: number; totalPages: number; zoom: number;
  checklist: Record<string, boolean>;
  memo: string;
  submitting: boolean;
}
```

### 5. API 매핑

```
GET  /admin/custom/file-check/queue
  Response: { orders: FileCheckQueueItem[], total, processed }

GET  /admin/custom/file-check/:orderNo
  Response: FileCheckOrder (pitstop 결과 포함)

POST /admin/custom/file-check/:orderNo/approve
  Body: { checklist: Record<string, boolean>; memo?: string }

POST /admin/custom/file-check/:orderNo/reject
  Body: { checklist: Record<string, boolean>; reason: string; reuploadRequired: boolean }
  → 반려 시 고객 알림톡 자동 발송 트리거

GET  /admin/custom/file-check/:orderNo/pitstop
  Response: PitStopValidation (캐시 또는 재검증)
```

### 6. 데이터 플로우

```
페이지 진입 → GET /file-check/queue → 첫 번째 주문 로드
  └── GET /file-check/:orderNo → PdfViewer + ValidationPanel 렌더

승인 플로우:
  ApproveButton 클릭 → ApproveConfirmDialog
    → POST /approve → 성공
      → 다음 주문으로 자동 이동 (큐 기반)
      → 처리현황 카운터 업데이트

반려 플로우:
  RejectButton 클릭 → RejectReasonDialog (사유 입력 필수)
    → POST /reject → 성공
      → 알림톡 발송 (서버에서 처리)
      → 주문 상태: fileChecked → rejected
      → 다음 주문으로 이동
```

### 7. 인터랙션 상태

| 상태 | UI |
|------|----|
| PDF 로딩 | Spinner + 스켈레톤 |
| PitStop 검증 중 | "PitStop 검증 중..." + 진행 애니메이션 |
| PitStop 통과 | 항목별 녹색 체크 |
| PitStop 실패 | 항목별 빨간 X + 경고 메시지 |
| 체크리스트 미완 | 승인/반려 버튼 비활성화 |
| 승인 처리 중 | 버튼 로딩 스피너 |
| 반려 사유 대화상자 | 필수 입력 → 빈 경우 에러 |

### 8. 에러 처리

- PDF 로드 실패: "파일을 불러올 수 없습니다. [다시 시도]" + 지원팀 연락처
- PitStop API 타임아웃: "자동 검증 실패 — 수동 검수를 진행하세요" 경고
- 승인/반려 API 실패: "처리 실패. 새로고침 후 다시 시도해 주세요."
- 큐 비어있음: "처리할 파일이 없습니다" EmptyState

### 9. 접근성

- PdfViewer: `aria-label="PDF 뷰어, {fileName}"` + 키보드 페이지 이동
- ValidationItem: `role="status"` + 통과/실패 텍스트 명시
- ApproveButton: `aria-label="파일 승인"`, RejectButton: `aria-label="파일 반려"`

---

## SCR-B8-REUPLOAD

**재업로드 요청 | CUSTOM | 우선순위 1 | 규모 M**

### 1. 화면 개요

- 반려된 주문 목록에서 재업로드 요청 사유 편집 + 알림톡 발송

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [재업로드 요청 관리]                                     │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 기간 / 요청상태[대기/발송완료] / 검색어   │
├──────────────────────────────────────────────────────────┤
│ ReuploadDataTable                                        │
│  [체]주문번호 │ 고객 │ 상품 │ 반려사유 │ 요청일 │ 상태  │
│               │      │      │ [편집]   │        │[발송]  │
│  ─────────────────────────────────────────────────────  │
│  □ ORD-001 │ 홍길동 │ A4단면 │ 재단선 누락 │ 03-15 │    │
│             │        │        │             │       │[대기]│
│                                      [일괄 알림톡 발송]  │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ReuploadPage
  ├── ReuploadFilter
  └── ReuploadDataTable
        ├── ReuploadRow
        │     ├── RejectReasonCell
        │     │     └── EditReasonButton → ReasonEditorDialog
        │     └── AlimtalkButton → AlimtalkPreviewDialog
        │           └── SendConfirmButton
        └── BulkAlimtalkButton (선택 건 일괄 발송)
```

### 4~5. API 매핑

```
GET  /admin/custom/reupload-requests      -- 목록
PATCH /admin/custom/reupload-requests/:id/reason  -- 사유 수정
POST /admin/custom/reupload-requests/:id/send-alimtalk
POST /admin/custom/reupload-requests/bulk-alimtalk
  Body: { ids: string[] }
```

### 6~9. (공통 패턴 적용)

---

## SCR-B8-ORDER-PRINT

**주문서 출력 | SKIN | 우선순위 1 | 규모 M**

### 1. 화면 개요

- shopby SKIN 기반 주문서 출력. A4 PrintSheet 렌더링 + 브라우저 인쇄.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [주문서 출력]                           [인쇄(Ctrl+P)]  │
├──────────────────────────────────────────────────────────┤
│ PrintSheet (A4 비율, @media print 최적화)                │
│  ┌────────────────────────────────┐                      │
│  │  [로고]  후니프린팅 주문서     │                      │
│  │  주문번호: ORD-2026-001        │                      │
│  │  고객명: 홍길동  연락처: ...   │                      │
│  │  주문일: 2026-03-19            │                      │
│  │  ──────────────────────────── │                      │
│  │  상품명     수량  단가   금액  │                      │
│  │  A4 단면    500   19원  9,500  │                      │
│  │  ──────────────────────────── │                      │
│  │  합계: ₩9,500  VAT: ₩950      │                      │
│  │  총결제: ₩10,450               │                      │
│  │  ──────────────────────────── │                      │
│  │  배송지: 서울시 강남구 ...     │                      │
│  │  인쇄 사양: CMYK, 300dpi, 무광│                      │
│  └────────────────────────────────┘                      │
└──────────────────────────────────────────────────────────┘
```

### 5. API 매핑

```
shopby: GET /api/v2/admin/orders/:orderNo   -- 표준 주문 상세
custom: GET /admin/custom/print-orders/:orderNo/print-spec -- 인쇄사양 추가
```

### 구현 노트

- `window.print()` 호출 전 `@media print` CSS로 불필요 UI 숨김
- 일괄 출력: 여러 주문 > 각각 iframe 생성 > 순차 print

---

## SCR-B8-STATUS-CHANGE

**주문 상태 변경 | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- 개별/일괄 주문 상태 변경 전용 화면. 8단계 상태 타임라인 시각화.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [주문 상태 변경]                                         │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 주문번호 검색 / 현재 상태 필터 / 기간     │
├──────────────────────────────────────────────────────────┤
│ BulkActionBar: ☑ N개 선택 → [일괄 상태변경 ▼] [SMS]    │
├──────────────────────────────────────────────────────────┤
│ DataTable                                                │
│  [체]주문번호 │ 고객 │ 상품 │ 현재상태 │ 목표상태 │ 변경│
│  ─────────────────────────────────────────────────────  │
│  □ ORD-001 │ 홍길동 │ A4단면 │ [파일검수] │ [제작접수▼]│  │
│             │        │        │            │             │[변경]│
│                                     StageTimeline →     │
│  ●접수─●파일접수─●파일검수─○제작접수─○인쇄중─○후가공  │
│                                   ─○출고─○배송중        │
├──────────────────────────────────────────────────────────┤
│ StatusChangeForm (우측 패널 또는 Drawer)                 │
│  변경 상태: [제작접수 ▼]                                 │
│  변경 메모: [입력]                                       │
│  SMS 발송: [✓] 고객에게 상태 변경 알림 발송             │
│  [변경 확인]                                             │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
StatusChangePage
  ├── StatusChangeFilter
  ├── BulkActionBar
  └── DataTable
        ├── StatusChangeRow
        │     ├── CurrentStatusBadge
        │     ├── TargetStatusSelect (허용 다음 상태만 표시)
        │     └── ChangeButton → StatusChangeDrawer
        └── StatusChangeDrawer
              ├── StageTimeline (현재 위치 강조)
              ├── TargetStatusSelect
              ├── MemoInput
              ├── SmsToggle
              └── ConfirmButton
```

### 4. 상태 전이 규칙

```typescript
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  received: ["fileReceived"],
  fileReceived: ["fileChecked"],
  fileChecked: ["productionReceived", "received"], // 반려 시 접수로 복귀
  productionReceived: ["printing"],
  printing: ["postProcess"],
  postProcess: ["shipped"],
  shipped: ["delivering"],
  delivering: [], // 최종 상태
};
```

### 5. API 매핑

```
POST /admin/custom/orders/status-change
  Body: { orderNos: string[], targetStatus: OrderStatus, memo?, sendSms: boolean }
  Response: { success: number, failed: OrderNo[] }
```

### 6~9. (PRINT-ORDER 에러 처리 패턴 동일 적용)

---

## SCR-B8-DEFERRED-PAY

**후불결제 관리 | CUSTOM | 우선순위 2 | 규모 L**

### 1. 화면 개요

- 후불결제 승인 고객 대상 미수금 관리. 결제 확인 처리 + 독촉.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [후불결제 관리]                                          │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 기간 / 결제상태[미결제/결제완료] / 고객   │
├──────────────────────────────────────────────────────────┤
│ SummaryRow: 총 미수금 ₩2,340,000 | 연체 3건 | 금월 예정 5건 │
├──────────────────────────────────────────────────────────┤
│ DeferredPayDataTable                                     │
│  [체]주문번호 │ 고객 │ 금액 │ 결제기한 │ D-day │ 상태  │
│  ─────────────────────────────────────────────────────  │
│  □ ORD-001 │ (주)ABC │ ₩500,000 │ 03-25 │ D-6 │ [미결제]│
│  □ ORD-002 │ 김철수  │ ₩120,000 │ 03-15 │ D+4 │ [연체!]│
│         [결제확인]  [독촉SMS]                            │
└──────────────────────────────────────────────────────────┘
```

### 5. API 매핑

```
GET  /admin/custom/deferred-payments           -- 목록
POST /admin/custom/deferred-payments/:id/confirm  -- 결제확인
POST /admin/custom/deferred-payments/:id/remind   -- 독촉SMS
GET  /admin/custom/deferred-payments/summary      -- 미수금 집계
```

### 구현 노트

- D-day 계산: 결제기한 - today, 음수 = 연체 (빨간 강조)
- 연체 행: 배경 red-50 + 빨간 뱃지

---

## SCR-B8-RECEIPTS

**증빙서류 관리 | SKIN | 우선순위 2 | 규모 M**

> shopby SKIN 기반. 세금계산서/현금영수증 발행 요청 목록 + 발행 처리.
>
> - API: shopby 표준 세금계산서 API 활용
> - 커스텀 추가: 인쇄 주문 연계 영수증 번호 표시

---

## SCR-B8-SMS

**SMS/알림톡 발송 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- 수동 SMS/알림톡 발송. 템플릿 선택 + 수신자 선택 + 발송 이력.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [SMS/알림톡 발송]                                        │
├──────────────────────────────────────────────────────────┤
│ FormLayout (grid-cols-2)                                 │
│  ┌─────────────────────┐ ┌──────────────────────────┐  │
│  │ 발송 설정           │ │ 미리보기                  │  │
│  │ 발송유형: SMS●알림톡○│ │  [핸드폰 프레임 미리보기] │  │
│  │ 템플릿: [파일반려안내▼]││  안녕하세요 {고객명}님...│  │
│  │ 수신자:             │ │                           │  │
│  │  ○ 주문번호로 선택   │ │                           │  │
│  │  ○ 고객명으로 검색  │ │                           │  │
│  │  ○ 파일 업로드      │ │                           │  │
│  │ [수신자 추가]       │ │                           │  │
│  │                     │ │                           │  │
│  │ 수신자 목록 (3명)   │ └──────────────────────────┘  │
│  │  ├ 홍길동 010-xxx   │                               │
│  │  ├ 김철수 010-xxx   │                               │
│  │  └ 이영희 010-xxx   │                               │
│  │                     │                               │
│  │  [발송하기(빨강)]   │                               │
│  └─────────────────────┘                               │
├──────────────────────────────────────────────────────────┤
│ 발송 이력 (최근 20건)                                    │
│  발송일시 │ 유형 │ 템플릿 │ 수신자수 │ 성공/실패       │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
SmsPage
  ├── SmsFormSection
  │     ├── SendTypeToggle (SMS/알림톡)
  │     ├── TemplateSelector (템플릿 드롭다운)
  │     ├── RecipientSelector
  │     │     ├── OrderNoSearchInput
  │     │     ├── CustomerNameSearch
  │     │     └── RecipientList (삭제 가능)
  │     └── SendButton → SendConfirmDialog
  ├── SmsPreviewPanel (핸드폰 목업 미리보기)
  └── SmsHistoryTable (최근 발송 이력)
```

### 5. API 매핑

```
GET  /admin/custom/sms/templates           -- 템플릿 목록
POST /admin/custom/sms/send
  Body: { type: "sms"|"alimtalk", templateId, recipients: PhoneNum[], variables: {} }
GET  /admin/custom/sms/history             -- 발송 이력
```

---

## SCR-B9-FILE-DASHBOARD

**파일검증 대시보드 | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- 전체 파일 검증 상태 한눈에 파악. 오류 유형별 집계 + 개별 처리 링크.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [파일검증 대시보드]                    [새로고침] [설정] │
├──────────────────────────────────────────────────────────┤
│ StatusFilterTabs                                         │
│  [전체(234)] [검증대기(43)] [검증중(12)] [승인(156)]     │
│  [반려(23)]                                              │
├──────────────────────────────────────────────────────────┤
│ SummaryRow (ResponsiveGrid grid-cols-4)                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │대기 43건│ │처리중12│ │승인 156│ │반려 23 │           │
│  │ ▲5 오늘│ │        │ │92.3%율 │ │13.7%율 │           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
├──────────────────────────────────────────────────────────┤
│ ErrorTypeSummary (grid-cols-3)                           │
│  ┌──────────────────┐ ┌────────────┐ ┌────────────┐    │
│  │ 재단선 누락  12건 │ │해상도 낮음 │ │컬러모드오류│    │
│  └──────────────────┘ └────────────┘ └────────────┘    │
├──────────────────────────────────────────────────────────┤
│ FileDetailTable                                          │
│  주문번호 │ 고객 │ 파일명 │ 오류유형 │ 담당자 │ 처리    │
│  ─────────────────────────────────────────────────────  │
│  ORD-001 │ 홍길동 │ design.pdf │ 재단선 │ 김검수 │ [처리]│
│  [파일검증 화면으로 이동 →]                              │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
FileDashboardPage
  ├── DashboardHeader (새로고침, 자동갱신 토글)
  ├── StatusFilterTabs (뱃지 카운트 포함)
  ├── StatusSummaryGrid (4x StatCard)
  ├── ErrorTypeSummaryGrid (오류 유형별 건수)
  └── FileDetailTable
        ├── FileDetailRow
        │     ├── ErrorTypeBadge
        │     ├── AssigneeSelect (담당자 지정)
        │     └── ProcessLink → SCR-B8-FILE-CHECK
        └── Pagination
```

### 5. API 매핑

```
GET /admin/custom/file-validation/dashboard
  Response: { statusCounts, errorTypeCounts, recentFiles[], autoRefreshInterval }

GET /admin/custom/file-validation/list
  Query: status, errorType, assignee, page, pageSize

PATCH /admin/custom/file-validation/:id/assignee
  Body: { assigneeId: string }
```

### 6. 데이터 플로우

- 자동 새로고침: 30초 interval (설정 변경 가능)
- StatusFilterTabs 클릭 → GET list?status=X
- 처리 링크 클릭 → SCR-B8-FILE-CHECK로 해당 주문 직접 이동

### 7~9. (공통 패턴 적용)

---

## SCR-B9-PRINT-STATUS

**인쇄작업 현황 | CUSTOM | 우선순위 1 | 규모 L**

### 1. 화면 개요

- 인쇄 진행 중 주문의 작업 단계별 Kanban 보드. MES(생산관리) 패턴.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────────┐
│ [인쇄작업 현황]                         [새로고침] [필터]   │
├──────────────────────────────────────────────────────────────┤
│ StageKanban (수평 스크롤)                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │제작접수  │ │인쇄중    │ │후가공    │ │출고대기  │       │
│  │  (23건)  │ │  (41건)  │ │  (18건)  │ │  (9건)   │       │
│  │──────────│ │──────────│ │──────────│ │──────────│       │
│  │ORD-001  │ │ORD-005  │ │ORD-012  │ │ORD-018  │       │
│  │A4 단면  │ │A3 양면  │ │제본 소프│ │머그컵   │       │
│  │500부    │ │200부    │ │트커버   │ │100개    │       │
│  │담당: 김  │ │담당: 이  │ │담당: 박  │ │담당: 최  │       │
│  │D-2      │ │D-1      │ │D+1 ⚠   │ │완료예정  │       │
│  │[이동 →] │ │[이동 →] │ │[이동 →] │ │[출고처리]│       │
│  │──────────│ │──────────│ │──────────│ │──────────│       │
│  │ORD-002  │ │...      │ │...      │ │...      │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├──────────────────────────────────────────────────────────────┤
│ SplitLayout 하단: 선택 주문 상세                             │
│  WorkerAssignment + EstimatedCompletion + ProgressBar        │
└──────────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PrintStatusPage
  ├── DashboardHeader (자동갱신 토글, 필터 Popover)
  ├── StageKanban
  │     └── KanbanColumn × 4 (제작접수/인쇄중/후가공/출고대기)
  │           └── WorkOrderCard × N
  │                 ├── OrderSummary
  │                 ├── AssigneeChip
  │                 ├── DdayBadge (지연 빨강 강조)
  │                 └── MoveStageButton
  └── WorkOrderDetailPanel (하단, 선택 시)
        ├── WorkerAssignmentSelect
        ├── EstimatedCompletionDatePicker
        └── ProductionMemo
```

### 4. Props / States

```typescript
interface WorkOrder {
  orderNo: string; stage: ProductionStage;
  productName: string; qty: number; printSpec: PrintSpec;
  assignee?: string; startedAt?: string;
  dueDate: string; estimatedCompletion?: string;
  dDay: number; // 음수 = 지연
}

type ProductionStage = "productionReceived" | "printing" | "postProcess" | "readyToShip";

interface KanbanState {
  columns: Record<ProductionStage, WorkOrder[]>;
  selectedOrderNo: string | null;
  autoRefresh: boolean;
}
```

### 5. API 매핑

```
GET  /admin/custom/production/kanban
  Response: { columns: Record<ProductionStage, WorkOrder[]> }

PATCH /admin/custom/production/:orderNo/stage
  Body: { targetStage: ProductionStage }

PATCH /admin/custom/production/:orderNo/assign
  Body: { assigneeId: string }

PATCH /admin/custom/production/:orderNo/estimated-completion
  Body: { date: string }
```

### 6. 데이터 플로우

- 30초 폴링 또는 WebSocket (서버 지원 시)
- 카드 "이동" 버튼 → PATCH /stage → 칼럼 간 카드 이동 (optimistic update)
- 지연 감지: dDay < 0 → 카드 border-red-500

---

## SCR-B9-QUALITY-CHECK

**품질검수 관리 | CUSTOM | 우선순위 2 | 규모 M**

### 1. 화면 개요

- 출고 전 최종 품질 검수. 체크리스트 + 원본/출력 비교 뷰어.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [품질검수 관리]                                          │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 검수상태[대기/완료/반품] / 주문번호 / 기간│
├──────────────────────────────────────────────────────────┤
│ SplitLayout (left 50% | right 50%)                      │
│  ┌─────────────────────┐ ┌─────────────────────────┐   │
│  │ 검수 대기 목록       │ │ 검수 패널               │   │
│  │  [주문번호] [클릭]   │ │  ComparisonViewer       │   │
│  │  ORD-001 A4단면     │ │  원본PDF | 출력사진     │   │
│  │  ORD-002 A3양면     │ │  [← 이미지 슬라이더 →]  │   │
│  │  ...                │ │                         │   │
│  │                     │ │ QualityChecklist        │   │
│  │                     │ │  □ 인쇄 품질 양호        │   │
│  │                     │ │  □ 색상 정확도 확인      │   │
│  │                     │ │  □ 재단 정확도 확인      │   │
│  │                     │ │  □ 수량 확인             │   │
│  │                     │ │                         │   │
│  │                     │ │ [검수통과] [반품처리]    │   │
│  └─────────────────────┘ └─────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 5. API 매핑

```
GET  /admin/custom/quality-check/queue         -- 검수 대기 목록
GET  /admin/custom/quality-check/:orderNo      -- 비교 이미지 + 체크리스트
POST /admin/custom/quality-check/:orderNo/pass -- 검수 통과
POST /admin/custom/quality-check/:orderNo/return -- 반품 처리
```

---

## SCR-B9-OUTSOURCE

**외주 인쇄소 관리 | CUSTOM | 우선순위 2 | 규모 L**

### 1. 화면 개요

- 외주 인쇄소에 발주한 주문 추적 + 비용 정산 관리.

### 2. 와이어프레임 (Desktop 1280px)

```
┌──────────────────────────────────────────────────────────┐
│ [외주 인쇄소 관리]                                       │
├──────────────────────────────────────────────────────────┤
│ FilterSection: 인쇄소 [전체▼] / 발주상태 / 기간         │
├──────────────────────────────────────────────────────────┤
│ CostSummaryRow: 이번달 외주비 ₩3,200,000 | 진행중 12건  │
├──────────────────────────────────────────────────────────┤
│ OutsourceDataTable                                       │
│  [체]발주번호│원주문│인쇄소│품목│발주일│납기│상태│비용 │
│  ─────────────────────────────────────────────────────  │
│  □ OUT-001│ORD-023│A인쇄소│A3양면│03-15│03-20│[진행중]│  │
│           │        │       │      │     │     │₩45,000 │  │
│           [납기 추적] [비용확인] [완료처리]               │
├──────────────────────────────────────────────────────────┤
│ OrderTracker (선택 발주 납기 타임라인)                   │
└──────────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
OutsourcePage
  ├── OutsourceFilter
  ├── CostSummaryRow
  └── OutsourceDataTable
        ├── OutsourceRow
        │     ├── OutsourceStatusBadge
        │     ├── OrderTrackerButton → OrderTrackerDrawer
        │     │     └── DeliveryTimeline
        │     ├── CostDetailButton → CostDetailDialog
        │     └── CompleteButton → CompleteConfirmDialog
        └── BulkActionBar + Pagination
```

### 5. API 매핑

```
GET  /admin/custom/outsource-orders           -- 목록
POST /admin/custom/outsource-orders           -- 발주 생성
PATCH /admin/custom/outsource-orders/:id/status -- 상태 변경
GET  /admin/custom/outsource-orders/:id/tracking -- 납기 추적
GET  /admin/custom/outsource-orders/cost-summary -- 비용 집계
GET  /admin/custom/outsource-orders/export    -- 엑셀
```

### 6~9. (공통 패턴 적용)

---

## 공통 구현 가이드라인

### DataTable 공통 패턴

```typescript
// 모든 어드민 DataTable 공통 구현
// shadcn/ui Table + TanStack Table v8 권장
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

// 체크박스 선택: useRowSelection hook
// 정렬: enableSorting: true per column
// 페이지: controlled pagination (server-side)
// 엑셀: xlsx 라이브러리 클라이언트 export
```

### StatCard 색상 규칙

- 상승 트렌드 (양수): text-emerald-600, 아이콘 ▲
- 하락 트렌드 (음수): text-red-600, 아이콘 ▼
- 중립: text-gray-500

### 주문 상태 뱃지 컬러

```
접수:       bg-gray-100  text-gray-700
파일접수:   bg-blue-100  text-blue-700
파일검수:   bg-purple-100 text-purple-700
제작접수:   bg-indigo-100 text-indigo-700
인쇄중:     bg-yellow-100 text-yellow-700
후가공:     bg-orange-100 text-orange-700
출고:       bg-teal-100  text-teal-700
배송중:     bg-green-100 text-green-700
```

### 파일 상태 뱃지 컬러

```
대기:   bg-gray-100  text-gray-600
처리중: bg-blue-100  text-blue-600
승인:   bg-green-100 text-green-700
반려:   bg-red-100   text-red-700
```
