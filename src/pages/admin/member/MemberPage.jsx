// @MX:SPEC: SPEC-SKIN-007
// 회원 목록 관리 페이지

import { useState, useCallback } from 'react';
import { MemberSearchBar } from '../../../components/admin/member/MemberSearchBar';
import { MemberDetailDrawer } from '../../../components/admin/member/MemberDetailDrawer';
import { getMembers, getMember } from '../../../services/admin/member';

const GRADE_LABELS = { gold: '골드', silver: '실버', normal: '일반' };
const STATUS_LABELS = { active: '활성', inactive: '비활성', suspended: '정지' };
const STATUS_STYLES = {
  active: { color: '#065f46', bg: '#d1fae5' },
  inactive: { color: '#6b7280', bg: '#f3f4f6' },
  suspended: { color: '#991b1b', bg: '#fee2e2' },
};

const MemberPage = () => {
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentParams, setCurrentParams] = useState({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const loadMembers = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const result = await getMembers({ ...params, page, size: PAGE_SIZE });
      setMembers(result.items ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      console.error('[MemberPage] 회원 목록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  // 초기 로드
  useState(() => { loadMembers({}); }, []);

  const handleSearch = (params) => {
    setCurrentParams(params);
    setPage(1);
    loadMembers(params);
  };

  const handleRowClick = async (member) => {
    try {
      const detail = await getMember(member.id);
      setSelectedMember(detail);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error('[MemberPage] 회원 상세 조회 실패:', err);
    }
  };

  const handleMoneyAdjustSuccess = () => {
    loadMembers(currentParams);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <div style={{ padding: 'var(--huni-spacing-xl)' }}>
        <h1 style={{ margin: '0 0 var(--huni-spacing-lg)', fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          회원 관리
        </h1>

        <MemberSearchBar onSearch={handleSearch} />

        <div style={{ marginTop: 'var(--huni-spacing-md)', marginBottom: 'var(--huni-spacing-sm)' }}>
          <span style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-muted)' }}>총 {total}명</span>
        </div>

        {/* 테이블 */}
        <div style={{ border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--huni-bg-muted)' }}>
                {['아이디', '이름', '이메일', '전화번호', '등급', '상태', '가입일', '최근로그인', '총주문', '총결제'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-semibold)', color: 'var(--huni-text-secondary)', borderBottom: '1px solid var(--huni-border-default)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={10} style={{ padding: 'var(--huni-spacing-xl)', textAlign: 'center', color: 'var(--huni-text-muted)' }}>불러오는 중...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: 'var(--huni-spacing-xl)', textAlign: 'center', color: 'var(--huni-text-muted)' }}>회원이 없습니다.</td></tr>
              ) : (
                members.map((member) => {
                  const statusStyle = STATUS_STYLES[member.status] ?? STATUS_STYLES.active;
                  return (
                    <tr
                      key={member.id}
                      onClick={() => handleRowClick(member)}
                      style={{ borderBottom: '1px solid var(--huni-border-subtle)', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--huni-bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={tdStyle}>{member.memberId}</td>
                      <td style={tdStyle}>{member.name}</td>
                      <td style={tdStyle}>{member.email}</td>
                      <td style={tdStyle}>{member.phone}</td>
                      <td style={tdStyle}>{GRADE_LABELS[member.grade] ?? member.grade}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '2px 8px', background: statusStyle.bg, color: statusStyle.color, fontSize: 'var(--huni-font-size-xs)', borderRadius: 'var(--huni-radius-xs)' }}>
                          {STATUS_LABELS[member.status] ?? member.status}
                        </span>
                      </td>
                      <td style={tdStyle}>{member.joinedAt}</td>
                      <td style={tdStyle}>{member.lastLoginAt}</td>
                      <td style={tdStyle}>{member.totalOrders}건</td>
                      <td style={tdStyle}>{(member.totalAmount ?? 0).toLocaleString()}원</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--huni-spacing-xs)', marginTop: 'var(--huni-spacing-md)' }}>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); loadMembers({ ...currentParams, page: p }); }}
                style={{ padding: '6px 12px', border: '1px solid', borderColor: p === page ? 'var(--huni-color-brand)' : 'var(--huni-border-default)', borderRadius: 'var(--huni-radius-sm)', background: p === page ? 'var(--huni-color-brand)' : 'var(--huni-bg-surface)', color: p === page ? '#fff' : 'var(--huni-text-secondary)', fontSize: 'var(--huni-font-size-sm)', cursor: 'pointer' }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <MemberDetailDrawer
        member={selectedMember}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onMoneyAdjustSuccess={handleMoneyAdjustSuccess}
      />
    </>
  );
};

const tdStyle = {
  padding: '10px 12px',
  fontSize: 'var(--huni-font-size-sm)',
  color: 'var(--huni-text-primary)',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

export default MemberPage;
