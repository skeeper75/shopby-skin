---
name: huni-design-system
description: >
  Huni Printing (후니프린팅) design system specification for the product option UI.
  Covers ALL sections from both Figma pages (option_New + Component/디자인시스템) extracted
  via Figma REST API with exact pixel measurements, colors, and typography.
  Includes design tokens, component catalog (14 components), critical implementation rules,
  zone-based layout analysis, and .pen file references for all 26 sections.
  v4.0.0: Full Figma page exploration complete — option_New (12 sections) + Component (14 sections).
  v4.1.0: SPEC-DS-003 신규 컴포넌트 추가 — BadgeLabel, CalloutPopover, ImageOptionSelector, PageCounterInput, ColorChip 3-mode, QtySlider priceDisplay.
  v4.1.0: Figma text 42개 검증 보정 적용 — 별색인쇄(클리어), 링컬러/링선택, 형압(양각/음각), 박,형압 가공 외 다수.
license: MIT
compatibility: Designed for Claude Code
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
user-invocable: false
metadata:
  version: "5.0.0"
  category: "domain"
  status: "active"
  updated: "2026-03-10"
  modularized: "true"
  figma-file: "gEJhQRtmKI66BPhOpqoW3j"
  figma-page-option-new: "option_New (1647:128)"
  figma-page-component: "Component/디자인시스템 (1655:105)"
  figma-overview-node: "1661:132"
  pen-files-dir: ".claude/skills/huni-design-system/pen-files/"
  tags: "huni, printing, design-system, option-group, figma, product-ui, select-box, counter, color-chip, typography, button, checkbox, radio, tab, slider"
  related-skills: "moai-design-tools, moai-domain-uiux, moai-domain-frontend, moai-library-shadcn"
  bundled-references: "components.md, references/tailwind-tokens.md, references/figma-api.md, references/cva-patterns.md, references/radix-integration.md, references/component-composition.md"
  bundled-examples: "examples/new-component-template.md"
  bundled-scripts: "scripts/verify-design-tokens.sh"

# MoAI Extension: Progressive Disclosure
progressive_disclosure:
  enabled: true
  level1_tokens: 120
  level2_tokens: 6000

# MoAI Extension: Triggers
triggers:
  keywords: ["후니프린팅", "huni", "option group", "OptionGroup", "option_New", "인쇄 옵션", "CounterInput", "FinishSelect", "PaperDropdown", "ColorChip", "FinishButton", "FinishInput", "OptionButton", "디자인시스템", "design token", "SelectBox", "드롭다운", "cva", "radix", "shadcn", "compound component", "forwardRef", "asChild", "variant", "typography", "color palette", "noto sans", "button", "checkbox", "radio button", "tab", "slider", "text field", "label", "callout", "페이지카운터"]
  agents: ["expert-frontend", "team-designer", "manager-spec"]
  phases: ["plan", "run"]
---

# Huni Printing Design System v4.1.0

Verified via Figma REST API — **ALL sections** from both Figma pages explored.
- **option_New page** (1647:128): 12 sections including OVERVIEW + 11 product page variants
- **Component/디자인시스템 page** (1655:105): 14 component sections (Logo, Color Palette, Typography, 11 UI components)

Figma file key: `gEJhQRtmKI66BPhOpqoW3j`
Access Token: `FIGMA_ACCESS_TOKEN` environment variable

---

## Figma Page Node Map (v4.0.0 — Full Exploration)

### option_New Page (1647:128)

| Section Name | Node ID | Size (px) | Scale | .pen File |
|---|---|---|---|---|
| OVERVIEW | `1661:132` | 2158×4735 | 4× | *(see v3.0.0)* |
| PRODUCT_PRINT_OPTION | `1647:129` | 2158×5504 | 4× | `option-new/product-print.pen` |
| PRODUCT_BOOK_OPTION | `1647:525` | 2158×5504 | 4× | `option-new/product-book.pen` |
| PRODUCT_STICKER_OPTION | `1647:1596` | 2158×5504 | 4× | `option-new/product-sticker.pen` |
| PRODUCT_PHOTOBOOK_OPTION | `1647:929` | 2158×5504 | 4× | `option-new/product-photobook.pen` |
| PRODUCT_CALENDAR_OPTION | `1647:1033` | 2158×5504 | 4× | `option-new/product-calendar.pen` |
| PRODUCT_DESIGN CALENDAR_OPTION | `1647:1165` | 2158×5504 | 4× | `option-new/product-design-calendar.pen` |
| PRODUCT_ACCESSORIES_OPTION | `1647:1271` | 2158×5504 | 4× | `option-new/product-accessories.pen` |
| PRODUCT_ARRYLIC_OPTION | `1647:1346` | 2158×5504 | 4× | `option-new/product-acrylic.pen` |
| PRODUCT_SIGN POSTER_OPTION | `1647:1487` | 2158×5504 | 4× | `option-new/product-sign-poster.pen` |
| PRODUCT_STAITIONERY_OPTION | `1647:810` | 2158×5504 | 4× | `option-new/product-stationery.pen` |
| PRODUCT_GOODS_OPTION | `1647:1732` | 2158×5504 | 4× | `option-new/product-goods.pen` |

### Component/디자인시스템 Page (1655:105)

| Section Name | Node ID | Size (px) | Scale | .pen File |
|---|---|---|---|---|
| Logo | `1745:3` | 936×1164 | 4× | `component/logo.pen` |
| Color Palette | `1745:2` | 936×1164 | 4× | `component/color-palette.pen` ✅ |
| Typography | `1745:142` | 936×1164 | 4× | `component/typography.pen` ✅ |
| Icon | `1746:568` | 936×1164 | 4× | `component/icon.pen` |
| Text Button | `1746:345` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Check box | `1746:414` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Radio button | `1746:448` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Select box | `1746:456` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Slider | `1746:467` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Tab | `1746:488` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Text fields | `1746:497` | 936×1164 | 4× | `component/ui-components.pen` ✅ |
| Page Counter | `1748:278` | 936×1164 | 4× | `component/ui-components.pen` |
| Label | `1746:518` | 936×1164 | 4× | `component/label-callout.pen` |
| Callout | `1746:553` | 936×1164 | 4× | `component/label-callout.pen` |

> All sections are > 200,000 px² → **4× scale** applied per FR-008.

---

## Design Tokens (Figma REST API — v4.0.0 Verified)

### Color Palette (Component page node 1745:2)

**Purple Family (Primary Brand)**

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `primary` | `#5538B6` | rgb(85, 56, 182) | Selected state, CTA buttons, price amount, active tab |
| `primary-dark` | `#351D87` | rgb(53, 29, 135) | Dark CTA, cart button background |
| `primary-secondary` | `#9580D9` | rgb(149, 128, 217) | Hover states, secondary accent |
| `primary-light-1` | `#C9C2DF` | rgb(201, 194, 223) | Light purple backgrounds |
| `primary-light-2` | `#DED7F4` | rgb(222, 215, 244) | Very light purple, tint |
| `primary-light-3` | `#EEEBF9` | rgb(238, 235, 249) | Hover background overlay |

**Neutral/Gray Family**

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `text-dark` | `#424242` | rgb(66, 66, 66) | Section labels, primary text |
| `text-medium` | `#565656` | rgb(86, 86, 86) | Body text |
| `text-muted` | `#979797` | rgb(151, 151, 151) | Unselected button text, placeholders |
| `border-default` | `#CACACA` | rgb(202, 202, 202) | Default borders, unchecked states |
| `bg-light` | `#E9E9E9` | rgb(233, 233, 233) | Light backgrounds |
| `bg-section` | `#F6F6F6` | rgb(246, 246, 246) | FinishTitleBar background, sections |
| `bg-white` | `#FFFFFF` | rgb(255, 255, 255) | Card backgrounds, button fill |

**Accent Colors**

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `accent-gold` | `#E6B93F` | rgb(230, 185, 63) | Gold badge, highlight accent |
| `accent-teal` | `#7AC8C4` | rgb(122, 200, 196) | Teal accent (secondary CTA) |
| `badge-highlight` | `#EE00CE` | rgb(238, 0, 206) | "main color" marker (design annotation only) |

### Typography (Component page node 1745:142)

**Font Family:** Noto Sans ONLY — Regular (400), Medium (500), SemiBold (600)
**Letter Spacing:** `-5%` applied universally (letterSpacing = fontSize × -0.05)

| Role | Font | Size | Weight | Letter Spacing | Color |
|------|------|------|--------|----------------|-------|
| Heading H1 | Noto Sans Bold | 36pt | 600 | -1.8px | `#424242` or `#5538B6` |
| Heading H2 | Noto Sans Bold | 24pt | 600 | -1.2px | `#424242` or `#5538B6` |
| Body SemiBold | Noto Sans SemiBold | 16pt | 600 | -0.8px | `#424242` or `#5538B6` |
| Body Regular | Noto Sans Regular | 14pt | 400 | -0.7px | `#424242` or `#979797` |
| Body Medium | Noto Sans Medium | 14pt | 500 | -0.7px | `#424242` or `#5538B6` |
| Caption | Noto Sans Regular | 14pt | 400 | -0.7px | `#F6F6F6` or `#FFFFFF` |
| Button/UI | Noto Sans SemiBold | 16pt | 600 | -0.8px | `#FFFFFF` (on color bg) |

> **[CRITICAL] Font Rule:** Noto Sans ONLY. `#000000` allowed, `#FFFFFF` only with colored background. Color fonts (`#FF00FF` etc.) MUST NOT be used for content text.
> **[CRITICAL] Allowed text colors:** `#424242`, `#5538B6`, `#979797`, `#FFFFFF` (bg required), `#F6F6F6` (bg required)

### Spacing & Radius

| Property | Value |
|----------|-------|
| Section horizontal padding | 20px |
| Button grid columns | 3 |
| Button grid gap | 0px (no gap, border-adjacency) |
| Component border radius | 4px |
| CTA button border radius | 5px |
| Divider height | 1px |
| Section label height | 40px |

---

## Critical Rules

### [RULE-1] SelectBox: MUST NOT Use Native `<select>`

The Figma design renders the dropdown caret (▼) as a **custom text node** overlaid on a rectangle.
Native `<select>` cannot be styled consistently cross-browser and violates the design spec.

**Wrong implementation:**
```tsx
// ❌ FORBIDDEN — native select does not match Figma spec
<select value={value} onChange={...}>
  <option>몽블랑 190g</option>
</select>
```

**Correct implementation:**
```tsx
// ✅ CORRECT — custom div-based dropdown
<div className="relative w-[348px] h-[50px] border border-[#CACACA] rounded-[4px] bg-white cursor-pointer"
     onClick={() => setOpen(!open)}>
  <span className="absolute left-4 top-[11px] text-sm text-[#424242] font-[Noto_Sans]">
    {selectedLabel}
  </span>
  <span className="absolute right-4 top-[11px] text-xs text-[#979797]">▼</span>
  {open && (
    <ul className="absolute top-full left-0 right-0 z-50 border border-[#CACACA] bg-white rounded-b-[4px] shadow-md">
      {options.map(opt => (
        <li key={opt.value} className="px-4 py-2 text-sm hover:bg-[#F5F5F5]"
            onClick={() => { setValue(opt.value); setOpen(false); }}>
          {opt.label}
        </li>
      ))}
    </ul>
  )}
</div>
```

**Files that currently violate this rule (need fix):**
- `src/components/quote/FinishSelect.tsx` — uses native `<select>` (lines 82, 106)
- `src/components/quote/PaperDropdown.tsx` — uses native `<select>` (line 46)

### [RULE-2] Selected State = White Background + Colored Border

**Wrong:** Fill with colored background (#EEE8FF)
**Correct:** White fill (#FFFFFF) + #553886 stroke (width=2)

```tsx
// Selected state
fill: '#FFFFFF', stroke: '#553886', strokeWidth: 2
// Default state
fill: '#FFFFFF', stroke: '#CACACA', strokeWidth: 1
```

### [RULE-3] CounterInput: Rectangular 3-Part Layout

Native number inputs or circular buttons are NOT acceptable.
Structure: `[34px minus] [155px center] [34px plus]` — all 50px tall with #CACACA dividers.

Existing correct implementation: `src/components/quote/CounterInput.tsx`

### [RULE-4] Color Chip: 50×50 Ellipse

Color chips must be 50×50px ellipse (circle). NOT 32×32 or other sizes.
Selected state: white fill + #553886 stroke width=2.

### [RULE-5] Dynamic Data: MUST NOT Hardcode Option Labels

All option labels, values, and structures MUST be loaded from DB/API and rendered dynamically.
Components MUST NOT contain hardcoded Korean text for option labels.

**Wrong implementation:**
```tsx
// ❌ FORBIDDEN — hardcoded option labels
<OptionButton>무광코팅(단면)</OptionButton>
<OptionButton>유광코팅(양면)</OptionButton>
```

**Correct implementation:**
```tsx
// ✅ CORRECT — dynamic rendering from API data
{options.map(opt => (
  <OptionButton key={opt.id} selected={selected === opt.id}>
    {opt.label}
  </OptionButton>
))}
```

**Data source hierarchy:**
1. Option Schema API (`/api/huni/options/{productId}`)
2. Zustand store (`useProductOptions()`)
3. Component props (labels from parent)
4. NEVER from JSX hardcoded text

---

## 4-Zone Layout Analysis (option_New → OVERVIEW Section)

The product option page (option_New) is divided into 4 functional zones:

### Zone 1 — Option Selection (사이즈 + 종이)

Figma nodes: 1661:114~1661:204, 1661:126~1661:143

| Component | Type | Dimensions | Notes |
|-----------|------|-----------|-------|
| 사이즈 label | Section label | 172×40px | Noto Sans 16px fw=500 #424242 |
| Size buttons | OptionGroupButtonType | 155×50px each | 3-column grid, 0 gap |
| 종이 label | Section label | 172×40px | same as above |
| Paper dropdown | OptionGroupSelectBoxType | 348×50px | **Custom caret, NOT native** |
| 추천 badge | Badge | 32×14px | fill #FF66CC, text white |

**Default button:** fill white, stroke #CACACA, text #979797
**Selected button:** fill white, stroke #553886 sw=2, text #553886

### Zone 2 — Quantity + Finish Header (제작수량 + 후가공)

Figma nodes: 1661:199~1661:215, 1661:337~1661:339, 1661:520~1661:523

| Component | Type | Dimensions | Notes |
|-----------|------|-----------|-------|
| 제작수량 label | Section label | 172×40px | |
| Counter | OptionGroupCountInputType | 223×50px total | 34+155+34 layout |
| 후가공 bar | OptionGroupFinishTitleBar | 466×50px | BG #F5F5F5 |
| 열기/닫기 toggle | Text button | — | fill #553886 |

**Counter layout breakdown:**
- Left button: 34×50px, shows `−`, Noto Sans 18px #424242
- Center: 155×50px, value text Noto Sans 14px fw=500 #979797
- Right button: 34×50px, shows `+`, Noto Sans 18px #424242
- Dividers: #CACACA 1px at x=34 and x=189

### Zone 3 — Finish Options (귀돌이 + 박크기 + 박칼라)

Figma nodes: 1661:358~1661:438, 1661:400~1661:482

| Component | Type | Dimensions | Notes |
|-----------|------|-----------|-------|
| 귀돌이 label | Section label | 172×50px | |
| Finish buttons | OptionGroupFinishButtonType | 116×50px each | 둥근모서리, 직각모서리 |
| 박(앞면) 크기 label | Section label | 172×40px | |
| Width input | OptionGroupFinishInputType | 140×50px | placeholder #CACACA |
| Height input | OptionGroupFinishInputType | 140×50px | "X" separator |
| Help text | — | — | Noto Sans 11px #979797 |
| 박(앞면) 칼라 label | Section label | 172×40px | |
| Color chips | OptionGroupFinishColorChipType | 50×50px ellipse | 8 chips |

**Color chip color mapping (opt_박_* groups):**
- 금유광: ~#D4AF37 (gold)
- 은유광: ~#C0C0C0 (silver)
- 적박: ~#CC1523 (red)
- 청박: ~#0099CC (blue)
- 먹유광: ~#1A1A1A (black)
- 홀로그램박: ~#E8E8E8 (light gray / holographic)
- 트윙클박: ~#CC66BB (pink/sparkle)
- 동박: ~#B87333 (copper)

### Zone 4 — Accessory Select + Summary + Upload (엽서봉투 + 합계 + 업로드)

Figma nodes: 1661:505~1661:548, 1661:202~1661:286, 1661:221~1661:544

| Component | Type | Dimensions | Notes |
|-----------|------|-----------|-------|
| 엽서봉투 label | Section label | 172×40px | |
| Envelope dropdown | OptionGroupFinishSelectBoxType | 461×50px | **Custom caret, NOT native** |
| Summary section | OptionGroupSummary | — | 인쇄비, 후가공, 추가상품 |
| 합계금액 | Price display | — | Noto Sans 24px fw=600 #553886 |
| PDF upload btn | OptionGroupUpload | 465×50px | fill white, stroke #553886, r=5 |
| Design editor btn | OptionGroupUpload | 465×50px | fill #553886, text white, r=5 |
| Cart btn | OptionGroupUpload | 465×50px | fill #3B2573, text white, r=5 |

---

## Component Catalog Summary (Updated 2026-03-05 - Gap Analysis Applied)

| Figma Name | Code File | Native Select? | Status |
|-----------|-----------|----------------|--------|
| OptionGroupButtonType | `OptionButton.tsx` | N/A | ✅ Fixed (155×50px, RULE-2, #979797 default text) |
| OptionGroupSelectBoxType | `PaperDropdown.tsx` | ✅ Custom | ✅ Fixed (HuniCustomSelect, ▼ text caret) |
| OptionGroupCountInputType | `CounterInput.tsx` | N/A | ✅ Fixed (223×50px, RULE-3 rectangular) |
| OptionGroupFinishTitleBar | `FinishTitleBar.tsx` | N/A | ✅ |
| OptionGroupFinishButtonType | `FinishButton.tsx` | N/A | ✅ Fixed (116×50px, RULE-2) |
| OptionGroupFinishInputType | `FinishInput.tsx` | N/A | ✅ |
| OptionGroupFinishColorChipType | `ColorChip.tsx` | N/A | ✅ Fixed (50×50px, RULE-4) |
| OptionGroupFinishSelectBoxType | `FinishSelect.tsx` | ✅ Custom | ✅ Fixed (HuniCustomSelect, 461×50px) |
| OptionGroupSummary | `PriceResult.tsx` | N/A | ✅ |
| OptionGroupUpload | `OrderCTA.tsx` | N/A | ✅ Fixed (465×50px, radius 5px) |

### Shared Component
- `src/components/ui/huni-select.tsx` — **HuniCustomSelect** (RULE-1 준수 표준 드롭다운)
  - PaperDropdown, FinishSelect 양쪽에서 재사용
  - ▼ 텍스트 문자 오버레이, native select 완전 제거

> For detailed per-component specs, see: `components.md`

---

## Gap Analysis Report (2026-03-05)

Figma REST API 스펙 대비 코드 감사 결과 발견된 갭 목록:

### Critical Fixes Applied
1. **Primary Color**: `#5538b6` → `#553886` (전체 컴포넌트, tailwind.config.ts, globals.css)
2. **Dark Color**: `#351D87` → `#3B2573` (Cart 버튼 다크 컬러)
3. **OptionButton**: `h-[46px]` → `h-[50px]`, `min-w-[80px]` → `w-[155px]`
4. **OptionButton RULE-2**: `bg-[#553886]` → `bg-white border-2 border-[#553886]` (선택 상태)
5. **OptionButton text**: default `text-[#424242]` → `text-[#979797]`
6. **PaperDropdown RULE-1**: native `<select>` → `HuniCustomSelect` + ▼ 텍스트
7. **PaperDropdown height**: `h-[40px]` → `h-[50px]` (HuniCustomSelect 내 처리)
8. **FinishSelect RULE-1**: native `<select>` × 2 → `HuniCustomSelect`
9. **CounterInput RULE-3**: 원형 `w-8 h-8 rounded-full` → 직사각형 `w-[34px] h-full` + divider
10. **CounterInput height**: `h-[40px]` → `h-[50px]`
11. **ColorChip RULE-4**: `h-8 w-8` (32px) → `h-[50px] w-[50px]`
12. **FinishButton RULE-2**: `bg-[#553886]` → `bg-white border-2 border-[#553886]`
13. **FinishButton size**: `min-w-[120px] h-[40px]` → `w-[116px] h-[50px]`
14. **FinishButton text**: default `text-[#424242]` → `text-[#979797]` 12px
15. **OrderCTA width**: `min-w-[300px]` → `w-[465px]`
16. **OrderCTA radius**: `rounded-[4px]` → `rounded-[5px]`
17. **CSS variables**: `--border` → `0 0% 79%` (#CACACA), `--primary` → `262 41% 37%` (#553886)
18. **FinishSelect width**: `w-full` → `w-[461px]` (엽서봉투 드롭다운)

---

## Figma Text Corrections (v4.1.0 - 42 Items Verified)

CRITICAL corrections that affect component option values:

| # | Section | Incorrect | Correct (Figma Verified) | Severity |
|---|---------|-----------|--------------------------|----------|
| 1 | 디지털인쇄 | 별색인쇄(글리터) | 별색인쇄 (클리어) | CRITICAL |
| 2 | 책자 | 탕찍이/탕짜이 | 링컬러 + 링선택 | CRITICAL |
| 3 | 디지털인쇄 | 형압: 앞면/뒷면/양면 | 형압: 양각/음각 | CRITICAL |
| 4 | 디지털인쇄 | 박 특판 가공 | 박,형압 가공 | MAJOR |
| 5 | 캘린더 | 칼라큰그 | 링컬러 | MAJOR |
| 6 | 캘린더 | 밸린더 가공 | 캘린더 가공 | MAJOR |
| 7 | 디자인캘린더 | 헤다티 | 페이지 | MAJOR |

**30+ MAJOR additions** (options not recorded in initial scan):
- 접지 (2단가로/3단가로/2단세로)
- 가변인쇄 (이미지/텍스트)
- 미싱
- 투명커버 (유광/무광/없음)
- 개별포장 (수축포장 500원)
- 삼각대 컬러
- 캘린더봉투, 캘린더 가공
- 볼체인 (아크릴, 굿즈)
- 링컬러 (책자, 캘린더, 문구)

> All option text MUST come from DB/API (RULE-5), not hardcoded.

---

## Implementation Reference

### Existing Components (source of truth for correct patterns)

```
src/components/quote/
├── OptionButton.tsx       — ButtonType (SPEC-UI-003 REQ-UI-003-M3-01) ✅
├── OptionGroup.tsx        — Group wrapper with section label ✅
├── CounterInput.tsx       — CountInputType (SPEC-UI-003 REQ-UI-003-M3-07) ✅
├── FinishTitleBar.tsx     — FinishTitleBar (열기/닫기 toggle) ✅
├── FinishButton.tsx       — FinishButtonType (귀돌이 variant) ✅
├── FinishInput.tsx        — FinishInputType (dimension mm input) ✅
├── ColorChip.tsx          — FinishColorChipType (50×50 ellipse) ✅
├── FinishSelect.tsx       — FinishSelectBoxType (HuniCustomSelect) ✅
├── PaperDropdown.tsx      — SelectBoxType (HuniCustomSelect) ✅
├── PriceResult.tsx        — Summary ✅
└── OrderCTA.tsx           — Upload/Design/Cart buttons ✅

src/components/ui/
└── huni-select.tsx        — HuniCustomSelect 공유 컴포넌트 (RULE-1 표준) ✅
```

### Figma Source Reference

- File: `gEJhQRtmKI66BPhOpqoW3j` (huni_product_option)
- Access Token: `FIGMA_ACCESS_TOKEN` env variable
- OVERVIEW Section: node `1661:132`
- REST API: `GET https://api.figma.com/v1/files/{key}/nodes?ids={nodeId}&depth=2`

---

## Component Architecture (shadcn/ui + Radix 스타일)

후니 디자인시스템은 3-레이어 아키텍처로 설계:

```
Layer 1: Figma 토큰 (불변)
  → Tailwind 클래스로 하드코딩 (w-[155px], h-[50px], #553886 등)
  → RULE-1~4 적용

Layer 2: cva variants (상태 기반 스타일링)
  → state: selected / default / disabled
  → variant: upload / design / cart (OrderCTA)
  → size: paper / finish (HuniSelect)

Layer 3: Radix primitives (접근성 + 행동)
  → @radix-ui/react-select → HuniCustomSelect
  → @radix-ui/react-toggle → OptionButton, FinishButton
  → @radix-ui/react-radio-group → ColorChip
  → @radix-ui/react-collapsible → FinishTitleBar
  → @radix-ui/react-slot → OrderCTA (asChild)
```

### 신규 컴포넌트 생성 순서
1. Figma REST API로 치수/색상 확인
2. `cva` variant 정의 (`references/cva-patterns.md` 참조)
3. Radix primitive 선택 (`references/radix-integration.md` 참조)
4. `forwardRef` + `displayName` 추가
5. 배럴 export
6. verify-design-tokens.sh에 검증 추가

---

## Component Page Catalog (v4.0.0 — New)

Component/디자인시스템 페이지의 14개 섹션 컴포넌트 스펙:

### Text Button (1746:345)

| Variant | Size | Fill | Border | Text |
|---------|------|------|--------|------|
| Primary Enabled | 252×48px | `#5538B6` | none | `#FFFFFF` 16px 600 |
| Primary Disabled | 252×48px | `#CACACA` | none | `#FFFFFF` 16px 600 |
| Outline (장바구니) | 252×48px | `#FFFFFF` | 1px `#5538B6` | `#5538B6` 16px 600 |
| Small Primary | 160×36px | `#5538B6` | none | `#FFFFFF` 14px 600 |
| Small Grey Outline | 160×36px | `#FFFFFF` | 1px `#CACACA` | `#424242` 13px 500 |

- States: Enabled / Hover / Disabled
- Korean CTAs: 결제하기, 장바구니 보내기, 편집수정하기, PDF파일 직접 올리기, 쿠폰적용

### Check box (1746:414)

| State | Fill | Border | Text |
|-------|------|--------|------|
| Checked | `#5538B6` | 2px `#5538B6` | `#424242` Noto Sans Bold 24pt |
| Unchecked | `#FFFFFF` | 2px `#CACACA` | `#424242` Noto Sans Bold 24pt |

- Size: 20×20px, cornerRadius: 3px

### Radio button (1746:448)

| State | Fill | Border |
|-------|------|--------|
| Selected | `#5538B6` | 2px `#5538B6` |
| Unselected | `#FFFFFF` | 2px `#CACACA` |

- Size: 20×20px ellipse
- Text: Noto Sans Bold 24pt `#424242`

### Select box — HuniCustomSelect (1746:456)

| State | Width | Height | Fill | Border |
|-------|-------|--------|------|--------|
| Closed | full | 44px | `#FFFFFF` | 1px `#CACACA` |
| Open | full | 44px | `#FFFFFF` | 1px `#5538B6` |

- Caret: `▼` text character, `#979797`, right-aligned
- Options: Listed below field on open, hover = `#F6F6F6` bg
- [RULE-1] MUST use HuniCustomSelect, NOT native `<select>`

### Slider (1746:467)

- Track: full width, height 4px, cornerRadius 2px
- Active track: `#5538B6` fill
- Inactive track: `#CACACA` fill
- Thumb: 16×16px ellipse, `#5538B6` fill
- Tick marks: 6 ellipses at 1/10/50/100/500/1000+
- Label: Noto Sans 11px `#979797`

### Tab (1746:488)

| State | Text Color | Indicator |
|-------|-----------|-----------|
| Active | `#5538B6` Bold | 2px bottom line `#5538B6` |
| Inactive | `#979797` | none |

- Tab labels: 차별성, 유의사항, 포장/배송, 상품리뷰
- Font: Noto Sans 14px letterSpacing -0.7px

### Text fields (1746:497)

| State | Border | Text Color |
|-------|--------|-----------|
| Default | 1px `#CACACA` | placeholder `#CACACA` |
| Active | 2px `#5538B6` | `#424242` |
| Disabled | 1px `#E9E9E9` | `#CACACA` |

- Size: full width × 44px height
- Padding: 12px horizontal
- Font: Noto Sans 14px

### Page Counter (1748:278)

Three-part layout: `[34px −] [155px value] [34px +]` — 50px tall
- [RULE-3] Rectangular buttons ONLY, no rounded circles
- Dividers: 1px `#CACACA` at x=34 and x=189

---

## Product Page Pattern (option_New — Common Structure)

All 11 product variant pages follow this layout pattern (from PRODUCT_PRINT_OPTION visual analysis):

```
Header: HuniPrinting logo + navigation
─────────────────────────────
Product Image (left)  │  Option Panel (right)
  + Thumbnail row     │  ├── 사이즈 (RadioGroup cards, selected = white+purple border)
                      │  ├── 지질/종이 (HuniCustomSelect dropdown)
                      │  ├── 인쇄방식 (RadioGroup tabs)
                      │  ├── 인쇄도수 (RadioGroup if applicable)
                      │  ├── 코팅/귀돌이/커팅 (RadioGroup variants)
                      │  ├── 제작수량 (CounterInput 3-part)
                      │  ├── [접기] 추가가공 section (FinishTitleBar collapse)
                      │  │    ├── 추가옵션 RadioGroups
                      │  │    └── 박/색상: ColorChip 50×50px circles
                      │  ├── [접기] 벽접 가로 (FinishTitleBar collapse)
                      │  │    └── 박칼라 ColorChips
                      │  ├── 봉합/인쇄수주 (price breakdown)
                      │  ├── 인쇄 합계: Noto Sans 24px 600 `#5538B6`
                      │  ├── PDF파일 직접 올리기 (outline button 465×50px)
                      │  └── 배대이용 다이렉터 (primary button 465×50px)
```

**Book variants additionally include:**
- 제책방향 (tab: 좌철/우철)
- 링컬러/링선택: Image-based ColorChip (원형 책 링 색상/종류 선택, selected = purple border)
- 내지/표지 구분 tab
- 내지 페이지 CounterInput with range display

---

## .pen File References

| File Path | Contents | Status |
|-----------|---------|--------|
| `pen-files/component/color-palette.pen` | 14 color swatches, 3 groups | ✅ Created |
| `pen-files/component/typography.pen` | 7 type styles, all weights | ✅ Created |
| `pen-files/component/ui-components.pen` | Button, Checkbox, Radio, Select, Tab, Slider, Field | ✅ Created |
| `pen-files/component/logo.pen` | HuniPrinting logo variants | Planned |
| `pen-files/component/label-callout.pen` | Label + Callout components | Planned |
| `pen-files/option-new/product-print.pen` | 디지털인쇄 product page | Planned |
| `pen-files/option-new/product-book.pen` | 책자 product page | Planned |

---

## Bundled Reference Files

Level 3 파일 — 필요 시 로드:

| 파일 | 용도 |
|---|---|
| `components.md` | 10개 컴포넌트 Figma 노드 + 치수 상세 스펙 |
| `references/tailwind-tokens.md` | Figma → Tailwind CSS 클래스 완전 매핑표 |
| `references/figma-api.md` | Figma REST API 노드맵 + 재동기화 가이드 (v4.0.0: 26섹션 전체 포함) |
| `references/cva-patterns.md` | 10개 컴포넌트 cva variant 정의 + VariantProps |
| `references/radix-integration.md` | Radix primitive 매핑 + 전체 재구현 코드 |
| `references/component-composition.md` | Compound, asChild, forwardRef, Context 패턴 |
| `examples/new-component-template.md` | 신규 컴포넌트 작성 단계별 템플릿 |
| `scripts/verify-design-tokens.sh` | 코드 → 디자인 토큰 검증 스크립트 |

### 검증 스크립트 실행

```bash
bash .claude/skills/huni-design-system/scripts/verify-design-tokens.sh
```

검증 항목:
- RULE-1: native `<select>` 없음 확인
- RULE-2: selected state bg-white + border-2 확인
- RULE-3: CounterInput 직사각형 버튼 확인
- RULE-4: ColorChip 50×50px 확인
- 색상: primary `#5538B6`, dark `#351D87` 정확성 검사
- 치수: 11개 컴포넌트 Figma 픽셀 치수 확인

---

---

## Critical Rules (SPEC-HUNI-014 확장 — v5.0.0)

### [RULE-5-EXT] PriceSlider: MUST Use @radix-ui/react-slider

SliderType 컴포넌트는 반드시 `@radix-ui/react-slider` primitive를 사용해야 함.

**Figma 스펙 (PriceSlider, SPEC-HUNI-014-B)**
- Track: 4px height, border-radius 2px
- Active track: `#5538B6`, Inactive: `#CACACA`
- Thumb: 16×16px ellipse, border-2 `#553886`
- Ticks: 최대 6개, positions: [1, 10, 50, 100, 500, 1000]
- Label: 11px, `#979797`
- `native input[type=range]` 사용 절대 금지

```tsx
// 올바른 구현 (RULE-5-EXT)
import * as Slider from '@radix-ui/react-slider';
<Slider.Root>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb />
</Slider.Root>
```

### [RULE-6-EXT] ImageChipType: 50×50px Ellipse

ImageChipType은 50×50px 원형 이미지 칩.

**Figma 스펙**
- 크기: 50×50px (w-[50px] h-[50px])
- 형태: ellipse (rounded-full)
- 선택 상태: ring-2 ring-[#553886] 또는 border-2 #553886
- 라벨: 11px #424242, 이미지 하단 표시
- 이미지 없으면 placeholder (bg-[#F5F5F5])

### [RULE-7-EXT] MiniColorChipType: 32×32px Ellipse

MiniColorChipType은 ColorChip(50px)보다 작은 32×32px 컬러 칩.

**Figma 스펙**
- 크기: 32×32px (w-8 h-8)
- 형태: ellipse (rounded-full)
- 선택 상태: ring-2 ring-[#553886]
- colorHex 배경색 사용
- **주의**: w-12 h-12(48px)와 혼동 금지 — 반드시 w-8 h-8

### [RULE-8-EXT] LargeColorChipType: Grid Layout 2행

LargeColorChipType은 grid 레이아웃으로 다수의 색상을 표시.

**Figma 스펙**
- 크기: 50×50px (w-[50px] h-[50px])
- 형태: ellipse (rounded-full) 또는 rounded-[4px]
- 레이아웃: grid-cols-5 (행당 최대 5~6개)
- 하드코딩된 색상 상한선 없음 — DB에서 동적 로드
- 선택 상태: ring-2 ring-[#553886]
- 색상명 라벨 하단 표시

---

## CTA Matrix (11 섹션 × 4 버튼 타입)

| 섹션 | PDF업로드 | 디자인주문 | 장바구니 | 견적문의 |
|------|---------|---------|--------|--------|
| 디지털인쇄 | O | O | O | X |
| 책자 | O | O | O | X |
| 스티커 | O | O | O | X |
| 포토북 | O | O | O | X |
| 캘린더 | O | O | O | X |
| 디자인캘린더 | X | O | O | X |
| 악세사리 | O | O | O | X |
| 아크릴 | O | O | O | 일부O |
| 실사/사인 | O | O | O | X |
| 문구 | O | O | O | X |
| 굿즈/파우치 | X | X | X | O |

---

## componentType 매핑 (14 타입 전체)

| componentType | 설명 | RULE | 구현 파일 |
|--------------|------|------|---------|
| ButtonType | 155×50px 직사각형 버튼 | RULE-2 | OptionButton.tsx |
| SelectBoxType | 드롭다운 선택 | RULE-1 | HuniCustomSelect |
| CounterInputType | 3-part 수량 입력 | RULE-3 | CounterInput.tsx |
| ColorChipType | 50×50px 원형 색상 칩 | RULE-4 | ColorChip.tsx |
| PriceSliderType | Radix 슬라이더 | RULE-5-EXT | PriceSlider.tsx |
| ImageChipType | 50×50px 원형 이미지 칩 | RULE-6-EXT | ImageChipType.tsx |
| MiniColorChipType | 32×32px 원형 색상 칩 | RULE-7-EXT | MiniColorChip.tsx |
| LargeColorChipType | 50×50px 그리드 색상 칩 | RULE-8-EXT | LargeColorChip.tsx |
| AreaInputType | 가로×세로 mm 입력 | — | HuniAreaOptions.tsx |
| PageCounterInputType | 페이지수 입력 | — | 책자/캘린더 |
| FinishButtonType | 116×50px 후가공 버튼 | RULE-2 | FinishButton.tsx |
| FinishSelectBoxType | 후가공 드롭다운 | RULE-1 | FinishSelect.tsx |
| SummaryType | 가격 요약 | — | PriceResult.tsx |
| UploadType | 파일 업로드 CTA | — | 파일업로드 버튼 |

---

## 디자인 토큰 파일

정적 디자인 토큰: `data/huni/design-tokens.json`

추출 스크립트: `scripts/huni/extract-design-tokens.ts` (FIGMA_ACCESS_TOKEN 필요)

상품 섹션 분석: `.claude/skills/huni-design-system/product-sections/01~11-*.md`

---

Version: 5.0.0
Source: Figma REST API verified (2026-03-10) — 42 text corrections applied + SPEC-HUNI-014 확장
Pages: option_New (1647:128) + Component/디자인시스템 (1655:105)
.pen Files: pen-files/component/ + pen-files/option-new/
Structure: SKILL.md + components.md + references/ + examples/ + scripts/ + pen-files/ + product-sections/
Architecture: 3-Layer (Figma tokens + cva variants + Radix primitives)
