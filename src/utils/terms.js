import { TERMS_TYPE } from '@shopby/shop-sdk';

import { DEFAULT_REQUIRED_TERMS_KEYS } from '../constants/common';

export const makePrefixLabel = ({ required, title }) => {
  const prefix = required ? '[필수]' : '[선택]';

  return `${prefix} ${title}`;
};

export const createRequiredTermStatus = (termsTypes, defaultStatus, labelKey = 'label') =>
  termsTypes.map((termsType) => ({
    ...defaultStatus,
    id: termsType.toLowerCase(),
    [labelKey]: `[필수] ${TERMS_TYPE[termsType]}`,
    termsType,
  }));

export const getUsedRequiredTermsTypes = (termsData) =>
  DEFAULT_REQUIRED_TERMS_KEYS.filter((termsType) => {
    const termsKey = termsType.toLowerCase();
    return termsData?.[termsKey]?.used;
  });
