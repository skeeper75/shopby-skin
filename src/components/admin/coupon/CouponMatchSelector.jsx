// @MX:SPEC: SPEC-SKIN-007
// 쿠폰 적용 대상 매칭 선택 컴포넌트 (전체/카테고리/상품)

import { useState } from 'react';

// 목업 카테고리 데이터
const MOCK_CATEGORIES = [
  { id: 'card', name: '명함' },
  { id: 'flyer', name: '전단지' },
  { id: 'banner', name: '현수막' },
  { id: 'sticker', name: '스티커' },
  { id: 'envelope', name: '봉투' },
];

// 목업 상품 데이터
const MOCK_PRODUCTS = [
  { id: 'prod-001', name: '스탠다드 명함 (200g)', category: 'card' },
  { id: 'prod-002', name: '고급 명함 (350g)', category: 'card' },
  { id: 'prod-003', name: 'A4 전단지 (80g)', category: 'flyer' },
  { id: 'prod-004', name: 'A5 전단지 (100g)', category: 'flyer' },
];

const TARGET_TYPES = [
  { value: 'all', label: '전체 상품' },
  { value: 'category', label: '카테고리 지정' },
  { value: 'product', label: '상품 지정' },
];

/**
 * 쿠폰 적용 대상 선택 컴포넌트
 * @param {string} targetType - 적용 타입 ('all'|'category'|'product')
 * @param {string[]} targetIds - 선택된 ID 목록
 * @param {Function} onChange - 변경 핸들러 ({ targetType, targetIds }) => void
 */
const CouponMatchSelector = ({ targetType = 'all', targetIds = [], onChange }) => {
  const handleTypeChange = (type) => {
    onChange?.({ targetType: type, targetIds: [] });
  };

  const handleToggleId = (id) => {
    const newIds = targetIds.includes(id)
      ? targetIds.filter((t) => t !== id)
      : [...targetIds, id];
    onChange?.({ targetType, targetIds: newIds });
  };

  const items = targetType === 'category' ? MOCK_CATEGORIES : MOCK_PRODUCTS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-sm)' }}>
      {/* 타입 선택 */}
      <div style={{ display: 'flex', gap: 'var(--huni-spacing-sm)' }}>
        {TARGET_TYPES.map((opt) => (
          <label
            key={opt.value}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-primary)' }}
          >
            <input
              type="radio"
              name="couponTargetType"
              value={opt.value}
              checked={targetType === opt.value}
              onChange={() => handleTypeChange(opt.value)}
              style={{ accentColor: 'var(--huni-color-brand)' }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* 카테고리/상품 선택 */}
      {targetType !== 'all' && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--huni-spacing-xs)',
            padding: 'var(--huni-spacing-sm)',
            border: '1px solid var(--huni-border-default)',
            borderRadius: 'var(--huni-radius-sm)',
            background: 'var(--huni-bg-muted)',
            maxHeight: '160px',
            overflowY: 'auto',
          }}
        >
          {items.map((item) => {
            const isSelected = targetIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleId(item.id)}
                style={{
                  padding: '4px 12px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--huni-color-brand)' : 'var(--huni-border-default)',
                  borderRadius: 'var(--huni-radius-xs)',
                  background: isSelected ? 'var(--huni-color-brand)' : 'var(--huni-bg-surface)',
                  color: isSelected ? '#fff' : 'var(--huni-text-secondary)',
                  fontSize: 'var(--huni-font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      )}

      {/* 선택 요약 */}
      {targetType !== 'all' && targetIds.length > 0 && (
        <p style={{ margin: 0, fontSize: 'var(--huni-font-size-xs)', color: 'var(--huni-text-muted)' }}>
          {targetIds.length}개 선택됨
        </p>
      )}
    </div>
  );
};

export { CouponMatchSelector };
