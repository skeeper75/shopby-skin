/**
 * AdminLayout 테스트 - 관리자 대시보드 레이아웃
 *
 * SPEC-SKIN-005 REQ-005-001: 관리자 로그인 -> 대시보드
 * - 사이드바 + 헤더 + 콘텐츠 영역 구성
 * - 사이드바 토글 (태블릿 대응)
 * - 로그아웃 버튼
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid="outlet">Outlet 콘텐츠</div>,
}));

vi.mock('../../hooks/useAdminAuth', () => ({
  __esModule: true,
  default: () => ({
    admin: { name: '관리자', role: 'super_admin' },
    logout: mockLogout,
  }),
}));

vi.mock('../../components/admin/AdminSidebar', () => ({
  __esModule: true,
  default: ({ collapsed }) => (
    <nav role="navigation" data-collapsed={collapsed}>사이드바</nav>
  ),
}));

import AdminLayout from '../../components/admin/AdminLayout';

const renderLayout = () =>
  render(
    <MemoryRouter>
      <AdminLayout />
    </MemoryRouter>
  );

describe('AdminLayout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('헤더(banner)를 렌더링한다', () => {
    renderLayout();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('사이드바(navigation)를 렌더링한다', () => {
    renderLayout();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('Outlet을 통해 콘텐츠를 렌더링한다', () => {
    renderLayout();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('관리자 이름을 헤더에 표시한다', () => {
    renderLayout();
    expect(screen.getByText('관리자')).toBeInTheDocument();
  });

  it('사이드바 토글 버튼이 있다', () => {
    renderLayout();
    expect(screen.getByLabelText('사이드바 토글')).toBeInTheDocument();
  });

  it('토글 버튼 클릭 시 사이드바에 collapsed 전달', () => {
    renderLayout();
    const toggleBtn = screen.getByLabelText('사이드바 토글');
    fireEvent.click(toggleBtn);
    const nav = screen.getByRole('navigation');
    expect(nav.dataset.collapsed).toBe('true');
  });

  it('로그아웃 버튼을 렌더링한다', () => {
    renderLayout();
    expect(screen.getByText('로그아웃')).toBeInTheDocument();
  });

  it('로그아웃 클릭 시 logout 호출 및 로그인 페이지로 이동', () => {
    renderLayout();
    fireEvent.click(screen.getByText('로그아웃'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
  });

  it('main 영역이 있다', () => {
    renderLayout();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('후니프린팅 Admin 로고 텍스트가 있다', () => {
    renderLayout();
    expect(screen.getByText('후니프린팅 Admin')).toBeInTheDocument();
  });
});
