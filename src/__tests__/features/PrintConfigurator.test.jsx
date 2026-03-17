/**
 * PrintConfigurator 통합 테스트 - 인쇄 옵션 전체 컨피규레이터
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));
vi.mock('../../utils/printOptionValidator', () => ({
  isValidCoatingForPaper: vi.fn(() => true),
}));

import PrintConfigurator from '../../components/PrintConfigurator/PrintConfigurator';

describe('PrintConfigurator', () => {
  const defaultProps = {
    options: {
      size: 'A4',
      customWidth: '',
      customHeight: '',
      paper: 'ART_COAT_130',
      coating: 'NONE',
      finishing: [],
      quantity: 100,
    },
    errors: {},
    onUpdate: vi.fn(),
    onToggleFinishing: vi.fn(),
  };

  it('6개 옵션 그룹(사이즈/용지/코팅/마감/수량)을 모두 렌더링한다', () => {
    render(<PrintConfigurator {...defaultProps} />);
    expect(screen.getByText('사이즈')).toBeInTheDocument();
    expect(screen.getByText('용지')).toBeInTheDocument();
    expect(screen.getByText('코팅')).toBeInTheDocument();
    expect(screen.getByText('마감 옵션')).toBeInTheDocument();
    expect(screen.getByText('수량 (부)')).toBeInTheDocument();
  });

  it('선택된 사이즈 A4가 표시된다', () => {
    render(<PrintConfigurator {...defaultProps} />);
    const a4Button = screen.getByText('A4');
    expect(a4Button.className).toContain('border-[#5538B6]');
  });

  it('선택된 용지가 드롭다운에 표시된다', () => {
    render(<PrintConfigurator {...defaultProps} />);
    expect(screen.getByText('아트코트지 130g')).toBeInTheDocument();
  });

  it('수량 카운터에 현재 값이 표시된다', () => {
    render(<PrintConfigurator {...defaultProps} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(100);
  });

  it('에러가 있으면 해당 필드에 에러 메시지를 표시한다', () => {
    render(
      <PrintConfigurator
        {...defaultProps}
        errors={{ size: '사이즈를 선택해주세요.', paper: '용지를 선택해주세요.' }}
      />
    );
    expect(screen.getByText('사이즈를 선택해주세요.')).toBeInTheDocument();
    expect(screen.getByText('용지를 선택해주세요.')).toBeInTheDocument();
  });
});
