/**
 * Notice 페이지 테스트
 *
 * SPEC-SKIN-004 REQ-001: 공지사항
 * - 카테고리 탭: 전체/이벤트/공지/상품
 * - 각 항목 뱃지로 카테고리 구분
 * - 클릭 시 상세 내용 표시
 * - 무한 스크롤
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockFetchInitialItems = vi.fn();

vi.mock('@shopby/react-components', () => {
  const React = require('react');
  return {
    ArticleProvider: ({ children }) => <>{children}</>,
    useArticleStateContext: vi.fn(() => ({
      boardPosts: { totalCount: 3 },
    })),
    useArticleActionContext: vi.fn(() => ({
      fetchBoardPosts: vi.fn().mockResolvedValue({
        data: { items: [] },
      }),
    })),
    useMallStateContext: vi.fn(() => ({
      mallName: '후니프린팅',
      boardsCategories: [{ boardId: 'notice', boardName: '공지사항', boardNo: 1 }],
    })),
    useInfiniteScroll: vi.fn(() => ({
      isLoading: false,
      accumulativeItems: [
        { postNo: 1, title: '봄맞이 할인 이벤트', noticed: false, secreted: false, registerYmdt: '2026-03-12 10:00:00', categoryName: 'event' },
        { postNo: 2, title: '설 연휴 배송 안내', noticed: true, secreted: false, registerYmdt: '2026-03-10 09:00:00', categoryName: 'notice' },
        { postNo: 3, title: '신규 용지 입고', noticed: false, secreted: false, registerYmdt: '2026-03-08 14:00:00', categoryName: 'product' },
      ],
      fetchInitialItems: mockFetchInitialItems,
      isInfiniteScrollDisabled: false,
      onIntersect: vi.fn(),
    })),
    InfiniteScrollLoader: ({ onIntersect, disabled }) => (
      <div data-testid="infinite-scroll" data-disabled={disabled} />
    ),
  };
});

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange, ...props }) => (
    <div data-testid="tabs" data-value={value} {...props}>
      {typeof children === 'function' ? children : children}
    </div>
  ),
  TabsList: ({ children, ...props }) => <div role="tablist" {...props}>{children}</div>,
  TabsTrigger: ({ children, value, onClick, ...props }) => (
    <button role="tab" data-value={value} onClick={() => {
      // TabsTrigger가 렌더링되는 Tabs에 onValueChange를 호출해야 함
      // 간단히 부모에 이벤트를 버블링하는 방식
    }} {...props}>{children}</button>
  ),
  TabsContent: ({ children, value, ...props }) => <div role="tabpanel" data-value={value} {...props}>{children}</div>,
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant, className }) => (
    <span data-testid="badge" data-variant={variant} className={className}>{children}</span>
  ),
}));

vi.mock('../../components/ErrorBoundary', () => ({
  useErrorBoundaryActionContext: vi.fn(() => ({ catchError: vi.fn() })),
}));

vi.mock('../../components/ListSkeleton/ListSkeleton', () => ({
  default: ({ isLoading }) => isLoading ? <div data-testid="skeleton">Loading...</div> : null,
}));

vi.mock('../../constants/common', () => ({
  INFINITY_SCROLL_PAGE_SIZE: 20,
}));

vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));

vi.mock('../../pages/Notice/NoticeDetailModal', () => ({
  default: ({ noticeNo, onClose }) => (
    <div data-testid="notice-detail-modal" data-notice-no={noticeNo}>
      <button onClick={onClose}>닫기</button>
    </div>
  ),
}));

import { useArticleStateContext, useInfiniteScroll } from '@shopby/react-components';
import Notice from '../../pages/Notice/Notice';

describe('Notice 페이지', () => {
  beforeEach(() => vi.clearAllMocks());

  it('"공지사항" 헤더를 표시한다', () => {
    render(<Notice />);
    expect(screen.getByText('공지사항')).toBeInTheDocument();
  });

  it('몰 이름 안내 문구를 표시한다', () => {
    render(<Notice />);
    expect(screen.getByText(/후니프린팅에서 알려드립니다/)).toBeInTheDocument();
  });

  it('카테고리 탭을 표시한다 (전체/이벤트/공지/상품)', () => {
    render(<Notice />);
    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '이벤트' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '공지' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '상품' })).toBeInTheDocument();
  });

  it('공지사항 목록을 렌더링한다', () => {
    render(<Notice />);
    // 각 TabsContent에서 렌더링되므로 multiple 가능
    expect(screen.getAllByText('봄맞이 할인 이벤트').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('설 연휴 배송 안내').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('신규 용지 입고').length).toBeGreaterThanOrEqual(1);
  });

  it('날짜를 표시한다', () => {
    render(<Notice />);
    expect(screen.getAllByText('2026-03-12').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2026-03-10').length).toBeGreaterThanOrEqual(1);
  });

  it('카테고리 배지를 표시한다', () => {
    render(<Notice />);
    const badges = screen.getAllByTestId('badge');
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });

  it('공지 항목 클릭 시 상세 모달을 표시한다', () => {
    render(<Notice />);
    fireEvent.click(screen.getAllByText('봄맞이 할인 이벤트')[0]);
    expect(screen.getByTestId('notice-detail-modal')).toBeInTheDocument();
  });

  it('무한 스크롤 로더를 렌더링한다', () => {
    render(<Notice />);
    expect(screen.getAllByTestId('infinite-scroll').length).toBeGreaterThanOrEqual(1);
  });

  it('공지사항이 없을 때 빈 상태를 표시한다', () => {
    vi.mocked(useArticleStateContext).mockReturnValueOnce({
      boardPosts: { totalCount: 0 },
    });
    vi.mocked(useInfiniteScroll).mockReturnValueOnce({
      isLoading: false,
      accumulativeItems: [],
      fetchInitialItems: vi.fn(),
      isInfiniteScrollDisabled: true,
      onIntersect: vi.fn(),
    });

    render(<Notice />);
    // 4개의 TabsContent에서 각각 빈 상태 표시
    expect(screen.getAllByText('등록된 공지사항이 없습니다.').length).toBeGreaterThanOrEqual(1);
  });
});
