import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 가격 요약 컴포넌트
 * 가격 항목 리스트 + 구분선 + 총 금액
 *
 * @MX:NOTE: [AUTO] 주문 가격 요약 정보 (항목별 비용 + 합계)
 * @MX:SPEC: SPEC-DS-004
 */

const priceSummaryVariants = cva(
  'flex flex-col gap-2',
  {
    variants: {
      size: {
        default: 'w-[465px] py-4',
        full: 'w-full py-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * 개별 가격 항목 행
 */
const PriceRow = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between">
    <span
      className={cn(
        'text-[13px]',
        highlight
          ? 'font-bold text-[var(--po-text-dark)]'
          : 'text-[var(--po-text-medium)]'
      )}
      style={{ fontFamily: 'var(--po-font-family)' }}
    >
      {label}
    </span>
    <span
      className={cn(
        highlight
          ? 'text-[18px] font-bold text-[var(--po-primary)]'
          : 'text-[13px] font-medium text-[var(--po-text-dark)]'
      )}
      style={{ fontFamily: 'var(--po-font-family)' }}
    >
      {value}
    </span>
  </div>
);

const PriceSummary = React.forwardRef(
  (
    {
      className,
      size,
      items = [],
      totalLabel = '총 금액',
      totalValue = '0원',
      showDivider = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(priceSummaryVariants({ size, className }))}
        {...props}
      >
        {/* 가격 항목 목록 */}
        {items.map((item, index) => (
          <PriceRow
            key={item.label || index}
            label={item.label}
            value={item.value}
          />
        ))}

        {/* 구분선 */}
        {showDivider && items.length > 0 && (
          <div className="w-full h-px bg-[var(--po-bg-light)] my-1" />
        )}

        {/* 총 금액 */}
        <PriceRow
          label={totalLabel}
          value={totalValue}
          highlight
        />
      </div>
    );
  }
);

PriceSummary.displayName = 'PriceSummary';

export { PriceSummary, priceSummaryVariants, PriceRow };
