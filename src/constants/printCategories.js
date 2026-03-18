// 인쇄 전문 카테고리 데이터
// Shopby API 카테고리와 매핑하여 사용
// API에서 카테고리를 가져올 수 없을 때 fallback으로 사용

export const PRINT_CATEGORIES = [
  {
    id: 'postcards',
    name: '엽서',
    icon: '📮',
    description: '다양한 용도의 엽서 인쇄',
    subCategories: [
      { id: 'postcards-standard', name: '일반 엽서' },
      { id: 'postcards-photo', name: '포토 엽서' },
      { id: 'postcards-invitation', name: '초대장' },
      { id: 'postcards-thanks', name: '감사 카드' },
    ],
  },
  {
    id: 'stickers',
    name: '스티커',
    icon: '🏷️',
    description: '맞춤형 스티커 제작',
    subCategories: [
      { id: 'stickers-circle', name: '원형 스티커' },
      { id: 'stickers-square', name: '사각 스티커' },
      { id: 'stickers-clear', name: '투명 스티커' },
      { id: 'stickers-hologram', name: '홀로그램' },
    ],
  },
  {
    id: 'business-cards',
    name: '명함',
    icon: '💼',
    description: '프로페셔널 명함 인쇄',
    subCategories: [
      { id: 'biz-standard', name: '일반 명함' },
      { id: 'biz-premium', name: '고급 명함' },
      { id: 'biz-mini', name: '미니 명함' },
      { id: 'biz-double', name: '양면 명함' },
    ],
  },
  {
    id: 'flyers',
    name: '전단지',
    icon: '📄',
    description: '홍보용 전단지 및 리플렛',
    subCategories: [
      { id: 'flyers-a4', name: 'A4 전단지' },
      { id: 'flyers-a5', name: 'A5 전단지' },
      { id: 'flyers-dm', name: 'DM' },
      { id: 'flyers-leaflet', name: '리플렛' },
    ],
  },
  {
    id: 'posters',
    name: '포스터',
    icon: '🖼️',
    description: '대형 포스터 인쇄',
    subCategories: [
      { id: 'posters-a3', name: 'A3 포스터' },
      { id: 'posters-a2', name: 'A2 포스터' },
      { id: 'posters-b2', name: 'B2 포스터' },
      { id: 'posters-large', name: '대형 포스터' },
    ],
  },
  {
    id: 'calendars',
    name: '캘린더',
    icon: '📅',
    description: '맞춤형 캘린더 제작',
    subCategories: [
      { id: 'cal-desk', name: '탁상 캘린더' },
      { id: 'cal-wall', name: '벽걸이 캘린더' },
      { id: 'cal-pocket', name: '포켓 캘린더' },
    ],
  },
  {
    id: 'booklets',
    name: '책자/카탈로그',
    icon: '📚',
    description: '브로셔, 카탈로그, 소책자',
    subCategories: [
      { id: 'booklets-catalog', name: '카탈로그' },
      { id: 'booklets-brochure', name: '브로셔' },
      { id: 'booklets-booklet', name: '소책자' },
      { id: 'booklets-menu', name: '메뉴판' },
    ],
  },
  {
    id: 'stationery',
    name: '문구/봉투',
    icon: '✉️',
    description: '편지지, 봉투, 메모지',
    subCategories: [
      { id: 'stat-letter', name: '편지지' },
      { id: 'stat-envelope', name: '봉투' },
      { id: 'stat-memo', name: '메모지' },
      { id: 'stat-notebook', name: '노트' },
    ],
  },
];

// 카테고리 ID로 조회하는 헬퍼 함수
export const findPrintCategoryById = (categoryId) =>
  PRINT_CATEGORIES.find((cat) => cat.id === categoryId);

// Shopby API 카테고리 번호와 인쇄 카테고리를 매핑할 때 사용
// 실제 API 카테고리 번호가 확정되면 여기에 매핑 추가
export const CATEGORY_NO_MAP = {
  // 예시: 'postcards': 100, 'stickers': 200, ...
};
