---
id: SPEC-SCREEN-001
type: plan
tags: [SPEC-SCREEN-001, implementation-plan]
---

# SPEC-SCREEN-001: 구현 계획

## 1. 구현 전략 개요

80+ 화면을 7개 Phase로 분할하여 **고객 여정 우선** 전략으로 구현한다. 각 Phase는 독립적으로 배포 가능하며, Phase 내에서는 NATIVE --> SKIN --> CUSTOM 순으로 구현하여 리스크를 최소화한다.

### 기술 접근 방식

| 영역 | 전략 |
|------|------|
| 쇼핑몰 프론트엔드 | Aurora Skin 기반 + PageShell/ResponsiveGrid 레이아웃 |
| 관리자 백오피스 | Tailwind CSS + shadcn/ui + AdminLayout (SPEC-SKIN-005) |
| 인쇄 특화 모듈 | CUSTOM 독립 모듈 (별도 API + 상태 관리) |
| API 연동 | shopby Shop API + 커스텀 BFF (인쇄 가격엔진, 파일처리) |

---

## 2. Phase별 구현 계획

### Phase 1: 핵심 고객 여정 (Primary Goal)

**목표**: 상품 탐색부터 결제 완료까지 기본 구매 플로우 완성

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-A1-LOGIN | 일반 로그인 | NATIVE | S | - |
| SCR-A1-FIND-ID | 아이디 찾기 | NATIVE | S | - |
| SCR-A1-FIND-PW | 비밀번호 찾기 | NATIVE | S | - |
| SCR-A1-SIGNUP | 회원가입 | NATIVE | M | - |
| SCR-A10-MAIN | 메인 페이지 | SKIN | L | SPEC-LAYOUT-002 완료 |
| SCR-A10-LIST | 상품 목록 | NATIVE | M | - |
| SCR-A10-DETAIL | 상품 상세 | SKIN | L | - |
| SCR-A6-CART | 장바구니 | SKIN | M | SCR-A10-DETAIL |
| SCR-A6-SHIPPING | 배송 정보 | NATIVE | M | SCR-A6-CART |
| SCR-A6-ADDRESS-LIST | 배송지 목록 | NATIVE | S | - |
| SCR-A6-PAYMENT | 결제하기 | NATIVE | L | SCR-A6-SHIPPING |
| SCR-A6-ORDER-COMPLETE | 주문 완료 | NATIVE | S | SCR-A6-PAYMENT |
| SCR-A3-ORDER-LIST | 주문 조회 | NATIVE | M | - |
| SCR-A3-MEMBER-EDIT | 회원정보 수정 | NATIVE | M | - |

**마일스톤**: 비인쇄 일반 상품의 완전한 구매 여정 완료
**주요 위험**: shopby API 호환성 이슈, Provider 체인 안정성

---

### Phase 2: 인쇄 특화 기능 (Primary Goal)

**목표**: 인쇄 전문 쇼핑몰의 핵심 차별화 기능 구현

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-A6-FILE-UPLOAD | 파일 업로드/검수 | CUSTOM | XL | AWS S3 + PitStop API 연동 |
| SCR-A10-PRINT-PRODUCT-1~4 | 출력상품 옵션+가격엔진 (4종) | CUSTOM | XL | 가격엔진 API, 마스터 데이터 |
| SCR-A3-OPTION-STORAGE | 옵션 보관함 | CUSTOM | L | 커스텀 API |
| SCR-A3-PRINTING-MONEY | 프린팅머니 | CUSTOM | M | 커스텀 MyPay API |
| SCR-A3-MONEY-CHARGE | 프린팅머니 충전 | CUSTOM | L | PG 연동 (이니시스) |
| SCR-A3-ORDER-DETAIL | 주문 상세 (인쇄 추적) | SKIN | L | Job 상태 API |

**마일스톤**: 인쇄 상품 주문 전체 플로우 (옵션선택 --> 파일업로드 --> 결제 --> 상태추적)
**주요 위험**:
- PitStop 서버 연동 안정성 (파일 검수 파이프라인)
- 종속 옵션 4단계+ 의존성 트리 복잡도
- 가격 엔진 실시간 계산 성능 (< 500ms 목표)
- PG 연동 (프린팅머니 충전)

---

### Phase 3: 관리자 핵심 (Secondary Goal)

**목표**: 상품 등록, 마스터 데이터 관리, 주문 처리 기능 구현

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-B4-PRINT-REG | 인쇄/제본 상품등록 | CUSTOM | XL | 마스터 데이터 API |
| SCR-B4-SIZE-MASTER | 사이즈 마스터 | CUSTOM | M | - |
| SCR-B4-MATERIAL-MASTER | 소재 마스터 | CUSTOM | M | - |
| SCR-B4-PAPER-MASTER | 용지 마스터 | CUSTOM | M | - |
| SCR-B4-PRICE-MASTER | 가격 마스터 | CUSTOM | L | 마스터 데이터 |
| SCR-B4-SIZE-POPUP | 사이즈 팝업 | CUSTOM | S | SCR-B4-SIZE-MASTER |
| SCR-B4-MATERIAL-POPUP | 소재 팝업 | CUSTOM | S | SCR-B4-MATERIAL-MASTER |
| SCR-B4-PAPER-POPUP | 종이 팝업 | CUSTOM | S | SCR-B4-PAPER-MASTER |
| SCR-B4-PRICE-POPUP-1~8 | 가격관리 팝업 (8종) | CUSTOM | L | SCR-B4-PRICE-MASTER |
| SCR-B8-PRINT-ORDER | 인쇄 주문관리 | CUSTOM | XL | Phase 2 완료 |
| SCR-B8-BIND-ORDER | 제본 주문관리 | CUSTOM | L | Phase 2 완료 |
| SCR-B8-FILE-CHECK | 파일 확인 처리 | CUSTOM | XL | PitStop 연동 |
| SCR-B8-REUPLOAD | 재업로드 요청 | CUSTOM | M | SCR-B8-FILE-CHECK |
| SCR-B8-STATUS-CHANGE | 주문 상태 변경 | CUSTOM | L | 주문 상태 API |
| SCR-B8-ORDER-PRINT | 주문서 출력 | SKIN | M | SPEC-SKIN-005 |

**마일스톤**: 관리자가 상품을 등록하고 주문을 처리할 수 있는 상태
**주요 위험**:
- 마스터 데이터 구조 설계 (가격 매트릭스 복잡도)
- 관리자 API Mock --> 실제 API 전환
- 가격 팝업 8종의 UI 일관성

---

### Phase 4: 커뮤니티/CS (Secondary Goal)

**목표**: 고객센터, 게시판, 회원 관리 기능 구현

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-A4-NOTICE | 공지사항 | NATIVE | S | - |
| SCR-A4-FAQ | FAQ | NATIVE | S | SPEC-LAYOUT-002 수정 완료 |
| SCR-A4-PRODUCT-QA | 상품 Q&A | NATIVE | S | - |
| SCR-A4-BULK-QUOTE | 대량주문 견적 | SKIN | M | - |
| SCR-A4-CORP-CONSULT | 기업인쇄 상담 | SKIN | M | - |
| SCR-A4-DESIGN-CONSULT | 디자인 상담 | SKIN | M | - |
| SCR-A4-GUEST-ORDER | 비회원 주문조회 | NATIVE | S | - |
| SCR-A3-INQUIRY | 1:1 문의 | NATIVE | S | - |
| SCR-A3-PRODUCT-QA | 상품 Q&A (마이페이지) | NATIVE | S | - |
| SCR-A3-MY-REVIEW | 나의 리뷰 | NATIVE | S | - |
| SCR-A3-PW-CHANGE | 비밀번호 변경 | NATIVE | S | - |
| SCR-A3-COUPON | 쿠폰 관리 | NATIVE | S | - |
| SCR-B5-NOTICE~REVIEW | 게시판 관리 (9화면) | SKIN | M*9 | - |
| SCR-B6-MEMBER | 회원 관리 | SKIN | M | - |
| SCR-B6-COUPON-MGMT | 쿠폰 관리 | SKIN | M | - |

**마일스톤**: 고객 CS 채널 및 관리자 게시판/회원 관리 완성
**주요 위험**: 게시판 9종의 일관된 UI/UX 보장

---

### Phase 5: B2B/재무 (Secondary Goal)

**목표**: 거래처 관리, 원장, 미수금, 후불결제 기능 구현

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-B2-VENDOR-MGMT | 거래처 관리 | CUSTOM | L | 거래처 DB |
| SCR-B2-VENDOR-BOARD | 매장 게시판 | CUSTOM | M | SCR-B2-VENDOR-MGMT |
| SCR-B3-ACCOUNT | 계좌 관리 | CUSTOM | M | - |
| SCR-B3-LEDGER | 원장 관리 | CUSTOM | XL | 계좌 + 거래처 데이터 |
| SCR-B3-RECEIVABLES | 업체별 미수금 | CUSTOM | L | SCR-B3-LEDGER |
| SCR-B8-DEFERRED-PAY | 후불결제 관리 | CUSTOM | L | 거래처 + 주문 |
| SCR-B8-RECEIPTS | 증빙서류 관리 | SKIN | M | 주문 데이터 |
| SCR-B8-SMS | SMS/알림톡 발송 | CUSTOM | M | 알림톡 API |
| SCR-A3-RECEIPTS | 증빙서류 (고객) | SKIN | M | - |
| SCR-A3-BIZ-INFO | 사업자 정보 | SKIN | S | - |
| SCR-A3-CASH-RECEIPT | 현금영수증 | SKIN | S | - |

**마일스톤**: B2B 거래 및 재무 관리 기능 완성
**주요 위험**:
- 원장관리 시스템 복잡도 (XL)
- B2B 후불 결제 한도/승인 프로세스 미결정
- 별도 DB + 마이크로서비스 필요

---

### Phase 6: 마케팅/통계 (Final Goal)

**목표**: 마케팅 랜딩페이지, 체험단, 통계 기능 구현

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-A9-LANDING-PAPER~STICKER | 랜딩페이지 5종 | SKIN | M*5 | 상품 데이터 |
| SCR-A9-REVIEW-MAIN | 이용후기 메인 | SKIN | M | 리뷰 데이터 |
| SCR-A9-EXPERIENCE | 체험단 모집 | CUSTOM | L | 커스텀 API |
| SCR-A3-EXPERIENCE-TEAM | 체험단 활동 (마이페이지) | CUSTOM | M | 커스텀 API |
| SCR-B5-EXPERIENCE | 체험단 관리 | CUSTOM | L | 커스텀 API |
| SCR-B7-PRINT-STATS~TEAM-STATS | 통계 8종 | CUSTOM | M~L*8 | 주문/매출 데이터 |
| SCR-B1-ADMIN-REG | 관리자 등록 | CUSTOM | M | - |
| SCR-B1-ADMIN-MGMT | 관리자 관리 | CUSTOM | M | - |

**마일스톤**: 마케팅 및 데이터 분석 기능 완성
**주요 위험**: 통계 데이터 집계 성능, 차트 라이브러리 선정

---

### Phase 7: 콘텐츠/가이드 (Final Goal)

**목표**: 정보 페이지, 작업 가이드, 기타 보조 화면 구현

| 화면 ID | 화면명 | 분류 | 규모 | 의존성 |
|---------|--------|------|------|--------|
| SCR-A7-ABOUT | 회사 소개 | SKIN | M | - |
| SCR-A7-TERMS | 이용약관 | NATIVE | S | - |
| SCR-A7-PRIVACY | 개인정보보호 | NATIVE | S | - |
| SCR-A7-DIRECTIONS | 찾아오시는 길 | SKIN | S | Kakao Map API |
| SCR-A8-GUIDE-01~11 | 작업 가이드 11종 | SKIN | M | CMS 또는 정적 |
| SCR-A1-SNS-LOGIN | SNS 로그인 | NATIVE | S | OAuth |
| SCR-A1-SNS-EXT | 구글/애플 로그인 | EXTERNAL | M | OAuth |
| SCR-A3-WITHDRAWAL | 회원 탈퇴 | NATIVE | S | - |
| SCR-A6-DESIGN-REQUEST | 디자인 의뢰 | CUSTOM | M | 커스텀 API |
| SCR-B6-WITHDRAWN | 탈퇴 회원 | SKIN | S | - |
| SCR-B6-COUPON-ISSUE | 쿠폰 등록 내역 | SKIN | S | - |
| SCR-B6-COUPON-USE | 쿠폰 사용 내역 | SKIN | S | - |
| SCR-B6-PRINTING-MONEY | 프린팅머니 관리 (관리자) | CUSTOM | L | Phase 2 프린팅머니 |
| SCR-B4-GOODS-CAT~DESIGN-REG | 기타 상품등록 (5종) | SKIN~CUSTOM | M*5 | - |

**마일스톤**: 전체 화면 구현 완료
**주요 위험**: 작업 가이드 11종 콘텐츠 준비 (디자인 팀 의존)

---

## 3. Phase 간 의존성 맵

```
Phase 1 (고객 여정) -----> Phase 2 (인쇄 특화)
                                |
                                v
                          Phase 3 (관리자 핵심)
                                |
                   +------------+------------+
                   |                         |
                   v                         v
          Phase 4 (CS/커뮤니티)      Phase 5 (B2B/재무)
                   |                         |
                   +------------+------------+
                                |
                                v
                   +------------+------------+
                   |                         |
                   v                         v
          Phase 6 (마케팅/통계)      Phase 7 (콘텐츠/가이드)
```

- Phase 1, 2는 순차 실행 (1 --> 2)
- Phase 3은 Phase 2 완료 후 시작
- Phase 4, 5는 Phase 3 이후 병렬 실행 가능
- Phase 6, 7은 Phase 4, 5 이후 병렬 실행 가능

---

## 4. 리스크 분석

### High 위험

| 리스크 | 영향 Phase | 대응 방안 |
|--------|----------|----------|
| PitStop 서버 연동 불안정 | Phase 2, 3 | Mock 파이프라인 선행 구현, PitStop 장애 시 수동 검수 모드 전환 |
| 종속 옵션 4단계+ 복잡도 | Phase 2 | multiLevelOptions 프론트 확장, 점진적 깊이 지원 (2단계 --> 4단계+) |
| 원장관리 XL 규모 | Phase 5 | MVP 범위 축소 (입출금 기록만), 고급 기능 후순위 |
| 미결정 정책 25건 | 전체 | 기본값 설정 + 환경변수/설정파일로 변경 가능하게 설계 |

### Medium 위험

| 리스크 | 영향 Phase | 대응 방안 |
|--------|----------|----------|
| shopby API 변경 | Phase 1, 4 | API 버전 고정, 래퍼 함수로 격리 |
| 관리자 Mock --> 실제 API 전환 | Phase 3 | API 인터페이스 선정의, Mock/실제 전환 가능한 어댑터 패턴 |
| 가격 계산 성능 | Phase 2 | 캐싱 전략 (Redis), 계산 결과 프리페치 |
| 통계 데이터 집계 성능 | Phase 6 | 배치 집계 + 캐시, 실시간 필요 시 이벤트 소싱 |

### Low 위험

| 리스크 | 영향 Phase | 대응 방안 |
|--------|----------|----------|
| Kakao Map API 변경 | Phase 7 | 래퍼 컴포넌트로 격리 |
| 작업 가이드 콘텐츠 미비 | Phase 7 | 플레이스홀더 콘텐츠로 구조 선행 구현 |
| SNS 로그인 OAuth 연동 | Phase 7 | shopby 기본 OAuth 활용 |

---

## 5. 기술 제약사항

### shopby 플랫폼 제약

- Core API 변경 불가: NATIVE 기능은 스킨 레벨 커스터마이징만 가능
- @shopby/react-components: Git 저장소 직접 설치 (외부 접근 권한 필요)
- Provider 체인: 10단계 중첩 Provider 순서 유지 필수
- 인증: JWT 기반, `fetchHttpRequest()` 중앙 집중 API 호출

### 레이아웃 제약

- SPEC-LAYOUT-001/002 컴포넌트 사용 의무
- 브레이크포인트: sm(640px), md(768px), lg(1024px), xl(1280px) 고정
- 관리자 영역: Desktop 전용 (>=1024px), Tailwind CSS

### 파일 처리 제약

- shopby 자체 파일 저장소 없음 --> AWS S3 + PitStop 전체 커스텀
- 파일 검증: 해상도(300dpi+), CMYK, 블리드(3mm), 서체 아웃라인
- Job 상태 머신: STAT_010~STAT_900 (6단계)

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-03-19 | 1.0.0 | 초안 작성 - 7 Phase 구현 계획 |
