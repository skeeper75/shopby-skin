import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] 상품 카드 스켈레톤 - 로딩 중 플레이스홀더 UI
const HuniSkeletonCard = ({ className }) => (
  <div className={cn('flex flex-col gap-2 animate-pulse', className)}>
    <div className="aspect-square bg-[#F6F6F6] rounded-[5px]" />
    <div className="h-4 bg-[#F6F6F6] rounded w-3/4" />
    <div className="h-4 bg-[#F6F6F6] rounded w-1/2" />
    <div className="h-5 bg-[#F6F6F6] rounded w-2/3" />
  </div>
);

const HuniSkeletonGrid = ({ count = 8, className }) => (
  <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <HuniSkeletonCard key={i} />
    ))}
  </div>
);

export { HuniSkeletonCard, HuniSkeletonGrid };
export default HuniSkeletonCard;
