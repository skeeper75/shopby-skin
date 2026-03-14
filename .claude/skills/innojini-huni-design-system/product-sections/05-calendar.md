# 캘린더 옵션 구조 분석

## 상품 수
10개 (pricing_method: booklet 변형)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 링컬러 | ButtonType, ColorChipType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 링선택, 코팅 | FinishButtonType, FinishSelectBoxType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType
- 링컬러: ColorChipType (50×50px, RULE-4)
- 링선택: FinishButtonType
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 링컬러 옵션이 있는 경우 ColorChipType 사용
- 월별 페이지 구성 (12매 + 표지)
