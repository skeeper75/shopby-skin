import { useEffect, useState } from 'react';

import { func, object } from 'prop-types';

import {
  Checkbox,
  Button,
  useMarketingReceiveAgreementStateContext,
  useMarketingReceiveAgreementActionContext,
  useMallStateContext,
  useAuthStateContext,
} from '@shopby/react-components';
import { MARKETING_RECEIVE_AGREEMENT_TYPE_MAP } from '@shopby/shared';

import { NOT_USED } from '../../constants/form';
import FullModal from '../FullModal';
import Sanitized from '../Sanitized';

import ReceiveAgreementList from './ReceiveAgreementList';

const { MARKETING_INFO_USAGE, MARKETING_RECEIVE, EMAIL, SMS } = MARKETING_RECEIVE_AGREEMENT_TYPE_MAP;

const MarketingReceiveAgreement = ({
  smsReceiveInfo,
  emailReceiveInfo,
  setSmsReceiveInfo,
  setEmailReceiveInfo,
  getTerms,
}) => {
  const {
    memberJoinConfig: { emailAgreement, smsAgreement },
  } = useMallStateContext();
  const { agreementTermStatusList } = useMarketingReceiveAgreementStateContext();
  const { setAgreementTermStatus } = useMarketingReceiveAgreementActionContext();
  const { profile } = useAuthStateContext();
  const showReceiveAgreementList = emailAgreement !== NOT_USED || smsAgreement !== NOT_USED;

  const [termDetail, setTermDetail] = useState({
    title: '',
    contents: '',
  });
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const updateMarketingTermsChecked = (checked) => {
    setAgreementTermStatus((prev) => ({
      ...prev,
      marketingInfoUsage: { ...prev.marketingInfoUsage, checked },
      marketingReceive: { ...prev.marketingReceive, checked },
    }));
  };

  const handleAllCheckbox = (checked) => {
    updateMarketingTermsChecked(checked);

    if (emailAgreement !== NOT_USED) {
      setEmailReceiveInfo(checked);
    }

    if (smsAgreement !== NOT_USED) {
      setSmsReceiveInfo(checked);
    }
  };

  const checkboxHandlerMap = {
    [MARKETING_INFO_USAGE]: {
      handler: handleAllCheckbox,
    },
    [MARKETING_RECEIVE]: {
      handler: handleAllCheckbox,
    },
    [EMAIL]: {
      handler: (checked) => {
        setEmailReceiveInfo(checked);
        checked && updateMarketingTermsChecked(checked);
      },
    },
    [SMS]: {
      handler: (checked) => {
        setSmsReceiveInfo(checked);
        if (!emailReceiveInfo.checked) {
          updateMarketingTermsChecked(checked);
        }
      },
    },
  };

  const handleChangeCheckbox = (key, checked) => {
    checkboxHandlerMap[key].handler(checked);
  };

  useEffect(() => {
    const isEmailUnchecked = emailAgreement === NOT_USED || !emailReceiveInfo.checked;
    const isSmsUnchecked = smsAgreement === NOT_USED || !smsReceiveInfo.checked;

    if (isEmailUnchecked && isSmsUnchecked) {
      setAgreementTermStatus((prev) => ({
        ...prev,
        marketingReceive: { ...prev.marketingReceive, checked: false },
      }));
    }
  }, [emailAgreement, smsAgreement, emailReceiveInfo.checked, smsReceiveInfo.checked]);

  const handleViewTerms = async (termsType, title) => {
    const res = await getTerms({ termsTypes: [termsType] });

    const termsData = res?.[termsType.toLowerCase()];

    if (!termsData?.contents) {
      return;
    }

    setTermDetail({
      title,
      contents: termsData.contents,
    });

    setIsTermsModalOpen(true);
  };

  const getMarketingTerms = async () => {
    const res = await getTerms({
      termsTypes: [MARKETING_INFO_USAGE, MARKETING_RECEIVE],
    });

    setAgreementTermStatus((prev) => ({
      ...prev,
      marketingInfoUsage: {
        ...prev.marketingInfoUsage,
        ...res.marketing_info_usage,
      },
      marketingReceive: {
        ...prev.marketingReceive,
        ...res.marketing_receive,
      },
    }));
  };

  useEffect(() => {
    getMarketingTerms();
  }, []);

  useEffect(() => {
    const hasMarketingInfoUsageAgreement = profile?.agreedTerms?.includes(MARKETING_INFO_USAGE);

    if (hasMarketingInfoUsageAgreement) {
      setAgreementTermStatus((prev) => ({
        ...prev,
        marketingInfoUsage: { ...prev.marketingInfoUsage, checked: true },
      }));
    }
  }, [profile]);

  return (
    <>
      <ul className="marketing-receive-agreement">
        {agreementTermStatusList.map((agreement) => (
          <li key={agreement.key} className="marketing-receive-agreement__item">
            <div className="marketing-receive-agreement__checkbox sign-up-form__checkbox--partial">
              <Checkbox
                label={agreement.title}
                checked={agreement.checked}
                onChange={(e) => handleChangeCheckbox(agreement.key, e.target.checked)}
              />
              {agreement.hasDetailView && (
                <Button label="보기" onClick={() => handleViewTerms(agreement.termsType, agreement.title)} />
              )}
            </div>
          </li>
        ))}
        {showReceiveAgreementList && (
          <li className="marketing-receive-agreement__item">
            <ReceiveAgreementList
              emailReceiveInfo={emailReceiveInfo}
              smsReceiveInfo={smsReceiveInfo}
              handleChangeCheckbox={handleChangeCheckbox}
            />
          </li>
        )}
      </ul>

      {isTermsModalOpen && (
        <FullModal className="agreement" title={termDetail.title} onClose={() => setIsTermsModalOpen(false)}>
          <Sanitized html={termDetail.contents} />
        </FullModal>
      )}
    </>
  );
};

MarketingReceiveAgreement.propTypes = {
  smsReceiveInfo: object.isRequired,
  emailReceiveInfo: object.isRequired,
  setSmsReceiveInfo: func.isRequired,
  setEmailReceiveInfo: func.isRequired,
  getTerms: func.isRequired,
};

export default MarketingReceiveAgreement;
