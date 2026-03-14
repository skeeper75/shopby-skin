import { Link, useLocation } from 'react-router-dom';

import { string, func } from 'prop-types';

import { IconSVG } from '@shopby/react-components';

import { cn } from '../../lib/utils';

// 하단 네비게이션 아이템 정의
const NAV_ITEMS = [
  { path: '/', label: '홈', icon: 'home', type: 'link' },
  { path: '/display-category-list', label: '카테고리', icon: 'hamburger-menu', type: 'link' },
  { path: null, label: '검색', icon: 'search', type: 'search' },
  { path: '/my-page', label: '마이페이지', icon: 'person', type: 'link' },
  { path: '/cart', label: '장바구니', icon: 'cart', type: 'link' },
];

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
              <IconSVG size={24} name={item.icon} strokeWidth={4} />
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
            <IconSVG size={24} name={item.icon} strokeWidth={isActive ? 5 : 4} />
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
