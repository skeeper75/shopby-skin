import { Suspense, lazy, useMemo, useEffect } from 'react';

import {
  ProfileProductReviewProvider,
  TabsProvider,
  ProductReviewProvider,
  ProductReviewFormProvider,
  useTabsStateContext,
  useTabsActiveContext,
  useProductReviewActionContext,
} from '@shopby/react-components';

import { Tabs, TabsList, TabsTrigger } from '../../../components/ui';

import useLayoutChanger from '../../../hooks/useLayoutChanger';

const DEFAULT_TABS = [
  {
    value: 'REVIEWABLE',
    label: '작성 가능 후기',
  },
  {
    value: 'REVIEWED',
    label: '작성 완료 후기',
  },
];

const LAZY_COMPONENT_MAP = {
  REVIEWABLE: lazy(() => import('./ReviewableProduct')),
  REVIEWED: lazy(() => import('./ReviewedProduct')),
};

const ProductReviewContent = () => {
  const { currentTab, tabs } = useTabsStateContext();
  const { selectTab } = useTabsActiveContext();
  const { fetchConfiguration: fetchProductReviewConfiguration } = useProductReviewActionContext();

  const Component = useMemo(() => LAZY_COMPONENT_MAP[currentTab], [currentTab]);

  useEffect(() => {
    fetchProductReviewConfiguration({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
  }, []);

  return (
    <>
      {/* @MX:NOTE: Huni Tabs로 마이그레이션 (SPEC-SKIN-002) */}
      <Tabs value={currentTab} onValueChange={selectTab} className="profile-product-review__tabs">
        <TabsList>
          {tabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </>
  );
};

const ProductReview = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '상품후기 관리',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <ProfileProductReviewProvider>
      <ProductReviewProvider>
        <ProductReviewFormProvider>
          <TabsProvider
            initialState={{
              currentTab: 'REVIEWABLE',
              tabs: DEFAULT_TABS,
            }}
          >
            <div className="profile-product-review">
              <ProductReviewContent />
            </div>
          </TabsProvider>
        </ProductReviewFormProvider>
      </ProductReviewProvider>
    </ProfileProductReviewProvider>
  );
};

export default ProductReview;
