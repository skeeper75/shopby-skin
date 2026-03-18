import { useState, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';

// @MX:NOTE: [AUTO] 후불 결제 관리 페이지 - 미결제/부분결제/결제완료 상태별 필터 및 결제 처리
// @MX:SPEC: SPEC-SKIN-005

// Mock 미결제 주문 데이터
const MOCK_DEFERRED_ORDERS = [
  {
    id: 1, orderNo: 'HP-2024-0010', orderDate: '2024-03-15',
    customerName: '김태호', phone: '010-2222-3333',
    productName: '명함 (양면 컬러)', totalPrice: 18000,
    paidAmount: 0, remainingAmount: 18000,
    paymentStatus: '미결제', dueDate: '2024-03-22',
  },
  {
    id: 2, orderNo: 'HP-2024-0011', orderDate: '2024-03-14',
    customerName: '(주)코리아테크', phone: '02-1234-5678',
    productName: '카탈로그 (A4 32페이지)', totalPrice: 350000,
    paidAmount: 175000, remainingAmount: 175000,
    paymentStatus: '부분결제', dueDate: '2024-03-21',
  },
  {
    id: 3, orderNo: 'HP-2024-0012', orderDate: '2024-03-13',
    customerName: '한국디자인', phone: '02-9876-5432',
    productName: '포스터 (A1) 100매', totalPrice: 250000,
    paidAmount: 0, remainingAmount: 250000,
    paymentStatus: '미결제', dueDate: '2024-03-20',
  },
  {
    id: 4, orderNo: 'HP-2024-0013', orderDate: '2024-03-12',
    customerName: '이미래', phone: '010-4444-5555',
    productName: '전단지 (A5 양면) 1000매', totalPrice: 65000,
    paidAmount: 65000, remainingAmount: 0,
    paymentStatus: '결제완료', dueDate: '2024-03-19',
  },
  {
    id: 5, orderNo: 'HP-2024-0014', orderDate: '2024-03-11',
    customerName: '스타트업허브', phone: '02-5555-6666',
    productName: '리플릿 (3단접지) 500매', totalPrice: 120000,
    paidAmount: 60000, remainingAmount: 60000,
    paymentStatus: '부분결제', dueDate: '2024-03-18',
  },
];

/**
 * 후불 결제 관리 페이지
 * - 미결제/부분결제/결제완료 주문 목록
 * - 결제 처리 액션 → PUT /admin/orders/{orderNo}/payment (Mock)
 */
const DeferredPaymentPage = () => {
  const [orders, setOrders] = useState(MOCK_DEFERRED_ORDERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('전체');

  // 필터링된 주문 목록
  const filteredOrders = useMemo(() => {
    if (statusFilter === '전체') return orders;
    return orders.filter((o) => o.paymentStatus === statusFilter);
  }, [orders, statusFilter]);

  // 결제 처리 핸들러
  // PUT /admin/orders/{orderNo}/payment (Mock)
  const handlePayment = useCallback((orderNo) => {
    const order = orders.find((o) => o.orderNo === orderNo);
    if (!order) return;

    const confirmed = window.confirm(
      `주문번호 ${orderNo}\n잔액: ${order.remainingAmount.toLocaleString()}원\n\n결제 처리하시겠습니까?`
    );
    if (!confirmed) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === orderNo
          ? {
              ...o,
              paidAmount: o.totalPrice,
              remainingAmount: 0,
              paymentStatus: '결제완료',
            }
          : o
      )
    );
    alert(`주문 ${orderNo}의 결제가 완료되었습니다. (Mock)`);
  }, [orders]);

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { key: 'orderNo', label: '주문번호', sortable: true, width: '140px' },
      { key: 'orderDate', label: '주문일', sortable: true, width: '110px' },
      { key: 'customerName', label: '주문자', sortable: true, width: '120px' },
      { key: 'productName', label: '상품명', sortable: false },
      {
        key: 'totalPrice',
        label: '총금액',
        sortable: true,
        width: '110px',
        render: (val) => `${Number(val).toLocaleString()}원`,
      },
      {
        key: 'paidAmount',
        label: '결제금액',
        sortable: true,
        width: '110px',
        render: (val) => `${Number(val).toLocaleString()}원`,
      },
      {
        key: 'remainingAmount',
        label: '잔액',
        sortable: true,
        width: '110px',
        render: (val) => (
          <span className={val > 0 ? 'text-red-500 font-medium' : 'text-[#979797]'}>
            {Number(val).toLocaleString()}원
          </span>
        ),
      },
      {
        key: 'paymentStatus',
        label: '결제상태',
        sortable: false,
        width: '100px',
        render: (val) => <StatusBadge status={val} />,
      },
      {
        key: 'dueDate',
        label: '납기일',
        sortable: true,
        width: '110px',
      },
      {
        key: 'action',
        label: '',
        sortable: false,
        width: '100px',
        render: (_, row) => {
          if (row.paymentStatus === '결제완료') return null;
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePayment(row.orderNo);
              }}
              className="h-[30px] px-3 bg-[#5538B6] text-white text-xs rounded hover:bg-[#4530A0] transition-colors"
            >
              결제처리
            </button>
          );
        },
      },
    ],
    [handlePayment]
  );

  // 요약 통계
  const summary = useMemo(() => {
    const unpaid = orders.filter((o) => o.paymentStatus === '미결제');
    const partial = orders.filter((o) => o.paymentStatus === '부분결제');
    const totalRemaining = orders.reduce((sum, o) => sum + o.remainingAmount, 0);
    return { unpaid: unpaid.length, partial: partial.length, totalRemaining };
  }, [orders]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <h1 className="text-xl font-bold text-[#424242]">후불 결제 관리</h1>

        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-[#CACACA] rounded-lg p-4">
            <p className="text-sm text-[#979797]">미결제</p>
            <p className="text-2xl font-bold text-[#E6B93F]">{summary.unpaid}건</p>
          </div>
          <div className="bg-white border border-[#CACACA] rounded-lg p-4">
            <p className="text-sm text-[#979797]">부분결제</p>
            <p className="text-2xl font-bold text-[#5538B6]">{summary.partial}건</p>
          </div>
          <div className="bg-white border border-[#CACACA] rounded-lg p-4">
            <p className="text-sm text-[#979797]">미수금 합계</p>
            <p className="text-2xl font-bold text-red-500">
              {summary.totalRemaining.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#979797]">결제상태</span>
          {['전체', '미결제', '부분결제', '결제완료'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`h-[32px] px-3 text-xs rounded border transition-colors ${
                statusFilter === s
                  ? 'bg-[#5538B6] text-white border-[#5538B6]'
                  : 'border-[#CACACA] text-[#424242] hover:bg-[#EEEBF9]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          pagination={{
            page: currentPage,
            pageSize: 10,
            total: filteredOrders.length,
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default DeferredPaymentPage;
