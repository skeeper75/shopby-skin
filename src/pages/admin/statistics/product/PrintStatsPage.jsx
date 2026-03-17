// @MX:NOTE: [AUTO] PrintStatsPage - 인쇄 통계 페이지
// @MX:SPEC: SPEC-SKIN-008

import ProductStatsTemplate from '../../../../components/admin/statistics/ProductStatsTemplate';
import { getPrintStats } from '../../../../services/admin/statistics';
import { formatCurrency } from '../../../../utils/excelExport';

/** 인쇄 통계 컬럼 정의 */
const COLUMNS = [
  { key: 'product', label: '상품명', align: 'left' },
  { key: 'orders', label: '주문 수', align: 'center', format: (v) => `${v}건` },
  { key: 'revenue', label: '매출액', align: 'right', format: formatCurrency },
  { key: 'share', label: '비율', align: 'center', format: (v) => `${v}%` },
];

const config = {
  title: '인쇄 통계',
  fetchFn: getPrintStats,
  columns: COLUMNS,
  chartDataKey: 'revenue',
  chartDataLabel: 'product',
  chartValueFormat: (v) => `${(v / 10000).toFixed(0)}만`,
};

const PrintStatsPage = () => <ProductStatsTemplate config={config} />;

export default PrintStatsPage;
