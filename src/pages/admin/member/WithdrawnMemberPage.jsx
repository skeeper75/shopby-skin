// @MX:SPEC: SPEC-SKIN-007
// 탈퇴 회원 목록 페이지

import { useState, useCallback } from 'react';
import { BoardList } from '../../../components/admin/board/BoardList';
import { getWithdrawnMembers } from '../../../services/admin/member';

const WithdrawnMemberPage = () => {
  const [refreshKey] = useState(0);
  const fetchData = useCallback((params) => getWithdrawnMembers(params), [refreshKey]);

  const config = {
    columns: [
      { key: 'memberId', label: '아이디', width: '130px' },
      { key: 'name', label: '이름', width: '100px' },
      { key: 'email', label: '이메일' },
      { key: 'phone', label: '전화번호', width: '130px' },
      { key: 'joinedAt', label: '가입일', width: '120px' },
      { key: 'withdrawnAt', label: '탈퇴일', width: '120px' },
      { key: 'withdrawReason', label: '탈퇴 사유' },
      { key: 'totalOrders', label: '총 주문', width: '80px', render: (val) => `${val}건` },
    ],
    searchFields: [
      { key: 'search', label: '아이디/이름/이메일', type: 'text' },
    ],
    statusFilters: [],
    fetchData,
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)' }}>
      <h1 style={{ margin: '0 0 var(--huni-spacing-lg)', fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
        탈퇴 회원 관리
      </h1>
      <div
        style={{
          padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 'var(--huni-radius-sm)',
          marginBottom: 'var(--huni-spacing-md)',
          fontSize: 'var(--huni-font-size-sm)',
          color: '#92400e',
        }}
      >
        탈퇴 회원 데이터는 개인정보보호법에 따라 탈퇴 후 5년간 보관됩니다.
      </div>
      <BoardList
        config={config}
        emptyMessage="탈퇴 회원이 없습니다."
      />
    </div>
  );
};

export default WithdrawnMemberPage;
