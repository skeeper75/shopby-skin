# SPEC-DS-005: 구현 계획

> **SPEC ID**: SPEC-DS-005
> **문서 유형**: Implementation Plan
> **작성일**: 2026-03-17

---

## 1. Phase 개요

| Phase | 제목 | 우선순위 | 주요 산출물 |
|-------|------|---------|------------|
| Phase 1 | Token Foundation | Primary Goal | 3-tier 토큰, Tailwind 플러그인, alias 레이어 |
| Phase 2 | Component Token Migration | Secondary Goal | 13개 컴포넌트 `--po-*` -> `--huni-*` 전환 |
| Phase 3 | Recipe System Enhancement | Secondary Goal | CVA variant 표준화, 복합 variant 도입 |
| Phase 4 | Extended Component Library | Optional Goal | 11개 상품 타입 섹션 컴포넌트 확장 |

---

## 2. Phase 1: Token Foundation (Primary Goal)

### 목표

새로운 3-tier 토큰 시스템을 생성하고, 기존 `--po-*` 변수와의 호환 alias를 설정하며, Huni 전용 Tailwind 플러그인을 작성한다. **기존 컴포넌트가 변경 없이 정상 렌더링**되는 것이 핵심 완료 조건이다.

### Milestone 1-1: Tier 1 Palette 토큰 정의

**대상 파일**: `src/design-system/tokens/huni-tokens.css` (신규)

- [ ] Purple 팔레트 11단계 (00~1000) 정의 -- 브랜드 Primary #5538B6 기준
- [ ] Gray 팔레트 11단계 정의
- [ ] Accent 팔레트 정의 (Gold, Teal, Red, Green)

### Milestone 1-2: Tier 2 Semantic 토큰 정의

**대상 파일**: `src/design-system/tokens/huni-tokens.css` (계속)

- [ ] Foreground 토큰 7종 (fg-brand, fg-neutral, fg-neutral-muted, fg-neutral-subtle, fg-disabled, fg-placeholder, fg-brand-contrast)
- [ ] Background 토큰 5종 (bg-brand-solid, bg-brand-weak, bg-layer-default, bg-layer-fill, bg-disabled)
- [ ] Stroke 토큰 4종 (stroke-brand-solid, stroke-brand-weak, stroke-neutral, stroke-neutral-subtle)
- [ ] Typography 토큰 (font-family, font-size-t1~t7, font-weight-regular/medium/bold)
- [ ] Spacing 토큰 (spacing-x1~x8)
- [ ] Radius 토큰 (radius-r1~r3, radius-full)
- [ ] Shadow 토큰 (shadow-s1, shadow-s2)

### Milestone 1-3: Tier 3 Component + Print 토큰 정의

**대상 파일**: `src/design-system/tokens/huni-tokens.css` (계속)

- [ ] Chip 컴포넌트 토큰 (bg, border, text -- default/selected 상태)
- [ ] CTA 버튼 토큰 (bg, text)
- [ ] Input 컴포넌트 토큰 (border, border-focus, bg)
- [ ] 인쇄 전용 토큰 (paper sizes A3/A4/B5, margin, bleed)

### Milestone 1-4: 호환 Alias 레이어

**대상 파일**: `src/design-system/tokens/compat-aliases.css` (신규)

- [ ] `--po-primary*` -> `--huni-palette-purple-*` 매핑 (7종)
- [ ] `--po-text-*` -> `--huni-fg-*` 매핑 (3종)
- [ ] `--po-border-*` -> `--huni-stroke-*` 매핑
- [ ] `--po-bg-*` -> `--huni-bg-*` 매핑 (4종)
- [ ] `--po-font-*` -> `--huni-font-*` 매핑 (타이포그래피 전체)
- [ ] `--po-accent-*` -> `--huni-palette-*` 매핑 (2종)

### Milestone 1-5: Huni Tailwind 플러그인

**대상 파일**: `src/design-system/tailwind-plugin.js` (신규)

- [ ] Semantic 색상 -> Tailwind `theme.extend.colors` 매핑
- [ ] Spacing -> Tailwind `theme.extend.spacing` 매핑
- [ ] Border-radius -> Tailwind `theme.extend.borderRadius` 매핑
- [ ] Typography 유틸리티 클래스 -> `addComponents` 등록

**대상 파일**: `tailwind.config.js` (수정)

- [ ] Huni 플러그인 등록 (기존 tailwindcss-animate와 공존)

### Milestone 1-6: globals.css Import 통합

**대상 파일**: `src/globals.css` (수정)

- [ ] `@import './design-system/tokens/huni-tokens.css'` 추가
- [ ] `@import './design-system/tokens/compat-aliases.css'` 추가
- [ ] import 순서 보장: huni-tokens -> compat-aliases -> Tailwind directives

### Phase 1 완료 조건

- [ ] 기존 13개 컴포넌트가 `--po-*` alias를 통해 변경 없이 정상 렌더링
- [ ] Tailwind 유틸리티 클래스 `bg-huni-bg-brand`, `text-huni-fg-neutral` 등 사용 가능
- [ ] CSS 변수 순환 참조 없음
- [ ] Webpack 빌드 정상 동작

---

## 3. Phase 2: Component Token Migration (Secondary Goal)

### 목표

기존 13개 컴포넌트의 하드코딩된 `--po-*` 참조를 `--huni-*` Semantic 토큰 또는 Tailwind 유틸리티로 교체한다.

### 전제조건

- Phase 1 완료

### Milestone 2-1: Atoms 마이그레이션 (3종)

- [ ] BadgeLabel.jsx -- `--po-primary` -> `bg-huni-bg-brand` / `text-huni-fg-brand-contrast`
- [ ] InfoTooltip.jsx -- `--po-text-medium` -> `text-huni-fg-neutral-subtle`
- [ ] ColorChip.jsx -- inline color 유지 (동적 색상)

### Milestone 2-2: Molecules 마이그레이션 (8종)

- [ ] OptionLabel.jsx
- [ ] SizeOptionChip.jsx -- `border-[var(--po-border-default)]` -> `border-huni-stroke-neutral`
- [ ] RadioOption.jsx
- [ ] DropdownSelect.jsx
- [ ] CounterOption.jsx
- [ ] SizeInput.jsx
- [ ] QuantityInput.jsx
- [ ] CTAButton.jsx -- `bg-[var(--po-primary)]` -> `bg-huni-bg-brand`

### Milestone 2-3: Organisms 마이그레이션 (2종)

- [ ] CollapsibleSection.jsx
- [ ] PriceSummary.jsx

### Phase 2 완료 조건

- [ ] 모든 컴포넌트가 `--huni-*` 토큰만 사용
- [ ] `--po-*` 직접 참조 0건 (Grep 검증)
- [ ] 시각적 변화 없음 (스크린샷 비교)

---

## 4. Phase 3: Recipe System Enhancement (Secondary Goal)

### 목표

seed.design의 recipe 패턴을 참고하여 CVA variant 정의를 체계화한다.

### 전제조건

- Phase 2 완료

### Milestone 3-1: 공통 Variant 표준화

- [ ] state variant 표준 정의 (default, selected, disabled, hover)
- [ ] size variant 표준 정의 (sm, md, lg)
- [ ] compoundVariants 패턴 도입
- [ ] defaultVariants 체계화

### Milestone 3-2: 인쇄 도메인 Variant

- [ ] paperSize variant (A4, A3, B5, custom)
- [ ] printType variant (digital, offset, screen)
- [ ] finishType variant (lamination, foil, emboss)

### Phase 3 완료 조건

- [ ] 모든 CVA 레시피가 표준 variant 체계를 따름
- [ ] 인쇄 도메인 variant가 정의되어 확장 컴포넌트에서 사용 가능

---

## 5. Phase 4: Extended Component Library (Optional Goal)

### 목표

나머지 11개 상품 타입 섹션 컴포넌트를 확장하고, 인쇄 도메인 고급 컴포넌트를 추가한다.

### 전제조건

- Phase 1 완료 (최소), Phase 3 완료 (권장)

### 대상 컴포넌트

- [ ] 상품 타입별 섹션 컴포넌트 (BOOK, STATIONERY, CALENDAR, STICKER 등)
- [ ] 인쇄 미리보기 컴포넌트
- [ ] 파일 업로드/프리뷰 컴포넌트
- [ ] 가격 계산 컴포넌트
- [ ] 인쇄 옵션 요약 컴포넌트

---

## 6. SPEC-SKIN 업데이트 계획

### 권장 마이그레이션 순서

```
DS-005 Phase 1 완료 (토큰 기반 + alias)
    |
    |-- SPEC-SKIN-001 구현 (인증/회원가입) -- --huni-* 토큰 직접 사용
    |-- SPEC-SKIN-002 구현 (마이페이지) -- --huni-* 토큰 직접 사용
    |-- SPEC-SKIN-003 구현 (상품/주문/결제) -- --huni-* 토큰 직접 사용
    |
DS-005 Phase 2 완료 (컴포넌트 토큰 마이그레이션)
    |
    |-- SPEC-SKIN-004 토큰 마이그레이션 (Completed -> 토큰만 교체)
    |
DS-005 Phase 3 완료 (레시피 표준화)
    |
    |-- SPEC-SKIN-005~008 구현 (관리자 영역, shadcn/ui 별도 체계)
```

### 각 SPEC-SKIN 변경 내용

| SPEC | 변경 유형 | 변경 내용 |
|------|----------|----------|
| SPEC-SKIN-000 | 문서 업데이트 | 기술 스택에 "Huni Design System v2.0" 참조 추가 |
| SPEC-SKIN-001~003 | 구현 가이드 | 신규 구현 시 `--huni-*` 토큰 + Tailwind 유틸리티 사용 |
| SPEC-SKIN-004 | 토큰 마이그레이션 | Phase 2에서 `--po-*` -> `--huni-*` 교체 (13개 컴포넌트) |
| SPEC-SKIN-005~008 | 문서 업데이트 | 관리자 영역 기술 스택에 DS v2.0 참조 추가 |

---

## 7. TypeScript 마이그레이션 평가

### 현재 상태

- aurora-skin-main: JavaScript (ES6+, JSX), Babel 7.20.x 기반
- 모든 SPEC-SKIN-000~008: JavaScript 환경으로 설계됨
- seed.design: TypeScript-native (타입 안전 토큰, .d.ts 생성)

### 장단점 분석

| 항목 | 장점 | 단점 |
|------|------|------|
| 타입 안전성 | 토큰 오타 방지, IDE 자동완성 | 전체 코드베이스 마이그레이션 필요 |
| DX 향상 | 리팩토링 안전성, 컴파일 타임 오류 검출 | Babel -> TypeScript 빌드 파이프라인 변경 |
| seed.design 호환 | 타입 시스템 직접 활용 가능 | 학습 비용, tsconfig 관리 |
| 생태계 | 최신 라이브러리 TypeScript 우선 지원 추세 | 기존 .jsx 파일 전체 .tsx 변환 |

### 권장사항

**DS-005에서는 TypeScript를 도입하지 않는다.**

- DS-005는 CSS 변수 + Tailwind 플러그인 + CVA 패턴에 집중한다
- TypeScript 마이그레이션은 DS-005 완료 후 별도 SPEC-TS-001로 계획한다
- JS 환경에서도 JSDoc 타입 주석을 활용하면 IDE 지원을 부분적으로 확보할 수 있다

---

## 8. 아키텍처 설계 방향

### 토큰 참조 흐름

```
Tier 1 (Palette)        Tier 2 (Semantic)        Tier 3 (Component)
--------------------    --------------------      --------------------
--huni-palette-         --huni-fg-*               --huni-chip-*
  purple-600            --huni-bg-*               --huni-cta-*
  gray-900         <--  --huni-stroke-*      <--  --huni-input-*
  gold-500              --huni-font-*             --huni-print-*

                        Alias Layer
                        --------------------
                        --po-primary
                        --po-text-dark        --> Tier 1/2 참조
                        --po-border-default
```

### CSS Import 순서

```css
/* globals.css */
@import './design-system/tokens/huni-tokens.css';    /* Tier 1-3 토큰 정의 */
@import './design-system/tokens/compat-aliases.css';  /* --po-* -> --huni-* alias */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Tailwind 플러그인 구조

```
tailwind.config.js
  plugins: [
    require('tailwindcss-animate'),           // 기존
    require('./src/design-system/tailwind-plugin'),  // Huni 신규
  ]
```

---

## 9. 위험 분석 및 대응

| 위험 | 발생 확률 | 영향도 | 대응 전략 |
|------|-----------|--------|----------|
| `--po-*` alias 누락으로 기존 컴포넌트 깨짐 | 중간 | 높음 | Phase 1 완료 시 전체 컴포넌트 렌더링 검증 스크립트 실행 |
| CSS 변수 순환 참조 | 낮음 | 높음 | 코드 리뷰에서 Tier 간 참조 방향 검증 |
| Tailwind 플러그인과 기존 shadcn/ui 충돌 | 낮음 | 중간 | shadcn/ui는 admin 영역, Huni DS는 user 영역으로 범위 분리 |
| Phase 2 마이그레이션 시 시각적 변화 발생 | 중간 | 중간 | 컴포넌트별 스크린샷 비교 테스트 |
| 인쇄 도메인 토큰 설계 부족 | 중간 | 중간 | Phase 1에서 기본 세트만 정의, Phase 4에서 확장 |

---

## 10. MX Tag 계획

### Phase 1 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| `huni-tokens.css` | `@MX:ANCHOR` | 모든 컴포넌트가 참조하는 핵심 토큰 파일 (fan_in >= 13) |
| `compat-aliases.css` | `@MX:WARN` | 호환성 레이어 -- 값 변경 시 기존 컴포넌트 영향 |
| `tailwind-plugin.js` | `@MX:NOTE` | Tailwind 통합 로직 설명 |

### Phase 2 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| 각 컴포넌트 CVA 정의 | `@MX:NOTE` | 토큰 참조 체계 변경 기록 |

---

## 11. 전문가 상담 권장

### expert-frontend 상담 권장 (SPEC 생성 시)

- Tailwind 플러그인 설계 검증
- CSS 변수 -> Tailwind 유틸리티 매핑 패턴 최적화
- 컴포넌트 레시피(CVA) 표준화 방향

### design-uiux 상담 권장 (Phase 3)

- 토큰 네이밍 규칙의 디자인 시스템 관점 검증
- 접근성(a11y) 관점의 색상 토큰 대비비 검증
- 인쇄 도메인 UI 패턴의 UX 최적화
