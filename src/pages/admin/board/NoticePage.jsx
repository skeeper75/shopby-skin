// @MX:SPEC: SPEC-SKIN-007
// 공지사항 관리 페이지 - CRUD

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardList } from '../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../components/admin/board/BoardStatusChip';
import { getNotices, deleteNotice, updateNotice } from '../../../services/admin/board';

/**
 * 공지사항 관리 페이지
 */
const NoticePage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(
    (params) => getNotices(params),
    [refreshKey]
  );

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    if (!window.confirm(`"${item.title}" 공지사항을 삭제하시겠습니까?`)) return;
    await deleteNotice(item.id);
    setRefreshKey((k) => k + 1);
  };

  const handleTogglePin = async (e, item) => {
    e.stopPropagation();
    await updateNotice(item.id, { isPinned: !item.isPinned });
    setRefreshKey((k) => k + 1);
  };

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      {
        key: 'isPinned',
        label: '고정',
        width: '60px',
        render: (val, item) => (
          <button
            onClick={(e) => handleTogglePin(e, item)}
            title={val ? '고정 해제' : '고정'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: val ? 'var(--huni-color-brand)' : 'var(--huni-text-muted)',
            }}
          >
            {val ? '📌' : '○'}
          </button>
        ),
      },
      {
        key: 'title',
        label: '제목',
        render: (val, item) => (
          <span>
            {item.isPinned && (
              <span
                style={{
                  marginRight: '6px',
                  padding: '2px 6px',
                  background: 'var(--huni-color-brand)',
                  color: '#fff',
                  fontSize: 'var(--huni-font-size-xs)',
                  borderRadius: 'var(--huni-radius-xs)',
                }}
              >
                고정
              </span>
            )}
            {val}
          </span>
        ),
      },
      {
        key: 'status',
        label: '상태',
        width: '100px',
        render: (val) => <BoardStatusChip status={val} />,
      },
      { key: 'viewCount', label: '조회수', width: '80px' },
      { key: 'createdAt', label: '등록일', width: '120px' },
      {
        key: 'actions',
        label: '관리',
        width: '120px',
        render: (_, item) => (
          <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => navigate(`/admin/board/notice/${item.id}/edit`)}
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
    searchFields: [{ key: 'search', label: '제목', type: 'text' }],
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
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--huni-font-size-xl)',
            fontWeight: 'var(--huni-font-weight-bold)',
            color: 'var(--huni-text-primary)',
          }}
        >
          공지사항 관리
        </h1>
        <button
          onClick={() => navigate('/admin/board/notice/create')}
          style={{
            padding: 'var(--huni-spacing-sm) var(--huni-spacing-lg)',
            background: 'var(--huni-color-brand)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--huni-radius-sm)',
            fontSize: 'var(--huni-font-size-sm)',
            fontWeight: 'var(--huni-font-weight-medium)',
            cursor: 'pointer',
          }}
        >
          + 공지 작성
        </button>
      </div>

      <BoardList
        config={config}
        onRowClick={(item) => navigate(`/admin/board/notice/${item.id}`)}
        emptyMessage="공지사항이 없습니다."
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

export default NoticePage;
