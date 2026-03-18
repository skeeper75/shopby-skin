import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] 인쇄 카테고리 퀵 링크 그리드 - 모바일 4열, 데스크탑 8열
// @MX:SPEC: SPEC-SKIN-001 TAG-009

// 인쇄 카테고리 목록 (Shopby API 카테고리 데이터가 없을 경우 기본값)
const PRINT_CATEGORIES = [
  {
    id: 'postcards',
    label: '엽서',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    href: '/display/search?keyword=엽서',
  },
  {
    id: 'stickers',
    label: '스티커',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
        <path d="M14 3v6h6" />
      </svg>
    ),
    href: '/display/search?keyword=스티커',
  },
  {
    id: 'business-cards',
    label: '명함',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="8" x2="8" y1="10" y2="14" />
        <line x1="12" x2="12" y1="10" y2="14" />
        <line x1="16" x2="16" y1="10" y2="14" />
      </svg>
    ),
    href: '/display/search?keyword=명함',
  },
  {
    id: 'flyers',
    label: '전단지',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
    href: '/display/search?keyword=전단지',
  },
  {
    id: 'posters',
    label: '포스터',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    href: '/display/search?keyword=포스터',
  },
  {
    id: 'calendars',
    label: '달력',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    href: '/display/search?keyword=달력',
  },
  {
    id: 'booklets',
    label: '소책자',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      </svg>
    ),
    href: '/display/search?keyword=소책자',
  },
  {
    id: 'stationery',
    label: '문구',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1.3-3.8.7l-.4-.2c-1.3-.6-1.6-2.1-.7-3.2L15 6" />
        <path d="m2 22 2-2" />
      </svg>
    ),
    href: '/display/search?keyword=문구',
  },
];

const CategoryQuickLinks = () => {
  return (
    <div>
      <h2 className={cn('text-lg lg:text-xl font-bold text-center mb-6')}>인기 카테고리</h2>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
        {PRINT_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl',
              'bg-muted/50 hover:bg-muted transition-colors',
              'group cursor-pointer'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center',
                'w-12 h-12 lg:w-14 lg:h-14 rounded-full',
                'bg-primary/10 text-primary',
                'group-hover:bg-primary/20 transition-colors'
              )}
            >
              {category.icon}
            </div>
            <span className="text-xs lg:text-sm font-medium text-foreground text-center">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryQuickLinks;
