import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

import { bool, func } from 'prop-types';

import {
  SignInButton,
  useSignInActionContext,
  useSignInValueContext,
  Button,
  VisibleComponent,
  useMallStateContext,
  useModalActionContext,
  useAuthActionContext,
  CheckMemberPasswordProvider,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal';
import OpenIdSignIn from '../../components/OpenIdSignIn';
import PasswordChanger from '../../components/PasswordChanger';

// Huni Design System Components
import { TextField } from '../../design-system/components/molecules/TextField/TextField';
import { Field } from '../../design-system/components/molecules/Field/Field';
import { Icon } from '../../components/ui/Icon';
import { Divider } from '../../components/ui/Divider';

const SignInForm = ({ usesOnlySignIn = false, onSignIn }) => {
  const { state } = useLocation();

  const { t } = useTranslation('auth');
  const {
    updateSignInInfo,
    updateGuestOrderInfo,
    signIn,
    updateHasGuestOrderSheetUrl,
    searchGuestOrders,
    reactivateDormantAccount,
  } = useSignInActionContext();
  const { signOut, isSignedIn } = useAuthActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const {
    signInInfo: { memberId, password, keepLogin },
    guestOrderInfo: { orderNo, orderPassword },
    hasGuestOrderSheetUrl,
    isDormantMember,
    daysFromLastPasswordChange,
    // TODO: 스킨에서 비밀번호 변경 및 휴면회원 페이지 이동전에 안내 할것인지 확인 필요
  } = useSignInValueContext();
  const { openIdJoinConfig, mallName } = useMallStateContext();

  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleMemberIdChange = ({ currentTarget: { value } }) => {
    updateSignInInfo({ memberId: value });
  };

  const handlePasswordChange = ({ currentTarget: { value } }) => {
    updateSignInInfo({ password: value });
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      signIn({ memberId, password });
    }
  };

  const handleOrderNoChange = ({ currentTarget: { value } }) => {
    updateGuestOrderInfo({ orderNo: value });
  };

  const handleOrderPasswordChange = ({ currentTarget: { value } }) => {
    updateGuestOrderInfo({ orderPassword: value });
  };

  const handleOrderPasswordKeyDown = async (e) => {
    try {
      if (e.key === 'Enter') {
        await searchGuestOrders({ orderNo, password: orderPassword, orderRequestType: 'ALL' });
        location.href = `/orders/${orderNo}`;
      }
    } catch (e) {
      catchError(e);
    }
  };

  const handleSearchGuestOrdersBtnClick = async () => {
    try {
      await searchGuestOrders({ orderNo, password: orderPassword, orderRequestType: 'ALL' });
      location.href = `/orders/${orderNo}`;
    } catch (e) {
      catchError(e);
    }
  };

  const [params] = useSearchParams();
  const orderSheetNo = params.get('orderSheetNo') ?? state?.orderSheetNo;

  useEffect(() => {
    if (orderSheetNo) {
      updateHasGuestOrderSheetUrl(true);
    }
  }, [orderSheetNo]);

  const locationPage = () => {
    location.state = {
      from: `${location.pathname}${location.search}`,
      to: state?.to,
    };

    if (onSignIn) {
      onSignIn();
    } else if (orderSheetNo) {
      location.href = `/order/${orderSheetNo}`;
    } else {
      const _state = {
        ...location.state,
        ...state,
      };
      const from = _state?.from?.includes('sign-in') ? '/' : _state?.from;

      location.replace(from ?? '/');
    }
  };

  const reactivate = async () => {
    try {
      await reactivateDormantAccount({ authType: 'NONE' });

      openAlert({
        message: '휴면해제 되었습니다.',
        onClose: locationPage,
      });
    } catch (e) {
      catchError(e);
    }
  };

  const passwordHandler = () => {
    if (daysFromLastPasswordChange > 90) {
      setIsOpen(true);
    } else {
      locationPage();
    }
  };

  const dormantMemberHandler = () => {
    if (!isDormantMember) {
      passwordHandler();

      return;
    }

    openConfirm({
      message: (
        <>
          장기 미접속으로 인해 휴면회원 전환 상태입니다. <br />
          휴면해제 하시겠습니까?
        </>
      ),
      confirmLabel: '확인',
      onConfirm: () => reactivate(),
      onCancel: async () => {
        try {
          await signOut();

          window.location.href = '/';
        } catch (e) {
          catchError(e);
        }
      },
    });
  };

  const closePasswordChangerModal = () => {
    setIsOpen(false);
    locationPage();
  };

  useEffect(() => {
    if (!isSignedIn()) return;

    dormantMemberHandler();
  }, [isSignedIn()]);

  return (
    <>
      <section className="sign-in">
        <div className="normal-sign-in">
          {/* 이메일 필드 - Huni Field + TextField */}
          <div className="normal-sign-in__input-wrap">
            <Field.Root required>
              <Field.Label>아이디</Field.Label>
              <Field.Control>
                <TextField.Root>
                  <TextField.Input
                    name="memberId"
                    placeholder="아이디"
                    onChange={handleMemberIdChange}
                    value={memberId}
                  />
                </TextField.Root>
              </Field.Control>
            </Field.Root>
          </div>

          {/* 비밀번호 필드 - Huni Field + TextField + eye toggle */}
          <div className="normal-sign-in__input-wrap">
            <Field.Root required>
              <Field.Label>비밀번호</Field.Label>
              <Field.Control>
                <TextField.Root>
                  <TextField.Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호"
                    onChange={handlePasswordChange}
                    onKeyDown={handlePasswordKeyDown}
                    autoComplete="off"
                  />
                  <TextField.SuffixIcon>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex items-center justify-center cursor-pointer"
                    >
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                    </button>
                  </TextField.SuffixIcon>
                </TextField.Root>
              </Field.Control>
            </Field.Root>
          </div>

          <SignInButton label={t('signIn')} onError={(e) => catchError(e)} />
        </div>

        <div className="sign-in-link">
          <Link className="sign-in-link__item" to="/find-id">
            아이디찾기
          </Link>
          <Link className="sign-in-link__item" to="/find-password">
            비밀번호찾기
          </Link>
          <Link className="sign-in-link__item" to="/sign-up" state={{ ...state }}>
            회원가입
          </Link>
        </div>

        <VisibleComponent
          shows={!usesOnlySignIn}
          TruthyComponent={
            <>
              {hasGuestOrderSheetUrl && (
                <Link className="guest-order-link" to={`/order/${orderSheetNo}`} state={{ ...state, orderSheetNo }}>
                  비회원 주문하기
                </Link>
              )}

              {!hasGuestOrderSheetUrl && (
                <div className="guest-order">
                  <p className="guest-order__title">비회원 주문조회 하기</p>

                  {/* 주문번호 필드 - Huni Field + TextField */}
                  <div className="guest-order__input-wrap">
                    <Field.Root>
                      <Field.Label>주문번호</Field.Label>
                      <Field.Control>
                        <TextField.Root>
                          <TextField.Input
                            name="orderNo"
                            placeholder="주문번호 입력"
                            onChange={handleOrderNoChange}
                            value={orderNo}
                          />
                        </TextField.Root>
                      </Field.Control>
                    </Field.Root>
                  </div>

                  {/* 주문비밀번호 필드 - Huni Field + TextField (type="password") */}
                  <div className="guest-order__input-wrap">
                    <Field.Root>
                      <Field.Label>주문 비밀번호</Field.Label>
                      <Field.Control>
                        <TextField.Root>
                          <TextField.Input
                            name="orderPassword"
                            type="password"
                            placeholder="주문번호 비밀번호 입력"
                            onChange={handleOrderPasswordChange}
                            onKeyDown={handleOrderPasswordKeyDown}
                            autoComplete="off"
                          />
                        </TextField.Root>
                      </Field.Control>
                    </Field.Root>
                  </div>

                  {/* TODO: Button을 Huni Button으로 마이그레이션 필요 */}
                  <Button label="조회하기" onClick={handleSearchGuestOrdersBtnClick} />
                </div>
              )}
            </>
          }
        />
        {openIdJoinConfig.providers && (
          <div className="sign-in-open-id">
            <div className="sign-in-open-id__divider" aria-hidden="true">
              <Divider />
              <span className="sign-in-open-id__divider-text">또는 간편로그인</span>
              <Divider />
            </div>
            <OpenIdSignIn
              label="로그인"
              orderSheetNo={orderSheetNo}
              providers={openIdJoinConfig.providers}
              state={{ ...state }}
              keepLogin={keepLogin}
            />
          </div>
        )}
      </section>
      <VisibleComponent
        shows={isOpen}
        TruthyComponent={
          <FullModal title="비밀번호 변경">
            <div className="long-term-notice">
              <div className="long-term-notice__content">
                <h3 className="long-term-notice__title">회원님의 비밀번호를 변경해 주세요.</h3>
                <p className="long-term-notice__text">
                  회원님께서는 장기간 비밀번호를 변경하지 않고, 동일한 비밀번호를 사용 중이십니다.
                </p>
                <span className="long-term-notice__description">
                  {mallName}에서는 회워님의 소중한 개인정보를 보호하기 위하여 비밀번호 변경을 안내해드리고 있습니다.
                  <br />
                  정기적인 비밀번호 변경으로 회원님의 개인정보를 보호해 주세요.
                </span>
              </div>
              <CheckMemberPasswordProvider>
                <PasswordChanger
                  useNextChanger={true}
                  onSubmit={closePasswordChangerModal}
                  onNext={closePasswordChangerModal}
                />
              </CheckMemberPasswordProvider>
            </div>
          </FullModal>
        }
      />
    </>
  );
};
export default SignInForm;
SignInForm.propTypes = {
  usesOnlySignIn: bool,
  onSignIn: func,
};
