/**
 * OrderSheet 특성화 테스트 (DDD PRESERVE)
 *
 * 기존 OrderSheet 컴포넌트의 현재 동작을 캡처합니다.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));
vi.mock('../../components/ErrorBoundary', () => ({
  useErrorBoundaryActionContext: () => ({ catchError: vi.fn() }),
}));
vi.mock('../../constants', () => ({
  EXTERNAL_CUSTOM_ORDER_SHEET_TERMS: [],
}));
vi.mock('../../utils', () => ({
  convertBooleanToYorN: vi.fn((v) => (v ? 'Y' : 'N')),
  getDefaultCountryCode: vi.fn(() => 'KR'),
}));

// 서브 컴포넌트 모킹
vi.mock('../../pages/OrderSheet/OrdererInfoForm', () => ({
  default: () => <div data-testid="orderer-info-form">주문자 정보</div>,
}));
vi.mock('../../pages/OrderSheet/ShippingAddressInfoForm', () => ({
  default: () => <div data-testid="shipping-form">배송지 정보</div>,
}));
vi.mock('../../pages/OrderSheet/OrderProductTable', () => ({
  default: () => <div data-testid="order-product-table">주문 상품</div>,
}));
vi.mock('../../pages/OrderSheet/PromotionController', () => ({
  default: () => <div data-testid="promotion-controller">프로모션</div>,
}));
vi.mock('../../pages/OrderSheet/FreeGiftInfos', () => ({
  default: () => <div data-testid="free-gift-infos">사은품</div>,
}));
vi.mock('../../pages/OrderSheet/PaymentInfo', () => ({
  default: () => <div data-testid="payment-info">결제 정보</div>,
}));
vi.mock('../../pages/OrderSheet/PayMethodSelector', () => ({
  default: () => <div data-testid="pay-method-selector">결제 수단</div>,
}));
vi.mock('../../pages/OrderSheet/CashReceipt', () => ({
  default: () => <div data-testid="cash-receipt">현금영수증</div>,
}));
vi.mock('../../pages/OrderSheet/TermsChecker', () => {
  const React = require('react');
  return {
    default: React.forwardRef((props, ref) => (
      <div data-testid="terms-checker" ref={ref}>약관 동의</div>
    )),
  };
});
vi.mock('../../pages/OrderSheet/useValidateFormMaker', () => ({
  default: () => ({
    validateForm: vi.fn(() => true),
  }),
}));
vi.mock('../../components/AppCardAuthenticate/Order/AppCardAuthenticateInOrder', () => ({
  default: () => <div data-testid="app-card-auth" />,
}));

import OrderSheet from '../../pages/OrderSheet/OrderSheet';

describe('OrderSheet (특성화)', () => {
  const renderOrderSheet = () => {
    return render(
      <MemoryRouter initialEntries={['/order/test-sheet-123']}>
        <Routes>
          <Route path="/order/:orderSheetNo" element={<OrderSheet />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('주문자 정보 폼을 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByTestId('orderer-info-form')).toBeInTheDocument();
  });

  it('주문 상품 테이블을 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByTestId('order-product-table')).toBeInTheDocument();
  });

  it('프로모션 컨트롤러를 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByTestId('promotion-controller')).toBeInTheDocument();
  });

  it('결제 정보를 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByTestId('payment-info')).toBeInTheDocument();
  });

  it('결제 수단 선택을 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByTestId('pay-method-selector')).toBeInTheDocument();
  });

  it('약관 동의를 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByTestId('terms-checker')).toBeInTheDocument();
  });

  it('결제하기 버튼을 렌더링한다', () => {
    renderOrderSheet();
    expect(screen.getByText('결제 하기')).toBeInTheDocument();
  });

  it('order-sheet 클래스가 적용된 래퍼를 렌더링한다', () => {
    const { container } = renderOrderSheet();
    expect(container.querySelector('.order-sheet')).toBeInTheDocument();
  });
});
