import { useEffect, useState } from 'react';
import { isIOS } from 'react-device-detect';

import { func } from 'prop-types';

import { useMallStateContext, useOpenIdSignInActionContext } from '@shopby/react-components';
import { APP_CARD_URL } from '@shopby/shared/utils';

const AppCardMobileAuthenticateInMember = ({ onClose, onComplete }) => {
  const { fetchOauthOpenIdAppCardTransNo } = useOpenIdSignInActionContext();
  const { mallProfile } = useMallStateContext();

  const [url, setUrl] = useState('');

  const handleMessage = (e) => {
    const { data } = e;
    const { resultCode } = data ?? {};

    switch (resultCode) {
      case '0000': // 앱카드 인증 성공
        // 회원가입 or 로그인 처리
        onComplete();
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
    (async () => {
      const { data } = await fetchOauthOpenIdAppCardTransNo();
      const { transNo } = data;

      const deviceType = isIOS ? '1' : '3'; // 1: IOS WEB, 2: IOS APP, 3: AOS WEB, 4: AOS APP, 5: PC
      const nativeYN = 'N'; // ios/aos 에서 웹뷰를 통해 모듈을 바로 호출 시 Y 로 설정
      const storeTermYN = 'Y'; // 가맹점 약관 노출 시 Y 로 설정
      const url = `${APP_CARD_URL[mallProfile]}/APPCARD-AUTH/index.html#/?transNo=${transNo}&deviceType=${deviceType}&nativeYN=${nativeYN}&storeTermYN=${storeTermYN}`;

      setUrl(url);
    })();

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="app-card-authenticate">
      {url && (
        <object
          id="appCard"
          data={url}
          type="text/html"
          style={{ zIndex: '9998', position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100%' }}
        ></object>
      )}
    </div>
  );
};

export default AppCardMobileAuthenticateInMember;

AppCardMobileAuthenticateInMember.propTypes = {
  onClose: func,
  onComplete: func,
};
