// @MX:ANCHOR: TextField Compound Component - 텍스트 입력
// @MX:REASON: fan_in >= 3 (모든 텍스트 입력에서 사용)
// SPEC-DS-006

import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * TextField Root
 */
const TextField = React.forwardRef(({ className, error, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--huni-fg-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--huni-stroke-brand] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-[--huni-fg-error]',
      className
    )}
    ref={ref}
    {...props}
  />
));
TextField.displayName = 'TextField';

export { TextField };
