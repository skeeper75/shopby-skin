/**
 * SMSDialog 테스트 - SMS 발송 다이얼로그
 *
 * SPEC-SKIN-005 REQ-005-006: SMS 발송
 * - 수신자 표시
 * - 내장 템플릿 선택
 * - 바이트 카운트 (SMS 90바이트 / LMS 2000바이트)
 * - 발송 기능
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SMSDialog from '../../components/admin/SMSDialog';

describe('SMSDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSend: vi.fn(),
    recipients: [{ name: '홍길동', phone: '010-1234-5678' }],
  };

  beforeEach(() => vi.clearAllMocks());

  it('SMS 발송 제목을 렌더링한다', () => {
    render(<SMSDialog {...defaultProps} />);
    expect(screen.getByText('SMS 발송')).toBeInTheDocument();
  });

  it('수신자 정보를 표시한다', () => {
    render(<SMSDialog {...defaultProps} />);
    expect(screen.getByText(/홍길동/)).toBeInTheDocument();
  });

  it('수신자 수를 표시한다', () => {
    const multiRecipients = [
      { name: '홍길동', phone: '010-1234-5678' },
      { name: '김철수', phone: '010-9876-5432' },
      { name: '이영희', phone: '010-5555-1234' },
    ];
    render(<SMSDialog {...defaultProps} recipients={multiRecipients} />);
    expect(screen.getByText(/3명/)).toBeInTheDocument();
  });

  it('템플릿 메시지 라벨이 있다', () => {
    render(<SMSDialog {...defaultProps} />);
    expect(screen.getByText('템플릿 메시지')).toBeInTheDocument();
  });

  it('템플릿 선택 시 메시지가 자동 입력된다', () => {
    render(<SMSDialog {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'shipping_start' } });
    const textarea = screen.getByRole('textbox');
    expect(textarea.value).toContain('발송되었습니다');
  });

  it('메시지 입력 영역을 렌더링한다', () => {
    render(<SMSDialog {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('바이트 수를 표시한다', () => {
    render(<SMSDialog {...defaultProps} />);
    // 초기 상태에서 0 bytes
    expect(screen.getByText(/0 \/ 90 bytes/)).toBeInTheDocument();
  });

  it('발송하기 버튼이 있다', () => {
    render(<SMSDialog {...defaultProps} />);
    expect(screen.getByText('발송하기')).toBeInTheDocument();
  });

  it('빈 메시지로는 발송 버튼이 비활성화된다', () => {
    render(<SMSDialog {...defaultProps} />);
    expect(screen.getByText('발송하기')).toBeDisabled();
  });

  it('메시지 입력 후 발송하기를 클릭하면 onSend를 호출한다', () => {
    render(<SMSDialog {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '테스트 메시지' } });
    fireEvent.click(screen.getByText('발송하기'));
    expect(defaultProps.onSend).toHaveBeenCalledWith(
      expect.objectContaining({ message: '테스트 메시지' })
    );
  });

  it('닫기 버튼을 클릭하면 onClose를 호출한다', () => {
    render(<SMSDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('✕'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('isOpen이 false이면 렌더링하지 않는다', () => {
    const { container } = render(<SMSDialog {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });
});
