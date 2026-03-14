# 악세사리 옵션 구조 분석

## 상품 수
8개 (pricing_method: tiered 또는 matrix)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 재질 | ButtonType, SelectBoxType |
| Zone2 | 수량, 색상 | CounterInputType, MiniColorChipType |
| Zone3 | 후가공 | FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType
- 재질: SelectBoxType
- 색상: MiniColorChipType (32×32px, RULE-7)
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 소형 칩으로 색상 선택 시 MiniColorChipType 사용 (RULE-7)
