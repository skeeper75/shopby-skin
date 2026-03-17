import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 색상 선택 칩 컴포넌트
 * RULE-4: 50x50 GROUP 내 ELLIPSE로 색상 표시
 * 선택 시 보라색(#5538B6) 테두리, 미선택 시 회색(#CACACA) 테두리
 *
 * @MX:NOTE: [AUTO] 인쇄 색상 선택용 원형 칩 (RULE-4 준수: Ellipse 형태)
 * @MX:SPEC: SPEC-DS-004
 */

// 외부 컨테이너 스타일
const colorChipVariants = cva(
  'inline-flex items-center justify-center rounded cursor-pointer transition-all',
  {
    variants: {
      // 선택 상태
      state: {
        default: 'border border-[var(--po-border-default)]',
        selected: 'border-2 border-[var(--po-primary)]',
        disabled: 'border border-[var(--po-border-default)] opacity-50 cursor-not-allowed',
      },
      // 크기 variant (RULE-4: 50x50 기본, 32x32 미니)
      size: {
        default: 'w-[50px] h-[50px]',
        mini: 'w-[32px] h-[32px]',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  }
);

// 내부 원형 색상 표시
const innerEllipseSize = {
  default: 'w-9 h-9',   // 36px
  mini: 'w-5 h-5',      // 20px
};

const ColorChip = React.forwardRef(
  (
    {
      className,
      state,
      size = 'default',
      color = '#FF0000',
      label,
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = state === 'disabled';

    return (
      <button
        ref={ref}
        type="button"
        className={cn(colorChipVariants({ state, size, className }))}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        aria-label={label || `색상: ${color}`}
        aria-pressed={state === 'selected'}
        {...props}
      >
        {/* 원형 색상 표시 (RULE-4: Ellipse) */}
        <span
          className={cn('rounded-full', innerEllipseSize[size])}
          style={{ backgroundColor: color }}
        />
      </button>
    );
  }
);

ColorChip.displayName = 'ColorChip';

export { ColorChip, colorChipVariants };
