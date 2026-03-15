import { useState, useRef } from 'react';

import { cn } from '../../lib/utils';
import { fetchHttpRequest } from '../../utils/api';

// @MX:ANCHOR: [AUTO] InquiryForm - 대량문의/사업상담/디자인상담 공통 폼 컴포넌트
// @MX:REASON: fan_in >= 3, BulkInquiry/BusinessConsultation/DesignConsultation 세 페이지에서 사용
// @MX:SPEC: SPEC-SKIN-004 REQ-SKIN-004-003

// 인쇄 유형 옵션 목록
const PRINT_TYPE_OPTIONS = [
  { value: '', label: '인쇄유형 선택' },
  { value: 'offset', label: '오프셋 인쇄' },
  { value: 'digital', label: '디지털 인쇄' },
  { value: 'screen', label: '실크스크린 인쇄' },
  { value: 'pad', label: '패드 인쇄' },
  { value: 'engraving', label: '레이저 각인' },
  { value: 'embossing', label: '엠보싱 가공' },
  { value: 'etc', label: '기타' },
];

// API 엔드포인트 타입 매핑
const API_URL_MAP = {
  'bulk-inquiry': 'custom/bulk-inquiry',
  business: 'custom/business-consultation',
  design: 'custom/design-consultation',
};

// 파일 최대 크기: 30MB
const MAX_FILE_SIZE = 30 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/postscript', 'image/vnd.adobe.photoshop'];
const ALLOWED_EXTENSIONS = ['.pdf', '.ai', '.psd'];

/**
 * 커스텀 셀렉트 컴포넌트 (네이티브 select 미사용)
 * SPEC 요구사항: No native select - use custom select component
 */
const CustomSelect = ({ value, onChange, options, placeholder, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label ?? placeholder;

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full h-[46px] px-4 text-left text-sm border rounded flex items-center justify-between bg-white',
          'focus:outline-none focus:border-[#5538B6] focus:border-2',
          hasError ? 'border-red-500 border-2' : 'border-[#CACACA]',
          !value && 'text-[#979797]'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn('text-sm', value ? 'text-[#424242]' : 'text-[#979797]')}>{selectedLabel}</span>
        <svg
          className={cn('w-4 h-4 text-[#979797] transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-[#CACACA] rounded shadow-lg max-h-48 overflow-y-auto"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                'px-4 py-2.5 text-sm cursor-pointer hover:bg-[#EEEBF9]',
                opt.value === value ? 'bg-[#EEEBF9] text-[#5538B6] font-medium' : 'text-[#424242]',
                !opt.value && 'text-[#979797]'
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * 폼 라벨 컴포넌트
 * 디자인 토큰: Noto Sans 14px 600 #424242
 */
const FormLabel = ({ children, required }) => (
  <label className="block text-sm font-semibold text-[#424242] mb-1.5">
    {children}
    {required && <span className="text-[#5538B6] ml-0.5">*</span>}
  </label>
);

/**
 * 폼 입력 필드 공통 스타일
 * 기본 테두리: #CACACA 1px, 포커스 테두리: #5538B6 2px
 */
const inputClass = (hasError) =>
  cn(
    'w-full h-[46px] px-4 text-sm border rounded bg-white text-[#424242] placeholder-[#979797]',
    'focus:outline-none focus:border-[#5538B6] focus:border-2',
    hasError ? 'border-red-500 border-2' : 'border-[#CACACA]'
  );

/**
 * 공통 문의 폼 컴포넌트
 * type: 'bulk-inquiry' | 'business' | 'design'
 */
const InquiryForm = ({ type = 'bulk-inquiry', onSuccess }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    printType: '',
    quantity: '',
    deadline: '',
    details: '',
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePrintTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, printType: value }));
    if (errors.printType) {
      setErrors((prev) => ({ ...prev, printType: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setFileError('');

    if (!selected) return;

    // 파일 크기 검증
    if (selected.size > MAX_FILE_SIZE) {
      setFileError('파일 크기는 30MB 이하여야 합니다.');
      return;
    }

    // 파일 확장자 검증
    const ext = '.' + selected.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError('PDF, AI, PSD 파일만 업로드 가능합니다.');
      return;
    }

    setFile(selected);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = '업체명을 입력해주세요.';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = '담당자명을 입력해주세요.';
    if (!formData.phone.trim()) newErrors.phone = '연락처를 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    if (!formData.printType) newErrors.printType = '인쇄 유형을 선택해주세요.';
    if (!formData.quantity.trim()) newErrors.quantity = '수량을 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const requestBody = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) requestBody.append(key, value);
      });
      if (file) requestBody.append('file', file);

      const apiUrl = API_URL_MAP[type];
      await fetchHttpRequest({
        url: apiUrl,
        method: 'POST',
        requestBody,
      });

      onSuccess?.();
    } catch (error) {
      console.error('문의 접수 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* 업체명 */}
      <div>
        <FormLabel required>업체명</FormLabel>
        <input
          type="text"
          value={formData.companyName}
          onChange={handleChange('companyName')}
          placeholder="업체명을 입력해주세요"
          className={inputClass(errors.companyName)}
        />
        {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
      </div>

      {/* 담당자명 */}
      <div>
        <FormLabel required>담당자명</FormLabel>
        <input
          type="text"
          value={formData.contactPerson}
          onChange={handleChange('contactPerson')}
          placeholder="담당자명을 입력해주세요"
          className={inputClass(errors.contactPerson)}
        />
        {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
      </div>

      {/* 연락처 */}
      <div>
        <FormLabel required>연락처</FormLabel>
        <input
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="연락처를 입력해주세요 (예: 010-1234-5678)"
          className={inputClass(errors.phone)}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      {/* 이메일 */}
      <div>
        <FormLabel required>이메일</FormLabel>
        <input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="이메일을 입력해주세요"
          className={inputClass(errors.email)}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* 인쇄 유형 - 커스텀 셀렉트 */}
      <div>
        <FormLabel required>인쇄 유형</FormLabel>
        <CustomSelect
          value={formData.printType}
          onChange={handlePrintTypeChange}
          options={PRINT_TYPE_OPTIONS}
          placeholder="인쇄유형 선택"
          hasError={!!errors.printType}
        />
        {errors.printType && <p className="mt-1 text-xs text-red-500">{errors.printType}</p>}
      </div>

      {/* 수량 */}
      <div>
        <FormLabel required>수량</FormLabel>
        <input
          type="text"
          value={formData.quantity}
          onChange={handleChange('quantity')}
          placeholder="수량을 입력해주세요 (예: 1000부)"
          className={inputClass(errors.quantity)}
        />
        {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
      </div>

      {/* 납기일 */}
      <div>
        <FormLabel>납기일</FormLabel>
        <input
          type="date"
          value={formData.deadline}
          onChange={handleChange('deadline')}
          className={cn(inputClass(false), 'cursor-pointer')}
        />
      </div>

      {/* 상세 내용 */}
      <div>
        <FormLabel>상세 내용</FormLabel>
        <textarea
          value={formData.details}
          onChange={handleChange('details')}
          placeholder="문의하실 내용을 입력해주세요"
          rows={5}
          className={cn(
            'w-full px-4 py-3 text-sm border rounded bg-white text-[#424242] placeholder-[#979797] resize-none',
            'focus:outline-none focus:border-[#5538B6] focus:border-2 border-[#CACACA]'
          )}
        />
      </div>

      {/* 파일 첨부 */}
      <div>
        <FormLabel>파일 첨부</FormLabel>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ai,.psd"
            onChange={handleFileChange}
            className="hidden"
            aria-label="파일 첨부 (PDF, AI, PSD, 최대 30MB)"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'px-4 h-[40px] text-sm border border-[#CACACA] rounded text-[#424242] bg-white',
              'hover:bg-gray-50 focus:outline-none focus:border-[#5538B6] focus:border-2'
            )}
          >
            파일 선택
          </button>
          <span className="text-sm text-[#979797]">
            {file ? file.name : 'PDF, AI, PSD 파일 (최대 30MB)'}
          </span>
        </div>
        {fileError && <p className="mt-1 text-xs text-red-500">{fileError}</p>}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full h-[50px] text-white text-sm font-semibold rounded-[5px]',
          'bg-[#5538B6] hover:bg-[#4429a0] focus:outline-none focus:ring-2 focus:ring-[#5538B6] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        )}
      >
        {isSubmitting ? '접수 중...' : '문의하기'}
      </button>
    </form>
  );
};

export default InquiryForm;
