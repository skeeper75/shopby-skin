# Component Composition — 후니프린팅 디자인시스템

shadcn/ui 스타일의 Compound Component, asChild(Slot), forwardRef, Context 패턴.

---

## 1. Compound Component 패턴

shadcn/ui처럼 하나의 컴포넌트를 여러 하위 컴포넌트로 구성:

### OptionGroup Compound Component

현재 구조 (`OptionGroup.tsx`):
```tsx
// 단순한 div 래퍼
function OptionGroup({ label, children }) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  );
}
```

shadcn/ui 스타일 Compound 구조:

```tsx
'use client';

import { createContext, useContext } from 'react';

// 1. Context 정의
interface OptionGroupContextValue {
  disabled: boolean;
  selectedValue: unknown;
  onChange: (value: unknown) => void;
}

const OptionGroupContext = createContext<OptionGroupContextValue | null>(null);

function useOptionGroupContext() {
  const ctx = useContext(OptionGroupContext);
  if (!ctx) throw new Error('OptionGroup.* must be used inside <OptionGroup>');
  return ctx;
}

// 2. Root 컴포넌트
function OptionGroupRoot({
  children,
  disabled = false,
  selectedValue,
  onChange,
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  selectedValue: unknown;
  onChange: (value: unknown) => void;
  className?: string;
}) {
  return (
    <OptionGroupContext.Provider value={{ disabled, selectedValue, onChange }}>
      <div className={cn('space-y-2 py-2', className)}>
        {children}
      </div>
    </OptionGroupContext.Provider>
  );
}

// 3. Label 서브컴포넌트
function OptionGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'flex items-center h-[40px] px-5',
      'text-base font-medium text-[#424242] font-[Noto_Sans]',
      className
    )}>
      {children}
    </div>
  );
}

// 4. Content 서브컴포넌트
function OptionGroupContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2 px-5', className)}>
      {children}
    </div>
  );
}

// 5. Button 서브컴포넌트 (Context 자동 소비)
function OptionGroupButton({ value, label }: { value: number; label: string }) {
  const { disabled, selectedValue, onChange } = useOptionGroupContext();
  const isSelected = selectedValue === value;
  return (
    <OptionButton
      label={label}
      selected={isSelected}
      onClick={() => onChange(value)}
      disabled={disabled}
    />
  );
}

// 6. Namespace export (shadcn/ui 스타일)
export const OptionGroup = {
  Root: OptionGroupRoot,
  Label: OptionGroupLabel,
  Content: OptionGroupContent,
  Button: OptionGroupButton,
};
```

**사용 예시:**
```tsx
<OptionGroup.Root selectedValue={selectedSize} onChange={setSelectedSize}>
  <OptionGroup.Label>사이즈 선택</OptionGroup.Label>
  <OptionGroup.Content>
    <OptionGroup.Button value={1} label="A4" />
    <OptionGroup.Button value={2} label="A5" />
    <OptionGroup.Button value={3} label="B5" />
  </OptionGroup.Content>
</OptionGroup.Root>
```

---

## 2. forwardRef 패턴 (Radix 통합 필수)

Radix primitives는 내부적으로 ref를 사용. 커스텀 컴포넌트가 ref를 받으려면 `forwardRef` 필요.

```tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { optionButtonVariants, type OptionButtonVariants } from './option-button.variants';

export interface OptionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    OptionButtonVariants {
  label: string;
  selected?: boolean;
}

// forwardRef로 ref 전달 (Radix asChild 패턴과 호환)
export const OptionButton = React.forwardRef<HTMLButtonElement, OptionButtonProps>(
  ({ label, selected = false, state, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          optionButtonVariants({ state: selected ? 'selected' : (state ?? 'default') }),
          disabled && 'opacity-40 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {label}
      </button>
    );
  }
);

OptionButton.displayName = 'OptionButton';
```

**forwardRef 필요 상황:**
- Radix의 `asChild` prop에서 사용되는 컴포넌트
- 부모에서 DOM ref 접근이 필요한 경우 (포커스 제어 등)
- Radix primitive의 Trigger에 custom 컴포넌트를 전달할 때

---

## 3. asChild / Slot 패턴

`@radix-ui/react-slot`의 `Slot`은 children을 "프록시"하여 className과 props를 병합:

```tsx
import { Slot } from '@radix-ui/react-slot';

// asChild = false (기본): <button> 렌더링
<OrderCTA variant="design">디자인 제작하기</OrderCTA>
// → <button class="...huni-cta-classes...">디자인 제작하기</button>

// asChild = true: children 요소로 렌더링 (class 병합)
<OrderCTA variant="cart" asChild>
  <Link href="/cart">장바구니 담기</Link>
</OrderCTA>
// → <a href="/cart" class="...huni-cta-classes...">장바구니 담기</a>
```

**구현:**
```tsx
function OrderCTA({ asChild = false, variant, children, className, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(ctaButtonVariants({ variant }), className)} {...props}>
      {children}
    </Comp>
  );
}
```

**주의사항:**
- `asChild` children은 반드시 단일 React element
- children의 onClick과 Comp의 onClick은 자동 병합됨
- ref도 자동 전달됨

---

## 4. 그룹 상태 패턴 (FinishTitleBar + 후가공 옵션)

FinishTitleBar의 열기/닫기 상태를 자식 컴포넌트가 공유:

```tsx
'use client';

import { createContext, useContext, useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';

interface FinishSectionContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const FinishSectionContext = createContext<FinishSectionContextValue | null>(null);

export function FinishSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <FinishSectionContext.Provider value={{ isOpen, toggle: () => setIsOpen((v) => !v) }}>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <FinishTitleBar title={title} />
        <Collapsible.Content>
          <div className="space-y-4 px-5 py-3">
            {children}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </FinishSectionContext.Provider>
  );
}

// FinishSection 내부 어디서든 열기/닫기 접근
function FinishTitleBar({ title }: { title: string }) {
  const { isOpen } = useContext(FinishSectionContext)!;
  return (
    <div className="w-[466px] h-[50px] bg-[#F5F5F5] flex items-center justify-between px-4">
      <span className="text-[13px] font-semibold text-[#424242]">{title}</span>
      <Collapsible.Trigger className="text-xs text-[#553886] hover:underline">
        {isOpen ? '닫기' : '열기'}
      </Collapsible.Trigger>
    </div>
  );
}
```

---

## 5. 가격 미리보기 Hover 상태 패턴 (FR-004)

OptionButton hover 시 가격 변화량을 Badge로 표시하는 패턴:

```tsx
// 현재 구현 패턴 (OptionRenderer.tsx)
// 상태: hoveredValue, hoverDelta, hoverLoading를 부모에서 관리

// shadcn 스타일로 리팩토링 시:
interface PricePreviewContextValue {
  hoveredValue: number | null;
  hoverDelta: number | null;
  hoverLoading: boolean;
  onHover: (value: number) => void;
  onLeave: () => void;
}

const PricePreviewContext = createContext<PricePreviewContextValue | null>(null);

// OptionGroup.Root에 통합:
function OptionGroupRoot({ ..., enablePricePreview = false }) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoverDelta, setHoverDelta] = useState<number | null>(null);
  const [hoverLoading, setHoverLoading] = useState(false);

  // 가격 미리보기 fetch 로직 (Radix Tooltip 통합 가능)
  const handleHover = useCallback(async (value: number) => {
    setHoveredValue(value);
    setHoverLoading(true);
    // ... fetch price delta
    setHoverLoading(false);
  }, []);

  return (
    <PricePreviewContext.Provider value={{ hoveredValue, hoverDelta, hoverLoading, onHover: handleHover, onLeave: () => setHoveredValue(null) }}>
      {/* ... */}
    </PricePreviewContext.Provider>
  );
}
```

---

## 6. displayName 규칙

Compound component의 각 부분에 `displayName` 설정 (React DevTools + 에러 메시지 개선):

```tsx
OptionGroupRoot.displayName = 'OptionGroup';
OptionGroupLabel.displayName = 'OptionGroup.Label';
OptionGroupContent.displayName = 'OptionGroup.Content';
OptionGroupButton.displayName = 'OptionGroup.Button';
```

---

## 7. 배럴 Export 패턴

```tsx
// src/components/quote/index.ts
export { OptionButton } from './OptionButton';
export type { OptionButtonProps } from './OptionButton';
export { optionButtonVariants } from './option-button.variants';
export type { OptionButtonVariants } from './option-button.variants';

export { FinishButton } from './FinishButton';
export { ColorChip } from './ColorChip';
export { CounterInput } from './CounterInput';
// ... 나머지 컴포넌트

// src/components/ui/index.ts
export { HuniCustomSelect } from './huni-select';
export type { HuniSelectOption } from './huni-select';
```

---

## 패턴 선택 기준

| 상황 | 패턴 |
|---|---|
| 단순 props 전달 | 일반 함수 컴포넌트 |
| 여러 하위 컴포넌트가 상태 공유 | Compound Component + Context |
| Radix primitive Trigger에 커스텀 컴포넌트 | forwardRef |
| button/a/Link 유연하게 교체 | asChild + Slot |
| 열기/닫기 컨테이너 | Radix Collapsible |
| 단일 선택 버튼 그룹 | Radix RadioGroup 또는 ToggleGroup |

---

Version: 1.0.0
Created: 2026-03-05
Reference: shadcn/ui 소스 + Radix primitives 문서
