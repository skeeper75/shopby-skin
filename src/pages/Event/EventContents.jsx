import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';

import { oneOf, arrayOf, shape, string } from 'prop-types';

import {
  useEventActionContextV2,
  useEventStateContextV2,
  useDesignPopupActionContext,
  Slider,
  Slide,
  CouponByProductProvider,
  useModalActionContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, CLIENT_ERROR_MESSAGE, PLATFORM_TYPE, SERVER_ERROR } from '@shopby/shared';
import { PER_PAGE_COUNT } from '@shopby/shared/constants';

import GalleryListPage from '../../components/GalleryListPage/GalleryListPage';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import EventCoupon from './EventCoupon';
import EventTopImg from './EventTopImg';

const SLIDE_OPTION = {
  slidesPerView: 'auto',
};

const EventContents = ({ sortBy }) => {
  const { t } = useTranslation('title');
  const { eventNoOrId } = useParams();
  const platformType = useOutletContext();
  const { openAlert } = useModalActionContext();
  const [searchParams] = useSearchParams();
  const channelType = searchParams.get('channelType');
  const navigate = useNavigate();

  const params = Object.fromEntries(searchParams);

  const [disabled, setDisabled] = useState(false);
  const { label, coupon, sortType, tabId, listOfExhibition, top, isLoading, eventNo, totalCount, sectionNo, products } =
    useEventStateContextV2();
  const { fetchDisplayPopups } = useDesignPopupActionContext();
  const { fetchEventsEventNo, updateSortType, updateTabId, fetchEventDetailProducts, updateIsLoading } =
    useEventActionContextV2();
  const [style, setStyle] = useState({});
  const [queryString, setQueryString] = useState({
    ...params,
    eventKey: null,
    cacheOption: {
      key: window.location.href,
      type: 'MEMORY',
      timeBySeconds: 180,
    },
  });

  const [productQueryString, setProductQueryString] = useState({
    ...params,
    eventNo,
    sectionNo,
    sortType,
    soldOut: true,
    includeStopProduct: true,
    saleStatus: 'ONSALE',
    pageNumber: 1,
    pageSize: PER_PAGE_COUNT,
    cacheOption: {
      key: window.location.href,
      type: 'MEMORY',
      timeBySeconds: 180,
    },
  });

  const topImgInfo = useMemo(() => top[platformType === 'PC' ? 'pc' : 'mobile'], [top]);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    hasBottomNav: true,
    title: t(label),
  });

  const handleFetchEventError = (error) => {
    const { code } = error.serverError;
    const label = code !== CLIENT_ERROR.EXPIRED_REFRESH_TOKEN ? '메인페이지로 돌아가기' : '확인';
    const replacedUrl = {
      [CLIENT_ERROR.EXPIRED_REFRESH_TOKEN]: '/sign-in',
    }[code];

    openAlert({
      label,
      message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR[SERVER_ERROR[code]]],
      onClose: () => {
        navigate(replacedUrl ?? '/', {
          replace: true,
          state: {
            from: `${location.pathname}${location.search}`,
          },
        });
      },
    });
  };

  const handleFetchEventDetailProducts = async () => {
    updateIsLoading(true);

    try {
      await fetchEventDetailProducts(productQueryString);
    } catch ({ error }) {
      handleFetchEventError(error);
    } finally {
      setDisabled(false);
    }
  };

  const handleInterSect = () => {
    setDisabled(true);

    if (totalCount && products.length >= totalCount) return;

    setProductQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  const initEvent = () => {
    setQueryString((prev) => ({ ...prev, eventKey: eventNoOrId }));
  };

  const handleFetchEvent = async () => {
    try {
      await fetchEventsEventNo(tabId, queryString);
    } catch ({ error }) {
      handleFetchEventError(error);
    }
  };

  const setEventSection = () => {
    const currentSection = listOfExhibition.find((item) => item.id === tabId);
    const perRowNo = currentSection?.[platformType === PLATFORM_TYPE.PC ? 'pcPerRow' : 'mobilePerRow'];

    if (!eventNo || !currentSection?.sectionNo) {
      return;
    }

    setStyle({
      gridTemplateColumns: `repeat(${perRowNo}, calc( 100% / ${perRowNo} - 10px))`,
    });

    setProductQueryString((prev) => ({
      ...prev,
      sortType,
      pageNumber: 1,
      eventNo,
      sectionNo: currentSection?.sectionNo,
    }));
  };

  useEffect(() => {
    setProductQueryString((prev) => ({ ...prev, pageNumber: 1, sortType }));
  }, [sortType]);

  useEffect(() => {
    if (!queryString.eventKey) {
      return;
    }

    handleFetchEvent(queryString);
  }, [queryString]);

  useEffect(() => {
    !!eventNo &&
      fetchDisplayPopups({
        pageType: 'EVENT',
        targetNo: eventNo,
        cacheOption: {
          key: window.location.href,
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });
  }, [eventNo]);

  useEffect(() => {
    const { eventNo, sectionNo } = productQueryString;
    if (!eventNo || !sectionNo) {
      return;
    }

    handleFetchEventDetailProducts();
  }, [productQueryString]);

  useEffect(() => {
    initEvent();
  }, []);

  useEffect(() => {
    if (!listOfExhibition.length) {
      return;
    }

    setEventSection();
  }, [listOfExhibition, tabId]);

  return (
    <>
      {topImgInfo && <EventTopImg imgInfo={topImgInfo} label={label} />}

      {coupon?.coupons.length > 0 && (
        <CouponByProductProvider>
          <EventCoupon coupons={coupon.coupons?.filter(({ downloadable }) => downloadable)} channelType={channelType} />
        </CouponByProductProvider>
      )}

      {listOfExhibition.length > 0 && (
        <nav className="event-nav">
          <Slider {...SLIDE_OPTION}>
            {listOfExhibition.map((item) => (
              <Slide key={item.id}>
                <button
                  type="button"
                  data-id={item.id}
                  className={`event-nav__btn${item.id === tabId ? ' is-active' : ''}`}
                  onClick={() => {
                    updateTabId(item.id);
                  }}
                >
                  {item.label}
                </button>
              </Slide>
            ))}
          </Slider>
        </nav>
      )}

      {totalCount > 0 && (
        <GalleryListPage
          style={style}
          totalCount={totalCount}
          products={products}
          sortType={sortType}
          sortBy={sortBy}
          updateSortType={updateSortType}
          handleIntersect={handleInterSect}
          disabled={disabled}
          isLoading={isLoading}
          className="event-list"
        />
      )}
    </>
  );
};

export default EventContents;

EventContents.propTypes = {
  sortBy: arrayOf(
    shape({
      value: oneOf(['SALE', 'ADMIN_SETTING', 'BEST_SELLER', 'BEST_REVIEW']),
      label: string,
    })
  ),
};
