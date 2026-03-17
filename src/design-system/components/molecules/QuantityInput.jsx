import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 수량 입력 컴포넌트
 * Figma 기준: RECT 461x50, 숫자 입력
 *
 * @MX:NOTE: [AUTO] 인쇄물 수량 입력 필드
 * @MX:SPEC: SPEC-DS-004
 */

const quantityInputVariants = cva(
  'flex items-center rounded transition-all',
  {
    variants: {
      state: {
        default:
          'bg-white border border-[var(--po-border-default)] focus-within:border-[var(--po-primary)]',
        disabled:
          'bg-[var(--po-bg-section)] border border-[var(--po-border-default)] cursor-not-allowed',
      },
      size: {
        default: 'w-[461px] h-[50px] px-3',
        full: 'w-full h-[50px] px-3',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  }
);

const QuantityInput = React.forwardRef(
  (
    {
      className,
      state,
      size,
      value = '',
      onChange,
      placeholder = '수량을 입력해 주세요',
      min = 1,
      max = 9999,
      unit = '장',
      ...props
    },
    ref
  ) => {
    const isDisabled = state === 'disabled';

    // 숫자만 입력 허용
    const handleChange = (e) => {
      const inputValue = e.target.value;
      // 빈 값이거나 숫자인 경우만 허용
      if (inputValue === '' || /^\d+$/.test(inputValue)) {
        const numValue = inputValue === '' ? '' : Number(inputValue);
        if (numValue === '' || (numValue >= min && numValue <= max)) {
          onChange?.(numValue);
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(quantityInputVariants({ state, size, className }))}
        {...props}
      >
        <input
          type="text"
          inputMode="numeric"
          className={cn(
            'flex-1 h-full bg-transparent outline-none',
            'text-[14px] font-medium text-[var(--po-text-dark)]',
            'placeholder:text-[var(--po-text-muted)]'
          )}
          style={{ fontFamily: 'var(--po-font-family)' }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-label={`수량 입력 (${unit})`}
        />
        {/* 단위 표시 */}
        {value !== '' && (
          <span
            className="text-[13px] text-[var(--po-text-muted)] ml-1 flex-shrink-0"
            style={{ fontFamily: 'var(--po-font-family)' }}
          >
            {unit}
          </span>
        )}
      </div>
    );
  }
);

QuantityInput.displayName = 'QuantityInput';

export { QuantityInput, quantityInputVariants };
