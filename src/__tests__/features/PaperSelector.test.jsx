/**
 * PaperSelector 테스트 - 용지 선택 커스텀 드롭다운
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import PaperSelector from '../../components/PrintConfigurator/PaperSelector';

describe('PaperSelector', () => {
  const defaultProps = {
    selected: '',
    onSelect: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('용지 라벨을 렌더링한다', () => {
    render(<PaperSelector {...defaultProps} />);
    expect(screen.getByText('용지')).toBeInTheDocument();
  });

  it('기본 플레이스홀더를 표시한다', () => {
    render(<PaperSelector {...defaultProps} />);
    expect(screen.getByText('용지를 선택해주세요')).toBeInTheDocument();
  });

  it('선택된 용지 이름을 표시한다', () => {
    render(<PaperSelector {...defaultProps} selected="ART_COAT_130" />);
    expect(screen.getByText('아트코트지 130g')).toBeInTheDocument();
  });

  it('클릭 시 드롭다운을 연다', () => {
    render(<PaperSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('용지를 선택해주세요'));
    expect(screen.getByText('아트코트지 130g')).toBeInTheDocument();
    expect(screen.getByText('매트코트지 130g')).toBeInTheDocument();
    expect(screen.getByText('일반복사지 80g')).toBeInTheDocument();
  });

  it('옵션 클릭 시 onSelect를 호출하고 드롭다운을 닫는다', () => {
    render(<PaperSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('용지를 선택해주세요'));
    fireEvent.click(screen.getByText('매트코트지 200g'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('MATTE_COAT_200');
  });

  it('외부 클릭 시 드롭다운을 닫는다', () => {
    render(<PaperSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('용지를 선택해주세요'));
    expect(screen.getByText('아트코트지 130g')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('일반복사지 80g')).not.toBeInTheDocument();
  });

  it('에러 메시지를 표시한다', () => {
    render(<PaperSelector {...defaultProps} error="용지를 선택해주세요." />);
    expect(screen.getByText('용지를 선택해주세요.')).toBeInTheDocument();
  });
});
