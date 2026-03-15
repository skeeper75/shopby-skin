import { useState, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import SearchBar from '../../../components/admin/SearchBar';
import DatePicker from '../../../components/admin/DatePicker';
import StatusBadge from '../../../components/admin/StatusBadge';
import BulkActionBar from '../../../components/admin/BulkActionBar';
import OrderDetailPanel from '../../../components/admin/OrderDetailPanel';

// @MX:NOTE: [AUTO] 주문 목록 Mock 데이터 - 후니프린팅 컨텍스트
const MOCK_ORDERS = [
  {
    id: 1, orderNo: 'HP-2024-0001', orderDate: '2024-03-15 14:30',
    customerName: '김민수', phone: '010-1234-5678', email: 'minsu@example.com',
    productName: '명함 (양면 컬러)', option: '아트지 250g / 200매', quantity: 1,
    category: '명함', status: '접수중', productPrice: 15000, shippingFee: 3000, totalPrice: 18000,
    receiverName: '김민수', receiverPhone: '010-1234-5678', address: '서울시 강남구 테헤란로 123 4층',
    deliveryMemo: '부재 시 경비실에 맡겨주세요', paymentMethod: '카드결제',
    files: [{ name: '명함_디자인_최종.pdf', size: '2.4MB', uploadDate: '2024-03-15', url: '#', type: 'application/pdf' }],
  },
  {
    id: 2, orderNo: 'HP-2024-0002', orderDate: '2024-03-15 15:10',
    customerName: '이영희', phone: '010-9876-5432', email: 'younghee@example.com',
    productName: '전단지 (A4 양면)', option: '스노우지 150g / 500매', quantity: 1,
    category: '전단지', status: '제작중', productPrice: 45000, shippingFee: 0, totalPrice: 45000,
    receiverName: '이영희', receiverPhone: '010-9876-5432', address: '경기도 성남시 분당구 판교로 456',
    deliveryMemo: '', paymentMethod: '무통장입금',
    files: [{ name: '전단지_앞면.ai', size: '15.2MB', uploadDate: '2024-03-15', url: '#', type: 'image/png' }],
  },
  {
    id: 3, orderNo: 'HP-2024-0003', orderDate: '2024-03-14 09:45',
    customerName: '박준호', phone: '010-5555-1234', email: 'junho@example.com',
    productName: '포스터 (B2)', option: '유포지 200g / 10매', quantity: 1,
    category: '포스터', status: '배송중', productPrice: 35000, shippingFee: 5000, totalPrice: 40000,
    receiverName: '박준호', receiverPhone: '010-5555-1234', address: '부산시 해운대구 센텀로 789',
    deliveryMemo: '문 앞에 놓아주세요', paymentMethod: '카드결제', trackingNumber: '1234567890',
    files: [],
  },
  {
    id: 4, orderNo: 'HP-2024-0004', orderDate: '2024-03-14 11:20',
    customerName: '최수연', phone: '010-7777-8888', email: 'sooyeon@example.com',
    productName: '스티커 (원형 50mm)', option: '아트지 / 1000매', quantity: 2,
    category: '스티커', status: '완료', productPrice: 25000, shippingFee: 3000, totalPrice: 53000,
    receiverName: '최수연', receiverPhone: '010-7777-8888', address: '대전시 유성구 대학로 101',
    deliveryMemo: '', paymentMethod: '카드결제',
    files: [{ name: '스티커_로고.png', size: '1.1MB', uploadDate: '2024-03-14', url: '#', type: 'image/png' }],
  },
  {
    id: 5, orderNo: 'HP-2024-0005', orderDate: '2024-03-13 16:00',
    customerName: '정다은', phone: '010-3333-4444', email: 'daeun@example.com',
    productName: '리플릿 (3단접지)', option: '아트지 180g / 300매', quantity: 1,
    category: '리플릿', status: '접수중', productPrice: 55000, shippingFee: 0, totalPrice: 55000,
    receiverName: '정다은', receiverPhone: '010-3333-4444', address: '인천시 연수구 컨벤시아대로 55',
    deliveryMemo: '오후 2시 이후 배송 요청', paymentMethod: '무통장입금',
    files: [{ name: '리플릿_시안.pdf', size: '8.7MB', uploadDate: '2024-03-13', url: '#', type: 'application/pdf' }],
  },
  {
    id: 6, orderNo: 'HP-2024-0006', orderDate: '2024-03-13 10:30',
    customerName: '한지훈', phone: '010-1111-2222', email: 'jihoon@example.com',
    productName: '봉투 (대봉투)', option: '백상지 120g / 500매', quantity: 1,
    category: '봉투', status: '제작중', productPrice: 32000, shippingFee: 3000, totalPrice: 35000,
    receiverName: '한지훈', receiverPhone: '010-1111-2222', address: '서울시 마포구 양화로 200',
    deliveryMemo: '', paymentMethod: '카드결제',
    files: [],
  },
];

// 상태 필터 옵션
const STATUS_OPTIONS = ['전체', '접수중', '제작중', '배송중', '완료'];

// 카테고리 필터 옵션
const CATEGORY_OPTIONS = ['전체', '명함', '전단지', '포스터', '스티커', '리플릿', '봉투', '기타'];

// 검색 대상 옵션
const SEARCH_TARGET_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'orderNo', label: '주문번호' },
  { value: 'customerName', label: '주문자명' },
  { value: 'productName', label: '상품명' },
];

/**
 * 주문 관리 메인 페이지
 * - 주문 목록 DataTable, 검색, 필터, 페이지네이션
 * - 체크박스 다중 선택, 일괄 작업
 * - Excel 다운로드 (placeholder)
 */
const OrdersPage = () => {
  // 필터 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTarget, setSearchTarget] = useState('all');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // 테이블 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const pageSize = 10;

  // 데이터 필터링
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      // 검색어 필터
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        if (searchTarget === 'orderNo' && !order.orderNo.toLowerCase().includes(keyword)) return false;
        if (searchTarget === 'customerName' && !order.customerName.toLowerCase().includes(keyword)) return false;
        if (searchTarget === 'productName' && !order.productName.toLowerCase().includes(keyword)) return false;
        if (searchTarget === 'all') {
          const matchAny = [order.orderNo, order.customerName, order.productName]
            .some((v) => v.toLowerCase().includes(keyword));
          if (!matchAny) return false;
        }
      }

      // 상태 필터
      if (statusFilter !== '전체' && order.status !== statusFilter) return false;

      // 카테고리 필터
      if (categoryFilter !== '전체' && order.category !== categoryFilter) return false;

      // 기간 필터
      if (dateRange.startDate) {
        const orderDate = order.orderDate.split(' ')[0];
        if (orderDate < dateRange.startDate) return false;
      }
      if (dateRange.endDate) {
        const orderDate = order.orderDate.split(' ')[0];
        if (orderDate > dateRange.endDate) return false;
      }

      return true;
    });
  }, [searchKeyword, searchTarget, statusFilter, categoryFilter, dateRange]);

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { key: 'orderNo', label: '주문번호', sortable: true, width: '140px' },
      { key: 'orderDate', label: '주문일시', sortable: true, width: '140px' },
      { key: 'customerName', label: '주문자', sortable: true, width: '80px' },
      { key: 'productName', label: '상품명', sortable: false },
      { key: 'option', label: '옵션', sortable: false, width: '160px' },
      { key: 'quantity', label: '수량', sortable: true, width: '60px' },
      {
        key: 'totalPrice',
        label: '결제금액',
        sortable: true,
        width: '100px',
        render: (val) => `${Number(val).toLocaleString()}원`,
      },
      {
        key: 'status',
        label: '상태',
        sortable: false,
        width: '90px',
        render: (val) => <StatusBadge status={val} />,
      },
    ],
    []
  );

  // 행 클릭 → 상세 패널 열기
  const handleRowClick = useCallback((order) => {
    setDetailOrder(order);
  }, []);

  // Excel 다운로드 (placeholder)
  const handleExcelDownload = useCallback(() => {
    alert('Excel 다운로드 기능은 추후 구현 예정입니다.');
  }, []);

  // 일괄 상태 변경
  const handleBulkStatusChange = useCallback((newStatus) => {
    alert(`${selectedOrders.length}건의 주문 상태를 "${newStatus}"(으)로 변경합니다. (Mock)`);
    setSelectedOrders([]);
  }, [selectedOrders]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#424242]">주문 관리</h1>
          <button
            type="button"
            onClick={handleExcelDownload}
            className="h-[36px] px-4 border border-[#CACACA] text-[#424242] text-sm rounded hover:bg-[#F6F6F6] transition-colors"
          >
            Excel 다운로드
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white border border-[#CACACA] rounded-lg p-4 space-y-3">
          {/* 검색 */}
          <div className="flex items-center gap-2">
            <select
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              className="h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
            >
              {SEARCH_TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <SearchBar
              placeholder="검색어를 입력하세요"
              onSearch={setSearchKeyword}
              className="flex-1"
            />
          </div>

          {/* 기간 + 상태 + 카테고리 */}
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker onChange={setDateRange} />

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#979797]">상태</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#979797]">카테고리</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 결과 요약 */}
        <div className="text-sm text-[#979797]">
          총 <span className="font-semibold text-[#424242]">{filteredOrders.length}</span>건
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          selectable
          onSelectionChange={setSelectedOrders}
          pagination={{
            page: currentPage,
            pageSize,
            total: filteredOrders.length,
          }}
          onPageChange={setCurrentPage}
          onRowClick={handleRowClick}
        />

        {/* 일괄 액션 바 */}
        <BulkActionBar
          selectedCount={selectedOrders.length}
          visible={selectedOrders.length > 0}
          onStatusChange={handleBulkStatusChange}
          onPrint={() => alert('선택된 주문서를 출력합니다. (Mock)')}
          onSms={() => alert('선택된 고객에게 SMS를 발송합니다. (Mock)')}
          onClear={() => setSelectedOrders([])}
        />

        {/* 주문 상세 패널 */}
        <OrderDetailPanel
          order={detailOrder}
          isOpen={!!detailOrder}
          onClose={() => setDetailOrder(null)}
          onStatusChange={(order) => alert(`상태 변경: ${order.orderNo} (Mock)`)}
          onFileCheck={(order) => alert(`파일 확인: ${order.orderNo} (Mock)`)}
          onPrint={(order) => alert(`주문서 출력: ${order.orderNo} (Mock)`)}
        />
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
