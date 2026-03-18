// @MX:ANCHOR: ProductForm - 상품 등록/수정 메인 폼 컨테이너 (SPEC-SKIN-006)
// @MX:REASON: fan_in >= 3 (ProductCreatePage, ProductEditPage, GeneralProductForm에서 사용)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { ProductFormBasic } from './ProductFormBasic';
import { ProductFormOptions } from './ProductFormOptions';
import { ProductFormDefaults } from './ProductFormDefaults';

// localStorage 임시저장 키
const DRAFT_KEY = 'admin_product_form_draft';

const INITIAL_VALUES = {
  name: '',
  category: '',
  status: 'draft',
  description: '',
  minQty: '',
  maxQty: '',
  leadDays: '',
  rushAvailable: false,
  // 옵션
  sizes: [],
  materials: [],
  papers: [],
  printSides: [],
  finishing: [],
  // 기본값
  defaultSizeId: '',
  defaultMaterialId: '',
  defaultPaperId: '',
  defaultPrintSide: '',
  defaultQty: '',
};

/**
 * ProductForm - 상품 등록/수정 메인 폼 컨테이너
 * @param {object} initialValues - 초기 값 (수정 시 기존 상품 데이터)
 * @param {function} onSave - 저장 콜백 (values)
 * @param {function} onCancel - 취소 콜백
 * @param {boolean} loading - 저장 중 여부
 */
const ProductForm = ({ initialValues: propValues, onSave, onCancel, loading = false }) => {
  const [values, setValues] = React.useState(() => {
    // 임시저장 복원 시도 (신규 등록만)
    if (!propValues) {
      try {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) return { ...INITIAL_VALUES, ...JSON.parse(draft) };
      } catch {}
    }
    return { ...INITIAL_VALUES, ...(propValues ?? {}) };
  });
  const [errors, setErrors] = React.useState({});
  const [activeTab, setActiveTab] = React.useState('basic');
  const [hasDraft, setHasDraft] = React.useState(false);

  // 임시저장 여부 확인
  React.useEffect(() => {
    if (!propValues && localStorage.getItem(DRAFT_KEY)) {
      setHasDraft(true);
    }
  }, []);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name?.trim()) errs.name = '상품명을 입력하세요.';
    if (!values.category) errs.category = '카테고리를 선택하세요.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setActiveTab('basic'); // 오류 있는 탭으로 이동
      return;
    }
    // 임시저장 삭제
    localStorage.removeItem(DRAFT_KEY);
    onSave?.(values);
  };

  const handleDraftSave = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    setHasDraft(true);
    alert('임시저장되었습니다.');
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setValues({ ...INITIAL_VALUES, ...(propValues ?? {}) });
  };

  return (
    <div className="space-y-4">
      {/* 임시저장 안내 */}
      {hasDraft && !propValues && (
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded text-sm">
          <span className="text-amber-800">임시저장된 데이터가 있습니다.</span>
          <button className="text-xs text-amber-600 hover:underline" onClick={clearDraft}>
            초기화
          </button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">
            기본 정보
            {(errors.name || errors.category) && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            )}
          </TabsTrigger>
          <TabsTrigger value="options">옵션 설정</TabsTrigger>
          <TabsTrigger value="defaults">기본값 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <ProductFormBasic values={values} onChange={handleChange} errors={errors} />
        </TabsContent>

        <TabsContent value="options" className="mt-4">
          <ProductFormOptions values={values} onChange={handleChange} />
        </TabsContent>

        <TabsContent value="defaults" className="mt-4">
          <ProductFormDefaults
            values={values}
            onChange={handleChange}
            productOptions={{
              sizes: values.sizes,
              materials: values.materials,
              papers: values.papers,
              printSides: values.printSides,
            }}
          />
        </TabsContent>
      </Tabs>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-[--huni-stroke-default]">
        <button
          className="px-3 py-1.5 rounded border border-[--huni-stroke-default] text-xs text-[--huni-fg-muted] hover:bg-[--huni-bg-subtle]"
          onClick={handleDraftSave}
          type="button"
        >
          임시저장
        </button>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
            onClick={onCancel}
            type="button"
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleSave}
            disabled={loading}
            type="button"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProductForm };
