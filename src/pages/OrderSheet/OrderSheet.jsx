import { createRef, lazy, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';

import {
  Button,
  MyPayProvider,
  MyShippingAddressProvider,
  OrderSheetProvider,
  useAuthStateContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  DEFAULT_ORDER_SHEET_PROVIDER_STATE,
  useMallStateContext,
  useModalActionContext,
  Checkbox,
  VisibleComponent,
  CashReceiptProvider,
  useCashReceiptStateContext,
  MyOrderProvider,
  AppCardProvider,
  useAppCardActionContext,
  useOrderConfigStateContext,
} from '@shopby/react-components';
import { getPlatformByMobile, isSignedIn, parsePhoneNumber, PG_TYPES_MAP } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import PrintFileUpload from '../../components/PrintFileUpload/PrintFileUpload';
import { EXTERNAL_CUSTOM_ORDER_SHEET_TERMS } from '../../constants';
import useIslandShipping from '../../hooks/useIslandShipping';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { convertBooleanToYorN, getDefaultCountryCode } from '../../utils';

import CashReceipt from './CashReceipt';
import FreeGiftInfos from './FreeGiftInfos';
import OrdererInfoForm from './OrdererInfoForm';
import OrderProductTable from './OrderProductTable';
import PaymentInfo from './PaymentInfo';
import PayMethodSelector from './PayMethodSelector';
import PromotionController from './PromotionController';
import ShippingAddressInfoForm from './ShippingAddressInfoForm';
import TermsChecker from './TermsChecker';
import useValidateFormMaker from './useValidateFormMaker';

const AppCardAuthenticateInOrder = lazy(() =>
  import('../../components/AppCardAuthenticate/Order/AppCardAuthenticateInOrder')
);

const OrderSheetContent = () => {
  const { state } = useLocation();
  const [printFiles, setPrintFiles] = useState([]);
  const orderSheetRef = {
    ordererInfoFormRef: {
      ordererNameInputRef: createRef(),
      firstNameInputRef: createRef(),
      lastNameInputRef: createRef(),
      emailInputRef: createRef(),
      phoneNumberInputRef: createRef(),
      passwordInputRef: createRef(),
      passwordForConfirmationInputRef: createRef(),
    },
    shippingAddressInfoFormRef: {
      receiverNameInputRef: createRef(),
      addressFormRef: createRef(),
      globalAddressFormRef: createRef(),
      mobilePhoneNumberInputRef: createRef(),
      addressDetailInputRef: createRef(),
      receiverFirstNameInputRef: createRef(),
      receiverLastNameInputRef: createRef(),
      receiverExtraFirstNameInputRef: createRef(),
      receiverExtraLastNameInputRef: createRef(),
    },
    depositBankFormRef: {
      bankAccountSelectRef: createRef(),
      remitterNameInputRef: createRef(),
    },
    termsCheckerRef: createRef(),
  };
  const { orderSheetNo } = useParams();
  const { t } = useTranslation('title');
  const { profile } = useAuthStateContext();
  const { order, fetchOrderSheet, updateOrdererInfo, updateShippingAddressInfo, resetShippingAddressInfo } =
    useOrderSheetActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const {
    ordererInfo,
    shippingAddressInfo,
    termsStatus,
    orderSheet,
    needsDepositBankForm,
    bankAccountToDeposit,
    remitterName,
    selectedPayMethod,
    myPayInfo,
    accumulationInputValue,
    selectedCoupon,
    blockUseAccumulationWhenUseCoupon,
    paymentInfo: { minAccumulationLimit },
    appCardInfo,
    freeGiftInfos,
    selectedFreeGiftInfoMap,
    noSelectFreeGiftConditionIds,
  } = useOrderSheetStateContext();
  const { fetchMyShippingAddress } = useMyShippingAddressActionContext();
  const { defaultAddress } = useMyShippingAddressStateContext();
  const { validateForm } = useValidateFormMaker(orderSheetRef);
  const { openAlert } = useModalActionContext();
  const {
    accumulationConfig: { accumulationName },
    mallJoinConfig,
    exchangeRate,
    isGlobalForm,
  } = useMallStateContext();
  const { cashReceiptIssuePurposeType, cashReceiptKeyType, cashReceiptKey, applyCashReceipt } =
    useCashReceiptStateContext();
  const { orderConfig } = useOrderConfigStateContext();

  const { setOrderResponse } = useAppCardActionContext();
  const [isAppCardAuthenticateFullModalOpen, setAppCardAuthenticateFullModalOpen] = useState(false);

  const hasDeliverableProduct = useMemo(
    () =>
      orderSheet?.deliveryGroups
        ?.map(({ orderProducts }) => orderProducts.some(({ deliverable }) => deliverable))
        .some((deliverable) => deliverable),
    [orderSheet]
  );

  useLayoutChanger({ hasBackBtnOnHeader: true, title: t('orderSheet') });

  useEffect(() => {
    fetchOrderSheet({ orderSheetNo: orderSheetNo ?? state?.orderSheetNo, includesMemberAddress: true });

    if (isSignedIn()) {
      fetchMyShippingAddress();
    }
  }, []);

  useEffect(() => {
    if (!orderSheet) return;

    const { ordererContact } = orderSheet;
    const mobileNo = (ordererContact?.ordererContact1 || '').replaceAll('-', '');
    const [emailId = '', emailDomain = ''] = ordererContact?.ordererEmail?.split('@') ?? [];

    updateOrdererInfo({
      ordererName: ordererContact?.ordererName,
      emailId,
      emailDomain,
      phoneNumber: mobileNo
        ? parsePhoneNumber(mobileNo, { isWithDash: false })
        : DEFAULT_ORDER_SHEET_PROVIDER_STATE.ordererInfo.phoneNumber,
    });

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setGlobalObjectSb({
      orderSheet,
    });
  }, [orderSheet]);

  useEffect(() => {
    if (!defaultAddress || shippingAddressInfo.zipCode) return;

    resetShippingAddressInfo();
    updateShippingAddressInfo({
      addressNo: defaultAddress.addressNo,
      addressName: defaultAddress.addressName,
      receiverName: defaultAddress.receiverName,
      roadAddress: defaultAddress.receiverAddress,
      mobilePhoneNumber: parsePhoneNumber(defaultAddress.receiverContact1),
      addressDetail: defaultAddress.receiverDetailAddress,
      zipCode: defaultAddress.receiverZipCd,
      countryCd: defaultAddress.countryCd,
      state: defaultAddress.state,
      city: defaultAddress.city,
      firstName: defaultAddress.shippingEtcInfo?.receiverFirstName,
      lastName: defaultAddress.shippingEtcInfo?.receiverLastName,
      contact1: defaultAddress.receiverContact1,
      contact2: defaultAddress.receiverContact2,
      mobileCountryCd: defaultAddress.receiverMobileCountryCd,
    });

    if (defaultAddress.receiverContact2) {
      updateShippingAddressInfo({
        phoneNumber: parsePhoneNumber(defaultAddress.receiverContact2),
      });
    }
  }, [defaultAddress]);

  useEffect(() => {
    if (!profile) return;

    const { firstName, lastName, mobileCountryCd, countryCd, mobileCountryCode } = profile;

    // @TODO 주문서 API 변경 요청 필요
    updateOrdererInfo({
      firstName,
      lastName,
      mobileCountryCd: mobileCountryCd?.replace(/[^0-9]/g, ''),
      countryCd,
      mobileCountryCode: mobileCountryCode || countryCd,
    });
  }, [profile]);

  /* eslint-disable complexity */
  const handleOrderBtnClick = async () => {
    const cashReceipt = {
      cashReceiptIssuePurposeType,
      cashReceiptKeyType,
      cashReceiptKey,
    };

    const isValid = validateForm({
      ordererInfo,
      shippingAddressInfo,
      accumulationInputValue,
      selectedCoupon,
      needsShippingAddressInfo: hasDeliverableProduct,
      termsStatus,
      needsDepositBankForm,
      bankAccountToDeposit,
      remitterName,
      selectedPayMethod,
      myPayInfo,
      blockUseAccumulationWhenUseCoupon,
      applyCashReceipt,
      cashReceipt,
      appCardInfo,
      isGlobalForm,
      freeGiftInfos,
      selectedFreeGiftInfoMap,
      noSelectFreeGiftConditionIds,
    });

    if (!isValid) return;

    try {
      const { customTermsAgrees, agreementTermsAgrees } = orderSheetRef.termsCheckerRef.current;

      const isAccumulationInputValueLessThanMin =
        accumulationInputValue && accumulationInputValue < minAccumulationLimit;

      if (isAccumulationInputValueLessThanMin) {
        openAlert({ message: `최소 사용 가능 ${accumulationName} 은(는) ${minAccumulationLimit} 입니다.` });

        return;
      }

      const extraData = {};
      if (isGlobalForm) {
        Object.assign(extraData, {
          exchangeRate,
          firstName: shippingAddressInfo.extraFirstName,
          lastName: shippingAddressInfo.extraLastName,
        });
      }

      const freeGiftInfos = Array.from(selectedFreeGiftInfoMap?.values() || []);

      await order({
        platform: isMobile ? 'MOBILE_WEB' : 'PC',
        confirmUrl: `${location.origin}/order/confirm?deliverable=${convertBooleanToYorN(hasDeliverableProduct)}`,
        customTermsAgrees,
        agreementTermsAgrees,
        updateMember: ordererInfo.updateMember,
        applyCashReceipt,
        cashReceipt,
        freeGiftInfos,
        successCallback: (result) => {
          const { pgType, extraData } = result;
          const isOneClickPayAppCard = extraData?.authYn === 'Y';

          if (pgType === PG_TYPES_MAP.APP_CARD && !isOneClickPayAppCard) {
            setOrderResponse(result);
            setAppCardAuthenticateFullModalOpen(true);
          }
        },
        extraData,
      });
    } catch (e) {
      catchError(e);
    }
  };

  const handleCheckboxChange = ({ currentTarget }) => {
    updateOrdererInfo({
      updateMember: currentTarget.checked,
    });
  };

  const visibleCashReceipt = orderConfig?.cashReceipt && selectedPayMethod?.payType === 'ACCOUNT';

  return (
    <div className="order-sheet">
      <div className="order-sheet__item">
        <VisibleComponent
          shows={isSignedIn() && mallJoinConfig?.isMemberInfoUpdatableWithOrdererInfo}
          TruthyComponent={
            <Checkbox
              label="주문자의 이메일, 전화번호와 배송지 주소를 회원 정보에 반영합니다."
              className="order-sheet__notice-checkbox"
              onChange={handleCheckboxChange}
            />
          }
        />
      </div>
      <OrdererInfoForm refs={orderSheetRef.ordererInfoFormRef} />
      {hasDeliverableProduct && <ShippingAddressInfoForm refs={orderSheetRef.shippingAddressInfoFormRef} />}
      <OrderProductTable />

      {/* 인쇄 파일 업로드 섹션 */}
      <section className="l-panel order-sheet__print-file">
        <p className="order-sheet__section-title" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
          인쇄 원고 파일 업로드
        </p>
        <p className="text-xs text-[#979797] tracking-[-0.05em] mb-3">
          주문하신 인쇄 상품의 원고 파일을 업로드해주세요. (PDF / AI / PSD / JPG / PNG, 최대 100MB)
        </p>
        <PrintFileUpload onFilesChange={setPrintFiles} />
      </section>

      <PromotionController />
      <FreeGiftInfos />
      <PaymentInfo />
      <PayMethodSelector refs={orderSheetRef.depositBankFormRef} />
      {visibleCashReceipt && <CashReceipt cashReceiptRequired={orderConfig.cashReceiptRequired} />}
      <TermsChecker ref={orderSheetRef.termsCheckerRef} />
      <Button
        shopby-script-action="PURCHASE_PRODUCT"
        className="order-sheet__pay-btn"
        label={'결제 하기'}
        onClick={handleOrderBtnClick}
      />

      {isAppCardAuthenticateFullModalOpen && (
        <AppCardAuthenticateInOrder
          onClose={() => setAppCardAuthenticateFullModalOpen(false)}
          onRetry={() => {
            setAppCardAuthenticateFullModalOpen(false);
            handleOrderBtnClick();
          }}
        />
      )}
    </div>
  );
};

const OrderSheet = () => {
  const { clientId, mallProfile, exchangeTo } = useMallStateContext();

  const defaultShippingAddressInfo = {
    countryCd: getDefaultCountryCode(exchangeTo),
  };

  return (
    <OrderSheetProvider
      clientId={clientId}
      mallProfile={mallProfile}
      customTerms={EXTERNAL_CUSTOM_ORDER_SHEET_TERMS}
      shippingAddressInfo={defaultShippingAddressInfo}
    >
      <MyShippingAddressProvider>
        <MyPayProvider clientId={clientId} mallProfile={mallProfile} platform={getPlatformByMobile(isMobile)}>
          <MyOrderProvider>
            <CashReceiptProvider>
              <AppCardProvider>
                <OrderSheetContent />
              </AppCardProvider>
            </CashReceiptProvider>
          </MyOrderProvider>
        </MyPayProvider>
      </MyShippingAddressProvider>
    </OrderSheetProvider>
  );
};

export default OrderSheet;

OrderSheet.propTypes = {};
