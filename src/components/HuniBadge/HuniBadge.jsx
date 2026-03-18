import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] Huni 인쇄소 뱃지 컴포넌트 - NEW/BEST/HOT/SALE 4가지 타입 지원
const BADGE_CONFIG = {
  NEW: { label: 'NEW', className: 'bg-[#5538B6] text-white' },
  BEST: { label: 'BEST', className: 'bg-[#3B2573] text-white' },
  HOT: { label: 'HOT', className: 'bg-[#EF4444] text-white' },
  SALE: { label: 'SALE', className: 'bg-[#E6B93F] text-white' },
};

const HuniBadge = ({ type, className }) => {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded tracking-wide',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default HuniBadge;
