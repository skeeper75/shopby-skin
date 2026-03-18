// @MX:NOTE: [AUTO] 통계 API 서비스 - 목업 데이터 사용
// @MX:SPEC: SPEC-SKIN-008
// TODO: 실제 API 연동 시 fetchHttpRequest로 교체

/** Huni 차트 색상 팔레트 */
export const CHART_COLORS = {
  primary: '#5538B6',
  secondary: '#9580D9',
  accent: '#E6B93F',
  teal: '#7AC8C4',
  gray: '#CACACA',
};

/** 목업 대시보드 KPI 데이터 */
const MOCK_KPI = {
  totalSales: { value: 45820000, change: 12.5, trend: 'up' },
  totalOrders: { value: 328, change: 8.2, trend: 'up' },
  newVendors: { value: 12, change: -3.1, trend: 'down' },
  pendingReceivables: { value: 3200000, change: -15.4, trend: 'down' },
};

/** 목업 월별 매출 데이터 (최근 12개월) */
const MOCK_MONTHLY_SALES = [
  { month: '2025-04', label: '25.4월', print: 3200000, goods: 800000, package: 450000, total: 4450000 },
  { month: '2025-05', label: '25.5월', print: 3500000, goods: 950000, package: 500000, total: 4950000 },
  { month: '2025-06', label: '25.6월', print: 2800000, goods: 700000, package: 380000, total: 3880000 },
  { month: '2025-07', label: '25.7월', print: 3100000, goods: 850000, package: 420000, total: 4370000 },
  { month: '2025-08', label: '25.8월', print: 3600000, goods: 1000000, package: 550000, total: 5150000 },
  { month: '2025-09', label: '25.9월', print: 3300000, goods: 900000, package: 480000, total: 4680000 },
  { month: '2025-10', label: '25.10월', print: 3800000, goods: 1100000, package: 600000, total: 5500000 },
  { month: '2025-11', label: '25.11월', print: 4200000, goods: 1200000, package: 650000, total: 6050000 },
  { month: '2025-12', label: '25.12월', print: 5100000, goods: 1500000, package: 800000, total: 7400000 },
  { month: '2026-01', label: '26.1월', print: 3900000, goods: 1000000, package: 520000, total: 5420000 },
  { month: '2026-02', label: '26.2월', print: 3700000, goods: 950000, package: 490000, total: 5140000 },
  { month: '2026-03', label: '26.3월', print: 4100000, goods: 1150000, package: 570000, total: 5820000 },
];

/** 목업 카테고리별 매출 도넛 데이터 */
const MOCK_CATEGORY_SALES = [
  { name: '명함', value: 1850000, color: '#5538B6' },
  { name: '전단지', value: 1200000, color: '#9580D9' },
  { name: '리플릿', value: 980000, color: '#E6B93F' },
  { name: '포스터', value: 750000, color: '#7AC8C4' },
  { name: '기타', value: 1040000, color: '#CACACA' },
];

/** 목업 일별 추이 데이터 (이번달) */
const generateDailyData = () => {
  const data = [];
  for (let i = 1; i <= 17; i++) {
    data.push({
      day: `3/${i}`,
      orders: Math.floor(Math.random() * 20) + 5,
      sales: Math.floor(Math.random() * 800000) + 200000,
    });
  }
  return data;
};
const MOCK_DAILY_DATA = generateDailyData();

/** 목업 인쇄 통계 */
const MOCK_PRINT_STATS = {
  summary: { totalOrders: 185, totalRevenue: 28500000, avgOrderValue: 154054 },
  byProduct: [
    { product: '명함', orders: 65, revenue: 9750000, share: 34.2 },
    { product: '전단지', orders: 42, revenue: 6300000, share: 22.1 },
    { product: '리플릿', orders: 35, revenue: 5250000, share: 18.4 },
    { product: '포스터', orders: 25, revenue: 3750000, share: 13.2 },
    { product: '기타', orders: 18, revenue: 3450000, share: 12.1 },
  ],
};

/** 목업 굿즈 통계 */
const MOCK_GOODS_STATS = {
  summary: { totalOrders: 98, totalRevenue: 14700000, avgOrderValue: 150000 },
  byProduct: [
    { product: '머그컵', orders: 30, revenue: 4500000, share: 30.6 },
    { product: '에코백', orders: 25, revenue: 3750000, share: 25.5 },
    { product: '스티커', orders: 28, revenue: 2800000, share: 19.0 },
    { product: '노트', orders: 15, revenue: 3650000, share: 24.8 },
  ],
};

/** 목업 패키지 통계 */
const MOCK_PACKAGE_STATS = {
  summary: { totalOrders: 45, totalRevenue: 6750000, avgOrderValue: 150000 },
  byProduct: [
    { product: '박스', orders: 20, revenue: 3000000, share: 44.4 },
    { product: '봉투', orders: 15, revenue: 1875000, share: 27.8 },
    { product: '쇼핑백', orders: 10, revenue: 1875000, share: 27.8 },
  ],
};

/** 목업 팀별 통계 */
const MOCK_TEAM_STATS = [
  { team: '영업팀', orders: 145, revenue: 21750000, newVendors: 5, satisfaction: 4.5 },
  { team: '제작팀', orders: 185, revenue: 0, completionRate: 94.6, avgLeadTime: 2.3 },
  { team: 'CS팀', orders: 0, revenue: 0, inquiries: 68, resolveRate: 97.1, avgResolveDays: 0.8 },
  { team: '배송팀', orders: 175, revenue: 0, onTimeRate: 98.3, returnRate: 0.6, avgDays: 1.2 },
];

/** 목업 정산 데이터 */
const MOCK_SETTLEMENT = [
  { id: 1, vendorName: '대한종이공업', type: '원자재', orderDate: '2026-03-01', amount: 850000, status: '미정산', dueDate: '2026-03-31' },
  { id: 2, vendorName: '프린텍코리아', type: '외주인쇄', orderDate: '2026-03-05', amount: 350000, status: '정산완료', dueDate: '2026-03-15', settledDate: '2026-03-14' },
  { id: 3, vendorName: '글로벌패키지', type: '포장재', orderDate: '2026-03-08', amount: 220000, status: '미정산', dueDate: '2026-03-31' },
];

/**
 * 대시보드 KPI 조회
 * @param {Object} params - 기간 필터
 * @returns {Promise<Object>}
 */
export const getDashboardKpi = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return { ...MOCK_KPI };
};

/**
 * 월별 매출 통계 조회
 * @param {Object} params - 기간 필터
 * @returns {Promise<Object[]>}
 */
export const getMonthlySales = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return [...MOCK_MONTHLY_SALES];
};

/**
 * 카테고리별 매출 도넛 데이터 조회
 * @param {Object} params
 * @returns {Promise<Object[]>}
 */
export const getCategorySales = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 150));
  return [...MOCK_CATEGORY_SALES];
};

/**
 * 일별 추이 데이터 조회
 * @param {Object} params
 * @returns {Promise<Object[]>}
 */
export const getDailySales = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 150));
  return [...MOCK_DAILY_DATA];
};

/**
 * 인쇄 통계 조회
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const getPrintStats = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return { ...MOCK_PRINT_STATS };
};

/**
 * 굿즈 통계 조회
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const getGoodsStats = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return { ...MOCK_GOODS_STATS };
};

/**
 * 패키지 통계 조회
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const getPackageStats = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return { ...MOCK_PACKAGE_STATS };
};

/**
 * 팀별 통계 조회
 * @param {Object} params
 * @returns {Promise<Object[]>}
 */
export const getTeamStats = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return [...MOCK_TEAM_STATS];
};

/**
 * 굿즈 발주/정산 목록 조회
 * @param {Object} params
 * @returns {Promise<Object[]>}
 */
export const getSettlements = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return [...MOCK_SETTLEMENT];
};
