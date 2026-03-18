import { string, arrayOf, shape, func, oneOf, number } from 'prop-types';

import { VisibleComponent, SelectBox } from '@shopby/react-components';
import { unescapeHTML } from '@shopby/shared';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import { BOARD_IMAGE } from '../../constants/image';
import Sanitized from '../Sanitized';

const BoardProductItem = ({
  productName,
  productImageUrl,
  productImageUrlType = 'IMAGE_URL',
  options = [],
  onSelect,
  optionDisplayLabel,
  optionNo,
  className = '',
}) => {
  const handleOptionSelect = ({ currentTarget: { value } }) => {
    const selectedOptionNo = Number(value);

    selectedOptionNo > 0 && onSelect?.(selectedOptionNo);
  };

  return (
    <div className={`l-panel board-product-item__description ${className}`}>
      <div className="board-product-item__image">
        {productImageUrlType === 'IMAGE_URL' ? (
          <img
            src={getUrlWithAdditionalSearchParams({
              url: productImageUrl,
              additionalSearchParams: BOARD_IMAGE.THUMB_NAIL_SIZE,
            })}
            alt={productName}
            loading="lazy"
          />
        ) : (
          <div className="thumb-LIST">
            <div className="thumb-item product-thumb-item">
              <div className="thumb-item__media">
                <span className="thumb-item__img">
                  <div className="video-cover"></div>
                  <iframe src={productImageUrl} width="100%" height="100%" frameBorder="0" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="board-product-item__product">
        <em className="board-product-item__product-name">
          <Sanitized html={productName} />
        </em>
        <VisibleComponent
          shows={options?.length > 1}
          TruthyComponent={
            <SelectBox
              onSelect={handleOptionSelect}
              options={options}
              value={optionNo}
              className="board-product-item__option-selector"
            />
          }
          FalsyComponent={<p className={`board-product-item__option-value`}>{unescapeHTML(optionDisplayLabel)}</p>}
        />
      </div>
    </div>
  );
};

export default BoardProductItem;

BoardProductItem.propTypes = {
  productName: string.isRequired,
  productImageUrl: string.isRequired,
  options: arrayOf(
    shape({
      value: oneOf(['string', 'number']),
      label: string,
    })
  ),
  onSelect: func,
  optionDisplayLabel: string,
  optionNo: number,
  className: string,
  productImageUrlType: string,
};
