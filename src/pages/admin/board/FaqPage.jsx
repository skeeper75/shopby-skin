// @MX:SPEC: SPEC-SKIN-007
// FAQ 관리 페이지

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardList } from '../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../components/admin/board/BoardStatusChip';
import { getFaqs, deleteFaq } from '../../../services/admin/board';

const FAQ_CATEGORIES = [
  { value: 'order', label: '주문' },
  { value: 'print', label: '인쇄' },
  { value: 'delivery', label: '배송' },
  { value: 'payment', label: '결제' },
  { value: 'etc', label: '기타' },
];

const CATEGORY_LABEL = FAQ_CATEGORIES.reduce((acc, c) => ({ ...acc, [c.value]: c.label }), {});

const FaqPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback((params) => getFaqs(params), [refreshKey]);

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    if (!window.confirm(`FAQ "${item.question.slice(0, 20)}..."를 삭제하시겠습니까?`)) return;
    await deleteFaq(item.id);
    setRefreshKey((k) => k + 1);
  };

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      {
        key: 'category',
        label: '카테고리',
        width: '100px',
        render: (val) => (
          <span
            style={{
              padding: '2px 8px',
              background: 'var(--huni-bg-muted)',
              borderRadius: 'var(--huni-radius-xs)',
              fontSize: 'var(--huni-font-size-xs)',
              color: 'var(--huni-text-secondary)',
            }}
          >
            {CATEGORY_LABEL[val] ?? val}
          </span>
        ),
      },
      { key: 'question', label: '질문' },
      {
        key: 'status',
        label: '상태',
        width: '100px',
        render: (val) => <BoardStatusChip status={val} />,
      },
      { key: 'order', label: '순서', width: '70px' },
      { key: 'createdAt', label: '등록일', width: '120px' },
      {
        key: 'actions',
        label: '관리',
        width: '120px',
        render: (_, item) => (
          <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => navigate(`/admin/board/faq/${item.id}/edit`)}
              style={actionBtnStyle('edit')}
            >
              수정
            </button>
            <button onClick={(e) => handleDelete(e, item)} style={actionBtnStyle('delete')}>
              삭제
            </button>
          </div>
        ),
      },
    ],
    searchFields: [
      { key: 'search', label: '질문', type: 'text' },
      { key: 'category', label: '카테고리', type: 'select', options: FAQ_CATEGORIES },
    ],
    statusFilters: [
      { value: 'published', label: '게시중' },
      { value: 'draft', label: '임시저장' },
    ],
    fetchData,
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--huni-spacing-lg)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          FAQ 관리
        </h1>
        <button
          onClick={() => navigate('/admin/board/faq/create')}
          style={primaryBtnStyle}
        >
          + FAQ 등록
        </button>
      </div>
      <BoardList
        config={config}
        onRowClick={(item) => navigate(`/admin/board/faq/${item.id}`)}
        emptyMessage="FAQ가 없습니다."
      />
    </div>
  );
};

const actionBtnStyle = (type) => ({
  padding: '3px 8px',
  border: '1px solid',
  borderColor: type === 'delete' ? 'var(--huni-color-error)' : 'var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-xs)',
  background: 'transparent',
  color: type === 'delete' ? 'var(--huni-color-error)' : 'var(--huni-text-secondary)',
  fontSize: 'var(--huni-font-size-xs)',
  cursor: 'pointer',
});

const primaryBtnStyle = {
  padding: 'var(--huni-spacing-sm) var(--huni-spacing-lg)',
  background: 'var(--huni-color-brand)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  fontWeight: 'var(--huni-font-weight-medium)',
  cursor: 'pointer',
};

export default FaqPage;
