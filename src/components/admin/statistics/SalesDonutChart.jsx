// @MX:NOTE: [AUTO] SalesDonutChart - 카테고리별 DonutChart (recharts)
// @MX:SPEC: SPEC-SKIN-008

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/** 커스텀 라벨 */
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/** 커스텀 툴팁 */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: item } = payload[0];

  return (
    <div className="bg-white border border-[--huni-stroke-default] rounded-lg p-3 shadow-lg text-sm">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-semibold text-[--huni-fg-default]">{name}</span>
      </div>
      <p className="mt-1 text-[--huni-fg-default]">
        {new Intl.NumberFormat('ko-KR').format(value)}원
      </p>
    </div>
  );
};

/**
 * 카테고리별 Donut Chart
 * @param {Object} props
 * @param {Object[]} props.data - [{name, value, color}]
 * @param {number} props.height - 차트 높이
 */
const SalesDonutChart = ({ data = [], height = 280 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="72%"
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#424242' }}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesDonutChart;
