import { useState, useCallback, useRef, useEffect } from 'react';

import { TextField } from '../../ui/TextField';

// @MX:NOTE: [AUTO] 디바운스 300ms 적용 - 검색 요청 빈도 제어
// @MX:SPEC: SPEC-SKIN-005
/**
 * 검색바 컴포넌트
 * - 디바운스 검색 (300ms) 지원
 *
 * @param {Object} props
 * @param {string} props.placeholder - 입력 필드 플레이스홀더 텍스트
 * @param {Function} props.onSearch - 검색 콜백
 * @param {string} props.value - 외부 제어 값
 * @param {string} props.className - 추가 스타일 클래스
 */
const SearchBar = ({
  placeholder = '검색어를 입력하세요',
  onSearch,
  value: externalValue,
  className = '',
}) => {
  const [value, setValue] = useState(externalValue || '');
  const debounceTimer = useRef(null);

  // 외부 값 동기화
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  /**
   * 입력값 정제 - HTML 태그 제거 및 길이 제한
   * @param {string} input - 사용자 입력값
   * @returns {string} 정제된 입력값
   */
  const sanitizeInput = useCallback((input) => {
    // HTML 태그 제거
    const stripped = input.replace(/<[^>]*>/g, '');
    // 최대 200자 제한
    return stripped.slice(0, 200);
  }, []);

  // 디바운스 검색 처리
  const handleChange = useCallback(
    (e) => {
      const newValue = sanitizeInput(e.target.value);
      setValue(newValue);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onSearch?.(newValue);
      }, 300);
    },
    [onSearch, sanitizeInput]
  );

  // 즉시 검색 (버튼 클릭 또는 엔터)
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      onSearch?.(sanitizeInput(value));
    },
    [value, onSearch, sanitizeInput]
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <TextField
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 h-[36px]"
      />
      <button
        type="submit"
        className="h-[36px] px-4 bg-[--huni-bg-brand] text-white text-sm rounded hover:bg-[--huni-bg-brand-hover] transition-colors"
      >
        검색
      </button>
    </form>
  );
};

export default SearchBar;
