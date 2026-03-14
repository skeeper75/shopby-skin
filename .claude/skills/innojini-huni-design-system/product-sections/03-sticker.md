# 스티커 옵션 구조 분석

## 상품 수
15개 (pricing_method: tiered)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 모양, 재질 | ButtonType, SelectBoxType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 후가공 (코팅, 반칼 등) | FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType 또는 직접입력 (AreaInputType)
- 재질: SelectBoxType
- 수량: CounterInputType
- 반칼(half_cut): FinishButtonType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 반칼 유무에 따라 cuttingFee 추가
- 낱장(sheet) vs 반칼 구분
- 구간단가 × 수량 tiered 가격 계산
