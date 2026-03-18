// @MX:SPEC: SPEC-SKIN-007
// 이용후기 관리 페이지

import { useCallback } from 'react';
import { BoardList } from '../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../components/admin/board/BoardStatusChip';

// 목업 후기 데이터
const MOCK_REVIEWS = [
  { id: 1, productName: '스탠다드 명함', memberName: '홍길동', rating: 5, title: '품질이 정말 좋아요!', status: 'published', createdAt: '2026-03-14' },
  { id: 2, productName: 'A4 전단지', memberName: '김철수', rating: 4, title: '배송이 빨라서 좋았습니다', status: 'published', createdAt: '2026-03-12' },
  { id: 3, productName: '스탠다드 명함', memberName: '이영희', rating: 2, title: '인쇄 품질이 기대보다 아쉬웠어요', status: 'hidden', createdAt: '2026-03-10' },
];

const ReviewPage = () => {
  const fetchData = useCallback(async () => ({ items: MOCK_REVIEWS, total: MOCK_REVIEWS.length }), []);

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      { key: 'productName', label: '상품명', width: '160px' },
      { key: 'memberName', label: '작성자', width: '100px' },
      {
        key: 'rating',
        label: '별점',
        width: '80px',
        render: (val) => (
          <span style={{ color: '#f59e0b' }}>{'★'.repeat(val)}{'☆'.repeat(5 - val)}</span>
        ),
      },
      { key: 'title', label: '제목' },
      {
        key: 'status',
        label: '상태',
        width: '100px',
        render: (val) => <BoardStatusChip status={val === 'hidden' ? 'draft' : 'published'} />,
      },
      { key: 'createdAt', label: '등록일', width: '120px' },
    ],
    searchFields: [
      { key: 'search', label: '제목/작성자', type: 'text' },
      { key: 'rating', label: '별점', type: 'select', options: [5,4,3,2,1].map((r) => ({ value: String(r), label: `${r}점` })) },
    ],
    statusFilters: [
      { value: 'published', label: '게시중' },
      { value: 'hidden', label: '숨김' },
    ],
    fetchData,
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)' }}>
      <h1 style={{ margin: '0 0 var(--huni-spacing-lg)', fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
        이용후기 관리
      </h1>
      <BoardList config={config} emptyMessage="이용후기가 없습니다." />
    </div>
  );
};

export default ReviewPage;
