/* eslint-disable complexity */
import { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import { useLocation, useSearchParams } from 'react-router-dom';

import {
  useAuthStateContext,
  useBannerStateContext,
  useEventStateContextV2,
  useMallStateContext,
  useNaverShoppingConfigurationStateContext,
  useProductDetailStateContext,
  useShopbyStatisticsRecorder,
} from '@shopby/react-components';
import { PLATFORM_TYPE, initializeNaverShoppingConfiguration } from '@shopby/shared';

import { platformType } from '../../utils';

import ExternalServiceConfig from './ExternalServiceConfig';
import { removedDuplicateMetas, getPageScriptTitleTag } from './utils';

const isExternalScriptCallable = ({ location, isProfileLoading, renderableMetas, loadedTitle }) => {
  if (location?.state?.shouldRedirect) {
    return false;
  }

  if (isProfileLoading || !renderableMetas?.length || !loadedTitle) {
    return false;
  }

  const { pathname, search } = location;
  if (pathname === '/orders' && !search) {
    return false;
  }

  if (pathname === '/claims' && (!search.includes('claimType') || !search.includes('start'))) {
    return false;
  }

  if (pathname === '/my-page/accumulation' && !search) {
    return false;
  }

  return true;
};

const Meta = () => {
  const [searchParams] = useSearchParams();
  const { mallName, mall, externalServiceConfig, isLoading: isMallLoading } = useMallStateContext();
  const { productDetail } = useProductDetailStateContext();
  const { bannerMap, isLoading: isBannerLoading } = useBannerStateContext();
  const platform = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;
  const mallUrl = mall.url?.[platform.toLocaleLowerCase()];

  const [loadedTitle, setLoadedTitle] = useState(document.title);

  const location = useLocation();
  const { profile, isProfileLoading } = useAuthStateContext();

  const { clientId, mallProfile } = useMallStateContext();
  const { isScriptLoaded, record } = useShopbyStatisticsRecorder({ clientId, mallProfile });
  const { configuration } = useNaverShoppingConfigurationStateContext();

  const productNo = Number(searchParams.get('productNo'));
  const eventInfo = useEventStateContextV2();

  const naverWebmaster = externalServiceConfig?.naverWebmaster;
  const isProductDetailPage = window.location.href.includes('product-detail');
  const isEventPage = window.location.href.includes('/event');

  const creatableMetaTag = useMemo(() => {
    if (isProductDetailPage && !productDetail?.baseInfo?.productName) {
      return false;
    }

    if (isEventPage && !eventInfo?.eventNo) {
      return false;
    }

    if (!isMallLoading && !isBannerLoading) {
      return true;
    }

    return false;
  }, [
    isProductDetailPage,
    productDetail?.baseInfo?.productNo,
    isEventPage,
    eventInfo?.eventNo,
    isMallLoading,
    isBannerLoading,
    location.href,
  ]);

  const { metas: renderableMetas, titleContent } = useMemo(() => {
    if (!creatableMetaTag) {
      return {};
    }

    return removedDuplicateMetas({
      productDetail,
      bannerMap,
      eventInfo,
      mallName,
      mallUrl,
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      pageScripts: ShopbyExternalScript?.scripts,
      isProductDetailPage,
      isEventPage,
    });
  }, [creatableMetaTag, location.href]);

  const pageScriptTitleTag = getPageScriptTitleTag();

  useEffect(() => {
    initializeNaverShoppingConfiguration({
      naverWebmaster,
      configuration,
    });
  }, [naverWebmaster, configuration]);

  useEffect(() => {
    if (isScriptLoaded && !isProfileLoading) {
      record(profile?.memberNo);
    }
  }, [isScriptLoaded, isProfileLoading, location.pathname, productNo]);

  useEffect(() => {
    if (
      !isExternalScriptCallable({
        location,
        isProfileLoading,
        renderableMetas,
        loadedTitle,
      })
    ) {
      return;
    }

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      getPlatform: () => platformType,
      profile,
    });
  }, [renderableMetas, profile, isProfileLoading, location, loadedTitle]);

  useEffect(() => {
    if (!pageScriptTitleTag?.textContent && titleContent) {
      document.title = titleContent;
      setLoadedTitle(titleContent);
    }
  }, [titleContent]);

  return (
    <>
      <Helmet>
        {renderableMetas?.map((info, index) => {
          const title = pageScriptTitleTag?.textContent;
          const { name, property } = info;

          if (title && (name?.includes('title') || property?.includes('title'))) {
            info.content = title;
          }

          return <meta key={`${index}-${name ? name : property}`} {...info} />;
        })}
      </Helmet>
      <ExternalServiceConfig />
    </>
  );
};

export default Meta;
