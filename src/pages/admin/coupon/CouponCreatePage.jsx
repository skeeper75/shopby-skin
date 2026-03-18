// @MX:SPEC: SPEC-SKIN-007
// 쿠폰 발행 페이지

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CouponForm } from '../../../components/admin/coupon/CouponForm';
import { createCoupon, updateCoupon } from '../../../services/admin/coupon';

const CouponCreatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateCoupon(id, data);
      } else {
        await createCoupon(data);
      }
      navigate('/admin/coupon');
    } catch (err) {
      console.error('[CouponCreatePage] 저장 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--huni-spacing-sm)', marginBottom: 'var(--huni-spacing-xl)' }}>
        <button
          onClick={() => navigate('/admin/coupon')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--huni-text-muted)', fontSize: '18px' }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          {isEdit ? '쿠폰 수정' : '쿠폰 발행'}
        </h1>
      </div>

      <div style={{ padding: 'var(--huni-spacing-xl)', border: '1px solid var(--huni-border-default)', borderRadius: 'var(--huni-radius-md)' }}>
        <CouponForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/coupon')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CouponCreatePage;
