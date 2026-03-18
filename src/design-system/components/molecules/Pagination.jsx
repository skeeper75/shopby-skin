/**
 * Pagination 컴포넌트
 *
 * numbered(페이지 번호) / loadMore(더 보기 버튼) variant를 지원하는
 * 커스텀 페이지네이션. Radix 없이 순수 구현.
 *
 * @MX:NOTE: [AUTO] numbered/loadMore variant 지원, siblingCount 기반 페이지 범위 계산
 * @MX:SPEC: SPEC-DS-006
 */
import React, { forwardRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * 표시할 페이지 번호 범위를 계산한다.
 * 항상 첫/마지막 페이지를 포함하고, 중간 생략은 'ellipsis'로 표시.
 *
 * @param {number} currentPage - 현재 페이지
 * @param {number} totalPages - 전체 페이지 수
 * @param {number} siblingCount - 현재 페이지 양쪽에 표시할 페이지 수
 * @returns {Array<number|'ellipsis'>} 페이지 번호 배열
 */
function getPageRange(currentPage, totalPages, siblingCount) {
  // 전체 표시 개수: 첫페이지 + 마지막페이지 + 현재 + 양쪽 sibling + 양쪽 ellipsis
  const totalPageNumbers = siblingCount * 2 + 5;

  // 전체 페이지가 표시 가능 범위 이내이면 모두 표시
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  // 좌측 ellipsis 없음 (첫 페이지 근처)
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  // 우측 ellipsis 없음 (마지막 페이지 근처)
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  // 양쪽 모두 ellipsis
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

/**
 * 페이지네이션 컴포넌트
 *
 * @param {'numbered'|'loadMore'} [variant='numbered'] - 표시 모드
 * @param {number} currentPage - 현재 페이지 (1부터 시작)
 * @param {number} totalPages - 전체 페이지 수
 * @param {Function} onPageChange - 페이지 변경 콜백 (page: number) => void
 * @param {number} [siblingCount=1] - 현재 페이지 양쪽에 표시할 페이지 수
 */
const Pagination = forwardRef(function Pagination(
  {
    className,
    variant = 'numbered',
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    ...props
  },
  ref
) {
  const pages = useMemo(
    () => getPageRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  // ── loadMore variant ──
  if (variant === 'loadMore') {
    const isDisabled = currentPage >= totalPages;

    return (
      <nav ref={ref} aria-label="페이지 네비게이션" className={cn(className)} {...props}>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => !isDisabled && onPageChange?.(currentPage + 1)}
          className={cn(
            'w-full py-[var(--huni-space-3,12px)]',
            'border border-[var(--huni-stroke-neutral-muted)] rounded-[var(--huni-radius-1)]',
            'text-[14px] font-medium text-[var(--huni-fg-neutral)]',
            'transition-colors cursor-pointer',
            'hover:bg-[var(--huni-bg-neutral-weak)]',
            'disabled:text-[var(--huni-fg-disabled)] disabled:cursor-not-allowed disabled:hover:bg-transparent'
          )}
        >
          더 보기
        </button>
      </nav>
    );
  }

  // ── numbered variant ──
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  /** 공통 페이지 버튼 기본 스타일 */
  const pageButtonBase =
    'inline-flex items-center justify-center w-8 h-8 rounded-[var(--huni-radius-1)] text-[14px] transition-colors cursor-pointer select-none';

  return (
    <nav
      ref={ref}
      aria-label="페이지 네비게이션"
      className={cn('flex items-center gap-[var(--huni-space-1,4px)]', className)}
      {...props}
    >
      {/* 이전 페이지 */}
      <button
        type="button"
        disabled={isFirstPage}
        aria-label="이전 페이지"
        onClick={() => !isFirstPage && onPageChange?.(currentPage - 1)}
        className={cn(
          pageButtonBase,
          isFirstPage
            ? 'text-[var(--huni-fg-disabled)] cursor-not-allowed'
            : 'text-[var(--huni-fg-neutral)] hover:bg-[var(--huni-bg-neutral-weak)]'
        )}
      >
        <ChevronLeft size={16} />
      </button>

      {/* 페이지 번호 */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center justify-center w-8 h-8 text-[14px] text-[var(--huni-fg-neutral-subtle)] select-none"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => !isCurrent && onPageChange?.(page)}
            className={cn(
              pageButtonBase,
              isCurrent
                ? 'bg-[var(--huni-bg-brand-solid)] text-[var(--huni-fg-neutral-inverted)] font-bold'
                : 'text-[var(--huni-fg-neutral)] hover:bg-[var(--huni-bg-neutral-weak)]'
            )}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 페이지 */}
      <button
        type="button"
        disabled={isLastPage}
        aria-label="다음 페이지"
        onClick={() => !isLastPage && onPageChange?.(currentPage + 1)}
        className={cn(
          pageButtonBase,
          isLastPage
            ? 'text-[var(--huni-fg-disabled)] cursor-not-allowed'
            : 'text-[var(--huni-fg-neutral)] hover:bg-[var(--huni-bg-neutral-weak)]'
        )}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
