import {
  Quantity,
  useExtraProductOptionStateContext,
  useExtraProductOptionActionContext,
} from '@shopby/react-components';
import { OPTION_TYPE } from '@shopby/shared';

import Sanitized from '../../../components/Sanitized';

import TextOption from './TextOption';

const ExtraProductSelectedOptions = () => {
  const { extraProductsControllers } = useExtraProductOptionStateContext();
  const { changeQuantity, removeOption, fetchExtraProductOptionSelector } = useExtraProductOptionActionContext();

  const canShowExtraProductTextOption = (currentController, controllers) => {
    const isRequiredType = currentController.originOption?.type === OPTION_TYPE.REQUIRED;

    if (!isRequiredType) {
      return true;
    }

    const isRequiredOption = currentController.quantities?.some((quantity) => quantity.isRequiredOption);

    if (isRequiredOption) {
      const sameProductControllers = controllers.filter(
        (controller) => controller.productNo === currentController.productNo
      );

      const hasOptionalController = sameProductControllers.some((controller) => {
        const isOptionalController = !controller.quantities?.some((quantity) => quantity.isRequiredOption);

        const hasOptionController = controller.quantities?.some((quantity) => quantity.count > 0);

        return isOptionalController && hasOptionController;
      });

      return !hasOptionalController;
    }

    return currentController.quantities?.some((quantity) => quantity.count > 0) || false;
  };

  const hasSelectedOptions = extraProductsControllers?.some((controller) => {
    const hasQuantities = controller.quantities?.length > 0;
    const hasTextOptions = controller.textOptions && Object.keys(controller.textOptions).length > 0;

    return hasQuantities || hasTextOptions;
  });

  if (!extraProductsControllers || extraProductsControllers.length === 0 || !hasSelectedOptions) {
    return null;
  }

  return (
    <div className="extra-product__selected-options">
      {extraProductsControllers.map((controller) => (
        <div key={controller.id}>
          {controller.quantities?.map((quantity) => {
            const title =
              controller.originOption?.type !== 'DEFAULT' ? (
                <>
                  <span>
                    <Sanitized html={controller.originOption?.unescapedProductName} />
                  </span>
                  <Sanitized html={`- ${quantity.selectedValues?.join(' | ')}`} className="selected-values" />
                </>
              ) : (
                <Sanitized html={quantity.selectedValues?.join(' | ')} />
              );

            return (
              <div key={`${quantity.labelId}-${quantity.id}`}>
                {/* 수량 정보 */}
                <Quantity
                  count={quantity.count}
                  info={{
                    id: quantity.id,
                    title,
                    price: quantity.calcPrice || 0,
                  }}
                  onChangeValue={(newCount) => {
                    changeQuantity({
                      controllerId: controller.id,
                      labelId: quantity.labelId,
                      optionId: quantity.id,
                      index: quantity.index,
                      variation: 'SET',
                      count: newCount,
                    });
                  }}
                  onDelete={() => {
                    removeOption({
                      controllerId: controller.id,
                      labelId: quantity.labelId,
                      optionId: quantity.id,
                      index: quantity.index,
                    });
                  }}
                />

                {/* 옵션별 텍스트 옵션 START */}
                {controller.textOptions &&
                  Object.values(controller.textOptions).map((textOption) => {
                    if (textOption.optionId === quantity.id) {
                      return (
                        <div key={`${controller.id}-${quantity.id}-${textOption.id}`}>
                          {Object.values(textOption).map((input) => {
                            if (input.inputMatchingType === 'OPTION') {
                              return (
                                <div key={`${controller.id}-${quantity.id}-${textOption.id}-${input.inputNo}`}>
                                  {input.inputs?.map((inputItem) => (
                                    <TextOption
                                      key={`text-option-by-option-${inputItem.id}`}
                                      id={inputItem.id}
                                      inputLabel={input.unescapedInputLabel}
                                      value={inputItem.inputValue}
                                      required={input.required}
                                      vertical={true}
                                      placeholder={`${input.unescapedInputLabel} (을)를 입력하세요.`}
                                      limitCount={{ character: 100 }}
                                      onChange={({ character: { value } }) => {
                                        const updatedController = extraProductsControllers.find(
                                          (c) => c.id === controller.id
                                        );
                                        if (updatedController) {
                                          updatedController.inputTextOption({
                                            value,
                                            optionId: textOption.optionId,
                                            inputNo: input.inputNo,
                                            textOptionId: inputItem.id,
                                            maxLength: 100,
                                          });

                                          fetchExtraProductOptionSelector();
                                        }
                                      }}
                                    />
                                  ))}
                                </div>
                              );
                            }

                            return null;
                          })}
                        </div>
                      );
                    }

                    return null;
                  })}
                {/* 옵션별 텍스트 옵션 END */}
              </div>
            );
          })}

          {/* 상품별 텍스트 옵션 START */}
          {canShowExtraProductTextOption(controller, extraProductsControllers) &&
            controller.textOptions &&
            Object.keys(controller.textOptions)
              .filter((key) => key !== 'optionId') // optionId 제외
              .map((key) => {
                const textOption = controller.textOptions[key];
                return (
                  <div key={`${controller.id}-product-${textOption.id || key}`}>
                    {Object.values(textOption).map((input) => {
                      if (input.inputMatchingType === 'PRODUCT') {
                        return (
                          <div key={`${controller.id}-product-${textOption.id || key}-${input.inputNo}`}>
                            {input.inputs?.map((inputItem) => (
                              <TextOption
                                key={`text-option-by-product-${inputItem.id}`}
                                id={inputItem.id}
                                inputLabel={input.unescapedInputLabel}
                                value={inputItem.inputValue}
                                required={input.required}
                                vertical={true}
                                placeholder={`${input.unescapedInputLabel} (을)를 입력하세요.`}
                                limitCount={{ character: 100 }}
                                onChange={({ character: { value } }) => {
                                  const updatedController = extraProductsControllers.find(
                                    (c) => c.id === controller.id
                                  );

                                  if (updatedController) {
                                    updatedController.inputTextOption({
                                      value,
                                      optionId: textOption.optionId,
                                      inputNo: input.inputNo,
                                      textOptionId: inputItem.id,
                                      maxLength: 100,
                                    });

                                    fetchExtraProductOptionSelector();
                                  }
                                }}
                              />
                            ))}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                );
              })}
          {/* 상품별 텍스트 옵션 END */}
        </div>
      ))}
    </div>
  );
};

export default ExtraProductSelectedOptions;
