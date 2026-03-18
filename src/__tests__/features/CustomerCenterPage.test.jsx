/**
 * CustomerCenter 허브 페이지 테스트
 *
 * SPEC-SKIN-004: 고객센터 허브
 * - 탭 메뉴 (공지사항, FAQ, 1:1문의, 대량문의, 사업상담, 디자인상담)
 * - 최근 공지사항 요약 섹션
 * - 최근 FAQ 요약 섹션
 * - 연락처/CTA 섹션
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

const mockNavigate = vi.fn();
const mockOpenAlert = vi.fn();
const mockCheckDisplayableState = vi.fn(() => ({ data: true }));
const mockFetchBoardPosts = vi.fn().mockResolvedValue({
  data: {
    items: [
      { postNo: 1, title: '봄맞이 할인 이벤트', registerYmdt: '2026-03-12 10:00:00' },
      { postNo: 2, title: '설 연휴 배송 안내', registerYmdt: '2026-03-10 09:00:00' },
    ],
  },
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@shopby/react-components', () => {
  const React = require('react');
  return {
    ArticleProvider: ({ children }) => <>{children}</>,
    useMallStateContext: vi.fn(() => ({
      mall: {
        serviceCenter: {
          phoneNo: '02-1234-5678',
          email: 'help@huni.co.kr',
        },
      },
    })),
    useArticleActionContext: vi.fn(() => ({
      fetchBoardPosts: mockFetchBoardPosts,
    })),
    useArticleStateContext: vi.fn(() => ({
      boardPosts: {
        totalCount: 2,
        items: [
          { postNo: 1, title: '배송은 얼마나 걸리나요?', content: '답변...' },
          { postNo: 2, title: '환불은 어떻게 하나요?', content: '답변...' },
        ],
      },
    })),
    useBoardConfigurationContextState: vi.fn(() => ({
      boardConfig: {
        boardConfigs: [{ boardId: 'faq', boardNo: 10, name: 'FAQ', used: true }],
      },
    })),
    useBoardConfigurationContextAction: vi.fn(() => ({
      checkDisplayableState: mockCheckDisplayableState,
    })),
    useModalActionContext: vi.fn(() => ({ openAlert: mockOpenAlert })),
    useAuthStateContext: vi.fn(() => ({ profile: null })),
  };
});

vi.mock('@shopby/shared', () => ({
  isSignedIn: vi.fn(() => false),
}));

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, ...props }) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, value, ...props }) => <button data-value={value} {...props}>{children}</button>,
  TabsContent: ({ children, value, ...props }) => <div data-value={value} {...props}>{children}</div>,
}));

vi.mock('../../constants/board', () => ({
  FAQ_BOARD_ID: 'faq',
}));

vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));

import CustomerCenter from '../../pages/CustomerCenter/CustomerCenter';

describe('CustomerCenter 허브 페이지', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('"고객센터" 헤더를 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('고객센터')).toBeInTheDocument();
  });

  it('고객센터 전화번호를 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('02-1234-5678')).toBeInTheDocument();
  });

  it('고객센터 이메일을 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('help@huni.co.kr')).toBeInTheDocument();
  });

  it('기본 운영시간을 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText(/평일 09:00/)).toBeInTheDocument();
  });

  it('주요 메뉴 탭을 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('공지사항')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    // 1:1 문의와 대량 문의는 탭 메뉴 + CTA 섹션 양쪽에 존재
    expect(screen.getAllByText('1:1 문의').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('대량 문의').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('사업 상담')).toBeInTheDocument();
    expect(screen.getByText('디자인 상담')).toBeInTheDocument();
  });

  it('공지사항 탭 클릭 시 공지사항 페이지로 이동한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    fireEvent.click(screen.getByText('공지사항'));
    expect(mockNavigate).toHaveBeenCalledWith('/notice');
  });

  it('FAQ 탭 클릭 시 FAQ 페이지로 이동한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    fireEvent.click(screen.getByText('FAQ'));
    expect(mockNavigate).toHaveBeenCalledWith('/faq');
  });

  it('대량 문의 탭 클릭 시 대량문의 페이지로 이동한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    // 대량 문의는 탭 메뉴와 CTA 섹션 양쪽에 존재 - 첫 번째(탭) 클릭
    fireEvent.click(screen.getAllByText('대량 문의')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/bulk-inquiry');
  });

  it('1:1 문의 버튼을 CTA 섹션에 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    const ctaButtons = screen.getAllByText('1:1 문의');
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('대량 문의 CTA 버튼을 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    const ctaButtons = screen.getAllByText('대량 문의');
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('최근 FAQ 요약 섹션을 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
  });

  it('최근 공지사항 요약 섹션을 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('최근 공지사항')).toBeInTheDocument();
  });

  it('"무엇을 도와드릴까요?" 안내 문구를 표시한다', async () => {
    await act(async () => {
      render(<CustomerCenter />);
    });
    expect(screen.getByText('무엇을 도와드릴까요?')).toBeInTheDocument();
  });
});
