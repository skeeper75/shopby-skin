import { useTranslation } from 'react-i18next';

import { useModalActionContext } from '@shopby/react-components';
import {
  checkPassword,
  POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS,
  POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS,
  REG_EX_FOR_CHECK_FORMAT,
  INVALID_PASSWORD_MESSAGE_MAP,
  PG_TYPES_MAP,
  FREE_GIFT_OPTION_COUNT_TYPE,
} from '@shopby/shared';

import { cashReceiptKeyTypeOptions } from '../../constants/form';

const useValidateFormMaker = (ref) => {
  const { openAlert } = useModalActionContext();
  const { t } = useTranslation('order');

  const {
    ordererInfoFormRef: {
      ordererNameInputRef,
      emailInputRef,
      phoneNumberInputRef,
      passwordInputRef,
      passwordForConfirmationInputRef,
      firstNameInputRef,
      lastNameInputRef,
    },
    shippingAddressInfoFormRef: {
      receiverNameInputRef,
      addressFormRef,
      mobilePhoneNumberInputRef: receiverMobilePhoneNumberInputRef,
      receiverFirstNameInputRef,
      receiverLastNameInputRef,
      globalAddressFormRef,
    },
    depositBankFormRef: { bankAccountSelectRef, remitterNameInputRef },
  } = ref;

  const validateForm = ({
    ordererInfo: {
      ordererName,
      emailId,
      emailDomain,
      phoneNumber: ordererMobilePhoneNumber,
      guestInfo,
      firstName,
      lastName,
      contact1,
    },
    shippingAddressInfo: {
      receiverName,
      zipCode,
      roadAddress,
      mobilePhoneNumber: receiverMobilePhoneNumber,
      addressDetail,
      receiverAddress,
      firstName: receiverFirstName,
      lastName: receiverLastName,
      contact1: receiverContact1,
    },
    accumulationInputValue,
    selectedCoupon,
    needsShippingAddressInfo,
    needsDepositBankForm,
    bankAccountToDeposit,
    remitterName,
    termsStatus,
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
  }) => {
    const ordererInfoValidation = {
      isOrdererNameEmpty: () => {
        if (isGlobalForm) return false;
        if (ordererName) return false;

        openAlert({
          message: '주문자 명을 입력해주세요.',
          onClose: () => {
            ordererNameInputRef?.current?.focus();
          },
        });

        return true;
      },
      isOrdererGlobalNameEmpty: () => {
        if (!isGlobalForm) return false;
        if (firstName && lastName) return false;

        openAlert({
          message: '주문자 명을 입력해주세요.',
          onClose: () => {
            if (!firstName) {
              firstNameInputRef?.current?.focus();
            } else {
              lastNameInputRef?.current?.focus();
            }
          },
        });

        return true;
      },
      isEmailIdEmpty: () => {
        if (emailId) return false;

        openAlert({
          message: '이메일 아이디를 입력해주세요.',
          onClose: () => {
            emailInputRef?.current?.focusId();
          },
        });

        return true;
      },
      isEmailDomainEmpty: () => {
        if (emailDomain) return false;

        openAlert({
          message: '이메일 도메인을 입력해주세요.',
          onClose: () => {
            emailInputRef?.current?.focusDomain();
          },
        });

        return true;
      },
      isEmailInvalid: () => {
        const email = `${emailId}@${emailDomain}`;

        if (email.match(REG_EX_FOR_CHECK_FORMAT.EMAIL)) return false;

        openAlert({
          message: '올바른 형식의 이메일을 입력해주세요.',
          onClose: () => {
            emailInputRef?.current?.focusDomain();
          },
        });

        return true;
      },
      isPhoneCarrierNumberEmpty: () => {
        if (isGlobalForm || ordererMobilePhoneNumber.carrierNumber) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusCarrierNumber();
          },
        });

        return true;
      },
      isPhoneNumberFirstSerialInvalid: () => {
        if (isGlobalForm || POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS.includes(ordererMobilePhoneNumber.firstSerial.length))
          return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusFirstSerial();
          },
        });

        return true;
      },
      isPhoneNumberSecondSerialInvalid: () => {
        if (isGlobalForm || POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS.includes(ordererMobilePhoneNumber.secondSerial.length))
          return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusSecondSerial();
          },
        });

        return true;
      },
      isGlobalPhoneNumberEmpty: () => {
        if (!isGlobalForm) return false;
        if (contact1.length >= 10) return false;

        openAlert({
          message: !contact1 ? '휴대폰 번호를 입력해주세요.' : '휴대폰번호는 10자~15자 이내로 입력해주세요.',
          onClose: () => {
            phoneNumberInputRef?.current?.focusPhoneNumber();
          },
        });

        return true;
      },
      isPasswordEmpty: () => {
        if (!guestInfo || guestInfo.password) return false;

        openAlert({
          message: '구매 비밀번호를 입력해주세요.',
          onClose: () => {
            passwordInputRef?.current?.focus();
          },
        });

        return true;
      },
      isPasswordInvalid: () => {
        if (!guestInfo) return false;

        const { password } = guestInfo;
        const { isValid, message } = checkPassword(password);

        if (isValid) return false;

        openAlert({
          message: INVALID_PASSWORD_MESSAGE_MAP[message],
          onClose: () => {
            passwordInputRef?.current?.focus();
          },
        });

        return true;
      },
      isPasswordForConfirmationEmpty: () => {
        if (!guestInfo || guestInfo.passwordForConfirmation) return false;

        openAlert({
          message: '구매 비밀번호 확인을 입력해주세요.',
          onClose: () => {
            passwordForConfirmationInputRef?.current?.focus();
          },
        });

        return true;
      },
      isFailedToConfirmPassword: () => {
        if (!guestInfo || guestInfo.password === guestInfo.passwordForConfirmation) return false;

        openAlert({
          message: '구매 비밀번호 확인에 실패하였습니다. 비밀번호 확인 입력값을 확인해주세요.',
          onClose: () => {
            passwordForConfirmationInputRef?.current?.focus();
          },
        });

        return true;
      },
    };

    const shippingAddressInfoValidation = {
      isReceiverNameEmpty: () => {
        if (receiverName) return false;

        openAlert({
          message: '받는 사람을 입력해주세요.',
          onClose: () => {
            receiverNameInputRef?.current?.focus();
          },
        });

        return true;
      },
      isGlobalReceiverNameEmpty: () => {
        if (!isGlobalForm) return false;

        if (!receiverFirstName || !receiverLastName) {
          openAlert({
            message: '받는 사람을 입력해주세요.',
            onClose: () => {
              if (!receiverFirstName) {
                receiverFirstNameInputRef?.current?.focus();
              } else {
                receiverLastNameInputRef?.current?.focus();
              }
            },
          });

          return true;
        }

        return false;
      },
      isReceiverAddressEmpty: () => {
        if (zipCode && (roadAddress || receiverAddress)) return false;

        openAlert({
          message: '배송지 주소를 입력해주세요.',
          onClose: () => {
            addressFormRef.current?.focusSearchButton();
          },
        });

        return true;
      },
      isAddressDetailEmpty: () => {
        if (addressDetail) return false;

        openAlert({
          message: '상세 주소를 입력해주세요.',
          onClose: () => {
            isGlobalForm
              ? globalAddressFormRef.current?.focusDetailAddressInput()
              : addressFormRef.current?.focusDetailAddressInput();
          },
        });

        return true;
      },
      isReceiverPhoneCarrierNumberEmpty: () => {
        if (isGlobalForm || receiverMobilePhoneNumber.carrierNumber) return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusCarrierNumber();
          },
        });

        return true;
      },
      isReceiverMobilePhoneNumberFirstSerialInvalid: () => {
        if (isGlobalForm || POSSIBLE_PHONE_FIRST_SERIAL_LENGTHS.includes(receiverMobilePhoneNumber.firstSerial.length))
          return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusFirstSerial();
          },
        });

        return true;
      },
      isReceiverMobilePhoneNumberSecondSerialInvalid: () => {
        if (
          isGlobalForm ||
          POSSIBLE_PHONE_SECOND_SERIAL_LENGTHS.includes(receiverMobilePhoneNumber.secondSerial.length)
        )
          return false;

        openAlert({
          message: '올바른 형식의 휴대폰 번호를 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusSecondSerial();
          },
        });

        return true;
      },
      isReceiverGlobalPhoneNumberEmpty: () => {
        if (!isGlobalForm) return false;
        if (receiverContact1.length >= 10) return false;

        openAlert({
          message: !receiverContact1 ? '휴대폰 번호를 입력해주세요.' : '휴대폰번호는 10자~15자 이내로 입력해주세요.',
          onClose: () => {
            receiverMobilePhoneNumberInputRef?.current?.focusPhoneNumber();
          },
        });

        return true;
      },
    };

    const promotionValidation = {
      isAccumulationCouponBlocked: () => {
        if (!blockUseAccumulationWhenUseCoupon) return false;

        const { cartCouponIssueNo, productCoupons } = selectedCoupon;

        const isCouponSelected = cartCouponIssueNo || productCoupons?.length;

        if (!accumulationInputValue || !isCouponSelected) return false;

        openAlert({
          message: '쿠폰, 적립금을 함께 사용하실 수 없습니다.',
        });

        return true;
      },
    };

    const depositBankFormValidation = {
      isBankAccountToDepositNotSelected: () => {
        if (!needsDepositBankForm || (bankAccountToDeposit?.bankAccount && bankAccountToDeposit?.bankCode))
          return false;

        openAlert({
          message: '입금할 계좌를 선택해주세요.',
          onClose: () => {
            bankAccountSelectRef.current?.focus();
          },
        });

        return true;
      },
      isRemitterNameEmpty: () => {
        if (!needsDepositBankForm || remitterName) return false;

        openAlert({
          message: '입금자명을 입력해주세요.',
          onClose: () => {
            remitterNameInputRef.current?.focus();
          },
        });

        return true;
      },
    };

    const myPayValidation = {
      isMyPayPayMethodNotSelected: () => {
        if (selectedPayMethod.pgType !== PG_TYPES_MAP.MY_PAY) return false;
        if (myPayInfo?.payMethod && myPayInfo?.wpayToken) return false;

        openAlert({
          message: '결제 수단을 선택해 주세요.',
        });

        return true;
      },
    };

    const appCardValidation = {
      isAppCardPaymentNotSelected: () => {
        if (selectedPayMethod.pgType !== PG_TYPES_MAP.APP_CARD) return false;
        if (appCardInfo && appCardInfo.cardCode) return false;

        openAlert({
          message: '카드를 선택해 주세요.',
        });

        return true;
      },
    };

    const termsStatusValidation = {
      isSomeRequiredTermNotChecked: () => {
        const requiredTermsStatusValues = Object.values(termsStatus).filter(({ isRequired }) => isRequired);
        if (requiredTermsStatusValues.every(({ isChecked }) => isChecked)) return false;

        openAlert({
          message: '필수 항목을 체크해 주세요.',
        });

        return true;
      },
    };

    const cashReceiptValidation = {
      maxLength: () => {
        if (!applyCashReceipt) return false;

        const selectedCashReceiptKeyType = cashReceiptKeyTypeOptions.find(
          ({ value }) => value === cashReceipt.cashReceiptKeyType
        );

        if ((selectedCashReceiptKeyType?.maxLength ?? 0) < cashReceipt.cashReceiptKey.length) {
          openAlert({
            message: `${selectedCashReceiptKeyType.label}를 확인 해주세요.`,
          });

          return true;
        }

        return false;
      },
    };

    const freeGiftValidation = {
      isFreeGiftSelectionRequired: () => {
        if (!freeGiftInfos || freeGiftInfos.length === 0) return false;

        const isAllSelectedRequiredGift = freeGiftInfos.every((freeGiftInfo) => {
          const isAllType = freeGiftInfo.freeGiftOptionCountType === FREE_GIFT_OPTION_COUNT_TYPE.ALL;
          const isSelected = !!selectedFreeGiftInfoMap?.get(freeGiftInfo.freeGiftConditionId);
          const isNoSelect = noSelectFreeGiftConditionIds?.includes(freeGiftInfo.freeGiftConditionId) || false;

          if (isAllType || isSelected || isNoSelect) {
            return true;
          }

          return false;
        });

        if (isAllSelectedRequiredGift) {
          return false;
        }

        openAlert({
          message: t('freeGiftSelectRequired'),
        });

        return true;
      },
    };

    const validations = [
      ...Object.values(ordererInfoValidation),
      needsShippingAddressInfo ? [...Object.values(shippingAddressInfoValidation)] : () => false,
      ...Object.values(promotionValidation),
      ...Object.values(depositBankFormValidation),
      ...Object.values(myPayValidation),
      ...Object.values(termsStatusValidation),
      ...Object.values(cashReceiptValidation),
      ...Object.values(appCardValidation),
      ...Object.values(freeGiftValidation),
    ];

    return validations.flat().every((validation) => !validation());
  };

  return {
    validateForm,
  };
};

export default useValidateFormMaker;
