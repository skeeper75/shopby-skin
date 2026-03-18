import { Link, useLocation } from 'react-router-dom';

import { string, func } from 'prop-types';

import { IconSVG } from '@shopby/react-components';

import { cn } from '../../lib/utils';

// ICON_SET에 없는 아이콘을 인라인 SVG로 정의
const CustomIcon = ({ name, size = 24, strokeWidth = 2 }) => {
  const icons = {
    'hamburger-menu': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    person: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    cart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  };

  return icons[name] ?? null;
};

// ICON_SET에 등록된 아이콘 이름 목록
const BUILTIN_ICONS = new Set(['home', 'fill-heart', 'stroke-heart', 'down-load', 'a-star', 'angle-r', 'check', 'x', 'face', 'magnet', 'hamburger', 'exclamation', 'shopping-bag']);

// 하단 네비게이션 아이템 정의
const NAV_ITEMS = [
  { path: '/', label: '홈', icon: 'home', type: 'link' },
  { path: '/display-category-list', label: '카테고리', icon: 'hamburger-menu', type: 'link' },
  { path: null, label: '검색', icon: 'search', type: 'search' },
  { path: '/my-page', label: '마이페이지', icon: 'person', type: 'link' },
  { path: '/cart', label: '장바구니', icon: 'cart', type: 'link' },
];

// 아이콘 렌더링 — ICON_SET에 있으면 IconSVG, 없으면 CustomIcon 사용
const NavIcon = ({ name, size = 24, strokeWidth = 2 }) =>
  BUILTIN_ICONS.has(name)
    ? <IconSVG name={name} size={size} strokeWidth={strokeWidth} />
    : <CustomIcon name={name} size={size} strokeWidth={strokeWidth} />;

// 현재 경로가 네비게이션 아이템의 활성 상태인지 확인
const isActiveRoute = (pathname, itemPath) => {
  if (!itemPath) return false;
  if (itemPath === '/') return pathname === '/';

  return pathname.startsWith(itemPath);
};

const BottomNav = ({ className = '', search }) => {
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        // 기본 레이아웃: 모바일/태블릿에서만 표시
        'lg:hidden',
        // 고정 위치 및 크기
        'fixed bottom-0 left-0 right-0 z-50',
        // 배경 및 테두리
        'bg-white border-t border-gray-200',
        // 그림자 효과
        'shadow-[0_-2px_10px_rgba(0,0,0,0.06)]',
        // iOS safe area 하단 패딩
        'pb-[env(safe-area-inset-bottom,0px)]',
        // 5개 아이템 균등 배치
        'flex items-center justify-around',
        // 트랜지션 효과
        'transition-all duration-200',
        className
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isActiveRoute(pathname, item.path);

        // 검색 버튼은 Link가 아닌 button으로 렌더링
        if (item.type === 'search') {
          return (
            <button
              key={item.label}
              className={cn(
                'flex flex-col items-center justify-center',
                'flex-1 py-2 px-1',
                'bg-transparent border-none cursor-pointer',
                'transition-colors duration-200',
                'text-gray-400 hover:text-gray-900'
              )}
              onClick={search}
              type="button"
            >
              <NavIcon size={24} name={item.icon} strokeWidth={4} />
              <span className="mt-1 text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center',
              'flex-1 py-2 px-1 no-underline',
              'transition-colors duration-200',
              // 활성 탭 하이라이트
              isActive
                ? 'text-gray-900 font-semibold'
                : 'text-gray-400 hover:text-gray-900'
            )}
          >
            <NavIcon size={24} name={item.icon} strokeWidth={isActive ? 5 : 4} />
            <span className="mt-1 text-[10px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

BottomNav.propTypes = {
  className: string,
  search: func,
};

export default BottomNav;
