---
id: SPEC-PAGE-001
artifact: architecture-design
version: "1.0.0"
created: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-PAGE-001: Pages + Content + Payment 아키텍처 설계

> 후니프린팅 페이지/콘텐츠/결제 도메인 (9개 기능) 기술 아키텍처

---

## 1. 시스템 아키텍처 개요

### 1.1 3-Tier Hybrid 아키텍처에서의 위치

```mermaid
graph TD
    subgraph "Tier 1: NATIVE (shopby 기본)"
        N1["회사소개 (shopby 기본 페이지)"]
        N2["이용약관 (shopby 약관 관리)"]
        N3["개인정보보호 (shopby 약관 관리)"]
    end

    subgraph "Tier 1: SKIN (shopby 스킨 커스텀)"
        S1["메인 페이지 (Aurora Skin 메인)"]
        S2["서브메인 (shopby 기획전)"]
        S3["상품목록 LIST (Aurora Skin 상품목록)"]
        S4["상품상세 - 기타상품 (Aurora Skin 기본 옵션)"]
        S5["찾아오시는 길 (카카오맵 SDK 스킨)"]
    end

    subgraph "Tier 2: CUSTOM (자체 개발)"
        C1["상품상세 - 출력상품 옵션<br/>(option_NEW 단일 폼)"]
        C2["수동카드결제<br/>(이니시스 관리자 API)"]
    end

    subgraph "외부 시스템"
        EXT1["shopby API Server"]
        EXT2["이니시스 PG API"]
        EXT3["카카오맵 JS SDK"]
    end

    S1 --> EXT1
    S3 --> EXT1
    S4 --> EXT1
    C1 --> EXT1
    C2 --> EXT2
    S5 --> EXT3
```

### 1.2 프로젝트 디렉토리 구조 (예상)

```
src/pages/
├── Main/                     # 메인 페이지
│   ├── Main.jsx
│   ├── components/
│   │   ├── HeroBanner.jsx     # 히어로 배너 슬라이드
│   │   ├── CategoryNav.jsx    # 카테고리 네비게이션
│   │   ├── PopularProducts.jsx
│   │   ├── NewProducts.jsx
│   │   └── EventBanner.jsx
│   └── hooks/
│       └── useMainSections.js
│
├── ProductList/              # 상품목록 (LIST)
│   ├── ProductList.jsx
│   ├── components/
│   │   ├── SortFilter.jsx     # 정렬/필터
│   │   ├── CategoryTree.jsx   # 카테고리 트리
│   │   └── ProductCard.jsx    # 상품 카드
│   └── hooks/
│       └── useProductList.js
│
├── ProductDetail/            # 상품 상세
│   ├── ProductDetail.jsx
│   ├── components/
│   │   ├── ImageGallery.jsx
│   │   ├── DetailTabs.jsx     # 상세/리뷰/Q&A 탭
│   │   ├── OptionNewForm/     # ★ CUSTOM: option_NEW 폼
│   │   │   ├── OptionNewForm.jsx
│   │   │   ├── ButtonGroupOption.jsx
│   │   │   ├── SelectBoxOption.jsx
│   │   │   ├── CountInputOption.jsx
│   │   │   ├── PriceTableBar.jsx
│   │   │   ├── RadioButtonOption.jsx
│   │   │   ├── DirectInputOption.jsx
│   │   │   ├── ColorChipOption.jsx
│   │   │   ├── SummaryTable.jsx
│   │   │   ├── FileUploadOption.jsx
│   │   │   └── hooks/
│   │   │       ├── useOptionDependency.js
│   │   │       └── usePriceCalculation.js
│   │   └── SkinOptionForm/    # SKIN 기본 옵션
│   │       └── SkinOptionForm.jsx
│   └── hooks/
│       └── useProductDetail.js
│
├── Content/                  # 콘텐츠 페이지
│   ├── About.jsx             # 회사소개
│   ├── Terms.jsx             # 이용약관
│   ├── Privacy.jsx           # 개인정보보호
│   └── Location/             # 찾아오시는 길
│       ├── Location.jsx
│       └── KakaoMap.jsx
│
├── SubMain/                  # 서브메인 (랜딩)
│   └── SubMain.jsx
│
└── admin/
    └── ManualPayment/        # ★ CUSTOM: 수동카드결제
        ├── ManualPayment.jsx
        ├── components/
        │   ├── OrderLookup.jsx
        │   └── PaymentForm.jsx
        └── hooks/
            └── useManualPayment.js
```

---

## 2. option_NEW 컴포넌트 아키텍처

### 2.1 컴포넌트 계층 구조

```mermaid
graph TD
    subgraph "OptionNewForm (최상위)"
        FORM["OptionNewForm"]
        CONFIG["상품 카테고리별 JSON 설정"]
    end

    subgraph "10개 컴포넌트 타입"
        BTN["ButtonGroupOption<br/>155x50px 버튼 그리드"]
        SEL["SelectBoxOption<br/>348x50px 드롭다운"]
        CNT["CountInputOption<br/>수량 +/- 카운터"]
        PRC["PriceTableBar<br/>가격 테이블 행"]
        RDO["RadioButtonOption<br/>라디오 버튼"]
        INP["DirectInputOption<br/>140x50px 입력"]
        CLR["ColorChipOption<br/>50x50px 원형"]
        SUM["SummaryTable<br/>가격 합산"]
        UPL["FileUploadOption<br/>파일 업로드"]
        MLT["MultiSelectOption<br/>다중 셀렉트"]
    end

    subgraph "연동 훅"
        DEP["useOptionDependency<br/>종속 옵션 관리"]
        CALC["usePriceCalculation<br/>가격 계산"]
    end

    FORM --> CONFIG
    FORM --> BTN
    FORM --> SEL
    FORM --> CNT
    FORM --> PRC
    FORM --> RDO
    FORM --> INP
    FORM --> CLR
    FORM --> SUM
    FORM --> UPL
    FORM --> MLT

    BTN --> DEP
    SEL --> DEP
    DEP --> CALC
    CALC --> SUM
```

### 2.2 상품 카테고리별 옵션 구성 매핑

| 상품 카테고리 | 피그마 섹션 ID | 주요 옵션 |
|-------------|--------------|----------|
| 인쇄(PRINT) | PRODUCT_PRINT_OPTION | 사이즈, 종이, 인쇄, 코팅, 커팅, 후가공 |
| 제본(BOOK) | PRODUCT_BOOK_OPTION | 사이즈, 종이, 제본방식, 코팅, 후가공 |
| 문구(STATIONERY) | PRODUCT_STATIONERY_OPTION | 사이즈, 종이, 인쇄, 코팅 |
| 포토북(PHOTOBOOK) | PRODUCT_PHOTOBOOK_OPTION | 사이즈, 종이, 페이지수, 코팅 |
| 캘린더(CALENDAR) | PRODUCT_CALENDAR_OPTION | 사이즈, 종이, 코팅, 달력형태 |
| 디자인캘린더 | PRODUCT_DESIGN_CALENDAR | 사이즈, 디자인선택 |
| 소품(ACCESSORIES) | PRODUCT_ACCESSORIES_OPTION | 소재, 사이즈, 수량 |
| 아크릴(ACRYLIC) | PRODUCT_ACRYLIC_OPTION | 사이즈, 두께, 인쇄, 커팅 |
| 간판포스터(SIGN) | PRODUCT_SIGN_POSTER | 소재, 사이즈, 인쇄, 마감 |
| 스티커(STICKER) | PRODUCT_STICKER_OPTION | 소재, 사이즈, 코팅, 커팅 |
| 굿즈(GOODS) | PRODUCT_GOODS_OPTION | SKIN 기본 옵션 |

### 2.3 종속 옵션 데이터 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Form as OptionNewForm
    participant Hook as useOptionDependency
    participant API as 옵션 엔진 API<br/>(SPEC-PRODUCT-001)
    participant Price as 가격 매트릭스 API

    User->>Form: 사이즈 "A4" 선택
    Form->>Hook: onOptionChange(sizeId: "A4")
    Hook->>API: GET /options/dependent?parentId=A4
    API-->>Hook: { papers: [...], coatings: [...] }
    Hook->>Form: 종이/코팅 옵션 목록 갱신
    Form->>User: 갱신된 종이/코팅 옵션 표시

    User->>Form: 종이 "아트지 250g" 선택
    Form->>Hook: onOptionChange(paperId: "art250")
    Hook->>Price: GET /price/calculate?size=A4&paper=art250&qty=100
    Price-->>Hook: { unitPrice: 150, totalPrice: 15000 }
    Hook->>Form: 가격 요약 테이블 갱신
    Form->>User: 갱신된 가격 표시
```

---

## 3. 수동카드결제 아키텍처

### 3.1 결제 플로우

```mermaid
sequenceDiagram
    participant Admin as 관리자
    participant Page as 결제 페이지
    participant Server as 백엔드 서버
    participant PG as 이니시스 API
    participant Order as 주문 시스템

    Admin->>Page: 주문번호 입력
    Page->>Server: GET /admin/orders/{orderNo}
    Server->>Order: 주문 조회
    Order-->>Server: 주문 상세 (금액, 상품, 상태)
    Server-->>Page: 주문 정보 표시

    Admin->>Page: 결제 버튼 클릭
    Page->>Server: POST /admin/payments/manual
    Note over Page,Server: idempotency_key: UUID<br/>csrf_token: verified
    Server->>PG: 관리자 결제 API 호출
    PG-->>Server: 결제 결과

    alt 성공
        Server->>Order: 결제 상태 업데이트 (PAID)
        Server-->>Page: 결제 확인서
        Page-->>Admin: 성공 화면
    else 실패
        Server-->>Page: 오류 코드 + 메시지
        Page-->>Admin: 실패 화면 + 재시도 버튼
    end

    Note over Server: 결제 로그 기록<br/>(일시, 금액, 처리자, 결과)
```

### 3.2 보안 체크리스트

| 항목 | 구현 방법 |
|------|----------|
| HTTPS | 전 페이지 HTTPS 강제 |
| CSRF | 서버 발급 토큰 + 폼 헤더 포함 |
| 인증 | 관리자 세션 토큰 검증 |
| 멱등성 | UUID 기반 idempotency_key |
| 로깅 | 전체 결제 시도 로그 (성공/실패) |
| 접근 제한 | 관리자 역할(ROLE_ADMIN) 확인 |

---

## 4. 카카오맵 연동 아키텍처

### 4.1 SDK 로딩 전략

```mermaid
graph TD
    A["Location 페이지 접속"] --> B{"카카오맵 SDK 로드됨?"}
    B -->|No| C["동적 script 태그 삽입"]
    C --> D["kakao.maps.load() 콜백"]
    B -->|Yes| D
    D --> E["지도 인스턴스 생성"]
    E --> F["마커 + 인포윈도우 추가"]
    F --> G["줌/이동 컨트롤 추가"]
```

### 4.2 구현 사양

| 항목 | 사양 |
|------|------|
| SDK 버전 | Kakao Maps JavaScript SDK v3 |
| 로딩 방식 | 동적 script 삽입 (lazy loading) |
| API Key | 환경변수 `KAKAO_MAP_APP_KEY` |
| 도메인 제한 | 프로덕션 도메인만 허용 |
| 초기 줌 레벨 | 3 (건물 수준) |
| 마커 | 후니프린팅 위치 고정 마커 |
| 인포윈도우 | 회사명, 주소, 전화번호 |

---

## 5. 성능 최적화 설계

### 5.1 이미지 최적화 파이프라인

```mermaid
graph LR
    A["원본 이미지<br/>(PNG/JPG)"] --> B["WebP 변환"]
    B --> C["CDN 배포"]
    C --> D["lazy loading<br/>(Intersection Observer)"]
    D --> E["사용자 화면"]
```

### 5.2 메인 페이지 로딩 전략

| 순서 | 리소스 | 로딩 방식 |
|------|-------|----------|
| 1 | 히어로 배너 첫 슬라이드 | 즉시 로딩 (Critical) |
| 2 | 카테고리 아이콘 | 즉시 로딩 (Above the fold) |
| 3 | 인기 상품 이미지 | Lazy loading |
| 4 | 신규 상품 이미지 | Lazy loading |
| 5 | 이벤트 배너 | Lazy loading |
| 6 | 고객 리뷰 이미지 | Lazy loading |

### 5.3 상품 상세 페이지 로딩 전략

| 순서 | 리소스 | 로딩 방식 |
|------|-------|----------|
| 1 | 상품 이미지 갤러리 (첫 이미지) | 즉시 로딩 |
| 2 | 옵션 폼 (option_NEW or SKIN) | 즉시 로딩 |
| 3 | 가격 데이터 | API 호출 (초기 옵션 기준) |
| 4 | 상세 탭 콘텐츠 | Tab 클릭 시 로딩 |
| 5 | 리뷰 목록 | 리뷰 탭 클릭 시 로딩 |

---

## 6. SEO 설계

### 6.1 메타 태그 전략

| 페이지 | title | description | og:image |
|-------|-------|-------------|----------|
| 메인 | 후니프린팅 - 인쇄/제본/굿즈 전문 | 고품질 인쇄, 제본, 굿즈 제작... | 로고 이미지 |
| 상품목록 | {카테고리명} - 후니프린팅 | {카테고리} 전문 인쇄... | 카테고리 대표 이미지 |
| 상품상세 | {상품명} - 후니프린팅 | {상품명} 상세 정보... | 상품 대표 이미지 |
| 회사소개 | 회사소개 - 후니프린팅 | 후니프린팅 연혁, 장비... | 회사 대표 이미지 |

### 6.2 구조화 데이터 (상품 페이지)

상품 상세 페이지에 JSON-LD Product schema 적용:
- name, description, image
- offers (price, priceCurrency, availability)
- aggregateRating (리뷰 점수)
