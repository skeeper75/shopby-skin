import { node, element, oneOfType } from 'prop-types';

import { CurrencyProvider, useMallStateContext } from '@shopby/react-components';

const CurrencyWrap = ({ children }) => {
  const { exchangeTo } = useMallStateContext();

  return <CurrencyProvider currencyCode={exchangeTo}>{children}</CurrencyProvider>;
};

export default CurrencyWrap;

CurrencyWrap.propTypes = {
  children: oneOfType([node, element]),
};
