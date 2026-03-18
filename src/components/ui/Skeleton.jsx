import { cn } from '../../lib/utils';

/**
 * 로딩 상태를 위한 스켈레톤 컴포넌트
 * 콘텐츠가 로드되는 동안 플레이스홀더로 표시됩니다.
 */
const Skeleton = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
};

export { Skeleton };
