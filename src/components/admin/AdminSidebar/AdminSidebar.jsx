import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '../../../lib/utils';

// @MX:NOTE: [AUTO] 관리자 사이드바 메뉴 정의 - 주문관리만 서브메뉴 포함
// @MX:SPEC: SPEC-SKIN-005
const MENU_ITEMS = [
  { label: '대시보드', path: '/admin/dashboard', icon: 'dashboard' },
  {
    label: '주문관리',
    icon: 'order',
    children: [
      { label: '전체목록', path: '/admin/orders' },
      { label: '파일확인', path: '/admin/orders/files' },
      { label: '상태변경', path: '/admin/orders/status' },
      { label: '주문서출력', path: '/admin/orders/print' },
      { label: '후불결제', path: '/admin/orders/deferred' },
      { label: '증빙서류', path: '/admin/orders/documents' },
      { label: 'SMS발송', path: '/admin/orders/sms' },
    ],
  },
  { label: '상품관리', path: '/admin/products', icon: 'product' },
  { label: '게시판관리', path: '/admin/boards', icon: 'board' },
  { label: '회원관리', path: '/admin/members', icon: 'member' },
  { label: '쿠폰관리', path: '/admin/coupons', icon: 'coupon' },
  { label: '거래처관리', path: '/admin/partners', icon: 'partner' },
  { label: '원장관리', path: '/admin/ledger', icon: 'ledger' },
  { label: '통계', path: '/admin/statistics', icon: 'stats' },
  { label: '관리자설정', path: '/admin/settings', icon: 'settings' },
];

// 사이드바 메뉴 아이콘 매핑
const MENU_ICONS = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  order: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  product: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  board: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  member: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  coupon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  partner: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  ledger: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  stats: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

/**
 * 관리자 사이드바 컴포넌트
 * 네비게이션 메뉴와 접이식 서브메뉴를 제공합니다.
 * 데스크톱 전용 (최소 1024px)
 */
const AdminSidebar = ({ collapsed = false }) => {
  // 주문관리 서브메뉴 펼침 상태
  const [expandedMenu, setExpandedMenu] = useState(null);

  // 서브메뉴 토글
  const handleToggleSubmenu = (label) => {
    setExpandedMenu((prev) => (prev === label ? null : label));
  };

  // 활성 네비게이션 링크 스타일
  const getNavLinkClassName = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-r-md',
      isActive
        ? 'text-[#5538B6] bg-[#EEEBF9] border-l-[3px] border-[#5538B6] font-semibold'
        : 'text-[#424242] hover:bg-[#F6F6F6] border-l-[3px] border-transparent'
    );

  return (
    <aside
      className={cn(
        'h-full bg-white border-r border-[#CACACA] overflow-y-auto transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-[250px]'
      )}
    >
      <nav className="py-4">
        <ul className="space-y-0.5">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              {/* 서브메뉴가 있는 항목 */}
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleToggleSubmenu(item.label)}
                    className={cn(
                      'flex items-center justify-between w-full px-4 py-2.5 text-sm text-[#424242] hover:bg-[#F6F6F6] transition-colors border-l-[3px] border-transparent',
                      expandedMenu === item.label && 'bg-[#F6F6F6]'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {!collapsed && MENU_ICONS[item.icon]}
                      {!collapsed && item.label}
                    </span>
                    {!collapsed && (
                      <svg
                        className={cn('w-4 h-4 transition-transform', expandedMenu === item.label && 'rotate-180')}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {/* 서브메뉴 목록 */}
                  {expandedMenu === item.label && !collapsed && (
                    <ul className="bg-[#F6F6F6]/50">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink to={child.path} className={getNavLinkClassName}>
                            <span className="pl-8">{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                /* 일반 메뉴 항목 */
                <NavLink to={item.path} className={getNavLinkClassName}>
                  {!collapsed && MENU_ICONS[item.icon]}
                  {!collapsed && item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
