---
id: SPEC-SKIN-008
version: 2.0.0
type: plan
---

# SPEC-SKIN-008 v2: 관리자 거래처/원장/통계 - 구현 계획

## 1. 구현 전략

### 1.1 개발 방식

- **전체 커스텀 개발**: shopby에 해당 기능 없음, 백엔드 API 전체 신규 구축 필요
- **Huni DS 전용**: 모든 UI를 Huni 디자인시스템 컴포넌트로 구현
- **Desktop 전용**: 최소 1280px (차트/테이블 넓은 화면 필요)

### 1.2 기술 요구사항

- React 18 + TypeScript
- Huni 디자인시스템 (SPEC-DS-006) 컴포넌트
- `--huni-*` 토큰 전용
- **Recharts**: 차트 라이브러리 (BarChart, LineChart, PieChart)
- **xlsx (SheetJS)**: 클라이언트 사이드 엑셀 생성
- **@react-pdf/renderer** 또는 서버 사이드: 청구서 PDF 생성
- DateRangePicker: 기간 선택 (Huni Dialog + Calendar 조합)

---

## 2. 마일스톤

### Phase 1: 거래처 관리 (Primary Goal)

**TAG-008-VENDOR + TAG-008-BOARD**

- 거래처 CRUD (유형4분류, 등급S/A/B/C)
- 업체목록 .txt 생성/다운로드
- 매장게시판 (거래처별 비공개)

**파일 구조:**
```
src/pages/admin/vendor/
  ├── VendorPage.tsx (목록)
  ├── VendorCreatePage.tsx
  ├── VendorDetailPage.tsx
  └── board/
      └── StoreBoardPage.tsx
src/components/admin/vendor/
  ├── VendorForm.tsx
  ├── VendorGradeChip.tsx
  └── VendorTypeFilter.tsx
```

### Phase 2: 원장/미수금 (Primary Goal)

**TAG-008-ACCOUNT + TAG-008-LEDGER + TAG-008-RECEIVABLE**

- 계좌관리 (3용도 CRUD)
- 원장관리 (거래등록, 잔액 자동계산)
- 업체별 미수금 (4단계 자동관리)
- Excel 다운로드
- 청구서 PDF 생성

**파일 구조:**
```
src/pages/admin/accounting/
  ├── AccountPage.tsx (계좌)
  ├── LedgerPage.tsx (원장)
  ├── LedgerCreatePage.tsx
  └── ReceivablePage.tsx (미수금)
src/components/admin/accounting/
  ├── LedgerForm.tsx
  ├── LedgerTable.tsx
  ├── ReceivableStatusChip.tsx
  └── InvoicePreview.tsx
```

### Phase 3: 핵심 통계 (Primary Goal)

**TAG-008-DASHBOARD + TAG-008-SALES**

- 대시보드 실시간 KPI (4종 카드 + 3종 차트)
- 월별 매출통계 (요약 카드 + 차트 + 테이블)
- DateRangePicker 공통 컴포넌트
- Excel 다운로드 공통 모듈

**파일 구조:**
```
src/pages/admin/statistics/
  ├── DashboardPage.tsx
  └── SalesPage.tsx
src/components/admin/statistics/
  ├── KpiCard.tsx
  ├── SalesBarChart.tsx
  ├── SalesDonutChart.tsx
  ├── TeamBarChart.tsx
  ├── DailyLineChart.tsx
  └── DateRangeFilter.tsx
src/utils/
  └── excelExport.ts (공통 모듈)
```

### Phase 4: 상품/팀 통계 (Secondary Goal)

**TAG-008-PRODUCT-STATS + TAG-008-SETTLEMENT + TAG-008-TEAM**

- 상품통계 5종 (공통 config 패턴)
- 굿즈 발주/정산
- 팀별통계

**파일 구조:**
```
src/pages/admin/statistics/
  ├── product/
  │   ├── PrintStatsPage.tsx
  │   ├── BindingStatsPage.tsx
  │   ├── GoodsStatsPage.tsx
  │   ├── PackageStatsPage.tsx
  │   └── HandmadeStatsPage.tsx
  ├── SettlementPage.tsx
  └── TeamStatsPage.tsx
src/components/admin/statistics/
  └── ProductStatsTemplate.tsx (공통 5종)
```

---

## 3. 아키텍처 설계 방향

### 3.1 차트 구현 (Recharts)

- Recharts 선택 이유: shadcn/ui chart 컴포넌트에서 이미 사용, 번들 크기 경량
- 공통 차트 래퍼 컴포넌트 (Huni 토큰 적용)
- 반응형 차트 (ResponsiveContainer)
- 차트 색상 팔레트: `#5538B6`, `#9580D9`, `#E6B93F`, `#CACACA`

### 3.2 엑셀 내보내기

- 10,000행 이하: 클라이언트 사이드 (xlsx/SheetJS)
- 10,000행 초과: 서버 API 호출 → Blob 다운로드
- 공통 `excelExport.ts` 유틸리티
- 시트 구조: 헤더행 + 데이터행 + 합계행

### 3.3 상품통계 5종 Config 패턴

- `ProductStatsTemplate` 공통 컴포넌트
- 통계 유형별 config 객체 (컬럼, API 엔드포인트, 차트 설정)
- 5개 페이지가 동일 템플릿 + 다른 config로 동작

### 3.4 미수금 4단계 자동관리

- 배치 처리: 일 1회 미수금 상태 자동 갱신
- 상태 변경 시 Chip 색상 자동 변경
  - 정상: 녹색, 주의: 노란색, 경고: 주황색, 거래중지: 빨간색
- 알림 발송: 상태 변경 시 담당자/대표에게 알림

---

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|----------|
| 전체 커스텀 백엔드 API 부재 | 높음 | API 명세 먼저 확정, MSW mock 활용 |
| 대용량 엑셀 생성 성능 | 중간 | 서버 사이드 스트림 생성, 진행률 표시 |
| 차트 렌더링 성능 (대량 데이터) | 중간 | 데이터 집계를 서버에서 수행, 클라이언트는 집계 결과만 표시 |
| 온/오프라인 거래 통합 정합성 | 높음 | shopby 주문 데이터와 매칭 로직 검증 테스트 |
| 청구서 PDF 레이아웃 | 낮음 | 서버 사이드 PDF 생성 권장 |
| 정책 미결정 사항 (B2/B3/B7) | 높음 | 추천 정책안으로 우선 구현, 정책 확정 후 조정 |

---

## 5. 관련 TAG 매핑

| TAG | Phase | 우선순위 |
|-----|-------|----------|
| TAG-008-VENDOR | Phase 1 | Primary |
| TAG-008-BOARD | Phase 1 | Primary |
| TAG-008-ACCOUNT | Phase 2 | Primary |
| TAG-008-LEDGER | Phase 2 | Primary |
| TAG-008-RECEIVABLE | Phase 2 | Primary |
| TAG-008-DASHBOARD | Phase 3 | Primary |
| TAG-008-SALES | Phase 3 | Primary |
| TAG-008-EXCEL | Phase 3 | Primary |
| TAG-008-PRODUCT-STATS | Phase 4 | Secondary |
| TAG-008-SETTLEMENT | Phase 4 | Secondary |
| TAG-008-TEAM | Phase 4 | Secondary |
