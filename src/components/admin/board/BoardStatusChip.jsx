// @MX:SPEC: SPEC-SKIN-007
// 게시판 아이템 상태 칩 컴포넌트

import { Chip } from '../../ui/Chip';

// 상태별 스타일/레이블 정의
const STATUS_CONFIG = {
  // 공지/FAQ 상태
  published: { label: '게시중', variant: 'success' },
  draft: { label: '임시저장', variant: 'default' },
  // Q&A / 문의 상태
  pending: { label: '미답변', variant: 'warning' },
  answered: { label: '답변완료', variant: 'success' },
  // 기업상담 / 디자인상담
  consulting: { label: '상담중', variant: 'info' },
  completed: { label: '상담완료', variant: 'success' },
  cancelled: { label: '취소', variant: 'error' },
};

/**
 * 게시판 상태 칩
 * @param {string} status - 상태 코드
 * @param {string} [size] - 칩 크기 (sm|md)
 */
const BoardStatusChip = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'default' };

  return (
    <Chip
      variant={config.variant}
      size={size}
      style={{ fontSize: 'var(--huni-font-size-xs)' }}
    >
      {config.label}
    </Chip>
  );
};

export { BoardStatusChip };
