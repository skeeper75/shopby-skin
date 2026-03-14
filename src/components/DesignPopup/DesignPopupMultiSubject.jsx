import { useMemo, useState } from 'react';

import { number, string, bool, shape, oneOf, arrayOf } from 'prop-types';

import { getUrlWithAdditionalSearchParams } from '@shopby/shared';

import { SLIDE_COUNT_MAP } from '../../constants/designPopup';

const SubjectItem = ({
  thumbImageUrl,
  thumbImageUrlOnOver,
  landingUrl,
  openLocationTarget,
  slideMinWidth,
  slideMinHeight,
  canResize,
}) => {
  const [imageUrl, setImageUrl] = useState(thumbImageUrl);

  const handleMouseEnter = () => {
    setImageUrl(thumbImageUrlOnOver);
  };

  const handleMouseLeave = () => {
    setImageUrl(thumbImageUrl);
  };

  const resize = useMemo(() => {
    if (!canResize) {
      return '';
    }

    return `${slideMinWidth}x${slideMinHeight}`;
  }, [canResize, slideMinWidth, slideMinHeight]);

  return (
    <a
      href={landingUrl}
      target={`_${openLocationTarget?.toLowerCase()}`}
      className="design-popup__subject-item"
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
    >
      <img
        className="design-popup__slide-image"
        src={getUrlWithAdditionalSearchParams({
          url: imageUrl,
          additionalSearchParams: resize,
        })}
        width={canResize ? `${slideMinWidth}px` : 'auto'}
        height={canResize ? `${slideMinHeight}px` : 'auto'}
      />
    </a>
  );
};

SubjectItem.propTypes = {
  thumbImageUrl: string,
  thumbImageUrlOnOver: string,
  slideMinWidth: number,
  slideMinHeight: number,
  landingUrl: string,
  openLocationTarget: oneOf(['SELF', 'BLANK']),
  canResize: bool,
};

const getGridInformation = (slideCount) => ({
  gridTemplateRows: `repeat(${SLIDE_COUNT_MAP[slideCount.split('_BY_').at(1)]}, 1fr)`,
  gridTemplateColumns: `repeat(${SLIDE_COUNT_MAP[slideCount.split('_BY_').at(0)]}, 1fr)`,
});

const DesignPopupMultiSubject = ({ slideImages, slideCount, slideMinWidth, slideMinHeight, canResize }) => {
  const thumbImageUrls = slideImages.map(({ thumbImageUrl, thumbImageUrlOnOver, popupImageNo, landingUrl }) => ({
    thumbImageUrl,
    thumbImageUrlOnOver,
    popupImageNo: `thumb_${popupImageNo}`,
    landingUrl,
  }));

  const { gridTemplateRows, gridTemplateColumns } = getGridInformation(slideCount);

  return (
    <div
      className="design-popup__thumb-image"
      style={{
        display: 'grid',
        gridTemplateRows,
        gridTemplateColumns,
        width: `${slideMinWidth}px`,
        height: `${slideMinHeight}px`,
      }}
    >
      {thumbImageUrls?.map((url) => (
        // console.log(url);

        <SubjectItem
          key={url.popupImageNo}
          {...url}
          slideMinWidth={slideMinWidth}
          slideMinHeight={slideMinHeight}
          canResize={canResize}
        />
      ))}
    </div>
  );
};

export default DesignPopupMultiSubject;

DesignPopupMultiSubject.propTypes = {
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
  slideCount: oneOf(['TWO_BY_ONE', 'THREE_BY_ONE', 'FOUR_BY_ONE', 'TWO_BY_TWO', 'THREE_BY_TWO', 'FOUR_BY_TWO']),
  slideMinWidth: number,
  slideMinHeight: number,
  canResize: bool,
};
