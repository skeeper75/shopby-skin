import { string, number, arrayOf, shape, bool, func } from 'prop-types';

import { QuantityChanger, ThumbItem, VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency, unescapeHTML } from '@shopby/shared';

import OptionLabel from '../OptionLabel';
import Sanitized from '../Sanitized';

const ProductThumbItem = ({
  productNo = 0,
  imageUrl = '',
  imageUrlType = 'IMAGE_URL',
  brandName = '',
  productName = '',
  unescapedProductName = productName,
  orderCnt,
  buyAmt,
  optionName = '',
  optionValue = '',
  optionInputs = [],
  usesQuantityChanger,
  quantityChangerValue,
  onQuantityChange,
  frontDisplayYn = 'Y',
  OptionComponent = null,
  AmountComponent = null,
  isRedirectingDisabled = false,
  resize,
  activateProductDetailLink = true,
  optionUsed = true,
  currencyLabel = '원',
  baseProductName = '',
  unescapedBaseProductName = baseProductName,
  isExtraProduct = false,
  baseProductNo = 0,
}) => {
  if (!frontDisplayYn) return <></>;

  const targetProductNo = isExtraProduct && baseProductNo ? baseProductNo : productNo;

  return (
    <ThumbItem
      productNo={productNo}
      href={isRedirectingDisabled ? '#' : `/product-detail?productNo=${targetProductNo}`}
      src={imageUrl}
      imageUrlType={imageUrlType}
      className="product-thumb-item"
      alt={productName}
      resize={resize}
      activateProductDetailLink={activateProductDetailLink}
    >
      <VisibleComponent
        shows={brandName}
        TruthyComponent={<p className="product-thumb-item__brand">{unescapeHTML(brandName)}</p>}
      />
      <div>
        {isExtraProduct && unescapedBaseProductName && (
          <div className="product-thumb-item__base-product-name-wrapper">
            <span className="product-thumb-item__base-product-name-content">
              [본상품]{' '}
              <span className="product-thumb-item__base-product-name">
                <Sanitized html={unescapedBaseProductName} />
              </span>
            </span>
          </div>
        )}

        <div className={`product-thumb-item__name-wrapper${isExtraProduct ? '--inline' : ''}`}>
          {isExtraProduct && <span className="extra-product__sticker">추가</span>}
          <p className="product-thumb-item__name">
            <Sanitized html={unescapedProductName} />
          </p>
        </div>
        <VisibleComponent
          shows={optionUsed}
          TruthyComponent={
            <OptionLabel optionName={optionName} optionValue={optionValue} optionInputs={optionInputs} />
          }
        />
        {OptionComponent && <OptionComponent />}
      </div>
      <div className="product-thumb-item__amount-wrap">
        <ul className="product-thumb-item__amount">
          {orderCnt >= 0 && <li>{orderCnt}개 </li>}
          {buyAmt >= 0 && (
            <li>
              {convertToKoreanCurrency(buyAmt)}
              {currencyLabel}
            </li>
          )}
        </ul>
        {AmountComponent && <AmountComponent />}
        {usesQuantityChanger && <QuantityChanger value={quantityChangerValue} onChange={onQuantityChange} />}
      </div>
    </ThumbItem>
  );
};
export default ProductThumbItem;

ProductThumbItem.propTypes = {
  frontDisplayYn: bool,
  brandName: string,
  productName: string.isRequired,
  unescapedProductName: string,
  orderCnt: number,
  buyAmt: number,
  imageUrl: string,
  optionName: string,
  optionValue: string,
  optionInputs: arrayOf(
    shape({
      inputLabel: string,
      inputValue: string,
    })
  ),
  productNo: number,
  OptionComponent: func,
  AmountComponent: func,
  usesQuantityChanger: bool,
  quantityChangerValue: number,
  onQuantityChange: func,
  isRedirectingDisabled: bool,
  resize: string,
  imageUrlType: string,
  activateProductDetailLink: bool,
  optionUsed: bool,
  currencyLabel: string,
  baseProductName: string,
  unescapedBaseProductName: string,
  isExtraProduct: bool,
  baseProductNo: number,
};
