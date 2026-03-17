/**
 * PrintFileUpload 신규 기능 테스트
 *
 * SPEC-SKIN-003 REQ-005: 파일 업로드 컴포넌트
 * - 드래그 앤 드롭 지원
 * - 파일 포맷 검증 (PDF, AI, PSD, JPG, PNG)
 * - 최대 100MB 제한
 * - 업로드 진행률 표시
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// shadcn/ui 컴포넌트 모킹
vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));
vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={className} {...props}>{children}</button>
  ),
}));
vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));

import PrintFileUpload from '../../components/PrintFileUpload/PrintFileUpload';

// 테스트 유틸: 파일 생성
const createFile = (name, size, type = 'application/pdf') => {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
};

describe('PrintFileUpload', () => {
  const defaultProps = {
    onFilesChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('드롭 존을 렌더링한다', () => {
    render(<PrintFileUpload {...defaultProps} />);
    expect(screen.getByText(/인쇄용 디자인 파일을 드래그/)).toBeInTheDocument();
  });

  it('지원 포맷 뱃지를 표시한다', () => {
    render(<PrintFileUpload {...defaultProps} />);
    expect(screen.getByText('.PDF')).toBeInTheDocument();
    expect(screen.getByText('.AI')).toBeInTheDocument();
    expect(screen.getByText('.PSD')).toBeInTheDocument();
    expect(screen.getByText('.JPG')).toBeInTheDocument();
    expect(screen.getByText('.PNG')).toBeInTheDocument();
  });

  it('파일 크기 제한을 표시한다', () => {
    render(<PrintFileUpload {...defaultProps} />);
    expect(screen.getByText(/최대 100.0 MB/)).toBeInTheDocument();
  });

  it('유효한 파일 선택 시 onFilesChange를 호출한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const file = createFile('test.pdf', 1024);
    fireEvent.change(input, { target: { files: [file] } });

    expect(defaultProps.onFilesChange).toHaveBeenCalled();
    const callArgs = defaultProps.onFilesChange.mock.calls[0][0];
    expect(callArgs).toHaveLength(1);
    expect(callArgs[0].name).toBe('test.pdf');
  });

  it('지원하지 않는 포맷의 파일을 거부한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const file = createFile('test.doc', 1024, 'application/msword');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/지원하지 않습니다/)).toBeInTheDocument();
  });

  it('100MB 초과 파일을 거부한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const bigFile = createFile('huge.pdf', 150 * 1024 * 1024);
    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(screen.getByText(/최대 허용 크기/)).toBeInTheDocument();
  });

  it('최대 파일 개수를 초과하면 에러를 표시한다', async () => {
    render(<PrintFileUpload {...defaultProps} maxFiles={2} />);
    const input = document.querySelector('input[type="file"]');

    const files = [
      createFile('a.pdf', 1024),
      createFile('b.pdf', 1024),
      createFile('c.pdf', 1024),
    ];
    fireEvent.change(input, { target: { files } });

    expect(screen.getByText(/최대 2개까지 업로드 가능/)).toBeInTheDocument();
  });

  it('중복 파일을 거부한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const file1 = createFile('test.pdf', 1024);
    fireEvent.change(input, { target: { files: [file1] } });

    // 같은 이름/크기의 파일 다시 업로드
    const file2 = createFile('test.pdf', 1024);
    fireEvent.change(input, { target: { files: [file2] } });

    expect(screen.getByText(/이미 업로드된 파일/)).toBeInTheDocument();
  });

  it('업로드된 파일 목록을 표시한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const file = createFile('design.pdf', 5000);
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('design.pdf')).toBeInTheDocument();
  });

  it('파일 삭제 버튼이 동작한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const file = createFile('delete-me.pdf', 1024);
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('delete-me.pdf')).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('delete-me.pdf 삭제');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('delete-me.pdf')).not.toBeInTheDocument();
  });

  it('드래그 진입 시 시각적 피드백을 제공한다', () => {
    const { container } = render(<PrintFileUpload {...defaultProps} />);
    const dropZone = container.querySelector('[role="button"]');

    fireEvent.dragEnter(dropZone, { dataTransfer: { files: [] } });

    expect(screen.getByText('여기에 파일을 놓으세요')).toBeInTheDocument();
  });

  it('업로드 진행률 바를 표시한다', async () => {
    render(<PrintFileUpload {...defaultProps} />);
    const input = document.querySelector('input[type="file"]');

    const file = createFile('progress.pdf', 1024);
    fireEvent.change(input, { target: { files: [file] } });

    // 타이머를 진행시켜 업로드 시뮬레이션 시작 (act로 감싸서 state 업데이트 반영)
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // 프로그레스 바가 존재하는지 확인
    const progressBar = document.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('접근성: 드롭 존에 aria-label이 있다', () => {
    const { container } = render(<PrintFileUpload {...defaultProps} />);
    const dropZone = container.querySelector('[role="button"]');
    expect(dropZone).toHaveAttribute('aria-label');
  });

  it('접근성: 키보드로 드롭 존을 활성화할 수 있다', () => {
    const { container } = render(<PrintFileUpload {...defaultProps} />);
    const dropZone = container.querySelector('[role="button"]');
    expect(dropZone).toHaveAttribute('tabindex', '0');
  });
});
