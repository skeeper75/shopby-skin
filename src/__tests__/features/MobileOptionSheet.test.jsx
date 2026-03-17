/**
 * MobileOptionSheet 테스트 - 모바일 하단 시트
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import MobileOptionSheet from '../../components/MobileOptionSheet/MobileOptionSheet';

describe('MobileOptionSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div data-testid="sheet-content">옵션 내용</div>,
  };

  beforeEach(() => vi.clearAllMocks());

  it('열려 있을 때 타이틀을 표시한다', () => {
    render(<MobileOptionSheet {...defaultProps} />);
    expect(screen.getByText('인쇄 옵션 선택')).toBeInTheDocument();
  });

  it('커스텀 타이틀을 지원한다', () => {
    render(<MobileOptionSheet {...defaultProps} title="용지 선택" />);
    expect(screen.getByText('용지 선택')).toBeInTheDocument();
  });

  it('children을 렌더링한다', () => {
    render(<MobileOptionSheet {...defaultProps} />);
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose를 호출한다', () => {
    render(<MobileOptionSheet {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('오버레이 클릭 시 onClose를 호출한다', () => {
    const { container } = render(<MobileOptionSheet {...defaultProps} />);
    const overlay = container.querySelector('.bg-black\\/50');
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('열려 있을 때 body 스크롤을 잠근다', () => {
    render(<MobileOptionSheet {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('닫혔을 때 body 스크롤을 복원한다', () => {
    const { rerender } = render(<MobileOptionSheet {...defaultProps} isOpen={true} />);
    rerender(<MobileOptionSheet {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('언마운트 시 body 스크롤을 복원한다', () => {
    const { unmount } = render(<MobileOptionSheet {...defaultProps} isOpen={true} />);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
