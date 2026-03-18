// @MX:ANCHOR: Chip Component - 뱃지/태그 표시
// @MX:REASON: fan_in >= 3 (옵션표시, 주문상태 등 다수 사용)
// SPEC-DS-006

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Chip variants
 */
const chipVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-[--huni-bg-muted] text-[--huni-fg-default]',
        primary: 'border border-transparent bg-[--huni-bg-brand] text-white',
        success: 'border border-transparent bg-[--huni-bg-success] text-[--huni-fg-success]',
        warning: 'border border-transparent bg-[--huni-bg-warning] text-[--huni-fg-warning]',
        error: 'border border-transparent bg-[--huni-bg-error] text-[--huni-fg-error]',
        outline: 'border border-[--huni-stroke-default] text-[--huni-fg-default]',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Chip Component
 */
const Chip = React.forwardRef(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(chipVariants({ variant, size }), className)}
    {...props}
  />
));
Chip.displayName = 'Chip';

export { Chip, chipVariants };
