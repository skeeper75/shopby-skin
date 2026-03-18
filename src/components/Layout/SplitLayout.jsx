import { bool, node, string } from 'prop-types';

import { cn } from '../../design-system/utils';

/**
 * 좌우 분할 레이아웃 컴포넌트
 *
 * 모바일: 수직 스택 / 데스크톱: 좌측 메인 + 우측 사이드바.
 * 장바구니, 주문서 등 2단 레이아웃에 사용.
 *
 * @MX:ANCHOR: [AUTO] 2단 레이아웃 프리미티브 - Cart, OrderSheet 등 3개 페이지에서 사용
 * @MX:REASON: fan_in=3, main(8/12)+aside(4/12) 비율 변경 시 Cart·OrderSheet 레이아웃 깨짐
 * @MX:SPEC: SPEC-LAYOUT-001
 */

const SplitLayout = ({
  main,
  aside,
  asideSticky = false,
  reverse = false,
  className,
}) => (
  <div className={cn('lg:grid lg:grid-cols-12 lg:gap-8', className)}>
    <div className={cn('lg:col-span-8', reverse && 'lg:order-2')}>
      {main}
    </div>
    <div
      className={cn(
        'mt-6 lg:mt-0 lg:col-span-4',
        reverse && 'lg:order-1',
        asideSticky && 'lg:self-start lg:sticky lg:top-4'
      )}
    >
      {aside}
    </div>
  </div>
);

SplitLayout.propTypes = {
  /** 메인 콘텐츠 (좌측, 8/12) */
  main: node.isRequired,
  /** 사이드바 콘텐츠 (우측, 4/12) */
  aside: node.isRequired,
  /** 사이드바 sticky 여부 */
  asideSticky: bool,
  /** main/aside 순서 반전 */
  reverse: bool,
  /** 추가 CSS 클래스 */
  className: string,
};

export default SplitLayout;
