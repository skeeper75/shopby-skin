import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import { string, arrayOf, oneOf, shape, number } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import PersonalInquiryStatus from './PersonalInquiryStatus';

const PersonalInquiryList = ({ items = [] }) => (
  <VisibleComponent
    shows={items.length > 0}
    TruthyComponent={
      <div className="personal-inquiry-list">
        {items.map((item) => {
          const inquiryTypeLabel = item.inquiryTypeInformation.name;

          return (
            <div className="inquiry-item" key={item.inquiryNo}>
              <div className="inquiry-item__top">
                <PersonalInquiryStatus inquiryStatus={item.inquiryStatus} />
                <div className="inquiry-item__top-writer">
                  <span className="inquiry-item__date">{dayjs(item.registerYmdt).format('YYYY-MM-DD')}</span>
                </div>
              </div>

              <Link className="inquiry-item__bottom" to={`/my-page/personal-inquiry/${item.inquiryNo}`}>
                <img
                  src={getUrlWithAdditionalSearchParams({
                    url: item.imageUrls[0],
                    additionalSearchParams: '80x80',
                  })}
                  width="80"
                  alt="3306.png"
                  className=""
                  loading="lazy"
                  onError={(event) => {
                    event.target.src = '//rlyfaazj0.toastcdn.net/no_img.png?80x80';
                  }}
                />
                <div className="inquiry-item__inquiry-info">
                  {inquiryTypeLabel && <p className="inquiry-item__inquiry-type">문의유형 - {inquiryTypeLabel}</p>}
                  <p className="inquiry-item__inquiry-info-title">
                    <span className="font-noto inquiry-item__title">{item.inquiryTitle}</span>
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    }
  />
);

PersonalInquiryList.propTypes = {
  items: arrayOf(
    shape({
      inquiryNo: number,
      inquiryStatus: oneOf(['ISSUED', 'ANSWERED', 'IN_PROGRESS', 'ASKED']),
      inquiryTitle: string,
      inquiryContent: string,
      registerYmdt: string,
      images: arrayOf(
        shape({
          imageUrl: string,
          originFileName: string,
        })
      ),
    })
  ),
};

export default PersonalInquiryList;
