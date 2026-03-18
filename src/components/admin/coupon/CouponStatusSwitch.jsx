// @MX:SPEC: SPEC-SKIN-007
// 쿠폰 활성/비활성 Switch 컴포넌트

import { useState } from 'react';
import { toggleCouponStatus } from '../../../services/admin/coupon';

/**
 * 쿠폰 활성/비활성 토글 Switch
 * @param {number} couponId - 쿠폰 ID
 * @param {boolean} isActive - 현재 활성 상태
 * @param {Function} [onToggle] - 토글 후 콜백 (newStatus: boolean) => void
 */
const CouponStatusSwitch = ({ couponId, isActive: initialActive, onToggle }) => {
  const [isActive, setIsActive] = useState(initialActive);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (isLoading) return;
    const newStatus = !isActive;
    setIsLoading(true);
    try {
      await toggleCouponStatus(couponId, newStatus);
      setIsActive(newStatus);
      onToggle?.(newStatus);
    } catch (err) {
      console.error('[CouponStatusSwitch] 상태 변경 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      role="switch"
      aria-checked={isActive}
      onClick={handleToggle}
      disabled={isLoading}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: isActive ? 'var(--huni-color-brand)' : 'var(--huni-border-default)',
        border: 'none',
        cursor: isLoading ? 'wait' : 'pointer',
        padding: '2px',
        transition: 'background 0.2s',
        outline: 'none',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <span
        style={{
          display: 'block',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transform: isActive ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s',
        }}
      />
    </button>
  );
};

export { CouponStatusSwitch };
