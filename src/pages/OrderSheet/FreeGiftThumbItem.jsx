import { string, number, func, bool } from 'prop-types';

import { Checkbox, ThumbItem } from '@shopby/react-components';
import { FREE_GIFT_OPTION_COUNT_TYPE, unescapeHTML } from '@shopby/shared';

import OptionLabel from '../../components/OptionLabel';
import Sanitized from '../../components/Sanitized';
import { NO_IMG_URL } from '../../constants/common';

const CommonThumbItem = ({
  mallProductNo,
  mallOptionNo,
  mallProductMainImageUrl,
  productName,
  optionName,
  optionValue,
  className,
}) => {
  const isNoImg = mallProductMainImageUrl.startsWith(NO_IMG_URL);

  const updatedClassName = className + (isNoImg ? ' order-sheet__free-gift-info__no-img' : '');

  return (
    <ThumbItem
      productNo={mallProductNo}
      optionNo={mallOptionNo}
      key={mallOptionNo}
      src={isNoImg ? '' : mallProductMainImageUrl}
      productName={productName}
      optionName={optionName}
      optionValue={optionValue}
      optionInputs={[]}
      optionUsed={true}
      resize={'220x220'}
      activateProductDetailLink={false}
      className={updatedClassName}
    >
      <div className="order-sheet__free-gift-info__product-detail">
        <span className="order-sheet__free-gift-info__product-name">
          <Sanitized html={unescapeHTML(productName)} />
        </span>
        <span className="order-sheet__free-gift-info__option-info">
          <OptionLabel optionName={optionName} optionValue={optionValue} optionInputs={[]} />
        </span>
      </div>
    </ThumbItem>
  );
};

const FreeGiftThumbItem = ({
  mallProductNo,
  mallOptionNo,
  mallProductMainImageUrl,
  productName,
  optionName,
  optionValue,
  freeGiftOptionCountType,
  onChange,
  checked,
  className,
}) => {
  const isSelectType = freeGiftOptionCountType === FREE_GIFT_OPTION_COUNT_TYPE.SELECT;

  return isSelectType ? (
    <Checkbox
      onChange={(e) => onChange(e, mallOptionNo, mallProductNo)}
      className="thumb-item order-sheet__free-gift-info__checkbox"
      checked={checked}
    >
      <CommonThumbItem
        mallProductNo={mallProductNo}
        mallOptionNo={mallOptionNo}
        mallProductMainImageUrl={mallProductMainImageUrl}
        productName={productName}
        optionName={optionName}
        optionValue={optionValue}
        className={className}
      />
    </Checkbox>
  ) : (
    <CommonThumbItem
      mallProductNo={mallProductNo}
      mallOptionNo={mallOptionNo}
      mallProductMainImageUrl={mallProductMainImageUrl}
      productName={productName}
      optionName={optionName}
      optionValue={optionValue}
      className={className}
    />
  );
};

export default FreeGiftThumbItem;

CommonThumbItem.propTypes = {
  mallProductNo: number.isRequired,
  mallOptionNo: number.isRequired,
  mallProductMainImageUrl: string.isRequired,
  productName: string.isRequired,
  optionName: string.isRequired,
  optionValue: string.isRequired,
  className: string,
};

FreeGiftThumbItem.propTypes = {
  freeGiftConditionId: string.isRequired,
  mallProductNo: number.isRequired,
  mallOptionNo: number.isRequired,
  mallProductMainImageUrl: string.isRequired,
  productName: string.isRequired,
  optionName: string.isRequired,
  optionValue: string.isRequired,
  freeGiftOptionCountType: string.isRequired,
  onChange: func.isRequired,
  checked: bool,
  className: string,
};
