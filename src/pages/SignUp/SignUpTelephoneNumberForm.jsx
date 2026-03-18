import { useTranslation } from 'react-i18next';

import {
  useSignUpStateContext,
  useSignUpActionContext,
  TextField,
  useMallStateContext,
} from '@shopby/react-components';

import { REQUIRED } from '../../constants/form';
import { getCountryPhoneNumberLength } from '../../utils';

import ValidationStatus from './ValidationStatus';

const SignUpTelephoneNumberForm = () => {
  const { t } = useTranslation(['form']);

  const {
    memberJoinConfig: { phoneNo: phoneNoConfig },
    isGlobalForm,
  } = useMallStateContext();

  const { setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();

  const {
    signUpMemberInfo: { phoneNo, countryCd },
  } = useSignUpStateContext();

  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const isPhoneNoEmpty = () => {
    if (!phoneNo) {
      setValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('phoneNo');

    return false;
  };
  const validatePhoneNumber = () => {
    if (phoneNoConfig === REQUIRED) {
      isPhoneNoEmpty();

      return;
    }
    if (phoneNo) {
      resetValidationStatus('phoneNo');
    }
  };

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const { MAX: maxLength } = getCountryPhoneNumberLength(isGlobalForm ? countryCd : 'KR');

  return (
    <div className="sign-up-form__item">
      <label htmlFor="phoneNo" className="sign-up-form__tit">
        {t('phoneNo-label')}
        {phoneNoConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="sign-up-form__input-wrap">
        <TextField
          name="phoneNo"
          id="phoneNo"
          value={phoneNo}
          maxLength={maxLength}
          valid="NUMBER"
          onChange={handleFormValueChange}
          onBlur={validatePhoneNumber}
        />
      </div>
      <ValidationStatus name="phoneNo" />
    </div>
  );
};

export default SignUpTelephoneNumberForm;

SignUpTelephoneNumberForm.propTypes = {};
