# 책자 옵션 구조 분석

## 상품 수
21개 (pricing_method: booklet)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 제본방식, 페이지수 | ButtonType, PageCounterInputType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 표지/내지 용지, 코팅 | SelectBoxType, FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType
- 제본: ButtonType (무선철, 중철, 스프링 등)
- 페이지수: PageCounterInputType
- 표지 용지: SelectBoxType
- 내지 용지: SelectBoxType
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 표지 + 내지 복합 가격 계산 (booklet pricing)
- 페이지수 4의 배수 제약
