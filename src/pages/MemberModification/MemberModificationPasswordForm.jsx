import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  TextField,
  useMallStateContext,
  Button,
} from '@shopby/react-components';
import { INVALID_PASSWORD_MESSAGE_MAP, AUTHENTICATION_TYPE, checkPassword } from '@shopby/shared';

import { REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationPasswordForm = () => {
  const { t } = useTranslation(['form']);

  const {
    mallJoinConfig,
    memberJoinConfig: { password: passwordConfig },
  } = useMallStateContext();

  const {
    updateMemberModificationInfo,
    updateValidationStatus,
    updateNewPassword,
    updateNewPasswordCheck,
    updateIsNewPasswordDisplay,
  } = useMemberModificationActionContext();

  const { newPassword, newPasswordCheck, isNewPasswordDisplay } = useMemberModificationStateContext();

  const handleNewPasswordChange = (event) => {
    updateNewPassword(event.target.value);
  };

  const handleNewPasswordCheckChange = (event) => {
    updateNewPasswordCheck(event.target.value);
  };

  const verifyNewPassword = () => {
    const { isValid, message } = checkPassword(newPassword ?? '');

    updateValidationStatus((prev) => ({
      ...prev,
      password: {
        result: isValid,
        message: message ? INVALID_PASSWORD_MESSAGE_MAP[message] : '사용 가능합니다.',
      },
    }));

    return true;
  };

  const confirmUserPassword = () => {
    if (!newPasswordCheck) {
      updateValidationStatus((prev) => ({
        ...prev,
        passwordCheck: { result: false, message: '비밀번호를 입력해주세요.' },
      }));

      return;
    }

    if (newPasswordCheck !== newPassword) {
      updateValidationStatus((prev) => ({
        ...prev,
        passwordCheck: { result: false, message: '비밀번호와 비밀번호 확인 값이 일치하지 않습니다.' },
      }));

      return;
    }

    updateValidationStatus((prev) => ({
      ...prev,
      passwordCheck: { result: true, message: '비밀번호가 일치합니다.' },
    }));
  };

  const handleVerifyNewPassword = () => verifyNewPassword();
  const handleConfirmUserPassword = () => confirmUserPassword();

  useEffect(() => {
    if (
      [AUTHENTICATION_TYPE.NOT_USED, AUTHENTICATION_TYPE.AUTHENTICATION_BY_PHONE].includes(
        mallJoinConfig.authenticationType
      )
    ) {
      updateValidationStatus((prev) => ({
        ...prev,
        certificatedNumber: { result: true, message: '' },
      }));
      updateMemberModificationInfo((prev) => ({ ...prev, certificatedNumber: 'NOT_USED' }));
    }
  }, [newPassword]);

  return (
    <>
      <Button
        className="member-modification-form__btn--certificate"
        label={t('passwordModify-label')}
        onClick={() => updateIsNewPasswordDisplay(!isNewPasswordDisplay)}
      />
      {isNewPasswordDisplay && (
        <>
          <div className="member-modification-form__item">
            <label htmlFor="password" className="member-modification-form__tit">
              {t('password-label')}
              {passwordConfig === REQUIRED && <div className="required"></div>}
            </label>
            <div className="member-modification-form__input-wrap">
              <TextField
                name="password"
                id="password"
                placeholder={t('password-placeholder')}
                type="password"
                onChange={handleNewPasswordChange}
                onBlur={handleVerifyNewPassword}
                minLength={8}
                maxLength={20}
                valid="ENGLISH_NUMBER_SPECIAL"
                value={newPassword ?? ''}
                autoComplete="off"
              />
            </div>
            <ValidationStatus name="password" />
          </div>
          <div className="sign-up-form__item">
            <label htmlFor="passwordCheck" className="member-modification-form__tit">
              {t('passwordCheck-label')}
              {passwordConfig === REQUIRED && <div className="required"></div>}
            </label>
            <div className="member-modification-form__input-wrap">
              <TextField
                name="passwordCheck"
                id="passwordCheck"
                placeholder={t('passwordCheck-label')}
                type="password"
                onChange={handleNewPasswordCheckChange}
                onBlur={handleConfirmUserPassword}
                minLength={8}
                maxLength={20}
                valid="NO_SPACE"
                value={newPasswordCheck ?? ''}
                autoComplete="off"
              />
            </div>
            <ValidationStatus name="passwordCheck" />
          </div>
        </>
      )}
    </>
  );
};

export default MemberModificationPasswordForm;
