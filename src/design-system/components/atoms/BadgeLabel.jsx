import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 뱃지 라벨 컴포넌트
 * Figma 기준: RECT 32x14, #5538B6 배경, 흰색 텍스트 "추천"
 *
 * @MX:NOTE: [AUTO] 추천/인기 등의 상태를 표시하는 소형 뱃지 라벨
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

// 뱃지 스타일 variant 정의
const badgeLabelVariants = cva(
  'inline-flex items-center justify-center rounded-sm font-bold leading-none',
  {
    variants: {
      // 색상 variant
      variant: {
        default: 'bg-[var(--huni-bg-brand-solid)] text-white',
        gold: 'bg-[var(--huni-gold-500)] text-white',
        teal: 'bg-[var(--huni-teal-500)] text-white',
        muted: 'bg-[var(--huni-gray-200)] text-[var(--huni-fg-neutral-muted)]',
      },
      // 크기 variant
      size: {
        default: 'px-1.5 py-0.5 text-[9px] min-w-[32px] h-[14px]',
        sm: 'px-1 py-0.5 text-[8px] min-w-[24px] h-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const BadgeLabel = React.forwardRef(
  ({ className, variant, size, children = '추천', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeLabelVariants({ variant, size, className }))}
        style={{ fontFamily: 'var(--huni-font-family)' }}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BadgeLabel.displayName = 'BadgeLabel';

export { BadgeLabel, badgeLabelVariants };
