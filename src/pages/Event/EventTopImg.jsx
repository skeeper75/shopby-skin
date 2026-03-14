import { string, shape, oneOf } from 'prop-types';

import { getUrlWithAdditionalSearchParams } from '@shopby/shared';

import CustomBanner from '../../components/CustomBanner';
import Sanitized from '../../components/Sanitized';

const EventTopImg = ({ imgInfo, label }) => {
  const { type, url } = imgInfo;

  return (
    <>
      {url && type === 'FILE' ? (
        <CustomBanner
          className="event-hero"
          src={getUrlWithAdditionalSearchParams({
            url,
            additionalSearchParams: '500x500',
          })}
          alt={label}
        />
      ) : (
        <Sanitized html={url} />
      )}
    </>
  );
};

export default EventTopImg;

EventTopImg.propTypes = {
  imgInfo: shape({
    type: oneOf(['HTML', 'FILE']),
    url: string,
  }),
  label: string,
};
