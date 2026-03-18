import { number, string } from 'prop-types';

import { useCurrencyStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency, unescapeHTML } from '@shopby/shared';

import Sanitized from '../Sanitized';

// ===========================
// 상품 아이템 정보
// ===========================
const ProductThumbInfo = ({ promotionText, productName, salePrice }) => {
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();
  return (
    <>
      <p className="product-thumb-title">
        {unescapeHTML(promotionText)}
        <Sanitized html={productName} className={'product-thumb-title-product-name'} />
      </p>
      <p className="product-thumb-price-info">
        <span>
          <em className="product-thumb-price">{convertToKoreanCurrency(salePrice)}</em>
          <span className="product-thumb-unit">{currencyLabel}</span>
        </span>
      </p>
    </>
  );
};

export default ProductThumbInfo;

ProductThumbInfo.propTypes = {
  promotionText: string,
  productName: string,
  salePrice: number,
};
