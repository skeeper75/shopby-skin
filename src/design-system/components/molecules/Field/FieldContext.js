/**
 * Field 컴포넌트 컨텍스트
 *
 * 폼 필드 상태(disabled, invalid, required)를 자식 input 컴포넌트에 전파하는 Context Provider.
 * TextField 등과 연동하여 aria-* 속성을 자동으로 연결한다.
 *
 * @MX:NOTE: [AUTO] Field compound component의 상태 전파 컨텍스트
 * @MX:SPEC: SPEC-DS-006
 */
import { createContext, useContext, useId } from 'react';

const FieldContext = createContext(null);

/**
 * Field 상태를 자식 컴포넌트에 전파하는 Provider.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 자식 요소
 * @param {boolean} [props.disabled=false] - 비활성 상태
 * @param {boolean} [props.invalid=false] - 유효하지 않은 상태
 * @param {boolean} [props.required=false] - 필수 입력 상태
 * @param {string} [props.id] - 필드 ID (미지정 시 자동 생성)
 */
export function FieldProvider({ children, disabled, invalid, required, id: propId }) {
  const generatedId = useId();
  const fieldId = propId || generatedId;

  const ctx = {
    fieldId,
    labelId: `${fieldId}-label`,
    helperId: `${fieldId}-helper`,
    errorId: `${fieldId}-error`,
    disabled: disabled || false,
    invalid: invalid || false,
    required: required || false,
  };

  return <FieldContext.Provider value={ctx}>{children}</FieldContext.Provider>;
}

/**
 * Field 컨텍스트를 가져온다.
 * FieldProvider 외부에서 호출하면 null을 반환한다.
 *
 * @returns {Object|null} Field 컨텍스트 객체
 */
export function useFieldContext() {
  return useContext(FieldContext);
}
