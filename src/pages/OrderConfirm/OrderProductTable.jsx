import { ThumbList, Accordion, useOrderConfirmStateContext, useCurrencyStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency, unescapeHTML } from '@shopby/shared';

import ProductThumbItem from '../../components/ProductThumbItem';

const OrderProductTable = () => {
  const {
    flattenedOrderOptions,
    orderInfo: {
      lastOrderAmount: { chargeAmt },
    },
  } = useOrderConfirmStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  return (
    <section className="l-panel order-confirm__product-table">
      <Accordion
        isOpen={true}
        Title={
          <div className="order-confirm__product-table-tit">
            <span>주문내역</span>
            <div className="order-confirm__product-table-amt">
              <span>
                <em className="highlight bold">{flattenedOrderOptions.length}</em>개{' '}
              </span>
              <span>
                <em className="highlight bold">{convertToKoreanCurrency(chargeAmt)}</em>
                {currencyLabel}
              </span>
            </div>
          </div>
        }
      >
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
              buyAmt,
              optionName,
              optionValue,
              inputs,
              optionNo,
              productNo,
              optionUsed,
              baseProductName,
              baseProductNo,
              isExtraProduct,
            }) => (
              <ProductThumbItem
                productNo={productNo}
                key={optionNo}
                imageUrl={listImageUrlInfo?.url || imageUrlInfo?.[0]?.imageUrl || imageUrl}
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
                resize={'84x84'}
                baseProductName={unescapeHTML(baseProductName)}
                baseProductNo={baseProductNo}
                isExtraProduct={isExtraProduct}
              />
            )
          )}
        </ThumbList>
      </Accordion>
    </section>
  );
};

export default OrderProductTable;
