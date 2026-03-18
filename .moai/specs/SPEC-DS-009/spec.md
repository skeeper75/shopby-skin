---
id: SPEC-DS-009
version: 1.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
author: 지니
priority: P1
issue_number: 0
title: "후니 디자인시스템 v6.0 — 인터랙티브 플레이그라운드 및 토큰 파이프라인"
---

# SPEC-DS-009: 후니 디자인시스템 v6.0 — 인터랙티브 플레이그라운드 및 토큰 파이프라인

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-03-17 | 지니 | 초기 SPEC 작성 |

---

## Environment (환경)

### 기술 스택

| 항목 | 현재 | 추가/변경 |
|------|------|-----------|
| 프레임워크 | React 18.2 | 유지 |
| 빌드 도구 | Webpack 5 | 유지 (Storybook 빌더로 재활용) |
| 스타일링 | Tailwind CSS 3.4 + CSS 커스텀 프로퍼티 | 토큰 네이밍 표준화 |
| 테스트 | Vitest | + @storybook/test |
| 신규 | - | Storybook 8.6.x, Chromatic 13.x |

### 디자인시스템 현황

- 컴포넌트 수: 26개 (atoms/molecules/organisms 3-layer)
- 아키텍처: Figma tokens + cva + Radix
- CSS 토큰: ~8K 토큰 규모 (비표준 네이밍)
- 문서화: 없음 (플레이그라운드 부재)
- 접근성 검증: 없음
- 비주얼 리그레션: 없음

### 관련 SPEC

- SPEC-SKIN-001 ~ 008: 디자인시스템 마이그레이션 시리즈
- SPEC-DS-004: 이전 디자인시스템 SPEC

---

## Assumptions (가정)

### 기술적 가정

- [A1] Storybook 8의 @storybook/react-webpack5 빌더가 기존 Webpack 5 설정과 호환된다
- [A2] Chromatic 무료 티어(5,000 스냅샷/월)가 26개 컴포넌트의 비주얼 리그레션 테스트에 충분하다
- [A3] JSX(비-TypeScript) 환경에서 Storybook 8의 autodocs 기능이 정상 동작한다
- [A4] 기존 CSS 커스텀 프로퍼티의 네이밍 변경이 Tailwind CSS 설정과 충돌하지 않는다

### 비즈니스 가정

- [A5] 디자인시스템 플레이그라운드가 개발자/디자이너 간 커뮤니케이션 비용을 줄인다
- [A6] WCAG 2.2 AA 접근성 준수가 향후 요구사항이 된다
- [A7] 비주얼 리그레션 테스트가 UI 변경 사고를 예방한다

---

## Requirements (요구사항)

### R1: Storybook 플레이그라운드 구축 [Event-Driven] — P1

**WHEN** 개발자/디자이너가 디자인시스템 컴포넌트를 확인하고자 할 때,
**THEN** 시스템은 Storybook 8 기반 인터랙티브 플레이그라운드를 제공하여 26개 전체 컴포넌트를 카테고리별(atoms/molecules/organisms)로 탐색, 프로퍼티 조작, 상태 확인할 수 있어야 한다.

**상세 요구사항:**

- [R1.1] Storybook 8 + @storybook/react-webpack5 빌더를 사용하여 기존 Webpack 설정을 재활용한다
- [R1.2] 26개 전체 컴포넌트에 대해 스토리를 작성한다
- [R1.3] 토큰 시각화 스토리를 제공한다 (Colors, Typography, Spacing, Radius)
- [R1.4] autodocs를 통한 자동 API 문서를 생성한다
- [R1.5] 컴포넌트를 atoms/molecules/organisms 카테고리로 분류한다

### R2: 접근성(WCAG 2.2 AA) 검증 체계 [State-Driven] — P1

**IF** 디자인시스템 컴포넌트가 개발/수정되는 동안,
**THEN** 시스템은 @storybook/addon-a11y (axe-core)를 통해 WCAG 2.2 AA 준수 여부를 실시간으로 검증하고, 위반 사항을 즉시 표시해야 한다.

**상세 요구사항:**

- [R2.1] 모든 컴포넌트 스토리에 a11y 검증을 활성화한다
- [R2.2] 키보드 내비게이션 검증을 수행한다
- [R2.3] 색상 대비 3:1 이상(UI 컴포넌트), 4.5:1 이상(텍스트)을 확인한다
- [R2.4] ARIA 역할/속성의 올바른 사용을 확인한다

### R3: 비주얼 리그레션 테스트 파이프라인 [Event-Driven] — P2

**WHEN** PR이 생성되거나 디자인시스템 컴포넌트가 변경될 때,
**THEN** 시스템은 Chromatic을 통해 모든 컴포넌트 스토리의 비주얼 스냅샷을 비교하고, 시각적 변경 사항을 리뷰어에게 알려야 한다.

**상세 요구사항:**

- [R3.1] Chromatic 연동을 설정한다
- [R3.2] GitHub Actions CI 파이프라인에 통합한다
- [R3.3] TurboSnap으로 변경된 스토리만 비교하여 비용을 최적화한다
- [R3.4] PR 단위 비주얼 리뷰 프로세스를 수립한다

### R4: 디자인 토큰 체계 표준화 [Ubiquitous] — P2

시스템은 **항상** CSS 커스텀 프로퍼티 기반 디자인 토큰에 대해 W3C DTCG 호환 네이밍 컨벤션(`--huni-{category}-{name}`)을 적용하고, Storybook 토큰 갤러리를 통해 모든 토큰을 시각적으로 탐색할 수 있어야 한다.

**상세 요구사항:**

- [R4.1] `--huni-color-*`, `--huni-typo-*`, `--huni-space-*` 네이밍을 통일한다
- [R4.2] Storybook에서 토큰 시각화를 제공한다 (color swatches, typography scale, spacing scale)
- [R4.3] Tailwind config와 CSS 변수 매핑을 동기화한다
- [R4.4] 기존 토큰의 점진적 마이그레이션 전략을 수립한다

### R5: 스킬 문서 강화 및 베스트 프랙티스 통합 [Event-Driven] — P1

**WHEN** innojini-huni-design-system 스킬이 v6.0으로 업데이트될 때,
**THEN** 시스템은 국내외 디자인시스템 리서치(Material Design 3, seed.design, Toss DS, W3C DTCG) 결과를 반영하여 토큰 아키텍처 가이드, 접근성 체크리스트, 컴포넌트 설계 원칙, Storybook 연동 가이드를 추가해야 한다.

**상세 요구사항:**

- [R5.1] 3계층 토큰 아키텍처 가이드를 작성한다 (Primitive -> Semantic -> Component)
- [R5.2] WCAG 2.2 AA 접근성 체크리스트를 컴포넌트별로 제공한다
- [R5.3] CDD(Component-Driven Development) 방법론 가이드를 작성한다
- [R5.4] Storybook 스토리 작성 가이드를 작성한다

---

## Specifications (명세)

### 기술 스택

| 패키지 | 버전 | 용도 |
|--------|------|------|
| storybook | 8.6.x | 코어 프레임워크 |
| @storybook/react-webpack5 | 8.6.x | React + Webpack 5 빌더 |
| @storybook/addon-essentials | 8.6.x | Controls, Actions, Viewport 등 |
| @storybook/addon-a11y | 8.6.x | 접근성 검증 (axe-core) |
| @storybook/addon-interactions | 8.6.x | 인터랙션 테스트 |
| @storybook/test | 8.6.x | Vitest 호환 테스트 |
| chromatic | 13.x | 비주얼 리그레션 테스트 |
| React | 18.2 | 기존 유지 |
| Webpack | 5 | 기존 유지 |
| Tailwind CSS | 3.4 | 기존 유지 |
| Vitest | 기존 | 기존 유지 |

### 스코프

**포함:**

- Storybook 8 + Webpack 5 셋업 및 전체 컴포넌트 스토리
- 접근성(a11y) addon 통합 및 WCAG 검증
- Chromatic 비주얼 리그레션 테스트
- 토큰 네이밍 컨벤션 표준화 및 시각화
- 스킬 문서(innojini-huni-design-system) v6.0 업데이트

**제외:**

- Figma Variables API 연동 자동화 (별도 SPEC)
- Next.js + Fumadocs 풀 문서 사이트 (과도한 규모, 필요 시 별도 SPEC)
- seed.design 스타일 monorepo 전환 (현재 규모에 부적합)
- CSS-in-JS 또는 Vanilla Extract 전환 (현재 Tailwind CSS 유지)
- TypeScript 전환 (별도 SPEC)
- 디자인 토큰 자동 생성 파이프라인 — Style Dictionary (별도 SPEC)

### 디렉토리 구조

```
src/design-system/
  __stories__/
    atoms/
      BadgeLabel.stories.jsx
      InfoTooltip.stories.jsx
    molecules/
      CTAButton.stories.jsx
      CounterOption.stories.jsx
      DropdownSelect.stories.jsx
      OptionLabel.stories.jsx
      QuantityInput.stories.jsx
      RadioOption.stories.jsx
      SizeInput.stories.jsx
      SizeOptionChip.stories.jsx
    organisms/
      CollapsibleSection.stories.jsx
      PriceSummary.stories.jsx
    tokens/
      Colors.stories.jsx
      Typography.stories.jsx
      Spacing.stories.jsx
      Radius.stories.jsx
  components/
    atoms/
    molecules/
    organisms/
  tokens/
.storybook/
  main.js
  preview.js
  manager.js
.github/
  workflows/
    chromatic.yml
```

### 토큰 네이밍 컨벤션

```
기존:      --primary-color, --font-size-lg, --space-4
변경 후:   --huni-color-primary, --huni-typo-size-lg, --huni-space-4

카테고리:
  --huni-color-*     색상 토큰
  --huni-typo-*      타이포그래피 토큰
  --huni-space-*     간격 토큰
  --huni-radius-*    모서리 반경 토큰
  --huni-shadow-*    그림자 토큰
```

### 의존성 관계

```
R1 (Storybook 셋업)
  ├── R2 (a11y 검증) — R1의 addon으로 통합
  ├── R3 (Chromatic) — R1의 스토리 기반
  └── R4 (토큰 표준화) — R1의 토큰 갤러리와 연동

R5 (스킬 문서) — R1~R4 완료 후 업데이트
```

---

## Constraints (제약사항)

- [C1] JSX(비-TypeScript) 환경 유지 — TypeScript 전환은 별도 SPEC
- [C2] 기존 Webpack 5 설정을 최대한 재활용한다
- [C3] Chromatic 무료 티어 범위 내에서 운영한다 (5,000 스냅샷/월)
- [C4] 기존 컴포넌트의 API 변경 없이 스토리를 작성한다
- [C5] 토큰 네이밍 변경 시 하위 호환성을 유지한다 (deprecated alias 제공)

---

## Traceability (추적성)

| TAG | 요구사항 | plan.md | acceptance.md |
|-----|----------|---------|---------------|
| SPEC-DS-009-R1 | Storybook 플레이그라운드 | Phase 1-2 | AC-R1-* |
| SPEC-DS-009-R2 | WCAG 2.2 AA 접근성 | Phase 2 | AC-R2-* |
| SPEC-DS-009-R3 | Chromatic 비주얼 리그레션 | Phase 3 | AC-R3-* |
| SPEC-DS-009-R4 | 토큰 표준화 | Phase 4 | AC-R4-* |
| SPEC-DS-009-R5 | 스킬 문서 v6.0 | Phase 5 | AC-R5-* |
