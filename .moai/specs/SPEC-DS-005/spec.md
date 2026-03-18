---
id: SPEC-DS-005
version: 1.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
author: MoAI
priority: high
issue_number: 0
tags: [design-system, tokens, tailwind, migration, seed-design]
depends_on: [SPEC-DS-004]
affects: [SPEC-SKIN-000, SPEC-SKIN-001, SPEC-SKIN-002, SPEC-SKIN-003, SPEC-SKIN-004, SPEC-SKIN-005, SPEC-SKIN-006, SPEC-SKIN-007, SPEC-SKIN-008]
---

# SPEC-DS-005: 후니프린팅 디자인시스템 v2.0 -- seed.design 아키텍처 기반 토큰 파이프라인 구축

## 1. 개요

후니프린팅 디자인시스템을 seed.design(당근 디자인시스템)의 아키텍처 패턴을 기반으로 체계화한다. 3-tier 토큰 계층(palette/semantic/component), Huni 전용 Tailwind 플러그인, CVA 레시피 표준화, 빌드 파이프라인 통합을 통해 일관된 디자인 언어를 구축하고, 기존 SPEC-SKIN-000~008의 기술 스택 업데이트 경로를 제시한다.

### 채택 전략: Hybrid (Option C)

seed.design의 **패턴을 차용**하되 **npm 패키지 의존성은 만들지 않는** 접근법을 채택한다.

- seed.design의 토큰 구조 패턴(3-tier: palette -> semantic -> component)을 차용
- CVA 레시피 시스템 유지 및 확장 (defineRecipe 패턴이 아닌 기존 CVA 패턴)
- `--huni-*` 네임스페이스로 독립적 CSS 변수 체계 구축
- `--po-*` -> `--huni-*` alias 레이어로 무중단 마이그레이션 보장
- seed.design npm 의존성 배제 -- 패턴만 차용, 직접 의존 없음

### 근거

- SPEC-DS-004에서 CVA + Tailwind CSS + CSS 변수 패턴이 이미 작동 중
- 인쇄 도메인 전용 토큰(용지 사이즈, 인쇄 마진, 후가공 옵션)은 범용 DS에 없음
- aurora-skin-main은 JavaScript(JSX) 프로젝트로, seed.design의 TypeScript 타입 시스템 직접 사용 불가
- 1인 개발 프로젝트에서 전체 DS 파이프라인 자체 구축은 비효율적

---

## 2. 환경 (Environment)

### 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| 언어 | JavaScript (ES6+), JSX | ES2022 |
| UI 프레임워크 | React | 18.2.0 |
| 스타일링 | Tailwind CSS 3 + CSS Variables | 3.x |
| 컴포넌트 variant | class-variance-authority (CVA) | 최신 |
| 번들러 | Webpack | 5.75.0 |
| 패키지 매니저 | Yarn 1 / npm | 10.7.0+ |

### 참조 시스템

- **seed.design**: 당근 디자인시스템 (패턴 참조용, npm 의존성 없음)
- **SPEC-DS-004**: 인쇄 옵션 디자인 시스템 파이프라인 (기존 13개 컴포넌트)
- **aurora-skin-main**: 기반 쇼핑몰 스킨 프로젝트

### 기존 토큰 현황

- CSS 변수: `--po-*` prefix (printing options)
- 색상: Primary #5538B6, Secondary, Gray 계열, Accent (gold/teal)
- 타이포그래피: Noto Sans KR, 8 사이즈(xs-2xl), 3 웨이트
- 위치: `src/design-system/tokens/` (colors.css, typography.css)
- 한계: dimension/spacing/shadow 토큰 부재, flat 구조

---

## 3. 가정 (Assumptions)

- A1: SPEC-DS-004의 13개 컴포넌트와 CVA 패턴이 안정적으로 작동 중이다
- A2: aurora-skin-main은 JavaScript(JSX) 프로젝트로 유지된다 (TypeScript 전환은 별도 SPEC)
- A3: 다크모드는 현재 불필요하나, 토큰 구조상 향후 지원 가능해야 한다
- A4: seed.design npm 패키지를 직접 의존성으로 추가하지 않는다
- A5: Tailwind CSS 3을 유지한다 (Tailwind 4 마이그레이션은 별도 검토)
- A6: 기존 `--po-*` CSS 변수를 사용하는 코드는 즉시 변경하지 않으며, alias를 통해 호환성을 보장한다

---

## 4. 요구사항 (Requirements) -- EARS Format

### REQ-001: 토큰 기반 구축 (3-Tier Token Architecture)

시스템은 **항상** 3계층 토큰 구조(Palette/Semantic/Component)를 통해 디자인 값을 관리해야 한다.

**WHEN** 새로운 디자인 값이 필요할 때 **THEN** 시스템은 Tier 1(Palette) -> Tier 2(Semantic) -> Tier 3(Component) 순서로 토큰을 정의하고, 하위 계층은 반드시 상위 계층을 참조해야 한다.

| 계층 | 역할 | 네이밍 패턴 | 예시 |
|------|------|-------------|------|
| Tier 1: Palette | 원시 색상/값 정의 | `--huni-palette-{color}-{scale}` | `--huni-palette-purple-600: #5538B6` |
| Tier 2: Semantic | 의미적 역할 매핑 | `--huni-{category}-{role}` | `--huni-fg-brand: var(--huni-palette-purple-600)` |
| Tier 3: Component | 컴포넌트별 토큰 | `--huni-{component}-{slot}-{state}` | `--huni-chip-border-selected: var(--huni-stroke-brand-solid)` |

**세부 요구사항**:

- REQ-001-1: Palette 토큰은 Purple(브랜드), Gray, Gold, Teal, Red, Green 팔레트를 각 11단계(00~1000) 스케일로 정의한다
- REQ-001-2: Semantic 토큰은 fg(foreground), bg(background), stroke 카테고리로 분류하며, seed.design의 네이밍 패턴을 따른다
- REQ-001-3: Component 토큰은 인쇄 도메인 전용 토큰(용지 사이즈, 인쇄 마진, bleed)을 포함한다
- REQ-001-4: 토큰 참조 방향은 Tier 3 -> Tier 2 -> Tier 1 단방향만 허용하며, 순환 참조를 금지한다
- REQ-001-5: Typography 토큰은 seed.design의 t1-t7 스케일 패턴을 차용하여 정의한다
- REQ-001-6: Spacing 토큰은 seed.design의 x-scale 패턴(x1=4px, x2=8px, ...)을 차용하여 정의한다

### REQ-002: Tailwind 통합 (Huni Tailwind Plugin)

**WHEN** 컴포넌트에서 디자인 토큰을 사용할 때 **THEN** Huni Tailwind 플러그인을 통해 `--huni-*` CSS 변수를 Tailwind 유틸리티 클래스로 사용할 수 있어야 한다.

**세부 요구사항**:

- REQ-002-1: `src/design-system/tailwind-plugin.js`에 Huni 전용 Tailwind 플러그인을 작성한다
- REQ-002-2: Semantic 색상 토큰을 Tailwind `colors` 확장에 매핑한다 (예: `bg-huni-bg-brand`, `text-huni-fg-neutral`)
- REQ-002-3: Spacing 토큰을 Tailwind `spacing` 확장에 매핑한다 (예: `p-huni-x4`, `gap-huni-x2`)
- REQ-002-4: Border-radius 토큰을 Tailwind `borderRadius` 확장에 매핑한다
- REQ-002-5: Typography 유틸리티 클래스를 `addComponents`로 등록한다 (예: `.huni-t1-regular`, `.huni-t3-bold`)
- REQ-002-6: `tailwind.config.js`에 Huni 플러그인을 등록하여 기존 Tailwind 설정과 공존한다

### REQ-003: 컴포넌트 레시피 체계화 (CVA Variant Standardization)

**WHEN** 컴포넌트 variant를 정의할 때 **THEN** CVA 레시피 패턴에서 seed.design의 defineRecipe 구조(base/variants/compoundVariants/defaultVariants)를 따르는 표준화된 variant 체계를 사용해야 한다.

**세부 요구사항**:

- REQ-003-1: 공통 state variant를 표준화한다 (default, selected, disabled, hover)
- REQ-003-2: 공통 size variant를 표준화한다 (sm, md, lg)
- REQ-003-3: 인쇄 도메인 전용 variant를 정의한다 (paperSize, printType 등)
- REQ-003-4: compoundVariants 패턴을 도입하여 복합 상태 스타일링을 체계화한다
- REQ-003-5: 모든 CVA 레시피에서 `--po-*` 직접 참조를 `--huni-*` 토큰 또는 Tailwind 유틸리티로 교체한다

### REQ-004: 빌드 파이프라인 (Build Pipeline Integration)

시스템은 **항상** CSS 변수 파일을 `globals.css`에서 올바른 순서로 import하여 토큰 시스템이 작동해야 한다.

**세부 요구사항**:

- REQ-004-1: `globals.css`에서 토큰 파일 import 순서를 보장한다: huni-tokens.css -> compat-aliases.css -> Tailwind directives
- REQ-004-2: Webpack 빌드 시 CSS 변수 파일이 올바르게 번들링된다
- REQ-004-3: 향후 50+ 컴포넌트 도달 시 YAML -> CSS 자동 변환 스크립트 확장이 가능한 구조를 유지한다
- REQ-004-4: seed.design의 webpack-plugin은 사용하지 않는다 (다크모드 토글 불필요)

### REQ-005: SPEC-SKIN 영향도 관리 (Cross-SPEC Impact Management)

**WHEN** 디자인시스템 토큰 체계가 변경될 때 **THEN** 기존 SPEC-SKIN-000~008의 기술 스택 참조와 CSS 변수 참조가 일관되게 업데이트되어야 한다.

**세부 요구사항**:

- REQ-005-1: `--po-*` -> `--huni-*` 호환 alias 레이어를 제공하여, 기존 SPEC 구현물이 변경 없이 작동한다
- REQ-005-2: 각 SPEC-SKIN의 기술 스택 문서에 Huni Design System v2.0 참조를 추가한다
- REQ-005-3: 새로 구현하는 SPEC-SKIN은 `--huni-*` 토큰만 사용하도록 가이드한다
- REQ-005-4: 완료된 SPEC-SKIN-004의 컴포넌트는 Phase 2에서 토큰 마이그레이션한다

---

## 5. 사양 (Specifications)

### 5.1 토큰 파일 구조

```
src/design-system/
  tokens/
    huni-tokens.css           # 3-tier 토큰 정의 (palette, semantic, component, typography, spacing, radius, shadow, print)
    compat-aliases.css        # --po-* -> --huni-* 호환 alias 레이어
    colors.css                # [DEPRECATED] Phase 3에서 제거 예정
    typography.css            # [DEPRECATED] Phase 3에서 제거 예정
  tailwind-plugin.js          # Huni Tailwind 플러그인
  components/
    atoms/                    # BadgeLabel, InfoTooltip, ColorChip
    molecules/                # SizeOptionChip, RadioOption, DropdownSelect, CounterOption, SizeInput, QuantityInput, CTAButton, OptionLabel
    organisms/                # CollapsibleSection, PriceSummary
```

### 5.2 Tier 1: Palette Token 사양

| 팔레트 | 스케일 | 브랜드 Primary | 용도 |
|--------|--------|----------------|------|
| Purple | 00~1000 (11단계) | 600 = #5538B6 | 브랜드 메인 컬러 |
| Gray | 00~1000 (11단계) | - | 중성 컬러, 배경, 텍스트 |
| Gold | 500 | #E6B93F | 액센트 (박 가공 등) |
| Teal | 500 | #7AC8C4 | 액센트 |
| Red | 500 | #EF4444 | 오류/위험 상태 |
| Green | 500 | #22C55E | 성공/긍정 상태 |

### 5.3 Tier 2: Semantic Token 카테고리

| 카테고리 | 접두사 | 토큰 수 (예상) | 예시 |
|---------|--------|---------------|------|
| Foreground | `--huni-fg-*` | 7 | fg-brand, fg-neutral, fg-disabled |
| Background | `--huni-bg-*` | 5 | bg-brand-solid, bg-brand-weak, bg-layer-default |
| Stroke | `--huni-stroke-*` | 4 | stroke-brand-solid, stroke-neutral |
| Typography | `--huni-font-*` | 13 | font-family, font-size-t1~t7, font-weight-* |
| Spacing | `--huni-spacing-*` | 7 | spacing-x1~x8 |
| Radius | `--huni-radius-*` | 4 | radius-r1~r3, radius-full |
| Shadow | `--huni-shadow-*` | 2 | shadow-s1, shadow-s2 |

### 5.4 Tier 3: 인쇄 도메인 전용 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--huni-print-paper-a4-w` | 210mm | A4 용지 너비 |
| `--huni-print-paper-a4-h` | 297mm | A4 용지 높이 |
| `--huni-print-paper-a3-w` | 297mm | A3 용지 너비 |
| `--huni-print-paper-a3-h` | 420mm | A3 용지 높이 |
| `--huni-print-margin-default` | 10mm | 기본 인쇄 마진 |
| `--huni-print-margin-narrow` | 5mm | 좁은 인쇄 마진 |
| `--huni-print-bleed` | 3mm | 재단 여백 |

### 5.5 `--po-*` -> `--huni-*` Alias Mapping (핵심)

| 기존 변수 | 새 토큰 참조 |
|-----------|-------------|
| `--po-primary` | `var(--huni-palette-purple-600)` |
| `--po-primary-dark` | `var(--huni-palette-purple-700)` |
| `--po-text-dark` | `var(--huni-fg-neutral-muted)` |
| `--po-text-medium` | `var(--huni-fg-neutral-subtle)` |
| `--po-border-default` | `var(--huni-stroke-neutral)` |
| `--po-bg-white` | `var(--huni-bg-layer-default)` |
| `--po-font-family` | `var(--huni-font-family)` |
| `--po-text-sm` | `var(--huni-font-size-t2)` |

(전체 매핑은 architecture.md Section 3 참조)

---

## 6. SPEC-SKIN-000~008 업데이트 영향도 매트릭스

### 6.1 기술 스택 업데이트 필요 여부

| SPEC ID | 현재 상태 | 기술 스택 업데이트 | 토큰 참조 업데이트 | CVA 레시피 마이그레이션 | DS-005 차단 여부 |
|---------|----------|-------------------|-------------------|----------------------|-----------------|
| SPEC-SKIN-000 | Draft | 필요 (DS v2.0 참조 추가) | 해당 없음 (마스터플랜) | 해당 없음 | 비차단 |
| SPEC-SKIN-001 | Draft | 필요 | 신규 구현 시 `--huni-*` 직접 사용 | 신규 구현 시 표준 레시피 적용 | 비차단 (Phase 1 후 진행 권장) |
| SPEC-SKIN-002 | Draft | 필요 | 신규 구현 시 `--huni-*` 직접 사용 | 신규 구현 시 표준 레시피 적용 | 비차단 (Phase 1 후 진행 권장) |
| SPEC-SKIN-003 | Draft | 필요 | 신규 구현 시 `--huni-*` 직접 사용 | 신규 구현 시 표준 레시피 적용 | 비차단 (Phase 1 후 진행 권장) |
| SPEC-SKIN-004 | **Completed** | 필요 (문서만) | Phase 2에서 마이그레이션 | Phase 3에서 레시피 표준화 | 비차단 (alias 보장) |
| SPEC-SKIN-005 | Draft | 필요 | 관리자 영역 shadcn/ui 별도 | 해당 없음 (shadcn/ui 패턴) | 비차단 |
| SPEC-SKIN-006 | Draft | 필요 | 관리자 영역 shadcn/ui 별도 | 해당 없음 | 비차단 |
| SPEC-SKIN-007 | Draft | 필요 | 관리자 영역 shadcn/ui 별도 | 해당 없음 | 비차단 |
| SPEC-SKIN-008 | Draft | 필요 | 관리자 영역 shadcn/ui 별도 | 해당 없음 | 비차단 |

### 6.2 영향 분석 요약

**사용자 영역 (SPEC-SKIN-001~004)**:
- SPEC-SKIN-004는 이미 Completed 상태이므로, `--po-*` alias가 핵심 -- alias 레이어가 깨지면 기존 구현이 망가짐
- SPEC-SKIN-001~003은 Draft 상태이므로, DS-005 Phase 1 완료 후 구현하면 처음부터 `--huni-*` 토큰 사용 가능
- 권장 마이그레이션 순서: DS-005 Phase 1 -> SKIN-001~003 구현 -> DS-005 Phase 2 (SKIN-004 토큰 마이그레이션)

**관리자 영역 (SPEC-SKIN-005~008)**:
- 관리자 영역은 shadcn/ui + Tailwind CSS 별도 체계를 사용하므로, DS-005의 직접적 영향은 제한적
- 다만 기술 스택 문서에 Huni Design System v2.0 참조를 추가하여 일관성 유지

### 6.3 TypeScript 마이그레이션 평가

| 항목 | 평가 |
|------|------|
| **장점** | 타입 안전 토큰, IDE 자동완성, seed.design 타입 시스템 활용, 리팩토링 안전성 |
| **단점** | 전체 코드베이스 마이그레이션 필요, 빌드 설정 변경, 학습 비용 |
| **현재 상태** | aurora-skin은 JavaScript(JSX), Babel 기반 |
| **권장** | **별도 SPEC으로 분리하여 검토** -- DS-005와 동시 진행 시 복잡도 과다. DS-005는 JavaScript 환경에서 완료하고, 이후 TypeScript 마이그레이션을 SPEC-TS-001로 별도 계획 |

---

## 7. 기술 결정 기록 (Technology Decision Records)

### TDR-001: `--huni-*` 네임스페이스 사용

- **결정**: CSS 변수 접두사로 `--huni-*` 사용
- **대안 검토**: `--seed-*` (seed.design 충돌), `--po-*` (범위 제한), `--ds-*` (범용적)
- **근거**: Huni Printing 브랜드 아이덴티티 반영, seed.design과 충돌 방지

### TDR-002: seed.design 패키지 직접 의존 배제

- **결정**: `@seed-design/*` npm 패키지를 dependencies에 추가하지 않음
- **근거**: 당근 브랜드 토큰과의 강결합 회피, JavaScript 프로젝트에서 TypeScript 생성물 불필요

### TDR-003: YAML 토큰 파이프라인 보류

- **결정**: 현 단계에서 YAML-to-CSS 자동 변환 파이프라인 미구축
- **근거**: 13개 컴포넌트에 대해 자동화 파이프라인은 과도한 엔지니어링. 50+ 컴포넌트 도달 시 재검토

### TDR-004: CVA 레시피 패턴 유지

- **결정**: seed.design의 `defineRecipe`가 아닌 기존 CVA 패턴 유지 확장
- **근거**: SPEC-DS-004에서 이미 13개 컴포넌트에 적용됨. CVA와 defineRecipe는 구조적으로 동일

### TDR-005: TypeScript 마이그레이션 별도 SPEC 분리

- **결정**: DS-005에서는 TypeScript 도입하지 않음. 별도 SPEC-TS-001로 계획
- **근거**: JS -> TS 전환은 디자인시스템과 별개의 대규모 작업. 동시 진행 시 리스크 과다

---

## 8. 위험 분석

| 위험 | 영향 | 발생 확률 | 대응 |
|------|------|-----------|------|
| CSS 변수 순환 참조 | 높음 | 낮음 | Tier 간 참조 방향 엄격 제한 (하위 -> 상위만) |
| `--po-*` alias 누락 | 높음 | 중간 | Phase 1 완료 시 전체 컴포넌트 렌더링 검증 |
| Tailwind JIT가 CSS 변수 인식 실패 | 중간 | 낮음 | 플러그인에서 명시적 매핑, `[var(...)]` 백업 |
| 기존 aurora-skin CSS 변수와 충돌 | 높음 | 낮음 | `--huni-*` 네임스페이스로 완전 격리 |
| shadcn/ui 스타일 충돌 | 중간 | 낮음 | shadcn/ui는 admin 영역, Huni DS는 user 영역으로 범위 분리 |
| 인쇄 도메인 토큰 설계 부족 | 중간 | 중간 | Phase 1에서 기본 세트, Phase 4에서 확장 |

---

## 9. Traceability

| 요구사항 | 리서치 근거 | 구현 대상 파일 |
|---------|------------|---------------|
| REQ-001 | research.md Section 1.1, benchmarks.md Section 1.3 | huni-tokens.css |
| REQ-002 | research.md Section 1.2, benchmarks.md Section 5.2 | tailwind-plugin.js, tailwind.config.js |
| REQ-003 | research.md Section 1.4, architecture.md Section 5 Phase 3 | components/**/*.jsx |
| REQ-004 | architecture.md Section 4 | globals.css |
| REQ-005 | architecture.md Section 6 | compat-aliases.css, SPEC-SKIN-*/spec.md |
