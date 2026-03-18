// @MX:NOTE: [AUTO] DailyLineChart - 일별 추이 LineChart (recharts)
// @MX:SPEC: SPEC-SKIN-008

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../../services/admin/statistics';

/** 커스텀 툴팁 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-[--huni-stroke-default] rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-[--huni-fg-default] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-[--huni-fg-muted]">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-medium text-[--huni-fg-default]">
            {entry.dataKey === 'sales'
              ? `${new Intl.NumberFormat('ko-KR').format(entry.value)}원`
              : `${entry.value}건`}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * 일별 추이 Line Chart
 * @param {Object} props
 * @param {Object[]} props.data - [{day, orders, sales}]
 * @param {number} props.height - 차트 높이
 */
const DailyLineChart = ({ data = [], height = 280 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: '#979797' }}
          axisLine={{ stroke: '#CACACA' }}
          tickLine={false}
        />
        <YAxis
          yAxisId="orders"
          orientation="left"
          tick={{ fontSize: 11, fill: '#979797' }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <YAxis
          yAxisId="sales"
          orientation="right"
          tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
          tick={{ fontSize: 11, fill: '#979797' }}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#424242', paddingTop: 8 }} />
        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          name="주문 수"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.primary }}
          activeDot={{ r: 5 }}
        />
        <Line
          yAxisId="sales"
          type="monotone"
          dataKey="sales"
          name="매출액"
          stroke={CHART_COLORS.accent}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.accent }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DailyLineChart;
