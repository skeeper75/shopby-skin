import { Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { string, shape, bool } from 'prop-types';

import {
  AuthProvider,
  MallProvider,
  Modal,
  ModalProvider,
  TermsProvider,
  DesignPopupProvider,
  BoardConfigurationProvider,
  NaverShoppingConfigurationProvider,
  OrderConfigProvider,
  EventProviderV2,
  useModalActionContext,
} from '@shopby/react-components';
import { REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION, CLIENT_ERROR, CLIENT_ERROR_MESSAGE } from '@shopby/shared';

import CurrencyWrap from './components/CurrencyWrap';
import { ErrorBoundary } from './components/ErrorBoundary';
import Netfunnel from './components/Netfunnel';
import { TermsContent } from './components/TermsContent';
import useResponsive from './hooks/useResponsive';
import Router from './router';
import { determinePageScriptType } from './utils/externalScript';

const MarketingPrivacyAgreeNotification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAlert } = useModalActionContext();

  useEffect(() => {
    const requireMarketingPrivacyAgreeNotification = sessionStorage.getItem(
      REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION
    );

    if (requireMarketingPrivacyAgreeNotification) {
      sessionStorage.removeItem(REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION);

      openAlert({
        message: CLIENT_ERROR_MESSAGE[CLIENT_ERROR.REQUIRE_MARKETING_PRIVACY_AGREE_NOTIFICATION],
        onClose: () => {
          navigate('/member-modification');
        },
      });
    }
  }, [location]);

  return <></>;
};

const App = ({ clientId, profile, tc }) => {
  const [activeNetfunnel, setActiveNetfunnel] = useState(true);
  const { isMobile, platformType } = useResponsive();

  const location = useLocation();

  useEffect(() => {
    if (!clientId || !profile) {
      return;
    }

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.initialize({
      apiOption: {
        clientId,
        profile,
        platform: platformType,
      },
    });
  }, [clientId, profile, isMobile]);

  useEffect(() => {
    const pageScriptType = determinePageScriptType(location);

    // 외부스크립트, sb객체 등록 기능. 삭제금지
    ShopbyExternalScript?.setPageScriptType(pageScriptType);

    return () => {
      ShopbyExternalScript?.clearGlobalObjectSb();
    };
  }, [location]);

  return (
    <Suspense>
      <ModalProvider>
        <ErrorBoundary>
          <Netfunnel tc={tc} activeNetfunnel={activeNetfunnel} setActiveNetfunnel={setActiveNetfunnel}>
            <MallProvider clientId={clientId} mallProfile={profile}>
              <OrderConfigProvider>
                <BoardConfigurationProvider>
                  <AuthProvider>
                    <TermsProvider termsTypes={['MALL_INTRODUCTION', 'USE', 'PI_PROCESS', 'ACCESS_GUIDE']}>
                      <TermsContent>
                        <CurrencyWrap>
                          <NaverShoppingConfigurationProvider>
                            <DesignPopupProvider>
                              <EventProviderV2>
                                <MarketingPrivacyAgreeNotification />
                                <Router />
                                <Modal />
                              </EventProviderV2>
                            </DesignPopupProvider>
                          </NaverShoppingConfigurationProvider>
                        </CurrencyWrap>
                      </TermsContent>
                    </TermsProvider>
                  </AuthProvider>
                </BoardConfigurationProvider>
              </OrderConfigProvider>
            </MallProvider>
          </Netfunnel>
        </ErrorBoundary>
      </ModalProvider>
    </Suspense>
  );
};
export default App;

App.propTypes = {
  clientId: string.isRequired,
  profile: string.isRequired,
  tc: shape({
    use: bool,
    id: string,
  }),
};
