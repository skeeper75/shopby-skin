// @MX:NOTE: [AUTO] ReceivablePage - 업체별 미수금 페이지 (4단계 상태)
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import ReceivableStatusChip from '../../../components/admin/accounting/ReceivableStatusChip';
import { getReceivables, RECEIVABLE_STATUS } from '../../../services/admin/accounting';
import { formatCurrency, exportToCSV } from '../../../utils/excelExport';

/**
 * 미수금 관리 페이지
 */
const ReceivablePage = () => {
  const [receivables, setReceivables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchReceivables = async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await getReceivables(params);
      setReceivables(data);
    } catch (err) {
      console.error('미수금 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivables({ status: statusFilter });
  }, [statusFilter]);

  // 상태별 집계
  const statusSummary = Object.values(RECEIVABLE_STATUS).reduce((acc, status) => {
    const items = receivables.filter((r) => r.status === status);
    acc[status] = {
      count: items.length,
      total: items.reduce((sum, r) => sum + r.overdueAmount, 0),
    };
    return acc;
  }, {});

  const handleExport = () => {
    exportToCSV(
      receivables,
      ['거래처명', '유형', '총 잔액', '연체 금액', '연체 일수', '상태', '최근거래일'],
      ['vendorName', 'vendorType', 'totalBalance', 'overdueAmount', 'overdueDays', 'status', 'lastTransactionDate'],
      '미수금현황'
    );
  };

  return (
    <div className="space-y-5" style={{ minWidth: 1100 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">미수금 현황</h2>
        <button
          type="button"
          onClick={handleExport}
          className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
        >
          CSV 내보내기
        </button>
      </div>

      {/* 상태별 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {Object.values(RECEIVABLE_STATUS).map((status) => {
          const summary = statusSummary[status] ?? { count: 0, total: 0 };
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              className={`bg-white rounded-lg border p-4 text-left transition-colors ${
                statusFilter === status
                  ? 'border-[--huni-bg-brand] shadow-sm'
                  : 'border-[--huni-stroke-default] hover:border-[--huni-bg-brand]/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ReceivableStatusChip status={status} size="sm" />
                <span className="text-lg font-bold text-[--huni-fg-default]">{summary.count}개</span>
              </div>
              <p className="text-sm font-semibold text-[--huni-fg-default]">
                {formatCurrency(summary.total)}
              </p>
              <p className="text-xs text-[--huni-fg-muted] mt-0.5">연체 금액</p>
            </button>
          );
        })}
      </div>

      {/* 필터 표시 */}
      {statusFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[--huni-fg-muted]">필터:</span>
          <ReceivableStatusChip status={statusFilter} size="sm" />
          <button
            type="button"
            onClick={() => setStatusFilter('')}
            className="text-xs text-[--huni-fg-muted] hover:text-[--huni-fg-default] ml-1"
          >
            x 해제
          </button>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        <div className="px-5 py-3 border-b border-[--huni-stroke-default] text-sm text-[--huni-fg-muted]">
          총 {receivables.length}개 거래처
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-[--huni-fg-muted] text-sm">로딩 중...</div>
        ) : receivables.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[--huni-fg-muted] text-sm">미수금 내역이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
                <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">거래처명</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">유형</th>
                <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default] w-32">총 잔액</th>
                <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default] w-32">연체 금액</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-24">연체 일수</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-24">상태</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">최근거래일</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((item) => (
                <tr
                  key={item.vendorId}
                  className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-[--huni-fg-default]">{item.vendorName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded bg-[--huni-bg-muted] text-[--huni-fg-muted]">
                      {item.vendorType}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-[--huni-fg-default]">
                    {formatCurrency(item.totalBalance)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-[#F44336]">
                    {item.overdueAmount > 0 ? formatCurrency(item.overdueAmount) : '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-default]">
                    {item.overdueDays > 0 ? `${item.overdueDays}일` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ReceivableStatusChip status={item.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted] text-xs">
                    {item.lastTransactionDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReceivablePage;
