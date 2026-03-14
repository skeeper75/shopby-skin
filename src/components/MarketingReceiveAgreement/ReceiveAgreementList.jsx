import { func, object } from 'prop-types';

import { Checkbox, useMallStateContext, useMarketingReceiveAgreementStateContext } from '@shopby/react-components';
import { MARKETING_RECEIVE_AGREEMENT_TYPE_MAP } from '@shopby/shared';

import { NOT_USED } from '../../constants/form';

import AgreementResult from './AgreementResult';

const ReceiveAgreementList = ({ emailReceiveInfo, smsReceiveInfo, handleChangeCheckbox }) => {
  const {
    memberJoinConfig: { emailAgreement, smsAgreement },
  } = useMallStateContext();

  const {
    agreementTermStatus: { marketingReceive },
  } = useMarketingReceiveAgreementStateContext();

  if (!marketingReceive.used || (emailAgreement === NOT_USED && smsAgreement === NOT_USED)) {
    return <></>;
  }

  return (
    <ul className="marketing-receive-agreement__sub-list">
      {emailAgreement !== NOT_USED && (
        <li className="marketing-receive-agreement__sub-item">
          <Checkbox
            label={emailReceiveInfo.title}
            checked={emailReceiveInfo.checked}
            onChange={(e) => handleChangeCheckbox(MARKETING_RECEIVE_AGREEMENT_TYPE_MAP.EMAIL, e.target.checked)}
          />
          <AgreementResult
            agreeYmdt={emailReceiveInfo.directMailAgreeYmdt}
            disagreeYmdt={emailReceiveInfo.directMailDisagreeYmdt}
            isAgreed={emailReceiveInfo.originalDirectMailAgreed}
          />
        </li>
      )}
      {smsAgreement !== NOT_USED && (
        <li className="marketing-receive-agreement__sub-item">
          <Checkbox
            label={smsReceiveInfo.title}
            checked={smsReceiveInfo.checked}
            onChange={(e) => handleChangeCheckbox(MARKETING_RECEIVE_AGREEMENT_TYPE_MAP.SMS, e.target.checked)}
          />
          <AgreementResult
            agreeYmdt={smsReceiveInfo.smsAgreeYmdt}
            disagreeYmdt={smsReceiveInfo.smsDisagreeYmdt}
            isAgreed={smsReceiveInfo.originalSmsAgreed}
          />
        </li>
      )}
    </ul>
  );
};

ReceiveAgreementList.propTypes = {
  emailReceiveInfo: object.isRequired,
  smsReceiveInfo: object.isRequired,
  handleChangeCheckbox: func.isRequired,
};

export default ReceiveAgreementList;
