/**
 * data-* state attribute 기반 pseudo 유틸리티
 *
 * Seed Design의 _checked, _disabled 등의 pseudo를
 * data-attribute CSS 선택자 형태로 변환하여 제공.
 *
 * @MX:NOTE: [AUTO] data-* attribute로 CSS pseudo 상태를 관리하는 헬퍼
 * @MX:SPEC: SPEC-DS-006
 */

/**
 * 컴포넌트 상태를 data-* attribute 객체로 변환한다.
 *
 * @param {Object} state - 상태 객체
 * @param {boolean} [state.checked] - 체크 상태
 * @param {boolean} [state.disabled] - 비활성 상태
 * @param {boolean} [state.focusVisible] - 포커스 가시 상태
 * @param {boolean} [state.selected] - 선택 상태
 * @param {boolean} [state.invalid] - 유효하지 않은 상태
 * @param {boolean} [state.readonly] - 읽기 전용 상태
 * @param {boolean} [state.open] - 열린 상태
 * @param {boolean} [state.empty] - 비어있는 상태
 * @param {boolean} [state.exceeded] - 초과 상태
 * @param {boolean} [state.indeterminate] - 불확정 상태
 * @param {boolean} [state.focus] - 포커스 상태
 * @returns {Object} data-* attribute 객체
 */
export function getStateDataAttributes(state) {
  const attrs = {};

  if (state.checked !== undefined) attrs['data-checked'] = state.checked ? '' : undefined;
  if (state.disabled !== undefined) attrs['data-disabled'] = state.disabled ? '' : undefined;
  if (state.focusVisible !== undefined) attrs['data-focus-visible'] = state.focusVisible ? '' : undefined;
  if (state.selected !== undefined) attrs['data-selected'] = state.selected ? '' : undefined;
  if (state.invalid !== undefined) attrs['data-invalid'] = state.invalid ? '' : undefined;
  if (state.readonly !== undefined) attrs['data-readonly'] = state.readonly ? '' : undefined;
  if (state.open !== undefined) attrs['data-open'] = state.open ? '' : undefined;
  if (state.empty !== undefined) attrs['data-empty'] = state.empty ? '' : undefined;
  if (state.exceeded !== undefined) attrs['data-exceeded'] = state.exceeded ? '' : undefined;
  if (state.indeterminate !== undefined) attrs['data-indeterminate'] = state.indeterminate ? '' : undefined;
  if (state.focus !== undefined) attrs['data-focus'] = state.focus ? '' : undefined;

  // undefined 값 제거 (attribute가 DOM에 렌더링되지 않도록)
  return Object.fromEntries(
    Object.entries(attrs).filter(([, v]) => v !== undefined)
  );
}

/**
 * data-* attribute를 사용하는 CSS 선택자 매핑 테이블.
 * Tailwind arbitrary selector 또는 직접 CSS에서 사용.
 */
export const dataSelectors = {
  checked: '[data-checked]',
  disabled: '[data-disabled]',
  focusVisible: '[data-focus-visible]',
  selected: '[data-selected]',
  invalid: '[data-invalid]',
  readonly: '[data-readonly]',
  open: '[data-open]',
  closed: '[data-closed]',
  empty: '[data-empty]',
  exceeded: '[data-exceeded]',
  indeterminate: '[data-indeterminate]',
  focus: '[data-focus]',
};
