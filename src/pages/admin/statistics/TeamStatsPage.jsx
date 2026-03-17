// @MX:NOTE: [AUTO] TeamStatsPage - 팀별 통계 페이지
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import TeamBarChart from '../../../components/admin/statistics/TeamBarChart';
import DateRangeFilter from '../../../components/admin/statistics/DateRangeFilter';
import { getTeamStats } from '../../../services/admin/statistics';
import { formatCurrency } from '../../../utils/excelExport';

/**
 * 팀별 통계 페이지
 */
const TeamStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchData = async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await getTeamStats(params);
      setStats(data);
    } catch (err) {
      console.error('팀별 통계 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 영업팀 차트 데이터
  const salesChartData = stats
    .filter((s) => s.revenue > 0)
    .map((s) => ({ team: s.team, revenue: s.revenue }));

  // 주문/처리 차트 데이터
  const ordersChartData = stats
    .filter((s) => s.orders > 0)
    .map((s) => ({ team: s.team, orders: s.orders }));

  return (
    <div className="space-y-5" style={{ minWidth: 1280 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]">팀별 통계</h2>
        <DateRangeFilter value={dateRange} onChange={(r) => { setDateRange(r); fetchData(r); }} />
      </div>

      {/* 팀별 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((team) => (
          <div key={team.team} className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
            <h3 className="text-sm font-semibold text-[--huni-bg-brand] mb-3">{team.team}</h3>
            <div className="space-y-2 text-sm">
              {team.orders > 0 && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">주문 처리</span>
                  <span className="font-medium text-[--huni-fg-default]">{team.orders}건</span>
                </div>
              )}
              {team.revenue > 0 && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">매출</span>
                  <span className="font-medium text-[--huni-bg-brand]">{formatCurrency(team.revenue)}</span>
                </div>
              )}
              {team.newVendors != null && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">신규 거래처</span>
                  <span className="font-medium text-[--huni-fg-default]">{team.newVendors}개</span>
                </div>
              )}
              {team.completionRate != null && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">완료율</span>
                  <span className="font-medium text-[#00C853]">{team.completionRate}%</span>
                </div>
              )}
              {team.satisfaction != null && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">만족도</span>
                  <span className="font-medium text-[#E6B93F]">⭐ {team.satisfaction}</span>
                </div>
              )}
              {team.onTimeRate != null && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">정시 배송률</span>
                  <span className="font-medium text-[#00C853]">{team.onTimeRate}%</span>
                </div>
              )}
              {team.resolveRate != null && (
                <div className="flex justify-between">
                  <span className="text-[--huni-fg-muted]">해결률</span>
                  <span className="font-medium text-[#00C853]">{team.resolveRate}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 차트 2개 */}
      <div className="grid grid-cols-2 gap-5">
        {/* 팀별 매출 */}
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
          <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">팀별 매출</h3>
          {isLoading ? (
            <div className="h-56 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
          ) : (
            <TeamBarChart
              data={salesChartData}
              dataKey="revenue"
              formatValue={(v) => `${(v / 10000).toFixed(0)}만`}
              height={240}
            />
          )}
        </div>

        {/* 팀별 주문 처리 */}
        <div className="bg-white rounded-lg border border-[--huni-stroke-default] p-5">
          <h3 className="text-base font-semibold text-[--huni-fg-default] mb-4">팀별 주문 처리</h3>
          {isLoading ? (
            <div className="h-56 flex items-center justify-center text-[--huni-fg-muted] text-sm">로딩 중...</div>
          ) : (
            <TeamBarChart
              data={ordersChartData}
              dataKey="orders"
              formatValue={(v) => `${v}건`}
              height={240}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamStatsPage;
