# 디자인캘린더 옵션 구조 분석

## 상품 수
6개 (pricing_method: tiered 변형)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 디자인 템플릿 | ButtonType, ImageChipType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 후가공 | FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType
- 디자인 템플릿: ImageChipType (50×50px, RULE-6)
- 수량: CounterInputType

## CTA 버튼
- PDF: X (디자인 내장형)
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 이미지 미리보기 칩으로 디자인 선택
- 후니프린팅 자체 디자인 제공
