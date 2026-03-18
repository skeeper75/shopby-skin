# SPEC-DS-005: 수락 기준

> **SPEC ID**: SPEC-DS-005
> **문서 유형**: Acceptance Criteria
> **작성일**: 2026-03-17

---

## 1. 토큰 시스템 검증

### AC-001: 3-Tier 토큰 구조 유효성

**Given** huni-tokens.css 파일이 생성되었을 때
**When** CSS 파일을 파싱하여 토큰 구조를 검증하면
**Then** 다음 조건을 모두 만족해야 한다:
- Tier 1 Palette 토큰: `--huni-palette-purple-{00~1000}` 11단계가 존재한다
- Tier 1 Palette 토큰: `--huni-palette-gray-{00~1000}` 11단계가 존재한다
- Tier 2 Semantic 토큰: `--huni-fg-*` 카테고리에 최소 5개 토큰이 존재한다
- Tier 2 Semantic 토큰: `--huni-bg-*` 카테고리에 최소 4개 토큰이 존재한다
- Tier 2 Semantic 토큰: `--huni-stroke-*` 카테고리에 최소 3개 토큰이 존재한다
- Tier 3 Component 토큰: `--huni-chip-*`, `--huni-cta-*`, `--huni-input-*` 토큰이 존재한다
- Tier 3 Print 토큰: `--huni-print-*` 토큰이 최소 5개 존재한다

### AC-002: 토큰 참조 방향 무결성

**Given** huni-tokens.css 파일이 존재할 때
**When** CSS 변수 간 참조 관계를 분석하면
**Then** 다음 조건을 만족해야 한다:
- Tier 2 Semantic 토큰은 Tier 1 Palette 토큰만 참조한다 (`var(--huni-palette-*)`)
- Tier 3 Component 토큰은 Tier 2 Semantic 토큰만 참조한다 (`var(--huni-fg-*)`, `var(--huni-bg-*)`, `var(--huni-stroke-*)`)
- 순환 참조가 존재하지 않는다
- Tier 1 Palette 토큰은 다른 CSS 변수를 참조하지 않고 직접 값(hex color, px 등)만 가진다

### AC-003: 브랜드 Primary 색상 일관성

**Given** 후니프린팅 브랜드 컬러가 #5538B6일 때
**When** 토큰 시스템에서 브랜드 관련 토큰을 조회하면
**Then** 다음이 일관되어야 한다:
- `--huni-palette-purple-600`의 값이 `#5538B6`이다
- `--huni-fg-brand`가 `var(--huni-palette-purple-600)`을 참조한다
- `--huni-bg-brand-solid`가 `var(--huni-palette-purple-600)`을 참조한다
- `--huni-stroke-brand-solid`가 `var(--huni-palette-purple-600)`을 참조한다

---

## 2. Tailwind 플러그인 검증

### AC-004: Huni Tailwind 플러그인 동작

**Given** tailwind-plugin.js가 작성되고 tailwind.config.js에 등록되었을 때
**When** Tailwind CSS 빌드를 실행하면
**Then** 다음 유틸리티 클래스가 사용 가능해야 한다:
- 색상: `bg-huni-bg-brand`, `text-huni-fg-neutral`, `border-huni-stroke-neutral` 등
- 스페이싱: `p-huni-x4`, `m-huni-x2`, `gap-huni-x3` 등
- 둥글기: `rounded-huni-r2`, `rounded-huni-r3` 등
- 타이포그래피: `.huni-t1-regular`, `.huni-t3-bold`, `.huni-t5-medium` 등

### AC-005: 기존 Tailwind 설정과의 공존

**Given** tailwind.config.js에 Huni 플러그인과 기존 tailwindcss-animate 플러그인이 공존할 때
**When** Webpack 빌드를 실행하면
**Then** 다음 조건을 만족해야 한다:
- 빌드 오류가 발생하지 않는다
- 기존 Tailwind 유틸리티 클래스(bg-primary, text-foreground 등)가 정상 작동한다
- Huni 유틸리티 클래스가 기존 클래스와 충돌하지 않는다
- shadcn/ui 컴포넌트(관리자 영역)가 정상 렌더링된다

---

## 3. 하위 호환성 검증

### AC-006: `--po-*` Alias 레이어 완전성

**Given** compat-aliases.css 파일이 생성되었을 때
**When** 기존 SPEC-DS-004 컴포넌트에서 사용하는 모든 `--po-*` CSS 변수를 검사하면
**Then** 다음 조건을 모두 만족해야 한다:
- `--po-primary`가 `var(--huni-palette-purple-600)`으로 매핑되어 있다
- `--po-primary-dark`가 `var(--huni-palette-purple-700)`으로 매핑되어 있다
- `--po-primary-secondary`가 `var(--huni-palette-purple-400)`으로 매핑되어 있다
- `--po-text-dark`가 `var(--huni-fg-neutral-muted)`로 매핑되어 있다
- `--po-text-medium`이 `var(--huni-fg-neutral-subtle)`로 매핑되어 있다
- `--po-text-muted`가 `var(--huni-fg-disabled)`로 매핑되어 있다
- `--po-border-default`가 `var(--huni-stroke-neutral)`로 매핑되어 있다
- `--po-bg-white`가 `var(--huni-bg-layer-default)`로 매핑되어 있다
- `--po-font-family`가 `var(--huni-font-family)`로 매핑되어 있다
- 기존 colors.css, typography.css에 정의된 모든 `--po-*` 변수에 대한 alias가 존재한다

### AC-007: 기존 컴포넌트 무중단 렌더링

**Given** Phase 1이 완료되고 huni-tokens.css + compat-aliases.css가 globals.css에 import되었을 때
**When** SPEC-DS-004의 13개 컴포넌트를 렌더링하면
**Then** 다음 조건을 만족해야 한다:
- BadgeLabel: 브랜드 색상(#5538B6) 배경으로 정상 렌더링
- SizeOptionChip: 기본/선택 상태의 border와 text 색상이 변경 전과 동일
- CTAButton: 브랜드 색상 배경, 흰색 텍스트로 정상 렌더링
- DropdownSelect: border 색상과 focus 상태가 정상 동작
- 나머지 9개 컴포넌트: 시각적 변화 없음 (pixel-level 비교)
- **`--po-*` 변수를 직접 참조하는 기존 코드가 수정 없이 정상 작동한다**

---

## 4. 컴포넌트 레시피 검증

### AC-008: CVA Variant 표준화 (Phase 3)

**Given** Phase 3 레시피 표준화가 완료되었을 때
**When** 13개 컴포넌트의 CVA 정의를 검사하면
**Then** 다음 표준 variant 패턴을 따라야 한다:
- state variant: `default`, `selected`, `disabled` (최소 3개)
- size variant: `sm`, `md`, `lg` (최소 2개)
- 모든 CVA에 `defaultVariants` 객체가 정의되어 있다
- 상태별 스타일이 `--huni-*` 토큰만 참조한다 (`--po-*` 직접 참조 0건)

### AC-009: compoundVariants 패턴 도입

**Given** CVA 레시피에 compoundVariants가 도입되었을 때
**When** 복합 상태(예: variant=outline + state=selected)를 테스트하면
**Then** 다음 조건을 만족해야 한다:
- outline + selected 조합 시 배경색이 `--huni-bg-brand-weak`이다
- solid + disabled 조합 시 커서가 `not-allowed`이고 배경이 `--huni-bg-disabled`이다
- compoundVariants 우선순위가 개별 variant보다 높다

---

## 5. SPEC-SKIN 참조 일관성 검증

### AC-010: SPEC-SKIN 기술 스택 참조 업데이트

**Given** DS-005가 완료되었을 때
**When** SPEC-SKIN-000~008의 spec.md 문서를 검사하면
**Then** 다음 조건을 만족해야 한다:
- 모든 SPEC-SKIN 문서의 기술 스택 섹션에 "Huni Design System v2.0" 참조가 포함되어 있다
- 사용자 영역 SPEC (001~004)에 `--huni-*` 토큰 사용 가이드가 명시되어 있다
- 관리자 영역 SPEC (005~008)에 "관리자 영역은 shadcn/ui 별도 체계" 명시

### AC-011: `--po-*` 제거 검증 (Phase 2 완료 후)

**Given** Phase 2 컴포넌트 토큰 마이그레이션이 완료되었을 때
**When** `src/design-system/components/` 디렉토리에서 `--po-` 패턴을 검색하면
**Then** 다음 조건을 만족해야 한다:
- `var(--po-` 직접 참조가 0건이다
- 모든 색상 참조가 `--huni-*` 토큰 또는 Tailwind 유틸리티(bg-huni-*, text-huni-* 등)를 사용한다
- compat-aliases.css 파일은 여전히 유지된다 (외부 참조 대비)

---

## 6. 빌드 및 통합 검증

### AC-012: Webpack 빌드 정상 동작

**Given** 모든 토큰 파일과 Tailwind 플러그인이 추가되었을 때
**When** `yarn build` (프로덕션 빌드)를 실행하면
**Then** 다음 조건을 만족해야 한다:
- 빌드 오류 0건
- 빌드 경고 중 CSS 관련 경고 0건
- 출력 CSS 파일에 `--huni-*` 변수가 포함되어 있다
- 출력 CSS 파일에 `--po-*` alias 변수가 포함되어 있다
- 번들 사이즈 증가가 10KB 이내이다 (CSS 변수 파일 추가분)

### AC-013: 개발 서버 Hot Reload

**Given** 개발 서버(`yarn start`)가 실행 중일 때
**When** huni-tokens.css의 토큰 값을 수정하면
**Then** 다음 조건을 만족해야 한다:
- 브라우저에서 HMR(Hot Module Replacement)로 변경사항이 즉시 반영된다
- 페이지 전체 새로고침 없이 스타일이 업데이트된다

---

## 7. Quality Gate 기준

### Definition of Done (Phase 1)

- [ ] AC-001: 3-Tier 토큰 구조 유효성 -- PASS
- [ ] AC-002: 토큰 참조 방향 무결성 -- PASS
- [ ] AC-003: 브랜드 Primary 색상 일관성 -- PASS
- [ ] AC-004: Huni Tailwind 플러그인 동작 -- PASS
- [ ] AC-005: 기존 Tailwind 설정과의 공존 -- PASS
- [ ] AC-006: `--po-*` Alias 레이어 완전성 -- PASS
- [ ] AC-007: 기존 컴포넌트 무중단 렌더링 -- PASS
- [ ] AC-012: Webpack 빌드 정상 동작 -- PASS
- [ ] AC-013: 개발 서버 Hot Reload -- PASS

### Definition of Done (Phase 2)

- [ ] AC-011: `--po-*` 제거 검증 -- PASS

### Definition of Done (Phase 3)

- [ ] AC-008: CVA Variant 표준화 -- PASS
- [ ] AC-009: compoundVariants 패턴 도입 -- PASS

### Definition of Done (전체 완료)

- [ ] AC-010: SPEC-SKIN 기술 스택 참조 업데이트 -- PASS
- [ ] 모든 Phase의 Definition of Done 충족

---

## 8. 검증 방법

| AC | 검증 방법 | 도구 |
|----|----------|------|
| AC-001~003 | CSS 파일 구조 분석 | Grep, 수동 검증 |
| AC-004~005 | Tailwind 빌드 출력 검사 | `npx tailwindcss --content ... --output` |
| AC-006 | CSS 변수 매핑 완전성 검사 | Grep `--po-` in colors.css/typography.css vs compat-aliases.css |
| AC-007 | 컴포넌트 렌더링 비교 | 브라우저 스크린샷 비교, 개발 서버 육안 검증 |
| AC-008~009 | CVA 정의 구조 검사 | Grep variant patterns in components |
| AC-010 | SPEC 문서 검색 | Grep "Huni Design System" in SPEC-SKIN-*/spec.md |
| AC-011 | 직접 참조 검색 | `Grep 'var(--po-' src/design-system/components/` |
| AC-012~013 | 빌드/개발 서버 실행 | `yarn build`, `yarn start` |
