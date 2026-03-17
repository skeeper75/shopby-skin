/**
 * PrintSheet 테스트 - 인쇄 최적화 주문서
 *
 * SPEC-SKIN-005 REQ-005-005: 주문서 출력
 * - A4 레이아웃
 * - 다건 주문 출력
 * - 회사 헤더 포함
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

import PrintSheet from '../../components/admin/PrintSheet';

const mockOrders = [
  {
    orderNo: 'ORD-001',
    orderDate: '2024-01-15',
    customerName: '홍길동',
    phone: '010-1234-5678',
    productName: '명함 인쇄',
    option: '양면, 무광코팅',
    quantity: 2,
    totalPrice: 50000,
    receiverName: '홍길동',
    receiverPhone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 1',
  },
  {
    orderNo: 'ORD-002',
    orderDate: '2024-01-14',
    customerName: '김철수',
    phone: '010-9876-5432',
    productName: '전단지 인쇄',
    option: null,
    quantity: 1,
    totalPrice: 30000,
    receiverName: '김철수',
    receiverPhone: '010-9876-5432',
    address: '서울시 서초구 반포대로 2',
  },
];

describe('PrintSheet', () => {
  it('모든 주문의 주문번호를 표시한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
  });

  it('주문자 정보를 표시한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    // 주문자 이름이 수령인과 동일하여 여러 번 나타남 - getAllByText 사용
    expect(screen.getAllByText('홍길동').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('김철수').length).toBeGreaterThanOrEqual(1);
  });

  it('상품명을 표시한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    expect(screen.getByText('명함 인쇄')).toBeInTheDocument();
    expect(screen.getByText('전단지 인쇄')).toBeInTheDocument();
  });

  it('배송지를 표시한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    expect(screen.getByText('서울시 강남구 테헤란로 1')).toBeInTheDocument();
  });

  it('후니프린팅 회사 헤더를 포함한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    const headers = screen.getAllByText('후니프린팅');
    expect(headers.length).toBeGreaterThanOrEqual(1);
  });

  it('print-sheet 클래스를 적용한다', () => {
    const { container } = render(<PrintSheet orders={mockOrders} />);
    expect(container.querySelector('.print-sheet')).toBeInTheDocument();
  });

  it('결제 금액을 표시한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    expect(screen.getByText(/50,000/)).toBeInTheDocument();
    expect(screen.getByText(/30,000/)).toBeInTheDocument();
  });

  it('빈 주문 배열이면 렌더링하지 않는다', () => {
    const { container } = render(<PrintSheet orders={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('주문서 라벨을 표시한다', () => {
    render(<PrintSheet orders={mockOrders} />);
    const labels = screen.getAllByText('주문서');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });
});
