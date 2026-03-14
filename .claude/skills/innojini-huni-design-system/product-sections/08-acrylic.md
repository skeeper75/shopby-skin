# 아크릴 옵션 구조 분석

## 상품 수
33개 (pricing_method: matrix / fixed_lookup)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 사이즈(직접입력), 형태 | AreaInputType, ButtonType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 가공옵션 (홀가공, 인쇄) | FinishButtonType, FinishSelectBoxType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 사이즈: AreaInputType (mm 직접 입력)
- 형태: ButtonType (원형, 사각형 등)
- 홀가공: FinishButtonType
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X (일부 O)

## 특이사항
- mm 직접입력 → 가격 매트릭스 조회
- 형압(양각/음각), 박가공 등 특수 후가공
