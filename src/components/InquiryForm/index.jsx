import { useState, useRef, useCallback } from 'react';

import { Field, FieldLabel, FieldError } from '../ui/Field';
import { TextField } from '../ui/TextField';
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

// 이메일 검증 정규식 (RFC 5322 준수 강화 패턴)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// 한국 전화번호 형식 검증 (010-1234-5678, 02-123-4567 등)
const PHONE_REGEX = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

/**
 * 커스텀 셀렉트 컴포넌트 (네이티브 select 미사용)
 * SPEC 요구사항: No native select - use custom select component
 */
const CustomSelect = ({ value, onChange, options, placeholder, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  // 키보드 탐색을 위한 포커스 인덱스 (-1: 없음)
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label ?? placeholder;

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // 드롭다운 열기/닫기 토글
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        // 열릴 때: 현재 선택된 항목의 인덱스로 포커스 설정
        const selectedIdx = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0);
      } else {
        setFocusedIndex(-1);
      }
      return next;
    });
  }, [options, value]);

  // 키보드 네비게이션 핸들러
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (!isOpen) {
            toggleOpen();
          } else if (focusedIndex >= 0 && focusedIndex < options.length) {
            handleSelect(options[focusedIndex].value);
          }
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          if (!isOpen) {
            toggleOpen();
          } else {
            setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
        }
        case 'Home': {
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(0);
          }
          break;
        }
        case 'End': {
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(options.length - 1);
          }
          break;
        }
        default:
          break;
      }
    },
    [isOpen, focusedIndex, options, toggleOpen]
  );

  // 포커스된 옵션이 보이도록 스크롤
  const scrollFocusedIntoView = useCallback(
    (index) => {
      if (listRef.current && index >= 0) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        if (items[index]) {
          items[index].scrollIntoView({ block: 'nearest' });
        }
      }
    },
    []
  );

  // focusedIndex 변경 시 스크롤
  const prevFocusedRef = useRef(focusedIndex);
  if (prevFocusedRef.current !== focusedIndex) {
    prevFocusedRef.current = focusedIndex;
    // 다음 렌더링에서 스크롤 (비동기)
    requestAnimationFrame(() => scrollFocusedIntoView(focusedIndex));
  }

  // 고유 ID 생성 (aria-activedescendant용)
  const listboxId = useRef(`custom-select-listbox-${Math.random().toString(36).slice(2, 9)}`).current;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full h-[46px] px-4 text-left text-sm border rounded flex items-center justify-between bg-white',
          'focus:outline-none focus:border-[#5538B6] focus:border-2',
          hasError ? 'border-red-500 border-2' : 'border-[#CACACA]',
          !value && 'text-[#979797]'
        )}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
      >
        <span className={cn('text-sm', value ? 'text-[#424242]' : 'text-[#979797]')}>{selectedLabel}</span>
        <svg
          className={cn('w-4 h-4 text-[#979797] transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-[#CACACA] rounded shadow-lg max-h-48 overflow-y-auto"
        >
          {options.map((opt, index) => (
            <li
              key={opt.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                'px-4 py-2.5 text-sm cursor-pointer hover:bg-[#EEEBF9]',
                opt.value === value ? 'bg-[#EEEBF9] text-[#5538B6] font-medium' : 'text-[#424242]',
                !opt.value && 'text-[#979797]',
                index === focusedIndex && 'bg-[#F5F3FF] outline outline-2 outline-[#5538B6] outline-offset-[-2px]'
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

// @MX:NOTE: [AUTO] Field/TextField Huni DS 패턴 사용 - FormLabel/inputClass 제거

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
    else if (!PHONE_REGEX.test(formData.phone.trim())) newErrors.phone = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!EMAIL_REGEX.test(formData.email.trim())) newErrors.email = '올바른 이메일 형식을 입력해주세요.';
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
      <Field required error={errors.companyName}>
        <FieldLabel>업체명</FieldLabel>
        <TextField
          type="text"
          value={formData.companyName}
          onChange={handleChange('companyName')}
          placeholder="업체명을 입력해주세요"
          error={!!errors.companyName}
          className="h-[46px]"
        />
        <FieldError />
      </Field>

      {/* 담당자명 */}
      <Field required error={errors.contactPerson}>
        <FieldLabel>담당자명</FieldLabel>
        <TextField
          type="text"
          value={formData.contactPerson}
          onChange={handleChange('contactPerson')}
          placeholder="담당자명을 입력해주세요"
          error={!!errors.contactPerson}
          className="h-[46px]"
        />
        <FieldError />
      </Field>

      {/* 연락처 */}
      <Field required error={errors.phone}>
        <FieldLabel>연락처</FieldLabel>
        <TextField
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="연락처를 입력해주세요 (예: 010-1234-5678)"
          error={!!errors.phone}
          className="h-[46px]"
        />
        <FieldError />
      </Field>

      {/* 이메일 */}
      <Field required error={errors.email}>
        <FieldLabel>이메일</FieldLabel>
        <TextField
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="이메일을 입력해주세요"
          error={!!errors.email}
          className="h-[46px]"
        />
        <FieldError />
      </Field>

      {/* 인쇄 유형 - 커스텀 셀렉트 */}
      <Field required error={errors.printType}>
        <FieldLabel>인쇄 유형</FieldLabel>
        <CustomSelect
          value={formData.printType}
          onChange={handlePrintTypeChange}
          options={PRINT_TYPE_OPTIONS}
          placeholder="인쇄유형 선택"
          hasError={!!errors.printType}
        />
        <FieldError />
      </Field>

      {/* 수량 */}
      <Field required error={errors.quantity}>
        <FieldLabel>수량</FieldLabel>
        <TextField
          type="text"
          value={formData.quantity}
          onChange={handleChange('quantity')}
          placeholder="수량을 입력해주세요 (예: 1000부)"
          error={!!errors.quantity}
          className="h-[46px]"
        />
        <FieldError />
      </Field>

      {/* 납기일 */}
      <Field>
        <FieldLabel>납기일</FieldLabel>
        <TextField
          type="date"
          value={formData.deadline}
          onChange={handleChange('deadline')}
          className="h-[46px] cursor-pointer"
        />
      </Field>

      {/* 상세 내용 */}
      <div>
        <label className="block text-sm font-medium leading-none mb-2">상세 내용</label>
        <textarea
          value={formData.details}
          onChange={handleChange('details')}
          placeholder="문의하실 내용을 입력해주세요"
          rows={5}
          className={cn(
            'w-full px-3 py-2 text-sm border border-[--huni-stroke-default] rounded-md bg-white',
            'placeholder:text-[--huni-fg-muted] resize-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--huni-stroke-brand] focus-visible:ring-offset-2'
          )}
        />
      </div>

      {/* 파일 첨부 */}
      <div>
        <label className="block text-sm font-medium leading-none mb-2">파일 첨부</label>
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
              'px-4 h-[40px] text-sm border border-[--huni-stroke-default] rounded-md bg-white',
              'hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--huni-stroke-brand]'
            )}
          >
            파일 선택
          </button>
          <span className="text-sm text-[--huni-fg-muted]">
            {file ? file.name : 'PDF, AI, PSD 파일 (최대 30MB)'}
          </span>
        </div>
        {fileError && <p className="mt-1 text-sm text-[--huni-fg-error]">{fileError}</p>}
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
