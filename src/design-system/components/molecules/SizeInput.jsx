import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 가로x세로 사이즈 입력 컴포넌트
 * Figma 기준: RECT 461x45, 이중 입력 (가로 X 세로)
 *
 * @MX:NOTE: [AUTO] 인쇄물 가로/세로 사이즈 입력 (mm 단위)
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

const sizeInputVariants = cva(
  'flex items-center gap-2',
  {
    variants: {
      size: {
        default: 'w-[461px] h-[45px]',
        full: 'w-full h-[45px]',
      },
      state: {
        default: '',
        disabled: 'opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

// 개별 입력 필드 스타일
const inputFieldClass = cn(
  'flex-1 h-full px-3',
  'bg-white border border-[var(--huni-stroke-neutral-muted)] rounded',
  'text-[13px] text-[var(--huni-fg-neutral)]',
  'placeholder:text-[var(--huni-fg-neutral-subtle)]',
  'focus:border-[var(--huni-stroke-brand)] focus:outline-none',
  'transition-colors'
);

const SizeInput = React.forwardRef(
  (
    {
      className,
      size,
      state,
      width = '',
      height = '',
      onWidthChange,
      onHeightChange,
      widthPlaceholder = '가로',
      heightPlaceholder = '세로',
      unit = 'mm',
      ...props
    },
    ref
  ) => {
    const isDisabled = state === 'disabled';

    return (
      <div
        ref={ref}
        className={cn(sizeInputVariants({ size, state, className }))}
        {...props}
      >
        {/* 가로 입력 */}
        <input
          type="number"
          className={inputFieldClass}
          style={{ fontFamily: 'var(--huni-font-family)' }}
          value={width}
          onChange={(e) => onWidthChange?.(e.target.value)}
          placeholder={widthPlaceholder}
          disabled={isDisabled}
          aria-label={`${widthPlaceholder} (${unit})`}
          min="0"
        />

        {/* X 구분자 */}
        <span
          className="text-[13px] font-medium text-[var(--huni-fg-neutral)] flex-shrink-0"
          style={{ fontFamily: 'var(--huni-font-family)' }}
        >
          X
        </span>

        {/* 세로 입력 */}
        <input
          type="number"
          className={inputFieldClass}
          style={{ fontFamily: 'var(--huni-font-family)' }}
          value={height}
          onChange={(e) => onHeightChange?.(e.target.value)}
          placeholder={heightPlaceholder}
          disabled={isDisabled}
          aria-label={`${heightPlaceholder} (${unit})`}
          min="0"
        />
      </div>
    );
  }
);

SizeInput.displayName = 'SizeInput';

export { SizeInput, sizeInputVariants };
