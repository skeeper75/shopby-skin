# 문구 옵션 구조 분석

## 상품 수
14개 (pricing_method: booklet 또는 tiered)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 규격 | ButtonType, SelectBoxType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 용지, 후가공 | SelectBoxType, FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType
- 규격: SelectBoxType (A4, A5, A6 등)
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 노트, 메모장, 영수증 등 다양한 문구류
- 제본방식에 따라 booklet pricing 적용
