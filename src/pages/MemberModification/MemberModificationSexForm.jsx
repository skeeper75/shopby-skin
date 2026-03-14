import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  Radio,
  useMallStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { CERTIFICATION_TYPE, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationSexForm = () => {
  const { t } = useTranslation(['form']);

  const {
    mallJoinConfig,
    memberJoinConfig: { sex: sexConfig },
  } = useMallStateContext();
  const { updateMemberModificationInfo, updateValidationStatus } = useMemberModificationActionContext();

  const {
    memberModificationInfo: { sex, certificationType, providerType },
  } = useMemberModificationStateContext();

  const SEX_SELECT_OPTIONS = [
    { value: 'X', label: '선택 안 함' },
    { value: 'M', label: '남자' },
    { value: 'F', label: '여자' },
  ];

  const resetValidationStatus = (key) => {
    updateValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const validateSex = (sexSelect) => {
    if (sexConfig === REQUIRED && sexSelect !== 'M' && sexSelect !== 'F') {
      updateValidationStatus((prev) => ({ ...prev, sex: { result: false, message: '성별을 선택해주세요.' } }));

      return false;
    }
    resetValidationStatus('sex');

    return true;
  };

  const handleSexSelect = ({ currentTarget: { value } }) => {
    updateMemberModificationInfo({ sex: value });
    validateSex(value);
  };

  const isMobileType = useMemo(() => {
    if (mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE) {
      return true;
    }

    return false;
  }, [mallJoinConfig]);

  const isSocialMember = useMemo(() => !!providerType, [providerType]);

  return (
    <div className="member-modification-form__item">
      <label htmlFor="birthday" className="member-modification-form__tit">
        {t('sex-label')}
        {sexConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="member-modification-form__input-wrap">
        <div className="sex-input">
          {SEX_SELECT_OPTIONS.map(({ label, value }) => (
            <Radio
              label={label}
              key={value}
              name={'sex'}
              value={value}
              checked={sex === value}
              onChange={handleSexSelect}
              disabled={!isSocialMember && isMobileType && certificationType === CERTIFICATION_TYPE.mobile}
            />
          ))}
        </div>
      </div>
      <ValidationStatus name={'sex'} />
    </div>
  );
};

export default MemberModificationSexForm;

MemberModificationSexForm.propTypes = {};
