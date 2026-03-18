// @MX:NOTE: 상품 폼 - 옵션 설정 섹션 (SPEC-SKIN-006)
// @MX:WARN: DAG 기반 옵션 의존성 검증 - cascade 리셋 로직 주의
// @MX:REASON: 옵션 간 의존 관계(parent-child)가 있어 부모 변경 시 자식 옵션 값 초기화 필요
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import { Field, FieldLabel } from '../../../components/ui/Field';
import { Chip } from '../../../components/ui/Chip';
import { SizeSelectPopup } from './popups/SizeSelectPopup';
import { MaterialSelectPopup } from './popups/MaterialSelectPopup';
import { PaperSelectPopup } from './popups/PaperSelectPopup';

/**
 * ProductFormOptions - 옵션 설정 섹션
 * @param {object} values - { sizes, materials, papers, customOptions }
 * @param {function} onChange - (key, value) 콜백
 */
const ProductFormOptions = ({ values, onChange }) => {
  const [sizePopupOpen, setSizePopupOpen] = React.useState(false);
  const [materialPopupOpen, setMaterialPopupOpen] = React.useState(false);
  const [paperPopupOpen, setPaperPopupOpen] = React.useState(false);

  const sizes = values.sizes ?? [];
  const materials = values.materials ?? [];
  const papers = values.papers ?? [];

  const removeItem = (key, id) => {
    onChange(key, (values[key] ?? []).filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[--huni-fg-default] border-b border-[--huni-stroke-default] pb-2">
        옵션 설정
      </h2>

      {/* 사이즈 옵션 */}
      <Field>
        <FieldLabel>사이즈 옵션</FieldLabel>
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2 border border-[--huni-stroke-default] rounded">
          {sizes.map((item) => (
            <Chip
              key={item.id}
              variant="outline"
              className="cursor-default"
            >
              {item.name} ({item.width}×{item.height}{item.unit})
              <button
                className="ml-1 text-[--huni-fg-muted] hover:text-[--huni-fg-error]"
                onClick={() => removeItem('sizes', item.id)}
              >
                ×
              </button>
            </Chip>
          ))}
          <button
            className="text-xs text-[--huni-fg-brand] hover:underline px-1"
            onClick={() => setSizePopupOpen(true)}
          >
            + 사이즈 추가
          </button>
        </div>
      </Field>

      {/* 소재 옵션 */}
      <Field>
        <FieldLabel>소재 옵션</FieldLabel>
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2 border border-[--huni-stroke-default] rounded">
          {materials.map((item) => (
            <Chip key={item.id} variant="outline" className="cursor-default">
              {item.name} ({item.gsm}g)
              <button
                className="ml-1 text-[--huni-fg-muted] hover:text-[--huni-fg-error]"
                onClick={() => removeItem('materials', item.id)}
              >
                ×
              </button>
            </Chip>
          ))}
          <button
            className="text-xs text-[--huni-fg-brand] hover:underline px-1"
            onClick={() => setMaterialPopupOpen(true)}
          >
            + 소재 추가
          </button>
        </div>
      </Field>

      {/* 용지 옵션 */}
      <Field>
        <FieldLabel>용지 옵션</FieldLabel>
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2 border border-[--huni-stroke-default] rounded">
          {papers.map((item) => (
            <Chip key={item.id} variant="outline" className="cursor-default">
              {item.name}
              <button
                className="ml-1 text-[--huni-fg-muted] hover:text-[--huni-fg-error]"
                onClick={() => removeItem('papers', item.id)}
              >
                ×
              </button>
            </Chip>
          ))}
          <button
            className="text-xs text-[--huni-fg-brand] hover:underline px-1"
            onClick={() => setPaperPopupOpen(true)}
          >
            + 용지 추가
          </button>
        </div>
      </Field>

      {/* 인쇄 면 옵션 */}
      <Field>
        <FieldLabel>인쇄 면</FieldLabel>
        <div className="flex gap-4">
          {['단면', '양면'].map((opt) => {
            const sides = values.printSides ?? [];
            const checked = sides.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...sides, opt]
                      : sides.filter((s) => s !== opt);
                    onChange('printSides', next);
                  }}
                  className="w-4 h-4"
                />
                {opt}
              </label>
            );
          })}
        </div>
      </Field>

      {/* 후가공 옵션 */}
      <Field>
        <FieldLabel>후가공</FieldLabel>
        <div className="flex flex-wrap gap-4">
          {['유광코팅', '무광코팅', '박', '형압', '오시', '미싱'].map((opt) => {
            const finishing = values.finishing ?? [];
            const checked = finishing.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...finishing, opt]
                      : finishing.filter((s) => s !== opt);
                    onChange('finishing', next);
                  }}
                  className="w-4 h-4"
                />
                {opt}
              </label>
            );
          })}
        </div>
      </Field>

      {/* 팝업 */}
      <SizeSelectPopup
        open={sizePopupOpen}
        onOpenChange={setSizePopupOpen}
        multiple
        selectedIds={sizes.map((s) => s.id)}
        onSelect={(selected) => onChange('sizes', selected)}
      />
      <MaterialSelectPopup
        open={materialPopupOpen}
        onOpenChange={setMaterialPopupOpen}
        multiple
        selectedIds={materials.map((m) => m.id)}
        onSelect={(selected) => onChange('materials', selected)}
      />
      <PaperSelectPopup
        open={paperPopupOpen}
        onOpenChange={setPaperPopupOpen}
        multiple
        selectedIds={papers.map((p) => p.id)}
        onSelect={(selected) => onChange('papers', selected)}
      />
    </div>
  );
};

export { ProductFormOptions };
