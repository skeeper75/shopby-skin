---
id: SPEC-SKIN-006
version: 2.0.0
type: plan
---

# SPEC-SKIN-006 v2: 관리자 상품관리 - 구현 계획

## 1. 구현 전략

### 1.1 개발 방식

- **전체 신규 개발**: Aurora Skin에 관리자 상품관리 기능 없음
- **Huni DS 전용**: 모든 UI를 Huni 디자인시스템 컴포넌트로 구현
- **Desktop 전용**: 최소 1280px (가격 매트릭스 테이블 필요)

### 1.2 기술 요구사항

- React 18 + TypeScript
- Huni 디자인시스템 (SPEC-DS-006) 컴포넌트
- `--huni-*` 토큰 전용 (`--po-*` 사용 금지)
- WYSIWYG 에디터: TipTap 또는 Quill (이미지 업로드 포함)
- 드래그앤드롭: @dnd-kit (카테고리 트리, 이미지 정렬)
- @shopby/react-components (상품 API 연동)

---

## 2. 마일스톤

### Phase 1: 핵심 인프라 (Primary Goal)

**TAG-006-MASTER + TAG-006-OPTION**

- 사이즈/소재/용지 마스터 데이터 CRUD 페이지 3종
- 8단계 옵션 종속구조 엔진 (`usePrintOptions` 훅 확장)
- 공통 테이블 컴포넌트 (정렬, 필터, 페이지네이션)

**파일 구조:**
```
src/pages/admin/product/master/
  ├── SizePage.tsx
  ├── MaterialPage.tsx
  └── PaperPage.tsx
src/hooks/
  └── usePrintOptions.ts (종속 옵션 엔진)
src/utils/
  └── optionEngine.ts
```

### Phase 2: 가격 시스템 (Primary Goal)

**TAG-006-PRICE**

- 가격 매트릭스 에디터 컴포넌트 (스프레드시트 스타일)
- 가격관리 팝업 8종 (공통 구조 + 유형별 설정)
- CSV/Excel 대량 가격 업로드
- 가격 시뮬레이터 (조합별 가격 미리보기)

**파일 구조:**
```
src/components/admin/product/price/
  ├── PriceMatrixEditor.tsx
  ├── PricePopup.tsx (공통 Dialog)
  ├── PricePopupConfig.ts (8종 유형별 설정)
  └── PriceBulkImport.tsx
```

### Phase 3: 상품 등록 폼 (Primary Goal)

**TAG-006-FORM + TAG-006-POPUP**

- 인쇄/제본 상품 등록/수정 페이지
- 사이즈/소재/종이 선택 팝업 3종 (Checkbox 다중선택 Dialog)
- 기본값 설정 UI
- 상품 미리보기 Dialog
- 임시저장 기능

**파일 구조:**
```
src/pages/admin/product/
  ├── ProductCreatePage.tsx
  ├── ProductEditPage.tsx
  └── ProductPreviewDialog.tsx
src/components/admin/product/
  ├── ProductForm.tsx
  ├── ProductFormBasic.tsx
  ├── ProductFormOptions.tsx
  ├── ProductFormDefaults.tsx
  └── ProductFormDescription.tsx
src/components/admin/product/popups/
  ├── SizeSelectPopup.tsx
  ├── MaterialSelectPopup.tsx
  └── PaperSelectPopup.tsx
```

### Phase 4: 일반 상품 등록 (Secondary Goal)

**TAG-006-GOODS + TAG-006-CATEGORY**

- 굿즈 카테고리 트리 관리 (드래그앤드롭)
- 굿즈 상품등록 (카테고리 선택 + 옵션 설정)
- 포장재/디자인 상품등록 (일반 폼)
- 수작 상품등록 (단순 폼)

**파일 구조:**
```
src/pages/admin/product/general/
  ├── GoodsCreatePage.tsx
  ├── HandmadeCreatePage.tsx
  ├── PackagingCreatePage.tsx
  └── DesignCreatePage.tsx
src/components/admin/product/
  ├── CategoryTree.tsx
  └── GeneralProductForm.tsx
```

---

## 3. 아키텍처 설계 방향

### 3.1 가격 매트릭스 에디터

- `contentEditable` 기반 인라인 편집 (input 렌더링 비용 절감)
- 가상 스크롤 적용 (대량 조합 시 성능)
- undo/redo 스택 (사용자 실수 복구)
- 키보드 네비게이션 (Tab, Enter, Arrow keys)

### 3.2 옵션 종속구조 엔진

- 종속 관계 그래프 (DAG) 기반 유효성 검증
- 상위 옵션 변경 시 하위 옵션 cascade reset
- 유효하지 않은 조합 자동 비활성화
- 기존 `usePrintOptions` 훅 확장 활용

### 3.3 폼 상태 관리

- React Hook Form + Zod 스키마 검증
- 섹션별 독립적 dirty 상태 추적
- 임시저장은 localStorage + API 이중화

---

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|----------|
| 가격 매트릭스 조합 폭발 (사이즈x용지x코팅x수량) | 높음 | 가상 스크롤 + 지연 로딩 + 조합 필터 |
| 8종 가격 팝업 유지보수 | 중간 | 공통 PricePopup 컴포넌트 + Config 패턴 |
| WYSIWYG 에디터 번들 크기 | 중간 | 동적 import (lazy loading) |
| 옵션 종속구조 복잡도 | 높음 | 유닛 테스트 충분히 작성, 엣지 케이스 커버 |

---

## 5. 관련 TAG 매핑

| TAG | Phase | 우선순위 |
|-----|-------|----------|
| TAG-006-MASTER | Phase 1 | Primary |
| TAG-006-OPTION | Phase 1 | Primary |
| TAG-006-PRICE | Phase 2 | Primary |
| TAG-006-FORM | Phase 3 | Primary |
| TAG-006-POPUP | Phase 3 | Primary |
| TAG-006-GOODS | Phase 4 | Secondary |
| TAG-006-CATEGORY | Phase 4 | Secondary |
