// @MX:ANCHOR: 관리자 상품관리 API 서비스 레이어
// @MX:REASON: fan_in >= 3 (상품등록, 가격관리, 마스터데이터 등 다수 페이지에서 사용)
// @MX:SPEC: SPEC-SKIN-006

/**
 * 마스터 데이터 API - 사이즈
 * TODO: 실제 API URL로 교체 필요
 */
export const sizeApi = {
  // GET /api/admin/master/sizes
  getList: async (params = {}) => {
    // TODO: return await fetch(`/api/admin/master/sizes?${new URLSearchParams(params)}`)
    return mockDelay({ items: MOCK_SIZES, total: MOCK_SIZES.length });
  },
  // POST /api/admin/master/sizes
  create: async (data) => {
    // TODO: return await fetch('/api/admin/master/sizes', { method: 'POST', body: JSON.stringify(data) })
    return mockDelay({ id: Date.now(), ...data });
  },
  // PUT /api/admin/master/sizes/:id
  update: async (id, data) => {
    // TODO: return await fetch(`/api/admin/master/sizes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return mockDelay({ id, ...data });
  },
  // DELETE /api/admin/master/sizes/:id
  delete: async (id) => {
    // TODO: return await fetch(`/api/admin/master/sizes/${id}`, { method: 'DELETE' })
    return mockDelay({ success: true });
  },
};

/**
 * 마스터 데이터 API - 소재
 * TODO: 실제 API URL로 교체 필요
 */
export const materialApi = {
  // GET /api/admin/master/materials
  getList: async (params = {}) => {
    // TODO: return await fetch(`/api/admin/master/materials?${new URLSearchParams(params)}`)
    return mockDelay({ items: MOCK_MATERIALS, total: MOCK_MATERIALS.length });
  },
  // POST /api/admin/master/materials
  create: async (data) => {
    // TODO: return await fetch('/api/admin/master/materials', { method: 'POST', body: JSON.stringify(data) })
    return mockDelay({ id: Date.now(), ...data });
  },
  // PUT /api/admin/master/materials/:id
  update: async (id, data) => {
    // TODO: return await fetch(`/api/admin/master/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return mockDelay({ id, ...data });
  },
  // DELETE /api/admin/master/materials/:id
  delete: async (id) => {
    // TODO: return await fetch(`/api/admin/master/materials/${id}`, { method: 'DELETE' })
    return mockDelay({ success: true });
  },
};

/**
 * 마스터 데이터 API - 용지
 * TODO: 실제 API URL로 교체 필요
 */
export const paperApi = {
  // GET /api/admin/master/papers
  getList: async (params = {}) => {
    // TODO: return await fetch(`/api/admin/master/papers?${new URLSearchParams(params)}`)
    return mockDelay({ items: MOCK_PAPERS, total: MOCK_PAPERS.length });
  },
  // POST /api/admin/master/papers
  create: async (data) => {
    // TODO: return await fetch('/api/admin/master/papers', { method: 'POST', body: JSON.stringify(data) })
    return mockDelay({ id: Date.now(), ...data });
  },
  // PUT /api/admin/master/papers/:id
  update: async (id, data) => {
    // TODO: return await fetch(`/api/admin/master/papers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return mockDelay({ id, ...data });
  },
  // DELETE /api/admin/master/papers/:id
  delete: async (id) => {
    // TODO: return await fetch(`/api/admin/master/papers/${id}`, { method: 'DELETE' })
    return mockDelay({ success: true });
  },
};

/**
 * 가격 매트릭스 API
 * TODO: 실제 API URL로 교체 필요
 */
export const priceApi = {
  // GET /api/admin/products/:productId/prices
  getMatrix: async (productId) => {
    // TODO: return await fetch(`/api/admin/products/${productId}/prices`)
    return mockDelay({ matrix: MOCK_PRICE_MATRIX, rows: MOCK_PRICE_ROWS, cols: MOCK_PRICE_COLS });
  },
  // PUT /api/admin/products/:productId/prices
  updateMatrix: async (productId, matrix) => {
    // TODO: return await fetch(`/api/admin/products/${productId}/prices`, { method: 'PUT', body: JSON.stringify(matrix) })
    return mockDelay({ success: true });
  },
  // POST /api/admin/products/:productId/prices/bulk
  bulkImport: async (productId, file) => {
    // TODO: FormData upload
    return mockDelay({ imported: 100, failed: 0 });
  },
};

/**
 * 상품 CRUD API
 * TODO: 실제 API URL로 교체 필요
 */
export const productApi = {
  // GET /api/admin/products
  getList: async (params = {}) => {
    // TODO: return await fetch(`/api/admin/products?${new URLSearchParams(params)}`)
    return mockDelay({ items: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length });
  },
  // GET /api/admin/products/:id
  getOne: async (id) => {
    // TODO: return await fetch(`/api/admin/products/${id}`)
    return mockDelay(MOCK_PRODUCTS.find(p => p.id === id) ?? MOCK_PRODUCTS[0]);
  },
  // POST /api/admin/products
  create: async (data) => {
    // TODO: return await fetch('/api/admin/products', { method: 'POST', body: JSON.stringify(data) })
    return mockDelay({ id: Date.now(), ...data });
  },
  // PUT /api/admin/products/:id
  update: async (id, data) => {
    // TODO: return await fetch(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return mockDelay({ id, ...data });
  },
  // DELETE /api/admin/products/:id
  delete: async (id) => {
    // TODO: return await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    return mockDelay({ success: true });
  },
};

// --- 목(Mock) 헬퍼 ---
const mockDelay = (data, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const MOCK_SIZES = [
  { id: 1, name: 'A4', width: 210, height: 297, unit: 'mm', memo: '기본 A4 사이즈', sortOrder: 1, active: true },
  { id: 2, name: 'A5', width: 148, height: 210, unit: 'mm', memo: 'A5 사이즈', sortOrder: 2, active: true },
  { id: 3, name: 'B5', width: 176, height: 250, unit: 'mm', memo: 'B5 사이즈', sortOrder: 3, active: true },
  { id: 4, name: '명함', width: 90, height: 50, unit: 'mm', memo: '표준 명함', sortOrder: 4, active: true },
  { id: 5, name: 'A3', width: 297, height: 420, unit: 'mm', memo: 'A3 사이즈', sortOrder: 5, active: false },
];

const MOCK_MATERIALS = [
  { id: 1, name: '아트지', gsm: 130, type: 'coated', memo: '광택 코팅지', sortOrder: 1, active: true },
  { id: 2, name: '스노우지', gsm: 120, type: 'coated', memo: '반광 코팅지', sortOrder: 2, active: true },
  { id: 3, name: '모조지', gsm: 100, type: 'uncoated', memo: '비코팅지', sortOrder: 3, active: true },
  { id: 4, name: '크라프트지', gsm: 180, type: 'kraft', memo: '자연색 포장지', sortOrder: 4, active: true },
];

const MOCK_PAPERS = [
  { id: 1, name: '아트지 130g', materialId: 1, gsm: 130, finish: 'glossy', memo: '', sortOrder: 1, active: true },
  { id: 2, name: '스노우지 120g', materialId: 2, gsm: 120, finish: 'matte', memo: '', sortOrder: 2, active: true },
  { id: 3, name: '모조지 100g', materialId: 3, gsm: 100, finish: 'none', memo: '', sortOrder: 3, active: true },
];

const MOCK_PRICE_ROWS = ['100장', '200장', '300장', '500장', '1000장'];
const MOCK_PRICE_COLS = ['단면', '양면'];
const MOCK_PRICE_MATRIX = {
  '100장-단면': 15000, '100장-양면': 20000,
  '200장-단면': 22000, '200장-양면': 28000,
  '300장-단면': 30000, '300장-양면': 38000,
  '500장-단면': 45000, '500장-양면': 56000,
  '1000장-단면': 80000, '1000장-양면': 98000,
};

const MOCK_PRODUCTS = [
  { id: 1, name: '명함 인쇄', category: 'print', type: 'business-card', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: '전단지 인쇄', category: 'print', type: 'flyer', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: '브로슈어', category: 'print', type: 'brochure', status: 'draft', createdAt: '2024-02-01' },
];
