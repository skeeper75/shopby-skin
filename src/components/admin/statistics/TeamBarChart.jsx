// @MX:NOTE: [AUTO] TeamBarChart - 팀별 통계 BarChart (recharts)
// @MX:SPEC: SPEC-SKIN-008

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CHART_COLORS } from '../../../services/admin/statistics';

const TEAM_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.teal,
];

/**
 * 팀별 통계 Bar Chart
 * @param {Object} props
 * @param {Object[]} props.data - [{team, value, label}]
 * @param {string} props.dataKey - Y축 데이터 키
 * @param {string} props.yLabel - Y축 단위 레이블
 * @param {function} props.formatValue - 값 포맷터
 * @param {number} props.height - 차트 높이
 */
const TeamBarChart = ({ data = [], dataKey = 'value', formatValue, height = 250 }) => {
  const formatter = formatValue ?? ((v) => v);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="team"
          tick={{ fontSize: 12, fill: '#979797' }}
          axisLine={{ stroke: '#CACACA' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatter}
          tick={{ fontSize: 12, fill: '#979797' }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip
          formatter={(value) => [formatter(value), dataKey]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #CACACA',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
          {data.map((_, idx) => (
            <Cell key={idx} fill={TEAM_COLORS[idx % TEAM_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamBarChart;
