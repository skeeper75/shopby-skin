/**
 * Icon — lucide-react 아이콘 래퍼
 *
 * lucide-react 아이콘을 이름(string)으로 동적 렌더링.
 * 부모 컨텍스트의 color를 상속하기 위해 --huni-icon-color CSS 변수를 지원.
 *
 * @MX:NOTE: [AUTO] lucide-react icons 맵 기반 동적 아이콘 렌더링
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef } from 'react';
import { icons } from 'lucide-react';
import { cn } from '../../utils/cn';

/** 사이즈별 px 매핑 */
const SIZE_MAP = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const Icon = forwardRef(function Icon(
  { name, size = 'md', color, className, ...props },
  ref
) {
  const LucideIcon = icons[name];

  // 존재하지 않는 아이콘 이름이면 렌더링하지 않음
  if (!LucideIcon) {
    return null;
  }

  const pxSize = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <LucideIcon
      ref={ref}
      aria-hidden="true"
      width={pxSize}
      height={pxSize}
      className={cn('shrink-0', className)}
      style={{
        color: color ?? 'var(--huni-icon-color, currentColor)',
      }}
      {...props}
    />
  );
});

Icon.displayName = 'Icon';

export { Icon };
export default Icon;
