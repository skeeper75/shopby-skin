# SPEC-SKIN-004: 고객센터/정보/마케팅 - 인수 조건

> **SPEC ID**: SPEC-SKIN-004

## 1. 테스트 시나리오

### Scenario 1: 공지사항 카테고리 필터
- **Given** 공지사항 페이지에서
- **When** "이벤트" 탭을 클릭하면
- **Then** 이벤트 카테고리 공지만 필터링되어 표시된다
- **Status**: ✅ PASS (NoticePage.test.jsx)

### Scenario 2: 대량주문 견적문의 접수
- **Given** 견적문의 폼을 작성하고
- **When** 필수 필드 입력 후 "견적 문의하기"를 클릭하면
- **Then** 접수 완료 메시지가 표시되고 관리자에게 알림이 발송된다
- **Status**: ✅ PASS (InquiryForm.test.jsx)

### Scenario 3: 비회원 주문조회
- **Given** 비회원이 주문조회 페이지에서
- **When** 주문번호, 이메일, 휴대전화를 입력하고 조회하면
- **Then** 주문 상세 정보와 상태가 표시된다
- **Status**: ✅ PASS (GuestOrderPage.test.jsx)

### Scenario 4: FAQ 검색
- **Given** FAQ 페이지에서
- **When** "배송"을 검색하면
- **Then** 배송 관련 질문이 필터링되어 표시된다
- **Status**: ✅ PASS (FAQPage.test.jsx)

## 2. 품질 게이트
- [x] 공지사항/FAQ 카테고리 필터링 정상
- [x] 견적문의/상담 폼 필수값 검증
- [x] 비회원 주문조회 정상 동작
- [x] 가이드 11종 콘텐츠 렌더링
- [x] 랜딩페이지 Mobile 반응형
- [x] CustomSelect 키보드 접근성 (WCAG 2.1 AA)
- [x] 이메일 검증 RFC 5322 준수
- [x] 한국 전화번호 형식 검증
