import { lazy } from 'react';
import { isMobile } from 'react-device-detect';

import { func } from 'prop-types';

import { CustomModal } from '@shopby/react-components';

import TitleModal from '../../../components/TitleModal';

const AppCardMobileAuthenticateInMember = lazy(() => import('./AppCardMobileAuthenticateInMember'));
const AppCardPcAuthenticateInMember = lazy(() => import('./AppCardPcAuthenticateInMember'));

const AppCardAuthenticateInMember = ({ onClose, onComplete }) => (
  <div className="app-card-authenticate">
    {isMobile ? (
      <CustomModal className="title-modal--full app-card-authenticate-modal" id="app-card-authenticate-modal">
        <AppCardMobileAuthenticateInMember onClose={onClose} onComplete={onComplete} />
      </CustomModal>
    ) : (
      <TitleModal
        id="app-card-authenticate"
        classModifier="app-card-authenticate"
        title={'QR코드 인증'}
        onClose={onClose}
      >
        <AppCardPcAuthenticateInMember onClose={onClose} onComplete={onComplete} />
      </TitleModal>
    )}
  </div>
);
export default AppCardAuthenticateInMember;

AppCardAuthenticateInMember.propTypes = {
  onClose: func,
  onComplete: func,
};
