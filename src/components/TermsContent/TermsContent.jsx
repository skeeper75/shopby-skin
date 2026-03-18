import { useEffect } from 'react';

import { oneOfType, node, element } from 'prop-types';

import { useTermsActionContext } from '@shopby/react-components';

const TermsContent = ({ children }) => {
  const { fetchTermsUsed } = useTermsActionContext();

  useEffect(() => {
    if (location?.pathname === '/callback' && location?.search.includes('callbackType=MY_PAY_CALLBACK')) {
      return;
    }

    fetchTermsUsed();
  }, []);

  return <>{children}</>;
};

TermsContent.propTypes = {
  children: oneOfType([node, element]),
};

export default TermsContent;
