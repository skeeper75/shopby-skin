// @MX:NOTE: 상품 폼 - 기본 정보 섹션 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { Field, FieldLabel, FieldError } from '../../../components/ui/Field';
import { TextField } from '../../../components/ui/TextField';

const PRODUCT_CATEGORIES = [
  { value: 'print', label: '인쇄' },
  { value: 'binding', label: '제본' },
  { value: 'goods', label: '굿즈' },
  { value: 'packaging', label: '포장재' },
  { value: 'design', label: '디자인' },
];

const PRODUCT_STATUSES = [
  { value: 'draft', label: '임시저장' },
  { value: 'active', label: '판매중' },
  { value: 'inactive', label: '판매중지' },
];

/**
 * ProductFormBasic - 상품 기본 정보 섹션
 * @param {object} values - 폼 값
 * @param {function} onChange - 값 변경 콜백 (key, value)
 * @param {object} errors - 유효성 에러
 */
const ProductFormBasic = ({ values, onChange, errors = {} }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[--huni-fg-default] border-b border-[--huni-stroke-default] pb-2">
        기본 정보
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Field error={errors.name} className="col-span-2">
          <FieldLabel required>상품명</FieldLabel>
          <TextField
            placeholder="상품명을 입력하세요"
            value={values.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            error={!!errors.name}
          />
          <FieldError />
        </Field>

        <Field error={errors.category}>
          <FieldLabel required>카테고리</FieldLabel>
          <select
            className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
            value={values.category ?? ''}
            onChange={(e) => onChange('category', e.target.value)}
          >
            <option value="">선택하세요</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <FieldError />
        </Field>

        <Field>
          <FieldLabel required>판매 상태</FieldLabel>
          <select
            className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
            value={values.status ?? 'draft'}
            onChange={(e) => onChange('status', e.target.value)}
          >
            {PRODUCT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>

        <Field className="col-span-2">
          <FieldLabel>상품 설명</FieldLabel>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm placeholder:text-[--huni-fg-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--huni-stroke-brand]"
            placeholder="상품 설명을 입력하세요"
            value={values.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
          />
        </Field>

        <Field>
          <FieldLabel>최소 주문 수량</FieldLabel>
          <TextField
            type="number"
            placeholder="100"
            value={values.minQty ?? ''}
            onChange={(e) => onChange('minQty', e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>최대 주문 수량</FieldLabel>
          <TextField
            type="number"
            placeholder="999999 (제한 없음)"
            value={values.maxQty ?? ''}
            onChange={(e) => onChange('maxQty', e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>표준 납기일 (일)</FieldLabel>
          <TextField
            type="number"
            placeholder="3"
            value={values.leadDays ?? ''}
            onChange={(e) => onChange('leadDays', e.target.value)}
          />
        </Field>

        <Field>
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={!!values.rushAvailable}
              onChange={(e) => onChange('rushAvailable', e.target.checked)}
              className="w-4 h-4"
            />
            긴급 처리 가능
          </label>
        </Field>
      </div>
    </div>
  );
};

export { ProductFormBasic };
