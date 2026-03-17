/**
 * printOptionValidator 유틸 테스트 - 인쇄 옵션 유효성 검증
 */
import {
  isValidCoatingForPaper,
  isValidFinishingForSize,
  validatePrintOptions,
} from '../../utils/printOptionValidator';

describe('isValidCoatingForPaper', () => {
  it('아트코트지는 모든 코팅을 지원한다', () => {
    expect(isValidCoatingForPaper('ART_COAT_130', 'NONE')).toBe(true);
    expect(isValidCoatingForPaper('ART_COAT_130', 'GLOSSY')).toBe(true);
    expect(isValidCoatingForPaper('ART_COAT_130', 'MATTE')).toBe(true);
    expect(isValidCoatingForPaper('ART_COAT_130', 'SOFT_TOUCH')).toBe(true);
  });

  it('매트코트지는 유광 코팅을 지원하지 않는다', () => {
    expect(isValidCoatingForPaper('MATTE_COAT_130', 'GLOSSY')).toBe(false);
    expect(isValidCoatingForPaper('MATTE_COAT_130', 'MATTE')).toBe(true);
  });

  it('일반복사지는 무코팅만 지원한다', () => {
    expect(isValidCoatingForPaper('GENERAL_COPY', 'NONE')).toBe(true);
    expect(isValidCoatingForPaper('GENERAL_COPY', 'GLOSSY')).toBe(false);
    expect(isValidCoatingForPaper('GENERAL_COPY', 'MATTE')).toBe(false);
  });

  it('알 수 없는 용지는 true를 반환한다', () => {
    expect(isValidCoatingForPaper('UNKNOWN', 'GLOSSY')).toBe(true);
  });
});

describe('isValidFinishingForSize', () => {
  it('A4는 스테이플/링제본/접지를 지원한다', () => {
    expect(isValidFinishingForSize('A4', 'STAPLE')).toBe(true);
    expect(isValidFinishingForSize('A4', 'BINDING_SPIRAL')).toBe(true);
    expect(isValidFinishingForSize('A4', 'FOLDING')).toBe(true);
  });

  it('A3는 접지만 지원한다', () => {
    expect(isValidFinishingForSize('A3', 'FOLDING')).toBe(true);
    expect(isValidFinishingForSize('A3', 'STAPLE')).toBe(false);
  });
});

describe('validatePrintOptions', () => {
  it('필수 필드가 비어있으면 에러를 반환한다', () => {
    const result = validatePrintOptions({
      size: '',
      paper: '',
      coating: '',
      finishing: [],
      quantity: 0,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.size).toBeDefined();
    expect(result.errors.paper).toBeDefined();
    expect(result.errors.coating).toBeDefined();
    expect(result.errors.quantity).toBeDefined();
  });

  it('모든 필수 필드가 유효하면 isValid가 true이다', () => {
    const result = validatePrintOptions({
      size: 'A4',
      paper: 'ART_COAT_130',
      coating: 'NONE',
      finishing: null,
      quantity: 100,
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('finishing이 빈 배열이면 호환성 에러가 발생하지 않는다 (수정됨)', () => {
    // BUG FIX: 빈 배열은 마감 옵션 없음을 의미 - 유효한 상태
    const result = validatePrintOptions({
      size: 'A4',
      paper: 'ART_COAT_130',
      coating: 'NONE',
      finishing: [],
      quantity: 100,
    });
    expect(result.errors.finishing).toBeUndefined();
  });

  it('용지와 코팅이 호환되지 않으면 에러를 반환한다', () => {
    const result = validatePrintOptions({
      size: 'A4',
      paper: 'GENERAL_COPY',
      coating: 'GLOSSY',
      finishing: [],
      quantity: 100,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.coating).toContain('호환되지 않는');
  });

  it('10,000부 초과 시 에러를 반환한다', () => {
    const result = validatePrintOptions({
      size: 'A4',
      paper: 'ART_COAT_130',
      coating: 'NONE',
      finishing: [],
      quantity: 20000,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.quantity).toContain('10,000');
  });
});
