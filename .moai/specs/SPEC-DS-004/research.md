# SPEC-DS-004 Deep Research: Figma → Pencil → Code Pipeline

## 1. Figma 파일 분석

### 파일 정보
- **File Key**: gEJhQRtmKI66BPhOpqoW3j
- **대상 페이지**: option_NEW (id: 1647:128)
- **대상 섹션**: PRODUCT_PRINT_OPTION (id: 1647:129)
- **섹션 크기**: 2158 x 5504px
- **총 요소 수**: 298개

### 페이지 구조 (option_NEW)
| 섹션 | ID | 요소 수 |
|------|-------|---------|
| PRODUCT_PRINT_OPTION | 1647:129 | 298 |
| OVERVIEW | 1661:132 | 113 |
| PRODUCT_BOOK_OPTION | 1647:525 | 195 |
| PRODUCT_STAITIONERY_OPTION | 1647:810 | 89 |
| PRODUCT_PHOTOBOOK_OPTION | 1647:929 | 63 |
| PRODUCT_CALENDAR_OPTION | 1647:1033 | 99 |
| PRODUCT_DESIGN CALENDAR_OPTION | 1647:1165 | 71 |
| PRODUCT_ACCESSORIES_OPTION | 1647:1271 | 43 |
| PRODUCT_ARRYLIC_OPTION | 1647:1346 | 106 |
| PRODUCT_SIGN POSTER_OPTION | 1647:1487 | 73 |
| PRODUCT_STICKER_OPTION | 1647:1596 | 95 |
| PRODUCT_GOODS_OPTION | 1647:1732 | 101 |

### 요소 타입 분포 (PRODUCT_PRINT_OPTION)
| 타입 | 수량 | 설명 |
|------|------|------|
| TEXT | 139 | 레이블, 옵션 텍스트, 가격 |
| RECTANGLE | 104 | 버튼, 카드, 구분선 |
| GROUP | 36 | 아이콘, 컬러칩 |
| VECTOR | 17 | 아이콘 SVG |
| ELLIPSE | 2 | 컬러칩 원형 |
| **FRAME** | **0** | **컴포넌트 구조 없음 (완전 플랫)** |

## 2. UI 흐름 분석 (Y좌표 순)

### Zone 1: 상품 정보 (y: -2700 ~ -2344)
- Header: 로그인/회원가입/마이페이지/장바구니
- Breadcrumb: 홈 > Shop > 엽서 > 프리미엄엽서
- 상품명: 디지털인쇄 상품명
- 리뷰: ★★★★★ (44 Reviews)
- 설명: 간략한 설명

### Zone 2: 기본 옵션 (y: -2344 ~ -1267)
- **사이즈**: 7개 칩 (73x98, 98x98, 100x150, 95x210, 110x170, 148x210, 135x135) + "추천" 배지
- **종이**: 드롭다운 (몽블랑 190g) + "추천" 배지 + "!" 정보 아이콘
- **인쇄**: 단면/양면 라디오
- **별색인쇄 5종**: 화이트/클리어/핑크/금색/은색, 각 없음/단면/양면

### Zone 3: 가공 옵션 (y: -1267 ~ -640)
- **코팅**: 코팅없음/무광(단면/양면)/유광(단면/양면)
- **커팅**: 한쪽라운딩/나뭇잎/큰라운딩/클래식 + "!" 아이콘
- **접지**: 2단가로/2단세로/3단가로
- **건수/제작수량**: 숫자 입력

### Zone 4: 후가공 (y: -507 ~ 168, 접이식)
- **귀돌이**: 직각모서리/둥근모서리
- **오시**: 없음/1개/2개/3개
- **미싱**: 없음/1개/2개/3개
- **가변인쇄(텍스트)**: 없음/1개/2개/3개
- **가변인쇄(이미지)**: 없음/1개/2개/3개

### Zone 5: 박/형압 가공 (y: 168 ~ 1292, 접이식)
- **박(앞면)**: 박있음/박없음 + 크기 직접입력 + 칼라 선택 (8색)
- **박(뒷면)**: 동일 구조
- **형압**: 없음/양각/음각 + 크기 직접입력

### Zone 6: 추가상품 + 결제 (y: 1365 ~ 2062)
- **엽서봉투**: 드롭다운 (OPP비접착봉투, 카드봉투 등)
- **가격 요약**: 인쇄비/후가공/추가상품 → 합계금액 82,500 (부가세 포함)
- **CTA**: PDF파일 직접 올리기 / 에디터로 디자인하기

## 3. 식별된 컴포넌트 (13종)

### Atoms (3종)
| 컴포넌트 | Figma 패턴 | 크기 | 색상 | 반복 |
|---------|-----------|------|------|------|
| BadgeLabel | RECT 32x14 + TEXT "추천" | 32x14 | fill: #5538b6, text: white | 2+ |
| InfoTooltip | TEXT "!" + callout popup | 16x19 | text: #000 | 5+ |
| ColorChip | GROUP (ELLIPSE + RECT) | 50x50 | 다양한 금속색 | 16 |

### Molecules (8종)
| 컴포넌트 | Figma 패턴 | 크기 | 반복 |
|---------|-----------|------|------|
| OptionLabel | TEXT (섹션 제목) | 가변 | 15+ |
| SizeOptionChip | RECT 155x50 + TEXT | 155x50 | 45 |
| RadioOption | RECT 116x50 + TEXT | 116x50 | 18 |
| DropdownSelect | RECT 461x45 + TEXT + "▼" | 461x45 | 4 |
| CounterOption | 4x RECT 140x50 (없음/1/2/3) | 140x50 | 24 |
| SizeInput | RECT 461x45 + TEXT (가로X세로) | 461x45 | 3 |
| QuantityInput | RECT 461x50 + TEXT (숫자) | 461x50 | 2 |
| CTAButton | RECT 465x50 + TEXT | 465x50 | 2 |

### Organisms (2종)
| 컴포넌트 | 구성 | 동작 |
|---------|------|------|
| CollapsibleSection | OptionLabel + 열기/닫기 + 자식 컴포넌트 | 토글 접이식 |
| PriceSummary | TEXT 그룹 (항목별 가격 + 합계) | 가격 계산 표시 |

## 4. 디자인 토큰

### 색상
| 토큰 | 값 | 용도 |
|------|------|------|
| --color-primary | #5538b6 | 선택된 옵션 테두리, 배지, CTA |
| --color-border | #cacaca | 미선택 옵션 테두리 |
| --color-surface | #ffffff | 옵션 배경 |
| --color-disabled | #d9d9d9 | 비활성 배경, 이미지 플레이스홀더 |
| --color-bg | #f6f6f6 | 섹션 배경 |
| --color-text | #000000 | 기본 텍스트 |

### RECTANGLE 크기 패턴
| 크기 | 수량 | 컴포넌트 매핑 |
|------|------|-------------|
| 155x50 | 45 | SizeOptionChip |
| 116x50 | 10 | RadioOption (미선택) |
| 115x50 | 8 | RadioOption (선택됨) |
| 116x116 | 6 | ImageOptionCard |
| 140x50 | 6 | CounterOption |
| 461x45 | 4 | DropdownSelect |
| 465x50 | 2 | CTAButton |
| 32x14 | 2 | BadgeLabel |

## 5. 기존 자산과의 매핑

### innojini-huni-design-system (v4.1.0) 대응
- BadgeLabel → 스킬에 정의됨 (v4.1.0 신규)
- CalloutPopover → InfoTooltip에 대응
- ImageOptionSelector → 116x116 카드에 대응
- PageCounterInput → CounterOption에 대응
- ColorChip 3-mode → ColorChip에 대응
- QtySlider priceDisplay → QuantityInput + PriceSummary에 대응

### 추가 발견 사항
- Figma에 Component 페이지 (id: 1655:105) 별도 존재 — 디자이너의 컴포넌트화 시도 흔적
- option_NEW의 12개 SECTION이 모두 유사한 패턴 → 컴포넌트 재사용 효과 극대화

## 6. 기존 디자인 시스템 스킬 상세 매핑

### innojini-huni-design-system v5.0.0 컴포넌트 → SPEC-DS-004 매핑

| 기존 스킬 컴포넌트 | Figma 패턴 | SPEC-DS-004 이름 | 매핑 |
|------------------|-----------|----------------|------|
| OptionGroupButtonType | RECT 155x50 | SizeOptionChip | 동일 |
| OptionGroupSelectBoxType | RECT 461x45 + ▼ | DropdownSelect | 동일 |
| OptionGroupCountInputType | [34px -] [155px] [34px +] | CounterOption 확장 | 구조 동일 |
| OptionGroupFinishTitleBar | TEXT + 열기/닫기 | CollapsibleSection | 동일 |
| OptionGroupFinishButtonType | RECT 116x50 | RadioOption | 동일 |
| OptionGroupFinishInputType | RECT + TEXT (가로X세로) | SizeInput | 동일 |
| OptionGroupFinishColorChipType | GROUP 50x50 | ColorChip | 동일 |
| OptionGroupFinishSelectBoxType | RECT 461x45 + ▼ | DropdownSelect (재사용) | 동일 |
| OptionGroupSummary | TEXT 그룹 (가격) | PriceSummary | 동일 |
| OptionGroupUpload | RECT 465x50 | CTAButton | 동일 |

### 8대 구현 규칙 (RULE-*)

| 규칙 | 내용 | 영향 |
|------|------|------|
| RULE-1 | SelectBox는 native `<select>` 금지, 커스텀 div 사용 | DropdownSelect |
| RULE-2 | 선택 상태 = white fill + #553886 stroke w=2 | 모든 선택 컴포넌트 |
| RULE-3 | CounterInput은 직사각형 3파트 [34-155-34], 원형 금지 | CounterOption |
| RULE-4 | ColorChip은 50x50 Ellipse (32x32는 MiniColorChip) | ColorChip |
| RULE-5 | 한국어 옵션 레이블 하드코딩 금지, API/DB에서 로드 | 전체 컴포넌트 |
| RULE-5-EXT | PriceSlider는 @radix-ui/react-slider 사용 | 해당 시 |
| RULE-6-EXT | ImageChipType 50x50 Ellipse | 해당 시 |
| RULE-7-EXT | MiniColorChipType 32x32 Ellipse | 해당 시 |

### 3-Layer 아키텍처

```
Layer 1: Figma Tokens (불변)
  - Pixel-exact 측정값 → Tailwind 클래스
  - 색상: #5538B6, #3B2573, #CACACA 등

Layer 2: CVA Variants (상태 기반)
  - selected / default / disabled
  - upload / design / cart (CTA)

Layer 3: Radix Primitives (접근성 + 행동)
  - @radix-ui/react-select → HuniCustomSelect
  - @radix-ui/react-toggle → OptionButton, FinishButton
  - @radix-ui/react-radio-group → ColorChip
  - @radix-ui/react-collapsible → FinishTitleBar
  - @radix-ui/react-slot → OrderCTA
```

### .pen 파일 현황

| 경로 | 상태 |
|------|------|
| pen-files/component/color-palette.pen | 생성됨 |
| pen-files/component/typography.pen | 생성됨 |
| pen-files/component/ui-components.pen | 생성됨 |
| pen-files/component/logo.pen | 미생성 |
| pen-files/component/label-callout.pen | 미생성 |
| pen-files/option-new/product-print.pen | **미생성 (이번 SPEC 대상)** |

### 확장 색상 팔레트 (15색)

| 토큰 | 값 | 용도 |
|------|------|------|
| primary | #5538B6 | 선택 상태, CTA, 활성 탭 |
| primary-dark | #3B2573 | 장바구니 버튼 |
| primary-secondary | #9580D9 | 호버 상태 |
| primary-light-1 | #C9C2DF | 밝은 배경 |
| primary-light-2 | #DED7F4 | 밝은 배경 |
| primary-light-3 | #EEEBF9 | 밝은 배경 |
| text-dark | #424242 | 섹션 레이블 |
| text-medium | #565656 | 본문 텍스트 |
| text-muted | #979797 | 비선택, 플레이스홀더 |
| border-default | #CACACA | 테두리, 비선택 |
| bg-light | #E9E9E9 | 밝은 배경 |
| bg-section | #F6F6F6 | 섹션 배경 |
| bg-white | #FFFFFF | 카드 배경 |
| accent-gold | #E6B93F | 골드 배지 |
| accent-teal | #7AC8C4 | 보조 CTA |

### 타이포그래피 (Noto Sans)

| 역할 | 크기 | 두께 | Letter Spacing |
|------|------|------|---------------|
| H1 | 36pt | 600 | -5% |
| H2 | 24pt | 600 | -5% |
| Body SemiBold | 16pt | 600 | -5% |
| Body Regular | 14pt | 400 | -5% |
| Button/UI | 16pt | 600 | -5% |
| Caption | 14pt | 400 | -5% |

## 7. 위험 요소

1. **Figma MCP 토큰 만료** — REST API 직접 호출로 우회 가능 (확인됨)
2. **플랫 구조의 정확한 그룹핑** — Y좌표 기반 섹션 분리 + 이름 패턴 매칭 필요
3. **Pencil batch_design 25개 제한** — 3~4회 분할 생성
4. **컴포넌트 간 상태 연동** — 박 선택 시 크기입력 표시 등 조건부 렌더링
5. **12개 상품 타입에 대한 확장성** — PRINT_OPTION 기준으로 만들되 다른 타입도 호환 필요
