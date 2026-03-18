import {
  SelectBox,
  useProductOptionActionContextV2,
  useProductOptionStateContextV2,
  VisibleComponent,
} from '@shopby/react-components';

const checkDisabledStatus = ({ forcedSoldOut, saleStatus, label, value }) => {
  if (forcedSoldOut) {
    return {
      disabled: true,
      displayLabel: `[임시품절] ${value}`,
    };
  }

  /**
   * FIXME:
   * SOLDOUT는 API에서 내려주는 데이터
   * SOLD_OUT는 shared에서 가공해서 내려주는 데이터
   * 현재 여력이 없어 우선 둘다 체크하도록 수정
   * 나중에 코드 내려오는 데이터 분석해서 일치시켜야함
   */
  if (saleStatus === 'SOLDOUT' || saleStatus === 'SOLD_OUT') {
    return {
      disabled: true,
      displayLabel: `[품절] ${value}`,
    };
  }

  return {
    disabled: false,
    displayLabel: `${label} : ${value}`,
  };
};

const OptionSelectorV2 = () => {
  const { selectOption } = useProductOptionActionContextV2();
  const { optionSelectors } = useProductOptionStateContextV2();

  return (
    <>
      {optionSelectors.map(({ controllerId, optionUsed, options }) => (
        <VisibleComponent
          key={controllerId}
          shows={optionUsed}
          TruthyComponent={options.map(({ id: labelId, selectedId, children, label }, index) => (
            <SelectBox
              key={labelId}
              value={selectedId}
              options={children?.map(({ id: optionId, ...child }) => {
                const { disabled, displayLabel } = checkDisabledStatus(child);

                return {
                  disabled,
                  label: displayLabel,
                  value: optionId,
                };
              })}
              hasEmptyOption={!selectedId}
              emptyOptionLabel={
                children?.length > 0
                  ? `${label}을/를 선택해주세요.`
                  : `${options[index - 1].label}을/를 먼저 선택해주세요.`
              }
              onSelect={({ currentTarget }) => {
                selectOption({
                  controllerId,
                  labelId,
                  optionId: currentTarget.value,
                  index,
                });
              }}
            />
          ))}
        />
      ))}
    </>
  );
};

export default OptionSelectorV2;
