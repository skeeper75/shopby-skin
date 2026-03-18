// @MX:ANCHOR: Pagination - 관리자 페이지네이션 컴포넌트
// @MX:REASON: fan_in >= 3 (마스터데이터, 상품목록 등 다수 페이지에서 사용)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../Icon';

/**
 * Pagination 컴포넌트
 * @param {number} page - 현재 페이지 (1-based)
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 콜백
 * @param {number} [pageGroupSize=5] - 한 번에 표시할 페이지 수
 */
const Pagination = ({ page, totalPages, onPageChange, pageGroupSize = 5, className }) => {
  if (totalPages <= 1) return null;

  // 현재 페이지 그룹 계산
  const groupStart = Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;
  const groupEnd = Math.min(groupStart + pageGroupSize - 1, totalPages);
  const pages = [];
  for (let i = groupStart; i <= groupEnd; i++) {
    pages.push(i);
  }

  const btnBase =
    'inline-flex items-center justify-center w-8 h-8 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--huni-stroke-brand]';
  const btnActive = 'bg-[--huni-bg-brand] text-white font-semibold';
  const btnDefault =
    'border border-[--huni-stroke-default] text-[--huni-fg-default] hover:bg-[--huni-bg-subtle] disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <nav
      className={cn('flex items-center gap-1', className)}
      aria-label="페이지 탐색"
    >
      {/* 처음 */}
      <button
        className={cn(btnBase, btnDefault)}
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        aria-label="첫 페이지"
      >
        <Icon name="ChevronsLeft" size={14} />
      </button>

      {/* 이전 그룹 */}
      <button
        className={cn(btnBase, btnDefault)}
        onClick={() => onPageChange(Math.max(1, groupStart - 1))}
        disabled={groupStart === 1}
        aria-label="이전"
      >
        <Icon name="ChevronLeft" size={14} />
      </button>

      {/* 페이지 번호 */}
      {pages.map((p) => (
        <button
          key={p}
          className={cn(btnBase, p === page ? btnActive : btnDefault)}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {/* 다음 그룹 */}
      <button
        className={cn(btnBase, btnDefault)}
        onClick={() => onPageChange(Math.min(totalPages, groupEnd + 1))}
        disabled={groupEnd === totalPages}
        aria-label="다음"
      >
        <Icon name="ChevronRight" size={14} />
      </button>

      {/* 마지막 */}
      <button
        className={cn(btnBase, btnDefault)}
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        aria-label="마지막 페이지"
      >
        <Icon name="ChevronsRight" size={14} />
      </button>
    </nav>
  );
};

export { Pagination };
