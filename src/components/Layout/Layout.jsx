import { useEffect, useState, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { bool, node } from 'prop-types';

import {
  BannerProvider,
  Icon,
  OffCanvasProvider,
  SearchAddressProvider,
  useBoardConfigurationContextAction,
  ProductDetailProvider,
  useNaverShoppingConfigurationActionContext,
  useBannerActionContext,
  useOrderConfigActionContext,
  CartProvider,
  useAuthStateContext,
  useCartActionContext,
} from '@shopby/react-components';
import { PLATFORM_TYPE } from '@shopby/shared';

import useResponsive from '../../hooks/useResponsive';
import useSyncTokenExpiryWithLocation from '../../hooks/useSyncTokenExpiryWithLocation';
import { scrollToTop } from '../../utils';
import AdminBanner from '../AdminBanner';
import BottomNav from '../BottomNav';
import BreadcrumbNav from '../BreadcrumbNav';
import CategoryNav from '../CategoryNav';
import DesignPopup from '../DesignPopup';
import Footer from '../Footer';
import Header from '../Header';
import LayoutProvider, { useLayoutValueContext } from '../LayoutProvider';
import Meta from '../Meta';
import SearchKeyword from '../SearchKeyword';

const BannerContent = ({ children }) => {
  const { fetchBanner } = useBannerActionContext();
  const { fetchOrderConfig } = useOrderConfigActionContext();

  useEffect(() => {
    fetchBanner({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });

    fetchOrderConfig({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
  }, []);

  return <>{children}</>;
};

BannerContent.propTypes = {
  children: node,
};

const CartContent = ({ children }) => {
  const { profile } = useAuthStateContext();
  const { fetchCartCount } = useCartActionContext();

  useEffect(() => {
    fetchCartCount({
      memberStatus: profile?.memberStatus,
    });
  }, [location?.href, profile?.memberStatus]);

  return <>{children}</>;
};

CartContent.propTypes = {
  children: node,
};

const Layout = () => {
  const [searchParams] = useSearchParams();
  const { fetchBoardConfiguration } = useBoardConfigurationContextAction();
  const { fetchConfiguration: fetchNaverShoppingConfiguration } = useNaverShoppingConfigurationActionContext();
  const { isDesktop } = useResponsive();

  // Shopby API 플랫폼 타입 - 섹션 코드 구분용 (SCPC/SCMO)
  const platformType = isDesktop ? PLATFORM_TYPE.PC : PLATFORM_TYPE.MOBILE_WEB;

  const pageRef = useRef();
  const pageInnerRef = useRef();

  const productNo = Number(searchParams.get('productNo'));

  useSyncTokenExpiryWithLocation();

  useEffect(() => {
    scrollToTop();
    fetchNaverShoppingConfiguration({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
    fetchBoardConfiguration();
  }, []);

  return (
    <LayoutProvider>
      <div className="page" ref={pageRef}>
        <DesignPopup refs={{ pageInnerRef, pageRef }} />
        {/* area-left */}
        <div className="page__side"></div>
        <BannerProvider>
          <BannerContent>
            <CartProvider>
              <CartContent>
                <ProductDetailProvider productNo={productNo}>
                  <Meta />
                  <div className="page-inner" ref={pageInnerRef}>
                    {/* banner--left */}
                    <article className="page__content banner--left">
                      <figure>
                        <AdminBanner bannerId="BNBGLEFT" />
                      </figure>
                    </article>
                    {/* // banner--left */}
                    <OffCanvasProvider>
                      <div className="page__content site">
                        <Header />
                        <BreadcrumbNav />
                        <main className="l-content">
                          <Outlet context={platformType} />
                        </main>
                        <Footer />
                        <SearchAddressProvider>
                          <BottomNavWrap />
                        </SearchAddressProvider>
                        <CategoryNav />
                        <span className="fab-top-down">
                          <button className="fab-btn fab-btn--top" onClick={scrollToTop}>
                            <Icon name="angle-down" className="fab-btn__top" />
                          </button>
                        </span>
                      </div>
                    </OffCanvasProvider>
                  </div>
                </ProductDetailProvider>
              </CartContent>
            </CartProvider>
          </BannerContent>
        </BannerProvider>
        {/* area right */}
        <div className="page__side"></div>
      </div>
    </LayoutProvider>
  );
};

const BottomNavWrap = () => {
  const { hasBottomNav } = useLayoutValueContext();
  const [openSearchFullModal, setOpenSearchFullModal] = useState(false);

  if (hasBottomNav)
    return (
      <>
        <BottomNav search={() => setOpenSearchFullModal(true)} />
        {openSearchFullModal && <SearchKeyword openModal={setOpenSearchFullModal} />}
      </>
    );

  return <></>;
};

export default Layout;

Layout.propTypes = {
  isMain: bool,
  hasBottomNav: bool,
  hasHomeBtn: bool,
  hasBackBtn: bool,
  hasCartBtn: bool,
};
