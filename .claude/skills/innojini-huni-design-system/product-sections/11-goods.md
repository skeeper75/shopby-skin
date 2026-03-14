# 굿즈/파우치 옵션 구조 분석

## 상품 수
19개 (pricing_method: custom / quote_required)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 색상 | ButtonType, LargeColorChipType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 추가옵션 | FinishButtonType |
| Zone4 | 요약, CTA | SummaryType |

## 핵심 옵션
- 사이즈: ButtonType
- 색상: LargeColorChipType (50×50px 그리드, RULE-8)
- 수량: CounterInputType

## CTA 버튼
- PDF: X
- 디자인주문: X
- 장바구니: X
- 견적문의: O (quote_required)

## 특이사항
- 대부분 quote_required — 견적 문의 방식
- LargeColorChipType으로 다수 색상 선택 (RULE-8)
- 파우치, 에코백, 텀블러 등 비인쇄 굿즈 포함
