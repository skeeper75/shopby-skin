/**
 * Compound Component용 Slot Recipe Context 생성 유틸리티
 *
 * Seed Design의 createSlotRecipeContext 패턴을 CVA 기반으로 적응.
 * Provider에서 variant props를 받아 각 slot의 className을 context로 전파.
 *
 * @MX:ANCHOR: [AUTO] 모든 Compound Component가 의존하는 핵심 유틸리티
 * @MX:REASON: fan_in >= 10, Checkbox/Radio/Switch/Chip/Field/TextField/Tabs/Dialog/Snackbar에서 참조
 * @MX:SPEC: SPEC-DS-006
 */
import { createContext, useContext } from 'react';

/**
 * Slot Recipe Context를 생성한다.
 *
 * @param {Object} config - 설정 객체
 * @param {string[]} config.slots - slot 이름 배열 (예: ['root', 'control', 'label'])
 * @param {Function} config.recipe - CVA 기반 recipe 함수. variants를 받아 slot별 className 객체를 반환
 * @returns {{ SlotProvider, useSlotContext, useSlotClass }}
 */
export function createSlotRecipeContext({ slots, recipe }) {
  const SlotContext = createContext(null);

  /**
   * Slot Provider - Root 컴포넌트에서 사용.
   * variant props를 받아 recipe를 실행하고, 결과를 context로 전파한다.
   */
  function SlotProvider({ children, ...variantProps }) {
    const slotStyles = recipe(variantProps);
    return (
      <SlotContext.Provider value={slotStyles}>
        {children}
      </SlotContext.Provider>
    );
  }

  /**
   * Slot Context 전체를 가져온다.
   * @returns {Object} slot별 className 객체
   */
  function useSlotContext() {
    const ctx = useContext(SlotContext);
    if (!ctx) {
      throw new Error('useSlotContext는 SlotProvider 내부에서만 사용할 수 있습니다.');
    }
    return ctx;
  }

  /**
   * 특정 slot의 className을 가져온다.
   * @param {string} slotName - slot 이름
   * @returns {string} 해당 slot의 className
   */
  function useSlotClass(slotName) {
    const ctx = useSlotContext();
    return ctx[slotName] || '';
  }

  return { SlotProvider, useSlotContext, useSlotClass };
}
