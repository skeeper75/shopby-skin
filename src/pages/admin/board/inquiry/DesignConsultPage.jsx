// @MX:SPEC: SPEC-SKIN-007
// 디자인상담 관리 페이지

import { useState, useCallback } from 'react';
import { BoardList } from '../../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../../components/admin/board/BoardStatusChip';
import { QuickReplyPanel } from '../../../../components/admin/board/QuickReplyPanel';
import { getDesignConsults } from '../../../../services/admin/board';

const DesignConsultPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback((params) => getDesignConsults(params), [refreshKey]);

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      { key: 'title', label: '상담 제목' },
      { key: 'contactName', label: '신청인', width: '120px' },
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
      { key: 'search', label: '제목/신청인', type: 'text' },
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
          디자인상담 관리
        </h1>
        <BoardList
          config={config}
          onRowClick={(item) => { setSelectedItem(item); setIsPanelOpen(true); }}
          emptyMessage="디자인 상담 문의가 없습니다."
        />
      </div>

      <QuickReplyPanel
        item={selectedItem}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onReplySubmit={async () => setIsPanelOpen(false)}
        title="디자인상담 상세"
      />
    </>
  );
};

export default DesignConsultPage;
