import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { cn } from '../../../lib/utils';
import useAdminAuth from '../../../hooks/useAdminAuth';
import AdminSidebar from '../AdminSidebar';

// @MX:ANCHOR: [AUTO] 관리자 레이아웃 - 모든 관리자 페이지의 최상위 레이아웃 컴포넌트
// @MX:REASON: fan_in >= 10, 대시보드/주문관리/상품관리/회원관리 등 전체 관리자 페이지에서 사용
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 테스트 미작성 - 사이드바 토글, 로그아웃 플로우 검증 필요
/**
 * 관리자 레이아웃 컴포넌트
 * - 좌측 사이드바(250px, 태블릿에서 접기 가능) + 우측 메인 콘텐츠 구조
 * - 상단 헤더 바에 로고, 관리자 이름, 로그아웃 버튼 포함
 * - children(Outlet)은 메인 콘텐츠 영역에 렌더링
 * - 데스크톱 전용: 최소 1024px
 */
const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // 사이드바 토글 (태블릿 대응)
  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen min-w-[1024px] bg-[#F6F6F6]">
      {/* 상단 헤더 바 */}
      <header className="h-14 bg-white border-b border-[#CACACA] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* 사이드바 토글 버튼 */}
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="p-1.5 rounded hover:bg-[#F6F6F6] transition-colors"
            aria-label="사이드바 토글"
          >
            <svg className="w-5 h-5 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* 로고 */}
          <h1 className="text-lg font-semibold text-[#424242]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            후니프린팅 Admin
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* 관리자 이름 */}
          <span className="text-sm text-[#979797]">{admin?.name ?? '관리자'}</span>
          {/* 로그아웃 버튼 */}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'h-[36px] px-4 rounded text-sm font-medium transition-colors',
              'bg-[#5538B6] text-white hover:bg-[#4530A0]'
            )}
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 본문: 사이드바 + 메인 콘텐츠 */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* 좌측 사이드바 */}
        <AdminSidebar collapsed={sidebarCollapsed} />

        {/* 우측 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
