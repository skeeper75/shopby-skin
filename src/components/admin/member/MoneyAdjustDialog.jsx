// @MX:SPEC: SPEC-SKIN-007
// 프린팅머니 지급/차감 다이얼로그

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../ui/Dialog';
import { Field, FieldLabel, FieldError } from '../../ui/Field';
import { TextField } from '../../ui/TextField';
import { adjustPrintingMoney } from '../../../services/admin/member';

/**
 * 프린팅머니 지급/차감 Dialog
 * @param {boolean} isOpen - 열림 여부
 * @param {Function} onClose - 닫기 핸들러
 * @param {Object} member - 대상 회원 { id, name, printingMoney }
 * @param {Function} onSuccess - 성공 후 콜백
 */
const MoneyAdjustDialog = ({ isOpen, onClose, member, onSuccess }) => {
  const [form, setForm] = useState({ type: 'add', amount: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    const amount = Number(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) newErrors.amount = '올바른 금액을 입력하세요.';
    if (form.type === 'deduct' && member && amount > member.printingMoney) {
      newErrors.amount = `차감 금액이 보유 금액(${member.printingMoney.toLocaleString()}원)을 초과합니다.`;
    }
    if (!form.reason.trim()) newErrors.reason = '사유를 입력하세요.';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await adjustPrintingMoney(member.id, {
        type: form.type,
        amount: Number(form.amount),
        reason: form.reason,
      });
      onSuccess?.();
      onClose();
      setForm({ type: 'add', amount: '', reason: '' });
    } catch (err) {
      console.error('[MoneyAdjustDialog] 처리 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
      setForm({ type: 'add', amount: '', reason: '' });
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent style={{ maxWidth: '480px' }}>
        <DialogHeader>
          <DialogTitle>프린팅머니 {form.type === 'add' ? '지급' : '차감'}</DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-md)', padding: 'var(--huni-spacing-md) 0' }}>
          {/* 대상 회원 정보 */}
          {member && (
            <div
              style={{
                padding: 'var(--huni-spacing-sm)',
                background: 'var(--huni-bg-muted)',
                borderRadius: 'var(--huni-radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-secondary)' }}>
                {member.name} ({member.memberId})
              </span>
              <span style={{ fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', color: 'var(--huni-text-primary)' }}>
                현재 보유: {(member.printingMoney ?? 0).toLocaleString()}원
              </span>
            </div>
          )}

          {/* 지급/차감 선택 */}
          <Field>
            <FieldLabel>유형</FieldLabel>
            <div style={{ display: 'flex', gap: 'var(--huni-spacing-sm)' }}>
              {[
                { value: 'add', label: '지급' },
                { value: 'deduct', label: '차감' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: 'var(--huni-font-size-sm)',
                    color: 'var(--huni-text-primary)',
                  }}
                >
                  <input
                    type="radio"
                    name="moneyType"
                    value={opt.value}
                    checked={form.type === opt.value}
                    onChange={() => handleChange('type', opt.value)}
                    style={{ accentColor: 'var(--huni-color-brand)' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </Field>

          {/* 금액 */}
          <Field>
            <FieldLabel required>금액 (원)</FieldLabel>
            <TextField
              type="number"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="금액 입력"
              min={1}
            />
            {errors.amount && <FieldError>{errors.amount}</FieldError>}
          </Field>

          {/* 사유 */}
          <Field>
            <FieldLabel required>사유</FieldLabel>
            <TextField
              value={form.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="지급/차감 사유를 입력하세요."
              maxLength={100}
            />
            {errors.reason && <FieldError>{errors.reason}</FieldError>}
          </Field>
        </div>

        <DialogFooter>
          <button
            onClick={() => handleOpenChange(false)}
            style={secondaryBtnStyle}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            style={{
              ...primaryBtnStyle,
              background: form.type === 'deduct' ? 'var(--huni-color-error)' : 'var(--huni-color-brand)',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : form.type === 'add' ? '지급하기' : '차감하기'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const primaryBtnStyle = { padding: 'var(--huni-spacing-sm) var(--huni-spacing-lg)', color: '#fff', border: 'none', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', cursor: 'pointer' };
const secondaryBtnStyle = { padding: 'var(--huni-spacing-sm) var(--huni-spacing-lg)', background: 'var(--huni-bg-surface)', color: 'var(--huni-text-secondary)', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', cursor: 'pointer' };

export { MoneyAdjustDialog };
