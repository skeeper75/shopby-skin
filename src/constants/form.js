import {
  BANK_MAP,
  DELIVERY_COMPANY_TYPE_MAP,
  RETURN_WAY_TYPE_MAP,
  CASH_RECEIPT_KEY_TYPE,
  SELECTED_OPTION_NOS_VALIDATE_TYPE,
  APPLICANT_NAME_VALIDATE_TYPE,
  APPLICANT_PHONE_VALIDATE_TYPE,
  PRIVACY_INFO_AGREEMENT_VALIDATE_TYPE,
  NOTICE_TYPE,
} from '@shopby/shared';

export const EMAIL_DOMAINS = ['naver.com', 'hanmail.net', 'daum.net', 'nate.com', 'gmail.com'];
export const EMAIL_DOMAIN_OPTIONS = EMAIL_DOMAINS.map((domain) => ({ value: domain, label: domain }));

export const PHONE_CARRIER_NUMBERS_BY_STRING = [
  '02',
  '031',
  '032',
  '033',
  '041',
  '042',
  '043',
  '044',
  '051',
  '052',
  '053',
  '054',
  '055',
  '061',
  '062',
  '063',
  '064',
  '070',
];

export const PHONE_NUMBER_INPUT_SECTIONS = ['carrierNumber', 'firstSerial', 'secondSerial'];

export const NAME_INPUT_MAX_LENGTH = 15;
export const INVOICE_NO_MAX_LENGTH = 20;
export const DELIVERY_MEMO_MAX_LENGTH = 20;
export const CLAIM_REASON_DETAIL_MAX_LENGTH = 300;

export const RETURN_WAY_OPTIONS = Object.entries(RETURN_WAY_TYPE_MAP).map(([value, label]) => ({ label, value }));
export const DELIVERY_COMPANY_OPTIONS = Object.entries(DELIVERY_COMPANY_TYPE_MAP).map(([value, label]) => ({
  label,
  value,
}));
export const BANK_OPTIONS = Object.entries(BANK_MAP)
  .map(([value, label]) => ({ label, value }))
  .filter(({ value }) => value !== 'ANONYMOUS');

export const NOT_USED = 'NOT_USED';
export const REQUIRED = 'REQUIRED';
export const JOIN_TIME = 'JOIN_TIME';
// @deprecated
export const DEFAULT_GLOBAL_PHONE_NUMBER_MAX_LENGTH = 15;
// @deprecated
export const PHONE_NUMBER_MAX_LENGTH = 13;
export const YEAR_SELECT_OPTION_LENGTH = 120;
export const MONTH_SELECT_OPTION_LENGTH = 12;
export const DATE_SELECT_OPTION_LENGTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const SEX_SELECT_OPTIONS = [
  { value: '', label: '선택 안 함' },
  { value: 'M', label: '남자' },
  { value: 'F', label: '여자' },
];

export const PI_14_AGE_TERM_TYPE = 'PI_14_AGE';

export const NICKNAME_MAX_LENGTH = 20;

export const CERTIFICATION_TYPE = { mobile: 'MOBILE', sms: 'SMS', email: 'EMAIL' };

export const cashReceiptKeyTypeMap = {
  [CASH_RECEIPT_KEY_TYPE.MOBILE_NO]: '휴대폰 번호',
  [CASH_RECEIPT_KEY_TYPE.BUSINESS_NO]: '사업자 번호',
  [CASH_RECEIPT_KEY_TYPE.CARD_NO]: '카드 번호',
};

export const cashReceiptKeyTypeOptions = [
  {
    value: CASH_RECEIPT_KEY_TYPE.MOBILE_NO,
    label: cashReceiptKeyTypeMap.MOBILE_NO,
    maxLength: 11,
  },
  {
    value: CASH_RECEIPT_KEY_TYPE.BUSINESS_NO,
    label: cashReceiptKeyTypeMap.BUSINESS_NO,
    maxLength: 10,
  },
  {
    value: CASH_RECEIPT_KEY_TYPE.CARD_NO,
    label: cashReceiptKeyTypeMap.CARD_NO,
    maxLength: 19,
  },
];

export const COUNTRY_PHONE_NUMBER_MAX_LENGTH = {
  DEFAULT: { MIN: 0, MAX: 20 },
  KR: { MIN: 10, MAX: 12 },
};

export const RESTOCK_NOTIFICATION_LENGTH_MAP = {
  MAX_NAME_LENGTH: 30,
  MAX_PHONE_LENGTH: 12,
  MIN_PHONE_LENGTH: 11,
};

export const RESTOCK_NOTIFICATION_FORM_VALIDATE_MESSAGE = {
  SELECTED_OPTION_NOS: {
    [SELECTED_OPTION_NOS_VALIDATE_TYPE.NOT_SELECTED]: '재입고 알림을 신청할 옵션을 선택하세요.',
  },
  NAME: {
    [APPLICANT_NAME_VALIDATE_TYPE.NOT_WRITTEN]: '신청자명을 입력해주세요.',
    [APPLICANT_NAME_VALIDATE_TYPE.INVALID_FORMAT]: '신청자명에 입력 불가한 문자가 포함되어 있습니다.',
    [APPLICANT_NAME_VALIDATE_TYPE.LENGTH_IS_INVALID]: `신청자명은 최대 ${RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_NAME_LENGTH}자까지 입력 가능합니다.`,
  },
  PHONE: {
    [APPLICANT_PHONE_VALIDATE_TYPE.NOT_WRITTEN]: '휴대폰번호를 입력해주세요.',
    [APPLICANT_PHONE_VALIDATE_TYPE.INVALID_FORMAT]: '휴대폰번호에 입력 불가한 문자가 포함되어 있습니다.',
    [APPLICANT_PHONE_VALIDATE_TYPE.LENGTH_IS_INVALID]: `휴대폰번호는 ${RESTOCK_NOTIFICATION_LENGTH_MAP.MIN_PHONE_LENGTH}~${RESTOCK_NOTIFICATION_LENGTH_MAP.MAX_PHONE_LENGTH}자 이내로 입력해주세요.`,
  },
  PRIVACY_INFO_AGREEMENT: {
    [PRIVACY_INFO_AGREEMENT_VALIDATE_TYPE.NOT_SELECTED]: '개인정보 수집 및 이용에 동의해주세요.',
  },
  SUCCESS: {
    [NOTICE_TYPE.SUCCESS]: '재입고 알림이 신청되었습니다.',
  },
};
