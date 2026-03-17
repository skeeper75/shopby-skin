// @MX:NOTE: Divider Component - 구분선
// SPEC-DS-006

import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Divider Component
 */
const Divider = React.forwardRef(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'shrink-0 bg-[--huni-stroke-default]',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
));
Divider.displayName = 'Divider';

export { Divider };
