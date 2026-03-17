import React, { useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 수량 조절 카운터 컴포넌트
 * RULE-3: 직사각형 3분할 [34px -] [155px value] [34px +], 원형 아님
 * Figma 기준: [34] [155] [34] = 223px 총 너비
 *
 * @MX:NOTE: [AUTO] 수량 조절 카운터 (RULE-3: 직사각형 3-part 구조)
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

// 전체 카운터 컨테이너
const counterVariants = cva(
  'inline-flex items-center',
  {
    variants: {
      state: {
        default: '',
        disabled: 'opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

// 버튼 스타일 (-, +)
const counterButtonClass = cn(
  'flex items-center justify-center',
  'w-[34px] h-[50px]',
  'bg-[var(--huni-bg-neutral-weak)] border border-[var(--huni-stroke-neutral-muted)]',
  'text-[var(--huni-fg-neutral)] text-base font-medium',
  'cursor-pointer select-none transition-colors',
  'hover:bg-[var(--huni-gray-200)]'
);

// 값 표시 영역
const counterValueClass = cn(
  'flex items-center justify-center',
  'w-[155px] h-[50px]',
  'bg-white border-t border-b border-[var(--huni-stroke-neutral-muted)]',
  'text-[var(--huni-fg-neutral)] text-sm font-medium'
);

const CounterOption = React.forwardRef(
  (
    {
      className,
      state,
      value = 1,
      min = 1,
      max = 999,
      onChange,
      ...props
    },
    ref
  ) => {
    const isDisabled = state === 'disabled';

    // 감소 핸들러
    const handleDecrement = useCallback(() => {
      if (value > min) {
        onChange?.(value - 1);
      }
    }, [value, min, onChange]);

    // 증가 핸들러
    const handleIncrement = useCallback(() => {
      if (value < max) {
        onChange?.(value + 1);
      }
    }, [value, max, onChange]);

    return (
      <div
        ref={ref}
        className={cn(counterVariants({ state, className }))}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* RULE-3: 직사각형 - 버튼 (왼쪽 둥근 모서리) */}
        <button
          type="button"
          className={cn(counterButtonClass, 'rounded-l border-r-0')}
          style={{ fontFamily: 'var(--po-font-family)' }}
          onClick={handleDecrement}
          disabled={isDisabled || value <= min}
          aria-label="수량 감소"
        >
          -
        </button>

        {/* RULE-3: 직사각형 값 표시 */}
        <span
          className={counterValueClass}
          style={{ fontFamily: 'var(--po-font-family)' }}
        >
          {value}
        </span>

        {/* RULE-3: 직사각형 + 버튼 (오른쪽 둥근 모서리) */}
        <button
          type="button"
          className={cn(counterButtonClass, 'rounded-r border-l-0')}
          style={{ fontFamily: 'var(--po-font-family)' }}
          onClick={handleIncrement}
          disabled={isDisabled || value >= max}
          aria-label="수량 증가"
        >
          +
        </button>
      </div>
    );
  }
);

CounterOption.displayName = 'CounterOption';

export { CounterOption, counterVariants };
