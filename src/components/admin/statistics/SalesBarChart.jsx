// @MX:NOTE: [AUTO] SalesBarChart - 월별 매출 BarChart (recharts)
// @MX:SPEC: SPEC-SKIN-008

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../../services/admin/statistics';

/** 금액 축 포맷터 (만원 단위) */
const formatYAxis = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}백만`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
  return value;
};

/** 툴팁 포맷터 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);

  return (
    <div className="bg-white border border-[--huni-stroke-default] rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-[--huni-fg-default] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-[--huni-fg-muted]">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}:</span>
          <span className="font-medium text-[--huni-fg-default]">
            {new Intl.NumberFormat('ko-KR').format(entry.value)}원
          </span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-[--huni-stroke-default] flex justify-between">
        <span className="text-[--huni-fg-muted]">합계:</span>
        <span className="font-bold text-[--huni-fg-default]">
          {new Intl.NumberFormat('ko-KR').format(total)}원
        </span>
      </div>
    </div>
  );
};

/**
 * 월별 매출 BarChart
 * @param {Object} props
 * @param {Object[]} props.data - 차트 데이터
 * @param {number} props.height - 차트 높이
 * @param {boolean} props.stacked - 스택 바 여부
 */
const SalesBarChart = ({ data = [], height = 320, stacked = true }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#979797' }}
          axisLine={{ stroke: '#CACACA' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fontSize: 12, fill: '#979797' }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#424242', paddingTop: 8 }}
        />
        <Bar
          dataKey="print"
          name="인쇄"
          fill={CHART_COLORS.primary}
          stackId={stacked ? 'a' : undefined}
          radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
        />
        <Bar
          dataKey="goods"
          name="굿즈"
          fill={CHART_COLORS.secondary}
          stackId={stacked ? 'a' : undefined}
          radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
        />
        <Bar
          dataKey="package"
          name="패키지"
          fill={CHART_COLORS.teal}
          stackId={stacked ? 'a' : undefined}
          radius={stacked ? [4, 4, 0, 0] : [4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesBarChart;
