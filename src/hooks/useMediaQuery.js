import { useState, useEffect } from 'react';

/**
 * CSS 미디어 쿼리를 감지하는 커스텀 훅
 * react-device-detect의 정적 감지 대신 실시간 뷰포트 변화를 추적
 *
 * @param {string} query - CSS 미디어 쿼리 문자열 (예: '(min-width: 768px)')
 * @returns {boolean} 미디어 쿼리 일치 여부
 */
// @MX:ANCHOR: [AUTO] [useMediaQuery] Tailwind 브레이크포인트 기반 미디어 쿼리 훅 - useResponsive의 기반
// @MX:REASON: useResponsive를 통해 간접적으로 전체 반응형 UI에 영향
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // 초기값 동기화
    setMatches(mql.matches);

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;

// tailwind.config.js 브레이크포인트와 동일한 값 사용
export const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
};
