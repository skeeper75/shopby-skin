/**
 * Divider — 구분선 컴포넌트
 *
 * 콘텐츠 영역을 시각적으로 분리하는 수평/수직 구분선.
 *
 * @MX:NOTE: [AUTO] 단순 렌더링 컴포넌트, Radix 미사용
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Divider = forwardRef(function Divider(
  { variant = 'full', direction = 'horizontal', className, ...props },
  ref
) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={direction}
      className={cn(
        // 기본 스타일
        'shrink-0 bg-[var(--huni-stroke-neutral-muted)]',
        // 방향별 크기
        isHorizontal ? 'h-px w-full' : 'w-px h-full',
        // inset 변형: 양쪽 여백 추가
        variant === 'inset' && (isHorizontal ? 'mx-[var(--huni-space-4)]' : 'my-[var(--huni-space-4)]'),
        className
      )}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

export { Divider };
export default Divider;
