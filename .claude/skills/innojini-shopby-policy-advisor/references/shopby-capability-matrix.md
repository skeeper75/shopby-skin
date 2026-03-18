# shopby Enterprise Capability Matrix for Printing Business

Comprehensive mapping of shopby platform capabilities against printing business requirements.

## Platform Overview

- Platform: shopby Enterprise (NHN Commerce)
- Skin: Aurora React (open-source reference skin)
- API: 3-tier (Shop API / Admin API / Server API)
- Base URL: Shop API `https://shop-api.e-ncp.com`

## Module Capabilities

### Product Management
| Capability | Available | Notes |
|-----------|-----------|-------|
| Basic product CRUD | Yes | Full lifecycle management |
| Options (select/text) | Yes | Up to 5 select + 5 text options |
| Option pricing adjustment | Yes | +/- amount per option |
| Option-level inventory | Yes | SKU-level stock tracking |
| Custom properties | Yes | Up to 30 values per property |
| Bulk operations | Yes | Excel upload/download |
| Image management | Yes | Batch image management |
| Set products | Yes | Bundle product support |
| Recurring products | Yes | Subscription management |
| Multi-level dependent options | No | CRITICAL GAP for printing |
| Dynamic pricing matrix | No | CRITICAL GAP for printing |
| File attachment to product | No | CRITICAL GAP for printing |
| Design preview/template | No | CRITICAL GAP for printing |

### Order Management
| Capability | Available | Notes |
|-----------|-----------|-------|
| Full order lifecycle | Yes | Deposit -> Paid -> Preparing -> Shipped -> Delivered -> Confirmed |
| Guest orders | Yes | Non-member ordering |
| Manual orders | Yes | Admin-created orders (virtual account only) |
| Invoice batch upload | Yes | Delivery tracking |
| Delivery hold | Yes | Hold management |
| Reservation orders | Yes | Pre-order support |
| Cart operations | Yes | Full CRUD |
| Order sheet calculation | Yes | Price calculation API |
| File upload in order | No | CRITICAL GAP |
| Design verification step | No | CRITICAL GAP |
| Production status tracking | No | CRITICAL GAP |
| Revision request workflow | No | CRITICAL GAP |

### Payment
| Capability | Available | Notes |
|-----------|-----------|-------|
| Credit card | Yes | Installment support |
| PG systems | Yes | KGI, NICE, NHN KCP, DANAL |
| Easy payment | Yes | Naver Pay, Payco, Kakao Pay |
| Bank transfer | Yes | Deposit pending management |
| App card | Yes | In development |
| Points/accumulation | Yes | Earn, deduct, auto-settings |
| Member self-charge via PG | No | Custom development needed |
| B2B deferred payment | No | Custom development needed |
| Manual card payment (admin) | No | PG admin API direct integration needed |

### Member Management
| Capability | Available | Notes |
|-----------|-----------|-------|
| Member grades | Yes | Multi-tier with auto-upgrade |
| Member groups | Yes | B2B group support |
| CRM | Yes | Purchase history, behavior tracking |
| Configurable signup fields | Yes | Required/optional control |
| Social login | Yes | Naver, Kakao, Payco, Facebook |
| Business member info | Yes | Business registration number |
| Partner management | Yes | Separate pricing/settlement |
| Dormant member management | Yes | Auto-dormancy handling |
| Custom member attributes | Limited | Via signup additional fields |
| Client-specific pricing | No | Per-member pricing not supported |
| Designer/AM assignment | No | Custom development needed |

### Marketing & Promotion
| Capability | Available | Notes |
|-----------|-----------|-------|
| Coupon system | Yes | Generation, distribution, scheduling |
| Additional discounts | Yes | Rate/fixed, quantity-based |
| Free gift promotion | Yes | Condition-based gift management |
| Email management | Yes | Templates, automation, sending |
| SMS management | Yes | Manual, auto, scheduled |
| Kakao notification | Yes | Alert talk + friend talk |
| Product reviews | Yes | Photo review, accumulation |
| Experience program | No | Custom development needed |
| Landing page builder | Partial | Exhibition management, basic |

### Customer Service
| Capability | Available | Notes |
|-----------|-----------|-------|
| 1:1 inquiry | Yes | Category, staff assignment, templates |
| Board management | Yes | Post moderation, reports |
| Product inquiry | Yes | Q&A with templates |
| Claim management | Yes | Cancel, return, exchange, refund |
| Business messages | Yes | CS history tracking |
| FAQ | Yes | Category support |
| Design revision request | No | Custom development needed |
| Proof/approval workflow | No | Custom development needed |

### Statistics
| Capability | Available | Notes |
|-----------|-----------|-------|
| Period-based sales | Yes | Date range filtering |
| Product sales | Yes | Per-product analysis |
| Category sales | Yes | Category-level trends |
| Member statistics | Yes | Count, growth, grade distribution |
| Promotion statistics | Yes | Coupon, discount effectiveness |
| Print-option-based stats | No | Custom development needed |
| Production efficiency | No | Custom development needed |
| Team/department stats | No | Custom development needed |

### Appearance & Display
| Capability | Available | Notes |
|-----------|-----------|-------|
| React-based skin | Yes | Aurora React (open-source) |
| Category display | Yes | Arrangement, priority |
| Brand management | Yes | Brand pages |
| Event/promotion display | Yes | Exhibition management |
| Popup management | Yes | Scheduled popups |
| Headless banners | Yes | API-driven banners |
| Mobile/PC layout | Yes | Responsive skin support |

## API Architecture

### Shop API (Consumer-facing)
- Authentication: OAuth 2.0
- Product browsing, cart, order, payment, member profile
- Wish lists, shipping addresses, my page

### Admin API (Backoffice)
- Full CRUD for all modules
- Design/editor operations
- Workspace management
- Statistical queries

### Server API (B2B/Partner)
- Partner settlement
- Bulk product management
- Order integration
- Member operations

## Critical Gaps for Printing Business (5 areas)

1. **File Upload System** - No design file attachment, no spec doc upload, no proof preview
2. **Design Verification Workflow** - No approval/revision steps, no version control
3. **Production Tracking** - Order status limited to standard e-commerce flow
4. **Special Pricing/Quoting** - No quote system, no B2B bulk pricing, no variable pricing
5. **Client Communication** - No design feedback channel, limited to inquiry/board
