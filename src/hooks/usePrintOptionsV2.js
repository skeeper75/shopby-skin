// @MX:NOTE: usePrintOptionsV2 Hook - 종속옵션 트리 관리 (v2 확장)
// SPEC-SKIN-003 TAG-001: 8단계 종속옵션 엔진
// 기존 usePrintOptions.js와 호환되도록 설계

import { useState, useEffect, useCallback } from 'react';
import { OPTION_STEPS } from '../types/print-options';

/**
 * 종속옵션 트리 구조 (API에서 가져올 데이터 형식)
 * GET /custom/print-options/tree
 */
interface OptionTreeNode {
  id: string;
  step: string;
  label: string;
  value: string;
  dependsOn?: string[]; // 종속 조건: ['paper-type:art', 'paper-thickness:200']
  disabledFor?: string[]; // 비활성 조건
  price?: number;
  disabled?: boolean;
}

interface PrintOptionsState {
  productType: string;
  selections: Record<string, {
    step: string;
    value: string;
    label: string;
    price?: number;
  }>;
  availableOptions: Record<string, OptionTreeNode[]>;
  loading: boolean;
  error?: string;
}

/**
 * 종속옵션 필터링 로직
 */
const filterOptionsByDependencies = (
  options: OptionTreeNode[],
  selections: Record<string, any>
): OptionTreeNode[] => {
  return options
    .map((option) => {
      // 종속 조건이 없으면 그대로 반환
      if (!option.dependsOn || option.dependsOn.length === 0) {
        return { ...option, disabled: false };
      }

      // 종속 조건 확인
      const disabled = option.dependsOn.some((dependency) => {
        const [step, value] = dependency.split(':');
        const selectedOption = selections[step];

        // 상위 옵션이 선택되지 않았으면 비활성
        if (!selectedOption) {
          return true;
        }

        // 특정 값이 필요한 경우
        if (value) {
          return selectedOption.value !== value;
        }

        return false;
      });

      return { ...option, disabled };
    })
    .filter((option) => {
      // disabledFor 조건 확인
      if (option.disabledFor && option.disabledFor.length > 0) {
        const shouldDisable = option.disabledFor.some((condition) => {
          const [step, value] = condition.split(':');
          const selectedOption = selections[step];
          return selectedOption && selectedOption.value === value;
        });
        return !shouldDisable;
      }
      return true;
    });
};

/**
 * usePrintOptionsV2 Hook
 */
export const usePrintOptionsV2 = (productType: string, productNo: number) => {
  const [state, setState] = useState<PrintOptionsState>({
    productType,
    selections: {},
    availableOptions: {},
    loading: true,
    error: undefined,
  });

  /**
   * 종속옵션 트리 로드
   */
  useEffect(() => {
    const loadOptions = async () => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        // 실제 API 호출: GET /custom/print-options/tree?productType=${productType}&productNo=${productNo}
        // const response = await fetch(`/api/custom/print-options/tree?productType=${productType}&productNo=${productNo}`);
        // const data = await response.json();

        // 목업 데이터 사용 (실제 구현 시 API 연동 필요)
        const mockData = getMockOptionTree(productType);

        setState({
          productType,
          selections: {},
          availableOptions: mockData,
          loading: false,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: '옵션을 불러오는데 실패했습니다.',
        }));
      }
    };

    loadOptions();
  }, [productType, productNo]);

  /**
   * 단계별 옵션 선택 (RadioGroup)
   */
  const selectOption = useCallback(
    (step: string, value: string) => {
      setState((prev) => {
        const newSelections = { ...prev.selections };

        // 해당 단계의 옵션 찾기
        const options = prev.availableOptions[step] || [];
        const selectedOption = options.find((opt) => opt.value === value);

        if (selectedOption) {
          newSelections[step] = {
            step,
            value: selectedOption.value,
            label: selectedOption.label,
            price: selectedOption.price,
          };

          // 하위 옵션 초기화 (종속관계)
          const stepOrder = Object.values(OPTION_STEPS);
          const currentIndex = stepOrder.indexOf(step);

          for (let i = currentIndex + 1; i < stepOrder.length; i++) {
            delete newSelections[stepOrder[i]];
          }
        }

        return {
          ...prev,
          selections: newSelections,
        };
      });
    },
    []
  );

  /**
   * 후가공 옵션 선택 (Checkbox - 다중선택)
   */
  const selectFinishing = useCallback(
    (value: string, checked: boolean) => {
      setState((prev) => {
        const currentSelection = prev.selections[OPTION_STEPS.FINISHING];
        const currentValues = currentSelection?.value ? currentSelection.value.split(',') : [];

        let newValues: string[];
        if (checked) {
          newValues = [...currentValues, value];
        } else {
          newValues = currentValues.filter((v) => v !== value);
        }

        const newSelections = { ...prev.selections };

        if (newValues.length > 0) {
          const options = prev.availableOptions[OPTION_STEPS.FINISHING] || [];
          const selectedOptions = options.filter((opt) => newValues.includes(opt.value));
          const totalPrice = selectedOptions.reduce((sum, opt) => sum + (opt.price || 0), 0);
          const labels = selectedOptions.map((opt) => opt.label).join(', ');

          newSelections[OPTION_STEPS.FINISHING] = {
            step: OPTION_STEPS.FINISHING,
            value: newValues.join(','),
            label: labels,
            price: totalPrice,
          };
        } else {
          delete newSelections[OPTION_STEPS.FINISHING];
        }

        return {
          ...prev,
          selections: newSelections,
        };
      });
    },
    []
  );

  /**
   * 단계가 비활성화되어 있는지 확인
   */
  const isStepDisabled = useCallback(
    (step: string): boolean => {
      // 첫 번째 단계는 항상 활성
      if (step === OPTION_STEPS.PAPER_TYPE) {
        return false;
      }

      const stepOrder = Object.values(OPTION_STEPS);
      const currentIndex = stepOrder.indexOf(step);
      const previousStep = stepOrder[currentIndex - 1];

      // 이전 단계가 선택되지 않았으면 비활성
      return !state.selections[previousStep];
    },
    [state.selections]
  );

  /**
   * 필터링된 옵션 반환 (종속관계 적용)
   */
  const getAvailableOptions = useCallback(
    (step: string): OptionTreeNode[] => {
      const baseOptions = state.availableOptions[step] || [];
      return filterOptionsByDependencies(baseOptions, state.selections);
    },
    [state.availableOptions, state.selections]
  );

  /**
   * 기존 usePrintOptions와 호환성을 위한 메서드
   */
  const updateOption = useCallback((key: string, value: any) => {
    // 기존 코드와의 호환성 레이어
    selectOption(key, value);
  }, [selectOption]);

  const toggleFinishing = useCallback((finishingType: string) => {
    const currentValues = state.selections[OPTION_STEPS.FINISHING]?.value?.split(',') || [];
    const isChecked = currentValues.includes(finishingType);
    selectFinishing(finishingType, !isChecked);
  }, [state.selections, selectFinishing]);

  return {
    state,
    selectOption,
    selectFinishing,
    isStepDisabled,
    getAvailableOptions,
    // 기존 호환성
    updateOption,
    toggleFinishing,
    options: state.selections, // 기존 형식과 맞추기
    errors: {},
    touched: {},
    validate: () => true,
    reset: () => {},
  };
};

/**
 * 목업 옵션 트리 데이터
 */
const getMockOptionTree = (productType: string): Record<string, OptionTreeNode[]> => {
  // 명함 옵션 트리
  const businessCardTree = {
    [OPTION_STEPS.PAPER_TYPE]: [
      { id: 'pt-1', step: 'paper-type', label: '아트지', value: 'art' },
      { id: 'pt-2', step: 'paper-type', label: '영업용지', value: 'business' },
      { id: 'pt-3', step: 'paper-type', label: '특수지', value: 'special' },
    ],
    [OPTION_STEPS.PAPER_THICKNESS]: [
      { id: 'th-1', step: 'paper-thickness', label: '150g', value: '150', dependsOn: ['paper-type:art'] },
      { id: 'th-2', step: 'paper-thickness', label: '200g', value: '200', dependsOn: ['paper-type:art', 'paper-type:business'] },
      { id: 'th-3', step: 'paper-thickness', label: '250g', value: '250', dependsOn: ['paper-type:art'] },
      { id: 'th-4', step: 'paper-thickness', label: '300g', value: '300', dependsOn: ['paper-type:art'] },
    ],
    [OPTION_STEPS.SIZE]: [
      { id: 'sz-1', step: 'size', label: '90 x 50 (표준)', value: '90x50' },
      { id: 'sz-2', step: 'size', label: '90 x 55 (표준)', value: '90x55' },
      { id: 'sz-3', step: 'size', label: '비규격', value: 'custom' },
    ],
    [OPTION_STEPS.QUANTITY]: [
      { id: 'qt-1', step: 'quantity', label: '100매', value: '100' },
      { id: 'qt-2', step: 'quantity', label: '200매', value: '200' },
      { id: 'qt-3', step: 'quantity', label: '500매', value: '500' },
      { id: 'qt-4', step: 'quantity', label: '1,000매', value: '1000' },
      { id: 'qt-5', step: 'quantity', label: '2,000매', value: '2000' },
    ],
    [OPTION_STEPS.PRINT_SIDES]: [
      { id: 'ps-1', step: 'print-sides', label: '단면', value: 'single' },
      { id: 'ps-2', step: 'print-sides', label: '양면', value: 'double' },
    ],
    [OPTION_STEPS.FINISHING]: [
      { id: 'fn-1', step: 'finishing', label: '박', value: 'foil', price: 5000 },
      { id: 'fn-2', step: 'finishing', label: '형압', value: 'die-cut', price: 3000 },
      { id: 'fn-3', step: 'finishing', label: '도무송', value: 'spot-uv', price: 2000 },
      { id: 'fn-4', step: 'finishing', label: '타공', value: 'perforation', price: 1000 },
    ],
    [OPTION_STEPS.COATING]: [
      { id: 'ct-1', step: 'coating', label: '없음', value: 'none', price: 0 },
      { id: 'ct-2', step: 'coating', label: '비닐 코팅', value: 'vinyl', price: 1000 },
      { id: 'ct-3', step: 'coating', label: '물 코팅', value: 'aqueous', price: 500 },
    ],
    [OPTION_STEPS.DELIVERY_DATE]: [
      { id: 'dd-1', step: 'delivery-date', label: '일반 (3~5영업일)', value: 'normal', price: 0 },
      { id: 'dd-2', step: 'delivery-date', label: '급행 (1~2영업일)', value: 'rush', price: 0.3 },
    ],
  };

  // 상품별 옵션 트리 매핑
  const optionTrees: Record<string, Record<string, OptionTreeNode[]>> = {
    'business-card': businessCardTree,
    'flyer': {
      ...businessCardTree,
      [OPTION_STEPS.SIZE]: [
        { id: 'sz-1', step: 'size', label: 'A4', value: 'a4' },
        { id: 'sz-2', step: 'size', label: 'A5', value: 'a5' },
        { id: 'sz-3', step: 'size', label: 'B4', value: 'b4' },
        { id: 'sz-4', step: 'size', label: 'B5', value: 'b5' },
      ],
    },
    'poster': {
      ...businessCardTree,
      // 포스터는 후가공 미지원
      [OPTION_STEPS.FINISHING]: [],
    },
    'envelope': {
      ...businessCardTree,
      // 봉투는 코팅 미지원
      [OPTION_STEPS.COATING]: [],
    },
  };

  return optionTrees[productType] || businessCardTree;
};
