// @MX:ANCHOR: Icon Component - lucide-react 래퍼
// @MX:REASON: fan_in >= 3 (전체 앱에서 아이콘 사용)
// SPEC-DS-006

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Icon Component - lucide-react 통합
 */
const Icon = React.forwardRef(
  ({ name, size = 24, className, ...props }, ref) => {
    const LucideIcon = LucideIcons[name];

    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in lucide-react`);
      return null;
    }

    return (
      <LucideIcon
        ref={ref}
        size={size}
        className={cn('shrink-0', className)}
        {...props}
      />
    );
  }
);
Icon.displayName = 'Icon';

export { Icon };
