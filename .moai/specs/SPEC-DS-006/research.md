# SPEC-DS-006 Research: Seed Design 기반 후니프린팅 디자인시스템 컴포넌트 확장

## 1. Seed Design (당근 디자인시스템) 분석

### 1.1 아키텍처 개요

Seed Design은 3단계 빌드 파이프라인 구조를 따른다:

**Step 1: Rootage (YAML) - 토큰 및 컴포넌트 스키마 정의**
- 경로: `packages/rootage/*.yaml`
- 역할: 디자인 토큰(color, dimension, radius, duration, timing-function)과 컴포넌트 스키마(slots, variants, states) 정의
- 파일 구조:
  - `color.yaml` - 팔레트 + 시맨틱 컬러 토큰
  - `dimension.yaml` - 스페이싱 스케일
  - `radius.yaml` - 보더 라디우스 스케일
  - `duration.yaml` - 애니메이션 duration 토큰
  - `timing-function.yaml` - 이징 함수 토큰
  - `components/*.yaml` - 컴포넌트별 스키마 (ComponentSpec kind)

**Step 2: Qvism-Preset (TypeScript Recipe) - 스타일 Recipe 정의**
- 경로: `packages/qvism-preset/src/recipes/*.ts`
- 역할: `defineSlotRecipe()` / `defineRecipe()`를 사용한 CSS-in-JS 스타일 Recipe 정의
- 핵심 구조: slots 배열, base 스타일, variants(size/weight/variant/layout), compoundVariants, defaultVariants
- Pseudo 유틸리티: `disabled`, `focusVisible`, `checked`, `selected`, `open`, `engaged`, `invalid`, `readOnly`
- Focus Ring: `createFocusRingStyles()` / `createFocusRingRestStyles()` 유틸리티

**Step 3: CSS + React - 생성된 CSS 변수 및 React 컴포넌트**
- CSS 출력: `packages/css/` - 생성된 CSS 변수(`vars/`), recipe TypeScript 익스포트(`recipes/`)
- React: `packages/react/` - 스타일드 React 컴포넌트 (CSS Recipe 소비)
- React-Headless: `packages/react-headless/` - 순수 로직 레이어 (스타일 없음)

**빌드 명령어:**
```
bun rootage:generate  → css/vars, qvism-preset/src/vars 생성
bun qvism:generate    → css/recipes 생성
bun generate:all      → 전체 파이프라인 실행
```

**생성 파일 직접 수정 금지:** `packages/css/vars/`, `packages/css/recipes/`, `packages/qvism-preset/src/vars/`는 rootage/qvism에서 생성되므로 직접 수정 불가.

참조 경로: `ref/seed.design/seed-design/`

#### Compound Component Pattern

Seed Design은 **slot-based compound component 패턴**을 사용한다:

```
createSlotRecipeContext(recipe) → { withProvider, withContext, useClassNames, ClassNamesProvider }
```

- `withProvider`: Root 컴포넌트에 적용, ClassNames Context 제공
- `withContext`: 자식 slot 컴포넌트에 적용, 해당 slot의 className 자동 주입
- `createWithStateProps([useContext])`: headless 컨텍스트의 data-* state props를 자동 전파
- `createRecipeContext(recipe)`: 단일(non-slot) recipe용 context 생성

**예시 - Checkbox 5개 slot:**
```
Checkbox.Root (withProvider, root slot) → label element
  Checkbox.Control (withCheckmarkProvider, root slot) → checkmark container
    Checkbox.Indicator → SVG 아이콘 (checked/unchecked/indeterminate)
  Checkbox.Label (withContext, label slot) → 텍스트 라벨
  Checkbox.HiddenInput → native hidden input (접근성)
```

#### 접근성 패턴

- **data-* state 속성**: `data-checked`, `data-disabled`, `data-indeterminate`, `data-invalid`, `data-readonly`, `data-focus-visible`, `data-selected`, `data-open`
- **focusVisible 관리**: `createFocusRingStyles()` / `createFocusRingRestStyles()` 유틸리티 사용
- **Headless 로직 분리**: `@seed-design/react-checkbox`, `@seed-design/react-switch` 등에서 상태 관리, `packages/react/`에서 스타일 적용
- **Hidden Form Input**: Checkbox, RadioGroup, Switch 모두 native hidden input을 포함하여 폼 제출 지원
- **ARIA 속성**: Divider에서 `aria-orientation` 자동 설정, Field에서 `aria-label`/`aria-labelledby` 경고 출력

---

### 1.2 Seed Design 컴포넌트 전체 목록

**총 68개 React 컴포넌트** (`packages/react/src/components/` 기준, private 제외)

| 카테고리 | 컴포넌트 | 설명 |
|---------|---------|------|
| **Buttons** | ActionButton | 기본 인터랙션 (7 variant, 4 size) |
| | FloatingActionButton (Fab) | 화면 위 플로팅 |
| | ExtendedFab | 확장 FAB |
| | ContextualFloatingButton | 상황별 보조 액션 |
| | ToggleButton | 토글 버튼 |
| | ReactionButton | 리액션 버튼 |
| **Controls** | Checkbox | 다중선택 (weight: regular/bold, size: medium/large) |
| | Chip | 사용자 선택/입력 값 표시 (variant: solid/outlineStrong/outlineWeak) |
| | ActionChip | 액션 칩 |
| | ControlChip | 컨트롤 칩 |
| | ChipTabs | 칩 기반 탭 |
| | Field | 폼 필드 래퍼 (label/help/error/characterCount) |
| | FieldButton | 필드 트리거 버튼 |
| | Fieldset | 필드 그룹 |
| | RadioGroup | 단일선택 (layout 지원) |
| | RadioGroupField | RadioGroup + Field 통합 |
| | SegmentedControl | 즉시 전환 필터 |
| | SelectBox | 정의된 목록 선택 |
| | Slider | 범위 값 선택 |
| | Switch | 설정 토글 (size: "16"/"24"/"32") |
| | TextField | 텍스트 입력 (Input + Textarea 통합, autoresize 지원) |
| **Display** | Avatar | 프로필 이미지 |
| | Badge | 시각적 상태 라벨 |
| | Count | 카운트 표시 |
| | Divider | 콘텐츠 구분선 (orientation/color/thickness/inset) |
| | Icon | 아이콘 (svg prop + CSS vars) |
| | ImageFrame | 이미지 표시 |
| | NotificationBadge | 미확인 알림 카운트 |
| | ScrollFog | 스크롤 힌트 |
| | TagGroup | 메타데이터 태그 |
| | Text | 텍스트 컴포넌트 |
| **Feedback** | Callout | 중요 정보/팁 |
| | HelpBubble | 추가 정보 툴팁 |
| | InlineBanner | 인라인 배너 |
| | LoadingIndicator | 로딩 인디케이터 |
| | PageBanner | 상단 상태/메시지 |
| | ProgressCircle | 진행률 표시 |
| | Skeleton | 로딩 상태 윤곽 (radius: 0/8/16/full, tone: neutral/magic) |
| | Snackbar | 하단 임시 알림 (Programmatic API) |
| **Layout** | AspectRatio | 종횡비 유지 |
| | Box | 유틸리티 박스 |
| | Columns | 컬럼 레이아웃 |
| | ConsistentWidth | 일관된 너비 |
| | Dialog | 모달 다이얼로그 (lazyMount/unmountOnExit) |
| | ActionSheet | 액션 시트 |
| | ExtendedActionSheet | 확장 액션 시트 |
| | BottomSheet | 하단 슬라이딩 모달 |
| | Float | 플로팅 요소 |
| | Flex | Flex 레이아웃 |
| | Grid / GridItem | 그리드 레이아웃 |
| | Inline | 인라인 레이아웃 |
| | List | 수평 행 기반 콘텐츠 |
| | MenuSheet | 작업 관련 선택 옵션 |
| | Portal | 포탈 |
| | ResponsivePair | 반응형 쌍 |
| | Stack | 스택 레이아웃 |
| | VisuallyHidden | 시각적 숨김 |
| **Navigation** | Tabs | 콘텐츠 섹션 전환 (carousel 지원, indicator 애니메이션) |
| **Identity** | IdentityPlaceholder | 아이덴티티 플레이스홀더 |
| | MannerTemp / MannerTempBadge | 매너온도 |
| | Celsius | 온도 표시 |
| | LinkContent | 링크 콘텐츠 |
| **Form** | PullToRefresh | 당겨서 새로고침 |

**핵심 발견 사항:**
- **Dialog (AlertDialog 아님)**: Seed Design에는 `AlertDialog`가 없고 `Dialog` 컴포넌트만 있음. AlertDialog 역할은 Dialog가 대체
- **TextField (TextInput + Textarea 통합)**: 별도의 TextInput/Textarea가 아닌 `TextField` 컴포넌트 하나에 `TextField.Input`과 `TextField.Textarea` sub-component로 제공
- **Pagination 부재**: Seed Design에 Pagination 컴포넌트가 없음 - 후니 커스텀 구현 필요
- **Snackbar Programmatic API**: `useSnackbarAdapter()` hook + `SnackbarRegion` 컴포넌트를 통한 프로그래매틱 생성/큐 관리

---

### 1.3 Seed Design 토큰 체계

#### Color Palette (Rootage YAML 원본 값)

**Gray Scale (Light Theme):**
| 토큰 | Light | Dark |
|------|-------|------|
| gray-00 | #ffffff | #000000 |
| gray-100 | #f7f8f9 | #16171b |
| gray-200 | #f3f4f5 | #1d2025 |
| gray-300 | #eeeff1 | #2b2e35 |
| gray-400 | #dcdee3 | #393d46 |
| gray-500 | #d1d3d8 | #5b606a |
| gray-600 | #b0b3ba | #868b94 |
| gray-700 | #868b94 | #b0b3ba |
| gray-800 | #555d6d | #dcdee3 |
| gray-900 | #2a3038 | #e9eaec |
| gray-1000 | #1a1c20 | #f3f4f5 |

**Brand Color (Carrot):**
| 토큰 | Light | Dark |
|------|-------|------|
| carrot-100 | #fff2ec | #31241f |
| carrot-200 | #ffe8db | #4b291c |
| carrot-300 | #ffd5c0 | #6b311c |
| carrot-400 | #ffb999 | #923600 |
| carrot-500 | #ff9364 | #bd4201 |
| carrot-600 | **#ff6600** | #e65200 |
| carrot-700 | #e14d00 | #ff6600 |

#### Semantic Color Mapping (주요 항목)

| 시맨틱 토큰 | Light Theme 참조 | 설명 |
|------------|-----------------|------|
| `$color.fg.neutral` | gray-1000 (#1a1c20) | 기본 텍스트 색상 |
| `$color.fg.neutral-inverted` | gray-00 (#ffffff) | 반전 텍스트 |
| `$color.fg.neutral-muted` | gray-800 (#555d6d) | 약한 텍스트 |
| `$color.fg.neutral-subtle` | gray-700 (#868b94) | 미묘한 텍스트 |
| `$color.fg.brand` | carrot-600 (#ff6600) | 브랜드 텍스트 |
| `$color.fg.brand-contrast` | carrot-700 (#e14d00) | 브랜드 대비 텍스트 |
| `$color.fg.disabled` | gray-400 | 비활성 텍스트 |
| `$color.fg.placeholder` | gray-600 | 플레이스홀더 |
| `$color.bg.brand-solid` | carrot-600 (#ff6600) | 브랜드 배경 |
| `$color.bg.brand-solid-pressed` | carrot-700 | 브랜드 배경 pressed |
| `$color.bg.brand-weak` | carrot-100 | 약한 브랜드 배경 |
| `$color.fg.critical` | red 계열 | 에러/위험 텍스트 |
| `$color.fg.positive` | green 계열 | 성공 텍스트 |
| `$color.fg.informative` | blue 계열 | 정보 텍스트 |
| `$color.fg.warning` | yellow/orange 계열 | 경고 텍스트 |

#### Color Role 시스템
- 토큰 형식: `$color.[property].[role]-[variant]`
- Property: bg(배경), fg(전경), stroke(테두리)
- Role: brand, neutral, positive, warning, critical, informative
- Variant: solid, weak, muted, subtle, inverted, contrast

#### Radius Scale (완전 목록)
| 토큰 | 값 |
|------|-----|
| `$radius.r0_5` | 2px |
| `$radius.r1` | 4px |
| `$radius.r1_5` | 6px |
| `$radius.r2` | 8px |
| `$radius.r2_5` | 10px |
| `$radius.r3` | 12px |
| `$radius.r3_5` | 14px |
| `$radius.r4` | 16px |
| `$radius.r5` | 20px |
| `$radius.r6` | 24px |
| `$radius.full` | 9999px |

#### Spacing Scale (완전 목록)
| 토큰 | 값 | 토큰 | 값 |
|------|-----|------|-----|
| `$dimension.x0_5` | 2px | `$dimension.x7` | 28px |
| `$dimension.x1` | 4px | `$dimension.x8` | 32px |
| `$dimension.x1_5` | 6px | `$dimension.x9` | 36px |
| `$dimension.x2` | 8px | `$dimension.x10` | 40px |
| `$dimension.x2_5` | 10px | `$dimension.x12` | 48px |
| `$dimension.x3` | 12px | `$dimension.x13` | 52px |
| `$dimension.x3_5` | 14px | `$dimension.x14` | 56px |
| `$dimension.x4` | 16px | `$dimension.x16` | 64px |
| `$dimension.x4_5` | 18px | | |
| `$dimension.x5` | 20px | | |
| `$dimension.x6` | 24px | | |

**특수 스페이싱 토큰:**
- `spacing-x.between-chips` = x2 (8px) - Chip 간 수평 간격
- `spacing-x.global-gutter` = x4 (16px) - 화면 기본 수평 padding
- `spacing-y.component-default` = x3 (12px) - 컴포넌트 간 기본 수직 간격
- `spacing-y.nav-to-title` = x5 (20px) - TopNav ~ Page Title 간격
- `spacing-y.screen-bottom` = x14 (56px) - 화면 하단 여백

#### Motion Tokens

**Duration:**
| 토큰 | 값 |
|------|-----|
| `$duration.d1` | 50ms |
| `$duration.d2` | 100ms |
| `$duration.d3` | 150ms |
| `$duration.d4` | 200ms |
| `$duration.d5` | 250ms |
| `$duration.d6` | 300ms |
| `$duration.color-transition` | = d3 (150ms) |

**Timing Function:**
| 토큰 | 값 |
|------|-----|
| `$timing-function.linear` | cubic-bezier(0, 0, 1, 1) |
| `$timing-function.easing` | cubic-bezier(0.35, 0, 0.35, 1) |
| `$timing-function.enter` | cubic-bezier(0, 0, 0.15, 1) |
| `$timing-function.exit` | cubic-bezier(0.35, 0, 1, 1) |
| `$timing-function.enter-expressive` | cubic-bezier(0.03, 0.4, 0.1, 1) |
| `$timing-function.exit-expressive` | cubic-bezier(0.35, 0, 0.95, 0.55) |

#### Typography
| 토큰 | 크기 | Line Height |
|------|------|------------|
| t1 | 11px | 15px |
| t2 | 12px | 16px |
| t3 | 13px | 18px |
| t4 | 14px | 19px |
| t5 | 16px | 22px |
| t6 | 18px | 24px |
| t7 | 20px | 27px |
| t8 | 22px | 30px |
| t9 | 24px | 32px |
| t10 | 26px | 35px |

Font Weights: regular(400), medium(500), bold(700)

---

## 1.4 Seed Design 타깃 컴포넌트 심층 분석 (14개)

### 1. Checkbox

**파일 위치:** `packages/react/src/components/Checkbox/Checkbox.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/checkbox.ts`
**Headless:** `@seed-design/react-checkbox`

**Slots:** `root`, `label` (checkbox recipe) + `root`, `icon` (checkmark recipe)
**Sub-components:**
- `Checkbox.Root` (label element) - variant props 수용
- `Checkbox.Control` - checkmark container
- `Checkbox.Indicator` - SVG 아이콘 (checked/unchecked/indeterminate 3상태)
- `Checkbox.Label` - 텍스트 라벨
- `Checkbox.HiddenInput` - native hidden input

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| weight | `regular`, `bold` | regular |
| size | `medium`, `large` | medium |

**States:** data-checked, data-disabled, data-indeterminate
**접근성:** HiddenInput으로 native form 지원, CheckboxGroup으로 그룹 관리
**주의:** `default`/`stronger` weight는 deprecated → `regular`/`bold` 사용

---

### 2. RadioGroup

**파일 위치:** `packages/react/src/components/RadioGroup/RadioGroup.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/radio-group.ts` + `radio.ts` + `radiomark.ts`
**Headless:** `@seed-design/react-radio-group`

**Slots:** `root`, `label` (radio recipe) + `root`, `icon` (radiomark recipe)
**Sub-components:**
- `RadioGroup.Root` - 그룹 컨테이너 (flex column)
- `RadioGroup.Item` (label element) - 개별 라디오 아이템
- `RadioGroup.ItemLabel` - 아이템 라벨
- `RadioGroup.ItemControl` - radiomark container
- `RadioGroup.ItemIndicator` - SVG 아이콘 (기본: 원형 circle)
- `RadioGroup.ItemHiddenInput` - native hidden input

**RadioGroup Recipe:**
- base: `display: flex`, `flexDirection: column`, `gap: gapY`
- variants: 없음 (Radio 개별 아이템에서 처리)

**States:** data-checked, data-disabled
**접근성:** HiddenInput, 기본 원형 SVG 인디케이터 제공

---

### 3. Switch

**파일 위치:** `packages/react/src/components/Switch/Switch.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/switch.ts` + `switchmark.ts`
**Headless:** `@seed-design/react-switch`

**Slots:** `root`, `label` (switch recipe) + `root`, `thumb` (switchmark recipe)
**Sub-components:**
- `Switch.Root` (label element)
- `Switch.Control` - track container
- `Switch.Thumb` - 움직이는 thumb
- `Switch.Label` - 텍스트 라벨
- `Switch.HiddenInput` - native hidden input

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| size | `"16"`, `"24"`, `"32"` | "32" |

**States:** data-checked, data-disabled
**주의:** `small`/`medium` size는 deprecated → `"16"`/`"32"` 사용

---

### 4. Divider

**파일 위치:** `packages/react/src/components/Divider/Divider.tsx`
**Recipe 위치:** 없음 (recipe 사용하지 않음, Box 기반 직접 구현)

**Slots:** 없음 (단일 컴포넌트)

**Props Interface:**
```typescript
interface DividerProps {
  as?: "hr" | "div" | "li";              // 기본: "hr"
  color?: BoxProps["borderColor"];         // 기본: "stroke.neutralMuted"
  thickness?: BoxProps["borderWidth"];     // 기본: 1
  orientation?: "horizontal" | "vertical"; // 기본: "horizontal"
  inset?: boolean;                         // 기본: false, margin 16px 적용
}
```

**접근성:** `aria-orientation` 자동 설정 (hr이 아닌 경우 + separator role)
**특징:** Seed Design의 Box 컴포넌트 기반, borderColor/borderWidth로 스타일링

---

### 5. Icon

**파일 위치:** `packages/react/src/components/Icon/Icon.tsx`
**Recipe 위치:** 없음 (CSS 변수 기반)

**Slots:** 없음

**Props Interface:**
```typescript
interface IconProps {
  svg: React.ReactNode;       // SVG 요소 직접 전달
  size?: StyleProps["height"]; // CSS 변수 --seed-icon-size로 변환
  color?: StyleProps["color"]; // CSS 변수 --seed-icon-color로 변환
}
```

**추가 컴포넌트:**
- `PrefixIcon` / `SuffixIcon` - 접두/접미 아이콘 (className: `seed-prefix-icon` / `seed-suffix-icon`)
- `IconRequired` - Icon-only 모드 검증 컴포넌트 (자식에 정확히 1개의 Icon이 있는지 검증)
- `withIconRequired()` HOC - 조건부 Icon-only 검증 적용

**CSS 변수:** `--seed-icon-size`, `--seed-icon-color`
**접근성:** `aria-hidden` 자동 적용
**특징:** `@radix-ui/react-slot`의 `Slot` 컴포넌트로 SVG에 props 전파

---

### 6. Chip

**파일 위치:** `packages/react/src/components/Chip/Chip.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/chip.ts`

**Slots:** `root`, `label`, `prefixIcon`, `suffixIcon`, `prefixAvatar`
**Sub-components:**
- `Chip.Root` (button element) - withIconRequired 적용 (layout=iconOnly일 때)
- `Chip.Label` - 텍스트 라벨
- `Chip.PrefixIcon` - 접두 아이콘
- `Chip.SuffixIcon` - 접미 아이콘
- `Chip.PrefixAvatar` - 접두 아바타

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| variant | `solid`, `outlineStrong`, `outlineWeak` | solid |
| size | `small`, `medium`, `large` | medium |
| layout | `iconOnly`, `withText` | withText |

**CompoundVariants:**
- size + layout=iconOnly → 각 사이즈별 minWidth 설정

**States:** data-checked, data-disabled, data-engaged(pressed)
**Pseudo:** `checked`, `engaged`, `disabled`, `focusVisible`
**특징:** Checkbox/RadioGroup context와 연동 가능 (선택형 Chip)

---

### 7. Skeleton

**파일 위치:** `packages/react/src/components/Skeleton/Skeleton.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/skeleton.ts`

**Slots:** 없음 (단일 recipe, `defineRecipe` 사용)

**Props Interface:**
```typescript
interface SkeletonProps extends SkeletonVariantProps {
  height?: StyleProps["height"];
  width?: StyleProps["width"];
}
```

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| radius | `0`, `8`, `16`, `full` | 8 |
| tone | `neutral`, `magic` | neutral |

**애니메이션:** `slide-x` keyframe, shimmer gradient (linear-gradient 90deg), infinite 반복
**CSS 변수:** `--seed-box-width`, `--seed-box-height`
**특징:** 매우 심플한 구조, width/height는 StyleProps를 통해 CSS 변수로 설정

---

### 8. TextField

**파일 위치:** `packages/react/src/components/TextField/TextField.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/text-input.ts`
**Headless:** `@seed-design/react-text-field` + `@seed-design/react-field`

**Slots:** `root`, `value`, `prefixText`, `prefixIcon`, `suffixText`, `suffixIcon`
**Sub-components:**
- `TextField.Root` - Field context와 자동 연동
- `TextField.Input` - `<input>` 요소 (Field context의 stateProps/inputAriaAttributes 자동 merge)
- `TextField.Textarea` - `<textarea>` 요소 (**autoresize=true** 기본, React Spectrum 참조 구현)
- `TextField.PrefixIcon` / `TextField.SuffixIcon`
- `TextField.PrefixText` / `TextField.SuffixText`

**핵심 특징:**
- **Input + Textarea 통합**: 하나의 TextField 컴포넌트에서 `TextField.Input` 또는 `TextField.Textarea`로 선택
- **autoresize**: Textarea에 autoresize 기본 활성화 (scrollHeight 기반 자동 높이 조절)
- **Field 연동**: `useFieldContext()`와 자동 연결, Field 밖에서 사용 시 `aria-label` 경고
- **States:** focus, disabled, readOnly, invalid (recipe에서 pseudo로 처리)

---

### 9. Tabs

**파일 위치:** `packages/react/src/components/Tabs/Tabs.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/tabs.ts`
**Headless:** `@seed-design/react-tabs`

**Slots:** `root`, `list`, `carousel`, `carouselCamera`, `content`, `indicator`, `trigger`
**Sub-components:**
- `Tabs.Root` - 최상위 컨테이너
- `Tabs.List` - 탭 트리거 리스트 (수평 스크롤, scrollbar 숨김)
- `Tabs.Trigger` - 개별 탭 버튼
- `Tabs.Indicator` - 선택 인디케이터 (position: absolute, CSS variable로 위치/너비 애니메이션)
- `Tabs.Content` - 탭 콘텐츠
- `Tabs.Carousel` - 캐러셀 컨테이너 (swipe 지원)
- `Tabs.CarouselCamera` - 캐러셀 카메라

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| triggerLayout | `fill`, `hug` | fill |
| contentLayout | `fill`, `hug` | hug |
| size | `small`, `medium` | small |
| stickyList | `true`, `false` | false |

**Indicator 애니메이션:** CSS 변수 `--indicator-left`, `--indicator-width`로 부드러운 슬라이딩
**States:** data-selected, data-disabled, data-ssr, data-carousel, data-auto-height
**특징:** Carousel 지원으로 swipeable 탭 콘텐츠 가능, SSR data attribute 지원

---

### 10. Field

**파일 위치:** `packages/react/src/components/Field/Field.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/field.ts` + `field-label.ts`
**Headless:** `@seed-design/react-field`

**Field Slots:** `root`, `header`, `footer`, `description`, `errorMessage`, `characterCountArea`, `characterCount`, `maxCharacterCount`
**FieldLabel Slots:** `root`, `indicatorText`, `indicatorIcon`

**Sub-components:**
- `Field.Root` - 최상위 (flex column, width: 100%)
- `Field.Header` - 헤더 (label + indicatorText 포함)
- `Field.Label` - 라벨 (weight: medium/bold)
- `Field.IndicatorText` - 인디케이터 텍스트 (예: "필수")
- `Field.RequiredIndicator` - 필수 표시 아이콘 (asterisk SVG)
- `Field.Footer` - 푸터 (description/errorMessage/characterCount 포함)
- `Field.Description` - 설명 텍스트
- `Field.ErrorMessage` - 에러 메시지
- `Field.CharacterCount` - 글자 수 표시 (current/max props)

**FieldLabel Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| weight | `medium`, `bold` | medium |

**CharacterCount States:**
- `data-empty`: current === 0
- `data-exceeded`: current > max
- `data-invalid`: Field가 invalid 상태일 때

**특징:** TextField, SelectBox 등의 래퍼로 사용, 접근성 자동 연결

---

### 11. Pagination

**Seed Design에 존재하지 않음 - 후니 커스텀 구현 필요**

Seed Design 전체 패키지(react, react-headless, qvism-preset, rootage)에서 Pagination 관련 컴포넌트/recipe/schema를 찾을 수 없음. 이는 Seed Design이 모바일 앱 우선으로 설계되어 무한 스크롤 패턴을 선호하기 때문으로 추정.

후니 DS에서는 관리자 페이지 등에서 테이블 페이지네이션이 필수이므로, 독자적인 디자인 + 구현이 필요.

---

### 12. Dialog

**파일 위치:** `packages/react/src/components/Dialog/Dialog.tsx`
**Recipe 위치:** `packages/qvism-preset/src/recipes/dialog.ts`
**Headless:** `@seed-design/react-dialog`

**Slots:** `positioner`, `backdrop`, `content`, `header`, `footer`, `action`, `title`, `description`
**Sub-components:**
- `Dialog.Root` - 상태 관리 (lazyMount=true, unmountOnExit=true 기본)
- `Dialog.Trigger` - 트리거 버튼
- `Dialog.Positioner` - 화면 중앙 포지셔닝 (fixed, flex center)
- `Dialog.Backdrop` - 배경 오버레이 (enterAnimation/exitAnimation)
- `Dialog.Content` - 콘텐츠 박스 (maxWidth, cornerRadius, scale+opacity 애니메이션)
- `Dialog.Header` - 헤더 (title + description)
- `Dialog.Title` - 제목
- `Dialog.Description` - 설명 (pre-wrap)
- `Dialog.Footer` - 푸터 (action 버튼 영역)
- `Dialog.Action` - 닫기 버튼 (= DialogPrimitive.CloseButton)

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| skipAnimation | `true`, `false` | false |

**애니메이션:**
- Backdrop: opacity enter/exit
- Content: opacity + scale enter/exit
- z-index: `--dialog-z-index` + `--layer-index` (다중 레이어 지원)

**States:** data-open
**특징:** `lazyMount`(첫 열림 시까지 렌더 지연) + `unmountOnExit`(닫힌 후 DOM 제거) 기본 활성화

**AlertDialog 관련 참고:** Seed Design에 AlertDialog는 별도로 없음. Dialog가 AlertDialog 역할을 겸함.

---

### 13. Snackbar

**파일 위치:** `packages/react/src/components/Snackbar/Snackbar.tsx` + `useSnackbarAdapter.ts`
**Recipe 위치:** `packages/qvism-preset/src/recipes/snackbar.ts` (snackbar + snackbar-region 2개 recipe)
**Headless:** `@seed-design/react-snackbar`

**Snackbar Slots:** `root`, `message`, `prefixIcon`, `actionButton`, `content`
**Sub-components:**
- `Snackbar.RootProvider` - 전역 Snackbar 상태 관리 프로바이더
- `Snackbar.Region` - Snackbar 표시 영역 (fixed, 화면 하단, safe-area 대응)
- `Snackbar.Root` - 개별 Snackbar 컨테이너
- `Snackbar.Content` - 콘텐츠 래퍼
- `Snackbar.Message` - 메시지 텍스트
- `Snackbar.PrefixIcon` - 접두 아이콘
- `Snackbar.ActionButton` - 액션 버튼
- `Snackbar.HiddenCloseButton` - 스크린 리더용 숨김 닫기 버튼
- `Snackbar.Renderer` - 렌더 함수 컴포넌트
- `Snackbar.AvoidOverlap` - 겹침 방지

**Variants:**
| Variant | 값 | 기본값 |
|---------|-----|--------|
| variant | `default`, `positive`, `critical` | default |

**Programmatic API (`useSnackbarAdapter`):**
```typescript
const snackbar = useSnackbarAdapter();

snackbar.create({
  timeout: 5000,       // 기본 5초
  removeDelay: 200,    // 제거 지연 200ms
  onClose: () => {},
  render: (props) => <SnackbarComponent {...props} />
});

snackbar.dismiss();
snackbar.visible; // 현재 표시 상태
```

**애니메이션:** enter(opacity + scale), exit(opacity + scale)
**z-index:** MAX_Z_INDEX (2147483647) - 모든 요소 위에 표시
**Region 특성:** safe-area-inset 대응, `--snackbar-region-offset` CSS 변수로 위치 조절
**접근성:** HiddenCloseButton으로 스크린 리더 닫기 지원

---

## 2. 현재 후니 DS 분석

### 2.1 기존 컴포넌트 (13개)

| 계층 | 컴포넌트 | 용도 | 사이즈 |
|------|---------|------|--------|
| **Atoms** | BadgeLabel | 상태 표시 (추천/인기) | variant: default/gold/teal/muted |
| | ColorChip | 색상 선택 칩 | 50x50px (RULE-4) |
| | InfoTooltip | 정보 안내 팝오버 | size: default/sm |
| **Molecules** | OptionLabel | 옵션 섹션 제목 | 필수(*) 지원 |
| | SizeOptionChip | 인쇄 사이즈 선택 | 155x50px (RULE-2) |
| | RadioOption | 라디오 옵션 | - |
| | DropdownSelect | 커스텀 드롭다운 | 348x50px (RULE-1) |
| | CounterOption | 카운터 입력 | 223x50px (RULE-3) |
| | SizeInput | 사이즈 입력 | - |
| | QuantityInput | 수량 입력 | state: default/disabled |
| | CTAButton | 주요 행동 버튼 | variant: primary/secondary/dark/disabled |
| **Organisms** | CollapsibleSection | 접이식 옵션 섹션 | - |
| | PriceSummary | 가격 요약 | - |

### 2.2 기존 토큰 시스템 (--po-* 접두사)
- 색상 31개: primary(#5538B6), primary-dark(#3B2573), accent-gold/teal/orange 등
- 타이포그래피: text-xs(11px) ~ text-2xl(20px), font-normal/medium/bold
- 패턴: CVA + Tailwind CSS + CSS Variables 혼합

### 2.3 인쇄 특화 규칙 (RULE-1~8)
- RULE-1: native select 금지, 커스텀 div 구현 (▼ 텍스트 캐럿)
- RULE-2: 선택 상태 = 흰색 배경 + #553886 테두리(2px)
- RULE-3: CounterInput 직사각형 3분할 [34px-][155px][34px+]
- RULE-4: ColorChip 50x50px 원형, 선택 = 흰색 + #553886 stroke
- RULE-5: 동적 데이터, 하드코딩 금지
- RULE-5-EXT: PriceSlider @radix-ui/react-slider 사용
- RULE-6-EXT: ImageChipType 50x50px 원형
- RULE-7-EXT: MiniColorChipType 32x32px
- RULE-8-EXT: LargeColorChipType 그리드, 50x50px

---

## 3. IA 기능 분석 (94개 기능)

### 3.1 쇼핑몰 (43개)
- A-1 로그인 (3): TextInput, ActionButton, Snackbar
- A-2 회원가입 (5): TextInput, Checkbox(약관), ActionButton
- A-3 마이페이지 (17): Tabs, List, Badge, Pagination, TextInput/Textarea
- A-4 고객센터 (7): Tabs, Collapsible, TextInput/Textarea, SelectBox
- A-5 결제 (1): Radio, ActionButton, Dialog
- A-6 주문 (7): Checkbox, QuantityInput, PriceSummary, TextInput, Callout
- A-7 정보 (4): 정적 페이지
- A-8 가이드 (1): 정적 콘텐츠
- A-9 마케팅 (3): ImageFrame, ActionButton, Badge
- A-10 상품 (4): 인쇄옵션 전체, Tabs, SegmentedControl

### 3.2 관리자 (51개)
- B-1~B-8: Table, TextInput, SelectBox, Badge, Pagination, Dialog, Snackbar 반복 사용

### 3.3 기능별 필요 컴포넌트 빈도
| 컴포넌트 | 사용 기능 수 | 비율 |
|---------|------------|------|
| ActionButton/CTAButton | 80+ | 85% |
| TextInput | 60+ | 64% |
| Badge/BadgeLabel | 50+ | 53% |
| SelectBox/DropdownSelect | 40+ | 43% |
| Tabs | 30+ | 32% |
| Checkbox | 25+ | 27% |
| Pagination | 25+ | 27% |
| Dialog | 20+ | 21% |
| Radio | 15+ | 16% |
| Snackbar | 15+ | 16% |
| Divider | 70+ | 74% |
| Skeleton | 50+ | 53% |

---

## 4. 갭 분석: 필요하지만 없는 컴포넌트

### Tier 1 (Must Have) -- 14개 (Seed Design 13개 + 후니 커스텀 1개)

| # | 컴포넌트 | 계층 | Seed 매핑 | IA 사용 비율 | 비고 |
|---|---------|------|----------|------------|------|
| 1 | Checkbox | Atom | Checkbox | 27% | 5 slots, weight(regular/bold), size(medium/large) |
| 2 | RadioGroup | Atom | RadioGroup | 16% | 6 slots, flex column layout |
| 3 | Switch | Atom | Switch | 5% | 5 slots, size("16"/"24"/"32") |
| 4 | Divider | Atom | Divider | 74% | No slots, orientation/color/thickness/inset |
| 5 | Icon | Atom | Icon | 90%+ | svg prop + CSS vars (--seed-icon-size/color) |
| 6 | Chip | Atom | Chip | 20% | 5 slots, 3 variant, 3 size, layout(iconOnly/withText) |
| 7 | Skeleton | Atom | Skeleton | 53% | radius(0/8/16/full), tone(neutral/magic), shimmer |
| 8 | TextField | Molecule | TextField | 64% | 7 slots, Input+Textarea 통합, autoresize |
| 9 | Tabs | Molecule | Tabs | 32% | 7 slots, carousel 지원, indicator 애니메이션 |
| 10 | Field | Molecule | Field | 64% | 10+ slots, CharacterCount, RequiredIndicator |
| 11 | Pagination | Molecule | **없음** | 27% | **후니 커스텀 구현** (Seed Design 미제공) |
| 12 | Dialog | Organism | Dialog | 21% | 8 slots, lazyMount, unmountOnExit, 애니메이션 |
| 13 | Snackbar | Organism | Snackbar | 16% | 10 slots, Programmatic API, 큐 관리 |

**기존 목록 대비 변경 사항:**
- ~~TextInput~~ + ~~Textarea~~ → **TextField** 하나로 통합 (Seed Design 구조 따름)
- ~~AlertDialog~~ → **Dialog**로 대체 (Seed Design에 AlertDialog 없음)
- Pagination: Seed Design 미제공 확인, 후니 커스텀 필요
- Tier 1 총 개수: 15개 → **14개** (TextInput/Textarea 통합으로 1개 감소)

### Tier 2 (Should Have) -- 10개
BottomSheet, Callout, Avatar, SegmentedControl, ImageFrame, HelpBubble, ProgressCircle, TopNavigation, BottomNavigation, List

### Tier 3 (Nice to Have) -- 5개
Table, ToggleButton, TagGroup, ScrollFog, NotificationBadge

---

## 5. 토큰 매핑 전략

### 기존 --po-* -> 신규 --huni-* 3단계 구조

**Level 1: Primitive (팔레트)**
```
--huni-purple-50~700, --huni-orange-500, --huni-gold-500, --huni-teal-500
--huni-gray-50~900
--huni-red-500, --huni-green-500, --huni-blue-500, --huni-yellow-500
```

**Level 2: Semantic (역할 기반)**
```
--huni-bg-brand-solid, --huni-bg-neutral-weak, --huni-bg-critical-solid, ...
--huni-fg-brand, --huni-fg-neutral, --huni-fg-disabled, ...
--huni-stroke-brand, --huni-stroke-neutral-muted, --huni-stroke-critical, ...
```

**Level 3: Component (컴포넌트 전용)**
```
--huni-button-primary-bg, --huni-input-border-focus, ...
```

### 호환 레이어
```css
:root {
  --po-primary: var(--huni-bg-brand-solid);
  --po-primary-dark: var(--huni-purple-700);
  /* ... 기존 참조 유지 */
}
```

---

## 6. Seed Design vs 후니 DS 설계 차이

| 항목 | Seed Design | 후니 DS |
|------|------------|--------|
| 아키텍처 | YAML -> TS Recipe -> CSS 빌드 | CSS Vars + CVA 직접 사용 |
| 브랜드 컬러 | 주황 (carrot #ff6600) | 보라 (#553886) |
| 타깃 | 모바일 앱 우선 | 데스크톱 우선 (모바일 지원) |
| hover 상태 | active (터치 우선) | hover + active |
| 특수 컴포넌트 | 없음 | 인쇄 옵션 (RULE-1~8) |
| 접근성 | data-* + ARIA 완전 + HiddenInput | 부분 ARIA |
| Headless 분리 | react-headless 별도 패키지 | 컴포넌트 내장 |
| 컴포넌트 패턴 | Slot-based Compound Component (createSlotRecipeContext) | 단일 컴포넌트 |
| TextInput 구조 | TextField (Input + Textarea 통합) | TextInput / Textarea 분리 |
| AlertDialog | 없음 (Dialog가 대체) | AlertDialog 별도 |
| Pagination | 없음 (무한스크롤 선호) | 필수 (관리자 테이블) |
| Snackbar API | Programmatic (useSnackbarAdapter + Region) | 미정 |
| 애니메이션 토큰 | duration(d1~d6) + timing-function(6종) YAML 정의 | CSS transition 직접 |
| Focus Ring | createFocusRingStyles() 유틸리티 | 미정 |
