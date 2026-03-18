/**
 * OrderSuccess 특성화 테스트 (DDD PRESERVE)
 *
 * 기존 주문완료 페이지의 현재 동작을 캡처합니다.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));
vi.mock('../../utils', () => ({
  deliverableProduct: vi.fn(() => true),
}));

// 서브 컴포넌트 모킹
vi.mock('../../pages/OrderConfirm/OrdererInfo', () => ({
  default: () => <div data-testid="orderer-info">주문자 정보</div>,
}));
vi.mock('../../pages/OrderConfirm/OrderProductTable', () => ({
  default: () => <div data-testid="order-product-table">주문 상품</div>,
}));
vi.mock('../../pages/OrderConfirm/PaymentInfo', () => ({
  default: () => <div data-testid="payment-info">결제 정보</div>,
}));
vi.mock('../../pages/OrderConfirm/ShippingAddressInfo', () => ({
  default: () => <div data-testid="shipping-info">배송지 정보</div>,
}));
vi.mock('../../components/CashReceiptInfo', () => ({
  default: () => <div data-testid="cash-receipt-info" />,
}));
vi.mock('../../pages/OrderDetail/ReceiptInfo', () => ({
  default: () => <div data-testid="receipt-info" />,
}));

import OrderSuccess from '../../pages/OrderConfirm/OrderSuccess';

const mockOrderInfo = {
  orderer: { ordererName: '홍길동' },
  payType: 'CREDIT_CARD',
  cashReceiptInfo: null,
  payInfo: {},
  receiptInfos: [],
  orderNo: 'ORD-2024-001',
  defaultOrderStatusType: 'DEPOSIT_WAIT',
};

const mockOrderConfig = {
  cashReceipt: false,
  visibleReceiptBtn: true,
  viewShopSpecification: false,
  useSimpleReceipt: false,
  usePaymentReceipt: true,
  shopSpecificationFields: [],
};

describe('OrderSuccess (특성화)', () => {
  const renderOrderSuccess = (props = {}) => {
    return render(
      <MemoryRouter initialEntries={['/order/confirm?deliverable=Y']}>
        <OrderSuccess
          orderInfo={props.orderInfo ?? mockOrderInfo}
          orderNo={props.orderNo ?? 'ORD-2024-001'}
          orderConfig={props.orderConfig ?? mockOrderConfig}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('주문 완료 메시지를 표시한다', () => {
    renderOrderSuccess();
    expect(screen.getByText('주문이 완료되었습니다!')).toBeInTheDocument();
  });

  it('주문자 이름이 포함된 결제 완료 메시지를 표시한다', () => {
    renderOrderSuccess();
    expect(screen.getByText(/홍길동 고객님, 결제가 완료되었습니다/)).toBeInTheDocument();
  });

  it('주문번호를 표시한다', () => {
    renderOrderSuccess();
    expect(screen.getByText('ORD-2024-001')).toBeInTheDocument();
  });

  it('주문내역 조회 버튼을 렌더링한다', () => {
    renderOrderSuccess();
    expect(screen.getByText('주문내역 조회')).toBeInTheDocument();
  });

  it('계속 쇼핑하기 버튼을 렌더링한다', () => {
    renderOrderSuccess();
    expect(screen.getByText('계속 쇼핑하기')).toBeInTheDocument();
  });

  it('주문 상품 테이블을 렌더링한다', () => {
    renderOrderSuccess();
    expect(screen.getByTestId('order-product-table')).toBeInTheDocument();
  });

  it('주문자 정보를 렌더링한다', () => {
    renderOrderSuccess();
    expect(screen.getByTestId('orderer-info')).toBeInTheDocument();
  });

  it('결제 정보를 렌더링한다', () => {
    renderOrderSuccess();
    expect(screen.getByTestId('payment-info')).toBeInTheDocument();
  });

  it('배송지 정보를 렌더링한다 (배송 가능 상품)', () => {
    renderOrderSuccess();
    expect(screen.getByTestId('shipping-info')).toBeInTheDocument();
  });
});
