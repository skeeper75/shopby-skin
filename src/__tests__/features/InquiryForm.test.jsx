/**
 * InquiryForm 테스트 - 공통 문의/상담 폼
 *
 * SPEC-SKIN-004 REQ-003: 대량주문 견적문의
 * - 필수 필드 검증 (업체명, 담당자, 연락처, 이메일, 인쇄유형, 수량)
 * - 파일 첨부 지원 (최대 30MB, PDF/AI/PSD)
 * - 등록 성공 시 onSuccess 콜백
 * - 에러 상태 표시
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

const mockFetchHttpRequest = vi.fn();

vi.mock('../../utils/api', () => ({
  fetchHttpRequest: (...args) => mockFetchHttpRequest(...args),
}));

import InquiryForm from '../../components/InquiryForm';

const createFile = (name, size, type = 'application/pdf') => {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
};

describe('InquiryForm', () => {
  const defaultProps = {
    type: 'bulk-inquiry',
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchHttpRequest.mockResolvedValue({ success: true });
  });

  describe('렌더링', () => {
    it('폼을 렌더링한다', () => {
      const { container } = render(<InquiryForm {...defaultProps} />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('업체명 필드를 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('업체명')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/업체명을 입력/)).toBeInTheDocument();
    });

    it('담당자명 필드를 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('담당자명')).toBeInTheDocument();
    });

    it('연락처 필드를 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('연락처')).toBeInTheDocument();
    });

    it('이메일 필드를 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('이메일')).toBeInTheDocument();
    });

    it('인쇄 유형 선택을 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('인쇄 유형')).toBeInTheDocument();
      expect(screen.getByText('인쇄유형 선택')).toBeInTheDocument();
    });

    it('수량 필드를 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('수량')).toBeInTheDocument();
    });

    it('상세 내용 텍스트 영역을 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('상세 내용')).toBeInTheDocument();
    });

    it('파일 선택 버튼을 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText('파일 선택')).toBeInTheDocument();
    });

    it('제출 버튼을 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: '문의하기' })).toBeInTheDocument();
    });

    it('파일 포맷 안내를 표시한다', () => {
      render(<InquiryForm {...defaultProps} />);
      expect(screen.getByText(/PDF, AI, PSD/)).toBeInTheDocument();
    });
  });

  describe('필수 필드 검증', () => {
    it('업체명 미입력 시 에러 메시지를 표시한다', async () => {
      render(<InquiryForm {...defaultProps} />);
      fireEvent.submit(screen.getByRole('button', { name: '문의하기' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText('업체명을 입력해주세요.')).toBeInTheDocument();
      });
    });

    it('담당자명 미입력 시 에러 메시지를 표시한다', async () => {
      render(<InquiryForm {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText(/업체명을 입력/), { target: { value: '테스트회사' } });
      fireEvent.submit(screen.getByRole('button', { name: '문의하기' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText('담당자명을 입력해주세요.')).toBeInTheDocument();
      });
    });

    it('이메일 형식이 잘못되면 에러 메시지를 표시한다', async () => {
      render(<InquiryForm {...defaultProps} />);
      fireEvent.change(screen.getByPlaceholderText(/업체명을 입력/), { target: { value: '테스트' } });
      fireEvent.change(screen.getByPlaceholderText(/담당자명을 입력/), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByPlaceholderText(/연락처를 입력/), { target: { value: '010-1234-5678' } });
      fireEvent.change(screen.getByPlaceholderText(/이메일을 입력/), { target: { value: 'invalid' } });
      fireEvent.submit(screen.getByRole('button', { name: '문의하기' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식/)).toBeInTheDocument();
      });
    });
  });

  describe('파일 첨부', () => {
    it('30MB 초과 파일을 거부한다', () => {
      render(<InquiryForm {...defaultProps} />);
      const fileInput = document.querySelector('input[type="file"]');
      const bigFile = createFile('huge.pdf', 35 * 1024 * 1024);

      fireEvent.change(fileInput, { target: { files: [bigFile] } });

      expect(screen.getByText(/30MB 이하/)).toBeInTheDocument();
    });

    it('유효한 PDF 파일을 첨부할 수 있다', () => {
      render(<InquiryForm {...defaultProps} />);
      const fileInput = document.querySelector('input[type="file"]');
      const file = createFile('design.pdf', 1024);

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText('design.pdf')).toBeInTheDocument();
    });

    it('지원하지 않는 포맷의 파일을 거부한다', () => {
      render(<InquiryForm {...defaultProps} />);
      const fileInput = document.querySelector('input[type="file"]');
      const file = createFile('test.doc', 1024, 'application/msword');

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText(/PDF, AI, PSD 파일만/)).toBeInTheDocument();
    });
  });

  describe('폼 제출', () => {
    const fillRequiredFields = () => {
      fireEvent.change(screen.getByPlaceholderText(/업체명을 입력/), { target: { value: '테스트회사' } });
      fireEvent.change(screen.getByPlaceholderText(/담당자명을 입력/), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByPlaceholderText(/연락처를 입력/), { target: { value: '010-1234-5678' } });
      fireEvent.change(screen.getByPlaceholderText(/이메일을 입력/), { target: { value: 'test@test.com' } });
      // 인쇄 유형 선택 - 커스텀 셀렉트 열기
      fireEvent.click(screen.getByText('인쇄유형 선택'));
      fireEvent.click(screen.getByText('오프셋 인쇄'));
      fireEvent.change(screen.getByPlaceholderText(/수량을 입력/), { target: { value: '1000' } });
    };

    it('모든 필수 필드 입력 후 제출하면 API를 호출한다', async () => {
      render(<InquiryForm {...defaultProps} />);
      fillRequiredFields();

      fireEvent.submit(screen.getByRole('button', { name: '문의하기' }).closest('form'));

      await waitFor(() => {
        expect(mockFetchHttpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            url: 'custom/bulk-inquiry',
            method: 'POST',
          })
        );
      });
    });

    it('제출 성공 시 onSuccess를 호출한다', async () => {
      render(<InquiryForm {...defaultProps} />);
      fillRequiredFields();

      fireEvent.submit(screen.getByRole('button', { name: '문의하기' }).closest('form'));

      await waitFor(() => {
        expect(defaultProps.onSuccess).toHaveBeenCalled();
      });
    });

    it('제출 중 버튼 텍스트가 변경된다', async () => {
      mockFetchHttpRequest.mockImplementation(() => new Promise(() => {}));

      render(<InquiryForm {...defaultProps} />);
      fillRequiredFields();

      fireEvent.submit(screen.getByRole('button', { name: '문의하기' }).closest('form'));

      await waitFor(() => {
        expect(screen.getByText('접수 중...')).toBeInTheDocument();
      });
    });

    it('business 타입일 때 올바른 API URL을 사용한다', async () => {
      render(<InquiryForm {...defaultProps} type="business" />);
      fillRequiredFields();

      fireEvent.submit(screen.getByRole('button', { name: /문의하기|접수/ }).closest('form'));

      await waitFor(() => {
        expect(mockFetchHttpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            url: 'custom/business-consultation',
          })
        );
      });
    });

    it('design 타입일 때 올바른 API URL을 사용한다', async () => {
      render(<InquiryForm {...defaultProps} type="design" />);
      fillRequiredFields();

      fireEvent.submit(screen.getByRole('button', { name: /문의하기|접수/ }).closest('form'));

      await waitFor(() => {
        expect(mockFetchHttpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            url: 'custom/design-consultation',
          })
        );
      });
    });
  });
});
