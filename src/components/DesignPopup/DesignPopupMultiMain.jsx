import { useMemo } from 'react';

import { number, string, bool, shape, oneOf, arrayOf } from 'prop-types';

import { Slide, Slider } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared';

import { SLIDE_DIRECTION_MAP } from '../../constants/designPopup';

const DesignPopupMultiMain = ({
  slideMaxWidth,
  slideMaxHeight,
  slideDirection,
  slideSpeed,
  slideImages,
  canResize,
}) => {
  const mainUrls = slideImages.map(({ mainImageUrl, popupImageNo }) => ({
    mainImageUrl,
    popupImageNo: `main_${popupImageNo}`,
  }));

  const { effect, direction, reverseDirection } = SLIDE_DIRECTION_MAP[slideDirection];

  const resize = useMemo(() => {
    if (!canResize) {
      return '';
    }

    return `${slideMaxWidth}x${slideMaxHeight}`;
  }, [canResize, slideMaxWidth, slideMaxHeight]);

  return (
    <div height={`${slideMaxHeight}px`} style={{ width: `${slideMaxWidth}px`, height: `${slideMaxHeight}px` }}>
      <Slider
        autoHeight={resize}
        effect={effect}
        direction={direction}
        autoplay={{
          delay: (slideSpeed ?? 1) * 1000 || 2500,
          reverseDirection,
        }}
        loop={true}
        slidesPerView="auto"
        style={{ width: `${slideMaxWidth}px`, height: `${slideMaxHeight}px` }}
      >
        {mainUrls?.map((main) => (
          <Slide key={main.popupImageNo} width={`${slideMaxWidth}px`} height={`${slideMaxHeight}px`}>
            <img
              className="design-popup__slide-image"
              src={getUrlWithAdditionalSearchParams({
                url: main.mainImageUrl,
                additionalSearchParams: resize,
              })}
              width={canResize ? `${slideMaxWidth}px` : 'auto'}
              height={canResize ? `${slideMaxHeight}px` : 'auto'}
            />
          </Slide>
        ))}
      </Slider>
    </div>
  );
};

export default DesignPopupMultiMain;

DesignPopupMultiMain.propTypes = {
  canResize: bool,
  slideSpeed: oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  slideMaxWidth: number,
  slideMaxHeight: number,
  slideDirection: oneOf(['FIXED', 'RIGHT', 'LEFT', 'UP', 'DOWN']),
  slideImages: arrayOf(
    shape({
      hasUploaded: bool,
      landingUrl: string,
      mainImageUrl: string,
      openLocationTarget: oneOf(['SELF', 'BLANK']),
      popupImageNo: number,
      thumbImageUrl: string,
      thumbImageUrlOnOver: string,
    })
  ),
};
