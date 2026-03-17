import { useState, useCallback } from 'react';

import { cn } from '../../../lib/utils';
import { TextField } from '../../../components/ui/TextField';

// @MX:NOTE: [AUTO] 관리자 회원(관리자 계정) 관리 페이지 - 목록, 추가, 역할/권한 관리
// @MX:SPEC: SPEC-SKIN-005
// @MX:WARN: [AUTO] handleAddMember async 함수에 try/catch 없음 - API 연동 시 에러 처리 누락 위험
// @MX:REASON: 현재 목업이지만 실제 API 전환 시 미처리 Promise rejection 발생 가능
// @MX:TODO: [AUTO] 테스트 미작성 - 관리자 추가 유효성 검사, 중복 아이디 검사 검증 필요

// 역할 정의
const ROLE_OPTIONS = [
  { value: 'super_admin', label: '최고관리자', description: '모든 권한' },
  { value: 'admin', label: '관리자', description: '주문/상품/회원 관리' },
  { value: 'viewer', label: '뷰어', description: '조회 전용' },
];

// 역할별 배지 스타일
const ROLE_BADGE_STYLES = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

// 역할 라벨 매핑
const ROLE_LABELS = {
  super_admin: '최고관리자',
  admin: '관리자',
  viewer: '뷰어',
};

// 목업 관리자 데이터
const MOCK_MEMBERS = [
  { id: 1, loginId: 'admin', name: '김관리', role: 'super_admin', email: 'admin@huni.co.kr', createdAt: '2024-01-01', lastLogin: '2026-03-15' },
  { id: 2, loginId: 'manager01', name: '이매니저', role: 'admin', email: 'manager01@huni.co.kr', createdAt: '2024-06-15', lastLogin: '2026-03-14' },
  { id: 3, loginId: 'viewer01', name: '박뷰어', role: 'viewer', email: 'viewer01@huni.co.kr', createdAt: '2025-03-20', lastLogin: '2026-03-10' },
];

/**
 * 관리자 등록/관리 페이지
 * - 관리자 목록 테이블
 * - 관리자 추가 다이얼로그
 * - 역할/권한 관리 (super_admin, admin, viewer)
 */
const Members = () => {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    loginId: '',
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [formError, setFormError] = useState('');

  // TODO: 실제 API 연동 시 fetchHttpRequest 사용
  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     const data = await fetchHttpRequest({ url: 'admin/members' });
  //     setMembers(data);
  //   };
  //   fetchMembers();
  // }, []);

  // 폼 입력 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  // 다이얼로그 열기/닫기
  const openDialog = () => {
    setFormData({ loginId: '', name: '', email: '', password: '', role: 'admin' });
    setFormError('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormError('');
  };

  // 관리자 추가 처리
  const handleAddMember = useCallback(
    async (e) => {
      e.preventDefault();

      // 유효성 검사
      if (!formData.loginId || !formData.name || !formData.email || !formData.password) {
        setFormError('모든 필드를 입력해주세요.');
        return;
      }

      // 중복 아이디 검사
      if (members.some((m) => m.loginId === formData.loginId)) {
        setFormError('이미 사용 중인 아이디입니다.');
        return;
      }

      // TODO: 실제 API 연동 시 fetchHttpRequest 사용
      // await fetchHttpRequest({
      //   url: 'admin/members',
      //   method: 'POST',
      //   requestBody: formData,
      // });

      // 목업 추가 처리
      const newMember = {
        id: Date.now(),
        loginId: formData.loginId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-',
      };

      setMembers((prev) => [...prev, newMember]);
      closeDialog();
    },
    [formData, members]
  );

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#424242]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
          관리자 관리
        </h2>
        <button
          type="button"
          onClick={openDialog}
          className="h-[36px] px-4 rounded text-sm font-medium bg-[--huni-bg-brand] text-white hover:bg-[--huni-bg-brand-hover]"
        >
          + 관리자 추가
        </button>
      </div>

      {/* 관리자 목록 테이블 */}
      <div className="bg-white rounded-lg border border-[#CACACA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] text-[#424242]">
                <th className="text-left px-5 py-3 font-medium">아이디</th>
                <th className="text-left px-5 py-3 font-medium">이름</th>
                <th className="text-left px-5 py-3 font-medium">이메일</th>
                <th className="text-center px-5 py-3 font-medium">역할</th>
                <th className="text-center px-5 py-3 font-medium">등록일</th>
                <th className="text-center px-5 py-3 font-medium">최근 로그인</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-[#CACACA]/50 hover:bg-[#F6F6F6]/50 transition-colors">
                  <td className="px-5 py-3 text-[#424242] font-medium">{member.loginId}</td>
                  <td className="px-5 py-3 text-[#424242]">{member.name}</td>
                  <td className="px-5 py-3 text-[#979797]">{member.email}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', ROLE_BADGE_STYLES[member.role])}>
                      {ROLE_LABELS[member.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-[#979797]">{member.createdAt}</td>
                  <td className="px-5 py-3 text-center text-[#979797]">{member.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 관리자 추가 다이얼로그 (모달) */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black/40" onClick={closeDialog} />

          {/* 모달 콘텐츠 */}
          <div className="relative bg-white rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-y-auto z-10">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#CACACA]">
              <h3 className="text-lg font-semibold text-[#424242]">관리자 추가</h3>
              <button
                type="button"
                onClick={closeDialog}
                className="p-1 rounded hover:bg-[#F6F6F6] transition-colors"
                aria-label="닫기"
              >
                <svg className="w-5 h-5 text-[#979797]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 폼 */}
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label htmlFor="member-loginId" className="block text-sm font-medium text-[#424242] mb-1.5">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="member-loginId"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleFormChange}
                  placeholder="로그인 아이디"
                />
              </div>

              <div>
                <label htmlFor="member-name" className="block text-sm font-medium text-[#424242] mb-1.5">
                  이름 <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="member-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="관리자 이름"
                />
              </div>

              <div>
                <label htmlFor="member-email" className="block text-sm font-medium text-[#424242] mb-1.5">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="member-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="이메일 주소"
                />
              </div>

              <div>
                <label htmlFor="member-password" className="block text-sm font-medium text-[#424242] mb-1.5">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="member-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="비밀번호"
                />
              </div>

              <div>
                <label htmlFor="member-role" className="block text-sm font-medium text-[#424242] mb-1.5">
                  역할
                </label>
                <select
                  id="member-role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="flex h-9 w-full rounded-md border border-[#CACACA] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5538B6]"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* 에러 메시지 */}
              {formError && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded" role="alert">
                  {formError}
                </p>
              )}

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="h-[36px] px-4 rounded text-sm border border-[--huni-stroke-default] text-[--huni-fg-default] hover:bg-[--huni-bg-muted]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="h-[36px] px-4 rounded text-sm font-medium bg-[--huni-bg-brand] text-white hover:bg-[--huni-bg-brand-hover]"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
