/**
 * PrintFilterSidebar 테스트 - 인쇄 옵션 필터 사이드바
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import PrintFilterSidebar from '../../components/PrintFilter/PrintFilterSidebar';

describe('PrintFilterSidebar', () => {
  const defaultProps = {
    onFilterChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('필터 타이틀을 렌더링한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    expect(screen.getByText('인쇄 옵션 필터')).toBeInTheDocument();
  });

  it('사이즈/용지/코팅 필터 섹션을 렌더링한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    expect(screen.getByText('사이즈')).toBeInTheDocument();
    expect(screen.getByText('용지')).toBeInTheDocument();
    expect(screen.getByText('코팅')).toBeInTheDocument();
  });

  it('사이즈 필터 옵션을 렌더링한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    expect(screen.getByText('A4')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.getByText('B5')).toBeInTheDocument();
  });

  it('필터 적용 버튼을 렌더링한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    expect(screen.getByText('필터 적용')).toBeInTheDocument();
  });

  it('초기화 버튼을 렌더링한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    expect(screen.getByText('초기화')).toBeInTheDocument();
  });

  it('필터 선택 후 적용 시 onFilterChange를 호출한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    fireEvent.click(screen.getByText('A4'));
    fireEvent.click(screen.getByText('필터 적용'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      sizes: ['A4'],
      papers: [],
      coatings: [],
    });
  });

  it('복수 필터를 선택할 수 있다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    fireEvent.click(screen.getByText('A4'));
    fireEvent.click(screen.getByText('A3'));
    fireEvent.click(screen.getByText('무코팅'));
    fireEvent.click(screen.getByText('필터 적용'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      sizes: ['A4', 'A3'],
      papers: [],
      coatings: ['NONE'],
    });
  });

  it('같은 옵션을 다시 클릭하면 선택 해제된다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    fireEvent.click(screen.getByText('A4'));
    fireEvent.click(screen.getByText('A4'));
    fireEvent.click(screen.getByText('필터 적용'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      sizes: [],
      papers: [],
      coatings: [],
    });
  });

  it('초기화 시 모든 필터를 제거하고 onFilterChange를 호출한다', () => {
    render(<PrintFilterSidebar {...defaultProps} />);
    fireEvent.click(screen.getByText('A4'));
    fireEvent.click(screen.getByText('무코팅'));
    fireEvent.click(screen.getByText('초기화'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      sizes: [],
      papers: [],
      coatings: [],
    });
  });
});
