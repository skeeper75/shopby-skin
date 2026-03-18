/**
 * OrdersPage 테스트 - 주문 관리 메인 페이지
 *
 * SPEC-SKIN-005 REQ-005-002: 주문 목록
 * - 검색, 필터 (상태/카테고리/기간)
 * - DataTable 연동
 * - 일괄 작업 BulkActionBar
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

vi.mock('../../hooks/useAdminAuth', () => ({
  __esModule: true,
  default: () => ({
    admin: { name: '관리자', role: 'super_admin' },
    logout: vi.fn(),
  }),
}));

// AdminLayout을 children만 렌더링하는 래퍼로 모킹
vi.mock('../../components/admin/AdminLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>,
}));

vi.mock('../../components/admin/AdminSidebar', () => ({
  __esModule: true,
  default: () => <nav>사이드바</nav>,
}));

vi.mock('../../components/admin/SearchBar', () => ({
  __esModule: true,
  default: ({ placeholder, onSearch, className }) => (
    <input
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      className={className}
      data-testid="search-bar"
    />
  ),
}));

vi.mock('../../components/admin/DatePicker', () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <div data-testid="date-picker">
      <input aria-label="시작일" onChange={(e) => onChange({ startDate: e.target.value, endDate: '' })} />
      <input aria-label="종료일" onChange={(e) => onChange({ startDate: '', endDate: e.target.value })} />
    </div>
  ),
}));

import OrdersPage from '../../pages/admin/Orders';

const renderPage = () =>
  render(
    <MemoryRouter>
      <OrdersPage />
    </MemoryRouter>
  );

describe('OrdersPage', () => {
  it('주문 관리 제목을 렌더링한다', () => {
    renderPage();
    expect(screen.getByText('주문 관리')).toBeInTheDocument();
  });

  it('검색 입력 필드를 렌더링한다', () => {
    renderPage();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('상태 필터 텍스트를 렌더링한다', () => {
    renderPage();
    // "상태"가 여러 곳에 나타날 수 있으므로 getAllByText 사용
    expect(screen.getAllByText('상태').length).toBeGreaterThanOrEqual(1);
  });

  it('카테고리 필터 텍스트를 렌더링한다', () => {
    renderPage();
    expect(screen.getByText('카테고리')).toBeInTheDocument();
  });

  it('Mock 주문 데이터를 테이블에 표시한다', () => {
    renderPage();
    expect(screen.getByText('HP-2024-0001')).toBeInTheDocument();
    expect(screen.getByText('김민수')).toBeInTheDocument();
  });

  it('Excel 다운로드 버튼이 있다', () => {
    renderPage();
    expect(screen.getByText('Excel 다운로드')).toBeInTheDocument();
  });

  it('날짜 필터를 렌더링한다', () => {
    renderPage();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('총 건수를 표시한다', () => {
    renderPage();
    // Mock 데이터 6건
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
