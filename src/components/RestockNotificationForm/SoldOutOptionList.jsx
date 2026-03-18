import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Checkbox,
  useProductOptionStateContextV2,
  useRestockNotificationActionContext,
  useRestockNotificationStateContext,
} from '@shopby/react-components';
import { getSaleStatus, getSoldOutOptionLabels, OPTION_TYPE, PURCHASE_OPTION_SALE_TYPE } from '@shopby/shared';

const displaySoldOutOption = (optionName, optionValue) =>
  getSoldOutOptionLabels({ optionName, optionValue }).join(' | ');

const SoldOutOptionList = () => {
  const [searchParams] = useSearchParams();

  const productNo = Number(searchParams.get('productNo'));

  const { options } = useProductOptionStateContextV2();
  const { selectedOptionNos } = useRestockNotificationStateContext();
  const { updateSelectedOptionNos } = useRestockNotificationActionContext();

  const soldOutOptionList = useMemo(
    () =>
      options?.[productNo]?.flatOptions.filter(
        (option) => getSaleStatus(option) === PURCHASE_OPTION_SALE_TYPE.SOLD_OUT
      ),
    [productNo, options]
  );

  const type = useMemo(() => options?.[productNo]?.type, [productNo, options]);

  const handleOptionChange = (e, optionNo) => {
    const { checked } = e.target;
    if (checked) {
      updateSelectedOptionNos((prev) => [...prev, optionNo]);
    } else {
      updateSelectedOptionNos((prev) => prev.filter((no) => no !== optionNo));
    }
  };

  useEffect(() => {
    if (!type || type !== OPTION_TYPE.DEFAULT) return;

    updateSelectedOptionNos(soldOutOptionList.map((option) => option.optionNo));
  }, [type, soldOutOptionList]);

  return (
    <div className="restock-notification-form__sold-out-option">
      {type !== OPTION_TYPE.DEFAULT && (
        <div className="restock-notification-form__sold-out-option__description">품절 옵션 리스트</div>
      )}
      <section className="restock-notification-form__sold-out-option__wrap">
        {type === OPTION_TYPE.DEFAULT ? (
          <div className="restock-notification-form__sold-out-option__product-name">{soldOutOptionList[0]?.label}</div>
        ) : (
          <div className="restock-notification-form__sold-out-option__list">
            {soldOutOptionList?.map((option) => (
              <label className="form-check form-check--sm" key={option.optionNo}>
                <Checkbox
                  checked={selectedOptionNos.includes(option.optionNo)}
                  onChange={(e) => handleOptionChange(e, option.optionNo)}
                  value={option.optionNo}
                />
                <span className="form-check__label">
                  {type === OPTION_TYPE.MAPPING ? option.label : displaySoldOutOption(option.label, option.value)}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

SoldOutOptionList.propTypes = {};

export default SoldOutOptionList;
