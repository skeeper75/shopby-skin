import { useTranslation } from 'react-i18next';

import { Accordion, ThumbList, useOrderSheetStateContext, useCurrencyStateContext } from '@shopby/react-components';
import { unescapeHTML } from '@shopby/shared';

import ProductThumbItem from '../../components/ProductThumbItem';

const OrderProductTable = () => {
  const { t } = useTranslation(['common', 'order']);
  const { flattenedOrderProductOptions } = useOrderSheetStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  return (
    <section className="l-panel">
      <Accordion className="order-sheet__product-table" title={t('orderProduct', { ns: 'order' })} isOpen={true}>
        <ThumbList>
          {flattenedOrderProductOptions.map(
            (
              {
                imageUrl,
                imageUrlType,
                brandName,
                unescapedProductName,
                orderCnt,
                optionName,
                optionValue,
                optionInputs,
                price,
                productNo,
                optionUsed,
                baseProductName,
                baseProductNo,
                isExtraProduct,
              },
              idx
            ) => (
              <ProductThumbItem
                productNo={productNo}
                key={idx}
                imageUrl={imageUrl}
                imageUrlType={imageUrlType}
                brandName={brandName}
                productName={unescapedProductName}
                orderCnt={orderCnt}
                buyAmt={price.buyAmt}
                optionName={optionName}
                optionValue={optionValue}
                optionInputs={optionInputs}
                optionUsed={optionUsed}
                currencyLabel={currencyLabel}
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
