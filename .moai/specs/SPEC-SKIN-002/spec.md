---
id: SPEC-SKIN-002
version: 2.0.0
status: draft
created: 2026-03-14
updated: 2026-03-17
author: MoAI
priority: high
issue_number: 0
tags: [mypage, order, coupon, review, design-system-migration, huni-ds, Tabs, Pagination, Chip, TextField, Dialog, Skeleton, Field]
depends_on: [SPEC-DS-006, SPEC-SKIN-001]
affects: [SPEC-SKIN-003, SPEC-SKIN-005]
migration_from: SPEC-SKIN-002-v1.0.0
---

# SPEC-SKIN-002 v2: 마이페이지 디자인시스템 마이그레이션

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2026-03-14 | 초안 작성 - 마이페이지 12개 IA 기능 명세 (No.8~19) |
| 2.0.0 | 2026-03-17 | SPEC-DS-006 기반 디자인시스템 마이그레이션 - 이전 커스텀 탭/페이지네이션/뱃지/모달을 Huni Tabs, Pagination, Chip, TextField, Dialog, Skeleton, Field로 대체. 미구현 항목(증빙서류발급 A-3-14, 사업자정보 A-3-15) 신규 추가 |

---

## 1. 개요

### 1.1 마이그레이션 목적

SPEC-SKIN-002에 구현된 마이페이지 17개 기능(89% 구현)을 SPEC-DS-006에서 정의한 Huni 디자인시스템 v2로 마이그레이션한다. 기존의 커스텀 탭, 페이지네이션, 뱃지, 모달, 입력 필드, 로딩 UI를 모두 Huni Compound Component 패턴과 `--huni-*` 토큰 체계로 전환한다. 미구현 2개 항목(증빙서류발급, 사업자정보)을 신규 추가한다.

### 1.2 마이그레이션 범위

- **유형**: Migration (M 사이즈)
- **현재 상태**: 17/19 기능 구현 완료 (이전 컴포넌트 사용)
- **미구현 신규**: 증빙서류발급(A-3-14), 사업자정보(A-3-15)
- **대상**: 주문관리, 혜택관리, 고객소통, 회원관리, 사업자전용
- **정책 기반**: POLICY-A3-MYPAGE 참조

### 1.3 정책 통합 (POLICY-A3-MYPAGE)

| IA 코드 | 기능 | 구현 방식 | 설명 |
|---------|------|-----------|------|
| A-3-1 | 주문조회 | SKIN | shopby 주문 API + 스킨 커스터마이징 |
| A-3-2 | 주문상세 | CUSTOM | 편집 미리보기 별도 개발, 기본은 SKIN |
| A-3-3 | 옵션보관함 | CUSTOM | shopby 미지원, 별도 시스템 개발 |
| A-3-4 | 쿠폰관리 | NATIVE | shopby 쿠폰 API 기본 제공 |
| A-3-5 | 프린팅머니 | SKIN | shopby 적립금 API + 스킨 커스터마이징 |
| A-3-6 | 머니충전 | CUSTOM | PG 결제 연동 + 적립금 API 조합 |
| A-3-7 | 상품Q&A | NATIVE | shopby 상품문의 API 기본 제공 |
| A-3-8 | 나의리뷰 | NATIVE | shopby 상품후기 API 기본 제공 |
| A-3-9 | 체험단 | CUSTOM | 별도 관리 시스템 개발 |
| A-3-10 | 1:1문의 | NATIVE | shopby 1:1문의 API 기본 제공 |
| A-3-11 | 회원정보수정 | NATIVE | shopby 회원 API 기본 제공 |
| A-3-12 | 비밀번호변경 | NATIVE | shopby 회원 API 기본 제공 |
| A-3-13 | 회원탈퇴 | NATIVE | shopby 회원 탈퇴 API 기본 제공 |
| A-3-14 | 증빙서류발급 | SKIN | shopby 주문 API + 외부 서비스(팝빌) 연동 |
| A-3-15 | 사업자정보 | SKIN | shopby 회원 추가필드 + 스킨 커스터마이징 |

---

## 2. 컴포넌트 매핑 (이전 -> 신규)

| 이전 패턴 | 신규 Huni 컴포넌트 | 적용 위치 | 비고 |
|----------|-------------------|----------|------|
| 커스텀 탭 UI | `Tabs` | 쿠폰 3탭, 리뷰 2탭, 증빙서류 2탭, 마이페이지 섹션 | Tabs.Root > Tabs.List > Tabs.Trigger > Tabs.Content |
| 커스텀 페이지네이션 | `Pagination` | 주문조회 목록, Q&A 목록, 리뷰 목록, 1:1문의 목록 | numbered/loadMore variant |
| 커스텀 태그/뱃지 | `Chip` | 주문 상태 뱃지 (입금대기/제작중/배송중/배송완료/취소) | data-selected 속성 |
| `<input type="text">` 직접 | `TextField` | 쿠폰코드 입력, 주문번호 검색, 사업자번호 입력 등 | 7 slots, Compound Component |
| label + input 조합 | `Field` + `TextField` | 회원정보수정 폼, 비밀번호변경 폼, 사업자정보 폼 | Field 자동 aria-* |
| `<input type="checkbox">` | `Checkbox` | 마케팅 수신동의 변경, 항목 선택 | data-checked |
| 커스텀 모달/다이얼로그 | `Dialog` | 주문 취소 확인, 옵션 삭제 확인, 탈퇴 확인, 상세 보기 | Dialog.Root > Dialog.Content |
| 커스텀 로딩 스피너 | `Skeleton` | 주문 목록 로딩, 쿠폰 로딩, 리뷰 로딩 | neutral/brand, wave/pulse |
| alert/window.confirm | `Dialog` | 삭제 확인, 탈퇴 확인, 충전 확인 | lazyMount/unmountOnExit |
| 커스텀 토스트 | `Snackbar` (useSnackbar) | 저장 완료, 수정 완료, 삭제 완료 등 | Programmatic API |
| lucide 직접 import | `Icon` | 모든 아이콘 사용처 | lucide-react 래퍼 |
| `<hr>` 직접 | `Divider` | 섹션 구분선 | full/inset variant |
| `--po-*` CSS 변수 | `--huni-*` 토큰 | 전체 스타일 | 시맨틱 토큰 체계 |
| 커스텀 토글 | `Switch` | 마케팅 수신 토글, 알림 설정 등 | data-checked 속성 |

---

## 3. 요구사항 (EARS 형식)

### 3.1 주문 관리 마이그레이션

#### REQ-MIG-002-001: 주문조회 Pagination 마이그레이션

**WHEN** 사용자가 주문조회 목록을 스크롤하여 하단에 도달하면,
**THE SYSTEM SHALL** Huni `Pagination` 컴포넌트로 페이지 전환 또는 추가 로딩을 제공해야 한다.

**수용 기준**:
- [ ] `Pagination` variant="numbered" 또는 "loadMore" 적용
- [ ] 현재 페이지, 전체 페이지 수 표시
- [ ] 이전/다음 네비게이션 버튼 제공
- [ ] `--huni-fg-brand` 토큰으로 현재 페이지 강조

#### REQ-MIG-002-002: 주문 상태 Chip 마이그레이션

**WHEN** 주문 목록에서 각 주문의 상태를 표시할 때,
**THE SYSTEM SHALL** Huni `Chip` 컴포넌트로 상태별 색상 뱃지를 렌더링해야 한다.

**수용 기준**:
- [ ] 주문접수: `Chip` variant="secondary" (--huni-bg-brand-subtle)
- [ ] 제작중: `Chip` variant="warning" (--huni-bg-warning-subtle)
- [ ] 배송중: `Chip` variant="info" (--huni-bg-info-subtle)
- [ ] 배송완료: `Chip` variant="neutral" (--huni-bg-neutral-subtle)
- [ ] 취소/반품: `Chip` variant="danger" (--huni-bg-danger-subtle)
- [ ] `data-selected` 속성으로 필터 선택 시 활성 상태 표시

#### REQ-MIG-002-003: 주문 상세 Dialog 마이그레이션

**WHEN** 사용자가 주문 취소, 반품, 교환 요청 시 확인이 필요할 때,
**THE SYSTEM SHALL** Huni `Dialog` Compound Component를 사용해야 한다.

**수용 기준**:
- [ ] 주문 취소 확인: `Dialog.Header` + `Dialog.Body`(취소 사유) + `Dialog.Footer`(확인/취소)
- [ ] 인쇄옵션 미리보기: `Dialog`로 상세 옵션 표시
- [ ] `lazyMount`, `unmountOnExit` 성능 최적화 적용
- [ ] `data-open` 속성으로 열림/닫힘 상태 관리

#### REQ-MIG-002-004: 주문 목록 Skeleton 로딩

**WHILE** 주문 목록 데이터를 로딩 중일 때,
**THE SYSTEM SHALL** Huni `Skeleton` 컴포넌트로 카드 형태의 로딩 UI를 표시해야 한다.

**수용 기준**:
- [ ] 주문 카드와 동일한 레이아웃의 `Skeleton` 표시 (5개)
- [ ] `Skeleton` variant="neutral", animation="wave" 적용
- [ ] 데이터 로드 완료 시 Skeleton -> 실제 콘텐츠 전환

### 3.2 혜택 관리 마이그레이션

#### REQ-MIG-002-005: 쿠폰관리 Tabs 마이그레이션

**WHEN** 사용자가 쿠폰관리 페이지에 접속하면,
**THE SYSTEM SHALL** Huni `Tabs` Compound Component로 사용가능/사용완료/만료 3탭을 렌더링해야 한다.

**수용 기준**:
- [ ] `Tabs.Root > Tabs.List > Tabs.Trigger(3개) > Tabs.Content(3개)` 구조
- [ ] `Tabs` variant="line" 스타일 적용
- [ ] Indicator 애니메이션 활성화
- [ ] 각 탭 Trigger에 건수 표시 (`Chip` 사용)
- [ ] 활성 탭: `--huni-fg-brand` 토큰

#### REQ-MIG-002-006: 프린팅머니 TextField/Dialog 마이그레이션

**WHEN** 사용자가 프린팅머니 충전 또는 내역 조회를 할 때,
**THE SYSTEM SHALL** Huni `TextField`, `Dialog` 컴포넌트를 사용해야 한다.

**수용 기준**:
- [ ] 충전 금액 입력: `Field` + `TextField` 구조
- [ ] 충전 확인: `Dialog`로 최종 확인 (금액, 보너스, 결제수단)
- [ ] 내역 기간 필터: `TextField` type="date" 또는 커스텀 날짜 선택

### 3.3 고객 소통 마이그레이션

#### REQ-MIG-002-007: 리뷰 Tabs + Pagination 마이그레이션

**WHEN** 사용자가 나의리뷰 페이지에 접속하면,
**THE SYSTEM SHALL** Huni `Tabs`로 작성가능/작성완료 2탭을, `Pagination`으로 리뷰 목록 페이징을 제공해야 한다.

**수용 기준**:
- [ ] `Tabs` variant="chip" 스타일로 2탭 전환
- [ ] 작성가능 탭: 배송완료 주문 중 미작성 리뷰 목록
- [ ] 작성완료 탭: 작성한 리뷰 목록 + `Pagination`
- [ ] 리뷰 작성 폼: `Field` + `TextField` (multiline, autoresize)
- [ ] 별점 입력 후 텍스트 입력 시 `Field.HelperText`로 최소 글자 수 안내

#### REQ-MIG-002-008: Q&A/1:1문의 TextField 마이그레이션

**WHEN** 사용자가 상품Q&A 또는 1:1문의를 작성할 때,
**THE SYSTEM SHALL** Huni `Field` + `TextField` (multiline) 컴포넌트를 사용해야 한다.

**수용 기준**:
- [ ] 문의 제목: `Field` + `TextField` 구조
- [ ] 문의 내용: `Field` + `TextField` multiline, autoresize 적용
- [ ] 파일 첨부: `TextField.Slot`에 첨부 `Icon` 버튼 배치
- [ ] 목록 페이징: `Pagination` 컴포넌트

### 3.4 회원 관리 마이그레이션

#### REQ-MIG-002-009: 회원정보수정 Field/TextField 마이그레이션

**WHEN** 사용자가 회원정보수정 페이지에 접속하면,
**THE SYSTEM SHALL** 모든 수정 가능 필드를 Huni `Field` + `TextField` Compound Component로 렌더링해야 한다.

**수용 기준**:
- [ ] 비밀번호 재확인: `Field` + `TextField` type="password"
- [ ] 이메일 (읽기 전용): `TextField` readOnly 속성, `data-disabled` 스타일
- [ ] 이름, 휴대전화, 주소 필드: `Field` + `TextField` 구조
- [ ] 각 `Field`에 자동 `aria-describedby`, `aria-invalid` 연결

#### REQ-MIG-002-010: 비밀번호변경 Field/TextField 마이그레이션

**WHEN** 사용자가 비밀번호변경 페이지에 접속하면,
**THE SYSTEM SHALL** 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 3개 필드를 Huni `Field` + `TextField` 로 렌더링해야 한다.

**수용 기준**:
- [ ] 3개 필드 모두 `Field` + `TextField` type="password" 구조
- [ ] 비밀번호 보기/숨기기: `TextField.Slot` + `Icon`(eye/eye-off)
- [ ] 비밀번호 강도 표시: `Field.HelperText`에 프로그레스 바
- [ ] `data-invalid`로 불일치 시 에러 표시

#### REQ-MIG-002-011: 회원탈퇴 Dialog 마이그레이션

**WHEN** 사용자가 회원탈퇴를 요청하면,
**THE SYSTEM SHALL** Huni `Dialog`로 탈퇴 확인 다이얼로그를 표시해야 한다.

**수용 기준**:
- [ ] `Dialog.Header`: "회원탈퇴" 제목
- [ ] `Dialog.Body`: 잔여 적립금/쿠폰 안내 + 탈퇴 사유 체크박스(`Checkbox`)
- [ ] `Dialog.Footer`: 탈퇴 확인 / 취소 버튼
- [ ] 진행중 주문 있을 경우 탈퇴 불가 안내 메시지

### 3.5 사업자 전용 (신규 추가)

#### REQ-MIG-002-012: 증빙서류발급 신규 구현 (A-3-14)

**WHEN** 사용자가 증빙서류 메뉴에 접속하면,
**THE SYSTEM SHALL** 현금영수증/세금계산서 탭 전환과 주문별 발급 상태를 표시해야 한다.

**수용 기준**:
- [ ] `Tabs` variant="line"으로 현금영수증/세금계산서 2탭 전환
- [ ] 각 주문의 발급 상태를 `Chip`으로 표시: 신청가능(brand), 발급완료(positive), 불가(neutral), 신용카드(info)
- [ ] "신청하기" 버튼 클릭 시 `Dialog`로 신청 폼 표시
- [ ] 목록 `Pagination` 적용
- [ ] 데이터 로딩 시 `Skeleton` 표시

#### REQ-MIG-002-013: 사업자정보 관리 신규 구현 (A-3-15)

**WHEN** 사업자 회원이 사업자정보 메뉴에 접속하면,
**THE SYSTEM SHALL** 사업자 정보 CRUD 기능을 Huni 디자인시스템 컴포넌트로 제공해야 한다.

**수용 기준**:
- [ ] 사업자 목록: 등록된 사업자 정보 카드 목록
- [ ] 사업자 등록/수정 폼: `Field` + `TextField` 구조
  - 사업자번호 (필수): `TextField` + 검증 버튼 in `TextField.Slot`
  - 상호명 (필수): `Field` + `TextField`
  - 대표자명 (필수): `Field` + `TextField`
  - 업태, 종목, 사업장 주소: `Field` + `TextField`
  - 세금계산서 수신 이메일: `Field` + `TextField` type="email"
- [ ] 등록/수정/삭제 확인: `Dialog` Compound Component
- [ ] 성공/실패 알림: `Snackbar` (useSnackbar)
- [ ] 사업자등록증 파일 첨부: 파일 업로드 UI

### 3.6 공통 마이그레이션

#### REQ-MIG-002-014: 토큰 체계 전환

**FOR ALL** 마이페이지 관련 파일의 스타일 참조,
**THE SYSTEM SHALL** `--po-*` CSS 변수 사용을 `--huni-*` 토큰으로 전환해야 한다.

**수용 기준**:
- [ ] `--po-primary` -> `--huni-bg-brand-solid`, `--huni-fg-brand`
- [ ] `--po-border` -> `--huni-stroke-neutral`
- [ ] `--po-bg-section` -> `--huni-bg-neutral-subtlest`
- [ ] `--po-text-muted` -> `--huni-fg-neutral-subtle`
- [ ] 마이페이지 관련 파일에서 `--po-*` 참조 0건

#### REQ-MIG-002-015: Icon/Divider 전환

**FOR ALL** 마이페이지 관련 아이콘 및 구분선,
**THE SYSTEM SHALL** Huni `Icon` 래퍼 및 `Divider` 컴포넌트를 사용해야 한다.

**수용 기준**:
- [ ] lucide-react 직접 import 0건
- [ ] `<hr>` 직접 사용 0건
- [ ] 모든 아이콘: `Icon` 래퍼 통해 사용
- [ ] 섹션 구분: `Divider` variant="full" 또는 "inset"

#### REQ-MIG-002-016: Snackbar 알림 통합

**WHEN** 마이페이지에서 CRUD 작업의 결과를 알림으로 표시해야 할 때,
**THE SYSTEM SHALL** Huni `Snackbar` Programmatic API (useSnackbar)를 사용해야 한다.

**수용 기준**:
- [ ] 회원정보 수정 완료: `snackbar.success("회원정보가 수정되었습니다")`
- [ ] 비밀번호 변경 완료: `snackbar.success("비밀번호가 변경되었습니다")`
- [ ] 옵션 삭제 완료: `snackbar.success("옵션이 삭제되었습니다")`
- [ ] 쿠폰 등록 완료: `snackbar.success("쿠폰이 등록되었습니다")`
- [ ] API 오류: `snackbar.error(errorMessage)` 공통 처리

#### REQ-MIG-002-017: 기존 기능 회귀 방지

시스템은 **항상** 마이그레이션 전후로 기존 17개 기능이 동일하게 동작해야 한다.

**수용 기준**:
- [ ] 비로그인 시 마이페이지 접근 차단 (로그인 리다이렉트)
- [ ] 주문 조회/상세 정상 동작 (필터, 정렬, 타임라인)
- [ ] 옵션보관함 CRUD 정상 동작 (불러오기, 수정, 삭제)
- [ ] 쿠폰관리 정상 동작 (목록, 등록)
- [ ] 프린팅머니 정상 동작 (잔액, 내역)
- [ ] Q&A/리뷰/1:1문의 CRUD 정상 동작
- [ ] 회원정보수정/비밀번호변경/회원탈퇴 정상 동작
- [ ] 반응형 레이아웃 (사이드바/그리드) 정상 동작
- [ ] 키보드 네비게이션 및 aria 속성 정상 동작

---

## 4. IA 기능 목록

| No | IA 코드 | 기능 | 우선순위 | 상태 |
|----|---------|------|----------|------|
| 8 | A-3-1 | 주문조회 + 주문상세 | P0 | 구현완료 -> 마이그레이션 |
| 9 | A-3-3 | 옵션보관함 | P0 | 구현완료 -> 마이그레이션 |
| 10 | A-3-4 | 쿠폰관리 + 등록 | P1 | 구현완료 -> 마이그레이션 |
| 11 | A-3-5/6 | 프린팅머니 + 충전 | P1 | 구현완료 -> 마이그레이션 |
| 12 | A-3-7 | 상품Q&A + 문의 | P1 | 구현완료 -> 마이그레이션 |
| 13 | A-3-8 | 나의리뷰 + 쓰기 | P1 | 구현완료 -> 마이그레이션 |
| 14 | A-3-9 | 체험단 활동내역 | P2 | 구현완료 -> 마이그레이션 |
| 15 | A-3-10 | 1:1문의 + 문의하기 | P1 | 구현완료 -> 마이그레이션 |
| 16 | A-3-11 | 회원정보수정 | P0 | 구현완료 -> 마이그레이션 |
| 17 | A-3-12 | 비밀번호변경 | P0 | 구현완료 -> 마이그레이션 |
| 18 | A-3-13 | 회원탈퇴 | P1 | 구현완료 -> 마이그레이션 |
| 19 | A-3-14 | 증빙서류발급 | P1 | **신규 구현** |
| 20 | A-3-15 | 사업자정보 | P1 | **신규 구현** |

---

## 5. 디자인 토큰 매핑

### 5.1 시맨틱 토큰 참조

| 용도 | 이전 값 | 신규 Huni 토큰 |
|------|---------|---------------|
| Primary 색상 | `#5538B6` | `--huni-bg-brand-solid`, `--huni-fg-brand` |
| Summary 카드 배경 | `#EEEBF9` | `--huni-bg-brand-subtlest` |
| 사이드바 active 배경 | `#EEEBF9` | `--huni-bg-brand-subtlest` |
| 사이드바 active 텍스트 | `#5538B6` | `--huni-fg-brand` |
| 사이드바 hover 배경 | `#F6F6F6` | `--huni-bg-neutral-subtlest` |
| 기본 텍스트 | `#424242` | `--huni-fg-neutral` |
| 보조 텍스트 | `#979797` | `--huni-fg-neutral-subtle` |
| 카드 테두리 | `#CACACA` | `--huni-stroke-neutral` |
| 섹션 배경 | `#F6F6F6` | `--huni-bg-neutral-subtlest` |
| 금액 강조 | `#5538B6` | `--huni-fg-brand` |

### 5.2 주문 상태 Chip 토큰

| 상태 | Chip variant | 배경 토큰 | 텍스트 토큰 |
|------|-------------|----------|------------|
| 주문접수 | secondary | `--huni-bg-brand-subtle` | `--huni-fg-brand` |
| 제작중 | warning | `--huni-bg-warning-subtle` | `--huni-fg-warning` |
| 배송중 | info | `--huni-bg-info-subtle` | `--huni-fg-info` |
| 배송완료 | neutral | `--huni-bg-neutral-subtle` | `--huni-fg-neutral` |
| 취소/반품 | danger | `--huni-bg-danger-subtle` | `--huni-fg-danger` |

### 5.3 증빙서류 상태 Chip 토큰

| 상태 | Chip variant | 배경 토큰 |
|------|-------------|----------|
| 신청가능 | brand | `--huni-bg-brand-subtle` |
| 발급완료 | positive | `--huni-bg-positive-subtle` |
| 불가 | neutral | `--huni-bg-neutral-subtle` |
| 신용카드 | info | `--huni-bg-info-subtle` |

### 5.4 컴포넌트 data-* 상태 속성

| 컴포넌트 | 속성 | 용도 |
|---------|------|------|
| Tabs.Trigger | `data-selected` | 활성 탭 표시 |
| Chip | `data-selected` | 필터 선택 상태 |
| Chip | `data-disabled` | 비활성 상태 |
| Dialog | `data-open` | 열림/닫힘 상태 |
| TextField | `data-focus-visible` | 키보드 포커스 |
| TextField | `data-invalid` | 유효성 오류 |
| Skeleton | `data-loading` | 로딩 상태 |
| Switch | `data-checked` | 토글 상태 |
| Checkbox | `data-checked` | 체크 상태 |
