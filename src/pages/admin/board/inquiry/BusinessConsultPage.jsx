// @MX:SPEC: SPEC-SKIN-007
// 기업상담 관리 페이지

import { useState, useCallback } from 'react';
import { BoardList } from '../../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../../components/admin/board/BoardStatusChip';
import { QuickReplyPanel } from '../../../../components/admin/board/QuickReplyPanel';
import { getBusinessConsults } from '../../../../services/admin/board';

const BusinessConsultPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback((params) => getBusinessConsults(params), [refreshKey]);

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      { key: 'title', label: '상담 제목' },
      { key: 'companyName', label: '회사명', width: '160px' },
      { key: 'contactName', label: '담당자', width: '100px' },
      { key: 'contactPhone', label: '연락처', width: '130px' },
      { key: 'email', label: '이메일', width: '180px' },
      {
        key: 'status',
        label: '상태',
        width: '100px',
        render: (val) => <BoardStatusChip status={val} />,
      },
      { key: 'createdAt', label: '신청일', width: '120px' },
    ],
    searchFields: [
      { key: 'search', label: '제목/회사명', type: 'text' },
    ],
    statusFilters: [
      { value: 'pending', label: '접수' },
      { value: 'consulting', label: '상담중' },
      { value: 'completed', label: '완료' },
    ],
    fetchData,
  };

  return (
    <>
      <div style={{ padding: 'var(--huni-spacing-xl)' }}>
        <h1 style={{ margin: '0 0 var(--huni-spacing-lg)', fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          기업상담 관리
        </h1>
        <BoardList
          config={config}
          onRowClick={(item) => { setSelectedItem(item); setIsPanelOpen(true); }}
          emptyMessage="기업 상담 문의가 없습니다."
        />
      </div>

      <QuickReplyPanel
        item={selectedItem}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onReplySubmit={async () => setIsPanelOpen(false)}
        title="기업상담 상세"
      />
    </>
  );
};

export default BusinessConsultPage;
