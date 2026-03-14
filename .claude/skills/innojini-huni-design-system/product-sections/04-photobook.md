# 포토북 옵션 구조 분석

## 상품 수
5개 (pricing_method: booklet 변형)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 표지 재질 | ButtonType, SelectBoxType |
| Zone2 | 페이지수, 수량 | PageCounterInputType, CounterInputType |
| Zone3 | 후가공 | FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType (정방형 포함)
- 표지 재질: SelectBoxType
- 페이지수: PageCounterInputType (4의 배수)
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 포토북 전용 소재(무광코팅 표지 등)
- 엽서북 포함
