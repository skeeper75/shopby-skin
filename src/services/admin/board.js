// @MX:ANCHOR: 게시판 API 서비스 - 공지/FAQ/Q&A/1:1문의/특수문의 CRUD
// @MX:REASON: fan_in >= 3 (NoticePage, FaqPage, QaPage, PersonalInquiryPage 등 다수 사용)
// @MX:SPEC: SPEC-SKIN-007
// @MX:TODO: [AUTO] fetchHttpRequest 실제 API 연동 필요

// TODO: 실제 API 연동 시 아래 import 사용
// import { fetchHttpRequest } from '../../utils/http';

// --- 목업 데이터 ---

const MOCK_NOTICES = [
  { id: 1, title: '서비스 점검 안내', content: '2026-03-20 00:00~04:00 서비스 점검이 있습니다.', status: 'published', isPinned: true, createdAt: '2026-03-15', viewCount: 342 },
  { id: 2, title: '신규 기능 업데이트 안내', content: '인쇄 옵션 추가 기능이 업데이트되었습니다.', status: 'published', isPinned: false, createdAt: '2026-03-10', viewCount: 198 },
  { id: 3, title: '개인정보처리방침 변경 안내 (초안)', content: '개인정보처리방침이 변경될 예정입니다.', status: 'draft', isPinned: false, createdAt: '2026-03-08', viewCount: 0 },
];

const MOCK_FAQS = [
  { id: 1, category: 'order', question: '주문 취소는 어떻게 하나요?', answer: '마이페이지 > 주문내역에서 취소 가능합니다.', status: 'published', order: 1, createdAt: '2026-01-10' },
  { id: 2, category: 'print', question: '인쇄 파일 규격은 어떻게 되나요?', answer: 'PDF 형식, 300dpi 이상을 권장합니다.', status: 'published', order: 2, createdAt: '2026-01-15' },
  { id: 3, category: 'delivery', question: '배송 기간은 얼마나 걸리나요?', answer: '영업일 기준 2-3일 소요됩니다.', status: 'draft', order: 3, createdAt: '2026-02-01' },
];

const MOCK_QAS = [
  { id: 1, title: '명함 재질 문의', content: '일반 용지와 고급 용지 차이가 궁금합니다.', status: 'pending', memberName: '홍길동', memberId: 'hong123', createdAt: '2026-03-14', reply: null },
  { id: 2, title: '대량 주문 견적 요청', content: '500개 이상 주문 시 단가 할인이 가능한가요?', status: 'answered', memberName: '김철수', memberId: 'kim456', createdAt: '2026-03-13', reply: { content: '500개 이상 주문 시 10% 할인이 가능합니다.', createdAt: '2026-03-13' } },
  { id: 3, title: '파일 업로드 오류', content: '파일 업로드 시 오류가 발생합니다.', status: 'pending', memberName: '이영희', memberId: 'lee789', createdAt: '2026-03-12', reply: null },
];

const MOCK_PERSONAL_INQUIRIES = [
  { id: 1, title: '결제 오류 문의', content: '카드 결제 중 오류가 발생했습니다.', status: 'pending', memberName: '박민수', memberId: 'park001', createdAt: '2026-03-15', reply: null },
  { id: 2, title: '환불 처리 요청', content: '주문번호 20260310-001 환불 요청드립니다.', status: 'answered', memberName: '최지영', memberId: 'choi002', createdAt: '2026-03-10', reply: { content: '환불 처리 완료되었습니다.', createdAt: '2026-03-11' } },
];

const MOCK_BULK_INQUIRIES = [
  { id: 1, title: '명함 1000매 견적 요청', content: '명함 앞면 풀칼라, 뒷면 단면 1000매 견적 부탁드립니다.', status: 'pending', companyName: '(주)ABC기업', contactName: '김대리', contactPhone: '010-1234-5678', email: 'kim@abc.co.kr', createdAt: '2026-03-15', reply: null },
  { id: 2, title: '전단지 5000매 견적', content: 'A5 사이즈 전단지 5000매 견적 요청합니다.', status: 'answered', companyName: '개인', contactName: '이개인', contactPhone: '010-9876-5432', email: 'lee@gmail.com', createdAt: '2026-03-12', reply: { content: '견적서를 이메일로 발송하였습니다.', createdAt: '2026-03-13' } },
];

const MOCK_BUSINESS_CONSULTS = [
  { id: 1, title: '기업 정기 인쇄 계약 상담', content: '매월 정기적인 인쇄물 제작 계약을 원합니다.', status: 'pending', companyName: '(주)XYZ코리아', contactName: '박부장', contactPhone: '02-1234-5678', email: 'park@xyz.co.kr', createdAt: '2026-03-14' },
];

const MOCK_DESIGN_CONSULTS = [
  { id: 1, title: '브랜드 로고 포함 명함 디자인 요청', content: '회사 로고를 활용한 명함 디자인 컨설팅 원합니다.', status: 'pending', contactName: '정디자인', contactPhone: '010-5555-7777', email: 'jung@design.com', createdAt: '2026-03-15' },
];

// --- API 함수 ---

/**
 * 공지사항 목록 조회
 * @param {Object} params - { page, size, search, status }
 */
export const getNotices = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/notices', params });
  return { items: MOCK_NOTICES, total: MOCK_NOTICES.length, page: 1, size: 20 };
};

/**
 * 공지사항 단건 조회
 */
export const getNotice = async (id) => {
  // TODO: return await fetchHttpRequest({ url: `admin/notices/${id}` });
  return MOCK_NOTICES.find((n) => n.id === id) ?? null;
};

/**
 * 공지사항 생성
 */
export const createNotice = async (data) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/notices', method: 'POST', data });
  console.log('[TODO] createNotice:', data);
  return { ...data, id: Date.now() };
};

/**
 * 공지사항 수정
 */
export const updateNotice = async (id, data) => {
  // TODO: return await fetchHttpRequest({ url: `admin/notices/${id}`, method: 'PUT', data });
  console.log('[TODO] updateNotice:', id, data);
  return { id, ...data };
};

/**
 * 공지사항 삭제
 */
export const deleteNotice = async (id) => {
  // TODO: return await fetchHttpRequest({ url: `admin/notices/${id}`, method: 'DELETE' });
  console.log('[TODO] deleteNotice:', id);
};

/**
 * FAQ 목록 조회
 */
export const getFaqs = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/faqs', params });
  return { items: MOCK_FAQS, total: MOCK_FAQS.length, page: 1, size: 20 };
};

/**
 * FAQ 생성
 */
export const createFaq = async (data) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/faqs', method: 'POST', data });
  console.log('[TODO] createFaq:', data);
  return { ...data, id: Date.now() };
};

/**
 * FAQ 수정
 */
export const updateFaq = async (id, data) => {
  // TODO: return await fetchHttpRequest({ url: `admin/faqs/${id}`, method: 'PUT', data });
  console.log('[TODO] updateFaq:', id, data);
  return { id, ...data };
};

/**
 * FAQ 삭제
 */
export const deleteFaq = async (id) => {
  // TODO: return await fetchHttpRequest({ url: `admin/faqs/${id}`, method: 'DELETE' });
  console.log('[TODO] deleteFaq:', id);
};

/**
 * Q&A 목록 조회
 */
export const getQas = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/qas', params });
  return { items: MOCK_QAS, total: MOCK_QAS.length, page: 1, size: 20 };
};

/**
 * Q&A 답변 등록/수정
 */
export const replyToQa = async (id, replyContent) => {
  // TODO: return await fetchHttpRequest({ url: `admin/qas/${id}/reply`, method: 'POST', data: { content: replyContent } });
  console.log('[TODO] replyToQa:', id, replyContent);
};

/**
 * 1:1 문의 목록 조회
 */
export const getPersonalInquiries = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/personal-inquiries', params });
  return { items: MOCK_PERSONAL_INQUIRIES, total: MOCK_PERSONAL_INQUIRIES.length, page: 1, size: 20 };
};

/**
 * 1:1 문의 답변
 */
export const replyToPersonalInquiry = async (id, replyContent) => {
  // TODO: return await fetchHttpRequest({ url: `admin/personal-inquiries/${id}/reply`, method: 'POST', data: { content: replyContent } });
  console.log('[TODO] replyToPersonalInquiry:', id, replyContent);
};

/**
 * 견적문의 목록 조회
 */
export const getBulkInquiries = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/bulk-inquiries', params });
  return { items: MOCK_BULK_INQUIRIES, total: MOCK_BULK_INQUIRIES.length, page: 1, size: 20 };
};

/**
 * 견적문의 답변
 */
export const replyToBulkInquiry = async (id, replyContent) => {
  // TODO: return await fetchHttpRequest({ url: `admin/bulk-inquiries/${id}/reply`, method: 'POST', data: { content: replyContent } });
  console.log('[TODO] replyToBulkInquiry:', id, replyContent);
};

/**
 * 기업상담 목록 조회
 */
export const getBusinessConsults = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/business-consults', params });
  return { items: MOCK_BUSINESS_CONSULTS, total: MOCK_BUSINESS_CONSULTS.length, page: 1, size: 20 };
};

/**
 * 디자인상담 목록 조회
 */
export const getDesignConsults = async (params = {}) => {
  // TODO: return await fetchHttpRequest({ url: 'admin/design-consults', params });
  return { items: MOCK_DESIGN_CONSULTS, total: MOCK_DESIGN_CONSULTS.length, page: 1, size: 20 };
};
