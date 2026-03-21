# SPEC-PRODUCT-001 화면설계 참조: Figma option_NEW 완전 분석

> Figma File: `gEJhQRtmKI66BPhOpqoW3j`, Page: `option_NEW` (id: 1647:128)
> 분석일: 2026-03-20, 소스: Figma MCP + ref/figma/ PNG + figma-option-new-analysis.md

---

## 1. 공통 레이아웃 구조

모든 상품 카테고리가 공유하는 기본 레이아웃:

### 1.1 페이지 구조
- **Header**: Huni printing 로고 + 검색바 + 로그인/회원가입/마이페이지/장바구니
- **Breadcrumb**: 홈 > Shop > [카테고리] > [상품명]
- **메인 영역**: 2컬럼 레이아웃 (PC 기준)
  - 좌측 (약 40%): 상품 이미지 영역 (754x754px) + 썸네일 6개 (116x116px)
  - 우측 (약 60%): 옵션 폼 영역 (단일 페이지 스크롤, Step Wizard 아님)
- **하단**: 가격 Summary + 파일 업로드 + CTA 버튼

### 1.2 설계 원칙
- **단일 페이지 스크롤 폼** (option_NEW 패턴) - Step Wizard 사용 금지
- **PC-First 설계** (인쇄 특화 화면)
- 옵션 선택 시 실시간 가격 갱신
- 종속 옵션 체인: 상품유형 선택에 따라 옵션 그룹이 동적으로 변경

---

## 2. 10개 UI 컴포넌트 타입 정의 (OVERVIEW 섹션)

Figma MCP에서 추출한 정확한 컴포넌트 사양:

### 2.1 Option Group Button Type
- **용도**: 사이즈, 인쇄, 별색인쇄, 코팅, 커팅, 접지, 가공 등
- **버튼 사이즈**: 155x50px (그리드 배치, 한 줄 3개)
- **상태**: Default (회색 테두리) / Selected (보라색 테두리+배경)
- **레이블 예시**: "73 x 98 mm", "100 x 150 mm", "단면", "양면"
- **특수 기능**: "추천" 뱃지 (32x14px, 보라색 배경)
- **Figma Node**: 1661:114 ~ 1661:128

### 2.2 Option Group Select Box Type
- **용도**: 종이 선택, 후가수, 봉투 선택 등
- **사이즈**: 348x50px (드롭다운)
- **레이블 예시**: "몽블랑 190g" + 추천 뱃지 + "!" 도움말 아이콘
- **드롭다운 아이템**: 전체 너비, 45px 높이
- **Figma Node**: 1661:141 ~ 1661:143

### 2.3 Option Group Count Input Type
- **용도**: 제작수량, 건수, 내지 페이지 수
- **사이즈**: 155x50px (+/- 버튼 포함)
- **구조**: [-] 버튼 (34x50px) + 숫자 입력 (100px) + [+] 버튼 (34x50px)
- **레이블**: "제작수량" (172x40px)
- **Figma Node**: 1661:209 ~ 1661:219

### 2.4 Option Group Finish Title Bar (접이식 섹션 헤더)
- **용도**: 후가공, 박/형압 가공 등 복합 섹션의 열기/닫기
- **구조**: "후가공" 레이블 + 구분선 (466x1px) + "열기"/"닫기" 텍스트
- **Default 상태**: "열기" (접혀있음)
- **Selected 상태**: "닫기" (펼쳐져 하위 옵션 표시)
- **Figma Node**: 1661:337 ~ 1661:523

### 2.5 Option Group Finish Button Type
- **용도**: 후가공 하위 옵션 (귀돌이, 미싱, 오시 등)
- **버튼 사이즈**: 116x50px
- **레이블 예시**: "직각모서리", "둥근모서리"
- **구분**: "!" 도움말 아이콘 (16x15px 원형)
- **Figma Node**: 1661:358 ~ 1661:362

### 2.6 Option Group Finish Input Type
- **용도**: 박/형압 크기 직접입력
- **구조**: "가로크기" 입력 (140x50px) + "X" + "세로크기" 입력 (140x50px)
- **범위 안내**: "가로 30 ~ 125 mm / 세로 30 ~ 170 mm" (하단 회색 텍스트)
- **레이블**: "박(앞면) 크기 직접입력"
- **Figma Node**: 1661:426 ~ 1661:438

### 2.7 Option Group Finish Color Chip Type
- **용도**: 박 칼라 선택
- **칩 사이즈**: 50x50px (원형)
- **칼라 옵션 8종**: 금유광, 은유광, 적박, 청박, 먹유광, 홀로그램박, 트윙클박, 동박
- **Selected 상태**: "먹유광" 같은 레이블 뱃지 (48x20px) + 하단 삼각형 화살표
- **레이블**: "박(앞면) 칼라" + "홀로그램" 뱃지 (58x20px)
- **Figma Node**: 1661:400 ~ 1661:484

### 2.8 Option Group Finish Select Box Type (봉투 선택)
- **용도**: 엽서봉투, 개별포장, 캘린더봉투 등 추가상품
- **사이즈**: 461x50px (드롭다운, 기본 Select보다 넓음)
- **아이템 높이**: 45px
- **아이템 예시**:
  - "OPP비접착봉투 110 x 160 mm 50장 (+1,100원)"
  - "OPP비접착봉투 150 x 150 mm 50장 (+1,150원)"
  - "카드봉투 화이트 165 x 115 mm 10장 (+1,100원)"
  - "카드봉투 블랙 165 x 115 mm 10장 (+1,100원)"
- **Figma Node**: 1661:505 ~ 1661:518

### 2.9 Option Group Summary (가격 합산 테이블)
- **구조**: 항목별 가격 + 합계금액
- **항목 예시**:
  - "인쇄비 : 135 x 135 mm, 몽블랑 190, 양면, 20ea" → 50,000
  - "후가공 : 귀돌이 (직각모서리), 오시(2개)" → 25,000
  - "추가상품 : OPP비접착봉투 110 x 160 mm 50장묶음" → 1,100
- **합계**: "합계금액" + "상품가 75,000원 부가세 7,500원" = **82,500**
- **구분선**: 상단/하단 466x1px
- **Figma Node**: 1661:202 ~ 1661:286

### 2.10 Option Group Upload (파일 업로드)
- **버튼 1**: "PDF파일 직접 올리기" (465x50px, 흰 배경+보라 테두리)
  - 하단: "작업가이드 및 파일가이드 다운로드" + "!" 아이콘
- **버튼 2**: "에디터로 디자인하기" (465x50px, 보라색 배경)
  - 하단: "에디터 사용방법 보기" + "!" 아이콘
- **CTA**: "장바구니 담기" (465x50px, 보라색 배경)
- **Figma Node**: 1661:221 ~ 1661:544

---

## 3. 12개 상품 카테고리별 옵션 구성

### 복잡도 등급
- **XL**: 옵션 12+ 그룹 (인쇄, 제본)
- **L**: 옵션 8-11 그룹 (캘린더, 스티커)
- **M**: 옵션 5-7 그룹 (문구, 굿즈, 아크릴, 실사/사인)
- **S**: 옵션 2-4 그룹 (포토북, 디자인캘린더, 액세서리)

### 3.1 PRODUCT_PRINT_OPTION (디지털인쇄) - XL
**Figma Node**: 1647:129

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | 73x98, 98x98, 100x150, 95x210, 110x170, 135x135, 148x210 |
| 2 | 종이 | Select | 몽블랑 190g (추천 뱃지) |
| 3 | 인쇄 | Button | 단면 / 양면 |
| 4 | 별색인쇄(화이트) | Button | 화이트인쇄없음 / 화이트인쇄(단면) / 화이트인쇄(양면) |
| 5 | 별색인쇄(클리어) | Button | 동일 패턴 |
| 6 | 별색인쇄(핑크) | Button | 동일 패턴 |
| 7 | 별색인쇄(금색) | Button | 금색인쇄없음 / 금색인쇄(단면) / 금색인쇄(양면) |
| 8 | 별색인쇄(은색) | Button | 동일 패턴 |
| 9 | 코팅 | Button | 무광(단면)/무광(양면)/유광(단면)/유광(양면)/없음 |
| 10 | 커팅 | Button | 한쪽라운딩/나뭇잎/큰라운딩/클래식 |
| 11 | 접지 | Button | 2단가로접지/3단가로접지/2단세로접지 |
| 12 | 건수 | Count | +/- 카운터 |
| 13 | 제작수량 | Count | +/- 카운터 |
| 14 | 후가공 | Collapsible | 열기/닫기 |
| 14a | - 귀돌이 | Finish Button | 직각모서리 / 둥근모서리 |
| 14b | - 오시 | Finish Button | 없음 / 1개 / 2개 / 3개 |
| 14c | - 미싱 | Finish Button | 없음 / 1개 / 2개 / 3개 |
| 14d | - 가변인쇄(이미지) | Finish Button | 없음 / 단면 / 양면 |
| 14e | - 가변인쇄(텍스트) | Finish Button | 없음 / 단면 / 양면 |
| 15 | 박/형압 가공 | Collapsible | 열기/닫기 |
| 15a | - 박(앞면) | Button | 있음 / 없음 |
| 15b | - 박(앞면) 크기 | Input | 가로크기 X 세로크기 (범위 30~125 x 30~170 mm) |
| 15c | - 박(앞면) 칼라 | ColorChip | 8종 (금유광/은유광/적박/청박/먹유광/홀로그램/트윙클/동박) |
| 15d | - 박(뒷면) | 동일 패턴 | |
| 15e | - 형압 | Button | 없음 / 양각 / 음각 |
| 15f | - 형압 크기 | Input | 가로크기 X 세로크기 |
| 16 | 엽서봉투 | Finish Select | OPP비접착봉투, 카드봉투 화이트/블랙 |
| - | 가격 Summary | Summary | 인쇄비 + 후가공 + 추가상품 = 합계 |
| - | 파일 업로드 | Upload | PDF직접올리기 + 에디터로디자인하기 |
| - | CTA | Button | 장바구니 담기 |

### 3.2 PRODUCT_BOOK_OPTION (책자/제본) - XL
**Figma Node**: 1647:525

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | A5(148x210mm) / A4(210x297mm) |
| 2 | 책갈 | Button | 무선제본 |
| 3 | 제본방향 | Button | 가로 / 세로 |
| 4 | 띠걸이 | Image Button | 없음/은장/원형/삼각/사각/무지 (이미지 포함) |
| 5 | 띠사별 | Image Button | 없음/백색/바탕색/적갈색/청색 (이미지 포함) |
| 6 | 면수 | Button | 8면이하 / 24면이하 / 블릿? / 다면 |
| 7 | 제작수량 | Count | +/- |
| 8 | 내지종이 | Select | 몽블랑 190g (추천) |
| 9 | 내지인쇄 | Button | 단면 / 양면 |
| 10 | 내지 페이지 | Count | +/- (범위: 최소 24P ~ 최대 200P) |
| 11 | 표지종이 | Select | 몽블랑 190g |
| 12 | 표지인쇄 | Button | 단면 / 양면 |
| 13 | 표지코팅 | Button | 무광코팅 / 유광코팅(무코팅) / 유광코팅(전면코팅) |
| 14 | 투명커버 | Button | 무광인쇄없음 / 무광인쇄유광코팅(1) / 무광인쇄유광코팅(2) |
| 15 | 박/형압 가공 | Collapsible | (인쇄와 동일 패턴) |
| 16 | 개별포장 | Finish Select | 개별봉투 포장 등 |
| - | 가격 Summary | Summary | |
| - | 파일 업로드 | Upload | PDF + 에디터 |

### 3.3 PRODUCT_STICKER_OPTION (스티커) - L
**Figma Node**: 1647:1596

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | A6(105x148mm) / A5(148x210mm) / A4(210x297mm) |
| 2 | 종이 | Select | 유포 (추천) |
| 3 | 인쇄 | Button | 단면 |
| 4 | 별색인쇄(화이트) | Button | 화이트인쇄(단면) |
| 5 | 커팅 | Button | 2cm/7mm(1cut) / 2cm/7mm(sset) / A4크기(1mm cut) / 30x17mm(1set) |
| 6 | 후가수 | Select | 없음 |
| 7 | 제작수량 | Count | +/- |
| 8 | 후가공 | Collapsible | (간소화된 후가공) |
| - | 가격 Summary | Summary | |
| - | 파일 업로드 | Upload | PDF + 에디터 |

### 3.4 PRODUCT_GOODS_OPTION (굿즈/파우치) - M
**Figma Node**: 1647:1732

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | 75x68mm / 90x90mm / 198x130mm |
| 2 | 컬러 | ColorChip (대형) | 흰색/검정 + 10종 컬러칩 (대형 원형) |
| 3 | 가공 | Button | 이중전공 / 라벨봉제 |
| 4 | 제작수량 | Count | +/- |
| 5 | 제작수량 구간할인 | Slider + 테이블 | 1~1000개 구간별 단가 표시 (예: 3,260 원/ea) |
| 6 | 봉투인 | Select (드롭다운+아이템) | 봉투인 (선택형) 110x160mm 50장 (+1,100원) 등 |
| 7 | 수량 | Select | 추가 수량 선택 |
| - | 가격 Summary | Summary | 인쇄비 + 할인금액 (-) + 추가상품 = 합계 |
| - | 파일 업로드 | Upload | PDF + 에디터 |

### 3.5 PRODUCT_CALENDAR_OPTION (캘린더) - L
**Figma Node**: 1647:1033

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | 210x145mm / 190x220mm |
| 2 | 용지 | Select | CK P 265 (추천) |
| 3 | 인쇄 | Button | 단면 / 양면 |
| 4 | 장수 | Select | 13장 |
| 5 | 컬러 (집게) | ColorChip | 검정/회색 (2-3종) |
| 6 | 캘린더 가공 | Button | 카드보드(클래시티) / 고리에코보드(박카 / 오시지(새로운거) |
| 7 | 색상 (고리) | ColorChip | 검정/회색/밝은회색 |
| 8 | 제작수량 | Count | +/- |
| 9 | 개별포장 | Select (드롭다운) | 개별봉투포장 등 |
| 10 | 캘린더봉투 | Select (드롭다운) | 없음 등 |
| 11 | 수량 | Select | |
| - | 가격 Summary | Summary | |
| - | 파일 업로드 | Upload | PDF직접올리기 |

### 3.6 PRODUCT_DESIGN_CALENDAR_OPTION (디자인 캘린더) - S
**Figma Node**: 1647:1165

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | 210x145mm / 190x220mm |
| 2 | 용지 | Select | CK P 265 (추천) |
| 3 | 레디자 | Select | 레디 디자인 |
| 4 | 제작수량 | Count | +/- |
| 5 | 캘린더봉투 | Select | 없음 등 |
| - | 가격 Summary | Summary | |
| - | CTA | Upload | 에디터로 디자인하기만 (PDF 업로드 없음) |

### 3.7 PRODUCT_STAITIONERY_OPTION (문구) - M
**Figma Node**: 1647:810

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | 130x190mm |
| 2 | 내지 | Button | 실내지(?) |
| 3 | 종이 | Select | 매트 130g |
| 4 | 제본옵션 | Button | 5공 1조 / 14공 1조 |
| 5 | 컬러 | ColorChip | 검정/회색/밝은회색 (3종) |
| 6 | 제작수량 | Count | +/- |
| 7 | 제작수량 구간할인 | Slider | 1~1000개 단가표 (3,260원/ea) |
| 8 | 개별포장 | Select | 개별봉투포장 |
| - | 가격 Summary | Summary | |
| - | 파일 업로드 | Upload | PDF + 에디터 |

### 3.8 PRODUCT_PHOTOBOOK_OPTION (포토북) - S
**Figma Node**: 1647:929

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | A5(148x210mm) / A4(210x297mm) / 8x8(220x200mm) / 16x12(220x350mm) |
| 2 | 커버타입 | Button | 하드커버 / 소프트커버 / 미니하드커버(?) |
| 3 | 제작수량 | Count | +/- |
| - | 가격 Summary | Summary (간소화) | 합계금액만 표시 |
| - | CTA | Upload | 에디터로 디자인하기만 (PDF 없음, 장바구니 없음) |

### 3.9 PRODUCT_ARRYLIC_OPTION (아크릴) - M
**Figma Node**: 1647:1346

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button (2행) | 20x35mm / 36x50mm / 50x80mm / 50x210mm / 110x170mm / 148x210mm / 130x135mm |
| 2 | 크기 직접입력 | Input | 가로크기 X 세로크기 (범위 표시) |
| 3 | 소재 | Button | 투명아크릴 3mm |
| 4 | 후가수 | Select | 도무송 |
| 5 | 가공 | Button | 스탠딩스공 / 광택코팅 / 금속코팅(?) |
| 6 | 제작수량 | Count | +/- |
| 7 | 구간할인 | Slider | 단가표 |
| 8 | 봉투인 | Select | 봉투인 선택 |
| 9 | 수량 | Select | |
| - | 가격 Summary | Summary | |
| - | CTA | Upload | 에디터로 디자인하기만 |

### 3.10 PRODUCT_SIGN_POSTER_OPTION (실사/사인) - M
**Figma Node**: 1647:1487

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | A0(900x1400mm) / A3(420x594mm) / A1(700x841mm) / 직접입력 |
| 2 | 직접입력 | Input | 가로크기 X 세로크기 (범위 200~1300 x 200~8000 mm) |
| 3 | 소재 | Select (색상뱃지) | PVC 투명 (추천) |
| 4 | 별색인쇄(화이트) | Button | 화이트인쇄(배경자동) / 화이트인쇄(영역지정) |
| 5 | 제작수량 | Count | +/- |
| - | 가격 Summary | Summary | |
| - | 파일 업로드 | Upload | PDF직접올리기만 (에디터 없음) |

### 3.11 PRODUCT_ACCESSORIES_OPTION (액세서리) - S (최간단)
**Figma Node**: 1647:1271

| 순서 | 옵션 그룹 | 컴포넌트 타입 | 값 예시 |
|------|----------|-------------|--------|
| 1 | 사이즈 | Button | 79x230mm(DPB) / 84x190mm(DB형) |
| 2 | 수량 | Count | +/- |
| - | 가격 Summary | Summary (최소) | 합계금액만 |
| - | CTA | Button | 장바구니 담기만 (파일 업로드 없음) |

---

## 4. 상품별 업로드/CTA 패턴 분류

| 패턴 | 상품 | 설명 |
|------|------|------|
| **A: PDF + 에디터 + 장바구니** | 인쇄, 제본, 스티커, 문구 | 풀 기능 (가장 일반적) |
| **B: 에디터만** | 포토북, 디자인캘린더, 아크릴 | 에디터 전용 (직접 진입) |
| **C: PDF만** | 캘린더, 실사/사인 | PDF 업로드만 (에디터 불필요) |
| **D: 장바구니만** | 액세서리 | 파일 업로드 없음 (기성품) |
| **E: PDF + 에디터 (할인표 포함)** | 굿즈 | PDF/에디터 + 구간할인 슬라이더 |

---

## 5. 컴포넌트 매핑: Figma -> React

### 5.1 핵심 컴포넌트 목록

| Figma 컴포넌트 | React 컴포넌트명 | Props |
|---------------|----------------|-------|
| Option Group Button Type | `<OptionGroupButton>` | label, options[], selected, onChange, showBadge |
| Option Group Select Box Type | `<OptionGroupSelect>` | label, options[], selected, onChange, badge |
| Option Group Count Input Type | `<OptionGroupCount>` | label, value, min, max, onChange, range? |
| Option Group Finish Title Bar | `<OptionGroupCollapsible>` | label, isOpen, onToggle, children |
| Option Group Finish Button Type | `<OptionGroupFinishButton>` | label, options[], selected, tooltip |
| Option Group Finish Input Type | `<OptionGroupSizeInput>` | label, minW, maxW, minH, maxH, onChange |
| Option Group Finish Color Chip Type | `<OptionGroupColorChip>` | label, colors[], selected, onChange |
| Option Group Finish Select Box Type | `<OptionGroupFinishSelect>` | label, items[], selected, onChange |
| Option Group Summary | `<PriceSummary>` | items[], total, tax |
| Option Group Upload | `<FileUploadActions>` | showPdf, showEditor, showCart, onPdf, onEditor, onCart |
| 제작수량 구간할인 | `<QuantityDiscountSlider>` | breaks[], currentQty, unitPrice |
| Image Button (띠걸이/띠사별) | `<OptionGroupImageButton>` | label, options[{img,label}], selected |

### 5.2 상품별 옵션 렌더링 설정 (JSON 기반)

각 상품 카테고리는 JSON 설정으로 옵션 그룹을 동적으로 구성:

```
상품유형 → optionGroups[] → 각 그룹의 type, label, values, dependencies
```

종속 관계 예시:
- 사이즈 선택 → 종이 옵션 목록 변경
- 인쇄(단면/양면) → 별색인쇄 옵션 표시/숨김
- 제작수량 변경 → 가격 Summary 실시간 갱신

---

## 6. 디자인 토큰 (Figma 기반)

### 6.1 컬러
- **Primary (보라)**: Selected 상태, CTA 버튼 (에디터로 디자인하기)
- **White**: 기본 버튼 배경
- **Gray Border**: 기본 상태 테두리
- **Text Dark**: 레이블, 옵션 텍스트
- **Text Gray**: 범위 안내, 부가세 텍스트
- **Badge Purple**: "추천" 뱃지 배경

### 6.2 타이포그래피
- **옵션 레이블**: 172x40px, Bold
- **버튼 텍스트**: 155x50px 내, 14px 정도
- **가격 합계**: Bold, 크게 (33px 높이)
- **안내 텍스트**: 회색, 작게 (13-14px)

### 6.3 사이징
- **버튼**: 155x50px (표준), 116x50px (Finish), 465x50px (CTA/Upload)
- **Select**: 348x50px (표준), 461x50px (Finish)
- **ColorChip**: 50x50px (원형)
- **Count Input**: 155x50px (전체), 34x50px (+-버튼), 100px (입력)
- **Size Input**: 140x50px (가로/세로 각각)

---

## 7. 한글 텍스트 식별 (Figma MCP 기반 정확한 값)

PNG 이미지에서 깨져 보이는 한글 텍스트를 Figma MCP 노드 데이터로 보완:

| 노드 ID | 정확한 텍스트 | 용도 |
|---------|-------------|------|
| 1661:126 | 사이즈 | 옵션 레이블 |
| 1661:201 | 종이 | 옵션 레이블 |
| 1661:199 | 제작수량 | 옵션 레이블 |
| 1661:337 | 후가공 | 섹션 헤더 |
| 1661:522 | 열기 | 접이식 열기 텍스트 |
| 1661:523 | 닫기 | 접이식 닫기 텍스트 |
| 1661:358 | 귀돌이 | 후가공 옵션명 |
| 1661:362 | 직각모서리 | 귀돌이 옵션값 |
| 1661:360 | 둥근모서리 | 귀돌이 옵션값 |
| 1661:428 | 박(앞면) 크기 직접입력 | 입력 레이블 |
| 1661:434 | 가로크기 | 입력 플레이스홀더 |
| 1661:438 | 세로크기 | 입력 플레이스홀더 |
| 1661:402 | 박(앞면) 칼라 | 칼라칩 레이블 |
| 1661:407 | 먹유광 | 칼라칩 뱃지 |
| 1661:410 | 홀로그램 | 칼라칩 뱃지 |
| 1661:547 | 엽서봉투 | 봉투 선택 레이블 |
| 1661:290 | 추천 | 추천 뱃지 텍스트 |
| 1661:228 | 합계금액 | 가격 합계 레이블 |
| 1661:223 | PDF파일 직접 올리기 | 업로드 버튼 텍스트 |
| 1661:224 | 에디터로 디자인하기 | 에디터 버튼 텍스트 |
| 1661:226 | 작업가이드 및 파일가이드 다운로드 | 가이드 링크 |
| 1661:227 | 에디터 사용방법 보기 | 에디터 가이드 링크 |
| 1661:544 | 장바구니 담기 | CTA 버튼 텍스트 |

---

## 8. 화면설계 시 핵심 주의사항

### 8.1 레이아웃
- 2컬럼 레이아웃 유지 (좌: 이미지, 우: 옵션폼)
- 모바일: 이미지 → 옵션폼 세로 배치
- 후가공/박형압은 접이식(Collapsible) 섹션으로 구현

### 8.2 종속 옵션
- 상품 카테고리 선택 시 전체 옵션 그룹 세트가 변경됨
- 옵션 간 종속 관계는 서버(BFF)에서 관리
- 프론트엔드는 옵션 설정 JSON을 받아 동적 렌더링

### 8.3 가격 계산
- 모든 옵션 변경 시 실시간 가격 갱신
- Summary 테이블에 항목별 가격 표시
- 상품가 + 부가세 별도 표시
- 구간할인 적용 시 할인금액을 마이너스(-)로 표시

### 8.4 파일 업로드
- 상품 카테고리별 업로드 패턴이 다름 (섹션 4 참조)
- PDF 업로드와 에디터는 배타적이지 않음 (둘 다 선택 가능)
- 작업 가이드/파일 가이드 다운로드 링크 포함 필수

---

## 9. 추적성

| 참조 | 파일 경로 |
|------|----------|
| Figma 원본 | `gEJhQRtmKI66BPhOpqoW3j` page `option_NEW` (1647:128) |
| 기존 분석 | `.moai/docs/figma-option-new-analysis.md` |
| ref 이미지 | `ref/figma/PRODUCT_*.png` (12종) |
| SPEC-PRODUCT-001 | `.moai/specs/SPEC-PRODUCT-001/spec.md` |
| SPEC-PLAN-001 | `.moai/specs/SPEC-PLAN-001/spec.md` (section 5, 7) |
