import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 라디오 스타일 옵션 버튼 컴포넌트
 * Figma 기준: RECT 116x50, 선택 시 white fill + #5538B6 stroke w=2
 * RULE-2: selected = white fill + #5538B6 stroke width 2
 *
 * @MX:NOTE: [AUTO] 라디오 스타일 옵션 선택 버튼 (단면/양면 등)
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

const radioOptionVariants = cva(
  'inline-flex items-center justify-center rounded cursor-pointer transition-all select-none',
  {
    variants: {
      // 선택 상태 (RULE-2 적용)
      state: {
        default:
          'bg-white border border-[var(--huni-stroke-neutral-muted)] text-[var(--huni-fg-neutral)] hover:border-[var(--huni-purple-300)]',
        selected:
          'bg-white border-2 border-[var(--huni-stroke-brand)] text-[var(--huni-fg-brand)] font-medium',
        disabled:
          'bg-[var(--huni-bg-neutral-weak)] border border-[var(--huni-stroke-neutral-muted)] text-[var(--huni-fg-neutral-subtle)] cursor-not-allowed',
      },
      size: {
        default: 'w-[116px] h-[50px] text-[13px]',
        wide: 'w-[155px] h-[50px] text-[13px]',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  }
);

const RadioOption = React.forwardRef(
  ({ className, state, size, label, value, onClick, ...props }, ref) => {
    const isDisabled = state === 'disabled';

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={state === 'selected'}
        className={cn(radioOptionVariants({ state, size, className }))}
        style={{ fontFamily: 'var(--po-font-family)' }}
        onClick={isDisabled ? undefined : () => onClick?.(value)}
        disabled={isDisabled}
        {...props}
      >
        {/* RULE-5: 라벨은 props로 전달 */}
        {label}
      </button>
    );
  }
);

RadioOption.displayName = 'RadioOption';

export { RadioOption, radioOptionVariants };
