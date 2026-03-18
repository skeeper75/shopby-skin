# SPEC-LAYOUT-001 Implementation Plan

## 개요

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-LAYOUT-001 |
| 제목 | shopby-skin 반응형 레이아웃 시스템 구축 |
| 총 Phase | 4 (Foundation → Migration → Enhancement → Polish) |
| 총 요구사항 | 14개 (R01~R14) |
| 예상 수정 파일 | ~68개 (신규 8 + 수정 60) |

---

## Phase 1: Foundation (기반 구축)

### 목적
반응형 레이아웃의 토대가 되는 디자인 토큰과 레이아웃 프리미티브 컴포넌트를 생성한다.

### 작업 순서

#### Step 1.1: 반응형 토큰 생성 (R01, R04)

**대상 파일 (신규):**
- `src/design-system/tokens/breakpoints.css`
- `src/design-system/tokens/responsive.css`

**작업 내용:**
1. breakpoints.css에 브레이크포인트 CSS 커스텀 프로퍼티 정의
2. responsive.css에 반응형 타이포그래피 유틸리티 클래스 정의
3. tokens/index.css에 두 파일 import 추가

**설계:**

```css
/* breakpoints.css */
:root {
  --huni-breakpoint-sm: 640px;
  --huni-breakpoint-md: 768px;
  --huni-breakpoint-lg: 1024px;
  --huni-breakpoint-xl: 1280px;

  --huni-container-sm: 640px;
  --huni-container-md: 768px;
  --huni-container-lg: 1024px;
  --huni-container-xl: 1280px;

  --huni-padding-mobile: 16px;
  --huni-padding-tablet: 24px;
  --huni-padding-desktop: 32px;
}
```

```css
/* responsive.css */
.huni-heading-xl {
  font-size: clamp(20px, 2vw + 12px, 28px);
  line-height: 1.2;
  font-weight: var(--huni-typo-weight-bold);
}
.huni-heading-lg {
  font-size: clamp(18px, 1.5vw + 12px, 24px);
  line-height: 1.3;
  font-weight: var(--huni-typo-weight-bold);
}
.huni-heading-md {
  font-size: clamp(16px, 1vw + 12px, 20px);
  line-height: 1.4;
  font-weight: var(--huni-typo-weight-medium);
}
.huni-body-lg { font-size: clamp(14px, 0.5vw + 12px, 16px); }
.huni-body-md { font-size: clamp(13px, 0.3vw + 12px, 14px); }
.huni-body-sm { font-size: clamp(11px, 0.2vw + 10px, 12px); }
```

#### Step 1.2: 레이아웃 프리미티브 생성 (R02, R03)

**대상 파일 (신규):**
- `src/components/layout/PageShell.jsx`
- `src/components/layout/ResponsiveGrid.jsx`
- `src/components/layout/SplitLayout.jsx`
- `src/components/layout/FormLayout.jsx`
- `src/components/layout/index.js`

**PageShell 설계:**

```jsx
const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',    // 384px - 인증 카드
  md: 'max-w-md',    // 448px
  lg: 'max-w-lg',    // 512px
  xl: 'max-w-xl',    // 576px
  '2xl': 'max-w-2xl', // 672px
  '3xl': 'max-w-3xl', // 768px
  '4xl': 'max-w-4xl', // 896px - 폼 페이지
  '5xl': 'max-w-5xl', // 1024px - 주문/장바구니
  '6xl': 'max-w-6xl', // 1152px
  '7xl': 'max-w-7xl', // 1280px - 메인/카탈로그
  full: 'max-w-full',
};

const PADDING_MAP = {
  none: '',
  sm: 'px-4',
  responsive: 'px-4 md:px-6 lg:px-8',
};
```

**SplitLayout 설계 (장바구니/주문서 2단 레이아웃):**

```jsx
// 모바일: 스택 / 데스크톱: 좌우 분할
<SplitLayout
  main={<CartItems />}       // 좌측 (lg:col-span-8)
  aside={<OrderSummary />}   // 우측 (lg:col-span-4, sticky)
  asideSticky={true}
/>
```

**ResponsiveGrid 설계:**

```jsx
<ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="huni-3">
  {products.map(p => <ProductCard key={p.id} />)}
</ResponsiveGrid>
```

#### Step 1.3: Tailwind 설정 업데이트

**대상 파일 (수정):**
- `tailwind.config.js` - container 설정 추가 (선택적)

### Phase 1 의존성 그래프

```
breakpoints.css ──┐
responsive.css ───┤
                  ├── tokens/index.css (수정)
                  │
PageShell.jsx ────┤
ResponsiveGrid ───┤
SplitLayout.jsx ──┤── layout/index.js (신규)
FormLayout.jsx ───┘
```

---

## Phase 2: Migration (핵심 페이지 마이그레이션)

### 목적
상거래 핵심 페이지에 반응형 레이아웃을 적용하고 react-device-detect를 제거한다.

### 작업 순서

#### Step 2.1: react-device-detect 마이그레이션 (R05)

**마이그레이션 패턴:**

패턴 A - React 컴포넌트 내부:
```jsx
// Before
import { isMobile } from 'react-device-detect';
const Foo = () => { if (isMobile) ... }

// After
import useResponsive from '../../hooks/useResponsive';
const Foo = () => { const { isMobile } = useResponsive(); if (isMobile) ... }
```

패턴 B - 유틸리티 함수 (비-React):
```jsx
// Before (utils/api.js)
import { isMobile } from 'react-device-detect';
export const getPlatformType = () => isMobile ? 'MOBILE_WEB' : 'PC';

// After - 인자로 전달받는 패턴
export const getPlatformType = (isMobile) => isMobile ? 'MOBILE_WEB' : 'PC';

// 또는 - matchMedia 직접 사용
export const getIsMobile = () => window.matchMedia('(max-width: 767px)').matches;
```

**파일별 마이그레이션 계획:**

| 순번 | 파일 | 패턴 | 위험도 | 비고 |
|------|------|------|--------|------|
| 1 | utils/domain.js | B | 낮음 | 유틸리티 |
| 2 | utils/api.js | B | 낮음 | 유틸리티 |
| 3 | utils/common.js | B | 낮음 | 유틸리티 |
| 4 | Meta.jsx | A | 낮음 | 메타 태그 |
| 5 | Meta/utils.js | B | 낮음 | 유틸리티 |
| 6 | IntroPageRoute.jsx | A | 낮음 | 라우터 |
| 7 | Netfunnel.jsx | A | 중간 | 외부 서비스 |
| 8 | Cart.jsx | A | **높음** | 핵심 상거래 |
| 9 | OrderSheet.jsx | A | **높음** | 핵심 상거래 |
| 10 | ProductDetail.jsx | A | **높음** | 핵심 상거래 |
| 11 | OrderConfirm.jsx | A | 중간 | 주문 완료 |
| 12 | OrderSheetAppCard.jsx | A | 중간 | 결제 |
| 13-15 | AppCardAuthenticate/*.jsx | A | 중간 | 앱카드 |

#### Step 2.2: Cart 반응형 레이아웃 (R07)

**현재 구조:**
```
Cart.jsx → CartContent
├── CartTopSelectManager (전체 선택)
├── DeliverySection (배송별 상품 목록)
├── CartPriceTag (가격 요약)
└── FixedOrderBtn (고정 주문 버튼)
```

**목표 구조 (데스크톱):**
```
PageShell maxWidth="5xl"
└── SplitLayout
    ├── main: CartTopSelectManager + DeliverySection
    └── aside (sticky): CartPriceTag + 주문 버튼
```

#### Step 2.3: OrderSheet 반응형 레이아웃 (R08)

**목표 구조 (데스크톱):**
```
PageShell maxWidth="5xl"
└── SplitLayout
    ├── main: 배송지 + 상품 + 결제수단
    └── aside (sticky): 결제금액 요약 + 결제 버튼
```

#### Step 2.4: 페이지 컨테이너 통일 (R06)

모든 페이지에 PageShell 래퍼 적용.
기존 Layout 컴포넌트의 렌더 경로에서 적용하는 방안도 검토.

---

## Phase 3: Enhancement (보조 페이지 개선)

### Step 3.1: ProductDetail 개선 (R09)
- 이미지 + 구매 옵션 SplitLayout 적용
- 탭 콘텐츠 전체 너비

### Step 3.2: MyPage 개선 (R10)
- 데스크톱: 좌측 사이드바 + 우측 콘텐츠
- 대시보드 카드 ResponsiveGrid

### Step 3.3: 인증 페이지 (R11)
- 중앙 정렬 카드 레이아웃 (max-w-md)
- SignIn, SignUp, FindId, FindPassword, ChangePassword

### Step 3.4: 폼 레이아웃 (R12)
- FormLayout 컴포넌트 적용
- Claim, MemberModification 페이지

---

## Phase 4: Polish (마무리)

### Step 4.1: 반응형 간격 (R13)
- 섹션/카드 간격 반응형 유틸리티 클래스

### Step 4.2: 레이아웃 검증 (R14)
- Storybook viewport 프리셋
- 글로벌 overflow-x: hidden
- 핵심 페이지 viewport 스토리

---

## 에이전트 배정 계획

| Phase | 에이전트 | 역할 |
|-------|---------|------|
| Phase 1 | expert-frontend | 토큰 + 레이아웃 컴포넌트 구현 |
| Phase 2 | expert-refactoring | react-device-detect 마이그레이션 |
| Phase 2 | expert-frontend | 페이지 레이아웃 적용 |
| Phase 3 | expert-frontend | 보조 페이지 레이아웃 |
| Phase 4 | expert-testing | Storybook viewport 스토리 |
| 전 Phase | manager-quality | TRUST 5 검증 |

## 위험 관리

| 위험 | 영향 | 확률 | 완화 전략 |
|------|------|------|----------|
| 레거시 CSS 충돌 | 높음 | 중간 | Tailwind important 또는 CSS layer 격리 |
| react-device-detect 동작 차이 | 높음 | 높음 | 각 파일별 개별 테스트 |
| @shopby/react-components 내부 CSS 충돌 | 중간 | 낮음 | 래퍼 컴포넌트로 격리 |
| 기존 기능 회귀 | 높음 | 중간 | Phase별 빌드 검증, characterization 테스트 |
| preflight: false 상태에서의 Tailwind 동작 | 중간 | 낮음 | globals.css에 필요한 리셋만 수동 추가 |
