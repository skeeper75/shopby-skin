import { useMemo } from 'react';

import useMediaQuery, { BREAKPOINTS } from './useMediaQuery';

/**
 * 디바이스 타입 감지 훅 (react-device-detect 대체)
 *
 * react-device-detect는 UA 문자열 기반 정적 감지이므로
 * 브라우저 리사이즈에 반응하지 않음.
 * 이 훅은 CSS 미디어 쿼리 기반으로 실시간 뷰포트 변화를 추적.
 *
 * @returns {{ isMobile: boolean, isTablet: boolean, isDesktop: boolean, platformType: string }}
 */
// @MX:ANCHOR: [AUTO] [useResponsive] 반응형 상태 제공 훅 - Layout, Header, GalleryListPage 등 다수에서 사용
// @MX:REASON: fan_in >= 3, 다수의 UI 컴포넌트에서 디바이스 타입 감지에 의존
const useResponsive = () => {
  const isMdUp = useMediaQuery(BREAKPOINTS.md); // >= 768px
  const isLgUp = useMediaQuery(BREAKPOINTS.lg); // >= 1024px

  return useMemo(() => {
    const isMobile = !isMdUp; // < 768px
    const isTablet = isMdUp && !isLgUp; // 768px ~ 1023px
    const isDesktop = isLgUp; // >= 1024px

    // Shopby API 플랫폼 타입 (PC/MOBILE_WEB 섹션 코드 구분용)
    const platformType = isDesktop ? 'PC' : 'MOBILE_WEB';

    return { isMobile, isTablet, isDesktop, platformType };
  }, [isMdUp, isLgUp]);
};

export default useResponsive;
