import { useState, useCallback } from 'react';

import { validatePrintOptions } from '../utils/printOptionValidator';

// @MX:ANCHOR: [AUTO] 인쇄 옵션 상태 관리 훅 - PrintConfigurator의 모든 하위 컴포넌트에서 공유
// @MX:REASON: OptionChipGroup, SizeSelector, PaperSelector, CoatingSelector, CounterInput에서 사용
const DEFAULT_OPTIONS = {
  size: '',
  customWidth: '',
  customHeight: '',
  paper: '',
  coating: 'NONE',
  finishing: [],
  quantity: 1,
};

const usePrintOptions = (initialOptions = {}) => {
  const [options, setOptions] = useState({ ...DEFAULT_OPTIONS, ...initialOptions });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const updateOption = useCallback((key, value) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: value };

      // 용지 변경 시 코팅 초기화
      if (key === 'paper') {
        next.coating = 'NONE';
      }

      return next;
    });
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const toggleFinishing = useCallback((finishingType) => {
    setOptions((prev) => {
      const current = prev.finishing;
      const next = current.includes(finishingType)
        ? current.filter((f) => f !== finishingType)
        : [...current, finishingType];
      return { ...prev, finishing: next };
    });
  }, []);

  const validate = useCallback(() => {
    const result = validatePrintOptions(options);
    setErrors(result.errors);
    return result.isValid;
  }, [options]);

  const reset = useCallback(() => {
    setOptions({ ...DEFAULT_OPTIONS, ...initialOptions });
    setErrors({});
    setTouched({});
  }, [initialOptions]);

  return {
    options,
    errors,
    touched,
    updateOption,
    toggleFinishing,
    validate,
    reset,
  };
};

export default usePrintOptions;
