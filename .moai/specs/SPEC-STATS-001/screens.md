---
id: SPEC-STATS-001
artifact: screens
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-STATS-001: 화면 인벤토리 (Screen Inventory)

> B7-STATISTICS 통계/리포트 도메인 전체 화면 설계 기초 자료

---

## 1. 전체 화면 인벤토리

### 1.1 대시보드 - SCR-STS-001 ~ 003

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-001 | 통합 대시보드 | Page | `/admin/statistics/dashboard` | - | P1 | DASHBOARD | KPI 카드 4개, 매출추이 라인, 상품군비율 도넛, 팀별실적 바, 최근주문 테이블 |
| SCR-STS-002 | 대시보드 - 위젯 확장 | Section | `/admin/statistics/dashboard` | SCR-STS-001 | P2 | DASHBOARD | 인기TOP10, 외주현황, 알림리스트 추가 위젯 |
| SCR-STS-003 | 대시보드 - 데이터 로딩 | State | `/admin/statistics/dashboard` | SCR-STS-001 | P1 | DASHBOARD | 위젯별 스켈레톤 로딩 UI |

### 1.2 인쇄/제본 통계 - SCR-STS-010 ~ 016

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-010 | 인쇄 상품통계 | Page | `/admin/statistics/printing` | - | P2 | PRODUCT | 기간필터, 인쇄 7개 분석축 차트, 데이터 테이블 |
| SCR-STS-011 | 인쇄 - 분석축 전환 | Section | `/admin/statistics/printing` | SCR-STS-010 | P2 | PRODUCT | 용지/코팅/후가공/수량/도수/사이즈 탭 전환 |
| SCR-STS-012 | 인쇄 - 차트 유형 전환 | Section | `/admin/statistics/printing` | SCR-STS-010 | P2 | PRODUCT | 바/라인/도넛 차트 전환 버튼 |
| SCR-STS-013 | 인쇄 - 데이터 테이블 뷰 | Section | `/admin/statistics/printing` | SCR-STS-010 | P2 | PRODUCT | 정렬/필터/페이징 데이터 테이블 |
| SCR-STS-014 | 제본 상품통계 탭 | Tab | `/admin/statistics/printing?tab=binding` | SCR-STS-010 | P2 | PRODUCT | 제본방식/페이지수/표지용지/합판독판/부수 분석 |
| SCR-STS-015 | 인쇄/제본 - 빈 데이터 | State | `/admin/statistics/printing` | SCR-STS-010 | P2 | PRODUCT | "해당 기간의 데이터가 없습니다" + 기간변경 안내 |
| SCR-STS-016 | 인쇄/제본 - 엑셀 내보내기 모달 | Modal | - | SCR-STS-010 | P2 | PRODUCT | 필드 선택 체크박스, 다운로드 버튼 |

### 1.3 굿즈 통계 - SCR-STS-020 ~ 023

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-020 | 굿즈 상품통계 | Page | `/admin/statistics/goods` | - | P2 | PRODUCT | 상품유형별, 인쇄방식별, 용도별, MOQ별 분석 차트 |
| SCR-STS-021 | 굿즈 - 인쇄방식 분석 | Tab | `/admin/statistics/goods?tab=print-method` | SCR-STS-020 | P2 | PRODUCT | 실크/UV/전사/각인/디지털 분포 |
| SCR-STS-022 | 굿즈 - 데이터 테이블 | Section | `/admin/statistics/goods` | SCR-STS-020 | P2 | PRODUCT | 굿즈 통계 테이블 뷰 |
| SCR-STS-023 | 굿즈 - 빈 데이터 | State | `/admin/statistics/goods` | SCR-STS-020 | P2 | PRODUCT | 빈 데이터 안내 |

### 1.4 패키지 통계 - SCR-STS-030 ~ 033

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-030 | 패키지 상품통계 | Page | `/admin/statistics/package` | - | P2 | PRODUCT | 형태별, 재질별, 톰슨별, 후가공별 분석 |
| SCR-STS-031 | 패키지 - 톰슨 분석 | Tab | `/admin/statistics/package?tab=thomson` | SCR-STS-030 | P2 | PRODUCT | 기존/신규 톰슨 비율, 칼형 제작 건수 |
| SCR-STS-032 | 패키지 - 데이터 테이블 | Section | `/admin/statistics/package` | SCR-STS-030 | P2 | PRODUCT | 패키지 통계 테이블 뷰 |
| SCR-STS-033 | 패키지 - 빈 데이터 | State | `/admin/statistics/package` | SCR-STS-030 | P2 | PRODUCT | 빈 데이터 안내 |

### 1.5 수작 통계 - SCR-STS-040 ~ 043

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-040 | 수작 상품통계 | Page | `/admin/statistics/handcraft` | - | P3 | PRODUCT | 공정별, 소요시간별, 단가별 분석 |
| SCR-STS-041 | 수작 - 소요시간 분석 | Tab | `/admin/statistics/handcraft?tab=duration` | SCR-STS-040 | P3 | PRODUCT | 1시간이내/반일/1일/2일+ 분포 |
| SCR-STS-042 | 수작 - 데이터 테이블 | Section | `/admin/statistics/handcraft` | SCR-STS-040 | P3 | PRODUCT | 수작 통계 테이블 뷰 |
| SCR-STS-043 | 수작 - 빈 데이터 | State | `/admin/statistics/handcraft` | SCR-STS-040 | P3 | PRODUCT | 빈 데이터 안내 |

### 1.6 월별 매출 - SCR-STS-050 ~ 053

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-050 | 월별 매출통계 | Page | `/admin/statistics/sales` | - | P1 | SALES | 월 총매출, 전월비, 전년비, 상품군별 비율, 결제수단별 |
| SCR-STS-051 | 매출 - 추이 차트 | Section | `/admin/statistics/sales` | SCR-STS-050 | P1 | SALES | 12개월 라인 차트 + 전년 비교선 |
| SCR-STS-052 | 매출 - 비교 기간 선택 | Section | `/admin/statistics/sales` | SCR-STS-050 | P1 | SALES | 전월/전년동기/직접선택 비교 |
| SCR-STS-053 | 매출 - 빈 데이터 | State | `/admin/statistics/sales` | SCR-STS-050 | P1 | SALES | 빈 데이터 안내 |

### 1.7 굿즈 발주/정산 - SCR-STS-060 ~ 066

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-060 | 굿즈 발주/정산 | Page | `/admin/statistics/settlement` | - | P2 | SETTLEMENT | 거래처별 발주액, 정산액, 마진율, 미정산액 테이블 |
| SCR-STS-061 | 정산 - 거래처 상세 | Page | `/admin/statistics/settlement/:vendorId` | SCR-STS-060 | P2 | SETTLEMENT | 발주 내역 상세 테이블 (상품명/발주가/판매가/마진/상태) |
| SCR-STS-062 | 정산 - 납기 준수율 | Section | `/admin/statistics/settlement/:vendorId` | SCR-STS-061 | P2 | SETTLEMENT | 약정납기 대비 실제납품 비율 |
| SCR-STS-063 | 정산 - 미정산 하이라이트 | State | `/admin/statistics/settlement` | SCR-STS-060 | P2 | SETTLEMENT | 미정산 행 빨간색 하이라이트 |
| SCR-STS-064 | 정산 - 품질이슈 표시 | State | `/admin/statistics/settlement/:vendorId` | SCR-STS-061 | P2 | SETTLEMENT | 불량/반품/재작업 건 주황색 표시 |
| SCR-STS-065 | 정산 - 엑셀 내보내기 | Modal | - | SCR-STS-060 | P2 | SETTLEMENT | 발주/정산 데이터 xlsx 다운로드 |
| SCR-STS-066 | 정산 - 빈 데이터 | State | `/admin/statistics/settlement` | SCR-STS-060 | P2 | SETTLEMENT | 빈 데이터 안내 |

### 1.8 팀별 통계 - SCR-STS-070 ~ 078

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-070 | 팀별 통계 | Page | `/admin/statistics/team` | - | P3 | TEAM | 팀별 매출, 건수, 달성률 테이블+차트 |
| SCR-STS-071 | 팀 상세 (담당자별) | Page | `/admin/statistics/team/:teamId` | SCR-STS-070 | P3 | TEAM | 담당자별 매출, 건수, 달성률, 평균처리시간 |
| SCR-STS-072 | 목표 설정 | Page | `/admin/statistics/team/target` | - | P3 | TEAM | 팀/담당자 월별 목표 입력, 수정 |
| SCR-STS-073 | 달성률 색상 코드 | State | `/admin/statistics/team` | SCR-STS-070 | P3 | TEAM | 100%+:초록, 80~99%:노랑, 80%미만:빨강 |
| SCR-STS-074 | 운영자 팀 제한 뷰 | State | `/admin/statistics/team` | SCR-STS-070 | P3 | TEAM | 본인 팀만 표시, 타팀 메뉴 비활성 |
| SCR-STS-075 | 팀별 - 기간 비교 | Section | `/admin/statistics/team` | SCR-STS-070 | P3 | TEAM | 전월/전년동기 실적 비교 |
| SCR-STS-076 | 팀별 - 엑셀 내보내기 | Modal | - | SCR-STS-070 | P3 | TEAM | 팀별 실적 xlsx 다운로드 |
| SCR-STS-077 | 팀별 - 빈 데이터 | State | `/admin/statistics/team` | SCR-STS-070 | P3 | TEAM | 빈 데이터 안내 |
| SCR-STS-078 | 목표 - 저장 확인 | Modal | - | SCR-STS-072 | P3 | TEAM | 목표 저장 성공 알림 |

### 1.9 공통 컴포넌트 - SCR-STS-090 ~ 095

| Screen ID | 화면명 | 유형 | Route Path | 부모 | 우선순위 | 모듈 | 핵심 기능 |
|-----------|--------|------|------------|------|---------|------|----------|
| SCR-STS-090 | 기간 필터 | Component | - | 전체 | P1 | COMMON | 일/주/월/분기/연/직접선택 드롭다운 + 달력 |
| SCR-STS-091 | 엑셀 내보내기 버튼 | Component | - | 전체 | P2 | COMMON | 다운로드 아이콘 + 로딩 스피너 |
| SCR-STS-092 | 차트 래퍼 (ApexCharts) | Component | - | 전체 | P1 | COMMON | 바/라인/도넛 차트 공통 래퍼 |
| SCR-STS-093 | 데이터 테이블 | Component | - | 전체 | P2 | COMMON | 정렬/필터/페이징/드릴다운 |
| SCR-STS-094 | 스켈레톤 로딩 | Component | - | 전체 | P1 | COMMON | 차트/테이블/카드 스켈레톤 |
| SCR-STS-095 | 대용량 내보내기 진행 모달 | Modal | - | 전체 | P2 | COMMON | 프로그레스 바 + 백그라운드 처리 안내 |

---

## 2. 화면 요약

| 구분 | 화면 수 | 우선순위 |
|------|---------|---------|
| 대시보드 | 3 | P1 |
| 인쇄/제본 통계 | 7 | P2 |
| 굿즈 통계 | 4 | P2 |
| 패키지 통계 | 4 | P2 |
| 수작 통계 | 4 | P3 |
| 월별 매출 | 4 | P1 |
| 발주/정산 | 7 | P2 |
| 팀별 통계 | 9 | P3 |
| 공통 컴포넌트 | 6 | P1~P2 |
| **합계** | **48** | |

---

## 3. 화면 설계 원칙

### 3.1 PC-First 레이아웃

- 기본 뷰포트: 1280px (최소), 1920px (최적)
- 대시보드: CSS Grid 4열 (1920px), 2열 (1280px)
- 통계 페이지: 좌측 필터 사이드바(280px) + 우측 콘텐츠 영역
- 차트 영역: 최소 너비 600px, 높이 400px

### 3.2 관리자 UI 패턴

- 좌측 GNB 메뉴에서 "통계" 메인 메뉴 하위로 8개 서브메뉴 배치
- 각 통계 페이지 상단: 제목 + 기간 필터 + 엑셀 내보내기 버튼
- 차트 영역: 차트 + 차트 유형 전환 + 테이블 뷰 전환
- 테이블 영역: 컬럼 정렬 + 검색 필터 + 페이징 (20건/페이지)
