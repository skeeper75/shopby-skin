// @MX:NOTE: [AUTO] LedgerForm - 원장 거래 등록 폼 컴포넌트
// @MX:SPEC: SPEC-SKIN-008

import { useState } from 'react';
import { Field, FieldLabel, FieldError, TextField } from '../../ui';

const DEFAULT_FORM = {
  date: new Date().toISOString().split('T')[0],
  vendorId: '',
  vendorName: '',
  type: '입금',
  amount: '',
  accountId: '',
  description: '',
  memo: '',
};

/**
 * 원장 거래 등록 폼
 * @param {Object} props
 * @param {Object[]} props.vendors - 거래처 목록
 * @param {Object[]} props.accounts - 계좌 목록
 * @param {function} props.onSubmit - 제출 핸들러
 * @param {function} props.onCancel - 취소 핸들러
 * @param {boolean} props.isLoading - 로딩 상태
 */
const LedgerForm = ({ vendors = [], accounts = [], onSubmit, onCancel, isLoading = false }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // 거래처 선택 시 이름 자동 설정
      if (field === 'vendorId') {
        const vendor = vendors.find((v) => String(v.id) === String(value));
        updated.vendorName = vendor?.name ?? '';
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = '날짜를 선택하세요.';
    if (!form.vendorId) newErrors.vendorId = '거래처를 선택하세요.';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = '올바른 금액을 입력하세요.';
    }
    if (!form.description.trim()) newErrors.description = '거래 내역을 입력하세요.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...form,
      amount: Number(form.amount),
      vendorId: Number(form.vendorId),
      accountId: form.accountId ? Number(form.accountId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 날짜 + 유형 */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel required>거래 날짜</FieldLabel>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
          />
          {errors.date && <FieldError>{errors.date}</FieldError>}
        </Field>

        <Field>
          <FieldLabel required>거래 유형</FieldLabel>
          <div className="flex gap-2">
            {['입금', '출금', '조정'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange('type', t)}
                className={`flex-1 h-10 rounded border text-sm font-medium transition-colors ${
                  form.type === t
                    ? 'bg-[--huni-bg-brand] text-white border-[--huni-bg-brand]'
                    : 'bg-white text-[--huni-fg-default] border-[--huni-stroke-default] hover:border-[--huni-bg-brand]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* 거래처 */}
      <Field>
        <FieldLabel required>거래처</FieldLabel>
        <select
          value={form.vendorId}
          onChange={(e) => handleChange('vendorId', e.target.value)}
          disabled={isLoading}
          className="w-full h-10 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
        >
          <option value="">거래처 선택</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        {errors.vendorId && <FieldError>{errors.vendorId}</FieldError>}
      </Field>

      {/* 금액 */}
      <Field>
        <FieldLabel required>금액 (원)</FieldLabel>
        <TextField
          type="number"
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder="0"
          min="0"
          disabled={isLoading}
        />
        {errors.amount && <FieldError>{errors.amount}</FieldError>}
      </Field>

      {/* 계좌 */}
      <Field>
        <FieldLabel>계좌</FieldLabel>
        <select
          value={form.accountId}
          onChange={(e) => handleChange('accountId', e.target.value)}
          disabled={isLoading}
          className="w-full h-10 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
        >
          <option value="">계좌 선택 (선택)</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.bankName} {a.accountNumber} ({a.purpose})</option>
          ))}
        </select>
      </Field>

      {/* 거래 내역 */}
      <Field>
        <FieldLabel required>거래 내역</FieldLabel>
        <TextField
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="거래 내역을 입력하세요"
          disabled={isLoading}
        />
        {errors.description && <FieldError>{errors.description}</FieldError>}
      </Field>

      {/* 메모 */}
      <Field>
        <FieldLabel>메모</FieldLabel>
        <textarea
          value={form.memo}
          onChange={(e) => handleChange('memo', e.target.value)}
          placeholder="추가 메모 (선택)"
          disabled={isLoading}
          rows={2}
          className="w-full px-3 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
        />
      </Field>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] hover:bg-[--huni-bg-muted] transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? '등록 중...' : '거래 등록'}
        </button>
      </div>
    </form>
  );
};

export default LedgerForm;
