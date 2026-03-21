---
id: SPEC-ORDER-001
artifact: screens
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-ORDER-001: 화면 인벤토리 (Screen Inventory)

> A6B8-ORDER 주문관리 도메인 전체 화면 설계 기초 자료

---

## 1. 쇼핑몰 화면 - 주문 플로우

### 1.1 모듈 1: 파일 업로드/정보입력 - SCR-ORD-001 ~ 008

| Screen ID | 화면명 | 유형 | Route Path | 우선순위 | 핵심 기능 |
|-----------|--------|------|------------|---------|----------|
| SCR-ORD-001 | 파일 업로드 | Page | `/order/upload?productNo=XXX` | P1 | 드래그앤드롭 영역, 파일 포맷/크기 안내, PDF 가이드라인 다운로드 |
| SCR-ORD-002 | 업로드 진행 상태 | State | `/order/upload` | P1 | 프로그레스바, 파일명, 크기, 업로드 취소 버튼 |
| SCR-ORD-003 | PitStop 검증 진행중 | State | `/order/upload` | P1 | 스피너, "파일 검증 중..." 메시지, 검증 항목 목록 |
| SCR-ORD-004 | 검증 결과 - 통과 | State | `/order/upload` | P1 | 녹색 배지, 항목별 통과 체크, "다음 단계" 버튼 활성화 |
| SCR-ORD-005 | 검증 결과 - 경고 | State | `/order/upload` | P1 | 노란색 배지, 경고 항목 표시, 동의 체크박스, 동의 시 진행 허용 |
| SCR-ORD-006 | 검증 결과 - 오류 | State | `/order/upload` | P1 | 빨간색 배지, 오류 항목 표시, "재업로드" 버튼, 진행 차단 |
| SCR-ORD-007 | 편집 정보 입력 | Section | `/order/upload` | P1 | 인쇄 옵션(용지, 수량, 후가공) 선택 영역, 가격 요약 |
| SCR-ORD-008 | 이탈 방지 다이얼로그 | Modal | - | P1 | "업로드 진행 중입니다" 확인/취소 |

### 1.2 모듈 2: 보관함/장바구니 - SCR-ORD-009 ~ 012

| Screen ID | 화면명 | 유형 | Route Path | 우선순위 | 핵심 기능 |
|-----------|--------|------|------------|---------|----------|
| SCR-ORD-009 | 옵션보관함 | Page | `/mypage/storage` | P1 | 저장된 옵션+파일 목록, 만료일, 재주문/삭제 버튼 |
| SCR-ORD-010 | 보관함 - 빈 상태 | State | `/mypage/storage` | P1 | "저장된 항목이 없습니다" 안내, 주문하기 CTA |
| SCR-ORD-011 | 장바구니 (인쇄 확장) | Page | `/cart` | P1 | shopby 기본 장바구니 + 인쇄 옵션 표시, 파일 썸네일 |
| SCR-ORD-012 | 보관함 만료 알림 | Toast | - | P2 | "3일 후 만료 예정" 토스트 알림 |

### 1.3 모듈 3: 배송/결제 - SCR-ORD-013 ~ 022

| Screen ID | 화면명 | 유형 | Route Path | 우선순위 | 핵심 기능 |
|-----------|--------|------|------------|---------|----------|
| SCR-ORD-013 | 주문서 작성 | Page | `/order/sheet` | P1 | 주문 상품 요약, 배송지, 결제수단, 쿠폰/적립금, 배송비 계산 |
| SCR-ORD-014 | 배송지 선택 | Section | `/order/sheet` | P1 | 저장된 배송지 목록, 기본 배송지 자동선택, 신규 입력 |
| SCR-ORD-015 | 배송지 신규 입력 | Modal | - | P1 | 다음 우편번호 검색, 상세주소 입력, 기본 배송지 설정 |
| SCR-ORD-016 | 배송비 계산 표시 | Section | `/order/sheet` | P1 | 기본/추가(제주/도서산간) 배송비, 무료배송 안내 |
| SCR-ORD-017 | 결제수단 선택 | Section | `/order/sheet` | P1 | 신용카드, 계좌이체, 네이버페이, 무이자 안내 |
| SCR-ORD-018 | 후불결제 선택 (B2B) | Section | `/order/sheet` | P2 | 후불결제 옵션 (B2B 거래처만 노출) |
| SCR-ORD-019 | KG이니시스 결제 팝업 | External | - | P1 | PG 결제 모듈 팝업 |
| SCR-ORD-020 | 결제 실패 팝업 | Modal | - | P1 | 실패 사유, 재시도 버튼, 다른 결제수단 선택 |
| SCR-ORD-021 | 주문 완료 | Page | `/order/complete?orderNo=XXX` | P1 | 주문번호, 결제금액, 예상 제작일, 주문 상세 보기 |
| SCR-ORD-022 | 주문 완료 - 후불 | State | `/order/complete` | P2 | "후불결제 주문" 별도 안내, 입금 안내 |

---

## 2. 관리자 화면 - 주문 운영

### 2.1 모듈 4: 주문관리 - SCR-ORD-030 ~ 038

| Screen ID | 화면명 | 유형 | Route Path | 우선순위 | 핵심 기능 |
|-----------|--------|------|------------|---------|----------|
| SCR-ORD-030 | 주문관리 목록 | Page | `/admin/orders` | P1 | 상태별/기간별/상품유형별 필터, 일괄 상태변경, 검색 |
| SCR-ORD-031 | 주문 상세 | Page | `/admin/orders/:orderNo` | P1 | 주문정보, 인쇄옵션, 파일, 공정상태, 결제, 알림이력 |
| SCR-ORD-032 | 상태변경 다이얼로그 | Modal | - | P1 | 상태 선택 드롭다운, 순방향만 표시, 알림 발송 체크 |
| SCR-ORD-033 | 일괄 상태변경 | Modal | - | P1 | 선택 건수, 대상 상태, 확인/취소 |
| SCR-ORD-034 | 주문서 출력 미리보기 | Modal | - | P1 | PDF 미리보기, 인쇄/다운로드 버튼 |
| SCR-ORD-035 | 역방향 변경 차단 안내 | Toast | - | P1 | "역방향 상태 변경은 불가합니다" 오류 메시지 |

### 2.2 모듈 5: 파일확인/재업로드 - SCR-ORD-040 ~ 046

| Screen ID | 화면명 | 유형 | Route Path | 우선순위 | 핵심 기능 |
|-----------|--------|------|------------|---------|----------|
| SCR-ORD-040 | 파일확인 대기 목록 | Page | `/admin/file-review` | P1 | FILE_CHECKING 상태 큐, 접수시간순, 긴급 표시 |
| SCR-ORD-041 | 파일 검수 상세 | Page | `/admin/file-review/:orderNo` | P1 | 파일 미리보기, PitStop 결과, 승인/재업로드 버튼 |
| SCR-ORD-042 | 파일 미리보기 (대) | Modal | - | P1 | 파일 전체 미리보기, 확대/축소, 페이지 넘김 |
| SCR-ORD-043 | 재업로드 요청 폼 | Modal | - | P1 | 사유 선택(해상도/CMYK/도련/기타), 직접입력, 발송 |
| SCR-ORD-044 | 재업로드 대기 목록 | Section | `/admin/file-review` | P1 | REUPLOAD_WAIT 상태 목록, 대기시간, 타임아웃 경고 |
| SCR-ORD-045 | 고객 재업로드 페이지 | Page | `/order/reupload?token=XXX` | P1 | 문제 안내, 파일 재업로드 영역, 기존 파일 비교 |

### 2.3 모듈 6: 후불결제/증빙/SMS - SCR-ORD-050 ~ 056

| Screen ID | 화면명 | 유형 | Route Path | 우선순위 | 핵심 기능 |
|-----------|--------|------|------------|---------|----------|
| SCR-ORD-050 | 후불결제 관리 | Page | `/admin/deferred-payments` | P2 | 미결제/결제완료 필터, 거래처별, 기간별 |
| SCR-ORD-051 | 후불 정산 처리 | Modal | - | P2 | 입금확인일, 결제수단, 금액, 메모 |
| SCR-ORD-052 | 증빙서류 관리 | Page | `/admin/receipts` | P1 | 세금계산서/현금영수증 발급 목록 |
| SCR-ORD-053 | 세금계산서 발급 폼 | Modal | - | P1 | 사업자정보, 공급가액, 세액, 발급 |
| SCR-ORD-054 | SMS 발송 (개별) | Modal | - | P1 | 수신자, 템플릿 선택/직접입력, 미리보기, 발송 |
| SCR-ORD-055 | SMS 일괄 발송 | Modal | - | P1 | 대상 주문 목록, 템플릿 선택, 발송 |
| SCR-ORD-056 | 발송 이력 | Section | `/admin/orders/:orderNo` | P1 | 알림톡/SMS 발송 이력, 상태(성공/실패), 발송시각 |

---

## 3. 화면 통계 요약

| 구분 | P1 | P2 | 합계 |
|------|----|----|------|
| 쇼핑몰 Page | 6 | 0 | 6 |
| 쇼핑몰 State/Modal | 9 | 2 | 11 |
| 관리자 Page | 7 | 1 | 8 |
| 관리자 Modal/Section | 10 | 1 | 11 |
| **합계** | **32** | **4** | **36** |
