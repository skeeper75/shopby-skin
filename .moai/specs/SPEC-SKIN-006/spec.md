---
id: SPEC-SKIN-006
version: 2.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
author: MoAI
priority: high
issue_number: 0
tags: [admin, product, price-matrix, master-data, option-engine, huni-ds]
depends_on: [SPEC-SKIN-005]
affects: [B-4]
---

# SPEC-SKIN-006 v2: 관리자 상품관리

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 작성 (shadcn/ui 기반) |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 기반 전면 재작성. EARS 요구사항 강화, 정책 통합, TAG 분해 |

---

## 1. 개요

관리자 상품관리 전체를 Huni 디자인시스템 기반으로 신규 구현한다. 인쇄/제본 상품등록, 사이즈/소재/종이 마스터 데이터 관리, 8단계 옵션 종속구조 설정, 가격 매트릭스(수량x옵션) 에디터, 관리 팝업 5종, 굿즈/수작/포장재/디자인 상품등록을 포함한다.

- **IA 영역**: B-4 (14개 항목)
- **정책 문서**: POLICY-A10B4-PRODUCT
- **구현 방식**: CUSTOM (가격 매트릭스, 옵션 엔진), SKIN (상품 등록 폼)
- **디자인시스템**: Huni DS (SPEC-DS-006) 전용, `--huni-*` 토큰만 사용

---

## 2. IA 기능 목록

| No | 기능 | 우선순위 | 구현 방식 | 정책 근거 |
|----|------|----------|-----------|-----------|
| 50 | 인쇄/제본 상품등록 (미리보기/등록/수정, 기본값설정) | P0 | SKIN | POLICY-A10B4 3절 |
| 51 | 사이즈선택 팝업 (실사/디지털/제본/패키지/굿즈) | P0 | CUSTOM | POLICY-A10B4 4절 |
| 52 | 소재선택 팝업 (실사/굿즈) | P0 | CUSTOM | POLICY-A10B4 4절 |
| 53 | 종이선택 팝업 (디지털/제본/패키지) | P0 | CUSTOM | POLICY-A10B4 4절 |
| 54 | 가격관리 팝업 8종 (DP02~PR02) | P0 | CUSTOM | POLICY-A10B4 5절 |
| 55 | 사이즈관리 (마스터 데이터 CRUD) | P0 | CUSTOM | POLICY-A10B4 4절 |
| 56 | 소재관리 (마스터 데이터 CRUD) | P0 | CUSTOM | POLICY-A10B4 4절 |
| 57 | 용지관리 (마스터 데이터 CRUD) | P0 | CUSTOM | POLICY-A10B4 4절 |
| 58 | 가격관리 - 출력/코팅/후가공/제본 (가격 시뮬레이터 핵심) | P0 | CUSTOM | POLICY-A10B4 5절 |
| 59 | 굿즈 카테고리관리 | P1 | NATIVE | POLICY-A10B4 3절 |
| 60 | 굿즈 상품등록 (카테고리/옵션) | P1 | NATIVE | POLICY-A10B4 3절 |
| 61 | 수작 상품등록 | P2 | NATIVE | POLICY-A10B4 3절 |
| 62 | 포장재 상품등록 | P1 | SKIN | POLICY-A10B4 3절 |
| 63 | 디자인 상품등록 | P1 | SKIN | POLICY-A10B4 3절 |

---

## 3. EARS 형식 요구사항

### REQ-006-001: 인쇄/제본 상품 등록 [WHEN-THEN]

**WHEN** 관리자가 상품 정보(상품명, 분류, 옵션)를 설정하고 "등록하기" 버튼을 클릭하면
**THEN** 시스템은 상품을 등록하고 사용자 쇼핑몰에 노출해야 한다

- 상품명, 분류(디지털/실사/제본/패키지), 상품코드(자동생성) 설정
- 사이즈/용지/코팅/후가공 옵션을 팝업을 통해 다중 선택
- 기본값 설정 (사용자 초기 선택값: 기본 사이즈, 용지, 코팅, 수량)
- 상세 설명 WYSIWYG 에디터 (이미지 포함)
- 미리보기 기능 (고객 시점 상품 표시)
- 임시저장 지원

### REQ-006-002: 사이즈/소재/종이 선택 팝업 [WHEN-THEN]

**WHEN** 관리자가 상품 등록 시 "사이즈 선택" / "소재 선택" / "종이 선택" 팝업을 열면
**THEN** 시스템은 등록된 마스터 데이터 목록에서 다중 선택을 허용하고, 선택 결과를 상품 폼에 반영해야 한다

- Checkbox 기반 다중 선택
- 검색/필터 기능 (분류별 필터)
- 선택 완료 시 상품 등록 폼에 즉시 반영
- 사이즈 팝업: 실사/디지털/제본/패키지/굿즈 분류별 표시
- 소재 팝업: 실사/굿즈 분류별 표시
- 종이 팝업: 디지털/제본/패키지 분류별 표시

### REQ-006-003: 가격 매트릭스 편집 [WHEN-THEN]

**WHEN** 관리자가 가격관리 팝업에서 수량별 단가를 입력하고 저장하면
**THEN** 시스템은 가격 매트릭스를 저장하고 사용자 가격 계산에 즉시 반영해야 한다

- 사이즈 x 용지 x 코팅 조합별 가격 입력
- 수량 구간별 단가 (단면/양면)
- 행 추가/삭제 (수량 구간 관리)
- 일괄 적용 (선택한 조합에 동일 가격 적용)
- 스프레드시트 스타일 인라인 편집
- CSV/Excel 업로드로 대량 가격 설정

### REQ-006-004: 가격관리 팝업 8종 [WHEN-THEN]

**WHEN** 관리자가 가격관리 메뉴에서 특정 가격 유형(DP02~PR02)을 선택하면
**THEN** 시스템은 해당 유형의 가격 매트릭스를 Dialog로 표시하고 편집을 허용해야 한다

- 8종: 디지털출력(DP02), 디지털코팅(DP03), 디지털후가공(DP04), 디지털제본(DP05), 실사출력(RS02), 실사코팅(RS03), 실사후가공(RS04), 패키지/인쇄제본(PR02)
- 각 팝업은 공통 가격 매트릭스 구조 공유
- 조합 필터 (사이즈, 용지, 코팅 드롭다운)

### REQ-006-005: 마스터 데이터 CRUD [WHEN-THEN]

**WHEN** 관리자가 사이즈/소재/용지 관리 페이지에서 항목을 추가/수정/삭제하면
**THEN** 시스템은 마스터 데이터를 업데이트하고 상품 등록 팝업에 즉시 반영해야 한다

- CRUD 테이블 (추가/수정/삭제/사용중지)
- 사용중인 항목 삭제 방지 (경고 Dialog 표시)
- 정렬 순서 변경 지원
- 분류별 필터 (디지털/실사/제본/패키지/굿즈)
- 사이즈: 이름, 가로, 세로, 분류, 상태
- 소재: 이름, 분류, 두께, 상태
- 용지: 이름, 분류, 평량(g), 상태

### REQ-006-006: 8단계 옵션 종속구조 [IF-THEN]

**IF** 상품 분류가 출력상품(명함/전단/포스터/봉투)이면
**THEN** 시스템은 8단계 종속 옵션 엔진을 적용해야 한다

- 종속 순서: 상품분류 > 사이즈 > 용지 > 코팅 > 후가공 > 인쇄면 > 수량 > 가격
- 상위 옵션 변경 시 하위 옵션 자동 리셋
- 유효하지 않은 조합 비활성화 처리

### REQ-006-007: 굿즈/수작/포장재/디자인 상품 등록 [WHEN-THEN]

**WHEN** 관리자가 일반 상품(굿즈/수작/포장재/디자인) 정보를 입력하고 등록하면
**THEN** 시스템은 shopby 상품 API를 통해 상품을 등록해야 한다

- 굿즈: 카테고리 트리 선택, 옵션 설정
- 수작: 일반 상품 폼 (옵션 없음)
- 포장재: 규격/재질 옵션
- 디자인: 디자인 파일 업로드, 가격 설정

### REQ-006-008: 굿즈 카테고리 관리 [WHEN-THEN]

**WHEN** 관리자가 굿즈 카테고리를 추가/수정/삭제하면
**THEN** 시스템은 카테고리 트리를 업데이트하고 상품 등록 시 반영해야 한다

- 트리 구조 카테고리 관리
- 드래그앤드롭 순서 변경
- 상품이 있는 카테고리 삭제 방지

### REQ-006-009: 상품 미리보기 [WHEN-THEN]

**WHEN** 관리자가 상품 등록/수정 화면에서 "미리보기" 버튼을 클릭하면
**THEN** 시스템은 고객 쇼핑몰 시점의 상품 페이지를 Dialog로 표시해야 한다

### REQ-006-010: 마스터 데이터 사용중 항목 보호 [Unwanted]

시스템은 상품에서 사용중인 마스터 데이터(사이즈/소재/용지)를 삭제**하지 않아야 한다**

- 삭제 시도 시 경고 Dialog 표시 (사용중인 상품 목록 안내)
- "사용중지" 상태 변경은 허용 (신규 상품에서 선택 불가, 기존 상품 유지)

### REQ-006-011: 가격 데이터 무결성 [Ubiquitous]

시스템은 **항상** 가격 매트릭스의 수량 구간이 중복되지 않도록 검증해야 한다

- 동일 조합 내 수량 구간 중복 불허
- 저장 시 자동 오름차순 정렬
- 빈 셀(가격 미입력) 저장 불허

---

## 4. Huni 디자인시스템 컴포넌트 사용

| 컴포넌트 | 용도 | 주요 props/패턴 |
|---------|------|----------------|
| Dialog | 가격관리 팝업 8종, 사이즈/소재/종이 선택 팝업, 미리보기, 삭제 확인 | lazyMount, unmountOnExit, 8 slots |
| TextField | 상품명, 가격 입력, 검색, 마스터 데이터 입력 | multiline(상세설명), clearable(검색), 7 slots |
| Field | 상품 등록 폼 필드 래핑, 마스터 데이터 폼 | Context Provider, auto aria-*, 10 slots |
| Tabs | 상품 분류 탭 (디지털/실사/제본/패키지), 가격 유형 탭 | line variant, indicator animation, 7 slots |
| Pagination | 마스터 데이터 목록, 상품 목록 | numbered variant |
| Switch | 상품 활성/비활성, 마스터 데이터 사용중/중지 | data-checked/disabled, 5 slots |
| Checkbox | 옵션 선택 팝업 다중 선택, 코팅/후가공 선택 | data-checked/disabled/focus-visible, 5 slots |
| RadioGroup | 인쇄면 선택 (단면/양면), 상품 유형 선택 | data-checked/disabled, 6 slots |
| Snackbar | 저장 성공/실패 알림, 삭제 완료 알림 | useSnackbar hook, queue, 10 slots |
| Skeleton | 테이블 로딩, 폼 로딩 | neutral variant, wave animation |
| Chip | 선택된 옵션 표시 (사이즈, 용지 태그) | data-selected, 5 slots |
| Icon | 액션 아이콘 (편집, 삭제, 추가) | lucide-react, xs~xl 사이즈 |
| Divider | 폼 섹션 구분 | full variant, horizontal |

**토큰 체계**: `--huni-bg-*`, `--huni-fg-*`, `--huni-stroke-*` (시맨틱), `--huni-space-*`, `--huni-radius-*`

**디자인 토큰 (상품 관리 전용)**:
- 폼 섹션 헤더 배경: `#F6F6F6`
- 폼 섹션 테두리: `#CACACA`
- 가격 매트릭스 컬럼 헤더: `#EEEBF9`
- 가격 매트릭스 행 헤더: `#F6F6F6`
- Input 포커스 테두리: 2px `#5538B6`
- 저장 버튼: `#5538B6` / white / h-[44px] / 4px / min-w-[120px]
- 취소 버튼: white / `#CACACA` / `#424242` / h-[44px]

---

## 5. API 연동

| 기능 | API 엔드포인트 | 분류 | 비고 |
|------|---------------|------|------|
| 상품 등록 | POST /admin/products | [SH] | shopby 상품 등록 |
| 상품 수정 | PUT /admin/products/{no} | [SH] | |
| 상품 목록 | GET /admin/products | [SH] | |
| 상품 이미지 업로드 | POST /admin/products/images | [SH] | |
| 사이즈 CRUD | CRUD /custom/admin/sizes | [C] | 마스터 데이터 |
| 소재 CRUD | CRUD /custom/admin/materials | [C] | 마스터 데이터 |
| 용지 CRUD | CRUD /custom/admin/papers | [C] | 마스터 데이터 |
| 가격 매트릭스 CRUD | CRUD /custom/admin/prices | [C] | 8종 가격 팝업 |
| 굿즈 카테고리 CRUD | CRUD /custom/admin/goods-categories | [C] | 트리 구조 |

---

## 6. TAG 분해

| TAG | 범위 | 파일 영향 |
|-----|------|----------|
| TAG-006-FORM | 상품 등록/수정 폼 | src/pages/admin/product/, src/components/admin/product/ |
| TAG-006-POPUP | 사이즈/소재/종이 선택 팝업 3종 | src/components/admin/product/popups/ |
| TAG-006-PRICE | 가격 매트릭스 에디터 + 팝업 8종 | src/components/admin/product/price/ |
| TAG-006-MASTER | 사이즈/소재/용지 마스터 CRUD | src/pages/admin/product/master/ |
| TAG-006-OPTION | 8단계 옵션 종속구조 엔진 | src/hooks/usePrintOptions, src/utils/optionEngine |
| TAG-006-GOODS | 굿즈/수작/포장재/디자인 등록 | src/pages/admin/product/general/ |
| TAG-006-CATEGORY | 굿즈 카테고리 트리 관리 | src/components/admin/product/CategoryTree |

---

## 7. 의존성

- **SPEC-SKIN-005**: 관리자 기반 레이아웃 (사이드바, 인증, RBAC)
- **SPEC-DS-006**: Huni 디자인시스템 컴포넌트
- **POLICY-A10B4-PRODUCT**: 상품/옵션/가격 정책
