// @MX:NOTE: 가격 팝업 8가지 타입 설정 (SPEC-SKIN-006)
// @MX:SPEC: SPEC-SKIN-006

/**
 * 가격 팝업 타입 설정
 * 각 타입별 팝업 제목, 필드, 설명을 정의
 */
export const PRICE_POPUP_CONFIGS = {
  // 1. 수량별 단가 설정
  quantity_unit_price: {
    id: 'quantity_unit_price',
    title: '수량별 단가 설정',
    description: '수량 구간별 단가를 설정합니다.',
    fields: [
      { key: 'minQty', label: '최소 수량', type: 'number', required: true, placeholder: '100' },
      { key: 'maxQty', label: '최대 수량', type: 'number', required: false, placeholder: '999 (없으면 무제한)' },
      { key: 'unitPrice', label: '단가 (원)', type: 'number', required: true, placeholder: '150' },
    ],
  },
  // 2. 옵션 추가금 설정
  option_extra_price: {
    id: 'option_extra_price',
    title: '옵션 추가금 설정',
    description: '특정 옵션 선택 시 추가되는 금액을 설정합니다.',
    fields: [
      { key: 'optionName', label: '옵션명', type: 'text', required: true, placeholder: '양면 인쇄' },
      { key: 'extraPrice', label: '추가금 (원)', type: 'number', required: true, placeholder: '5000' },
      { key: 'isPercent', label: '비율 적용', type: 'checkbox', required: false },
    ],
  },
  // 3. 사이즈 가격 설정
  size_price: {
    id: 'size_price',
    title: '사이즈별 가격 설정',
    description: '사이즈에 따른 기본 가격을 설정합니다.',
    fields: [
      { key: 'sizeId', label: '사이즈', type: 'select', required: true, optionsKey: 'sizes' },
      { key: 'basePrice', label: '기본가 (원)', type: 'number', required: true, placeholder: '10000' },
      { key: 'setupFee', label: '판 비용 (원)', type: 'number', required: false, placeholder: '0' },
    ],
  },
  // 4. 소재 가격 설정
  material_price: {
    id: 'material_price',
    title: '소재별 가격 설정',
    description: '소재 선택에 따른 추가 금액을 설정합니다.',
    fields: [
      { key: 'materialId', label: '소재', type: 'select', required: true, optionsKey: 'materials' },
      { key: 'priceType', label: '가격 방식', type: 'radio', required: true, options: [{ value: 'fixed', label: '고정금액' }, { value: 'percent', label: '비율' }] },
      { key: 'priceValue', label: '금액/비율', type: 'number', required: true, placeholder: '3000' },
    ],
  },
  // 5. 후가공 가격 설정
  finishing_price: {
    id: 'finishing_price',
    title: '후가공 가격 설정',
    description: '코팅, 박, 형압 등 후가공 추가 금액을 설정합니다.',
    fields: [
      { key: 'finishingName', label: '후가공 유형', type: 'text', required: true, placeholder: '유광 코팅' },
      { key: 'basePrice', label: '기본 추가금 (원)', type: 'number', required: true, placeholder: '5000' },
      { key: 'perSheetPrice', label: '장당 추가금 (원)', type: 'number', required: false, placeholder: '10' },
    ],
  },
  // 6. 제본 가격 설정
  binding_price: {
    id: 'binding_price',
    title: '제본 가격 설정',
    description: '제본 방식별 가격을 설정합니다.',
    fields: [
      { key: 'bindingType', label: '제본 방식', type: 'select', required: true, options: [
        { value: 'spiral', label: '스프링 제본' },
        { value: 'perfect', label: '무선 제본' },
        { value: 'saddle', label: '중철 제본' },
        { value: 'hard', label: '양장 제본' },
      ]},
      { key: 'basePrice', label: '기본가 (원)', type: 'number', required: true, placeholder: '3000' },
      { key: 'perPagePrice', label: '페이지당 추가 (원)', type: 'number', required: false, placeholder: '10' },
    ],
  },
  // 7. 배송 가격 설정
  delivery_price: {
    id: 'delivery_price',
    title: '배송 가격 설정',
    description: '배송 방법에 따른 가격을 설정합니다.',
    fields: [
      { key: 'deliveryType', label: '배송 방법', type: 'text', required: true, placeholder: '일반 택배' },
      { key: 'basePrice', label: '기본 배송비 (원)', type: 'number', required: true, placeholder: '3000' },
      { key: 'freeThreshold', label: '무료배송 기준 (원)', type: 'number', required: false, placeholder: '50000' },
    ],
  },
  // 8. 긴급 처리 가격 설정
  rush_price: {
    id: 'rush_price',
    title: '긴급 처리 가격 설정',
    description: '긴급 처리(당일, 익일) 추가 요금을 설정합니다.',
    fields: [
      { key: 'rushType', label: '처리 구분', type: 'select', required: true, options: [
        { value: 'same_day', label: '당일 처리' },
        { value: 'next_day', label: '익일 처리' },
      ]},
      { key: 'surchargeType', label: '할증 방식', type: 'radio', required: true, options: [{ value: 'fixed', label: '고정금액' }, { value: 'percent', label: '비율(%)' }] },
      { key: 'surchargeValue', label: '할증 금액/비율', type: 'number', required: true, placeholder: '30' },
    ],
  },
};

export const PRICE_POPUP_TYPE_LABELS = Object.values(PRICE_POPUP_CONFIGS).map((c) => ({
  value: c.id,
  label: c.title,
}));
