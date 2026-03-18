// @MX:ANCHOR: 쿠폰 폼 컴포넌트 - 생성/수정 공용
// @MX:REASON: fan_in >= 3 (CouponCreatePage, CouponEditPage 등)
// @MX:SPEC: SPEC-SKIN-007

import { useState } from 'react';
import { Field, FieldLabel, FieldError } from '../../ui/Field';
import { TextField } from '../../ui/TextField';
import { CouponMatchSelector } from './CouponMatchSelector';

const DISCOUNT_TYPES = [
  { value: 'percent', label: '정률 할인 (%)' },
  { value: 'fixed', label: '정액 할인 (원)' },
];

const DEFAULT_FORM = {
  code: '',
  name: '',
  discountType: 'percent',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  startDate: '',
  endDate: '',
  issueCount: '',
  targetType: 'all',
  targetIds: [],
};

/**
 * 쿠폰 생성/수정 폼
 * @param {Object} [initialValues] - 초기 폼 값 (수정 모드)
 * @param {Function} onSubmit - 폼 제출 핸들러 (data) => void
 * @param {Function} onCancel - 취소 핸들러
 * @param {boolean} [isSubmitting] - 제출 로딩 상태
 */
const CouponForm = ({ initialValues, onSubmit, onCancel, isSubmitting = false }) => {
  const [form, setForm] = useState(initialValues ?? DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleMatchChange = ({ targetType, targetIds }) => {
    setForm((prev) => ({ ...prev, targetType, targetIds }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = '쿠폰 코드를 입력하세요.';
    if (!form.name.trim()) newErrors.name = '쿠폰명을 입력하세요.';
    if (!form.discountValue || Number(form.discountValue) <= 0) newErrors.discountValue = '할인 값을 입력하세요.';
    if (form.discountType === 'percent' && Number(form.discountValue) > 100) newErrors.discountValue = '정률 할인은 100% 이하로 입력하세요.';
    if (!form.startDate) newErrors.startDate = '시작일을 입력하세요.';
    if (!form.endDate) newErrors.endDate = '종료일을 입력하세요.';
    if (form.startDate && form.endDate && form.startDate > form.endDate) newErrors.endDate = '종료일이 시작일보다 앞설 수 없습니다.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit?.({
      ...form,
      discountValue: Number(form.discountValue),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      issueCount: form.issueCount ? Number(form.issueCount) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-lg)' }}>
      {/* 쿠폰 코드 */}
      <Field>
        <FieldLabel required>쿠폰 코드</FieldLabel>
        <TextField
          value={form.code}
          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
          placeholder="예: WELCOME10"
          maxLength={30}
        />
        <p style={{ margin: '4px 0 0', fontSize: 'var(--huni-font-size-xs)', color: 'var(--huni-text-muted)' }}>
          영문 대문자, 숫자, 하이픈만 사용 가능
        </p>
        {errors.code && <FieldError>{errors.code}</FieldError>}
      </Field>

      {/* 쿠폰명 */}
      <Field>
        <FieldLabel required>쿠폰명</FieldLabel>
        <TextField
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="예: 신규가입 10% 할인 쿠폰"
          maxLength={100}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </Field>

      {/* 할인 유형 + 값 */}
      <div style={{ display: 'flex', gap: 'var(--huni-spacing-md)' }}>
        <Field style={{ flex: 1 }}>
          <FieldLabel required>할인 유형</FieldLabel>
          <select
            value={form.discountType}
            onChange={(e) => handleChange('discountType', e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-primary)' }}
          >
            {DISCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>
        <Field style={{ flex: 1 }}>
          <FieldLabel required>할인 값</FieldLabel>
          <TextField
            type="number"
            value={form.discountValue}
            onChange={(e) => handleChange('discountValue', e.target.value)}
            placeholder={form.discountType === 'percent' ? '10' : '2000'}
            min={1}
            max={form.discountType === 'percent' ? 100 : undefined}
          />
          {errors.discountValue && <FieldError>{errors.discountValue}</FieldError>}
        </Field>
      </div>

      {/* 최소 주문 금액 + 최대 할인 금액 */}
      <div style={{ display: 'flex', gap: 'var(--huni-spacing-md)' }}>
        <Field style={{ flex: 1 }}>
          <FieldLabel>최소 주문 금액 (원)</FieldLabel>
          <TextField
            type="number"
            value={form.minOrderAmount}
            onChange={(e) => handleChange('minOrderAmount', e.target.value)}
            placeholder="0 (제한 없음)"
            min={0}
          />
        </Field>
        {form.discountType === 'percent' && (
          <Field style={{ flex: 1 }}>
            <FieldLabel>최대 할인 금액 (원)</FieldLabel>
            <TextField
              type="number"
              value={form.maxDiscountAmount}
              onChange={(e) => handleChange('maxDiscountAmount', e.target.value)}
              placeholder="0 (제한 없음)"
              min={0}
            />
          </Field>
        )}
      </div>

      {/* 발급 기간 */}
      <div style={{ display: 'flex', gap: 'var(--huni-spacing-md)' }}>
        <Field style={{ flex: 1 }}>
          <FieldLabel required>시작일</FieldLabel>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            style={{ padding: '8px 12px', border: `1px solid ${errors.startDate ? 'var(--huni-color-error)' : 'var(--huni-border-default)'}`, borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-primary)', width: '100%', boxSizing: 'border-box' }}
          />
          {errors.startDate && <FieldError>{errors.startDate}</FieldError>}
        </Field>
        <Field style={{ flex: 1 }}>
          <FieldLabel required>종료일</FieldLabel>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            style={{ padding: '8px 12px', border: `1px solid ${errors.endDate ? 'var(--huni-color-error)' : 'var(--huni-border-default)'}`, borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-primary)', width: '100%', boxSizing: 'border-box' }}
          />
          {errors.endDate && <FieldError>{errors.endDate}</FieldError>}
        </Field>
      </div>

      {/* 발급 수량 */}
      <Field>
        <FieldLabel>발급 수량</FieldLabel>
        <TextField
          type="number"
          value={form.issueCount}
          onChange={(e) => handleChange('issueCount', e.target.value)}
          placeholder="0 (무제한)"
          min={0}
          style={{ width: '200px' }}
        />
      </Field>

      {/* 적용 대상 */}
      <Field>
        <FieldLabel>적용 대상</FieldLabel>
        <CouponMatchSelector
          targetType={form.targetType}
          targetIds={form.targetIds}
          onChange={handleMatchChange}
        />
      </Field>

      {/* 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--huni-spacing-sm)', paddingTop: 'var(--huni-spacing-md)', borderTop: '1px solid var(--huni-border-default)' }}>
        <button type="button" onClick={onCancel} disabled={isSubmitting} style={secondaryBtnStyle}>취소</button>
        <button type="submit" disabled={isSubmitting} style={primaryBtnStyle}>
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </form>
  );
};

const primaryBtnStyle = { padding: 'var(--huni-spacing-sm) var(--huni-spacing-xl)', background: 'var(--huni-color-brand)', color: '#fff', border: 'none', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', cursor: 'pointer' };
const secondaryBtnStyle = { padding: 'var(--huni-spacing-sm) var(--huni-spacing-xl)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-secondary)', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', cursor: 'pointer' };

export { CouponForm };
