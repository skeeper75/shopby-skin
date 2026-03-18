/**
 * Skeleton — 로딩 플레이스홀더 컴포넌트
 *
 * 콘텐츠 로딩 중 시각적 피드백을 제공하는 뼈대 UI.
 * wave(shimmer) 또는 pulse 애니메이션을 지원.
 *
 * @MX:NOTE: [AUTO] CSS 키프레임 애니메이션을 인라인으로 주입하는 패턴
 * @MX:SPEC: SPEC-DS-006
 */
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/** 전역에 한 번만 주입될 키프레임 스타일 */
const KEYFRAMES_ID = '__huni-skeleton-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;

  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
@keyframes huni-skeleton-wave {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes huni-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;
  document.head.appendChild(style);
}

/** 톤별 배경색 */
const TONE_BG = {
  neutral: 'var(--huni-bg-neutral-weak)',
  brand: 'var(--huni-bg-brand-weak)',
};

const Skeleton = forwardRef(function Skeleton(
  {
    radius = 'var(--huni-radius-1)',
    tone = 'neutral',
    width,
    height,
    animation = 'wave',
    className,
    style,
    ...props
  },
  ref
) {
  // 키프레임이 DOM에 존재하는지 보장
  ensureKeyframes();

  const bg = TONE_BG[tone] ?? TONE_BG.neutral;

  const animationStyle =
    animation === 'wave'
      ? {
          backgroundImage: `linear-gradient(90deg, ${bg} 25%, color-mix(in srgb, ${bg} 60%, transparent) 50%, ${bg} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'huni-skeleton-wave 1.8s ease-in-out infinite',
        }
      : {
          backgroundColor: bg,
          animation: 'huni-skeleton-pulse 1.5s ease-in-out infinite',
        };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('block', className)}
      style={{
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        width,
        height,
        ...animationStyle,
        ...style,
      }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export default Skeleton;
