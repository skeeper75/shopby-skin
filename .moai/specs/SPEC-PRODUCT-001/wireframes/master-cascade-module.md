---
id: SPEC-PRODUCT-001
artifact: wireframes/master-cascade-module
version: "2.0.0"
created: "2026-03-20"
updated: "2026-03-21"
author: MoAI (manager-spec)
status: draft
modules: [MASTER, CASCADE]
screens: SCR-PRD-001 ~ SCR-PRD-013
changelog: "v2.0 - screens.md v2.0 + excel-data-analysis.md GAP 반영 전면 재작성"
---

# SPEC-PRODUCT-001: 옵션 마스터 + 종속옵션 와이어프레임 v2.0

> 모듈 1(옵션 마스터 관리, SCR-PRD-001~008) + 모듈 2(종속옵션 엔진, SCR-PRD-009~013)
> Desktop 전용 (>=1024px), Tailwind CSS + shadcn/ui, Huni Design Tokens
> v2.0: 엑셀 GAP 분석 반영 - 판걸이수/기준판형, 대분류/중분류, 용지-상품 15개 카테고리 매핑, 14종 가격 유형

---

## 공통 레이아웃 구조

```
+---------------------------------------------------------------------+
|  [후니프린팅 로고]           관리자: 홍길동  |  설정  |  로그아웃  |
+----------+----------------------------------------------------------+
|          |                                                          |
| 사이드바  |  콘텐츠 영역 (1040px+)                                   |
| (240px)  |                                                          |
|          |  +------------------------------------------------------+|
| > 대시보드|  |  페이지 타이틀 + 브레드크럼                            ||
|          |  +------------------------------------------------------+|
| v 상품관리|  |                                                      ||
|   마스터  |  |  메인 콘텐츠                                         ||
|    사이즈 |  |                                                      ||
|    소재   |  |                                                      ||
|    용지   |  |                                                      ||
|    가격   |  |                                                      ||
|   인쇄상품|  |                                                      ||
|   일반상품|  |                                                      ||
|          |  +------------------------------------------------------+|
| > 주문관리|                                                          |
| > 회원관리|                                                          |
| > 통계   |                                                          |
|          |                                                          |
+----------+----------------------------------------------------------+
```

### 공통 디자인 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#5538B6` | CTA 버튼, 활성 탭 |
| `--color-primary-dark` | `#351D87` | Hover, Focus |
| `--color-border` | `#CACACA` | Input 테두리, 구분선 |
| `--color-error` | `#E53E3E` | 에러 메시지 |
| `--color-success` | `#38A169` | 성공 메시지 |
| `--color-bg-page` | `#F7F7F7` | 페이지 배경 |
| `--color-bg-card` | `#FFFFFF` | 카드/모달 배경 |
| `--font-family` | `Pretendard` | 전체 |

### 공통 테이블 스펙

- 헤더: sticky, 배경 `#F7F7F7`, 폰트 14px Bold
- 행 높이: 48px
- 페이지네이션: 20/50/100건 선택
- 체크박스 열: 40px 고정
- 액션 열: 120px 고정

---

# 모듈 1: 옵션 마스터 관리

---

## SCR-PRD-001: 사이즈 관리 페이지

### 1. 화면 개요

사이즈 마스터 CRUD 테이블. v2.0에서 재단사이즈/작업사이즈, 블리드, 판걸이수, 기준판형, 출력용지규격, 비규격 표시, MES ITEM_CD, 파일명약어, 적용 상품 Badge 컬럼 추가.

### 2. ASCII 와이어프레임

```
+------------------------------------------------------------------+
|  상품관리 > 마스터 관리 > 사이즈 관리                               |
+------------------------------------------------------------------+
|                                                                    |
|  사이즈 관리                                      [+ 사이즈 등록]  |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  | 상품유형: [전체      v]  기준판형: [전체 v]  상태: [전체 v]    | |
|  | 검색어:  [사이즈명/코드/ITEM_CD 입력...      ] [검색]         | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  전체 124건                            [선택 삭제] [엑셀 다운로드] |
|  +--+--+--------+----------+----------+----+------+-----+------+ |
|  |[]|No|사이즈명 |재단(가로  |작업(가로  |블리|판걸이|기준  |출력용 | |
|  |  |  |        |  x세로)  |  x세로)  |드  |수    |판형  |지규격 | |
|  +--+--+--------+----------+----------+----+------+-----+------+ |
|  |[]| 1|A4      |210x297   |214x301   | 2  |  4   | A3  |316x  | |
|  |  |  |        |          |          |    |      |     |467   | |
|  +--+--+--------+----------+----------+----+------+-----+------+ |
|  |[]| 2|A5      |148x210   |152x214   | 2  |  8   | A3  |316x  | |
|  |  |  |        |          |          |    |      |     |467   | |
|  +--+--+--------+----------+----------+----+------+-----+------+ |
|  |[]| 3|A3(슬로 |300x100   |304x104   | 2  |  6   | A3  |316x  | |
|  |  |  |건)     |          |          |    |      |     |467   | |
|  +--+--+--------+----------+----------+----+------+-----+------+ |
|  |[]| 4|A1(실사)|594x841   |          |    |      |     |      | |
|  |  |  | [비규격]|          |          |    |      |     |      | |
|  +--+--+--------+----------+----------+----+------+-----+------+ |
|                                                                    |
|  (추가 컬럼: 비규격여부, ITEM_CD, 파일명약어, 적용상품, 상태)       |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  비규격여부 | ITEM_CD | 파일명약어 | 적용 상품       | 상태   | |
|  +--------------------------------------------------------------+ |
|  |     -      |001-0001 |   엽서    | [디지털][스티커] | [활성] | |
|  |     -      |001-0002 |   엽서    | [디지털]        | [활성] | |
|  |     -      |001-0003 |   슬로건  | [디지털]        | [활성] | |
|  |  비규격    |002-0001 |   실사    | [실사]          | [활성] | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  < 1  2  3  4  5 >                     [20건 v] / 페이지          |
|                                                                    |
+------------------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
SizeMasterPage
+-- PageHeader
|   +-- Breadcrumb (items: ["상품관리", "마스터 관리", "사이즈 관리"])
|   +-- Button (variant: "primary", label: "+ 사이즈 등록", onClick: openCreateModal)
+-- FilterBar
|   +-- Select (label: "상품유형", options: productTypes, placeholder: "전체")
|   +-- Select (label: "기준판형", options: ["전체", "A3", "3절"], placeholder: "전체")
|   +-- Select (label: "상태", options: ["전체", "활성", "비활성"])
|   +-- Input (placeholder: "사이즈명/코드/ITEM_CD 입력...")
|   +-- Button (variant: "outline", label: "검색", onClick: handleSearch)
+-- TableToolbar
|   +-- Text (content: "전체 {totalCount}건")
|   +-- Button (variant: "destructive", label: "선택 삭제", disabled: !hasSelection)
|   +-- Button (variant: "outline", label: "엑셀 다운로드")
+-- DataTable (horizontalScroll: true)
|   +-- Checkbox (header: selectAll)
|   +-- Column (header: "No", accessor: "index", width: 60)
|   +-- Column (header: "사이즈명", accessor: "name", sortable: true, onClick: openEditModal)
|   +-- Column (header: "재단(가로x세로)", accessor: "cutSize", sortable: true)
|   +-- Column (header: "작업(가로x세로)", accessor: "workSize", sortable: true)
|   +-- Column (header: "블리드(mm)", accessor: "bleedMm", sortable: true, align: "right")
|   +-- Column (header: "판걸이수", accessor: "plateCount", sortable: true, align: "right")
|   +-- Column (header: "기준판형", accessor: "basePlateType", sortable: true)
|   +-- Column (header: "출력용지규격", accessor: "outputPaperSpec")
|   +-- Column (header: "비규격", accessor: "isIrregular", cell: Badge)
|   +-- Column (header: "ITEM_CD", accessor: "mesItemCd")
|   +-- Column (header: "파일명약어", accessor: "fileNameAbbr")
|   +-- Column (header: "적용 상품", accessor: "applicableProducts", cell: BadgeGroup)
|   +-- Column (header: "상태", accessor: "active", cell: StatusToggle)
+-- Pagination (page, limit: [20, 50, 100], totalPages)
+-- Dialog (ref: createEditModal -> SCR-PRD-002)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| DataTable | sizeList | `GET /api/admin/option-master/sizes` | 페이지 진입, 검색, 필터 변경, 페이지 이동 |
| Select (상품유형) | productTypes | `GET /api/admin/cascading/product-types` | 페이지 진입 시 1회 |
| StatusToggle | size.active | `PATCH /api/admin/option-master/sizes/:id/active` | 토글 클릭 |
| Pagination | pagination | `GET /api/admin/option-master/sizes` (meta) | 목록 API 응답 |

### 5. 인터랙션

- **초기 상태**: 필터 전체, 검색어 없음, 첫 페이지 로드
- **로딩 상태**: DataTable에 Skeleton 행 5개 표시, 필터/버튼 disabled
- **데이터 있음**: 테이블 행 표시, 페이지네이션 활성, 수평 스크롤 가능
- **데이터 없음**: 테이블 영역에 "등록된 사이즈가 없습니다." + 등록 버튼 안내
- **에러 상태**: Toast로 에러 메시지 표시, 재시도 버튼
- **토글 중**: 해당 행 opacity 0.5 + Spinner, 성공 시 상태 갱신, 실패 시 원복 + Toast
- **적용 상품 Badge**: 해당 사이즈가 사용되는 상품유형(디지털, 스티커, 실사 등)을 색상 Badge로 표시
- **비규격 Badge**: 비규격 사이즈는 "비규격" Badge 표시 (실사/아크릴용)
- **진입**: 사이드바 "상품관리 > 마스터 관리 > 사이즈" 클릭
- **이탈(등록)**: [+ 사이즈 등록] 클릭 -> SCR-PRD-002 모달 열림
- **이탈(수정)**: 사이즈명 클릭 -> SCR-PRD-002 모달 (수정 모드) 열림

---

## SCR-PRD-002: 사이즈 등록/수정 모달

### 1. 화면 개요

사이즈 등록/수정 전체 폼. 기본정보, 치수정보(재단/블리드/작업사이즈 자동계산), 인쇄정보(판걸이수/기준판형/출력용지규격), 비규격 섹션, MES 연동, 미리보기 포함.

### 2. ASCII 와이어프레임

```
+------------------------------------------------+
|  사이즈 등록  (수정 시: "사이즈 수정")          X  |
+------------------------------------------------+
|                                                  |
|  === 기본정보 ===                                |
|                                                  |
|  사이즈명 *                                      |
|  [                                           ]   |
|  예: A4, B5, 명함(90x50)                        |
|                                                  |
|  상품유형 * (다중선택)                            |
|  [v 디지털인쇄] [v 스티커] [ 실사] [ 아크릴]     |
|  [ 캘린더] [ 책자] [ 명함] [ 포토북]             |
|                                                  |
|  표시순서                                        |
|  [              1 ]                              |
|                                                  |
|  === 치수정보 ===                                |
|                                                  |
|  +---------------------+---------------------+  |
|  | 재단 가로(mm) *      | 재단 세로(mm) *      |  |
|  | [            210  ]  | [            297  ]  |  |
|  +---------------------+---------------------+  |
|                                                  |
|  블리드(mm) *                                    |
|  [ 2 v ]  (선택: 0 / 1 / 2 / 3 / 5 / 7 / 15)   |
|                                                  |
|  +---------------------+---------------------+  |
|  | 작업 가로(mm)        | 작업 세로(mm)        |  |
|  | [  214  ] (자동계산) | [  301  ] (자동계산) |  |
|  +---------------------+---------------------+  |
|  * 작업사이즈 = 재단사이즈 + (블리드 x 2)        |
|                                                  |
|  === 인쇄정보 ===                                |
|                                                  |
|  판걸이수 *                                      |
|  [              4 ]  (국4절/A3 기준)              |
|                                                  |
|  기준판형 *                                      |
|  [ A3 v ]  (선택: A3 / 3절)                      |
|                                                  |
|  출력용지규격 *                                   |
|  [ 316x467 v ]                                   |
|  (선택: 316x467 / 330x660 / 330x470 / 직접입력)  |
|                                                  |
|  === 비규격 (선택) ===                            |
|                                                  |
|  비규격 여부   [ OFF / ON ]                       |
|                                                  |
|  (ON 시 표시)                                    |
|  +---------------------+---------------------+  |
|  | 가로 최소(mm)        | 가로 최대(mm)        |  |
|  | [            200  ]  | [           1200  ]  |  |
|  +---------------------+---------------------+  |
|  +---------------------+---------------------+  |
|  | 세로 최소(mm)        | 세로 최대(mm)        |  |
|  | [            200  ]  | [           3000  ]  |  |
|  +---------------------+---------------------+  |
|                                                  |
|  === MES 연동 ===                                |
|                                                  |
|  +---------------------+---------------------+  |
|  | ITEM_CD             | 파일명약어           |  |
|  | [        001-0001 ] | [          엽서   ] |  |
|  +---------------------+---------------------+  |
|                                                  |
|  === 미리보기 ===                                |
|  +------------------------------------------+   |
|  |  +----------+                             |   |
|  |  |          |  210 x 297 mm (재단)        |   |
|  |  |   A4     |  214 x 301 mm (작업)        |   |
|  |  |          |  블리드: 2mm                |   |
|  |  +----------+  판걸이: 4 (A3)             |   |
|  +------------------------------------------+   |
|                                                  |
+------------------------------------------------+
|                 [취소]    [저장] <- primary       |
+------------------------------------------------+
```

### 3. 컴포넌트 트리

```
SizeFormDialog (open, onClose, editData?)
+-- DialogHeader
|   +-- DialogTitle (content: editData ? "사이즈 수정" : "사이즈 등록")
+-- DialogContent (maxWidth: 640, maxHeight: "80vh", overflow: "auto")
|   +-- Form (onSubmit: handleSubmit)
|   |   +-- SectionTitle (content: "기본정보")
|   |   +-- FormField (name: "name", required: true)
|   |   |   +-- Input (maxLength: 50, placeholder: "예: A4, B5, 명함(90x50)")
|   |   +-- FormField (name: "productTypeIds", required: true, label: "상품유형 (다중선택)")
|   |   |   +-- CheckboxGroup (options: productTypes, layout: "grid", columns: 4)
|   |   +-- FormField (name: "sortOrder")
|   |   |   +-- Input (type: "number", min: 0, defaultValue: 0)
|   |   |
|   |   +-- Separator
|   |   +-- SectionTitle (content: "치수정보")
|   |   +-- FormRow (columns: 2)
|   |   |   +-- FormField (name: "cutWidth", required: true, label: "재단 가로(mm)")
|   |   |   |   +-- Input (type: "number", min: 1, max: 99999, suffix: "mm")
|   |   |   +-- FormField (name: "cutHeight", required: true, label: "재단 세로(mm)")
|   |   |       +-- Input (type: "number", min: 1, max: 99999, suffix: "mm")
|   |   +-- FormField (name: "bleedMm", required: true, label: "블리드(mm)")
|   |   |   +-- Select (options: [0, 1, 2, 3, 5, 7, 15], suffix: "mm")
|   |   +-- FormRow (columns: 2)
|   |   |   +-- FormField (name: "workWidth", label: "작업 가로(mm)", readonly: true)
|   |   |   |   +-- Input (computed: cutWidth + bleedMm * 2, disabled: true)
|   |   |   +-- FormField (name: "workHeight", label: "작업 세로(mm)", readonly: true)
|   |   |       +-- Input (computed: cutHeight + bleedMm * 2, disabled: true)
|   |   +-- Text (content: "* 작업사이즈 = 재단사이즈 + (블리드 x 2)", color: "muted", fontSize: 12)
|   |   |
|   |   +-- Separator
|   |   +-- SectionTitle (content: "인쇄정보")
|   |   +-- FormField (name: "plateCount", required: true, label: "판걸이수")
|   |   |   +-- Input (type: "number", min: 1, max: 100)
|   |   +-- FormField (name: "basePlateType", required: true, label: "기준판형")
|   |   |   +-- Select (options: ["A3", "3절"])
|   |   +-- FormField (name: "outputPaperSpec", required: true, label: "출력용지규격")
|   |   |   +-- Select (options: ["316x467", "330x660", "330x470", "직접입력"])
|   |   +-- FormField (name: "outputPaperSpecCustom", visible: outputPaperSpec === "직접입력")
|   |   |   +-- Input (placeholder: "가로x세로 mm 입력")
|   |   |
|   |   +-- Separator
|   |   +-- SectionTitle (content: "비규격 (선택)")
|   |   +-- FormField (name: "isIrregular")
|   |   |   +-- Switch (label: "비규격 여부")
|   |   +-- ConditionalSection (visible: isIrregular)
|   |   |   +-- FormRow (columns: 2)
|   |   |   |   +-- FormField (name: "irregularWidthMin", label: "가로 최소(mm)")
|   |   |   |   |   +-- Input (type: "number", min: 1)
|   |   |   |   +-- FormField (name: "irregularWidthMax", label: "가로 최대(mm)")
|   |   |   |       +-- Input (type: "number", min: 1)
|   |   |   +-- FormRow (columns: 2)
|   |   |       +-- FormField (name: "irregularHeightMin", label: "세로 최소(mm)")
|   |   |       |   +-- Input (type: "number", min: 1)
|   |   |       +-- FormField (name: "irregularHeightMax", label: "세로 최대(mm)")
|   |   |           +-- Input (type: "number", min: 1)
|   |   |
|   |   +-- Separator
|   |   +-- SectionTitle (content: "MES 연동")
|   |   +-- FormRow (columns: 2)
|   |   |   +-- FormField (name: "mesItemCd", label: "ITEM_CD")
|   |   |   |   +-- Input (placeholder: "001-0001")
|   |   |   +-- FormField (name: "fileNameAbbr", label: "파일명약어")
|   |   |       +-- Input (placeholder: "엽서, 명함 등")
|   |   |
|   |   +-- Separator
|   |   +-- SizePreview (cutWidth, cutHeight, workWidth, workHeight, bleedMm, plateCount, basePlateType, name)
|   +-- FormMessage (errors)
+-- DialogFooter
|   +-- Button (variant: "outline", label: "취소", onClick: onClose)
|   +-- Button (variant: "primary", label: "저장", type: "submit", loading: isSubmitting)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| CheckboxGroup (상품유형) | productTypes | `GET /api/admin/cascading/product-types` | 모달 열림 시 |
| Form (등록) | formData | `POST /api/admin/option-master/sizes` | 저장 버튼 클릭 |
| Form (수정) | editData + formData | `PUT /api/admin/option-master/sizes/:id` | 저장 버튼 클릭 |
| SizePreview | cutWidth, cutHeight, bleedMm | 로컬 상태 (실시간 계산) | 치수 입력 변경 시 |

### 5. 인터랙션

- **초기 상태(등록)**: 모든 필드 빈 값, 블리드 기본값 2, 저장 버튼 비활성
- **초기 상태(수정)**: editData로 필드 프리필, 변경 시 저장 활성
- **작업사이즈 자동계산**: 재단사이즈 또는 블리드 변경 시 즉시 계산 반영
- **비규격 토글 ON**: 가로/세로 범위 입력 필드 표시, 재단사이즈 영역 비활성(비규격은 범위 입력)
- **출력용지규격 "직접입력"**: 추가 텍스트 입력 필드 표시
- **유효성 검증 실패**: 해당 필드 하단에 빨간 에러 메시지 표시
- **저장 중**: 저장 버튼 Spinner + disabled, 폼 필드 disabled
- **저장 성공**: 모달 닫힘, 부모(SCR-PRD-001) 목록 갱신, Toast "저장되었습니다"
- **진입(등록)**: SCR-PRD-001 [+ 사이즈 등록] 클릭
- **진입(수정)**: SCR-PRD-001 테이블 사이즈명 클릭
- **이탈(저장)**: 저장 성공 -> SCR-PRD-001 목록 갱신
- **이탈(취소)**: 취소/X 클릭 -> 변경사항 있으면 확인 다이얼로그

---

## SCR-PRD-003: 소재 관리 페이지

### 1. 화면 개요

소재 마스터 CRUD 테이블. v2.0에서 대분류/중분류, 가격/단가, 파일명약어, 코팅옵션, 적용 상품 Badge, 사이즈 매핑 수 컬럼 추가.

### 2. ASCII 와이어프레임

```
+------------------------------------------------------------------+
|  상품관리 > 마스터 관리 > 소재 관리                                 |
+------------------------------------------------------------------+
|                                                                    |
|  소재 관리                                        [+ 소재 등록]    |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  | 대분류: [전체         v]  상태: [전체 v]                      | |
|  | 검색어: [소재명 입력...                      ] [검색]         | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  전체 56건                             [선택 삭제] [엑셀 다운로드] |
|  +--+--+--------+--------+------+------+--------+------+------+  |
|  |[]|No|소재명   |대분류   |중분류|단가  |파일명  |적용  |상태  |  |
|  |  |  |        |        |      |(원)  |약어    |상품  |      |  |
|  +--+--+--------+--------+------+------+--------+------+------+  |
|  |[]| 1|인화지   |실사출력 |      |3,000 |인화지  |[실사]| 활성 |  |
|  |[]| 2|매트지   |실사출력 |      |2,500 |매트지  |[실사]| 활성 |  |
|  |[]| 3|린넨     |패브릭  |      |5,000 |린넨    |[실사]| 활성 |  |
|  |[]| 4|투명아크릴|아크릴  |3mm   |      |투명A   |[아크릴]|활성|  |
|  |[]| 5|화이트   |시트커팅 |      |      |W시트   |[실사]| 비활성|  |
|  +--+--+--------+--------+------+------+--------+------+------+  |
|  | [매핑 관리] <- 소재 행 클릭 시 Expandable Row                 |  |
|  |  +--------------------------------------------------------+  |  |
|  |  | 매핑된 사이즈: [A4] [A3] [B5]  코팅: 무광/유광  [수정]  |  |  |
|  |  +--------------------------------------------------------+  |  |
|  +--------------------------------------------------------------+ |
|  < 1  2  3 >                           [20건 v] / 페이지         |
+------------------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
MaterialMasterPage
+-- PageHeader
|   +-- Breadcrumb (items: ["상품관리", "마스터 관리", "소재 관리"])
|   +-- Button (variant: "primary", label: "+ 소재 등록", onClick: openCreateModal)
+-- FilterBar
|   +-- Select (label: "대분류", options: ["전체", "실사출력", "패브릭소재", "시트커팅", "아크릴"], placeholder: "전체")
|   +-- Select (label: "상태", options: ["전체", "활성", "비활성"])
|   +-- Input (placeholder: "소재명 입력...")
|   +-- Button (variant: "outline", label: "검색")
+-- TableToolbar
|   +-- Text (content: "전체 {totalCount}건")
|   +-- Button (variant: "destructive", label: "선택 삭제", disabled: !hasSelection)
|   +-- Button (variant: "outline", label: "엑셀 다운로드")
+-- DataTable (expandable: true)
|   +-- Checkbox (header: selectAll)
|   +-- Column (header: "No", accessor: "index", width: 60)
|   +-- Column (header: "소재명", accessor: "name", sortable: true, onClick: openEditModal)
|   +-- Column (header: "대분류", accessor: "majorCategory", sortable: true)
|   +-- Column (header: "중분류", accessor: "subCategory")
|   +-- Column (header: "단가(원)", accessor: "unitPrice", sortable: true, align: "right")
|   +-- Column (header: "파일명약어", accessor: "fileNameAbbr")
|   +-- Column (header: "코팅옵션", accessor: "coatingOptions", cell: BadgeList)
|   +-- Column (header: "적용 상품", accessor: "applicableProducts", cell: BadgeGroup)
|   +-- Column (header: "사이즈 매핑 수", accessor: "mappedSizeCount", align: "center")
|   +-- Column (header: "상태", accessor: "active", cell: StatusToggle)
|   +-- ExpandedRow
|       +-- SizeMappingPreview (sizes: mappedSizes, coatingOptions, onEdit: openMappingEditor)
+-- Pagination (page, limit: [20, 50, 100], totalPages)
+-- Dialog (ref: createEditModal -> SCR-PRD-004)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| DataTable | materialList | `GET /api/admin/option-master/materials` | 페이지 진입, 검색, 필터 변경 |
| ExpandedRow | mappedSizes | `GET /api/admin/option-master/materials/:id` (포함) | 행 확장 시 |
| StatusToggle | material.active | `PATCH /api/admin/option-master/materials/:id/active` | 토글 클릭 |

### 5. 인터랙션

- **초기 상태**: 전체 필터, 행 모두 접힌 상태
- **로딩 상태**: Skeleton 행 표시
- **행 확장**: 하단에 매핑된 사이즈 Badge + 코팅옵션 목록 노출
- **데이터 없음**: "등록된 소재가 없습니다." 안내
- **진입**: 사이드바 "상품관리 > 마스터 관리 > 소재" 클릭
- **이탈(등록)**: [+ 소재 등록] -> SCR-PRD-004 모달
- **이탈(수정)**: 소재명 클릭 -> SCR-PRD-004 모달 (수정 모드)

---

## SCR-PRD-004: 소재 등록/수정 모달

### 1. 화면 개요

소재 등록/수정 전체 폼. 기본 탭(소재명, 대분류, 중분류, 설명), 가격 탭(기본 단가, 코팅옵션+추가가격), MES 탭, 매핑 탭(적용 사이즈/상품 다중선택) 포함.

### 2. ASCII 와이어프레임

```
+------------------------------------------------+
|  소재 등록  (수정 시: "소재 수정")              X  |
+------------------------------------------------+
|                                                  |
|  [기본정보]  [가격]  [MES]  [매핑]  <- 탭         |
|  ----------------------------------------------- |
|                                                  |
|  === 기본정보 탭 ===                             |
|                                                  |
|  소재명 *                                        |
|  [                                           ]   |
|                                                  |
|  +---------------------+---------------------+  |
|  | 대분류 *             | 중분류              |  |
|  | [실사출력       v]   | [               v]  |  |
|  +---------------------+---------------------+  |
|  (대분류: 실사출력/패브릭소재/시트커팅/아크릴)     |
|                                                  |
|  설명                                            |
|  +------------------------------------------+   |
|  | (텍스트 영역, 3줄)                         |   |
|  +------------------------------------------+   |
|                                                  |
|  === 가격 탭 ===                                 |
|                                                  |
|  기본 단가(원)                                    |
|  [                                         ]     |
|                                                  |
|  코팅옵션 (다중선택 + 추가가격)                    |
|  +------------------------------------------+   |
|  | [v] 코팅없음         추가가격:   [    0 ] |   |
|  | [v] 무광코팅         추가가격:   [  500 ] |   |
|  | [v] 유광코팅         추가가격:   [  500 ] |   |
|  +------------------------------------------+   |
|                                                  |
|  === MES 탭 ===                                  |
|                                                  |
|  파일명약어                                       |
|  [                                           ]   |
|                                                  |
|  === 매핑 탭 ===                                 |
|                                                  |
|  적용 사이즈 (다중선택)               [팝업 선택] |
|  +------------------------------------------+   |
|  | [A4 x] [A3 x] [B5 x]                     |   |
|  +------------------------------------------+   |
|                                                  |
|  적용 상품 (다중선택)                             |
|  +------------------------------------------+   |
|  | [v] 디지털인쇄  [ ] 스티커  [v] 실사       |   |
|  | [ ] 아크릴     [ ] 캘린더  [ ] 책자       |   |
|  +------------------------------------------+   |
|                                                  |
+------------------------------------------------+
|                 [취소]    [저장] <- primary       |
+------------------------------------------------+
```

### 3. 컴포넌트 트리

```
MaterialFormDialog (open, onClose, editData?)
+-- DialogHeader
|   +-- DialogTitle (content: editData ? "소재 수정" : "소재 등록")
+-- DialogContent (maxWidth: 600, maxHeight: "80vh", overflow: "auto")
|   +-- Tabs (defaultValue: "basic")
|   |   +-- TabsList
|   |   |   +-- TabsTrigger (value: "basic", label: "기본정보")
|   |   |   +-- TabsTrigger (value: "price", label: "가격")
|   |   |   +-- TabsTrigger (value: "mes", label: "MES")
|   |   |   +-- TabsTrigger (value: "mapping", label: "매핑")
|   |   +-- TabsContent (value: "basic")
|   |   |   +-- FormField (name: "name", required: true, label: "소재명")
|   |   |   |   +-- Input (maxLength: 100)
|   |   |   +-- FormRow (columns: 2)
|   |   |   |   +-- FormField (name: "majorCategory", required: true, label: "대분류")
|   |   |   |   |   +-- Select (options: ["실사출력", "패브릭소재", "시트커팅", "아크릴"])
|   |   |   |   +-- FormField (name: "subCategory", label: "중분류")
|   |   |   |       +-- Select (options: dynamicByMajorCategory)
|   |   |   +-- FormField (name: "description", label: "설명")
|   |   |       +-- Textarea (rows: 3, maxLength: 500)
|   |   +-- TabsContent (value: "price")
|   |   |   +-- FormField (name: "unitPrice", label: "기본 단가(원)")
|   |   |   |   +-- Input (type: "number", min: 0, suffix: "원")
|   |   |   +-- CoatingOptionsEditor
|   |   |       +-- CheckboxWithPrice (label: "코팅없음", priceField: "coatingNonePrice")
|   |   |       +-- CheckboxWithPrice (label: "무광코팅", priceField: "coatingMattePrice")
|   |   |       +-- CheckboxWithPrice (label: "유광코팅", priceField: "coatingGlossPrice")
|   |   +-- TabsContent (value: "mes")
|   |   |   +-- FormField (name: "fileNameAbbr", label: "파일명약어")
|   |   |       +-- Input (placeholder: "MES 파일명 규칙")
|   |   +-- TabsContent (value: "mapping")
|   |       +-- FormField (label: "적용 사이즈")
|   |       |   +-- SizeSelectionTrigger (selectedSizes, onClick: openSizePopup)
|   |       |   +-- SelectedChips (items: selectedSizes, closable: true)
|   |       +-- FormField (label: "적용 상품")
|   |           +-- CheckboxGroup (options: productTypes, layout: "grid", columns: 3)
|   +-- FormMessage (errors)
+-- DialogFooter
|   +-- Button (variant: "outline", label: "취소")
|   +-- Button (variant: "primary", label: "저장", loading: isSubmitting)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| Select (대분류) | majorCategories | 하드코딩: ["실사출력", "패브릭소재", "시트커팅", "아크릴"] | - |
| Select (중분류) | subCategories | `GET /api/admin/option-master/material-categories?major=X` | 대분류 변경 시 |
| SizeSelectionTrigger | availableSizes | `GET /api/admin/option-master/sizes?active=true` | 팝업 열림 시 |
| Form (등록) | formData | `POST /api/admin/option-master/materials` | 저장 |
| Form (수정) | editData + formData | `PUT /api/admin/option-master/materials/:id` | 저장 |

### 5. 인터랙션

- **초기 상태(등록)**: 기본정보 탭 활성, 모든 필드 빈 값
- **초기 상태(수정)**: 기존 데이터 프리필, 매핑된 사이즈/상품 체크됨
- **대분류 변경 시**: 중분류 목록 갱신
- **코팅옵션**: 체크박스 선택 시 추가가격 입력 필드 활성화
- **저장 중/성공/실패**: SCR-PRD-002와 동일 패턴
- **진입(등록)**: SCR-PRD-003 [+ 소재 등록] 클릭
- **진입(수정)**: SCR-PRD-003 소재명 클릭 또는 확장 행 [수정]

---

## SCR-PRD-005: 용지 관리 페이지

### 1. 화면 개요

용지 마스터 CRUD 테이블. v2.0에서 대분류(7종), 전지규격, 연당가, 국4절 가격, 3절 가격, 종이사이즈, 파일명약어, 상품별 적용 매핑(15개 카테고리 아이콘/Badge) 컬럼 추가. 대폭 확장됨.

### 2. ASCII 와이어프레임

```
+------------------------------------------------------------------+
|  상품관리 > 마스터 관리 > 용지 관리                                 |
+------------------------------------------------------------------+
|                                                                    |
|  용지 관리                                        [+ 용지 등록]    |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  | 대분류: [전체           v]  평량: [전체     v]  상태: [전체 v]| |
|  | 검색어: [종이명 입력...                       ] [검색]        | |
|  +--------------------------------------------------------------+ |
|  (대분류: 디지털인쇄용지/3절/색지/PET/스티커용지/특수지/봉투)       |
|                                                                    |
|  전체 89건                             [선택 삭제] [엑셀 다운로드] |
|  +--+--+--------+--------+----+--------+------+------+------+    |
|  |[]|No|종이명   |대분류   |평량|전지규격|연당가 |국4절 |3절   |    |
|  |  |  |        |        |(g) |        |(원)  |가격  |가격  |    |
|  +--+--+--------+--------+----+--------+------+------+------+    |
|  |[]| 1|백색모조지|디지털인쇄|100|국전    |61,130| 30.73|      |    |
|  |[]| 2|아트지   |디지털인쇄|250|국전    |     | 93.30|      |    |
|  |[]| 3|몽블랑   |3절      |190|        |     |      |216.08|    |
|  |[]| 4|유포스티커|스티커용지| 80|        |     |  219 |      |    |
|  |[]| 5|투명 PET |PET      |260|        |     |1,100 |      |    |
|  +--+--+--------+--------+----+--------+------+------+------+    |
|                                                                    |
|  (추가 컬럼 - 수평 스크롤)                                         |
|  +--------+------+------------------------------------------+    |
|  |종이사이즈|파일명|상품별 적용 매핑 (15개 카테고리)            |    |
|  |        |약어  |엽P|엽S|접지|명함|전단|중내|중표|무내|무표|...|    |
|  +--------+------+--+--+----+----+----+----+----+----+----+    |
|  |316x467 |백모조 | o| o|  o |  o |  o |  o |  o |  o |  o |...|    |
|  |316x467 |아트   | o| o|  o |    |  o |  o |  o |  o |  o |...|    |
|  |330x660 |몽블랑 |  |  |    |    |    |    |    |    |    |...|    |
|  |330x470 |유포   |  |  |    |    |    |    |    |    |    |...|    |
|  |315x467 |PET투명|  |  |    |    |    |    |    |    |    |...|    |
|  +--------+------+--+--+----+----+----+----+----+----+----+    |
|  (15개: 프리미엄엽서/스탠다드엽서/접지카드/프리미엄명함/          |
|   소량전단지/중철내지/중철표지/무선내지/무선표지/트윈링내지/        |
|   트윈링표지/탁상캘/미니탁상캘/엽서캘/벽걸이캘)                   |
|                                                                    |
|  상태 열: [활성 토글]                                              |
|                                                                    |
|  < 1  2  3  4  5 >                     [20건 v] / 페이지          |
+------------------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
PaperMasterPage
+-- PageHeader
|   +-- Breadcrumb (items: ["상품관리", "마스터 관리", "용지 관리"])
|   +-- Button (variant: "primary", label: "+ 용지 등록", onClick: openCreateModal)
+-- FilterBar
|   +-- Select (label: "대분류", options: ["전체", "디지털인쇄용지", "3절", "색지", "PET", "스티커용지", "특수지", "봉투"])
|   +-- Select (label: "평량", options: ["전체", "100이하", "100~200", "200~300", "300이상"])
|   +-- Select (label: "상태", options: ["전체", "활성", "비활성"])
|   +-- Input (placeholder: "종이명 입력...")
|   +-- Button (variant: "outline", label: "검색")
+-- TableToolbar
|   +-- Text (content: "전체 {totalCount}건")
|   +-- Button (variant: "destructive", label: "선택 삭제", disabled: !hasSelection)
|   +-- Button (variant: "outline", label: "엑셀 다운로드")
+-- DataTable (horizontalScroll: true, stickyColumns: ["checkbox", "no", "name"])
|   +-- Checkbox (header: selectAll)
|   +-- Column (header: "No", width: 60)
|   +-- Column (header: "종이명", accessor: "name", sortable: true, onClick: openEditModal, sticky: true)
|   +-- Column (header: "대분류", accessor: "majorCategory", sortable: true)
|   +-- Column (header: "평량(g)", accessor: "weightGsm", sortable: true, align: "right")
|   +-- Column (header: "전지규격", accessor: "fullSheetSpec")
|   +-- Column (header: "연당가(원)", accessor: "reamPrice", sortable: true, align: "right", format: "number")
|   +-- Column (header: "국4절가격(원)", accessor: "quarterPrice", sortable: true, align: "right", format: "decimal")
|   +-- Column (header: "3절가격(원)", accessor: "thirdPrice", sortable: true, align: "right", format: "decimal")
|   +-- Column (header: "종이사이즈", accessor: "paperSize")
|   +-- Column (header: "파일명약어", accessor: "fileNameAbbr")
|   +-- ColumnGroup (header: "상품별 적용 매핑")
|   |   +-- Column (header: "엽P", accessor: "mapping.premiumPostcard", cell: MappingDot, width: 40)
|   |   +-- Column (header: "엽S", accessor: "mapping.standardPostcard", cell: MappingDot, width: 40)
|   |   +-- Column (header: "접지", accessor: "mapping.foldCard", cell: MappingDot, width: 40)
|   |   +-- Column (header: "명함", accessor: "mapping.premiumCard", cell: MappingDot, width: 40)
|   |   +-- Column (header: "전단", accessor: "mapping.flyer", cell: MappingDot, width: 40)
|   |   +-- Column (header: "중내", accessor: "mapping.saddleInner", cell: MappingDot, width: 40)
|   |   +-- Column (header: "중표", accessor: "mapping.saddleCover", cell: MappingDot, width: 40)
|   |   +-- Column (header: "무내", accessor: "mapping.perfectInner", cell: MappingDot, width: 40)
|   |   +-- Column (header: "무표", accessor: "mapping.perfectCover", cell: MappingDot, width: 40)
|   |   +-- Column (header: "링내", accessor: "mapping.twinRingInner", cell: MappingDot, width: 40)
|   |   +-- Column (header: "링표", accessor: "mapping.twinRingCover", cell: MappingDot, width: 40)
|   |   +-- Column (header: "탁캘", accessor: "mapping.deskCalendar", cell: MappingDot, width: 40)
|   |   +-- Column (header: "미캘", accessor: "mapping.miniDeskCalendar", cell: MappingDot, width: 40)
|   |   +-- Column (header: "엽캘", accessor: "mapping.postcardCalendar", cell: MappingDot, width: 40)
|   |   +-- Column (header: "벽캘", accessor: "mapping.wallCalendar", cell: MappingDot, width: 40)
|   +-- Column (header: "상태", accessor: "active", cell: StatusToggle)
+-- Pagination (page, limit: [20, 50, 100], totalPages)
+-- Dialog (ref: createEditModal -> SCR-PRD-006)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| DataTable | paperList | `GET /api/admin/option-master/papers` | 페이지 진입, 검색, 필터 변경 |
| StatusToggle | paper.active | `PATCH /api/admin/option-master/papers/:id/active` | 토글 클릭 |

### 5. 인터랙션

- **초기 상태**: 전체 필터, 검색어 없음
- **수평 스크롤**: 15개 매핑 컬럼 포함으로 테이블 너비 초과, 종이명 컬럼 sticky
- **MappingDot**: 적용 가능한 상품은 보라색 원(o) 표시, 미적용은 빈칸
- **필터 조합**: 복수 필터 AND 조건 적용, URL 파라미터 동기화
- **진입**: 사이드바 "상품관리 > 마스터 관리 > 용지" 클릭
- **이탈(등록)**: [+ 용지 등록] -> SCR-PRD-006 모달
- **이탈(수정)**: 종이명 클릭 -> SCR-PRD-006 모달 (수정 모드)

---

## SCR-PRD-006: 용지 등록/수정 모달

### 1. 화면 개요

용지 등록/수정 전체 폼. v2.0에서 대폭 확장: 기본 탭(종이명, 대분류 7종, 평량), 규격 탭(전지규격, 종이사이즈), 원가 탭(연당가, 국4절/3절 가격 자동계산), MES 탭, 상품별 적용 매핑 탭(15개 카테고리 체크박스 그리드), 구매정보 포함.

### 2. ASCII 와이어프레임

```
+----------------------------------------------------------+
|  용지 등록  (수정 시: "용지 수정")                        X  |
+----------------------------------------------------------+
|                                                            |
|  [기본] [규격] [원가] [MES] [상품매핑] [구매] <- 탭        |
|  -------------------------------------------------------- |
|                                                            |
|  === 기본 탭 ===                                          |
|                                                            |
|  종이명 *                                                  |
|  [                                                     ]   |
|                                                            |
|  대분류 *                                                  |
|  [디지털인쇄용지       v]                                   |
|  (선택: 디지털인쇄용지/3절/색지/PET/스티커용지/특수지/봉투)  |
|                                                            |
|  평량 *                                                    |
|  [            200  ] g                                     |
|                                                            |
|  === 규격 탭 ===                                          |
|                                                            |
|  전지규격 *                                                |
|  [국전(939x636)     v]                                     |
|  (선택: 국전(939x636) / 4x6(1091x788) / 기타+직접입력)     |
|                                                            |
|  종이사이즈(인쇄기 투입)                                    |
|  [              316x467  ]                                 |
|                                                            |
|  === 원가 탭 ===                                          |
|                                                            |
|  연당가(원)                                                |
|  [            61,130  ]                                    |
|                                                            |
|  +------------------------+------------------------+      |
|  | 국4절 가격(원)          | 3절 가격(원)            |      |
|  | [  30.73  ] (자동계산)  | [  89.54  ] (자동계산)  |      |
|  +------------------------+------------------------+      |
|  * 연당가 기반 자동 환산                                    |
|                                                            |
|  === MES 탭 ===                                           |
|                                                            |
|  파일명약어                                                 |
|  [                                                     ]   |
|                                                            |
|  === 상품매핑 탭 ===                                       |
|                                                            |
|  상품별 적용 (15개 카테고리)                                |
|  +------------------------------------------------------+ |
|  | [v] 프리미엄엽서    [v] 스탠다드엽서    [v] 접지카드  | |
|  | [v] 프리미엄명함    [v] 소량전단지      [ ] 중철내지  | |
|  | [ ] 중철표지       [ ] 무선내지        [ ] 무선표지  | |
|  | [ ] 트윈링내지     [ ] 트윈링표지      [ ] 탁상캘    | |
|  | [ ] 미니탁상캘     [ ] 엽서캘         [ ] 벽걸이캘  | |
|  +------------------------------------------------------+ |
|  [전체선택] [전체해제]                                      |
|                                                            |
|  === 구매 탭 ===                                          |
|                                                            |
|  메모 (구매정보/특이사항)                                    |
|  +--------------------------------------------------+     |
|  | (텍스트 영역, 3줄)                                 |     |
|  +--------------------------------------------------+     |
|                                                            |
+----------------------------------------------------------+
|                       [취소]    [저장] <- primary           |
+----------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
PaperFormDialog (open, onClose, editData?)
+-- DialogHeader
|   +-- DialogTitle (content: editData ? "용지 수정" : "용지 등록")
+-- DialogContent (maxWidth: 700, maxHeight: "80vh", overflow: "auto")
|   +-- Tabs (defaultValue: "basic")
|   |   +-- TabsList
|   |   |   +-- TabsTrigger (value: "basic", label: "기본")
|   |   |   +-- TabsTrigger (value: "spec", label: "규격")
|   |   |   +-- TabsTrigger (value: "cost", label: "원가")
|   |   |   +-- TabsTrigger (value: "mes", label: "MES")
|   |   |   +-- TabsTrigger (value: "productMapping", label: "상품매핑")
|   |   |   +-- TabsTrigger (value: "purchase", label: "구매")
|   |   +-- TabsContent (value: "basic")
|   |   |   +-- FormField (name: "name", required: true, label: "종이명")
|   |   |   |   +-- Input (maxLength: 100)
|   |   |   +-- FormField (name: "majorCategory", required: true, label: "대분류")
|   |   |   |   +-- Select (options: ["디지털인쇄용지", "3절", "색지", "PET", "스티커용지", "특수지", "봉투"])
|   |   |   +-- FormField (name: "weightGsm", required: true, label: "평량(g)")
|   |   |       +-- Input (type: "number", min: 1, max: 9999, suffix: "g")
|   |   +-- TabsContent (value: "spec")
|   |   |   +-- FormField (name: "fullSheetSpec", required: true, label: "전지규격")
|   |   |   |   +-- Select (options: ["국전(939x636)", "4x6(1091x788)", "기타"])
|   |   |   +-- FormField (name: "fullSheetSpecCustom", visible: fullSheetSpec === "기타")
|   |   |   |   +-- Input (placeholder: "가로x세로 mm")
|   |   |   +-- FormField (name: "paperSize", label: "종이사이즈(인쇄기 투입)")
|   |   |       +-- Input (placeholder: "316x467")
|   |   +-- TabsContent (value: "cost")
|   |   |   +-- FormField (name: "reamPrice", label: "연당가(원)")
|   |   |   |   +-- Input (type: "number", min: 0, suffix: "원", format: "comma")
|   |   |   +-- FormRow (columns: 2)
|   |   |   |   +-- FormField (name: "quarterPrice", label: "국4절 가격(원)", readonly: true)
|   |   |   |   |   +-- Input (computed: autoCalcFromReam, disabled: true, format: "decimal")
|   |   |   |   +-- FormField (name: "thirdPrice", label: "3절 가격(원)", readonly: true)
|   |   |   |       +-- Input (computed: autoCalcFromReam, disabled: true, format: "decimal")
|   |   |   +-- Text (content: "* 연당가 기반 자동 환산", color: "muted", fontSize: 12)
|   |   +-- TabsContent (value: "mes")
|   |   |   +-- FormField (name: "fileNameAbbr", label: "파일명약어")
|   |   |       +-- Input (placeholder: "MES 파일명 규칙")
|   |   +-- TabsContent (value: "productMapping")
|   |   |   +-- Text (content: "상품별 적용 (15개 카테고리)", fontWeight: 600)
|   |   |   +-- CheckboxGrid (columns: 3)
|   |   |   |   +-- Checkbox (name: "mapping.premiumPostcard", label: "프리미엄엽서")
|   |   |   |   +-- Checkbox (name: "mapping.standardPostcard", label: "스탠다드엽서")
|   |   |   |   +-- Checkbox (name: "mapping.foldCard", label: "접지카드")
|   |   |   |   +-- Checkbox (name: "mapping.premiumCard", label: "프리미엄명함")
|   |   |   |   +-- Checkbox (name: "mapping.flyer", label: "소량전단지")
|   |   |   |   +-- Checkbox (name: "mapping.saddleInner", label: "중철내지")
|   |   |   |   +-- Checkbox (name: "mapping.saddleCover", label: "중철표지")
|   |   |   |   +-- Checkbox (name: "mapping.perfectInner", label: "무선내지")
|   |   |   |   +-- Checkbox (name: "mapping.perfectCover", label: "무선표지")
|   |   |   |   +-- Checkbox (name: "mapping.twinRingInner", label: "트윈링내지")
|   |   |   |   +-- Checkbox (name: "mapping.twinRingCover", label: "트윈링표지")
|   |   |   |   +-- Checkbox (name: "mapping.deskCalendar", label: "탁상캘")
|   |   |   |   +-- Checkbox (name: "mapping.miniDeskCalendar", label: "미니탁상캘")
|   |   |   |   +-- Checkbox (name: "mapping.postcardCalendar", label: "엽서캘")
|   |   |   |   +-- Checkbox (name: "mapping.wallCalendar", label: "벽걸이캘")
|   |   |   +-- ButtonGroup
|   |   |       +-- Button (variant: "ghost", size: "sm", label: "전체선택")
|   |   |       +-- Button (variant: "ghost", size: "sm", label: "전체해제")
|   |   +-- TabsContent (value: "purchase")
|   |       +-- FormField (name: "purchaseMemo", label: "메모 (구매정보/특이사항)")
|   |           +-- Textarea (rows: 3, maxLength: 1000)
|   +-- FormMessage (errors)
+-- DialogFooter
|   +-- Button (variant: "outline", label: "취소")
|   +-- Button (variant: "primary", label: "저장", loading: isSubmitting)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| Form (등록) | formData | `POST /api/admin/option-master/papers` | 저장 |
| Form (수정) | editData + formData | `PUT /api/admin/option-master/papers/:id` | 저장 |

### 5. 인터랙션

- **초기 상태(등록)**: 기본 탭 활성, 모든 필드 빈 값
- **초기 상태(수정)**: 기존 데이터 프리필, 매핑된 상품 카테고리 체크됨
- **국4절/3절 가격 자동계산**: 연당가 입력 시 자동 환산 표시 (비활성 필드)
- **전지규격 "기타"**: 직접 입력 필드 표시
- **상품매핑 전체선택/해제**: 15개 체크박스 일괄 토글
- **저장 중/성공/실패**: SCR-PRD-002와 동일 패턴
- **진입(등록)**: SCR-PRD-005 [+ 용지 등록] 클릭
- **진입(수정)**: SCR-PRD-005 종이명 클릭

---

## SCR-PRD-007: 가격 관리 마스터

### 1. 화면 개요

14종 가격 유형을 관리하는 마스터 페이지. v2.0에서 8종 -> 14종으로 확장. 가격 유형별 탭/카드 그리드, 각 유형별 매트릭스 크기/마지막 수정일/수정자, 가격 유형별 팝업 진입 버튼.

### 2. ASCII 와이어프레임

```
+------------------------------------------------------------------+
|  상품관리 > 마스터 관리 > 가격 관리                                 |
+------------------------------------------------------------------+
|                                                                    |
|  가격 관리 (마스터)                          [엑셀 일괄 업로드]    |
|                                                                    |
|  14종 가격 유형                                                    |
|  +--------------------------------------------------------------+ |
|  |  +----------+  +----------+  +----------+  +----------+      | |
|  |  |디지털    |  |미싱/오시 |  |접지      |  |가변      |      | |
|  |  |출력비    |  |          |  |          |  |          |      | |
|  |  |23x11    |  |23x4     |  |23x7     |  |23x3     |      | |
|  |  |03/19수정|  |03/18수정|  |03/18수정|  |03/15수정|      | |
|  |  |  [편집] |  |  [편집] |  |  [편집] |  |  [편집] |      | |
|  |  +----------+  +----------+  +----------+  +----------+      | |
|  |                                                              | |
|  |  +----------+  +----------+  +----------+  +----------+      | |
|  |  |박-동판비 |  |박-일반  |  |명함박    |  |제본비    |      | |
|  |  |          |  |/특수    |  |          |  |          |      | |
|  |  |15x15    |  |4x64    |  |4x15    |  |23x8     |      | |
|  |  |03/19수정|  |03/18수정|  |03/18수정|  |03/15수정|      | |
|  |  |  [편집] |  |  [편집] |  |  [편집] |  |  [편집] |      | |
|  |  +----------+  +----------+  +----------+  +----------+      | |
|  |                                                              | |
|  |  +----------+  +----------+  +----------+  +----------+      | |
|  |  |스티커    |  |아크릴    |  |실사      |  |명함      |      | |
|  |  |가공비    |  |단가      |  |단가      |  |단가      |      | |
|  |  |30x6    |  |9x9     |  |면적구간  |  |11x2    |      | |
|  |  |03/19수정|  |03/18수정|  |03/18수정|  |03/15수정|      | |
|  |  |  [편집] |  |  [편집] |  |  [편집] |  |  [편집] |      | |
|  |  +----------+  +----------+  +----------+  +----------+      | |
|  |                                                              | |
|  |  +----------+  +----------+                                  | |
|  |  |옵션결합  |  |수량     |                                  | |
|  |  |단가      |  |할인율   |                                  | |
|  |  |다차원    |  |구간별%  |                                  | |
|  |  |03/19수정|  |03/15수정|                                  | |
|  |  |  [편집] |  |  [편집] |                                  | |
|  |  +----------+  +----------+                                  | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  변경 이력                                       [더보기 v]  | |
|  +--------------------------------------------------------------+ |
|  |  2026-03-19 14:30  홍길동  디지털출력비 가격 수정              | |
|  |  2026-03-18 10:15  홍길동  제본비 신규 등록                   | |
|  |  2026-03-15 09:00  관리자  엑셀 일괄 업로드 (45건)            | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
PriceMasterPage
+-- PageHeader
|   +-- Breadcrumb (items: ["상품관리", "마스터 관리", "가격 관리"])
|   +-- Button (variant: "outline", label: "엑셀 일괄 업로드", onClick: openBulkUploadModal)
+-- SectionTitle (content: "14종 가격 유형")
+-- PriceTypeGrid (columns: 4, gap: 16)
|   +-- PriceTypeCard (type: "digitalOutput", label: "디지털출력비")
|   |   +-- Text (content: "수량 x 인쇄방식 매트릭스")
|   |   +-- Text (content: "23단계 x 11방식", color: "muted")
|   |   +-- Text (content: "최종수정: 03/19 홍길동", fontSize: 12)
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "postMissingOsi", label: "후가공-미싱/오시")
|   |   +-- Text (content: "수량 x 줄수 매트릭스")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "postFold", label: "후가공-접지")
|   |   +-- Text (content: "수량 x 접지방식 매트릭스")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "postVariable", label: "후가공-가변")
|   |   +-- Text (content: "수량 x 개수 매트릭스")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "foilPlate", label: "박-동판비")
|   |   +-- Text (content: "가로 x 세로 면적형")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-016)
|   +-- PriceTypeCard (type: "foilGeneral", label: "박-일반/특수")
|   |   +-- Text (content: "수량 x 크기코드 64종")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "cardFoil", label: "명함박")
|   |   +-- Text (content: "수량 x 크기코드 15종")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "binding", label: "제본비")
|   |   +-- Text (content: "수량 x 제본방식 매트릭스")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "stickerProcess", label: "스티커 가공비")
|   |   +-- Text (content: "수량 x 사이즈/모양 매트릭스")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "acrylic", label: "아크릴 단가")
|   |   +-- Text (content: "가로 x 세로 면적형")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-016)
|   +-- PriceTypeCard (type: "largeFormat", label: "실사 단가")
|   |   +-- Text (content: "면적 구간 단가")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-016)
|   +-- PriceTypeCard (type: "cardPrice", label: "명함 단가")
|   |   +-- Text (content: "상품 x 용지 x 인쇄면 고정단가")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-015)
|   +-- PriceTypeCard (type: "optionCombined", label: "옵션결합 단가")
|   |   +-- Text (content: "다차원 매트릭스")
|   |   +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-014)
|   +-- PriceTypeCard (type: "volumeDiscount", label: "수량할인율")
|       +-- Text (content: "구간별 할인율(%)")
|       +-- Button (variant: "outline", size: "sm", label: "편집", onClick: -> SCR-PRD-017)
+-- ChangeHistory
|   +-- Collapsible (defaultOpen: true)
|   |   +-- HistoryList (items: recentChanges, limit: 5)
|   +-- Button (variant: "ghost", label: "더보기")
+-- Dialog (ref: bulkUploadModal -> SCR-PRD-008)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| PriceTypeGrid | priceTypeSummary | `GET /api/admin/option-master/prices/summary` | 페이지 진입 |
| ChangeHistory | recentChanges | `GET /api/admin/option-master/prices/history` | 페이지 진입 |

### 5. 인터랙션

- **초기 상태**: 14종 가격 유형 카드 그리드 표시, 각 카드에 매트릭스 크기/수정일 표시
- **편집 클릭**: 해당 가격 유형에 맞는 팝업 열림 (매트릭스형/고정단가형/면적형/수량할인형)
  - 매트릭스형(SCR-PRD-014): 디지털출력비, 미싱/오시, 접지, 가변, 박-일반/특수, 명함박, 제본비, 스티커 가공비, 옵션결합
  - 고정단가형(SCR-PRD-015): 명함 단가
  - 면적형(SCR-PRD-016): 박-동판비, 아크릴 단가, 실사 단가
  - 수량할인형(SCR-PRD-017): 수량할인율
- **진입**: 사이드바 "상품관리 > 마스터 관리 > 가격" 클릭
- **이탈(편집)**: [편집] 클릭 -> 해당 가격코드 팝업 (SCR-PRD-014~017)
- **이탈(업로드)**: [엑셀 일괄 업로드] -> SCR-PRD-008 모달

---

## SCR-PRD-008: 엑셀 일괄 업로드 모달

### 1. 화면 개요

마스터 데이터 엑셀 업로드. v2.0에서 14종 가격 유형 선택 추가.

### 2. ASCII 와이어프레임

```
+----------------------------------------------------------+
|  마스터 데이터 엑셀 일괄 업로드                            X  |
+----------------------------------------------------------+
|                                                            |
|  Step 1: 업로드 대상 선택                                   |
|  +------------------------------------------------------+ |
|  | 업로드 유형: [사이즈 마스터   v]                       | |
|  | (선택: 사이즈 마스터/소재 마스터/용지 마스터/            | |
|  |  가격-디지털출력비/가격-미싱오시/가격-접지/가격-가변/     | |
|  |  가격-박동판비/가격-박일반특수/가격-명함박/가격-제본비/   | |
|  |  가격-스티커가공비/가격-아크릴단가/가격-실사단가/         | |
|  |  가격-명함단가/가격-옵션결합단가/가격-수량할인율)         | |
|  +------------------------------------------------------+ |
|                                                            |
|  Step 2: 파일 선택                                         |
|  +------------------------------------------------------+ |
|  |                                                      | |
|  |      엑셀 파일을 드래그하거나 클릭하여 업로드           | |
|  |      지원 형식: .xlsx, .xls (최대 10MB)               | |
|  |                                                      | |
|  |      [파일 선택]                                      | |
|  +------------------------------------------------------+ |
|                                                            |
|  [양식 다운로드]  <- 선택한 유형별 템플릿                    |
|                                                            |
|  ------------- (파일 선택 후) ---------------              |
|                                                            |
|  Step 3: 검증 결과                                         |
|  +------------------------------------------------------+ |
|  |  [유효: 142건]    [오류: 3건]    [경고: 5건]           | |
|  +------------------------------------------------------+ |
|  |  오류 항목:                                           | |
|  |  +---+--------+----------------------------+         | |
|  |  | 행| 필드    | 오류 내용                    |         | |
|  |  +---+--------+----------------------------+         | |
|  |  | 15| 가로mm  | 숫자가 아닌 값: "이백"        |         | |
|  |  | 28| 코드    | 중복 코드: "A4_DUP"          |         | |
|  |  +---+--------+----------------------------+         | |
|  +------------------------------------------------------+ |
|                                                            |
|  Step 4: 미리보기 (유효 데이터 처음 10건)                    |
|  +------------------------------------------------------+ |
|  |  (동적 테이블 - 유형별 컬럼 다름)                      | |
|  |  총 142건 (처음 10건만 표시)                           | |
|  +------------------------------------------------------+ |
|                                                            |
+----------------------------------------------------------+
|   [취소]    [오류만 재다운로드]    [142건 업로드] <- primary  |
+----------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
BulkUploadDialog (open, onClose)
+-- DialogHeader
|   +-- DialogTitle (content: "마스터 데이터 엑셀 일괄 업로드")
+-- DialogContent (maxWidth: 720, maxHeight: "85vh", overflow: "auto")
|   +-- Step1_TypeSelect
|   |   +-- FormField (name: "uploadType", required: true, label: "업로드 유형")
|   |       +-- Select (options: uploadTypeOptions, grouped: true)
|   |           +-- OptGroup (label: "마스터")
|   |           |   +-- Option (value: "size", label: "사이즈 마스터")
|   |           |   +-- Option (value: "material", label: "소재 마스터")
|   |           |   +-- Option (value: "paper", label: "용지 마스터")
|   |           +-- OptGroup (label: "가격 (14종)")
|   |               +-- Option (value: "price-digitalOutput", label: "디지털출력비")
|   |               +-- Option (value: "price-postMissingOsi", label: "미싱/오시")
|   |               +-- ... (나머지 12종)
|   +-- Step2_FileSelect (visible: uploadType selected)
|   |   +-- DropZone (accept: [".xlsx", ".xls"], maxSize: 10MB)
|   |   +-- Button (variant: "link", label: "양식 다운로드", onClick: downloadTemplate)
|   +-- Step3_ValidationResult (visible: fileUploaded)
|   |   +-- ValidationSummary
|   |   |   +-- Badge (variant: "success", content: "유효: {validCount}건")
|   |   |   +-- Badge (variant: "destructive", content: "오류: {errorCount}건")
|   |   |   +-- Badge (variant: "warning", content: "경고: {warningCount}건")
|   |   +-- Collapsible (title: "오류 항목", defaultOpen: true)
|   |   |   +-- DataTable (columns: [행, 필드, 오류 내용], data: errors)
|   |   +-- Collapsible (title: "경고 항목", defaultOpen: false)
|   |       +-- DataTable (columns: [행, 필드, 경고 내용], data: warnings)
|   +-- Step4_Preview (visible: validationComplete)
|       +-- DataTable (columns: dynamic by uploadType, data: validItems.slice(0, 10))
|       +-- Text (content: "총 {validCount}건 (처음 10건만 표시)")
+-- DialogFooter
|   +-- Button (variant: "outline", label: "취소")
|   +-- Button (variant: "outline", label: "오류만 재다운로드", visible: errorCount > 0)
|   +-- Button (variant: "primary", label: "{validCount}건 업로드", disabled: validCount === 0)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| DropZone | selectedFile | 로컬 상태 | 파일 드래그/선택 |
| ValidationResult | validationResult | `POST /api/admin/option-master/bulk-import` (validate=true, type=X) | 파일 업로드 후 자동 |
| Preview | validItems | validationResult.validItems | 검증 완료 후 |
| 업로드 실행 | - | `POST /api/admin/option-master/bulk-import` (validate=false, type=X) | 업로드 버튼 클릭 |
| 양식 다운로드 | - | `GET /api/admin/option-master/bulk-import/template?type=X` | 클릭 |

### 5. 인터랙션

- **초기 상태**: Step 1 업로드 유형 선택만 표시
- **유형 선택 후**: Step 2 파일 업로드 영역 표시, 양식 다운로드 버튼 해당 유형 템플릿 제공
- **파일 선택 후**: 자동 검증 시작, Progress bar 표시
- **검증 완료(오류 있음)**: 오류/경고 테이블 표시, 업로드 버튼에 유효 건수만 표시
- **검증 완료(오류 없음)**: 미리보기만 표시, 업로드 버튼 활성
- **업로드 성공**: Toast "{N}건이 업로드되었습니다", 모달 닫힘, 부모 목록 갱신
- **진입**: SCR-PRD-007 [엑셀 일괄 업로드] 클릭

---

# 모듈 2: 종속옵션 엔진

---

## SCR-PRD-009: 사이즈 선택 팝업

### 1. 화면 개요

상품유형별 사이즈 목록 다중선택 팝업. v2.0에서 판걸이수, 기준판형 정보 표시 추가.

### 2. ASCII 와이어프레임

```
+----------------------------------------------------+
|  사이즈 선택                                       X  |
+----------------------------------------------------+
|                                                      |
|  상품유형: 디지털 인쇄  (읽기 전용, 부모에서 결정)     |
|                                                      |
|  [사이즈명으로 검색...]                               |
|                                                      |
|  +--------------------------------------------------+|
|  |                                                  ||
|  |  [v] A4       210x297mm  판걸이:4  A3  순서:1    ||
|  |  [ ] A5       148x210mm  판걸이:8  A3  순서:2    ||
|  |  [v] A3       297x420mm  판걸이:2  A3  순서:3    ||
|  |  [ ] B5       176x250mm  판걸이:6  A3  순서:4    ||
|  |  [v] B4       257x364mm  판걸이:2  3절 순서:5    ||
|  |  [ ] 명함     90x50mm   판걸이:15 A3  순서:6    ||
|  |  [ ] 엽서     100x148mm  판걸이:8  A3  순서:7    ||
|  |                                                  ||
|  |  (활성 항목만 표시, 비활성 항목 숨김)               ||
|  +--------------------------------------------------+|
|                                                      |
|  선택됨: 3개 (A4, A3, B4)                            |
|  [A4  x] [A3  x] [B4  x]                            |
|                                                      |
+----------------------------------------------------+
|       [전체해제]    [취소]    [확인] <- primary       |
+----------------------------------------------------+
```

### 3. 컴포넌트 트리

```
SizeSelectionPopup (open, onClose, onConfirm, productTypeId, preSelected?)
+-- DialogHeader
|   +-- DialogTitle (content: "사이즈 선택")
+-- DialogContent (maxWidth: 600, maxHeight: "70vh")
|   +-- Badge (variant: "secondary", content: "상품유형: {productTypeName}")
|   +-- Input (placeholder: "사이즈명으로 검색...", debounce: 300, icon: "search")
|   +-- ScrollArea (maxHeight: 360)
|   |   +-- CheckboxGroup
|   |       +-- CheckboxItem (for each size)
|   |           +-- Checkbox (checked: isSelected)
|   |           +-- Text (content: "{name}", fontWeight: 600)
|   |           +-- Text (content: "{cutWidth}x{cutHeight}mm", color: "muted")
|   |           +-- Text (content: "판걸이:{plateCount}", color: "muted", fontSize: 12)
|   |           +-- Badge (variant: "outline", content: "{basePlateType}", size: "sm")
|   |           +-- Text (content: "순서:{sortOrder}", color: "muted", fontSize: 12)
|   +-- Separator
|   +-- Text (content: "선택됨: {selectedCount}개 ({selectedNames})")
|   +-- SelectedChips
|       +-- Badge (for each selected, closable: true, onClose: deselect)
+-- DialogFooter
|   +-- Button (variant: "ghost", label: "전체해제", onClick: clearAll)
|   +-- Button (variant: "outline", label: "취소", onClick: onClose)
|   +-- Button (variant: "primary", label: "확인", onClick: handleConfirm)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| CheckboxGroup | sizeList | `GET /api/admin/cascading/sizes?productTypeId=N` | 팝업 열림 시 |
| SelectedChips | selectedSizes | 로컬 상태 | 체크박스 변경 시 |

### 5. 인터랙션

- **초기 상태**: preSelected가 있으면 해당 항목 체크됨
- **검색**: 일치하는 항목만 필터 표시
- **선택 변경**: 하단 선택 카운트 + Badge 실시간 갱신
- **판걸이수/기준판형**: 각 항목 우측에 인쇄정보 표시
- **진입**: SCR-PRD-022(인쇄상품 옵션설정 탭) 사이즈 선택 영역 클릭
- **이탈(확인)**: 선택 결과 -> 부모 폼 반영, 종속 체인 갱신 (SCR-PRD-012)

---

## SCR-PRD-010: 소재 선택 팝업

### 1. 화면 개요

선택된 사이즈 기반 필터링, 소재 설명 툴팁, 다중선택. v2.0에서 대분류/중분류 필터, 단가 표시 추가.

### 2. ASCII 와이어프레임

```
+----------------------------------------------------+
|  소재 선택                                         X  |
+----------------------------------------------------+
|                                                      |
|  상품유형: 디지털 인쇄  (읽기 전용)                    |
|  선택된 사이즈 기반 필터링:                            |
|  [A4] [A3] [B4] <- 상위 선택 요약 표시                |
|                                                      |
|  대분류: [전체      v]  [소재명으로 검색...]           |
|                                                      |
|  +--------------------------------------------------+|
|  |                                                  ||
|  |  [v] 인화지                          3,000원/m2  ||
|  |      대분류: 실사출력                             ||
|  |      양면 고급 광택 인화지                        ||
|  |      적용 사이즈: A4, A3, A5, B4, B5             ||
|  |      -----------------------------------------   ||
|  |  [ ] 매트지                          2,500원/m2  ||
|  |      대분류: 실사출력                             ||
|  |      비광택 무반사 매트지                         ||
|  |      적용 사이즈: A4, A3, B4                     ||
|  |      -----------------------------------------   ||
|  |  [v] 투명아크릴 3mm                              ||
|  |      대분류: 아크릴 | 중분류: 3mm                 ||
|  |      적용 사이즈: 20x20~120x180                  ||
|  |                                                  ||
|  +--------------------------------------------------+|
|                                                      |
|  선택됨: 2개 (인화지, 투명아크릴 3mm)                 |
|  [인화지  x] [투명아크릴 3mm  x]                     |
|                                                      |
+----------------------------------------------------+
|       [전체해제]    [취소]    [확인] <- primary       |
+----------------------------------------------------+
```

### 3. 컴포넌트 트리

```
MaterialSelectionPopup (open, onClose, onConfirm, productTypeId, selectedSizeIds, preSelected?)
+-- DialogHeader
|   +-- DialogTitle (content: "소재 선택")
+-- DialogContent (maxWidth: 600, maxHeight: "70vh")
|   +-- ContextInfo
|   |   +-- Badge (variant: "secondary", content: "상품유형: {productTypeName}")
|   |   +-- Text (content: "선택된 사이즈 기반 필터링:")
|   |   +-- BadgeGroup (items: selectedSizeNames, variant: "outline")
|   +-- FilterRow
|   |   +-- Select (label: "대분류", options: ["전체", "실사출력", "패브릭소재", "시트커팅", "아크릴"])
|   |   +-- Input (placeholder: "소재명으로 검색...", debounce: 300)
|   +-- ScrollArea (maxHeight: 400)
|   |   +-- CheckboxGroup
|   |       +-- MaterialCheckboxItem (for each material)
|   |           +-- Checkbox (checked: isSelected)
|   |           +-- FlexRow
|   |           |   +-- Text (content: "{name}", fontWeight: 600)
|   |           |   +-- Text (content: "{unitPrice}원/m2", color: "primary", align: "right")
|   |           +-- Text (content: "대분류: {majorCategory}", color: "muted", fontSize: 13)
|   |           +-- Text (content: "{description}", color: "muted", fontSize: 13)
|   |           +-- Text (content: "적용 사이즈: {applicableSizes}", fontSize: 12, color: "muted")
|   +-- Separator
|   +-- Text (content: "선택됨: {selectedCount}개")
|   +-- SelectedChips (items: selectedMaterials, closable: true)
+-- DialogFooter
|   +-- Button (variant: "ghost", label: "전체해제")
|   +-- Button (variant: "outline", label: "취소")
|   +-- Button (variant: "primary", label: "확인")
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| CheckboxGroup | materialList | `GET /api/admin/cascading/materials?sizeId=N` | 팝업 열림 시 |
| Select (대분류) | majorCategories | 하드코딩 | - |
| SelectedChips | selectedMaterials | 로컬 상태 | 체크박스 변경 시 |

### 5. 인터랙션

- **초기 상태**: 선택된 사이즈 기반으로 필터링된 소재만 표시, preSelected 체크
- **대분류 필터**: 클라이언트 필터링으로 해당 대분류 소재만 표시
- **단가 표시**: 각 항목 우측에 기본 단가 표시 (설정된 경우)
- **사이즈 미선택 시**: "먼저 사이즈를 선택해 주세요." 안내
- **진입**: SCR-PRD-022(옵션설정 탭) 소재 선택 영역 클릭
- **선행조건**: SCR-PRD-009에서 사이즈가 1개 이상 선택되어야 활성화

---

## SCR-PRD-011: 용지 선택 팝업

### 1. 화면 개요

선택된 사이즈 기반 필터링, 평량/코팅 표시, 다중선택. v2.0에서 15개 카테고리 매핑 필터, 연당가/국4절가격 표시 추가.

### 2. ASCII 와이어프레임

```
+----------------------------------------------------+
|  용지 선택                                         X  |
+----------------------------------------------------+
|                                                      |
|  상품유형: 디지털 인쇄  (읽기 전용)                    |
|  선택된 사이즈 기반 필터링:                            |
|  [A4] [A3] [B4]                                      |
|                                                      |
|  상품 카테고리 필터: [프리미엄엽서   v]                 |
|  (15개 카테고리 중 선택 -> 해당 카테고리 적용 용지만)    |
|                                                      |
|  대분류: [전체 v]  [용지명으로 검색...]                |
|                                                      |
|  +--------------------------------------------------+|
|  |                                                  ||
|  |  [v] 스노우지 200g                    국4절:93.30||
|  |      대분류: 디지털인쇄용지 | 전지: 국전          ||
|  |      평량: 200g  연당가: 185,930원               ||
|  |      적용: [엽P][엽S][접지][명함][전단]...        ||
|  |      적용 사이즈: A4, A3, A5, B4, B5             ||
|  |      -----------------------------------------   ||
|  |  [ ] 아트지 250g                      국4절:93.30||
|  |      대분류: 디지털인쇄용지 | 전지: 국전          ||
|  |      평량: 250g  연당가: 185,930원               ||
|  |      적용: [엽P][엽S][접지][전단]                 ||
|  |      적용 사이즈: A4, A3, B4                     ||
|  |      -----------------------------------------   ||
|  |  [v] 모조지 150g                      국4절:30.73||
|  |      대분류: 디지털인쇄용지 | 전지: 국전          ||
|  |      평량: 150g  연당가: 61,130원                ||
|  |      적용: [엽P][엽S]                            ||
|  |      적용 사이즈: A4, A5                         ||
|  |                                                  ||
|  +--------------------------------------------------+|
|                                                      |
|  선택됨: 2개 (스노우지 200g, 모조지 150g)             |
|  [스노우지 200g  x] [모조지 150g  x]                 |
|                                                      |
+----------------------------------------------------+
|       [전체해제]    [취소]    [확인] <- primary       |
+----------------------------------------------------+
```

### 3. 컴포넌트 트리

```
PaperSelectionPopup (open, onClose, onConfirm, productTypeId, selectedSizeIds, productCategoryId?, preSelected?)
+-- DialogHeader
|   +-- DialogTitle (content: "용지 선택")
+-- DialogContent (maxWidth: 640, maxHeight: "75vh")
|   +-- ContextInfo
|   |   +-- Badge (variant: "secondary", content: "상품유형: {productTypeName}")
|   |   +-- Text (content: "선택된 사이즈 기반 필터링:")
|   |   +-- BadgeGroup (items: selectedSizeNames, variant: "outline")
|   +-- FilterRow
|   |   +-- Select (label: "상품 카테고리 필터", options: productCategoryMappingOptions)
|   |   |   (15개: 프리미엄엽서/스탠다드엽서/접지카드/프리미엄명함/소량전단지/
|   |   |    중철내지/중철표지/무선내지/무선표지/트윈링내지/트윈링표지/
|   |   |    탁상캘/미니탁상캘/엽서캘/벽걸이캘)
|   |   +-- Select (label: "대분류", options: ["전체", "디지털인쇄용지", "3절", "색지", "PET", ...])
|   |   +-- Input (placeholder: "용지명으로 검색...", debounce: 300)
|   +-- ScrollArea (maxHeight: 400)
|   |   +-- CheckboxGroup
|   |       +-- PaperCheckboxItem (for each paper)
|   |           +-- Checkbox (checked: isSelected)
|   |           +-- FlexRow
|   |           |   +-- Text (content: "{name} {weightGsm}g", fontWeight: 600)
|   |           |   +-- Text (content: "국4절:{quarterPrice}", color: "primary", align: "right")
|   |           +-- Text (content: "대분류: {majorCategory} | 전지: {fullSheetSpec}", color: "muted")
|   |           +-- Text (content: "평량: {weightGsm}g  연당가: {reamPrice}원", color: "muted", fontSize: 13)
|   |           +-- BadgeGroup (content: "적용:", items: activeMappings, variant: "outline", size: "xs")
|   |           +-- Text (content: "적용 사이즈: {applicableSizes}", fontSize: 12, color: "muted")
|   +-- Separator
|   +-- Text (content: "선택됨: {selectedCount}개")
|   +-- SelectedChips (items: selectedPapers, closable: true)
+-- DialogFooter
|   +-- Button (variant: "ghost", label: "전체해제")
|   +-- Button (variant: "outline", label: "취소")
|   +-- Button (variant: "primary", label: "확인")
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| CheckboxGroup | paperList | `GET /api/admin/cascading/papers?sizeId=N&categoryMapping=X` | 팝업 열림 시, 카테고리 필터 변경 시 |
| Select (카테고리필터) | categoryMappings | 하드코딩 (15개 카테고리) | - |
| SelectedChips | selectedPapers | 로컬 상태 | 체크박스 변경 시 |

### 5. 인터랙션

- **초기 상태**: 사이즈 기반 필터링된 용지 표시, preSelected 체크
- **상품 카테고리 필터**: 선택한 카테고리에 매핑(o)된 용지만 표시 (핵심 GAP-2 반영)
- **대분류 필터**: 추가 대분류 필터링
- **국4절가격/연당가**: 각 항목에 원가 정보 표시
- **적용 Badge**: 15개 카테고리 중 매핑된 카테고리를 축약 Badge로 표시
- **사이즈 미선택 시**: "먼저 사이즈를 선택해 주세요." 안내
- **진입**: SCR-PRD-022(옵션설정 탭) 용지 선택 영역 클릭
- **선행조건**: SCR-PRD-009에서 사이즈 1개 이상 선택 필수

---

## SCR-PRD-012: 옵션 체인 상태 표시

### 1. 화면 개요

현재 선택된 옵션 체인 시각화, 비활성 단계 표시. v2.0에서 조건부 옵션 뱃지 표시 추가 ("사이즈선택시 커팅모양다름", "180g이상 코팅가능" 등).

### 2. ASCII 와이어프레임

```
이 컴포넌트는 SCR-PRD-022(인쇄상품 옵션설정 탭) 내에 Section으로 배치됨

+------------------------------------------------------------------+
|  옵션 선택 현황                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  +---------+     +---------+     +---------+     +---------+      |
|  | 상품유형 |---->| 사이즈  |---->|  소재   |---->|  용지   |      |
|  |         |     |         |     |         |     |         |      |
|  | [완료]  |     | [완료]  |     | [ ] 미선택|    | [ ] 미선택|     |
|  |디지털인쇄|     |A4,A3,B4 |     |         |     |         |      |
|  +---------+     +---------+     +---------+     +---------+      |
|       |               |               |               |            |
|    [변경]           [변경]          [선택]          [선택]          |
|                                   (비활성)         (비활성)         |
|                                                                    |
|  --- 조건부 옵션 제약 ---                                          |
|  +--------------------------------------------------------------+ |
|  | [*] 사이즈 선택시 커팅모양 다름                                | |
|  | [*] 180g 이상 코팅 가능                                      | |
|  | [*] 반칼(자유형) 선택시 조각수 제한                            | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  --- 모든 단계 완료 시 ---                                         |
|                                                                    |
|  +---------+     +---------+     +---------+     +---------+      |
|  | 상품유형 |---->| 사이즈  |---->|  소재   |---->|  용지   |      |
|  | [완료]  |     | [완료]3개|    | [완료]2개|    | [완료]2개|     |
|  |디지털인쇄|     |A4,A3,B4 |     |스노우,모조|   |스노우,모조|    |
|  +---------+     +---------+     +---------+     +---------+      |
|       |               |               |               |            |
|    [변경]           [변경]          [변경]          [변경]          |
|                                                                    |
|  [OK] 모든 필수 옵션이 선택되었습니다.                              |
|                                                                    |
|  --- 미선택 단계 안내 ---                                          |
|  [i] "소재"를 선택하려면 먼저 "사이즈"를 선택하세요.                 |
|                                                                    |
+------------------------------------------------------------------+
```

### 3. 컴포넌트 트리

```
OptionChainStatus (chain: OptionChainData, conditionalRules: ConditionalRule[])
+-- Card
|   +-- CardHeader
|   |   +-- CardTitle (content: "옵션 선택 현황")
|   +-- CardContent
|       +-- ChainVisualization
|       |   +-- StepChain (direction: "horizontal", gap: 16)
|       |       +-- ChainStep (step: "productType", status: chain.productType.status)
|       |       |   +-- StepIcon (status: "complete" | "pending" | "disabled")
|       |       |   +-- StepTitle (content: "상품유형")
|       |       |   +-- StepValue (content: chain.productType.value || "미선택")
|       |       |   +-- StepCount (content: "{count}개" if count)
|       |       |   +-- ChainArrow (direction: "right")
|       |       |   +-- Button (variant: "link", size: "sm", label: "변경"/"선택")
|       |       +-- ChainStep (step: "size", onClick: openSizePopup -> SCR-PRD-009)
|       |       +-- ChainStep (step: "material", onClick: openMaterialPopup -> SCR-PRD-010)
|       |       +-- ChainStep (step: "paper", onClick: openPaperPopup -> SCR-PRD-011)
|       +-- Separator
|       +-- ConditionalRulesBadges (visible: conditionalRules.length > 0)
|       |   +-- Text (content: "조건부 옵션 제약", fontWeight: 600, fontSize: 13)
|       |   +-- List (for each rule)
|       |       +-- Badge (variant: "warning", size: "sm")
|       |       |   +-- Text (content: "[*]")
|       |       +-- Text (content: rule.description, fontSize: 13)
|       +-- Separator
|       +-- ChainMessage
|       |   +-- (allComplete) Alert (variant: "success", content: "모든 필수 옵션이 선택되었습니다.")
|       |   +-- (hasDisabled) Alert (variant: "info", content: "'{nextStep}'을 선택하려면...")
|       +-- ValidationAlert (visible: hasValidationError)
|           +-- Alert (variant: "destructive", content: validationMessage)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| ChainStep (각 단계) | chain.{step} | 부모 폼 상태 | 각 팝업 확인 콜백 |
| ConditionalRulesBadges | conditionalRules | `GET /api/admin/cascading/conditional-rules?productTypeId=N` | 상품유형 변경 시 |
| ValidationAlert | validationResult | `POST /api/admin/cascading/validate` | 전체 체인 완료 시 자동 검증 |

### 5. 인터랙션

- **초기 상태**: 상품유형만 활성, 나머지 모두 disabled
- **상품유형 선택 후**: 사이즈 단계 활성화, 조건부 규칙 로드
- **사이즈 선택 후**: 소재/용지 단계 활성화
- **조건부 옵션 뱃지**: 현재 상품유형에 적용되는 제약 조건을 [*] 뱃지로 표시
  - 예: "사이즈 선택시 커팅모양 다름" -> 사이즈 변경 시 커팅 옵션 리셋 필요
  - 예: "180g 이상 코팅 가능" -> 용지 평량에 따라 코팅 옵션 활성/비활성
- **상위 옵션 [변경] 클릭**: SCR-PRD-013(변경 확인 다이얼로그) 표시 후 하위 리셋
- **전체 선택 완료**: 성공 메시지 + 검증 자동 실행

---

## SCR-PRD-013: 상위 옵션 변경 확인 다이얼로그

### 1. 화면 개요

상위 옵션 변경 시 하위 옵션 초기화 확인 다이얼로그. v1.0과 유사.

### 2. ASCII 와이어프레임

```
+------------------------------------------------+
|  [!] 상위 옵션 변경 확인                          |
+------------------------------------------------+
|                                                  |
|  "사이즈" 옵션을 변경하면                          |
|  아래 하위 옵션이 초기화됩니다:                     |
|                                                  |
|  +------------------------------------------+   |
|  |                                          |   |
|  |  초기화 대상:                             |   |
|  |                                          |   |
|  |  - 소재 (현재 선택: 스노우지, 모조지)      |   |
|  |    -> 선택 해제됨                         |   |
|  |                                          |   |
|  |  - 용지 (현재 선택: 스노우지 200g,        |   |
|  |    모조지 150g)                          |   |
|  |    -> 선택 해제됨                         |   |
|  |                                          |   |
|  +------------------------------------------+   |
|                                                  |
|  이 작업은 되돌릴 수 없습니다.                     |
|  변경 후 하위 옵션을 다시 선택해야 합니다.          |
|                                                  |
+------------------------------------------------+
|              [취소]    [변경 진행] <- destructive  |
+------------------------------------------------+
```

### 3. 컴포넌트 트리

```
CascadeResetConfirmDialog (open, onClose, onConfirm, changingStep, affectedSteps)
+-- AlertDialogHeader
|   +-- AlertDialogIcon (name: "alert-triangle", color: "warning")
|   +-- AlertDialogTitle (content: "상위 옵션 변경 확인")
+-- AlertDialogContent
|   +-- AlertDialogDescription
|   |   +-- Text (content: '"{changingStepName}" 옵션을 변경하면 아래 하위 옵션이 초기화됩니다:')
|   +-- Card (variant: "outline")
|   |   +-- CardHeader
|   |   |   +-- Text (content: "초기화 대상:", fontWeight: 600)
|   |   +-- CardContent
|   |       +-- List (for each affectedStep)
|   |           +-- Text (content: "- {stepName} (현재 선택: {currentValues})")
|   |           +-- Text (content: "-> 선택 해제됨", color: "muted", paddingLeft: 16)
|   +-- Alert (variant: "warning")
|       +-- Text (content: "이 작업은 되돌릴 수 없습니다.")
|       +-- Text (content: "변경 후 하위 옵션을 다시 선택해야 합니다.")
+-- AlertDialogFooter
|   +-- Button (variant: "outline", label: "취소", onClick: onClose)
|   +-- Button (variant: "destructive", label: "변경 진행", onClick: handleConfirm)
```

### 4. API 바인딩

| 컴포넌트 | 데이터 소스 | API | 갱신 조건 |
|----------|------------|-----|----------|
| changingStep | 부모(SCR-PRD-012)에서 전달 | 없음 (로컬) | 다이얼로그 열림 시 |
| affectedSteps | 부모(SCR-PRD-012)에서 전달 | 없음 (로컬) | 다이얼로그 열림 시 |

### 5. 인터랙션

- **초기 상태**: 변경 대상 + 초기화 대상 정보 표시
- **확인 클릭**: 하위 옵션 전체 리셋 실행, 다이얼로그 닫힘, 해당 팝업 열림
- **취소 클릭**: 다이얼로그 닫힘, 기존 상태 유지
- **진입**: SCR-PRD-012 옵션 체인에서 이미 선택된 상위 단계 [변경] 클릭
- **이탈(확인)**: 하위 리셋 -> 해당 단계 팝업 열림 (SCR-PRD-009/010/011)
- **이탈(취소)**: SCR-PRD-012 옵션 체인으로 복귀

---

# 부록

## A. 재사용 컴포넌트 매트릭스

| 컴포넌트 | 사용 화면 | 설명 |
|----------|----------|------|
| `StatusToggle` | SCR-PRD-001, 003, 005 | 활성/비활성 토글 Switch |
| `FilterBar` | SCR-PRD-001, 003, 005, 007 | 필터 + 검색 영역 |
| `TableToolbar` | SCR-PRD-001, 003, 005 | 건수 표시 + 일괄 액션 |
| `SelectedChips` | SCR-PRD-009, 010, 011 | 선택 항목 Badge 목록 |
| `ContextInfo` | SCR-PRD-010, 011 | 상위 선택 맥락 표시 |
| `ChainStep` | SCR-PRD-012 | 옵션 체인 단계 카드 |
| `ValidationSummary` | SCR-PRD-008 | 유효/오류/경고 건수 표시 |
| `PriceTypeCard` | SCR-PRD-007 | 14종 가격 유형 카드 |
| `MappingDot` | SCR-PRD-005 | 상품별 적용 매핑 표시 (o/빈칸) |
| `CheckboxGrid` | SCR-PRD-006 | 15개 카테고리 체크박스 그리드 |
| `CheckboxWithPrice` | SCR-PRD-004 | 코팅옵션 체크박스 + 추가가격 입력 |
| `SizePreview` | SCR-PRD-002 | 사이즈 비율 시각화 + 인쇄정보 |
| `ConditionalRulesBadges` | SCR-PRD-012 | 조건부 옵션 제약 뱃지 목록 |
| `BadgeGroup` | SCR-PRD-001, 003, 011 | 적용 상품 Badge 그룹 |

## B. 접근성 고려사항

| 항목 | 적용 |
|------|------|
| 키보드 네비게이션 | 모든 인터랙션 Tab/Enter/Escape 지원 |
| Focus 관리 | 모달 열림 시 첫 번째 입력 필드에 포커스, 닫힘 시 트리거 버튼 복귀 |
| ARIA 라벨 | 모든 폼 필드에 aria-label, 에러 시 aria-describedby |
| 색상 대비 | WCAG AA 기준 충족 (4.5:1 이상) |
| 상태 알림 | Toast/Alert에 role="alert" 또는 aria-live="polite" |
| 수평 스크롤 | SCR-PRD-005 테이블에 aria-scrollbar, sticky 컬럼 명시 |

## C. 반응형 참고 (Desktop Only)

| 뷰포트 | 동작 |
|--------|------|
| >= 1280px | 풀 레이아웃 (사이드바 240px + 콘텐츠) |
| 1024~1279px | 사이드바 축소 (아이콘 only, 60px) + 콘텐츠 확장 |
| < 1024px | 미지원 - "PC에서 접속해 주세요" 안내 표시 |

## D. API 응답 형식 참조

### 목록 API 공통 응답

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 124,
      "totalPages": 7
    }
  }
}
```

### 사이즈 상세 API 응답 (v2.0 확장)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "A4",
    "cutWidth": 210,
    "cutHeight": 297,
    "bleedMm": 2,
    "workWidth": 214,
    "workHeight": 301,
    "plateCount": 4,
    "basePlateType": "A3",
    "outputPaperSpec": "316x467",
    "isIrregular": false,
    "irregularWidthMin": null,
    "irregularWidthMax": null,
    "irregularHeightMin": null,
    "irregularHeightMax": null,
    "mesItemCd": "001-0001",
    "fileNameAbbr": "엽서",
    "productTypeIds": [1, 2],
    "applicableProducts": ["디지털인쇄", "스티커"],
    "sortOrder": 1,
    "active": true
  }
}
```

### 용지 상세 API 응답 (v2.0 확장 - 15개 매핑 포함)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "스노우지",
    "majorCategory": "디지털인쇄용지",
    "weightGsm": 200,
    "fullSheetSpec": "국전(939x636)",
    "paperSize": "316x467",
    "reamPrice": 185930,
    "quarterPrice": 93.30,
    "thirdPrice": null,
    "fileNameAbbr": "스노우",
    "purchaseMemo": "",
    "mapping": {
      "premiumPostcard": true,
      "standardPostcard": true,
      "foldCard": true,
      "premiumCard": true,
      "flyer": true,
      "saddleInner": true,
      "saddleCover": true,
      "perfectInner": true,
      "perfectCover": true,
      "twinRingInner": false,
      "twinRingCover": false,
      "deskCalendar": false,
      "miniDeskCalendar": false,
      "postcardCalendar": false,
      "wallCalendar": false
    },
    "active": true
  }
}
```

### 가격 유형 요약 API 응답 (v2.0 신규)

```json
{
  "success": true,
  "data": {
    "priceTypes": [
      {
        "type": "digitalOutput",
        "label": "디지털출력비",
        "matrixSize": "23x11",
        "lastModified": "2026-03-19T14:30:00Z",
        "modifiedBy": "홍길동",
        "popupType": "matrix"
      },
      {
        "type": "foilPlate",
        "label": "박-동판비",
        "matrixSize": "15x15",
        "lastModified": "2026-03-19T14:30:00Z",
        "modifiedBy": "홍길동",
        "popupType": "area"
      }
    ]
  }
}
```

### 조건부 규칙 API 응답 (v2.0 신규)

```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": 1,
        "description": "사이즈 선택시 커팅모양 다름",
        "triggerStep": "size",
        "affectedStep": "cutting",
        "condition": "size_change",
        "action": "reset_cutting_options"
      },
      {
        "id": 2,
        "description": "180g 이상 코팅 가능",
        "triggerStep": "paper",
        "affectedStep": "coating",
        "condition": "paper_weight >= 180",
        "action": "enable_coating"
      }
    ]
  }
}
```

### 옵션 조합 검증 API 응답

```json
{
  "success": true,
  "data": {
    "valid": true,
    "chain": {
      "productType": { "id": 1, "name": "디지털 인쇄" },
      "sizes": [{ "id": 1, "name": "A4" }],
      "materials": [{ "id": 1, "name": "스노우지" }],
      "papers": [{ "id": 1, "name": "스노우지 200g" }]
    },
    "conditionalWarnings": [
      "선택된 사이즈에서 원형 커팅은 지원되지 않습니다."
    ],
    "warnings": []
  }
}
```

## E. v2.0 GAP 반영 요약 (13개 화면)

| GAP 항목 | 반영 화면 | 변경 내용 |
|---------|----------|----------|
| GAP-1: 다중 가격 매트릭스 | SCR-PRD-007 | 8종 -> 14종 가격 유형 카드 그리드 |
| GAP-2: 용지-상품 매핑 (L~Z열) | SCR-PRD-005, 006, 011 | 15개 카테고리 매핑 컬럼/체크박스/필터 |
| GAP-3: 비규격 사이즈 | SCR-PRD-002 | 비규격 토글 + 가로/세로 범위 입력 |
| GAP-5: MES 연동 필드 | SCR-PRD-001, 002, 004 | ITEM_CD, 파일명약어 컬럼/필드 |
| GAP-6: 조건부 옵션 | SCR-PRD-012 | 조건부 제약 뱃지 표시 |
