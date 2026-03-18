/**
 * ProductDetail 특성화 테스트 (DDD PRESERVE)
 *
 * 기존 ProductDetail 컴포넌트의 현재 동작을 캡처합니다.
 * SPEC-SKIN-003 구현 전 기준선 역할을 합니다.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// 내부 모듈 모킹
vi.mock('../../hooks/useLayoutChanger', () => ({ default: vi.fn() }));
vi.mock('../../components/AdminBanner', () => ({
  default: ({ bannerId }) => <div data-testid={`admin-banner-${bannerId}`} />,
}));
vi.mock('../../components/ErrorBoundary', () => ({
  useErrorBoundaryActionContext: () => ({ catchError: vi.fn() }),
}));
vi.mock('../../constants', () => ({
  EXTERNAL_CUSTOM_ORDER_SHEET_TERMS: [],
}));

// 서브 컴포넌트 모킹
vi.mock('../../pages/ProductDetail/Content', () => ({
  default: () => <div data-testid="content">상품 상세</div>,
}));
vi.mock('../../pages/ProductDetail/ImageSlider', () => ({
  default: () => <div data-testid="image-slider">이미지 슬라이더</div>,
}));
vi.mock('../../pages/ProductDetail/Purchase', () => ({
  default: () => <div data-testid="purchase">구매 영역</div>,
}));
vi.mock('../../pages/ProductDetail/RelatedProduct', () => ({
  default: () => <div data-testid="related-product">관련 상품</div>,
}));
vi.mock('../../pages/ProductDetail/Summary', () => ({
  default: () => <div data-testid="summary">요약 정보</div>,
}));

import ProductDetail from '../../pages/ProductDetail/ProductDetail';
import { useProductDetailStateContext } from '@shopby/react-components';

describe('ProductDetail (특성화)', () => {
  const renderProductDetail = (searchParams = '?productNo=123') => {
    return render(
      <MemoryRouter initialEntries={[`/product-detail${searchParams}`]}>
        <ProductDetail />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이미지 슬라이더를 렌더링한다', () => {
    renderProductDetail();
    expect(screen.getByTestId('image-slider')).toBeInTheDocument();
  });

  it('요약 정보를 렌더링한다', () => {
    renderProductDetail();
    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('상품 상세 콘텐츠를 렌더링한다', () => {
    renderProductDetail();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('구매 영역을 렌더링한다', () => {
    renderProductDetail();
    expect(screen.getByTestId('purchase')).toBeInTheDocument();
  });

  it('AdminBanner를 렌더링한다', () => {
    renderProductDetail();
    expect(screen.getByTestId('admin-banner-BNDETAIL')).toBeInTheDocument();
  });

  it('관련 상품이 있으면 렌더링한다', () => {
    useProductDetailStateContext.mockReturnValue({
      productDetail: { productName: '테스트', guide: {} },
      originProductDetail: { baseInfo: { productNo: 1 } },
      relatedProducts: [{ productNo: 1 }],
    });

    renderProductDetail();
    expect(screen.getByTestId('related-product')).toBeInTheDocument();
  });

  it('관련 상품이 없으면 렌더링하지 않는다', () => {
    useProductDetailStateContext.mockReturnValue({
      productDetail: { productName: '테스트', guide: {} },
      originProductDetail: { baseInfo: { productNo: 1 } },
      relatedProducts: [],
    });

    renderProductDetail();
    expect(screen.queryByTestId('related-product')).not.toBeInTheDocument();
  });

  it('2컬럼 레이아웃 클래스를 적용한다 (lg:grid)', () => {
    const { container } = renderProductDetail();
    const gridDiv = container.querySelector('.lg\\:grid');
    expect(gridDiv).toBeInTheDocument();
  });
});
