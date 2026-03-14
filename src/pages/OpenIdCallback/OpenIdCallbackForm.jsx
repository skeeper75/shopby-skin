import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import {
  useOpenIdSignInActionContext,
  useOpenIdSignInValueContext,
  useSignInActionContext,
  useModalActionContext,
  useAuthActionContext,
  CustomTermsProvider,
  useTermsActionContext,
} from '@shopby/react-components';
import { CLIENT_ERROR, isSignedIn, memberAuth } from '@shopby/shared';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { PI_TERMS_KEYS } from '../../constants/common';

import OpenIdSignUpAgreement from './OpenIdSignUpAgreement';
import OpenIdSignUpKakaosync from './OpenIdSignUpKakaosync';

const OpenIdCallbackForm = () => {
  const { fetchTerms } = useTermsActionContext();
  const {
    // getOauthOpenId,
    postOauthOpenId,
    getProfile,
    getPathFromLocalStorage,
    removePath,
    getOauthIdNoToLocalStorage,
    setOauthCompareResultToLocalStorage,
    removeOauthIdNo,
    updateIsAgreement,
    updateIsKakaosync,
    updateOauthOpenId,
  } = useOpenIdSignInActionContext();
  const { signOut } = useAuthActionContext();
  const { reactivateDormantAccount } = useSignInActionContext();
  const { isAgreement, isKakaosync, profileInfo, openIdInfo } = useOpenIdSignInValueContext();

  const { openAlert, openConfirm } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const code = params.get('code');
  const state = params.get('state');
  const redirectUri = `${window.location.origin}/callback/auth-callback`;

  const pathObject = getPathFromLocalStorage();
  const orderSheetNo = pathObject.orderSheetPath;
  const previousPath = pathObject.previousPath ? pathObject.previousPath : '/';
  const nextPath = pathObject.nextPath ? pathObject.nextPath : '/';

  const previousOauthIdNo = getOauthIdNoToLocalStorage();

  const reactivate = async ({ accessToken, ...rest }) => {
    try {
      await reactivateDormantAccount({ authType: 'NONE', accessToken, ...rest });

      openAlert({
        message: '휴면해제 되었습니다.',
        onClose: async () => {
          await getProfile();
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    const divideProfileStatus = async () => {
      try {
        const {
          data: { isDormantMember, accessToken, ...rest },
        } = await postOauthOpenId({ code, redirectUri });

        if (isDormantMember) {
          openConfirm({
            message: (
              <>
                장기 미접속으로 인해 휴면회원 전환 상태입니다. <br />
                휴면해제 하시겠습니까?
              </>
            ),
            confirmLabel: '확인',
            onConfirm: () => reactivate({ accessToken, refreshExpiresInSeconds: rest.refreshTokenExpiresIn, ...rest }),
            onCancel: async () => {
              await signOut();

              window.location.href = '/';
            },
          });

          return;
        }

        await getProfile();
      } catch (error) {
        if (error?.error?.code === CLIENT_ERROR.APP_CARD_NOT_AUTHORIZATION) {
          catchError(error);

          return;
        }

        await signOut();
        window.location.href = '/';
      }
    };

    const authCallBackOpenId = () => {
      if (code) {
        if (!isSignedIn()) {
          divideProfileStatus();
        } else {
          updateOauthOpenId({
            redirectUri,
            code,
            provider: localStorage.getItem('provider'),
            state,
          }).then(({ data }) => {
            const { accessToken } = data;
            memberAuth.set({ value: accessToken });
            sessionStorage.setItem('MY_PAGE_TOKEN', accessToken);

            navigate(previousPath, {
              state: {
                shouldRoute: true,
              },
              replace: true,
            });
          });
        }
      }
    };

    authCallBackOpenId();
  }, []);

  useEffect(() => {
    if (profileInfo.memberStatus === 'WAITING' && openIdInfo.ordinaryMemberResponse.signUpDateTime) {
      updateIsKakaosync(true);
    } else if (profileInfo.memberStatus === 'WAITING') {
      updateIsAgreement(true);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo.memberStatus === 'ACTIVE' && !!orderSheetNo) {
      window.location.href = `${window.location.origin}/order/${orderSheetNo}`;
      removePath();
    } else if (profileInfo.memberStatus === 'ACTIVE' && previousPath === '/adult-certification') {
      navigate(`${nextPath}`, {
        state: {
          from: nextPath,
          to: previousPath,
        },
      });
      removePath();
    } else if (profileInfo.memberStatus === 'ACTIVE') {
      navigate(`${previousPath}`, {
        state: {
          from: previousPath,
          to: nextPath,
        },
      });
      removePath();
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo.oauthIdNo !== '' && previousOauthIdNo && previousOauthIdNo !== profileInfo.oauthIdNo) {
      setOauthCompareResultToLocalStorage(false);
      removeOauthIdNo();
    } else if (profileInfo.oauthIdNo !== '' && previousOauthIdNo === profileInfo.oauthIdNo) {
      setOauthCompareResultToLocalStorage(true);
      removeOauthIdNo();
    }
  }, [profileInfo]);

  useEffect(() => {
    if (isAgreement || isKakaosync) {
      fetchTerms(PI_TERMS_KEYS);
    }
  }, [isAgreement, isKakaosync]);

  return (
    <>
      {isAgreement && (
        <>
          <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
            <OpenIdSignUpAgreement orderSheetNo={orderSheetNo} previousPath={previousPath} nextPath={nextPath} />
          </CustomTermsProvider>
        </>
      )}
      {isKakaosync && (
        <>
          <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
            <OpenIdSignUpKakaosync orderSheetNo={orderSheetNo} previousPath={previousPath} nextPath={nextPath} />
          </CustomTermsProvider>
        </>
      )}
    </>
  );
};

export default OpenIdCallbackForm;
