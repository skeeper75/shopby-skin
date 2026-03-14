# Radix UI Integration — 후니프린팅 디자인시스템

후니 10개 컴포넌트에 Radix UI primitives를 통합하는 가이드.
Radix = 접근성 + 키보드 행동 레이어 / Tailwind+cva = 시각 레이어.

---

## 현재 설치 상태

```json
// package.json (현재)
"@radix-ui/react-tabs": "^1.1.13",
"@radix-ui/react-tooltip": "^1.2.8"
```

**추가 설치 필요:**
```bash
npm install @radix-ui/react-select @radix-ui/react-toggle @radix-ui/react-radio-group @radix-ui/react-collapsible @radix-ui/react-slot
```

---

## 컴포넌트 → Radix Primitive 매핑표

| 후니 컴포넌트 | 파일 | Radix Primitive | 접근성 이점 |
|---|---|---|---|
| OptionButton | `OptionButton.tsx` | `@radix-ui/react-toggle` | aria-pressed, keyboard toggle |
| PaperDropdown | `PaperDropdown.tsx` | `@radix-ui/react-select` | 완전한 select 접근성, ↑↓ 키 |
| FinishSelect | `FinishSelect.tsx` | `@radix-ui/react-select` | 동상 |
| FinishButton | `FinishButton.tsx` | `@radix-ui/react-toggle` | 동상 OptionButton |
| ColorChip | `ColorChip.tsx` | `@radix-ui/react-radio-group` | 단일 선택 radio 행동 |
| FinishTitleBar | `FinishTitleBar.tsx` | `@radix-ui/react-collapsible` | aria-expanded, 애니메이션 |
| OrderCTA | `OrderCTA.tsx` | `@radix-ui/react-slot` (asChild) | Next.js Link 호환 |
| CounterInput | `CounterInput.tsx` | 커스텀 (Radix 없음) | role="spinbutton" 직접 구현 |
| FinishInput | `FinishInput.tsx` | `@radix-ui/react-label` | htmlFor 연결 |
| PriceResult | `PriceResult.tsx` | 없음 (표시 전용) | aria-live="polite" 직접 추가 |

---

## 1. HuniCustomSelect — Radix Select 완전 재구현

현재 `src/components/ui/huni-select.tsx`는 DIV 기반 커스텀 구현.
아래는 `@radix-ui/react-select`로 마이그레이션한 버전:

```tsx
'use client';

import * as Select from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { huniSelectTriggerVariants, huniSelectItemVariants } from './huni-select.variants';

export interface HuniSelectOption {
  value: number;
  label: string;
  recommended?: boolean;
}

interface HuniCustomSelectProps {
  options: HuniSelectOption[];
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  size?: 'paper' | 'finish' | 'full'; // cva size variant
}

export function HuniCustomSelect({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  ariaLabel,
  size = 'paper',
}: HuniCustomSelectProps): React.JSX.Element {
  return (
    <Select.Root
      value={value !== undefined ? String(value) : undefined}
      onValueChange={(v) => onChange(Number(v))}
      disabled={disabled}
    >
      {/* Trigger: 드롭다운 토글 버튼 */}
      <Select.Trigger
        className={cn(huniSelectTriggerVariants({ size }))}
        aria-label={ariaLabel}
      >
        <span className="flex-1 pl-4 text-left truncate">
          <Select.Value placeholder={placeholder} />
        </span>
        {/* RULE-1: ▼ 텍스트 문자 사용 (ChevronDown 아이콘 금지) */}
        <span className="pr-4 text-xs text-[#979797] select-none" aria-hidden="true">▼</span>
      </Select.Trigger>

      {/* Portal: body에 렌더링 (z-index 문제 없음) */}
      <Select.Portal>
        <Select.Content
          className={cn(
            'bg-white border border-[#CACACA] rounded-[4px] shadow-md',
            'z-50 overflow-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            size === 'paper' && 'w-[348px]',
            size === 'finish' && 'w-[461px]',
          )}
          position="popper"
          sideOffset={2}
        >
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={String(opt.value)}
                className={cn(
                  huniSelectItemVariants({ state: 'default' }),
                  'data-[highlighted]:bg-[#F5F5F5] data-[highlighted]:outline-none',
                  'data-[state=checked]:text-[#553886]',
                )}
              >
                <Select.ItemText>
                  {opt.label}
                  {opt.recommended && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-[#FF66CC] text-white rounded-sm">
                      추천
                    </span>
                  )}
                </Select.ItemText>
                {/* 선택된 항목 체크 표시 (선택적) */}
                <Select.ItemIndicator className="absolute right-3">
                  <span className="text-[#553886] text-xs">✓</span>
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

**접근성 자동 지원:**
- ↑↓ 키: 옵션 탐색
- Enter/Space: 선택
- Escape: 닫기
- Type-ahead: 첫 글자로 빠른 탐색
- `aria-expanded`, `aria-activedescendant` 자동 관리
- 포커스 트랩: 열린 상태에서 Tab은 옵션 내에서만

---

## 2. OptionButton — Radix Toggle

```tsx
'use client';

import * as Toggle from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';
import { optionButtonVariants } from './option-button.variants';

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function OptionButton({
  label, selected, onClick, disabled = false, onMouseEnter, onMouseLeave,
}: OptionButtonProps): React.JSX.Element {
  return (
    <Toggle.Root
      pressed={selected}
      onPressedChange={() => !disabled && onClick()}
      disabled={disabled}
      className={cn(
        optionButtonVariants({ state: selected ? 'selected' : 'default' }),
        disabled && 'opacity-40 cursor-not-allowed',
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={label}
    >
      {label}
    </Toggle.Root>
  );
}
```

**Radix Toggle 이점:**
- `aria-pressed` 자동 설정 (selected 상태 시각 장애인에게도 전달)
- 키보드: Space/Enter로 토글
- 기존 onClick API 100% 호환

---

## 3. ColorChip — Radix RadioGroup

단일 선택 색상칩은 radio 행동이 정확함.

```tsx
'use client';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';
import { colorChipVariants } from './color-chip.variants';

interface ColorChipOption {
  value: number;
  label: string;
  colorCode?: string;
  isHologram?: boolean;
}

interface ColorChipProps {
  options: ColorChipOption[];
  selectedValue: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  groupLabel?: string;
}

export function ColorChip({
  options, selectedValue, onChange, disabled = false, groupLabel = '색상 선택',
}: ColorChipProps): React.JSX.Element {
  return (
    <RadioGroup.Root
      value={selectedValue !== null ? String(selectedValue) : undefined}
      onValueChange={(v) => onChange(Number(v))}
      disabled={disabled}
      aria-label={groupLabel}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => (
        <RadioGroup.Item
          key={opt.value}
          value={String(opt.value)}
          disabled={disabled}
          aria-label={opt.label}
          className={cn(
            colorChipVariants({
              state: selectedValue === opt.value ? 'selected' : 'default',
            }),
            // 홀로그램: 무지개 그라디언트 오버레이
            opt.isHologram && 'bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200',
          )}
          style={!opt.isHologram ? { backgroundColor: opt.colorCode ?? '#CACACA' } : undefined}
        >
          {/* RadioGroup.Indicator: 선택 시 표시 (RULE-4: 외부 border로 표현) */}
          <RadioGroup.Indicator className="hidden" />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
```

**Radix RadioGroup 이점:**
- ↑↓/←→ 화살표 키로 색상 탐색
- `role="radio"`, `aria-checked` 자동
- 그룹 label 연결

---

## 4. FinishTitleBar — Radix Collapsible

```tsx
'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';

interface FinishTitleBarProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function FinishTitleBar({
  title, isOpen, onToggle, children,
}: FinishTitleBarProps): React.JSX.Element {
  return (
    <Collapsible.Root open={isOpen} onOpenChange={onToggle}>
      <div className="w-[466px] h-[50px] bg-[#F5F5F5] flex items-center justify-between px-4">
        <span className="text-[13px] font-semibold text-[#424242] font-[Noto_Sans]">{title}</span>
        <Collapsible.Trigger asChild>
          <button
            className="text-xs text-[#553886] font-[Noto_Sans] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#553886]"
            aria-label={isOpen ? '후가공 닫기' : '후가공 열기'}
          >
            {isOpen ? '닫기' : '열기'}
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-collapsible-down',
          'data-[state=closed]:animate-collapsible-up',
        )}
      >
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

**tailwind.config.ts 애니메이션 추가 (선택적):**
```ts
// tailwind.config.ts
animation: {
  'collapsible-down': 'collapsible-down 0.15s ease-out',
  'collapsible-up': 'collapsible-up 0.15s ease-out',
},
keyframes: {
  'collapsible-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-collapsible-content-height)' },
  },
  'collapsible-up': {
    from: { height: 'var(--radix-collapsible-content-height)' },
    to: { height: '0' },
  },
},
```

---

## 5. OrderCTA — Radix Slot (asChild)

```tsx
'use client';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { ctaButtonVariants, type CtaButtonVariants } from './cta.variants';

interface OrderCTAProps extends CtaButtonVariants {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function OrderCTA({
  asChild = false,
  variant = 'design',
  disabled = false,
  className,
  children,
  ...props
}: OrderCTAProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(ctaButtonVariants({ variant, disabled }), className)}
      disabled={!asChild ? disabled : undefined}
      {...props}
    >
      {children}
    </Comp>
  );
}
```

**asChild 사용 예시 (Next.js Link 호환):**
```tsx
// button으로 렌더링
<OrderCTA variant="design" onClick={handleDesign}>디자인 제작하기</OrderCTA>

// Next.js Link로 렌더링 (a 태그)
<OrderCTA variant="cart" asChild>
  <Link href="/cart">장바구니 담기</Link>
</OrderCTA>
```

---

## 6. CounterInput — 커스텀 접근성

Radix에 NumberInput primitive 없음. 직접 `role="spinbutton"` 구현:

```tsx
<div
  role="group"
  aria-label="수량 입력"
  className={counterContainerVariants()}
>
  <button
    role="button"
    aria-label="수량 감소"
    onClick={handleDecrement}
    disabled={disabled || value <= min}
    className={counterButtonVariants({ action: 'minus', disabled: disabled || value <= min })}
  >
    −
  </button>

  {/* 구분선 */}
  <div className="w-px h-full bg-[#CACACA]" aria-hidden="true" />

  <input
    type="number"
    role="spinbutton"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-label="수량"
    value={value}
    onChange={(e) => handleChange(Number(e.target.value))}
    className="w-[155px] h-full text-center text-sm font-medium text-[#979797] font-[Noto_Sans] border-none outline-none bg-transparent"
    disabled={disabled}
  />

  {/* 구분선 */}
  <div className="w-px h-full bg-[#CACACA]" aria-hidden="true" />

  <button
    role="button"
    aria-label="수량 증가"
    onClick={handleIncrement}
    disabled={disabled || value >= max}
    className={counterButtonVariants({ action: 'plus', disabled: disabled || value >= max })}
  >
    +
  </button>
</div>
```

---

## 접근성 체크리스트

신규 컴포넌트 구현 시 확인:

- [ ] 키보드만으로 완전 조작 가능 (Tab, Enter, Space, Escape, ↑↓)
- [ ] `aria-label` 또는 연결된 `label` 존재
- [ ] 포커스 시 outline 표시 (`focus-visible:ring-2 focus-visible:ring-[#553886]`)
- [ ] 비활성화 상태: `disabled` prop + `aria-disabled="true"`
- [ ] 동적 콘텐츠: `aria-live="polite"` (가격 변경 등)
- [ ] 색상만으로 정보 전달 금지 (텍스트/아이콘 함께)
- [ ] WCAG 2.1 AA 대비율: #553886 on #FFFFFF = 7.2:1 (AAA 통과)

---

Version: 1.0.0
Created: 2026-03-05
Radix UI docs: https://www.radix-ui.com/primitives
