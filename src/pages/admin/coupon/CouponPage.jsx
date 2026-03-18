// @MX:SPEC: SPEC-SKIN-007
// 쿠폰 목록 관리 페이지

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardList } from '../../../components/admin/board/BoardList';
import { CouponStatusSwitch } from '../../../components/admin/coupon/CouponStatusSwitch';
import { getCoupons, deleteCoupon } from '../../../services/admin/coupon';

const DISCOUNT_TYPE_LABELS = { percent: '정률', fixed: '정액' };
const TARGET_TYPE_LABELS = { all: '전체', category: '카테고리', product: '상품' };

const CouponPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback((params) => getCoupons(params), [refreshKey]);

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    if (!window.confirm(`"${item.name}" 쿠폰을 삭제하시겠습니까?`)) return;
    await deleteCoupon(item.id);
    setRefreshKey((k) => k + 1);
  };

  const config = {
    columns: [
      { key: 'code', label: '쿠폰 코드', width: '130px' },
      { key: 'name', label: '쿠폰명' },
      {
        key: 'discountType',
        label: '할인 유형',
        width: '80px',
        render: (val) => DISCOUNT_TYPE_LABELS[val] ?? val,
      },
      {
        key: 'discountValue',
        label: '할인 값',
        width: '90px',
        render: (val, item) => item.discountType === 'percent' ? `${val}%` : `${val.toLocaleString()}원`,
      },
      {
        key: 'targetType',
        label: '적용 대상',
        width: '100px',
        render: (val) => TARGET_TYPE_LABELS[val] ?? val,
      },
      {
        key: 'issueCount',
        label: '발급/사용',
        width: '100px',
        render: (val, item) => `${val ?? '∞'} / ${item.usedCount}`,
      },
      {
        key: 'endDate',
        label: '만료일',
        width: '120px',
        render: (val) => {
          const isExpired = val && new Date(val) < new Date();
          return (
            <span style={{ color: isExpired ? 'var(--huni-color-error)' : 'var(--huni-text-primary)' }}>
              {val}
            </span>
          );
        },
      },
      {
        key: 'isActive',
        label: '활성',
        width: '70px',
        render: (val, item) => (
          <CouponStatusSwitch
            couponId={item.id}
            isActive={val}
            onToggle={() => setRefreshKey((k) => k + 1)}
          />
        ),
      },
      {
        key: 'actions',
        label: '관리',
        width: '120px',
        render: (_, item) => (
          <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => navigate(`/admin/coupon/${item.id}/edit`)}
              style={actionBtnStyle('edit')}
            >
              수정
            </button>
            <button onClick={(e) => handleDelete(e, item)} style={actionBtnStyle('delete')}>
              삭제
            </button>
          </div>
        ),
      },
    ],
    searchFields: [
      { key: 'search', label: '코드/쿠폰명', type: 'text' },
      { key: 'discountType', label: '할인 유형', type: 'select', options: [{ value: 'percent', label: '정률' }, { value: 'fixed', label: '정액' }] },
    ],
    statusFilters: [
      { value: 'true', label: '활성' },
      { value: 'false', label: '비활성' },
    ],
    fetchData,
  };

  return (
    <div style={{ padding: 'var(--huni-spacing-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--huni-spacing-lg)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--huni-font-size-xl)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
          쿠폰 관리
        </h1>
        <button
          onClick={() => navigate('/admin/coupon/create')}
          style={{ padding: 'var(--huni-spacing-sm) var(--huni-spacing-lg)', background: 'var(--huni-color-brand)', color: '#fff', border: 'none', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', cursor: 'pointer' }}
        >
          + 쿠폰 발행
        </button>
      </div>
      <BoardList
        config={config}
        emptyMessage="등록된 쿠폰이 없습니다."
      />
    </div>
  );
};

const actionBtnStyle = (type) => ({
  padding: '3px 8px',
  border: '1px solid',
  borderColor: type === 'delete' ? 'var(--huni-color-error)' : 'var(--huni-border-default)',
  borderRadius: 'var(--huni-radius-xs)',
  background: 'transparent',
  color: type === 'delete' ? 'var(--huni-color-error)' : 'var(--huni-text-secondary)',
  fontSize: 'var(--huni-font-size-xs)',
  cursor: 'pointer',
});

export default CouponPage;
