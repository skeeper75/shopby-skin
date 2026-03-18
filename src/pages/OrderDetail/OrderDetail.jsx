import { Fragment, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageShell } from '../../components/Layout';

import {
  MyOrderProvider,
  useMyOrderStateContext,
  useMyOrderActionContext,
  ClaimProvider,
  Button,
  NextActionProvider,
  CashReceiptProvider,
  useOrderConfigStateContext,
  useCurrencyStateContext,
} from '@shopby/react-components';
import { PAY_TYPE_MAP } from '@shopby/shared';

import CashReceiptInfo from '../../components/CashReceiptInfo';
import OrderDetailAddressInfo from '../../components/OrderDetailAddressInfo';
import OrderDetailOrdererInfo from '../../components/OrderDetailOrdererInfo';
import OrderDetailPaymentInfo from '../../components/OrderDetailPaymentInfo';
import OrderNoLabel from '../../components/OrderNoLabel';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import ClaimDetailAdditionalPayInfo from './ClaimDetailAdditionalPayInfo';
import ClaimDetailCollectionInfo from './ClaimDetailCollectionInfo';
import ClaimDetailExchangeDeliveryInfo from './ClaimDetailExchangeDeliveryInfo';
import ClaimDetailRefundInfo from './ClaimDetailRefundInfo';
import NextActionButton from './NextActionButton';
import OrderDetailProductTable from './OrderDetailProductTable';
import ReceiptInfo from './ReceiptInfo';

/* eslint-disable complexity */
const OrderDetailContent = () => {
  const navigate = useNavigate();
  const { orderConfig } = useOrderConfigStateContext();
  const { orderDetail, flattenedOrderOptions } = useMyOrderStateContext();
  const { fetchOrderDetail } = useMyOrderActionContext();
  const { orderNo } = useParams();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();
  const {
    deliveryAmt,
    remoteDeliveryAmt,
    cartCouponDiscountAmt,
    productCouponDiscountAmt,
    additionalDiscountAmt,
    immediateDiscountAmt,
    standardAmt,
  } = useMemo(() => orderDetail?.lastOrderAmount ?? {}, [orderDetail?.lastOrderAmount]);
  const totalDeliveryAmt = useMemo(() => deliveryAmt + remoteDeliveryAmt, [deliveryAmt, remoteDeliveryAmt]);
  const totalDiscountAmt = useMemo(
    () => cartCouponDiscountAmt + productCouponDiscountAmt + additionalDiscountAmt + immediateDiscountAmt,
    [cartCouponDiscountAmt, productCouponDiscountAmt, additionalDiscountAmt, immediateDiscountAmt]
  );

  useLayoutChanger({
    title: '주문/배송 상세',
    hasBackBtnOnHeader: true,
  });

  useEffect(() => {
    fetchOrderDetail(orderNo);
  }, []);

  useEffect(() => {
    if (!orderDetail) return;

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      order: orderDetail,
    });
  }, [orderDetail]);

  const handleListBtnClick = () => {
    navigate('/orders');
  };

  const canCancelAll = useMemo(
    () =>
      orderDetail?.nextActions.find(({ nextActionType }) => nextActionType === 'CANCEL_ALL') &&
      flattenedOrderOptions.every(({ orderStatusType }) => orderStatusType === 'DEPOSIT_WAIT'),
    [orderDetail]
  );

  const hasDeliverableProduct = useMemo(
    () => flattenedOrderOptions?.some(({ deliverable }) => deliverable),
    [flattenedOrderOptions]
  );

  return (
    <div className="order-detail">
      <OrderNoLabel dateLabel={orderDetail?.orderYmdt.slice(0, 10) ?? ''} orderNo={orderNo}>
        {canCancelAll && (
          <NextActionButton
            className="order-detail__cancel-all-btn"
            orderNo={orderNo}
            nextActionType={'CANCEL_ALL'}
            flattenedOrderOptions={flattenedOrderOptions}
            pgType={orderDetail?.pgType}
            payType={orderDetail?.payType}
          />
        )}
      </OrderNoLabel>
      <OrderDetailProductTable />
      <OrderDetailOrdererInfo
        ordererName={orderDetail?.orderer.ordererName ?? ''}
        ordererEmail={orderDetail?.orderer.ordererEmail ?? ''}
        ordererMobilePhoneNumber={orderDetail?.orderer.ordererContact1 ?? ''}
      />
      {hasDeliverableProduct && (
        <OrderDetailAddressInfo
          receiverName={orderDetail?.shippingAddress.receiverName ?? ''}
          receiverZipCd={orderDetail?.shippingAddress.receiverZipCd ?? ''}
          receiverAddress={orderDetail?.shippingAddress.receiverAddress ?? ''}
          receiverDetailAddress={orderDetail?.shippingAddress.receiverDetailAddress ?? ''}
          receiverMobilePhoneNumber={orderDetail?.shippingAddress.receiverContact1 ?? ''}
          receiverPhoneNumber={orderDetail?.shippingAddress.receiverContact2 ?? ''}
          deliveryMemo={orderDetail?.deliveryMemo ?? ''}
        />
      )}
      <OrderDetailPaymentInfo
        payType={orderDetail?.payType}
        payTypeLabel={orderDetail?.payTypeLabel}
        bankName={orderDetail?.payInfo.bankInfo?.bankName}
        bankAccount={orderDetail?.payInfo.bankInfo?.account}
        bankDepositorName={orderDetail?.payInfo.bankInfo?.depositorName}
        bankAmt={orderDetail?.payInfo.bankInfo?.bankAmt}
        remitterName={orderDetail?.payInfo.bankInfo?.remitterName}
        paymentExpirationYmdt={orderDetail?.payInfo.bankInfo?.paymentExpirationYmdt}
        totalStandardAmt={standardAmt}
        totalDeliveryAmt={totalDeliveryAmt}
        totalDiscountAmt={totalDiscountAmt}
        subPayAmt={orderDetail?.lastOrderAmount.subPayAmt}
        chargeAmt={orderDetail?.lastOrderAmount.chargeAmt}
        accumulationAmtWhenBuyConfirm={orderDetail?.accumulationAmtWhenBuyConfirm}
        cardInfo={orderDetail?.payInfo?.cardInfo}
        currencyLabel={currencyLabel}
      />

      <ReceiptInfo
        orderNo={orderNo}
        payType={orderDetail?.payType}
        receiptInfos={orderDetail?.receiptInfos}
        visibleReceiptBtn={orderConfig?.visibleReceiptBtn}
        viewShopSpecification={orderConfig?.viewShopSpecification}
        useSimpleReceipt={orderConfig?.useSimpleReceipt}
        usePaymentReceipt={orderConfig?.usePaymentReceipt}
        shopSpecificationFields={orderConfig?.shopSpecificationFields}
        defaultOrderStatusType={orderDetail?.defaultOrderStatusType}
      />

      {orderDetail && (
        <CashReceiptInfo
          cashReceiptInfo={orderDetail.cashReceiptInfo}
          payInfo={orderDetail.payInfo}
          useCashReceipt={orderConfig.cashReceipt}
          receiptInfos={orderDetail.receiptInfos}
          orderNo={orderNo}
        />
      )}

      {orderDetail?.additionalPayInfos?.map(
        ({
          claimNo,
          exchangeOrderOption,
          productAmtInfo: { totalAmt: productTotalAmt },
          deliveryAmtInfo: { totalAmt: deliveryTotalAmt },
          exchangePayAmt,
          subtractionAmtInfo: { totalAmt: subtractionTotalAmt },
          payType,
          returnWayType,
          returnAddress,
          exchangeAddress,
          claimImageUrls,
        }) => (
          <Fragment key={claimNo}>
            <ClaimDetailAdditionalPayInfo
              exchangeOrderOption={exchangeOrderOption}
              exchangeProductTotalAmt={productTotalAmt}
              exchangeDeliveryAmt={deliveryTotalAmt}
              exchangePayAmt={exchangePayAmt}
              subtractionTotalAmt={subtractionTotalAmt}
              payTypeLabel={PAY_TYPE_MAP[payType]}
            />
            {returnAddress && (
              <ClaimDetailCollectionInfo
                returnWay={returnWayType}
                returnerName={returnAddress.name}
                returnerMobilePhoneNumber={returnAddress.contact1}
                returnerPhoneNumber={returnAddress.contact2}
                returnNote={returnAddress.note}
                returnAddress={returnAddress.addressStr}
                claimImageUrls={claimImageUrls}
              />
            )}
            {exchangeAddress && (
              <ClaimDetailExchangeDeliveryInfo
                exchangeOrderOption={exchangeOrderOption}
                receiverName={exchangeAddress.name}
                receiverAddress={exchangeAddress.addressStr}
                receiverMobilePhoneNumber={exchangeAddress.contact1}
                deliveryMemo={exchangeAddress.note}
                customsId={exchangeAddress.customsIdNumber}
              />
            )}
          </Fragment>
        )
      )}
      {orderDetail?.refundInfos?.map(
        ({
          claimNo,
          refundType,
          returnWayType,
          returnAddress,
          exchangeAddress,
          refundOrderOptions,
          productAmtInfo: { totalAmt: productTotalAmt },
          deliveryAmtInfo: { totalAmt: deliveryTotalAmt },
          subtractionAmtInfo: { totalAmt: subtractionTotalAmt },
          refundSubPayAmt,
          refundMainPayAmt,
          refundTypeLabel,
          exchangeOrderOption,
          claimImageUrls,
        }) => (
          <Fragment key={claimNo}>
            {refundType !== 'ZERO_REFUND' && (
              <ClaimDetailRefundInfo
                refundOrderOptions={refundOrderOptions}
                refundProductTotalAmt={productTotalAmt}
                refundDeliveryAmt={deliveryTotalAmt}
                subtractionTotalAmt={subtractionTotalAmt}
                refundSubPayAmt={refundSubPayAmt}
                refundMainPayAmt={refundMainPayAmt}
                refundTypeLabel={refundTypeLabel}
                cardInfo={orderDetail?.payInfo?.cardInfo}
                payType={orderDetail?.payType}
              />
            )}
            {returnAddress && (
              <ClaimDetailCollectionInfo
                returnWay={returnWayType}
                returnerName={returnAddress.name}
                returnerMobilePhoneNumber={returnAddress.contact1}
                returnerPhoneNumber={returnAddress.contact2}
                returnNote={returnAddress.note}
                returnAddress={returnAddress.addressStr}
                claimImageUrls={claimImageUrls}
              />
            )}
            {exchangeAddress && (
              <ClaimDetailExchangeDeliveryInfo
                exchangeOrderOption={exchangeOrderOption}
                receiverName={exchangeAddress.name}
                receiverAddress={exchangeAddress.addressStr}
                receiverMobilePhoneNumber={exchangeAddress.contact1}
                deliveryMemo={exchangeAddress.note}
                customsId={exchangeAddress.customsIdNumber}
              />
            )}
          </Fragment>
        )
      )}

      <section className="order-detail__list-btn-wrap">
        <Button onClick={handleListBtnClick}>목록 보기</Button>
      </section>
    </div>
  );
};

const OrderDetail = () => (
  <PageShell maxWidth="5xl">
    <ClaimProvider>
      <MyOrderProvider>
        <NextActionProvider>
          <CashReceiptProvider>
            <OrderDetailContent />
          </CashReceiptProvider>
        </NextActionProvider>
      </MyOrderProvider>
    </ClaimProvider>
  </PageShell>
);

export default OrderDetail;
