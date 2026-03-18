/**
 * FilePreview 테스트 - 파일 미리보기 모달
 *
 * SPEC-SKIN-005 REQ-005-003: 파일 확인
 * - PDF (iframe) / 이미지 (img) 미리보기
 * - 확인완료 / 재업로드 요청 액션
 * - 모달 열기/닫기
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import FilePreview from '../../components/admin/FilePreview';

describe('FilePreview', () => {
  const pdfFile = {
    url: 'https://storage.test.com/files/print-001.pdf',
    name: '명함_시안.pdf',
    type: 'application/pdf',
    size: '2.5MB',
    uploadDate: '2024-01-15',
  };

  const imageFile = {
    url: 'https://storage.test.com/files/design.jpg',
    name: '디자인.jpg',
    type: 'image/jpeg',
    size: '1.2MB',
    uploadDate: '2024-01-15',
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onApprove: vi.fn(),
    onReupload: vi.fn(),
    file: pdfFile,
  };

  beforeEach(() => vi.clearAllMocks());

  it('파일명을 표시한다', () => {
    render(<FilePreview {...defaultProps} />);
    expect(screen.getByText('명함_시안.pdf')).toBeInTheDocument();
  });

  it('모달 제목 "파일 미리보기"를 표시한다', () => {
    render(<FilePreview {...defaultProps} />);
    expect(screen.getByText('파일 미리보기')).toBeInTheDocument();
  });

  it('PDF 파일을 iframe으로 표시한다', () => {
    const { container } = render(<FilePreview {...defaultProps} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', pdfFile.url);
  });

  it('이미지 파일을 img 태그로 표시한다', () => {
    render(<FilePreview {...defaultProps} file={imageFile} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', imageFile.url);
  });

  it('확인완료 버튼을 클릭하면 onApprove를 호출한다', () => {
    render(<FilePreview {...defaultProps} />);
    fireEvent.click(screen.getByText('확인완료'));
    expect(defaultProps.onApprove).toHaveBeenCalledWith(pdfFile);
  });

  it('재업로드 요청 버튼을 클릭하면 onReupload를 호출한다', () => {
    render(<FilePreview {...defaultProps} />);
    fireEvent.click(screen.getByText('재업로드 요청'));
    expect(defaultProps.onReupload).toHaveBeenCalledWith(pdfFile);
  });

  it('닫기 버튼을 클릭하면 onClose를 호출한다', () => {
    render(<FilePreview {...defaultProps} />);
    fireEvent.click(screen.getByText('✕'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('isOpen이 false이면 렌더링하지 않는다', () => {
    const { container } = render(<FilePreview {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('파일 크기를 표시한다', () => {
    render(<FilePreview {...defaultProps} />);
    expect(screen.getByText('2.5MB')).toBeInTheDocument();
  });
});
