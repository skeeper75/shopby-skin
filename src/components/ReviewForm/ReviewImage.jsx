import { useRef, useCallback } from 'react';

import { arrayOf, shape, string, func } from 'prop-types';

import { VisibleComponent, useProductReviewStateContext, Button, ImageFileProvider } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import { REVIEW_IMAGE, BOARD_IMAGE } from '../../constants/image';
import ImageFileUpload from '../ImageFileUpload';

const ReviewImage = ({ images, onChange }) => {
  const imageFileUploadRef = useRef();

  const { reviewConfig } = useProductReviewStateContext();

  const handleImageUploadButtonClick = useCallback(() => {
    imageFileUploadRef.current.click();
  }, [imageFileUploadRef?.current]);

  const handleImagesChange = (selectedImages) => {
    selectedImages.length > 0 && onChange((prev) => [...prev, ...selectedImages]);
  };

  const handleImageDelete = (imageUrl) => {
    onChange((prev) => prev.filter((image) => image.imageUrl !== imageUrl));
  };

  return (
    <>
      <ul className="review-form__image-files">
        {images.map((image, index) => (
          <li key={index} id={`${index}_${image.originName}`} className="review-form__image">
            <img
              src={getUrlWithAdditionalSearchParams({
                url: image.imageUrl,
                additionalSearchParams: BOARD_IMAGE.THUMB_NAIL_SIZE,
              })}
              alt={image.originName}
              loading="lazy"
            />
            <button className="delete" onClick={() => handleImageDelete(image.imageUrl)}></button>
          </li>
        ))}
      </ul>
      <VisibleComponent
        shows={reviewConfig.canAttach}
        TruthyComponent={
          <>
            <ImageFileProvider>
              <ImageFileUpload
                className="review-form__file-upload"
                ref={imageFileUploadRef}
                onChange={handleImagesChange}
                images={images}
                limitFileSizeInMB={REVIEW_IMAGE.LIMIT_MEGA_BYTES}
                limitCount={REVIEW_IMAGE.LIMIT_COUNT}
                usableStorage={true}
              />
            </ImageFileProvider>
            <Button
              className="review-form__upload-btn review-form__btn"
              label="사진 첨부하기"
              onClick={handleImageUploadButtonClick}
            />
            <p className="review-form__limit-text">
              업로드 용량은 {REVIEW_IMAGE.LIMIT_MEGA_BYTES}MB 이하로만 가능 합니다.
            </p>
          </>
        }
      />
    </>
  );
};
export default ReviewImage;
ReviewImage.propTypes = {
  images: arrayOf(
    shape({
      originName: string,
      imageUrl: string,
    })
  ),
  onChange: func,
};
