import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useMallStateContext,
  VisibleComponent,
} from '@shopby/react-components';

import { TextField } from '../../components/ui';
import { classNames, AUTHENTICATION_TYPE } from '@shopby/shared';

import { JOIN_TIME, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationMemberNameForm = () => {
  const { t } = useTranslation(['form']);

  const {
    isGlobalForm,
    exchangeTo,
    mallJoinConfig,
    memberJoinConfig: { memberName: memberNameConfig },
  } = useMallStateContext();

  const { updateNewMemberName, updateValidationStatus, setMemberModificationInfo } =
    useMemberModificationActionContext();

  const {
    memberModificationInfo: { providerType, firstName, lastName },
    newMemberName,
  } = useMemberModificationStateContext();

  const resetValidationStatus = (key) => {
    updateValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const handleMemberNameChange = ({ currentTarget: { value } }) => {
    updateNewMemberName(value);
  };

  const isMemberNameEmpty = () => {
    if (!newMemberName) {
      updateValidationStatus((prev) => ({
        ...prev,
        memberName: { result: false, message: '이름을 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('memberName');

    return false;
  };

  const handleVerifyMemberName = () => {
    if (!newMemberName) {
      if (memberNameConfig === REQUIRED) {
        isMemberNameEmpty();

        return;
      }
    }
    resetValidationStatus('memberName');
  };

  const handleGlobalNameChange = ({ target }) => {
    const { name, value } = target;
    const nameInfo = { firstName, lastName, [name]: value };
    const memberName =
      exchangeTo === 'JPY' ? `${nameInfo.lastName}${nameInfo.firstName}` : `${nameInfo.firstName}${nameInfo.lastName}`;

    updateNewMemberName(memberName);
    setMemberModificationInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      [name]: value,
    }));
  };

  const handleVerifyUserName = () => {
    if (memberNameConfig !== REQUIRED && (!firstName || !lastName)) {
      updateValidationStatus((prev) => ({
        ...prev,
        memberName: { result: false, message: '이름을 입력해주세요.' },
      }));

      return;
    }

    resetValidationStatus('memberName');
  };

  const isMobileType = useMemo(() => {
    if (mallJoinConfig.authenticationType === AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE) {
      return true;
    }

    return false;
  }, [mallJoinConfig]);

  const isSocialMember = useMemo(() => !!providerType, [providerType]);

  const isMobileCertificate = useMemo(
    () => !isSocialMember && isMobileType && mallJoinConfig.authenticationTimeType === JOIN_TIME,
    [isSocialMember, isMobileType, mallJoinConfig]
  );

  return (
    <div className="member-modification-form__item">
      <label htmlFor="memberName" className="member-modification-form__tit">
        {t('memberName-label')}
        {memberNameConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className={`${classNames('member-modification-form__input-wrap', { 'global-name-field': isGlobalForm })}`}>
        <VisibleComponent
          shows={isGlobalForm}
          TruthyComponent={
            <>
              <TextField
                name="lastName"
                id="lastName"
                value={lastName}
                placeholder={t('lastName-label')}
                onChange={handleGlobalNameChange}
                onBlur={handleVerifyUserName}
              />
              <TextField
                name="firstName"
                id="firstName"
                value={firstName}
                placeholder={t('firstName-label')}
                onChange={handleGlobalNameChange}
                onBlur={handleVerifyUserName}
              />
            </>
          }
          FalsyComponent={
            <TextField
              name="memberName"
              id="memberName"
              value={newMemberName}
              placeholder={t('memberName-label')}
              onChange={handleMemberNameChange}
              onBlur={handleVerifyMemberName}
              disabled={isMobileCertificate}
            />
          }
        />
      </div>
      <ValidationStatus name={'memberName'} />
    </div>
  );
};

export default MemberModificationMemberNameForm;
