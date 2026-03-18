/**
 * GalleryGridSkeleton 신규 기능 테스트
 *
 * SPEC-SKIN-003 8.1.8: 스켈레톤 로딩 카드
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));
vi.mock('../../components/ui/skeleton', () => ({
  Skeleton: ({ className }) => <div data-testid="skeleton-item" className={className} />,
}));

import GalleryGridSkeleton from '../../components/GallerySkeleton/GalleryGridSkeleton';

describe('GalleryGridSkeleton', () => {
  it('로딩 중일 때 스켈레톤 카드를 렌더링한다', () => {
    render(<GalleryGridSkeleton isLoading={true} />);
    const skeletons = screen.getAllByTestId('skeleton-item');
    // 기본 8개 카드 x 카드당 3개 스켈레톤 (이미지 + 이름 + 가격)
    expect(skeletons.length).toBe(8 * 3);
  });

  it('커스텀 아이템 수를 지원한다', () => {
    render(<GalleryGridSkeleton isLoading={true} itemCount={4} />);
    const skeletons = screen.getAllByTestId('skeleton-item');
    expect(skeletons.length).toBe(4 * 3);
  });

  it('로딩이 아닐 때 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<GalleryGridSkeleton isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('반응형 그리드 클래스를 적용한다', () => {
    const { container } = render(<GalleryGridSkeleton isLoading={true} />);
    const grid = container.firstChild;
    expect(grid.className).toContain('grid-cols-2');
    expect(grid.className).toContain('md:grid-cols-3');
    expect(grid.className).toContain('lg:grid-cols-4');
  });
});
