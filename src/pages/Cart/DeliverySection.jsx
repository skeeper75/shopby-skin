import { useMemo } from 'react';

import {
  Checkbox,
  ThumbList,
  QuantityChanger,
  useCartActionContext,
  useCartStateContext,
  useModalActionContext,
  useCurrencyStateContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency, unescapeHTML } from '@shopby/shared';

import OptionLabel from '../../components/OptionLabel';
import ProductThumbItem from '../../components/ProductThumbItem';

const DeliverySection = () => {
  const { openConfirm, openAlert } = useModalActionContext();
  const { updateIsDeliveryGroupChecked, updateIsCartNoChecked, deleteCartNos, modifyCart, getDeletableRequiredOption } =
    useCartActionContext();
  const { cartDetail, checkingStatusPerDeliveryGroup, checkingStatusPerCartNo } = useCartStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const handleDeliveryGroupCheckboxChange = ({ currentTarget: { checked: isChecked } }, deliveryGroupIdx) => {
    updateIsDeliveryGroupChecked({ deliveryGroupIdx, isChecked });
  };

  const handleCartNoCheckBoxChange = ({ currentTarget: { checked: isChecked } }, cartNo) => {
    updateIsCartNoChecked({ cartNo, isChecked });
  };

  const handleDeleteBtnClick = (cartNo) => {
    const { data } = getDeletableRequiredOption();

    if (!data) {
      openAlert({
        message:
          '선택옵션은 단독 주문이 불가합니다. 필수옵션 취소 필요 시 선택옵션을 먼저 취소해주시거나, 함께 취소해주세요.',
      });

      return;
    }

    openConfirm({
      message: '해당 상품을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      onConfirm: () => {
        deleteCartNos([cartNo]);
      },
    });
  };

  const handleQuantityChange = ({ orderCnt, cartNo, optionInputs }) => {
    modifyCart([{ orderCnt, cartNo, optionInputs }]);
  };

  const itemsForRender = useMemo(
    () => [
      ...(cartDetail?.deliveryGroups ?? []),
      ...(cartDetail?.invalidProducts.length
        ? [
            {
              // 구매 제한 상품을 deliveryGroupIdx === -1 으로 취급하면 CartProvider와 연동이 가능해집니다.
              partnerName: '구매 제한 상품',
              orderProducts: cartDetail.invalidProducts,
              isInvalidProduct: true,
            },
          ]
        : []),
    ],
    [cartDetail]
  );

  if (!cartDetail) return <></>;
  if (!cartDetail.deliveryGroups.length && !cartDetail.invalidProducts.length) {
    return <p className="cart__empty">장바구니에 담긴 상품이 없습니다.</p>;
  }

  return (
    <>
      {itemsForRender.map(({ partnerName, orderProducts, isInvalidProduct }, deliveryGroupIdx) => (
        <section className="l-panel cart__delivery-section" key={deliveryGroupIdx}>
          <p className="cart__check-all-btn cart__check-all-btn--delivery-group">
            <Checkbox
              label={partnerName}
              isRounded={true}
              checked={checkingStatusPerDeliveryGroup[isInvalidProduct ? -1 : deliveryGroupIdx] ?? false}
              onChange={(e) => handleDeliveryGroupCheckboxChange(e, isInvalidProduct ? -1 : deliveryGroupIdx)}
              // 구매 제한 상품을 deliveryGroupIdx === -1 으로 취급하면 CartProvider와 연동이 가능해집니다.
            />
          </p>
          {orderProducts
            .flatMap(({ orderProductOptions, brandName, imageUrl, unescapedProductName, optionUsed, imageUrlType }) =>
              orderProductOptions.map((orderProductOption) => ({
                ...orderProductOption,
                brandName,
                imageUrl,
                unescapedProductName,
                optionUsed,
                imageUrlType,
              }))
            )
            .map(
              ({
                brandName,
                imageUrl,
                cartNo,
                orderCnt,
                unescapedProductName,
                optionUsed,
                optionName,
                optionValue,
                price,
                optionInputs,
                stockCnt,
                productNo,
                imageUrlType,
                isExtraProduct,
                baseProductNo,
                baseProductName,
              }) => (
                <div className="cart__product" key={cartNo}>
                  <Checkbox
                    isRounded={true}
                    checked={checkingStatusPerCartNo[cartNo] ?? false}
                    onChange={(e) => handleCartNoCheckBoxChange(e, cartNo)}
                  />
                  <div className="cart__product-detail">
                    <ThumbList>
                      <ProductThumbItem
                        imageUrl={imageUrl}
                        imageUrlType={imageUrlType}
                        brandName={brandName}
                        productName={unescapedProductName}
                        productNo={productNo}
                        optionUsed={optionUsed}
                        resize={'84x84'}
                        baseProductName={unescapeHTML(baseProductName)}
                        isExtraProduct={isExtraProduct}
                        baseProductNo={baseProductNo}
                      />
                    </ThumbList>

                    <div className="cart__quantity-controller">
                      {optionUsed && (
                        <>
                          <div className="cart__product-option">
                            <OptionLabel
                              optionName={optionName}
                              optionValue={optionValue}
                              optionInputs={optionInputs}
                            />
                            {/* 인쇄 옵션 상세 표시 */}
                            {optionInputs?.length > 0 && (
                              <dl className="mt-1 space-y-0.5">
                                {optionInputs.map(({ inputLabel, inputValue }, idx) => (
                                  <div key={idx} className="flex gap-1 text-xs text-[#979797] tracking-[-0.05em]">
                                    <dt className="shrink-0">{inputLabel}:</dt>
                                    <dd className="text-[#424242]">{inputValue}</dd>
                                  </div>
                                ))}
                              </dl>
                            )}
                            <button className="cart__delete-btn" onClick={() => handleDeleteBtnClick(cartNo)}></button>
                          </div>
                        </>
                      )}

                      <p>
                        <QuantityChanger
                          initialValue={orderCnt}
                          onChange={(cnt) => handleQuantityChange({ orderCnt: cnt, cartNo, optionInputs })}
                          max={stockCnt}
                          min={1}
                          disabled={isInvalidProduct}
                        />

                        <span className="cart__product-price">
                          <span>
                            <span className="bold">
                              {isInvalidProduct ? '- ' : convertToKoreanCurrency(price.buyAmt)}
                            </span>
                            {currencyLabel}
                          </span>
                          {!optionUsed && (
                            <button className="cart__delete-btn" onClick={() => handleDeleteBtnClick(cartNo)} />
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
        </section>
      ))}
    </>
  );
};

export default DeliverySection;
