// @MX:ANCHOR: [AUTO] KpiCard - KPI 카드 컴포넌트 (아이콘+수치+증감율)
// @MX:REASON: [AUTO] fan_in >= 3 (DashboardPage, SalesPage 등 다수 사용)
// @MX:SPEC: SPEC-SKIN-008

import { cn } from '../../../lib/utils';

/**
 * KPI 카드 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 카드 제목
 * @param {string|number} props.value - 주요 수치 (이미 포맷된 문자열 또는 숫자)
 * @param {number} props.change - 증감율 (%, 양수=증가 음수=감소)
 * @param {'up'|'down'} props.trend - 추세 방향
 * @param {React.ReactNode} props.icon - 아이콘 엘리먼트
 * @param {string} props.iconColor - 아이콘 배경 색상 (Tailwind 클래스)
 * @param {boolean} props.invertColor - 감소가 긍정인 경우 (예: 미수금)
 */
const KpiCard = ({
  title,
  value,
  change,
  trend,
  icon,
  iconColor = 'bg-[#EDE9FA]',
  invertColor = false,
  className,
}) => {
  // 증감율 색상 결정 (invertColor: 감소가 좋은 경우)
  const isPositive = invertColor ? trend === 'down' : trend === 'up';
  const changeColor = change === 0 ? 'text-[--huni-fg-muted]' : isPositive ? 'text-[#00C853]' : 'text-[#F44336]';
  const absChange = Math.abs(change ?? 0);

  return (
    <div className={cn('bg-white rounded-lg border border-[--huni-stroke-default] p-5', className)}>
      <div className="flex items-start justify-between">
        {/* 아이콘 */}
        <div className={cn('w-11 h-11 rounded-lg flex items-center justify-center text-[--huni-bg-brand]', iconColor)}>
          {icon}
        </div>

        {/* 증감율 */}
        {change != null && (
          <div className={cn('flex items-center gap-0.5 text-sm font-medium', changeColor)}>
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{absChange}%</span>
          </div>
        )}
      </div>

      {/* 수치 */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-[--huni-fg-default] leading-none">{value}</p>
        <p className="text-sm text-[--huni-fg-muted] mt-1">{title}</p>
      </div>
    </div>
  );
};

export default KpiCard;
