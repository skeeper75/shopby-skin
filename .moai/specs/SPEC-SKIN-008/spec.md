---
id: SPEC-SKIN-008
version: 2.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
author: MoAI
priority: medium
issue_number: 0
tags: [admin, vendor, accounting, ledger, statistics, chart, excel, huni-ds]
depends_on: [SPEC-SKIN-005]
affects: [B-2, B-3, B-7]
---

# SPEC-SKIN-008 v2: 관리자 거래처/원장/통계

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 작성 (shadcn/ui 기반) |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 기반 전면 재작성. 정책 통합, 차트/엑셀 상세화, 미수금 4단계 자동관리 |

---

## 1. 개요

관리자 거래처 관리(CRUD + 유형/등급 + 매장게시판), 원장관리(계좌관리 + 오프라인 거래 원장 + 미수금 자동관리), 통계(대시보드 실시간 KPI + 상품통계 5종 + 월별매출 + 굿즈발주정산 + 팀별통계)를 Huni 디자인시스템 기반으로 신규 구현한다. 모든 API는 커스텀 구축이 필요하다.

- **IA 영역**: B-2 (2개), B-3 (3개), B-7 (8개) = 총 13개 항목
- **정책 문서**: POLICY-B2-VENDOR, POLICY-B3-ACCOUNTING, POLICY-B7-STATISTICS
- **구현 방식**: SKIN (거래처 B-2), CUSTOM (원장 B-3, 통계 B-7)
- **디자인시스템**: Huni DS (SPEC-DS-006) 전용
- **차트 라이브러리**: Recharts (권장)
- **엑셀 내보내기**: xlsx 형식, 최대 100,000행

---

## 2. IA 기능 목록

### B-2 거래처

| No | 기능 | 우선순위 | 구현 방식 | 비고 |
|----|------|----------|-----------|------|
| 45 | 거래처관리 (CRUD + 유형4분류 + 등급S/A/B/C + 업체목록 .txt) | P1 | SKIN | POLICY-B2 |
| 46 | 매장게시판 (거래처별 비공개) | P2 | CUSTOM | POLICY-B2 |

### B-3 원장

| No | 기능 | 우선순위 | 구현 방식 | 비고 |
|----|------|----------|-----------|------|
| 47 | 계좌관리 (3용도: 매출/매입/운영) | P1 | CUSTOM | POLICY-B3 |
| 48 | 원장관리 (온/오프통합, 거래등록, Excel/청구서/매칭) | P1 | CUSTOM | POLICY-B3 |
| 49 | 업체별 미수금 (4단계 자동관리: 정상>주의>경고>거래중지) | P1 | CUSTOM | POLICY-B3 |

### B-7 통계

| No | 기능 | 우선순위 | 구현 방식 | 비고 |
|----|------|----------|-----------|------|
| 79 | 인쇄/제본 상품통계 (상세보기) | P1 | CUSTOM | POLICY-B7 |
| 80 | 굿즈 상품통계 (상세보기) | P1 | CUSTOM | POLICY-B7 |
| 81 | 패키지 상품통계 (상세보기) | P1 | CUSTOM | POLICY-B7 |
| 82 | 수작 상품통계 (상세보기) | P2 | CUSTOM | POLICY-B7 |
| 83 | 월별 매출통계 (핵심 경영지표) | P0 | CUSTOM | POLICY-B7 |
| 84 | 굿즈 발주/정산 (Excel, 외주 정산) | P1 | CUSTOM | POLICY-B7 |
| 85 | 제작상품 팀별통계 (Excel, 공정관리) | P1 | CUSTOM | POLICY-B7 |

---

## 3. EARS 형식 요구사항

### REQ-008-001: 거래처 CRUD [WHEN-THEN]

**WHEN** 관리자가 거래처 정보(업체명, 대표자, 사업자번호, 연락처, 주소)를 입력하고 등록하면
**THEN** 시스템은 거래처를 저장하고 원장관리에서 활용 가능하게 해야 한다

- 거래처 유형 4분류: 인쇄소, 디자인업체, 배송업체, 기타
- 신용 등급: S, A, B, C (거래실적 기반)
- 결제 조건: 선결제, 후결제(월정산), 건별정산
- 업체목록 .txt 파일 생성/다운로드
- 거래 상태: 진행/중단

### REQ-008-002: 매장게시판 [WHEN-THEN]

**WHEN** 관리자가 매장게시판에 글을 등록하면
**THEN** 시스템은 해당 거래처만 볼 수 있는 비공개 게시글로 저장해야 한다

- 거래처별 비공개 게시판
- 첨부파일 지원
- 작업 지시, 단가 협의 등 업무 커뮤니케이션

### REQ-008-003: 계좌관리 [WHEN-THEN]

**WHEN** 관리자가 계좌를 등록하면
**THEN** 시스템은 계좌를 용도별(매출/매입/운영)로 분류하여 저장해야 한다

- 계좌 정보: 은행, 계좌번호, 예금주, 용도
- 용도 3분류: 매출용(입금), 매입용(출금), 운영용(경비)
- 계좌 활성/비활성 관리

### REQ-008-004: 원장관리 (온/오프 통합) [WHEN-THEN]

**WHEN** 관리자가 오프라인 거래를 등록하면
**THEN** 시스템은 원장에 기록하고 업체별 잔액을 자동 계산해야 한다

- 거래 등록: 날짜, 업체, 내용, 금액(매출/입금)
- 온라인 주문(shopby)과 오프라인 거래 통합 원장
- 업체별 잔액 자동 계산 (매출 누적 - 입금 누적)
- Excel 다운로드 (기간별, 업체별)
- 청구서 PDF 생성 (업체별, 기간별)
- 판매내역 매칭 기능 (shopby 주문 연결)

### REQ-008-005: 미수금 자동관리 [IF-THEN]

**IF** 거래처의 미수금이 기준일을 초과하면
**THEN** 시스템은 연체 단계를 자동 변경하고 알림을 발송해야 한다

- 4단계 연체 관리:
  - 정상: 미수금 있으나 기준일 이내
  - 주의: 30일 초과 (담당자 알림)
  - 경고: 60일 초과 (대표 알림)
  - 거래중지: 90일 초과 (자동 거래 차단)
- 업체별 미수금 합계 목록
- 상세 내역 드릴다운
- Excel 다운로드

### REQ-008-006: 대시보드 실시간 KPI [WHEN-THEN]

**WHEN** 관리자가 통계 대시보드에 접속하면
**THEN** 시스템은 핵심 경영지표를 실시간으로 표시해야 한다

- KPI 카드 4종: 이번달 매출, 전월 대비 증감(%), 주문건수, 평균단가
- 일별매출 line chart (최근 30일)
- 상품별 매출 donut chart (상위 5개 상품)
- 팀별 실적 horizontal bar chart

### REQ-008-007: 월별 매출통계 [WHEN-THEN]

**WHEN** 관리자가 통계 메뉴에서 기간을 선택하면
**THEN** 시스템은 해당 기간의 총매출, 주문수, 평균단가, 신규회원을 요약 카드로 표시하고 월별 매출 차트와 상품별 매출 비율을 시각화해야 한다

- 요약 카드: 총매출, 주문수, 평균단가, 신규회원
- 막대 차트: 월별 매출 추이 (Recharts BarChart)
- 테이블: 상품분류별(디지털/제본/실사/굿즈) 매출/비율/건수
- Excel 다운로드
- 비교 기간 설정: 전월/전년동기/직접선택

### REQ-008-008: 상품통계 5종 [WHEN-THEN]

**WHEN** 관리자가 상품통계(인쇄/제본/굿즈/패키지/수작) 메뉴에 접속하면
**THEN** 시스템은 기간별 상품 판매 현황을 테이블과 차트로 표시해야 한다

- 기간 필터 (DateRangePicker)
- 상품별 판매수량, 매출, 비율
- 상세보기 드릴다운 (옵션별 분석)
- Excel 다운로드
- 5종 공통 페이지 구조 (config 패턴)

### REQ-008-009: 굿즈 발주/정산 [WHEN-THEN]

**WHEN** 관리자가 굿즈 발주/정산 메뉴에 접속하면
**THEN** 시스템은 외주 발주 현황과 정산 내역을 표시해야 한다

- 발주 목록: 거래처, 상품, 수량, 금액, 상태
- 정산 내역: 거래처별 정산 합계
- Excel 다운로드

### REQ-008-010: 팀별통계 [WHEN-THEN]

**WHEN** 관리자가 팀별통계 메뉴에 접속하면
**THEN** 시스템은 제작팀별 처리 건수, 매출을 표시하여 공정관리에 활용하게 해야 한다

- 팀별 처리건수, 매출 테이블
- 기간 필터
- horizontal bar chart
- Excel 다운로드

### REQ-008-011: 엑셀 내보내기 성능 [Ubiquitous]

시스템은 **항상** 엑셀 내보내기 시 최대 100,000행까지 xlsx 형식으로 생성해야 한다

- 10,000행 이하: 클라이언트 사이드 생성
- 10,000행 초과: 서버 사이드 생성 + 다운로드 링크 제공
- 생성 중 Skeleton 로딩 표시

### REQ-008-012: 거래처 등급 자동 관리 [IF-THEN]

**IF** 거래처의 거래 실적이 등급 기준을 충족하면
**THEN** 시스템은 거래처 등급을 자동 변경하고 관리자에게 알림을 발송해야 한다

- S등급: 월 거래액 500만원 이상
- A등급: 월 거래액 200만원 이상
- B등급: 월 거래액 50만원 이상
- C등급: 월 거래액 50만원 미만

### REQ-008-013: 청구서 PDF 생성 [WHEN-THEN]

**WHEN** 관리자가 원장관리에서 "청구서 생성" 버튼을 클릭하면
**THEN** 시스템은 선택된 업체와 기간의 거래 내역을 PDF 청구서로 생성해야 한다

### REQ-008-014: 통계 데이터 무결성 [Unwanted]

시스템은 결제 완료 이전 상태의 주문을 매출 통계에 포함**하지 않아야 한다**

- 결제완료/배송중/배송완료/구매확정 상태만 집계
- 취소/환불 주문은 해당 월 매출에서 차감

---

## 4. Huni 디자인시스템 컴포넌트 사용

| 컴포넌트 | 용도 | 주요 props/패턴 |
|---------|------|----------------|
| Dialog | 거래처 상세/등록, 거래 등록, 미수금 상세, 청구서 미리보기 | lazyMount, unmountOnExit |
| TextField | 검색, 거래처 정보 입력, 거래 내용 입력, 금액 입력 | clearable, 7 slots |
| Field | 거래처 등록 폼, 거래 등록 폼 | Context Provider |
| Tabs | 통계 유형 탭, 원장 탭 (거래/미수금/청구서) | line variant |
| Pagination | 거래처 목록, 원장 목록, 통계 상세 | numbered variant |
| Chip | 거래처 등급(S/A/B/C), 미수금 상태(정상/주의/경고/중지), 거래 상태 | data-selected |
| Switch | 거래처 활성/중단, 계좌 활성/비활성 | data-checked |
| Skeleton | 차트 로딩, 테이블 로딩, KPI 카드 로딩 | neutral variant, wave |
| Divider | 폼 섹션 구분, 통계 영역 구분 | full/inset variant |
| Icon | 차트 아이콘, 액션 아이콘 (편집, 삭제, 다운로드) | lucide-react |
| Snackbar | 저장/삭제 알림, 엑셀 생성 완료 알림 | useSnackbar hook |

**차트 라이브러리 (Recharts)**:
- BarChart: 월별 매출 추이
- LineChart: 일별매출 트렌드 (대시보드)
- PieChart (Donut): 상품별 매출 비율
- Horizontal BarChart: 팀별 실적

**디자인 토큰 (통계 전용)**:
- 차트 primary: `#5538B6`
- 차트 secondary: `#9580D9`
- 차트 accent: `#E6B93F`
- 차트 neutral: `#CACACA`
- KPI 카드 배경: `#F6F6F6`
- KPI 카드 숫자: `#5538B6` 24px 600 weight
- KPI 카드 라벨: `#979797` 12px
- 증가 추세: `#22C55E` (green)
- 감소 추세: `#EF4444` (red)

---

## 5. API 연동

| 기능 | API 엔드포인트 | 분류 | 비고 |
|------|---------------|------|------|
| 거래처 CRUD | CRUD /custom/admin/vendors | [C] | 유형/등급 포함 |
| 업체목록 .txt | GET /custom/admin/vendors/export | [C] | 텍스트 파일 |
| 매장게시판 | CRUD /custom/admin/store-board | [C] | 거래처별 비공개 |
| 계좌 CRUD | CRUD /custom/admin/accounts | [C] | 3용도 분류 |
| 원장 CRUD | CRUD /custom/admin/ledger | [C] | 온/오프 통합 |
| 미수금 조회 | GET /custom/admin/ledger/receivables | [C] | 4단계 관리 |
| 청구서 생성 | POST /custom/admin/ledger/invoice | [C] | PDF |
| 매출통계 | GET /custom/admin/statistics/sales | [C] | 월별/상품별 |
| 상품통계 (인쇄) | GET /custom/admin/statistics/products/print | [C] | |
| 상품통계 (제본) | GET /custom/admin/statistics/products/binding | [C] | |
| 상품통계 (굿즈) | GET /custom/admin/statistics/products/goods | [C] | |
| 상품통계 (패키지) | GET /custom/admin/statistics/products/package | [C] | |
| 상품통계 (수작) | GET /custom/admin/statistics/products/handmade | [C] | |
| 발주/정산 | GET /custom/admin/statistics/settlement | [C] | |
| 팀별통계 | GET /custom/admin/statistics/team | [C] | 공정관리 |
| Excel 다운로드 | GET /custom/admin/export/excel | [C] | 공통 모듈 |

**참고**: 이 SPEC의 모든 API는 shopby에 없는 완전 커스텀([C]) 기능이다.

---

## 6. TAG 분해

| TAG | 범위 | 파일 영향 |
|-----|------|----------|
| TAG-008-VENDOR | 거래처 CRUD + 유형/등급 | src/pages/admin/vendor/ |
| TAG-008-BOARD | 매장게시판 | src/pages/admin/vendor/board/ |
| TAG-008-ACCOUNT | 계좌관리 | src/pages/admin/accounting/ |
| TAG-008-LEDGER | 원장관리 (거래등록/Excel/청구서) | src/pages/admin/accounting/ |
| TAG-008-RECEIVABLE | 미수금 자동관리 (4단계) | src/pages/admin/accounting/ |
| TAG-008-DASHBOARD | 대시보드 실시간 KPI | src/pages/admin/statistics/ |
| TAG-008-SALES | 월별 매출통계 | src/pages/admin/statistics/ |
| TAG-008-PRODUCT-STATS | 상품통계 5종 | src/pages/admin/statistics/product/ |
| TAG-008-SETTLEMENT | 굿즈 발주/정산 | src/pages/admin/statistics/ |
| TAG-008-TEAM | 팀별통계 | src/pages/admin/statistics/ |
| TAG-008-EXCEL | Excel 공통 모듈 | src/utils/excelExport.ts |

---

## 7. 의존성

- **SPEC-SKIN-005**: 관리자 기반 레이아웃 (사이드바, 인증, RBAC)
- **SPEC-DS-006**: Huni 디자인시스템 컴포넌트
- **POLICY-B2-VENDOR**: 거래처 정책
- **POLICY-B3-ACCOUNTING**: 원장/회계 정책
- **POLICY-B7-STATISTICS**: 통계/리포트 정책
- **Recharts**: 차트 라이브러리 (신규 의존성)
- **xlsx (SheetJS)**: 엑셀 생성 라이브러리 (신규 의존성)
