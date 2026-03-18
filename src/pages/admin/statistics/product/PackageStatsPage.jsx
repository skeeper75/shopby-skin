// @MX:NOTE: [AUTO] PackageStatsPage - 패키지 통계 페이지
// @MX:SPEC: SPEC-SKIN-008

import ProductStatsTemplate from '../../../../components/admin/statistics/ProductStatsTemplate';
import { getPackageStats } from '../../../../services/admin/statistics';
import { formatCurrency } from '../../../../utils/excelExport';

const COLUMNS = [
  { key: 'product', label: '상품명', align: 'left' },
  { key: 'orders', label: '주문 수', align: 'center', format: (v) => `${v}건` },
  { key: 'revenue', label: '매출액', align: 'right', format: formatCurrency },
  { key: 'share', label: '비율', align: 'center', format: (v) => `${v}%` },
];

const config = {
  title: '패키지 통계',
  fetchFn: getPackageStats,
  columns: COLUMNS,
  chartDataKey: 'revenue',
  chartDataLabel: 'product',
  chartValueFormat: (v) => `${(v / 10000).toFixed(0)}만`,
};

const PackageStatsPage = () => <ProductStatsTemplate config={config} />;

export default PackageStatsPage;
