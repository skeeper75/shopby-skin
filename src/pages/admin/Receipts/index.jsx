import { useState, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';

// @MX:NOTE: [AUTO] 증빙 서류 관리 페이지 - 세금계산서/현금영수증/거래명세서 발급 처리
// @MX:SPEC: SPEC-SKIN-005

// 증빙 서류 타입
const RECEIPT_TYPES = ['전체', '세금계산서', '현금영수증', '거래명세서'];

// Mock 증빙 요청 데이터
const MOCK_RECEIPTS = [
  {
    id: 1, receiptNo: 'RCT-2024-001', orderNo: 'HP-2024-0002',
    customerName: '이영희', businessNo: '123-45-67890',
    type: '세금계산서', requestDate: '2024-03-15',
    amount: 45000, status: '대기',
  },
  {
    id: 2, receiptNo: 'RCT-2024-002', orderNo: 'HP-2024-0004',
    customerName: '최수연', businessNo: '',
    type: '현금영수증', requestDate: '2024-03-14',
    amount: 53000, status: '발급완료',
  },
  {
    id: 3, receiptNo: 'RCT-2024-003', orderNo: 'HP-2024-0011',
    customerName: '(주)코리아테크', businessNo: '987-65-43210',
    type: '세금계산서', requestDate: '2024-03-14',
    amount: 350000, status: '대기',
  },
  {
    id: 4, receiptNo: 'RCT-2024-004', orderNo: 'HP-2024-0012',
    customerName: '한국디자인', businessNo: '111-22-33333',
    type: '거래명세서', requestDate: '2024-03-13',
    amount: 250000, status: '대기',
  },
  {
    id: 5, receiptNo: 'RCT-2024-005', orderNo: 'HP-2024-0001',
    customerName: '김민수', businessNo: '',
    type: '현금영수증', requestDate: '2024-03-12',
    amount: 18000, status: '발급완료',
  },
];

/**
 * 증빙 서류 관리 페이지
 * - 세금계산서, 현금영수증, 거래명세서 요청 목록
 * - 발급 처리 액션 → PUT /admin/receipts/{id}/issue (Mock)
 */
const ReceiptsPage = () => {
  const [receipts, setReceipts] = useState(MOCK_RECEIPTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('전체');

  // 필터링된 목록
  const filteredReceipts = useMemo(() => {
    if (typeFilter === '전체') return receipts;
    return receipts.filter((r) => r.type === typeFilter);
  }, [receipts, typeFilter]);

  // 발급 처리 핸들러
  // PUT /admin/receipts/{id}/issue (Mock)
  const handleIssue = useCallback((receiptId) => {
    const receipt = receipts.find((r) => r.id === receiptId);
    if (!receipt) return;

    const confirmed = window.confirm(
      `증빙번호: ${receipt.receiptNo}\n주문번호: ${receipt.orderNo}\n유형: ${receipt.type}\n금액: ${receipt.amount.toLocaleString()}원\n\n발급 처리하시겠습니까?`
    );
    if (!confirmed) return;

    setReceipts((prev) =>
      prev.map((r) =>
        r.id === receiptId ? { ...r, status: '발급완료' } : r
      )
    );
    alert(`${receipt.type} (${receipt.receiptNo})가 발급 완료되었습니다. (Mock)`);
  }, [receipts]);

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { key: 'receiptNo', label: '증빙번호', sortable: true, width: '140px' },
      { key: 'orderNo', label: '주문번호', sortable: true, width: '140px' },
      { key: 'customerName', label: '요청자', sortable: true, width: '120px' },
      { key: 'type', label: '유형', sortable: false, width: '100px' },
      { key: 'requestDate', label: '요청일', sortable: true, width: '110px' },
      {
        key: 'amount',
        label: '금액',
        sortable: true,
        width: '120px',
        render: (val) => `${Number(val).toLocaleString()}원`,
      },
      {
        key: 'status',
        label: '상태',
        sortable: false,
        width: '100px',
        render: (val) => (
          <StatusBadge status={val === '발급완료' ? '완료' : '접수중'} />
        ),
      },
      {
        key: 'action',
        label: '',
        sortable: false,
        width: '90px',
        render: (_, row) => {
          if (row.status === '발급완료') return null;
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleIssue(row.id);
              }}
              className="h-[30px] px-3 bg-[#5538B6] text-white text-xs rounded hover:bg-[#4530A0] transition-colors"
            >
              발급
            </button>
          );
        },
      },
    ],
    [handleIssue]
  );

  // 대기 건수
  const pendingCount = useMemo(
    () => receipts.filter((r) => r.status === '대기').length,
    [receipts]
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#424242]">증빙 서류 관리</h1>
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center bg-[#5538B6] text-white text-xs font-semibold rounded-full px-2.5 py-0.5">
              {pendingCount}건 대기
            </span>
          )}
        </div>

        {/* 유형 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#979797]">유형</span>
          {RECEIPT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`h-[32px] px-3 text-xs rounded border transition-colors ${
                typeFilter === type
                  ? 'bg-[#5538B6] text-white border-[#5538B6]'
                  : 'border-[#CACACA] text-[#424242] hover:bg-[#EEEBF9]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={columns}
          data={filteredReceipts}
          pagination={{
            page: currentPage,
            pageSize: 10,
            total: filteredReceipts.length,
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default ReceiptsPage;
