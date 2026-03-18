import { PLATFORM_TYPE } from '@shopby/shared';

import { YorN } from '../constants/common';
import { COUNTRY_PHONE_NUMBER_MAX_LENGTH } from '../constants/form';

/**
 * 비-React 코드에서 모바일 뷰포트 감지
 * 768px 미만을 모바일로 판단 (Tailwind md 브레이크포인트 기준)
 *
 * @MX:ANCHOR: [AUTO] 모바일 뷰포트 감지 함수 - api.js, domain.js, common.js 등 3곳에서 호출
 * @MX:REASON: fan_in=3, 768px 기준값 변경 시 플랫폼 타입 판별·API 헤더·URL 리다이렉트 모두 영향
 * @MX:NOTE: [AUTO] React 컴포넌트는 useResponsive() 훅 사용 권장. 이 함수는 비-React 유틸용
 * @MX:SPEC: SPEC-LAYOUT-001
 */
export const getIsMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

/**
 * 비-React 코드에서 현재 플랫폼 타입 반환
 */
export const getPlatformType = () => (getIsMobile() ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC);

// @MX:NOTE: [AUTO] 하위 호환성을 위해 유지. React 컴포넌트에서는 useResponsive()를 사용하세요.
// @MX:LEGACY
export const platformType = getPlatformType();

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
