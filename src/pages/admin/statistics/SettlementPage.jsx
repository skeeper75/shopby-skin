// @MX:NOTE: [AUTO] SettlementPage - 굿즈 발주/정산 페이지
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { getSettlements } from '../../../services/admin/statistics';
import { formatCurrency, exportToCSV } from '../../../utils/excelExport';

const STATUS_STYLES = {
  미정산: 'bg-[#FFF3E0] text-[#FF9800]',
  정산완료: 'bg-[#E8F5E9] text-[#00C853]',
  취소: 'bg-[#F5F5F5] text-[#424242]',
};

/**
 * 굿즈 발주/정산 페이지
 */
const SettlementPage = () => {
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getSettlements({ status: statusFilter });
        setSettlements(data);
      } catch (err) {
        console.error('정산 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [statusFilter]);

  const handleExport = () => {
    exportToCSV(
      settlements,
      ['거래처', '유형', '발주일', '금액', '상태', '만기일'],
      ['vendorName', 'type', 'orderDate', 'amount', 'status', 'dueDate'],
      '굿즈정산'
    );
  };

  const pendingTotal = settlements
    .filter((s) => s.status === '미정산')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-5" style={{ minWidth: 1100 }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">굿즈 발주/정산</h2>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport}
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors">
            CSV 내보내기
          </button>
          <button type="button" onClick={() => alert('TODO: 발주 등록 구현 예정')}
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors">
            + 발주 등록
          </button>
        </div>
      </div>

      {/* 미정산 요약 */}
      <div className="bg-[#FFF3E0] border border-[#FF9800]/30 rounded-lg px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#FF9800] font-medium">미정산 금액</p>
          <p className="text-2xl font-bold text-[#FF9800] mt-1">{formatCurrency(pendingTotal)}</p>
        </div>
        <span className="text-sm text-[#FF9800]">
          미정산 {settlements.filter((s) => s.status === '미정산').length}건
        </span>
      </div>

      {/* 필터 + 테이블 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        <div className="px-5 py-3 border-b border-[--huni-stroke-default] flex gap-2">
          {['전체', '미정산', '정산완료'].map((s) => (
            <button key={s} type="button"
              onClick={() => setStatusFilter(s === '전체' ? '' : s)}
              className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                (statusFilter === '' && s === '전체') || statusFilter === s
                  ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                  : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default]'
              }`}>
              {s}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-[--huni-fg-muted] text-sm">로딩 중...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
                <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">거래처</th>
                <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default] w-24">유형</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">발주일</th>
                <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default] w-28">금액</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-20">상태</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">만기일</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">정산일</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((item) => (
                <tr key={item.id} className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50">
                  <td className="px-5 py-3 font-medium text-[--huni-fg-default]">{item.vendorName}</td>
                  <td className="px-4 py-3 text-[--huni-fg-muted]">{item.type}</td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted] text-xs">{item.orderDate}</td>
                  <td className="px-5 py-3 text-right font-medium text-[--huni-fg-default]">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLES[item.status] ?? ''}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted] text-xs">{item.dueDate}</td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted] text-xs">{item.settledDate ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SettlementPage;
