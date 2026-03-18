// @MX:ANCHOR: Skeleton Component - 로딩 스켈레톤
// @MX:REASON: fan_in >= 3 (상품, 가격 로딩 등 다수 사용)
// SPEC-DS-006

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Skeleton variants
 */
const skeletonVariants = cva(
  'animate-pulse rounded-md bg-[--huni-bg-muted]',
  {
    variants: {
      variant: {
        default: 'bg-[--huni-bg-muted]',
        card: 'h-32 w-full',
        text: 'h-4 w-full',
        circular: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Skeleton Component
 */
const Skeleton = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(skeletonVariants({ variant }), className)}
    {...props}
  />
));
Skeleton.displayName = 'Skeleton';

export { Skeleton };
