// @MX:NOTE: [AUTO] 인쇄 전문 카테고리 메가메뉴 컴포넌트
// @MX:SPEC: SPEC-SKIN-001 REQ-PS01
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { arrayOf, bool, number, shape, string } from 'prop-types';

import { useMallStateContext } from '@shopby/react-components';

import { PRINT_CATEGORIES, CATEGORY_NO_MAP } from '../../constants/printCategories';
import { cn } from '../../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';

// =============================================
// 헬퍼: API 카테고리와 인쇄 카테고리 병합
// =============================================

/**
 * Shopby API 카테고리가 있으면 해당 데이터를 기반으로 인쇄 카테고리 구조를 반환
 * API 카테고리가 없으면 PRINT_CATEGORIES fallback 데이터 사용
 */
const usePrintCategories = () => {
  const { categories } = useMallStateContext();
  const apiCategories = categories?.multiLevelCategories;

  // API 카테고리가 있으면 그대로 사용 (기존 Shopby 데이터 우선)
  if (apiCategories?.length > 0) {
    return {
      categories: apiCategories.map((cat) => ({
        id: String(cat.categoryNo),
        name: cat.label,
        icon: cat.icon || null,
        categoryNo: cat.categoryNo,
        subCategories: (cat.children || []).map((child) => ({
          id: String(child.categoryNo),
          name: child.label,
          categoryNo: child.categoryNo,
        })),
      })),
      isFromApi: true,
    };
  }

  // API 데이터가 없으면 인쇄 카테고리 fallback 사용
  return {
    categories: PRINT_CATEGORIES,
    isFromApi: false,
  };
};

/**
 * 카테고리 링크 URL 생성
 * API 카테고리면 categoryNo 기반, fallback이면 id 기반
 */
const getCategoryUrl = (category, isFromApi) => {
  if (isFromApi && category.categoryNo) {
    return `/products?categoryNo=${category.categoryNo}`;
  }
  // fallback 카테고리: CATEGORY_NO_MAP에 매핑이 있으면 사용
  const mappedNo = CATEGORY_NO_MAP[category.id];
  if (mappedNo) {
    return `/products?categoryNo=${mappedNo}`;
  }

  return `/products?category=${category.id}`;
};

// =============================================
// 데스크톱 메가메뉴 카테고리 컴포넌트
// =============================================

/** 개별 카테고리 카드 (메가메뉴 내 그리드 아이템) */
const CategoryCard = ({ category, isFromApi }) => (
  <li>
    <NavigationMenuLink asChild>
      <NavLink
        to={getCategoryUrl(category, isFromApi)}
        className={cn(
          'group block select-none rounded-lg p-3 leading-none no-underline outline-none',
          'transition-colors hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground'
        )}
      >
        {/* 아이콘 + 카테고리명 */}
        <div className="flex items-center gap-2 mb-2">
          {category.icon && (
            <span className="text-lg" role="img" aria-hidden="true">
              {category.icon}
            </span>
          )}
          <span className="text-sm font-semibold leading-none">{category.name}</span>
        </div>

        {/* 서브카테고리 목록 */}
        {category.subCategories?.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {category.subCategories.map((sub) => (
              <span
                key={sub.id}
                className="text-xs text-muted-foreground group-hover:text-accent-foreground/70"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}
      </NavLink>
    </NavigationMenuLink>
  </li>
);

CategoryCard.propTypes = {
  category: shape({
    id: string,
    name: string,
    icon: string,
    categoryNo: number,
    subCategories: arrayOf(
      shape({
        id: string,
        name: string,
      })
    ),
  }).isRequired,
  isFromApi: bool,
};

/** 데스크톱 인쇄 카테고리 메가메뉴 */
const DesktopPrintMegaMenu = () => {
  const { categories: printCategories, isFromApi } = usePrintCategories();

  if (!printCategories?.length) return null;

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {/* 전체 카테고리 메가메뉴 트리거 */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            인쇄 카테고리
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-2 p-4 md:w-[600px] md:grid-cols-2 lg:w-[800px] lg:grid-cols-4">
              {printCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isFromApi={isFromApi}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 주요 카테고리 개별 링크 (최대 5개까지 표시) */}
        {printCategories.slice(0, 5).map((category) => {
          const hasChildren = category.subCategories?.length > 0;

          if (!hasChildren) {
            return (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={getCategoryUrl(category, isFromApi)}
                    className={cn(
                      'group inline-flex h-10 w-max items-center justify-center',
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground focus:outline-none'
                    )}
                  >
                    {category.name}
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger className="text-sm">
                {category.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2 p-4 md:w-[400px] md:grid-cols-2">
                  {category.subCategories.map((sub) => (
                    <li key={sub.id}>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to={getCategoryUrl(sub, isFromApi)}
                          className={cn(
                            'block select-none rounded-md p-3 text-sm leading-none',
                            'no-underline outline-none transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            'focus:bg-accent focus:text-accent-foreground'
                          )}
                        >
                          {sub.name}
                        </NavLink>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// =============================================
// 모바일 카테고리 목록 (Sheet 메뉴 내부용)
// =============================================

/** 모바일 아코디언 카테고리 목록 */
const MobilePrintCategories = () => {
  const { categories: printCategories, isFromApi } = usePrintCategories();
  const [expandedId, setExpandedId] = useState(null);

  if (!printCategories?.length) return null;

  const toggleExpand = (categoryId) => {
    setExpandedId((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <nav className="flex flex-col" aria-label="인쇄 카테고리 메뉴">
      {printCategories.map((category) => {
        const hasChildren = category.subCategories?.length > 0;
        const isExpanded = expandedId === category.id;

        return (
          <div key={category.id} className="border-b border-border">
            <div className="flex items-center">
              {/* 카테고리 아이콘 */}
              {category.icon && (
                <span className="pl-4 text-base" role="img" aria-hidden="true">
                  {category.icon}
                </span>
              )}

              {/* 카테고리 링크 */}
              <NavLink
                to={getCategoryUrl(category, isFromApi)}
                className="flex-1 px-3 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {category.name}
              </NavLink>

              {/* 확장 버튼 */}
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-expanded={isExpanded}
                  aria-label={`${category.name} 하위 카테고리 ${isExpanded ? '접기' : '펼치기'}`}
                >
                  <svg
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* 하위 카테고리 (확장 시 표시) */}
            {hasChildren && isExpanded && (
              <div className="bg-muted/50 pb-2">
                {category.subCategories.map((sub) => (
                  <NavLink
                    key={sub.id}
                    to={getCategoryUrl(sub, isFromApi)}
                    className="block px-10 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export { DesktopPrintMegaMenu, MobilePrintCategories };
export default DesktopPrintMegaMenu;
