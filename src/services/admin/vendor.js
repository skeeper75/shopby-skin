// @MX:NOTE: [AUTO] 거래처 관리 API 서비스 - 목업 데이터 사용
// @MX:SPEC: SPEC-SKIN-008
// TODO: 실제 API 연동 시 fetchHttpRequest로 교체

/** 거래처 유형 */
export const VENDOR_TYPES = {
  OFFLINE_STORE: '오프라인매장',
  ONLINE_COMPANY: '온라인업체',
  MANUFACTURER: '제조사',
  OTHER: '기타',
};

/** 거래처 등급 */
export const VENDOR_GRADES = {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
};

/** 목업 거래처 데이터 */
const MOCK_VENDORS = [
  {
    id: 1,
    name: '(주)후니인쇄',
    type: '오프라인매장',
    grade: 'S',
    contact: '02-1234-5678',
    email: 'contact@huni.co.kr',
    manager: '김후니',
    address: '서울시 마포구 합정동 123',
    balance: 2500000,
    memo: 'VIP 거래처',
    createdAt: '2024-01-15',
    updatedAt: '2026-03-10',
  },
  {
    id: 2,
    name: '프린텍코리아',
    type: '온라인업체',
    grade: 'A',
    contact: '031-987-6543',
    email: 'sales@printec.kr',
    manager: '이프린',
    address: '경기도 성남시 분당구 456',
    balance: 800000,
    memo: '',
    createdAt: '2024-03-20',
    updatedAt: '2026-02-28',
  },
  {
    id: 3,
    name: '대한종이공업',
    type: '제조사',
    grade: 'B',
    contact: '032-555-1234',
    email: 'order@daehan.com',
    manager: '박종이',
    address: '인천시 남동구 789',
    balance: 150000,
    memo: '용지 전문 공급사',
    createdAt: '2024-06-01',
    updatedAt: '2026-01-15',
  },
  {
    id: 4,
    name: '스마트디자인',
    type: '온라인업체',
    grade: 'A',
    contact: '070-1111-2222',
    email: 'design@smart.co.kr',
    manager: '최디자',
    address: '서울시 강남구 테헤란로 100',
    balance: 350000,
    memo: '',
    createdAt: '2024-09-10',
    updatedAt: '2026-03-01',
  },
  {
    id: 5,
    name: '로컬문구사',
    type: '오프라인매장',
    grade: 'C',
    contact: '02-3333-4444',
    email: 'local@stationery.kr',
    manager: '정문구',
    address: '서울시 은평구 연신내동 50',
    balance: 50000,
    memo: '소규모 거래처',
    createdAt: '2025-01-05',
    updatedAt: '2026-02-10',
  },
  {
    id: 6,
    name: '글로벌패키지',
    type: '기타',
    grade: 'B',
    contact: '051-777-8888',
    email: 'pkg@global.co.kr',
    manager: '오패키',
    address: '부산시 해운대구 센텀 200',
    balance: 620000,
    memo: '포장재 전문',
    createdAt: '2025-03-15',
    updatedAt: '2026-03-12',
  },
];

/** 매장게시판 목업 데이터 */
const MOCK_BOARD_POSTS = [
  {
    id: 1,
    vendorId: 1,
    title: '3월 납품 일정 안내',
    content: '3월 납품 일정을 아래와 같이 안내드립니다.\n\n- 3/15: 명함 500매\n- 3/20: 전단지 1000매',
    author: '관리자',
    createdAt: '2026-03-10',
    isPrivate: true,
  },
  {
    id: 2,
    vendorId: 1,
    title: '계좌 변경 안내',
    content: '거래 계좌가 변경되었습니다. 확인 부탁드립니다.',
    author: '관리자',
    createdAt: '2026-02-20',
    isPrivate: true,
  },
  {
    id: 3,
    vendorId: 2,
    title: '신규 상품 입고 안내',
    content: '프리미엄 코팅지 신규 입고되었습니다.',
    author: '관리자',
    createdAt: '2026-03-05',
    isPrivate: true,
  },
];

/**
 * 거래처 목록 조회
 * @param {Object} params - 검색/필터 파라미터
 * @returns {Promise<{data: Object[], total: number}>}
 */
export const getVendors = async (params = {}) => {
  // TODO: 실제 API 연동
  // return fetchHttpRequest({ url: 'admin/vendors', query: params });
  await new Promise((r) => setTimeout(r, 200)); // 네트워크 지연 시뮬레이션

  let filtered = [...MOCK_VENDORS];

  if (params.type) {
    filtered = filtered.filter((v) => v.type === params.type);
  }
  if (params.grade) {
    filtered = filtered.filter((v) => v.grade === params.grade);
  }
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(kw) ||
        v.manager.toLowerCase().includes(kw) ||
        v.contact.includes(kw)
    );
  }

  return { data: filtered, total: filtered.length };
};

/**
 * 거래처 단건 조회
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getVendor = async (id) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 100));
  const vendor = MOCK_VENDORS.find((v) => v.id === Number(id));
  if (!vendor) throw new Error('거래처를 찾을 수 없습니다.');
  return vendor;
};

/**
 * 거래처 생성
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createVendor = async (data) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 300));
  const newVendor = {
    id: Date.now(),
    ...data,
    balance: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  MOCK_VENDORS.push(newVendor);
  return newVendor;
};

/**
 * 거래처 수정
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateVendor = async (id, data) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 300));
  const idx = MOCK_VENDORS.findIndex((v) => v.id === Number(id));
  if (idx === -1) throw new Error('거래처를 찾을 수 없습니다.');
  MOCK_VENDORS[idx] = {
    ...MOCK_VENDORS[idx],
    ...data,
    updatedAt: new Date().toISOString().split('T')[0],
  };
  return MOCK_VENDORS[idx];
};

/**
 * 거래처 삭제
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteVendor = async (id) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  const idx = MOCK_VENDORS.findIndex((v) => v.id === Number(id));
  if (idx !== -1) MOCK_VENDORS.splice(idx, 1);
};

/**
 * 매장게시판 게시글 목록 조회
 * @param {number} vendorId
 * @returns {Promise<Object[]>}
 */
export const getBoardPosts = async (vendorId) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 100));
  return MOCK_BOARD_POSTS.filter((p) => p.vendorId === Number(vendorId));
};

/**
 * 매장게시판 게시글 생성
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createBoardPost = async (data) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  const newPost = {
    id: Date.now(),
    ...data,
    author: '관리자',
    createdAt: new Date().toISOString().split('T')[0],
    isPrivate: true,
  };
  MOCK_BOARD_POSTS.push(newPost);
  return newPost;
};
