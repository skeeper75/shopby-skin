# 디지털인쇄 옵션 구조 분석

## 상품 수
72개 (pricing_method: pangeolje)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈, 용지, 인쇄색상 | ButtonType, SelectBoxType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 후가공 (코팅, 접지 등) | FinishButtonType, FinishSelectBoxType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: ButtonType (155×50px, RULE-2)
- 용지: SelectBoxType (HuniCustomSelect, RULE-1)
- 인쇄색상: ButtonType
- 수량: CounterInputType (223×50px, RULE-3)
- 코팅: FinishButtonType (116×50px, RULE-2)

## CTA 버튼
- PDF: O (시안 업로드)
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 판수(판형) × 수량 pangeolje 가격 계산
- 별색인쇄(클리어) 등 특수 인쇄 옵션 포함
