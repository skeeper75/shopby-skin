import {
  SelectBox,
  useExtraProductOptionStateContext,
  useExtraProductOptionActionContext,
  useProductDetailStateContext,
} from '@shopby/react-components';
import { PURCHASE_OPTION_SALE_TYPE, OPTION_TYPE } from '@shopby/shared';

import Sanitized from '../../../components/Sanitized';

const { TEMP_SOLD_OUT, SOLD_OUT } = PURCHASE_OPTION_SALE_TYPE;

const checkDisabledStatus = ({ saleStatus, optionName, optionValue, type }) => {
  if (saleStatus === TEMP_SOLD_OUT) {
    return {
      disabled: true,
      displayLabel: `[임시품절] ${optionValue}`,
    };
  }

  if (saleStatus === SOLD_OUT) {
    return {
      disabled: true,
      displayLabel: `[품절] ${optionValue}`,
    };
  }

  const displayLabel = type === OPTION_TYPE.DEFAULT ? optionValue : `${optionName} : ${optionValue}`;

  return {
    disabled: false,
    displayLabel,
  };
};

const ExtraProductOptionSelector = () => {
  const { extraProductsControllers } = useExtraProductOptionStateContext();
  const { selectOption } = useExtraProductOptionActionContext();
  const { extraProducts, extraProductTitle } = useProductDetailStateContext();

  if (!extraProducts?.length) {
    return null;
  }

  return (
    <div className="extra-product-purchase__info">
      {extraProducts && extraProducts.length > 0 && (
        <details className="accordion" open>
          <summary className="accordion__title">{extraProductTitle}</summary>
          <div className="extra-product-purchase__options">
            {extraProducts.map((extraProduct) => (
              <div key={extraProduct.productNo} className="extra-product-purchase__options-item">
                <Sanitized html={extraProduct.unescapedProductName} />

                {extraProductsControllers
                  ?.filter((controller) => Number(controller.productNo) === extraProduct.productNo)
                  ?.map((controller) => (
                    <div key={controller.id} className="purchase__option-options-box">
                      {controller.options?.map((option, optionIndex) => {
                        const options = [
                          ...(option.selectedId
                            ? []
                            : [
                                {
                                  value: '',
                                  label: `${
                                    controller.originOption?.type === 'DEFAULT' ? '추가상품' : option.label
                                  }을/를 선택해주세요.`,
                                  disabled: false,
                                },
                              ]),
                          ...(option.children?.map((child) => {
                            const { displayLabel, disabled } = checkDisabledStatus({
                              ...child,
                              type: controller.originOption?.type,
                            });

                            return {
                              value: child.id,
                              label: displayLabel,
                              disabled,
                            };
                          }) || []),
                        ];

                        return (
                          <div key={option.id} className="select select--sm">
                            <SelectBox
                              value={option.selectedId || ''}
                              options={options}
                              onChange={(event) => {
                                const selectedValue = event.currentTarget.value;

                                if (selectedValue) {
                                  const params = {
                                    controllerId: controller.id,
                                    labelId: option.id,
                                    optionId: selectedValue,
                                    selectedId: selectedValue,
                                    index: optionIndex,
                                  };
                                  selectOption(params);
                                }
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default ExtraProductOptionSelector;
