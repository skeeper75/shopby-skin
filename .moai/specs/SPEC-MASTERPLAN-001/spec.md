---
id: SPEC-MASTERPLAN-001
version: "2.0.0"
status: draft
created: "2026-03-16"
updated: "2026-03-16"
author: "지니"
priority: P0
issue_number: 0
---

# SPEC-MASTERPLAN-001: buysangsang.com → shopby Headless 마스터플랜

## 1. 프로젝트 개요

### 목표
buysangsang.com(바이상상) 수준의 인쇄 전문 쇼핑몰을 **Next.js + TypeScript 헤드리스 프론트엔드**로 구축하고, shopby API + Custom API + Edicus + MES와 연동하여 **8주(2개월) 내** 런칭한다.

### 전략 변경: Aurora Skin → Next.js Headless
Aurora Skin은 @shopby/react-components 의존성, 구형 빌드 시스템(Webpack+Babel), Plain CSS, JSX, 10단계 Provider 체인 등 구조적 제약이 크다. shopby에서도 확인된 바, **Aurora Skin의 기능을 분석하여 shopby API 직접 호출 기반 별도 프론트엔드 구축**이 최적 전략이다.

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│              Next.js Frontend (App Router)            │
│         TypeScript + Tailwind + shadcn/ui             │
└───────────────────┬─────────────────────────────────┘
                    │ API calls
                    ▼
┌─────────────────────────────────────────────────────┐
│            BFF Layer (Next.js API Routes)             │
│      인쇄 옵션 계산 / 파일 처리 / 데이터 동기화        │
└──┬──────────┬──────────┬──────────┬─────────────────┘
   │          │          │          │
   ▼          ▼          ▼          ▼
┌──────┐ ┌────────┐ ┌───────┐ ┌──────────┐
│shopby│ │Edicus  │ │ MES   │ │ Custom   │
│ API  │ │(에디터)│ │(생산) │ │ DB/API   │
│      │ │        │ │       │ │(인쇄옵션)│
└──────┘ └────────┘ └───────┘ └──────────┘
```

### 4대 시스템 역할

| 시스템 | 역할 | MVP 포함 | 연동 시점 |
|--------|------|---------|----------|
| **shopby API** | 회원, 상품, 주문, 결제, 배송, 게시판 | ✅ | W1 |
| **Custom API/DB** | 인쇄 옵션 엔진, 가격 매트릭스, 파일 처리 | ✅ | W3 |
| **Edicus** | 온라인 디자인 에디터 (템플릿 편집 → 인쇄) | ❌ 2차 | W6 인터페이스만 |
| **MES** | 생산 관리 (공정 트래킹, 작업 지시) | ❌ 2차 | W6 인터페이스만 |

---

## 3. 기술 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG, SEO, API Routes 내장 |
| **Language** | TypeScript 5.x | 타입 안전성, DX, 대규모 유지보수 |
| **Styling** | Tailwind CSS + shadcn/ui | 빠른 UI 개발, SPEC-DS-004 자산 활용 |
| **State** | Zustand | 경량 상태 관리, Provider 지옥 탈피 |
| **Data Fetching** | TanStack Query v5 | 서버 상태 캐싱, 낙관적 업데이트 |
| **Form** | React Hook Form + Zod | 타입 안전한 폼 검증 |
| **BFF** | Next.js API Routes | 별도 서버 없이 BFF 구현 |
| **File Storage** | AWS S3 (Presigned URL) | 대용량 인쇄 파일 처리 |
| **Database** | PostgreSQL (Supabase/Neon) | 인쇄 옵션/가격 매트릭스 저장 |
| **Deploy** | Vercel | Next.js 네이티브 배포, Edge Functions |
| **Monitoring** | Sentry + Vercel Analytics | 에러 추적 + 성능 모니터링 |

### Aurora Skin 제약 → Next.js 해결

| Aurora Skin 제약 | Next.js 해결 |
|-----------------|-------------|
| @shopby/react-components 강결합 | shopby REST API 직접 호출 |
| Webpack 5 + Babel (느린 빌드) | Next.js Turbopack (초고속 HMR) |
| Plain CSS + 전역 스타일 | Tailwind CSS + shadcn/ui (CSS-in-JS 불필요) |
| JSX (타입 없음) | TypeScript (컴파일 타임 에러 감지) |
| 10단계 Provider 체인 | Zustand 스토어 3-4개로 단순화 |
| React Router 6 (CSR) | Next.js App Router (SSR/SSG + SEO) |

---

## 4. 프로젝트 구조

```
huni-printing/
├── app/
│   ├── layout.tsx                # 루트 레이아웃 (Header/Footer)
│   ├── page.tsx                  # 메인 페이지
│   ├── (shop)/                   # 쇼핑 라우트 그룹
│   │   ├── products/page.tsx     # 상품 목록 (shopby API)
│   │   ├── products/[id]/page.tsx # 상품 상세 (인쇄 옵션 통합)
│   │   ├── cart/page.tsx         # 장바구니
│   │   └── order/page.tsx        # 주문서 + 결제
│   ├── (auth)/                   # 인증 라우트 그룹
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (mypage)/                 # 마이페이지
│   │   ├── layout.tsx            # 마이페이지 공통 레이아웃
│   │   ├── orders/page.tsx       # 주문 조회
│   │   ├── orders/[id]/page.tsx  # 주문 상세
│   │   ├── saved-options/page.tsx # 옵션 보관함 (인쇄 특화)
│   │   └── profile/page.tsx      # 회원 정보
│   ├── (info)/                   # 정보/고객센터
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── notice/page.tsx
│   │   ├── guides/page.tsx       # 작업 가이드 11종
│   │   └── contact/page.tsx      # 대량견적/디자인상담
│   ├── admin/                    # 관리자 (별도 레이아웃)
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── file-check/page.tsx
│   │   └── status-change/page.tsx
│   └── api/                      # BFF API Routes
│       ├── print-options/route.ts  # 인쇄 옵션 종속 조회
│       ├── price-calculate/route.ts # 가격 매트릭스 계산
│       ├── file-upload/route.ts    # S3 presigned URL
│       └── shopby/[...path]/route.ts # shopby API 프록시
├── components/
│   ├── ui/                       # shadcn/ui 기본 컴포넌트
│   ├── print/                    # 인쇄 특화 (DS-004 → TSX 마이그레이션)
│   │   ├── SizeOptionChip.tsx
│   │   ├── RadioOption.tsx
│   │   ├── DropdownSelect.tsx
│   │   ├── CounterOption.tsx
│   │   ├── CollapsibleSection.tsx
│   │   ├── PriceSummary.tsx
│   │   └── ... (13개)
│   ├── layout/                   # 공통 레이아웃
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── admin/                    # 관리자 컴포넌트
│       ├── DataTable.tsx
│       ├── OrderDetailPanel.tsx
│       └── FilePreview.tsx
├── lib/
│   ├── shopby/                   # shopby API 클라이언트
│   │   ├── client.ts             # HTTP 클라이언트 (인증 포함)
│   │   ├── products.ts           # 상품 API
│   │   ├── orders.ts             # 주문 API
│   │   ├── members.ts            # 회원 API
│   │   └── boards.ts             # 게시판 API
│   ├── print/                    # 인쇄 비즈니스 로직
│   │   ├── option-engine.ts      # 옵션 종속 계산
│   │   ├── price-matrix.ts       # 가격 매트릭스
│   │   └── file-validator.ts     # 파일 규격 검증
│   └── utils.ts                  # cn() 등 유틸리티
├── types/
│   ├── shopby.ts                 # shopby API 타입
│   ├── print.ts                  # 인쇄 도메인 타입
│   └── order.ts                  # 주문 타입
├── stores/
│   ├── auth-store.ts             # 인증 상태
│   ├── cart-store.ts             # 장바구니 상태
│   └── print-option-store.ts     # 인쇄 옵션 선택 상태
└── config/
    ├── shopby.ts                 # shopby API 설정
    └── site.ts                   # 사이트 메타데이터
```

---

## 5. 8주 마스터 일정

### Week 1: 프로젝트 부트스트랩 + shopby API 연동
> 목표: Next.js 프로젝트 초기화 + shopby API 통신 확인

| 일 | 작업 | SPEC |
|-----|------|------|
| 1-2 | Next.js 프로젝트 생성, Tailwind/shadcn/Zustand/TanStack Query 셋업 | SPEC-BOOT-001 |
| 3-4 | shopby REST API 클라이언트 작성 (인증, 상품, 회원 타입 정의) | SPEC-BOOT-001 |
| 5 | 공통 레이아웃 (Header/Footer/Nav) + 라우팅 구조 | SPEC-BOOT-001 |

**정책 데드라인**: POLICY-A1A2-MEMBER (회원 12개) + POLICY-A5-PAYMENT (결제 1개) 결정

### Week 2: 핵심 쇼핑 페이지 (shopby API 기반)
> 목표: 상품 탐색 → 장바구니 흐름 동작

| 일 | 작업 | SPEC |
|-----|------|------|
| 6-7 | 메인 + 상품목록 (SSR, shopby 상품 API, 검색/필터) | SPEC-SHOP-001 |
| 8-9 | 상품 상세 + 장바구니 (인쇄 옵션 확장 지점 준비) | SPEC-SHOP-001 |
| 10 | 로그인/회원가입 (shopby Auth API) + 마이페이지 레이아웃 | SPEC-AUTH-001 |

### Week 3: 인쇄 핵심 (BFF + 옵션 엔진) ← **핵심 병목**
> 목표: 인쇄 옵션 선택 + 가격 계산 동작

| 일 | 작업 | SPEC |
|-----|------|------|
| 11-12 | BFF API Routes (옵션 조회, 가격 계산, 파일 업로드) | SPEC-BFF-001 |
| 13-14 | 인쇄 옵션 엔진 UI (DS-004 → TSX 마이그레이션 + 종속 로직) | SPEC-PRINT-002 |
| 15 | 파일 업로드 (S3 presigned URL + 미리보기) | SPEC-BFF-001 |

### Week 4: 주문 + 결제 (MVP 완성)
> 목표: 인쇄 상품 주문 → 결제 → 완료

| 일 | 작업 | SPEC |
|-----|------|------|
| 16-17 | 주문서 (shopby Order API + 인쇄 메타데이터 연동) | SPEC-ORDER-002 |
| 18-19 | 결제 (shopby Payment API + PG) + 주문 완료 | SPEC-ORDER-002 |
| 20 | MVP 통합 테스트 (전체 플로우 검증) | - |

**MVP 마일스톤**: 명함/전단/포스터 3종 주문 + 결제 가능

### Week 5-6: 운영 기능 (관리자 + 마이페이지 + 콘텐츠)
> 목표: 내부 운영 가능 + 고객 서비스 완비

| 일 | 작업 | SPEC |
|-----|------|------|
| 21-23 | 관리자 (대시보드, 주문관리 DataTable, 상태변경) | SPEC-ADMIN-003 |
| 24-25 | 파일확인 처리 + 주문서 출력 (A4) | SPEC-ADMIN-003 |
| 26-27 | 마이페이지 (주문조회/상세 + 옵션보관함 + 배송지) | SPEC-PAGE-001 |
| 28-29 | 고객센터 + 정보 (FAQ, 공지, 대량견적, 작업가이드) | SPEC-PAGE-001 |
| 30 | Edicus/MES 연동 인터페이스 설계 (API 스펙 정의만) | SPEC-INTEG-001 |

**정책 데드라인**: POLICY-A3-MYPAGE (15개) 결정

### Week 7-8: 마무리 + 런칭
> 목표: 프로덕션 배포

| 일 | 작업 | SPEC |
|-----|------|------|
| 31-32 | 추가 상품 타입 (제본, 봉투) 옵션 확장 | SPEC-PRINT-002 확장 |
| 33-34 | 마케팅 (랜딩페이지 2종, 이용후기) | - |
| 35-37 | QA (E2E 테스트, 성능 최적화, SEO, 반응형) | SPEC-LAUNCH-002 |
| 38-39 | Vercel 배포 + 도메인 + 모니터링 | SPEC-LAUNCH-002 |
| 40 | 정식 오픈 | SPEC-LAUNCH-002 |

---

## 6. SPEC 분할 계획 (10개)

| SPEC ID | 이름 | 주차 | 우선순위 | 복잡도 |
|---------|------|------|---------|--------|
| SPEC-BOOT-001 | Next.js 부트스트랩 + shopby API 레이어 | W1 | P0 | 중 |
| SPEC-SHOP-001 | 핵심 쇼핑 페이지 (메인/목록/상세/장바구니) | W2 | P0 | 중 |
| SPEC-AUTH-001 | 인증 + 회원 (shopby Auth API) | W2 | P0 | 낮음 |
| **SPEC-BFF-001** | **인쇄 BFF API** (옵션 엔진 + 가격 + 파일) | W3 | P0 | **높음** |
| **SPEC-PRINT-002** | **인쇄 옵션 엔진 UI** (TSX + 종속 로직) | W3 | P0 | **높음** |
| SPEC-ORDER-002 | 인쇄 주문 워크플로우 (파일 + 결제) | W4 | P0 | 높음 |
| SPEC-ADMIN-003 | 관리자 주문관리 + 파일검수 | W5-6 | P0 | 중 |
| SPEC-PAGE-001 | 마이페이지 + 고객센터 + 콘텐츠 | W6 | P1 | 중 |
| SPEC-INTEG-001 | Edicus/MES 연동 인터페이스 설계 | W6 | P1 | 중 |
| SPEC-LAUNCH-002 | QA + Vercel 배포 + 모니터링 | W7-8 | P0 | 중 |

---

## 7. shopby API 활용 전략

### shopby API가 커버하는 기능 (프론트에서 직접 호출)

| shopby API | 용도 | 프론트 페이지 |
|------------|------|-------------|
| Auth API | 로그인, 회원가입, 토큰 관리 | sign-in, sign-up |
| Products API | 상품 목록, 검색, 상세 | products, products/[id] |
| Cart API | 장바구니 CRUD | cart |
| Order API | 주문 생성, 조회, 상태 | order, mypage/orders |
| Payment API | PG 결제 처리 | order (결제 단계) |
| Member API | 회원 정보, 배송지 | mypage/profile |
| Board API | 공지사항, FAQ, 문의 | notice, faq, contact |
| Coupon API | 쿠폰 조회, 사용 | mypage/coupons |
| Accumulation API | 적립금 조회 | mypage/accumulation |
| Banner API | 배너/팝업 | 메인 페이지 |

### Custom API/DB가 담당하는 인쇄 특화 기능

| Custom API | 용도 | 데이터 |
|------------|------|--------|
| /api/print-options | 인쇄 옵션 종속 조회 | 옵션 트리 (사이즈→종이→인쇄→후가공) |
| /api/price-calculate | 가격 매트릭스 계산 | 옵션 조합별 단가표 |
| /api/file-upload | S3 presigned URL 발급 | 파일 메타데이터 |
| /api/file-validate | 파일 규격 검증 (용량, DPI, 색상) | 검증 결과 |
| /api/order-meta | shopby 주문 + 인쇄 메타데이터 동기화 | 인쇄 옵션, 파일 URL |
| /api/production-status | 생산 상태 조회 (MES 프록시) | 공정 상태 |

### 데이터 동기화 흐름

```
고객 주문 시:
1. 프론트 → shopby Order API (주문 생성) → orderNo 반환
2. 프론트 → Custom API /api/order-meta (인쇄 메타데이터 저장)
   - orderNo, 인쇄 옵션 조합, 파일 URL, 가격 상세

관리자 주문 처리 시:
1. 관리자 → Custom API (인쇄 메타데이터 + 파일 조회)
2. 관리자 → shopby API (주문 상태 변경)
3. (2차) Custom API → MES (생산 지시 연동)
```

---

## 8. DS-004 → TypeScript 마이그레이션

기존 SPEC-DS-004에서 생성한 13개 JSX 컴포넌트를 TypeScript로 마이그레이션:

| 컴포넌트 | 마이그레이션 변경 |
|---------|----------------|
| BadgeLabel.jsx → .tsx | interface BadgeLabelProps 추가 |
| SizeOptionChip.jsx → .tsx | interface + CVA variant 타입 |
| RadioOption.jsx → .tsx | interface + 제네릭 value 타입 |
| DropdownSelect.jsx → .tsx | interface + Option\<T\> 제네릭 |
| CounterOption.jsx → .tsx | interface + min/max 타입 |
| CollapsibleSection.jsx → .tsx | interface + children 타입 |
| PriceSummary.jsx → .tsx | interface + PriceItem 타입 |
| ... (전체 13개) | prop-types 제거 → interface 전환 |

**작업량**: JSX → TSX는 타입 추가만이므로 컴포넌트당 30분, 총 약 1일

---

## 9. 리스크 관리

| 리스크 | 영향 | 확률 | 완화 전략 |
|--------|------|------|----------|
| shopby API 문서 학습 곡선 | W1-2 지연 | 중 | API 레퍼런스 사전 분석 + 타입 자동 생성 |
| 인쇄 옵션 엔진 복잡도 | W3 지연 | 높음 | 핵심 3종만 MVP, JSON 기반 시작 |
| BFF 추가 개발 부담 | 전체 일정 | 중 | Next.js API Routes로 서버 분리 없이 |
| Edicus SDK 스펙 미확정 | 연동 지연 | 중 | MVP 제외, 인터페이스 설계만 |
| MES 연동 프로토콜 미확정 | 연동 지연 | 중 | MVP 제외, 관리자 수동 상태 변경 |
| shopby API 제약 발견 | 기능 불가 | 중 | W1에서 전체 API 검증 |
| DB 스키마 설계 오류 | 재작업 | 낮음 | 정책 문서 기반 + 점진적 마이그레이션 |
| 1인 개발 병목 | 일정 지연 | 중 | MoAI 병렬 SPEC 처리 (2-3x 생산성) |

---

## 10. 후순위 기능 (2차 개발, 오픈 후)

| 기능 | 시스템 | 사유 |
|------|--------|------|
| Edicus 에디터 완전 통합 | Edicus | SDK 스펙 확정 후 |
| MES 자동 생산 연동 | MES | 프로토콜 확정 후 |
| Printly 자동 파일 검증 | Custom | MVP는 수동 검수 |
| 프린팅머니 충전 | Custom | 결제 안정화 후 |
| 통계/리포트 (B-7 전체) | Custom | 데이터 축적 후 |
| 거래처/원장 (B-2, B-3) | Custom | B2B 확장 시 |
| 체험단 모집 | shopby | 마케팅 확장 시 |
| SMS/알림톡 자동 발송 | External | 카카오 비즈 계정 확정 후 |
| 디자인 에디터 자체 개발 | Custom | 별도 프로젝트 |

---

## 11. 정책 결정 데드라인

| 정책 문서 | 미결정 수 | 데드라인 | 사유 |
|-----------|----------|----------|------|
| POLICY-A1A2-MEMBER (회원) | 12 | **W1 시작 전** | 회원가입/로그인 |
| POLICY-A5-PAYMENT (결제) | 1 | **W1 시작 전** | PG 연동 |
| POLICY-A3-MYPAGE (마이페이지) | 15 | **W5 시작 전** | 마이페이지 |
| POLICY-A7A8-CONTENT (정보) | 5 | **W6 시작 전** | 콘텐츠 페이지 |
| POLICY-A9-MARKETING (마케팅) | 3 | **W7 시작 전** | 마케팅 |
| POLICY-B2/B3 (거래처/원장) | 5 | 2차 개발 | 오픈 후 |

---

## 12. 성공 기준

| 단계 | 시점 | 기준 |
|------|------|------|
| **MVP** | Week 4 | 인쇄 3종 주문+결제 (Next.js + shopby API) |
| **Beta** | Week 6 | 관리자 주문처리 + 마이페이지 + 고객센터 |
| **Launch** | Week 8 | 프로덕션 배포 (Vercel), 5종 상품, SEO 동작 |

### 정량 지표

| 지표 | 목표 |
|------|------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | 1.5초 이내 |
| 인쇄 상품 주문 가능 종류 | 5종 이상 |
| TypeScript 타입 커버리지 | 95%+ |
| ESLint 에러 | 0 |

---

## 13. 가속 전략

### 1. Next.js + shadcn/ui → 페이지 당 개발 속도 극대화
shadcn/ui 컴포넌트(Button, Input, Select, Table, Dialog 등)를 기본 UI에 활용. 커스텀은 인쇄 특화 컴포넌트만.

### 2. shopby API 타입 자동 생성
shopby API 문서에서 TypeScript 타입을 자동 생성하여 개발 속도 향상.

### 3. DS-004 컴포넌트 TSX 마이그레이션 (1일)
이미 검증된 13개 인쇄 옵션 컴포넌트를 TypeScript로 전환하여 즉시 활용.

### 4. Next.js API Routes = BFF
별도 백엔드 서버 없이 Next.js 내부에서 인쇄 API 구현 → 배포 단순화.

### 5. MoAI 병렬 SPEC 처리
주당 2-3개 SPEC 동시 진행. plan → run → sync 자동화.

### 6. Incremental Static Regeneration (ISR)
상품 페이지 SSG + ISR로 빠른 로딩 + SEO + 데이터 최신성.
