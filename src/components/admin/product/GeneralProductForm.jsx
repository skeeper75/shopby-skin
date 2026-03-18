// @MX:NOTE: 일반 상품 폼 (굿즈/포장재/디자인) (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { Field, FieldLabel, FieldError } from '../../../components/ui/Field';
import { TextField } from '../../../components/ui/TextField';
import { CategoryTree } from './CategoryTree';

const GENERAL_PRODUCT_TYPES = {
  goods: { label: '굿즈 상품', placeholder: '예: 에코백, 머그컵' },
  packaging: { label: '포장재', placeholder: '예: 택배박스, 쇼핑백' },
  design: { label: '디자인 상품', placeholder: '예: 로고 디자인, 명함 디자인' },
};

const INITIAL_VALUES = {
  name: '',
  type: '',
  categoryId: null,
  description: '',
  price: '',
  salePrice: '',
  stock: '',
  status: 'draft',
};

/**
 * GeneralProductForm - 일반 상품(굿즈/포장재/디자인) 등록 폼
 * @param {string} productType - 'goods' | 'packaging' | 'design'
 * @param {object} initialValues
 * @param {function} onSave
 * @param {function} onCancel
 * @param {boolean} loading
 */
const GeneralProductForm = ({ productType = 'goods', initialValues: propValues, onSave, onCancel, loading = false }) => {
  const [values, setValues] = React.useState({ ...INITIAL_VALUES, type: productType, ...(propValues ?? {}) });
  const [errors, setErrors] = React.useState({});

  const typeInfo = GENERAL_PRODUCT_TYPES[productType] ?? GENERAL_PRODUCT_TYPES.goods;

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name?.trim()) errs.name = '상품명을 입력하세요.';
    if (!values.price || isNaN(Number(values.price))) errs.price = '정가를 입력하세요.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave?.(values);
  };

  return (
    <div className="grid grid-cols-[220px_1fr] gap-6">
      {/* 왼쪽: 카테고리 트리 */}
      <div>
        <CategoryTree
          selectedId={values.categoryId}
          onSelect={(id) => handleChange('categoryId', id)}
        />
      </div>

      {/* 오른쪽: 폼 */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[--huni-fg-default]">{typeInfo.label} 등록</h2>

        <Field error={errors.name}>
          <FieldLabel required>상품명</FieldLabel>
          <TextField
            placeholder={typeInfo.placeholder}
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
          />
          <FieldError />
        </Field>

        <Field>
          <FieldLabel>상품 설명</FieldLabel>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm placeholder:text-[--huni-fg-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--huni-stroke-brand]"
            placeholder="상품 설명"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field error={errors.price}>
            <FieldLabel required>정가 (원)</FieldLabel>
            <TextField
              type="number"
              placeholder="10000"
              value={values.price}
              onChange={(e) => handleChange('price', e.target.value)}
              error={!!errors.price}
            />
            <FieldError />
          </Field>

          <Field>
            <FieldLabel>판매가 (원)</FieldLabel>
            <TextField
              type="number"
              placeholder="정가와 같으면 비워두세요"
              value={values.salePrice}
              onChange={(e) => handleChange('salePrice', e.target.value)}
            />
          </Field>

          {productType !== 'design' && (
            <Field>
              <FieldLabel>재고 수량</FieldLabel>
              <TextField
                type="number"
                placeholder="0 (무제한)"
                value={values.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
              />
            </Field>
          )}

          <Field>
            <FieldLabel>판매 상태</FieldLabel>
            <select
              className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="draft">임시저장</option>
              <option value="active">판매중</option>
              <option value="inactive">판매중지</option>
            </select>
          </Field>
        </div>

        <div className="flex gap-2 pt-4 border-t border-[--huni-stroke-default]">
          <button
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { GeneralProductForm };
