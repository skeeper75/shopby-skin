---
spec_id: SPEC-SKIN-003
title: "상품/주문/결제"
version: 2.0.0
status: draft
created: 2026-03-14
updated: 2026-03-17
priority: High
phase: 1
ia_items: "A-10(4), A-6(7), A-5"
tech_stack: "React 18 + @shopby/react-components + Huni DS v2 (SPEC-DS-006) + Tailwind CSS"
lifecycle: spec-anchored
policies:
  - POLICY-A10B4-PRODUCT
  - POLICY-A6B8-ORDER
  - POLICY-A5-PAYMENT
  - POLICY-FILE-PROCESSING
tags:
  - TAG-SKIN-003-001
  - TAG-SKIN-003-002
  - TAG-SKIN-003-003
  - TAG-SKIN-003-004
  - TAG-SKIN-003-005
  - TAG-SKIN-003-006
  - TAG-SKIN-003-007
  - TAG-SKIN-003-008
  - TAG-SKIN-003-009
  - TAG-SKIN-003-010
  - TAG-SKIN-003-011
  - TAG-SKIN-003-012
---

# SPEC-SKIN-003 v2: 상품/주문/결제

## HISTORY

| 버전 | 날짜 | 설명 |
|------|------|------|
| 1.0.0 | 2026-03-14 | 초기 작성 (shadcn/ui + 직접 input 기반) |
| 2.0.0 | 2026-03-17 | 전면 재작성: Huni DS v2 통합, 정책 문서 반영, 12 TAG 분해 |

## 1. 개요

인쇄 전문 쇼핑몰의 핵심 비즈니스 플로우를 구현한다. 출력상품 4종(명함/전단/포스터/봉투)의 8단계 종속옵션 엔진, 가격 매트릭스 기반 실시간 가격 계산, S3 Presigned URL 파일 업로드, 이니시스 PG + 간편결제 3종을 포함하는 전체 구매 여정이다.

**v2 변경 핵심**:
- Huni Design System v2 (SPEC-DS-006) 14개 Compound Component 전면 적용
- `--po-*` CSS 변수 전량 `--huni-*` 토큰으로 교체
- 4개 정책 문서(PRODUCT/ORDER/PAYMENT/FILE-PROCESSING) 기반 구현 방식 명시
- NATIVE/SKIN/CUSTOM/EXTERNAL 분류 체계 적용

## 2. IA 기능 매핑

### 2.1 A-10 상품 (4개)

| No | 기능 | shopby 분류 | Huni DS 컴포넌트 | 비고 |
|----|------|-------------|-----------------|------|
| A-10-1 | 출력상품 4종 주문 | CUSTOM | RadioGroup, Checkbox, TextField, Field, Dialog, Chip, Skeleton | 8단계 종속옵션 엔진 |
| A-10-2 | 포장재상품 주문 | SKIN | TextField, Field, Dialog, Snackbar | 일반 상품 플로우 |
| A-10-3 | 굿즈상품 주문 | SKIN | TextField, Field, Dialog, Snackbar | 파우치&백 |
| A-10-4 | 수작 상품 | SKIN | TextField, Field, Dialog | P2, 브랜드 존치 결정 필요 |

### 2.2 A-6 주문 (7개)

| No | 기능 | shopby 분류 | Huni DS 컴포넌트 | 비고 |
|----|------|-------------|-----------------|------|
| A-6-1 | 파일/편집 정보입력 | CUSTOM | Field, TextField, Dialog, Snackbar | S3 Presigned URL |
| A-6-2 | 보관함/장바구니 | SKIN | Chip, Dialog, Snackbar, Pagination | 인쇄옵션 커스텀 |
| A-6-3 | 배송정보입력 | NATIVE | TextField, Field | shopby 기본 |
| A-6-4 | 배송지목록 | NATIVE | Dialog, RadioGroup | shopby 기본 |
| A-6-5 | 결제하기 | EXTERNAL | RadioGroup, Dialog, Snackbar | 이니시스 PG |
| A-6-6 | 주문완료 | NATIVE | Snackbar | shopby 기본 |
| A-6-7 | 디자인의뢰 | CUSTOM | TextField, Field, Dialog | P2, 추후 도입 |

### 2.3 A-5 결제

| No | 기능 | shopby 분류 | Huni DS 컴포넌트 | 비고 |
|----|------|-------------|-----------------|------|
| A-5-1 | 이니시스 PG 결제 | EXTERNAL | RadioGroup, Dialog | 카드/계좌이체/가상계좌 |
| A-5-2 | 간편결제 3종 | EXTERNAL | - | 네이버/카카오/토스페이 SDK |
| A-5-3 | 프린팅머니 결제 | SKIN | TextField, Snackbar | shopby 적립금 커스텀 |
| A-5-4 | 복합결제 | SKIN | TextField | 프린팅머니 + PG |

## 3. 컴포넌트 마이그레이션 매핑

### 3.1 이전 -> 신규 대체표

| 이전 패턴 | 신규 Huni DS 컴포넌트 | 적용 영역 |
|----------|---------------------|----------|
| `<input type="radio">` 직접 | `RadioGroup` (Radix, 6 slots) | 결제수단, 배송지, 용지/코팅 선택 |
| `<input type="checkbox">` 직접 | `Checkbox` (Radix, 5 slots) | 후가공 다중선택, 약관동의 |
| `<input type="text">` 직접 | `TextField` (7 slots) | 수량입력, 배송정보, 쿠폰코드 |
| label+input 조합 | `Field` (10 slots, Context Provider) | 모든 폼 필드 래퍼 |
| 커스텀 모달 | `Dialog` (8 slots, Radix) | 옵션상세, 결제확인, 파일미리보기, 견적서 |
| alert/window.confirm | `Dialog` | 장바구니 이동 확인, 결제 확인 |
| 커스텀 토스트 | `Snackbar` (10 slots, useSnackbar) | 장바구니 추가, 결제 결과, 옵션 저장 |
| 커스텀 탭 | `Tabs` (7 slots, Radix) | 상품 카테고리, 상세 탭 |
| 커스텀 페이지네이션 | `Pagination` | 상품 목록, 주문 목록 |
| `<hr>` 직접 | `Divider` | 섹션 구분 |
| 커스텀 뱃지/태그 | `Chip` (5 slots) | 옵션 선택 표시, 주문 상태 |
| 커스텀 로딩 | `Skeleton` | 상품/가격 로딩 |
| lucide 직접 import | `Icon` (lucide-react) | 아이콘 통합 |
| `--po-*` CSS 변수 | `--huni-*` 시맨틱 토큰 | 전체 |

### 3.2 유지 커스텀 컴포넌트

| 컴포넌트 | 용도 | 변경사항 |
|---------|------|---------|
| HuniPriceCalculator | 스티키 가격바 (데스크탑 하단, 모바일 고정) | `--huni-*` 토큰 적용 |
| HuniOptionPreview | 옵션 미리보기 썸네일 스트립 | `--huni-*` 토큰 적용 |
| PrintConfigurator | 인쇄 옵션 컨피규레이터 메인 | RadioGroup/Checkbox/Field 통합 |
| PrintFileUpload | 파일 업로드 영역 | Field + Presigned URL 패턴 |
| ColorChip | 컬러칩 선택 (50x50px) | 기존 DS 컴포넌트 유지 |
| HuniBadge | NEW/BEST/HOT/SALE 뱃지 | 기존 유지 |
| HuniSkeletonCard | 상품 로딩 스켈레톤 | 기존 유지 |
| CounterInput | 수량 입력 (34+155+34px) | RULE-3 준수 |

## 4. EARS 요구사항

### REQ-001: 종속옵션 엔진 (CUSTOM)

**WHEN** 사용자가 출력상품(명함/전단/포스터/봉투) 상세 페이지에 진입하면
**THE SYSTEM SHALL** 8단계 종속옵션(용지종류 -> 용지두께 -> 사이즈 -> 수량 -> 인쇄면수 -> 후가공 -> 코팅 -> 납기일)을 표시하고, 상위 옵션 변경 시 하위 옵션 목록을 동적으로 갱신한다

- 용지종류 변경 시 해당 용지에 가능한 두께만 필터링
- 용지+두께 변경 시 가능한 사이즈만 필터링
- 선택 불가 조합: 해당 RadioGroup/Checkbox item에 `data-disabled` 적용 + 툴팁
- 상품별 옵션 적용 범위: 명함(전체 8단계), 전단(전체), 포스터(후가공 제외), 봉투(코팅 제외)
- RadioGroup: 용지, 사이즈, 인쇄면, 코팅 선택
- Checkbox: 후가공 다중선택 (박/형압/도무송/타공)
- **TAG**: TAG-SKIN-003-001

### REQ-002: 가격 매트릭스 실시간 계산 (CUSTOM)

**WHEN** 사용자가 인쇄 옵션을 변경하면
**THE SYSTEM SHALL** 가격 매트릭스(용지x두께x사이즈x수량)를 조회하여 0.3초 이내에 예상 가격을 갱신한다

- 최종 가격 = 기본단가(매트릭스) + 후가공 추가금 + 코팅 추가금 + 급행할증(30%) - 할인
- 후가공/코팅 추가금: 정액 추가 (건당 고정)
- 비규격 사이즈: 규격 대비 15% 추가 (2단계 확장)
- 수량 구간: 100 / 200 / 500 / 1,000 / 2,000 (초과 시 견적문의)
- 가격 매트릭스 미매칭 시: "견적 문의" 안내
- HuniPriceCalculator: 데스크탑 스티키 하단바, 모바일 고정 바텀시트
- Skeleton: 가격 로딩 중 표시
- **TAG**: TAG-SKIN-003-002

### REQ-003: 옵션 저장/견적서 (CUSTOM)

**WHEN** 사용자가 "옵션저장" 버튼을 클릭하면
**THE SYSTEM SHALL** 현재 옵션 조합을 옵션보관함(최대 30건, 6개월)에 저장한다

**WHEN** 사용자가 "견적서" 버튼을 클릭하면
**THE SYSTEM SHALL** 현재 옵션 조합의 견적서를 Dialog로 표시하고 인쇄/PDF 다운로드 기능을 제공한다

- 비로그인 시 로그인 유도 Dialog
- 저장 성공 시 Snackbar "옵션이 저장되었습니다"
- 견적서 포함: 상품명, 옵션, 수량, 단가, 합계
- **TAG**: TAG-SKIN-003-003

### REQ-004: 상품 목록/필터 (SKIN)

**WHEN** 사용자가 카테고리 페이지에 진입하면
**THE SYSTEM SHALL** 상품 목록을 그리드(데스크탑 4컬럼, 모바일 2컬럼)로 표시하고 필터/정렬 기능을 제공한다

- Tabs: 수평 스크롤 카테고리 탭 (전체|명함|전단|스티커|책자|...)
- Tabs active: `--huni-fg-brand` + 2px solid 하단 보더
- 가격 범위 표시: min~max (예: "9,000~60,000원")
- HuniBadge: NEW/BEST/HOT/SALE 오버레이
- HuniSkeletonCard: 로딩 중 표시
- Pagination: 기본 번호형 (useInfiniteQuery 확장 P1)
- 필터: 사이드바(데스크탑), 바텀시트(모바일)
- **TAG**: TAG-SKIN-003-004

### REQ-005: 장바구니 (SKIN)

**WHEN** 사용자가 "장바구니" 버튼을 클릭하면
**THE SYSTEM SHALL** 선택한 인쇄 옵션과 함께 상품을 장바구니에 추가하고 이동 여부를 Dialog로 확인한다

- 장바구니에서 인쇄 옵션 확인 가능 (Chip 형태)
- 인쇄 옵션 수정 가능
- GNB 장바구니 뱃지 수량 업데이트
- 비회원: 세션 유지 장바구니
- 합배송: 동일 납기 상품 가능
- Snackbar: "장바구니에 추가되었습니다"
- Divider: 주문 항목 구분
- **TAG**: TAG-SKIN-003-005

### REQ-006: 파일 업로드 (CUSTOM)

**WHEN** 주문서 작성 시 파일 업로드 영역에 파일을 첨부하면
**THE SYSTEM SHALL** S3 Presigned URL 방식으로 파일을 업로드하고 포맷/크기를 검증한다

- 허용 포맷: PDF, AI, PSD (인쇄타입별 상이, POLICY-FILE-PROCESSING 3.1절 참조)
- 최대 크기: 100MB
- 업로드 프로세스: Presigned URL 발급 -> 브라우저 직접 S3 업로드 -> 서버 완료 알림
- 드래그 앤 드롭 지원
- 업로드 진행률 표시
- "나중에 보내기" 체크 시 파일 없이 주문 진행 가능
- 파일 미리보기 제공
- Field 컴포넌트로 래핑
- **TAG**: TAG-SKIN-003-006

### REQ-007: 파일 검수/재업로드 (CUSTOM, 관리자)

시스템은 **항상** 업로드된 PDF 파일에 대해 자동 검증(해상도+색상모드)을 수행해야 한다

**WHEN** 자동 검증 결과가 FAIL이면
**THE SYSTEM SHALL** 재업로드 요청을 알림톡으로 자동 발송한다

- 자동 검증 3분류: PASS(즉시 제작대기) / WARNING(CS 확인) / FAIL(재업로드 요청)
- 재업로드: 3회 제한, 5일 기한
- 기한 1일 전 리마인더 알림톡 자동 발송
- 기한 초과: 주문 자동 보류
- AI/JPG/PSD: 수동 검수 직행
- **TAG**: TAG-SKIN-003-007

### REQ-008: 배송정보 입력 (NATIVE)

**WHEN** 사용자가 주문서 작성 페이지에서 배송정보를 입력하면
**THE SYSTEM SHALL** 배송지를 저장하고 도서산간 추가 배송비를 자동 적용한다

- 기본 배송비: 3,000원 (조건부 무료)
- 도서산간 추가: 3,000~5,000원
- 배송지 저장: 최근 10개
- 기본 배송지 설정 가능
- 주소 입력: 카카오 주소 API
- 수령 방법: 택배 (방문수령은 2차)
- TextField, Field 컴포넌트 사용
- **TAG**: TAG-SKIN-003-008

### REQ-009: 결제 (EXTERNAL + SKIN)

**WHEN** 사용자가 결제 수단을 선택하고 "결제하기" 버튼을 클릭하면
**THE SYSTEM SHALL** 이니시스 PG 또는 간편결제 SDK를 통해 결제를 진행한다

- PG: 이니시스 (신용카드, 실시간 계좌이체, 가상계좌)
- 간편결제: 네이버페이, 카카오페이, 토스페이
- 프린팅머니 전액결제 지원
- 복합결제: 프린팅머니 + PG (최소 결제 100원)
- 쿠폰 할인 적용
- 가상계좌: 48시간 입금기한, 자동 취소
- 할부: 일반할부 (3/6/12개월)
- RadioGroup: 결제수단 선택
- Dialog: 결제 확인
- Snackbar: 결제 결과 알림
- **TAG**: TAG-SKIN-003-009

### REQ-010: 주문완료 (NATIVE)

**WHEN** 결제가 성공하면
**THE SYSTEM SHALL** 주문완료 페이지에 주문번호, 결제금액, 예상 제작일을 표시하고 알림톡을 발송한다

- 주문번호 형식: 날짜+순번
- "주문 상세보기" / "쇼핑 계속하기" 버튼
- 알림톡 자동 발송 (결제완료 002번)
- 예상 납기 표시: 일반 3~5영업일, 급행 1~2영업일
- **TAG**: TAG-SKIN-003-010

### REQ-011: 비회원 주문 (SKIN)

**WHEN** 비회원이 주문을 진행하면
**THE SYSTEM SHALL** 주문자 정보(이름/전화번호/이메일)를 입력받고 주문번호+휴대전화 기반 조회를 제공한다

- 비회원 장바구니: 세션 유지
- 주문완료 시: 주문번호 + 비밀번호 안내
- 비회원 주문조회: 주문번호 + 휴대전화 입력
- **TAG**: TAG-SKIN-003-011

### REQ-012: 주문 상태 관리 (SKIN + CUSTOM)

시스템은 **항상** 주문 상태를 11단계(내부)로 관리하고 고객에게는 9단계로 단순화하여 노출해야 한다

- 내부 11단계: 주문접수 -> 결제완료 -> 파일확인중 -> 재업로드대기 -> 파일승인 -> 작업지시 -> 인쇄중 -> 후가공 -> 포장 -> 출고 -> 배송완료
- 고객 노출 9단계: 주문접수, 결제완료, 파일확인중, 파일재업로드요청, 파일확인완료, 제작중, 출고완료, 배송중, 배송완료
- 취소 가능: 파일승인 전까지
- 주문 취소: 주문취소 상태 별도
- 상태 변경 시 알림톡 자동 발송 (11종, POLICY-A6B8-ORDER 9절 참조)
- Chip: 주문 상태 뱃지
- **TAG**: TAG-SKIN-003-012

## 5. Unwanted 요구사항

### REQ-U-001: 가격 정보 보안

시스템은 가격 매트릭스 원본 데이터를 클라이언트에 **노출하지 않아야 한다**
- 가격 계산은 서버 API (`POST /custom/print-price`)를 통해 수행
- 클라이언트는 계산된 결과만 수신

### REQ-U-002: 결제 정보 보안

시스템은 카드번호를 서버 또는 클라이언트에 **보관하지 않아야 한다** (PCI-DSS 준수)

### REQ-U-003: 파일 직접 접근 차단

시스템은 인쇄 파일에 대한 직접 URL 접근을 **허용하지 않아야 한다**
- S3 Presigned URL은 시간 제한 적용
- 파일 접근은 인증된 사용자만 가능

## 6. Optional 요구사항

### REQ-O-001: 빠른주문 숏컷 (P2)

**가능하면** 상품 카드에 "빠른주문" 아이콘 버튼을 제공하여 3단계 템플릿 주문 플로우를 지원한다

### REQ-O-002: 무한 스크롤 (P1)

**가능하면** 상품 목록에 TanStack Query useInfiniteQuery 기반 무한 스크롤을 제공한다

### REQ-O-003: 디자인 의뢰 (P2)

**가능하면** 출력상품에서 "디자인 의뢰" 옵션을 제공하여 1:1 상담 연결을 지원한다

### REQ-O-004: 포장재/굿즈/수작 주문 (P1/P2)

**가능하면** 포장재(P1), 굿즈(P1), 수작(P2) 상품의 일반 상품 주문 플로우를 제공한다

## 7. API 연동

### 7.1 shopby 기본 API [SH]

| 기능 | 엔드포인트 | Method |
|------|-----------|--------|
| 상품 목록 | /products | GET |
| 상품 상세 | /products/{productNo} | GET |
| 상품 옵션 | /products/{productNo}/options | GET |
| 장바구니 CRUD | /cart, /cart/{cartNo} | GET/POST/PUT/DELETE |
| 주문서 생성 | /order-sheets | POST |
| 결제 요청 | /payments | POST |
| 주문 완료 | /orders/confirm | POST |
| 배송지 목록/추가 | /profile/shipping-addresses | GET/POST |
| 쿠폰 적용 | /order-sheets/coupons | POST |

### 7.2 커스텀 API [C]

| 기능 | 엔드포인트 | Method | 비고 |
|------|-----------|--------|------|
| 인쇄 옵션 가격 계산 | /custom/print-price | POST | 가격 매트릭스 조회 |
| 인쇄 옵션 저장 | /custom/print-options | POST | 옵션보관함 |
| 파일 업로드 URL 발급 | /custom/files/presigned-url | POST | S3 Presigned URL |
| 파일 업로드 완료 | /custom/files/complete | POST | 서버 알림 |
| 견적서 생성 | /custom/quotation | GET | PDF 생성 |
| 종속옵션 조회 | /custom/print-options/tree | GET | 옵션 트리 |
| 파일 검수 결과 | /custom/files/{fileId}/status | GET | PASS/WARNING/FAIL |
| 재업로드 요청 | /custom/files/{fileId}/reupload | POST | 알림톡 발송 |

### 7.3 외부 SDK [EXT]

| 기능 | SDK | 비고 |
|------|-----|------|
| PG 결제 | 이니시스 JavaScript SDK | 카드/계좌이체/가상계좌 |
| 네이버페이 | 네이버페이 JavaScript SDK | 간편결제 |
| 카카오페이 | 카카오페이 JavaScript SDK | 간편결제 |
| 토스페이 | 토스페이 JavaScript SDK | 간편결제 |

## 8. 디자인 토큰

### 8.1 토큰 체계 (`--huni-*` 전용)

| 용도 | 토큰 | 값 |
|------|------|---|
| Primary (CTA, 가격, 활성탭) | `--huni-fg-brand` | #5538B6 |
| Primary Dark (바로주문) | `--huni-bg-brand-bold` | #3B2573 |
| Text Dark (타이틀) | `--huni-fg-default` | #424242 |
| Text Muted (비활성탭, 브레드크럼) | `--huni-fg-muted` | #979797 |
| Border | `--huni-stroke-default` | #CACACA |
| Background Section | `--huni-bg-muted` | #F6F6F6 |
| Star Rating | custom | #E6B93F |

### 8.2 상태 스타일 (data-* attribute)

| 상태 | 스타일 |
|------|-------|
| `data-checked` | white bg + `--huni-stroke-brand` border 2px |
| 기본 | `--huni-bg-muted` bg + `--huni-stroke-default` border 1px |
| `data-disabled` | `--huni-bg-muted` bg + `--huni-stroke-default` border 1px, opacity 0.5 |

### 8.3 CTA 버튼

| 버튼 | 스타일 | 크기 |
|------|-------|------|
| 장바구니 담기 | `--huni-bg-brand` fill, white text | w-full h-[50px] radius 5px |
| 바로주문 | `--huni-bg-brand-bold` fill, white text | w-[465px] h-[50px] radius 5px |
| 견적서/옵션저장 | white bg, `--huni-stroke-brand` 1px, `--huni-fg-brand` text | w-[155px] h-[50px] |

## 9. TAG 분해

| TAG ID | 기능 | 우선순위 | 규모 | 신규/수정 |
|--------|------|---------|------|----------|
| TAG-SKIN-003-001 | 종속옵션 엔진 (PrintConfigurator) | P0 | XL | 수정 (RadioGroup/Checkbox 통합) |
| TAG-SKIN-003-002 | 가격 매트릭스 계산 (HuniPriceCalculator) | P0 | L | 수정 (`--huni-*` 토큰) |
| TAG-SKIN-003-003 | 옵션 저장/견적서 | P0 | M | 수정 (Dialog/Snackbar) |
| TAG-SKIN-003-004 | 상품 목록/필터 | P0 | M | 수정 (Tabs/Pagination/Skeleton) |
| TAG-SKIN-003-005 | 장바구니 | P0 | M | 수정 (Chip/Dialog/Snackbar) |
| TAG-SKIN-003-006 | 파일 업로드 | P0 | L | 수정 (Field + Presigned URL) |
| TAG-SKIN-003-007 | 파일 검수/재업로드 (관리자) | P0 | L | 신규 |
| TAG-SKIN-003-008 | 배송정보 입력 | P0 | S | 수정 (TextField/Field) |
| TAG-SKIN-003-009 | 결제 연동 | P0 | L | 수정 (RadioGroup/Dialog) |
| TAG-SKIN-003-010 | 주문완료 | P1 | S | 수정 (Snackbar) |
| TAG-SKIN-003-011 | 비회원 주문 | P1 | M | 수정 (TextField/Field) |
| TAG-SKIN-003-012 | 주문 상태 관리 | P1 | M | 수정 (Chip + 11/9단계) |

## 10. 반응형 브레이크포인트

| 뷰포트 | 상품 그리드 | 상세 레이아웃 | 필터 | CTA |
|--------|-----------|-------------|------|-----|
| Mobile (< 768px) | 2컬럼 | 단일컬럼 | 바텀시트 | 하단 고정 |
| Tablet (768~1024px) | 3컬럼 | 2컬럼 | 사이드바 | 인라인 |
| Desktop (>= 1024px) | 4컬럼 + 필터 사이드바 | 2컬럼 | 사이드바 | 인라인 |
