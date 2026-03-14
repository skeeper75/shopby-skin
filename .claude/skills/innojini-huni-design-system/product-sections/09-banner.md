# 실사/사인 옵션 구조 분석

## 상품 수
26개 (pricing_method: area)

## 4구역 레이아웃
| Zone | 옵션 종류 | componentType |
|------|---------|---------------|
| Zone1 | 가로(mm), 세로(mm) 직접입력 | AreaInputType |
| Zone2 | 수량 | CounterInputType |
| Zone3 | 출력소재, 마감방식 | SelectBoxType, FinishButtonType |
| Zone4 | 요약, CTA | SummaryType, UploadType |

## 핵심 옵션
- 가로/세로: AreaInputType (mm 직접 입력)
- 출력소재: SelectBoxType (현수막, 포스터, 배너 등)
- 마감: FinishButtonType
- 수량: CounterInputType

## CTA 버튼
- PDF: O
- 디자인주문: O
- 장바구니: O
- 견적문의: X

## 특이사항
- 가로 × 세로(m²) × 단가 area 가격 계산
- mm 입력 후 m² 자동 변환
- 최소 주문 면적 제한
