/**
 * OrderDetailPanel 테스트 - 주문 상세 슬라이드 패널
 *
 * SPEC-SKIN-005 REQ-005-002: 주문 상세 보기
 * - 주문 정보 표시 (주문정보, 상품정보, 배송정보, 결제정보)
 * - 액션 버튼 (상태변경, 파일확인, 주문서출력)
 * - 패널 열기/닫기
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../components/admin/StatusBadge', () => ({
  __esModule: true,
  default: ({ status }) => <span data-testid="status-badge">{status}</span>,
}));

import OrderDetailPanel from '../../components/admin/OrderDetailPanel';

const mockOrder = {
  orderNo: 'ORD-001',
  orderDate: '2024-01-15 10:30',
  customerName: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@test.com',
  status: '결제완료',
  productName: '명함 인쇄 100매',
  option: '양면, 무광코팅',
  quantity: 2,
  category: '명함',
  receiverName: '홍길동',
  receiverPhone: '010-1234-5678',
  address: '서울시 강남구 테헤란로 1',
  deliveryMemo: '부재 시 경비실',
  paymentMethod: '카드결제',
  productPrice: 50000,
  shippingFee: 3000,
  totalPrice: 53000,
};

describe('OrderDetailPanel', () => {
  const defaultProps = {
    order: mockOrder,
    isOpen: true,
    onClose: vi.fn(),
    onStatusChange: vi.fn(),
    onFileCheck: vi.fn(),
    onPrint: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('주문번호를 표시한다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
  });

  it('주문자 이름을 표시한다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    // 주문자 이름이 주문정보/배송정보 양쪽에 나타남
    expect(screen.getAllByText('홍길동').length).toBeGreaterThanOrEqual(1);
  });

  it('상품명을 표시한다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText('명함 인쇄 100매')).toBeInTheDocument();
  });

  it('배송지를 표시한다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText(/서울시 강남구/)).toBeInTheDocument();
  });

  it('닫기 버튼을 클릭하면 onClose를 호출한다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('✕'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('isOpen이 false이면 렌더링하지 않는다', () => {
    const { container } = render(<OrderDetailPanel {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('결제 금액을 포맷하여 표시한다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText(/53,000/)).toBeInTheDocument();
  });

  it('상태변경 버튼이 있다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText('상태변경')).toBeInTheDocument();
  });

  it('파일확인 버튼이 있다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText('파일확인')).toBeInTheDocument();
  });

  it('주문서출력 버튼이 있다', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText('주문서출력')).toBeInTheDocument();
  });
});
