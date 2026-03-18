# 프로젝트 구조 - Aurora Skin

---

## 최상위 디렉토리 구성

```
shopby.skin/
├── ref/aurora-skin-main/      # 소스 참조 (실제 작업 대상)
│   ├── public/                # 정적 파일 및 환경 설정
│   ├── src/                   # 소스 코드 루트
│   ├── config/                # 빌드 설정 파일
│   ├── .vendors/              # @shopby 벤더링 패키지 (.tgz)
│   ├── scripts/               # 빌드/배포 유틸리티 스크립트
│   ├── vercel.json            # Vercel 배포 설정
│   ├── .eslintrc.json         # ESLint 설정
│   ├── .prettierrc.json       # Prettier 설정
│   ├── babel.config.js        # Babel 변환 설정
│   ├── webpack.config.js      # Webpack 번들러 설정
│   └── package.json           # 패키지 의존성
```

---

## `public/` 디렉토리

```
public/
├── environment.json           # 런타임 환경 설정 (clientId, profile, tc)
├── index.html                 # SPA 기반 HTML 엔트리
└── assets/                    # 빌드 후 복사되는 정적 자산
```

**역할**: 브라우저에서 직접 접근하는 정적 파일을 보관합니다. `environment.json`은 배포 환경별로 교체하는 방식으로 클라이언트 ID와 API 엔드포인트를 주입합니다.

---

## `src/` 디렉토리 (소스 코드 루트)

```
src/
├── index.js                   # React 앱 마운트 엔트리포인트
├── App.jsx                    # 루트 컴포넌트 (Provider 체인 구성)
├── i18n.js                    # i18next 초기화 및 언어 설정
├── assets/                    # 스타일 및 이미지 자산
├── components/                # 재사용 가능한 UI 컴포넌트 (75개)
├── pages/                     # 페이지 레벨 컴포넌트 (35개)
├── router/                    # React Router 라우팅 설정
├── hooks/                     # 커스텀 React Hooks (5개)
├── utils/                     # 공통 유틸리티 함수
└── constants/                 # 상수 정의 및 i18n 번역 키
```

---

## 각 디렉토리의 역할 설명

### `src/assets/`

```
assets/
├── css/                       # 전역 스타일, 레이아웃 CSS
│   ├── reset.css              # CSS 초기화
│   ├── variables.css          # CSS 변수 (테마 색상, 간격 등)
│   └── common.css             # 공통 스타일
└── images/                    # 아이콘, 기본 이미지
```

**역할**: 전역 CSS 스타일과 이미지 자원을 관리합니다. CSS 변수(`--primary-color` 등)를 통해 테마 커스터마이징이 가능하도록 설계되어 있습니다.

---

### `src/components/`

재사용 가능한 UI 컴포넌트를 도메인별로 분류하여 보관합니다. 75개 컴포넌트 디렉토리가 존재하며, 각 디렉토리는 `index.jsx`와 관련 CSS 파일로 구성됩니다.

주요 컴포넌트 카테고리:

| 카테고리 | 예시 컴포넌트 | 설명 |
|---------|-------------|------|
| Layout | Header, Footer, Nav | 공통 레이아웃 구성 요소 |
| Product | ProductList, ProductCard, ProductDetail | 상품 표시 컴포넌트 |
| Cart | CartItem, CartSummary | 장바구니 UI |
| Order | OrderForm, PaymentMethod | 주문 폼 컴포넌트 |
| User | LoginForm, SignupForm | 인증 관련 폼 |
| Common | Modal, Button, Input, Loading | 공통 UI 요소 |
| Banner | AdminBanner, CustomBanner | 배너 표시 |
| Popup | DesignPopup | 디자인 팝업 |
| **Admin** | AdminLayout, AdminSidebar, DataTable, StatusBadge, SearchBar, DatePicker, BulkActionBar, FilePreview, OrderDetailPanel, PrintSheet, SMSDialog, StatCard | **관리자 백오피스 UI (SPEC-SKIN-005)** |

---

### `src/pages/`

React Router와 연결되는 페이지 단위 컴포넌트를 보관합니다. 35개 페이지 디렉토리가 존재합니다.

주요 페이지 구성:

```
pages/
├── Main/                      # 메인(홈) 페이지
├── ProductList/               # 상품 목록 페이지
├── ProductDetail/             # 상품 상세 페이지
├── Search/                    # 검색 결과 페이지
├── Cart/                      # 장바구니 페이지
├── Order/                     # 주문서 작성 페이지
│   └── OrderSheet/            # 주문서 상세
├── MyPage/                    # 마이페이지 (서브 라우트 포함)
│   ├── OrderList/             # 주문 내역
│   ├── OrderDetail/           # 주문 상세
│   ├── Inquiry/               # 1:1 문의
│   ├── Review/                # 리뷰 관리
│   ├── Coupon/                # 쿠폰 목록
│   ├── Accumulation/          # 적립금
│   ├── Likes/                 # 찜 목록
│   └── ShippingAddress/       # 배송지 관리
├── Auth/
│   ├── SignIn/                # 로그인 페이지
│   └── SignUp/                # 회원가입 페이지
├── Claims/                    # 클레임(환불/반품) 페이지
├── CustomerCenter/            # 고객센터
├── FAQ/                       # 자주 묻는 질문
├── Notice/                    # 공지사항
└── admin/                     # 관리자 백오피스 (SPEC-SKIN-005)
    ├── Login/                 # 관리자 로그인
    ├── Dashboard/             # 대시보드 (현황 카드 + 최근 주문)
    ├── Members/               # 관리자 등록/관리
    ├── Orders/                # 주문 목록 (DataTable)
    ├── FileCheck/             # 파일확인 처리
    ├── StatusChange/          # 주문상태 변경
    ├── PrintOrders/           # 주문서 출력
    ├── DeferredPayment/       # 후불결제 관리
    ├── Receipts/              # 증빙서류 관리
    └── SMS/                   # SMS/알림톡 발송
```

---

### `src/router/`

React Router 6.4.3의 `createBrowserRouter`를 사용한 라우팅 설정을 담당합니다.

```
router/
├── index.js                   # 라우터 인스턴스 생성 및 내보내기
└── routes.js                  # 라우트 정의 (경로 - 페이지 컴포넌트 매핑)
```

**역할**: URL 경로와 페이지 컴포넌트를 연결합니다. 중첩 라우트(Nested Routes)를 활용하여 MyPage 서브 페이지들의 공통 레이아웃을 공유합니다.

---

### `src/hooks/`

React 상태 로직을 재사용 가능하게 추출한 커스텀 훅 5개가 위치합니다.

```
hooks/
├── useAuth.js                 # 인증 상태 접근 훅
├── useMall.js                 # 몰 설정 정보 접근 훅
├── useModal.js                # 모달 제어 훅
├── useCart.js                 # 장바구니 상태 훅
├── useScroll.js               # 스크롤 이벤트 처리 훅
└── useAdminAuth.js            # 관리자 인증 상태 훅 (SPEC-SKIN-005)
```

**역할**: 컴포넌트에서 반복되는 상태 로직을 훅으로 분리하여 코드 재사용성을 높입니다.

---

### `src/utils/`

순수 함수 형태의 공통 유틸리티가 모여 있습니다.

```
utils/
├── api.js                     # fetchHttpRequest() - 전역 API 호출 함수
├── common.js                  # 범용 헬퍼 함수 (포맷, 검증 등)
├── date.js                    # 날짜 포맷 및 계산 유틸리티
├── storage.js                 # localStorage/sessionStorage 래퍼
└── validation.js              # 입력값 검증 함수
```

**핵심 파일 - `api.js`**: 모든 API 호출의 중앙 진입점입니다. 다음 기능을 담당합니다:
- 공통 요청 헤더 설정 (Authorization, Content-Type)
- HTTP 401 응답 시 토큰 자동 갱신 후 원본 요청 재시도
- 에러 응답 표준화

---

### `src/constants/`

하드코딩을 피하기 위한 상수 및 i18n 번역 데이터를 보관합니다.

```
constants/
├── index.js                   # 전역 상수 (API 경로, 상태 코드 등)
├── translations/
│   └── ko.json                # 한국어 번역 키-값 쌍
└── errorCodes.js              # API 에러 코드 매핑
```

---

### `config/` 디렉토리 (프로젝트 루트)

빌드 도구 설정 파일들이 위치합니다.

```
config/
├── webpack.dev.js             # 개발 서버 설정 (HMR, source map)
├── webpack.prod.js            # 프로덕션 빌드 설정 (최적화, 압축)
└── .env.*                     # 환경별 환경 변수 파일
```

---

## 앱 초기화 흐름 (진입점 추적)

```
src/index.js
  └── src/App.jsx
        └── Provider 체인 (10단계)
              └── Layout 컴포넌트
                    └── React Router (createBrowserRouter)
                          └── 각 페이지 컴포넌트 렌더링
```

---

## 컴포넌트 아키텍처 패턴

### 1. 중첩 Provider 패턴
`App.jsx`에서 전역 상태를 Context API Provider로 계층화합니다. 하위 컴포넌트는 `useContext` 또는 커스텀 훅을 통해 필요한 상태에만 접근합니다.

### 2. 페이지-컴포넌트 분리
- **Pages**: 라우트와 연결, 데이터 페칭 및 상태 관리 담당
- **Components**: 순수 UI 표현, Props를 통한 데이터 수신, 재사용성 극대화

### 3. 커스텀 훅을 통한 로직 분리
비즈니스 로직과 UI 로직을 분리하여 페이지 컴포넌트를 간결하게 유지합니다.

### 4. 모듈별 CSS 구성
각 컴포넌트 디렉토리에 동명의 CSS 파일을 함께 두어 스타일의 지역성(locality)을 확보합니다.

---

## 주요 파일 위치 요약

| 파일 | 경로 | 용도 |
|------|------|------|
| 앱 진입점 | `src/index.js` | React DOM 렌더링 |
| 루트 컴포넌트 | `src/App.jsx` | Provider 체인, 글로벌 레이아웃 |
| API 유틸리티 | `src/utils/api.js` | 전역 HTTP 통신 |
| i18n 설정 | `src/i18n.js` | 다국어 초기화 |
| 환경 설정 | `public/environment.json` | 런타임 환경 변수 |
| Webpack 설정 | `webpack.config.js` | 빌드 진입점 |
| ESLint 설정 | `.eslintrc.json` | 코드 품질 규칙 |
