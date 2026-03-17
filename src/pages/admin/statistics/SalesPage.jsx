// @MX:NOTE: [AUTO] SalesPage - 월별 매출통계 페이지
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import SalesBarChart from '../../../components/admin/statistics/SalesBarChart';
import DateRangeFilter from '../../../components/admin/statistics/DateRangeFilter';
import { getMonthlySales } from '../../../services/admin/statistics';
import { formatCurrency, exportToCSV } from '../../../utils/excelExport';

/**
 * 월별 매출통계 페이지
 */
const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [viewType, setViewType] = useState('stacked'); // 'stacked' | 'grouped'

  const fetchData = async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await getMonthlySales(params);
      setSalesData(data);
    } catch (err) {
      console.error('매출 통계 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    exportToCSV(
      salesData,
      ['월', '인쇄', '굿즈', '패키지', '합계'],
      ['label', 'print', 'goods', 'package', 'total'],
      '월별매출통계'
    );
  };

  // 요약 합계
  const totals = salesData.reduce(
    (acc, d) => {
      acc.print += d.print ?? 0;
      acc.goods += d.goods ?? 0;
      acc.package += d.package ?? 0;
      acc.total += d.total ?? 0;
      return acc;
    },
    { print: 0, goods: 0, package: 0, total: 0 }
  );

  return (
    <div className="space-y-5" style={{ minWidth: 1280 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">월별 매출 통계</h2>
        <button
          type="button"
          onClick={handleExport}
          className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
        >
          CSV 내보내기
        </button>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] px-5 py-4 flex items-center justify-between">
        <DateRangeFilter value={dateRange} onChange={(range) => { setDateRange(range); fetchData(range); }} />
        <div className="flex gap-1">
          {['stacked', 'grouped'].map((type) => (
            <button key={type} type="button" onClick={() => setViewType(type)}
              className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${viewType === type ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]' : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default]'}`}>
              {type === 'stacked' ? '누적' : '그룹'}
            </button>
          ))}
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '인쇄 합계', value: totals.print, color: 'text-[#5538B6]' },
          { label: '굿즈 합계', value: totals.goods, color: 'text-[#9580D9]' },
          { label: '패키지 합계', value: totals.package, color: 'text-[#7AC8C4]' },
          { label: '총 매출', value: totals.total, color: 'text-[--huni-fg-default]' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
            <p className="text-sm text-[--huni-fg-muted]">{item.label}</p>
            <p className={`text-xl font-bold mt-1 ${item.color}`}>{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
        <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">월별 매출 추이</h3>
        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
        ) : (
          <SalesBarChart data={salesData} height={320} stacked={viewType === 'stacked'} />
        )}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
              <th className="text-left px-5 py-3 font-medium text-[--huni-fg-default]">월</th>
              <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default]">인쇄</th>
              <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default]">굿즈</th>
              <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default]">패키지</th>
              <th className="text-right px-5 py-3 font-medium text-[--huni-fg-default]">합계</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row) => (
              <tr key={row.month} className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50">
                <td className="px-5 py-3 font-medium text-[--huni-fg-default]">{row.label}</td>
                <td className="px-5 py-3 text-right text-[--huni-fg-muted]">{formatCurrency(row.print)}</td>
                <td className="px-5 py-3 text-right text-[--huni-fg-muted]">{formatCurrency(row.goods)}</td>
                <td className="px-5 py-3 text-right text-[--huni-fg-muted]">{formatCurrency(row.package)}</td>
                <td className="px-5 py-3 text-right font-bold text-[--huni-fg-default]">{formatCurrency(row.total)}</td>
              </tr>
            ))}
            {/* 합계 행 */}
            <tr className="bg-[#F6F6F6] font-bold border-t border-[--huni-stroke-default]">
              <td className="px-5 py-3 text-[--huni-fg-default]">합계</td>
              <td className="px-5 py-3 text-right text-[#5538B6]">{formatCurrency(totals.print)}</td>
              <td className="px-5 py-3 text-right text-[#9580D9]">{formatCurrency(totals.goods)}</td>
              <td className="px-5 py-3 text-right text-[#7AC8C4]">{formatCurrency(totals.package)}</td>
              <td className="px-5 py-3 text-right text-[--huni-fg-default]">{formatCurrency(totals.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
