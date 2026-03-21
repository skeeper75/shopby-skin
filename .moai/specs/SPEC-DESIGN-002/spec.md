---
id: SPEC-DESIGN-002
version: "1.0.0"
status: draft
created: "2026-03-19"
updated: "2026-03-19"
author: MoAI
priority: P1
issue_number: 0
tags: [SPEC-DESIGN-002, pencil-mcp, UI-design, huni-printing, IA, design-system]
related_specs: [SPEC-SCREEN-001, SPEC-PLUGIN-002, SPEC-LAYOUT-001, SPEC-LAYOUT-002]
---

# SPEC-DESIGN-002: 후니프린팅 전체 IA Pencil MCP 디자인

## 1. 개요

후니프린팅 리뉴얼 프로젝트의 **전체 88개 화면**을 Pencil MCP(.pen 파일)로 디자인한다. huni-screen-guide 플러그인(SPEC-PLUGIN-002)의 화면별 스펙을 기반으로, 실제 웹사이트에서 동작하는 **UserFlow 단위**로 화면을 그룹화하여 디자인한다.

### 범위

| 구분 | 화면 수 | 뷰포트 | .pen 파일 수 |
|------|--------|--------|-------------|
| 쇼핑몰(A) | 38개 | PC(1280px) + Mobile(375px) | 10개 |
| 관리자(B) | 50개 | PC only (min 1024px) | 10개 |
| **합계** | **88개** | - | **20개** |

### 참조 문서

- `SPEC-SCREEN-001`: 전체 화면 설계 마스터 플랜
- `SPEC-PLUGIN-002`: huni-screen-guide 플러그인 v2.0
- `SPEC-LAYOUT-001/002`: 반응형 레이아웃 시스템
- `.claude/skills/innojini-huni-screen-guide/`: 화면별 상세 스펙
- `.claude/skills/innojini-huni-screen-guide/reference.md`: 컴포넌트 카탈로그 & 디자인 토큰

---

## 2. 핵심 원칙

### [HARD] 디자인 시스템 준수

모든 디자인은 후니프린팅 디자인 시스템 토큰을 사용해야 한다.

- 색상: CSS Variable 토큰 사용 (하드코딩 금지)
- 타이포그래피: Noto Sans KR, t1~t10 스케일
- 간격: 4px 기반 스케일 (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- 브레이크포인트: sm(640) / md(768) / lg(1024) / xl(1280)

### [HARD] 컴포넌트 외곽선 규칙

모든 UI 컴포넌트는 반드시 외곽선(stroke/border)이 있어야 한다.

적용 대상: Card, Input, Button, Table, Modal, Panel, Badge, Dropdown, Tab 등
기본 설정: `stroke: {align: "inside", fill: "$--border", thickness: 1}`

### [HARD] 듀얼 뷰포트 레이아웃

쇼핑몰(A*) 화면은 PC + Mobile 두 뷰포트를 하나의 .pen 파일에 배치한다.

- PC 프레임: 1280px 너비 (좌측)
- Mobile 프레임: 375px 너비 (PC 프레임 우측 100px 간격)
- 관리자(B*) 화면: PC only (최소 1024px)

### [HARD] UserFlow 기반 그룹화

화면은 개별 페이지가 아닌 실제 사용자 흐름(UserFlow) 단위로 .pen 파일에 그룹화한다.

- 로그인 → 아이디찾기 → 비밀번호찾기 = 하나의 flow
- 장바구니 → 주문서 → 결제 → 완료 = 하나의 flow
- 상품목록 → 상품상세 → 옵션선택 = 하나의 flow

---

## 3. 디자인 토큰

### 색상 시스템

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `$--primary` | #5538B6 | 브랜드 기본 |
| `$--primary-foreground` | #FFFFFF | 기본 위 텍스트 |
| `$--primary-dark` | #3B2573 | hover 상태 |
| `$--primary-secondary` | #9580D9 | 보조 |
| `$--primary-light` | #EEEBF9 | 밝은 배경 |
| `$--foreground` | #424242 | 본문 텍스트 |
| `$--muted-foreground` | #979797 | 비활성 텍스트 |
| `$--background` | #FFFFFF | 페이지 배경 |
| `$--card` | #F6F6F6 | 섹션 배경 |
| `$--border` | #CACACA | 기본 테두리 |
| `$--destructive` | #EF4444 | 에러/삭제 |
| `$--color-success` | #22C55E | 성공/완료 |
| `$--color-warning` | #EAB308 | 경고 |
| `$--color-info` | #3B82F6 | 정보 |
| `$--accent-gold` | #E6B93F | 강조 골드 |
| `$--accent-teal` | #7AC8C4 | 강조 틸 |

### 타이포그래피

| 용도 | 크기 | 굵기 |
|------|------|------|
| 캡션/뱃지 | 11px | 400 |
| 보조 텍스트 | 12px | 400 |
| 소형 본문 | 13px | 400 |
| 기본 본문 | 14px | 400 |
| 강조 본문 | 16px | 500 |
| 소제목 | 18px | 700 |
| 제목 | 20px | 700 |
| 페이지 제목 | 24px | 700 |
| 히어로 제목 | 26px | 700 |

### 간격 스케일

4px 기반: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

---

## 4. 레이아웃 패턴

### 쇼핑몰 레이아웃

| 화면 유형 | maxWidth | 레이아웃 | 예시 |
|----------|----------|---------|------|
| 메인/카탈로그 | 1280px | PageShell | Main, ProductList |
| 상품 상세 | 1280px | SplitLayout (8:4) | PrintProduct |
| 주문/장바구니 | 1024px | SplitLayout (8:4) | Cart, OrderSheet |
| 폼 페이지 | 896px | FormLayout | MemberEdit |
| 인증 페이지 | 384~448px | PageShell (center) | Login, SignUp |

### 관리자 레이아웃

```
+------------+------------------------------------------+
| Sidebar    | Header (64px)                            |
| 260px      |------------------------------------------|
| - Logo     | Content Area                             |
| - Nav      | - FilterSection                          |
| - Footer   | - StatusTabs                             |
|            | - DataTable                              |
|            | - Pagination                             |
+------------+------------------------------------------+
```

---

## 5. 파일 구조

### ref/IA/ 디렉토리

```
ref/IA/
├── 00-design-system/
│   └── huni-design-system.pen          # 디자인 토큰, 컴포넌트 라이브러리
│
├── A1-login/
│   └── login-flow.pen                  # 로그인, 아이디찾기, 비밀번호찾기, SNS로그인
│                                        # (4 screens × PC+Mobile = 8 frames)
│
├── A2-signup/
│   └── signup-flow.pen                 # 약관동의, 정보입력, 본인인증, 가입완료, 비회원주문
│                                        # (5 screens × PC+Mobile = 10 frames)
│
├── A3-mypage/
│   ├── mypage-dashboard.pen            # 대시보드, 주문내역, 주문상세, 배송조회, 취소/반품, 찜목록, 최근본상품, 영수증
│   │                                    # (8 screens × PC+Mobile = 16 frames)
│   └── mypage-detail.pen              # 쿠폰함, 인쇄적립금, 내리뷰, 리뷰작성, 1:1문의, 문의작성, 회원정보, 비밀번호변경
│                                        # (8 screens × PC+Mobile = 16 frames)
│
├── A4-cs/
│   └── customer-center.pen             # 공지사항목록, 공지상세, FAQ, 1:1문의, 문의작성, 비회원주문조회, 입금확인
│                                        # (7 screens × PC+Mobile = 14 frames)
│
├── A5A6-order/
│   └── order-checkout.pen              # 파일업로드, 장바구니, 배송지, 주소록, 결제, 주문완료, 수동카드결제
│                                        # (7 screens × PC+Mobile = 14 frames)
│
├── A7A8-info/
│   └── info-guide.pen                  # 회사소개, 이용약관, 개인정보, 오시는길, 이용안내, 인쇄가이드 등
│                                        # (15 screens × PC+Mobile = 30 frames)
│
├── A10-product/
│   ├── product-catalog.pen             # 메인페이지, 서브메인, 상품목록, 검색결과, 카테고리
│   │                                    # (8 screens × PC+Mobile = 16 frames)
│   └── product-detail.pen             # 인쇄상품 상세(Step Wizard 6단계), 옵션선택, 가격계산, 미리보기
│                                        # (10 screens × PC+Mobile = 20 frames)
│
├── B1-admin/
│   └── admin-base.pen                  # 관리자 로그인, 대시보드, GNB, 사이드바, 공통 패턴
│                                        # (7 screens, PC only = 7 frames)
│
├── B4-product-mgmt/
│   ├── print-register.pen              # 인쇄상품 등록, 사이즈팝업, 가격팝업(8종)
│   │                                    # (10 screens, PC only = 10 frames)
│   └── product-list.pen               # 상품목록/검색, 카테고리관리, 일반상품등록/수정
│                                        # (8 screens, PC only = 8 frames)
│
├── B5-board/
│   └── board-mgmt.pen                  # 공지관리, FAQ관리, 문의관리, 문의답변, 리뷰관리, 리뷰답변, 팝업관리, 배너관리
│                                        # (8 screens, PC only = 8 frames)
│
├── B6-member/
│   └── member-mgmt.pen                # 회원목록, 회원상세, 탈퇴회원, 인쇄적립금관리, 쿠폰등록, 쿠폰목록, 쿠폰발급
│                                        # (7 screens, PC only = 7 frames)
│
├── B7-stats/
│   └── stats-dashboard.pen             # 인쇄통계, 제본통계, 상품통계, 월별매출, 정산, 팀별실적, 기간비교, 대시보드
│                                        # (8 screens, PC only = 8 frames)
│
├── B8-order/
│   ├── order-mgmt.pen                  # 인쇄주문목록, 제본주문목록, 주문상세, 상태변경, 일괄처리, SMS발송
│   │                                    # (8 screens, PC only = 8 frames)
│   └── file-check.pen                 # 파일확인, 재업로드요청, 파일비교, 승인/반려, 파일이력, 자동검증
│                                        # (6 screens, PC only = 6 frames)
│
└── B9-print/
    ├── print-process.pen               # 파일검증, 인쇄작업지시, 공정관리, 일일생산계획, 장비배정, 작업완료
    │                                    # (8 screens, PC only = 8 frames)
    └── quality-outsource.pen           # 품질검사, 불량처리, 외주발주, 외주관리, 외주정산, 납품검수
                                         # (6 screens, PC only = 6 frames)
```

### 파일 수 합계

| 영역 | .pen 파일 수 | 프레임 수 |
|------|-------------|----------|
| 디자인 시스템 | 1 | ~10 |
| 쇼핑몰(A) PC+Mobile | 10 | ~144 |
| 관리자(B) PC only | 9 | ~62 |
| **합계** | **20** | **~216** |

---

## 6. 요구사항 (EARS Format)

### REQ-01: 디자인 시스템 변수 설정 [HARD]

**WHERE** Pencil MCP .pen 파일이 생성될 때
**THE SYSTEM SHALL** 후니프린팅 디자인 시스템에 맞는 디자인 토큰 변수를 설정한다

**인수 조건:**
- [ ] AC-01-1: 섹션 3의 색상 토큰 16종이 .pen 변수로 설정됨
- [ ] AC-01-2: 폰트 패밀리가 Noto Sans KR로 설정됨
- [ ] AC-01-3: 간격 스케일이 4px 기반으로 설정됨
- [ ] AC-01-4: get_screenshot으로 색상 정확도 검증됨

### REQ-02: 컴포넌트 외곽선 [HARD]

**WHERE** UI 컴포넌트가 .pen 파일에 배치될 때
**THE SYSTEM SHALL** 모든 컴포넌트에 가시적인 border/outline(stroke)을 적용한다

**인수 조건:**
- [ ] AC-02-1: Card, Input, Button, Table, Modal, Panel에 stroke 속성 존재
- [ ] AC-02-2: 기본 stroke: `{align: "inside", fill: "$--border", thickness: 1}`
- [ ] AC-02-3: Primary 버튼은 `fill: "$--primary"` stroke 사용

### REQ-03: 듀얼 뷰포트 레이아웃 [HARD]

**WHERE** 쇼핑몰(A*) 화면이 디자인될 때
**THE SYSTEM SHALL** PC(1280px)와 Mobile(375px) 두 뷰포트를 같은 .pen 파일에 생성한다

**인수 조건:**
- [ ] AC-03-1: PC 프레임 1280px 너비, Mobile 프레임 375px 너비
- [ ] AC-03-2: Mobile은 PC 우측 100px 간격에 배치
- [ ] AC-03-3: 각 프레임에 "PC" / "Mobile" 라벨 포함
- [ ] AC-03-4: 관리자(B*) 화면은 PC only (1440px 너비)

### REQ-04: UserFlow 기반 디자인 [HARD]

**WHERE** 화면이 .pen 파일로 그룹화될 때
**THE SYSTEM SHALL** 실제 웹사이트 사용자 흐름 단위로 화면을 배치한다

**인수 조건:**
- [ ] AC-04-1: 로그인 flow (로그인→아이디찾기→비번찾기) 하나의 .pen
- [ ] AC-04-2: 주문 flow (장바구니→주문서→결제→완료) 하나의 .pen
- [ ] AC-04-3: 각 flow 내 화면은 좌→우 순서로 배치 (사용 흐름 순)
- [ ] AC-04-4: 화면 간 연결 화살표 또는 흐름 라벨 포함

### REQ-05: 파일 조직 [HARD]

**WHERE** .pen 파일이 저장될 때
**THE SYSTEM SHALL** ref/IA/{domain}/ 구조로 파일을 저장한다

**인수 조건:**
- [ ] AC-05-1: ref/IA/ 아래 도메인별 하위 디렉토리 존재
- [ ] AC-05-2: 파일명은 영문 kebab-case
- [ ] AC-05-3: 총 20개 .pen 파일 생성 (섹션 5 구조 준수)

### REQ-06: 디자인 시스템 일관성 [HARD]

**WHERE** 신규 컴포넌트가 필요할 때
**THE SYSTEM SHALL** 디자인 토큰을 사용하여 일관된 규칙으로 작성한다

**인수 조건:**
- [ ] AC-06-1: 하드코딩된 hex 색상 없음 (모두 $-- 변수 사용)
- [ ] AC-06-2: 간격은 4px 배수만 사용
- [ ] AC-06-3: 폰트 크기는 t1~t10 스케일만 사용
- [ ] AC-06-4: 신규 컴포넌트도 기존 패턴과 동일한 스타일 적용

### REQ-07: 전체 화면 커버리지 [SOFT]

**THE SYSTEM SHALL** 88개 전체 화면을 4개 실행 페이즈에 걸쳐 디자인한다

**인수 조건:**
- [ ] AC-07-1: Phase 0 - 디자인 시스템 (1 .pen)
- [ ] AC-07-2: Phase 1 - 핵심 쇼핑 (A1, A2, A10, A5/A6 = 34 screens)
- [ ] AC-07-3: Phase 2 - 고객 경험 (A3, A4, A7/A8 = 38 screens)
- [ ] AC-07-4: Phase 3 - 관리자 기본 (B1, B4, B5, B6 = 40 screens)
- [ ] AC-07-5: Phase 4 - 관리자 운영 (B7, B8, B9 = 22 screens)

### REQ-08: huni-screen-guide 준수 [HARD]

**WHERE** 화면 상세 정보가 필요할 때
**THE SYSTEM SHALL** huni-screen-guide 플러그인 모듈을 참조하여 정확한 화면 스펙을 따른다

**인수 조건:**
- [ ] AC-08-1: 각 화면이 해당 모듈의 레이아웃 컴포넌트 사용
- [ ] AC-08-2: shopby API 매핑에 맞는 데이터 구조 반영
- [ ] AC-08-3: 정책 기본값(배송, 결제, 쿠폰, 리뷰)이 UI에 반영됨

### REQ-09: 관리자 패턴 준수 [SOFT]

**WHERE** 관리자 화면이 디자인될 때
**THE SYSTEM SHALL** shopby 관리자 공통 패턴을 따른다

**인수 조건:**
- [ ] AC-09-1: AdminLayout (Sidebar 260px + Header 64px + Content)
- [ ] AC-09-2: 목록 화면: FilterSection → StatusTabs → DataTable → Pagination
- [ ] AC-09-3: 상세 화면: Breadcrumbs → FormLayout → ActionBar
- [ ] AC-09-4: DataTable 컬럼은 각 모듈 스펙 준수

### REQ-10: 디자인 검증 [HARD]

**WHERE** 화면 디자인이 완료될 때
**THE SYSTEM SHALL** get_screenshot으로 시각적 정확성을 검증한다

**인수 조건:**
- [ ] AC-10-1: 주요 디자인 작업 후 스크린샷 확인
- [ ] AC-10-2: 레이아웃 깨짐 없음 확인
- [ ] AC-10-3: 텍스트 가독성 확인
- [ ] AC-10-4: 컴포넌트 정렬 확인

---

## 7. 실행 계획

### Phase 0: 디자인 시스템 기초 (선행 필수)

| 작업 | 파일 | 내용 |
|------|------|------|
| 변수 설정 | huni-design-system.pen | 색상 16종 + 폰트 + 간격 토큰 |
| 컴포넌트 스워치 | huni-design-system.pen | Button, Input, Card, Badge, Table 기본 |
| 검증 | - | get_screenshot으로 토큰 정확도 확인 |

### Phase 1: 핵심 쇼핑 흐름 (34 screens)

| 우선순위 | 파일 | 화면 | 참조 모듈 |
|---------|------|------|----------|
| P1 | A10 product-catalog.pen | 메인, 서브메인, 상품목록 | modules/product-catalog.md |
| P1 | A10 product-detail.pen | 인쇄상품 상세 (Step Wizard) | modules/product-catalog.md |
| P1 | A5A6 order-checkout.pen | 파일업로드, 장바구니, 주문 | modules/order-checkout.md |
| P2 | A1 login-flow.pen | 로그인, 아이디/비번찾기 | modules/login-signup.md |
| P2 | A2 signup-flow.pen | 회원가입 전체 흐름 | modules/login-signup.md |

### Phase 2: 고객 경험 (38 screens)

| 우선순위 | 파일 | 화면 | 참조 모듈 |
|---------|------|------|----------|
| P1 | A3 mypage-dashboard.pen | 대시보드, 주문내역 | modules/mypage.md |
| P1 | A3 mypage-detail.pen | 쿠폰, 리뷰, 문의 | modules/mypage.md |
| P2 | A4 customer-center.pen | 공지, FAQ, 문의 | modules/customer-center.md |
| P3 | A7A8 info-guide.pen | 회사소개, 약관, 가이드 | modules/info-guide.md |

### Phase 3: 관리자 기본 (40 screens)

| 우선순위 | 파일 | 화면 | 참조 모듈 |
|---------|------|------|----------|
| P1 | B1 admin-base.pen | 로그인, 대시보드, 공통 | modules/admin-management.md |
| P1 | B4 print-register.pen | 인쇄상품 등록 | modules/admin-product-board.md |
| P1 | B4 product-list.pen | 상품목록, 카테고리 | modules/admin-product-board.md |
| P2 | B5 board-mgmt.pen | 게시판 관리 | modules/admin-product-board.md |
| P2 | B6 member-mgmt.pen | 회원, 적립금, 쿠폰 | modules/admin-product-board.md |

### Phase 4: 관리자 운영 (22 screens)

| 우선순위 | 파일 | 화면 | 참조 모듈 |
|---------|------|------|----------|
| P1 | B8 order-mgmt.pen | 인쇄/제본 주문관리 | modules/admin-order-stats.md |
| P1 | B8 file-check.pen | 파일확인, 재업로드 | modules/admin-order-stats.md |
| P2 | B7 stats-dashboard.pen | 통계, 매출, 정산 | modules/admin-order-stats.md |
| P2 | B9 print-process.pen | 인쇄작업, 공정관리 | modules/admin-order-stats.md |
| P3 | B9 quality-outsource.pen | 품질, 외주 | modules/admin-order-stats.md |

---

## 8. 에이전트 전략

### 실행 모드

- **--team**: expert-frontend(team-designer) 에이전트 병렬 실행
- **--loop**: 각 Phase 내 파일별 반복 디자인-검증 루프
- **--auto**: Phase 내 파일 간 자동 진행
- **--mx**: 디자인 파일에 @MX 태그 불필요 (코드 아님)

### 에이전트 도구

| 도구 | 용도 |
|------|------|
| `mcp__pencil__open_document` | .pen 파일 생성/열기 |
| `mcp__pencil__set_variables` | 디자인 토큰 변수 설정 |
| `mcp__pencil__get_style_guide_tags` | 스타일 가이드 태그 조회 |
| `mcp__pencil__get_style_guide` | 스타일 가이드 적용 |
| `mcp__pencil__batch_design` | 디자인 요소 삽입/수정 (max 25 ops) |
| `mcp__pencil__get_screenshot` | 디자인 검증 |
| `mcp__pencil__snapshot_layout` | 레이아웃 구조 확인 |
| `mcp__pencil__find_empty_space_on_canvas` | 캔버스 빈 공간 탐색 |

### 세션 관리

- Phase 간 `/clear` 실행 (컨텍스트 초기화)
- 각 Phase 시작 시 huni-screen-guide 해당 모듈 로드
- 디자인 시스템 .pen 파일은 Phase 0에서 생성, 이후 참조

---

## 9. 품질 기준

### 디자인 품질 체크리스트

- [ ] 모든 색상이 디자인 토큰 변수 사용
- [ ] 모든 컴포넌트에 외곽선 존재
- [ ] PC/Mobile 뷰포트 정확한 크기
- [ ] UserFlow 순서에 맞는 화면 배치
- [ ] 텍스트 가독성 (최소 11px)
- [ ] 적절한 여백과 정렬
- [ ] 관리자 화면 DataTable 패턴 준수
- [ ] get_screenshot 검증 완료

### 완료 기준

| 항목 | 기준 |
|------|------|
| .pen 파일 수 | 20개 |
| 쇼핑몰 프레임 수 | ~144개 (PC+Mobile) |
| 관리자 프레임 수 | ~62개 (PC only) |
| 디자인 토큰 적용률 | 100% |
| 컴포넌트 외곽선 적용률 | 100% |
| 스크린샷 검증 | 모든 파일 |

---

## 10. 리스크 & 완화

| 리스크 | 영향 | 완화 |
|--------|------|------|
| .pen 파일당 프레임 과다 | 성능 저하 | 파일당 최대 20 프레임, 초과 시 분할 |
| batch_design 25 ops 제한 | 복잡한 화면 구현 어려움 | 화면당 3-5회 batch_design 호출 |
| 디자인 토큰 불일치 | 비일관적 디자인 | Phase 0에서 토큰 검증 후 진행 |
| 88개 화면 규모 | 세션 컨텍스트 초과 | 4 Phase 분할 + /clear |
| Mobile 레이아웃 복잡도 | 단순화 과다 | huni-screen-guide 모바일 스펙 참조 |
