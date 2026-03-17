/**
 * CounterInput 테스트 - 수량 카운터 (RULE-3: 34+155+34px)
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import CounterInput from '../../components/PrintConfigurator/CounterInput';

describe('CounterInput', () => {
  const defaultProps = {
    value: 100,
    onChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('수량 라벨을 렌더링한다', () => {
    render(<CounterInput {...defaultProps} />);
    expect(screen.getByText('수량 (부)')).toBeInTheDocument();
  });

  it('현재 값을 입력 필드에 표시한다', () => {
    render(<CounterInput {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(100);
  });

  it('증가 버튼 클릭 시 값이 1 증가한다', () => {
    render(<CounterInput {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('수량 증가'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(101);
  });

  it('감소 버튼 클릭 시 값이 1 감소한다', () => {
    render(<CounterInput {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('수량 감소'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(99);
  });

  it('최솟값에서 감소 버튼이 비활성화된다', () => {
    render(<CounterInput {...defaultProps} value={1} min={1} />);
    expect(screen.getByLabelText('수량 감소')).toBeDisabled();
  });

  it('최댓값에서 증가 버튼이 비활성화된다', () => {
    render(<CounterInput {...defaultProps} value={10000} max={10000} />);
    expect(screen.getByLabelText('수량 증가')).toBeDisabled();
  });

  it('직접 입력 시 onChange를 호출한다', () => {
    render(<CounterInput {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '500' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(500);
  });

  it('범위 밖 값은 무시한다', () => {
    render(<CounterInput {...defaultProps} min={1} max={10000} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '99999' } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('에러 메시지를 표시한다', () => {
    render(<CounterInput {...defaultProps} error="수량을 입력해주세요." />);
    expect(screen.getByText('수량을 입력해주세요.')).toBeInTheDocument();
  });

  it('34+155+34px 레이아웃 클래스를 적용한다', () => {
    const { container } = render(<CounterInput {...defaultProps} />);
    expect(container.querySelector('.w-\\[34px\\]')).toBeInTheDocument();
    expect(container.querySelector('.w-\\[155px\\]')).toBeInTheDocument();
  });
});
