// @MX:SPEC: SPEC-SKIN-007
// 공지사항 작성/수정 페이지

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '../../../components/ui/TextField';
import { Field, FieldLabel, FieldError } from '../../../components/ui/Field';
import { createNotice, updateNotice } from '../../../services/admin/board';

/**
 * 공지사항 작성/수정 페이지
 * - URL 파라미터 id가 있으면 수정 모드
 */
const NoticeCreatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    content: '',
    status: 'draft',
    isPinned: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = '제목을 입력하세요.';
    if (!form.content.trim()) newErrors.content = '내용을 입력하세요.';
    return newErrors;
  };

  const handleSubmit = async (status) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = { ...form, status };
      if (isEdit) {
        await updateNotice(id, data);
      } else {
        await createNotice(data);
      }
      navigate('/admin/board/notice');
    } catch (err) {
      console.error('[NoticeCreatePage] 저장 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)', maxWidth: '800px' }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--huni-spacing-sm)',
          marginBottom: 'var(--huni-spacing-xl)',
        }}
      >
        <button
          onClick={() => navigate('/admin/board/notice')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--huni-text-muted)', fontSize: '18px' }}
        >
          ←
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--huni-font-size-xl)',
            fontWeight: 'var(--huni-font-weight-bold)',
            color: 'var(--huni-text-primary)',
          }}
        >
          {isEdit ? '공지사항 수정' : '공지사항 작성'}
        </h1>
      </div>

      {/* 폼 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--huni-spacing-lg)',
          padding: 'var(--huni-spacing-xl)',
          border: '1px solid var(--huni-border-default)',
          borderRadius: 'var(--huni-radius-md)',
        }}
      >
        {/* 고정 여부 */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--huni-spacing-xs)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(e) => handleChange('isPinned', e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--huni-color-brand)' }}
          />
          <span style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-primary)' }}>
            상단 고정
          </span>
        </label>

        {/* 제목 */}
        <Field>
          <FieldLabel required>제목</FieldLabel>
          <TextField
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="공지사항 제목을 입력하세요."
            maxLength={200}
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        {/* 내용 */}
        <Field>
          <FieldLabel required>내용</FieldLabel>
          <textarea
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="공지사항 내용을 입력하세요."
            rows={15}
            style={{
              width: '100%',
              padding: 'var(--huni-spacing-sm)',
              border: `1px solid ${errors.content ? 'var(--huni-color-error)' : 'var(--huni-border-default)'}`,
              borderRadius: 'var(--huni-radius-sm)',
              fontSize: 'var(--huni-font-size-sm)',
              color: 'var(--huni-text-primary)',
              background: 'var(--huni-bg-surface)',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {errors.content && <FieldError>{errors.content}</FieldError>}
        </Field>
      </div>

      {/* 하단 버튼 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--huni-spacing-sm)',
          marginTop: 'var(--huni-spacing-lg)',
        }}
      >
        <button
          onClick={() => navigate('/admin/board/notice')}
          disabled={isSubmitting}
          style={secondaryBtnStyle}
        >
          취소
        </button>
        <button
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting}
          style={secondaryBtnStyle}
        >
          임시저장
        </button>
        <button
          onClick={() => handleSubmit('published')}
          disabled={isSubmitting}
          style={primaryBtnStyle}
        >
          {isSubmitting ? '저장 중...' : '게시하기'}
        </button>
      </div>
    </div>
  );
};

const primaryBtnStyle = {
  padding: 'var(--huni-spacing-sm) var(--huni-spacing-xl)',
  background: 'var(--huni-color-brand)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  fontWeight: 'var(--huni-font-weight-medium)',
  cursor: 'pointer',
};

const secondaryBtnStyle = {
  padding: 'var(--huni-spacing-sm) var(--huni-spacing-xl)',
  background: 'var(--huni-bg-surface)',
  color: 'var(--huni-text-secondary)',
  border: '1px solid var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-sm)',
  fontSize: 'var(--huni-font-size-sm)',
  cursor: 'pointer',
};

export default NoticeCreatePage;
