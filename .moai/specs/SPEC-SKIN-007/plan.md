---
id: SPEC-SKIN-007
version: 2.0.0
type: plan
---

# SPEC-SKIN-007 v2: 관리자 게시판/회원/쿠폰 - 구현 계획

## 1. 구현 전략

### 1.1 개발 방식

- **혼합 개발**: shopby Admin API 활용(NATIVE) + 커스텀 API 구축
- **Huni DS 전용**: 모든 UI를 Huni 디자인시스템 컴포넌트로 구현
- **Desktop 전용**: 최소 1024px

### 1.2 기술 요구사항

- React 18 + TypeScript
- Huni 디자인시스템 (SPEC-DS-006) 컴포넌트
- `--huni-*` 토큰 전용
- WYSIWYG 에디터: TipTap (답변 에디터, 공지사항/FAQ 에디터)
- @shopby/react-components (회원/쿠폰/게시판 API 연동)

---

## 2. 마일스톤

### Phase 1: 게시판 기반 (Primary Goal)

**TAG-007-NOTICE + TAG-007-QA**

- 공지사항/FAQ CRUD 페이지 (shopby API)
- Q&A/1:1문의 답변 페이지 (shopby API)
- 공통 게시판 목록 컴포넌트 (정렬, 검색, 상태 필터)
- 공통 답변 에디터 컴포넌트

**파일 구조:**
```
src/pages/admin/board/
  ├── NoticePage.tsx
  ├── NoticeCreatePage.tsx
  ├── FaqPage.tsx
  ├── FaqCreatePage.tsx
  ├── QaPage.tsx
  └── PersonalInquiryPage.tsx
src/components/admin/board/
  ├── BoardList.tsx (공통 목록)
  ├── ReplyEditor.tsx (공통 답변)
  └── BoardStatusChip.tsx
```

### Phase 2: 커스텀 상담 (Primary Goal)

**TAG-007-INQUIRY**

- 견적문의/기업상담/디자인상담 답변 페이지 (커스텀 API)
- 빠른 답변 우측 패널 (행 클릭 시 열림)
- 첨부파일 다운로드
- 알림 발송 연동

**파일 구조:**
```
src/pages/admin/board/inquiry/
  ├── BulkInquiryPage.tsx
  ├── BusinessConsultPage.tsx
  └── DesignConsultPage.tsx
src/components/admin/board/
  └── QuickReplyPanel.tsx
```

### Phase 3: 회원/프린팅머니 (Primary Goal)

**TAG-007-MEMBER + TAG-007-MONEY**

- 회원관리 목록 + 상세 Drawer
- 탈퇴회원 목록
- 프린팅머니 지급/차감 Dialog
- 회원 활동 타임라인

**파일 구조:**
```
src/pages/admin/member/
  ├── MemberPage.tsx
  └── WithdrawnMemberPage.tsx
src/components/admin/member/
  ├── MemberDetailDrawer.tsx
  ├── MemberSearchBar.tsx
  ├── MoneyAdjustDialog.tsx
  └── ActivityTimeline.tsx
```

### Phase 4: 쿠폰/체험단/후기 (Secondary Goal)

**TAG-007-COUPON + TAG-007-EXPERIENCE + TAG-007-REVIEW**

- 쿠폰 발행/매칭/내역 페이지
- 체험단관리 (HTML 입력, 당첨처리)
- 이용후기관리 (관리자 임의등록)

**파일 구조:**
```
src/pages/admin/coupon/
  ├── CouponPage.tsx
  └── CouponCreatePage.tsx
src/pages/admin/board/
  ├── ExperiencePage.tsx
  └── ReviewPage.tsx
src/components/admin/coupon/
  ├── CouponForm.tsx
  ├── CouponMatchSelector.tsx
  └── CouponStatusSwitch.tsx
```

---

## 3. 아키텍처 설계 방향

### 3.1 공통 게시판 컴포넌트

- `BoardList` 컴포넌트: 게시판 유형별 config 패턴으로 재사용
- 컬럼 정의, 검색 필드, 상태 필터를 config로 주입
- 정렬, 페이지네이션, 검색 공통 처리

### 3.2 빠른 답변 패널

- 목록 행 클릭 시 우측 패널 슬라이드 인
- 페이지 이동 없이 문의 내용 확인 + 답변 작성
- 답변 완료 시 목록 자동 갱신 (react-query invalidation)

### 3.3 회원 상세 Drawer

- 우측 Drawer (Sheet 패턴)
- 탭 구조: 기본정보 / 주문내역 / 프린팅머니 / 쿠폰
- 프린팅머니 지급/차감은 Dialog 중첩

---

## 4. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|----------|
| shopby API와 커스텀 API 인터페이스 불일치 | 중간 | API 어댑터 패턴으로 통일 |
| 답변 에디터 이미지 업로드 | 낮음 | TipTap 이미지 확장 사용 |
| 체험단 HTML 직접 입력 보안 | 중간 | DOMPurify로 XSS 방지 |
| 회원 검색 성능 (대량 데이터) | 낮음 | debounce 300ms + 서버 사이드 검색 |

---

## 5. 관련 TAG 매핑

| TAG | Phase | 우선순위 |
|-----|-------|----------|
| TAG-007-NOTICE | Phase 1 | Primary |
| TAG-007-QA | Phase 1 | Primary |
| TAG-007-INQUIRY | Phase 2 | Primary |
| TAG-007-MEMBER | Phase 3 | Primary |
| TAG-007-MONEY | Phase 3 | Primary |
| TAG-007-COUPON | Phase 4 | Secondary |
| TAG-007-EXPERIENCE | Phase 4 | Secondary |
| TAG-007-REVIEW | Phase 4 | Secondary |
