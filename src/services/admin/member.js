// @MX:ANCHOR: 회원 API 서비스 - 회원 목록/상세/탈퇴/프린팅머니 관리
// @MX:REASON: fan_in >= 3 (MemberPage, WithdrawnMemberPage, MemberDetailDrawer 등)
// @MX:SPEC: SPEC-SKIN-007
// @MX:TODO: [AUTO] fetchHttpRequest 실제 API 연동 필요

// --- 목업 데이터 ---

const MOCK_MEMBERS = [
  {
    id: 1, memberId: 'hong123', name: '홍길동', email: 'hong@example.com', phone: '010-1234-5678',
    grade: 'gold', status: 'active', joinedAt: '2024-05-10', lastLoginAt: '2026-03-15',
    totalOrders: 12, totalAmount: 580000, printingMoney: 15000,
    address: { zipCode: '06234', address1: '서울 강남구 테헤란로 123', address2: '101호' },
    orders: [
      { orderId: 'ORD-001', productName: '명함 500매', amount: 35000, status: 'delivered', orderedAt: '2026-03-10' },
      { orderId: 'ORD-002', productName: '전단지 A4 1000매', amount: 55000, status: 'delivered', orderedAt: '2026-02-20' },
    ],
    moneyHistory: [
      { type: 'earn', amount: 5000, reason: '구매 적립', createdAt: '2026-03-10' },
      { type: 'use', amount: 3000, reason: '주문 사용', createdAt: '2026-03-10' },
    ],
    coupons: [
      { couponId: 'CPN-001', name: '신규가입 쿠폰', discountType: 'percent', discountValue: 10, expiredAt: '2026-06-30', status: 'unused' },
    ],
  },
  {
    id: 2, memberId: 'kim456', name: '김철수', email: 'kim@example.com', phone: '010-9876-5432',
    grade: 'silver', status: 'active', joinedAt: '2025-01-15', lastLoginAt: '2026-03-14',
    totalOrders: 5, totalAmount: 210000, printingMoney: 3000,
    address: { zipCode: '03181', address1: '서울 종로구 종로 456', address2: '' },
    orders: [],
    moneyHistory: [],
    coupons: [],
  },
  {
    id: 3, memberId: 'lee789', name: '이영희', email: 'lee@example.com', phone: '010-5555-3333',
    grade: 'normal', status: 'inactive', joinedAt: '2025-06-20', lastLoginAt: '2026-01-05',
    totalOrders: 1, totalAmount: 28000, printingMoney: 0,
    address: { zipCode: '14110', address1: '경기 안양시 동안구 관양로 789', address2: '203호' },
    orders: [],
    moneyHistory: [],
    coupons: [],
  },
];

const MOCK_WITHDRAWN_MEMBERS = [
  {
    id: 101, memberId: 'old001', name: '박탈퇴', email: 'old@example.com', phone: '010-0000-1111',
    grade: 'normal', joinedAt: '2024-01-01', withdrawnAt: '2026-02-28',
    withdrawReason: '서비스 불만족', totalOrders: 2,
  },
];

// --- API 함수 ---

/**
 * 회원 목록 조회
 * @param {Object} params - { page, size, search, grade, status, startDate, endDate }
 */
export const getMembers = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/members', params });
  return { items: MOCK_MEMBERS, total: MOCK_MEMBERS.length, page: 1, size: 20 };
};

/**
 * 회원 상세 조회
 */
export const getMember = async (id) => {
  // TODO: return await fetchHttpRequest({ url: `admin/members/${id}` });
  return MOCK_MEMBERS.find((m) => m.id === id) ?? null;
};

/**
 * 탈퇴 회원 목록 조회
 */
export const getWithdrawnMembers = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/members/withdrawn', params });
  return { items: MOCK_WITHDRAWN_MEMBERS, total: MOCK_WITHDRAWN_MEMBERS.length, page: 1, size: 20 };
};

/**
 * 프린팅머니 지급/차감
 * @param {number} memberId
 * @param {Object} data - { type: 'add'|'deduct', amount, reason }
 */
export const adjustPrintingMoney = async (memberId, data) => {
  // TODO: return await fetchHttpRequest({ url: `admin/members/${memberId}/printing-money`, method: 'POST', data });
  console.log('[TODO] adjustPrintingMoney:', memberId, data);
};

/**
 * 회원 상태 변경 (active/inactive/suspended)
 */
export const updateMemberStatus = async (memberId, status) => {
  // TODO: return await fetchHttpRequest({ url: `admin/members/${memberId}/status`, method: 'PUT', data: { status } });
  console.log('[TODO] updateMemberStatus:', memberId, status);
};
