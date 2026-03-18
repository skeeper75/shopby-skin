import { node, oneOf, string } from 'prop-types';

import { cn } from '../../design-system/utils';

/**
 * 페이지 컨테이너 컴포넌트
 *
 * 일관된 max-width, 중앙 정렬, 반응형 패딩을 제공하는 페이지 래퍼.
 * 모든 페이지 컴포넌트는 이 컴포넌트로 감싸서 레이아웃 일관성을 보장.
 *
 * @MX:ANCHOR: [AUTO] [PageShell] 전체 페이지 레이아웃 컨테이너 - 20개 페이지에서 직접 사용
 * @MX:REASON: fan_in=20, SPEC-LAYOUT-001 핵심 공개 API - maxWidth/padding 변경 시 전체 페이지 레이아웃에 영향
 * @MX:NOTE: [AUTO] MAX_WIDTH_MAP 변경 시 모든 PageShell 사용처에 영향. 키 삭제 금지
 * @MX:TODO: [AUTO] PageShell 컴포넌트 단위 테스트 미작성 (maxWidth, padding, as prop 검증 필요)
 * @MX:SPEC: SPEC-LAYOUT-001
 */

const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',       // 384px - 인증 카드
  md: 'max-w-md',       // 448px
  lg: 'max-w-lg',       // 512px
  xl: 'max-w-xl',       // 576px
  '2xl': 'max-w-2xl',   // 672px
  '3xl': 'max-w-3xl',   // 768px
  '4xl': 'max-w-4xl',   // 896px - 폼 페이지
  '5xl': 'max-w-5xl',   // 1024px - 주문/장바구니
  '6xl': 'max-w-6xl',   // 1152px
  '7xl': 'max-w-7xl',   // 1280px - 메인/카탈로그
  full: 'max-w-full',
};

const PADDING_MAP = {
  none: '',
  sm: 'px-4',
  responsive: 'px-4 md:px-6 lg:px-8',
};

const PageShell = ({ children, maxWidth = '7xl', padding = 'responsive', className, as: Component = 'div' }) => (
  <Component
    className={cn(
      'mx-auto w-full',
      MAX_WIDTH_MAP[maxWidth],
      PADDING_MAP[padding],
      className
    )}
  >
    {children}
  </Component>
);

PageShell.propTypes = {
  children: node,
  /** 최대 너비 ('sm' ~ '7xl' 또는 'full') */
  maxWidth: oneOf(Object.keys(MAX_WIDTH_MAP)),
  /** 패딩 ('none' | 'sm' | 'responsive') */
  padding: oneOf(['none', 'sm', 'responsive']),
  /** 추가 CSS 클래스 */
  className: string,
  /** 렌더링할 HTML 요소 */
  as: oneOf(['div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav']),
};

export default PageShell;
