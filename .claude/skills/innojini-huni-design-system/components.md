# Huni Design System — Detailed Component Specs

Source: Figma REST API, file `gEJhQRtmKI66BPhOpqoW3j`, OVERVIEW node `1661:132`
All measurements pixel-exact from absoluteBoundingBox.

---

## 1. OptionGroupButtonType

**Purpose:** Grid of selectable option buttons (e.g., 사이즈 selection)
**Code:** `src/components/quote/OptionButton.tsx`

### Dimensions
| State | Width | Height | Fill | Stroke | Stroke Width |
|-------|-------|--------|------|--------|-------------|
| Default | 155px | 50px | #FFFFFF | #CACACA | 1px |
| Selected | 155px | 50px | #FFFFFF | #553886 | 2px |

### Typography
| State | Font | Size | Weight | Color |
|-------|------|------|--------|-------|
| Default | Noto Sans | 14px | 400 | #979797 |
| Selected | Noto Sans | 14px | 400 | #553886 |

### Layout
- Corner radius: 4px
- Grid: 3 columns, 0px gap (borders touch)
- Text position: x=8, y=11 inside button frame
- Section label: Noto Sans 16px fw=500 #424242, height 40px

### Figma Nodes
- Default button BG: `1661:114` (Rectangle 1, 155×50)
- Selected button BG: `1661:127` (Rectangle 4906, 155×50)
- Default text: `1661:120` (73 x 98 mm, fill #979797)
- Selected text: `1661:128` (100 x 150 mm, fill #553886)
- Section label: `1661:126` (사이즈, 16px fw=500)

---

## 2. OptionGroupSelectBoxType

**Purpose:** Paper/material selection dropdown (e.g., 종이 selection)
**Code:** `src/components/quote/PaperDropdown.tsx` ✅ Fixed (HuniCustomSelect, ▼ text caret)

### [CRITICAL] Must NOT use native `<select>`

Figma renders the dropdown caret as `▼` text node overlaid on a custom rectangle.
Native `<select>` cannot reproduce this styling.

### Dimensions
| Component | Width | Height | Fill | Stroke |
|-----------|-------|--------|------|--------|
| Container | 348px | 50px | #FFFFFF | #CACACA 1px |
| Caret text `▼` | — | — | #979797 | — |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Selected text | Noto Sans | 14px | 400 | #424242 |
| Caret ▼ | Noto Sans | 12-14px | 400 | #979797 |

### Layout
- Corner radius: 4px
- Text left padding: 16px (x=16, y=11)
- Caret right padding: ~16px from right edge
- 추천 badge: 32×14px, fill #FF66CC, text white

### Figma Nodes
- Container: `1661:141` (Rectangle 37, 348×50)
- Text: `1661:142` (몽블랑 190g)
- Caret: `1661:143` (▼)
- Badge BG: `1661:288` (Rectangle 4847, 32×14)
- Badge text: `1661:290` (추천)

---

## 3. OptionGroupCountInputType

**Purpose:** Numeric quantity stepper (제작수량)
**Code:** `src/components/quote/CounterInput.tsx` ✅ Correct

### Dimensions
| Part | Width | Height | Fill | Stroke |
|------|-------|--------|------|--------|
| Total frame | 223px | 50px | #FFFFFF | #CACACA 1px |
| Minus button area | 34px | 50px | — | — |
| Center display | 155px | 50px | — | — |
| Plus button area | 34px | 50px | — | — |
| Divider lines | 1px | 50px | #CACACA | — |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Minus `−` | Noto Sans | 18px | 400 | #424242 |
| Value display | Noto Sans | 14px | 500 | #979797 |
| Plus `+` | Noto Sans | 18px | 400 | #424242 |

### Layout
- Minus at x=0, Plus at x=189 (within 223px frame)
- Divider 1 at x=34, Divider 2 at x=189
- Value text x≈90, y=11
- Buttons: NOT circular — rectangular areas

### Figma Nodes
- Center area: `1661:209` (Rectangle 3576, 155×50)
- Left minus area: `1661:211` (Rectangle 3577, 34×50)
- Right plus area: `1661:213` (Rectangle 3578, 34×50)
- Value "20": `1661:215` (100×28)
- Label: `1661:199` (제작수량, 16px fw=500)

---

## 4. OptionGroupFinishTitleBar

**Purpose:** Collapsible header for 후가공 section
**Code:** `src/components/quote/FinishTitleBar.tsx`

### Dimensions
| Element | Width | Height | Fill |
|---------|-------|--------|------|
| Bar | ~466px | 50px | #F5F5F5 |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| "후가공" | Noto Sans | 16px | 500 | #424242 |
| "열기"/"닫기" | Noto Sans | 12px | 400 | #553886 |

### Figma Nodes
- Title text: `1661:337` / `1661:520` (후가공)
- Divider: `1661:338` / `1661:521` (466×1px)
- Open: `1661:522` (열기)
- Close: `1661:523` (닫기)

---

## 5. OptionGroupFinishButtonType

**Purpose:** Finish option selection buttons (e.g., 귀돌이 → 둥근모서리/직각모서리)
**Code:** `src/components/quote/FinishButton.tsx`

### Dimensions
| State | Width | Height | Fill | Stroke |
|-------|-------|--------|------|--------|
| Default | 116px | 50px | #FFFFFF | #CACACA 1px |
| Selected | 116px | 50px | #FFFFFF | #553886 2px |

### Typography
| State | Font | Size | Weight | Color |
|-------|------|------|--------|-------|
| Default | Noto Sans | 12px | 400 | #979797 |
| Selected | Noto Sans | 12px | 600 | #553886 |

### Figma Nodes
- Selected button BG: `1661:359` (Rectangle 4826, 116×50, stroke #553886)
- Default button BG: `1661:361` (Rectangle 4827, 116×50, stroke #CACACA)
- Selected text: `1661:360` (둥근모서리, 89×28)
- Default text: `1661:362` (직각모서리, 89×28)
- Label: `1661:358` (귀돌이, 172×50)

---

## 6. OptionGroupFinishInputType

**Purpose:** Direct dimension input for finish options (e.g., 박(앞면) 크기)
**Code:** `src/components/quote/FinishInput.tsx`

### Dimensions
| Element | Width | Height | Fill | Stroke |
|---------|-------|--------|------|--------|
| Input field (W or H) | 140px | 50px | #FFFFFF | #CACACA 1px |
| X separator text | — | — | #424242 | — |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Placeholder (가로크기/세로크기) | Noto Sans | 14px | 400 | #CACACA |
| X separator | Noto Sans | 14px | 400 | #424242 |
| Help text | Noto Sans | 11px | 400 | #979797 |
| Label | Noto Sans | 16px | 500 | #424242 |

### Layout
- Width input x=20, Height input x=185 (approx)
- X separator between the two inputs
- Help text below: "가로 30 ~ 125 mm / 세로 30 ~ 170 mm"
- Corner radius: 4px

### Figma Nodes
- Label: `1661:428` (박(앞면) 크기 직접입력)
- Width input: `1661:430` (Rectangle 4869, 140×50)
- Height input: `1661:432` (Rectangle 4870, 140×50)
- W placeholder: `1661:434` (가로크기)
- X sep: `1661:436`
- H placeholder: `1661:438` (세로크기)
- Help: `1661:426` (가로 30~125mm / 세로 30~170mm)

---

## 7. OptionGroupFinishColorChipType

**Purpose:** Color chip selection for foil/박 colors
**Code:** `src/components/quote/ColorChip.tsx`

### Dimensions
| State | Width | Height | Shape | Fill | Stroke |
|-------|-------|--------|-------|------|--------|
| Default | 50px | 50px | Ellipse | chip color | none |
| Selected | 50px | 50px | Ellipse | #FFFFFF | #553886 sw=2 |

### Color Chip Values (박 types)
| Name | Approx Color | Notes |
|------|-------------|-------|
| opt_박_금유광 | #D4AF37 | Gold foil |
| opt_박_은유광 | #C0C0C0 | Silver foil |
| opt_박_적박 | #CC1523 | Red foil |
| opt_청박 | #0099CC | Blue foil |
| opt_박_먹유광 | #1A1A1A | Black foil |
| opt_박_홀로그램박 | #E8E8E8 | Holographic |
| opt_박_트윙클박 | #CC66BB | Twinkle/sparkle |
| opt_박_동박 | #B87333 | Copper foil |

### Figma Nodes
- Selected chip: `1661:400` (Ellipse 576, 50×50, white fill, stroke #553886)
- Default chip: `1661:553` (Ellipse 577, 50×50)
- Chip groups: `1661:440` (opt_박_금유광) through `1661:482` (opt_박_동박)
- Label: `1661:402` (박(앞면) 칼라, 172×40)

---

## 8. OptionGroupFinishSelectBoxType

**Purpose:** Accessory/envelope product selection (e.g., 엽서봉투)
**Code:** `src/components/quote/FinishSelect.tsx` ✅ Fixed (HuniCustomSelect, 461×50px)

### [CRITICAL] Must NOT use native `<select>`

Same rule as OptionGroupSelectBoxType. Use custom div-based dropdown.

### Dimensions
| Component | Width | Height | Fill | Stroke |
|-----------|-------|--------|------|--------|
| Container | 461px | 50px | #FFFFFF | #CACACA 1px |
| Caret ▼ | — | — | #979797 | — |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Selected text | Noto Sans | 14px | 400 | #424242 |
| Caret ▼ | Noto Sans | 12px | 400 | #979797 |

### Figma Nodes
- Container: `1661:505` (Rectangle 4892, 461×50)
- Text "없음": `1661:511`
- Caret ▼: `1661:518`
- Option list: `1661:515`
- Label: `1661:547` (엽서봉투, 172×40)
- Divider: `1661:548` (Vector 803)

---

## 9. OptionGroupSummary

**Purpose:** Price breakdown and total display
**Code:** `src/components/quote/PriceResult.tsx`

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| "합계금액" label | Noto Sans | 16px | 600 | #1E1E1E |
| Item descriptions | Noto Sans | 12px | 400 | #616161 |
| Item amounts | Noto Sans | 12px | 400 | #424242 |
| Total amount | Noto Sans | 24px | 600 | #553886 |
| Sub-amounts | Noto Sans | 12px | 400 | #424242 |

### Content Structure
- Summary text: 인쇄비, 후가공, 추가상품 (left-aligned)
- Amounts: right-aligned (50,000 / 25,000 / 1,100)
- Divider line before total
- Total: "합계금액" (left) + "82,500" in #553886 24px (right)
- Sub-note: "상품가 75,000원  부가세 7,500원"

### Figma Nodes
- Summary text: `1661:225` (301×91, 인쇄비... content)
- "합계금액": `1661:228` (131×33)
- "82,500": `1661:229` (131×33, fill #553886, 24px fw=600)
- Sub-note: `1661:285`
- Sub-amounts: `1661:286`

---

## 10. OptionGroupUpload

**Purpose:** PDF upload, design editor, and cart buttons
**Code:** `src/components/quote/OrderCTA.tsx`

### Dimensions
| Button | Width | Height | Fill | Stroke | Text Color |
|--------|-------|--------|------|--------|-----------|
| PDF upload | 465px | 50px | #FFFFFF | #553886 1px | #424242 |
| Design editor | 465px | 50px | #553886 | none | #FFFFFF |
| Cart | 465px | 50px | #3B2573 | none | #FFFFFF |

### Typography
All buttons: Noto Sans 14px fw=600, centered

### Layout
- Corner radius: 5px (all buttons)
- Vertical stacking with spacing

### Button Labels
- PDF btn: "PDF파일 직접 올리기"
- Design btn: "에디터로 디자인하기"
- Cart btn: "장바구니 담기"

### Figma Nodes
- PDF btn: `1661:221` (Rectangle 4722, 465×50, fill white, stroke #553886)
- Design btn: `1661:222` (Rectangle 4723, 465×50, fill #553886)
- Cart btn: `1661:543` (Rectangle 4908, 465×50, fill #553886)
- PDF text: `1661:223` (PDF파일 직접 올리기)
- Design text: `1661:224` (에디터로 디자인하기)
- Cart text: `1661:544` (장바구니 담기)

---

## Quick Reference: SelectBox Implementation (RULE-1 Compliant)

`PaperDropdown`과 `FinishSelect` 모두 공유 컴포넌트 `HuniCustomSelect`를 사용:

```tsx
// src/components/ui/huni-select.tsx — 표준 드롭다운 (RULE-1 준수)
import { HuniCustomSelect, type HuniSelectOption } from '@/components/ui/huni-select';

// 사용 예 (PaperDropdown: 348px)
<HuniCustomSelect
  options={selectOptions}
  value={value}
  onChange={handleChange}
  placeholder="지질을 선택하세요"
  disabled={disabled}
  ariaLabel="지질 선택"
  className="w-[348px]"
/>

// 사용 예 (FinishSelect: 461px)
<HuniCustomSelect
  options={parentOptions}
  value={selectedParent ?? undefined}
  onChange={handleParentChange}
  placeholder="선택하세요"
  disabled={disabled}
  ariaLabel={parentLabel}
  className="w-[461px]"
/>
```

`HuniCustomSelect` 핵심 특성:
- `▼` 텍스트 문자 사용 (Lucide icon 금지)
- `useEffect` 외부 클릭 감지 + cleanup
- `h-[50px]` 고정 높이
- 키보드 접근성 (Escape/Enter/Space)
- `recommended?: true` badge 지원

---

## v4.1.0 신규 컴포넌트 (SPEC-DS-003, 2026-03-05)

### BadgeLabel (`src/components/quote/BadgeLabel.tsx`)

**Text Label 배지 4종** (variant: `text-label`, 기본):

| badge | 색상 | 용도 |
|---|---|---|
| 추천 | `bg-[#5538B6] text-white` | 옵션 추천 표시 |
| BEST | `bg-[#3B2573] text-white` | 인기 상품/옵션 |
| NEW | `bg-[#FF1493] text-white` | 신규 옵션 |
| UP | `bg-[#00BCD4] text-white` | 업그레이드 옵션 |

**Layer Menu Label 배지 4종** (variant: `layer-menu`):

| badge | 색상 | 용도 |
|---|---|---|
| BEST | Purple outline `#5538B6` | 카테고리 인기 표시 |
| NEW | Gold outline `#DAA520` | 신규 카테고리 |
| UP | Mint outline `#00BCD4` | 업그레이드 카테고리 |
| DESIGN | Orange outline `#FF5722` | 디자인 카테고리 |

```tsx
// Text Label 배지
<BadgeLabel badge="추천" />
<BadgeLabel badge="NEW" variant="text-label" />

// Layer Menu 배지
<BadgeLabel badge="BEST" variant="layer-menu" />
```

---

### CalloutPopover (`src/components/quote/CalloutPopover.tsx`)

정보 아이콘(i circle, Figma node 1746:553) + 텍스트 메시지 + hover 팝업 또는 navigate 인터랙션.

**hover-popup 모드** (기본): Radix UI Tooltip 기반
**navigate 모드**: 클릭 시 router.push(url)

```tsx
// hover-popup 모드
<CalloutPopover
  message="3개의 체크항목 완료되었습니다"
  interaction="hover-popup"
  popupContent={{ imageUrl: "/images/guide.jpg", text: "코팅 종류 안내" }}
  position="top"
/>

// navigate 모드
<CalloutPopover
  message="자세히 보기"
  interaction="navigate"
  navigateUrl="/guide/coating"
/>
```

색상: Primary `#5538B6` (아이콘, 텍스트)

---

### ColorChip 확장 (v4.1.0 - `src/components/quote/ColorChip.tsx`)

기존 하위호환 유지 + 3가지 렌더 모드 추가:

**mode: `color-swatch`** (기본): hex 색상 기반 50×50px 원형
**mode: `image-thumbnail`**: URL 기반 이미지 썸네일, 이미지 로드 실패 시 fallback
**mode: `color-with-label`**: 색상 칩 + 텍스트 라벨 (박 종류 등)

**그룹 표시** (`groups` prop):
```tsx
<ColorChip
  options={options}
  selectedValue={val}
  onChange={setVal}
  groupLabel="박 종류"
  mode="color-with-label"
  groups={[
    { label: "표준 컬러", items: standardItems },
    { label: "효과 컬러", items: effectItems },
  ]}
/>
```

**다중 선택** (`multiSelect` prop):
```tsx
<ColorChip
  options={options}
  selectedValue={null}
  onChange={() => {}}
  groupLabel="후가공 선택"
  multiSelect
  selectedValues={selectedVals}
  onMultiChange={setSelectedVals}
/>
```

---

### ImageOptionSelector (`src/components/quote/ImageOptionSelector.tsx`)

64×64px 원형 이미지 썸네일 그리드.
- 선택 상태: `ring-2 ring-[#5538B6] ring-offset-1`
- 이미지 로드 실패 시 fallback placeholder 자동 표시

```tsx
<ImageOptionSelector
  images={[
    { value: 1, label: "탈장", imageUrl: "/images/dejang.jpg" },
    { value: 2, label: "누드", imageUrl: "/images/nude.jpg" },
  ]}
  selectionMode="single"
  shape="circle"
  selectedValue={val}
  onChange={setVal}
/>
```

**selectionMode**: `single`(radio) | `multi`(checkbox)
**shape**: `circle` | `rounded`
**size**: `default`(64px) | `large`(80px)

---

### PageCounterInput (`src/components/quote/PageCounterInput.tsx`)

책자류 내지 페이지 수 선택기. `< 1 2 3 >` 형태 페이지네이션.

- 선택 상태: `ring-2 ring-[#5538B6]`
- Hover 상태: `hover:bg-gray-100`
- order-simulator-store `pagecnt` 연동

```tsx
// pagination 모드 (기본)
<PageCounterInput
  min={8}
  max={500}
  step={4}
  value={pagecnt || 8}
  onChange={setPagecnt}
/>

// stepper 모드
<PageCounterInput
  min={8}
  max={500}
  step={4}
  value={pagecnt}
  onChange={setPagecnt}
  displayMode="stepper"
/>
```

---

### QtySlider 확장 (v4.1.0)

기존 하위호환 유지 + `priceDisplay` optional prop 추가:

```tsx
<QtySlider
  value={qty}
  onChange={setQty}
  priceDisplay={{ price: 3200, unit: "set" }}
/>
// 표시: "현 구간최소가격 3,200 +/set"
```

---

Version: 1.0.0 | Source: Figma REST API (2026-03-05) | Node: 1661:132
