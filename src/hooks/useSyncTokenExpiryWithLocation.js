import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuthStateContext } from '@shopby/react-components';
import { memberAuth, refreshAuth, tokenConfig } from '@shopby/shared';

const useSyncTokenExpiryWithLocation = () => {
  const location = useLocation();
  const { profile } = useAuthStateContext();

  useEffect(() => {
    if (!profile || refreshAuth?.keepLogin() || !tokenConfig?.keepDefaultTokenTime) return;

    const currentAuth = memberAuth.get();

    if (!currentAuth) return;

    memberAuth.set({
      value: currentAuth,
      expires: memberAuth.defaultExpires(), // 엑세스 토큰 기본 유효 기간
    });
  }, [location.pathname, profile]);
};

export default useSyncTokenExpiryWithLocation;
