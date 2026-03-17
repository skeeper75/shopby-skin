// @MX:NOTE: [AUTO] 계좌/원장/미수금 관리 API 서비스 - 목업 데이터 사용
// @MX:SPEC: SPEC-SKIN-008
// TODO: 실제 API 연동 시 fetchHttpRequest로 교체

/** 계좌 용도 */
export const ACCOUNT_PURPOSES = {
  DEPOSIT: '입금',
  WITHDRAWAL: '출금',
  SECURITY: '보증금',
};

/** 거래 유형 */
export const TRANSACTION_TYPES = {
  CREDIT: '입금',
  DEBIT: '출금',
  ADJUSTMENT: '조정',
};

/** 미수금 상태 */
export const RECEIVABLE_STATUS = {
  NORMAL: '정상',
  WARNING: '주의',
  DANGER: '경고',
  SUSPENDED: '거래중지',
};

/** 미수금 상태별 색상 */
export const RECEIVABLE_STATUS_COLORS = {
  정상: '#00C853',
  주의: '#FF9800',
  경고: '#F44336',
  거래중지: '#424242',
};

/** 목업 계좌 데이터 */
const MOCK_ACCOUNTS = [
  {
    id: 1,
    bankName: '국민은행',
    accountNumber: '123-456-789012',
    accountHolder: '(주)후니인쇄',
    purpose: '입금',
    balance: 12500000,
    memo: '메인 입금계좌',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    bankName: '신한은행',
    accountNumber: '987-654-321098',
    accountHolder: '(주)후니인쇄',
    purpose: '출금',
    balance: 5200000,
    memo: '공급사 대금 지급',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    bankName: '우리은행',
    accountNumber: '456-789-012345',
    accountHolder: '(주)후니인쇄',
    purpose: '보증금',
    balance: 3000000,
    memo: '임대 보증금 관리',
    isActive: true,
    createdAt: '2024-06-15',
  },
];

/** 목업 원장 거래 데이터 */
const MOCK_LEDGER_ENTRIES = [
  {
    id: 1,
    date: '2026-03-15',
    vendorId: 1,
    vendorName: '(주)후니인쇄',
    type: '입금',
    amount: 500000,
    balance: 2500000,
    description: '명함 500매 납품 대금',
    accountId: 1,
    invoiceNo: 'INV-2026-0315-001',
    memo: '',
    createdAt: '2026-03-15',
  },
  {
    id: 2,
    date: '2026-03-12',
    vendorId: 2,
    vendorName: '프린텍코리아',
    type: '출금',
    amount: 200000,
    balance: 800000,
    description: '코팅지 발주 대금',
    accountId: 2,
    invoiceNo: 'INV-2026-0312-001',
    memo: '',
    createdAt: '2026-03-12',
  },
  {
    id: 3,
    date: '2026-03-10',
    vendorId: 3,
    vendorName: '대한종이공업',
    type: '입금',
    amount: 150000,
    balance: 150000,
    description: 'A4 용지 납품 대금 수령',
    accountId: 1,
    invoiceNo: 'INV-2026-0310-001',
    memo: '부분 납부',
    createdAt: '2026-03-10',
  },
  {
    id: 4,
    date: '2026-03-08',
    vendorId: 4,
    vendorName: '스마트디자인',
    type: '입금',
    amount: 350000,
    balance: 350000,
    description: '로고 디자인 완료 대금',
    accountId: 1,
    invoiceNo: 'INV-2026-0308-001',
    memo: '',
    createdAt: '2026-03-08',
  },
  {
    id: 5,
    date: '2026-03-05',
    vendorId: 1,
    vendorName: '(주)후니인쇄',
    type: '출금',
    amount: 300000,
    balance: 2200000,
    description: '인쇄 장비 유지보수비',
    accountId: 2,
    invoiceNo: 'INV-2026-0305-001',
    memo: '',
    createdAt: '2026-03-05',
  },
];

/** 목업 미수금 데이터 */
const MOCK_RECEIVABLES = [
  {
    vendorId: 1,
    vendorName: '(주)후니인쇄',
    vendorType: '오프라인매장',
    totalBalance: 2500000,
    overdueAmount: 0,
    overdueDays: 0,
    status: '정상',
    lastTransactionDate: '2026-03-15',
  },
  {
    vendorId: 2,
    vendorName: '프린텍코리아',
    vendorType: '온라인업체',
    totalBalance: 800000,
    overdueAmount: 450000,
    overdueDays: 35,
    status: '주의',
    lastTransactionDate: '2026-02-08',
  },
  {
    vendorId: 3,
    vendorName: '대한종이공업',
    vendorType: '제조사',
    totalBalance: 1200000,
    overdueAmount: 800000,
    overdueDays: 65,
    status: '경고',
    lastTransactionDate: '2026-01-10',
  },
  {
    vendorId: 5,
    vendorName: '로컬문구사',
    vendorType: '오프라인매장',
    totalBalance: 500000,
    overdueAmount: 500000,
    overdueDays: 120,
    status: '거래중지',
    lastTransactionDate: '2025-11-15',
  },
];

/**
 * 계좌 목록 조회
 * @returns {Promise<Object[]>}
 */
export const getAccounts = async () => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 150));
  return [...MOCK_ACCOUNTS];
};

/**
 * 원장 거래 목록 조회
 * @param {Object} params - 필터 파라미터 (dateFrom, dateTo, vendorId, type)
 * @returns {Promise<{data: Object[], total: number}>}
 */
export const getLedgerEntries = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));

  let filtered = [...MOCK_LEDGER_ENTRIES];

  if (params.dateFrom) {
    filtered = filtered.filter((e) => e.date >= params.dateFrom);
  }
  if (params.dateTo) {
    filtered = filtered.filter((e) => e.date <= params.dateTo);
  }
  if (params.vendorId) {
    filtered = filtered.filter((e) => e.vendorId === Number(params.vendorId));
  }
  if (params.type) {
    filtered = filtered.filter((e) => e.type === params.type);
  }

  return { data: filtered, total: filtered.length };
};

/**
 * 원장 거래 등록
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createLedgerEntry = async (data) => {
  // TODO: 실제 API 연동 및 잔액 자동 계산
  await new Promise((r) => setTimeout(r, 300));
  const newEntry = {
    id: Date.now(),
    ...data,
    balance: 0, // TODO: 실제 잔액 계산 로직
    invoiceNo: `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Date.now()).slice(-3)}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  MOCK_LEDGER_ENTRIES.unshift(newEntry);
  return newEntry;
};

/**
 * 업체별 미수금 목록 조회
 * @param {Object} params - 필터 파라미터 (status)
 * @returns {Promise<Object[]>}
 */
export const getReceivables = async (params = {}) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));

  let filtered = [...MOCK_RECEIVABLES];

  if (params.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  return filtered;
};

/**
 * 청구서 데이터 조회
 * @param {string} invoiceNo
 * @returns {Promise<Object>}
 */
export const getInvoice = async (invoiceNo) => {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 100));
  const entry = MOCK_LEDGER_ENTRIES.find((e) => e.invoiceNo === invoiceNo);
  if (!entry) throw new Error('청구서를 찾을 수 없습니다.');
  return {
    ...entry,
    issueDate: entry.date,
    dueDate: entry.date, // TODO: 실제 만기일 계산
    items: [
      {
        description: entry.description,
        quantity: 1,
        unitPrice: entry.amount,
        total: entry.amount,
      },
    ],
    subtotal: entry.amount,
    tax: Math.round(entry.amount * 0.1),
    total: Math.round(entry.amount * 1.1),
  };
};
