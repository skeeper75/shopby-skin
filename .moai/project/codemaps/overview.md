# shopby.skin 프로젝트 개요

## 프로젝트 정보

**프로젝트 명**: @shopby/react-skin v1.16.5 (Aurora Skin)
**설명**: Shopby 전자상거래 플랫폼을 위한 인쇄업 특화 스킨
**용도**: 단일 페이지 애플리케이션(SPA) - 고객 쇼핑 + 관리자 시스템 통합

## 핵심 통계

| 항목 | 수량 | 비고 |
|------|------|------|
| 총 JS/JSX 파일 | 826개 | src/ 기준 |
| 컴포넌트 디렉토리 | 93개 | 레이아웃, 상품, UI, 관리자 포함 |
| 디자인 시스템 컴포넌트 | 26개 | 원자(8) + 분자(9) + 유기체(6) + 유틸(3) |
| 페이지 | 45개 (고객) + 13개+ (관리자) | 라우팅 설정됨 |
| 라우트 정의 | 100+ | React Router v6 |
| 관리자 서비스 모듈 | 14개 | 비즈니스 로직 캡슐화 |
| 커스텀 훅 | 12개 | usePrintOptionsV2 포함 |

## 기술 스택

### 핵심 프레임워크
- **React**: 18.2.0
- **React Router**: v6.4.3 (클라이언트 라우팅)
- **Tailwind CSS**: 3.4.19 (유틸리티 우선 CSS)

### UI & 컴포넌트
- **Radix UI**: 10+ 패키지 (Headless 컴포넌트)
- **CVA**: Class Variance Authority (클래스 변수 관리)
- **Lucide React**: 0.577.0 (아이콘)
- **shadcn/ui**: 파생 컴포넌트 라이브러리

### 상태 관리 및 데이터
- **Context API**: 전역 상태 관리 (Redux 미사용)
- **@shopby/react-components**: Provider 체인 (10+)
- **@shopby/shared**: 공유 유틸 및 API 설정

### 차트 및 시각화
- **Recharts**: 3.8.0 (통계 대시보드)
- **Mermaid**: 다이어그램 (필요시)

### 국제화 및 날짜
- **i18next**: 22.0.6 (i18n 코어)
- **i18next-browser-languagedetector**: 브라우저 언어 자동 감지
- **Dayjs**: 1.11.7 (날짜 처리)

### 빌드 및 개발
- **Webpack**: 5.75.0 (번들러)
- **Babel**: 7 (JS 트랜스파일)
- **Vitest**: 3.2.4 (테스트 프레임워크)
- **ESLint**: 코드 검사
- **Prettier**: 코드 포맷팅

### 보안 및 유틸
- **DOMPurify**: 3.0.1 (XSS 방지)
- **js-cookie**: 3.0.1 (쿠키 관리)
- **lodash-es**: 4.17.21 (유틸리티)
- **Playwright**: 1.58.2 (E2E 테스트)

## 아키텍처 패턴

### 1. 계층화된 아키텍처
```
┌────────────────────────────────┐
│  Pages/UI Layer (45+13 페이지)  │
├────────────────────────────────┤
│  Components (93 디렉토리)       │
│  + Design System (26)           │
├────────────────────────────────┤
│  Custom Hooks (12개)            │
├────────────────────────────────┤
│  Services (14개 관리자 모듈)    │
├────────────────────────────────┤
│  API Layer (api.js)             │
├────────────────────────────────┤
│  @shopby/* (컴포넌트 + 공유)    │
└────────────────────────────────┘
```

### 2. 원자 설계 방법론 (Atomic Design)
- **Atoms** (8개): BadgeLabel, Icon, Skeleton, Checkbox, RadioGroup, Switch, Chip, ColorChip
- **Molecules** (9개): OptionLabel, SizeOptionChip, RadioOption, DropdownSelect, CounterOption, SizeInput, QuantityInput, CTAButton, Field, TextField
- **Organisms** (6개): CollapsibleSection, PriceSummary, Dialog, Snackbar, SnackbarProvider, Pagination
- **Utilities** (3개): cn (클래스 병합), createSlotRecipeContext, focusRing

### 3. 도메인 기반 컴포넌트 구조
```
components/
├── admin/              # 관리자 컴포넌트 + 서브디렉토리
├── product/            # 상품 관련 (PrintConfigurator 등) - NEW
├── ui/                 # shadcn/ui 기반 프리미티브 - NEW
├── Layout/             # 레이아웃 컴포넌트
└── [기타 85개]         # 전자상거래 기능 컴포넌트
```

### 4. Context 기반 전역 상태
- **MallProvider**: 쇼핑몰 정보
- **AuthProvider**: 인증/회원 정보
- **CartProvider**: 장바구니 상태
- **ModalProvider**: 모달/알림
- **OrderConfigProvider**: 주문 설정
- **ProductDetailProvider**: 상품 상세
- **BannerProvider**: 배너 데이터

## 디렉토리 구조

```
src/
├── __tests__/                    # 테스트
├── api/                          # API 계층
│   ├── api.js                   # 메인 HTTP 클라이언트
│   ├── printPrice.js            # 인쇄 가격 API
│   └── custom/                  # 커스텀 API
├── components/                   # 93개 컴포넌트 디렉토리
│   ├── admin/                   # 관리자 + 서브 (board, coupon, member, etc)
│   ├── product/                 # 상품 컴포넌트 (NEW)
│   ├── ui/                      # UI 프리미티브 (NEW)
│   └── Layout/                  # 레이아웃
├── constants/                    # 상수 및 i18n
├── design-system/                # 26개 컴포넌트 + 토큰
│   ├── components/
│   │   ├── atoms/              # 8개
│   │   ├── molecules/          # 9개
│   │   └── organisms/          # 6개
│   ├── tokens/                 # CSS 토큰
│   └── utils/                  # 유틸리티
├── hooks/                        # 12개 커스텀 훅
├── lib/                          # 공유 유틸 (cn, 포맷팅 등)
├── pages/                        # 45+13 페이지
│   ├── ProductDetail/           # 상품 상세 (확장)
│   ├── Cart/                    # 장바구니 (NEW)
│   ├── OrderSheet/              # 주문서 (NEW)
│   └── admin/                   # 13개+ 관리자 페이지
├── router/                       # React Router 설정
├── services/admin/               # 14개 비즈니스 로직 모듈
├── types/                        # 타입 정의 (print-options NEW)
├── utils/                        # 12개 유틸리티
├── App.jsx                       # 루트 컴포넌트 (Provider 체인)
├── index.js                      # 진입점 (환경 초기화)
└── i18n.js                       # i18next 설정
```

## SPEC 이행 현황

| SPEC ID | 범위 | 상태 | 설명 |
|---------|------|------|------|
| SPEC-SKIN-001 | 인증/회원가입 | ✅ 완료 | SignIn, SignUp, FindId, FindPassword |
| SPEC-SKIN-002 | 마이페이지 | ✅ 완료 | MyPage + 7개 서브 경로 |
| SPEC-SKIN-003 | 비밀번호 변경 | ✅ 완료 | ChangePassword 페이지 |
| SPEC-SKIN-004 | 고객센터/안내 | ✅ 완료 | CustomerCenter, FAQ, Notice |
| SPEC-SKIN-005 | 관리자 코어 | ✅ 완료 | AdminLayout, AdminDashboard, Auth |
| SPEC-SKIN-006 | 상품관리 | ✅ 완료 | Product list/detail 관리 |
| SPEC-SKIN-007 | 게시판/회원/쿠폰 | ✅ 완료 | Board, Member, Coupon 관리 |
| SPEC-SKIN-008 | 거래처/원장/통계 | ✅ 완료 | Accounting, Statistics, Vendor |
| SPEC-SKIN-009 | Playwright 자동 분석기 | ✅ 완료 | E2E 테스트 스크립트 (6개) |

## 주요 특징

### 고객 쇼핑 경험
- **45개 고객 페이지**: 홈, 상품 상세, 장바구니, 주문, 마이페이지, 인증 등
- **반응형 디자인**: 모바일/PC 자동 감지
- **인쇄업 특화**: 인쇄 옵션, 가격 계산기, 파일 업로드
- **다국어 지원**: i18n 기반 언어 자동 감지

### 관리자 시스템
- **13개+ 관리자 페이지**: 대시보드, 상품, 회원, 주문, 통계 등
- **14개 서비스 모듈**: 비즈니스 로직 캡슐화
- **거래처/회계 관리**: SPEC-SKIN-008에서 추가
- **통계 대시보드**: Recharts 기반 시각화

### 개발 효율성
- **코드 분할**: 모든 페이지 lazy 로드
- **디자인 시스템**: 재사용 가능한 26개 컴포넌트
- **타입 안전성**: TypeScript 미사용 (지속적 개선 예정)
- **자동 테스트**: Vitest + Playwright E2E

## 개발 원칙

### 컴포넌트 설계
- 단일 책임 원칙(SRP)
- 재사용 가능한 원자 설계
- Props 기반 인터페이스

### 상태 관리
- Context API (Redux 미사용)
- 커스텀 훅으로 로직 캡슐화
- 부작용 최소화

### 코드 조직
- 도메인별 폴더 구조
- 공유 컴포넌트는 design-system으로 집중
- 서비스 계층으로 비즈니스 로직 분리

### 성능 최적화
- 코드 분할 및 lazy 로드
- 이미지 최적화
- React.memo, useMemo, useCallback 활용
- 캐싱 전략 (BannerProvider 180초 메모리 캐시)

## 다음 단계

자세한 정보:
- **modules.md**: 각 모듈의 책임 및 주요 파일
- **entry-points.md**: 애플리케이션 진입점 및 라우팅
- **data-flow.md**: 데이터 흐름 및 상태 관리
- **dependencies.md**: 모듈 간 의존성 그래프
