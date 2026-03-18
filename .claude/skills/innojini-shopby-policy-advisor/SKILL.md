---
name: innojini-shopby-policy-advisor
description: |
  shopby Enterprise 기반 후니프린팅 사이트 정책수립 자문 스킬.
  IA 기능별 shopby Native/Skin Custom/Custom Dev 분류, 업계 벤치마크,
  정책 결정 가이드라인을 제공하여 빠른 정책안 수립을 지원.
version: 1.0.0
triggers:
  - "정책"
  - "policy"
  - "shopby"
  - "인쇄사이트"
  - "후니프린팅"
  - "사이트정책"
  - "정책수립"
  - "정책 결정"
  - "shopby에서 되나요"
  - "커스텀 개발"
  - "네이티브"
  - "기능 분류"
tools:
  - Read
  - Grep
  - Glob
  - WebSearch
  - WebFetch
---

# shopby Policy Advisor for Huni Printing

Purpose: Provide policy consultation for Huni Printing site renewal based on shopby Enterprise platform capabilities, Korean printing industry benchmarks, and IA feature mapping.

## Core Knowledge Base

### Reference Files
- IA Feature Mapping: `ref/huni/feature-mapping.md`
- shopby Enterprise Docs: `ref/shopby/shopby_enterprise_docs/`
- shopby API Specs: `ref/shopby/shopby-api/`
- shopby API Docs: `ref/shopby/shopby-api-docs-complete/`
- Aurora React Skin Guide: `ref/shopby/aurora-react-skin-guide/`
- Huni IA Excel: `ref/huni/Huniprinting_Site.xlsx`

### Feature Classification System

When answering policy questions, classify each feature into one of four categories:

| Classification | Icon | Meaning | Action Required |
|---|---|---|---|
| shopby Native | NATIVE | Built-in, no development needed | Configure in shopby admin |
| Skin Custom | SKIN | API exists, needs custom UI/skin | Aurora React skin development |
| Custom Dev | CUSTOM | Not available in shopby | Full custom development required |
| External Integration | EXTERNAL | Requires 3rd party service | Service contract + integration |

### Feature Distribution Summary (95 features total)
- NATIVE: 38 features (40%) - Login, signup, coupon, boards, basic order management, SMS
- SKIN: 26 features (28%) - Printing money, business info, landing pages, order tracking UI
- CUSTOM: 29 features (31%) - Print option engine, file upload, design verification, B2B ledger
- EXTERNAL: 2 features (2%) - KCP authentication, PG payment

## Policy Domain Areas (13 domains)

### Domain 1: Member Policy
Scope: Signup, login, grades, groups, B2B members, withdrawal
Key decisions:
- SNS login providers (Kakao/Naver/Payco)
- Member grade tiers and benefits (industry: 3-4 tiers, 6-month cycle)
- B2B member group structure (individual/business/corporate)
- Signup required fields (business registration for B2B)
- Withdrawal data retention period

Industry benchmark (BizHows model):
- FAMILY (new) -> VIP (50K/2orders) -> VVIP (200K/5orders) -> SVIP (500K/10orders)
- Monthly auto-renewal based on 6-month purchase history

### Domain 2: Product & Option Policy
Scope: Print product options, pricing matrix, product categories
Key decisions:
- Option dependency tree: Paper type -> Thickness -> Size -> Quantity -> Finishing
- Price matrix structure (multi-dimensional: option combination -> price)
- Product categories: Digital print (4 types), Binding, Package, Goods, Handcraft
- Custom size input (standard vs non-standard)
- Delivery timeline calculation per option combination

shopby limitation: Basic options (color/size) only. Multi-level dependent options with dynamic pricing require CUSTOM engine.

### Domain 3: Order Workflow Policy
Scope: File upload, cart, payment, order completion, design request
Key decisions:
- File upload specs (formats: AI/PDF/PSD/CDR, CMYK, 300dpi+, bleed 3mm)
- Design editor solution (in-house vs external)
- Order status extension for printing workflow
- Option archive (saved print options for reorder)

shopby gap: No file attachment system, no design verification, no production tracking.

### Domain 4: Payment Policy
Scope: PG integration, printing money (points), B2B deferred payment
Key decisions:
- PG provider: KG Inicis (credit card, bank transfer, virtual account)
- Easy payment: Naver Pay, Kakao Pay, Toss Pay
- Printing money: Charge via PG -> Convert to points (shopby accumulation system)
- B2B deferred payment: Monthly settlement, credit limit management
- Manual card payment for offline orders

### Domain 5: Shipping Policy
Scope: Delivery methods, fees, production timeline
Key decisions:
- Free shipping threshold (industry: 50,000 KRW)
- Base shipping fee (industry: 3,000 KRW)
- Production timeline: Standard 1-3 days, with finishing 2-5 days
- Same-day shipping: Before 11:50 AM payment (no finishing)
- Express/quick service availability
- Remote area surcharge
- Peak season notice (Nov-Feb)

### Domain 6: Cancellation/Return Policy
Scope: Custom product cancellation rules, refund process
Key decisions:
- Pre-production cancellation: Allowed (within 1 hour of payment)
- Post-production start: Not cancellable (custom product)
- Print defect/error: Reprint or full refund (company fault)
- Customer file error: Customer bears reprint cost
- Simple change of mind: Not applicable (custom product)

Legal basis: E-commerce Act Article 17 - custom products exempt from 7-day return right with prior consent.

### Domain 7: Customer Service Policy
Scope: Inquiry types, SLA, communication channels
Key decisions:
- Inquiry categories: Order/Delivery, Payment/Refund, File/Design, B2B, General
- Response SLA by category
- Board types: Notice, FAQ, Product Q&A, Bulk order quote, Corporate printing, Design consultation
- Communication channels: 1:1 inquiry, phone, Kakao channel

### Domain 8: Marketing Policy
Scope: Coupons, reviews, experience program, landing pages
Key decisions:
- Coupon types: Welcome, grade-based, time-limited, event
- Review rewards: Text review points, photo review bonus
- Experience program: Recruitment cycle, selection criteria, review deadline
- Landing pages: 5 types (paper/binding/calendar/pouch/sticker)

### Domain 9: B2B Enterprise Policy
Scope: Corporate customers, bulk orders, quotes, dedicated service
Key decisions:
- B2B qualification criteria
- Deferred payment terms and credit limits
- Dedicated account manager assignment
- Bulk pricing discount structure
- Tax invoice automation
- Corporate-dedicated ordering site/portal

Industry benchmark (Kinko's B2B):
- Monthly consolidated settlement
- Nationwide center network
- One-stop corporate printing solution

### Domain 10: Admin & Operations Policy
Scope: Admin roles, permissions, operator management
Key decisions:
- Admin role hierarchy (super admin, manager, operator, viewer)
- Permission groups by menu access
- Audit logging requirements

### Domain 11: Vendor/Partner Policy
Scope: Vendor management, offline B2B, store bulletin
Key decisions:
- Vendor types: Print shop, design agency, delivery company
- Credit rating and trade terms
- Communication channel per vendor
- Partner settlement cycle

### Domain 12: Accounting Policy
Scope: Ledger, accounts, receivables
Key decisions:
- Account management scope
- Offline transaction recording
- Receivable tracking per vendor
- Overdue management and trade suspension criteria
- ERP integration requirements

### Domain 13: Statistics & Reporting Policy
Scope: Sales stats, production stats, team stats
Key decisions:
- Report types: Product/Period/Category sales, Monthly revenue
- Print-specific metrics: By paper type, size, finishing
- Team/department attribution rules
- Goods procurement/settlement reports
- Export format (Excel)

## Consultation Protocol

When a user asks a policy question:

1. IDENTIFY which domain(s) the question relates to
2. READ the feature-mapping.md for the specific features
3. CLASSIFY as NATIVE / SKIN / CUSTOM / EXTERNAL
4. PROVIDE:
   - What shopby offers natively (with specific admin menu path or API endpoint)
   - What needs skin customization (with Aurora React skin approach)
   - What needs custom development (with recommended architecture)
   - Industry benchmark from Korean printing sites
   - Policy decision checklist (what the user needs to decide)
5. FORMAT response as structured policy recommendation

## Response Template

```
### [Domain Name] Policy Consultation

**Feature**: [Feature name from IA]
**Classification**: [NATIVE | SKIN | CUSTOM | EXTERNAL]

**shopby Native Support**:
- [What's available out-of-the-box]
- Admin path: [shopby admin menu path]
- API: [relevant API endpoint]

**Custom Development Required**:
- [What needs to be built]
- Recommended approach: [architecture suggestion]

**Industry Benchmark**:
- [What major Korean printing sites do]

**Policy Decisions Needed**:
- [ ] Decision item 1
- [ ] Decision item 2
- [ ] Decision item 3

**Recommendation**: [Concrete recommendation based on analysis]
```

## Quick Reference: Top 10 Custom Development Items

1. Print option dependency engine (multi-level cascading options)
2. Dynamic price matrix calculator (option combination -> price)
3. File upload & verification workflow (format, resolution, bleed check)
4. Design editor integration (in-house or 3rd party)
5. Production status tracking (pre-print -> printing -> finishing -> QC -> ship)
6. Option archive (saved print configurations for reorder)
7. Printing money charging via PG
8. B2B deferred payment & receivables management
9. Experience program (recruitment -> selection -> review collection)
10. Offline transaction ledger management

## Quick Reference: shopby Admin Paths

| Feature | Admin Path |
|---------|-----------|
| Product registration | Product Management > Product Registration |
| Option setup | Product Registration > Sales Info > Options |
| Custom properties | Product Management > Custom Property Management |
| Order management | Order Management > All Orders |
| Member grades | Member Management > Grade Management |
| Member groups | Member Management > Group Management |
| Coupon management | Promotion > Coupon Management |
| Accumulation (Points) | Operations > Accumulation Settings |
| Board management | Operations > Board Management |
| 1:1 Inquiry | Operations > 1:1 Inquiry Management |
| SMS/Kakao | Operations > SMS/Kakao Notification |
| Statistics | Statistics > Sales/Member/Promotion |
| Terms & Policy | Service > Terms Management |
| Admin accounts | Service > Operator Management |
| Partner management | Partner > Partner Management |
