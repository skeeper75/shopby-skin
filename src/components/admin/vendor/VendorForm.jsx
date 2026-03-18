// @MX:NOTE: [AUTO] VendorForm - 거래처 등록/수정 폼 컴포넌트
// @MX:SPEC: SPEC-SKIN-008

import { useState } from 'react';
import { Field, FieldLabel, FieldError, TextField } from '../../ui';

/** 거래처 유형 목록 */
const VENDOR_TYPES = ['오프라인매장', '온라인업체', '제조사', '기타'];
/** 거래처 등급 목록 */
const VENDOR_GRADES = ['S', 'A', 'B', 'C'];

/** 기본 폼 값 */
const DEFAULT_FORM = {
  name: '',
  type: '오프라인매장',
  grade: 'B',
  contact: '',
  email: '',
  manager: '',
  address: '',
  memo: '',
};

/**
 * 거래처 등록/수정 폼
 * @param {Object} props
 * @param {Object} props.initialData - 수정 시 기존 데이터
 * @param {function} props.onSubmit - 제출 핸들러 (formData) => void
 * @param {function} props.onCancel - 취소 핸들러
 * @param {boolean} props.isLoading - 로딩 상태
 */
const VendorForm = ({ initialData = null, onSubmit, onCancel, isLoading = false }) => {
  const [form, setForm] = useState(initialData ?? DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = '거래처명을 입력하세요.';
    if (!form.contact.trim()) newErrors.contact = '연락처를 입력하세요.';
    if (!form.manager.trim()) newErrors.manager = '담당자를 입력하세요.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 거래처명 */}
      <Field>
        <FieldLabel required>거래처명</FieldLabel>
        <TextField
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="거래처명을 입력하세요"
          disabled={isLoading}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </Field>

      {/* 유형 + 등급 (2열 배치) */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel required>유형</FieldLabel>
          <select
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
          >
            {VENDOR_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel required>등급</FieldLabel>
          <select
            value={form.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
          >
            {VENDOR_GRADES.map((g) => (
              <option key={g} value={g}>{g}등급</option>
            ))}
          </select>
        </Field>
      </div>

      {/* 담당자 + 연락처 */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel required>담당자</FieldLabel>
          <TextField
            value={form.manager}
            onChange={(e) => handleChange('manager', e.target.value)}
            placeholder="담당자 이름"
            disabled={isLoading}
          />
          {errors.manager && <FieldError>{errors.manager}</FieldError>}
        </Field>

        <Field>
          <FieldLabel required>연락처</FieldLabel>
          <TextField
            value={form.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="02-1234-5678"
            disabled={isLoading}
          />
          {errors.contact && <FieldError>{errors.contact}</FieldError>}
        </Field>
      </div>

      {/* 이메일 */}
      <Field>
        <FieldLabel>이메일</FieldLabel>
        <TextField
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="example@company.com"
          disabled={isLoading}
        />
      </Field>

      {/* 주소 */}
      <Field>
        <FieldLabel>주소</FieldLabel>
        <TextField
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="주소를 입력하세요"
          disabled={isLoading}
        />
      </Field>

      {/* 메모 */}
      <Field>
        <FieldLabel>메모</FieldLabel>
        <textarea
          value={form.memo}
          onChange={(e) => handleChange('memo', e.target.value)}
          placeholder="특이사항이나 메모를 입력하세요"
          disabled={isLoading}
          rows={3}
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
          {isLoading ? '저장 중...' : (initialData ? '수정 완료' : '등록')}
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
