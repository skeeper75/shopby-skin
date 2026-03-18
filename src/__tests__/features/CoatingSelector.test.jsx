/**
 * CoatingSelector 테스트 - 코팅 옵션 + 용지 호환성
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));
vi.mock('../../utils/printOptionValidator', () => ({
  isValidCoatingForPaper: vi.fn((paper, coating) => {
    // 일반복사지는 무코팅만 허용
    if (paper === 'GENERAL_COPY') return coating === 'NONE';
    // 매트코트지는 유광 불가
    if (paper === 'MATTE_COAT_130') return ['NONE', 'MATTE', 'SOFT_TOUCH'].includes(coating);
    return true;
  }),
}));

import CoatingSelector from '../../components/PrintConfigurator/CoatingSelector';

describe('CoatingSelector', () => {
  const defaultProps = {
    selected: 'NONE',
    paper: 'ART_COAT_130',
    onSelect: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('코팅 옵션을 렌더링한다', () => {
    render(<CoatingSelector {...defaultProps} />);
    expect(screen.getByText('무코팅')).toBeInTheDocument();
    expect(screen.getByText('유광 코팅')).toBeInTheDocument();
    expect(screen.getByText('무광 코팅')).toBeInTheDocument();
    expect(screen.getByText('소프트터치 코팅')).toBeInTheDocument();
  });

  it('코팅 선택 시 onSelect를 호출한다', () => {
    render(<CoatingSelector {...defaultProps} />);
    fireEvent.click(screen.getByText('유광 코팅'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('GLOSSY');
  });

  it('일반복사지 선택 시 유광/무광/소프트터치가 비활성화된다', () => {
    render(<CoatingSelector {...defaultProps} paper="GENERAL_COPY" />);
    expect(screen.getByText('유광 코팅')).toBeDisabled();
    expect(screen.getByText('무광 코팅')).toBeDisabled();
    expect(screen.getByText('소프트터치 코팅')).toBeDisabled();
    expect(screen.getByText('무코팅')).not.toBeDisabled();
  });

  it('매트코트지 선택 시 유광 코팅이 비활성화된다', () => {
    render(<CoatingSelector {...defaultProps} paper="MATTE_COAT_130" />);
    expect(screen.getByText('유광 코팅')).toBeDisabled();
    expect(screen.getByText('무광 코팅')).not.toBeDisabled();
  });

  it('용지가 없으면 모든 코팅이 활성화된다', () => {
    render(<CoatingSelector {...defaultProps} paper="" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).not.toBeDisabled());
  });
});
