import { Navigate, useLocation } from 'react-router-dom';

import { node } from 'prop-types';

import { isSignedIn } from '@shopby/shared';

const NotAccessLoggedInUserRouter = ({ children }) => {
  const { state } = useLocation();

  if (!isSignedIn() || state?.shouldRoute) return children;

  if (state?.to === location.pathname) {
    return children;
  }

  if (state?.to) {
    return <Navigate to={state.to} state={{ ...state }} replace={true} />;
  }

  return <Navigate replace={true} to="/" />;
};

export default NotAccessLoggedInUserRouter;

NotAccessLoggedInUserRouter.propTypes = {
  children: node,
};
