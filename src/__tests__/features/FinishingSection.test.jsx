/**
 * FinishingSection 테스트 - 접기/펴기 마감 옵션 섹션
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import FinishingSection from '../../components/PrintConfigurator/FinishingSection';

describe('FinishingSection', () => {
  const defaultProps = {
    selected: [],
    onToggle: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('마감 옵션 헤더를 렌더링한다', () => {
    render(<FinishingSection {...defaultProps} />);
    expect(screen.getByText('마감 옵션')).toBeInTheDocument();
  });

  it('초기에는 옵션이 숨겨져 있다', () => {
    render(<FinishingSection {...defaultProps} />);
    expect(screen.queryByText('스테이플 제본')).not.toBeInTheDocument();
  });

  it('헤더 클릭 시 옵션이 펼쳐진다', () => {
    render(<FinishingSection {...defaultProps} />);
    fireEvent.click(screen.getByText('마감 옵션'));
    expect(screen.getByText('스테이플 제본')).toBeInTheDocument();
    expect(screen.getByText('링 제본')).toBeInTheDocument();
    expect(screen.getByText('접지')).toBeInTheDocument();
    expect(screen.getByText('타공')).toBeInTheDocument();
    expect(screen.getByText('접음선 가공')).toBeInTheDocument();
  });

  it('옵션 클릭 시 onToggle을 호출한다', () => {
    render(<FinishingSection {...defaultProps} />);
    fireEvent.click(screen.getByText('마감 옵션'));
    fireEvent.click(screen.getByText('접지'));
    expect(defaultProps.onToggle).toHaveBeenCalledWith('FOLDING');
  });

  it('선택된 옵션 수를 표시한다', () => {
    render(<FinishingSection {...defaultProps} selected={['STAPLE', 'FOLDING']} />);
    expect(screen.getByText('(2개 선택됨)')).toBeInTheDocument();
  });

  it('선택된 옵션에 활성 스타일이 적용된다', () => {
    render(<FinishingSection {...defaultProps} selected={['STAPLE']} />);
    fireEvent.click(screen.getByText('마감 옵션'));
    const stapleBtn = screen.getByText('스테이플 제본');
    expect(stapleBtn.className).toContain('border-[#5538B6]');
  });

  it('다시 클릭하면 섹션이 접힌다', () => {
    render(<FinishingSection {...defaultProps} />);
    fireEvent.click(screen.getByText('마감 옵션'));
    expect(screen.getByText('스테이플 제본')).toBeInTheDocument();
    fireEvent.click(screen.getByText('마감 옵션'));
    expect(screen.queryByText('스테이플 제본')).not.toBeInTheDocument();
  });
});
