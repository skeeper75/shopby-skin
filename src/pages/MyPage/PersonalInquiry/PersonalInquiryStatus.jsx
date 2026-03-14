import { oneOf } from 'prop-types';

import { classNames } from '@shopby/shared';

const inquiryStatusLabelMap = {
  ISSUED: {
    label: '답변대기',
    modifier: 'line-point',
  },
  ASKED: {
    label: '답변대기',
    modifier: 'line-point',
  },
  IN_PROGRESS: {
    label: '답변 진행중',
    modifier: 'line-point',
  },
  ANSWERED: {
    label: '답변완료',
    modifier: '',
  },
};

const PersonalInquiryStatus = ({ inquiryStatus }) => (
  <p
    className={classNames('badge', {
      [`badge--${inquiryStatusLabelMap[inquiryStatus]?.modifier}`]: inquiryStatusLabelMap[inquiryStatus]?.modifier,
    })}
  >
    {inquiryStatusLabelMap[inquiryStatus]?.label}
  </p>
);

export default PersonalInquiryStatus;

PersonalInquiryStatus.propTypes = {
  inquiryStatus: oneOf(['ISSUED', 'ASKED', 'IN_PROGRESS', 'ANSWERED']).isRequired,
};
