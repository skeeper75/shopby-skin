import { useMemo } from 'react';

import { shape, string } from 'prop-types';

import { VisibleComponent } from '@shopby/react-components';

import OptionLabel from '../../components/OptionLabel';
import Sanitized from '../../components/Sanitized';

const ClaimOrderOptionLabel = ({ claimOrderOption }) => {
  const optionInputs = useMemo(() => {
    if (!claimOrderOption.userInputTextStr) return [];

    return claimOrderOption.userInputTextStr.split('|').map((token) => {
      const [inputLabel, inputValue] = token.split(' : ');

      return { inputLabel, inputValue };
    });
  }, [claimOrderOption.userInputTextStr]);

  return (
    <div>
      <p>
        <Sanitized html={`(수량: ${claimOrderOption.orderCnt}개) ${claimOrderOption.unescapedProductName}`} />
      </p>
      <VisibleComponent
        shows={claimOrderOption.usesOption}
        TruthyComponent={
          <OptionLabel
            optionName={claimOrderOption.optionName}
            optionValue={claimOrderOption.optionValue}
            optionInputs={optionInputs}
          />
        }
      />
    </div>
  );
};

export default ClaimOrderOptionLabel;

ClaimOrderOptionLabel.propTypes = {
  claimOrderOption: shape({
    productName: string,
    optionName: string,
    optionValue: string,
    orderCnt: string,
    useInputTextStr: string,
  }).isRequired,
};
