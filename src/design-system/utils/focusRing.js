/**
 * 포커스 링 관리 유틸리티
 *
 * 키보드 네비게이션 시 focus ring 표시, 마우스 클릭 시 숨김.
 * Seed Design의 createFocusRingStyles() 패턴 적응.
 *
 * @MX:ANCHOR: [AUTO] focusVisible 관리 패턴 - 키보드 vs 마우스 구분 (fan_in >= 4)
 * @MX:REASON: Checkbox, Radio, Switch, Chip 등 4개 이상 컴포넌트가 의존. 변경 시 포커스 접근성 영향.
 * @MX:SPEC: SPEC-DS-006
 */
import { useState, useCallback } from 'react';

/**
 * 포커스 링 표시 여부를 관리하는 훅.
 * 키보드(Tab) 포커스 시 true, 마우스 클릭 시 false.
 *
 * @returns {{ isFocusVisible: boolean, focusProps: Object }}
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const onFocus = useCallback((e) => {
    // :focus-visible 의사 클래스와 동일한 로직
    // 키보드 이벤트 후 포커스 시 true
    if (e.target.matches?.(':focus-visible')) {
      setIsFocusVisible(true);
    }
  }, []);

  const onBlur = useCallback(() => {
    setIsFocusVisible(false);
  }, []);

  return {
    isFocusVisible,
    focusProps: {
      onFocus,
      onBlur,
      'data-focus-visible': isFocusVisible ? '' : undefined,
    },
  };
}

/**
 * 포커스 링 CSS 클래스를 반환한다.
 * --huni-stroke-brand 색상 기반 2px outline, 2px offset.
 *
 * @returns {string} 포커스 링 CSS 클래스 문자열
 */
export const focusRingClass =
  'outline-2 outline-offset-2 outline-[var(--huni-stroke-brand)]';

/**
 * 포커스 링 인라인 스타일을 반환한다.
 * CSS class를 사용할 수 없는 환경용.
 *
 * @returns {Object} 포커스 링 인라인 스타일 객체
 */
export const focusRingStyle = {
  outline: '2px solid var(--huni-stroke-brand)',
  outlineOffset: '2px',
};
