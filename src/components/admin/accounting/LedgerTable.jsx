// @MX:NOTE: [AUTO] LedgerTable - 원장 테이블 컴포넌트 (잔액 컬럼 포함)
// @MX:SPEC: SPEC-SKIN-008

import { cn } from '../../../lib/utils';
import { formatCurrency, formatDate } from '../../../utils/excelExport';

/** 거래 유형별 스타일 */
const TYPE_STYLES = {
  입금: 'text-[#00C853] font-semibold',
  출금: 'text-[#F44336] font-semibold',
  조정: 'text-[#FF9800] font-semibold',
};

/**
 * 원장 테이블
 * @param {Object} props
 * @param {Object[]} props.entries - 거래 목록
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {function} props.onRowClick - 행 클릭 핸들러
 */
const LedgerTable = ({ entries = [], isLoading = false, onRowClick }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-[--huni-fg-muted] text-sm">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[--huni-fg-muted] text-sm">
        거래 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
            <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default] w-[110px]">날짜</th>
            <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default]">거래처</th>
            <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-[70px]">유형</th>
            <th className="text-right px-4 py-3 font-medium text-[--huni-fg-default] w-[120px]">금액</th>
            <th className="text-right px-4 py-3 font-medium text-[--huni-fg-default] w-[120px]">잔액</th>
            <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default]">거래 내역</th>
            <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default] w-[140px]">청구서번호</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={entry.id ?? idx}
              onClick={() => onRowClick?.(entry)}
              className={cn(
                'border-b border-[--huni-stroke-default]/50 transition-colors',
                onRowClick ? 'cursor-pointer hover:bg-[#F6F6F6]' : ''
              )}
            >
              <td className="px-4 py-3 text-[--huni-fg-muted]">{formatDate(entry.date)}</td>
              <td className="px-4 py-3 text-[--huni-fg-default] font-medium">{entry.vendorName}</td>
              <td className="px-4 py-3 text-center">
                <span className={cn('text-xs', TYPE_STYLES[entry.type] ?? '')}>{entry.type}</span>
              </td>
              <td className={cn('px-4 py-3 text-right', TYPE_STYLES[entry.type] ?? '')}>
                {entry.type === '출금' ? '-' : '+'}{formatCurrency(entry.amount)}
              </td>
              <td className="px-4 py-3 text-right text-[--huni-fg-default] font-medium">
                {formatCurrency(entry.balance)}
              </td>
              <td className="px-4 py-3 text-[--huni-fg-default]">{entry.description}</td>
              <td className="px-4 py-3 text-[--huni-fg-muted] text-xs">{entry.invoiceNo ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerTable;
