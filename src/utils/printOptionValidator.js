// @MX:NOTE: [AUTO] 인쇄 옵션 유효성 검증 매트릭스 - 사이즈/용지/코팅/마감 조합 검증
const VALID_PAPER_COATING_MAP = {
  ART_COAT_130: ['NONE', 'GLOSSY', 'MATTE', 'SOFT_TOUCH'],
  ART_COAT_200: ['NONE', 'GLOSSY', 'MATTE', 'SOFT_TOUCH'],
  MATTE_COAT_130: ['NONE', 'MATTE', 'SOFT_TOUCH'],
  MATTE_COAT_200: ['NONE', 'MATTE', 'SOFT_TOUCH'],
  GENERAL_COPY: ['NONE'],
};

const VALID_FINISHING_BY_SIZE = {
  A4: ['STAPLE', 'BINDING_SPIRAL', 'FOLDING'],
  A5: ['STAPLE', 'BINDING_SPIRAL', 'FOLDING'],
  A3: ['FOLDING'],
  B5: ['STAPLE', 'BINDING_SPIRAL', 'FOLDING'],
  CUSTOM: ['STAPLE', 'BINDING_SPIRAL', 'FOLDING'],
};

export const isValidCoatingForPaper = (paper, coating) => {
  const validCoatings = VALID_PAPER_COATING_MAP[paper];
  if (!validCoatings) return true;
  return validCoatings.includes(coating);
};

export const isValidFinishingForSize = (size, finishing) => {
  const validFinishings = VALID_FINISHING_BY_SIZE[size];
  if (!validFinishings) return true;
  return validFinishings.includes(finishing);
};

export const validatePrintOptions = ({ size, paper, coating, finishing, quantity }) => {
  const errors = {};

  if (!size) errors.size = '사이즈를 선택해주세요.';
  if (!paper) errors.paper = '용지를 선택해주세요.';
  if (!coating) errors.coating = '코팅을 선택해주세요.';

  if (paper && coating && !isValidCoatingForPaper(paper, coating)) {
    errors.coating = '선택한 용지와 호환되지 않는 코팅입니다.';
  }

  if (size && Array.isArray(finishing) && finishing.length > 0) {
    const invalidFinishing = finishing.find((f) => !isValidFinishingForSize(size, f));
    if (invalidFinishing) {
      errors.finishing = '선택한 사이즈와 호환되지 않는 마감 옵션입니다.';
    }
  } else if (size && finishing && typeof finishing === 'string' && !isValidFinishingForSize(size, finishing)) {
    errors.finishing = '선택한 사이즈와 호환되지 않는 마감 옵션입니다.';
  }

  if (!quantity || quantity < 1) errors.quantity = '수량을 입력해주세요.';
  if (quantity > 10000) errors.quantity = '최대 10,000부까지 주문 가능합니다.';

  return { isValid: Object.keys(errors).length === 0, errors };
};
