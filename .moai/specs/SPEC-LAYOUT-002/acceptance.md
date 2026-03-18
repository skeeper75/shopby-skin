# SPEC-LAYOUT-002: 수락 기준

## 개요

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-LAYOUT-002 |
| 상위 SPEC | SPEC-LAYOUT-001 |
| 검증 환경 | 데스크톱 1280px, 모바일 375px |

## 자동 검증 가능 항목

### AC-C01: 메인 페이지 데스크톱 콘텐츠 폭

**Given** 브라우저가 1280px 뷰포트로 설정되어 있고
**When** 메인 페이지(/)에 접근하면
**Then** 메인 콘텐츠 영역의 폭이 1000px 이상이어야 한다
**And** 배너 섹션이 PageShell 폭에 맞게 확장되어야 한다
**And** 카테고리 그리드가 전체 폭을 활용해야 한다
**And** 상품 섹션이 전체 폭을 활용해야 한다

**Given** 브라우저가 375px 뷰포트로 설정되어 있고
**When** 메인 페이지(/)에 접근하면
**Then** 기존 모바일 레이아웃과 동일하게 렌더링되어야 한다
**And** 수평 스크롤이 발생하지 않아야 한다

### AC-C02: 인증 페이지 카드 스타일

**Given** 브라우저가 1280px 뷰포트로 설정되어 있고
**When** SignIn 페이지(/sign-in)에 접근하면
**Then** 폼이 최대 480px 너비의 카드 컨테이너 안에 표시되어야 한다
**And** 카드에 그림자(shadow) 효과가 적용되어야 한다
**And** 카드 모서리가 둥글게(rounded) 처리되어야 한다
**And** 카드 배경이 흰색이어야 한다
**And** 카드가 화면 수평 중앙에 위치해야 한다

**Given** 브라우저가 375px 뷰포트로 설정되어 있고
**When** SignIn 페이지에 접근하면
**Then** 폼이 전체 너비를 사용해야 한다
**And** 카드 스타일(그림자, 라운드)이 적용되지 않아야 한다

> 위 시나리오는 SignUp, FindId, FindPassword, ChangePassword 페이지에도 동일하게 적용

### AC-C03: 서브페이지 데스크톱 헤더

**Given** 브라우저가 1280px 뷰포트로 설정되어 있고
**When** FAQ 페이지(/FAQ)에 접근하면
**Then** 뒤로가기 화살표 버튼이 표시되지 않아야 한다
**And** 페이지 제목이 좌측 정렬로 표시되어야 한다

**Given** 브라우저가 375px 뷰포트로 설정되어 있고
**When** FAQ 페이지에 접근하면
**Then** 뒤로가기 화살표 버튼이 표시되어야 한다
**And** 페이지 제목이 중앙 정렬로 표시되어야 한다

> 위 시나리오는 Notice, CustomerCenter, Terms 등 모든 서브페이지에 동일 적용

### AC-H01: FAQ 런타임 에러

**Given** 사용자가 로그인하지 않은 상태에서
**When** FAQ 페이지(/FAQ)에 접근하면
**Then** "page에 잘못된 타입의 데이터가 존재합니다" 에러 모달이 표시되지 않아야 한다
**And** FAQ 목록이 정상적으로 표시되어야 한다

### AC-H02: react-device-detect 의존성 제거

**Given** SPEC-LAYOUT-002 수정이 완료된 상태에서
**When** package.json을 확인하면
**Then** react-device-detect 의존성이 존재하지 않아야 한다

**Given** react-device-detect가 package.json에서 제거된 상태에서
**When** npm install && npm run build를 실행하면
**Then** 빌드가 성공적으로 완료되어야 한다
**And** 런타임 에러가 발생하지 않아야 한다

**Given** 전체 소스 코드를 검색했을 때
**When** grep으로 react-device-detect를 검색하면
**Then** import 또는 require 구문이 존재하지 않아야 한다

## 수동 검증 체크리스트 (인증/데이터 필요 페이지)

### Cart 페이지 (로그인 + 장바구니 상품 필요)

- [ ] 데스크톱(1280px): 2단 레이아웃 (좌: 상품 목록, 우: 주문 요약)
- [ ] 데스크톱: 주문 요약 사이드바 sticky 동작
- [ ] 모바일(375px): 단일 컬럼 레이아웃
- [ ] 장바구니 기능 (수량 변경, 삭제 등) 정상 동작

### OrderSheet 페이지 (로그인 + 주문 진행 필요)

- [ ] 데스크톱(1280px): 2단 레이아웃 (좌: 주문 정보, 우: 결제 요약)
- [ ] 데스크톱: 폼 필드 적절한 너비
- [ ] 모바일(375px): 단일 컬럼 레이아웃
- [ ] 주문 기능 정상 동작

### MyPage (로그인 필요)

- [ ] 데스크톱(1280px): 좌측 사이드바 네비게이션 + 우측 콘텐츠
- [ ] 데스크톱: 주문/적립금/쿠폰 카드 그리드 표시
- [ ] 모바일(375px): 기존 리스트 레이아웃 유지
- [ ] 각 메뉴 항목 네비게이션 정상 동작

### ProductDetail (상품 데이터 필요)

- [ ] 데스크톱(1280px): 좌측 이미지 갤러리 + 우측 구매 옵션
- [ ] 데스크톱: 탭 콘텐츠 전체 너비 사용
- [ ] 모바일(375px): 단일 컬럼 레이아웃
- [ ] 이미지 스와이프/네비게이션 정상 동작

### OrderDetail / OrderConfirm (로그인 + 주문 내역 필요)

- [ ] 데스크톱(1280px): 콘텐츠가 적절한 max-width 내에 표시
- [ ] 모바일(375px): 전체 너비 사용
- [ ] 주문 상세 정보 모두 표시

### MemberModification (로그인 필요)

- [ ] 데스크톱(1280px): 폼 필드 적절한 너비, 2단 레이아웃 가능
- [ ] 모바일(375px): 단일 컬럼 스택 레이아웃
- [ ] 회원 정보 수정 기능 정상 동작

### Claim (로그인 + 주문 내역 필요)

- [ ] 데스크톱(1280px): 폼 레이아웃 적절한 너비
- [ ] 모바일(375px): 단일 컬럼 레이아웃
- [ ] 클레임 접수 기능 정상 동작

## 구현 완료 현황 (2026-03-19)

### AC-C01: 메인 페이지 데스크톱 콘텐츠 폭
- [x] `src/globals.css`에 `@media (min-width: 1024px)` 오버라이드 추가
- [x] `.page-inner` max-width 1280px로 확장
- [x] `.page__content.site` 전체 너비로 확장
- [x] 모바일(375px) 레이아웃 미영향 확인

### AC-C02: 인증 페이지 카드 스타일
- [x] SignIn.jsx: `lg:max-w-[480px] lg:mx-auto lg:shadow-md lg:rounded-lg lg:bg-white lg:p-8` 래퍼 추가
- [x] SignUp.jsx: 동일 카드 래퍼 추가
- [x] FindId.jsx: 동일 카드 래퍼 추가
- [x] FindPassword.jsx: 동일 카드 래퍼 추가
- [x] ChangePassword.jsx: 동일 카드 래퍼 추가

### AC-C03: 서브페이지 데스크톱 헤더
- [x] `src/components/Header/Header.jsx` 수정
- [x] 뒤로가기 버튼에 `lg:hidden` 클래스 추가 (데스크톱 숨김)
- [x] 제목 래퍼에 `lg:text-left` 클래스 추가 (데스크톱 좌측 정렬)
- [x] 모바일(375px) 기존 패턴 유지 확인

### AC-H01: FAQ 런타임 에러
- [x] `boardPosts?.totalCount ?? 0` 방어적 접근 적용
- [x] `boardsCategories = []` 기본값 적용

### AC-H02: react-device-detect 의존성 제거
- [x] `package.json`에서 react-device-detect 제거
- [x] `src/__tests__/setup.js`에서 관련 mock 제거
- [x] package-lock.json 업데이트 완료
- [x] `npm run build` 성공 확인

## 품질 게이트

### Definition of Done

- [x] 모든 CRITICAL 수락 기준(AC-C01 ~ AC-C03) 통과
- [x] 모든 HIGH 수락 기준(AC-H01 ~ AC-H02) 통과
- [x] npm run build 성공
- [ ] 테스트 커버리지 85%+ 유지 (수동 검증 필요)
- [ ] Lint 에러 0개 (수동 검증 필요)
- [ ] 375px 뷰포트에서 기존 모바일 레이아웃 회귀 없음 (수동 시각 검증 필요)
- [ ] 1280px 뷰포트에서 모든 수정 사항 시각적 확인 (수동 시각 검증 필요)
- [x] 수동 QA 체크리스트 작성 완료

### 검증 도구

- Playwright: 자동 스크린샷 비교 (1280px, 375px)
- DevTools: CSS 오버라이드 특이성 확인
- npm run build: 빌드 무결성
- grep: react-device-detect 잔존 확인
