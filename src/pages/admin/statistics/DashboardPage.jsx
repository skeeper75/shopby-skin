// @MX:NOTE: [AUTO] DashboardPage - 통계 대시보드 (4 KPI + 3 charts)
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import KpiCard from '../../../components/admin/statistics/KpiCard';
import SalesBarChart from '../../../components/admin/statistics/SalesBarChart';
import SalesDonutChart from '../../../components/admin/statistics/SalesDonutChart';
import DailyLineChart from '../../../components/admin/statistics/DailyLineChart';
import DateRangeFilter from '../../../components/admin/statistics/DateRangeFilter';
import {
  getDashboardKpi,
  getMonthlySales,
  getCategorySales,
  getDailySales,
} from '../../../services/admin/statistics';
import { formatCurrency } from '../../../utils/excelExport';

/**
 * 통계 대시보드 페이지
 */
const DashboardPage = () => {
  const [kpi, setKpi] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchAll = async (params = {}) => {
    setIsLoading(true);
    try {
      const [kpiData, monthly, category, daily] = await Promise.all([
        getDashboardKpi(params),
        getMonthlySales(params),
        getCategorySales(params),
        getDailySales(params),
      ]);
      setKpi(kpiData);
      setMonthlySales(monthly);
      setCategorySales(category);
      setDailySales(daily);
    } catch (err) {
      console.error('대시보드 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDateChange = (range) => {
    setDateRange(range);
    fetchAll(range);
  };

  return (
    <div className="space-y-6" style={{ minWidth: 1280 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">통계 대시보드</h2>
        <DateRangeFilter value={dateRange} onChange={handleDateChange} />
      </div>

      {/* KPI 카드 4개 */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          title="총 매출액"
          value={kpi ? formatCurrency(kpi.totalSales.value) : '-'}
          change={kpi?.totalSales.change}
          trend={kpi?.totalSales.trend}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title="총 주문 수"
          value={kpi ? `${kpi.totalOrders.value}건` : '-'}
          change={kpi?.totalOrders.change}
          trend={kpi?.totalOrders.trend}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          iconColor="bg-[#E3F2FD]"
        />
        <KpiCard
          title="신규 거래처"
          value={kpi ? `${kpi.newVendors.value}개` : '-'}
          change={kpi?.newVendors.change}
          trend={kpi?.newVendors.trend}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          iconColor="bg-[#E8F5E9]"
        />
        <KpiCard
          title="미수금"
          value={kpi ? formatCurrency(kpi.pendingReceivables.value) : '-'}
          change={kpi?.pendingReceivables.change}
          trend={kpi?.pendingReceivables.trend}
          invertColor={true}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          iconColor="bg-[#FFF3E0]"
        />
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-3 gap-5">
        {/* 월별 매출 BarChart (2/3) */}
        <div className="col-span-2 bg-white rounded-lg border border-[--huni-stroke-default] p-5">
          <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">월별 매출 추이</h3>
          {isLoading ? (
            <div className="h-72 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
          ) : (
            <SalesBarChart data={monthlySales} height={300} />
          )}
        </div>

        {/* 카테고리별 Donut (1/3) */}
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
          <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">카테고리별 비율</h3>
          {isLoading ? (
            <div className="h-72 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
          ) : (
            <SalesDonutChart data={categorySales} height={300} />
          )}
        </div>
      </div>

      {/* 일별 추이 LineChart */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
        <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">이번 달 일별 추이</h3>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
        ) : (
          <DailyLineChart data={dailySales} height={260} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
