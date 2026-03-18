// @MX:SPEC: SPEC-SKIN-007
// 게시판 공통 답변 에디터 (textarea 기반, WYSIWYG 미사용)

import { useState } from 'react';
import { cn } from '../../../lib/utils';

/**
 * 공통 답변 에디터
 * @param {string} [initialValue] - 초기 답변 내용
 * @param {Function} onSubmit - 답변 제출 핸들러 (content: string) => void
 * @param {boolean} [isLoading] - 제출 중 로딩 상태
 * @param {string} [placeholder] - placeholder 텍스트
 * @param {string} [submitLabel] - 제출 버튼 레이블
 */
const ReplyEditor = ({
  initialValue = '',
  onSubmit,
  isLoading = false,
  placeholder = '답변 내용을 입력하세요.',
  submitLabel = '답변 등록',
}) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit?.(content.trim());
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter로 제출
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        border: '1px solid var(--huni-border-default)',
        borderRadius: 'var(--huni-radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* 에디터 헤더 */}
      <div
        style={{
          padding: 'var(--huni-spacing-xs) var(--huni-spacing-sm)',
          background: 'var(--huni-bg-muted)',
          borderBottom: '1px solid var(--huni-border-default)',
          fontSize: 'var(--huni-font-size-xs)',
          color: 'var(--huni-text-muted)',
        }}
      >
        Ctrl+Enter로 빠르게 제출할 수 있습니다.
      </div>

      {/* 텍스트에어리어 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={6}
        style={{
          width: '100%',
          padding: 'var(--huni-spacing-sm)',
          border: 'none',
          outline: 'none',
          resize: 'vertical',
          fontSize: 'var(--huni-font-size-sm)',
          color: 'var(--huni-text-primary)',
          background: 'var(--huni-bg-surface)',
          fontFamily: 'inherit',
          minHeight: '120px',
          boxSizing: 'border-box',
        }}
        disabled={isLoading}
      />

      {/* 하단 액션 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--huni-spacing-xs) var(--huni-spacing-sm)',
          borderTop: '1px solid var(--huni-border-default)',
          background: 'var(--huni-bg-muted)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--huni-font-size-xs)',
            color: content.length > 2000 ? 'var(--huni-color-error)' : 'var(--huni-text-muted)',
          }}
        >
          {content.length} / 2000자
        </span>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !content.trim() || content.length > 2000}
          style={{
            padding: 'var(--huni-spacing-xs) var(--huni-spacing-md)',
            background: 'var(--huni-color-brand)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--huni-radius-sm)',
            fontSize: 'var(--huni-font-size-sm)',
            fontWeight: 'var(--huni-font-weight-medium)',
            cursor: 'pointer',
            opacity: isLoading || !content.trim() ? 0.5 : 1,
          }}
        >
          {isLoading ? '처리 중...' : submitLabel}
        </button>
      </div>
    </div>
  );
};

export { ReplyEditor };
