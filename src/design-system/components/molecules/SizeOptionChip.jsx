import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 인쇄 사이즈 옵션 칩 컴포넌트
 * Figma 기준: RECT 155x50, 3가지 상태 (selected/default/disabled)
 * RULE-2: 선택 시 white fill + #5538B6 stroke w=2
 *
 * @MX:NOTE: [AUTO] 인쇄 사이즈 선택 칩 (A4, A3 등), CVA 3-state variant
 * @MX:SPEC: SPEC-DS-004
 */

const sizeOptionChipVariants = cva(
  'inline-flex items-center justify-center rounded cursor-pointer transition-all select-none',
  {
    variants: {
      // 선택 상태 (RULE-2 적용)
      state: {
        default:
          'bg-white border border-[var(--po-border-default)] text-[var(--po-text-dark)] hover:border-[var(--po-primary-secondary)]',
        selected:
          'bg-white border-2 border-[var(--po-primary)] text-[var(--po-primary)]',
        disabled:
          'bg-[var(--po-bg-section)] border border-[var(--po-border-default)] text-[var(--po-text-muted)] cursor-not-allowed',
      },
      // 크기 variant
      size: {
        default: 'w-[155px] h-[50px] text-[13px]',
        sm: 'w-[120px] h-[40px] text-[12px]',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  }
);

const SizeOptionChip = React.forwardRef(
  ({ className, state, size, label, onClick, ...props }, ref) => {
    const isDisabled = state === 'disabled';

    return (
      <button
        ref={ref}
        type="button"
        className={cn(sizeOptionChipVariants({ state, size, className }))}
        style={{ fontFamily: 'var(--po-font-family)', fontWeight: 'var(--po-font-medium)' }}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        aria-pressed={state === 'selected'}
        {...props}
      >
        {/* RULE-5: 라벨은 props로 전달 (하드코딩 금지) */}
        {label}
      </button>
    );
  }
);

SizeOptionChip.displayName = 'SizeOptionChip';

export { SizeOptionChip, sizeOptionChipVariants };
