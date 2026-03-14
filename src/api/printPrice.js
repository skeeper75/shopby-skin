// @MX:NOTE: [AUTO] /custom/print-price API 모의 구현 - 실제 API 연동 전 로컬 가격 계산
// 실제 배포 시 API 엔드포인트로 교체 필요

const BASE_PRICE_MAP = {
  ART_COAT_130: 50,
  ART_COAT_200: 70,
  MATTE_COAT_130: 55,
  MATTE_COAT_200: 75,
  GENERAL_COPY: 20,
};

const COATING_SURCHARGE = {
  NONE: 0,
  GLOSSY: 10,
  MATTE: 12,
  SOFT_TOUCH: 18,
};

const FINISHING_SURCHARGE = {
  STAPLE: 5,
  BINDING_SPIRAL: 30,
  FOLDING: 15,
  PERFORATION: 10,
  SCORING: 8,
};

const SIZE_MULTIPLIER = {
  A4: 1.0,
  A5: 0.7,
  A3: 1.8,
  B5: 0.85,
  CUSTOM: 1.2,
};

export const calculatePrintPrice = ({ size, paper, coating, finishing = [], quantity }) => {
  if (!size || !paper || !coating || !quantity) return null;

  const basePerSheet = BASE_PRICE_MAP[paper] ?? 50;
  const coatingSurcharge = COATING_SURCHARGE[coating] ?? 0;
  const finishingSurcharge = finishing.reduce((sum, f) => sum + (FINISHING_SURCHARGE[f] ?? 0), 0);
  const sizeMultiplier = SIZE_MULTIPLIER[size] ?? 1.0;

  const unitPrice = Math.ceil((basePerSheet + coatingSurcharge + finishingSurcharge) * sizeMultiplier);
  const subtotal = unitPrice * quantity;

  // 수량 할인
  let discount = 0;
  if (quantity >= 1000) discount = Math.floor(subtotal * 0.1);
  else if (quantity >= 500) discount = Math.floor(subtotal * 0.07);
  else if (quantity >= 100) discount = Math.floor(subtotal * 0.05);

  const shipping = subtotal - discount >= 30000 ? 0 : 3000;
  const total = subtotal - discount + shipping;

  return {
    unitPrice,
    quantity,
    subtotal,
    discount,
    shipping,
    total,
  };
};

// 실제 API 호출 형태로 래핑 (향후 교체 용이)
export const fetchPrintPrice = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return calculatePrintPrice(params);
};
