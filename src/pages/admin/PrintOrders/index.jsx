import { useState, useCallback, useMemo, useRef } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import StatusBadge from '../../../components/admin/StatusBadge';
import PrintSheet from '../../../components/admin/PrintSheet';

// Mock 주문 데이터
const MOCK_ORDERS = [
  {
    id: 1, orderNo: 'HP-2024-0001', orderDate: '2024-03-15 14:30',
    customerName: '김민수', phone: '010-1234-5678',
    productName: '명함 (양면 컬러)', option: '아트지 250g / 200매', quantity: 1,
    status: '제작완료', totalPrice: 18000,
    receiverName: '김민수', receiverPhone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123 4층', deliveryMemo: '부재 시 경비실에 맡겨주세요',
  },
  {
    id: 2, orderNo: 'HP-2024-0002', orderDate: '2024-03-15 15:10',
    customerName: '이영희', phone: '010-9876-5432',
    productName: '전단지 (A4 양면)', option: '스노우지 150g / 500매', quantity: 1,
    status: '배송중', totalPrice: 45000,
    receiverName: '이영희', receiverPhone: '010-9876-5432',
    address: '경기도 성남시 분당구 판교로 456', deliveryMemo: '',
  },
  {
    id: 3, orderNo: 'HP-2024-0003', orderDate: '2024-03-14 09:45',
    customerName: '박준호', phone: '010-5555-1234',
    productName: '포스터 (B2)', option: '유포지 200g / 10매', quantity: 1,
    status: '제작진행', totalPrice: 40000,
    receiverName: '박준호', receiverPhone: '010-5555-1234',
    address: '부산시 해운대구 센텀로 789', deliveryMemo: '문 앞에 놓아주세요',
  },
  {
    id: 4, orderNo: 'HP-2024-0004', orderDate: '2024-03-14 11:20',
    customerName: '최수연', phone: '010-7777-8888',
    productName: '스티커 (원형 50mm)', option: '아트지 / 1000매', quantity: 2,
    status: '배송완료', totalPrice: 53000,
    receiverName: '최수연', receiverPhone: '010-7777-8888',
    address: '대전시 유성구 대학로 101', deliveryMemo: '',
  },
];

/**
 * 주문서 출력 페이지
 * - 테이블에서 주문 선택 → "주문서 출력" 버튼
 * - 새 창에서 인쇄 미리보기 (window.open + window.print)
 * - 다건 연속 인쇄 지원
 */
const PrintOrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef(null);

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { key: 'orderNo', label: '주문번호', sortable: true, width: '140px' },
      { key: 'orderDate', label: '주문일시', sortable: true, width: '140px' },
      { key: 'customerName', label: '주문자', sortable: true, width: '80px' },
      { key: 'productName', label: '상품명', sortable: false },
      { key: 'option', label: '옵션', sortable: false, width: '160px' },
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

  // 주문서 출력 핸들러
  // @MX:NOTE: [AUTO] 인쇄는 새 창(window.open)에서 PrintSheet 컴포넌트를 렌더링 후 window.print() 호출
  const handlePrint = useCallback(() => {
    if (selectedOrders.length === 0) {
      alert('출력할 주문을 선택해주세요.');
      return;
    }

    // 인쇄 미리보기 표시
    setShowPreview(true);

    // 약간의 딜레이 후 인쇄 다이얼로그 실행
    setTimeout(() => {
      const printContent = printRef.current;
      if (!printContent) return;

      const printWindow = window.open('', '_blank', 'width=800,height=1000');
      if (!printWindow) {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>후니프린팅 - 주문서 출력</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Noto Sans KR', sans-serif; }
            .print-order { padding: 20mm; page-break-after: always; }
            .print-order:last-child { page-break-after: auto; }
            .print-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            .print-table th, .print-table td { border: 1px solid #424242; padding: 8px 12px; font-size: 12px; text-align: left; }
            .print-table th { background-color: #F6F6F6; font-weight: 600; width: 100px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    }, 100);
  }, [selectedOrders]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#424242]">주문서 출력</h1>
          <div className="flex items-center gap-3">
            {selectedOrders.length > 0 && (
              <span className="text-sm text-[#5538B6] font-medium">
                {selectedOrders.length}건 선택됨
              </span>
            )}
            <button
              type="button"
              onClick={handlePrint}
              disabled={selectedOrders.length === 0}
              className="h-[36px] px-5 bg-[#5538B6] text-white text-sm rounded hover:bg-[#4530A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              주문서 출력
            </button>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-[#F6F6F6] border border-[#CACACA] rounded-lg p-3">
          <p className="text-sm text-[#979797]">
            출력할 주문을 체크박스로 선택한 후 "주문서 출력" 버튼을 클릭하세요. 여러 건을 동시에 선택하면 연속 출력됩니다.
          </p>
        </div>

        {/* 데이터 테이블 */}
        <DataTable
          columns={columns}
          data={MOCK_ORDERS}
          selectable
          onSelectionChange={setSelectedOrders}
          pagination={{
            page: currentPage,
            pageSize: 10,
            total: MOCK_ORDERS.length,
          }}
          onPageChange={setCurrentPage}
        />

        {/* 인쇄용 숨겨진 PrintSheet (화면에는 안 보이나 인쇄 시 사용) */}
        {showPreview && (
          <div ref={printRef} className="hidden">
            <PrintSheet orders={selectedOrders} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PrintOrdersPage;
