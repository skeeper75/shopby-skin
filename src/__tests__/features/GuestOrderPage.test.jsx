/**
 * GuestOrder 페이지 테스트
 *
 * SPEC-SKIN-004 REQ-004: 비회원 주문조회
 * - 3가지 정보 모두 일치해야 조회 (주문번호, 이메일, 전화번호)
 * - 불일치 시 "주문 정보를 찾을 수 없습니다" 에러
 * - 주문 상세 + 영수증 출력 연동
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

const mockFetchHttpRequest = vi.fn();

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

vi.mock('../../utils/api', () => ({
  fetchHttpRequest: (...args) => mockFetchHttpRequest(...args),
}));

import GuestOrderForm from '../../pages/GuestOrder/GuestOrderForm';

describe('GuestOrderForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('"비회원 주문 조회" 헤더를 표시한다', () => {
    render(<GuestOrderForm />);
    expect(screen.getByText('비회원 주문 조회')).toBeInTheDocument();
  });

  it('안내 문구를 표시한다', () => {
    render(<GuestOrderForm />);
    expect(screen.getByText(/주문 시 입력하신 정보를 입력해주세요/)).toBeInTheDocument();
  });

  it('주문번호 입력 필드를 표시한다', () => {
    render(<GuestOrderForm />);
    expect(screen.getByPlaceholderText('주문번호를 입력해주세요')).toBeInTheDocument();
  });

  it('이메일 입력 필드를 표시한다', () => {
    render(<GuestOrderForm />);
    expect(screen.getByPlaceholderText('이메일을 입력해주세요')).toBeInTheDocument();
  });

  it('전화번호 입력 필드를 표시한다', () => {
    render(<GuestOrderForm />);
    expect(screen.getByPlaceholderText(/전화번호를 입력해주세요/)).toBeInTheDocument();
  });

  it('조회하기 버튼을 표시한다', () => {
    render(<GuestOrderForm />);
    expect(screen.getByRole('button', { name: '조회하기' })).toBeInTheDocument();
  });

  describe('필수 필드 검증', () => {
    it('주문번호 미입력 시 에러 메시지를 표시한다', async () => {
      render(<GuestOrderForm />);
      fireEvent.click(screen.getByRole('button', { name: '조회하기' }));

      await waitFor(() => {
        expect(screen.getByText('주문번호를 입력해주세요.')).toBeInTheDocument();
      });
    });

    it('이메일 미입력 시 에러 메시지를 표시한다', async () => {
      render(<GuestOrderForm />);
      const orderInput = screen.getByPlaceholderText('주문번호를 입력해주세요');
      fireEvent.change(orderInput, { target: { value: 'ORD-001' } });

      fireEvent.click(screen.getByRole('button', { name: '조회하기' }));

      await waitFor(() => {
        expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();
      });
    });

    it('잘못된 이메일 형식에 에러 메시지를 표시한다', async () => {
      render(<GuestOrderForm />);
      const orderInput = screen.getByPlaceholderText('주문번호를 입력해주세요');
      const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');

      fireEvent.change(orderInput, { target: { value: 'ORD-001' } });
      fireEvent.change(emailInput, { target: { value: 'invalid' } });

      fireEvent.click(screen.getByRole('button', { name: '조회하기' }));

      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식/)).toBeInTheDocument();
      });
    });

    it('전화번호 미입력 시 에러 메시지를 표시한다', async () => {
      render(<GuestOrderForm />);
      const orderInput = screen.getByPlaceholderText('주문번호를 입력해주세요');
      const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');

      fireEvent.change(orderInput, { target: { value: 'ORD-001' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

      fireEvent.click(screen.getByRole('button', { name: '조회하기' }));

      await waitFor(() => {
        expect(screen.getByText('전화번호를 입력해주세요.')).toBeInTheDocument();
      });
    });
  });

  describe('주문 조회', () => {
    const fillForm = () => {
      fireEvent.change(screen.getByPlaceholderText('주문번호를 입력해주세요'), { target: { value: 'ORD-001' } });
      fireEvent.change(screen.getByPlaceholderText('이메일을 입력해주세요'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText(/전화번호를 입력해주세요/), { target: { value: '010-1234-5678' } });
    };

    it('조회 성공 시 주문 결과를 표시한다', async () => {
      mockFetchHttpRequest.mockResolvedValueOnce({
        orderNo: 'ORD-001',
        orderStatusType: 'DELIVERY_ING',
        orderOptions: [
          { productName: '명함 200매', orderCnt: 1, price: 15000, imageUrl: '/img/product.jpg' },
        ],
        lastOrderAmount: { totalStandardAmt: 15000 },
      });

      render(<GuestOrderForm />);
      fillForm();

      // form submit → async handleSubmit
      fireEvent.submit(screen.getByRole('button', { name: '조회하기' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText('배송 중')).toBeInTheDocument();
      });

      expect(screen.getByText('명함 200매')).toBeInTheDocument();
      expect(screen.getAllByText(/15,000/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('영수증 출력')).toBeInTheDocument();
    });

    it('조회 실패 시 에러 메시지를 표시한다', async () => {
      mockFetchHttpRequest.mockRejectedValueOnce(new Error('Not found'));

      render(<GuestOrderForm />);
      fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: '조회하기' }));
      });

      await waitFor(() => {
        expect(screen.getByText('주문 정보를 찾을 수 없습니다.')).toBeInTheDocument();
      });
    });

    it('API를 올바른 파라미터로 호출한다', async () => {
      mockFetchHttpRequest.mockResolvedValueOnce({ orderNo: 'ORD-001', orderStatusType: 'PAY_DONE' });

      render(<GuestOrderForm />);
      fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: '조회하기' }));
      });

      expect(mockFetchHttpRequest).toHaveBeenCalledWith({
        url: 'guest/orders',
        method: 'GET',
        query: {
          orderNo: 'ORD-001',
          email: 'test@test.com',
          phone: '010-1234-5678',
        },
      });
    });

    it('조회 중 버튼이 비활성화된다', async () => {
      mockFetchHttpRequest.mockImplementation(() => new Promise(() => {}));

      render(<GuestOrderForm />);
      fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: '조회하기' }));
      });

      expect(screen.getByRole('button', { name: '조회 중...' })).toBeDisabled();
    });

    it('영수증 출력 버튼을 표시한다', async () => {
      mockFetchHttpRequest.mockResolvedValueOnce({
        orderNo: 'ORD-001',
        orderStatusType: 'PAY_DONE',
        orderOptions: [],
        lastOrderAmount: { totalStandardAmt: 10000 },
      });

      render(<GuestOrderForm />);
      fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: '조회하기' }));
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '영수증 출력' })).toBeInTheDocument();
      });
    });

    it('Enter 키로 조회할 수 있다', async () => {
      mockFetchHttpRequest.mockResolvedValueOnce({ orderNo: 'ORD-001', orderStatusType: 'PAY_DONE' });

      render(<GuestOrderForm />);
      fillForm();

      const phoneInput = screen.getByPlaceholderText(/전화번호를 입력해주세요/);
      await act(async () => {
        fireEvent.keyDown(phoneInput, { key: 'Enter' });
      });

      expect(mockFetchHttpRequest).toHaveBeenCalled();
    });
  });
});
