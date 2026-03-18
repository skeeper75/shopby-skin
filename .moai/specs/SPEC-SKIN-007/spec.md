---
id: SPEC-SKIN-007
version: 2.0.0
status: draft
created: 2026-03-17
updated: 2026-03-17
author: MoAI
priority: medium
issue_number: 0
tags: [admin, board, member, coupon, printing-money, huni-ds]
depends_on: [SPEC-SKIN-005]
affects: [B-5, B-6]
---

# SPEC-SKIN-007 v2: 관리자 게시판/회원/쿠폰

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 작성 (shadcn/ui 기반) |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 기반 전면 재작성. EARS 요구사항 강화, IA 재매핑 |

---

## 1. 개요

관리자 게시판 관리(공지사항, FAQ, 견적문의, 기업상담, 디자인상담, Q&A, 1:1문의, 체험단, 이용후기)와 회원관리(회원목록, 탈퇴회원, 프린팅머니 관리), 쿠폰관리(발행/매칭/등록내역/사용내역)를 Huni 디자인시스템 기반으로 신규 구현한다.

- **IA 영역**: B-5 (9개), B-6 (4개) = 총 13개 항목
- **구현 방식**: NATIVE (게시판 B-5), SKIN (회원관리 B-6)
- **디자인시스템**: Huni DS (SPEC-DS-006) 전용

---

## 2. IA 기능 목록

### B-5 게시판관리

| No | 기능 | 우선순위 | 구현 방식 | 비고 |
|----|------|----------|-----------|------|
| 64 | 공지사항 관리 (등록/수정/html생성) | P1 | NATIVE | shopby Admin API |
| 65 | 자주묻는질문(FAQ) 관리 | P1 | NATIVE | shopby Admin API |
| 66 | 대량주문 견적문의 (확인/답변) | P0 | CUSTOM | 커스텀 API |
| 67 | 기업인쇄상담 (확인/답변) | P1 | CUSTOM | 커스텀 API |
| 68 | 디자인상담 (확인/답변) | P1 | CUSTOM | 커스텀 API |
| 69 | 상품Q&A (확인/답변) | P1 | NATIVE | shopby Admin API |
| 70 | 1:1문의 (확인/답변) | P1 | NATIVE | shopby Admin API |
| 71 | 체험단관리 (html DB입력, 당첨처리) | P2 | CUSTOM | 커스텀 API |
| 72 | 이용후기관리 (관리자 임의등록) | P1 | NATIVE | shopby Admin API |

### B-6 회원관리

| No | 기능 | 우선순위 | 구현 방식 | 비고 |
|----|------|----------|-----------|------|
| 73 | 회원관리 (주문내역/정보확인) | P0 | SKIN | shopby + 추가 필드 |
| 74 | 탈퇴회원 관리 | P1 | NATIVE | shopby Admin API |
| 75 | 프린팅머니 관리 (지급/차감) | P1 | CUSTOM | 커스텀 API |
| 76 | 쿠폰관리 (발행/매칭/사용내역) | P0 | NATIVE | shopby Admin API |

---

## 3. EARS 형식 요구사항

### REQ-007-001: 공지사항/FAQ 관리 [WHEN-THEN]

**WHEN** 관리자가 공지사항 또는 FAQ를 등록/수정하면
**THEN** 시스템은 해당 게시글을 저장하고 사용자 사이트에 즉시 반영해야 한다

- 공지사항: 제목, 내용(HTML 에디터), 공개/비공개, 상단 고정 설정
- FAQ: 질문, 답변(HTML 에디터), 카테고리 분류
- 목록 테이블: 정렬 가능(작성일, 조회수, 상태), Switch로 공개/비공개 토글

### REQ-007-002: 견적문의/기업상담/디자인상담 답변 [WHEN-THEN]

**WHEN** 관리자가 문의/상담 상세에서 답변을 작성하고 등록하면
**THEN** 시스템은 답변을 저장하고 상태를 "대기"에서 "완료"로 변경하며, 고객에게 답변 알림을 발송해야 한다

- 답변 에디터 (이미지 첨부 가능)
- 첨부파일 다운로드
- 상태 관리: 대기/처리중/완료
- 고객 알림: 이메일 또는 알림톡 발송
- 행 클릭 시 우측 패널 열림 (빠른 답변)

### REQ-007-003: Q&A/1:1문의 답변 [WHEN-THEN]

**WHEN** 관리자가 Q&A 또는 1:1문의에 답변을 작성하면
**THEN** 시스템은 shopby Admin API를 통해 답변을 저장하고 고객에게 알림을 발송해야 한다

- shopby 표준 답변 API 사용
- 답변 에디터 (HTML)
- 답변 완료 시 상태 자동 변경

### REQ-007-004: 체험단관리 [WHEN-THEN]

**WHEN** 관리자가 체험단 모집글을 등록하고 당첨 처리하면
**THEN** 시스템은 당첨자에게 알림을 발송하고 후기 작성 권한을 부여해야 한다

- 모집글 HTML 직접 입력 (DB 저장)
- 신청자 목록 확인
- 당첨 처리 (Checkbox 다건 선택)
- 당첨자만 후기 등록 활성화

### REQ-007-005: 이용후기관리 [WHEN-THEN]

**WHEN** 관리자가 이용후기를 관리하면
**THEN** 시스템은 후기 목록 조회, 관리자 임의 등록, 삭제를 허용해야 한다

- 후기 목록 (상품명, 작성자, 별점, 내용, 날짜)
- 관리자 임의 후기 등록 (상품 선택, 별점, 내용)
- 부적절 후기 삭제 (확인 Dialog)

### REQ-007-006: 회원관리 [WHEN-THEN]

**WHEN** 관리자가 회원관리 목록에서 회원을 클릭하면
**THEN** 시스템은 회원 상세 정보, 주문 내역, 프린팅머니 잔액, 쿠폰 현황을 표시해야 한다

- 회원 검색: 이름/이메일/전화번호 실시간 검색 (debounce 300ms)
- 회원 상세: 기본정보 + 주문내역 + 프린팅머니 + 쿠폰
- 회원 상세는 우측 Drawer (Sheet)로 표시
- "프린팅머니 지급" / "쿠폰 발급" 액션 버튼

### REQ-007-007: 탈퇴회원 관리 [WHEN-THEN]

**WHEN** 관리자가 탈퇴회원 메뉴에 접속하면
**THEN** 시스템은 탈퇴한 회원 목록을 표시하고 탈퇴 사유를 확인할 수 있게 해야 한다

- 탈퇴일, 탈퇴사유 표시
- 개인정보 마스킹 처리 (이름, 전화번호 부분 **)

### REQ-007-008: 프린팅머니 지급/차감 [WHEN-THEN]

**WHEN** 관리자가 회원에게 프린팅머니를 지급하거나 차감하면
**THEN** 시스템은 잔액을 업데이트하고 변경 이력을 기록해야 한다

- 지급/차감 금액 입력 (TextField)
- 사유 필수 입력 (TextField, required)
- 변경 이력 테이블 (날짜, 유형, 금액, 사유, 처리자)
- 잔액이 음수가 되는 차감 불허

### REQ-007-009: 쿠폰 발행 [WHEN-THEN]

**WHEN** 관리자가 쿠폰 정보를 입력하고 "발행하기"를 클릭하면
**THEN** 시스템은 쿠폰을 생성하고 매칭 대상 상품에 적용해야 한다

- 쿠폰명, 할인유형(정율%/정액원), 할인값
- 매칭 대상: 출력상품 전체 / 굿즈 카테고리 / 특정 상품
- 발행수량 (0=무제한)
- 유효기간 (시작일~종료일)
- 생성 즉시 사용자 측 적용

### REQ-007-010: 쿠폰 등록/사용 내역 [WHEN-THEN]

**WHEN** 관리자가 쿠폰 등록내역 또는 사용내역 탭을 선택하면
**THEN** 시스템은 해당 내역 목록을 표시해야 한다

- 등록내역: 쿠폰명, 회원, 등록일, 상태
- 사용내역: 쿠폰명, 회원, 사용일, 할인금액, 주문번호
- Tabs로 탭 전환

### REQ-007-011: 프린팅머니 음수 잔액 방지 [Unwanted]

시스템은 프린팅머니 잔액이 음수가 되는 차감을 실행**하지 않아야 한다**

- 차감 요청 금액 > 현재 잔액 시 에러 표시
- "잔액이 부족합니다. 현재 잔액: X원" 메시지

### REQ-007-012: 답변 알림 발송 [Ubiquitous]

시스템은 **항상** 문의/상담 답변 등록 시 고객에게 알림(이메일 또는 알림톡)을 발송해야 한다

### REQ-007-013: 쿠폰 활성/비활성 토글 [WHEN-THEN]

**WHEN** 관리자가 쿠폰 목록에서 Switch를 토글하면
**THEN** 시스템은 쿠폰의 활성/비활성 상태를 즉시 변경해야 한다

---

## 4. Huni 디자인시스템 컴포넌트 사용

| 컴포넌트 | 용도 | 주요 props/패턴 |
|---------|------|----------------|
| Dialog | 답변 작성 팝업, 쿠폰 발행 팝업, 프린팅머니 지급/차감, 삭제 확인 | lazyMount, unmountOnExit |
| TextField | 검색, 답변 입력, 쿠폰명, 금액 입력 | clearable(검색), multiline(답변) |
| Field | 쿠폰 발행 폼, 프린팅머니 조정 폼 | Context Provider, auto aria-* |
| Tabs | 게시판 유형 탭, 쿠폰 내역 탭 (발행/등록/사용) | line variant, indicator animation |
| Pagination | 게시판 목록, 회원 목록, 쿠폰 내역 | numbered variant |
| Switch | 공지사항 공개/비공개, 쿠폰 활성/비활성 | data-checked/disabled |
| Checkbox | 체험단 당첨자 일괄 선택, 게시글 일괄 선택 | data-checked/disabled/focus-visible |
| Chip | 문의 상태 표시 (대기/처리중/완료), 쿠폰 상태 | data-selected |
| Snackbar | 답변 등록/삭제 알림, 쿠폰 발행 알림 | useSnackbar hook, queue |
| Skeleton | 테이블 로딩, 회원 상세 로딩 | neutral variant |
| Divider | 회원 상세 섹션 구분 | full variant |
| Icon | 액션 아이콘 (답변, 삭제, 편집) | lucide-react |
| RadioGroup | 할인유형 선택 (정율/정액) | data-checked |

**디자인 토큰**:
- 토글 Switch on: `#5538B6`
- 토글 Switch off: `#CACACA`
- 탭 활성: `#5538B6` text + bottom 2px line
- 필터 Chip 기본: `#EEEBF9` bg / `#5538B6` text
- 필터 Chip 선택: `#5538B6` bg / white text
- Drawer overlay: `rgba(0,0,0,0.3)`

---

## 5. API 연동

| 기능 | API 엔드포인트 | 분류 | 비고 |
|------|---------------|------|------|
| 공지사항 CRUD | CRUD /admin/boards/notice | [SH] | shopby |
| FAQ CRUD | CRUD /admin/boards/faq | [SH] | shopby |
| Q&A 답변 | PUT /admin/boards/product-inquiry/{no}/reply | [SH] | shopby |
| 1:1문의 답변 | PUT /admin/boards/personal-inquiry/{no}/reply | [SH] | shopby |
| 견적문의 관리 | CRUD /custom/admin/bulk-inquiry | [C] | 커스텀 |
| 기업상담 관리 | CRUD /custom/admin/business-consultation | [C] | 커스텀 |
| 디자인상담 관리 | CRUD /custom/admin/design-consultation | [C] | 커스텀 |
| 체험단 관리 | CRUD /custom/admin/experience-group | [C] | 커스텀 |
| 이용후기 관리 | CRUD /admin/product-reviews | [SH] | shopby |
| 회원 목록 | GET /admin/members | [SH] | shopby |
| 회원 상세 | GET /admin/members/{memberNo} | [SH] | shopby |
| 탈퇴회원 목록 | GET /admin/members/withdrawn | [SH] | shopby |
| 프린팅머니 지급/차감 | POST /custom/admin/printing-money | [C] | 커스텀 |
| 쿠폰 발행 | POST /admin/coupons | [SH] | shopby |
| 쿠폰 매칭 | PUT /admin/coupons/{couponNo}/mapping | [SH] | shopby |
| 쿠폰 등록내역 | GET /admin/coupons/registrations | [SH] | shopby |
| 쿠폰 사용내역 | GET /admin/coupons/usages | [SH] | shopby |

---

## 6. TAG 분해

| TAG | 범위 | 파일 영향 |
|-----|------|----------|
| TAG-007-NOTICE | 공지사항/FAQ CRUD | src/pages/admin/board/ |
| TAG-007-INQUIRY | 견적/기업/디자인 상담 답변 | src/pages/admin/board/inquiry/ |
| TAG-007-QA | Q&A/1:1문의 답변 | src/pages/admin/board/qa/ |
| TAG-007-EXPERIENCE | 체험단관리 | src/pages/admin/board/experience/ |
| TAG-007-REVIEW | 이용후기관리 | src/pages/admin/board/review/ |
| TAG-007-MEMBER | 회원관리/탈퇴회원 | src/pages/admin/member/ |
| TAG-007-MONEY | 프린팅머니 지급/차감 | src/components/admin/member/MoneyAdjust |
| TAG-007-COUPON | 쿠폰 발행/매칭/내역 | src/pages/admin/coupon/ |

---

## 7. 의존성

- **SPEC-SKIN-005**: 관리자 기반 레이아웃 (사이드바, 인증, RBAC)
- **SPEC-DS-006**: Huni 디자인시스템 컴포넌트
