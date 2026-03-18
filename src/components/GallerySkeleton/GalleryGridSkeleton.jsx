import { bool, number } from 'prop-types';

import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';

// @MX:NOTE: [AUTO] 반응형 그리드에 맞춘 스켈레톤 - GalleryListPage와 동일한 grid 설정 유지
const GRID_CLASSES = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

/**
 * 상품 카드 스켈레톤 단일 아이템
 * 이미지 영역 + 상품명 + 가격 라인을 시뮬레이션
 */
const SkeletonCard = () => (
  <div className="flex flex-col gap-2">
    {/* 상품 이미지 영역 - 1:1 비율 */}
    <Skeleton className="w-full aspect-square rounded-md" />
    {/* 상품명 */}
    <Skeleton className="h-4 w-3/4" />
    {/* 가격 */}
    <Skeleton className="h-4 w-1/2" />
  </div>
);

/**
 * 갤러리 그리드 스켈레톤 컴포넌트
 * 반응형 그리드 레이아웃에 맞춰 스켈레톤 카드를 표시합니다.
 *
 * @param {{ isLoading: boolean, itemCount: number }} props
 */
const GalleryGridSkeleton = ({ isLoading, itemCount = 8 }) => {
  if (!isLoading) return null;

  return (
    <div className={cn(GRID_CLASSES, 'py-4')}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default GalleryGridSkeleton;

GalleryGridSkeleton.propTypes = {
  isLoading: bool,
  itemCount: number,
};
