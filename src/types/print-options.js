// @MX:NOTE: 인쇄 옵션 타입 정의 - 8단계 종속옵션 구조
// SPEC-SKIN-003 TAG-001

/**
 * 인쇄 상품 종류
 */
export const PRODUCT_TYPES = {
  BUSINESS_CARD: 'business-card', // 명함
  FLYER: 'flyer', // 전단지
  POSTER: 'poster', // 포스터
  ENVELOPE: 'envelope', // 봉투
} as const;

/**
 * 옵션 단계 (8단계)
 */
export const OPTION_STEPS = {
  PAPER_TYPE: 'paper-type', // 용지종류
  PAPER_THICKNESS: 'paper-thickness', // 용지두께
  SIZE: 'size', // 사이즈
  QUANTITY: 'quantity', // 수량
  PRINT_SIDES: 'print-sides', // 인쇄면수
  FINISHING: 'finishing', // 후가공
  COATING: 'coating', // 코팅
  DELIVERY_DATE: 'delivery-date', // 납기일
} as const;

/**
 * 인쇄 옵션 인터페이스
 */
export interface PrintOption {
  id: string;
  step: keyof typeof OPTION_STEPS;
  label: string;
  value: string;
  dependsOn?: string[]; // 종속 상위 옵션 값
  disabledFor?: string[]; // 비활성화할 조건
  price?: number; // 추가 가격
}

/**
 * 옵션 선택 상태
 */
export interface OptionSelection {
  step: string;
  value: string;
  label: string;
  price?: number;
}

/**
 * 인쇄 옵션 상태
 */
export interface PrintOptionsState {
  productType: keyof typeof PRODUCT_TYPES;
  selections: Record<string, OptionSelection>;
  availableOptions: Record<string, PrintOption[]>;
  loading: boolean;
  error?: string;
}

/**
 * 가격 계산 요청
 */
export interface PriceCalculationRequest {
  productType: string;
  options: Record<string, string>;
  quantity: number;
  isRush?: boolean; // 급행 여부
}

/**
 * 가격 계산 응답
 */
export interface PriceCalculationResponse {
  basePrice: number;
  finishingPrice: number;
  coatingPrice: number;
  rushFee: number;
  discount: number;
  totalPrice: number;
  breakdown: {
    paper: { price: number; label: string };
    size: { price: number; label: string };
    quantity: { price: number; label: string };
    finishing: Array<{ price: number; label: string }>;
    coating: { price: number; label: string };
  };
}
