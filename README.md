# shopby.skin - Aurora Skin

**인쇄업 특화 전자상거래 플랫폼**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-6.4.3-red?logo=reactrouter)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.19-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-1.x-gray?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+)](https://www.radix-ui.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58.2-green?logo=playwright)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

**Version:** 1.16.5 | **Release Date:** 2026-01-22

---

## 프로젝트 개요

**shopby.skin**은 shopby 엔터프라이즈 플랫폼을 기반으로 한 현대적인 인쇄업 특화 전자상거래 스킨입니다. React 18 기반의 SPA(Single Page Application)로 구축되었으며, 고객 쇼핑 경험과 관리자 기능을 포괄적으로 제공합니다.

### 핵심 특징

- **고객 대면**: 45개 이상의 쇼핑 페이지로 인쇄상품 탐색, 주문, 결제 지원
- **관리자 대시보드**: 13개 이상의 관리 페이지로 상품, 주문, 회원, 통계 관리
- **현대 기술 스택**: React 18, Tailwind CSS 3.4, Radix UI 기반의 반응형 설계
- **성능 최적화**: 코드 스플리팅, 지연 로딩, 메모리 최적화 구현
- **접근성**: WCAG 2.1 준수, Radix UI의 완전한 접근성 지원
- **다국어 지원**: i18next 기반의 국제화 프레임워크

---

## 아키텍처 개요

```mermaid
graph TD
    subgraph "클라이언트 계층"
        A["index.js<br/>애플리케이션 진입점"]
        B["App.jsx<br/>루트 컴포넌트"]
        C["React Router<br/>라우팅 엔진"]
    end

    subgraph "페이지 계층 45+"
        D1["고객 페이지<br/>상품/주문/마이페이지"]
        D2["관리자 페이지<br/>대시보드/관리"]
    end

    subgraph "컴포넌트 계층 93개"
        E1["레이아웃 컴포넌트<br/>헤더/푸터/사이드바"]
        E2["기능 컴포넌트<br/>상품/장바구니/결제"]
        E3["UI 컴포넌트<br/>버튼/입력/모달"]
    end

    subgraph "디자인 시스템 26개"
        F1["원자 구성요소<br/>배지/라벨/아이콘"]
        F2["분자 구성요소<br/>버튼/입력/드롭다운"]
        F3["생물 구성요소<br/>섹션/요약/폼"]
    end

    subgraph "토큰 및 스타일"
        G["색상 토큰"]
        H["타이포그래피 토큰"]
        I["간격 토큰"]
        J["반경 토큰"]
        K["그림자 토큰"]
        L["애니메이션 토큰"]
    end

    subgraph "상태 관리 10+"
        M["Context Provider<br/>전역 상태 관리"]
        N["커스텀 훅<br/>재사용 가능한 로직"]
    end

    subgraph "API 레이어"
        O["services/admin<br/>14개 API 서비스"]
        P["utils/api.js<br/>HTTP 클라이언트"]
        Q["Shopby REST API<br/>백엔드 서버"]
    end

    A --> B
    B --> C
    C --> D1
    C --> D2
    D1 --> E1
    D1 --> E2
    D1 --> E3
    D2 --> E1
    D2 --> E3
    E1 --> F1
    E2 --> F2
    E3 --> F3
    F1 --> G
    F2 --> H
    F3 --> I
    G --> J
    H --> K
    I --> L
    D1 --> M
    D2 --> M
    D1 --> N
    D2 --> N
    D1 --> O
    D2 --> O
    O --> P
    P --> Q

    style A fill:#e1f5ff
    style M fill:#f3e5f5
    style O fill:#e8f5e9
    style Q fill:#fff3e0
```

---

## 기술 스택

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **프레임워크** | React | 18.2.0 | UI 라이브러리 |
| **라우팅** | React Router | 6.4.3 | 페이지 네비게이션 |
| **스타일링** | Tailwind CSS | 3.4.19 | 유틸리티 CSS |
| **UI 컴포넌트** | Radix UI | 1.x | 접근성 있는 UI |
| **유틸리티** | CVA | - | 조건부 클래스 |
| **아이콘** | Lucide React | 0.577.0 | SVG 아이콘 |
| **차트** | Recharts | 3.8.0 | 데이터 시각화 |
| **국제화** | i18next | 22.0.6 | 다국어 지원 |
| **번들러** | Webpack | 5 | 모듈 번들링 |
| **테스트** | Vitest | 3.2.4 | 단위 테스트 |
| **UI 카탈로그** | Storybook | 8 | 컴포넌트 문서화 |
| **E2E 테스트** | Playwright | 1.58.2 | 엔드-투-엔드 테스트 |

---

## 디렉토리 구조

```
shopby.skin/
├── src/
│   ├── design-system/              # 디자인 시스템 (26개 컴포넌트)
│   │   ├── components/
│   │   │   ├── atoms/              # 원자 구성요소 (배지, 라벨, 인포 툴팁)
│   │   │   ├── molecules/          # 분자 구성요소 (버튼, 드롭다운, 입력)
│   │   │   └── organisms/          # 생물 구성요소 (섹션, 요약)
│   │   ├── tokens/                 # 디자인 토큰
│   │   │   ├── colors.css
│   │   │   ├── typography.css
│   │   │   ├── spacing.css
│   │   │   ├── radius.css
│   │   │   ├── elevation.css
│   │   │   └── motion.css
│   │   └── __stories__/            # Storybook 스토리
│   │
│   ├── components/                 # 기능 컴포넌트 (93개)
│   │   ├── admin/                  # 관리자 컴포넌트
│   │   │   ├── board/              # 게시판 관리
│   │   │   ├── coupon/             # 쿠폰 관리
│   │   │   ├── member/             # 회원 관리
│   │   │   └── product/            # 상품 관리
│   │   ├── product/                # 상품 컴포넌트
│   │   └── ui/                     # UI 프리미티브
│   │
│   ├── pages/                      # 페이지 컴포넌트 (45+)
│   │   ├── FindId/                 # 아이디 찾기
│   │   ├── FindPassword/           # 비밀번호 찾기
│   │   ├── SignUp/                 # 회원가입
│   │   ├── MyPage/                 # 마이페이지
│   │   ├── Cart/                   # 장바구니
│   │   ├── OrderSheet/             # 주문서
│   │   ├── ProductDetail/          # 상품 상세
│   │   ├── admin/                  # 관리자 페이지 (13+)
│   │   │   ├── board/
│   │   │   ├── coupon/
│   │   │   ├── member/
│   │   │   └── product/
│   │   └── ...
│   │
│   ├── router/                     # 라우팅 설정
│   │   └── index.js                # 100+ 라우트 정의
│   │
│   ├── services/                   # API 서비스
│   │   ├── admin/                  # 관리자 API 서비스 (14개)
│   │   │   ├── boardService.js
│   │   │   ├── couponService.js
│   │   │   ├── memberService.js
│   │   │   ├── productService.js
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── hooks/                      # 커스텀 훅 (12개)
│   │   ├── usePrintOptions.js
│   │   ├── usePrintOptionsV2.js
│   │   ├── useAuth.js
│   │   └── ...
│   │
│   ├── utils/                      # 유틸리티 함수 (12개)
│   │   ├── api.js                  # HTTP 클라이언트
│   │   ├── priceCalculator.js
│   │   └── ...
│   │
│   ├── types/                      # TypeScript 타입 정의
│   │   └── ...
│   │
│   ├── constants/                  # 상수 정의
│   │   └── ...
│   │
│   ├── api/                        # API 설정
│   │   └── ...
│   │
│   ├── __tests__/                  # 테스트 파일
│   └── index.js                    # 엔트리포인트
│
├── scripts/
│   └── admin-analyzer/             # 관리자 모듈 분석 스크립트 (6개)
│       ├── index.js
│       ├── analyzer.js
│       └── ...
│
├── .storybook/                     # Storybook 설정
├── .github/                        # GitHub Actions 워크플로우
├── config/                         # 빌드 설정
├── dist/                           # 빌드 산출물
├── package.json                    # 프로젝트 메타데이터
├── webpack.config.js               # Webpack 설정
├── tailwind.config.js              # Tailwind 설정
├── .chromatic.config.json          # Chromatic 설정
└── README.md                       # 본 문서
```

---

## 디자인 시스템 계층

```mermaid
graph TD
    subgraph "토큰 계층"
        T1["색상 토큰<br/>Primary/Secondary/Neutral"]
        T2["타이포그래피 토큰<br/>폰트/크기/두께"]
        T3["간격 토큰<br/>4px, 8px, 16px, ..."]
        T4["반경 토큰<br/>Rounded/Circle"]
        T5["그림자 토큰<br/>Elevation/Depth"]
        T6["애니메이션 토큰<br/>Transition/Duration"]
    end

    subgraph "원자 구성요소 - Atoms"
        A1["BadgeLabel<br/>배지/라벨"]
        A2["InfoTooltip<br/>정보 팝오버"]
        A3["기타 원자"]
    end

    subgraph "분자 구성요소 - Molecules"
        M1["CTAButton<br/>행동 유도 버튼"]
        M2["CounterOption<br/>수량 선택기"]
        M3["DropdownSelect<br/>드롭다운"]
        M4["OptionLabel<br/>옵션 레이블"]
        M5["QuantityInput<br/>수량 입력"]
        M6["RadioOption<br/>라디오 선택"]
        M7["SizeInput<br/>사이즈 입력"]
        M8["SizeOptionChip<br/>사이즈 칩"]
    end

    subgraph "생물 구성요소 - Organisms"
        O1["CollapsibleSection<br/>접이식 섹션"]
        O2["PriceSummary<br/>가격 요약"]
        O3["기타 생물"]
    end

    T1 --> A1
    T1 --> A2
    T2 --> M1
    T2 --> M3
    T3 --> M2
    T4 --> A1
    T5 --> O1
    T6 --> O2

    A1 --> M1
    A2 --> M3
    M1 --> O1
    M2 --> O2
    M3 --> O1
    M4 --> O2

    style T1 fill:#fff9c4
    style T2 fill:#fff9c4
    style T3 fill:#fff9c4
    style T4 fill:#fff9c4
    style T5 fill:#fff9c4
    style T6 fill:#fff9c4
    style A1 fill:#c8e6c9
    style A2 fill:#c8e6c9
    style M1 fill:#bbdefb
    style M2 fill:#bbdefb
    style O1 fill:#f0f4c3
    style O2 fill:#f0f4c3
```

---

## 컴포넌트 아키텍처

```mermaid
graph LR
    subgraph "레이아웃 컴포넌트"
        L1["Header<br/>헤더"]
        L2["Footer<br/>푸터"]
        L3["Sidebar<br/>사이드바"]
        L4["Navigation<br/>네비게이션"]
    end

    subgraph "기능 컴포넌트"
        F1["Product Components<br/>상품 관련"]
        F2["Cart Components<br/>장바구니"]
        F3["Order Components<br/>주문"]
        F4["Auth Components<br/>인증"]
        F5["User Components<br/>사용자"]
    end

    subgraph "UI 프리미티브"
        U1["Button<br/>버튼"]
        U2["Input<br/>입력 필드"]
        U3["Modal<br/>모달"]
        U4["Accordion<br/>아코디언"]
        U5["Tabs<br/>탭"]
    end

    subgraph "디자인 시스템"
        D["Design System<br/>26 Components"]
    end

    L1 --> U1
    L2 --> U1
    L3 --> U1
    L4 --> U1

    F1 --> U1
    F1 --> U2
    F1 --> U3
    F2 --> U1
    F2 --> U4
    F3 --> U2
    F3 --> U5
    F4 --> U2
    F5 --> U1

    U1 --> D
    U2 --> D
    U3 --> D
    U4 --> D
    U5 --> D

    style L1 fill:#ffccbc
    style L2 fill:#ffccbc
    style L3 fill:#ffccbc
    style L4 fill:#ffccbc
    style F1 fill:#c5cae9
    style F2 fill:#c5cae9
    style F3 fill:#c5cae9
    style F4 fill:#c5cae9
    style F5 fill:#c5cae9
    style D fill:#fff9c4
```

---

## 데이터 흐름

```mermaid
flowchart LR
    A["🌐 브라우저"] -->|URL 접근| B["React Router<br/>라우팅"]

    B -->|경로 매칭| C["페이지 컴포넌트<br/>지연 로딩"]

    C -->|useContext| D["Context Provider<br/>전역 상태"]
    C -->|useCustomHook| E["커스텀 훅<br/>재사용 로직"]

    C -->|API 호출| F["services/admin<br/>API 서비스"]
    E -->|API 호출| F

    F -->|HTTP 요청| G["utils/api.js<br/>HTTP 클라이언트"]

    G -->|fetch 요청| H["Shopby API<br/>백엔드 서버"]

    H -->|JSON 응답| G
    G -->|Promise| F
    F -->|setState| C

    C -->|렌더링| I["컴포넌트<br/>DOM 업데이트"]

    D -->|공유 상태| I
    E -->|계산값| I

    I -->|import| J["Design System<br/>26 Components"]

    J -->|CSS| K["Tailwind CSS<br/>& Tokens"]

    K -->|스타일링| L["최종 UI<br/>사용자에게 표시"]

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#f3e5f5
    style D fill:#e8f5e9
    style E fill:#e8f5e9
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#ffe0b2
    style I fill:#f3e5f5
    style J fill:#c8e6c9
    style K fill:#c8e6c9
    style L fill:#c8e6c9
```

---

## 사용자 흐름

### 1. 고객 쇼핑 흐름

```mermaid
sequenceDiagram
    participant 고객
    participant Frontend
    participant Router
    participant Pages
    participant Services
    participant API

    고객 ->> Frontend: 사이트 접속
    Frontend ->> Router: 라우트 분석
    Router ->> Pages: ProductList 페이지 로드

    고객 ->> Pages: 상품 검색 & 필터링
    Pages ->> Services: 상품 목록 조회
    Services ->> API: GET /products
    API -->> Services: 상품 데이터
    Services -->> Pages: 상품 렌더링

    고객 ->> Pages: 상품 상세 클릭
    Pages ->> Router: ProductDetail 이동
    Router ->> Pages: ProductDetail 로드
    Pages ->> Services: 상품 상세 조회
    Services ->> API: GET /products/{id}
    API -->> Services: 상세 데이터

    고객 ->> Pages: 옵션 선택 & 장바구니 추가
    Pages ->> Pages: 가격 계산
    Pages ->> Services: 장바구니 추가
    Services ->> API: POST /cart

    고객 ->> Pages: 장바구니 확인
    Router ->> Pages: Cart 페이지 로드

    고객 ->> Pages: 주문 진행
    Router ->> Pages: OrderSheet 로드
    Pages ->> Services: 주문서 생성
    Services ->> API: POST /orders

    고객 ->> Pages: 결제 진행
    Pages ->> Pages: 결제 게이트웨이 연동
    Pages ->> API: POST /payment
    API -->> Pages: 결제 완료

    고객 ->> Pages: 주문 확인
    Pages ->> Services: 주문 상세 조회
    Services ->> API: GET /orders/{id}
```

### 2. 인증 흐름

```mermaid
sequenceDiagram
    participant 사용자
    participant Frontend
    participant 인증페이지
    participant Services
    participant API
    participant 세션저장소

    사용자 ->> Frontend: 로그인 클릭
    Frontend ->> 인증페이지: SignIn 페이지 로드

    사용자 ->> 인증페이지: 아이디/비밀번호 입력
    인증페이지 ->> Services: 로그인 요청
    Services ->> API: POST /auth/login
    API -->> Services: 토큰 응답
    Services ->> 세션저장소: 토큰 저장
    Services -->> 인증페이지: 인증 완료

    인증페이지 ->> Frontend: 마이페이지로 리다이렉트
    Frontend ->> 세션저장소: 토큰 확인
    Frontend ->> Services: 사용자 정보 조회
    Services ->> API: GET /user/profile
    API -->> Services: 사용자 데이터
```

### 3. 관리자 작업 흐름

```mermaid
sequenceDiagram
    participant 관리자
    participant AdminDashboard
    participant AdminPages
    participant AdminServices
    participant API

    관리자 ->> AdminDashboard: 관리자 대시보드 접속
    AdminDashboard ->> AdminServices: 대시보드 통계 조회
    AdminServices ->> API: GET /admin/statistics
    API -->> AdminServices: 통계 데이터
    AdminServices -->> AdminDashboard: 렌더링

    관리자 ->> AdminPages: 상품 관리 클릭
    AdminPages ->> AdminServices: 상품 목록 조회
    AdminServices ->> API: GET /admin/products
    API -->> AdminServices: 상품 목록

    관리자 ->> AdminPages: 새 상품 추가
    AdminPages ->> AdminPages: 폼 검증
    AdminPages ->> AdminServices: 상품 생성 요청
    AdminServices ->> API: POST /admin/products
    API -->> AdminServices: 성공 응답
    AdminServices -->> AdminPages: 목록 새로고침

    관리자 ->> AdminPages: 상품 수정
    AdminPages ->> AdminServices: 상품 업데이트
    AdminServices ->> API: PUT /admin/products/{id}

    관리자 ->> AdminPages: 상품 삭제
    AdminPages ->> AdminServices: 상품 삭제 요청
    AdminServices ->> API: DELETE /admin/products/{id}
```

---

## API 통합 흐름

```mermaid
sequenceDiagram
    participant React Component
    participant API Service
    participant HTTP Client
    participant API Gateway
    participant Backend Server
    participant Token Refresh

    React Component ->> API Service: API 호출
    API Service ->> HTTP Client: 요청 생성

    HTTP Client ->> HTTP Client: 토큰 유효성 확인
    alt 토큰 만료
        HTTP Client ->> Token Refresh: 토큰 갱신 요청
        Token Refresh ->> API Gateway: POST /auth/refresh
        API Gateway ->> Backend Server: 토큰 갱신
        Backend Server -->> API Gateway: 새 토큰
        API Gateway -->> Token Refresh: 응답
        Token Refresh -->> HTTP Client: 새 토큰 저장
    end

    HTTP Client ->> API Gateway: 요청 전송 (헤더에 토큰)
    API Gateway ->> Backend Server: 요청 포워딩
    Backend Server ->> Backend Server: 비즈니스 로직 처리
    Backend Server -->> API Gateway: JSON 응답
    API Gateway -->> HTTP Client: 응답 반환

    HTTP Client ->> HTTP Client: 응답 검증 & 파싱
    HTTP Client -->> API Service: 파싱된 데이터
    API Service -->> React Component: Promise 해결
    React Component ->> React Component: setState 호출
    React Component ->> React Component: 렌더링
```

---

## 라우트 구조

```mermaid
graph TD
    Root["Root<br/>/"]

    Auth["인증<br/>/auth"]
    Auth1["로그인<br/>/auth/login"]
    Auth2["회원가입<br/>/auth/signup"]
    Auth3["아이디 찾기<br/>/auth/find-id"]
    Auth4["비밀번호 찾기<br/>/auth/find-password"]

    Shop["쇼핑<br/>/shop"]
    Shop1["상품 목록<br/>/shop/products"]
    Shop2["상품 상세<br/>/shop/products/:id"]
    Shop3["카테고리<br/>/shop/category/:id"]
    Shop4["검색<br/>/shop/search"]

    Cart["장바구니<br/>/cart"]
    Order["주문<br/>/order"]
    Order1["주문서<br/>/order/sheet"]
    Order2["주문 완료<br/>/order/complete"]
    Order3["주문 내역<br/>/order/history"]

    User["사용자<br/>/user"]
    User1["마이페이지<br/>/user/mypage"]
    User2["프로필<br/>/user/profile"]
    User3["주문 상세<br/>/user/orders/:id"]
    User4["배송 추적<br/>/user/shipping"]

    Admin["관리자<br/>/admin"]
    AdminDash["대시보드<br/>/admin/dashboard"]
    AdminProd["상품 관리<br/>/admin/products"]
    AdminProd1["상품 목록<br/>/admin/products"]
    AdminProd2["상품 추가<br/>/admin/products/new"]
    AdminProd3["상품 수정<br/>/admin/products/:id"]

    AdminOrder["주문 관리<br/>/admin/orders"]
    AdminMem["회원 관리<br/>/admin/members"]
    AdminCoup["쿠폰 관리<br/>/admin/coupons"]
    AdminBoard["게시판 관리<br/>/admin/board"]
    AdminStat["통계<br/>/admin/statistics"]

    Root --> Auth
    Root --> Shop
    Root --> Cart
    Root --> Order
    Root --> User
    Root --> Admin

    Auth --> Auth1
    Auth --> Auth2
    Auth --> Auth3
    Auth --> Auth4

    Shop --> Shop1
    Shop --> Shop2
    Shop --> Shop3
    Shop --> Shop4

    Order --> Order1
    Order --> Order2
    Order --> Order3

    User --> User1
    User --> User2
    User --> User3
    User --> User4

    Admin --> AdminDash
    Admin --> AdminProd
    Admin --> AdminOrder
    Admin --> AdminMem
    Admin --> AdminCoup
    Admin --> AdminBoard
    Admin --> AdminStat

    AdminProd --> AdminProd1
    AdminProd --> AdminProd2
    AdminProd --> AdminProd3

    style Root fill:#e1f5ff
    style Auth fill:#c8e6c9
    style Shop fill:#c8e6c9
    style Cart fill:#c8e6c9
    style Order fill:#c8e6c9
    style User fill:#c8e6c9
    style Admin fill:#ffccbc
    style AdminDash fill:#ffccbc
    style AdminProd fill:#ffccbc
    style AdminOrder fill:#ffccbc
```

---

## 상태 관리

```mermaid
graph TD
    subgraph "Context Provider 10+"
        CP1["AuthContext<br/>인증 상태"]
        CP2["UserContext<br/>사용자 정보"]
        CP3["CartContext<br/>장바구니"]
        CP4["OrderContext<br/>주문"]
        CP5["ProductContext<br/>상품"]
        CP6["AdminContext<br/>관리자"]
        CP7["UIContext<br/>UI 상태"]
        CP8["FilterContext<br/>필터"]
    end

    subgraph "커스텀 훅 12개"
        H1["useAuth<br/>인증 로직"]
        H2["usePrintOptions<br/>인쇄 옵션"]
        H3["useCart<br/>장바구니 로직"]
        H4["useProduct<br/>상품 로직"]
        H5["useOrder<br/>주문 로직"]
        H6["useAdmin<br/>관리자 로직"]
        H7["useFetch<br/>API 호출"]
        H8["useLocalStorage<br/>로컬 저장"]
    end

    subgraph "컴포넌트 소비"
        C1["Pages"]
        C2["Components"]
        C3["Forms"]
    end

    CP1 --> H1
    CP2 --> H1
    CP3 --> H3
    CP4 --> H5
    CP5 --> H4
    CP6 --> H6
    CP7 --> C1
    CP8 --> C2

    H1 --> C1
    H2 --> C3
    H3 --> C3
    H4 --> C2
    H5 --> C1
    H6 --> C1
    H7 --> H1
    H8 --> C1

    style CP1 fill:#f3e5f5
    style CP2 fill:#f3e5f5
    style CP3 fill:#f3e5f5
    style CP4 fill:#f3e5f5
    style CP5 fill:#f3e5f5
    style CP6 fill:#f3e5f5
    style CP7 fill:#f3e5f5
    style CP8 fill:#f3e5f5
    style H1 fill:#e8f5e9
    style H2 fill:#e8f5e9
    style H3 fill:#e8f5e9
    style H4 fill:#e8f5e9
    style H5 fill:#e8f5e9
    style H6 fill:#e8f5e9
    style H7 fill:#e8f5e9
    style H8 fill:#e8f5e9
```

---

## 관리자 모듈

```mermaid
graph LR
    subgraph "Admin Services 14개"
        S1["boardService<br/>게시판 API"]
        S2["couponService<br/>쿠폰 API"]
        S3["memberService<br/>회원 API"]
        S4["productService<br/>상품 API"]
        S5["orderService<br/>주문 API"]
        S6["statisticsService<br/>통계 API"]
        S7["authService<br/>인증 API"]
        S8["categoryService<br/>카테고리 API"]
        S9["reviewService<br/>리뷰 API"]
        S10["settingService<br/>설정 API"]
        S11["reportService<br/>리포트 API"]
        S12["paymentService<br/>결제 API"]
        S13["inventoryService<br/>재고 API"]
        S14["notificationService<br/>알림 API"]
    end

    subgraph "Admin Pages 13+"
        P1["Dashboard<br/>대시보드"]
        P2["Products<br/>상품 관리"]
        P3["Orders<br/>주문 관리"]
        P4["Members<br/>회원 관리"]
        P5["Coupons<br/>쿠폰 관리"]
        P6["Board<br/>게시판 관리"]
        P7["Statistics<br/>통계"]
        P8["Settings<br/>설정"]
    end

    subgraph "HTTP Client"
        API["utils/api.js<br/>fetch 래퍼"]
    end

    subgraph "백엔드 API"
        BE["Shopby REST API<br/>백엔드 서버"]
    end

    S1 --> API
    S2 --> API
    S3 --> API
    S4 --> API
    S5 --> API
    S6 --> API
    S7 --> API
    S8 --> API
    S9 --> API
    S10 --> API
    S11 --> API
    S12 --> API
    S13 --> API
    S14 --> API

    P1 --> S1
    P1 --> S2
    P1 --> S6
    P2 --> S4
    P2 --> S8
    P3 --> S5
    P4 --> S3
    P5 --> S2
    P6 --> S1
    P7 --> S6
    P8 --> S10

    API --> BE

    style S1 fill:#fff3e0
    style S2 fill:#fff3e0
    style S3 fill:#fff3e0
    style S4 fill:#fff3e0
    style S5 fill:#fff3e0
    style S6 fill:#fff3e0
    style S7 fill:#fff3e0
    style S8 fill:#fff3e0
    style S9 fill:#fff3e0
    style S10 fill:#fff3e0
    style S11 fill:#fff3e0
    style S12 fill:#fff3e0
    style S13 fill:#fff3e0
    style S14 fill:#fff3e0
    style P1 fill:#ffccbc
    style P2 fill:#ffccbc
    style P3 fill:#ffccbc
    style P4 fill:#ffccbc
    style P5 fill:#ffccbc
    style P6 fill:#ffccbc
    style P7 fill:#ffccbc
    style P8 fill:#ffccbc
```

---

## SPEC 구현 현황

| SPEC ID | 제목 | 상태 | 변경일 | 비고 |
|---------|------|------|--------|------|
| SPEC-SKIN-001 | 인증 / 회원가입 디자인시스템 마이그레이션 | ✅ 완료 | 2026-01-22 | 로그인, 회원가입, 비밀번호 찾기 |
| SPEC-SKIN-002 | 마이페이지 디자인시스템 마이그레이션 | ✅ 완료 | 2026-01-22 | 프로필, 주문 내역, 배송 조회 |
| SPEC-SKIN-003 | 캐주얼 컴포넌트 마이그레이션 | ✅ 완료 | 2026-01-22 | 레이아웃, 네비게이션 |
| SPEC-SKIN-004 | Field/TextField/Dialog 컴포넌트 교체 | ✅ 완료 | 2026-01-22 | Huni DS 통합 |
| SPEC-SKIN-005 | 관리자 디자인시스템 마이그레이션 및 API 서비스 레이어 | ✅ 완료 | 2026-01-22 | 14개 API 서비스 |
| SPEC-SKIN-006 | 장바구니 / 주문서 페이지 | ✅ 완료 | 2026-01-22 | 가격 계산, 주문 처리 |
| SPEC-SKIN-007 | 상품 상세 페이지 | ✅ 완료 | 2026-01-22 | 옵션 선택, 미리보기 |
| SPEC-SKIN-008 | 관리자 거래처/원장/통계 기능 | ✅ 완료 | 2026-01-22 | 통계 대시보드 |
| SPEC-SKIN-009 | 인쇄 옵션 전환 (v1 → v2) | 🔄 진행중 | 2026-01-22 | usePrintOptionsV2 훅 |

---

## 인쇄 옵션 데이터 흐름

```mermaid
sequenceDiagram
    participant ProductDetail
    participant usePrintOptionsV2
    participant PriceCalculator
    participant Cart
    participant Backend

    ProductDetail ->> usePrintOptionsV2: 인쇄 옵션 초기화
    usePrintOptionsV2 ->> usePrintOptionsV2: 기본 옵션 설정

    ProductDetail ->> ProductDetail: 사용자 옵션 선택
    ProductDetail ->> usePrintOptionsV2: 옵션 업데이트
    usePrintOptionsV2 ->> PriceCalculator: 가격 재계산

    PriceCalculator ->> PriceCalculator: 기본 가격 조회
    PriceCalculator ->> PriceCalculator: 옵션별 추가 요금
    PriceCalculator ->> PriceCalculator: 총 가격 계산
    PriceCalculator -->> usePrintOptionsV2: 계산된 가격

    usePrintOptionsV2 -->> ProductDetail: 가격 및 옵션 상태
    ProductDetail ->> ProductDetail: UI 렌더링

    ProductDetail ->> Cart: 장바구니 추가 (옵션 + 가격)
    Cart ->> Backend: POST /cart
    Backend ->> Backend: 장바구니 저장
    Backend -->> Cart: 성공 응답
```

---

## 시작하기

### 필수 사항

- **Node.js**: 18.0.0 이상
- **npm** 또는 **yarn**: 최신 버전
- **Git**: 소스 코드 관리

### 설치

```bash
# 저장소 클론
git clone https://skins.shopby.co.kr/developers/aurora-skin.git
cd shopby.skin

# 의존성 설치
npm install
# 또는
yarn install

# 의존 패키지 설치
npm install @shopby/react-components @shopby/shared
```

### 개발 서버 실행

```bash
# 개발 모드로 시작
npm run dev
# 또는
yarn dev

# 브라우저에서 http://localhost:8080 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build
# 또는
yarn build

# 빌드 산출물은 dist/ 디렉토리에 생성됨
```

### Storybook 실행

```bash
# Storybook 개발 서버 시작
npm run storybook
# 또는
yarn storybook

# 브라우저에서 http://localhost:6006 접속
```

### E2E 테스트 실행

```bash
# Playwright 테스트 실행
npm run test:e2e
# 또는
yarn test:e2e

# 관리자 모듈 분석
node scripts/admin-analyzer/index.js --all
node scripts/admin-analyzer/index.js --module board
```

### 유닛 테스트

```bash
# 테스트 실행
npm run test
# 또는
yarn test

# 테스트 커버리지 확인
npm run test:coverage
# 또는
yarn test:coverage
```

---

## 스크립트 참고

| 스크립트 | 설명 | 명령어 |
|---------|------|--------|
| **dev** | 개발 서버 시작 | `npm run dev` |
| **build** | 프로덕션 빌드 | `npm run build` |
| **build:dev** | 개발 빌드 | `npm run build:dev` |
| **build:beta** | 베타 빌드 | `npm run build:beta` |
| **start** | 개발 서버 (Webpack) | `npm run start` |
| **test** | 유닛 테스트 (Watch) | `npm run test:watch` |
| **test:coverage** | 테스트 커버리지 | `npm run test:coverage` |
| **storybook** | Storybook 개발 서버 | `npm run storybook` |
| **build-storybook** | Storybook 빌드 | `npm run build-storybook` |
| **chromatic** | Chromatic 배포 | `npm run chromatic` |
| **admin-analyzer** | 관리자 모듈 분석 | `node scripts/admin-analyzer/index.js --all` |

---

## 기여

이 프로젝트는 MoAI SPEC 기반 워크플로우를 따릅니다.

### 기여 프로세스

1. 새로운 기능이나 버그 수정을 위해 SPEC 문서를 작성하세요
2. SPEC은 `.moai/specs/SPEC-SKIN-XXX/spec.md` 형식으로 저장됩니다
3. SPEC을 기반으로 구현을 진행합니다
4. 구현 완료 후 문서를 동기화합니다

### SPEC 작성 가이드

```markdown
# SPEC-SKIN-XXX: 기능 제목

## 요구사항

## 기술 사항

## 구현 계획

## 테스트 계획

## 문서화
```

### 커밋 메시지 형식

```
feat(module): SPEC-SKIN-XXX 기능 구현

- 세부 사항 1
- 세부 사항 2

SPEC-SKIN-XXX #issue_number
```

---

## 코드 메트릭

| 메트릭 | 값 | 비고 |
|--------|-----|------|
| **전체 파일** | 826개 | 프로젝트 전체 |
| **디자인 시스템 컴포넌트** | 26개 | atoms + molecules + organisms |
| **기능 컴포넌트** | 93개 | pages + components + admin |
| **라우트** | 100개+ | 고객 + 관리자 페이지 |
| **API 서비스** | 14개 | 관리자 모듈 서비스 |
| **커스텀 훅** | 12개+ | 재사용 가능한 로직 |
| **유틸리티 함수** | 12개+ | 공통 기능 |
| **Context Provider** | 10개+ | 전역 상태 관리 |
| **테스트 커버리지** | 85%+ | 목표 기준 |

---

## 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

---

## 지원

### 문제 보고

버그나 문제를 발견하면 GitHub Issues에 보고해주세요.

### 토론 및 질문

일반적인 질문이나 토론은 GitHub Discussions에서 진행됩니다.

---

## 변경 이력

### v1.16.5 (2026-01-22)

- SPEC-SKIN-008: 관리자 거래처/원장/통계 기능 구현
- SPEC-SKIN-009: 인쇄 옵션 전환 시작
- 종합 README 추가

### v1.16.4

- 관리자 모듈 리팩토링

### v1.16.3

- 상품 상세 페이지 완성

---

## 프로젝트 정보

- **개발 팀**: shopby Skin Development Team
- **저장소**: https://skins.shopby.co.kr/developers/aurora-skin.git
- **이슈 트래킹**: GitHub Issues
- **문서**: 본 README 및 Storybook

---

## 추가 리소스

- [Storybook 컴포넌트 카탈로그](http://localhost:6006)
- [Playwright E2E 테스트](./scripts/admin-analyzer/)
- [MoAI SPEC 시스템](./.moai/specs/)
- [프로젝트 코드 맵](./.moai/project/codemaps/)

---

**마지막 업데이트**: 2026-01-22 | **버전**: 1.16.5 | **유지보수**: shopby Development Team

