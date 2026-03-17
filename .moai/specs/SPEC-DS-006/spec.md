---
id: SPEC-DS-006
version: 2.0.0
status: completed
created: 2026-03-17
updated: 2026-03-17
completed: 2026-03-17
author: MoAI
priority: high
issue_number: 0
tags: [design-system, components, seed-design, radix-ui, cva, accessibility, compound-component, slot-recipe]
depends_on: [SPEC-DS-004, SPEC-DS-005]
affects: [SPEC-DS-007, SPEC-DS-008, SPEC-DS-009]
---

# SPEC-DS-006: Seed Design Compound Component 패턴 기반 후니프린팅 디자인시스템 컴포넌트 확장

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2026-03-17 | 초안 작성 - 15개 컴포넌트 명세, 토큰 확장 |
| 2.0.0 | 2026-03-17 | Seed Design 실제 구현 패턴 반영 - Compound Component + Slot 패턴, Dialog/TextField/Snackbar 재설계, 14개 컴포넌트 확정 |

---

## 1. 개요

후니프린팅 인쇄 자동화 견적 플랫폼의 IA 94개 기능(쇼핑몰 43 + 관리자 51)을 구현하기 위해, 당근 Seed Design 시스템의 **Compound Component + Slot Recipe** 패턴을 참조하여 후니 디자인시스템에 누락된 **14개 핵심 컴포넌트**를 추가하고, **디자인 토큰 체계를 확장**한다.

### 1.1 목표

- **Compound Component 패턴 도입**: Seed Design의 `Component.Root > Component.Slot` 구조를 채택하여 유연하고 합성 가능한 컴포넌트 API 제공
- **Slot Recipe 패턴 적용**: Seed Design의 `defineSlotRecipe` 구조(slots/base/variants/compoundVariants)를 CVA로 적응하여 슬롯별 스타일링 체계 구축
- **data-* 상태 속성 기반 접근성**: Seed Design의 `data-checked`, `data-disabled`, `data-indeterminate` + focusVisible 관리 패턴 적용
- Seed Design의 Role-based 토큰 체계를 후니 브랜드에 맞게 적용
- IA 기반 필수 UI 컴포넌트 14개 신규 구현
- 기존 13개 컴포넌트의 토큰 마이그레이션
- 인쇄 특화 RULE-1~8 보존

### 1.2 범위

- **In Scope**: Tier 1 컴포넌트 (14개), 토큰 확장, 기존 컴포넌트 마이그레이션
- **Out of Scope**: Tier 2/3 컴포넌트 (후속 SPEC), 페이지 레벨 구현

### 1.3 컴포넌트 목록 변경 사항 (v1.0 대비)

| 변경 | 상세 |
|------|------|
| AlertDialog -> Dialog | Seed Design에는 AlertDialog가 없음. 범용 Dialog 컴포넌트 사용 |
| TextInput + Textarea -> TextField | Seed Design은 두 입력 타입을 TextField 하나로 통합 |
| Snackbar | 단순 컴포넌트가 아닌 Programmatic API (SnackbarProvider + useSnackbar hook + SnackbarRegion) |
| Pagination | Seed Design에 존재하지 않음. 후니 자체 설계 컴포넌트로 표기 |
| **총 수: 15개 -> 14개** | TextField가 TextInput + Textarea를 통합하여 1개 감소 |

---

## 2. 요구사항 (EARS 형식)

### REQ-1: 디자인 토큰 확장

**When** 후니 DS를 사용하는 컴포넌트가 스타일링될 때,
**the system shall** Seed Design Role-based 토큰 체계(bg/fg/stroke x role x variant)와 호환되는 --huni-* CSS 변수를 제공해야 한다.
**so that** 일관된 시각 언어로 모든 컴포넌트를 스타일링할 수 있다.

### REQ-2: 기존 토큰 호환성

**While** 기존 --po-* 토큰을 참조하는 컴포넌트가 존재하는 동안,
**the system shall** --po-* 변수가 --huni-* 변수를 참조하는 호환 레이어를 제공해야 한다.
**so that** 기존 코드가 수정 없이 동작한다.

### REQ-3: Compound Component 패턴

**For all** 신규 컴포넌트,
**the system shall** Seed Design의 Compound Component 패턴을 따라 `Component.Root`, `Component.Control`, `Component.Label` 등 명시적 Slot 서브컴포넌트로 구성해야 한다.
**so that** 소비자가 필요한 슬롯만 선택적으로 조합하여 유연한 UI를 구성할 수 있다.

### REQ-4: Slot Recipe 스타일링

**For all** 신규 컴포넌트,
**the system shall** Seed Design의 defineSlotRecipe 구조(slots 배열, 슬롯별 base 스타일, 슬롯별 variants, compoundVariants)를 CVA로 적응한 슬롯 레시피 패턴을 사용해야 한다.
**so that** 각 슬롯의 스타일을 독립적으로 관리하고 복합 상태(disabled + checked 등)를 체계적으로 처리할 수 있다.

### REQ-5: data-* 상태 속성 기반 접근성

**For all** 신규 컴포넌트,
**the system shall** Seed Design의 접근성 패턴을 따라 `data-checked`, `data-disabled`, `data-indeterminate`, `data-selected`, `data-open` 등의 data-* 상태 속성을 렌더링하고, `createFocusRingStyles()` 패턴에 대응하는 focusVisible 스타일을 제공해야 한다.
**so that** CSS 선택자 기반 상태 스타일링과 보조 기술 호환이 가능하다.

### REQ-6: 신규 Atom 컴포넌트 (7개)

**When** 사용자가 폼 입력, 선택, 상태 표시가 필요한 페이지를 방문할 때,
**the system shall** Checkbox, Radio, Switch, Divider, Icon, Chip, Skeleton 7개 Atom 컴포넌트를 Compound Component 패턴으로 제공해야 한다.

### REQ-7: 신규 Molecule 컴포넌트 (4개)

**When** 사용자가 텍스트 입력, 탭 전환, 폼 필드, 목록 페이징이 필요한 페이지를 방문할 때,
**the system shall** TextField(input + textarea 통합), Tabs, Field, Pagination 4개 Molecule 컴포넌트를 제공해야 한다.

### REQ-8: 신규 Organism 컴포넌트 (2개) - Programmatic API 포함

**When** 사용자에게 대화상자나 알림 메시지를 표시해야 할 때,
**the system shall** Dialog(범용 대화상자, lazyMount/unmountOnExit 지원)와 Snackbar(SnackbarProvider + useSnackbar hook + SnackbarRegion 기반 Programmatic API)를 제공해야 한다.

### REQ-9: CVA + Radix 패턴 준수

**For all** 신규 컴포넌트,
**the system shall** 기존 패턴(React.forwardRef, displayName, CVA variants, cn() 유틸, Radix UI Primitives)을 따르되, Compound Component 서브컴포넌트 각각에 forwardRef와 displayName을 적용해야 한다.

### REQ-10: 키보드 접근성

**For all** 신규 컴포넌트,
**the system shall** WAI-ARIA 패턴을 준수하고 키보드 네비게이션(Tab, Enter, Space, Escape, Arrow Keys)을 지원해야 한다.

### REQ-11: 인쇄 특화 규칙 보존

**While** 기존 인쇄 옵션 컴포넌트가 사용되는 동안,
**the system shall** RULE-1~8을 위반하지 않아야 한다.

---

## 3. 디자인 토큰 확장 명세

### 3.1 Color -- Primitive (팔레트)

```css
/* Purple (브랜드) */
--huni-purple-50: #F3F0FF;
--huni-purple-100: #EEEBF9;
--huni-purple-200: #DED7F4;
--huni-purple-300: #C9C2DF;
--huni-purple-400: #9480D8;
--huni-purple-500: #5538B6;
--huni-purple-600: #553886;
--huni-purple-700: #3B2573;

/* Accent */
--huni-orange-500: #DF7838;
--huni-gold-500: #E6B93F;
--huni-teal-500: #7AC8C4;

/* Gray */
--huni-gray-0: #FFFFFF;
--huni-gray-50: #F6F6F6;
--huni-gray-100: #E9E9E9;
--huni-gray-200: #CACACA;
--huni-gray-300: #ABABAB;
--huni-gray-500: #979797;
--huni-gray-600: #565656;
--huni-gray-700: #424242;
--huni-gray-900: #1B1B1B;

/* Semantic */
--huni-red-500: #E5503C;
--huni-green-500: #1DAA61;
--huni-blue-500: #3B82F6;
--huni-yellow-500: #F5A524;
```

### 3.2 Color -- Semantic (역할 기반)

```css
/* Background */
--huni-bg-brand-solid: var(--huni-purple-500);
--huni-bg-brand-weak: var(--huni-purple-50);
--huni-bg-neutral-weak: var(--huni-gray-50);
--huni-bg-neutral-inverted: var(--huni-gray-900);
--huni-bg-critical-solid: var(--huni-red-500);
--huni-bg-positive-solid: var(--huni-green-500);
--huni-bg-warning-solid: var(--huni-yellow-500);
--huni-bg-informative-solid: var(--huni-blue-500);
--huni-bg-layer-default: var(--huni-gray-0);
--huni-bg-layer-floating: var(--huni-gray-0);
--huni-bg-disabled: var(--huni-gray-100);

/* Foreground */
--huni-fg-brand: var(--huni-purple-500);
--huni-fg-neutral: var(--huni-gray-700);
--huni-fg-neutral-subtle: var(--huni-gray-500);
--huni-fg-neutral-muted: var(--huni-gray-300);
--huni-fg-neutral-inverted: var(--huni-gray-0);
--huni-fg-critical: var(--huni-red-500);
--huni-fg-positive: var(--huni-green-500);
--huni-fg-warning: var(--huni-yellow-500);
--huni-fg-informative: var(--huni-blue-500);
--huni-fg-disabled: var(--huni-gray-200);

/* Stroke */
--huni-stroke-brand: var(--huni-purple-500);
--huni-stroke-neutral-muted: var(--huni-gray-200);
--huni-stroke-neutral-weak: var(--huni-gray-100);
--huni-stroke-neutral-contrast: var(--huni-gray-700);
--huni-stroke-critical: var(--huni-red-500);
--huni-stroke-positive: var(--huni-green-500);
--huni-stroke-disabled: var(--huni-gray-200);
```

### 3.3 Spacing

```css
--huni-space-0_5: 2px;
--huni-space-1: 4px;
--huni-space-1_5: 6px;
--huni-space-2: 8px;
--huni-space-2_5: 10px;
--huni-space-3: 12px;
--huni-space-3_5: 14px;
--huni-space-4: 16px;
--huni-space-4_5: 18px;
--huni-space-5: 20px;
--huni-space-6: 24px;
--huni-space-7: 28px;
--huni-space-8: 32px;
--huni-space-9: 36px;
--huni-space-10: 40px;
--huni-space-12: 48px;
--huni-space-16: 64px;
```

### 3.4 Radius

```css
--huni-radius-0: 0px;
--huni-radius-1: 4px;
--huni-radius-1_5: 6px;
--huni-radius-2: 8px;
--huni-radius-3: 12px;
--huni-radius-4: 16px;
--huni-radius-full: 9999px;
```

### 3.5 Typography 확장

```css
/* 기존 t1~t7에 추가 */
--huni-text-t8: 1.375rem;   /* 22px */
--huni-text-t9: 1.5rem;     /* 24px */
--huni-text-t10: 1.625rem;  /* 26px */

--huni-leading-t8: 1.875rem;  /* 30px */
--huni-leading-t9: 2rem;      /* 32px */
--huni-leading-t10: 2.1875rem; /* 35px */
```

### 3.6 Elevation (Shadow)

```css
--huni-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--huni-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
--huni-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--huni-shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.15);
```

### 3.7 Motion

```css
--huni-duration-fast: 100ms;
--huni-duration-normal: 200ms;
--huni-duration-slow: 300ms;
--huni-easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--huni-easing-in: cubic-bezier(0.4, 0, 1, 1);
--huni-easing-out: cubic-bezier(0, 0, 0.2, 1);
```

---

## 4. 컴포넌트 명세

> **패턴 규약**: 모든 컴포넌트는 Seed Design의 Compound Component + Slot 패턴을 따른다.
> - 각 컴포넌트는 `Component.Root`를 진입점으로 하는 네임스페이스 객체로 export
> - 각 Slot 서브컴포넌트는 개별 `React.forwardRef` + `displayName` 적용
> - 슬롯별 CVA variant 함수를 분리하여 독립적 스타일 관리
> - Seed Design의 pseudo 유틸리티(disabled, focusVisible, checked, selected, open, engaged)에 대응하는 data-* 속성 사용

### 4.1 Atoms (7개)

---

#### 4.1.1 Checkbox

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Checkbox.jsx |
| 의존성 | @radix-ui/react-checkbox |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Checkbox.Root` | 최상위 컨테이너. 체크박스 + 라벨 레이아웃 |
| hiddenInput | `Checkbox.HiddenInput` | 네이티브 `<input type="checkbox">` (접근성용, 시각적으로 숨김) |
| control | `Checkbox.Control` | 시각적 체크박스 박스 (테두리, 배경) |
| indicator | `Checkbox.Indicator` | 체크마크/인디케이터 아이콘 (checked/indeterminate 상태에서 표시) |
| label | `Checkbox.Label` | 라벨 텍스트 |

**Variants:**

| variant | 설명 | Seed Design 대응 |
|---------|------|-----------------|
| `square` (기본) | 사각형 체크박스 | Seed checkbox 기본 |
| `ghost` | 배경 없는 투명 체크박스 | Seed checkbox ghost |

**Sizes:**

| size | 높이 | 타이포그래피 | Seed Design 대응 |
|------|------|-------------|-----------------|
| `md` | 32px | t4 | Seed medium |
| `lg` | 36px | t5 | Seed large |

**States (data-* 속성):**

| data 속성 | 설명 |
|-----------|------|
| `data-checked` | 체크됨 |
| `data-disabled` | 비활성 |
| `data-indeterminate` | 부분 선택 (트리/전체선택) |
| `data-focus-visible` | 키보드 포커스 시 포커스 링 표시 |

**Props (Root):**

```
checked: boolean | 'indeterminate'
onCheckedChange: (checked: boolean | 'indeterminate') => void
disabled: boolean
variant: 'square' | 'ghost'
size: 'md' | 'lg'
className: string
```

**Props (Label):**

```
weight: 'regular' | 'bold'
children: ReactNode
```

**슬롯별 토큰 매핑:**

| 슬롯 | 토큰 |
|------|------|
| control (checked) 배경 | `--huni-bg-neutral-inverted` |
| control (unchecked) 테두리 | `--huni-stroke-neutral-weak` (1px) |
| control (disabled) 배경 | `--huni-bg-disabled` |
| control focusVisible | 2px ring, offset 2px, `--huni-stroke-brand` |
| indicator 아이콘 색상 | `--huni-fg-neutral-inverted` |
| label 텍스트 색상 | `--huni-fg-neutral` |
| root 간격 (control-label) | `--huni-space-2` (8px) |

**접근성:**

- `data-checked`, `data-disabled`, `data-indeterminate` 속성 렌더링
- HiddenInput이 실제 `role="checkbox"` + `aria-checked` 담당
- focusVisible 시 control에 포커스 링 표시
- Space 키로 토글

---

#### 4.1.2 Radio

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Radio.jsx |
| 의존성 | @radix-ui/react-radio-group |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Radio.Root` | RadioGroup 컨테이너 |
| item | `Radio.Item` | 개별 라디오 아이템 컨테이너 |
| hiddenInput | `Radio.HiddenInput` | 네이티브 `<input type="radio">` (접근성용) |
| control | `Radio.Control` | 시각적 라디오 원형 |
| indicator | `Radio.Indicator` | 선택 시 내부 원 표시 |
| label | `Radio.Label` | 라벨 텍스트 |

**Sizes:**

| size | 높이 | 타이포그래피 |
|------|------|-------------|
| `md` | 32px | t4 |
| `lg` | 36px | t5 |

**States (data-* 속성):**

| data 속성 | 설명 |
|-----------|------|
| `data-checked` | 선택됨 |
| `data-disabled` | 비활성 |
| `data-focus-visible` | 키보드 포커스 링 |

**Props (Root):**

```
value: string
onValueChange: (value: string) => void
disabled: boolean
orientation: 'vertical' | 'horizontal'
```

**Props (Item):**

```
value: string
disabled: boolean
size: 'md' | 'lg'
```

**Props (Label):**

```
weight: 'regular' | 'bold'
children: ReactNode
```

**슬롯별 토큰 매핑:**

| 슬롯 | 토큰 |
|------|------|
| control (checked) 배경 | `--huni-bg-neutral-inverted` |
| control (unchecked) 테두리 | `--huni-stroke-neutral-weak` (1px) |
| control (disabled) | `--huni-bg-disabled` |
| control focusVisible | 2px ring, `--huni-stroke-brand` |
| indicator 색상 | `--huni-fg-neutral-inverted` |
| root 간격 (아이템 간) | `--huni-space-1` (4px) |

**접근성:**

- `role="radiogroup"` + `role="radio"` + `aria-checked`
- Arrow 키로 그룹 내 이동
- data-checked, data-disabled 속성

---

#### 4.1.3 Switch

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Switch.jsx |
| 의존성 | @radix-ui/react-switch |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Switch.Root` | 최상위 컨테이너 (라벨 포함 레이아웃) |
| hiddenInput | `Switch.HiddenInput` | 네이티브 체크박스 input (접근성) |
| control | `Switch.Control` | 스위치 트랙 |
| thumb | `Switch.Thumb` | 슬라이딩 원형 핸들 |
| label | `Switch.Label` | 라벨 텍스트 |

**Sizes (Seed Design 매핑):**

| size | Seed Design 값 | 트랙 크기 |
|------|----------------|----------|
| `md` | "16" | 36x20px |
| `lg` | "32" | 48x28px |

> 참고: Seed Design은 "16"/"32" (픽셀 기반) 크기를 사용. 후니는 md/lg로 매핑하되 Seed Design 값을 기록.

**States (data-* 속성):**

| data 속성 | 설명 |
|-----------|------|
| `data-checked` | ON 상태 |
| `data-disabled` | 비활성 |
| `data-focus-visible` | 포커스 링 |

**Props (Root):**

```
checked: boolean
onCheckedChange: (checked: boolean) => void
disabled: boolean
size: 'md' | 'lg'
className: string
```

**Props (Label):**

```
children: ReactNode
```

**슬롯별 토큰 매핑:**

| 슬롯 | 토큰 |
|------|------|
| control (on) 트랙 | `--huni-bg-brand-solid` |
| control (off) 트랙 | `--huni-bg-neutral-weak` |
| control (disabled) | `--huni-bg-disabled` |
| control focusVisible | 2px ring, `--huni-stroke-brand` |
| thumb | `--huni-gray-0` (white) |
| thumb transition | `--huni-duration-fast`, `--huni-easing-default` |

**접근성:**

- `role="switch"` + `aria-checked`
- Space 키로 토글
- data-checked, data-disabled 속성

---

#### 4.1.4 Divider

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Divider.jsx |
| 의존성 | 없음 |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Divider.Root` | 구분선 요소 (`<hr>` 또는 `<div role="separator">`) |

> Divider는 단일 슬롯 컴포넌트. Compound 패턴은 유지하되 서브컴포넌트는 Root만 존재.

**Variants:**

| variant | 설명 |
|---------|------|
| `full` | 전체 너비 구분선 |
| `inset` | 좌우 패딩이 있는 구분선 |

**Direction:**

| direction | 설명 |
|-----------|------|
| `horizontal` (기본) | 수평 구분선 |
| `vertical` | 수직 구분선 |

**Props (Root):**

```
variant: 'full' | 'inset'
direction: 'horizontal' | 'vertical'
className: string
```

**토큰 매핑:**

| 슬롯 | 토큰 |
|------|------|
| root 색상 | `--huni-stroke-neutral-muted` |
| root 두께 | 1px |
| root 인셋 패딩 | `--huni-space-4` (16px) |

**접근성:**

- `role="separator"` + `aria-orientation`

---

#### 4.1.5 Icon

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Icon.jsx |
| 의존성 | lucide-react |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Icon.Root` | SVG 아이콘 래퍼. CSS 변수(--huni-icon-size, --huni-icon-color)로 크기/색상 제어 |

> Seed Design에서 Icon은 `svg` prop으로 SVG 컴포넌트를 받고, CSS 변수 `--seed-icon-size`, `--seed-icon-color`로 크기와 색상을 제어한다. 후니는 lucide-react를 아이콘 소스로 사용하되, Seed Design의 CSS 변수 패턴을 채택한다.

**Sizes:**

| size | CSS 변수 값 | 픽셀 |
|------|------------|------|
| `xs` | 12 | 12px |
| `sm` | 16 | 16px |
| `md` | 20 | 20px |
| `lg` | 24 | 24px |
| `xl` | 32 | 32px |

**CSS 변수 패턴:**

```css
/* Icon.Root에서 설정 */
--huni-icon-size: 20px;  /* size prop에 따라 동적 설정 */
--huni-icon-color: currentColor;  /* color prop 또는 부모 상속 */
```

**Props (Root):**

```
icon: LucideIcon           /* lucide-react 아이콘 컴포넌트 */
size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
color: string              /* CSS 색상 값. 미지정 시 currentColor */
className: string
```

**토큰 매핑:**

| 속성 | 토큰 |
|------|------|
| 기본 색상 | `currentColor` (부모 fg 토큰 상속) |
| 크기 제어 | `--huni-icon-size` CSS 변수 |

**접근성:**

- 장식적 아이콘: `aria-hidden="true"`
- 의미적 아이콘: `aria-label` 필수

---

#### 4.1.6 Chip

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Chip.jsx |
| 의존성 | 없음 |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Chip.Root` | 칩 컨테이너 |
| label | `Chip.Label` | 텍스트 라벨 |
| icon | `Chip.Icon` | 선행 아이콘 (선택적) |
| dismiss | `Chip.Dismiss` | 제거 버튼 (dismissible 시 표시) |

**Variants (Seed Design 매핑):**

| variant | 설명 | Seed Design 대응 |
|---------|------|-----------------|
| `solid` | 채워진 배경 | variant=solid |
| `outlineStrong` | 진한 테두리 | variant=outlineStrong |
| `outlineWeak` | 연한 테두리 | variant=outlineWeak |

> v1.0의 `filled`/`outline`에서 Seed Design 실제 variant 이름으로 변경

**Sizes (Seed Design 매핑):**

| size | 높이 | Seed Design 대응 |
|------|------|-----------------|
| `small` | 28px | size=small |
| `medium` | 32px | size=medium |
| `large` | 36px | size=large |

**Layout (Seed Design 고유):**

| layout | 설명 |
|--------|------|
| `withText` | 아이콘 + 텍스트 (기본) |
| `iconOnly` | 아이콘만 표시 |

**States (data-* 속성):**

| data 속성 | 설명 |
|-----------|------|
| `data-selected` | 선택됨 |
| `data-disabled` | 비활성 |
| `data-focus-visible` | 포커스 링 |

**Props (Root):**

```
variant: 'solid' | 'outlineStrong' | 'outlineWeak'
size: 'small' | 'medium' | 'large'
layout: 'withText' | 'iconOnly'
selected: boolean
disabled: boolean
dismissible: boolean
onDismiss: () => void
className: string
```

**Props (Label):**

```
children: ReactNode
```

**Props (Icon):**

```
children: ReactNode  /* lucide-react 아이콘 */
```

**슬롯별 토큰 매핑:**

| 슬롯 | 상태 | 토큰 |
|------|------|------|
| root (solid, selected) | 배경 | `--huni-bg-brand-weak` |
| root (solid, unselected) | 배경 | `--huni-bg-neutral-weak` |
| root (outlineStrong) | 테두리 | `--huni-stroke-neutral-contrast` |
| root (outlineWeak) | 테두리 | `--huni-stroke-neutral-muted` |
| root (disabled) | 배경 | `--huni-bg-disabled` |
| label (selected) | 색상 | `--huni-fg-brand` |
| label (unselected) | 색상 | `--huni-fg-neutral` |
| label (disabled) | 색상 | `--huni-fg-disabled` |
| root | radius | `--huni-radius-full` |

**접근성:**

- `role="option"` (선택형) 또는 버튼 역할
- data-selected, data-disabled 속성
- dismiss 버튼: `aria-label="Remove"`

---

#### 4.1.7 Skeleton

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/atoms/Skeleton.jsx |
| 의존성 | 없음 |

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Skeleton.Root` | 스켈레톤 플레이스홀더 요소 |

**Radius (Seed Design 매핑):**

| radius | 값 | 설명 |
|--------|-----|------|
| `0` | 0px | 각진 모서리 |
| `8` | 8px | 중간 라운드 |
| `16` | 16px | 큰 라운드 |
| `full` | 9999px | 원형 |

> v1.0의 `variant: text/circle/rect`에서 Seed Design의 radius 기반 접근으로 변경. 형태는 width/height로 직접 제어.

**Tone (Seed Design 고유):**

| tone | 설명 |
|------|------|
| `neutral` (기본) | 회색 계열 shimmer |
| `magic` | 보라 계열 shimmer (브랜드 강조) |

**Animation:**

- shimmer 애니메이션 (Seed Design 기본)
- `--huni-duration-slow` + linear gradient sweep

**Props (Root):**

```
width: string | number
height: string | number
radius: '0' | '8' | '16' | 'full'
tone: 'neutral' | 'magic'
className: string
```

**토큰 매핑:**

| 속성 | 토큰 |
|------|------|
| neutral 배경 | `--huni-bg-neutral-weak` |
| magic 배경 | `--huni-bg-brand-weak` |
| shimmer 속도 | `--huni-duration-slow` (300ms) x 5 = 1.5s cycle |

**접근성:**

- `aria-hidden="true"` (장식적 플레이스홀더)

---

### 4.2 Molecules (4개)

---

#### 4.2.1 TextField (TextInput + Textarea 통합)

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/molecules/TextField.jsx |
| 의존성 | 없음 |

> Seed Design은 TextInput과 Textarea를 단일 TextField 컴포넌트로 통합한다. 7개 슬롯으로 구성되며, `input` 슬롯과 `textarea` 슬롯 중 하나를 선택하여 사용한다. Textarea는 autoresize를 기본 지원한다.

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `TextField.Root` | 최상위 컨테이너 |
| prefixIcon | `TextField.PrefixIcon` | 입력 앞 아이콘 (선택적) |
| prefixText | `TextField.PrefixText` | 입력 앞 텍스트 (선택적, 예: "$") |
| input | `TextField.Input` | `<input>` 요소 (단일행 입력) |
| textarea | `TextField.Textarea` | `<textarea>` 요소 (여러행 입력, autoresize 지원) |
| suffixIcon | `TextField.SuffixIcon` | 입력 뒤 아이콘 (선택적) |
| suffixText | `TextField.SuffixText` | 입력 뒤 텍스트 (선택적, 예: "원") |

> `TextField.Input`과 `TextField.Textarea`는 상호 배타적. 하나만 사용.

**Variants:**

| variant | 설명 |
|---------|------|
| `outline` (기본) | 4면 테두리 |
| `underline` | 하단 테두리만 |

**Sizes:**

| size | 높이 (input) | 타이포그래피 |
|------|-------------|-------------|
| `md` | 40px | t4 |
| `lg` | 52px | t5 |

**States (data-* 속성):**

| data 속성 | 설명 |
|-----------|------|
| `data-disabled` | 비활성 |
| `data-focus-visible` | 키보드 포커스 |
| `data-invalid` | 에러 상태 (Field 연동) |
| `data-readonly` | 읽기 전용 |

**Props (Root):**

```
variant: 'outline' | 'underline'
size: 'md' | 'lg'
disabled: boolean
readOnly: boolean
invalid: boolean
className: string
```

**Props (Input):**

```
placeholder: string
value: string
onChange: (e: ChangeEvent) => void
type: string (기본 'text')
clearable: boolean
onClear: () => void
```

**Props (Textarea):**

```
placeholder: string
value: string
onChange: (e: ChangeEvent) => void
autoResize: boolean (기본 true)
maxHeight: number
minRows: number (기본 3)
```

**슬롯별 토큰 매핑:**

| 슬롯 | 상태 | 토큰 |
|------|------|------|
| root (기본) | 테두리 | `--huni-stroke-neutral-weak` (1px) |
| root (focus) | 테두리 | `--huni-stroke-neutral-contrast` (2px) |
| root (invalid) | 테두리 | `--huni-stroke-critical` (2px) |
| root (disabled) | 배경 | `--huni-bg-disabled` |
| input/textarea | 텍스트 | `--huni-fg-neutral` |
| input/textarea | 플레이스홀더 | `--huni-fg-neutral-subtle` |
| root (outline) | radius | `--huni-radius-3` |
| root (outline) | 패딩 | `--huni-space-4` |
| root (underline) | 패딩 | `--huni-space-2_5` |
| prefixIcon/suffixIcon | 색상 | `--huni-fg-neutral-muted` |
| prefixText/suffixText | 색상 | `--huni-fg-neutral-subtle` |

**접근성:**

- Input/Textarea가 직접 `aria-label` 또는 Field 연동 `aria-labelledby`
- data-disabled, data-invalid, data-readonly 속성
- clearable 버튼: `aria-label="Clear input"`

---

#### 4.2.2 Tabs

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/molecules/Tabs.jsx |
| 의존성 | @radix-ui/react-tabs |

> Seed Design의 Tabs는 캐러셀 지원 슬롯(carousel, carouselCamera)을 포함한다. 후니는 기본 Tabs 기능을 우선 구현하고, 캐러셀은 후속 확장으로 표기한다.

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Tabs.Root` | 최상위 컨테이너 |
| list | `Tabs.List` | 탭 트리거 목록 컨테이너 |
| trigger | `Tabs.Trigger` | 개별 탭 버튼 |
| indicator | `Tabs.Indicator` | 활성 탭 하단 인디케이터 (line variant) |
| content | `Tabs.Content` | 탭 콘텐츠 패널 |
| carousel | `Tabs.Carousel` | (후속 확장) 스와이프 캐러셀 래퍼 |
| carouselCamera | `Tabs.CarouselCamera` | (후속 확장) 캐러셀 뷰포트 |

**Variants:**

| variant | 설명 |
|---------|------|
| `line` | 하단 인디케이터 라인 스타일 |
| `chip` | 칩/필 스타일 |

**Chip Sub-variants:**

| chipStyle | 설명 |
|-----------|------|
| `solid` | 채워진 배경 |
| `outline` | 테두리만 |

**Layout (line variant 전용):**

| layout | 설명 |
|--------|------|
| `fill` | 탭이 전체 너비를 균등 분할 |
| `hug` | 탭이 콘텐츠 크기만큼 |

**Sizes:**

| variant | size | 높이 |
|---------|------|------|
| line | `sm` | 40px |
| line | `md` | 44px |
| chip | `md` | 36px |
| chip | `lg` | 40px |

**States (data-* 속성):**

| data 속성 | 적용 슬롯 | 설명 |
|-----------|----------|------|
| `data-selected` | trigger | 활성 탭 |
| `data-disabled` | trigger | 비활성 탭 |
| `data-focus-visible` | trigger | 포커스 링 |

**Props (Root):**

```
value: string
onValueChange: (value: string) => void
variant: 'line' | 'chip'
className: string
```

**Props (List):**

```
layout: 'fill' | 'hug'    /* line variant 전용 */
chipStyle: 'solid' | 'outline'  /* chip variant 전용 */
size: 'sm' | 'md' | 'lg'
```

**Props (Trigger):**

```
value: string
disabled: boolean
children: ReactNode
```

**Props (Content):**

```
value: string
children: ReactNode
```

**슬롯별 토큰 매핑:**

| 슬롯 | 상태 | 토큰 |
|------|------|------|
| trigger (line, selected) | 색상 | `--huni-fg-neutral` |
| trigger (line, unselected) | 색상 | `--huni-fg-neutral-subtle` |
| indicator (line) | 색상, 두께 | `--huni-fg-neutral`, 2px |
| trigger (chip solid, selected) | 배경/글자 | `--huni-bg-neutral-inverted` / `--huni-fg-neutral-inverted` |
| trigger (chip solid, unselected) | 배경/글자 | `--huni-bg-neutral-weak` / `--huni-fg-neutral` |
| trigger (chip outline, selected) | 배경 | `--huni-bg-neutral-inverted` |
| trigger (chip outline, unselected) | 테두리 | `--huni-stroke-neutral-muted` |
| list 하단선 | 색상 | `--huni-stroke-neutral-muted` (1px) |
| trigger 공통 | font-weight | bold |

**접근성:**

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Arrow 키로 탭 간 이동
- data-selected, data-disabled 속성

---

#### 4.2.3 Field

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/molecules/Field.jsx |
| 의존성 | 없음 |

> Seed Design의 Field는 10개 슬롯으로 구성되며, 폼 입력 컴포넌트(TextField, Select 등)를 감싸는 래퍼 역할을 한다.

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Field.Root` | 최상위 컨테이너 |
| header | `Field.Header` | 라벨 + 필수표시 + 보조텍스트 영역 |
| label | `Field.Label` | 필드 라벨 |
| indicatorText | `Field.IndicatorText` | "(선택)" 등 표시 텍스트 |
| requiredIndicator | `Field.RequiredIndicator` | "*" 필수 표시 |
| footer | `Field.Footer` | 도움말 + 에러 + 글자수 영역 |
| description | `Field.Description` | 도움말 텍스트 |
| errorMessage | `Field.ErrorMessage` | 에러 메시지 |
| characterCountArea | `Field.CharacterCountArea` | 글자수 카운트 영역 컨테이너 |
| characterCount | `Field.CharacterCount` | "0/100" 글자수 텍스트 |

**States (data-* 속성):**

| data 속성 | 설명 |
|-----------|------|
| `data-disabled` | 비활성 |
| `data-invalid` | 에러 상태 |
| `data-required` | 필수 입력 |

**Props (Root):**

```
disabled: boolean
invalid: boolean
required: boolean
className: string
```

**Props (Label):**

```
children: ReactNode
```

**Props (Description):**

```
children: ReactNode
```

**Props (ErrorMessage):**

```
children: ReactNode
```

**Props (CharacterCount):**

```
current: number
max: number
```

**슬롯별 토큰 매핑:**

| 슬롯 | 토큰 |
|------|------|
| label | `--huni-fg-neutral`, t4, font-weight: medium |
| requiredIndicator | `--huni-fg-critical` |
| indicatorText | `--huni-fg-neutral-subtle`, t2 |
| description | `--huni-fg-neutral-subtle`, t2 |
| errorMessage | `--huni-fg-critical`, t2 |
| characterCount | `--huni-fg-neutral-muted`, t2 |
| header-to-content 간격 | `--huni-space-1_5` (6px) |
| content-to-footer 간격 | `--huni-space-1` (4px) |

**접근성:**

- label이 `<label>` 요소로 내부 입력과 `htmlFor`/`id`로 연결
- errorMessage가 `aria-live="polite"` + 입력의 `aria-describedby` 연결
- data-disabled, data-invalid, data-required 속성

---

#### 4.2.4 Pagination (후니 자체 설계)

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/molecules/Pagination.jsx |
| 의존성 | 없음 |

> **Seed Design에 존재하지 않는 컴포넌트.** 후니 플랫폼의 목록/테이블 페이지 네비게이션을 위해 자체 설계한다. Compound Component 패턴과 data-* 속성은 Seed Design 전체 일관성을 위해 동일하게 적용.

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Pagination.Root` | 최상위 nav 컨테이너 |
| prevButton | `Pagination.PrevButton` | 이전 페이지 버튼 |
| nextButton | `Pagination.NextButton` | 다음 페이지 버튼 |
| pages | `Pagination.Pages` | 페이지 번호 목록 컨테이너 |
| page | `Pagination.Page` | 개별 페이지 번호 버튼 |
| ellipsis | `Pagination.Ellipsis` | "..." 생략 표시 |

**Variants:**

| variant | 설명 |
|---------|------|
| `numbered` (기본) | 페이지 번호 표시 |
| `loadMore` | "더 보기" 버튼 |

**States (data-* 속성):**

| data 속성 | 적용 슬롯 | 설명 |
|-----------|----------|------|
| `data-selected` | page | 현재 페이지 |
| `data-disabled` | prevButton, nextButton | 첫/마지막 페이지 |

**Props (Root):**

```
currentPage: number
totalPages: number
onPageChange: (page: number) => void
siblingCount: number (기본 1)
variant: 'numbered' | 'loadMore'
className: string
```

**슬롯별 토큰 매핑:**

| 슬롯 | 상태 | 토큰 |
|------|------|------|
| page (selected) | 배경/글자 | `--huni-bg-brand-solid` / `--huni-fg-neutral-inverted` |
| page (unselected) | 배경/글자 | transparent / `--huni-fg-neutral` |
| page (hover) | 배경 | `--huni-bg-neutral-weak` |
| prevButton/nextButton (disabled) | 색상 | `--huni-fg-disabled` |
| page | radius | `--huni-radius-1` |
| pages | 간격 | `--huni-space-1` (4px) |

**접근성:**

- `<nav aria-label="Pagination">`
- `aria-current="page"` (현재 페이지)
- data-selected, data-disabled 속성

---

### 4.3 Organisms (2개)

---

#### 4.3.1 Dialog (구 AlertDialog)

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/organisms/Dialog.jsx |
| 의존성 | @radix-ui/react-dialog |

> Seed Design에는 AlertDialog가 없다. 범용 Dialog 컴포넌트를 사용하며, 10개 슬롯 구조와 lazyMount/unmountOnExit를 지원한다. 확인/취소 Alert 유형은 Dialog의 variant로 처리한다.

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| root | `Dialog.Root` | 상태 관리 컨테이너 (open/onOpenChange) |
| trigger | `Dialog.Trigger` | 다이얼로그를 여는 트리거 요소 |
| positioner | `Dialog.Positioner` | 다이얼로그 위치 지정 (화면 중앙) |
| backdrop | `Dialog.Backdrop` | 반투명 오버레이 배경 |
| content | `Dialog.Content` | 다이얼로그 본문 컨테이너 |
| header | `Dialog.Header` | 상단 영역 (제목 + 닫기 버튼) |
| title | `Dialog.Title` | 제목 텍스트 |
| description | `Dialog.Description` | 설명 텍스트 |
| footer | `Dialog.Footer` | 하단 액션 버튼 영역 |
| close | `Dialog.Close` | 닫기/취소 버튼 |

**Variants:**

| variant | 설명 | 용도 |
|---------|------|------|
| `default` | 일반 대화상자 | 정보 표시, 폼 입력 |
| `critical` | 위험 액션 확인 | 삭제 확인, 되돌릴 수 없는 작업 |

**States (data-* 속성):**

| data 속성 | 적용 슬롯 | 설명 |
|-----------|----------|------|
| `data-open` | root, content, backdrop | 열림 상태 |
| `data-focus-visible` | close, trigger | 포커스 링 |

**Props (Root):**

```
open: boolean
onOpenChange: (open: boolean) => void
lazyMount: boolean (기본 true)     /* 최초 열릴 때까지 DOM 생성 지연 */
unmountOnExit: boolean (기본 true)  /* 닫힌 후 DOM 제거 */
variant: 'default' | 'critical'
className: string
```

**Props (Title):**

```
children: ReactNode
```

**Props (Description):**

```
children: ReactNode
```

**Props (Footer):**

```
children: ReactNode  /* 버튼 조합 자유 배치 */
```

**슬롯별 토큰 매핑:**

| 슬롯 | 토큰 |
|------|------|
| backdrop | rgba(0, 0, 0, 0.5) |
| content 배경 | `--huni-bg-layer-floating` |
| content radius | `--huni-radius-4` (16px) |
| content shadow | `--huni-shadow-xl` |
| content 패딩 | `--huni-space-6` (24px) |
| title | `--huni-fg-neutral`, t6, bold |
| description | `--huni-fg-neutral-subtle`, t4 |
| footer 확인(default) | `--huni-bg-brand-solid` + `--huni-fg-neutral-inverted` |
| footer 확인(critical) | `--huni-bg-critical-solid` + `--huni-fg-neutral-inverted` |
| footer 취소 | `--huni-bg-neutral-weak` + `--huni-fg-neutral` |
| content 진입 애니메이션 | `--huni-duration-normal`, `--huni-easing-out` |
| content 퇴장 애니메이션 | `--huni-duration-fast`, `--huni-easing-in` |

**접근성:**

- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` (title), `aria-describedby` (description)
- Escape 키로 닫기
- 열림 시 focus trap (포커스가 다이얼로그 내에서만 이동)
- data-open 속성으로 CSS 애니메이션 제어

---

#### 4.3.2 Snackbar (Programmatic API)

| 속성 | 값 |
|------|-----|
| 파일 | src/design-system/components/organisms/Snackbar.jsx |
| 의존성 | 없음 |

> Seed Design의 Snackbar는 단순 컴포넌트가 아닌 **Programmatic API** 패턴을 사용한다. `SnackbarProvider`로 앱을 감싸고, `useSnackbar()` hook으로 명령형으로 스낵바를 생성하며, `SnackbarRegion`이 스낵바를 렌더링하고 큐를 관리한다.

**Compound Component 구조:**

| Slot | 서브컴포넌트 | 설명 |
|------|-------------|------|
| provider | `Snackbar.Provider` | Context Provider. 앱 최상위에 배치 |
| region | `Snackbar.Region` | 스낵바 렌더링 영역 (하단 고정). Provider 자식으로 배치 |
| root | `Snackbar.Root` | 개별 스낵바 아이템 컨테이너 |
| message | `Snackbar.Message` | 메시지 텍스트 |
| action | `Snackbar.Action` | 액션 버튼 (선택적, 예: "되돌리기") |
| close | `Snackbar.Close` | 닫기 버튼 (선택적) |

**Programmatic API:**

```jsx
// 1. 앱 최상위에 Provider + Region 배치
function App() {
  return (
    <Snackbar.Provider>
      <AppContent />
      <Snackbar.Region />
    </Snackbar.Provider>
  );
}

// 2. 컴포넌트에서 useSnackbar hook 사용
function MyComponent() {
  const snackbar = useSnackbar();

  const handleSave = () => {
    snackbar.create({
      variant: 'positive',
      message: '저장되었습니다.',
      action: { label: '되돌리기', onClick: handleUndo },
      duration: 5000,
    });
  };
}
```

**Variants:**

| variant | 설명 |
|---------|------|
| `default` | 기본 (어두운 배경) |
| `positive` | 성공 |
| `warning` | 경고 |
| `critical` | 오류 |

**큐 관리:**

- 동시 최대 표시: 1개 (FIFO 큐)
- 자동 소멸: `duration` (기본 5000ms)
- 새 스낵바 도착 시 현재 스낵바 즉시 교체 또는 큐잉

**Props (Provider):**

```
children: ReactNode
maxSnackbars: number (기본 1)
```

**Props (Region):**

```
className: string
```

**useSnackbar() 반환값:**

```
create: (options: SnackbarOptions) => string  /* 스낵바 ID 반환 */
dismiss: (id: string) => void
dismissAll: () => void
```

**SnackbarOptions:**

```
variant: 'default' | 'positive' | 'warning' | 'critical'
message: string
action?: { label: string, onClick: () => void }
duration?: number (기본 5000)
onDismiss?: () => void
```

**슬롯별 토큰 매핑:**

| 슬롯 | 상태 | 토큰 |
|------|------|------|
| root (default) | 배경/글자 | `--huni-bg-neutral-inverted` / `--huni-fg-neutral-inverted` |
| root (positive) | 배경 | `--huni-bg-positive-solid` |
| root (warning) | 배경 | `--huni-bg-warning-solid` |
| root (critical) | 배경 | `--huni-bg-critical-solid` |
| root | radius | `--huni-radius-2` (8px) |
| root | shadow | `--huni-shadow-lg` |
| root | 패딩 | `--huni-space-4` (16px) |
| region | 하단 위치 | `--huni-space-6` (24px) |
| root 진입 | 애니메이션 | slide-up + fade-in, `--huni-duration-normal` |
| root 퇴장 | 애니메이션 | fade-out, `--huni-duration-fast` |

**접근성:**

- `role="status"` + `aria-live="polite"` (region)
- 화면 리더가 자동으로 스낵바 내용을 읽음
- action 버튼: 포커스 가능
- Escape 키로 현재 스낵바 닫기

---

## 5. 파일 구조

```
src/design-system/
├── tokens/
│   ├── index.css              (업데이트 - 신규 토큰 import)
│   ├── colors.css             (업데이트 - --huni-* 시맨틱 토큰 추가)
│   ├── typography.css         (업데이트 - t8~t10 추가)
│   ├── spacing.css            (신규)
│   ├── radius.css             (신규)
│   ├── elevation.css          (신규)
│   └── motion.css             (신규)
│
├── recipes/
│   └── focus-ring.js          (신규 - createFocusRingStyles 유틸)
│
├── hooks/
│   └── useSnackbar.js         (신규 - Snackbar Programmatic API hook)
│
├── components/
│   ├── atoms/
│   │   ├── BadgeLabel.jsx     (기존)
│   │   ├── ColorChip.jsx      (기존)
│   │   ├── InfoTooltip.jsx    (기존)
│   │   ├── Checkbox.jsx       (신규 - Compound)
│   │   ├── Radio.jsx          (신규 - Compound)
│   │   ├── Switch.jsx         (신규 - Compound)
│   │   ├── Divider.jsx        (신규 - Compound)
│   │   ├── Icon.jsx           (신규 - CSS Variable 패턴)
│   │   ├── Chip.jsx           (신규 - Compound)
│   │   ├── Skeleton.jsx       (신규 - Seed radius/tone)
│   │   └── index.js           (업데이트)
│   │
│   ├── molecules/
│   │   ├── [기존 8개]
│   │   ├── TextField.jsx      (신규 - Input+Textarea 통합, 7 slots)
│   │   ├── Tabs.jsx           (신규 - Compound, Carousel 후속)
│   │   ├── Field.jsx          (신규 - 10 slots)
│   │   ├── Pagination.jsx     (신규 - 자체 설계, Compound 패턴 적용)
│   │   └── index.js           (업데이트)
│   │
│   ├── organisms/
│   │   ├── CollapsibleSection.jsx (기존)
│   │   ├── PriceSummary.jsx       (기존)
│   │   ├── Dialog.jsx             (신규 - 10 slots, lazyMount)
│   │   ├── Snackbar.jsx           (신규 - Provider+Region+Root+hook)
│   │   └── index.js               (업데이트)
│   │
│   └── index.js (업데이트 - 신규 re-export)
│
└── index.js
```

---

## 6. 신규 의존성

```json
{
  "@radix-ui/react-checkbox": "^1.x",
  "@radix-ui/react-radio-group": "^1.x",
  "@radix-ui/react-switch": "^1.x",
  "@radix-ui/react-tabs": "^1.x",
  "@radix-ui/react-dialog": "^1.x",
  "lucide-react": "^0.x"
}
```

> **변경 사항 (v1.0 대비):**
> - `@radix-ui/react-alert-dialog` 제거 (AlertDialog -> Dialog 변경)
> - `@radix-ui/react-dialog` 추가

기존 의존성 (이미 설치): class-variance-authority, tailwind-merge, clsx, @radix-ui/react-select, @radix-ui/react-toggle, @radix-ui/react-collapsible, @radix-ui/react-slot

---

## 7. 구현 순서

| 단계 | 작업 | 파일 수 | 의존성 |
|------|------|---------|--------|
| S1 | Foundation 토큰 확장 + focus-ring 유틸 | 5 신규 + 3 업데이트 | 없음 |
| S2 | Atoms (Divider, Icon, Skeleton) - 단순 Compound | 3 신규 + 1 업데이트 | S1 |
| S3 | Atoms (Checkbox, Radio, Switch, Chip) - Radix 기반 Compound | 4 신규 | S1, S2 |
| S4 | Molecules (Field, TextField) - 폼 기초 | 2 신규 + 1 업데이트 | S1, S3 |
| S5 | Molecules (Tabs, Pagination) - 네비게이션 | 2 신규 | S1 |
| S6 | Organisms (Dialog, Snackbar + useSnackbar hook) | 2 신규 + 1 hook + 1 업데이트 | S1 |
| S7 | 기존 컴포넌트 토큰 마이그레이션 | 13 업데이트 | S1 |

---

## 8. 수용 기준

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-1 | 토큰 확장 후 기존 --po-* 참조 정상 동작 | 기존 컴포넌트 시각적 회귀 없음 |
| AC-2 | 모든 신규 컴포넌트가 Compound Component 패턴(Component.Root > Component.Slot) 구조를 따름 | 코드 리뷰: 각 컴포넌트 네임스페이스 export 확인 |
| AC-3 | 모든 슬롯 서브컴포넌트에 React.forwardRef + displayName 적용 | 코드 리뷰 |
| AC-4 | data-* 상태 속성(data-checked, data-disabled, data-selected, data-open 등)이 적절히 렌더링됨 | DOM 검사 + 상태 변경 테스트 |
| AC-5 | focusVisible 스타일이 키보드 포커스 시에만 표시되고 마우스 클릭 시에는 표시되지 않음 | 수동 키보드/마우스 테스트 |
| AC-6 | 각 컴포넌트의 모든 variant/size/state 지원 | Storybook/테스트 |
| AC-7 | TextField가 Input 모드와 Textarea 모드 모두 정상 동작 (autoresize 포함) | 수동 테스트 + 유닛 테스트 |
| AC-8 | Snackbar의 Programmatic API (useSnackbar hook)가 정상 동작 (create/dismiss/queue) | 유닛 테스트 + 통합 테스트 |
| AC-9 | Dialog의 lazyMount/unmountOnExit가 정상 동작 | DOM 검사: 미열림 시 content 미렌더링 확인 |
| AC-10 | 키보드 접근성 (Tab, Enter, Space, Escape, Arrow Keys) | 수동 테스트 |
| AC-11 | Vitest 유닛 테스트 커버리지 85%+ | vitest --coverage |
| AC-12 | 인쇄 특화 RULE-1~8 위반 없음 | 기존 인쇄 옵션 페이지 정상 동작 |
| AC-13 | 27개 전체 컴포넌트 (기존 13 + 신규 14) index.js에서 re-export | import 테스트 |
| AC-14 | @MX 태그 주석 포함 | 코드 검사 |

---

## 9. Seed Design과의 차이점

| 항목 | Seed Design (실제 구현) | 후니 DS (본 SPEC) |
|------|------------------------|-------------------|
| 컴포넌트 패턴 | Compound Component + Slot | 동일 (Compound Component + Slot) |
| 스타일 시스템 | defineSlotRecipe (slots/base/variants/compoundVariants) | CVA 기반 Slot Recipe 적응 |
| Pseudo 유틸리티 | disabled, focusVisible, checked, selected, open, engaged | data-* 속성 + CSS 선택자로 동등 구현 |
| Focus Ring | createFocusRingStyles() 내장 유틸 | focus-ring.js 커스텀 유틸 |
| 빌드 | YAML -> TS -> CSS 파이프라인 | CSS Variables + CVA 직접 |
| 브랜드 | 주황 (carrot) | 보라 (#553886) |
| 타겟 | 모바일 앱 우선 | 데스크톱 우선 (반응형) |
| hover | active만 (터치 UI) | hover + active (데스크톱) |
| 특수 도메인 | 없음 | 인쇄 옵션 (RULE-1~8) |
| AlertDialog | 없음 (Dialog만 존재) | Dialog로 통일 |
| TextField | Input + Textarea 통합 (7 slots) | 동일 패턴 적용 |
| Snackbar | SnackbarProvider + useSnackbar + SnackbarRegion | 동일 Programmatic API 패턴 |
| Chip variant | solid / outlineStrong / outlineWeak | 동일 (v1.0의 filled/outline에서 변경) |
| Chip size | small / medium / large | 동일 (v1.0의 sm/md에서 변경) |
| Skeleton | radius 기반 (0/8/16/full) + tone (neutral/magic) | 동일 (v1.0의 variant: text/circle/rect에서 변경) |
| Switch size | "16" / "32" (픽셀 기반) | md / lg로 매핑 (Seed 값 기록) |
| Icon | svg prop + CSS 변수 (--seed-icon-size/color) | lucide-react + CSS 변수 (--huni-icon-size/color) |
| Tabs | carousel/carouselCamera 슬롯 포함 | 기본 Tabs 우선, 캐러셀 후속 확장 |
| Field | 10 slots | 동일 10 slots |
| Pagination | 존재하지 않음 | 후니 자체 설계 (Compound 패턴 적용) |
| Headless | 별도 패키지 분리 | 컴포넌트 내장 |

---

## 10. 리스크 및 완화

| 리스크 | 영향 | 완화 |
|--------|------|------|
| Compound Component 패턴 학습 곡선 | 기존 monolithic API 대비 소비자 코드 복잡도 증가 | 각 컴포넌트에 shorthand wrapper 제공 검토, Storybook 예제 충실히 작성 |
| Slot Recipe CVA 적응 복잡도 | defineSlotRecipe와 CVA 간 구조 차이로 매핑 오류 발생 가능 | S1에서 Checkbox를 파일럿으로 패턴 검증 후 나머지 적용 |
| --po-* -> --huni-* 호환성 깨짐 | 기존 UI 깨짐 | 호환 레이어 + 회귀 테스트 |
| Radix UI 버전 충돌 | 빌드 실패 | 기존 설치 버전 확인 후 호환 버전 설치 |
| Snackbar Programmatic API Context 누락 | Provider 미배치 시 useSnackbar 런타임 에러 | 명확한 에러 메시지 + 설치 가이드 |
| Dialog lazyMount SSR 호환 | 서버 렌더링 시 hydration mismatch | 클라이언트 전용 렌더링 보장 |
| Tailwind config 충돌 | 클래스 미적용 | 신규 토큰 별도 extend 블록 |
| 컴포넌트 과다 | 유지보수 부담 | Tier 분류로 단계적 구현 |
| **shadcn/ui 컴포넌트 명칭 충돌** | Tabs, Skeleton, Dialog가 shadcn/ui와 동명 | import 경로 명확 분리 + alias 사용 |
| **shadcn/ui Radix UI 공유** | @radix-ui/react-dialog가 Sheet.jsx에서 이미 사용 중 | 동일 ^1.x 버전 공유, peer dependency 확인 |

---

## 11. shadcn/ui 공존 전략

### 11.1 용도 분리 원칙

| 시스템 | 경로 | 용도 | 대상 SPEC |
|--------|------|------|----------|
| **shadcn/ui** | `src/components/ui/` | 관리자 영역 | SPEC-SKIN-005~008 |
| **Huni DS** | `src/design-system/components/` | 사용자 영역 | SPEC-SKIN-001~004 |
| **공유** | `src/lib/utils.js` | cn() 유틸리티 | 양쪽 모두 |

### 11.2 컴포넌트 명칭 충돌 대응

| Huni DS 컴포넌트 | shadcn/ui 대응 | 충돌 등급 | 해결 방법 |
|-----------------|---------------|---------|----------|
| `Tabs` | `ui/tabs.jsx` (활성) | **높음** | import alias: `HuniTabs` / `ShadcnTabs` |
| `Skeleton` | `ui/skeleton.jsx` (활성) | **중간** | 용도 분리: shadcn=단순 로더, Huni=Compound+tone |
| `Dialog` | `ui/sheet.jsx` (활성, Dialog 기반) | **중간** | 같은 @radix-ui/react-dialog 공유 |
| `Checkbox` | (미설치) | 낮음 | 현재 충돌 없음 |
| `Radio` | `ui/radio-group.jsx` (활성) | 낮음 | 경로 분리로 충분 |
| `Switch` | (미설치) | 낮음 | 현재 충돌 없음 |

### 11.3 CSS 변수 네임스페이스 분리

```
--po-*     : 기존 인쇄 옵션 토큰 (compat-aliases.css로 --huni-* 참조)
--huni-*   : Seed Design 기반 신규 토큰 (독립 네임스페이스)
shadcn 변수 : Tailwind config에서 --po-* 변수로 매핑 (기존 유지)
```

### 11.4 Radix UI 패키지 공유

기존 설치된 Radix UI 패키지(^1.x)와 SPEC-DS-006 신규 패키지(^1.x)는 버전 호환 가능. 공유 패키지:

| 패키지 | 기존 사용처 (shadcn/ui) | 신규 사용처 (Huni DS) |
|--------|----------------------|---------------------|
| @radix-ui/react-dialog | Sheet.jsx | Dialog.jsx |
| @radix-ui/react-tabs | tabs.jsx | Tabs.jsx |
| @radix-ui/react-radio-group | radio-group.jsx | Radio.jsx |
| @radix-ui/react-slot | button.jsx | 공통 Slot 유틸 |

### 11.5 Import 가이드라인

```jsx
// shadcn/ui 컴포넌트 (관리자 영역에서만 사용)
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';

// Huni DS 컴포넌트 (사용자 영역에서만 사용)
import { Checkbox } from '@/design-system/components/atoms';
import { TextField, Tabs as HuniTabs } from '@/design-system/components/molecules';
import { Dialog, Snackbar } from '@/design-system/components/organisms';
```

---

## 12. 후속 SPEC

| SPEC | 내용 |
|------|------|
| SPEC-DS-007 | Tier 2 컴포넌트 (BottomSheet, Callout, Avatar 등 10개) |
| SPEC-DS-008 | Tier 3 컴포넌트 (Table, ToggleButton 등 5개) + Tabs Carousel 확장 |
| SPEC-DS-009 | 다크모드 지원 및 테마 시스템 |
| SPEC-DS-010 | shadcn/ui → Huni DS 통합 마이그레이션 (관리자 영역 컴포넌트 통일) |
