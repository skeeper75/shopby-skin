import { Link } from 'react-router-dom';

import { bool, string, oneOf, number, array, object } from 'prop-types';

import { Slide, Slider, ThumbItem } from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import ProductThumbBadge from '../../ProductThumbBadge';
import ProductThumbInfo from '../../ProductThumbInfo';

const ProductSliderSection = ({
  displayType,
  navigation = false,
  className,
  slidesPerView = 'auto',
  spaceBetween,
  products,
  sliderOption = {},
}) => (
  <div className={className}>
    <Slider navigation={navigation} slidesPerView={slidesPerView} spaceBetween={spaceBetween} {...sliderOption}>
      {products.map(
        ({
          frontDisplayYn,
          productNo,
          listImageUrlInfo,
          adult,
          productName,
          unescapedProductName,
          isSoldOut,
          saleStatusType,
          promotionText,
          salePrice,
          immediateDiscountAmt,
          additionDiscountAmt,
          imageUrlInfo,
          imageUrls,
        }) =>
          frontDisplayYn && (
            <Slide key={productNo}>
              <ThumbItem
                productNo={productNo}
                resize="220x220"
                href={`/product-detail?productNo=${productNo}`}
                src={listImageUrlInfo?.[0]?.url || imageUrlInfo?.[0]?.url || imageUrls?.[0]}
                imageUrlType={listImageUrlInfo?.[0]?.imageUrlType}
                adult={adult}
                alt={productName}
              >
                <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
                {displayType === THUMB_LIST_TYPE.SIMPLE_IMAGE ? (
                  <Link to={`/product-detail?productNo=${productNo}`}>
                    <ProductThumbInfo
                      promotionText={promotionText}
                      productName={unescapedProductName}
                      salePrice={calculateDiscountedPrice({
                        salePrice,
                        immediateDiscountAmt,
                        additionDiscountAmt,
                      })}
                    />
                  </Link>
                ) : (
                  <Link to={`/product-detail?productNo=${productNo}`}>
                    <ProductThumbInfo
                      promotionText={promotionText}
                      productName={unescapedProductName}
                      salePrice={calculateDiscountedPrice({
                        salePrice,
                        immediateDiscountAmt,
                        additionDiscountAmt,
                      })}
                    />
                  </Link>
                )}
              </ThumbItem>
            </Slide>
          )
      )}
    </Slider>
  </div>
);

export default ProductSliderSection;

ProductSliderSection.propTypes = {
  navigation: bool,
  className: string,
  slidesPerView: oneOf([number, 'auto']),
  spaceBetween: number,
  products: array,
  displayType: oneOf(['SWIPE', 'GALLERY', 'LIST', 'PRODUCT_MOVE', 'SIMPLE_IMAGE', 'CART']),
  sliderOption: object,
};
