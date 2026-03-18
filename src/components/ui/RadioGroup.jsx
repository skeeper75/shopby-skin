// @MX:ANCHOR: RadioGroup Compound Component - Radix UI 기반
// @MX:REASON: fan_in >= 3 (종속옵션, 결제수단, 배송지 선택 등 다수 사용)
// SPEC-DS-006

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * RadioGroup Root - 컨테이너
 */
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn('gap-2', className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * RadioGroup Item - 개별 라디오 버튼
 */
const radioItemVariants = cva(
  'aspect-square h-4 w-4 rounded-full border text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-primary text-primary',
        brand: 'border-[--huni-stroke-brand] text-[--huni-fg-brand]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const RadioGroupItem = React.forwardRef(({ className, variant, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioItemVariants({ variant }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
