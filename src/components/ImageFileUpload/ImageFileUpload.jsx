import { forwardRef } from 'react';

import { func, arrayOf, shape, number, string, bool } from 'prop-types';

import { useImageFileActionContext } from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../ErrorBoundary';

const ImageFileUpload = forwardRef(
  (
    {
      images = [],
      limitCount = Infinity,
      limitFileSizeInMB = Infinity,
      verifyImageFiles,
      onChange,
      accept = 'image/*',
      usableStorage = false,
      setIsLoading,
    },
    ref
  ) => {
    const { catchError } = useErrorBoundaryActionContext();
    const { postImages, saveStorageImages } = useImageFileActionContext();
    const saveImages = usableStorage ? saveStorageImages : postImages;

    const handleInputChange = async (event) => {
      setIsLoading?.(true);

      try {
        const { files } = event.target;

        verifyImageFiles?.(files);

        const { data } = await saveImages({
          files,
          images,
          limitFileSizeInMegaBytes: limitFileSizeInMB,
          limitCount,
          accept,
        });

        const fulfilledImages = data.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);

        onChange?.(fulfilledImages);

        ref.current.value = '';

        const rejectedReason = data.filter(({ status }) => status === 'rejected')?.[0]?.reason;
        rejectedReason && catchError(rejectedReason);
      } catch (e) {
        catchError(e);
      } finally {
        setIsLoading?.(false);
      }
    };

    return <input hidden ref={ref} type="file" multiple accept={accept} onChange={handleInputChange} />;
  }
);

ImageFileUpload.displayName = 'ImageFileUpload';

export default ImageFileUpload;

ImageFileUpload.propTypes = {
  images: arrayOf(
    shape({
      imageUrl: string,
      originName: string,
    })
  ),
  onChange: func,
  verifyImageFiles: func,
  limitCount: number,
  limitFileSizeInMB: number,
  accept: string,
  usableStorage: bool,
  setIsLoading: func,
};
