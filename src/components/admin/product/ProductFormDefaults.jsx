// @MX:NOTE: 상품 폼 - 기본값 설정 섹션 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { Field, FieldLabel } from '../../../components/ui/Field';
import { TextField } from '../../../components/ui/TextField';

/**
 * ProductFormDefaults - 기본값 설정 섹션
 * 옵션의 기본 선택값을 지정
 */
const ProductFormDefaults = ({ values, onChange, productOptions = {} }) => {
  const { sizes = [], materials = [], papers = [], printSides = [], finishing = [] } = productOptions;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[--huni-fg-default] border-b border-[--huni-stroke-default] pb-2">
        기본값 설정
      </h2>
      <p className="text-xs text-[--huni-fg-muted]">
        고객이 상품 페이지에 처음 진입했을 때 선택되는 기본값을 설정합니다.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* 기본 사이즈 */}
        {sizes.length > 0 && (
          <Field>
            <FieldLabel>기본 사이즈</FieldLabel>
            <select
              className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
              value={values.defaultSizeId ?? ''}
              onChange={(e) => onChange('defaultSizeId', e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">선택 없음</option>
              {sizes.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </Field>
        )}

        {/* 기본 소재 */}
        {materials.length > 0 && (
          <Field>
            <FieldLabel>기본 소재</FieldLabel>
            <select
              className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
              value={values.defaultMaterialId ?? ''}
              onChange={(e) => onChange('defaultMaterialId', e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">선택 없음</option>
              {materials.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
            </select>
          </Field>
        )}

        {/* 기본 용지 */}
        {papers.length > 0 && (
          <Field>
            <FieldLabel>기본 용지</FieldLabel>
            <select
              className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
              value={values.defaultPaperId ?? ''}
              onChange={(e) => onChange('defaultPaperId', e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">선택 없음</option>
              {papers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </Field>
        )}

        {/* 기본 인쇄 면 */}
        {printSides.length > 0 && (
          <Field>
            <FieldLabel>기본 인쇄 면</FieldLabel>
            <select
              className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
              value={values.defaultPrintSide ?? ''}
              onChange={(e) => onChange('defaultPrintSide', e.target.value)}
            >
              <option value="">선택 없음</option>
              {printSides.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </Field>
        )}

        {/* 기본 수량 */}
        <Field>
          <FieldLabel>기본 주문 수량</FieldLabel>
          <TextField
            type="number"
            placeholder="100"
            value={values.defaultQty ?? ''}
            onChange={(e) => onChange('defaultQty', e.target.value ? Number(e.target.value) : '')}
          />
        </Field>
      </div>
    </div>
  );
};

export { ProductFormDefaults };
