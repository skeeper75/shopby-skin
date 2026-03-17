/**
 * Cart 특성화 테스트 (DDD PRESERVE)
 *
 * 기존 Cart 컴포넌트의 현재 동작을 캡처합니다.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));
vi.mock('../../components/ErrorBoundary', () => ({
  useErrorBoundaryActionContext: () => ({ catchError: vi.fn() }),
}));

// 서브 컴포넌트 모킹
vi.mock('../../pages/Cart/CartPriceTag', () => ({
  default: () => <div data-testid="cart-price-tag">가격 요약</div>,
}));
vi.mock('../../pages/Cart/CartTopSelectManager', () => ({
  default: () => <div data-testid="cart-top-select">전체 선택</div>,
}));
vi.mock('../../pages/Cart/DeliverySection', () => ({
  default: () => <div data-testid="delivery-section">배송 그룹</div>,
}));
vi.mock('../../pages/Cart/FixedOrderBtn', () => ({
  default: ({ onOrderBtnClick }) => (
    <button data-testid="fixed-order-btn" onClick={onOrderBtnClick}>주문하기</button>
  ),
}));

import Cart from '../../pages/Cart/Cart';
import { useCartStateContext } from '@shopby/react-components';

describe('Cart (특성화)', () => {
  const renderCart = () => {
    return render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('전체 선택 관리자를 렌더링한다', () => {
    renderCart();
    expect(screen.getByTestId('cart-top-select')).toBeInTheDocument();
  });

  it('배송 섹션을 렌더링한다', () => {
    renderCart();
    expect(screen.getByTestId('delivery-section')).toBeInTheDocument();
  });

  it('가격 요약을 렌더링한다', () => {
    renderCart();
    expect(screen.getByTestId('cart-price-tag')).toBeInTheDocument();
  });

  it('주문하기 버튼을 렌더링한다', () => {
    renderCart();
    const buttons = screen.getAllByText('주문하기');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('하단 고정 주문 버튼을 렌더링한다', () => {
    renderCart();
    expect(screen.getByTestId('fixed-order-btn')).toBeInTheDocument();
  });

  it('cart 클래스가 적용된 래퍼를 렌더링한다', () => {
    const { container } = renderCart();
    expect(container.querySelector('.cart')).toBeInTheDocument();
  });
});
