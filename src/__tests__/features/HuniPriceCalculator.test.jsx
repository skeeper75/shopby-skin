/**
 * HuniPriceCalculator 테스트 - 실시간 가격 표시 바
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import HuniPriceCalculator from '../../components/HuniPriceCalculator/HuniPriceCalculator';

describe('HuniPriceCalculator', () => {
  const mockPriceInfo = {
    subtotal: 50000,
    discount: 5000,
    shipping: 3000,
    total: 48000,
  };

  const defaultProps = {
    priceInfo: mockPriceInfo,
    isCalculating: false,
    onAddCart: vi.fn(),
    onBuyNow: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('총 결제금액을 표시한다', () => {
    render(<HuniPriceCalculator {...defaultProps} />);
    expect(screen.getAllByText('48,000원').length).toBeGreaterThanOrEqual(1);
  });

  it('상품금액을 표시한다', () => {
    render(<HuniPriceCalculator {...defaultProps} />);
    expect(screen.getByText('50,000원')).toBeInTheDocument();
  });

  it('수량 할인을 표시한다', () => {
    render(<HuniPriceCalculator {...defaultProps} />);
    expect(screen.getByText('- 5,000원')).toBeInTheDocument();
  });

  it('배송비를 표시한다', () => {
    render(<HuniPriceCalculator {...defaultProps} />);
    expect(screen.getByText('3,000원')).toBeInTheDocument();
  });

  it('배송비 무료일 때 "무료"를 표시한다', () => {
    render(<HuniPriceCalculator {...defaultProps} priceInfo={{ ...mockPriceInfo, shipping: 0 }} />);
    expect(screen.getByText('무료')).toBeInTheDocument();
  });

  it('장바구니 버튼을 렌더링하고 클릭 시 핸들러를 호출한다', () => {
    render(<HuniPriceCalculator {...defaultProps} />);
    fireEvent.click(screen.getByText('장바구니'));
    expect(defaultProps.onAddCart).toHaveBeenCalled();
  });

  it('구매하기 버튼을 렌더링하고 클릭 시 핸들러를 호출한다', () => {
    render(<HuniPriceCalculator {...defaultProps} />);
    fireEvent.click(screen.getByText('구매하기'));
    expect(defaultProps.onBuyNow).toHaveBeenCalled();
  });

  it('계산 중일 때 로딩 스켈레톤을 표시한다', () => {
    const { container } = render(<HuniPriceCalculator {...defaultProps} isCalculating={true} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('priceInfo가 없고 계산 중이 아니면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(
      <HuniPriceCalculator {...defaultProps} priceInfo={null} isCalculating={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('할인이 0이면 할인 행을 숨긴다', () => {
    render(<HuniPriceCalculator {...defaultProps} priceInfo={{ ...mockPriceInfo, discount: 0 }} />);
    expect(screen.queryByText('수량 할인')).not.toBeInTheDocument();
  });
});
