# SPEC-DS-005 Research Findings

후니프린팅 디자인시스템 개선을 위한 seed.design(당근 디자인시스템) + aurora-skin-main 코드베이스 심층 분석.

Source: Researcher Agent (Explore) — 2026-03-17

---

## 1. seed.design Architecture Deep Dive

### 1.1 Token Structure (Design-Token Package)
- **3-tier 토큰 계층**: Scale (palette colors), Static (weights, line heights), Semantic (semantic meaning mapping)
- **CSS Variable Format**: `--seed-color-*` for colors, `--seed-font-*` for typography, `--seed-dimension-*` for spacing
- **Typography System**: 10 font size scales (t1-t10) + static variants, with accompanying line heights and font weights
- **Token Exposure**: `packages/design-token/src/`에서 TypeScript constants와 CSS variables 양방향 export
- **Naming Convention**: Semantic tokens: `var(--seed-color-fg-brand)`, `var(--seed-color-bg-layer-default)`

### 1.2 Tailwind 3 Plugin Integration
- **Plugin Location**: `packages/tailwind3-plugin/src/index.ts`
- **Color Exposure**: 200+ color tokens을 CSS variables로 Tailwind `colors` extend config에 노출
- **Typography Components**: Typography classes (t1-regular, t1-bold, screen-title 등)를 Tailwind components로 노출
- **Gradient Support**: Custom gradient utilities with arbitrary angle support (`bg-gradient-shimmer-neutral-[45deg]`)
- **Spacing/Dimension**: Spacing tokens → border-radius, padding/margin 값으로 노출
- **Plugin Pattern**: `plugin()` from tailwindcss, `addComponents()` for typography, `matchUtilities()` for gradients

### 1.3 Rootage YAML Token Format
- **File Structure**: `packages/rootage/` 내 YAML files에서 theme-light/theme-dark 값 정의
- **Token Definition**: 각 token에 ID, name, values for different themes
- **Color Palette**: Gray (0-1000), Carrot, Blue, Red, Green, Yellow, Purple, static black/white alpha variants
- **Semantic Mapping**: Colors → functional names (brand, critical, positive, warning, neutral) with light/dark variants
- **Component Variables**: Separate YAML files for component-specific tokens (action-button, chip, checkbox 등)
- **Generation Pipeline**: `bun rootage:generate` → TypeScript + CSS 생성

### 1.4 Qvism Preset Recipe System
- **Recipe Pattern**: `defineRecipe()` function → base styles + variant definitions
- **Pseudo Utilities**: `pseudo(engaged)`, `pseudo(disabled)`, `pseudo(focusVisible)` for state handling
- **Variant System**: 여러 variant dimensions 지원 (variant, size, layout, state)
- **Token References**: Recipes → `vars.{variant}.{state}.{slot}.{property}` 참조
- **CSS Generation**: `bun qvism:generate` → `packages/css/recipes/` 생성
- **Compound Variants**: 여러 variant values 조합 styling 지원

### 1.5 CSS Package Generation
- **Auto-Generated**: `vars/`와 `recipes/` 모두 source packages에서 생성
- **Direct Modification Forbidden**: 직접 수정 불가
- **Theming Support**: generateThemingScript()로 light/dark 모드 color scheme switching
- **TypeScript Types**: .d.ts files → recipe APIs에 대한 type safety

### 1.6 React Component Pattern
- **forwardRef Required**: 모든 컴포넌트 `React.forwardRef()` + displayName 사용
- **Recipe Integration**: `@seed-design/css/recipes/component-name`에서 recipes import
- **Style Props Support**: StyleProps (flexGrow, bleedX 등) 지원
- **clsx for Merging**: classname merging via clsx utility
- **Primitive Element Abstraction**: @seed-design/react-primitive 사용

### 1.7 CLI Infrastructure
- **Commands**: `init`, `add`, `add-all`, `docs`, `compat`
- **Init Workflow**: 프로젝트에 design system setup (패키지 설치, 설정 생성)
- **Add Command**: 개별 컴포넌트 또는 그룹 추가
- **Compatibility Check**: `compat` command로 프로젝트 셋업 검증

### 1.8 Webpack Plugin
- **Theme Injection**: color-scheme meta tag + theming script → HTML 주입
- **Dark Mode Support**: "system", "light-only", "dark-only" 모드
- **Build Integration**: Webpack, Rspack 모두 지원
- **HTML Hook**: html-webpack-plugin hooks로 HTML transformation

---

## 2. aurora-skin-main Current State Analysis

### 2.1 Existing Token Structure
- **CSS Variable Format**: `--po-*` prefix (printing options)
- **Color Categories**: Primary (#5538B6), Secondary, Light variants, Text (dark/medium/muted), Border, Background, Accent (gold/teal)
- **Typography**: Noto Sans KR family, 8 font sizes (xs-2xl), 3 weights (normal/medium/bold), 3 line heights
- **Design System Location**: `src/design-system/tokens/` (colors.css, typography.css)
- **Token Coverage**: 기본 color/typography만, dimension/spacing/shadow tokens 없음

### 2.2 Current Tailwind Configuration
- **Mode**: Extended theme with CSS variable references
- **Color Mapping**: 15 color tokens → Tailwind 매핑 (whole, background, point 등)
- **shadcn/ui Compatibility**: Semantic colors (primary, secondary, destructive 등)
- **Font Family**: Montserrat + system stack
- **Border Radius**: 3 custom radius (lg: 8px, md: 6px, sm: 4px)
- **Core Plugin**: preflight disabled → custom CSS reset 보존

### 2.3 Component Implementation Pattern
- **Architecture**: Atomic Design (atoms, molecules, organisms)
- **Library**: class-variance-authority (cva) for variant styling
- **Utility**: Custom `cn()` utility for classname merging
- **forwardRef**: React.forwardRef 사용
- **No Design System Library**: 모든 컴포넌트 custom 구현

### 2.4 Component Inventory (SPEC-DS-004 기준 13 components)
- **Atoms**: BadgeLabel, InfoTooltip, ColorChip
- **Molecules**: OptionLabel, SizeOptionChip, RadioOption, DropdownSelect, CounterOption, SizeInput, QuantityInput, CTAButton
- **Organisms**: CollapsibleSection, PriceSummary

---

## 3. Integration Point Mapping

### 3.1 Token Format Migration Path

| aurora-skin Variable | seed.design Equivalent | Migration Strategy |
|----------------------|------------------------|-------------------|
| `--po-primary: #5538B6` | `--seed-color-palette-*` (custom palette) | Huni printing palette in rootage 정의, semantic colors에 매핑 |
| `--po-text-dark: #424242` | `--seed-color-fg-neutral` | Semantic foreground tokens에 매핑 |
| `--po-border-default: #CACACA` | `--seed-color-stroke-neutral-subtle` | Stroke token system 사용 |
| `--po-font-family: Noto Sans KR` | `var(--seed-font-family)` | rootage에서 font family 정의 |
| `--po-text-sm: 12px` | `var(--seed-font-size-t6)` | seed font scale에 사이즈 매핑 |

### 3.2 Component Recipe Conversion
- **Current CVA Pattern**: `badgeLabelVariants = cva(...)`
- **seed.design Pattern**: `defineRecipe({ base: {...}, variants: {...} })`
- **Conversion Strategy**:
  1. 각 component에서 CVA variant definitions 추출
  2. qvism-preset/src/recipes/에 recipe 생성
  3. qvism:generate로 CSS 생성
  4. React component에서 @seed-design/css/recipes/ import로 전환

---

## 4. Token Format Comparison

| Aspect | aurora-skin | seed.design |
|--------|-------------|-------------|
| **Theme Support** | 단일 테마 | Multi-theme (light/dark) |
| **Token Layers** | Flat (CSS vars only) | 3-layer (scale/static/semantic) |
| **Component Tokens** | Inline in CVA | Separate component YAML |
| **Dark Mode** | 미지원 | Built-in theme switching |
| **TypeScript Safety** | No types for tokens | Full TypeScript API |
| **Multi-brand Support** | N/A | palette switching으로 가능 |
| **Build Pipeline** | Webpack only | Webpack + Vite + Rspack |
| **Generated Artifacts** | N/A | CSS vars, TypeScript, recipes |

---

## 5. Plugin Compatibility Assessment

### 5.1 Tailwind 3 Plugin
- **Compatible**: aurora-skin Tailwind 3 설정과 호환
- **Migration Impact**: 기존 tailwind.config.js에 안전하게 추가 가능
- **Color Conflict**: palette-gray vs gray color tokens 네이밍 충돌 가능
- **Solution**: CSS variable remapping 또는 namespace separation

### 5.2 Webpack Plugin
- **Current Setup**: aurora-skin Webpack custom config 사용
- **Seed Plugin**: `SeedDesignPlugin`이 HtmlWebpackPlugin에 hook
- **Adoption Path**: webpack.config.js에 plugin 추가 → theme injection
- **Dark Mode**: Theme switching 로직 application에 추가 필요

### 5.3 TypeScript Integration
- **Design-Token Package**: TypeScript constants export (vars.$semantic.primary 등)
- **Recipe Types**: Generated .d.ts → type safety
- **Current Aurora**: CVA에서 implicit types 사용
- **주의**: aurora-skin이 JavaScript(JSX) 프로젝트이므로 TS 패키지 직접 import 시 빌드 설정 변경 필요

---

## 6. Component Pattern Comparison

### 6.1 Current aurora-skin (CVA)
```tsx
const badgeLabelVariants = cva(
  'inline-flex items-center justify-center...',
  {
    variants: {
      variant: { default: 'bg-[var(--po-primary)]...' },
      size: { default: 'px-1.5 py-0.5...' }
    }
  }
);
```

### 6.2 seed.design (Recipe + Primitive)
```tsx
import { badge } from '@seed-design/css/recipes/badge';
import { Primitive } from '@seed-design/react-primitive';

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, size, className, ...props }, ref) => {
    const recipeClassName = badge({ variant, size });
    return <Primitive.span ref={ref} className={clsx(recipeClassName, className)} {...props} />;
  }
);
```

**Key Differences**:
- **Recipe vs CVA**: seed.design uses `defineRecipe()` (compiled CSS), aurora uses CVA (runtime)
- **Primitive Abstraction**: seed.design uses Primitive components
- **Class Generation**: seed.design = CSS class strings; aurora = CVA factory functions
- **Token Reference**: seed.design = vars module; aurora = CSS variable strings

---

## 7. Risk and Constraint Analysis

### 7.1 Adoption Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Build Pipeline Complexity | Medium | seed-design CLI로 자동화 |
| Token Generation Dependency | Medium | rootage YAML 문서화, fork 준비 |
| Component Library Size | Low | Tree-shaking으로 필요한 것만 import |
| Breaking Changes | Medium | 마이그레이션 중 양 시스템 병행 |
| Team Learning Curve | Medium | seed.design 아키텍처 문서화 |
| Dark Mode Implementation | Low | seed.design built-in theming 활용 |

### 7.2 Constraints

| Constraint | Impact | Note |
|-----------|--------|------|
| aurora-skin = JavaScript (No TypeScript) | Medium | TS 패키지 직접 import 시 빌드 설정 필요 |
| Monorepo Structure | Medium | 통합 방식 결정 필요 |
| Custom Tokens (Huni specific) | Medium | Custom rootage YAML 또는 seed palette 확장 |
| Existing Component Ecosystem | Medium | 점진적 마이그레이션 필수 |
| React 18+ | Low | seed.design React 18+ 호환 |

---

## 8. Recommendations

### 8.1 Short-term (Phase 1: Foundation)
1. Huni Printing Design Tokens Package 생성 (rootage YAML 기반)
2. Generation Pipeline 설정 (rootage + qvism-preset)
3. Tailwind Plugin 통합

### 8.2 Medium-term (Phase 2: Migration)
1. Gradual Component Migration (CVA → recipe)
2. Dark Mode Implementation
3. Documentation 정비

### 8.3 Long-term (Phase 3: Consolidation)
1. Full Component Library
2. Multi-brand Support
3. Developer Experience 향상

### 8.4 권장 전략: Recipe Gradual Migration (Option C)
- 기존 CVA 컴포넌트 유지하면서 점진적으로 recipe로 전환
- 고가치 컴포넌트부터 마이그레이션 (buttons, inputs)
- 팀이 seed.design 패턴을 점진적으로 학습 가능
- 기존 프로덕션 코드에 대한 리스크 최소화

---

Version: 1.0.0 | Source: Researcher Agent (Explore) | Date: 2026-03-17
