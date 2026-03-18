import { lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { string, array, bool } from 'prop-types';

import { VisibleComponent, useOpenIdSignInActionContext } from '@shopby/react-components';
const AppCardAuthenticateInMember = lazy(() => import('../AppCardAuthenticate/Member/AppCardAuthenticateInMember'));

const OpenIdSignIn = ({ label, orderSheetNo, providers, reauthenticate = false, keepLogin = false }) => {
  const { openIdSignIn, setPathToLocalStorage, appCardSignIn } = useOpenIdSignInActionContext();
  const { t } = useTranslation('provider');
  const [isAppCardAuthenticateFullModalOpen, setAppCardAuthenticateFullModalOpen] = useState(false);

  const location = useLocation();
  const previousPath = location.state?.from; // 로그인 화면 전 페이지
  const nextPath = location.state?.to; // 로그인 후 이동할 페이지
  const orderSheetPath = orderSheetNo ? orderSheetNo : '';
  const redirectUri = `${window.location.origin}/callback/auth-callback`;

  return (
    <VisibleComponent
      shows={providers?.length > 0}
      TruthyComponent={
        <div className="open-id-sign-in">
          <p className="open-id-sign-in__title">
            <span>간편로그인</span>
          </p>
          <ul className="open-id-sign-in__list">
            {providers
              ?.sort((a, b) => b.charCodeAt(0) - a.charCodeAt(0))
              .map((provider, idx) => (
                <li className={`open-id-sign-in__item type-${provider}`} key={`${idx}_${provider}`}>
                  <button
                    className="open-id-sign-in__link"
                    data-provider={provider}
                    data-action="oauth"
                    onClick={() => {
                      if (provider === 'app-card') {
                        setAppCardAuthenticateFullModalOpen(true);

                        return;
                      }

                      setPathToLocalStorage({ previousPath, nextPath, orderSheetPath });
                      openIdSignIn({ provider, redirectUri, reauthenticate, keepLogin });
                    }}
                  >
                    {t(provider?.toUpperCase())}
                    {provider === 'app-card' ? `로 ${label}` : ` 아이디로 ${label}`}
                  </button>
                </li>
              ))}
          </ul>
          {isAppCardAuthenticateFullModalOpen && (
            <AppCardAuthenticateInMember
              orderSheetPath={orderSheetPath}
              onClose={() => setAppCardAuthenticateFullModalOpen(false)}
              onComplete={() => {
                setPathToLocalStorage({ previousPath: location?.pathname ?? '/', nextPath, orderSheetPath });
                appCardSignIn({ provider: 'app-card', redirectUri });
              }}
            />
          )}
        </div>
      }
    />
  );
};

export default OpenIdSignIn;

OpenIdSignIn.propTypes = {
  label: string,
  providers: array,
  orderSheetNo: string,
  reauthenticate: bool,
  keepLogin: bool,
};
