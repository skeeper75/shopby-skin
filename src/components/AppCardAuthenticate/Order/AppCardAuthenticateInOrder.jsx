import { lazy } from 'react';
import { isMobile } from 'react-device-detect';

import { func } from 'prop-types';

import { CustomModal } from '@shopby/react-components';

import TitleModal from '../../../components/TitleModal';

const AppCardMobileAuthenticateInOrder = lazy(() => import('./AppCardMobileAuthenticateInOrder'));
const AppCardPcAuthenticateInOrder = lazy(() => import('./AppCardPcAuthenticateInOrder'));

const AppCardAuthenticateInOrder = ({ onClose, onComplete, onRetry }) => (
  <div className="app-card-authenticate">
    {isMobile ? (
      <CustomModal className="title-modal--full app-card-authenticate-modal" id="app-card-authenticate-modal">
        <AppCardMobileAuthenticateInOrder onClose={onClose} onComplete={onComplete} onRetry={onRetry} />
      </CustomModal>
    ) : (
      <TitleModal
        id="app-card-authenticate"
        classModifier="app-card-authenticate"
        title={'QR코드 인증'}
        onClose={onClose}
      >
        <AppCardPcAuthenticateInOrder onClose={onClose} onRetry={onRetry} />
      </TitleModal>
    )}
  </div>
);

AppCardAuthenticateInOrder.propTypes = {
  onClose: func,
  onComplete: func,
  onRetry: func,
};

export default AppCardAuthenticateInOrder;
