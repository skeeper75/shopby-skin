import { useEffect } from 'react';

import { func } from 'prop-types';

import { Button, useOpenIdSignInActionContext, useOpenIdSignInValueContext } from '@shopby/react-components';
import { APP_CARD_AUTHORIZATION_TIME } from '@shopby/shared/constants';

const AppCardPcAuthenticateInMember = ({ onClose, onComplete }) => {
  const { fetchOauthOpenIdAppCard, setTimerTime, setAuthenticationsRemainTimeBySeconds, setIsExpireAuthenticate } =
    useOpenIdSignInActionContext();
  const { appCardOpenIdInfo, timerTime, authenticationsRemainTimeBySeconds, isExpireAuthenticate } =
    useOpenIdSignInValueContext();

  const startTimer = () => {
    const timeFormat = () => {
      let minute = Math.floor(authenticationsRemainTimeBySeconds / 60).toString();
      let second = (authenticationsRemainTimeBySeconds % 60).toString();

      if (minute.length === 1) minute = `0${minute}`;
      if (second.length === 1) second = `0${second}`;

      setTimerTime({ minute, second });
    };
    timeFormat();
  };

  const startAuthenticate = () => {
    fetchOauthOpenIdAppCard();
    setAuthenticationsRemainTimeBySeconds(APP_CARD_AUTHORIZATION_TIME);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (Number(timerTime.second) > 0) {
        setTimerTime((prev) => ({
          ...prev,
          second: String(Number(timerTime.second) - 1),
        }));
      }
      if (Number(timerTime.second) === 0) {
        if (Number(timerTime.minute) === 0) {
          clearInterval(timer);
          setIsExpireAuthenticate(true);
          setAuthenticationsRemainTimeBySeconds(0);
        } else {
          setTimerTime((prev) => ({
            ...prev,
            minute: String(Number(timerTime.minute) - 1),
            second: '59',
          }));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerTime]);

  useEffect(() => {
    if (authenticationsRemainTimeBySeconds === 0) {
      return;
    }
    startTimer();
  }, [authenticationsRemainTimeBySeconds]);

  useEffect(() => {
    startAuthenticate();
  }, []);

  return (
    <div className="app-card-authenticate">
      <div className="app-card-authenticate__qr-info">
        {isExpireAuthenticate ? (
          <p>
            QR코드 유효시간이 만료되었습니다.
            <br />
            재시도 버튼을 통해 새로운 QR코드로 다시 시도해 주세요
          </p>
        ) : (
          <>
            <p>
              휴대폰 카메라로 QR코드를 스캔하여
              <br />
              앱카드 인증을 진행해주세요.
            </p>
            <div className="app-card-authenticate__qr-code" slot="qrCode">
              <img src={`data:image/png;base64,${appCardOpenIdInfo.qr}`} alt="qrCode" />
            </div>
          </>
        )}
      </div>
      <div>
        {!isExpireAuthenticate && timerTime ? (
          <span className="timer">
            <span className="timer__text">남은 시간 :</span>
            <div className="count-down__time">
              <span className="timer__number">{timerTime.minute}</span>
              <span className="timer__middle-sign">:</span>
              <span className="timer__number ">{timerTime.second}</span>
            </div>
          </span>
        ) : (
          ''
        )}
      </div>
      <div className="app-card-authenticate__btns">
        {isExpireAuthenticate ? (
          <Button className="btn btn--caution" label={'재시도'} onClick={startAuthenticate} />
        ) : (
          <>
            <Button className="btn btn--default" label={'취소'} onClick={onClose} />{' '}
            <Button className="btn btn--caution" label={'인증완료'} onClick={onComplete} />
          </>
        )}
      </div>
    </div>
  );
};

AppCardPcAuthenticateInMember.propTypes = {
  onClose: func,
  onComplete: func,
};

export default AppCardPcAuthenticateInMember;
