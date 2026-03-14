import {
  Slider,
  Slide,
  ThumbItem,
  useProductDetailStateContext,
  VisibleComponent,
  useCurrencyStateContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency, unescapeHTML } from '@shopby/shared';

import GallerySkeleton from '../../components/GallerySkeleton';
import Sanitized from '../../components/Sanitized';

const RelatedProduct = () => {
  const { relatedProducts, isLoading } = useProductDetailStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  if (isLoading) {
    return (
      <section className="l-panel related-product">
        <p className="related-product__title">관련상품</p>
        <div className="related-product__items">
          <GallerySkeleton isLoading={isLoading} rowCount={1} colCount={3} />
        </div>
      </section>
    );
  }

  return (
    <section className="l-panel related-product">
      <p className="related-product__title">관련상품</p>
      <div className="related-product__items">
        <Slider className="related-product__slider" slidesPerView="auto">
          {relatedProducts.map(
            ({ productNo, productName, discountedPrice, originalPrice, hasOnlyOriginalPrice, ...rest }) => (
              <Slide key={productNo} className="related-product__item">
                <ThumbItem
                  {...rest}
                  href={`/product-detail?productNo=${productNo}`}
                  productNo={productNo}
                  resize="220x220"
                >
                  <span className="related-product__product-name">
                    {<Sanitized html={unescapeHTML(productName)} className="related-product__product-name-wrapper" />}
                  </span>
                  <span className="related-product__price">
                    <strong>
                      {convertToKoreanCurrency(discountedPrice)}
                      {currencyLabel}
                    </strong>
                    <VisibleComponent
                      shows={!hasOnlyOriginalPrice}
                      TruthyComponent={
                        <span>
                          {convertToKoreanCurrency(originalPrice)}
                          {currencyLabel}
                        </span>
                      }
                    />
                  </span>
                </ThumbItem>
              </Slide>
            )
          )}
        </Slider>
      </div>
    </section>
  );
};

export default RelatedProduct;
