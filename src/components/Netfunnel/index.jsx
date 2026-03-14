import { node } from 'prop-types';

import Netfunnel from './Netfunnel';

const NetfunnelWrapper = (props) => {
  if (window.NetFunnel) {
    return <Netfunnel {...props} />;
  }

  return props.children;
};

export default NetfunnelWrapper;

NetfunnelWrapper.propTypes = {
  children: node,
};
