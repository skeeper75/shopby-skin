/**
 * AdminLogin 테스트 - 관리자 로그인 페이지
 *
 * SPEC-SKIN-005 REQ-005-001: 관리자 로그인
 * - 아이디/비밀번호 입력 폼
 * - 유효성 검사 (빈값)
 * - 로그인 성공 시 대시보드 이동
 * - 로그인 실패 시 에러 메시지
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLogin = vi.fn();
vi.mock('../../hooks/useAdminAuth', () => ({
  __esModule: true,
  default: () => ({
    login: mockLogin,
  }),
}));

// shadcn/ui Input 모킹
vi.mock('../../components/ui/input', () => ({
  // eslint-disable-next-line react/display-name
  Input: require('react').forwardRef(({ className, ...props }, ref) => (
    require('react').createElement('input', { ref, className, ...props })
  )),
}));

// shadcn/ui Button 모킹
vi.mock('../../components/ui/button', () => ({
  Button: ({ children, className, ...props }) =>
    require('react').createElement('button', { className, ...props }, children),
}));

import AdminLogin from '../../pages/admin/Login';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AdminLogin />
    </MemoryRouter>
  );

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ success: true });
  });

  it('로그인 폼을 렌더링한다', () => {
    renderLogin();
    // form 태그는 role 없이도 존재 확인 가능
    const loginBtn = screen.getByRole('button', { name: '로그인' });
    expect(loginBtn.closest('form')).toBeTruthy();
  });

  it('아이디 입력 필드를 렌더링한다', () => {
    renderLogin();
    expect(screen.getByLabelText('아이디')).toBeInTheDocument();
  });

  it('비밀번호 입력 필드를 렌더링한다', () => {
    renderLogin();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
  });

  it('로그인 버튼을 렌더링한다', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('후니프린팅 로고를 표시한다', () => {
    renderLogin();
    expect(screen.getByText('후니프린팅')).toBeInTheDocument();
  });

  it('빈 값으로 제출 시 에러 메시지를 표시한다', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await waitFor(() => {
      expect(screen.getByText('아이디를 입력해주세요.')).toBeInTheDocument();
      expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument();
    });
  });

  it('로그인 성공 시 대시보드로 이동한다', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('아이디'), { target: { value: 'admin', name: 'id' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'admin1234', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin', 'admin1234');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
    });
  });

  it('로그인 실패 시 에러 메시지를 표시한다', async () => {
    mockLogin.mockResolvedValue({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    renderLogin();
    fireEvent.change(screen.getByLabelText('아이디'), { target: { value: 'admin', name: 'id' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'wrong', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await waitFor(() => {
      expect(screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument();
    });
  });

  it('에러 메시지에 alert role이 있다', async () => {
    mockLogin.mockResolvedValue({ success: false, message: '로그인 실패' });
    renderLogin();
    fireEvent.change(screen.getByLabelText('아이디'), { target: { value: 'a', name: 'id' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'b', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
