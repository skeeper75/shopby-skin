import { useMemo, lazy, Suspense, useRef, useEffect } from 'react';

import { Tabs, useTabsStateContext } from '@shopby/react-components';

const LAZY_COMPONENT_MAP = {
  DETAIL: lazy(() => import('./Detail')),
  REVIEW: lazy(() => import('../Review')),
  INQUIRY: lazy(() => import('../Inquiry')),
  SHIPPING_CLAIM: lazy(() => import('./ShippingClaim')),
};

const ActiveComponent = () => {
  const { currentTab } = useTabsStateContext();

  const Component = useMemo(() => LAZY_COMPONENT_MAP[currentTab], [currentTab]);

  const boxRef = useRef(null);

  useEffect(() => {
    boxRef?.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentTab]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  return (
    <div className="product-content__box" ref={boxRef}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </div>
  );
};

// 상품 상세 콘텐츠 (탭: 상세정보, 후기, Q&A, 배송/교환/반품)
const Content = () => (
  <section className="l-panel product-content w-full">
    <Tabs />
    <ActiveComponent />
  </section>
);

export default Content;
