/**
 * OptionChipGroup 테스트 - 인쇄 옵션 칩 선택 컴포넌트
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import OptionChipGroup from '../../components/PrintConfigurator/OptionChipGroup';

const mockOptions = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'B5', label: 'B5', disabled: true },
];

describe('OptionChipGroup', () => {
  const defaultProps = {
    options: mockOptions,
    selected: 'A4',
    onSelect: vi.fn(),
    label: '사이즈',
  };

  beforeEach(() => vi.clearAllMocks());

  it('라벨을 렌더링한다', () => {
    render(<OptionChipGroup {...defaultProps} />);
    expect(screen.getByText('사이즈')).toBeInTheDocument();
  });

  it('모든 옵션 칩을 렌더링한다', () => {
    render(<OptionChipGroup {...defaultProps} />);
    expect(screen.getByText('A4')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.getByText('B5')).toBeInTheDocument();
  });

  it('선택된 칩에 활성 스타일이 적용된다', () => {
    render(<OptionChipGroup {...defaultProps} />);
    const selectedChip = screen.getByText('A4');
    expect(selectedChip.className).toContain('border-[#5538B6]');
  });

  it('칩 클릭 시 onSelect를 호출한다', () => {
    render(<OptionChipGroup {...defaultProps} />);
    fireEvent.click(screen.getByText('A3'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('A3');
  });

  it('비활성화된 칩은 클릭할 수 없다', () => {
    render(<OptionChipGroup {...defaultProps} />);
    const disabledChip = screen.getByText('B5');
    expect(disabledChip).toBeDisabled();
  });

  it('에러 메시지를 표시한다', () => {
    render(<OptionChipGroup {...defaultProps} error="사이즈를 선택해주세요." />);
    expect(screen.getByText('사이즈를 선택해주세요.')).toBeInTheDocument();
  });

  it('라벨이 없으면 라벨을 렌더링하지 않는다', () => {
    render(<OptionChipGroup {...defaultProps} label={undefined} />);
    expect(screen.queryByText('사이즈')).not.toBeInTheDocument();
  });
});
