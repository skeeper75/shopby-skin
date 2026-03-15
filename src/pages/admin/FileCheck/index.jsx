import { useState, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import FilePreview from '../../../components/admin/FilePreview';

// @MX:NOTE: [AUTO] 파일 확인 처리 페이지 - 확인완료 시 상태를 '제작진행'으로 자동 전환
// @MX:SPEC: SPEC-SKIN-005

// @MX:NOTE: [AUTO] 파일 확인 대기 주문 Mock 데이터
const MOCK_FILE_CHECK_ORDERS = [
  {
    id: 1, orderNo: 'HP-2024-0001', orderDate: '2024-03-15 14:30',
    customerName: '김민수', productName: '명함 (양면 컬러)',
    status: '파일확인', fileStatus: '대기',
    file: {
      name: '명함_디자인_최종.pdf', url: '/files/sample.pdf',
      type: 'application/pdf', size: '2.4MB', uploadDate: '2024-03-15',
    },
  },
  {
    id: 2, orderNo: 'HP-2024-0005', orderDate: '2024-03-13 16:00',
    customerName: '정다은', productName: '리플릿 (3단접지)',
    status: '파일확인', fileStatus: '대기',
    file: {
      name: '리플릿_시안.pdf', url: '/files/sample2.pdf',
      type: 'application/pdf', size: '8.7MB', uploadDate: '2024-03-13',
    },
  },
  {
    id: 3, orderNo: 'HP-2024-0007', orderDate: '2024-03-12 11:00',
    customerName: '오세준', productName: '포스터 (A1)',
    status: '파일확인', fileStatus: '대기',
    file: {
      name: '포스터_이벤트.png', url: '/files/sample3.png',
      type: 'image/png', size: '5.1MB', uploadDate: '2024-03-12',
    },
  },
  {
    id: 4, orderNo: 'HP-2024-0008', orderDate: '2024-03-11 09:20',
    customerName: '윤서영', productName: '스티커 (사각형 80mm)',
    status: '파일확인', fileStatus: '확인완료',
    file: {
      name: '스티커_로고_v2.png', url: '/files/sample4.png',
      type: 'image/png', size: '1.8MB', uploadDate: '2024-03-11',
    },
  },
];

/**
 * 파일 확인 처리 페이지
 * - 파일 확인 대기 주문 목록
 * - 클릭 → FilePreview 모달로 파일 확인
 * - 확인완료 / 재업로드 요청 액션
 */
const FileCheckPage = () => {
  const [orders, setOrders] = useState(MOCK_FILE_CHECK_ORDERS);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOrderNo, setPreviewOrderNo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { key: 'orderNo', label: '주문번호', sortable: true, width: '140px' },
      { key: 'orderDate', label: '주문일시', sortable: true, width: '140px' },
      { key: 'customerName', label: '주문자', sortable: true, width: '80px' },
      { key: 'productName', label: '상품명', sortable: false },
      {
        key: 'fileStatus',
        label: '파일상태',
        sortable: false,
        width: '100px',
        render: (val) => (
          <StatusBadge
            status={val === '확인완료' ? '완료' : '접수중'}
          />
        ),
      },
      {
        key: 'file',
        label: '파일명',
        sortable: false,
        width: '200px',
        render: (val) => (
          <span className="text-[#5538B6] text-sm truncate max-w-[180px] inline-block">
            {val?.name || '-'}
          </span>
        ),
      },
    ],
    []
  );

  // 행 클릭 → 파일 미리보기 열기
  const handleRowClick = useCallback((order) => {
    if (order.file) {
      setPreviewFile(order.file);
      setPreviewOrderNo(order.orderNo);
    }
  }, []);

  // 파일 확인완료 처리
  // PUT /admin/orders/{orderNo}/file-check (Mock)
  const handleApprove = useCallback(
    (file) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNo === previewOrderNo
            ? { ...o, fileStatus: '확인완료', status: '제작진행' }
            : o
        )
      );
      alert(`주문 ${previewOrderNo}의 파일이 확인완료 처리되었습니다.`);
      setPreviewFile(null);
      setPreviewOrderNo(null);
    },
    [previewOrderNo]
  );

  // 재업로드 요청
  // POST /admin/orders/{orderNo}/reupload (SMS 발송 트리거, Mock)
  const handleReupload = useCallback(
    (file) => {
      alert(`주문 ${previewOrderNo}에 재업로드 요청 SMS를 발송했습니다. (Mock)`);
      setPreviewFile(null);
      setPreviewOrderNo(null);
    },
    [previewOrderNo]
  );

  // 대기 건수 카운트
  const pendingCount = useMemo(
    () => orders.filter((o) => o.fileStatus === '대기').length,
    [orders]
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#424242]">파일 확인</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center bg-[#5538B6] text-white text-xs font-semibold rounded-full px-2.5 py-0.5">
                {pendingCount}건 대기
              </span>
            )}
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-[#EEEBF9] border border-[#5538B6]/20 rounded-lg p-3">
          <p className="text-sm text-[#5538B6]">
            주문 행을 클릭하면 업로드된 파일을 미리볼 수 있습니다. 파일 확인 후 "확인완료" 또는 "재업로드 요청"을 진행해주세요.
          </p>
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={columns}
          data={orders}
          pagination={{
            page: currentPage,
            pageSize: 10,
            total: orders.length,
          }}
          onPageChange={setCurrentPage}
          onRowClick={handleRowClick}
        />

        {/* 파일 미리보기 모달 */}
        <FilePreview
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => {
            setPreviewFile(null);
            setPreviewOrderNo(null);
          }}
          onApprove={handleApprove}
          onReupload={handleReupload}
        />
      </div>
    </AdminLayout>
  );
};

export default FileCheckPage;
