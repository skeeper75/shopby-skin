import { node, oneOf, shape, string } from 'prop-types';

import { cn } from '../../design-system/utils';

/**
 * 반응형 그리드 컴포넌트
 *
 * 뷰포트에 따라 컬럼 수가 자동 조정되는 그리드.
 * 상품 목록, 카테고리 그리드 등에 사용.
 *
 * @MX:NOTE: [AUTO] SPEC-LAYOUT-001 반응형 그리드 프리미티브
 * @MX:WARN: [AUTO] GRID_COLS/MD_GRID_COLS/LG_GRID_COLS 맵을 통한 동적 Tailwind 클래스 생성
 * @MX:REASON: Tailwind JIT는 동적으로 조합된 클래스명을 인식하지 못함. 맵에 없는 cols 값은 스타일 누락
 * @MX:SPEC: SPEC-LAYOUT-001
 */

// Tailwind 동적 클래스 생성을 위한 맵
const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const MD_GRID_COLS = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

const LG_GRID_COLS = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

const ResponsiveGrid = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 'gap-4',
  className,
}) => (
  <div
    className={cn(
      'grid',
      GRID_COLS[cols.mobile] || 'grid-cols-1',
      MD_GRID_COLS[cols.tablet] || 'md:grid-cols-2',
      LG_GRID_COLS[cols.desktop] || 'lg:grid-cols-4',
      gap,
      className
    )}
  >
    {children}
  </div>
);

ResponsiveGrid.propTypes = {
  children: node,
  /** 뷰포트별 컬럼 수 (1~6) */
  cols: shape({
    mobile: oneOf([1, 2, 3, 4, 5, 6]),
    tablet: oneOf([1, 2, 3, 4, 5, 6]),
    desktop: oneOf([1, 2, 3, 4, 5, 6]),
  }),
  /** gap 클래스 (Tailwind gap-* 또는 Huni gap-huni-*) */
  gap: string,
  /** 추가 CSS 클래스 */
  className: string,
};

export default ResponsiveGrid;
