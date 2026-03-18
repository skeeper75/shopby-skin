import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { OpenIdSignInProvider, useMallStateContext, useTermsStateContext } from '@shopby/react-components';

import OpenIdSignIn from '../../components/OpenIdSignIn';
import { PI_TERMS_MAP } from '../../constants/common';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const SignUpMenu = () => {
  const { terms } = useTermsStateContext();

  const { state } = useLocation();
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUp'),
  });

  const { openIdJoinConfig } = useMallStateContext();

  return (
    <div className="sign-up-menu">
      <div className="sign-up-menu__link-normal">
        <Link to="/sign-up/form" state={{ ...state }}>
          쇼핑몰 회원가입
        </Link>
      </div>
      {openIdJoinConfig.providers && (
        <div className="sign-up-menu__link-open-id">
          <OpenIdSignInProvider PI_TERMS_MAP={PI_TERMS_MAP} terms={terms}>
            <OpenIdSignIn label="회원가입" providers={openIdJoinConfig.providers} state={{ ...state }} />
          </OpenIdSignInProvider>
        </div>
      )}
    </div>
  );
};

export default SignUpMenu;

SignUpMenu.propTypes = {};
