/**
 * SizeSelector 테스트 - 사이즈 선택 + 맞춤 사이즈 입력
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import SizeSelector from '../../components/PrintConfigurator/SizeSelector';

describe('SizeSelector', () => {
  const defaultProps = {
    selected: '',
    customWidth: '',
    customHeight: '',
    onSelect: vi.fn(),
    onCustomChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('기본 사이즈 옵션들을 렌더링한다', () => {
    render(<SizeSelector {...defaultProps} />);
    expect(screen.getByText('A4')).toBeInTheDocument();
    expect(screen.getByText('A5')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.getByText('B5')).toBeInTheDocument();
    expect(screen.getByText('맞춤 사이즈')).toBeInTheDocument();
  });

  it('사이즈 선택 시 onSelect를 호출한다', () => {
    render(<SizeSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('A4'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('A4');
  });

  it('CUSTOM이 아닌 경우 맞춤 입력 필드를 숨긴다', () => {
    render(<SizeSelector {...defaultProps} selected="A4" />);
    expect(screen.queryByPlaceholderText('가로')).not.toBeInTheDocument();
  });

  it('CUSTOM 선택 시 가로/세로 입력 필드를 표시한다', () => {
    render(<SizeSelector {...defaultProps} selected="CUSTOM" />);
    expect(screen.getByPlaceholderText('가로')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('세로')).toBeInTheDocument();
  });

  it('맞춤 가로 입력 시 onCustomChange를 호출한다', () => {
    render(<SizeSelector {...defaultProps} selected="CUSTOM" />);
    fireEvent.change(screen.getByPlaceholderText('가로'), { target: { value: '210' } });
    expect(defaultProps.onCustomChange).toHaveBeenCalledWith('customWidth', '210');
  });

  it('맞춤 세로 입력 시 onCustomChange를 호출한다', () => {
    render(<SizeSelector {...defaultProps} selected="CUSTOM" />);
    fireEvent.change(screen.getByPlaceholderText('세로'), { target: { value: '297' } });
    expect(defaultProps.onCustomChange).toHaveBeenCalledWith('customHeight', '297');
  });

  it('mm 단위를 표시한다', () => {
    render(<SizeSelector {...defaultProps} selected="CUSTOM" />);
    const mmLabels = screen.getAllByText('mm');
    expect(mmLabels).toHaveLength(2);
  });
});
