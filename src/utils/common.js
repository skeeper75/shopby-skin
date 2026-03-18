import { isMobile } from 'react-device-detect';

import { PLATFORM_TYPE } from '@shopby/shared';

import { YorN } from '../constants/common';
import { COUNTRY_PHONE_NUMBER_MAX_LENGTH } from '../constants/form';

export const platformType = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;

export const convertBooleanToYorN = (enable) => (enable ? YorN.Y : YorN.N);

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const getDefaultCountryCode = (exchangeTo) => {
  if (exchangeTo === 'KRW') return 'KR';

  return exchangeTo === 'JPY' ? 'JP' : 'US';
};

export const getCountryPhoneNumberLength = (countryCode) =>
  COUNTRY_PHONE_NUMBER_MAX_LENGTH[countryCode] ?? COUNTRY_PHONE_NUMBER_MAX_LENGTH.DEFAULT;

export const isImageType = (url = '') => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico', 'heic', 'heif'];
  const extension = url?.split('.').pop().toLowerCase();

  return imageExtensions.includes(extension);
};

export const binaryFileDownload = (blob, name) => {
  const objectURL = URL.createObjectURL(blob);
  const downloadElement = document.createElement('a');

  downloadElement.href = objectURL;
  downloadElement.download = name;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
};
