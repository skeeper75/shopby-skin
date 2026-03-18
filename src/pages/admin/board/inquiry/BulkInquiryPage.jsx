// @MX:SPEC: SPEC-SKIN-007
// 견적문의 관리 페이지 - 답변 처리

import { useState, useCallback } from 'react';
import { BoardList } from '../../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../../components/admin/board/BoardStatusChip';
import { QuickReplyPanel } from '../../../../components/admin/board/QuickReplyPanel';
import { getBulkInquiries, replyToBulkInquiry } from '../../../../services/admin/board';

const BulkInquiryPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback((params) => getBulkInquiries(params), [refreshKey]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsPanelOpen(true);
  };

  const handleReplySubmit = async (item, content) => {
    setIsReplying(true);
    try {
      await replyToBulkInquiry(item.id, content);
      setIsPanelOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('[BulkInquiryPage] 답변 실패:', err);
    } finally {
      setIsReplying(false);
    }
  };

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      { key: 'title', label: '견적 제목' },
      { key: 'companyName', label: '업체/신청인', width: '150px' },
      { key: 'contactPhone', label: '연락처', width: '130px' },
      {
        key: 'status',
        label: '상태',
        width: '100px',
        render: (val) => <BoardStatusChip status={val} />,
      },
      { key: 'createdAt', label: '신청일', width: '120px' },
    ],
    searchFields: [
      { key: 'search', label: '제목/업체명', type: 'text' },
    ],
    statusFilters: [
      { value: 'pending', label: '미답변' },
      { value: 'answered', label: '답변완료' },
    ],
    fetchData,
  };

  return (
    <>
      <div style={{ padding: 'var(--huni-spacing-xl)' }}>
        <h1 style={{ margin: '0 0 var(--huni-spacing-lg)', fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          견적문의 관리
        </h1>
        <BoardList
          config={config}
          onRowClick={handleRowClick}
          emptyMessage="견적 문의가 없습니다."
        />
      </div>

      <QuickReplyPanel
        item={selectedItem}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onReplySubmit={handleReplySubmit}
        isLoading={isReplying}
        title="견적문의 답변"
      />
    </>
  );
};

export default BulkInquiryPage;
