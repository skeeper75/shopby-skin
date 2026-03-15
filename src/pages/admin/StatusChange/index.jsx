import { useState, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import BulkActionBar from '../../../components/admin/BulkActionBar';

// @MX:NOTE: [AUTO] 상태 변경 페이지 - 개별/일괄 상태 변경 + SMS 자동발송 연동
// @MX:SPEC: SPEC-SKIN-005

// @MX:NOTE: [AUTO] 주문 상태 흐름 정의 - 순차적 변경만 허용, 역방향 변경 불가
// 접수 → 파일확인 → 제작진행 → 제작완료 → 배송중 → 배송완료
const STATUS_FLOW = ['접수', '파일확인', '제작진행', '제작완료', '배송중', '배송완료'];

// @MX:NOTE: [AUTO] SMS 자동 발송 트리거 상태 - 제작진행/제작완료 변경 시 고객에게 알림 SMS 자동 발송
const AUTO_SMS_STATUSES = ['제작진행', '제작완료'];

// Mock 데이터
const MOCK_ORDERS = [
  { id: 1, orderNo: 'HP-2024-0001', customerName: '김민수', phone: '010-1234-5678', productName: '명함 (양면 컬러)', status: '접수', orderDate: '2024-03-15' },
  { id: 2, orderNo: 'HP-2024-0002', customerName: '이영희', phone: '010-9876-5432', productName: '전단지 (A4 양면)', status: '파일확인', orderDate: '2024-03-15' },
  { id: 3, orderNo: 'HP-2024-0003', customerName: '박준호', phone: '010-5555-1234', productName: '포스터 (B2)', status: '제작진행', orderDate: '2024-03-14' },
  { id: 4, orderNo: 'HP-2024-0004', customerName: '최수연', phone: '010-7777-8888', productName: '스티커 (원형 50mm)', status: '제작완료', orderDate: '2024-03-14' },
  { id: 5, orderNo: 'HP-2024-0005', customerName: '정다은', phone: '010-3333-4444', productName: '리플릿 (3단접지)', status: '배송중', orderDate: '2024-03-13' },
  { id: 6, orderNo: 'HP-2024-0006', customerName: '한지훈', phone: '010-1111-2222', productName: '봉투 (대봉투)', status: '접수', orderDate: '2024-03-13' },
];

/**
 * 주문 상태 변경 페이지
 * - 개별/일괄 상태 변경
 * - 상태 흐름: 접수 → 파일확인 → 제작진행 → 제작완료 → 배송중 → 배송완료
 * - 제작진행중/제작완료 변경 시 자동 SMS 발송 (Mock)
 */
const StatusChangePage = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 개별 상태 변경 핸들러
  // PUT /admin/orders/{orderNo}/status (Mock)
  const handleSingleStatusChange = useCallback(
    (orderNo, newStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.orderNo === orderNo ? { ...o, status: newStatus } : o))
      );

      // SMS 자동 발송 트리거
      if (AUTO_SMS_STATUSES.includes(newStatus)) {
        const order = orders.find((o) => o.orderNo === orderNo);
        console.log(`[Mock SMS] ${order?.customerName}(${order?.phone})에게 "${newStatus}" 알림 발송`);
        alert(`${order?.customerName}님에게 "${newStatus}" 알림 SMS가 발송되었습니다. (Mock)`);
      }
    },
    [orders]
  );

  // 일괄 상태 변경 핸들러
  // PUT /admin/orders/batch-status (Mock)
  const handleBulkStatusChange = useCallback(
    (newStatus) => {
      const targetOrderNos = selectedOrders.map((o) => o.orderNo);
      setOrders((prev) =>
        prev.map((o) =>
          targetOrderNos.includes(o.orderNo) ? { ...o, status: newStatus } : o
        )
      );

      // SMS 자동 발송 트리거
      if (AUTO_SMS_STATUSES.includes(newStatus)) {
        console.log(`[Mock SMS] ${selectedOrders.length}건 "${newStatus}" 알림 일괄 발송`);
        alert(`${selectedOrders.length}건의 주문에 "${newStatus}" 알림 SMS가 발송되었습니다. (Mock)`);
      }

      setSelectedOrders([]);
    },
    [selectedOrders]
  );

  // 현재 상태에서 다음 가능 상태 목록 반환
  const getNextStatuses = (currentStatus) => {
    const currentIdx = STATUS_FLOW.indexOf(currentStatus);
    if (currentIdx === -1 || currentIdx >= STATUS_FLOW.length - 1) return [];
    return STATUS_FLOW.slice(currentIdx + 1);
  };

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { key: 'orderNo', label: '주문번호', sortable: true, width: '140px' },
      { key: 'orderDate', label: '주문일', sortable: true, width: '110px' },
      { key: 'customerName', label: '주문자', sortable: true, width: '80px' },
      { key: 'productName', label: '상품명', sortable: false },
      {
        key: 'status',
        label: '현재 상태',
        sortable: false,
        width: '100px',
        render: (val) => <StatusBadge status={val} />,
      },
      {
        key: 'action',
        label: '상태 변경',
        sortable: false,
        width: '180px',
        render: (_, row) => {
          const nextStatuses = getNextStatuses(row.status);
          if (nextStatuses.length === 0) {
            return <span className="text-sm text-[#979797]">최종 상태</span>;
          }
          return (
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleSingleStatusChange(row.orderNo, e.target.value);
                  e.target.value = '';
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-[32px] px-2 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
            >
              <option value="">변경할 상태 선택</option>
              {nextStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          );
        },
      },
    ],
    [handleSingleStatusChange]
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <h1 className="text-xl font-bold text-[#424242]">상태 변경</h1>

        {/* 상태 흐름 안내 */}
        <div className="bg-[#F6F6F6] border border-[#CACACA] rounded-lg p-4">
          <p className="text-sm text-[#979797] mb-2">주문 상태 흐름</p>
          <div className="flex items-center gap-1 flex-wrap">
            {STATUS_FLOW.map((status, idx) => (
              <div key={status} className="flex items-center gap-1">
                <StatusBadge status={status} />
                {idx < STATUS_FLOW.length - 1 && (
                  <span className="text-[#979797] text-xs">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#979797] mt-2">
            * "제작진행", "제작완료" 상태 변경 시 고객에게 자동 SMS가 발송됩니다.
          </p>
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={columns}
          data={orders}
          selectable
          onSelectionChange={setSelectedOrders}
          pagination={{
            page: currentPage,
            pageSize: 10,
            total: orders.length,
          }}
          onPageChange={setCurrentPage}
        />

        {/* 일괄 액션 바 */}
        <BulkActionBar
          selectedCount={selectedOrders.length}
          visible={selectedOrders.length > 0}
          onStatusChange={handleBulkStatusChange}
          onClear={() => setSelectedOrders([])}
        />
      </div>
    </AdminLayout>
  );
};

export default StatusChangePage;
