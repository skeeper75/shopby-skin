import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, useFindAccountActionContext, TextField } from '@shopby/react-components';
import { checkPassword, INVALID_PASSWORD_MESSAGE_MAP } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal';

import ChangePasswordConfirm from './ChangePasswordConfirm';

export const ChangePasswordContent = () => {
  const { changePassword } = useFindAccountActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId');
  const certificationNumber = searchParams.get('certificationNumber');
  const findMethod = searchParams.get('findMethod');

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [cautionMessage, setCautionMessage] = useState('');
  const [isChangePasswordFullModalOpen, setIsChangePasswordFullModalOpen] = useState(false);

  const validatePassword = () => {
    const { isValid, message } = checkPassword(password);
    if (!isValid) {
      setCautionMessage(INVALID_PASSWORD_MESSAGE_MAP[message]);

      return false;
    }

    setCautionMessage('');

    return true;
  };

  const validatePasswordCheck = () => {
    if (password !== passwordCheck) {
      setCautionMessage('비밀번호와 비밀번호 확인 값이 일치하지 않습니다.');

      return false;
    }

    setCautionMessage('');

    return true;
  };

  const handlePasswordChange = ({ currentTarget: { value } }) => {
    setPassword(value);
  };

  const handlePasswordCheckChange = ({ currentTarget: { value } }) => {
    setPasswordCheck(value);
  };

  const handleChangePassword = async () => {
    if (!validatePassword() || !validatePasswordCheck()) return;

    try {
      await changePassword({ memberId, certificationNumber, findMethod, newPassword: password });

      setIsChangePasswordFullModalOpen(true);
    } catch (e) {
      catchError(e);
    }
  };

  return (
    <>
      <div className="change-password">
        <p className="change-password__tit">비밀번호 변경</p>
        <div className="change-password-form">
          <div className="change-password-form__item">
            <div className="change-password-form__input-wrap">
              <TextField
                id="password"
                type="password"
                placeholder="비밀번호 입력"
                onChange={handlePasswordChange}
                onBlur={validatePassword}
                valid="NO_SPACE"
              />
            </div>
          </div>

          <div className="change-password-form__item">
            <div className="change-password-form__input-wrap">
              <TextField
                id="passwordCheck"
                type="password"
                placeholder="비밀번호 확인"
                onChange={handlePasswordCheckChange}
                onBlur={validatePasswordCheck}
                valid="NO_SPACE"
              />
            </div>
          </div>

          <p className="change-password-form__caution">{cautionMessage}</p>

          <div className="change-password-form__btn-wrap">
            <Button
              label="확인"
              onClick={() => {
                handleChangePassword();
              }}
            />
          </div>
        </div>
      </div>

      {isChangePasswordFullModalOpen && (
        <FullModal
          title="비밀번호 찾기"
          onClose={() => {
            location.href = '/sign-in';
          }}
        >
          <ChangePasswordConfirm />
        </FullModal>
      )}
    </>
  );
};

export default ChangePasswordContent;
