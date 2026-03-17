# SPEC-DS-005: Huni Printing Design System - Benchmarks & Research

Created: 2026-03-17
Researcher: manager-strategy (requirements analyst)
Status: Research Complete

---

## 1. Design Token Management: State of the Art

### 1.1 W3C Design Tokens Community Group (DTCG) Specification

W3C DTCG는 디자인 토큰 정의 및 교환을 위한 표준화 작업을 진행하는 커뮤니티 그룹이다. JSON 기반 포맷으로 모든 토큰은 최소 `$value`와 `$type` 속성을 가져야 한다.

**현재 상태**: Draft 단계이나, 주요 디자인 시스템 도구들이 이미 지원을 시작했다.

**핵심 특징**:
- `$value`, `$type`, `$description` 사용 (Style Dictionary의 `value`, `type`, `comment`와 대비)
- 벤더 종속 없는 범용 교환 포맷
- Figma, Style Dictionary, Cobalt UI 등이 호환성 지원

Sources:
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [DTCG GitHub Repository](https://github.com/design-tokens/community-group)
- [Design Tokens Community Group Official](https://www.designtokens.org/)

### 1.2 Design Token Pipeline 도구 비교

| 도구 | 버전 | DTCG 호환 | 특징 | 적합성 |
|------|------|-----------|------|--------|
| **Style Dictionary** | 4.x | Forward-compatible | JSON -> 멀티 플랫폼 변환, 광범위한 커스텀 설정, 가장 큰 커뮤니티 | 높음 (성숙도) |
| **Cobalt UI** | 1.12.0 (2.0 beta) | Native DTCG | CSS/Sass/JS/TS/JSON 생성, 플러그인 아키텍처, CI 최적화 | 높음 (표준 우선) |
| **Theo (Salesforce)** | 8.x | 미지원 | Lightning Design System용, 유지보수 모드 | 낮음 |

**권장사항**: Cobalt UI 또는 Style Dictionary 4.x 중 선택. seed.design은 자체 `rootage` 시스템을 사용하므로 직접 도구 도입보다는 seed.design의 파이프라인을 활용하는 것이 효율적이다.

Sources:
- [Cobalt UI](https://cobalt-ui.pages.dev/)
- [Style Dictionary](https://styledictionary.com/)
- [Style Dictionary DTCG Support](https://styledictionary.com/info/dtcg/)

### 1.3 Three-Layer Token Architecture (Martin Fowler)

Martin Fowler의 Design Token-Based UI Architecture 기사에서 제시하는 3계층 토큰 구조:

| 계층 | 역할 | 예시 |
|------|------|------|
| **Option Tokens** (Foundation) | 사용 가능한 디자인 선택지 정의 | `gray-100`, `blue-500`, `purple-600` |
| **Decision Tokens** (Semantic) | 컨텍스트별 적용 방식 결정 | `surface-color: gray-100`, `accent: blue-900` |
| **Component Tokens** (Application) | 특정 UI 파트에 매핑 | `button-bg-primary: accent` |

**seed.design과의 매핑**:
- Option Tokens = `palette-*` (palette-gray-00 ~ palette-purple-1000)
- Decision Tokens = `fg-*`, `bg-*`, `stroke-*` (fg-brand, bg-brand-solid 등)
- Component Tokens = Recipe 시스템의 vars (component-specific token refs)

**후니프린팅 적용 포인트**:
- 2계층(Option + Decision)으로 시작하고, 컴포넌트 복잡도 증가 시 3계층 확장
- Option 토큰은 비공개(private)로 하여 파일 크기 절감 및 비파괴적 변경 가능

Sources:
- [Design Token-Based UI Architecture - Martin Fowler](https://martinfowler.com/articles/design-token-based-ui-architecture.html)
- [Design Tokens Governance](https://designtokens.substack.com/p/design-tokens-governance)

### 1.4 Figma <-> Code 양방향 동기화 트렌드

2025-2026 현재 트렌드:
- Figma Variables를 단일 소스 오브 트루스(SSOT)로 사용하되, Git 저장소를 코드 쪽 SSOT로 유지
- 양방향 동기화는 충돌 해결 메커니즘 필요 (race condition, merge conflict)
- Tokens Studio, Figma Variables API, Themer 등의 도구 활용

**seed.design 접근 방식**: `bun figma:sync`로 Figma -> rootage YAML 단방향 동기화. 이 패턴이 복잡도 관리에 유리하다.

Sources:
- [Design Tokens with Confidence - UX Collective](https://uxdesign.cc/design-tokens-with-confidence-862119eb819b)
- [Evolution of Design System Tokens 2025](https://www.designsystemscollective.com/the-evolution-of-design-system-tokens-a-2025-deep-dive-into-next-generation-figma-structures-969be68adfbe)

---

## 2. seed.design Ecosystem Analysis

### 2.1 Architecture Overview

seed.design은 당근(Karrot)의 공식 디자인 시스템으로, 다음 파이프라인을 따른다:

```
[Figma] -> [rootage YAML] -> [qvism-preset] -> [css] -> [react]
            토큰 정의        Recipe 정의      CSS 생성    React 컴포넌트
```

**핵심 패키지 관계**:
```
rootage (YAML 정의, 소스)
    |-- generate
qvism-preset (Recipe 정의, 소스/일부 생성) + css/vars (토큰)
    |-- generate
css (CSS 파일 + 타입, 생성물)
    |-- import
react (스타일드 컴포넌트) <-- react-headless (Headless UI 로직)
```

### 2.2 NPM Packages

| 패키지 | 버전 | 역할 | 후니프린팅 활용도 |
|--------|------|------|------------------|
| `@seed-design/css` | 1.2.5 | CSS 토큰 + Recipe 생성물 | **핵심** - 토큰 CSS 변수 제공 |
| `@seed-design/react` | 1.2.7 | 스타일드 React 컴포넌트 | **선택적** - 범용 컴포넌트 소비 |
| `@seed-design/react-headless` | - | Headless UI 로직 | **유용** - 동작 로직 재활용 |
| `@seed-design/design-token` | 1.0.4 | 디자인 토큰 JS/TS 내보내기 | **유용** - 토큰 값 참조 |
| `@seed-design/tailwind3-plugin` | 1.1.18 | Tailwind 3 통합 플러그인 | **핵심** - TW 3 프로젝트와 직접 호환 |
| `@seed-design/tailwind4-theme` | - | Tailwind 4 테마 | 미래 대비 (TW4 미그레이션 시) |
| `@seed-design/rootage-artifacts` | 1.2.4 | 토큰/컴포넌트 스키마 YAML | **참조** - 토큰 구조 이해 |

### 2.3 Available Components (68+ 컴포넌트)

seed.design `@seed-design/react`에 포함된 주요 컴포넌트:

**기본 UI**: ActionButton, Badge, Callout, Chip, Count, Dialog, Divider, Icon, Text, ToggleButton

**입력/폼**: Checkbox, RadioGroup, RadioGroupField, SelectBox, Slider, Switch, TextField, Field, FieldButton, Fieldset

**레이아웃**: Box, Columns, Flex, Grid, GridItem, Inline, Stack, Float, AspectRatio, ResponsivePair

**네비게이션**: Tabs, ChipTabs, SegmentedControl

**피드백**: Snackbar, InlineBanner, PageBanner, ProgressCircle, LoadingIndicator, Skeleton, HelpBubble

**오버레이**: BottomSheet, ActionSheet, ExtendedActionSheet, MenuSheet, Portal

**특수**: Avatar, ImageFrame, PullToRefresh, ScrollFog, VisuallyHidden, MannerTemp, MannerTempBadge

### 2.4 Headless + Styled 분리 패턴

seed.design은 Radix UI 기반의 headless 패턴을 채택:
- `@radix-ui/react-dialog`, `@radix-ui/react-slot`, `@radix-ui/react-compose-refs` 등 의존
- `react-headless` 패키지: 로직 담당 (상태, 접근성, 키보드 인터랙션)
- `react` 패키지: 스타일 적용 (CSS Recipe를 통한 className 생성)

이 패턴은 후니프린팅의 커스텀 브랜딩에 유리하다 - headless 로직은 그대로 쓰고 스타일만 교체 가능.

### 2.5 seed.design 토큰 구조

rootage YAML에서 관리하는 토큰 카테고리:

| 카테고리 | 파일 | 토큰 수 (추정) |
|---------|------|----------------|
| Color | color.yaml | 200+ (palette + semantic) |
| Dimension/Spacing | dimension.yaml | 25+ |
| Font Size | font-size.yaml | 20+ (t1~t10, static 포함) |
| Font Weight | font-weight.yaml | 3 (regular, medium, bold) |
| Line Height | line-height.yaml | 20+ |
| Radius | radius.yaml | 11 (r0_5~r6, full) |
| Shadow | shadow.yaml | 3 (s1~s3) |
| Duration | duration.yaml | 7 (d1~d6, color-transition) |
| Timing Function | timing-function.yaml | 6 |
| Gradient | gradient.yaml | 8 패턴 |

Sources:
- [SEED Design System](https://seed-design.io/)
- [GitHub daangn/seed-design](https://github.com/daangn/seed-design)
- [@seed-design/css - npm](https://www.npmjs.com/package/@seed-design/css)

---

## 3. Multi-Brand Design System Patterns

### 3.1 Token Layer 전략

멀티 브랜드 디자인 시스템은 토큰 계층화를 통해 브랜드 간 차별화를 달성한다:

| 계층 | 역할 | 브랜드 간 공유 |
|------|------|---------------|
| **Branding Tokens** | 기업 디자인 설정 (로고 컬러, 서체) | 브랜드별 고유 |
| **Design Tokens** | 색상, 타이포, 스페이싱, 애니메이션 | 구조 공유, 값 차이 |
| **Component Tokens** | 컴포넌트별 매핑 결정 | 완전 공유 |

### 3.2 적용 패턴 비교

| 패턴 | 설명 | 장점 | 단점 | 후니프린팅 적합도 |
|------|------|------|------|------------------|
| **Fork** | 오픈소스 DS 전체 복제 | 완전 제어 | 업스트림 업데이트 어려움, 기술 부채 | 낮음 |
| **Consume** | 패키지 설치 후 그대로 사용 | 유지보수 최소 | 커스터마이징 제한 | 낮음 |
| **Wrapper** | 래퍼 컴포넌트로 감싸서 커스텀 | 업스트림 추적 가능 + 커스텀 | 래퍼 유지보수 필요 | **높음** |
| **Token Override** | CSS 변수 오버라이드만 적용 | 가장 가볍고 유지보수 쉬움 | 구조적 변경 불가 | **매우 높음** |

### 3.3 실제 사례

- **Orange Design System**: Bootstrap 포크 + 커스텀 렌더링 + Orange 전용 컴포넌트
- **Red Hat (PatternFly)**: 동일 컴포넌트 + 다른 테마 적용 (엔터프라이즈 vs 웹사이트)
- **Signify (Hike One)**: 디자인 토큰 기반 멀티 브랜드 → 토큰 값만 교체하여 브랜드 전환

### 3.4 후니프린팅 권장 전략: Token Override + Selective Wrapper

1. **Token Override Layer**: seed.design CSS 변수를 후니프린팅 브랜드 값으로 오버라이드
   - `--seed-color-palette-carrot-*` -> `--huni-color-palette-purple-*` (#5538B6 기반)
   - `--seed-color-fg-brand` -> 후니 브랜드 컬러
   - `--seed-color-bg-brand-solid` -> 후니 브랜드 배경

2. **Selective Wrapper**: 인쇄 전용 컴포넌트만 래퍼로 제작
   - SizeOptionChip, DropdownSelect, CounterOption 등 인쇄 도메인 특화 컴포넌트
   - seed.design의 범용 컴포넌트(Button, Dialog, Checkbox 등)는 토큰 오버라이드만으로 충분

Sources:
- [Multi-Brand Design System - Christopher Arold](https://medium.com/@christopher.arold87/multi-brand-design-system-1fcf3d30e4ff)
- [Signify Multi-Branded DS - Hike One](https://hike.one/work/signify-multi-branded-design-system)
- [Designing with Tokens for Multi-Brand - Clearleft](https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system)
- [Managing Multi-Brand Design Systems](https://thedesignsystem.guide/knowledge-base/managing-multi-brand-design-systems)
- [kickstartDS White-Label](https://www.kickstartds.com/blog/kickstartds-is-a-white-label-design-system/)

---

## 4. Printing Industry UI Benchmarks

### 4.1 한국 주요 인쇄 사이트 UI 패턴

| 사이트 | 특징 | UI 패턴 |
|--------|------|---------|
| **프린트시티** | 국내 최대 인쇄 토탈 업체, 15개 자체 사이트 | 전통적 카테고리 네비게이션, 다단 상품 옵션 |
| **레드프린팅** | 소량~대량, 스티커/패브릭/어패럴 | 모던 UI, 단계별 옵션 선택 |
| **비스타프린트** | 글로벌 인쇄 플랫폼 | Product Configurator 패턴, 실시간 프리뷰 |

### 4.2 인쇄 e커머스 공통 UI 패턴

1. **Product Configurator**: 단계별 옵션 선택 (크기 -> 용지 -> 인쇄방식 -> 후가공)
2. **조건부 옵션 연동**: 상위 옵션 선택에 따라 하위 옵션 동적 변경
3. **실시간 가격 계산**: 옵션 변경 시 즉시 가격 반영
4. **파일 업로드**: 디자인 파일 드래그앤드롭 업로드
5. **시각적 옵션 표현**: 색상칩, 크기 비교 시각화
6. **수량 할인 표시**: 수량별 단가 차등 표시

### 4.3 후니프린팅 고유 UI 요구사항 (SPEC-DS-004 기반)

SPEC-DS-004에서 정의된 13개 컴포넌트와 seed.design 매핑:

| 후니 컴포넌트 | seed.design 대응 | 전략 |
|--------------|-----------------|------|
| BadgeLabel | Badge | Token Override |
| InfoTooltip | HelpBubble | Token Override |
| ColorChip | (없음) | **Custom Component** |
| OptionLabel | Text | Token Override |
| SizeOptionChip | Chip / ActionChip | Wrapper |
| RadioOption | RadioGroup | Token Override |
| DropdownSelect | SelectBox | Token Override + Wrapper |
| CounterOption | (없음) | **Custom Component** |
| SizeInput | TextField | Token Override |
| QuantityInput | TextField | Token Override |
| CTAButton | ActionButton | Token Override |
| CollapsibleSection | (Collapsible 미출시) | **Custom Component** |
| PriceSummary | (없음) | **Custom Component** |

**결과**: 13개 중 9개는 seed.design 컴포넌트 활용 가능, 4개는 커스텀 개발 필요

Sources:
- [프린트시티](https://www.printcity.co.kr/)
- [레드프린팅](https://www.redprinting.co.kr/ko)
- [E-commerce Product Configurator Guide](https://commerce-ui.com/insights/ecommerce-product-configurator-2024-guide)
- [12 Ecommerce UI Patterns - Shopify](https://www.shopify.com/partners/blog/ui-patterns)

---

## 5. Tailwind Integration Strategies

### 5.1 Tailwind CSS v4.0 Native Design Token Support

Tailwind CSS v4.0의 핵심 변화:
- `@theme` 선언으로 디자인 토큰을 CSS 블록으로 정의
- 모든 디자인 토큰이 자동으로 CSS 변수로 사용 가능
- `@property` CSS 규칙 활용으로 타입 안전 토큰
- `color-mix()`, cascade layers 등 최신 CSS 기능 내장

### 5.2 seed.design + Tailwind 3 통합 (현재 프로젝트)

`@seed-design/tailwind3-plugin` (v1.1.18)이 제공하는 통합:

**색상**: `bg-bg-layer-basement`, `text-fg-brand`, `border-stroke-divider` 등
  - palette 색상 (gray, carrot, blue, red, green, yellow, purple)
  - semantic 색상 (fg-*, bg-*, stroke-*)

**타이포그래피**: `t1-regular`, `t1-bold`, `screen-title` 등
  - 10단계 타입 스케일 (t1~t10) x 3 웨이트 (regular, medium, bold)
  - Static 변형 포함

**스페이싱**: `p-x1`, `m-x4`, `gap-x2` 등
  - 20단계 스페이싱 (x0_5~x16)
  - 시맨틱 스페이싱 (spacing-x-global-gutter 등)

**기타**: border-radius (r0_5~r6, full), shadow (s1~s3), duration (d1~d6), timing-function

**핵심 포인트**: 모든 토큰이 CSS 변수 기반이므로, 오버라이드를 통한 브랜드 커스터마이징이 자연스럽다.

### 5.3 Tailwind 3 + CSS Custom Properties Bridge 패턴

```
seed.design CSS 변수 -> Tailwind 3 Plugin -> Tailwind 유틸리티 클래스
     |
     |-- 후니 브랜드 오버라이드 CSS
          (--seed-color-fg-brand: #5538B6)
```

이 패턴으로:
1. seed.design의 `base.css` 로드 (토큰 CSS 변수 정의)
2. 후니 브랜드 오버라이드 CSS 로드 (palette-carrot -> palette-purple 매핑)
3. `@seed-design/tailwind3-plugin` 적용 (CSS 변수를 Tailwind 클래스로 노출)
4. 컴포넌트에서 `bg-bg-brand-solid`, `text-fg-brand` 등 사용

### 5.4 Tailwind 4 마이그레이션 전략

seed.design은 `@seed-design/tailwind4-theme` 패키지를 이미 준비해두었다. 향후 Tailwind 4 마이그레이션 시:
- `@theme` 블록으로 토큰 직접 선언
- CSS-first 설정으로 tailwind.config.js 제거 가능
- `@property` 활용으로 타입 안전 토큰

**권장**: 현재는 Tailwind 3 유지, seed.design의 TW4 지원이 안정화되면 마이그레이션

Sources:
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Typesafe Design Tokens in Tailwind 4](https://dev.to/wearethreebears/exploring-typesafe-design-tokens-in-tailwind-4-372d)
- [Tailwind Design Tokens Complete Guide 2025](https://nicolalazzari.ai/articles/integrating-design-tokens-with-tailwind-css)
- [Tailwind CSS 4 @theme Future of Design Tokens](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)

---

## 6. Open Source DS Adoption Patterns

### 6.1 채택 전략 비교

| 전략 | 설명 | 업데이트 용이성 | 커스텀 자유도 | 유지보수 부담 |
|------|------|----------------|--------------|--------------|
| **Full Fork** | 전체 저장소 복제 | 매우 어려움 | 완전 자유 | 매우 높음 |
| **Package Consume** | npm 패키지 설치 사용 | 매우 쉬움 | 제한적 | 매우 낮음 |
| **Token Override** | CSS 변수 오버라이드 | 쉬움 | 토큰 수준 자유 | 낮음 |
| **Wrapper Pattern** | 래퍼 컴포넌트 작성 | 쉬움 | 높음 | 중간 |
| **Headless Consume** | Headless 로직만 소비 | 쉬움 | 스타일 완전 자유 | 중간 |

### 6.2 seed.design 채택 시 버전 관리 전략

seed.design은 Changesets 기반 버전 관리를 사용한다:

**권장 접근**:
1. `@seed-design/css`와 `@seed-design/tailwind3-plugin`을 직접 의존성으로 설치
2. 시맨틱 버저닝을 통한 비파괴적 업데이트
3. 후니 전용 토큰 오버라이드를 별도 파일(`huni-brand-tokens.css`)로 관리
4. seed.design 메이저 업데이트 시에만 마이그레이션 작업 필요

### 6.3 업데이트 전략

```
seed.design 업데이트 흐름:
  seed.design 새 버전 릴리즈
    -> npm update @seed-design/css @seed-design/tailwind3-plugin
    -> 후니 오버라이드 파일 검증 (새 토큰 추가, 제거 확인)
    -> Storybook/시각적 회귀 테스트
    -> 배포
```

Sources:
- [Custom vs Open Source Design Systems - MagicFlux](https://magicflux.co/blog/custom-vs-open-source-design-systems)
- [Red Hat Open Design System](https://www.redhat.com/en/blog/open-source-meets-open-design-system)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Design System Examples 2025 - UXPin](https://www.uxpin.com/studio/blog/best-design-system-examples/)

---

## 7. Requirements Matrix

### MUST (필수)

| ID | 요구사항 | 근거 |
|----|---------|------|
| M1 | seed.design 토큰 체계(Option + Decision) 채택 | 업계 표준 3-Layer 토큰 아키텍처의 2계층 적용 |
| M2 | 후니 브랜드 컬러(#5538B6) 토큰 오버라이드 시스템 | Multi-brand DS 패턴의 Token Override 전략 |
| M3 | Tailwind CSS 3 + seed.design 플러그인 통합 | 현재 프로젝트 스택(aurora-skin-main) 호환 |
| M4 | 인쇄 전용 커스텀 컴포넌트 4종 개발 | seed.design에 없는 도메인 특화 컴포넌트 |
| M5 | CSS 변수 기반 테마 시스템 | 다크모드/라이트모드 및 브랜드 전환 대비 |
| M6 | TypeScript 타입 안전성 | seed.design의 타입 시스템 활용 |

### SHOULD (권장)

| ID | 요구사항 | 근거 |
|----|---------|------|
| S1 | seed.design headless 컴포넌트 로직 재활용 | 접근성(a11y) 및 키보드 인터랙션 품질 확보 |
| S2 | Storybook 기반 컴포넌트 문서화 | seed.design과 동일한 문서 도구 사용 |
| S3 | 시각적 회귀 테스트 (Chromatic 또는 유사) | seed.design 업데이트 시 UI 깨짐 방지 |
| S4 | Figma Variables 연동 파이프라인 | seed.design의 figma:sync 패턴 활용 |
| S5 | Atomic Design 계층 유지 (Atoms/Molecules/Organisms) | SPEC-DS-004 컴포넌트 분류 체계 연속성 |

### COULD (선택)

| ID | 요구사항 | 근거 |
|----|---------|------|
| C1 | Tailwind 4 마이그레이션 준비 | seed.design의 tailwind4-theme 패키지 존재 |
| C2 | W3C DTCG 포맷 토큰 내보내기 | 미래 도구 호환성 확보 |
| C3 | seed.design 컴포넌트 직접 소비 (Button, Dialog 등) | 범용 UI 컴포넌트 개발 생략 |
| C4 | 디자인 토큰 거버넌스 문서화 | 토큰 변경/추가 프로세스 정의 |

---

## 8. Recommended Technology Stack with Rationale

### Core Stack

| 기술 | 버전 | 역할 | 선정 근거 |
|------|------|------|----------|
| **React** | 18.x (현재) / 19.x (seed.design 호환) | UI 라이브러리 | seed.design peerDep: `>=18.0.0` |
| **Tailwind CSS** | 3.x | 유틸리티 CSS | 현재 프로젝트 스택, seed.design TW3 플러그인 |
| **@seed-design/css** | >=1.1.17 | 디자인 토큰 CSS | seed.design 토큰 체계의 핵심 패키지 |
| **@seed-design/tailwind3-plugin** | 1.1.18 | TW3 통합 | seed.design 토큰을 Tailwind 클래스로 노출 |
| **TypeScript** | 5.x | 타입 시스템 | 타입 안전 컴포넌트 개발 |

### Design Token Layer

| 레이어 | 파일 | 역할 |
|--------|------|------|
| **Foundation** | `@seed-design/css/base.css` | seed.design 기본 토큰 (palette, semantic) |
| **Brand Override** | `huni-brand-tokens.css` | 후니프린팅 브랜드 토큰 오버라이드 |
| **Component Tokens** | `huni-component-tokens.css` | 인쇄 도메인 전용 컴포넌트 토큰 |

### Brand Token Override 구조 (예시)

```css
/* huni-brand-tokens.css */
:root {
  /* seed.design의 carrot(당근) 팔레트를 후니 purple로 매핑 */
  --seed-color-fg-brand: #5538B6;
  --seed-color-fg-brand-contrast: #FFFFFF;
  --seed-color-bg-brand-solid: #5538B6;
  --seed-color-bg-brand-solid-pressed: #4A2FA3;
  --seed-color-bg-brand-weak: #F0EDFA;
  --seed-color-bg-brand-weak-pressed: #E5E0F5;
  --seed-color-stroke-brand-solid: #5538B6;
  --seed-color-stroke-brand-weak: #D4CCF0;
}
```

### Component Architecture

```
src/
  design-system/
    tokens/
      huni-brand-tokens.css          # 브랜드 오버라이드
      huni-component-tokens.css      # 인쇄 도메인 토큰
    components/
      primitives/                    # seed.design 래퍼
        Button.tsx                   # ActionButton 래퍼
        Badge.tsx                    # Badge 래퍼
      printing/                      # 인쇄 전용 커스텀
        ColorChip.tsx                # 박 칼라 선택
        CounterOption.tsx            # 개수 선택
        CollapsibleSection.tsx       # 접이식 섹션
        PriceSummary.tsx             # 가격 요약
      composed/                      # 조합 컴포넌트
        SizeOptionChip.tsx           # Chip + 인쇄 로직
        DropdownSelect.tsx           # SelectBox + 인쇄 로직
    index.ts                         # 배럴 내보내기
  tailwind.config.ts                 # seed.design TW3 plugin 설정
```

### 채택 전략 요약

**Token Override + Selective Wrapper** 패턴:

1. **Base**: `@seed-design/css` + `@seed-design/tailwind3-plugin` 설치
2. **Brand**: CSS 변수 오버라이드로 당근 -> 후니 브랜드 전환
3. **Consume**: seed.design의 범용 컴포넌트 9종 직접 소비 또는 래핑
4. **Custom**: 인쇄 전용 컴포넌트 4종 새로 개발
5. **Headless**: 복잡한 인터랙션은 `@seed-design/react-headless` 로직 활용

이 전략의 장점:
- 업스트림(seed.design) 업데이트 추적 용이
- 브랜드 커스터마이징 자유도 확보
- 인쇄 도메인 특화 컴포넌트 독립 개발
- Tailwind 3 기존 코드베이스와 자연스러운 통합
- 향후 Tailwind 4 마이그레이션 경로 확보

---

## Appendix: Source References

### Design Token Management
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [DTCG GitHub](https://github.com/design-tokens/community-group)
- [Martin Fowler - Design Token-Based UI Architecture](https://martinfowler.com/articles/design-token-based-ui-architecture.html)
- [Cobalt UI](https://cobalt-ui.pages.dev/)
- [Style Dictionary](https://styledictionary.com/)
- [Design Tokens with Confidence - UX Collective](https://uxdesign.cc/design-tokens-with-confidence-862119eb819b)

### seed.design
- [seed.design Official](https://seed-design.io/)
- [GitHub daangn/seed-design](https://github.com/daangn/seed-design)
- [@seed-design/css - npm](https://www.npmjs.com/package/@seed-design/css)
- [Deepwiki SEED Design](https://deepwiki.com/daangn/seed-design)

### Multi-Brand Design Systems
- [Multi-Brand Design System - Christopher Arold](https://medium.com/@christopher.arold87/multi-brand-design-system-1fcf3d30e4ff)
- [Signify Multi-Branded DS - Hike One](https://hike.one/work/signify-multi-branded-design-system)
- [Designing with Tokens for Multi-Brand - Clearleft](https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system)

### Tailwind Integration
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind Design Tokens Guide 2025](https://nicolalazzari.ai/articles/integrating-design-tokens-with-tailwind-css)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)

### Printing Industry
- [프린트시티](https://www.printcity.co.kr/)
- [레드프린팅](https://www.redprinting.co.kr/ko)
- [E-commerce Product Configurator](https://commerce-ui.com/insights/ecommerce-product-configurator-2024-guide)

### Open Source DS Adoption
- [Custom vs Open Source DS - MagicFlux](https://magicflux.co/blog/custom-vs-open-source-design-systems)
- [Red Hat Open Design System](https://www.redhat.com/en/blog/open-source-meets-open-design-system)
- [Carbon Design System](https://carbondesignsystem.com/)
