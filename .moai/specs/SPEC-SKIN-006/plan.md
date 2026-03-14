# SPEC-SKIN-006: 관리자 상품관리 - 구현 계획

> **SPEC ID**: SPEC-SKIN-006

## 1. 마일스톤

### Primary Goal: 인쇄/제본 상품 + 가격관리
- 인쇄/제본 상품등록 폼 (기본값설정 포함)
- 사이즈/소재/종이 선택 팝업 3종
- 가격관리 매트릭스 8종

### Secondary Goal: 마스터 데이터 + 굿즈
- 사이즈/소재/용지 마스터 CRUD
- 굿즈 카테고리 트리 + 상품등록
- 포장재/디자인 상품등록

### Optional Goal
- 수작 상품등록

## 2. 기술적 접근
- 가격 매트릭스: editable DataTable (TanStack Table)
- 선택 팝업: 공통 SelectionPopup 컴포넌트
- 에디터: TipTap 또는 Quill 리치텍스트 에디터

## 3. 리스크

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| 가격 조합 복잡도 (사이즈x용지x코팅x수량) | High | 가격 매트릭스 구조 사전 설계 |
| 8종 가격 팝업 일관성 | Medium | 공통 PriceMatrix 컴포넌트 |
