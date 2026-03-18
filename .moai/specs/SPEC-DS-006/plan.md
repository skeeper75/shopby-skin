# SPEC-DS-006: 구현 계획

> **SPEC ID**: SPEC-DS-006
> **문서 유형**: Implementation Plan
> **작성일**: 2026-03-17
> **갱신일**: 2026-03-17

---

## 1. Phase 개요

| Phase | 제목 | 우선순위 | 주요 산출물 |
|-------|------|---------|------------|
| Phase 1 (S1) | Foundation | Primary Goal | spacing, radius, elevation, motion CSS + createSlotRecipeContext 유틸 + pseudo helpers + focusRing 유틸 |
| Phase 2 (S2) | Atoms (7개) | Primary Goal | Divider, Icon, Skeleton, Checkbox(5 slots), Radio(6 slots), Switch(5 slots), Chip(5 slots) |
| Phase 3 (S3) | Molecules (4개) | Secondary Goal | Field(10 slots), TextField(7 slots, autoresize), Tabs(7 slots, carousel), Pagination(Huni custom) |
| Phase 4 (S4) | Organisms (2개) | Secondary Goal | Dialog(8 slots, lazyMount), Snackbar(10 slots, useSnackbar hook, queue) |
| Phase 5 (S5) | 기존 컴포넌트 토큰 마이그레이션 | Optional Goal | 13개 기존 컴포넌트 --po-* -> --huni-* 전환 + index.js re-export (27개) |

---

## 2. Phase 1: Foundation (Primary Goal)

### 목표

Seed Design Role-based 토큰 체계를 후니 브랜드에 맞게 적용하고, Compound Component + Slot Pattern 인프라를 구축한다. spacing, radius, elevation, motion 토큰을 신규 생성하고, **createSlotRecipeContext** 유틸리티와 focusRing 유틸리티를 제공한다. **기존 --po-* 참조 컴포넌트가 변경 없이 정상 렌더링**되는 것이 핵심 완료 조건이다.

### Milestone 1-1: Spacing 토큰 정의

**대상 파일**: `src/design-system/tokens/spacing.css` (신규)

- [ ] --huni-space-0_5 ~ --huni-space-16 총 17단계 정의
- [ ] 4px 기본 단위 기반 일관성 검증

### Milestone 1-2: Radius 토큰 정의

**대상 파일**: `src/design-system/tokens/radius.css` (신규)

- [ ] --huni-radius-0 ~ --huni-radius-full 총 7단계 정의
- [ ] 컴포넌트별 radius 매핑 테이블 검증

### Milestone 1-3: Elevation(Shadow) 토큰 정의

**대상 파일**: `src/design-system/tokens/elevation.css` (신규)

- [ ] --huni-shadow-sm, md, lg, xl 4단계 정의
- [ ] Dialog, Snackbar 등 floating 요소에 적용할 shadow 적합성 검증

### Milestone 1-4: Motion 토큰 정의

**대상 파일**: `src/design-system/tokens/motion.css` (신규)

- [ ] --huni-duration-fast/normal/slow 3단계 정의
- [ ] --huni-easing-default/in/out 3종 정의
- [ ] Switch, Snackbar, Dialog 등 애니메이션 컴포넌트 적용 적합성 검증

### Milestone 1-5: 기존 토큰 파일 업데이트

**대상 파일**: `src/design-system/tokens/colors.css` (업데이트)

- [ ] Purple 팔레트 7단계 (50~700) 추가
- [ ] Accent 팔레트 (Orange, Gold, Teal) 추가
- [ ] Gray 팔레트 10단계 (0~900) 추가
- [ ] Semantic 색상 (Red, Green, Blue, Yellow) 추가
- [ ] Semantic Background 토큰 11종 (bg-brand-solid ~ bg-disabled) 추가
- [ ] Semantic Foreground 토큰 10종 (fg-brand ~ fg-disabled) 추가
- [ ] Semantic Stroke 토큰 7종 (stroke-brand ~ stroke-disabled) 추가

**대상 파일**: `src/design-system/tokens/typography.css` (업데이트)

- [ ] --huni-text-t8 ~ t10 폰트 사이즈 3종 추가
- [ ] --huni-leading-t8 ~ t10 라인 하이트 3종 추가

**대상 파일**: `src/design-system/tokens/index.css` (업데이트)

- [ ] spacing.css @import 추가
- [ ] radius.css @import 추가
- [ ] elevation.css @import 추가
- [ ] motion.css @import 추가
- [ ] import 순서 보장: colors -> typography -> spacing -> radius -> elevation -> motion

### Milestone 1-6: createSlotRecipeContext 유틸리티

**대상 파일**: `src/design-system/utils/createSlotRecipeContext.js` (신규)

- [ ] Compound Component 패턴의 slot recipe context 생성 유틸리티 구현
- [ ] defineSlotRecipe 호환 패턴 -- CVA 기반 slot별 variant 정의 지원
- [ ] Provider/Consumer 패턴으로 slot별 스타일 전파
- [ ] slotStyles 객체를 하위 slot 컴포넌트에 context로 전달

### Milestone 1-7: Pseudo 헬퍼 + focusRing 유틸리티

**대상 파일**: `src/design-system/utils/pseudo.js` (신규)

- [ ] data-* state attribute 기반 pseudo 유틸리티 (data-checked, data-disabled, data-focus-visible 등)
- [ ] Seed Design의 _checked, _disabled, _focusVisible 패턴을 data-attribute 선택자로 변환

**대상 파일**: `src/design-system/utils/focusRing.js` (신규)

- [ ] focusVisible 상태 관리 유틸리티
- [ ] 키보드 네비게이션 시 focus ring 표시, 마우스 클릭 시 숨김
- [ ] --huni-stroke-brand 색상 기반 2px outline, 2px offset 기본값

### Phase 1 완료 조건

- [ ] 기존 13개 컴포넌트가 --po-* alias를 통해 변경 없이 정상 렌더링
- [ ] 신규 토큰 4개 파일 생성 완료 (spacing, radius, elevation, motion)
- [ ] 기존 3개 파일 업데이트 완료 (colors, typography, index)
- [ ] createSlotRecipeContext 유틸리티 구현 및 테스트 완료
- [ ] pseudo 헬퍼 + focusRing 유틸리티 구현 및 테스트 완료
- [ ] CSS 변수 순환 참조 없음
- [ ] 빌드 정상 동작

---

## 3. Phase 2: Atoms 컴포넌트 (Primary Goal)

### 목표

Seed Design Compound Component + Slot Pattern을 적용하여 7개 Atom 컴포넌트를 구현한다. 모든 컴포넌트는 Root 및 하위 Slot 서브컴포넌트로 분리하고, data-* state attribute로 상태를 노출하며, focusVisible 관리를 포함한다.

### 전제조건

- Phase 1 완료 (토큰 + createSlotRecipeContext + focusRing)

### 의존성 설치

- [ ] @radix-ui/react-checkbox 설치
- [ ] @radix-ui/react-radio-group 설치
- [ ] @radix-ui/react-switch 설치
- [ ] lucide-react 설치

### Milestone 2-1: 의존성 없는 Atom 구현 (3종)

**우선 구현** -- 외부 Radix 의존성 없이 순수 구현 가능한 컴포넌트

- [ ] **Divider** -- variant(full/inset), direction(horizontal/vertical), --huni-stroke-neutral-muted 토큰 적용. Radix 불필요, 단순 구조
- [ ] **Icon** -- lucide-react 래퍼, 5단계 size(xs~xl), CSS variable 기반 color 패턴. `--huni-icon-color` CSS var로 부모 컨텍스트 색상 상속
- [ ] **Skeleton** -- radius + tone 기반 (shape 기반 아님). radius prop으로 직접 radius 지정, tone(neutral/brand) 지원. shimmer 애니메이션 (wave 효과)

### Milestone 2-2: Radix 기반 Atom 구현 (3종)

Compound Component + Slot Pattern 적용:

- [ ] **Checkbox** (5 slots: Root, Control, Indicator, Label, HiddenInput)
  - @radix-ui/react-checkbox 기반
  - data-checked, data-disabled, data-focus-visible state attribute
  - size(md/lg), indeterminate 상태 지원
  - focusRing 유틸리티 적용
- [ ] **Radio** (6 slots: Root, Item, ItemControl, ItemIndicator, ItemLabel, HiddenInput)
  - @radix-ui/react-radio-group 기반
  - RadioGroup.Root + RadioGroup.Item Compound Component
  - data-checked, data-disabled state attribute
  - size(md/lg)
- [ ] **Switch** (5 slots: Root, Control, Thumb, Label, HiddenInput)
  - @radix-ui/react-switch 기반
  - data-checked, data-disabled state attribute
  - size(md/lg), motion 토큰 기반 thumb 애니메이션
  - focusRing 유틸리티 적용

### Milestone 2-3: Chip 구현 + atoms/index.js 업데이트

- [ ] **Chip** (5 slots: Root, Label, Icon, DeleteButton, Count)
  - 3 variants: solid, outlineStrong, outlineWeak (Seed Design 패턴)
  - 3 sizes: xs, sm, md
  - 2 layouts: inline, block
  - iconOnly 유효성 검증 (Icon만 있을 때 aria-label 필수)
  - data-selected, data-disabled state attribute
  - Radius: --huni-radius-full
- [ ] atoms/index.js -- 7개 신규 컴포넌트 + 서브컴포넌트 re-export 추가

### Phase 2 완료 조건

- [ ] 7개 Atom 컴포넌트 구현 완료
- [ ] 모든 컴포넌트가 Compound Component 패턴 (Root + Slot 서브컴포넌트 export)
- [ ] 모든 컴포넌트에 data-* state attribute 적용 (data-checked, data-disabled, data-focus-visible 등)
- [ ] CVA slot recipe 패턴 (defineSlotRecipe 호환) 적용
- [ ] focusVisible 관리 (키보드 focus ring, 마우스 클릭 시 숨김)
- [ ] WAI-ARIA 패턴 준수 (키보드 네비게이션 지원)
- [ ] Vitest 유닛 테스트 커버리지 85%+
- [ ] 인쇄 특화 RULE-1~8 위반 없음

---

## 4. Phase 3: Molecules 컴포넌트 (Secondary Goal)

### 목표

폼 입력, 탭 전환, 페이징 등 복합 상호작용이 필요한 Molecule 컴포넌트 4개를 Compound Component + Slot Pattern으로 구현한다. TextField는 기존 TextInput + Textarea를 하나의 컴포넌트로 통합한다.

### 전제조건

- Phase 1 완료
- Phase 2 완료 (Icon, Chip 등 Atom 의존)

### 의존성 설치

- [ ] @radix-ui/react-tabs 설치

### Milestone 3-1: Field 컴포넌트

- [ ] **Field** (10 slots: Root, Label, RequiredIndicator, Control, HelperText, ErrorText, CharacterCount, Input, Textarea, Select)
  - Context Provider 패턴 -- 자식 입력 컴포넌트에 ids, disabled, invalid 상태 전파
  - RequiredIndicator slot -- `*` 표시 (--huni-fg-critical)
  - CharacterCount slot -- data-empty (0자), data-exceeded (초과) attribute
  - label/helperText/errorText 자동 연결 (aria-labelledby, aria-describedby)

### Milestone 3-2: TextField 컴포넌트

- [ ] **TextField** (7 slots: Root, Label, Input, Textarea, HelperText, ErrorText, CharacterCount)
  - TextInput + Textarea 통합 컴포넌트 (multiline prop으로 전환)
  - multiline=false: `<input>` 렌더링
  - multiline=true: `<textarea>` 렌더링 + autoresize (scrollHeight 기반)
  - Field context 통합 -- Field 하위에서 사용 시 상태 자동 연결
  - variant(outline/underline), size(md/lg), clearable, prefix/suffix 지원
  - data-focus, data-invalid, data-disabled, data-readonly state attribute

### Milestone 3-3: Tabs 컴포넌트

- [ ] **Tabs** (7 slots: Root, List, Trigger, Content, Indicator, Carousel, CarouselContent)
  - @radix-ui/react-tabs 기반 Compound Component
  - variant(line/chip), layout(fill/hug)
  - Indicator slot -- 활성 탭 하단 indicator 애니메이션 (motion 토큰 적용)
  - Carousel slot -- 탭 콘텐츠 swipe/carousel 지원 (선택적)
  - data-selected, data-disabled state attribute
  - 키보드: ArrowLeft/Right로 탭 이동

### Milestone 3-4: Pagination 구현 + molecules/index.js 업데이트

- [ ] **Pagination** -- Huni custom 컴포넌트 (Seed Design에 없음)
  - variant(numbered/loadMore), siblingCount 기반 페이지 범위 계산
  - 화살표 네비게이션, 중간 생략('...') 표시
  - `loadMore` variant: "더 보기" 버튼
- [ ] molecules/index.js -- 4개 신규 컴포넌트 + 서브컴포넌트 re-export 추가

### Phase 3 완료 조건

- [ ] 4개 Molecule 컴포넌트 구현 완료
- [ ] Field + TextField 조합 동작 검증 (context 자동 연결)
- [ ] TextField multiline autoresize 동작 검증
- [ ] CharacterCount data-empty/data-exceeded attribute 동작 검증
- [ ] Tabs indicator 애니메이션 동작 검증
- [ ] Tabs 키보드 네비게이션 (ArrowLeft/Right) 동작 검증
- [ ] Pagination 경계값 처리 (첫 페이지, 마지막 페이지, 단일 페이지)
- [ ] Vitest 유닛 테스트 커버리지 85%+

---

## 5. Phase 4: Organisms 컴포넌트 (Secondary Goal)

### 목표

Dialog와 Snackbar 2개 Organism 컴포넌트를 Compound Component + Slot Pattern으로 구현한다. AlertDialog가 아닌 범용 Dialog를 구현하며, Snackbar는 프로그래매틱 API(useSnackbar hook)를 제공한다.

### 전제조건

- Phase 1 완료

### 의존성 설치

- [ ] @radix-ui/react-dialog 설치 (react-alert-dialog 아님)

### Milestone 4-1: Dialog 구현

- [ ] **Dialog** (8 slots: Root, Trigger, Backdrop, Positioner, Content, Header, Body, Footer)
  - @radix-ui/react-dialog 기반 (AlertDialog 아님 -- 범용 Dialog)
  - lazyMount: true -- 처음 열릴 때까지 DOM에 마운트하지 않음
  - unmountOnExit: true -- 닫힌 후 DOM에서 제거
  - Backdrop slot -- rgba(0, 0, 0, 0.5) 오버레이
  - Content slot -- --huni-bg-layer-floating, --huni-radius-4, --huni-shadow-xl
  - 진입/퇴장 애니메이션 (motion 토큰 적용: duration-normal, easing-default)
  - 포커스 트랩, ESC 닫기, Backdrop 클릭 닫기
  - data-open, data-closed state attribute

### Milestone 4-2: Snackbar 구현

- [ ] **Snackbar** (10 slots: Root, Title, Description, ActionTrigger, CloseTrigger, RootProvider, Group, Toaster, Toast, Region)
  - SnackbarRootProvider -- context 기반 상태 관리
  - useSnackbar() hook -- 프로그래매틱 Snackbar 생성 API
    - `snackbar.create({ title, description, type, duration })` 형태
    - type: default/positive/warning/critical
  - Queue 시스템 -- FIFO 순서, 최대 표시 개수 제한 (기본: 3개)
  - SnackbarRegion -- 화면 하단 고정 영역, Snackbar 스택 렌더링
  - 자동 닫힘 (기본 5000ms), actionTrigger로 액션 버튼 지원
  - 진입/퇴장 애니메이션 (motion 토큰)
  - data-type, data-open, data-closed state attribute

### Milestone 4-3: 전체 index.js 통합

- [ ] organisms/index.js -- 2개 신규 컴포넌트 + 서브컴포넌트 re-export 추가
- [ ] src/design-system/components/index.js -- 전체 27개 컴포넌트 re-export 확인
  - 기존 13개 + 신규 14개 = 27개 (TextInput/Textarea가 TextField로 통합되었으므로 15가 아닌 14)

### Phase 4 완료 조건

- [ ] 2개 Organism 컴포넌트 구현 완료
- [ ] Dialog lazyMount + unmountOnExit 동작 검증
- [ ] Dialog 진입/퇴장 애니메이션 동작 검증
- [ ] Dialog 포커스 트랩 + ESC 닫기 + Backdrop 클릭 닫기 동작 검증
- [ ] Snackbar useSnackbar() hook 프로그래매틱 생성 동작 검증
- [ ] Snackbar queue FIFO 순서 동작 검증
- [ ] Snackbar 자동 닫힘 타이머 동작 검증
- [ ] SnackbarRegion 하단 고정 + 스택 렌더링 검증
- [ ] 접근성 테스트 (role="dialog", role="status")
- [ ] Vitest 유닛 테스트 커버리지 85%+

---

## 6. Phase 5: 기존 컴포넌트 토큰 마이그레이션 (Optional Goal)

### 목표

기존 13개 컴포넌트의 --po-* 직접 참조를 --huni-* 시맨틱 토큰으로 교체하고, 전체 index.js re-export를 정리한다.

### 전제조건

- Phase 1 완료

### Milestone 5-1: Atoms 마이그레이션 (3종)

- [ ] BadgeLabel.jsx -- --po-primary -> --huni-bg-brand-solid / --huni-fg-neutral-inverted
- [ ] InfoTooltip.jsx -- --po-text-medium -> --huni-fg-neutral-subtle
- [ ] ColorChip.jsx -- inline color 유지 (동적 색상), 나머지 토큰 교체

### Milestone 5-2: Molecules 마이그레이션 (8종)

- [ ] OptionLabel.jsx -- --po-* 참조 -> --huni-* 시맨틱 토큰 교체
- [ ] SizeOptionChip.jsx -- border-[var(--po-border-default)] -> --huni-stroke-neutral-muted
- [ ] RadioOption.jsx -- 선택/미선택 상태 토큰 교체
- [ ] DropdownSelect.jsx -- 배경/테두리/텍스트 토큰 교체
- [ ] CounterOption.jsx -- 입력/버튼 토큰 교체
- [ ] SizeInput.jsx -- 입력 상태별 토큰 교체
- [ ] QuantityInput.jsx -- 입력 상태별 토큰 교체
- [ ] CTAButton.jsx -- bg-[var(--po-primary)] -> --huni-bg-brand-solid

### Milestone 5-3: Organisms 마이그레이션 (2종)

- [ ] CollapsibleSection.jsx -- 헤더/컨텐츠 영역 토큰 교체
- [ ] PriceSummary.jsx -- 텍스트/배경/구분선 토큰 교체

### Milestone 5-4: index.js re-export 통합

- [ ] src/design-system/components/index.js -- 전체 27개 컴포넌트 + 서브컴포넌트 re-export 최종 확인

### Phase 5 완료 조건

- [ ] 모든 기존 컴포넌트가 --huni-* 토큰만 사용
- [ ] --po-* 직접 참조 0건 (Grep 검증)
- [ ] 시각적 변화 없음 (스크린샷 비교)
- [ ] 인쇄 특화 RULE-1~8 위반 없음

---

## 7. 아키텍처 설계 방향

### Compound Component + Slot Pattern

모든 신규 컴포넌트는 Seed Design의 Compound Component 패턴을 따른다:

```
컴포넌트 구조 예시 (Checkbox):
  Checkbox.Root       -- 최상위 래퍼, recipe context provider
  Checkbox.Control    -- 체크박스 시각적 컨트롤
  Checkbox.Indicator  -- 체크/indeterminate 아이콘
  Checkbox.Label      -- 라벨 텍스트
  Checkbox.HiddenInput -- 접근성용 숨겨진 input

Export 패턴:
  export { CheckboxRoot as Root, CheckboxControl as Control, ... }
  export const Checkbox = Object.assign(CheckboxRoot, {
    Root: CheckboxRoot,
    Control: CheckboxControl,
    ...
  })
```

### createSlotRecipeContext 패턴

```
createSlotRecipeContext({
  slots: ['root', 'control', 'indicator', 'label', 'hiddenInput'],
  recipe: defineSlotRecipe({
    base: { root: '...', control: '...', ... },
    variants: {
      size: { md: { root: '...', control: '...' }, lg: { ... } },
    },
    defaultVariants: { size: 'md' },
  }),
})
```

CVA 기반 slot recipe 적응:
- 각 slot별 CVA 정의를 하나의 recipe 객체로 통합
- Context를 통해 하위 slot에 variant 스타일 전파
- pseudo 유틸리티로 data-* attribute 기반 상태 스타일 적용

### data-* State Attribute 패턴

```
Seed Design 패턴 변환:
  _checked  -> [data-checked]
  _disabled -> [data-disabled]
  _focus    -> [data-focus]
  _focusVisible -> [data-focus-visible]
  _invalid  -> [data-invalid]
  _readonly -> [data-readonly]
  _empty    -> [data-empty]
  _exceeded -> [data-exceeded]
```

Radix UI는 자동으로 data-state attribute를 제공하므로, 이를 활용하여 Seed Design 패턴과 매핑한다.

### 토큰 참조 흐름

```
Tier 1 (Primitive)         Tier 2 (Semantic)           컴포넌트 사용
--------------------       --------------------        --------------------
--huni-purple-500          --huni-bg-brand-solid       Checkbox.Control 체크 배경
--huni-gray-0              --huni-fg-neutral-inverted  Checkbox.Indicator 아이콘
--huni-gray-200            --huni-stroke-neutral-muted Divider 색상
--huni-gray-900            --huni-bg-neutral-inverted  Snackbar.Root 기본 배경

                           Alias Layer (호환)
                           --------------------
                           --po-primary        --> --huni-purple-500
                           --po-text-dark      --> --huni-fg-neutral
                           --po-border-default --> --huni-stroke-neutral-muted
```

### CSS Import 순서

```css
/* tokens/index.css */
@import './colors.css';       /* Primitive + Semantic 색상 */
@import './typography.css';   /* 폰트 크기 + 라인 하이트 */
@import './spacing.css';      /* 간격 토큰 */
@import './radius.css';       /* 모서리 둥글기 토큰 */
@import './elevation.css';    /* 그림자 토큰 */
@import './motion.css';       /* 애니메이션 토큰 */
```

### 파일 구조

```
src/design-system/
├── tokens/
│   ├── index.css          (업데이트)
│   ├── colors.css         (업데이트)
│   ├── typography.css     (업데이트)
│   ├── spacing.css        (신규)
│   ├── radius.css         (신규)
│   ├── elevation.css      (신규)
│   └── motion.css         (신규)
│
├── utils/
│   ├── createSlotRecipeContext.js  (신규)
│   ├── pseudo.js                  (신규)
│   ├── focusRing.js               (신규)
│   └── index.js                   (업데이트)
│
├── components/
│   ├── atoms/
│   │   ├── [기존 3개]
│   │   ├── Checkbox/          (신규 - Compound Component)
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Checkbox.recipe.js
│   │   │   └── index.js
│   │   ├── Radio/             (신규 - Compound Component)
│   │   ├── Switch/            (신규 - Compound Component)
│   │   ├── Chip/              (신규 - Compound Component)
│   │   ├── Divider.jsx        (신규)
│   │   ├── Icon.jsx           (신규)
│   │   ├── Skeleton.jsx       (신규)
│   │   └── index.js           (업데이트)
│   │
│   ├── molecules/
│   │   ├── [기존 8개]
│   │   ├── Field/             (신규 - Compound Component, 10 slots)
│   │   ├── TextField/         (신규 - Compound Component, 7 slots)
│   │   ├── Tabs/              (신규 - Compound Component, 7 slots)
│   │   ├── Pagination.jsx     (신규 - Huni custom)
│   │   └── index.js           (업데이트)
│   │
│   ├── organisms/
│   │   ├── [기존 2개]
│   │   ├── Dialog/            (신규 - Compound Component, 8 slots)
│   │   ├── Snackbar/          (신규 - Compound Component, 10 slots + hook)
│   │   └── index.js           (업데이트)
│   │
│   └── index.js               (업데이트 - 27개 컴포넌트)
│
└── index.js
```

---

## 8. 위험 분석 및 대응

| 위험 | 발생 확률 | 영향도 | 대응 전략 |
|------|-----------|--------|----------|
| --po-* -> --huni-* 호환성 깨짐 | 중간 | 높음 | Phase 1 완료 시 기존 13개 컴포넌트 전체 렌더링 검증, 호환 레이어 유지 |
| Compound Component 패턴 복잡도 증가 | 중간 | 중간 | createSlotRecipeContext로 보일러플레이트 최소화, 점진적 적용 |
| Radix UI 기존 설치 버전 충돌 | 낮음 | 높음 | 기존 @radix-ui/* 버전 확인 후 호환 범위 내 설치, peer dependency 검증 |
| Dialog vs AlertDialog API 차이 | 중간 | 중간 | @radix-ui/react-dialog가 더 범용적, AlertDialog는 Dialog의 특수 케이스로 처리 가능 |
| Snackbar queue 상태 관리 복잡도 | 중간 | 중간 | React context + useReducer로 queue 관리, 최대 표시 개수 제한으로 복잡도 제어 |
| useSnackbar hook SSR 호환성 | 낮음 | 중간 | SnackbarRegion을 App root에 마운트, hook은 클라이언트 전용 |
| TextField autoresize 성능 | 낮음 | 낮음 | scrollHeight 기반 계산, ResizeObserver 활용 시 debounce 적용 |
| lucide-react 번들 사이즈 증가 | 중간 | 중간 | tree-shaking 확인, 사용 아이콘만 named import |
| Tabs carousel 구현 복잡도 | 중간 | 낮음 | Carousel slot은 선택적 구현, 기본 탭 동작 우선 |
| 인쇄 옵션 페이지에서 신규 컴포넌트 간섭 | 낮음 | 높음 | 각 Phase 완료 시 인쇄 옵션 페이지 RULE-1~8 검증 |

---

## 9. MX Tag 계획

### Phase 1 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| `tokens/colors.css` | `@MX:ANCHOR` | 모든 컴포넌트가 참조하는 핵심 색상 토큰 (fan_in >= 27) |
| `tokens/spacing.css` | `@MX:ANCHOR` | 다수 컴포넌트가 참조하는 간격 토큰 (fan_in >= 15) |
| `tokens/index.css` | `@MX:NOTE` | 토큰 import 순서 및 구조 설명 |
| `tokens/elevation.css` | `@MX:NOTE` | shadow 단계별 용도 설명 |
| `tokens/motion.css` | `@MX:NOTE` | 애니메이션 토큰 용도 설명 |
| `utils/createSlotRecipeContext.js` | `@MX:ANCHOR` | 모든 Compound Component가 의존하는 핵심 유틸 (fan_in >= 10) |
| `utils/focusRing.js` | `@MX:NOTE` | focusVisible 관리 패턴 설명 |

### Phase 2 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| `Checkbox/Checkbox.jsx` | `@MX:NOTE` | Compound Component + indeterminate 상태 처리 |
| `Radio/Radio.jsx` | `@MX:NOTE` | RadioGroup + RadioItem Compound Component 구조 |
| `Switch/Switch.jsx` | `@MX:NOTE` | motion 토큰 적용 thumb 애니메이션 |
| `Chip/Chip.jsx` | `@MX:NOTE` | 3 variants + iconOnly 유효성 검증 패턴 |
| `Icon.jsx` | `@MX:NOTE` | CSS variable 기반 색상 상속 패턴 |

### Phase 3 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| `Field/Field.jsx` | `@MX:ANCHOR` | Context Provider -- 자식 입력 컴포넌트 상태 전파 (fan_in >= 3) |
| `TextField/TextField.jsx` | `@MX:NOTE` | multiline 분기 + autoresize 로직 |
| `Tabs/Tabs.jsx` | `@MX:NOTE` | indicator 애니메이션 + carousel slot |
| `Pagination.jsx` | `@MX:NOTE` | 페이지 범위 계산 알고리즘 (Huni custom) |

### Phase 4 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| `Dialog/Dialog.jsx` | `@MX:WARN` | 포커스 트랩 + lazyMount/unmountOnExit -- 수정 시 접근성/메모리 위험 |
| `Snackbar/Snackbar.jsx` | `@MX:WARN` | useSnackbar hook + queue + 자동 닫힘 -- 수정 시 상태 관리 깨짐 위험 |
| `components/index.js` | `@MX:ANCHOR` | 27개 전체 컴포넌트 re-export 진입점 (fan_in >= 27) |

### Phase 5 MX Tag 대상

| 대상 파일 | Tag 유형 | 사유 |
|----------|----------|------|
| 마이그레이션 대상 13개 컴포넌트 | `@MX:NOTE` | --po-* -> --huni-* 토큰 변경 기록 |

---

## 10. 전문가 상담 권장

### expert-frontend 상담 권장 (Phase 1~4)

- Compound Component + Slot Pattern 설계 검증
- createSlotRecipeContext CVA 적응 패턴 최적화
- data-* state attribute 기반 스타일링 전략
- Dialog lazyMount/unmountOnExit 구현 패턴
- Snackbar useSnackbar() hook + queue 상태 관리 패턴
- TextField autoresize (scrollHeight vs ResizeObserver)
- Tabs indicator 애니메이션 구현 방법
- lucide-react tree-shaking 설정 검증

### design-uiux 상담 권장 (Phase 1)

- 토큰 네이밍 규칙의 디자인 시스템 관점 검증
- 접근성(a11y) 관점의 색상 토큰 대비비(contrast ratio) 검증
- Seed Design과 후니 DS 간 UX 패턴 차이점 검토
- focusRing 시각적 디자인 (색상, 두께, offset)

### expert-testing 상담 권장 (Phase 2~4)

- Vitest + React Testing Library Compound Component 테스트 전략
- data-* state attribute 검증 테스트 패턴
- useSnackbar hook 테스트 패턴 (프로그래매틱 API)
- 시각적 회귀 테스트 도구 선정 (스크린샷 비교)
