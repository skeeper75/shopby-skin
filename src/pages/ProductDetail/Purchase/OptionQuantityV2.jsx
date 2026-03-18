import {
  Quantity,
  useProductOptionActionContextV2,
  useProductOptionStateContextV2,
  VisibleComponent,
} from '@shopby/react-components';
import { unescapeHTML } from '@shopby/shared';

import Sanitized from '../../../components/Sanitized';

import TextOption from './TextOption';

const LIMIT_OPTION_COUNT = 100;

const OptionQuantityV2 = () => {
  const { changeCount, removeOption, inputTextOption } = useProductOptionActionContextV2();
  const { quantities, textOptionsByProduct, hasOnlyOneOption } = useProductOptionStateContextV2();

  return (
    <>
      {quantities.map(({ controllerId, options, textOptions, controller }) => (
        <VisibleComponent
          key={controllerId}
          shows={options?.length > 0}
          TruthyComponent={
            <>
              {options?.map(({ id: optionId, count, selectedValues = [], calcPrice = 0 }) => (
                <Quantity
                  key={`quantity-${optionId}`}
                  className={`${hasOnlyOneOption ? 'undeletable' : ''}`}
                  count={count}
                  onChangeValue={(value) => {
                    changeCount({
                      controllerId,
                      optionId,
                      count: Number(value),
                    });
                  }}
                  onDelete={() => {
                    removeOption({
                      controllerId,
                      optionId,
                    });
                  }}
                  info={{
                    id: optionId,
                    title:
                      controller?.originOption?.type !== 'DEFAULT' ? (
                        <>
                          <span>
                            <Sanitized html={controller.originOption?.unescapedProductName} />
                          </span>
                          <span className="selected-values">- {unescapeHTML(selectedValues.join(' | '))}</span>
                        </>
                      ) : (
                        unescapeHTML(selectedValues.join(' | '))
                      ),
                    price: calcPrice ?? 0,
                  }}
                >
                  {/* 옵션별 텍스트 옵션 */}
                  {textOptions.map(({ optionId: textOptionId, inputs }) => (
                    <VisibleComponent
                      key={`text-option-by-option-${textOptionId}`}
                      shows={optionId === textOptionId}
                      TruthyComponent={
                        <>
                          {inputs.map(({ inputs = [] }) =>
                            inputs.map((input) => (
                              <TextOption
                                key={`text-option-by-option-${input.id}`}
                                id={input.id}
                                inputLabel={input.unescapedInputLabel}
                                value={input.inputValue}
                                required={input.required}
                                vertical={true}
                                placeholder={`${input.unescapedInputLabel} (을)를 입력하세요.`}
                                limitCount={{ character: LIMIT_OPTION_COUNT }}
                                onChange={({ character: { value } }) => {
                                  inputTextOption({
                                    controllerId,
                                    value,
                                    optionId,
                                    inputNo: input.inputNo,
                                    textOptionId: input.id,
                                    maxLength: LIMIT_OPTION_COUNT,
                                  });
                                }}
                              />
                            ))
                          )}
                        </>
                      }
                    />
                  ))}
                </Quantity>
              ))}
            </>
          }
        />
      ))}

      {/* 상품별 텍스트 옵션 */}
      {textOptionsByProduct?.map(
        ({ controllerId, id: textOptionId, inputNo, inputValue = '', required, optionId, unescapedInputLabel }) => (
          <TextOption
            key={textOptionId}
            id={textOptionId}
            inputLabel={unescapedInputLabel}
            value={inputValue}
            required={required}
            vertical={true}
            placeholder={`${unescapedInputLabel} (을)를 입력하세요.`}
            limitCount={{ character: LIMIT_OPTION_COUNT }}
            onChange={({ character: { value } }) => {
              inputTextOption({
                controllerId,
                value,
                optionId,
                inputNo,
                maxLength: LIMIT_OPTION_COUNT,
              });
            }}
          />
        )
      )}
    </>
  );
};

export default OptionQuantityV2;
