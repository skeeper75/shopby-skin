// @MX:SPEC: SPEC-SKIN-007
// Q&A 관리 페이지 - 답변 처리

import { useState, useCallback } from 'react';
import { BoardList } from '../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../components/admin/board/BoardStatusChip';
import { QuickReplyPanel } from '../../../components/admin/board/QuickReplyPanel';
import { getQas, replyToQa } from '../../../services/admin/board';

const QaPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback((params) => getQas(params), [refreshKey]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsPanelOpen(true);
  };

  const handleReplySubmit = async (item, content) => {
    setIsReplying(true);
    try {
      await replyToQa(item.id, content);
      setIsPanelOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('[QaPage] 답변 등록 실패:', err);
    } finally {
      setIsReplying(false);
    }
  };

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      { key: 'title', label: '제목' },
      {
        key: 'memberName',
        label: '작성자',
        width: '120px',
        render: (val, item) => `${val} (${item.memberId})`,
      },
      {
        key: 'status',
        label: '상태',
        width: '100px',
        render: (val) => <BoardStatusChip status={val} />,
      },
      { key: 'createdAt', label: '등록일', width: '120px' },
    ],
    searchFields: [
      { key: 'search', label: '제목/작성자', type: 'text' },
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
          Q&A 관리
        </h1>
        <BoardList
          config={config}
          onRowClick={handleRowClick}
          emptyMessage="Q&A 문의가 없습니다."
        />
      </div>

      <QuickReplyPanel
        item={selectedItem}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onReplySubmit={handleReplySubmit}
        isLoading={isReplying}
        title="Q&A 답변"
      />
    </>
  );
};

export default QaPage;
