import { useEffect, useMemo, useRef, useState } from 'react';

import { string, func } from 'prop-types';

import { SelectBox, VisibleComponent, useTermsActionContext, useTermsStateContext } from '@shopby/react-components';
import { TERMS_HISTORY_KEY_TYPE } from '@shopby/shared';

import { isSameOrAfter } from '../../utils';
import FullModal from '../FullModal';
import Sanitized from '../Sanitized';

const termsHistoryKeys = [TERMS_HISTORY_KEY_TYPE.USE, TERMS_HISTORY_KEY_TYPE.PI_PROCESS];

const TermsDetail = ({ termsKey, content, title, onClose }) => {
  const { termsHistory, termsDetail } = useTermsStateContext();
  const { fetchTermsHistory, fetchTermsDetailV2 } = useTermsActionContext();

  const [termsNo, setTermsNo] = useState(0);

  const contentRef = useRef();

  const requiredHistory = termsHistoryKeys.includes(termsKey);

  const currentTermsHistory = useMemo(
    () =>
      termsHistory[termsKey]?.filter(({ enforcementDate }) => isSameOrAfter({ comparisonDate: enforcementDate }))?.at(),
    [termsHistory]
  );

  const termsHistorySelectOptions = useMemo(
    () =>
      termsHistory[termsKey]?.map(({ termsNo, enforcementDate, termsEnforcementStatusLabel }) => ({
        value: termsNo,
        label: `${enforcementDate}${termsEnforcementStatusLabel ? ` (${termsEnforcementStatusLabel})` : ''}`,
      })),
    [termsHistory]
  );

  const changeTermsNo = (termsNo) => {
    fetchTermsDetailV2({
      termsNo,
      cacheOption: {
        key: termsNo,
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
    setTermsNo(termsNo);
    contentRef?.current?.scrollIntoView();
  };

  useEffect(() => {
    termsHistoryKeys.includes(termsKey) &&
      fetchTermsHistory({
        termsHistoryType: termsKey,
        cacheOption: {
          type: 'MEMORY',
          timeBySeconds: 180,
        },
      });
  }, [termsKey]);

  useEffect(() => {
    currentTermsHistory?.termsNo && changeTermsNo(currentTermsHistory.termsNo);
  }, [currentTermsHistory?.termsNo]);

  return (
    <FullModal className="agreement" title={title} onClose={onClose}>
      <Sanitized ref={contentRef} html={requiredHistory && termsDetail.contents ? termsDetail.contents : content} />
      <VisibleComponent
        shows={termsNo}
        TruthyComponent={
          <SelectBox
            value={termsNo}
            options={termsHistorySelectOptions}
            onSelect={({ currentTarget }) => {
              changeTermsNo(currentTarget.value);
            }}
          />
        }
      />
    </FullModal>
  );
};

export default TermsDetail;

TermsDetail.propTypes = {
  termsKey: string,
  content: string,
  title: string,
  onClose: func,
};
