/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { bool, number, object, string, oneOf, array } from 'prop-types';

import {
  IconSVG,
  ThumbItem,
  ThumbList,
  LikeBtn,
  OptionProvider,
  useOptionActionContext,
  useModalActionContext,
  useCartActionContext,
  ProductOptionProvider,
  useAuthStateContext,
} from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../ErrorBoundary';
import ProductThumbBadge from '../../ProductThumbBadge';
import ProductThumbInfo from '../../ProductThumbInfo';

const LikeAddCart = ({ productNo, isSoldOut, liked }) => {
  const [searchParams] = useSearchParams();
  const { fetchProductOption } = useOptionActionContext();
  const { addCart } = useCartActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const { profile } = useAuthStateContext();

  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const handleCartBtnClick = async () => {
    try {
      const {
        data: { type, flatOptions },
      } = await fetchProductOption({ productNo });

      if (type !== 'DEFAULT') {
        openAlert({
          label: '확인',
          Content: (
            <>
              이 상품은 옵션이 있는 상품입니다. <br /> 상품상세에서 옵션을 선택 후 <br /> 장바구니에 담아주세요
            </>
          ),
          onClose: () => navigate(`/product-detail?productNo=${productNo}`),
        });

        return;
      }

      await addCart(
        [
          {
            orderCnt: 1,
            channelType: searchParams.get('channelType'),
            optionInputs: [],
            optionNo: flatOptions[0].optionNo,
            productNo,
          },
        ],
        profile?.memberStatus
      );

      openConfirm({
        message: '장바구니에 담았습니다.',
        onConfirm: () => navigate('/cart'),
        confirmLabel: '장바구니 가기',
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    setIsActive(liked);
  }, [liked]);

  return (
    <>
      <LikeBtn
        className="thumb-fab thumb-fab--like"
        productNo={Number(productNo)}
        isActive={isActive}
        onClick={(data) => {
          setIsActive(data.isActive);
        }}
      >
        <IconSVG fill={isActive ? '#f92626' : '#fff'} strokeWidth={0} size={40} name="fill-heart" />
      </LikeBtn>

      <button
        type="button"
        disabled={isSoldOut}
        shopby-script-action="ADD_TO_CART"
        shopby-product-no={productNo}
        className="thumb-fab thumb-fab--cart sc-cart-button"
        onClick={handleCartBtnClick}
      >
        <IconSVG size={40} name="shopping-bag" />
      </button>
    </>
  );
};

const ProductThumbInfoBySimpleType = ({
  platformType,
  promotionText,
  productNo,
  productName,
  salePrice,
  immediateDiscountAmt,
  additionDiscountAmt,
  isSoldOut,
  saleStatusType,
}) =>
  platformType === 'PC' && (
    <>
      <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
      <Link to={`/product-detail?productNo=${productNo}`}>
        <ProductThumbInfo
          promotionText={promotionText}
          productName={productName}
          salePrice={calculateDiscountedPrice({
            salePrice,
            immediateDiscountAmt,
            additionDiscountAmt,
          })}
        />
      </Link>
    </>
  );
const ProductGrid = ({ className, style, displayType, products, platformType }) => (
  <ThumbList style={style} displayType={displayType} className={className}>
    {products.map(
      ({
        productNo,
        adult,
        listImageUrlInfo,
        isSoldOut,
        saleStatusType,
        salePrice,
        promotionText,
        productName,
        unescapedProductName,
        immediateDiscountAmt,
        additionDiscountAmt,
        frontDisplayYn,
        liked,
        imageUrlInfo,
        imageUrls,
      }) =>
        frontDisplayYn && (
          <ThumbItem
            key={productNo}
            productNo={productNo}
            resize="220x220"
            className={className}
            href={`/product-detail?productNo=${productNo}`}
            src={listImageUrlInfo?.[0].url || imageUrlInfo?.[0]?.url || imageUrls?.[0]}
            imageUrlType={listImageUrlInfo?.[0]?.imageUrlType}
            adult={adult}
            alt={productName}
            HoverViewComponent={
              <ProductOptionProvider>
                <OptionProvider>
                  {displayType === THUMB_LIST_TYPE.CART && (
                    <LikeAddCart
                      productNo={Number(productNo)}
                      productName={productName}
                      isSoldOut={isSoldOut}
                      liked={liked}
                    />
                  )}
                </OptionProvider>
              </ProductOptionProvider>
            }
          >
            {displayType === THUMB_LIST_TYPE.SIMPLE_IMAGE ? (
              <ProductThumbInfoBySimpleType
                platformType={platformType}
                promotionText={promotionText}
                productNo={productNo}
                productName={unescapedProductName}
                salePrice={salePrice}
                immediateDiscountAmt={immediateDiscountAmt}
                additionDiscountAmt={additionDiscountAmt}
                isSoldOut={isSoldOut}
                saleStatusType={saleStatusType}
              />
            ) : (
              <>
                <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
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
              </>
            )}
          </ThumbItem>
        )
    )}
  </ThumbList>
);

export default ProductGrid;

ProductGrid.propTypes = {
  style: object,
  className: string,
  products: array,
  displayType: oneOf(['SWIPE', 'GALLERY', 'LIST', 'PRODUCT_MOVE', 'SIMPLE_IMAGE', 'CART']),
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
};

LikeAddCart.propTypes = {
  productNo: number,
  isSoldOut: bool,
  liked: bool,
  productName: string,
};

ProductThumbInfoBySimpleType.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
  promotionText: string,
  productName: string,
  salePrice: number,
  productNo: number,
  immediateDiscountAmt: number,
  additionDiscountAmt: number,
  isSoldOut: bool,
  saleStatusType: oneOf(['READY', 'ONSALE', 'FINISHED', 'STOP', 'PROHIBITION']),
};
