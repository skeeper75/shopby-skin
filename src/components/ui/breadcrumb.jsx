import React from 'react';
import { cn } from '../../lib/utils';

// 브레드크럼 루트 네비게이션
const Breadcrumb = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" className={cn(className)} {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

// 브레드크럼 리스트 (ol 요소)
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500',
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

// 브레드크럼 아이템 (li 요소)
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

// 브레드크럼 링크 (클릭 가능한 항목)
const BreadcrumbLink = React.forwardRef(({ className, href, children, ...props }, ref) => (
  <a
    ref={ref}
    href={href}
    className={cn('transition-colors hover:text-gray-900', className)}
    {...props}
  >
    {children}
  </a>
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

// 현재 페이지 표시 (링크 없음, aria-current="page")
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-gray-900', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

// 구분자 (기본값: ChevronRight 아이콘)
const BreadcrumbSeparator = ({ children, className, ...props }) => (
  <li role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

// ChevronRight SVG 아이콘
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
