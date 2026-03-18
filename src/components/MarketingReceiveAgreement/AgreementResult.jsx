import { isNull } from 'lodash-es';
import { bool, string } from 'prop-types';

import { isSignedIn } from '@shopby/shared';

const AgreementResult = ({ agreeYmdt, disagreeYmdt, isAgreed }) => {
  const getAgreementResult = () => {
    if (isNull(isAgreed)) {
      return '-';
    }

    if (isAgreed) {
      return agreeYmdt ? `동의 ${agreeYmdt}` : '동의';
    }

    return disagreeYmdt ? `미동의 ${disagreeYmdt}` : '미동의';
  };

  if (!isSignedIn()) {
    return <></>;
  }

  return (
    <div className="marketing-receive-agreement__sub-item-result">수신동의/거부 결과 : {getAgreementResult()} </div>
  );
};

AgreementResult.propTypes = {
  agreeYmdt: string,
  disagreeYmdt: string,
  isAgreed: bool,
};

export default AgreementResult;
