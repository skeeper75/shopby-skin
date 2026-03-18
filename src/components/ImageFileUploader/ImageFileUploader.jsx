import { useEffect, useState } from 'react';

import { uniqueId, last, isEmpty } from 'lodash-es';
import { array, number, object, func, bool, string } from 'prop-types';

import { ImageFileProvider, Skeleton, useModalActionContext } from '@shopby/react-components';

import ImageFileUpload from '../ImageFileUpload/ImageFileUpload';

const ImageFileUploader = ({
  images = [],
  imageFileUploadRef,
  handleImageChange,
  handleImageUploadButtonClick,
  handleImageDelete,
  usableStorage = false,
  limitCount = 1,
  limitFileSizeInMB = 5,
  accept = 'image/jpg,image/jpeg,image/gif,image/png,image/bmp',
  notices = [],
}) => {
  const { openConfirm } = useModalActionContext();

  const [isLoading, setIsLoading] = useState(false);

  const allowedExtensions = accept.split(',').map((t) => last(t.split('/')));

  useEffect(() => {
    images?.length && setIsLoading(false);
  }, [images]);

  return (
    <div className="image-file-uploader">
      <ImageFileProvider>
        <ImageFileUpload
          usableStorage={usableStorage}
          limitCount={limitCount}
          ref={imageFileUploadRef}
          limitFileSizeInMB={limitFileSizeInMB}
          accept={accept}
          setIsLoading={setIsLoading}
          onChange={handleImageChange}
        />
      </ImageFileProvider>

      {!images?.length && !isLoading && (
        <button
          className={`image-file-uploader__add-btn ${isLoading && 'disabled'}`}
          onClick={handleImageUploadButtonClick}
        ></button>
      )}

      <ul className="image-file-uploader__images">
        {isLoading ? (
          <Skeleton type="SQUARE" />
        ) : (
          images?.map((image) => (
            <li className="image-file-uploader__image" key={uniqueId('image-file-upload-image_')}>
              <img src={`${image.imageUrl}?100x100`} alt={image.originName} loading="lazy" />
              <button
                className="delete"
                onClick={(event) => {
                  openConfirm({
                    message: '첨부파일을 삭제하시겠습니까?',
                    confirmLabel: '삭제',
                    onConfirm: () => {
                      handleImageDelete(event);
                    },
                  });
                }}
              />
            </li>
          ))
        )}
      </ul>

      <ul className="image-file-uploader__notices">
        {isEmpty(notices) ? (
          <>
            <li className="image-file-uploader__notice">
              이미지는 {allowedExtensions.join(', ')} 형식만 등록 가능하며, 용량은 {limitFileSizeInMB}MB로 제한됩니다.
            </li>
            <li className="image-file-uploader__notice">이미지는 {limitCount}개만 등록 가능합니다.</li>
          </>
        ) : (
          notices.map((notice) => (
            <li key={uniqueId('image-file-uploader__notice_')} className="image-file-uploader__notice">
              {notice}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ImageFileUploader;
ImageFileUploader.propTypes = {
  images: array,
  imageFileUploadRef: object.isRequired,
  handleImageChange: func.isRequired,
  handleImageUploadButtonClick: func.isRequired,
  handleImageDelete: func.isRequired,
  usableStorage: bool,
  limitCount: number,
  limitFileSizeInMB: number,
  accept: string,
  notices: array,
};
