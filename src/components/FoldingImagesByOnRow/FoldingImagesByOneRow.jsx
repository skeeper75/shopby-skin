import { useMemo } from 'react';

import { bool, string, arrayOf, shape, func } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams, classNames } from '@shopby/shared';

import { isImageType } from '../../utils';

const FoldingImagesByOneRow = ({ className = '', isActive = false, images = [], resize, onFileDownload }) => {
  const imageCount = useMemo(() => images.length, [images]);

  const displayImages = useMemo(() => (isActive ? images : [images?.at(0) ?? '']), [images, isActive]) ?? [];

  return (
    <VisibleComponent
      shows={images.length > 0}
      TruthyComponent={
        <div className={`folding-images-by-one-row ${isActive ? 'is-active' : ''} ${className}`}>
          <ul className="folding-images-by-one-row__image-list">
            {displayImages.map(({ src, name }, index) => {
              const isImage = isImageType(src);

              return (
                <li
                  key={`${name}_${index}`}
                  className={classNames({ 'attach-file': !isImage })}
                  onClick={() => (!isImage ? onFileDownload?.(src, name) : null)}
                >
                  {isImage ? (
                    <img
                      src={getUrlWithAdditionalSearchParams({
                        url: src,
                        additionalSearchParams: resize ?? '',
                      })}
                      alt={name}
                    />
                  ) : (
                    <span className="ico ico--clip-16"></span>
                  )}
                </li>
              );
            })}
          </ul>
          <span className="folding-images-by-one-row__image-count">{imageCount}</span>
        </div>
      }
    />
  );
};

FoldingImagesByOneRow.propTypes = {
  className: string,
  isActive: bool,
  images: arrayOf(
    shape({
      src: string,
      name: string,
    })
  ),
  resize: string,
  onFileDownload: func,
};

export default FoldingImagesByOneRow;
