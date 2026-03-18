/**
 * BulkActionBar 테스트 - 벌크 액션 툴바
 *
 * SPEC-SKIN-005 REQ-005-002: 벌크 액션
 * - 선택된 항목 수 표시
 * - 상태 변경, SMS 발송, 주문서 출력 버튼
 * - 선택 해제
 * - visible prop으로 노출 제어
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import BulkActionBar from '../../components/admin/BulkActionBar';

describe('BulkActionBar', () => {
  const defaultProps = {
    selectedCount: 5,
    onStatusChange: vi.fn(),
    onSms: vi.fn(),
    onPrint: vi.fn(),
    onClear: vi.fn(),
    visible: true,
  };

  beforeEach(() => vi.clearAllMocks());

  it('선택된 건수를 표시한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    expect(screen.getByText('5건 선택됨')).toBeInTheDocument();
  });

  it('일괄 변경 버튼을 렌더링한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    expect(screen.getByText('일괄 변경')).toBeInTheDocument();
  });

  it('SMS 발송 버튼을 렌더링한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    expect(screen.getByText('SMS 발송')).toBeInTheDocument();
  });

  it('주문서 출력 버튼을 렌더링한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    expect(screen.getByText('주문서 출력')).toBeInTheDocument();
  });

  it('SMS 발송 버튼 클릭 시 onSms를 호출한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    fireEvent.click(screen.getByText('SMS 발송'));
    expect(defaultProps.onSms).toHaveBeenCalled();
  });

  it('주문서 출력 버튼 클릭 시 onPrint를 호출한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    fireEvent.click(screen.getByText('주문서 출력'));
    expect(defaultProps.onPrint).toHaveBeenCalled();
  });

  it('선택 해제 버튼을 클릭하면 onClear를 호출한다', () => {
    render(<BulkActionBar {...defaultProps} />);
    fireEvent.click(screen.getByText('선택 해제'));
    expect(defaultProps.onClear).toHaveBeenCalled();
  });

  it('visible이 false이면 렌더링하지 않는다', () => {
    const { container } = render(<BulkActionBar {...defaultProps} visible={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('selectedCount가 0이면 렌더링하지 않는다', () => {
    const { container } = render(<BulkActionBar {...defaultProps} selectedCount={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('상태 선택 드롭다운이 있다', () => {
    render(<BulkActionBar {...defaultProps} />);
    expect(screen.getByText('상태 선택')).toBeInTheDocument();
  });
});
