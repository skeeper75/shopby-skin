import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  InfiniteScrollLoader,
  MyOrderProvider,
  useMyOrderActionContext,
  useMyOrderStateContext,
  VisibleComponent,
  useCurrencyStateContext,
} from '@shopby/react-components';

import { Skeleton } from '../../../components/ui';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import StartYmdSelector from '../../../components/StartYmdSelector';
import useLayoutChanger from '../../../hooks/useLayoutChanger';

import OrderSummary from './OrderSummary';

const PAGE_SIZE = 10;

// @MX:NOTE: Huni Skeleton으로 마이그레이션 (SPEC-SKIN-002)
const ListSkeleton = () => (
  <div className="orders__skeleton">
    {Array(4)
      .fill(null)
      .map((_, idx) => (
        <Skeleton key={idx} variant="card" className="h-20 w-full mb-3" />
      ))}
  </div>
);

const OrdersContent = () => {
  const { ordersWithAccumulation, totalOrdersCount } = useMyOrderStateContext();
  const { fetchOrders } = useMyOrderActionContext();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteScrollLoaderDisabled, setIsInfiniteScrollLoaderDisabled] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const { catchError } = useErrorBoundaryActionContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  useLayoutChanger({
    title: '주문/배송 목록',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
    hasBackBtnOnHeader: true,
  });

  const period = useMemo(
    () => ({
      startYmd: searchParams.get('startYmd') ?? '',
      endYmd: searchParams.get('endYmd') ?? '',
    }),
    [searchParams]
  );

  const ordersRequestOption = useMemo(
    () => ({
      pageSize: PAGE_SIZE,
      startYmd: period.startYmd,
      endYmd: period.endYmd,
    }),
    [period]
  );

  useEffect(() => {
    if (!ordersRequestOption?.startYmd) {
      return;
    }

    (async () => {
      try {
        await fetchOrders({ ...ordersRequestOption, pageNumber: 1 });
        setPageNumber(1);
        setIsInfiniteScrollLoaderDisabled(false);
        setIsLoading(false);
      } catch (e) {
        catchError(e);
      }
    })();
  }, [ordersRequestOption]);

  const handleIntersect = async () => {
    setIsInfiniteScrollLoaderDisabled(true);
    if (totalOrdersCount / ordersRequestOption.pageSize < pageNumber) return;

    try {
      await fetchOrders({ ...ordersRequestOption, pageNumber: pageNumber + 1 });
    } catch (error) {
      catchError(error);
    }
    setPageNumber((pageNumber) => pageNumber + 1);
    setIsInfiniteScrollLoaderDisabled(false);
  };

  if (ordersWithAccumulation?.length === 0) {
    return (
      <div className="orders">
        <StartYmdSelector initialOffsetOption="7d" />
        <p className="orders__no-data">주문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <StartYmdSelector initialOffsetOption="7d" />
      <VisibleComponent
        shows={!isLoading}
        FalsyComponent={<ListSkeleton />}
        TruthyComponent={
          <>
            {ordersWithAccumulation?.map(({ firstOrderAmt, orderOptions, orderNo, orderYmdt }) => {
              const orderYmd = orderYmdt.slice(0, 10);
              const orderTitle =
                orderOptions[0].productName + (orderOptions.length > 1 ? ` 외 ${orderOptions.length - 1}건` : '');

              const imageUrl =
                orderOptions[0].listImageUrlInfo?.url ||
                orderOptions[0].imageUrlInfo?.[0]?.url ||
                orderOptions[0].imageUrl;
              const imageUrlType =
                orderOptions[0].listImageUrlInfo?.imageUrlType || orderOptions[0].imageUrlInfo?.[0]?.imageUrlType;

              return (
                <OrderSummary
                  key={orderNo}
                  orderYmd={orderYmd}
                  orderTitle={orderTitle}
                  imageUrl={imageUrl}
                  imageUrlType={imageUrlType}
                  orderNo={orderNo}
                  totalProductAmt={firstOrderAmt.totalProductAmt}
                  redirectUrl={`/orders/${orderNo}`}
                  currencyLabel={currencyLabel}
                />
              );
            })}
            <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollLoaderDisabled} />
          </>
        }
      />
    </div>
  );
};

const Orders = () => (
  <MyOrderProvider willOrdersBeAccumulated={true}>
    <OrdersContent />
  </MyOrderProvider>
);

export default Orders;
