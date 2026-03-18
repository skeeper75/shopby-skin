import { createRef, lazy, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { func } from 'prop-types';

import {
  AppCard,
  Button,
  IconBtn,
  useAppCardActionContext,
  useModalActionContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  useProductOptionStateContextV2,
  VisibleComponent,
  useAuthStateContext,
  DEFAULT_ORDER_SHEET_PROVIDER_STATE,
  useProductDetailStateContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency, isSignedIn, parsePhoneNumber, PG_TYPES_MAP } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import { convertBooleanToYorN } from '../../../utils';
import TermsChecker from '../../OrderSheet/TermsChecker';

import useAppCardValidateForm from './useAppCardValidateForm';

const AppCardAuthenticateInOrder = lazy(() =>
  import('../../../components/AppCardAuthenticate/Order/AppCardAuthenticateInOrder')
);

// eslint-disable-next-line complexity
const OrderSheetAppCard = ({ onClose }) => {
  const orderSheetRef = {
    termsCheckerRef: createRef(),
  };

  const { totalPrice, quantities } = useProductOptionStateContextV2();
  const { setOrderResponse } = useAppCardActionContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { profile } = useAuthStateContext();

  const {
    orderSheetNo,
    ordererInfo,
    shippingAddressInfo,
    termsStatus,
    orderSheet,
    appCardInfo: selectedAppCardInfo,
  } = useOrderSheetStateContext();

  const { productDetail } = useProductDetailStateContext();

  const {
    order,
    fetchOrderSheet,
    updateShippingAddressInfo,
    resetShippingAddressInfo,
    updateSelectedAppCardPayment,
    updateOrdererInfo,
  } = useOrderSheetActionContext();
  const { defaultAddress } = useMyShippingAddressStateContext();
  const { fetchMyShippingAddress } = useMyShippingAddressActionContext();

  const { validateForm } = useAppCardValidateForm();

  const { catchError } = useErrorBoundaryActionContext();
  const [isAppCardAuthenticateFullModalOpen, setAppCardAuthenticateFullModalOpen] = useState(false);

  const hasDeliverableProduct = useMemo(
    () =>
      orderSheet?.deliveryGroups
        ?.map(({ orderProducts }) => orderProducts.some(({ deliverable }) => deliverable))
        .some((deliverable) => deliverable),
    [orderSheet]
  );

  const handleOrderAppCardBtnClick = async () => {
    const isValid = validateForm({
      shippingAddressInfo,
      termsStatus,
      appCardInfo: selectedAppCardInfo,
    });

    if (!isValid) return;

    try {
      const { customTermsAgrees, agreementTermsAgrees } = orderSheetRef.termsCheckerRef.current;

      await order({
        platform: isMobile ? 'MOBILE_WEB' : 'PC',
        confirmUrl: `${location.origin}/order/confirm?deliverable=${convertBooleanToYorN(hasDeliverableProduct)}`,
        customTermsAgrees,
        agreementTermsAgrees,
        updateMember: ordererInfo.updateMember,
        pgType: PG_TYPES_MAP.APP_CARD,
        payType: PG_TYPES_MAP.APP_CARD,
        successCallback: (result) => {
          const { pgType, extraData } = result;
          const isOneClickPayAppCard = extraData?.authYn === 'Y';

          if (pgType === PG_TYPES_MAP.APP_CARD && !isOneClickPayAppCard) {
            setOrderResponse(result);
            setAppCardAuthenticateFullModalOpen(true);
          }
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleClickAppCardPayment = (selectedAppCardPayment) => {
    updateSelectedAppCardPayment(selectedAppCardPayment);
  };

  const handleDeleteAppCardPayment = (deleteAppCardPaymentRequest) => {
    openConfirm({
      message: '카드를 삭제하시겠습니까?',
      confirmLabel: '삭제',
      onConfirm: async () => {
        await deleteAppCardPaymentRequest();

        openAlert({
          message: '카드가 삭제되었습니다.',
        });
      },
    });
  };

  useEffect(() => {
    resetShippingAddressInfo();

    if (defaultAddress) {
      const { receiverAddress, receiverContact1, receiverContact2, receiverDetailAddress, receiverZipCd } =
        defaultAddress ?? {};

      updateShippingAddressInfo({
        ...defaultAddress,
        roadAddress: receiverAddress,
        mobilePhoneNumber: parsePhoneNumber(receiverContact1),
        addressDetail: receiverDetailAddress,
        zipCode: receiverZipCd,
        ...(receiverContact2 && { phoneNumber: parsePhoneNumber(receiverContact2) }),
      });

      return;
    }

    if (profile) {
      const { memberName, address, detailAddress, mobileNo, zipCd, countryCd } = profile;

      updateShippingAddressInfo({
        receiverName: memberName,
        roadAddress: address,
        mobilePhoneNumber: parsePhoneNumber(mobileNo, { isWithDash: false }),
        addressDetail: detailAddress,
        zipCode: zipCd,
        countryCd,
      });
    }
  }, [defaultAddress?.addressNo, profile]);

  useEffect(() => {
    if (!profile) return;

    const { memberName, email, mobileNo } = profile;
    const [emailId = '', emailDomain = ''] = email?.split('@') ?? [];

    updateOrdererInfo({
      ordererName: memberName,
      emailId,
      emailDomain,
      phoneNumber: mobileNo
        ? parsePhoneNumber(mobileNo, { isWithDash: false })
        : DEFAULT_ORDER_SHEET_PROVIDER_STATE.ordererInfo.phoneNumber,
    });
  }, [profile]);

  useEffect(() => {
    if (!isSignedIn()) {
      openAlert({
        message: '앱카드 결제가 불가합니다. 다른 결제수단으로 다시 시도해 주세요.',
        onClose: () => {
          location.href = '/sign-in';
        },
      });

      return;
    }

    fetchOrderSheet({ orderSheetNo, includesMemberAddress: false });
    fetchMyShippingAddress();
  }, []);

  return (
    <>
      <div className="order-sheet-app-card">
        <IconBtn
          className="order-sheet-app-card__opener"
          iconType="angle-down"
          label="앱카드 결제 닫기"
          onClick={onClose}
        />
        <div className="order-sheet-app-card__contents">
          {/* 상품정보 */}
          <section className="order-product-section">
            <p className="order-product__name">{productDetail?.productName}</p>

            {quantities.map(({ controllerId, options, textOptions }) => (
              <VisibleComponent
                key={controllerId}
                shows={options?.length > 0}
                TruthyComponent={
                  <>
                    {options?.map(({ id: optionId, count, selectedValues = [], calcPrice = 0 }) => (
                      <div key={`order-product-${optionId}`} className="order-product__content">
                        <span className="order-product__option">{selectedValues.join(' | ')}</span>

                        {textOptions?.map(({ optionId: textOptionId, inputs }) => (
                          <VisibleComponent
                            key={`text-option-by-option-${textOptionId}`}
                            shows={optionId === textOptionId}
                            TruthyComponent={
                              <>
                                {inputs.map(({ inputs = [] }) =>
                                  inputs.map((input) => (
                                    <div className="order-product__option" key={`text-option-by-option-${input.id}`}>
                                      <span className="order-product__option-label">
                                        <span>
                                          {input.inputLabel} : {input.inputValue}
                                        </span>
                                      </span>
                                    </div>
                                  ))
                                )}
                              </>
                            }
                          />
                        ))}

                        <div>
                          <span className="order-product__count">
                            <em>{convertToKoreanCurrency(count)}</em>개
                          </span>
                          <span className="order-product__amount">
                            <em>{convertToKoreanCurrency(calcPrice)}</em>원
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                }
              />
            ))}
          </section>

          {/* 배송지 정보 */}
          <section className="shipping-address-section">
            <div className="shipping-address">
              <div className="shipping-address__order-info">
                <span className="shipping-address__orderer-name">{shippingAddressInfo.receiverName}</span>
                <span className="shipping-address__address-group">기본 배송지</span>
              </div>
              <p className="shipping-address__address">
                {shippingAddressInfo.roadAddress} {shippingAddressInfo.addressDetail}
              </p>
            </div>
          </section>

          {/* 앱카드 결제 카드 목록 */}
          <section className="app-card-payments-section">
            <AppCard
              paymentAmt={totalPrice}
              selectedAppCardInfo={selectedAppCardInfo}
              onClickAppCardPayment={handleClickAppCardPayment}
              onDeleteAppCardPayment={handleDeleteAppCardPayment}
            />
          </section>

          {/* 총 결제 금액 */}
          <section className="total-price-section">
            <div className="total-price__content">
              <span className="total-price__label">총 상품 금액</span>
              <em>
                <span className="highlight bold">{convertToKoreanCurrency(totalPrice)}</span>원
              </em>
            </div>
          </section>

          {/* 약관 */}
          <section>
            <TermsChecker ref={orderSheetRef.termsCheckerRef} />
          </section>

          {/* 결제하기 */}
          <Button
            className="btn btn--caution app-card-payments__pay-btn"
            label={'앱카드 결제'}
            onClick={handleOrderAppCardBtnClick}
          />
        </div>
      </div>
      {isAppCardAuthenticateFullModalOpen && (
        <AppCardAuthenticateInOrder onClose={() => setAppCardAuthenticateFullModalOpen(false)} />
      )}
    </>
  );
};

OrderSheetAppCard.propTypes = {
  onClose: func,
};

export default OrderSheetAppCard;
