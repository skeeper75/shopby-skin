// @MX:SPEC: SPEC-SKIN-007
// FAQ 작성/수정 페이지

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '../../../components/ui/TextField';
import { Field, FieldLabel, FieldError } from '../../../components/ui/Field';
import { createFaq, updateFaq } from '../../../services/admin/board';

const FAQ_CATEGORIES = [
  { value: 'order', label: '주문' },
  { value: 'print', label: '인쇄' },
  { value: 'delivery', label: '배송' },
  { value: 'payment', label: '결제' },
  { value: 'etc', label: '기타' },
];

const FaqCreatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    category: 'etc',
    question: '',
    answer: '',
    status: 'draft',
    order: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.question.trim()) newErrors.question = '질문을 입력하세요.';
    if (!form.answer.trim()) newErrors.answer = '답변을 입력하세요.';
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
        await updateFaq(id, data);
      } else {
        await createFaq(data);
      }
      navigate('/admin/board/faq');
    } catch (err) {
      console.error('[FaqCreatePage] 저장 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--huni-spacing-sm)', marginBottom: 'var(--huni-spacing-xl)' }}>
        <button onClick={() => navigate('/admin/board/faq')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--huni-text-muted)', fontSize: '18px' }}>
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          {isEdit ? 'FAQ 수정' : 'FAQ 등록'}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-lg)', padding: 'var(--huni-spacing-xl)', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-md)' }}>
        {/* 카테고리 */}
        <Field>
          <FieldLabel>카테고리</FieldLabel>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-primary)' }}
          >
            {FAQ_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>

        {/* 순서 */}
        <Field>
          <FieldLabel>노출 순서</FieldLabel>
          <TextField
            type="number"
            value={form.order}
            onChange={(e) => handleChange('order', Number(e.target.value))}
            style={{ width: '120px' }}
          />
        </Field>

        {/* 질문 */}
        <Field>
          <FieldLabel required>질문</FieldLabel>
          <TextField
            value={form.question}
            onChange={(e) => handleChange('question', e.target.value)}
            placeholder="자주 묻는 질문을 입력하세요."
            maxLength={200}
          />
          {errors.question && <FieldError>{errors.question}</FieldError>}
        </Field>

        {/* 답변 */}
        <Field>
          <FieldLabel required>답변</FieldLabel>
          <textarea
            value={form.answer}
            onChange={(e) => handleChange('answer', e.target.value)}
            placeholder="FAQ 답변을 입력하세요."
            rows={10}
            style={{
              width: '100%',
              padding: 'var(--huni-spacing-sm)',
              border: `1px solid ${errors.answer ? 'var(--huni-color-error)' : 'var(--huni-border-default)'}`,
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
          {errors.answer && <FieldError>{errors.answer}</FieldError>}
        </Field>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--huni-spacing-sm)', marginTop: 'var(--huni-spacing-lg)' }}>
        <button onClick={() => navigate('/admin/board/faq')} disabled={isSubmitting} style={secondaryBtnStyle}>취소</button>
        <button onClick={() => handleSubmit('draft')} disabled={isSubmitting} style={secondaryBtnStyle}>임시저장</button>
        <button onClick={() => handleSubmit('published')} disabled={isSubmitting} style={primaryBtnStyle}>
          {isSubmitting ? '저장 중...' : '게시하기'}
        </button>
      </div>
    </div>
  );
};

const primaryBtnStyle = { padding: 'var(--huni-spacing-sm) var(--huni-spacing-xl)', background: 'var(--huni-color-brand)', color: '#fff', border: 'none', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', cursor: 'pointer' };
const secondaryBtnStyle = { padding: 'var(--huni-spacing-sm) var(--huni-spacing-xl)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-secondary)', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', cursor: 'pointer' };

export default FaqCreatePage;
