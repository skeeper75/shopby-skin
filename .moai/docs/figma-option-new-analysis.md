# Figma option_NEW 페이지 분석 리포트

## 분석 일시: 2026-03-19
## 소스: Figma file `gEJhQRtmKI66BPhOpqoW3j`, Page `option_NEW` (id: 1647:128)

---

## 1. 페이지 구조

| 섹션 ID | 섹션명 | 크기 |
|---------|--------|------|
| 1647:129 | PRODUCT_PRINT_OPTION | 2158x5504 |
| 1661:132 | OVERVIEW (컴포넌트 타입 정의) | 2158x4735 |
| 1647:525 | PRODUCT_BOOK_OPTION | 2158x5504 |
| 1647:810 | PRODUCT_STAITIONERY_OPTION | 2158x5504 |
| 1647:929 | PRODUCT_PHOTOBOOK_OPTION | 2158x5504 |
| 1647:1033 | PRODUCT_CALENDAR_OPTION | 2158x5504 |
| 1647:1165 | PRODUCT_DESIGN CALENDAR_OPTION | 2158x5504 |
| 1647:1271 | PRODUCT_ACCESSORIES_OPTION | 2158x5504 |
| 1647:1346 | PRODUCT_ARRYLIC_OPTION | 2158x5504 |
| 1647:1487 | PRODUCT_SIGN POSTER_OPTION | 2158x5504 |
| 1647:1596 | PRODUCT_STICKER_OPTION | 2158x5504 |
| 1647:1732 | PRODUCT_GOODS_OPTION | 2158x5504 |

총 12개 상품 카테고리 + 1개 OVERVIEW

---

## 2. OVERVIEW 섹션 - 컴포넌트 타입 정의

피그마에서 정의된 옵션 UI 컴포넌트 타입:

| 컴포넌트 | 설명 | 사용처 |
|---------|------|--------|
| **Option Group Button Type** | 버튼 그리드 (155x50px 버튼들) | 사이즈, 인쇄, 코팅, 커팅 등 |
| **Option Group Select Box Type** | 드롭다운 셀렉트 (348x50px) | 종이 선택 |
| **Option Group Count Input Type** | 수량 +/- 카운터 | 제작수량 |
| **Option Group Price Table Bar** | 가격 테이블 행 | 가격 요약 |
| **Option Group Radio Button Type** | 라디오 버튼 | 마감 타입 선택 |
| **Option Group Input Type** | 직접 입력 필드 (140x50px) | 박/형압 크기 입력 |
| **Option Group Color Chip Type** | 컬러칩 (50x50px 원형) | 박 칼라 선택 |
| **Option Group Select Box Type (복수)** | 다중 셀렉트 | 추가 옵션 |
| **Option Group Summary** | 가격 합산 테이블 | 주문 요약 |
| **Option Group Upload** | 파일 업로드 영역 | PDF 업로드, 에디터 |

---

## 3. PRODUCT_PRINT_OPTION 상세 분석 (인쇄 상품)

### 레이아웃
- **전체 구조**: 단일 페이지 스크롤 (Step Wizard 아님)
- **상단**: Header (로고 + 네비게이션 + 로그인/회원가입/마이페이지/장바구니)
- **브레드크럼**: 홈 > Shop > 엽서 > 프리미엄엽서
- **메인 영역**: 2컬럼 레이아웃
  - 좌측: 상품 이미지 (754x754px) + 썸네일 6개 (116x116px)
  - 우측: 옵션 폼 영역

### 옵션 그룹 순서 (위 → 아래)

1. **사이즈** (Button Type)
   - 73x98mm, 100x150mm, 135x135mm, 95x210mm, 110x170mm, 148x210mm, 98x98mm
   - 155x50px 버튼 그리드

2. **인쇄** (Button Type)
   - 단면 / 양면

3. **별색인쇄** (Button Type) - 5개 하위 그룹
   - 화이트: 없음/단면/양면
   - 클리어: 없음/단면/양면
   - 핑크: 없음/단면/양면
   - 금색: 없음/단면/양면
   - 은색: 없음/단면/양면

4. **종이** (Select Box Type)
   - 드롭다운: "몽블랑 190g ▼"

5. **제작수량** (Count Input Type)
   - +/- 버튼 + 직접 입력

6. **건수** (Count Input Type)
   - 동일 패턴

7. **코팅** (Button Type)
   - 무광코팅(단면)/무광코팅(양면)/유광코팅(단면)/유광코팅(양면)/코팅없음

8. **커팅** (Button Type)
   - 한쪽라운딩/나뭇잎/큰라운딩/클래식

9. **접지** (Button Type)
   - 2단 가로접지/3단 가로접지/2단 세로접지

10. **후가공** (접이식 섹션 - 열기/닫기)
    - 가변인쇄(이미지), 가변인쇄(텍스트), 미싱, 오시, 귀돌이
    - 각 항목에 수량 버튼 (없음/1개/2개/3개)

11. **박,형압 가공** (복합 - Color Chip + Input + Button)
    - 박(앞면): 있음/없음 + 칼라칩(금유광/은유광/적박/청박/먹유광/홀로그램박/트윙클박/동박) + 크기 직접입력
    - 박(뒷면): 동일 패턴
    - 형압: 양각/음각/없음 + 크기 직접입력

12. **엽서봉투** (추가상품, Select Box)
    - OPP비접착봉투, 카드봉투 화이트/블랙 등

### 하단 영역

- **상품 미리보기 이미지** (360x243px)
- **가격 Summary**:
  - "인쇄비: 135x135mm, 몽블랑 190, 양면, 20ea"
  - "후가공: 귀돌이(직각모서리), 오시(2개)"
  - "추가상품: OPP비접착봉투..."
  - "상품가 75,000원 부가세 7,500원"
  - **합계금액: 82,500**
- **파일 업로드**:
  - "PDF파일 직접 올리기" 버튼 (465x50px)
  - "에디터로 디자인하기" 버튼 (465x50px)
  - "작업가이드 및 파일가이드 다운로드"
  - "에디터 사용방법 보기"
- **장바구니 담기 버튼**

---

## 4. SPEC-DESIGN-002 product-detail 수정 방향

### 문제점 (현재 Pencil 디자인)
1. **Step Wizard 6단계** → 피그마에는 존재하지 않음
2. **StepIndicator 컴포넌트** → 불필요
3. **PaperSampleCard** → 피그마는 단순 드롭다운
4. **QuantityPricingTable** → 피그마는 +/- 카운터
5. **RealTimePriceWidget (sticky sidebar)** → 피그마는 하단 Summary

### 수정 방향
1. **레이아웃**: 2컬럼 (좌: 이미지, 우: 옵션 폼) → 하단 스크롤
2. **옵션 선택**: Button Type 그리드가 주력, 종이만 드롭다운
3. **가격 표시**: 하단 Summary 테이블 (실시간 업데이트)
4. **후가공**: 접이식 섹션 (열기/닫기)
5. **박/형압**: Color Chip + 크기 직접입력 복합 UI
6. **파일 업로드**: 하단 2개 버튼 (PDF 직접 업로드 / 에디터 디자인)
7. **모바일**: 이미지 → 옵션 폼 순서로 세로 배치

### 컴포넌트 재정의

| 기존 (삭제) | 신규 (피그마 기반) |
|------------|------------------|
| StepIndicator | 불필요 |
| OptionSelector (단일) | OptionGroupButton (155x50 그리드) |
| PaperSampleCard | OptionGroupSelect (드롭다운) |
| QuantityPricingTable | OptionGroupCount (+/- 카운터) |
| RealTimePriceWidget | PriceSummary (하단 테이블) |
| WizardNavigation | 불필요 |
| - | OptionGroupColorChip (50x50 원형) |
| - | OptionGroupInput (크기 직접입력) |
| - | OptionGroupCollapsible (열기/닫기) |
| - | FileUploadButtons (PDF + 에디터) |

---

## 5. 12개 상품 카테고리별 차이점 (추후 분석 필요)

각 카테고리마다 옵션 그룹 조합이 다름:
- PRINT: 사이즈+인쇄+별색+종이+수량+코팅+커팅+접지+후가공+박형압+봉투
- BOOK: 제본방식+내지종이+표지종이+표지인쇄+표지코팅+...
- STATIONERY: 소재+사이즈+인쇄+...
- PHOTOBOOK: 사이즈+페이지수+표지타입+...
- CALENDAR: 사이즈+용지+...
- 기타: 각 카테고리별 고유 옵션 세트

---

## 6. Figma 기타 페이지 참조

| 페이지 | ID | 용도 |
|--------|-----|------|
| option_NEW | 1647:128 | 상품 옵션 선택 UI (본 분석) |
| Component | 1655:105 | 공통 컴포넌트 정의 |
| Design | 379:2 | 기존 디자인 |
| 작업중 | 0:1 | 작업 중인 요소들 |
| Detail Page | 548:3324 | 상품 상세 페이지 |
| Concept | 534:2 | 컨셉 디자인 |
