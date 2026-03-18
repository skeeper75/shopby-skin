// @MX:SPEC: SPEC-SKIN-007
// 체험단 관리 페이지

import { useCallback } from 'react';
import { BoardList } from '../../../components/admin/board/BoardList';
import { BoardStatusChip } from '../../../components/admin/board/BoardStatusChip';

// 목업 체험단 데이터
const MOCK_EXPERIENCES = [
  { id: 1, title: '명함 체험단 모집 - 3월', productName: '스탠다드 명함', applicantCount: 45, approvedCount: 10, status: 'published', startDate: '2026-03-01', endDate: '2026-03-15', createdAt: '2026-02-25' },
  { id: 2, title: '전단지 체험단 - 봄 이벤트', productName: 'A4 전단지', applicantCount: 23, approvedCount: 5, status: 'draft', startDate: '2026-04-01', endDate: '2026-04-10', createdAt: '2026-03-10' },
];

const ExperiencePage = () => {
  const fetchData = useCallback(async () => ({ items: MOCK_EXPERIENCES, total: MOCK_EXPERIENCES.length }), []);

  const config = {
    columns: [
      { key: 'id', label: 'No.', width: '60px' },
      { key: 'title', label: '체험단 제목' },
      { key: 'productName', label: '상품', width: '150px' },
      { key: 'applicantCount', label: '신청', width: '70px', render: (val) => `${val}명` },
      { key: 'approvedCount', label: '선정', width: '70px', render: (val) => `${val}명` },
      { key: 'status', label: '상태', width: '100px', render: (val) => <BoardStatusChip status={val} /> },
      { key: 'endDate', label: '마감일', width: '120px' },
      { key: 'createdAt', label: '등록일', width: '120px' },
    ],
    searchFields: [{ key: 'search', label: '제목', type: 'text' }],
    statusFilters: [
      { value: 'published', label: '진행중' },
      { value: 'draft', label: '임시저장' },
    ],
    fetchData,
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)' }}>
      <h1 style={{ margin: '0 0 var(--huni-spacing-lg)', fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
        체험단 관리
      </h1>
      <BoardList config={config} emptyMessage="체험단 프로그램이 없습니다." />
    </div>
  );
};

export default ExperiencePage;
