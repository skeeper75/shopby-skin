import {
  SelectBox,
  VisibleComponent,
  useProductOptionActionContext,
  useProductOptionStateContext,
} from '@shopby/react-components';

const OptionSelector = () => {
  const { selectorOptions, originOption } = useProductOptionStateContext();
  const { selectOptionBy } = useProductOptionActionContext();

  return (
    <>
      {selectorOptions.map(({ depthKey, option }) => (
        <VisibleComponent
          key={depthKey}
          shows={originOption?.type !== 'DEFAULT'}
          TruthyComponent={
            <SelectBox
              value={option.selectedOptionDepthKey}
              hasEmptyOption={!option.selectedOptionDepthKey}
              emptyOptionLabel={option.emptyOptionLabel}
              options={option.options?.map((option) => ({
                disabled: option.disabled,
                label: option.displayLabel,
                value: option.optionDepthKey,
              }))}
              onSelect={({ currentTarget }) => {
                selectOptionBy({
                  depthKey,
                  optionDepthKey: currentTarget.value,
                  cacheOption: {
                    type: 'MEMORY',
                    timeBySeconds: 180,
                  },
                });
              }}
            />
          }
        />
      ))}
    </>
  );
};

export default OptionSelector;
