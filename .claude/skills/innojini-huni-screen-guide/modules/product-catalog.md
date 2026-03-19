# A-9/A-10: 마케팅/상품 (18 화면)

## 목차

- [A-9 마케팅 (7 화면)](#a-9-마케팅)
  - [SCR-A9-LANDING-PAPER: 랜딩 - 종이 (대표 스펙)](#scr-a9-landing-paper)
  - [SCR-A9-LANDING-BIND/CAL/POUCH/STICKER: 동일 패턴 4종](#landing-variants)
  - [SCR-A9-REVIEW-MAIN: 이용후기 메인](#scr-a9-review-main)
  - [SCR-A9-EXPERIENCE: 체험단 모집](#scr-a9-experience)
- [A-10 상품 (11 화면)](#a-10-상품)
  - [SCR-A10-MAIN: 메인 페이지](#scr-a10-main)
  - [SCR-A10-SUB-MAIN: 서브 메인](#scr-a10-sub-main)
  - [SCR-A10-LIST: 상품 목록](#scr-a10-list)
  - [SCR-A10-DETAIL: 상품 상세](#scr-a10-detail)
  - [SCR-A10-PRINT-PRODUCT: 출력상품 (명함/전단/포스터/스티커)](#scr-a10-print-product)
  - [SCR-A10-PACKAGING: 포장재](#scr-a10-packaging)
  - [SCR-A10-GOODS: 굿즈+파우치백](#scr-a10-goods)
  - [SCR-A10-HANDMADE: 수작 상품](#scr-a10-handmade)

---

## A-9 마케팅

---

## SCR-A9-LANDING-PAPER

**랜딩: 종이 | SKIN | 우선순위 3 | 규모 M**

### 1. 화면 개요

- ID: SCR-A9-LANDING-PAPER
- 화면명: 종이 카테고리 랜딩 페이지
- 분류: SKIN (shopby 표준 레이아웃 커스터마이징)
- 우선순위: 3 (카테고리 마케팅 진입점)
- 규모: M (4가지 상태 + 1-2개 인터랙션)
- 목적: 종이 인쇄 카테고리 사용자를 대표 상품으로 유도

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [≡]  후니프린팅    [🔍][🛒] │ ← GlobalHeader
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   HeroBanner        │    │ ← 전체 너비, 비율 16:7
│  │   종이 인쇄 특집     │    │
│  │   [지금 주문하기]    │    │
│  │                     │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  인기 종이 상품             │
│  ┌──────┐ ┌──────┐         │
│  │ 상품 │ │ 상품 │         │ ← ProductRecommendGrid
│  │ 카드 │ │ 카드 │         │   (2열 그리드)
│  └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐         │
│  │ 상품 │ │ 상품 │         │
│  └──────┘ └──────┘         │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │   [전체 상품 보기]   │    │ ← CTAButton (full-width)
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌─────────────────────────────────────────────────────┐
│ Logo     카테고리 메뉴          검색     마이/장바구니 │ ← GlobalHeader
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │              HeroBanner                       │  │ ← maxWidth="7xl"
│  │         종이 인쇄 - 당일 배송                 │  │   비율 16:5
│  │         [지금 주문하기]   [샘플 신청]          │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  인기 종이 상품                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │      │ │      │ │      │ │      │              │ ← 4열 그리드
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │      │ │      │ │      │ │      │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│              [전체 종이 상품 보기]                   │ ← CTAButton
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
LandingPage (PageShell maxWidth="7xl")
├── GlobalHeader
├── HeroBanner
│   ├── BannerImage (lazy load)
│   ├── BannerHeadline
│   ├── BannerSubtext
│   └── CTAButton (primary)
├── ProductRecommendSection
│   ├── SectionTitle ("인기 종이 상품")
│   └── ProductRecommendGrid
│       └── ProductCard[] (최대 8개)
│           ├── ProductThumbnail
│           ├── ProductName
│           ├── ProductPrice
│           └── QuickAddButton
└── CTASection
    └── CTAButton (secondary, "전체 상품 보기")
```

### 4. Props/States

**HeroBanner Props**
```
bannerImageUrl: string       // CMS에서 관리
headline: string             // "종이 인쇄 전문"
subtext: string              // 부제목
ctaPrimaryText: string       // "지금 주문하기"
ctaPrimaryHref: string       // "/products?category=paper"
ctaSecondaryText?: string    // "샘플 신청" (선택)
```

**ProductRecommendGrid Props**
```
categoryCode: string         // "paper" (랜딩별 다름)
displayCount: number         // 8 (default)
sortType: "BEST" | "NEW"     // "BEST" (default)
```

**페이지 상태 (4가지)**
```
loading   → 스켈레톤 UI 표시
success   → 정상 렌더링
empty     → 추천 상품 없음 (대체 메시지)
error     → 상품 로딩 실패 (재시도 버튼)
```

### 5. API 매핑

```
GET /products
  params:
    categoryCode: "paper"
    sortType: "BEST_SELLER"
    pageSize: 8
  response: { items: Product[], totalCount: number }
```

### 6. 데이터 플로우

```
페이지 진입
  → categoryCode="paper" 파라미터로 GET /products 호출
  → loading 상태 표시 (스켈레톤)
  → 응답 수신 → ProductRecommendGrid 렌더링
  → CTA 클릭 → /products?category=paper 이동
```

### 7. 인터랙션 상태

- 상품 카드 호버: 가격 정보 오버레이 표시 (데스크탑)
- CTA 클릭: 해당 카테고리 상품 목록 페이지 이동
- QuickAdd 클릭: 장바구니 추가 확인 토스트 (모바일은 상품 상세로 이동)

### 8. 에러 처리

- API 실패 시: "상품을 불러오지 못했습니다. 다시 시도해주세요." + 재시도 버튼
- 빈 결과: "현재 표시할 상품이 없습니다." 메시지 + 전체 상품 목록 CTA
- 이미지 로딩 실패: 플레이스홀더 이미지 대체

### 9. 접근성

- HeroBanner img alt: "종이 인쇄 카테고리 배너"
- CTA button: aria-label="종이 인쇄 전체 상품 보기"
- ProductCard: role="article", aria-label="{상품명} {가격}"
- 키보드 탐색: Tab으로 CTA → 상품 카드 순서 이동

---

## landing-variants

**SCR-A9-LANDING-BIND / LANDING-CAL / LANDING-POUCH / LANDING-STICKER**

**동일 패턴 적용 — SCR-A9-LANDING-PAPER 스펙 전체 준용**

| 화면 ID | 화면명 | categoryCode | headline 예시 |
|---------|--------|-------------|--------------|
| SCR-A9-LANDING-BIND | 랜딩: 제본 | bind | "제본 인쇄 전문" |
| SCR-A9-LANDING-CAL | 랜딩: 캘린더 | calendar | "나만의 캘린더 제작" |
| SCR-A9-LANDING-POUCH | 랜딩: 파우치 | pouch | "파우치 커스텀 인쇄" |
| SCR-A9-LANDING-STICKER | 랜딩: 스티커 | sticker | "스티커 전문 인쇄" |

변경 사항:
- `categoryCode` 파라미터만 각 카테고리 코드로 교체
- HeroBanner 이미지 및 headline/subtext는 CMS에서 카테고리별 관리
- 컴포넌트 트리, API 구조, 에러 처리, 접근성 패턴 동일

---

## SCR-A9-REVIEW-MAIN

**이용후기 메인 | SKIN | 우선순위 3 | 규모 M**

### 1. 화면 개요

- ID: SCR-A9-REVIEW-MAIN
- 화면명: 이용후기 메인
- 분류: SKIN (shopby 리뷰 API 활용)
- 우선순위: 3 (신뢰 구축 콘텐츠)
- 규모: M (4가지 상태 + 1-2개 인터랙션)
- 목적: 실제 고객 리뷰로 구매 신뢰도 향상

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  이용후기               │ ← PageHeader
├─────────────────────────────┤
│  ★★★★☆  4.7 / 5.0          │
│  총 1,234개 리뷰             │ ← RatingDistribution
│  ████████ 5★ (68%)          │
│  ████     4★ (22%)          │
│  ██       3★ (7%)           │
│  ▌        2★ (2%)           │
│  ▌        1★ (1%)           │
├─────────────────────────────┤
│  [사진 리뷰] [전체 리뷰]     │ ← TabBar (필터)
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ [이미지] [이미지]    │    │
│  │ 홍길동 ★★★★★        │    │ ← MasonryGrid
│  │ 명함 인쇄 후기...   │    │   ReviewCard
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 김민수 ★★★★☆        │    │
│  │ 전단 인쇄 품질...   │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌─────────────────────────────────────────────────────┐
│  이용후기 메인                                       │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │  RatingDistrib.  │  │  [사진리뷰] [전체리뷰]   │ │
│  │  ★★★★☆ 4.7      │  │  정렬: [최신순 ▾]        │ │
│  │  막대 차트        │  └──────────────────────────┘ │
│  └──────────────────┘                               │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 리뷰카드 │ │ 리뷰카드 │ │ 리뷰카드 │            │ ← 3열 Masonry
│  │          │ │          │ │          │            │
│  └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ReviewMainPage (PageShell + ResponsiveGrid)
├── PageHeader ("이용후기")
├── RatingDistribution
│   ├── AverageScore (숫자 + 별점)
│   └── RatingBars[] (5개 막대)
├── ReviewFilterTab
│   ├── TabItem ("사진 리뷰")
│   └── TabItem ("전체 리뷰")
└── ReviewMasonryGrid
    └── ReviewCard[]
        ├── ReviewImages[] (최대 3장 썸네일)
        ├── ReviewerName
        ├── StarRating
        ├── ProductName (링크)
        └── ReviewContent (말줄임)
```

### 4. Props/States

**ReviewMasonryGrid Props**
```
filterType: "photo" | "all"
sortType: "RECENT" | "HIGH_RATING"
pageSize: 12
```

**페이지 상태 (4가지)**
```
loading   → 스켈레톤 카드 12개
success   → 리뷰 그리드 표시
empty     → "아직 리뷰가 없습니다."
error     → "리뷰를 불러오지 못했습니다."
```

### 5. API 매핑

```
GET /product-reviews
  params:
    reviewType: "photo" | "all"
    sortType: "RECENT"
    pageSize: 12
    pageNumber: 1
  response:
    { items: Review[], totalCount, avgRating, ratingDistribution }
```

### 6. 데이터 플로우

```
진입 → GET /product-reviews (기본: 전체, 최신순)
     → RatingDistribution 렌더링 (집계 데이터)
     → MasonryGrid 렌더링
탭 전환 → filterType 변경 → 재요청
무한 스크롤 → pageNumber++ → 추가 로딩
```

### 7. 인터랙션 상태

- 탭 전환: 사진 리뷰 / 전체 리뷰 필터링
- 리뷰 이미지 클릭: 라이트박스 전체화면 표시
- 상품명 클릭: 해당 상품 상세 페이지 이동
- 무한 스크롤: 하단 도달 시 추가 리뷰 로딩

### 8. 에러 처리

- API 실패: "리뷰를 불러오지 못했습니다. 새로고침 해주세요."
- 이미지 로딩 실패: 회색 플레이스홀더

### 9. 접근성

- RatingBars: aria-label="5점 리뷰 비율 68%"
- ReviewCard: role="article", aria-label="{작성자} {별점}점 리뷰"
- 이미지 썸네일 alt: "{상품명} 리뷰 이미지 {순번}"

---

## SCR-A9-EXPERIENCE

**체험단 모집 | CUSTOM | 우선순위 3 | 규모 L**

### 1. 화면 개요

- ID: SCR-A9-EXPERIENCE
- 화면명: 체험단 모집
- 분류: CUSTOM (shopby 미지원, 자체 API 필요)
- 우선순위: 3 (마케팅 활성화 보조)
- 규모: L (3-5개 인터랙션, 폼 포함)
- 목적: 체험단 신청 접수 및 리스트 공개

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  체험단 모집             │
├─────────────────────────────┤
│  모집 중 (D-7)              │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │  ExperienceListCard  │    │ ← 체험단 1
│  │  명함 무료 체험단    │    │
│  │  모집: 10명 / 신청: 43│   │
│  │  [신청하기]          │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  ExperienceListCard  │    │ ← 체험단 2
│  │  마감: 전단 체험단   │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  종료된 체험단              │
│  (접혀있음, 펼치기 가능)    │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌─────────────────────────────────────────────────────┐
│  체험단 모집                                         │
├─────────────────────────────────────────────────────┤
│  모집 중  ┌─────────────┐ ┌─────────────┐           │
│           │ 체험단카드  │ │ 체험단카드  │           │ ← 2열 그리드
│           │ [신청하기]  │ │ [마감]      │           │
│           └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────┤
│  신청 모달 (신청하기 클릭 시)                        │
│  ┌───────────────────────────────┐                  │
│  │  체험단 신청                  │                  │
│  │  이름: [____________]         │                  │
│  │  연락처: [___________]        │                  │
│  │  SNS: [______________]        │                  │
│  │  [취소]  [신청 완료]          │                  │
│  └───────────────────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ExperiencePage (PageShell + ResponsiveGrid)
├── PageHeader ("체험단 모집")
├── ActiveExperienceSection ("모집 중")
│   └── ExperienceListCard[]
│       ├── ExperienceThumbnail
│       ├── ExperienceTitle
│       ├── DeadlineBadge (D-N 또는 마감)
│       ├── ApplicantCounter ("신청: 43/10")
│       └── ApplyButton
├── ApplicationModal (조건부 렌더)
│   └── ApplicationForm
│       ├── NameInput
│       ├── PhoneInput
│       ├── SNSInput
│       └── SubmitButton
└── ClosedExperienceSection (접힘 가능)
    └── ExperienceListCard[] (마감 표시)
```

### 4. Props/States

**ExperienceListCard Props**
```
experienceId: string
title: string
thumbnailUrl: string
recruitCount: number
applicantCount: number
deadline: Date
status: "active" | "closed"
```

**페이지 상태 (3가지)**
```
loading   → 스켈레톤 카드
success   → 체험단 리스트
error     → 로딩 실패 메시지
```

**ApplicationModal 상태 (4가지)**
```
idle      → 닫힘
open      → 폼 입력 중
submitting → 제출 중 (버튼 비활성화)
success   → "신청 완료" 확인 메시지
```

### 5. API 매핑

```
GET /experiences
  response: { active: Experience[], closed: Experience[] }

POST /experiences/{id}/apply
  body: { name, phone, sns }
  response: { success: boolean, message: string }
```

### 6. 데이터 플로우

```
진입 → GET /experiences → 모집중/종료 섹션 분리 렌더링
신청 클릭 → ApplicationModal 열기
폼 제출 → POST /experiences/{id}/apply
        → 성공: 완료 메시지 + 신청자 수 업데이트
        → 실패: 에러 토스트 (중복 신청 등)
```

### 7. 인터랙션 상태

- 신청 버튼: 로그인 미완료 시 로그인 유도 모달
- 마감된 체험단: 버튼 비활성화 (회색 "마감")
- 종료 섹션: 아코디언으로 펼치기/접기
- 폼 유효성: 실시간 입력 검증 (전화번호 형식 등)

### 8. 에러 처리

- 중복 신청: "이미 신청하셨습니다." 알림
- 마감 후 신청 시도: "모집이 마감되었습니다." 알림
- 네트워크 오류: 재시도 버튼 포함 에러 메시지

### 9. 접근성

- ApplyButton: aria-label="{체험단명} 신청하기"
- DeadlineBadge: aria-label="마감까지 {N}일 남음"
- Modal: role="dialog", aria-modal="true", focus trap 적용
- 마감 버튼: aria-disabled="true"

---

## A-10 상품

---

## SCR-A10-MAIN

**메인 페이지 | SKIN | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-A10-MAIN
- 화면명: 메인 페이지
- 분류: SKIN (shopby display API 활용)
- 우선순위: 1 (사이트 최초 진입점)
- 규모: L (3-5개 인터랙션, 다중 섹션)
- 목적: 브랜드 인지 + 카테고리 탐색 유도

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [≡] 후니프린팅   [🔍][🛒]  │ ← GlobalHeader
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │                     │    │ ← HeroBanner (전체 너비)
│  │  슬라이더 배너       │    │   자동 슬라이드 5초
│  │  ● ○ ○              │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  카테고리              모두보기│
│  [명함][전단][포스터][스티커]│ ← CategoryNav (가로 스크롤)
│  [캘린더][제본][파우치]...  │
├─────────────────────────────┤
│  추천 상품             더보기│
│  ┌──────┐ ┌──────┐         │ ← ProductRecommendGrid
│  │      │ │      │         │   2열
│  └──────┘ └──────┘         │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌─────────────────────────────────────────────────────┐
│ Logo    카테고리 메뉴         검색  마이/장바구니    │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │              HeroBanner (전체 너비)            │  │ ← maxWidth="7xl"
│  │              ← 자동 슬라이드 →                │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  카테고리 탐색                                       │
│  [명함] [전단] [포스터] [스티커] [캘린더] [제본] [파우치]│ ← CategoryNav
├─────────────────────────────────────────────────────┤
│  추천 상품                              [더보기 →]   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │      │ │      │ │      │ │      │             │ ← 4열 그리드
│  └──────┘ └──────┘ └──────┘ └──────┘             │
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
MainPage (PageShell maxWidth="7xl")
├── GlobalHeader
├── HeroBanner (자동 슬라이더)
│   ├── BannerSlide[]
│   │   ├── BannerImage
│   │   └── BannerCTA
│   └── SliderDots
├── CategoryNav
│   └── CategoryItem[] (아이콘 + 이름)
└── ProductRecommendSection
    ├── SectionHeader ("추천 상품", "더보기" 링크)
    └── ProductRecommendGrid
        └── ProductCard[] (최대 8개)
```

### 4. Props/States

**HeroBanner Props**
```
slides: BannerSlide[]
autoPlayInterval: number  // 5000ms
```

**CategoryNav Props**
```
categories: Category[]   // display API에서 로딩
```

**페이지 상태 (3가지)**
```
loading  → 섹션별 스켈레톤
success  → 전체 렌더링
error    → 섹션별 개별 에러 처리
```

### 5. API 매핑

```
GET /display/sections
  response: { banner: BannerSlide[], categories: Category[], recommended: Product[] }
```

### 6. 데이터 플로우

```
진입 → GET /display/sections (단일 호출)
     → 배너 / 카테고리 / 추천상품 병렬 렌더
배너 자동 슬라이드 → setInterval 5초
카테고리 클릭 → 해당 카테고리 목록 페이지 이동
"더보기" 클릭 → 전체 상품 목록 이동
```

### 7. 인터랙션 상태

- 배너 슬라이드: 자동 5초 + 수동 스와이프 (모바일) / 화살표 (데스크탑)
- 카테고리 호버: 배경색 변경 (데스크탑)
- 상품 카드 클릭: 상품 상세 이동

### 8. 에러 처리

- 배너 실패: 정적 폴백 이미지
- 상품 없음: "추천 상품 준비 중입니다." 메시지
- 전체 API 실패: 오프라인 알림 + 새로고침 유도

### 9. 접근성

- HeroBanner: role="banner", aria-label="메인 배너"
- 자동 슬라이드 정지 버튼: aria-label="슬라이드 정지"
- CategoryItem: aria-label="{카테고리명} 카테고리로 이동"

---

## SCR-A10-SUB-MAIN

**서브 메인 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-A10-SUB-MAIN
- 화면명: 서브 메인
- 분류: SKIN
- 우선순위: 2 (카테고리 중간 단계 탐색)
- 규모: M

### 2. 와이어프레임 레이아웃

**모바일/데스크탑 공통 구조**
```
┌─────────────────────────────┐
│  CategoryHeader             │ ← 카테고리명 + 설명
│  (예: 출력 인쇄 전체)       │
├─────────────────────────────┤
│  서브 카테고리 탐색          │
│  [명함] [전단] [포스터] ...  │ ← 서브 카테고리 탭
├─────────────────────────────┤
│  ProductGrid                │ ← 2열(M) / 3열(D)
└─────────────────────────────┘
```

### 3. 컴포넌트 트리

```
SubMainPage (PageShell maxWidth="xl")
├── CategoryHeader
│   ├── CategoryTitle
│   └── CategoryDescription
├── SubCategoryTabs
│   └── TabItem[]
└── ProductGrid
    └── ProductCard[]
```

### 4. Props/States

```
activeCategory: string    // URL 파라미터
페이지 상태: loading / success / empty / error
```

### 5. API 매핑

```
GET /display/sections?categoryCode={code}
  response: { header: CategoryInfo, subCategories: Category[], products: Product[] }
```

### 6-9. 데이터 플로우 / 인터랙션 / 에러 / 접근성

- 탭 전환 시 서브 카테고리 필터 재요청
- 에러: 상품 목록 로딩 실패 시 재시도 버튼
- 접근성: 탭 role="tablist", aria-selected 상태 관리

---

## SCR-A10-LIST

**상품 목록 | NATIVE | 우선순위 1 | 규모 M**

### 1. 화면 개요

- ID: SCR-A10-LIST
- 화면명: 상품 목록
- 분류: NATIVE (shopby 기본 목록 기능)
- 우선순위: 1 (핵심 탐색 화면)
- 규모: M (4가지 상태 + 1-2개 인터랙션)
- 목적: 상품 탐색 및 필터/정렬 제공

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  명함 인쇄  [필터][정렬]│ ← 상단 바
├─────────────────────────────┤
│  총 48개 상품               │
│  ┌──────┐ ┌──────┐         │
│  │      │ │      │         │ ← ProductCard (2열)
│  │      │ │      │         │
│  └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐         │
│  │      │ │      │         │
│  └──────┘ └──────┘         │
└─────────────────────────────┘
↓ 필터 버튼 클릭 시
┌─────────────────────────────┐
│  ╔═══════════════════════╗  │
│  ║ 필터                [X]║  │ ← BottomSheet 필터
│  ║ 용지 ▾ 코팅 ▾ 수량 ▾  ║  │
│  ║                       ║  │
│  ║  [초기화]  [적용하기]  ║  │
│  ╚═══════════════════════╝  │
└─────────────────────────────┘
```

**데스크탑 (1280px)**
```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ FilterSidebar │  │  정렬: [최신순 ▾]  총 48개   │ │
│  │               │  ├──────────────────────────────┤ │
│  │  용지         │  │ ┌──────┐┌──────┐┌──────┐    │ │
│  │  □ 스노우화이트│  │ │      ││      ││      │    │ │ ← 3열 그리드
│  │  □ 아트지     │  │ └──────┘└──────┘└──────┘    │ │
│  │               │  │ ┌──────┐┌──────┐┌──────┐    │ │
│  │  코팅         │  │ │      ││      ││      │    │ │
│  │  □ 무광       │  │ └──────┘└──────┘└──────┘    │ │
│  │  □ 유광       │  └──────────────────────────────┘ │
│  └──────────────┘                                   │
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ProductListPage (PageShell + ResponsiveGrid)
├── ListHeader
│   ├── Breadcrumb
│   ├── TotalCount
│   └── SortSelector
├── FilterSidebar (데스크탑, sticky)
│   └── FilterGroup[]
│       └── FilterOption[]
├── FilterBottomSheet (모바일, 조건부)
│   └── FilterGroup[]
├── ProductGrid (cols={2,3,4})
│   └── ProductCard[]
│       ├── ProductThumbnail
│       ├── ProductBadge (NEW/BEST)
│       ├── ProductName
│       └── ProductPrice
└── Pagination
```

### 4. Props/States

**ProductGrid Props**
```
cols: { mobile: 2, tablet: 3, desktop: 4 }
products: Product[]
```

**필터 상태**
```
activeFilters: Record<string, string[]>
sortType: "RECENT" | "BEST_SELLER" | "LOW_PRICE" | "HIGH_PRICE"
currentPage: number
```

**페이지 상태 (4가지)**
```
loading  → ProductCard 스켈레톤
success  → 그리드 렌더링
empty    → "검색 결과가 없습니다." + 필터 초기화 버튼
error    → "상품을 불러오지 못했습니다." + 재시도
```

### 5. API 매핑

```
GET /products
  params:
    categoryCode: string
    sortType: string
    filterOptions: string  // JSON 직렬화
    pageNumber: number
    pageSize: 24
  response: { items: Product[], totalCount, filterMeta }
```

### 6. 데이터 플로우

```
URL 파라미터 파싱 → 초기 필터 상태 설정
→ GET /products 호출 → 그리드 렌더링
필터 변경 → URL 업데이트 → 재호출 (debounce 300ms)
정렬 변경 → 즉시 재호출
페이지 변경 → 스크롤 상단 이동 + 재호출
```

### 7. 인터랙션 상태

- 필터 적용: URL 쿼리 반영 (뒤로가기 지원)
- 필터 초기화: 전체 필터 해제 + 재검색
- 정렬 변경: 드롭다운 선택 즉시 반영
- 상품 클릭: 상품 상세 이동

### 8. 에러 처리

- 필터 적용 후 빈 결과: "조건에 맞는 상품이 없습니다." + 필터 초기화 유도
- API 오류: 재시도 버튼
- 네트워크 오류: 오프라인 감지 메시지

### 9. 접근성

- FilterSidebar: role="complementary", aria-label="상품 필터"
- FilterOption: role="checkbox", aria-checked
- ProductGrid: role="list"
- SortSelector: aria-label="정렬 방식 선택"

---

## SCR-A10-DETAIL

**상품 상세 | SKIN | 우선순위 1 | 규모 L**

### 1. 화면 개요

- ID: SCR-A10-DETAIL
- 화면명: 상품 상세
- 분류: SKIN
- 우선순위: 1 (구매 결정 핵심 화면)
- 규모: L (3-5개 인터랙션, 탭 패널)
- 목적: 상품 정보 제공 및 장바구니 추가 유도

### 2. 와이어프레임 레이아웃

**모바일 (375px)**
```
┌─────────────────────────────┐
│ [←]  상품명                 │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │   ProductImage      │    │ ← 썸네일 스와이프
│  │   (16:9 비율)       │    │
│  └─────────────────────┘    │
│  ● ● ○ ○                   │ ← 이미지 도트
├─────────────────────────────┤
│  [BEST] 상품명              │
│  ₩ 12,000                  │ ← 가격
│  배송: 내일 도착 예정       │
├─────────────────────────────┤
│  [장바구니 담기]             │ ← AddToCartWidget (sticky)
│  [바로 주문]                │
├─────────────────────────────┤
│  [상세정보][이용후기][문의]  │ ← TabPanel
│  (탭 내용)                  │
└─────────────────────────────┘
```

**데스크탑 (1280px) - SplitLayout**
```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌───────────────────────┐│
│  │ ProductImageGallery  │  │ 상품명                ││
│  │                      │  │ ₩ 12,000              ││
│  │  [메인 이미지]       │  │                       ││
│  │                      │  │ 배송 정보             ││
│  │  [썸│썸│썸│썸]       │  │                       ││
│  │   네일 리스트        │  │ [장바구니 담기]        ││
│  └──────────────────────┘  │ [바로 주문]            ││
│                             └───────────────────────┘│
├─────────────────────────────────────────────────────┤
│  [상세정보] [이용후기 (12)] [상품문의 (3)]           │ ← TabPanel
│  탭 내용...                                          │
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
ProductDetailPage (PageShell maxWidth="xl" + SplitLayout)
├── ProductImageGallery
│   ├── MainImage (줌 기능)
│   └── ThumbnailList[]
├── ProductInfoPanel
│   ├── ProductBadges
│   ├── ProductTitle
│   ├── ProductPrice
│   ├── DeliveryInfo
│   └── AddToCartWidget
│       ├── QuantitySelector
│       ├── AddToCartButton
│       └── BuyNowButton
└── TabPanel
    ├── Tab ("상세정보")
    │   └── ProductDescription (HTML 렌더)
    ├── Tab ("이용후기")
    │   └── ReviewList (inline)
    └── Tab ("상품문의")
        └── InquiryList (inline)
```

### 4. Props/States

**ProductDetailPage Props**
```
productNo: string  // URL 파라미터
```

**AddToCartWidget 상태**
```
quantity: number
isAddingToCart: boolean
addedToCart: boolean
```

**TabPanel 상태**
```
activeTab: "detail" | "review" | "inquiry"
```

**페이지 상태 (3가지)**
```
loading  → 상품 정보 스켈레톤
success  → 전체 렌더링
error    → "상품 정보를 불러올 수 없습니다."
```

### 5. API 매핑

```
GET /products/{no}
  response: { product: ProductDetail, images: Image[], deliveryInfo }

GET /product-reviews?productNo={no}&pageSize=5
  response: { items: Review[], totalCount, avgRating }

GET /product-inquiries?productNo={no}&pageSize=5
  response: { items: Inquiry[], totalCount }
```

### 6. 데이터 플로우

```
진입 → GET /products/{no} (상품 기본 정보)
     → 이미지 갤러리 + 상품 정보 렌더링
탭 "이용후기" 클릭 → GET /product-reviews (지연 로딩)
탭 "상품문의" 클릭 → GET /product-inquiries (지연 로딩)
장바구니 추가 → POST /cart (수량 포함)
               → 성공: 장바구니 아이콘 업데이트 + 토스트
```

### 7. 인터랙션 상태

- 이미지 갤러리: 썸네일 클릭으로 메인 이미지 교체, 핀치 줌 (모바일)
- 수량 선택: +/- 버튼, 직접 입력, 최소 1 / 최대 재고 수량
- 장바구니 담기: 중복 추가 가능, 성공 토스트 3초
- 바로 주문: 로그인 확인 후 주문 페이지 이동
- 출력 상품의 경우: "옵션 선택하기" 버튼 → SCR-A10-PRINT-PRODUCT 이동

### 8. 에러 처리

- 품절 상품: AddToCartButton 비활성화, "품절" 배지
- 장바구니 추가 실패: "장바구니 추가에 실패했습니다." 토스트
- 리뷰 로딩 실패: "리뷰를 불러올 수 없습니다." (탭 내부)

### 9. 접근성

- 이미지 갤러리: aria-label="{상품명} 이미지 {N}번"
- AddToCartButton: aria-label="장바구니에 {수량}개 추가"
- TabPanel: role="tablist", aria-selected 상태 관리
- 가격: aria-label="{가격}원"

---

## SCR-A10-PRINT-PRODUCT

**출력상품 (명함/전단/포스터/스티커) | CUSTOM | 우선순위 1 | 규모 XL**

### 1. 화면 개요

- ID: SCR-A10-PRINT-PRODUCT-1 ~ 4
- 화면명: 출력상품 옵션 선택 (명함 / 전단 / 포스터 / 스티커)
- 분류: CUSTOM (shopby 기본 옵션 + 커스텀 가격 엔진)
- 우선순위: 1 (후니프린팅 핵심 차별화 화면)
- 규모: XL (5+ 상태, 엣지 케이스, 매우 상세한 스펙)
- 목적: 인쇄 옵션 마법사 + 실시간 가격 계산으로 즉시 주문 유도
- 벤치마크: Vistaprint 마법사 + Wowpress 옵션 패턴

### 2. 와이어프레임 레이아웃

**모바일 (375px) - StepIndicator 마법사**
```
┌─────────────────────────────┐
│ [←]  명함 인쇄              │
├─────────────────────────────┤
│  ①규격 > ②인쇄 > ③용지     │ ← StepIndicator
│  > ④코팅 > ⑤수량 > ⑥추가  │   (현재: 1단계)
├─────────────────────────────┤
│                             │
│  규격/사이즈 선택           │
│                             │
│  ┌──────────┐ ┌──────────┐  │
│  │ 표준명함  │ │ 미니명함  │  │ ← OptionSelector
│  │ 90×50mm  │ │ 80×45mm  │  │   (선택: 파란 테두리)
│  │  [선택]  │ │          │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │ 유럽명함  │ │ 정사각형  │  │
│  │ 85×55mm  │ │ 90×90mm  │  │
│  └──────────┘ └──────────┘  │
├─────────────────────────────┤
│  [다음 단계: 인쇄도수 →]    │ ← NextStepButton
└─────────────────────────────┘
```

**모바일 - 3단계 용지 선택 (PaperSampleCard)**
```
┌─────────────────────────────┐
│ [←]  명함 인쇄              │
├─────────────────────────────┤
│  ①② > ③용지 > ④⑤⑥        │
├─────────────────────────────┤
│  용지 선택                  │
│                             │
│  ┌──────────────────────┐   │
│  │ ┌────┐               │   │ ← PaperSampleCard
│  │ │실제│ 스노우화이트   │   │   (시각적 질감 미리보기)
│  │ │질감│ 250g           │   │
│  │ │ 이│ 깨끗하고 밝은  │   │
│  │ │미지│ 흰색 계열      │   │
│  │ └────┘ ₩ +0원         │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ ┌────┐ 아트지        │   │
│  │ │    │ 300g           │   │
│  │ └────┘ ₩ +500원       │   │
│  └──────────────────────┘   │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 예상 가격: ₩ 15,000  │   │ ← RealTimePriceWidget (sticky)
│  │ (100장 기준)         │   │
│  └─────────────────────┘    │
│  [다음: 코팅/후가공 →]       │
└─────────────────────────────┘
```

**모바일 - 5단계 수량 선택 (QuantityPricingTable)**
```
┌─────────────────────────────┐
│  수량 선택                  │
│                             │
│  수량별 단가                │
│  ┌───────────────────────┐  │
│  │ 수량   단가    합계    │  │ ← QuantityPricingTable
│  ├───────────────────────┤  │
│  │  100   ₩150  ₩15,000 │  │
│  │  200   ₩120  ₩24,000 │  │
│  │ ►500   ₩100  ₩50,000 │  │ ← 선택된 행 하이라이트
│  │ 1000   ₩80   ₩80,000 │  │
│  │ 2000   ₩60  ₩120,000 │  │
│  └───────────────────────┘  │
│                             │
│  직접 입력: [_____] 장      │
├─────────────────────────────┤
│  최종 가격: ₩ 50,000        │ ← RealTimePriceWidget
│  [장바구니 담기]             │
└─────────────────────────────┘
```

**데스크탑 (1280px) - SplitLayout**
```
┌─────────────────────────────────────────────────────┐
│  명함 인쇄 옵션 선택                                 │
├─────────────────────────────────────────────────────┤
│  ①규격 ②인쇄 ③용지 ④코팅 ⑤수량 ⑥추가            │ ← StepIndicator
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌───────────────────┐│
│  │  단계별 옵션 콘텐츠       │  │ RealTimePriceWidget││
│  │                          │  │ sticky sidebar    ││
│  │  규격/사이즈 선택         │  │                   ││
│  │  ┌──────┐ ┌──────┐       │  │ 선택 요약:        ││
│  │  │표준명함│ │미니명함│    │  │ • 규격: 표준명함  ││
│  │  └──────┘ └──────┘       │  │ • 인쇄: 단면 4도  ││
│  │  ┌──────┐ ┌──────┐       │  │ • 용지: 아트지    ││
│  │  │유럽명함│ │정사각 │    │  │ • 코팅: 무광      ││
│  │  └──────┘ └──────┘       │  │ • 수량: 500장     ││
│  │                          │  │                   ││
│  │  [← 이전]  [다음 →]       │  │ 총액: ₩ 50,000   ││
│  └──────────────────────────┘  │ [장바구니 담기]   ││
│                                └───────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 3. 컴포넌트 트리

```
PrintProductPage (PageShell maxWidth="xl" + SplitLayout)
├── PageHeader ("{상품명} 옵션 선택")
├── StepIndicator (6단계)
│   └── Step[] (완료/현재/미완료 상태)
├── WizardContent (단계별 조건부 렌더)
│   ├── Step1_SizeSelector
│   │   └── OptionSelector (규격/사이즈)
│   ├── Step2_PrintTypeSelector
│   │   └── OptionSelector (단면/양면, 단색/4도)
│   ├── Step3_PaperSelector
│   │   └── PaperSampleCard[] (질감 미리보기)
│   ├── Step4_CoatingSelector
│   │   └── OptionSelector (무광/유광/없음)
│   ├── Step5_QuantitySelector
│   │   ├── QuantityPricingTable
│   │   └── DirectQuantityInput
│   └── Step6_AdditionalOptions
│       └── OptionSelector[] (라미네이팅 등)
├── WizardNavigation
│   ├── PrevButton
│   └── NextButton (또는 AddToCartButton at step6)
└── RealTimePriceWidget (sticky)
    ├── SelectedOptionsSummary
    ├── TotalPrice (강조)
    └── AddToCartButton (데스크탑 전용)
```

### 4. Props/States

**PrintProductPage Props**
```
productNo: string       // "biz-card" | "flyer" | "poster" | "sticker"
```

**마법사 전역 상태**
```
currentStep: 1 | 2 | 3 | 4 | 5 | 6
selectedOptions: {
  size: OptionValue | null
  printType: OptionValue | null
  paper: OptionValue | null
  coating: OptionValue | null
  quantity: number | null
  additionals: OptionValue[]
}
optionDependencies: DependencyMap    // 부모 변경 시 자식 초기화 규칙
estimatedPrice: number | null
priceLoading: boolean                // RealTimePriceWidget 로딩 상태
```

**OptionSelector Props**
```
options: Option[]           // { id, label, description, priceAdjust, imageUrl? }
selected: string | null
disabled: boolean           // 이전 단계 미완료 시
onChange: (value: string) => void
```

**PaperSampleCard Props**
```
paperId: string
name: string
weight: string            // "250g", "300g"
textureImageUrl: string   // 실제 용지 질감 이미지
description: string
priceAdjust: number       // 기본가 대비 조정액
isSelected: boolean
```

**QuantityPricingTable Props**
```
tiers: PriceTier[]        // { quantity, unitPrice, totalPrice }
selectedQuantity: number | null
onChange: (quantity: number) => void
```

**RealTimePriceWidget Props**
```
selectedOptions: SelectedOptions
productNo: string
```

**상태 머신 (7가지)**
```
initial          → 1단계 진입 전 (상품 데이터 로딩)
step_loading     → 단계 옵션 데이터 로딩 중
step_ready       → 옵션 선택 대기 중
option_selected  → 옵션 선택 완료, 다음 단계 진행 가능
dependency_reset → 상위 옵션 변경으로 하위 옵션 초기화
price_calculating → 실시간 가격 계산 중 (API 호출)
price_ready      → 가격 표시 완료
```

### 5. API 매핑

```
GET /products/{no}/options
  response: {
    steps: WizardStep[],            // 6단계 정의
    dependencies: DependencyRule[], // 옵션 의존성 규칙
    quantityTiers: PriceTier[]      // 수량별 단가 테이블
  }

POST /products/{no}/price-calculate (커스텀 가격 엔진)
  body: { selectedOptions: SelectedOptions, quantity: number }
  response: { totalPrice: number, unitPrice: number, breakdown: PriceBreakdown }
  SLA: < 500ms (실시간 가격 표시 요건)
```

### 6. 데이터 플로우

```
진입
  → GET /products/{no}/options (옵션 구조 + 의존성 규칙)
  → WizardStep 구성 완료 → 1단계 표시

옵션 선택
  → selectedOptions 업데이트
  → 의존성 검사: 부모 옵션 변경 감지 시
    → 자식 옵션 null로 초기화
    → 사용자에게 경고 메시지 표시 ("용지를 변경하면 코팅 옵션이 초기화됩니다.")
  → POST /price-calculate (debounce 300ms)
  → priceLoading: true → 스피너 표시
  → priceLoading: false → RealTimePriceWidget 가격 업데이트

수량 변경 (5단계)
  → QuantityPricingTable 해당 행 하이라이트
  → DirectQuantityInput 동기화
  → POST /price-calculate 즉시 호출 (debounce 없음)

장바구니 추가
  → 전체 선택 완료 검증 (미선택 옵션 있으면 해당 단계로 이동)
  → POST /cart { productNo, selectedOptions, quantity }
  → 성공: 장바구니 토스트 + 수량 배지 업데이트
  → 실패: 에러 메시지
```

### 7. 인터랙션 상태 (5가지 핵심)

**상태 1: 옵션 의존성 초기화 경고**
```
트리거: 상위 옵션(용지) 변경 시 하위 선택(코팅) 존재하는 경우
동작:
  - 경고 모달 표시: "용지를 변경하면 코팅 옵션이 초기화됩니다. 계속하시겠습니까?"
  - [취소] → 변경 취소
  - [확인] → 하위 옵션 초기화 + 경고 없이 변경 적용
```

**상태 2: 실시간 가격 계산 (< 500ms SLA)**
```
트리거: 옵션/수량 변경 시
동작:
  - RealTimePriceWidget: 스피너 애니메이션
  - 500ms 초과 시: "가격 계산 중..." 텍스트
  - 성공: 가격 즉시 업데이트 (transition 애니메이션)
  - 실패: 이전 가격 유지 + "가격 정보를 불러오지 못했습니다."
```

**상태 3: 단계 건너뛰기 방지**
```
트리거: 미완료 단계를 StepIndicator에서 직접 클릭
동작:
  - 이전 단계 완료된 경우만 직접 이동 허용
  - 미완료 시: 해당 단계 강조 표시 + "이전 단계를 먼저 선택해주세요." 토스트
```

**상태 4: 수량 직접 입력 유효성 검증**
```
트리거: DirectQuantityInput에 숫자 입력
동작:
  - 최솟값(100) 미만: "최소 100장부터 주문 가능합니다." 경고
  - 최댓값 초과: "최대 주문 수량은 {max}장입니다." 경고
  - 유효 수량: QuantityPricingTable 해당 티어 하이라이트 + 가격 재계산
  - 비정수 입력: 자동 반올림 처리
```

**상태 5: 모바일 RealTimePriceWidget sticky 동작**
```
트리거: 모바일 스크롤 하단 70% 도달
동작:
  - 하단 sticky bar로 고정 (height: 64px)
  - 옵션 요약 + 가격 + "다음 단계" 버튼 포함
  - 스크롤 상단 복귀 시 일반 위치로 돌아감
```

### 8. 에러 처리

- 옵션 데이터 로딩 실패: "옵션 정보를 불러올 수 없습니다." + 새로고침
- 가격 계산 API 타임아웃 (> 500ms): "가격 계산 중..." 텍스트 유지, 최대 3초 후 "잠시 후 다시 시도해주세요."
- 가격 계산 실패: 이전 가격 표시 유지, 재시도 버튼
- 장바구니 담기 실패:
  - 재고 부족: "{옵션명} 옵션의 재고가 부족합니다."
  - 서버 오류: "잠시 후 다시 시도해주세요."
- 네트워크 오프라인: 선택한 옵션 로컬 저장 + 재연결 시 복원

### 9. 접근성

- StepIndicator: role="progressbar", aria-valuenow={currentStep}, aria-valuemax="6"
- Step: aria-current="step" (현재 단계), aria-disabled (미완료 단계)
- OptionSelector: role="radiogroup", 각 옵션은 role="radio"
- PaperSampleCard: aria-label="{용지명} {무게} 선택, 추가 {금액}원"
- QuantityPricingTable: role="table", 선택 행 aria-selected="true"
- RealTimePriceWidget: aria-live="polite" (가격 변경 시 스크린리더 알림)
- 경고 모달: role="alertdialog", aria-describedby="경고 내용"

### 4가지 상품 타입 변경 사항

모든 단계 구조와 컴포넌트 트리는 동일. 상품별 차이점:

| 항목 | 명함 (PRINT-1) | 전단 (PRINT-2) | 포스터 (PRINT-3) | 스티커 (PRINT-4) |
|------|--------------|--------------|----------------|----------------|
| productNo | biz-card | flyer | poster | sticker |
| 기본 규격 | 90×50mm | A4/A5/B5 | A4~A0 | 자유 규격 |
| 인쇄도수 | 단면/양면 4도 | 단면/양면 4도 | 단면 4도 | 단면 4도 |
| 용지 타입 | 아트지/스노우 | 아트지/모조지 | 포스터지/광택지 | 비닐/일반지 |
| 수량 최솟값 | 100장 | 50장 | 10장 | 100장 |
| 추가 옵션 | 라운드 코너 | 접지 방식 | 없음 | 칼선/홀 |

---

## SCR-A10-PACKAGING

**포장재 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-A10-PACKAGING
- 화면명: 포장재 상품 상세
- 분류: SKIN (shopby 표준 상품 상세 + 간소화된 옵션)
- 우선순위: 2
- 규모: M

### 2. 와이어프레임 레이아웃

SCR-A10-DETAIL 동일 SplitLayout 적용.
옵션 선택 영역: ProductConfigurator (간소화 — 1-2단계 드롭다운, 마법사 없음)

### 3. 컴포넌트 트리

```
PackagingDetailPage (PageShell maxWidth="xl" + SplitLayout)
├── ProductImageGallery
├── ProductInfoPanel
│   ├── ProductTitle / Price
│   ├── ProductConfigurator (간소화)
│   │   ├── OptionDropdown ("사이즈")
│   │   └── OptionDropdown ("수량")
│   └── AddToCartWidget
└── TabPanel (상세정보 / 리뷰 / 문의)
```

### 4-9. Props/States / API / 플로우 / 인터랙션 / 에러 / 접근성

- SCR-A10-DETAIL 스펙 준용
- 옵션 선택: 드롭다운 방식 (마법사 불필요)
- API: `GET /products/{no}` (표준 shopby)
- 가격 계산: 옵션 변경 시 즉시 갱신 (shopby 표준)

---

## SCR-A10-GOODS

**굿즈+파우치백 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-A10-GOODS
- 화면명: 굿즈 + 파우치백 상품 상세
- 분류: SKIN
- 우선순위: 2
- 규모: M

### 2-9. 와이어프레임 / 컴포넌트 / API / 플로우

SCR-A10-PACKAGING 동일 패턴 적용.

차이점:
- ProductConfigurator: 색상 + 사이즈 선택 (색상 스와치 UI)
- 색상 선택 시 메인 이미지 교체 (색상별 이미지)
- 컴포넌트: `ColorSwatchSelector` 추가

---

## SCR-A10-HANDMADE

**수작 상품 | SKIN | 우선순위 2 | 규모 M**

### 1. 화면 개요

- ID: SCR-A10-HANDMADE
- 화면명: 수작 상품 상세
- 분류: SKIN (shopby 표준 상품 상세)
- 우선순위: 2
- 규모: M

### 2-9. 와이어프레임 / 컴포넌트 / API / 플로우

SCR-A10-DETAIL 패턴 준용 (가장 단순한 형태).

차이점:
- 옵션 선택 없음 (수량만 선택)
- ProductDetail (옵션 없는 단순 상세 뷰)
- 수작 제작 안내 배너 추가: "개별 수작업으로 제작되어 소요기간 7-14일"
- API: `GET /products/{no}` 표준 응답
