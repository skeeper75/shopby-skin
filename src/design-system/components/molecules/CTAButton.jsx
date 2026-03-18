import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

/**
 * 주요 행동 버튼 컴포넌트
 * Figma 기준: RECT 465x50, primary action (장바구니 담기, 바로 주문 등)
 *
 * @MX:NOTE: [AUTO] 주요 행동 버튼 (장바구니, 바로 주문 등 CTA)
 * @MX:NOTE: [MIGRATION] SPEC-DS-006 Phase 5 - --po-* → --huni-* 시멘틱 토큰 마이그레이션 완료
 * @MX:SPEC: SPEC-DS-004
 */

const ctaButtonVariants = cva(
  'inline-flex items-center justify-center rounded font-bold transition-all select-none',
  {
    variants: {
      // 색상 variant
      variant: {
        primary:
          'bg-[var(--huni-bg-brand-solid)] text-white hover:bg-[var(--huni-purple-600)] active:bg-[var(--huni-purple-600)]',
        secondary:
          'bg-white text-[var(--huni-fg-brand)] border-2 border-[var(--huni-stroke-brand)] hover:bg-[var(--huni-purple-50)]',
        dark:
          'bg-[var(--huni-fg-neutral)] text-white hover:bg-[var(--huni-fg-neutral-muted)]',
        disabled:
          'bg-[var(--huni-gray-200)] text-[var(--huni-fg-neutral-subtle)] cursor-not-allowed',
      },
      // 크기 variant
      size: {
        default: 'w-[465px] h-[50px] text-[15px]',
        full: 'w-full h-[50px] text-[15px]',
        sm: 'w-[220px] h-[45px] text-[14px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const CTAButton = React.forwardRef(
  ({ className, variant, size, children, disabled, onClick, ...props }, ref) => {
    const resolvedVariant = disabled ? 'disabled' : variant;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(ctaButtonVariants({ variant: resolvedVariant, size, className }))}
        style={{ fontFamily: 'var(--huni-font-family)' }}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CTAButton.displayName = 'CTAButton';

export { CTAButton, ctaButtonVariants };
