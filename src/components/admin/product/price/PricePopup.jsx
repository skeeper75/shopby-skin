// @MX:NOTE: 가격 팝업 공통 Dialog 컴포넌트 - 8가지 타입 지원 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/Dialog';
import { Field, FieldLabel, FieldError } from '../../../../components/ui/Field';
import { TextField } from '../../../../components/ui/TextField';
import { PRICE_POPUP_CONFIGS } from './PricePopupConfig';

/**
 * PricePopup - 가격 관련 설정 공통 팝업
 * @param {string} type - PRICE_POPUP_CONFIGS 키 (popup 유형)
 * @param {boolean} open - 팝업 열림 여부
 * @param {function} onOpenChange - 열림 상태 변경 콜백
 * @param {object} initialValues - 초기 값 (수정 시)
 * @param {function} onSave - 저장 콜백 (values 전달)
 * @param {object} options - select 필드 옵션 (sizes, materials 등)
 */
const PricePopup = ({ type, open, onOpenChange, initialValues = {}, onSave, options = {} }) => {
  const config = PRICE_POPUP_CONFIGS[type];
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);

  // 팝업이 열릴 때 초기값 설정
  React.useEffect(() => {
    if (open && config) {
      const defaults = {};
      config.fields.forEach((f) => {
        defaults[f.key] = initialValues[f.key] ?? (f.type === 'checkbox' ? false : f.type === 'radio' ? (f.options?.[0]?.value ?? '') : '');
      });
      setValues(defaults);
      setErrors({});
    }
  }, [open, type, initialValues]);

  if (!config) return null;

  const validate = () => {
    const errs = {};
    config.fields.forEach((f) => {
      if (f.required && !values[f.key] && values[f.key] !== false) {
        errs[f.key] = `${f.label}을(를) 입력하세요.`;
      }
      if (f.type === 'number' && values[f.key] && isNaN(Number(values[f.key]))) {
        errs[f.key] = '숫자를 입력하세요.';
      }
    });
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave?.({ type, ...values });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const val = values[field.key];
    const err = errors[field.key];
    const setVal = (v) => setValues((prev) => ({ ...prev, [field.key]: v }));

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Field key={field.key} error={err}>
            <FieldLabel required={field.required}>{field.label}</FieldLabel>
            <TextField
              type={field.type}
              placeholder={field.placeholder}
              value={val ?? ''}
              onChange={(e) => setVal(e.target.value)}
              error={!!err}
            />
            <FieldError />
          </Field>
        );

      case 'checkbox':
        return (
          <Field key={field.key}>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!val}
                onChange={(e) => setVal(e.target.checked)}
                className="w-4 h-4"
              />
              {field.label}
            </label>
          </Field>
        );

      case 'radio':
        return (
          <Field key={field.key}>
            <FieldLabel required={field.required}>{field.label}</FieldLabel>
            <div className="flex gap-4">
              {(field.options ?? []).map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name={field.key}
                    value={opt.value}
                    checked={val === opt.value}
                    onChange={() => setVal(opt.value)}
                    className="w-4 h-4"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </Field>
        );

      case 'select': {
        const selectOptions = field.optionsKey ? (options[field.optionsKey] ?? []) : (field.options ?? []);
        return (
          <Field key={field.key} error={err}>
            <FieldLabel required={field.required}>{field.label}</FieldLabel>
            <select
              className="flex h-10 w-full rounded-md border border-[--huni-stroke-default] bg-white px-3 py-2 text-sm"
              value={val ?? ''}
              onChange={(e) => setVal(e.target.value)}
            >
              <option value="">선택하세요</option>
              {selectOptions.map((opt) => (
                <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
                  {opt.label ?? opt.name}
                </option>
              ))}
            </select>
            <FieldError />
          </Field>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {config.fields.map(renderField)}
        </div>
        <DialogFooter>
          <button
            className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-subtle]"
            onClick={() => onOpenChange(false)}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { PricePopup };
