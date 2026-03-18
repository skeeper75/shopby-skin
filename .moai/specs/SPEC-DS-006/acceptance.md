# SPEC-DS-006: 수락 기준

> **SPEC ID**: SPEC-DS-006
> **문서 유형**: Acceptance Criteria
> **작성일**: 2026-03-17
> **갱신일**: 2026-03-17

---

## 1. 토큰 확장 + Foundation 검증

### AC-001: 신규 토큰 파일 존재 및 유효성

**Given** S1 (Foundation)이 완료되었을 때
**When** `src/design-system/tokens/` 디렉토리의 파일 구조를 검사하면
**Then** 다음 조건을 모두 만족해야 한다:
- `spacing.css` 파일이 존재하고, `--huni-space-0_5` ~ `--huni-space-16` 변수 17개가 정의되어 있다
- `radius.css` 파일이 존재하고, `--huni-radius-0` ~ `--huni-radius-full` 변수 7개가 정의되어 있다
- `elevation.css` 파일이 존재하고, `--huni-shadow-sm/md/lg/xl` 변수 4개가 정의되어 있다
- `motion.css` 파일이 존재하고, `--huni-duration-*` 3개 + `--huni-easing-*` 3개 = 변수 6개가 정의되어 있다
- `index.css`에서 4개 신규 파일이 모두 import되어 있다
- `colors.css`에 `--huni-*` 시맨틱 토큰이 추가되어 있다
- `typography.css`에 `--huni-text-t8` ~ `--huni-text-t10`, `--huni-leading-t8` ~ `--huni-leading-t10`이 추가되어 있다

### AC-002: 시맨틱 토큰(bg/fg/stroke x role x variant) 정의 완전성

**Given** `colors.css`에 시맨틱 토큰이 추가되었을 때
**When** CSS 변수를 카테고리별로 검사하면
**Then** 다음 조건을 모두 만족해야 한다:
- Background 토큰: `--huni-bg-brand-solid`, `--huni-bg-brand-weak`, `--huni-bg-neutral-weak`, `--huni-bg-neutral-inverted`, `--huni-bg-critical-solid`, `--huni-bg-positive-solid`, `--huni-bg-warning-solid`, `--huni-bg-informative-solid`, `--huni-bg-layer-default`, `--huni-bg-layer-floating`, `--huni-bg-disabled` (최소 11개)
- Foreground 토큰: `--huni-fg-brand`, `--huni-fg-neutral`, `--huni-fg-neutral-subtle`, `--huni-fg-neutral-muted`, `--huni-fg-neutral-inverted`, `--huni-fg-critical`, `--huni-fg-positive`, `--huni-fg-warning`, `--huni-fg-informative`, `--huni-fg-disabled` (최소 10개)
- Stroke 토큰: `--huni-stroke-brand`, `--huni-stroke-neutral-muted`, `--huni-stroke-neutral-weak`, `--huni-stroke-neutral-contrast`, `--huni-stroke-critical`, `--huni-stroke-positive`, `--huni-stroke-disabled` (최소 7개)
- 모든 시맨틱 토큰이 Primitive 팔레트 토큰(`--huni-purple-*`, `--huni-gray-*` 등)을 `var()` 참조한다

### AC-003: 기존 `--po-*` 호환 레이어 보존 + Foundation 유틸리티

**Given** 토큰 확장과 Foundation 유틸리티가 완료된 후
**When** 기존 13개 컴포넌트를 렌더링하고 유틸리티 파일을 검사하면
**Then** 다음 조건을 만족해야 한다:
- `--po-*` 변수가 `--huni-*` 변수를 참조하는 호환 레이어가 유지되어 있다
- 기존 `--po-*` 변수를 직접 참조하는 코드가 수정 없이 정상 작동한다
- 기존 13개 컴포넌트의 시각적 변화가 없다 (회귀 없음)
- `createSlotRecipeContext.js`가 존재하고, Provider/Consumer 패턴으로 slot 스타일을 전파한다
- `pseudo.js`가 존재하고, data-* attribute 기반 pseudo 유틸리티를 제공한다
- `focusRing.js`가 존재하고, 키보드 focus ring 표시 / 마우스 클릭 시 숨김이 동작한다

---

## 2. Atom 컴포넌트 검증 (7개)

### AC-004: Checkbox (5 slots)

**Given** `Checkbox` Compound Component가 구현되었을 때
**When** 다양한 props 조합으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- @radix-ui/react-checkbox 기반으로 구현되어 있다
- **Slot 서브컴포넌트**: Root, Control, Indicator, Label, HiddenInput 5개가 export된다
- `Checkbox.Root`, `Checkbox.Control` 등의 dot notation으로 접근 가능하다
- **data-* state attribute**: `data-checked`, `data-disabled`, `data-focus-visible`이 상태에 따라 토글된다
- Sizes: `md` (32px, t4), `lg` (36px, t5) 두 가지를 지원한다
- States: `checked`, `unchecked`, `indeterminate`, `disabled` 네 가지 상태를 지원한다
- `checked` 상태에서 Control 배경이 `--huni-bg-neutral-inverted`, Indicator가 `--huni-fg-neutral-inverted`이다
- `unchecked` 상태에서 Control 테두리가 `--huni-stroke-neutral-weak` (1px)이다
- `disabled` 상태에서 배경이 `--huni-bg-disabled`이고 클릭이 불가하다
- `indeterminate` 상태에서 '-' 또는 indeterminate 아이콘이 Indicator에 표시된다
- **focusVisible**: 키보드 Tab 시 focus ring 표시, 마우스 클릭 시 focus ring 숨김
- Label 슬롯에 라벨 텍스트가 표시되고, 간격이 8px (`--huni-space-2`)이다
- `onCheckedChange` 콜백이 상태 변경 시 호출된다

### AC-005: Radio (6 slots)

**Given** `Radio` Compound Component가 구현되었을 때
**When** RadioGroup 내에 여러 RadioItem을 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- @radix-ui/react-radio-group 기반으로 구현되어 있다
- **Slot 서브컴포넌트**: Root, Item, ItemControl, ItemIndicator, ItemLabel, HiddenInput 6개가 export된다
- **data-* state attribute**: `data-checked`, `data-disabled`가 각 Item에 상태별로 토글된다
- RadioGroup.Root: `value`, `onValueChange`, `disabled` props를 지원한다
- RadioGroup.Item: `value`, `disabled`, `label`, `size`, `weight` props를 지원한다
- Sizes: `md` (32px, t4), `lg` (36px, t5) 두 가지를 지원한다
- `selected` 상태에서 ItemControl 배경이 `--huni-bg-neutral-inverted`이다
- `unselected` 상태에서 ItemControl 테두리가 `--huni-stroke-neutral-weak` (1px)이다
- `disabled` 상태에서 배경이 `--huni-bg-disabled`이고 선택이 불가하다
- **focusVisible**: 키보드 네비게이션 시 focus ring 표시
- 그룹 내 항목 간 간격이 4px (`--huni-space-1`)이다
- 한 그룹 내에서 하나의 항목만 선택 가능하다

### AC-006: Switch (5 slots)

**Given** `Switch` Compound Component가 구현되었을 때
**When** on/off/disabled 상태로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- @radix-ui/react-switch 기반으로 구현되어 있다
- **Slot 서브컴포넌트**: Root, Control, Thumb, Label, HiddenInput 5개가 export된다
- **data-* state attribute**: `data-checked`, `data-disabled`가 상태별로 토글된다
- `on` 상태에서 Control 색상이 `--huni-bg-brand-solid` (브랜드 컬러)이다
- `off` 상태에서 Control 색상이 `--huni-bg-neutral-weak`이다
- Thumb 색상이 `--huni-gray-0` (white)이다
- Thumb 이동 시 motion 토큰 기반 애니메이션이 적용된다 (--huni-duration-fast, --huni-easing-default)
- `disabled` 상태에서 배경이 `--huni-bg-disabled`이고 토글이 불가하다
- Sizes: `md`, `lg` 두 가지를 지원한다
- **focusVisible**: 키보드 Tab 시 focus ring 표시
- Label 슬롯에 라벨 텍스트 표시를 지원한다
- `onCheckedChange` 콜백이 토글 시 호출된다

### AC-007: Divider

**Given** `Divider` 컴포넌트가 구현되었을 때
**When** 다양한 variant/direction 조합으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- Variants: `full` (전체 너비), `inset` (좌우 패딩) 두 가지를 지원한다
- Direction: `horizontal`, `vertical` 두 가지를 지원한다
- 색상이 `--huni-stroke-neutral-muted`이다
- 두께가 1px이다
- `inset` variant에서 좌우 패딩이 16px (`--huni-space-4`)이다
- `horizontal` 방향에서 전체 너비로 표시된다
- `vertical` 방향에서 전체 높이로 표시된다

### AC-008: Icon

**Given** `Icon` 컴포넌트가 구현되었을 때
**When** 다양한 size/name으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- `lucide-react` 라이브러리 기반으로 구현되어 있다
- Sizes: `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px) 다섯 가지를 지원한다
- `name` prop으로 lucide 아이콘 이름을 지정할 수 있다
- `color` prop으로 아이콘 색상을 커스터마이즈할 수 있다
- CSS variable `--huni-icon-color`를 통해 부모 컨텍스트에서 색상을 상속받을 수 있다
- `className` prop으로 추가 스타일을 적용할 수 있다
- 존재하지 않는 아이콘 name에 대해 에러 없이 처리된다

### AC-009: Chip (5 slots)

**Given** `Chip` Compound Component가 구현되었을 때
**When** 다양한 variant/size/state 조합으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- **Slot 서브컴포넌트**: Root, Label, Icon, DeleteButton, Count 5개가 export된다
- **Variants**: `solid`, `outlineStrong`, `outlineWeak` 세 가지를 지원한다 (Seed Design 패턴)
- **Sizes**: `xs`, `sm`, `md` 세 가지를 지원한다
- **Layouts**: `inline`, `block` 두 가지를 지원한다
- **data-* state attribute**: `data-selected`, `data-disabled`가 상태별로 토글된다
- `selected` 상태에서 배경이 `--huni-bg-brand-weak`, 텍스트가 `--huni-fg-brand`이다
- `unselected` + `solid` 상태에서 배경이 `--huni-bg-neutral-weak`, 텍스트가 `--huni-fg-neutral`이다
- `unselected` + `outlineStrong` 상태에서 테두리가 `--huni-stroke-neutral-contrast`이다
- `unselected` + `outlineWeak` 상태에서 테두리가 `--huni-stroke-neutral-muted`이다
- `disabled` 상태에서 배경이 `--huni-bg-disabled`, 텍스트가 `--huni-fg-disabled`이다
- Radius가 `--huni-radius-full`이다
- **iconOnly 유효성 검증**: Icon만 있고 Label이 없을 때 `aria-label` 필수 (없으면 콘솔 경고)
- DeleteButton이 있을 때 닫기(X) 아이콘이 표시된다
- `onDelete` 콜백이 DeleteButton 클릭 시 호출된다

### AC-010: Skeleton

**Given** `Skeleton` 컴포넌트가 구현되었을 때
**When** 다양한 props 조합으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- **radius 기반** (shape 기반 아님): `radius` prop으로 직접 radius 값을 지정할 수 있다
- **tone**: `neutral` (기본), `brand` 두 가지를 지원한다
- `neutral` tone의 배경색이 `--huni-bg-neutral-weak`이다
- `brand` tone의 배경색이 `--huni-bg-brand-weak`이다
- radius 미지정 시 기본값이 `--huni-radius-1`이다
- `width`, `height` prop으로 크기를 지정할 수 있다
- **shimmer 애니메이션**: 좌에서 우로 빛 이동 효과(wave)가 기본으로 동작한다
- `animation` prop으로 `pulse`(opacity 변화) 또는 `wave`(shimmer)를 선택할 수 있다
- motion 토큰 (--huni-duration-slow, --huni-easing-default) 기반 애니메이션

---

## 3. Molecule 컴포넌트 검증 (4개)

### AC-011: TextField (7 slots)

**Given** `TextField` Compound Component가 구현되었을 때
**When** 다양한 props 조합으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- TextInput + Textarea를 하나의 컴포넌트로 통합한다
- **Slot 서브컴포넌트**: Root, Label, Input, Textarea, HelperText, ErrorText, CharacterCount 7개가 export된다
- **multiline prop**: false(기본)이면 `<input>` 렌더링, true이면 `<textarea>` 렌더링
- **data-* state attribute**: `data-focus`, `data-invalid`, `data-disabled`, `data-readonly`가 상태별로 토글된다
- **Textarea autoresize**: multiline=true일 때 내용에 따라 높이가 자동 조절된다 (scrollHeight 기반)
- `maxHeight` prop으로 최대 높이를 제한할 수 있다
- `minRows` prop(기본값: 3)으로 최소 행 수를 지정할 수 있다
- Variants: `outline`, `underline` 두 가지를 지원한다
- Sizes: `md` (40px, t4), `lg` (52px, t5) 두 가지를 지원한다
- States: `enabled`, `focused`, `error`, `disabled`, `readOnly` 다섯 가지 상태를 지원한다
- `enabled` 상태에서 테두리가 `--huni-stroke-neutral-weak` (1px)이다
- `focused` 상태에서 테두리가 `--huni-stroke-neutral-contrast` (2px)이다
- `error` 상태에서 테두리가 `--huni-stroke-critical` (2px)이다
- `disabled` 상태에서 배경이 `--huni-bg-disabled`이고 입력이 불가하다
- 텍스트 색상이 `--huni-fg-neutral`, placeholder가 `--huni-fg-neutral-subtle`이다
- `clearable` prop이 true이고 값이 있을 때 클리어(X) 버튼이 표시된다
- **Field context 통합**: Field 하위에서 사용 시 ids/disabled/invalid 상태가 자동 연결된다

### AC-012: Field (10 slots)

**Given** `Field` Compound Component가 구현되었을 때
**When** label, helperText, errorText와 함께 자식 컴포넌트를 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- **Slot 서브컴포넌트**: Root, Label, RequiredIndicator, Control, HelperText, ErrorText, CharacterCount, Input, Textarea, Select 10개가 export된다
- **Context Provider**: 자식 입력 컴포넌트에 ids, disabled, invalid 상태를 context로 전파한다
- Label 슬롯으로 라벨 텍스트가 상단에 표시된다 (색상: `--huni-fg-neutral`, t4, font-weight: medium)
- **RequiredIndicator 슬롯**: required=true일 때 라벨 옆에 `*` 표시가 `--huni-fg-critical` 색상으로 나타난다
- HelperText 슬롯으로 입력 필드 하단에 도움말이 표시된다 (색상: `--huni-fg-neutral-subtle`, t2)
- ErrorText 슬롯이 있을 때 HelperText 대신 에러 메시지가 표시된다 (색상: `--huni-fg-critical`, t2)
- **CharacterCount 슬롯**: 현재 글자수/최대 글자수 표시
  - `data-empty` attribute: 글자수가 0일 때 true
  - `data-exceeded` attribute: 최대 글자수를 초과했을 때 true
- 라벨과 입력 사이 간격이 6px (`--huni-space-1_5`)이다
- 입력과 도움말/에러 사이 간격이 4px (`--huni-space-1`)이다
- `disabled` prop이 true일 때 자식 요소에 disabled 상태가 context를 통해 전파된다
- `aria-labelledby`, `aria-describedby`가 자동으로 연결된다
- TextField, TextInput, Textarea 등 임의의 입력 컴포넌트를 감쌀 수 있다

### AC-013: Tabs (7 slots)

**Given** `Tabs` Compound Component가 구현되었을 때
**When** 다양한 variant/layout/size 조합으로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- @radix-ui/react-tabs 기반으로 구현되어 있다
- **Slot 서브컴포넌트**: Root, List, Trigger, Content, Indicator, Carousel, CarouselContent 7개가 export된다
- **data-* state attribute**: `data-selected`, `data-disabled`가 Trigger에 상태별로 토글된다
- Variants: `line`, `chip` 두 가지를 지원한다
- `line` variant: `fill`(균등 분배) / `hug`(콘텐츠 맞춤) layout을 지원한다
- `line` variant: `sm` (40px), `md` (44px) 크기를 지원한다
- `chip` variant: `md` (36px), `lg` (40px) 크기를 지원한다
- `chip` variant: `solid`, `outline` chipStyle을 지원한다
- **Indicator 슬롯**: 활성 탭 하단 indicator가 motion 토큰 기반 애니메이션으로 이동한다
- `line` 활성 탭: 텍스트 `--huni-fg-neutral`, indicator 2px `--huni-fg-neutral`
- `line` 비활성 탭: 텍스트 `--huni-fg-neutral-subtle`
- `chip solid` 활성: 배경 `--huni-bg-neutral-inverted` + 텍스트 `--huni-fg-neutral-inverted`
- `chip solid` 비활성: 배경 `--huni-bg-neutral-weak` + 텍스트 `--huni-fg-neutral`
- `chip outline` 활성: 배경 `--huni-bg-neutral-inverted`
- `chip outline` 비활성: transparent + 테두리 `--huni-stroke-neutral-muted`
- 하단 구분선이 `--huni-stroke-neutral-muted` (1px)으로 표시된다 (line variant)
- Font weight가 bold이다
- **Carousel 슬롯**: 탭 콘텐츠 영역에 carousel/swipe 지원 (선택적 구현)
- `items` 배열로 탭 목록을 정의하고, 개별 탭의 `disabled` 상태를 지원한다
- `onValueChange` 콜백이 탭 전환 시 호출된다
- 키보드: ArrowLeft/Right로 탭 이동

### AC-014: Pagination (Huni custom)

**Given** `Pagination` 컴포넌트가 구현되었을 때
**When** `numbered`/`loadMore` variant로 렌더링하면
**Then** 다음 조건을 모두 만족해야 한다:
- **Huni custom 컴포넌트** -- Seed Design에 없는 후니 독자 컴포넌트이다
- Variants: `numbered`, `loadMore` 두 가지를 지원한다
- `numbered` variant:
  - 현재 페이지가 `--huni-bg-brand-solid` 배경 + `--huni-fg-neutral-inverted` 텍스트로 강조된다
  - 비활성 페이지가 transparent 배경 + `--huni-fg-neutral` 텍스트이다
  - 호버 시 배경이 `--huni-bg-neutral-weak`으로 변경된다
  - 비활성 화살표(이전/다음)가 `--huni-fg-disabled` 색상이다
  - `siblingCount` prop으로 현재 페이지 좌우 표시 개수를 지정할 수 있다
  - 중간 생략 시 '...' 표시가 나타난다
  - Radius가 `--huni-radius-1`, 간격이 4px (`--huni-space-1`)이다
- `loadMore` variant:
  - "더 보기" 버튼이 표시된다
  - 마지막 페이지에서 버튼이 비활성화된다
- `onPageChange` 콜백이 페이지 변경 시 호출된다

---

## 4. Organism 컴포넌트 검증 (2개)

### AC-015: Dialog (8 slots)

**Given** `Dialog` Compound Component가 구현되었을 때
**When** 열림/닫힘을 테스트하면
**Then** 다음 조건을 모두 만족해야 한다:
- **@radix-ui/react-dialog** 기반으로 구현되어 있다 (AlertDialog 아님)
- **Slot 서브컴포넌트**: Root, Trigger, Backdrop, Positioner, Content, Header, Body, Footer 8개가 export된다
- **data-* state attribute**: `data-open`, `data-closed`가 상태별로 토글된다
- **lazyMount**: 처음 열릴 때까지 Content가 DOM에 마운트되지 않는다
- **unmountOnExit**: 닫힌 후 Content가 DOM에서 제거된다
- Backdrop 슬롯: `rgba(0, 0, 0, 0.5)` 오버레이가 배경에 표시된다
- Content 슬롯: 배경 `--huni-bg-layer-floating`, radius `--huni-radius-4`, shadow `--huni-shadow-xl`
- Header 슬롯: 제목 `--huni-fg-neutral`, t6, bold
- Body 슬롯: 본문 `--huni-fg-neutral-subtle`, t4
- 패딩이 `--huni-space-6` (24px)이다
- **진입/퇴장 애니메이션**: motion 토큰 기반 (--huni-duration-normal, --huni-easing-default)
  - 진입: fade-in + scale(0.95 -> 1.0)
  - 퇴장: fade-out + scale(1.0 -> 0.95)
- **포커스 트랩**: 열림 시 Content 내부에서만 포커스 이동
- **ESC 닫기**: Escape 키로 Dialog 닫기 가능
- **Backdrop 클릭 닫기**: 오버레이 클릭으로 Dialog 닫기 가능
- `open`/`onOpenChange` props로 열림/닫힘 상태를 제어할 수 있다

### AC-016: Snackbar (10 slots + useSnackbar hook)

**Given** `Snackbar` Compound Component와 useSnackbar hook이 구현되었을 때
**When** 프로그래매틱으로 Snackbar를 생성하면
**Then** 다음 조건을 모두 만족해야 한다:
- **Slot 서브컴포넌트**: Root, Title, Description, ActionTrigger, CloseTrigger, RootProvider, Group, Toaster, Toast, Region 10개가 export된다
- **data-* state attribute**: `data-type`, `data-open`, `data-closed`가 상태별로 토글된다
- **useSnackbar() hook**: 프로그래매틱 Snackbar 생성 API
  - `snackbar.create({ title, description, type, duration })` 호출로 Snackbar 생성
  - type: `default`, `positive`, `warning`, `critical` 네 가지 지원
- **SnackbarRootProvider**: React tree 상위에 배치, context 기반 상태 관리
- **SnackbarRegion**: 화면 하단 고정 영역 (`bottom: --huni-space-6`), Snackbar 스택 렌더링
- **Queue 시스템**:
  - FIFO 순서로 표시
  - 최대 동시 표시 개수 제한 (기본: 3개)
  - 초과 시 대기열에 추가, 기존 것이 닫히면 순차 표시
- `default` type: 배경 `--huni-bg-neutral-inverted`, 텍스트 `--huni-fg-neutral-inverted`
- `positive` type: 배경 `--huni-bg-positive-solid`
- `warning` type: 배경 `--huni-bg-warning-solid`
- `critical` type: 배경 `--huni-bg-critical-solid`
- Radius: `--huni-radius-2` (8px), Shadow: `--huni-shadow-lg`, 패딩: `--huni-space-4` (16px)
- **자동 닫힘**: `duration` (기본: 3000ms) 경과 후 자동으로 사라진다
- **ActionTrigger**: 액션 버튼 (label + onClick) 지원
- **CloseTrigger**: 수동 닫기 버튼 지원
- **진입/퇴장 애니메이션**: motion 토큰 기반 (slide-up + fade-in / slide-down + fade-out)
- 여러 Snackbar가 동시에 표시될 때 겹치지 않고 위로 스택된다

---

## 5. 횡단 관심사 검증

### AC-017: Compound Component 패턴 준수

**Given** 14개 신규 컴포넌트(Atom 7 + Molecule 4 + Organism 2)가 모두 구현되었을 때
**When** 각 컴포넌트의 코드 구조를 검사하면
**Then** 다음 조건을 모두 만족해야 한다:
- Radix 기반 Compound Component (Checkbox, Radio, Switch, Tabs, Dialog): Slot 서브컴포넌트가 dot notation으로 export된다
- Compound Component (Field, TextField, Chip, Snackbar): Slot 서브컴포넌트가 dot notation으로 export된다
- 단순 컴포넌트 (Divider, Icon, Skeleton, Pagination): forwardRef + displayName 패턴
- 모든 컴포넌트가 `--huni-*` 토큰만 참조하고, `--po-*` 직접 참조가 0건이다

### AC-018: data-* State Attribute 준수

**Given** data-* state attribute를 사용하는 컴포넌트가 구현되었을 때
**When** 각 컴포넌트의 DOM 출력을 검사하면
**Then** 다음 조건을 모두 만족해야 한다:
- Checkbox: `data-checked`, `data-disabled`, `data-focus-visible`
- Radio: `data-checked`, `data-disabled`
- Switch: `data-checked`, `data-disabled`
- Chip: `data-selected`, `data-disabled`
- TextField: `data-focus`, `data-invalid`, `data-disabled`, `data-readonly`
- Field CharacterCount: `data-empty`, `data-exceeded`
- Tabs Trigger: `data-selected`, `data-disabled`
- Dialog: `data-open`, `data-closed`
- Snackbar: `data-type`, `data-open`, `data-closed`
- CSS에서 `[data-checked]`, `[data-disabled]` 등의 attribute selector로 스타일링된다

### AC-019: CVA Slot Recipe 패턴 준수

**Given** Compound Component가 CVA slot recipe 패턴으로 구현되었을 때
**When** 각 컴포넌트의 recipe 정의를 검사하면
**Then** 다음 조건을 모두 만족해야 한다:
- createSlotRecipeContext 유틸리티를 사용하여 slot별 스타일이 정의되어 있다
- 각 slot의 variant/size 스타일이 slot recipe 객체 내에 정의되어 있다
- Context Provider를 통해 root에서 하위 slot으로 variant props가 전파된다
- `cn()` 유틸리티(`clsx` + `tailwind-merge`)로 클래스가 병합된다

### AC-020: WAI-ARIA 접근성 및 키보드 네비게이션

**Given** 14개 신규 컴포넌트가 모두 구현되었을 때
**When** 키보드만으로 각 컴포넌트를 조작하면
**Then** 다음 조건을 모두 만족해야 한다:
- **Checkbox**: Tab으로 포커스 이동, Space로 체크/해제, `role="checkbox"` 및 `aria-checked` 속성, focusVisible ring
- **Radio**: Tab으로 그룹 진입, 방향키(Arrow)로 항목 이동, Space로 선택, `role="radio"` 및 `aria-checked` 속성
- **Switch**: Tab으로 포커스, Space/Enter로 토글, `role="switch"` 및 `aria-checked` 속성, focusVisible ring
- **Tabs**: Tab으로 탭 목록 진입, 방향키로 탭 이동, Enter/Space로 선택, `role="tablist"` / `role="tab"` / `role="tabpanel"` 속성
- **Dialog**: 열림 시 포커스 트랩, Escape로 닫기, Tab으로 버튼 간 이동, `role="dialog"` 속성
- **TextField**: Tab으로 포커스, 표준 입력 동작, `aria-invalid` (error 시), `aria-readonly` (readOnly 시), `aria-labelledby`/`aria-describedby` 자동 연결
- **Chip**: iconOnly일 때 `aria-label` 필수, DeleteButton Tab 접근 가능, Enter/Space로 닫기 실행
- **Pagination**: Tab으로 페이지 버튼 간 이동, Enter로 페이지 선택, `aria-current="page"` (현재 페이지)
- 모든 disabled 컴포넌트가 포커스에서 제외되거나 `aria-disabled="true"`를 가진다

### AC-021: 인쇄 특화 RULE-1~8 보존

**Given** 14개 신규 컴포넌트가 추가된 후
**When** 기존 인쇄 옵션 관련 페이지를 렌더링하면
**Then** 다음 조건을 만족해야 한다:
- 기존 인쇄 옵션 컴포넌트(PrintOptionPage 등)가 정상 동작한다
- RULE-1 ~ RULE-8에 해당하는 모든 비즈니스 로직이 변경 전과 동일하게 작동한다
- 신규 컴포넌트가 인쇄 옵션 컴포넌트의 CSS에 간섭하지 않는다
- 인쇄 옵션 페이지에서 시각적 회귀가 발생하지 않는다

### AC-022: 전체 컴포넌트 re-export

**Given** 기존 13개 + 신규 14개 = 27개 컴포넌트가 구현되었을 때
**When** `src/design-system/components/index.js`에서 import를 테스트하면
**Then** 다음 조건을 만족해야 한다:
- `atoms/index.js`에서 기존 3개 + 신규 7개 = 10개 Atom (+ Slot 서브컴포넌트)이 export된다
- `molecules/index.js`에서 기존 8개 + 신규 4개 = 12개 Molecule (+ Slot 서브컴포넌트)이 export된다
- `organisms/index.js`에서 기존 2개 + 신규 2개 = 4개 Organism (+ Slot 서브컴포넌트)이 export된다
- 최상위 `components/index.js`에서 27개 전체 컴포넌트를 named export로 import할 수 있다
  - 13개 기존 + 14개 신규 = 27개 (TextInput+Textarea가 TextField로 통합)
- Compound Component는 `import { Checkbox } from '@/design-system/components'` 후 `Checkbox.Root`, `Checkbox.Control` 등으로 접근 가능하다
- 빌드 시 tree-shaking이 정상 작동한다

### AC-023: Vitest 유닛 테스트 커버리지

**Given** 14개 신규 컴포넌트의 테스트 코드가 작성되었을 때
**When** `vitest --coverage`를 실행하면
**Then** 다음 조건을 만족해야 한다:
- 신규 컴포넌트 전체 Statement 커버리지가 85% 이상이다
- 각 컴포넌트별 최소 커버리지가 80% 이상이다
- 모든 variant/size 조합에 대한 렌더링 테스트가 존재한다
- Compound Component의 slot 서브컴포넌트별 렌더링 테스트가 존재한다
- data-* state attribute 전환 테스트가 존재한다
- 주요 state 전환(enabled -> disabled, unchecked -> checked 등) 테스트가 존재한다
- 콜백 함수(onCheckedChange, onDelete, snackbar.create 등) 호출 검증 테스트가 존재한다
- 접근성 속성(role, aria-*, data-*) 검증 테스트가 존재한다
- useSnackbar hook 프로그래매틱 API 테스트가 존재한다
- Dialog lazyMount/unmountOnExit 동작 테스트가 존재한다

---

## 6. Quality Gate 기준

### Definition of Done (S1 - Foundation)

- [ ] AC-001: 신규 토큰 파일 존재 및 유효성 -- PASS
- [ ] AC-002: 시맨틱 토큰 정의 완전성 -- PASS
- [ ] AC-003: 기존 `--po-*` 호환 레이어 보존 + Foundation 유틸리티 -- PASS

### Definition of Done (S2 - Atoms)

- [ ] AC-004: Checkbox (5 slots) -- PASS
- [ ] AC-005: Radio (6 slots) -- PASS
- [ ] AC-006: Switch (5 slots) -- PASS
- [ ] AC-007: Divider -- PASS
- [ ] AC-008: Icon -- PASS
- [ ] AC-009: Chip (5 slots) -- PASS
- [ ] AC-010: Skeleton -- PASS
- [ ] AC-017: Compound Component 패턴 준수 (Atom 부분) -- PASS
- [ ] AC-018: data-* State Attribute 준수 (Atom 부분) -- PASS
- [ ] AC-020: WAI-ARIA 접근성 (Atom 부분) -- PASS

### Definition of Done (S3 - Molecules)

- [ ] AC-011: TextField (7 slots) -- PASS
- [ ] AC-012: Field (10 slots) -- PASS
- [ ] AC-013: Tabs (7 slots) -- PASS
- [ ] AC-014: Pagination (Huni custom) -- PASS
- [ ] AC-017: Compound Component 패턴 준수 (Molecule 부분) -- PASS
- [ ] AC-018: data-* State Attribute 준수 (Molecule 부분) -- PASS
- [ ] AC-019: CVA Slot Recipe 패턴 준수 -- PASS
- [ ] AC-020: WAI-ARIA 접근성 (Molecule 부분) -- PASS

### Definition of Done (S4 - Organisms)

- [ ] AC-015: Dialog (8 slots) -- PASS
- [ ] AC-016: Snackbar (10 slots + useSnackbar hook) -- PASS
- [ ] AC-017: Compound Component 패턴 준수 (Organism 부분) -- PASS
- [ ] AC-018: data-* State Attribute 준수 (Organism 부분) -- PASS
- [ ] AC-020: WAI-ARIA 접근성 (Organism 부분) -- PASS

### Definition of Done (S5 - 기존 컴포넌트 토큰 마이그레이션)

- [ ] AC-003: 기존 `--po-*` 호환 레이어 보존 (마이그레이션 후 재검증) -- PASS
- [ ] AC-021: 인쇄 특화 RULE-1~8 보존 -- PASS

### Definition of Done (전체 완료)

- [ ] AC-022: 전체 컴포넌트 re-export (27개) -- PASS
- [ ] AC-023: Vitest 유닛 테스트 커버리지 >= 85% -- PASS
- [ ] 모든 Sprint의 Definition of Done 충족
- [ ] @MX 태그 주석 포함

---

## 7. 검증 방법

| AC | 검증 방법 | 도구 |
|----|----------|------|
| AC-001 | CSS 파일 구조 및 변수 존재 검사 | Grep, Read |
| AC-002 | 시맨틱 토큰 카테고리별 카운트 및 참조 검사 | Grep `--huni-bg-*`, `--huni-fg-*`, `--huni-stroke-*` |
| AC-003 | 기존 컴포넌트 렌더링 비교 + 유틸리티 파일 존재 확인 | 브라우저 육안 검증, Grep |
| AC-004~010 | Slot 서브컴포넌트 export 확인 + data-* attribute + variant/size/state 렌더링 | Vitest + @testing-library/react |
| AC-011~014 | Slot 서브컴포넌트 export 확인 + Field context 통합 + autoresize | Vitest + @testing-library/react |
| AC-015 | lazyMount/unmountOnExit DOM 검사 + 애니메이션 + 포커스 트랩 | Vitest + @testing-library/react |
| AC-016 | useSnackbar() hook + queue FIFO + 자동 닫힘 + SnackbarRegion | Vitest + @testing-library/react |
| AC-017 | Compound Component dot notation export 검사 | Grep patterns in components |
| AC-018 | data-* attribute DOM 출력 검사 | @testing-library/react `getByTestId` + attribute check |
| AC-019 | createSlotRecipeContext 사용 여부 + CVA slot recipe 구조 검사 | Grep, 코드 리뷰 |
| AC-020 | 키보드 네비게이션 및 ARIA 속성 검사 | @testing-library/react, 수동 키보드 테스트 |
| AC-021 | 기존 인쇄 옵션 페이지 정상 동작 확인 | 브라우저 수동 테스트 |
| AC-022 | index.js re-export 완전성 검사 (27개) | `import { ... } from` 테스트, Grep export |
| AC-023 | 테스트 커버리지 측정 | `vitest --coverage` |
