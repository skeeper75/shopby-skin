---
name: innojini-huni-screen-guide
description: >
  Huni Printing screen design guide v2.0. Provides per-screen UI/UX specifications,
  shopby API mappings, component catalog, design templates, and admin UI patterns
  for 88 screens across 9 domain modules. Progressive Disclosure architecture.
  Use when implementing any screen from SPEC-SCREEN-001 or designing UI for huni printing,
  or when referencing screen types SCR-A* (shopping mall) or SCR-B* (admin).
user-invocable: true
allowed-tools: Read, Grep, Glob
metadata:
  version: "2.0.0"
  category: "domain"
  status: "active"
  updated: "2026-03-19"
  modularized: "true"
  tags: "huni, printing, screen, design, UI, UX, shopby, plugin"

# MoAI Extension: Progressive Disclosure
progressive_disclosure:
  enabled: true
  level1_tokens: 100
  level2_tokens: 3000

# MoAI Extension: Triggers
triggers:
  keywords: ["screen guide", "huni screen", "SCR-A", "SCR-B", "screen", "UI", "UX", "화면 설계", "화면 가이드"]
  agents: ["huni-screen-designer"]
---

# Huni Printing Screen Design Guide v2.0

When invoked, provide actionable screen design guidance: (1) Layout component, (2) shopby API, (3) UI pattern, (4) Benchmark reference, (5) Policy defaults.

## Reference Documents

- SPEC: `.moai/specs/SPEC-SCREEN-001/spec.md`
- Research: `.moai/specs/SPEC-SCREEN-001/research.md`
- Architecture: `.moai/specs/SPEC-SCREEN-001/skin-vs-headless-analysis.md`
- E-commerce patterns: `.moai/specs/SPEC-SCREEN-001/ecommerce-erp-screen-patterns.md`
- Admin analysis: `.moai/specs/SPEC-SCREEN-001/shopby-admin-screen-analysis.md`
- Admin screenshots: `.moai/temp/shopby-admin-screenshots/`
- Feature mapping: `ref/huni/feature-mapping.md`
- File processing: `ref/huni/huni-file-processing.md`

---

## Architecture Decision

**Hybrid strategy confirmed** (weighted score: 7.55/10):
- Aurora Skin for NATIVE/SKIN features (60 screens)
- CUSTOM independent modules for printing-specific features (25+ screens)
- CSS `!important` conflicts: only 7 instances in 2 files (manageable)
- Exit strategy: Re-evaluate at launch+6 months based on SEO data

---

## Excluded Features (Gray Cells - 25 items)

These features are OUT OF SCOPE. Do not design screens for them:

**Shopping Mall (16):**
OptionStorage, ProductQA(MyPage), ExperienceTeam(MyPage), BulkQuote, CorporateConsult, DesignConsult, DesignRequest, WorkGuide(11), Landing(5), ReviewMain, ExperienceTeamRecruit, PrintProduct(4types), Packaging, Goods, Handmade

**Admin (9):**
VendorMgmt, VendorBoard, AccountMgmt, LedgerMgmt, Receivables, BulkQuoteAdmin, CorporateConsultAdmin, DesignConsultAdmin, ProductQAAdmin

**Remaining scope: 88 features**

---

## Policy Defaults (Use for Design - Don't Wait for Decisions)

### Shipping
- Free shipping: orders over 100,000 KRW
- Base shipping fee: 3,000 KRW
- Jeju surcharge: +5,000 KRW
- Remote area: +3,000~10,000 KRW

### Payment
- PG: Inicis (existing contract)
- Simple pay: KakaoPay + NaverPay + TossPay (phased rollout)
- Installment: Interest-free 3/6/12 months

### Coupons
- New member: 10,000 KRW coupon (min order 50,000)
- Review: 5,000 KRW coupon (auto-issue on delivery+14days)
- Re-purchase: 20,000 KRW (monthly 200,000+ spenders)
- VIP: 30,000 KRW (annual 1,000,000+)
- Max simultaneous: 3 coupons / Validity: 30 days

### Reviews
- Display: Instant (no admin approval)
- Reward: 5,000 KRW coupon
- Photo review bonus: +1,000~2,000 KRW
- On delete: Auto-revoke coupon

### Member Grades
- 4 tiers recommended (based on 3-month purchase amount)

---

## Screen Inventory Index (88 features)

### A. Shopping Mall Screens (38)

| ID | Domain | Key Screens | Type | Module |
|----|--------|-------------|------|--------|
| SCR-A1 | Login | Login, FindID, FindPW, SNS Login(Kakao/Naver) | NATIVE | modules/login-signup.md |
| SCR-A2 | SignUp | Terms, InfoInput, PhoneAuth, Welcome, GuestOrder | NATIVE+EXT | modules/login-signup.md |
| SCR-A3 | MyPage | Orders, CouponMgmt, PrintingMoney, MyReview, Inquiry, MemberEdit, Receipts | SKIN+CUSTOM | modules/mypage.md |
| SCR-A4 | CS | Notice, FAQ, GuestOrderLookup | NATIVE | modules/customer-center.md |
| SCR-A5 | Payment | Inicis PG, ManualCardPayment(3rd priority) | EXTERNAL | modules/order-checkout.md |
| SCR-A6 | Order | FileUpload, Cart, ShippingInfo, AddressList, Payment, OrderComplete | CUSTOM+NATIVE | modules/order-checkout.md |
| SCR-A7 | Info | About, Terms, Privacy, Directions | NATIVE+SKIN | modules/info-guide.md |
| SCR-A8 | Guides | (skin-customized info pages) | SKIN | modules/info-guide.md |
| SCR-A9 | Marketing | (no items after gray exclusion) | - | modules/product-catalog.md |
| SCR-A10 | Product | Main, SubMain, ProductList, ProductDetail(options) | SKIN/CUSTOM | modules/product-catalog.md |

### B. Admin Screens (50)

| ID | Domain | Key Screens | Type | Module |
|----|--------|-------------|------|--------|
| SCR-B1 | Admin | AdminRegister/Management | NATIVE | modules/admin-management.md |
| SCR-B2 | Vendor | (excluded - gray cells) | CUSTOM | modules/admin-management.md |
| SCR-B3 | Accounting | (excluded - gray cells) | CUSTOM | modules/admin-management.md |
| SCR-B4 | Product | PrintRegister, SizePopup/Mgmt, PricePopup(8), GoodsCategory, GoodsRegister | CUSTOM+SKIN | modules/admin-product-board.md |
| SCR-B5 | Board | NoticeMgmt, FAQMgmt, InquiryMgmt, ReviewMgmt | NATIVE+CUSTOM | modules/admin-product-board.md |
| SCR-B6 | Member | MemberMgmt, WithdrawnMember, PrintingMoneyMgmt, CouponMgmt(3) | NATIVE+SKIN | modules/admin-product-board.md |
| SCR-B7 | Stats | Print/BindingStats, GoodsStats, MonthlySales, Settlement, TeamStats | SKIN+CUSTOM | modules/admin-order-stats.md |
| SCR-B8 | Order | PrintOrder, BindingOrder, FileCheck, ReuploadRequest, StatusChange, SMS | SKIN+CUSTOM | modules/admin-order-stats.md |
| SCR-B9 | Printing | FileValidation, PrintJob, QualityCheck, Outsource | CUSTOM | modules/admin-order-stats.md |

---

## Design System Summary

### Layout Components

| Component | Usage | Props |
|-----------|-------|-------|
| `PageShell` | All customer pages | maxWidth(4xl-7xl), padding(responsive) |
| `ResponsiveGrid` | Card/list grids | cols.mobile/tablet/desktop |
| `SplitLayout` | Product detail, MyPage | main 8/12 + aside 4/12 |
| `FormLayout` | All input forms | Responsive auto-alignment |
| `AdminLayout` | All admin pages | Sidebar + Header + Content |

### Page Type to Layout Mapping

| Type | maxWidth | Layout | Example |
|------|----------|--------|---------|
| Main/Catalog | 7xl | PageShell | Main, ProductList |
| Product Detail | 7xl | SplitLayout | PrintProduct |
| Order/Cart | 5xl | SplitLayout | Cart, OrderSheet |
| Form Pages | 4xl | FormLayout | MemberEdit |
| Auth Pages | sm/md | PageShell (centered) | Login, SignUp |
| Admin | full | AdminLayout+sidebar | All B-* |

Breakpoints: sm(640px) / md(768px) / lg(1024px) / xl(1280px)

---

## Common Design Patterns Index

Detailed patterns are in respective modules:

1. **Product Configurator (Step Wizard)** - SCR-A10 → modules/product-catalog.md
   - Flow: Size > PrintMode > Paper > Coating/Finishing > Quantity > Extras
2. **File Upload (Dropzone + Validation)** - SCR-A6 → modules/order-checkout.md
   - States: STAT_010 > STAT_030 > STAT_050 / STAT_900(error)
3. **Order Tracker (8-step Timeline)** - SCR-A3, SCR-B8 → modules/mypage.md, modules/admin-order-stats.md
   - Steps: Received > FileReview > PrintPrep > Printing > PostProcess > Packaging > Shipped > Delivered
4. **Price Calculator** - SCR-A10 → modules/product-catalog.md
   - Key: Baymard - 86% dissatisfaction without unit price
5. **Admin DataTable** - SCR-B4~B8 → modules/admin-product-board.md, modules/admin-order-stats.md
   - Pattern: Filter > StatusTabs > ActionBar > DataTable > Pagination
6. **Admin Screen Layout (shopby pattern)** → modules/admin-management.md
   - Moved to modules: FilterSection, ResultSection, DetailPanel specs

---

## Module Reference

| Module | Domain | Description |
|--------|--------|-------------|
| modules/login-signup.md | A1, A2 | 로그인/회원가입 화면 (6 screens) |
| modules/mypage.md | A3 | 마이페이지 화면 (16 screens) |
| modules/customer-center.md | A4 | 고객센터 화면 (7 screens) |
| modules/order-checkout.md | A5, A6 | 주문/결제/파일업로드 화면 (7 screens) |
| modules/info-guide.md | A7, A8 | 정보/가이드 화면 (15 screens) |
| modules/product-catalog.md | A9, A10 | 마케팅/상품 화면 (18 screens) |
| modules/admin-management.md | B1-B3 | 관리자/어드민 공통 패턴 (7 screens) |
| modules/admin-product-board.md | B4-B6 | 상품/게시판/회원 관리 (33 screens) |
| modules/admin-order-stats.md | B7-B9 | 통계/주문관리/인쇄특화 (22 screens) |

---

## Additional Resources

- `reference.md`: Component catalog + shopby API details + Design tokens
- `templates/`: 4 screen design templates (NATIVE/SKIN/CUSTOM/Admin)
- `examples/`: 2 complete examples (PrintProduct XL, Admin PrintOrder XL)

---

## Benchmark Quick Reference

| Site | Pattern |
|------|---------|
| Wowpress | Option structure, same-day badge |
| Redprinting | Real-time price, delivery date |
| Bizhows | Miricanvas editor, design-first |
| Vistaprint | Step Wizard, bulk discounts |
| MOO | Asset library, 3-hour edit window, 1-click reorder |
| Canva Print | Editor integration, hybrid flow |
| Coupang | Order tracking, MyPage dashboard |
| Musinsa/29CM | Clean UI, modern layout |
| cafe24/GodomAll | Admin panel patterns |

---

## Usage

- `/innojini-huni-screen-guide SCR-A1` - Login screen guide
- `/innojini-huni-screen-guide SCR-A6` - Order/file upload screen
- `/innojini-huni-screen-guide SCR-B4` - Admin product management
- `/innojini-huni-screen-guide admin pattern` - Admin common UI pattern (see modules/admin-management.md)
- `/innojini-huni-screen-guide policy` - Policy defaults for design
- `/innojini-huni-screen-guide shopby api` - shopby API reference (see reference.md)
