import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  SelectBox,
  useSignUpStateContext,
  useSignUpActionContext,
  useMallStateContext,
} from '@shopby/react-components';

import { REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const YEAR_SELECT_OPTION_LENGTH = 120;
const MONTH_SELECT_OPTION_LENGTH = 12;
const DATE_SELECT_OPTION_LENGTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const TODAY_DATE = new Date();

const SignUpBirthdayForm = () => {
  const { t } = useTranslation(['form']);
  const {
    memberJoinConfig: { birthday: birthdayConfig },
  } = useMallStateContext();

  const { setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();
  const {
    signUpMemberInfo: { birthYear, birthMonth, birthDate },
  } = useSignUpStateContext();

  const selectBoxYearOptions = Array.from(
    { length: YEAR_SELECT_OPTION_LENGTH },
    (_, idx) => TODAY_DATE.getFullYear() - idx
  ).map((year) => ({
    label: year,
    value: year,
  }));

  const selectBoxMonthOptions = Array.from({ length: MONTH_SELECT_OPTION_LENGTH }, (_, idx) => idx + 1).map(
    (month) => ({
      label: month,
      value: month,
    })
  );

  const selectBoxDateOptions = Array.from(
    { length: DATE_SELECT_OPTION_LENGTH[birthMonth ? birthMonth - 1 : 0] },
    (_, idx) => idx + 1
  ).map((date) => ({
    label: date,
    value: date,
  }));

  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const handleBirthYearSelect = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, birthYear: event.target.value }));
  };

  const handleBirthMonthSelect = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, birthMonth: event.target.value }));
    if (birthDate && DATE_SELECT_OPTION_LENGTH[event.target.value - 1] < birthDate) {
      setSignUpMemberInfo((prev) => ({ ...prev, birthDate: '' }));
    }
  };

  const handleBirthDateSelect = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, birthDate: event.target.value }));
  };

  const getAge = () => {
    const yearDiff = TODAY_DATE.getFullYear() - birthYear;
    const monthDiff = TODAY_DATE.getMonth() + 1 - birthMonth;
    const dateDiff = TODAY_DATE.getDate() - birthDate;

    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && dateDiff < 0);

    if (isBeforeBirthday) {
      return yearDiff - 1;
    }

    return yearDiff;
  };

  const validateUserAge = () => {
    if (birthYear && birthMonth && birthDate) {
      if (getAge() < 14) {
        setValidationStatus((prev) => ({
          ...prev,
          birthday: { result: false, message: '만 14세 미만은 쇼핑몰 이용이 불가합니다.' },
        }));

        return false;
      }
    }
    resetValidationStatus('birthday');

    return true;
  };

  const validateUserBirthday = () => {
    if (!birthYear !== !birthMonth || !birthMonth !== !birthDate || !birthDate !== !birthYear) {
      setValidationStatus((prev) => ({
        ...prev,
        birthday: { result: false, message: '생년월일을 선택해주세요.' },
      }));

      return false;
    }

    return validateUserAge();
  };

  const handleValidateUserBirthday = () => validateUserBirthday();

  useEffect(() => {
    handleValidateUserBirthday();
  }, [birthYear, birthMonth, birthDate]);

  return (
    <div className="sign-up-form__item">
      <label htmlFor="birthday" className="sign-up-form__tit">
        {t('birthday-label')}
        {birthdayConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="sign-up-form__input-wrap">
        <div className="birthday-input">
          <SelectBox
            value={birthYear}
            options={selectBoxYearOptions}
            hasEmptyOption={true}
            emptyOptionLabel={t('birthYear-label')}
            onSelect={handleBirthYearSelect}
          />
          <SelectBox
            value={birthMonth}
            options={selectBoxMonthOptions}
            hasEmptyOption={true}
            emptyOptionLabel={t('birthMonth-label')}
            onSelect={handleBirthMonthSelect}
          />
          <SelectBox
            value={birthDate}
            options={selectBoxDateOptions}
            hasEmptyOption={true}
            emptyOptionLabel={t('birthDate-label')}
            onSelect={handleBirthDateSelect}
          />
        </div>
      </div>
      <ValidationStatus name={'birthday'} />
    </div>
  );
};

export default SignUpBirthdayForm;
