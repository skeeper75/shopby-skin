/**
 * DisplayCategoryList 특성화 테스트 (DDD PRESERVE)
 *
 * 기존 카테고리 상품 목록 페이지의 현재 동작을 캡처합니다.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));

vi.mock('../../pages/DisplayCategoryList/DisplayCategoryListWrap', () => ({
  default: () => <div data-testid="category-list-wrap">상품 목록</div>,
}));
vi.mock('../../pages/DisplayCategoryList/menu/CategoryMenu', () => ({
  default: ({ categoryNo }) => (
    <div data-testid="category-menu" data-category-no={categoryNo}>카테고리 메뉴</div>
  ),
}));

import DisplayCategoryList from '../../pages/DisplayCategoryList/DisplayCategoryList';

describe('DisplayCategoryList (특성화)', () => {
  const renderComponent = (searchParams = '?categoryNo=100&depth=1') => {
    return render(
      <MemoryRouter initialEntries={[`/category${searchParams}`]}>
        <DisplayCategoryList />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('카테고리 메뉴를 렌더링한다 (키워드 없을 때)', () => {
    renderComponent('?categoryNo=100&depth=1');
    expect(screen.getByTestId('category-menu')).toBeInTheDocument();
  });

  it('상품 목록 래퍼를 렌더링한다', () => {
    renderComponent();
    expect(screen.getByTestId('category-list-wrap')).toBeInTheDocument();
  });

  it('키워드 검색 시 카테고리 메뉴를 숨긴다', () => {
    renderComponent('?keyword=전단지');
    expect(screen.queryByTestId('category-menu')).not.toBeInTheDocument();
  });
});
