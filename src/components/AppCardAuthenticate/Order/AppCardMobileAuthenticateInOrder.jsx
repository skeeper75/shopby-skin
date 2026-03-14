import { useEffect, useState } from 'react';

import { func } from 'prop-types';

import { useAppCardActionContext, useAppCardStateContext, useModalActionContext } from '@shopby/react-components';
import { CLIENT_ERROR, CLIENT_ERROR_MESSAGE } from '@shopby/shared/constants';

const AppCardAuthenticateByMobile = ({ onClose }) => {
  const { submitAppCardForm } = useAppCardActionContext();
  const { orderResponse } = useAppCardStateContext();
  const { openAlert } = useModalActionContext();

  const [url, setUrl] = useState('');

  const handleMessage = (e) => {
    const { data } = e;
    const { resultCode } = data ?? {};

    switch (resultCode) {
      case '0000': // 앱카드 인증 성공
        // 회원가입 or 로그인 처리
        submitAppCardForm({
          failCallback: (error) => {
            const errorCode = error?.error?.code;

            if (errorCode === CLIENT_ERROR.APP_CARD_ORDER_NOT_AUTHORIZATION) {
              openAlert({
                message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR.APP_CARD_ORDER_NOT_AUTHORIZATION],
              });
            }

            throw new Error(error);
          },
        });
        break;
      case '0001': // 카드사 앱 호출
        break;
      case '0002': // 앱카드 인증 실패
      case '0003': // 닫기
        onClose();
        break;
      default:
    }
  };

  useEffect(() => {
    const { returnUrl } = orderResponse;
    setUrl(returnUrl);

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="app-card-authenticate">{url && <object id="appCard" data={url} type="text/html"></object>}</div>
  );
};

AppCardAuthenticateByMobile.propTypes = {
  onClose: func,
  onComplete: func,
};

export default AppCardAuthenticateByMobile;
