# CVA Patterns — 후니프린팅 디자인시스템

`class-variance-authority`(cva)를 사용한 후니 컴포넌트 variant 정의 가이드.

> **cva 설치 확인**: `"class-variance-authority": "^0.7.1"` — 이미 설치됨 (package.json)

---

## 기본 원칙

후니 디자인시스템의 cva 사용 원칙:

1. **Figma 픽셀값은 base 클래스에 고정** — w-[155px], h-[50px] 등은 variant 없음 (디자인 스펙 불변)
2. **variants는 state 중심** — selected/default/disabled (size variant 없음, Figma가 고정)
3. **VariantProps 타입 반드시 추출** — TypeScript 자동완성 지원
4. **cn() 병합 필수** — 런타임 동적 클래스와 합칠 때 cva 결과를 cn()에 전달

---

## 유틸리티 함수

```tsx
// src/lib/utils.ts (이미 존재)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

cva import:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
```

---

## 컴포넌트별 CVA Variant 정의

### 1. OptionButton (ButtonType) — 155×50px

```tsx
export const optionButtonVariants = cva(
  // base: Figma 픽셀 고정값 + 공통 스타일
  [
    'inline-flex items-center justify-center',
    'w-[155px] h-[50px] rounded-[4px] border',
    'text-sm font-[Noto_Sans] tracking-[-0.05em]',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553886] focus-visible:ring-offset-1',
  ],
  {
    variants: {
      state: {
        default: 'bg-white border border-[#CACACA] text-[#979797] hover:border-[#553886] hover:text-[#553886]',
        selected: 'bg-white border-2 border-[#553886] text-[#553886]', // RULE-2: 흰 배경 + 색상 테두리
        disabled: 'bg-white border border-[#CACACA] text-[#979797] opacity-40 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export type OptionButtonVariants = VariantProps<typeof optionButtonVariants>;
```

**사용 예시:**
```tsx
<button
  className={cn(optionButtonVariants({ state: selected ? 'selected' : 'default' }))}
  disabled={disabled}
>
  {label}
</button>
```

---

### 2. FinishButton (FinishButtonType) — 116×50px

OptionButton보다 좁고, 폰트가 12px.

```tsx
export const finishButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'w-[116px] h-[50px] rounded-[4px] border',
    'text-xs font-[Noto_Sans] tracking-[-0.05em]',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553886] focus-visible:ring-offset-1',
  ],
  {
    variants: {
      state: {
        default: 'bg-white border border-[#CACACA] text-[#979797]',
        selected: 'bg-white border-2 border-[#553886] text-[#553886] font-semibold', // RULE-2
        disabled: 'bg-white border border-[#CACACA] text-[#979797] opacity-40 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export type FinishButtonVariants = VariantProps<typeof finishButtonVariants>;
```

---

### 3. HuniSelectTrigger (PaperDropdown + FinishSelect 공통) — size variant

PaperDropdown(348×50px) vs FinishSelect(461×50px)는 너비만 다름.

```tsx
export const huniSelectTriggerVariants = cva(
  [
    'relative flex items-center',
    'border rounded-[4px] bg-white',
    'h-[50px] cursor-pointer',
    'font-[Noto_Sans] text-sm text-[#424242]',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553886]',
  ],
  {
    variants: {
      size: {
        paper: 'w-[348px]',   // PaperDropdown (지질 선택)
        finish: 'w-[461px]',  // FinishSelect (엽서봉투 등)
        full: 'w-full',       // 반응형 확장용
      },
      state: {
        default: 'border-[#CACACA]',
        open: 'border-[#553886] border-2',
        disabled: 'border-[#CACACA] opacity-40 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'paper',
      state: 'default',
    },
  }
);

export const huniSelectItemVariants = cva(
  [
    'flex items-center px-4 py-2',
    'text-sm font-[Noto_Sans] text-[#424242]',
    'cursor-pointer transition-colors duration-100',
    'focus:outline-none',
  ],
  {
    variants: {
      state: {
        default: 'hover:bg-[#F5F5F5]',
        highlighted: 'bg-[#F5F5F5]',    // Radix data-[highlighted] 상태
        selected: 'text-[#553886] bg-[#F5F5F5]',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);
```

---

### 4. CounterInput Parts — 3분할 구조

CounterInput은 [minus 34px][value 155px][plus 34px] × 50px.

```tsx
export const counterButtonVariants = cva(
  [
    'flex items-center justify-center',
    'w-[34px] h-full',
    'font-[Noto_Sans] text-lg text-[#424242]',
    'transition-colors duration-100',
    'focus-visible:outline-none focus-visible:bg-[#F5F5F5]',
    'select-none', // RULE-3: 직사각형 (rounded 없음!)
  ],
  {
    variants: {
      action: {
        minus: 'hover:bg-[#F5F5F5] active:bg-[#E8E8E8]',
        plus: 'hover:bg-[#F5F5F5] active:bg-[#E8E8E8]',
      },
      disabled: {
        true: 'opacity-40 cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      action: 'plus',
      disabled: false,
    },
  }
);

export const counterContainerVariants = cva(
  [
    'flex items-center',
    'w-[223px] h-[50px]',
    'border border-[#CACACA] rounded-[4px] bg-white',
    'overflow-hidden', // 내부 divider 클리핑
  ],
  {}
);
```

---

### 5. ColorChip — 50×50 원형 (RULE-4)

```tsx
export const colorChipVariants = cva(
  [
    'w-[50px] h-[50px] rounded-full',  // RULE-4: 반드시 50×50 + 원형
    'border-2 transition-all duration-150',
    'cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#553886]',
  ],
  {
    variants: {
      state: {
        default: 'border-transparent hover:border-[#CACACA]',
        selected: 'border-[#553886]',  // RULE-2 + RULE-4 조합
        disabled: 'opacity-40 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);
```

---

### 6. OrderCTA (Upload/Design/Cart 버튼) — 465×50px

3가지 variant: upload(흰 배경+보라 테두리), design(보라 배경), cart(다크 배경).

```tsx
export const ctaButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'w-[465px] h-[50px] rounded-[5px]',  // CTA는 radius 5px (다른 컴포넌트는 4px)
    'text-sm font-semibold font-[Noto_Sans]',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        upload: [
          'bg-white border border-[#553886] text-[#553886]',
          'hover:bg-[#F5F5F5]',
          'focus-visible:ring-[#553886]',
        ],
        design: [
          'bg-[#553886] text-white border-transparent',
          'hover:bg-[#3B2573]',
          'focus-visible:ring-[#553886]',
        ],
        cart: [
          'bg-[#3B2573] text-white border-transparent',
          'hover:bg-[#2A1A5E]',
          'focus-visible:ring-[#3B2573]',
        ],
      },
      disabled: {
        true: 'opacity-40 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'design',
      disabled: false,
    },
  }
);

export type CtaButtonVariants = VariantProps<typeof ctaButtonVariants>;
```

---

### 7. FinishInput — 치수 입력 (140×50px)

```tsx
export const finishInputContainerVariants = cva(
  [
    'flex flex-col gap-1',
  ],
  {}
);

export const finishInputFieldVariants = cva(
  [
    'w-[140px] h-[50px] rounded-[4px] border px-3',
    'font-[Noto_Sans] text-sm text-[#424242]',
    'placeholder:text-[#CACACA]',
    'transition-colors duration-150',
    'focus:outline-none focus:border-[#553886] focus:ring-1 focus:ring-[#553886]',
  ],
  {
    variants: {
      state: {
        default: 'border-[#CACACA]',
        focused: 'border-[#553886] ring-1 ring-[#553886]',
        disabled: 'border-[#CACACA] bg-[#F5F5F5] opacity-40 cursor-not-allowed',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);
```

---

## Compound Variants 패턴

여러 variant 조합에 대한 특별 클래스:

```tsx
// 예: selected이면서 disabled인 경우 (드문 상황)
export const optionButtonVariants = cva(
  [...baseClasses],
  {
    variants: {
      state: { default: '...', selected: '...', disabled: '...' },
      loading: { true: 'animate-pulse', false: '' },
    },
    compoundVariants: [
      // selected + loading 조합
      {
        state: 'selected',
        loading: true,
        className: 'border-2 border-[#553886] opacity-70 animate-pulse',
      },
    ],
    defaultVariants: { state: 'default', loading: false },
  }
);
```

---

## 전체 variants export 파일 구조

신규 컴포넌트에서는 아래 구조로 variants를 별도 파일에 분리:

```
src/components/quote/
├── OptionButton.tsx              — 컴포넌트 구현
├── option-button.variants.ts     — cva 정의 (선택적 분리)
└── index.ts                      — barrel export
```

또는 단일 파일에 함께:

```tsx
// OptionButton.tsx 내부 구조
// 1. variants 정의 (상단)
export const optionButtonVariants = cva(...);
export type OptionButtonVariants = VariantProps<typeof optionButtonVariants>;

// 2. Props 타입 (variants + HTML props)
export interface OptionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    OptionButtonVariants {
  label: string;
  selected?: boolean;
}

// 3. 컴포넌트 구현 (하단)
export function OptionButton({ label, selected, state, className, ...props }: OptionButtonProps) {
  return (
    <button
      className={cn(optionButtonVariants({ state: selected ? 'selected' : (state ?? 'default') }), className)}
      {...props}
    >
      {label}
    </button>
  );
}
```

---

Version: 1.0.0
Created: 2026-03-05
Source: Sequential Thinking MCP analysis + Figma REST API tokens
