import { ThumbList, VisibleComponent, useMyOrderStateContext, useCurrencyStateContext } from '@shopby/react-components';
import { sortWithPriority, unescapeHTML } from '@shopby/shared';

import ProductThumbItem from '../../components/ProductThumbItem';

import NextActionButton from './NextActionButton';

// 노출하지 않을 nextActions
const NEXT_ACTIONS_TO_BE_NOT_RENDERED_IN_BUTTON_GROUP = [
  'CANCEL_ALL',
  'VIEW_DELIVERY',
  'VIEW_CLAIM',
  'DELIVERY_DONE',
  'CHANGE_ADDRESS',
  'ISSUE_CASH_RECEIPT',
  'VIEW_RECEIPT',
];

// 하기 array의 순서대로 우선 노출됩니다.
// array에 넣지 않은 값은 우선 노출된 버튼 뒤에 임의 순서로 노출됩니다.
const NEXT_ACTIONS_WITH_PRIORITY = [
  'CANCEL',
  'RETURN',
  'EXCHANGE',
  'WITHDRAW_CANCEL',
  'WITHDRAW_EXCHANGE',
  'WITHDRAW_RETURN',
  'CONFIRM_ORDER',
  'WRITE_REVIEW',
];

const OrderDetailProductTable = () => {
  const { flattenedOrderOptions, orderDetail } = useMyOrderStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  return (
    <section className="order-detail__product-table l-panel">
      <ThumbList>
        {flattenedOrderOptions.map(
          ({
            imageUrl,
            imageUrlInfo,
            listImageUrlInfo,
            brandName,
            productName,
            unescapedProductName,
            orderCnt,
            price: { buyAmt },
            optionName,
            optionValue,
            inputs,
            optionNo,
            productNo,
            nextActions,
            claimStatusTypeLabel,
            orderStatusType,
            orderStatusTypeLabel,
            orderNo,
            orderOptionNo,
            deliveryCompanyTypeLabel,
            invoiceNo,
            deliverable,
            claimStatusType,
            delivery,
            optionUsed,
            baseProductName,
            baseProductNo,
            isExtraProduct,
          }) => (
            <div key={optionNo} className="order-detail__product">
              <p className="order-detail__product-top-label">
                <span className="order-detail__status-label">{claimStatusTypeLabel || orderStatusTypeLabel}</span>
                {(() => {
                  const actionOfViewDelivery = nextActions.find(
                    ({ nextActionType }) => nextActionType === 'VIEW_DELIVERY'
                  );
                  if (actionOfViewDelivery) {
                    return (
                      <span className="order-detail__delivery-info">
                        <VisibleComponent
                          shows={delivery.deliveryType === 'DIRECT_DELIVERY'}
                          TruthyComponent={<span>직접배송</span>}
                          FalsyComponent={<span>{`${deliveryCompanyTypeLabel} ${invoiceNo}`}</span>}
                        />
                        <NextActionButton
                          productNo={productNo}
                          optionNo={optionNo}
                          orderOptionNo={orderOptionNo}
                          nextActionType={'VIEW_DELIVERY'}
                          trackingDeliveryUri={actionOfViewDelivery.uri}
                          pgType={orderDetail?.payType}
                          payType={orderDetail?.payType}
                          claimStatusType={claimStatusType}
                          orderStatusType={orderStatusType}
                          deliveryType={delivery.deliveryType}
                        />
                      </span>
                    );
                  }

                  return <></>;
                })()}
              </p>
              <ProductThumbItem
                productNo={productNo}
                imageUrl={listImageUrlInfo?.url || imageUrlInfo?.[0]?.url || imageUrl}
                imageUrlType={listImageUrlInfo?.imageUrlType || imageUrlInfo?.[0]?.imageUrlType}
                brandName={brandName ?? ''}
                productName={productName}
                unescapedProductName={unescapedProductName}
                orderCnt={orderCnt}
                buyAmt={buyAmt}
                optionName={optionName}
                optionValue={optionValue}
                optionInputs={inputs}
                optionUsed={optionUsed}
                currencyLabel={currencyLabel}
                resize={'84x84'}
                baseProductName={unescapeHTML(baseProductName)}
                baseProductNo={baseProductNo}
                isExtraProduct={isExtraProduct}
              />
              <VisibleComponent
                shows={nextActions.length}
                TruthyComponent={
                  <div className="order-detail__next-action-btns">
                    {sortWithPriority(nextActions, NEXT_ACTIONS_WITH_PRIORITY, 'nextActionType')
                      .filter(({ nextActionType }) => {
                        if (nextActionType === 'CANCEL' && orderDetail?.payType === 'ESCROW_VIRTUAL_ACCOUNT') {
                          return false;
                        }

                        if (nextActionType === 'CANCEL_ALL' && orderDetail?.payType.includes('ESCROW')) {
                          return true;
                        }

                        return !NEXT_ACTIONS_TO_BE_NOT_RENDERED_IN_BUTTON_GROUP.includes(nextActionType);
                      })
                      .map(({ nextActionType }) => (
                        <NextActionButton
                          key={nextActionType}
                          orderStatusType={orderStatusType}
                          nextActionType={nextActionType}
                          productNo={productNo}
                          productName={productName}
                          optionName={optionName}
                          optionValue={optionValue}
                          orderOptionNo={orderOptionNo}
                          orderNo={orderNo}
                          optionNo={optionNo}
                          productImageUrl={listImageUrlInfo?.url || imageUrlInfo?.[0]?.url || imageUrl}
                          deliverable={deliverable}
                          pgType={orderDetail?.payType}
                          claimStatusType={claimStatusType}
                          deliveryType={delivery.deliveryType}
                        />
                      ))}
                  </div>
                }
              />
            </div>
          )
        )}
      </ThumbList>
    </section>
  );
};

export default OrderDetailProductTable;
