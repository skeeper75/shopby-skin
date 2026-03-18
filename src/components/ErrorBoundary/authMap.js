import { CLIENT_ERROR } from '@shopby/shared';

export default {
  [CLIENT_ERROR.EXPIRED_REFRESH_TOKEN]: {
    next: '/sign-in',
  },
};
