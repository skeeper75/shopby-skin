import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  SelectBox,
  useMallStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared';

import { CERTIFICATION_TYPE, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const YEAR_SELECT_OPTION_LENGTH = 120;
const MONTH_SELECT_OPTION_LENGTH = 12;
const DATE_SELECT_OPTION_LENGTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const TODAY_DATE = new Date();

const MemberModificationBirthdayForm = () => {
  const { t } = useTranslation(['form']);

  const {
    mallJoinConfig,
    memberJoinConfig: { birthday: birthdayConfig },
  } = useMallStateContext();

  const { updateMemberModificationInfo, updateBirthYear, updateBirthMonth, updateBirthDate, updateValidationStatus } =
    useMemberModificationActionContext();

  const {
    birthYear,
    birthMonth,
    birthDate,
    memberModificationInfo: { certificationType, providerType },
  } = useMemberModificationStateContext();

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

  const handleBirthYearSelect = ({ currentTarget: { value } }) => {
    updateBirthYear(value);
    if (!value || !birthMonth || !birthDate) return;
    updateMemberModificationInfo({
      birthday: `${value.padStart(4, '0')}${birthMonth.padStart(2, '0')}${birthDate.padStart(2, '0')}`,
    });
  };

  const handleBirthMonthSelect = ({ currentTarget: { value } }) => {
    updateBirthMonth(value);
    if (birthDate && DATE_SELECT_OPTION_LENGTH[value - 1] < birthDate) {
      updateBirthDate('');

      return;
    }
    if (!birthYear || !value || !birthDate) return;

    updateMemberModificationInfo({
      birthday: `${birthYear.padStart(4, '0')}${value.padStart(2, '0')}${birthDate.padStart(2, '0')}`,
    });
  };

  const handleBirthDateSelect = ({ currentTarget: { value } }) => {
    updateBirthDate(value);
    if (!birthYear || !birthMonth || !value) return;

    updateMemberModificationInfo({
      birthday: `${birthYear.padStart(4, '0')}${birthMonth.padStart(2, '0')}${value.padStart(2, '0')}`,
    });
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
        updateValidationStatus((prev) => ({
          ...prev,
          birthday: { result: false, message: '만 14세 미만은 쇼핑몰 이용이 불가합니다.' },
        }));

        return false;
      }
    }
    updateValidationStatus((prev) => ({
      ...prev,
      birthday: { result: true, message: '' },
    }));

    return true;
  };

  const validateUserBirthday = () => {
    if (!birthYear !== !birthMonth || !birthMonth !== !birthDate || !birthDate !== !birthYear) {
      updateValidationStatus((prev) => ({
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

  const isMobileType = useMemo(() => {
    if (mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE) {
      return true;
    }

    return false;
  }, [mallJoinConfig]);

  const isSocialMember = useMemo(() => !!providerType, [providerType]);

  const isMobileCertificate = useMemo(
    () => !isSocialMember && isMobileType && certificationType === CERTIFICATION_TYPE.mobile,
    [isSocialMember, isMobileType, certificationType]
  );
  return (
    <div className="member-modification-form__item">
      <label htmlFor="birthday" className="member-modification-form__tit">
        {t('birthday-label')}
        {birthdayConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="member-modification-form__input-wrap">
        <div className="birthday-input">
          <SelectBox
            value={birthYear}
            options={selectBoxYearOptions}
            hasEmptyOption={true}
            emptyOptionLabel={t('birthYear-label')}
            onSelect={handleBirthYearSelect}
            disabled={isMobileCertificate}
          />
          <SelectBox
            value={birthMonth}
            options={selectBoxMonthOptions}
            hasEmptyOption={true}
            emptyOptionLabel={t('birthMonth-label')}
            onSelect={handleBirthMonthSelect}
            disabled={isMobileCertificate}
          />
          <SelectBox
            value={birthDate}
            options={selectBoxDateOptions}
            hasEmptyOption={true}
            emptyOptionLabel={t('birthDate-label')}
            onSelect={handleBirthDateSelect}
            disabled={isMobileCertificate}
          />
        </div>
      </div>
      <ValidationStatus name={'birthday'} />
    </div>
  );
};

export default MemberModificationBirthdayForm;
