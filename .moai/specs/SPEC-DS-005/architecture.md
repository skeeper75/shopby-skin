# SPEC-DS-005: Huni Printing Design System - seed.design Architecture Integration

Created: 2026-03-17
SPEC Version: 1.0.0
Status: ARCHITECTURE DESIGN

---

## 1. Integration Strategy Comparison

### Option A: Direct Package Consumption

seed.design npm 패키지를 직접 설치하여 사용하는 접근법.

| 항목 | 평가 |
|------|------|
| **개요** | `@seed-design/css`, `@seed-design/tailwind3-plugin`, `@seed-design/webpack-plugin` 설치 후 토큰 오버라이드 |
| **장점** | 최소 설정, 자동 업데이트, 커뮤니티 지원 |
| **단점** | 당근 브랜드 토큰(carrot orange) 강결합, Huni 보라색(#5538B6) 브랜드와 충돌, 인쇄 도메인 토큰 부재 |
| **노력** | 낮음 (1-2일 설정) |
| **유지보수** | 낮음 (업스트림 추종) |
| **유연성** | 매우 낮음 - 당근 시맨틱 토큰이 하드코딩 |
| **위험** | **높음** - Karrot 릴리즈에 종속, 인쇄 도메인 토큰 추가 불가, 브랜드 색상 오버라이드 복잡 |

**결정적 문제**: `@seed-design/css`는 CSS 변수명에 `--seed-color-` 접두사를 사용하며, 색상 값이 당근(Karrot) 브랜드에 맞춰져 있다. `fg-brand`, `bg-brand-solid` 등의 시맨틱 토큰이 당근 오렌지(#ff6600)로 정의되어 있어, 단순 CSS 오버라이드로는 Huni의 #5538B6 브랜드를 일관되게 적용하기 어렵다.

### Option B: Architecture Fork (Pipeline Only)

rootage-qvism 파이프라인 컨셉을 포크하여 완전히 독립적인 디자인 시스템 구축.

| 항목 | 평가 |
|------|------|
| **개요** | seed.design의 YAML-to-CSS 파이프라인 구조를 참고하여 huni-rootage YAML + huni-qvism recipe 구축 |
| **장점** | 완전한 제어, Huni 브랜드 최적화, 인쇄 도메인 토큰 자유 정의 |
| **단점** | 높은 초기 구축 비용, rootage CLI 도구 자체 개발 필요, 유지보수 부담 |
| **노력** | 매우 높음 (2-4주) |
| **유지보수** | 높음 (파이프라인 전체 자체 관리) |
| **유연성** | 매우 높음 |
| **위험** | **높음** - 과도한 엔지니어링, seed.design 발전 따라가기 어려움 |

**결정적 문제**: 1인 개발 프로젝트에서 전체 디자인 시스템 파이프라인을 자체 구축하는 것은 비효율적이다. rootage CLI의 YAML 파싱, CSS 생성, Tailwind 플러그인 생성 로직을 모두 재구현해야 한다.

### Option C: Hybrid (Infrastructure + Custom Tokens) - **권장**

seed.design의 아키텍처 패턴과 빌드 인프라를 차용하되, 토큰과 레시피는 Huni 전용으로 정의하는 접근법.

| 항목 | 평가 |
|------|------|
| **개요** | seed.design의 토큰 구조(YAML), 레시피 패턴(CVA/defineRecipe), Tailwind 플러그인 패턴을 참고하여 Huni 전용 토큰 시스템 구축. 기존 aurora-skin CSS 변수 호환 레이어 유지. |
| **장점** | 검증된 패턴 활용, Huni 브랜드 최적화, 인쇄 도메인 토큰 자유 정의, 점진적 마이그레이션 가능 |
| **단점** | 초기 토큰 매핑 작업, 이중 토큰 시스템 임시 운영 |
| **노력** | 중간 (1-2주) |
| **유지보수** | 중간 (토큰 파일만 관리) |
| **유연성** | 높음 |
| **위험** | **낮음** - 점진적 마이그레이션으로 리스크 분산 |

### Trade-off Matrix (가중 평가)

| 기준 (가중치) | Option A | Option B | Option C |
|---------------|----------|----------|----------|
| 구현 비용 (20%) | 9 | 2 | 6 |
| 유지보수성 (25%) | 4 | 3 | 7 |
| 유연성 (20%) | 2 | 9 | 8 |
| 위험도 (20%) | 3 | 4 | 8 |
| 확장성 (15%) | 3 | 8 | 7 |
| **가중 합계** | **4.15** | **4.85** | **7.20** |

---

## 2. Recommended Approach: Option C (Hybrid)

### 핵심 원칙

1. **패턴 차용, 패키지 비의존**: seed.design의 토큰 구조 패턴(3-tier: palette -> semantic -> component)을 차용하되, npm 패키지 의존성은 만들지 않는다.
2. **CVA 레시피 시스템 유지**: 이미 SPEC-DS-004에서 `class-variance-authority`로 구축한 레시피 패턴을 그대로 확장한다.
3. **CSS 변수 기반 토큰**: seed.design이 CSS Custom Properties를 활용하는 동일한 접근법으로, Huni 전용 네임스페이스(`--huni-*`)를 사용한다.
4. **기존 `--po-*` 변수 호환**: 기존 SPEC-DS-004 컴포넌트가 사용하는 `--po-*` CSS 변수에 대한 alias를 유지하여 무중단 마이그레이션을 보장한다.
5. **Tailwind 통합 강화**: seed.design의 tailwind3-plugin 패턴을 참고하여 Huni 전용 Tailwind 플러그인을 작성한다.

### 왜 Option C인가 (Rationale)

- **현재 상태와의 정합성**: SPEC-DS-004에서 CVA + Tailwind CSS + CSS 변수 패턴이 이미 작동 중이다. 이 기반 위에서 체계적으로 확장하는 것이 자연스럽다.
- **seed.design 학습 효과**: seed.design의 3-tier 토큰 구조(palette -> semantic -> component)와 YAML 스키마 패턴을 학습하여 더 체계적인 토큰 관리를 도입할 수 있다.
- **인쇄 도메인 특화**: 용지 사이즈, 인쇄 마진, 후가공 옵션 등 인쇄 도메인 전용 토큰은 어떤 범용 디자인 시스템에도 없으므로, 반드시 자체 정의가 필요하다.
- **JavaScript 프로젝트 호환**: aurora-skin-main은 TypeScript가 아닌 JavaScript(JSX) 프로젝트이므로, seed.design의 TypeScript 기반 타입 시스템을 그대로 가져올 수 없다.

---

## 3. Token Architecture Design

### 3-Tier Token Hierarchy

seed.design의 토큰 구조를 참고하여 Huni 전용 3계층 토큰 시스템을 설계한다.

```
Tier 1: Global (Palette)           Tier 2: Semantic              Tier 3: Component
────────────────────────          ──────────────────────        ──────────────────────
--huni-palette-purple-500         --huni-fg-brand               --huni-chip-bg-selected
--huni-palette-purple-600         --huni-bg-brand-solid         --huni-chip-border-selected
--huni-palette-gray-100           --huni-fg-neutral             --huni-cta-bg
--huni-palette-gray-900           --huni-bg-layer-default       --huni-input-border-focus
...                               --huni-stroke-neutral         ...
```

### Tier 1: Global Palette Tokens

Huni 브랜드 색상 팔레트 정의. seed.design의 11단계 스케일(00~1000)과 동일한 구조를 사용한다.

```css
:root {
  /* Purple (Huni Brand) - 11단계 */
  --huni-palette-purple-00: #FCFAFF;
  --huni-palette-purple-100: #EEEBF9;
  --huni-palette-purple-200: #DED7F4;
  --huni-palette-purple-300: #C9C2DF;
  --huni-palette-purple-400: #9580D9;
  --huni-palette-purple-500: #7B68C4;
  --huni-palette-purple-600: #5538B6;   /* Brand Primary */
  --huni-palette-purple-700: #3B2573;
  --huni-palette-purple-800: #2A1A52;
  --huni-palette-purple-900: #1A0F33;
  --huni-palette-purple-1000: #0D0719;

  /* Gray - seed.design과 동일 구조 */
  --huni-palette-gray-00: #FFFFFF;
  --huni-palette-gray-100: #F7F8F9;
  --huni-palette-gray-200: #F3F4F5;
  --huni-palette-gray-300: #EEEFF1;
  --huni-palette-gray-400: #DCDEE3;
  --huni-palette-gray-500: #D1D3D8;
  --huni-palette-gray-600: #B0B3BA;
  --huni-palette-gray-700: #868B94;
  --huni-palette-gray-800: #555D6D;
  --huni-palette-gray-900: #2A3038;
  --huni-palette-gray-1000: #1A1C20;

  /* Accent Colors */
  --huni-palette-gold-500: #E6B93F;
  --huni-palette-teal-500: #7AC8C4;
  --huni-palette-red-500: #EF4444;
  --huni-palette-green-500: #22C55E;
}
```

### Tier 2: Semantic Tokens

seed.design의 fg/bg/stroke 네이밍 패턴을 차용. 이 계층이 테마 전환(future dark mode) 시 변경되는 계층이다.

```css
:root {
  /* Foreground */
  --huni-fg-brand: var(--huni-palette-purple-600);
  --huni-fg-brand-contrast: var(--huni-palette-gray-00);
  --huni-fg-neutral: var(--huni-palette-gray-900);
  --huni-fg-neutral-muted: var(--huni-palette-gray-800);
  --huni-fg-neutral-subtle: var(--huni-palette-gray-700);
  --huni-fg-disabled: var(--huni-palette-gray-500);
  --huni-fg-placeholder: var(--huni-palette-gray-600);

  /* Background */
  --huni-bg-brand-solid: var(--huni-palette-purple-600);
  --huni-bg-brand-weak: var(--huni-palette-purple-100);
  --huni-bg-layer-default: var(--huni-palette-gray-00);
  --huni-bg-layer-fill: var(--huni-palette-gray-200);
  --huni-bg-disabled: var(--huni-palette-gray-200);

  /* Stroke */
  --huni-stroke-brand-solid: var(--huni-palette-purple-600);
  --huni-stroke-brand-weak: var(--huni-palette-purple-400);
  --huni-stroke-neutral: var(--huni-palette-gray-400);
  --huni-stroke-neutral-subtle: var(--huni-palette-gray-300);

  /* Typography */
  --huni-font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
  --huni-font-weight-regular: 400;
  --huni-font-weight-medium: 500;
  --huni-font-weight-bold: 700;

  /* Font Size Scale (seed.design t1-t10 패턴 참고) */
  --huni-font-size-t1: 11px;
  --huni-font-size-t2: 12px;
  --huni-font-size-t3: 13px;
  --huni-font-size-t4: 14px;
  --huni-font-size-t5: 16px;
  --huni-font-size-t6: 18px;
  --huni-font-size-t7: 20px;

  /* Spacing (seed.design x-scale 패턴 참고) */
  --huni-spacing-x1: 4px;
  --huni-spacing-x2: 8px;
  --huni-spacing-x3: 12px;
  --huni-spacing-x4: 16px;
  --huni-spacing-x5: 20px;
  --huni-spacing-x6: 24px;
  --huni-spacing-x8: 32px;

  /* Border Radius (seed.design r-scale 패턴 참고) */
  --huni-radius-r1: 4px;
  --huni-radius-r2: 6px;
  --huni-radius-r3: 8px;
  --huni-radius-full: 9999px;

  /* Shadow */
  --huni-shadow-s1: 0 1px 2px rgba(0, 0, 0, 0.05);
  --huni-shadow-s2: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Tier 3: Component Tokens (인쇄 도메인 전용)

인쇄 도메인에 특화된 컴포넌트 수준 토큰.

```css
:root {
  /* Chip 컴포넌트 */
  --huni-chip-bg-default: var(--huni-bg-layer-default);
  --huni-chip-bg-selected: var(--huni-bg-layer-default);
  --huni-chip-border-default: var(--huni-stroke-neutral);
  --huni-chip-border-selected: var(--huni-stroke-brand-solid);
  --huni-chip-text-default: var(--huni-fg-neutral);
  --huni-chip-text-selected: var(--huni-fg-brand);

  /* CTA 버튼 */
  --huni-cta-bg: var(--huni-bg-brand-solid);
  --huni-cta-text: var(--huni-fg-brand-contrast);

  /* Input 컴포넌트 */
  --huni-input-border: var(--huni-stroke-neutral);
  --huni-input-border-focus: var(--huni-stroke-brand-solid);
  --huni-input-bg: var(--huni-bg-layer-default);

  /* 인쇄 전용 토큰 */
  --huni-print-paper-a4-w: 210mm;
  --huni-print-paper-a4-h: 297mm;
  --huni-print-paper-a3-w: 297mm;
  --huni-print-paper-a3-h: 420mm;
  --huni-print-paper-b5-w: 176mm;
  --huni-print-paper-b5-h: 250mm;
  --huni-print-margin-default: 10mm;
  --huni-print-margin-narrow: 5mm;
  --huni-print-bleed: 3mm;
}
```

### 기존 `--po-*` 변수와의 매핑 (Alias Layer)

SPEC-DS-004에서 사용 중인 `--po-*` 변수를 새로운 `--huni-*` 토큰으로 매핑하는 호환 레이어.

```css
/* === Backward Compatibility Aliases === */
:root {
  /* 색상 매핑: --po-* -> --huni-* */
  --po-primary: var(--huni-palette-purple-600);
  --po-primary-dark: var(--huni-palette-purple-700);
  --po-primary-secondary: var(--huni-palette-purple-400);
  --po-primary-light-1: var(--huni-palette-purple-300);
  --po-primary-light-2: var(--huni-palette-purple-200);
  --po-primary-light-3: var(--huni-palette-purple-100);
  --po-text-dark: var(--huni-fg-neutral-muted);
  --po-text-medium: var(--huni-fg-neutral-subtle);
  --po-text-muted: var(--huni-fg-disabled);
  --po-border-default: var(--huni-stroke-neutral);
  --po-bg-light: var(--huni-palette-gray-400);
  --po-bg-section: var(--huni-palette-gray-200);
  --po-bg-white: var(--huni-bg-layer-default);
  --po-accent-gold: var(--huni-palette-gold-500);
  --po-accent-teal: var(--huni-palette-teal-500);

  /* 타이포그래피 매핑 */
  --po-font-family: var(--huni-font-family);
  --po-text-xs: var(--huni-font-size-t1);
  --po-text-sm: var(--huni-font-size-t2);
  --po-text-base: var(--huni-font-size-t3);
  --po-text-md: var(--huni-font-size-t4);
  --po-text-lg: var(--huni-font-size-t5);
  --po-text-xl: var(--huni-font-size-t6);
  --po-text-2xl: var(--huni-font-size-t7);
  --po-font-normal: var(--huni-font-weight-regular);
  --po-font-medium: var(--huni-font-weight-medium);
  --po-font-bold: var(--huni-font-weight-bold);
}
```

---

## 4. Build Pipeline Design

### 4.1 Webpack Integration

aurora-skin-main은 Webpack 5 기반이다. seed.design의 webpack-plugin 패턴을 참고하되, 직접 패키지를 사용하지 않고 필요한 기능만 구현한다.

**seed.design webpack-plugin이 하는 일 분석**:
- `SeedDesignPlugin`은 HTML에 color-scheme meta tag와 theming script를 주입한다.
- 이것은 다크모드 토글을 위한 것으로, 현재 Huni에는 불필요하다.
- 따라서 webpack-plugin은 사용하지 않는다.

**실제 필요한 Webpack 변경**: CSS 변수 파일을 `globals.css`에 import하는 것만으로 충분하다.

```
// globals.css 변경
@import './design-system/tokens/huni-tokens.css';   // 새 토큰 시스템
@import './design-system/tokens/compat-aliases.css'; // --po-* 호환 레이어
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4.2 Tailwind Plugin Integration

seed.design의 `@seed-design/tailwind3-plugin` 패턴을 참고하여 Huni 전용 Tailwind 플러그인을 작성한다.

**seed.design tailwind3-plugin 분석**:
- CSS 변수를 Tailwind의 `theme.extend.colors`에 매핑한다.
- typography 유틸리티 클래스를 `addComponents`로 등록한다.
- spacing, borderRadius, fontSize, lineHeight 등도 CSS 변수 기반으로 확장한다.

**Huni 플러그인 설계**:

```js
// src/design-system/tailwind-plugin.js
const plugin = require('tailwindcss/plugin');

module.exports = plugin(
  ({ addComponents }) => {
    // 타이포그래피 유틸리티 클래스
    addComponents({
      '.huni-t1-regular': {
        fontSize: 'var(--huni-font-size-t1)',
        lineHeight: '1.5',
        fontWeight: 'var(--huni-font-weight-regular)',
      },
      '.huni-t1-medium': {
        fontSize: 'var(--huni-font-size-t1)',
        lineHeight: '1.5',
        fontWeight: 'var(--huni-font-weight-medium)',
      },
      // ... t1-t7, regular/medium/bold
    });
  },
  {
    theme: {
      extend: {
        colors: {
          // Huni 시맨틱 색상 -> Tailwind
          'huni-fg-brand': 'var(--huni-fg-brand)',
          'huni-fg-neutral': 'var(--huni-fg-neutral)',
          'huni-bg-brand': 'var(--huni-bg-brand-solid)',
          'huni-bg-brand-weak': 'var(--huni-bg-brand-weak)',
          'huni-stroke-brand': 'var(--huni-stroke-brand-solid)',
          'huni-stroke-neutral': 'var(--huni-stroke-neutral)',
          // ... 추가 시맨틱 색상
        },
        spacing: {
          'huni-x1': 'var(--huni-spacing-x1)',
          'huni-x2': 'var(--huni-spacing-x2)',
          'huni-x3': 'var(--huni-spacing-x3)',
          'huni-x4': 'var(--huni-spacing-x4)',
          'huni-x5': 'var(--huni-spacing-x5)',
          'huni-x6': 'var(--huni-spacing-x6)',
          'huni-x8': 'var(--huni-spacing-x8)',
        },
        borderRadius: {
          'huni-r1': 'var(--huni-radius-r1)',
          'huni-r2': 'var(--huni-radius-r2)',
          'huni-r3': 'var(--huni-radius-r3)',
        },
      },
    },
  }
);
```

**tailwind.config.js 변경**:

```js
module.exports = {
  // ... 기존 설정 유지
  plugins: [
    require('tailwindcss-animate'),
    require('./src/design-system/tailwind-plugin'),  // Huni 플러그인 추가
  ],
};
```

### 4.3 CSS Generation Pipeline

seed.design은 YAML -> rootage CLI -> CSS 자동 생성 파이프라인을 사용한다. Huni는 이를 간소화하여 수동 관리 방식을 채택한다.

**이유**:
- 컴포넌트 수가 13개로 제한적이다.
- YAML-to-CSS 변환 도구를 자체 구축하는 비용 대비 효과가 없다.
- CSS 변수 파일을 직접 관리하는 것이 현 단계에서 더 실용적이다.

**향후 확장**: 컴포넌트가 50개 이상으로 성장하면, 간단한 Node.js 스크립트로 YAML -> CSS 변환을 자동화할 수 있다.

```
현재 파이프라인 (수동):
[Figma 디자인] -> [수동 토큰 추출] -> [CSS 변수 파일] -> [Tailwind 플러그인] -> [컴포넌트]

향후 파이프라인 (자동화, 50+ 컴포넌트 시):
[Figma 디자인] -> [YAML 토큰 정의] -> [build-tokens.js] -> [CSS 변수 파일] -> [Tailwind 플러그인] -> [컴포넌트]
```

### 4.4 Designer Workflow

디자이너가 토큰을 업데이트하는 워크플로우:

1. Figma에서 색상/스페이싱 값 변경
2. `tokens/huni-tokens.css`에서 해당 CSS 변수 값 수정
3. 컴포넌트가 CSS 변수를 참조하므로 자동 반영
4. 새 컴포넌트 토큰 필요 시 Tier 3에 추가

---

## 5. Component Migration Roadmap (4 Phases)

### Phase 1: Token Foundation (토큰 기반 구축)

**목표**: 새로운 3-tier 토큰 시스템 생성, 기존 `--po-*` 변수와의 호환 alias 설정

**대상 파일**:
- `src/design-system/tokens/huni-tokens.css` (신규)
- `src/design-system/tokens/compat-aliases.css` (신규)
- `src/globals.css` (수정)
- `src/design-system/tailwind-plugin.js` (신규)
- `tailwind.config.js` (수정)

**작업**:
- [ ] Tier 1 Palette 토큰 정의 (Purple, Gray, Accent)
- [ ] Tier 2 Semantic 토큰 정의 (fg, bg, stroke)
- [ ] Tier 3 Component 토큰 정의 (chip, cta, input, print)
- [ ] `--po-*` -> `--huni-*` 호환 alias 작성
- [ ] Huni Tailwind 플러그인 작성
- [ ] tailwind.config.js에 플러그인 등록
- [ ] globals.css에 토큰 파일 import

**완료 조건**: 기존 컴포넌트가 `--po-*` alias를 통해 변경 없이 정상 렌더링

### Phase 2: Component Token Migration (컴포넌트 토큰 전환)

**목표**: 기존 13개 컴포넌트의 하드코딩된 `--po-*` 참조를 `--huni-*` 시맨틱 토큰 또는 Tailwind 유틸리티로 교체

**대상 파일**: `src/design-system/components/**/*.jsx` (13개)

**작업 예시 (SizeOptionChip)**:

Before:
```jsx
// 직접 CSS 변수 참조
'border-[var(--po-border-default)] text-[var(--po-text-dark)]'
'border-[var(--po-primary)] text-[var(--po-primary)]'
```

After:
```jsx
// Huni Tailwind 유틸리티 사용
'border-huni-stroke-neutral text-huni-fg-neutral'
'border-2 border-huni-stroke-brand text-huni-fg-brand'
```

**작업**:
- [ ] Atoms 3종 마이그레이션 (BadgeLabel, InfoTooltip, ColorChip)
- [ ] Molecules 8종 마이그레이션 (OptionLabel ~ CTAButton)
- [ ] Organisms 2종 마이그레이션 (CollapsibleSection, PriceSummary)

**완료 조건**: 모든 컴포넌트가 `--huni-*` 토큰만 사용, `--po-*` 직접 참조 0건

### Phase 3: Recipe System Enhancement (레시피 시스템 강화)

**목표**: seed.design의 recipe(defineRecipe) 패턴을 참고하여 CVA variant 정의를 체계화

**작업**:
- [ ] 공통 variant 패턴 추출 (state: default/selected/disabled)
- [ ] 크기 variant 표준화 (size: sm/md/lg)
- [ ] 복합 variant(compoundVariants) 패턴 도입
- [ ] 기본값(defaultVariants) 체계화
- [ ] 인쇄 도메인 전용 variant 추가 (paperSize, printType 등)

**CVA 레시피 패턴 (seed.design의 defineRecipe 참고)**:

```jsx
const chipRecipe = cva(
  // base
  'inline-flex items-center justify-center rounded cursor-pointer transition-all select-none font-[var(--huni-font-family)]',
  {
    variants: {
      variant: {
        solid: 'bg-huni-bg-brand text-huni-fg-brand-contrast',
        outline: 'bg-transparent border border-huni-stroke-neutral text-huni-fg-neutral',
        ghost: 'bg-transparent text-huni-fg-neutral',
      },
      state: {
        default: '',
        selected: 'border-2 border-huni-stroke-brand text-huni-fg-brand',
        disabled: 'bg-huni-bg-disabled text-huni-fg-disabled cursor-not-allowed',
      },
      size: {
        sm: 'h-10 px-3 text-[var(--huni-font-size-t2)]',
        md: 'h-[50px] px-4 text-[var(--huni-font-size-t3)]',
        lg: 'h-14 px-5 text-[var(--huni-font-size-t4)]',
      },
    },
    compoundVariants: [
      { variant: 'outline', state: 'selected', class: 'bg-huni-bg-brand-weak' },
    ],
    defaultVariants: {
      variant: 'outline',
      state: 'default',
      size: 'md',
    },
  }
);
```

### Phase 4: Extended Component Library (확장 컴포넌트 라이브러리)

**목표**: 나머지 11개 상품 타입 섹션 컴포넌트 확장, 인쇄 도메인 고급 컴포넌트 추가

**작업**:
- [ ] 상품 타입별 섹션 컴포넌트 (BOOK, STATIONERY 등)
- [ ] 인쇄 미리보기 컴포넌트
- [ ] 파일 업로드/프리뷰 컴포넌트
- [ ] 가격 계산 컴포넌트
- [ ] 인쇄 옵션 요약 컴포넌트

---

## 6. Backward Compatibility Strategy

### 6.1 Zero-Breaking-Change Migration

마이그레이션 중 기존 코드가 깨지지 않도록 보장하는 전략.

**레이어 구조**:

```
Layer 1: --huni-palette-*    (새 Palette 토큰, Tier 1)
Layer 2: --huni-fg/bg/stroke-*  (새 Semantic 토큰, Tier 2)
Layer 3: --huni-chip/cta/input-*  (새 Component 토큰, Tier 3)
Layer 4: --po-*              (호환 Alias -> Layer 1/2 참조)
```

**로드 순서**:
```css
@import './tokens/huni-tokens.css';    /* Layer 1-3 정의 */
@import './tokens/compat-aliases.css'; /* Layer 4: --po-* -> --huni-* */
```

### 6.2 Feature Flag for Gradual Rollout

CSS 클래스 기반 feature flag를 사용하여 새 토큰 시스템과 기존 시스템을 전환할 수 있다.

```css
/* 새 토큰 시스템 활성화 시 */
.huni-ds-v2 {
  /* 컴포넌트 토큰 오버라이드 */
}
```

하지만 현재 프로젝트 규모(13개 컴포넌트)에서는 Phase 1에서 alias를 올바르게 설정하면 feature flag 없이도 안전하게 마이그레이션 가능하다. Feature flag는 **선택적**이다.

### 6.3 Deprecation Timeline

| Phase | `--po-*` 상태 | `--huni-*` 상태 |
|-------|---------------|-----------------|
| Phase 1 | 활성 (alias) | 새로 정의 |
| Phase 2 | 활성 (alias, 직접 참조 제거 중) | 컴포넌트에서 직접 사용 |
| Phase 3 | Deprecated 주석 추가 | 주 토큰 시스템 |
| Phase 4 | 제거 가능 | 완전 채택 |

---

## 7. Proposed File Structure

```
src/design-system/
  tokens/
    huni-tokens.css           # 3-tier 토큰 정의 (palette, semantic, component)
    compat-aliases.css        # --po-* -> --huni-* 호환 레이어
    index.css                 # 토큰 import 통합 (기존)
    colors.css                # [DEPRECATED] Phase 3에서 제거
    typography.css            # [DEPRECATED] Phase 3에서 제거
  components/
    atoms/
      BadgeLabel.jsx
      InfoTooltip.jsx
      ColorChip.jsx
    molecules/
      SizeOptionChip.jsx
      RadioOption.jsx
      DropdownSelect.jsx
      CounterOption.jsx
      SizeInput.jsx
      QuantityInput.jsx
      CTAButton.jsx
      OptionLabel.jsx
    organisms/
      CollapsibleSection.jsx
      PriceSummary.jsx
  tailwind-plugin.js          # Huni Tailwind 플러그인 (신규)
  index.js                    # 통합 진입점 (기존)
```

### aurora-skin 레벨 변경사항

```
tailwind.config.js            # Huni 플러그인 추가
src/globals.css               # 토큰 import 순서 변경
```

---

## 8. Risk Mitigation Plan

### Technical Risks

| 위험 | 영향 | 발생 확률 | 대응 |
|------|------|-----------|------|
| CSS 변수 순환 참조 | 높음 | 낮음 | Tier 간 참조 방향 엄격 제한 (하위 -> 상위만) |
| Tailwind JIT가 CSS 변수 인식 실패 | 중간 | 낮음 | Tailwind 플러그인에서 명시적 매핑, arbitrary value `[var(...)]` 백업 |
| 기존 `--po-*` alias 누락 | 높음 | 중간 | Phase 1 완료 시 전체 컴포넌트 렌더링 검증 스크립트 실행 |
| 인쇄 도메인 토큰 설계 부족 | 중간 | 중간 | Phase 1에서 기본 세트만, Phase 4에서 추가 |

### Compatibility Risks

| 위험 | 영향 | 발생 확률 | 대응 |
|------|------|-----------|------|
| aurora-skin 기존 CSS 변수(`--point-color` 등)와 충돌 | 높음 | 낮음 | `--huni-*` 네임스페이스로 완전 격리 |
| shadcn/ui 컴포넌트와의 스타일 충돌 | 중간 | 낮음 | shadcn/ui는 admin 영역, Huni DS는 user 영역으로 범위 분리 |
| Webpack 빌드 성능 저하 | 낮음 | 낮음 | CSS 변수 파일 추가는 빌드에 미미한 영향 |

---

## 9. Technology Decision Records

### TDR-001: `--huni-*` 네임스페이스 사용

**결정**: CSS 변수 접두사로 `--huni-*`를 사용한다.
**대안**: `--seed-*` (seed.design 호환), `--po-*` (기존 유지), `--ds-*` (범용)
**근거**: Huni Printing 브랜드 아이덴티티 반영. seed.design의 `--seed-*`와 충돌 방지. 기존 `--po-*`(print option)보다 범위가 넓은 디자인 시스템 토큰.

### TDR-002: seed.design 패키지 직접 의존 배제

**결정**: `@seed-design/*` npm 패키지를 dependencies에 추가하지 않는다.
**대안**: `@seed-design/css` + `@seed-design/tailwind3-plugin` 설치
**근거**: 당근 브랜드 토큰과의 강결합 회피. JavaScript(JSX) 프로젝트에서 TypeScript 타입 생성물 불필요. 인쇄 도메인 전용 토큰은 어떤 범용 DS에도 없음.

### TDR-003: YAML 토큰 파이프라인 보류

**결정**: 현 단계에서 YAML-to-CSS 자동 변환 파이프라인을 구축하지 않는다.
**대안**: 간단한 Node.js 스크립트로 YAML -> CSS 변환 구현
**근거**: 13개 컴포넌트에 대해 자동화 파이프라인은 과도한 엔지니어링. CSS 변수 파일을 직접 관리하는 비용이 더 낮음. 50+ 컴포넌트 도달 시 재검토.

### TDR-004: CVA(class-variance-authority) 레시피 패턴 유지

**결정**: seed.design의 `defineRecipe`가 아닌 기존 CVA 패턴을 유지 확장한다.
**대안**: seed.design의 `qvism-preset` 도입, vanilla-extract 전환
**근거**: SPEC-DS-004에서 CVA 패턴이 이미 13개 컴포넌트에 적용됨. CVA는 seed.design의 defineRecipe와 구조적으로 동일(base/variants/compoundVariants/defaultVariants). JavaScript 프로젝트에서 바로 사용 가능(TypeScript 불필요).

### TDR-005: Tailwind 플러그인 자체 작성

**결정**: `@seed-design/tailwind3-plugin`을 사용하지 않고, 동일 패턴의 Huni 전용 Tailwind 플러그인을 작성한다.
**대안**: `@seed-design/tailwind3-plugin` 직접 사용
**근거**: seed.design plugin은 당근 토큰(`--seed-color-*`)을 매핑함. Huni 토큰(`--huni-*`)에 맞는 전용 매핑 필요. 코드량은 50-100줄 수준으로 유지보수 부담 미미.

---

## 부록: seed.design 핵심 패턴 레퍼런스

### A. 토큰 구조 패턴 (rootage YAML)

```yaml
kind: Tokens
metadata:
  id: color
  name: Color
data:
  collection: color
  tokens:
    $color.palette.purple-600:
      values:
        theme-light: "#5538B6"
        theme-dark: "#7B68C4"
```

이 패턴은 향후 다크모드 도입 시 `--huni-*` 토큰의 YAML 정의로 활용할 수 있다.

### B. 컴포넌트 스키마 패턴 (rootage ComponentSpec)

```yaml
kind: ComponentSpec
metadata:
  id: size-option-chip
  name: SizeOptionChip
data:
  schema:
    slots:
      root:
        properties:
          color: { type: color }
          cornerRadius: { type: dimension }
          height: { type: dimension }
      label:
        properties:
          color: { type: color }
          fontSize: { type: dimension }
    variants:
      state: { values: { default: {}, selected: {}, disabled: {} } }
      size: { values: { sm: {}, md: {} } }
```

이 패턴은 컴포넌트 사양을 구조화하는 데 참고할 수 있으며, 향후 Storybook 문서 자동 생성의 기반이 될 수 있다.

### C. Tailwind Plugin 패턴

seed.design의 tailwind3-plugin은 다음 패턴으로 CSS 변수를 Tailwind에 통합한다:
1. `theme.extend.colors`에 시맨틱 색상 매핑
2. `theme.extend.spacing`에 spacing 스케일 매핑
3. `addComponents`로 타이포그래피 유틸리티 클래스 등록
4. `matchUtilities`로 동적 유틸리티(gradient 등) 지원

Huni 플러그인은 1-3을 채택하고, 4(gradient)는 현재 불필요하므로 보류한다.
