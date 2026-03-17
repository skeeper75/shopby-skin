// @MX:ANCHOR: [AUTO] ProductStatsTemplate - 상품 통계 공통 템플릿 (config pattern)
// @MX:REASON: [AUTO] fan_in >= 3 (인쇄/굿즈/패키지/기타 통계 페이지에서 재사용)
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DateRangeFilter from './DateRangeFilter';
import { exportToCSV, formatCurrency } from '../../../utils/excelExport';
import { CHART_COLORS } from '../../../services/admin/statistics';

const BAR_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.teal,
  CHART_COLORS.gray,
];

/**
 * 상품 통계 공통 템플릿
 *
 * config 형태:
 * {
 *   title: string,                  // 페이지 제목
 *   fetchFn: async (params) => {},  // 데이터 조회 함수
 *   columns: [                      // 테이블 컬럼 정의
 *     { key: string, label: string, align: 'left'|'right'|'center', format?: fn }
 *   ],
 *   chartDataKey: string,           // 차트 Y축 키
 *   chartDataLabel: string,         // 차트 라벨 키
 *   chartValueFormat?: fn,          // 차트 값 포맷터
 * }
 */
const ProductStatsTemplate = ({ config }) => {
  const {
    title,
    fetchFn,
    columns = [],
    chartDataKey = 'revenue',
    chartDataLabel = 'product',
    chartValueFormat = formatCurrency,
  } = config;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchData = async (params = {}) => {
    setIsLoading(true);
    try {
      const result = await fetchFn(params);
      setData(result);
    } catch (err) {
      console.error('통계 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, []);

  const handleDateChange = (range) => {
    setDateRange(range);
    fetchData(range);
  };

  const handleExport = () => {
    if (!data?.byProduct) return;
    const exportColumns = columns.filter((c) => c.key !== 'share');
    exportToCSV(
      data.byProduct,
      exportColumns.map((c) => c.label),
      exportColumns.map((c) => c.key),
      title
    );
  };

  const chartData = (data?.byProduct ?? []).map((item) => ({
    name: item[chartDataLabel],
    [chartDataKey]: item[chartDataKey],
  }));

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">{title}</h2>
        <button
          type="button"
          onClick={handleExport}
          disabled={!data?.byProduct}
          className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors disabled:opacity-40"
        >
          CSV 내보내기
        </button>
      </div>

      {/* 기간 필터 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] px-5 py-4">
        <DateRangeFilter value={dateRange} onChange={handleDateChange} />
      </div>

      {/* 요약 카드 */}
      {data?.summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
            <p className="text-sm text-[--huni-fg-muted]">총 주문 수</p>
            <p className="text-2xl font-bold text-[--huni-fg-default] mt-1">
              {data.summary.totalOrders}건
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
            <p className="text-sm text-[--huni-fg-muted]">총 매출액</p>
            <p className="text-2xl font-bold text-[--huni-bg-brand] mt-1">
              {formatCurrency(data.summary.totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-4">
            <p className="text-sm text-[--huni-fg-muted]">평균 주문 금액</p>
            <p className="text-2xl font-bold text-[--huni-fg-default] mt-1">
              {formatCurrency(data.summary.avgOrderValue)}
            </p>
          </div>
        </div>
      )}

      {/* 차트 + 테이블 */}
      <div className="grid grid-cols-5 gap-5">
        {/* 차트 */}
        <div className="col-span-2 bg-white rounded-lg border border-[--huni-stroke-default] p-5">
          <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">상품별 분포</h3>
          {isLoading ? (
            <div className="h-52 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#979797' }} axisLine={{ stroke: '#CACACA' }} tickLine={false} />
                <YAxis tickFormatter={chartValueFormat} tick={{ fontSize: 11, fill: '#979797' }} axisLine={false} tickLine={false} width={55} />
                <Tooltip
                  formatter={(v) => [chartValueFormat(v), chartDataKey]}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #CACACA', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey={chartDataKey} radius={[4, 4, 0, 0]}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 테이블 */}
        <div className="col-span-3 bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
          <div className="px-5 py-4 border-b border-[--huni-stroke-default]">
            <h3 className="text-base font-semibold text-[--huni-fg-default]">상세 내역</h3>
          </div>
          {isLoading ? (
            <div className="h-52 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-4 py-3 font-medium text-[--huni-fg-default] ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.byProduct ?? []).map((row, idx) => (
                    <tr key={idx} className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50">
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-[--huni-fg-default] ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                        >
                          {col.format ? col.format(row[col.key]) : (row[col.key] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductStatsTemplate;
