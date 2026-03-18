/**
 * GalleryListPage 특성화 테스트 (DDD PRESERVE)
 *
 * 기존 갤러리 리스트 컴포넌트의 현재 동작을 캡처합니다.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useResponsive', () => ({
  default: vi.fn(() => ({ isMobile: false, isTablet: false, isDesktop: true })),
}));
vi.mock('../../components/GallerySkeleton/GalleryGridSkeleton', () => ({
  default: ({ isLoading }) =>
    isLoading ? <div data-testid="skeleton">로딩 중</div> : null,
}));
vi.mock('../../components/ProductThumbBadge', () => ({
  default: ({ isSoldOut }) => (
    <div data-testid="thumb-badge" data-sold-out={isSoldOut} />
  ),
}));
vi.mock('../../components/ProductThumbInfo', () => ({
  default: ({ productName, salePrice }) => (
    <div data-testid="thumb-info">
      <span>{productName}</span>
      <span>{salePrice}원</span>
    </div>
  ),
}));
vi.mock('../../components/TotalCountAndSort', () => ({
  default: ({ totalCount }) => (
    <div data-testid="total-count-sort">총 {totalCount}개</div>
  ),
}));

import GalleryListPage from '../../components/GalleryListPage/GalleryListPage';

const mockProducts = [
  {
    productNo: 1,
    adult: false,
    listImageUrlInfo: [{ url: '/img1.jpg', imageUrlType: 'PRODUCT_LIST' }],
    isSoldOut: false,
    saleStatusType: 'ONSALE',
    salePrice: 45000,
    promotionText: '인기 상품',
    productName: '전단지 A4',
    unescapedProductName: '전단지 A4',
    immediateDiscountAmt: 5000,
    additionDiscountAmt: 0,
    frontDisplayYn: true,
    imageUrlInfo: [{ url: '/img1.jpg' }],
    imageUrls: ['/img1.jpg'],
    stickerInfos: [{ label: 'NEW', type: 'TEXT', no: 1, name: 'new-badge' }],
  },
  {
    productNo: 2,
    adult: false,
    listImageUrlInfo: [{ url: '/img2.jpg', imageUrlType: 'PRODUCT_LIST' }],
    isSoldOut: true,
    saleStatusType: 'ONSALE',
    salePrice: 38000,
    promotionText: '',
    productName: '전단지 A3',
    unescapedProductName: '전단지 A3',
    immediateDiscountAmt: 0,
    additionDiscountAmt: 0,
    frontDisplayYn: true,
    imageUrlInfo: [{ url: '/img2.jpg' }],
    imageUrls: ['/img2.jpg'],
    stickerInfos: [],
  },
];

describe('GalleryListPage (특성화)', () => {
  const defaultProps = {
    totalCount: 128,
    products: mockProducts,
    sortType: 'POPULAR',
    sortBy: ['POPULAR', 'RECENT', 'LOW_PRICE'],
    updateSortType: vi.fn(),
    handleIntersect: vi.fn(),
    disabled: false,
    isLoading: false,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <GalleryListPage {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('총 상품 수와 정렬을 렌더링한다', () => {
    renderComponent();
    expect(screen.getByTestId('total-count-sort')).toBeInTheDocument();
    expect(screen.getByText('총 128개')).toBeInTheDocument();
  });

  it('상품 목록을 렌더링한다', () => {
    renderComponent();
    expect(screen.getByTestId('thumb-list')).toBeInTheDocument();
  });

  it('각 상품의 이름을 렌더링한다', () => {
    renderComponent();
    expect(screen.getByText('전단지 A4')).toBeInTheDocument();
    expect(screen.getByText('전단지 A3')).toBeInTheDocument();
  });

  it('스티커 라벨을 렌더링한다', () => {
    renderComponent();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('무한 스크롤 로더를 렌더링한다', () => {
    renderComponent();
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('상품이 없을 때 검색 결과 없음을 표시한다', () => {
    renderComponent({ products: [] });
    expect(screen.getByText('상품이 존재하지 않습니다.')).toBeInTheDocument();
  });

  it('로딩 중일 때 스켈레톤을 표시한다', () => {
    renderComponent({ products: [], isLoading: true });
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('반응형 그리드 클래스를 적용한다', () => {
    renderComponent();
    const thumbList = screen.getByTestId('thumb-list');
    expect(thumbList.className).toContain('grid-cols-2');
  });
});
