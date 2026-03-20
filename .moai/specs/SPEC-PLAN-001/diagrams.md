# SPEC-PLAN-001 시각화 다이어그램

> 본 문서는 SPEC-PLAN-001의 보충 자료로, 후니프린팅 리뉴얼 프로젝트의 주요 흐름과 구조를 시각화합니다.

---

## 1. 사이트 전체 UserFlow

사용자가 사이트에 진입한 시점부터 주문 완료, 마이페이지 활용까지의 전체 여정을 보여준다. 인쇄 상품과 일반 상품의 분기점, 파일 검수 프로세스, 결제 흐름, 주문 후 활동을 한눈에 파악할 수 있다.

```mermaid
flowchart TD
    subgraph Entry["진입 경로"]
        E1["메인 페이지"]
        E2["카테고리 탐색"]
        E3["검색"]
        E4["직접 URL / 랜딩페이지"]
    end

    E1 --> PL["상품 목록"]
    E2 --> PL
    E3 --> PL
    E4 --> PD["상품 상세"]
    PL --> PD

    PD --> DEC{{"인쇄 상품 vs 일반 상품"}}

    subgraph PrintPath["인쇄 상품 경로"]
        PO["종속옵션 선택\n용지 -> 후가공 -> 수량"]
        PC["가격 자동 계산"]
        FU["파일 업로드\nPDF / AI / PSD"]
        FI{{"파일 검수\nPitStop"}}
        FI_PASS["검수 Pass"]
        FI_FAIL["검수 Fail\n재업로드 요청"]
        FI_WARN["검수 Warning\n경고 확인 후 진행"]
    end

    DEC -- "인쇄 상품" --> PO
    PO --> PC --> FU --> FI
    FI -- "APPROVED" --> FI_PASS
    FI -- "REJECTED" --> FI_FAIL
    FI -- "WARNING" --> FI_WARN
    FI_FAIL --> FU
    FI_WARN --> FI_PASS

    subgraph GeneralPath["일반 상품 경로"]
        GO["일반 옵션 선택"]
    end

    DEC -- "일반 상품" --> GO

    FI_PASS --> CART_DEC
    GO --> CART_DEC

    subgraph CartOptions["장바구니 옵션"]
        CART_DEC{{"담기 방식 선택"}}
        CART["장바구니"]
        STORAGE["옵션보관함\nCUSTOM"]
        DIRECT["바로구매"]
    end

    CART_DEC -- "장바구니" --> CART
    CART_DEC -- "옵션보관함" --> STORAGE
    CART_DEC -- "바로구매" --> DIRECT
    CART --> CHECKOUT
    STORAGE -.-> CART
    DIRECT --> CHECKOUT

    subgraph Checkout["결제 프로세스"]
        LOGIN_CHK{{"로그인 체크"}}
        MEMBER_PAY["쿠폰/적립금 적용\n회원 혜택"]
        GUEST_PAY["비회원 주문 정보 입력"]
        PAY{{"결제 수단 선택"}}
        INICIS["KG이니시스"]
        NPAY["네이버페이"]
    end

    CHECKOUT["주문서 작성"] --> LOGIN_CHK
    LOGIN_CHK -- "회원" --> MEMBER_PAY --> PAY
    LOGIN_CHK -- "비회원" --> GUEST_PAY --> PAY
    PAY -- "카드/계좌이체" --> INICIS
    PAY -- "간편결제" --> NPAY

    subgraph Result["주문 결과"]
        SUCCESS["결제 성공"]
        COMPLETE["주문 완료"]
        TRACKING["주문 상태 추적\n8단계"]
        FAIL["결제 실패"]
        FAIL_NOTI["실패 안내 + 알림톡"]
    end

    INICIS --> SUCCESS
    NPAY --> SUCCESS
    INICIS --> FAIL
    NPAY --> FAIL
    SUCCESS --> COMPLETE --> TRACKING
    FAIL --> FAIL_NOTI

    subgraph MyPage["마이페이지 활동"]
        MP_ORDER["주문 조회"]
        MP_MONEY["프린팅머니\n충전/사용"]
        MP_REVIEW["리뷰 작성"]
        MP_DOCS["증빙서류 발급"]
        MP_REORDER["재주문\n옵션보관함 활용"]
    end

    TRACKING --> MP_ORDER
    COMPLETE --> MP_REVIEW
    COMPLETE --> MP_REORDER
    MP_REORDER -.-> STORAGE
```

**핵심 포인트**:
- 인쇄 상품은 종속옵션 -> 가격 계산 -> 파일 업로드 -> 검수라는 고유한 4단계를 거친다
- 파일 검수 결과는 3가지(Pass/Warning/Fail)이며, Warning은 사용자 선택에 따라 진행 가능하다
- 옵션보관함은 인쇄 도메인 특화 CUSTOM 기능으로, 재주문 시 이전 설정을 재활용한다
- 결제는 KG이니시스(기본)와 네이버페이(간편결제) 이원화 구조이다

---

## 2. 인쇄 주문 라이프사이클

shopby 플랫폼의 기본 5단계 주문 상태를 인쇄 도메인에 특화된 8단계 커스텀 상태로 매핑하는 구조이다. 인쇄 공정 특성상 파일 확인, 인쇄 진행, 후가공, 품질 검수 등의 세분화된 상태가 필요하다.

```mermaid
stateDiagram-v2
    [*] --> 파일확인중

    state "shopby: 주문접수" as S1 {
        파일확인중 --> 파일승인: 파일 적합 판정
        파일확인중 --> 재업로드요청: 파일 부적합
        재업로드요청 --> 파일확인중: 고객 재업로드
    }

    state "shopby: 상품준비중" as S2 {
        인쇄접수 --> 인쇄진행: 인쇄기 투입
        인쇄진행 --> 후가공: 인쇄 완료
        후가공 --> 품질검수: 후가공 완료
    }

    파일승인 --> 인쇄접수: 공정 배정

    state "shopby: 배송중" as S3 {
        출고대기 --> 출고완료: 포장 완료
        출고완료 --> 배송중: 택배 인수
    }

    품질검수 --> 출고대기: 검수 합격

    state "shopby: 배송완료" as S4 {
        배송완료
    }

    배송중 --> 배송완료: 배송 완료 확인

    state "shopby: 구매확정" as S5 {
        구매확정
    }

    배송완료 --> 구매확정: 자동 확정 (7일)

    state "예외 처리" as EX {
        주문취소
        반품요청
    }

    파일확인중 --> 주문취소: 고객 취소 요청
    인쇄접수 --> 주문취소: 제작 전 취소
    배송완료 --> 반품요청: 불량/오배송
```

**핵심 포인트**:
- shopby 기본 5단계(주문접수 -> 상품준비중 -> 배송중 -> 배송완료 -> 구매확정)를 8단계 커스텀 상태로 확장한다
- 파일 확인 단계에서 재업로드 루프가 존재하며, 이는 인쇄 도메인 고유의 핵심 프로세스이다
- "상품준비중" 하위에 인쇄접수/인쇄진행/후가공/품질검수 4단계가 포함된다
- 구매확정은 배송완료 후 7일 자동 처리 (shopby 기본 정책)

---

## 3. 결제 흐름

사용자의 주문서 작성부터 PG 결제, BFF 인쇄주문 초기화까지의 시퀀스를 보여준다. KG이니시스와 네이버페이의 분기, 결제 실패 시 알림톡 발송 흐름을 포함한다.

```mermaid
sequenceDiagram
    actor User as 사용자
    participant SPA as React SPA
    participant API as shopby API
    participant BFF as NestJS BFF
    participant INICIS as KG이니시스
    participant NPAY as 네이버페이

    User->>SPA: 주문서 작성 (배송지, 쿠폰)
    SPA->>API: POST /orders (주문 생성)
    API-->>SPA: orderNo 반환

    alt KG이니시스 결제
        SPA->>INICIS: 결제창 호출 (INIStdPay)
        User->>INICIS: 카드 정보 입력
        INICIS-->>SPA: 결제 승인 결과 (authToken)
        SPA->>API: POST /orders/{orderNo}/pay (결제 승인 요청)
        API-->>SPA: 결제 완료 응답
    else 네이버페이
        SPA->>NPAY: 네이버페이 결제창 호출
        User->>NPAY: 네이버페이 인증
        NPAY-->>SPA: 결제 승인 결과
        SPA->>API: POST /orders/{orderNo}/pay (결제 승인 요청)
        API-->>SPA: 결제 완료 응답
    end

    alt 결제 성공
        SPA->>BFF: POST /print-orders/init (인쇄주문 초기화)
        BFF->>BFF: 커스텀 상태 생성 (파일확인중)
        BFF->>BFF: 파일 검수 트리거
        BFF-->>SPA: 인쇄주문 ID 반환
        SPA->>User: 주문 완료 페이지
    else 결제 실패
        SPA->>User: 결제 실패 팝업 (즉시)
        SPA->>BFF: POST /notifications/payment-fail
        Note over BFF: 30분 후 알림톡 발송
    end
```

**핵심 포인트**:
- shopby API로 주문을 생성하고, PG사(이니시스/네이버페이)를 통해 결제를 처리하는 2단계 구조이다
- 결제 성공 후 NestJS BFF가 인쇄 주문 고유의 초기화(커스텀 상태 생성, 파일 검수 트리거)를 수행한다
- 결제 실패 시 즉시 팝업 + 30분 후 알림톡 이중 안내 (정책 #15)

---

## 4. 파일 업로드/검수 흐름

인쇄 파일(PDF/AI/PSD)의 업로드부터 PitStop 프리플라이트 검수까지의 전체 프로세스이다. 클라이언트 사전 검증, S3 직접 업로드, BFF 검수 요청, PitStop 검수 결과 처리를 포함한다.

```mermaid
sequenceDiagram
    actor User as 사용자
    participant SPA as React SPA
    participant BFF as NestJS BFF
    participant S3 as AWS S3
    participant PS as PitStop Server

    User->>SPA: 파일 선택 (PDF/AI/PSD)

    SPA->>SPA: 클라이언트 기본 검증
    Note over SPA: 파일 크기 제한 (500MB)<br/>허용 확장자 검사<br/>기본 해상도 메타 확인

    alt 기본 검증 실패
        SPA->>User: 파일 규격 오류 안내
    else 기본 검증 통과
        SPA->>BFF: GET /upload/presigned-url
        BFF-->>SPA: Presigned URL + uploadKey

        SPA->>S3: PUT (Presigned URL 직접 업로드)
        S3-->>SPA: 업로드 완료 (200 OK)

        SPA->>BFF: POST /print-files/inspect (uploadKey)
        BFF->>S3: GET (파일 취득)
        S3-->>BFF: 파일 바이너리

        BFF->>PS: POST /preflight (파일 전송)
        Note over PS: 검수 항목:<br/>해상도 300dpi+<br/>색상 모드 CMYK<br/>재단선/여백 확인<br/>폰트 임베드 확인<br/>오버프린트 검사

        PS-->>BFF: 검수 결과 리포트

        alt APPROVED (녹색)
            BFF-->>SPA: status: APPROVED, report
            SPA->>User: 검수 통과 (녹색 표시)
        else WARNING (노란색)
            BFF-->>SPA: status: WARNING, issues[]
            SPA->>User: 경고 사항 표시 (노란색)
            User->>SPA: "진행" 또는 "재업로드" 선택
        else REJECTED (빨간색)
            BFF-->>SPA: status: REJECTED, errors[]
            SPA->>User: 검수 실패 안내 (빨간색)
            Note over User: 재업로드 필수
        end
    end
```

**핵심 포인트**:
- 클라이언트에서 파일 크기/확장자/해상도를 1차 검증하여 불필요한 업로드를 방지한다
- S3 Presigned URL을 사용하여 BFF를 거치지 않고 직접 업로드한다 (대용량 파일 최적화)
- PitStop Server가 5가지 항목(해상도, CMYK, 재단선, 폰트, 오버프린트)을 검수한다
- 검수 결과 3가지: APPROVED(즉시 진행), WARNING(선택적 진행), REJECTED(재업로드 필수)

---

## 5. Hybrid ERD

shopby 플랫폼이 관리하는 엔티티(참조용)와 후니프린팅이 자체 DB에서 관리하는 CUSTOM 엔티티의 관계를 보여준다. 두 시스템 간의 데이터 연결 지점을 명확히 한다.

```mermaid
erDiagram
    %% shopby 관리 엔티티 (참조용 - shopby DB)
    MEMBER {
        string memberNo PK "shopby 회원 번호"
        string email "로그인 식별자"
        string memberName "회원명"
        string grade "회원 등급"
        datetime joinedAt "가입일"
    }

    PRODUCT {
        string productNo PK "shopby 상품 번호"
        string productName "상품명"
        string category "카테고리"
        string productType "인쇄/일반 구분"
        boolean saleStatus "판매 상태"
    }

    ORDER_TABLE {
        string orderNo PK "shopby 주문 번호"
        string memberNo FK "회원 번호"
        string orderStatus "주문 상태 (5단계)"
        int totalAmount "총 결제 금액"
        datetime orderedAt "주문일시"
    }

    ORDER_ITEM {
        string orderItemNo PK "주문 상품 번호"
        string orderNo FK "주문 번호"
        string productNo FK "상품 번호"
        int quantity "수량"
        int itemAmount "상품 금액"
    }

    COUPON {
        string couponNo PK "쿠폰 번호"
        string memberNo FK "회원 번호"
        string couponType "상품/주문 쿠폰"
        int discountAmount "할인 금액"
        datetime expiredAt "만료일"
    }

    REVIEW {
        string reviewNo PK "리뷰 번호"
        string memberNo FK "회원 번호"
        string productNo FK "상품 번호"
        int rating "별점"
        boolean hasPhoto "사진 포함"
    }

    %% CUSTOM 관리 엔티티 (자체 DB)
    PRINT_FILE {
        string fileId PK "파일 ID"
        string orderItemNo FK "주문 상품 번호"
        string s3Key "S3 저장 경로"
        string inspectStatus "검수 상태 (APPROVED/WARNING/REJECTED)"
        string inspectReport "검수 리포트 JSON"
        datetime uploadedAt "업로드일시"
    }

    PRINT_OPTION {
        string optionId PK "옵션 ID"
        string productNo FK "상품 번호"
        string parentOptionId FK "상위 옵션 ID (종속)"
        string optionType "용지/후가공/수량 등"
        string optionValue "옵션 값"
        int sortOrder "정렬 순서"
    }

    PRICING_MATRIX {
        string priceId PK "가격 ID"
        string productNo FK "상품 번호"
        string optionCombination "옵션 조합 키"
        int basePrice "기본 가격"
        int unitPrice "단가"
        string priceFormula "가격 계산 수식"
    }

    OPTION_STORAGE {
        string storageId PK "보관함 ID"
        string memberNo FK "회원 번호"
        string productNo FK "상품 번호"
        string savedOptions "저장된 옵션 JSON"
        string fileId FK "연결된 파일 ID"
        datetime expiredAt "보관 만료일"
    }

    PRINTING_MONEY_TX {
        string txId PK "거래 ID"
        string memberNo FK "회원 번호"
        string txType "충전/사용/환불/보너스"
        int amount "금액"
        int balance "잔액"
        datetime createdAt "거래일시"
    }

    CUSTOM_ORDER_STATUS {
        string statusId PK "상태 ID"
        string orderItemNo FK "주문 상품 번호"
        string customStatus "커스텀 상태 (8단계)"
        string shopbyStatus "shopby 매핑 상태"
        string assignedTeam "담당 팀"
        datetime updatedAt "상태 변경일시"
    }

    %% 관계 정의
    MEMBER ||--o{ ORDER_TABLE : "주문"
    MEMBER ||--o{ REVIEW : "리뷰 작성"
    MEMBER ||--o{ COUPON : "쿠폰 보유"
    MEMBER ||--o{ OPTION_STORAGE : "옵션 보관"
    MEMBER ||--o{ PRINTING_MONEY_TX : "프린팅머니 거래"

    ORDER_TABLE ||--|{ ORDER_ITEM : "주문 상품"
    PRODUCT ||--o{ ORDER_ITEM : "주문됨"
    PRODUCT ||--o{ REVIEW : "리뷰 대상"
    PRODUCT ||--o{ PRINT_OPTION : "인쇄 옵션"
    PRODUCT ||--o{ PRICING_MATRIX : "가격 매트릭스"

    ORDER_ITEM ||--o| PRINT_FILE : "인쇄 파일"
    ORDER_ITEM ||--o| CUSTOM_ORDER_STATUS : "커스텀 상태"

    PRINT_OPTION ||--o{ PRINT_OPTION : "종속 관계"
    OPTION_STORAGE ||--o| PRINT_FILE : "파일 연결"
```

**핵심 포인트**:
- shopby 관리 엔티티(MEMBER, PRODUCT, ORDER 등)는 shopby DB에 존재하며 API로만 접근한다
- CUSTOM 엔티티(PRINT_FILE, PRINT_OPTION, PRICING_MATRIX 등)는 자체 DB에서 직접 관리한다
- 두 시스템의 연결점은 memberNo, productNo, orderItemNo이다
- PRINT_OPTION은 자기 참조(parentOptionId)로 용지 -> 후가공 -> 수량의 종속 체인을 구현한다

---

## 6. 시스템 아키텍처

3-Tier Hybrid 아키텍처의 전체 구조를 보여준다. 클라이언트(Tier 1/2/3), 백엔드(shopby API + NestJS BFF), 외부 서비스, 데이터 계층의 연결 관계를 시각화한다.

```mermaid
flowchart TD
    subgraph Client["클라이언트 계층"]
        subgraph T1["Tier 1: Aurora Skin (NATIVE/SKIN)"]
            T1_UI["shopby 스킨 UI\nPlain CSS + CSS Variables"]
            T1_COMP["@shopby/react-components"]
        end
        subgraph T2["Tier 2: CUSTOM 모듈"]
            T2_UI["인쇄 특화 UI\nTailwind CSS + Radix UI"]
            T2_UPLOAD["파일 업로드 모듈"]
            T2_OPTION["종속옵션 선택기"]
            T2_PRICE["가격 시뮬레이터"]
        end
        subgraph T3["Tier 3: 관리자 백오피스"]
            T3_UI["관리자 UI\nTailwind CSS + shadcn/ui"]
            T3_DASH["대시보드"]
            T3_ORDER["주문/파일 관리"]
        end
    end

    subgraph Backend["백엔드 계층"]
        SHOP_API["shopby API\n회원/상품/주문/결제"]
        SHOP_SERVER["shopby Server API\n관리자 전용 (인증 필요)"]
        BFF["NestJS BFF\n인쇄 특화 CUSTOM API"]
    end

    subgraph External["외부 서비스"]
        INICIS["KG이니시스\nPG 결제"]
        NPAY["네이버페이\n간편결제"]
        S3["AWS S3\n인쇄 파일 저장"]
        PITSTOP["PitStop Server\nPDF 프리플라이트"]
        KAKAO_NOTI["카카오 알림톡\n주문 알림"]
        POPBILL["팝빌 API\n증빙서류 발급"]
        KAKAO_MAP["카카오맵\n찾아오시는 길"]
    end

    subgraph Data["데이터 계층"]
        SHOP_DB[("shopby DB\n(managed)\n회원/상품/주문")]
        CUSTOM_DB[("CUSTOM DB\n(자체 관리)\n인쇄파일/옵션/가격")]
    end

    %% Tier 1 연결
    T1_UI --> SHOP_API
    T1_COMP --> SHOP_API

    %% Tier 2 연결
    T2_UI --> BFF
    T2_UPLOAD --> S3
    T2_UPLOAD --> BFF
    T2_OPTION --> BFF
    T2_PRICE --> BFF

    %% Tier 3 연결
    T3_UI --> SHOP_SERVER
    T3_UI --> BFF
    T3_DASH --> BFF
    T3_ORDER --> BFF

    %% BFF 연결
    BFF --> S3
    BFF --> PITSTOP
    BFF --> KAKAO_NOTI
    BFF --> CUSTOM_DB
    BFF --> SHOP_API

    %% 외부 서비스 연결
    SHOP_API --> INICIS
    SHOP_API --> NPAY
    SHOP_API --> SHOP_DB
    BFF --> POPBILL
    T1_UI --> KAKAO_MAP
```

**핵심 포인트**:
- Tier 1(NATIVE/SKIN)은 shopby API와 직접 통신하며, Plain CSS를 사용한다
- Tier 2(CUSTOM)는 NestJS BFF를 통해 인쇄 특화 로직을 처리하며, Tailwind + Radix UI를 사용한다
- Tier 3(관리자)는 shopby Server API + NestJS BFF 양쪽 모두와 통신한다
- 파일 업로드는 S3 직접 업로드(Presigned URL) + BFF 검수 요청의 2단계 구조이다
- shopby DB는 관리형(managed)이고, CUSTOM DB만 직접 관리한다

---

## 7. 도메인 상호작용 맵

7개 도메인과 CUSTOM 모듈 간의 데이터 흐름과 의존 관계를 보여준다. 도메인별 기능 수와 우선순위, CUSTOM 모듈의 규모와 연결 지점을 한눈에 파악할 수 있다.

```mermaid
flowchart LR
    subgraph Primary["1순위 도메인"]
        MEMBER["MEMBER\n로그인/회원\n18개 기능\nP1:12 P2:5 P3:1"]
        ORDER["ORDER\n주문관리\n15개 기능\nP1:12 P2:2 P3:1"]
        PRODUCT["PRODUCT\n상품관리\n14개 기능\nP1:11 P2:3"]
    end

    subgraph Secondary["2순위 도메인"]
        MYPAGE["MYPAGE\n마이페이지\n16개 기능\nP1:9 P2:7"]
        PAGES["Pages+Content+Payment\n페이지/콘텐츠/결제\n9개 기능\nP1:5 P2:3 P3:1"]
    end

    subgraph Tertiary["3순위 도메인"]
        CS["CS+Admin\n고객센터/관리자\n9개 기능\nP1:2 P2:6 P3:1"]
        STATS["Statistics\n통계\n7개 기능\nP1:1 P2:4 P3:2"]
    end

    subgraph CustomModules["CUSTOM 모듈"]
        CM_FILE["파일 업로드/검수\n규모: XL"]
        CM_OPTION["종속옵션+가격엔진\n규모: XL"]
        CM_STORAGE["옵션보관함\n규모: L"]
        CM_MONEY["프린팅머니\n규모: M"]
        CM_TRACK["주문상태 트래킹\n규모: L"]
    end

    %% 도메인 간 데이터 흐름
    MEMBER -- "회원 인증" --> ORDER
    MEMBER -- "회원 정보" --> MYPAGE
    PRODUCT -- "상품/옵션 데이터" --> ORDER
    ORDER -- "주문 데이터" --> MYPAGE
    ORDER -- "주문 데이터" --> STATS
    PRODUCT -- "상품 데이터" --> PAGES

    %% CUSTOM 모듈 연결
    CM_FILE -. "파일 검수" .-> ORDER
    CM_OPTION -. "옵션/가격" .-> PRODUCT
    CM_OPTION -. "주문 옵션" .-> ORDER
    CM_STORAGE -. "재주문" .-> MYPAGE
    CM_STORAGE -. "파일 연결" .-> CM_FILE
    CM_MONEY -. "충전/사용" .-> MYPAGE
    CM_MONEY -. "결제 연동" .-> ORDER
    CM_TRACK -. "상태 추적" .-> ORDER
    CM_TRACK -. "주문 조회" .-> MYPAGE
```

**핵심 포인트**:
- Primary 도메인(MEMBER, ORDER, PRODUCT)이 전체 기능의 54%를 차지하며 가장 먼저 구현해야 한다
- CUSTOM 모듈 5개 중 4개(파일, 옵션, 보관함, 트래킹)가 ORDER 도메인과 연결된다
- MYPAGE는 ORDER, MEMBER, CUSTOM 모듈 모두와 연결되어 의존성이 가장 복잡하다
- 종속옵션+가격엔진(XL)은 PRODUCT와 ORDER 양쪽에 걸쳐 있어 가장 복잡한 CUSTOM 모듈이다

---

## 8. 후속 SPEC 의존성 체인

SPEC-PLAN-001에서 파생되는 7개 후속 SPEC의 생성 순서와 데이터 의존 관계를 보여준다. 병렬 착수 가능한 SPEC과 선행 SPEC이 필요한 SPEC을 구분한다.

```mermaid
flowchart LR
    PLAN["SPEC-PLAN-001\n마스터 기획서\n25개 정책 + 88개 기능"]

    subgraph Phase1["Phase 1: Primary"]
        MEMBER["SPEC-MEMBER-001\n로그인/회원\n18개 기능\nshopby API 기반"]
        ORDER["SPEC-ORDER-001\n주문관리\n15개 기능\nHybrid (API+인쇄리서치)"]
        PRODUCT["SPEC-PRODUCT-001\n상품관리\n14개 기능\n인쇄 리서치 기반"]
    end

    subgraph Phase2["Phase 2: Secondary"]
        MYPAGE["SPEC-MYPAGE-001\n마이페이지\n16개 기능\nHybrid"]
        PAGE["SPEC-PAGE-001\n페이지/콘텐츠\n9개 기능\nshopby 스킨 기반"]
    end

    subgraph Phase3["Phase 3: Tertiary"]
        CS["SPEC-CS-001\n고객센터/관리자\n9개 기능\nshopby API 기반"]
        STATS["SPEC-STATS-001\n통계\n7개 기능\nHybrid"]
    end

    %% PLAN -> Phase 1
    PLAN -- "정책 결정\n기능 분류" --> MEMBER
    PLAN -- "정책 결정\nCUSTOM 정의" --> ORDER
    PLAN -- "정책 결정\nCUSTOM 정의" --> PRODUCT

    %% Phase 1 -> Phase 2 (데이터 의존성)
    MEMBER -- "회원 인증\n회원 정보" --> MYPAGE
    ORDER -- "주문 데이터" --> MYPAGE
    PRODUCT -- "상품 데이터" --> PAGE

    %% Phase 1 내 의존성
    MEMBER -- "회원 인증" --> ORDER
    PRODUCT -- "상품 옵션\n가격 엔진" --> ORDER

    %% Phase 2 -> Phase 3
    ORDER -- "주문 데이터" --> STATS

    %% 독립적 SPEC
    PAGE -.- CS
    Note1["PAGE, CS는 상대적 독립\n병렬 착수 가능"]

    subgraph Prerequisites["전제 조건"]
        PRE1["25개 운영정책 결정 완료"]
        PRE2["CUSTOM 모듈 상세 정의"]
        PRE3["shopby API 연동 검증"]
        PRE4["PG사 계약 완료"]
    end

    PRE1 -. "전체 영향" .-> Phase1
    PRE2 -. "ORDER, PRODUCT" .-> ORDER
    PRE2 -. "ORDER, PRODUCT" .-> PRODUCT
    PRE3 -. "MEMBER, MYPAGE" .-> MEMBER
    PRE4 -. "ORDER" .-> ORDER
```

**핵심 포인트**:
- Phase 1의 MEMBER, ORDER, PRODUCT는 병렬 착수 가능하나 ORDER는 MEMBER와 PRODUCT에 데이터 의존성이 있다
- MYPAGE는 MEMBER + ORDER의 데이터가 모두 필요하므로 Phase 2로 배치된다
- PAGE와 CS는 상대적으로 독립적이어서 Phase 1 완료를 기다리지 않고 착수 가능하다
- 4가지 전제 조건(정책 결정, CUSTOM 정의, API 검증, PG 계약)이 전체 SPEC 착수의 블로킹 요소이다
- STATS는 ORDER 데이터에 가장 강하게 의존하므로 Phase 3 후반에 배치된다

---

## 추적성

| 참조 다이어그램 | 관련 SPEC 절 | 데이터 소스 |
|---------------|-------------|------------|
| 1. 사이트 전체 UserFlow | spec.md 2절 (EARS 요구사항) | features-data.json |
| 2. 인쇄 주문 라이프사이클 | spec.md 5절 (CUSTOM 모듈 #5) | research-printing.md |
| 3. 결제 흐름 | spec.md 3절 (정책 #7, #8, #15) | policies-data.json |
| 4. 파일 업로드/검수 흐름 | spec.md 5절 (CUSTOM 모듈 #1) | research-printing.md |
| 5. Hybrid ERD | spec.md 5절 (CUSTOM 모듈 전체) | custom-dev-data.json |
| 6. 시스템 아키텍처 | spec.md 7절 (기술 제약사항) | plan.md 3절 |
| 7. 도메인 상호작용 맵 | spec.md 4절 (도메인 분류) | features-data.json |
| 8. 후속 SPEC 의존성 체인 | spec.md 6절 (SPEC 생성 계획) | plan.md 5절 |
