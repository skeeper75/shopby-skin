// @MX:ANCHOR: 쿠폰 API 서비스 - 쿠폰 CRUD, 매칭, 상태 관리
// @MX:REASON: fan_in >= 3 (CouponPage, CouponCreatePage, CouponForm 등)
// @MX:SPEC: SPEC-SKIN-007
// @MX:TODO: [AUTO] fetchHttpRequest 실제 API 연동 필요

// --- 목업 데이터 ---

const MOCK_COUPONS = [
  {
    id: 1, code: 'WELCOME10', name: '신규가입 10% 할인', discountType: 'percent', discountValue: 10,
    minOrderAmount: 10000, maxDiscountAmount: 5000, isActive: true,
    targetType: 'all', targetIds: [],
    startDate: '2026-01-01', endDate: '2026-12-31',
    issueCount: 500, usedCount: 123,
    createdAt: '2025-12-20',
  },
  {
    id: 2, code: 'CARD2000', name: '명함 2000원 할인', discountType: 'fixed', discountValue: 2000,
    minOrderAmount: 20000, maxDiscountAmount: null, isActive: true,
    targetType: 'category', targetIds: ['card'],
    startDate: '2026-03-01', endDate: '2026-03-31',
    issueCount: 200, usedCount: 45,
    createdAt: '2026-02-25',
  },
  {
    id: 3, code: 'SPRING15', name: '봄맞이 15% 할인', discountType: 'percent', discountValue: 15,
    minOrderAmount: 30000, maxDiscountAmount: 10000, isActive: false,
    targetType: 'product', targetIds: ['prod-001', 'prod-002'],
    startDate: '2026-03-01', endDate: '2026-03-15',
    issueCount: 100, usedCount: 98,
    createdAt: '2026-02-28',
  },
];

// --- API 함수 ---

/**
 * 쿠폰 목록 조회
 * @param {Object} params - { page, size, search, isActive, discountType }
 */
export const getCoupons = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/coupons', params });
  return { items: MOCK_COUPONS, total: MOCK_COUPONS.length, page: 1, size: 20 };
};

/**
 * 쿠폰 단건 조회
 */
export const getCoupon = async (id) => {
  // TODO: return await fetchHttpRequest({ url: `admin/coupons/${id}` });
  return MOCK_COUPONS.find((c) => c.id === id) ?? null;
};

/**
 * 쿠폰 생성 (발행)
 */
export const createCoupon = async (data) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/coupons', method: 'POST', data });
  console.log('[TODO] createCoupon:', data);
  return { ...data, id: Date.now() };
};

/**
 * 쿠폰 수정
 */
export const updateCoupon = async (id, data) => {
  // TODO: return await fetchHttpRequest({ url: `admin/coupons/${id}`, method: 'PUT', data });
  console.log('[TODO] updateCoupon:', id, data);
  return { id, ...data };
};

/**
 * 쿠폰 삭제
 */
export const deleteCoupon = async (id) => {
  // TODO: return await fetchHttpRequest({ url: `admin/coupons/${id}`, method: 'DELETE' });
  console.log('[TODO] deleteCoupon:', id);
};

/**
 * 쿠폰 활성/비활성 토글
 */
export const toggleCouponStatus = async (id, isActive) => {
  // TODO: return await fetchHttpRequest({ url: `admin/coupons/${id}/status`, method: 'PUT', data: { isActive } });
  console.log('[TODO] toggleCouponStatus:', id, isActive);
};

/**
 * 쿠폰 발급 (특정 회원에게)
 * @param {number} couponId
 * @param {string[]} memberIds
 */
export const issueCouponToMembers = async (couponId, memberIds) => {
  // TODO: return await fetchHttpRequest({ url: `admin/coupons/${couponId}/issue`, method: 'POST', data: { memberIds } });
  console.log('[TODO] issueCouponToMembers:', couponId, memberIds);
};
