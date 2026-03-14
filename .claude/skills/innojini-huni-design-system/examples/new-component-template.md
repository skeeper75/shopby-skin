# New Component Template — 후니프린팅 디자인시스템

후니 디자인시스템에 새 컴포넌트를 추가할 때 따라야 할 단계별 템플릿.

---

## 체크리스트 (생성 전)

- [ ] Figma에서 해당 컴포넌트의 치수, 색상, 상태를 REST API로 확인
- [ ] 기존 10개 컴포넌트 중 재사용 가능한 것이 있는지 확인
- [ ] Radix primitive가 적합한지 확인 (`references/radix-integration.md`)
- [ ] RULE-1~4 위반 가능성 확인

---

## 파일 구조

```
src/components/quote/
├── MyNewComponent.tsx          — 메인 구현 파일
└── my-new-component.variants.ts — cva 정의 (100줄 이상 시 분리)

src/components/ui/              — 재사용 공유 컴포넌트만
└── (필요 시 추가)
```

---

## Step 1: variants 파일 생성

```ts
// src/components/quote/my-new-component.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

// [RULE] Figma 픽셀값은 base에 하드코딩, variant는 state만
export const myNewComponentVariants = cva(
  // base: 공통 클래스 (Figma 픽셀 고정)
  [
    'inline-flex items-center justify-center',
    'w-[???px] h-[50px] rounded-[4px] border', // Figma 치수 확인 필수
    'font-[Noto_Sans] text-sm tracking-[-0.05em]',
    'transition-colors duration-150',
    // 접근성: focus-visible 필수
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553886] focus-visible:ring-offset-1',
  ],
  {
    variants: {
      state: {
        // 후니 디자인시스템 3가지 상태
        default: 'bg-white border-[#CACACA] text-[#979797]',
        selected: 'bg-white border-2 border-[#553886] text-[#553886]', // RULE-2 필수
        disabled: 'bg-white border-[#CACACA] text-[#979797] opacity-40 cursor-not-allowed pointer-events-none',
      },
      // 필요 시 추가 variant (크기 변형이 Figma에 있는 경우만)
      // size: { sm: '...', md: '...' },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

// TypeScript 자동완성을 위한 타입 export
export type MyNewComponentVariants = VariantProps<typeof myNewComponentVariants>;
```

---

## Step 2: 컴포넌트 파일 생성

```tsx
// src/components/quote/MyNewComponent.tsx
'use client';

/**
 * MyNewComponent — [컴포넌트 목적 한 줄 설명]
 * SPEC-XX-XXX [REQ ID]
 *
 * @MX:NOTE: [AUTO] [Figma 컴포넌트명] — [핵심 제약사항]
 * @MX:SPEC: SPEC-XX-XXX
 */

// 1. Import 순서: React → Radix → utils → variants → types
import React from 'react';
// Radix (해당 시): import * as Toggle from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';
import { myNewComponentVariants, type MyNewComponentVariants } from './my-new-component.variants';

// 2. Props 인터페이스: HTML 속성 + Variant + 커스텀
export interface MyNewComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, // 또는 적절한 HTML 요소
    MyNewComponentVariants {
  // 커스텀 props
  label: string;
  selected?: boolean;
  // asChild 패턴 필요 시:
  // asChild?: boolean;
}

// 3. 구현: forwardRef (Radix 통합 또는 외부 ref 접근 시 필수)
export const MyNewComponent = React.forwardRef<HTMLButtonElement, MyNewComponentProps>(
  (
    {
      label,
      selected = false,
      state,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // state prop이 없으면 selected에서 자동 계산
    const resolvedState = state ?? (selected ? 'selected' : 'default');

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          myNewComponentVariants({ state: resolvedState }),
          disabled && 'opacity-40 cursor-not-allowed',
          className, // 외부에서 className override 허용
        )}
        aria-pressed={selected} // 토글 버튼의 경우
        aria-label={label}      // 시각적 label 없으면 필수
        {...props}
      >
        {label}
      </button>
    );
  }
);

// React DevTools + 에러 메시지 개선
MyNewComponent.displayName = 'MyNewComponent';
```

---

## Step 3: Radix 통합 (해당 시)

`references/radix-integration.md`에서 적합한 primitive 선택 후 적용:

```tsx
// Toggle 버튼 예시
import * as Toggle from '@radix-ui/react-toggle';

// button 대신 Toggle.Root 사용:
export const MyNewComponent = React.forwardRef<HTMLButtonElement, MyNewComponentProps>(
  ({ label, selected = false, className, disabled, ...props }, ref) => {
    return (
      <Toggle.Root
        ref={ref}
        pressed={selected}
        onPressedChange={props.onClick as () => void} // 타입 조정 필요
        disabled={disabled}
        className={cn(myNewComponentVariants({ state: selected ? 'selected' : 'default' }), className)}
        {...props}
      >
        {label}
      </Toggle.Root>
    );
  }
);
```

---

## Step 4: MX 태그 추가

```tsx
// 컴포넌트 파일 상단 (JSDoc 아래):

// fan_in이 3+ 이상인 경우 (여러 곳에서 import):
// @MX:ANCHOR: [컴포넌트명] — [불변 계약 설명]

// 위험 패턴 (복잡한 상태 로직, side effect 등):
// @MX:WARN: [경고 내용]
// @MX:REASON: [이유]

// 일반 주석:
// @MX:NOTE: [AUTO] [컴포넌트명] — [핵심 제약사항]
```

---

## Step 5: 배럴 export 추가

```ts
// src/components/quote/index.ts (없으면 생성)
export { MyNewComponent } from './MyNewComponent';
export type { MyNewComponentProps } from './MyNewComponent';
export { myNewComponentVariants } from './my-new-component.variants';
export type { MyNewComponentVariants } from './my-new-component.variants';
```

---

## Step 6: 디자인 토큰 검증

```bash
bash .claude/skills/huni-design-system/scripts/verify-design-tokens.sh
```

새 컴포넌트 검증 항목 추가 필요 시 스크립트에 `check_dimension` 호출 추가:
```bash
check_dimension "$QUOTE_DIR/MyNewComponent.tsx" "w-\\[???px\\]" "MyNewComponent width ???px"
check_dimension "$QUOTE_DIR/MyNewComponent.tsx" "h-\\[50px\\]"  "MyNewComponent height 50px"
```

---

## 금지 패턴

```tsx
// RULE-1: native select 금지
<select>...</select>  // ❌ → HuniCustomSelect 사용

// RULE-2: selected state 색상 배경 금지
className="bg-[#553886] text-white"  // ❌ → bg-white border-2 border-[#553886]

// RULE-3: CounterInput 계열 rounded-full 금지
className="rounded-full"  // ❌ → rounded-[4px]

// RULE-4: ColorChip 계열 32px 금지
className="w-8 h-8"  // ❌ → w-[50px] h-[50px]

// 잘못된 색상값
#5538b6  // ❌ → #553886 (primary)
#351D87  // ❌ → #3B2573 (dark)
```

---

## 완전한 예시: HuniBadge 신규 추가

```tsx
// src/components/ui/huni-badge.tsx
'use client';

/**
 * HuniBadge — 추천/프리미엄 배지
 * @MX:NOTE: [AUTO] HuniBadge — #FF66CC 고정 (Figma 토큰)
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-sm text-white text-[10px] font-[Noto_Sans]',
  {
    variants: {
      variant: {
        popular: 'bg-[#FF66CC] w-[32px] h-[14px]',   // Figma: 32×14px, #FF66CC
        premium: 'bg-[#553886] px-1.5 py-0.5',        // 프리미엄 배지
      },
    },
    defaultVariants: { variant: 'popular' },
  }
);

export interface HuniBadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
}

export function HuniBadge({ variant = 'popular', className }: HuniBadgeProps): React.JSX.Element {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {variant === 'popular' ? '추천' : '프리미엄'}
    </span>
  );
}
```

---

Version: 1.0.0
Created: 2026-03-05
