// @MX:ANCHOR: [AUTO] ReceivableStatusChip - 미수금 상태 Chip 컴포넌트
// @MX:REASON: [AUTO] fan_in >= 3 (ReceivablePage, LedgerPage, DashboardPage 등 다수 사용)
// @MX:SPEC: SPEC-SKIN-008

import { cn } from '../../../lib/utils';

/** 미수금 상태별 스타일 */
const STATUS_STYLES = {
  정상: { bg: 'bg-[#E8F5E9]', text: 'text-[#00C853]', border: 'border-[#00C853]/30' },
  주의: { bg: 'bg-[#FFF3E0]', text: 'text-[#FF9800]', border: 'border-[#FF9800]/30' },
  경고: { bg: 'bg-[#FFEBEE]', text: 'text-[#F44336]', border: 'border-[#F44336]/30' },
  거래중지: { bg: 'bg-[#F5F5F5]', text: 'text-[#424242]', border: 'border-[#424242]/30' },
};

/**
 * 미수금 상태 Chip
 * @param {Object} props
 * @param {'정상'|'주의'|'경고'|'거래중지'} props.status - 상태
 * @param {'sm'|'md'} props.size - 크기
 */
const ReceivableStatusChip = ({ status, size = 'md', className }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.정상;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        style.bg,
        style.text,
        style.border,
        sizeClass,
        className
      )}
    >
      {status}
    </span>
  );
};

export default ReceivableStatusChip;
