import { useState, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/admin/DataTable';
import SMSDialog from '../../../components/admin/SMSDialog';

// @MX:NOTE: [AUTO] SMS 관리 페이지 - 수신자 선택, 템플릿 발송, 발송 이력 조회
// @MX:SPEC: SPEC-SKIN-005

// Mock SMS 발송 이력
const MOCK_SMS_HISTORY = [
  {
    id: 1, sentDate: '2024-03-15 14:35', recipient: '김민수',
    phone: '010-1234-5678', type: 'SMS', template: '주문접수',
    message: '[후니프린팅] 주문이 접수되었습니다. 주문번호: HP-2024-0001.',
    status: '발송완료',
  },
  {
    id: 2, sentDate: '2024-03-15 15:15', recipient: '이영희',
    phone: '010-9876-5432', type: 'LMS', template: '제작시작',
    message: '[후니프린팅] 주문번호 HP-2024-0002 상품의 제작이 시작되었습니다.',
    status: '발송완료',
  },
  {
    id: 3, sentDate: '2024-03-14 10:00', recipient: '박준호',
    phone: '010-5555-1234', type: 'SMS', template: '배송시작',
    message: '[후니프린팅] 주문번호 HP-2024-0003 상품이 발송되었습니다.',
    status: '발송완료',
  },
  {
    id: 4, sentDate: '2024-03-14 11:30', recipient: '최수연',
    phone: '010-7777-8888', type: 'SMS', template: '제작완료',
    message: '[후니프린팅] 주문번호 HP-2024-0004 상품의 제작이 완료되었습니다.',
    status: '발송실패',
  },
  {
    id: 5, sentDate: '2024-03-13 16:10', recipient: '정다은',
    phone: '010-3333-4444', type: 'LMS', template: '재업로드요청',
    message: '[후니프린팅] 주문번호 HP-2024-0005 업로드 파일 확인 결과, 재업로드가 필요합니다.',
    status: '발송완료',
  },
];

// Mock 고객 목록 (SMS 발송 대상)
const MOCK_CUSTOMERS = [
  { name: '김민수', phone: '010-1234-5678' },
  { name: '이영희', phone: '010-9876-5432' },
  { name: '박준호', phone: '010-5555-1234' },
  { name: '최수연', phone: '010-7777-8888' },
  { name: '정다은', phone: '010-3333-4444' },
  { name: '한지훈', phone: '010-1111-2222' },
];

/**
 * SMS 관리 페이지
 * - SMS 발송, 발송 이력 조회
 * - 템플릿 메시지 관리
 */
const SMSPage = () => {
  const [history] = useState(MOCK_SMS_HISTORY);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  // 고객 선택 토글
  const toggleCustomer = useCallback((customer) => {
    setSelectedRecipients((prev) => {
      const exists = prev.find((r) => r.phone === customer.phone);
      if (exists) {
        return prev.filter((r) => r.phone !== customer.phone);
      }
      return [...prev, customer];
    });
  }, []);

  // SMS 발송 핸들러
  // POST /admin/sms/send (Mock)
  const handleSend = useCallback(({ recipients, message, type }) => {
    console.log('[Mock SMS 발송]', { recipients, message, type });
    alert(
      `${type} 발송 완료 (Mock)\n수신자: ${recipients.map((r) => r.name).join(', ')}\n메시지: ${message.substring(0, 50)}...`
    );
    setIsSmsDialogOpen(false);
    setSelectedRecipients([]);
  }, []);

  // 발송 이력 테이블 컬럼
  const columns = useMemo(
    () => [
      { key: 'sentDate', label: '발송일시', sortable: true, width: '140px' },
      { key: 'recipient', label: '수신자', sortable: true, width: '80px' },
      { key: 'phone', label: '연락처', sortable: false, width: '120px' },
      { key: 'type', label: '유형', sortable: false, width: '60px' },
      { key: 'template', label: '템플릿', sortable: false, width: '100px' },
      {
        key: 'message',
        label: '메시지',
        sortable: false,
        render: (val) => (
          <span className="text-sm text-[#424242] truncate max-w-[300px] inline-block">
            {val}
          </span>
        ),
      },
      {
        key: 'status',
        label: '상태',
        sortable: false,
        width: '90px',
        render: (val) => (
          <span
            className={`text-xs font-medium ${
              val === '발송완료' ? 'text-[#7AC8C4]' : 'text-red-500'
            }`}
          >
            {val}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#424242]">SMS 관리</h1>
          <button
            type="button"
            onClick={() => setIsSmsDialogOpen(true)}
            className="h-[36px] px-5 bg-[#5538B6] text-white text-sm rounded hover:bg-[#4530A0] transition-colors"
          >
            SMS 발송
          </button>
        </div>

        {/* 수신자 선택 */}
        <div className="bg-white border border-[#CACACA] rounded-lg p-4">
          <p className="text-sm font-medium text-[#424242] mb-3">수신자 선택</p>
          <div className="flex flex-wrap gap-2">
            {MOCK_CUSTOMERS.map((customer) => {
              const isSelected = selectedRecipients.some(
                (r) => r.phone === customer.phone
              );
              return (
                <button
                  key={customer.phone}
                  type="button"
                  onClick={() => toggleCustomer(customer)}
                  className={`h-[32px] px-3 text-xs rounded border transition-colors ${
                    isSelected
                      ? 'bg-[#5538B6] text-white border-[#5538B6]'
                      : 'border-[#CACACA] text-[#424242] hover:bg-[#EEEBF9]'
                  }`}
                >
                  {customer.name} ({customer.phone})
                </button>
              );
            })}
          </div>
          {selectedRecipients.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-[#5538B6] font-medium">
                {selectedRecipients.length}명 선택됨
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSmsDialogOpen(true);
                }}
                className="h-[30px] px-3 bg-[#5538B6] text-white text-xs rounded hover:bg-[#4530A0] transition-colors"
              >
                선택 고객에게 발송
              </button>
            </div>
          )}
        </div>

        {/* 발송 이력 */}
        <div>
          <h2 className="text-base font-semibold text-[#424242] mb-3">
            발송 이력
          </h2>
          <DataTable
            columns={columns}
            data={history}
            pagination={{
              page: currentPage,
              pageSize: 10,
              total: history.length,
            }}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* SMS 발송 다이얼로그 */}
        <SMSDialog
          isOpen={isSmsDialogOpen}
          recipients={selectedRecipients}
          onClose={() => setIsSmsDialogOpen(false)}
          onSend={handleSend}
        />
      </div>
    </AdminLayout>
  );
};

export default SMSPage;
