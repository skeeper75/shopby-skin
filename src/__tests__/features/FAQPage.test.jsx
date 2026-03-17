/**
 * FAQ 페이지 테스트
 *
 * SPEC-SKIN-004 REQ-002: FAQ
 * - 카테고리 탭: 전체/회원가입,로그인/주문,배송,결제/취소,환불/영수증
 * - 아코디언 클릭 시 답변 펼침
 * - 실시간 검색 필터링
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

const mockFetchBoardPosts = vi.fn().mockResolvedValue({
  data: { items: [] },
});
const mockFetchInitialItems = vi.fn();

vi.mock('@shopby/react-components', () => {
  const React = require('react');
  return {
    ArticleProvider: ({ children }) => <>{children}</>,
    useArticleStateContext: vi.fn(() => ({
      boardPosts: { totalCount: 3 },
    })),
    useArticleActionContext: vi.fn(() => ({
      fetchBoardPosts: mockFetchBoardPosts,
    })),
    useMallStateContext: vi.fn(() => ({
      boardsCategories: [{ boardId: 'faq', boardNo: 10 }],
    })),
    useInfiniteScroll: vi.fn(() => ({
      isLoading: false,
      accumulativeItems: [
        { postNo: 1, title: '주문 후 파일은 어떻게 보내나요?' },
        { postNo: 2, title: '배송은 얼마나 걸리나요?' },
        { postNo: 3, title: '환불은 어떻게 하나요?' },
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

vi.mock('../../components/ui/accordion', () => ({
  Accordion: ({ children, type, value, ...props }) => <div data-testid="accordion" {...props}>{children}</div>,
  AccordionItem: ({ children, value, className }) => <div data-testid={`accordion-item-${value}`} className={className}>{children}</div>,
  AccordionTrigger: ({ children, onClick, className }) => <button data-testid="accordion-trigger" onClick={onClick} className={className}>{children}</button>,
  AccordionContent: ({ children, className }) => <div data-testid="accordion-content" className={className}>{children}</div>,
}));

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange, ...props }) => <div data-testid="tabs" data-value={value} {...props}>{children}</div>,
  TabsList: ({ children, ...props }) => <div role="tablist" {...props}>{children}</div>,
  TabsTrigger: ({ children, value, ...props }) => <button role="tab" data-value={value} {...props}>{children}</button>,
  TabsContent: ({ children, value, ...props }) => <div role="tabpanel" data-value={value} {...props}>{children}</div>,
}));

vi.mock('../../components/Sanitized', () => ({
  default: ({ html, className }) => <div className={className} dangerouslySetInnerHTML={{ __html: html }} />,
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

vi.mock('../../utils/api', () => ({
  fetchHttpRequest: vi.fn().mockResolvedValue({ content: '답변 내용입니다.' }),
}));

import { useInfiniteScroll } from '@shopby/react-components';
import { fetchHttpRequest } from '../../utils/api';
import FAQ from '../../pages/FAQ/FAQ';

describe('FAQ 페이지', () => {
  beforeEach(() => vi.clearAllMocks());

  it('"자주 묻는 질문" 헤더를 표시한다', () => {
    render(<FAQ />);
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
  });

  it('검색 입력 필드를 표시한다', () => {
    render(<FAQ />);
    expect(screen.getByPlaceholderText('검색어를 입력하세요')).toBeInTheDocument();
  });

  it('카테고리 탭을 표시한다', () => {
    render(<FAQ />);
    expect(screen.getByRole('tab', { name: '전체' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '회원가입/로그인' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '주문/배송/결제' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '취소/환불' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '영수증' })).toBeInTheDocument();
  });

  it('FAQ 항목을 아코디언으로 렌더링한다', () => {
    render(<FAQ />);
    // 여러 TabsContent에서 각각 렌더링됨
    expect(screen.getAllByText('주문 후 파일은 어떻게 보내나요?').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('배송은 얼마나 걸리나요?').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('환불은 어떻게 하나요?').length).toBeGreaterThanOrEqual(1);
  });

  it('Q. 마커를 표시한다', () => {
    render(<FAQ />);
    const qMarkers = screen.getAllByText('Q.');
    // 3 items x 5 categories = 15개
    expect(qMarkers.length).toBeGreaterThanOrEqual(3);
  });

  it('검색어를 입력하면 실시간 필터링된다', () => {
    render(<FAQ />);
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    fireEvent.change(searchInput, { target: { value: '배송' } });

    // 배송 관련 FAQ만 표시 (여러 TabsContent에서)
    expect(screen.getAllByText('배송은 얼마나 걸리나요?').length).toBeGreaterThanOrEqual(1);
    // 나머지는 필터링되어 안 보여야 함
    expect(screen.queryByText('환불은 어떻게 하나요?')).not.toBeInTheDocument();
  });

  it('검색 결과가 없으면 빈 상태를 표시한다', () => {
    render(<FAQ />);
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    fireEvent.change(searchInput, { target: { value: '존재하지않는키워드' } });

    expect(screen.getAllByText('등록된 FAQ가 없습니다.').length).toBeGreaterThanOrEqual(1);
  });

  it('아코디언 트리거 클릭 시 답변 로드 API를 호출한다', async () => {
    vi.mocked(fetchHttpRequest).mockResolvedValue({ content: '답변 내용' });

    render(<FAQ />);
    const triggers = screen.getAllByTestId('accordion-trigger');
    expect(triggers.length).toBeGreaterThanOrEqual(1);

    await act(async () => {
      fireEvent.click(triggers[0]);
    });

    await waitFor(() => {
      expect(fetchHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('boards/faq/articles'),
          method: 'GET',
        })
      );
    });
  });

  it('무한 스크롤 로더를 렌더링한다', () => {
    render(<FAQ />);
    expect(screen.getAllByTestId('infinite-scroll').length).toBeGreaterThanOrEqual(1);
  });

  it('FAQ가 없으면 빈 상태를 표시한다', () => {
    vi.mocked(useInfiniteScroll).mockReturnValueOnce({
      isLoading: false,
      accumulativeItems: [],
      fetchInitialItems: vi.fn(),
      isInfiniteScrollDisabled: true,
      onIntersect: vi.fn(),
    });

    render(<FAQ />);
    expect(screen.getAllByText('등록된 FAQ가 없습니다.').length).toBeGreaterThanOrEqual(1);
  });
});
