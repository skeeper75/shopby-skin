# SPEC-LAYOUT-001 Acceptance Criteria

## 전역 인수 기준

### AC-GLOBAL-01: 레이아웃 무결성
- [ ] 320px ~ 1920px 범위의 모든 뷰포트에서 수평 스크롤이 발생하지 않는다
- [ ] 어떤 뷰포트에서도 요소 간 겹침(overlap)이 발생하지 않는다
- [ ] 텍스트가 의미를 잃을 정도로 잘리지 않는다
- [ ] 모든 인터랙티브 요소(버튼, 링크, 입력 필드)가 접근 가능하다

### AC-GLOBAL-02: 빌드 검증
- [ ] `npm run build` (webpack production) 에러 없이 완료
- [ ] 기존 테스트 (`npm test`) 전체 통과
- [ ] Vercel 배포 성공 (Ready 상태)

### AC-GLOBAL-03: 기능 보존
- [ ] 모바일에서의 기존 동작이 변경되지 않는다
- [ ] 장바구니 CRUD 기능 정상
- [ ] 주문서 작성 및 결제 흐름 정상
- [ ] 상품 상세 조회 및 옵션 선택 정상

---

## Phase 1: Foundation

### AC-R01: 반응형 브레이크포인트 토큰

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R01-01 | `src/design-system/tokens/breakpoints.css` 파일이 존재한다 | 파일 확인 |
| AC-R01-02 | `--huni-breakpoint-sm/md/lg/xl` CSS 변수가 :root에 정의되어 있다 | CSS 변수 확인 |
| AC-R01-03 | `--huni-container-*` 컨테이너 너비 변수가 정의되어 있다 | CSS 변수 확인 |
| AC-R01-04 | `--huni-padding-mobile/tablet/desktop` 패딩 변수가 정의되어 있다 | CSS 변수 확인 |
| AC-R01-05 | `tokens/index.css`에 breakpoints.css import가 추가되어 있다 | import 확인 |
| AC-R01-06 | Tailwind 기본 breakpoint와 값이 일치한다 (sm:640, md:768, lg:1024, xl:1280) | 값 비교 |

### AC-R02: PageShell 컨테이너 컴포넌트

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R02-01 | `src/components/layout/PageShell.jsx` 파일이 존재한다 | 파일 확인 |
| AC-R02-02 | maxWidth prop으로 "4xl", "5xl", "6xl", "7xl", "full"을 지원한다 | Storybook 또는 단위 테스트 |
| AC-R02-03 | padding="responsive"일 때 모바일 16px, 태블릿 24px, 데스크톱 32px 패딩이 적용된다 | 뷰포트별 확인 |
| AC-R02-04 | mx-auto로 중앙 정렬이 적용된다 | 시각적 확인 |
| AC-R02-05 | children을 올바르게 렌더링한다 | 렌더링 확인 |
| AC-R02-06 | className prop으로 추가 스타일을 병합할 수 있다 | 스타일 병합 확인 |

### AC-R03: ResponsiveGrid 컴포넌트

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R03-01 | `src/components/layout/ResponsiveGrid.jsx` 파일이 존재한다 | 파일 확인 |
| AC-R03-02 | cols prop으로 모바일/태블릿/데스크톱 컬럼 수를 설정할 수 있다 | 뷰포트별 확인 |
| AC-R03-03 | gap prop이 Huni spacing 토큰과 호환된다 | 간격 확인 |
| AC-R03-04 | 모바일에서 cols.mobile 값만큼의 컬럼이 표시된다 | 320px 뷰포트 |
| AC-R03-05 | 데스크톱에서 cols.desktop 값만큼의 컬럼이 표시된다 | 1280px 뷰포트 |

### AC-R04: 반응형 타이포그래피

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R04-01 | `src/design-system/tokens/responsive.css` 파일이 존재한다 | 파일 확인 |
| AC-R04-02 | `.huni-heading-xl/lg/md` 클래스가 정의되어 있다 | CSS 확인 |
| AC-R04-03 | `.huni-body-lg/md/sm` 클래스가 정의되어 있다 | CSS 확인 |
| AC-R04-04 | 모바일(320px)에서 heading-xl이 20px 이하로 렌더링된다 | computed style 확인 |
| AC-R04-05 | 데스크톱(1280px)에서 heading-xl이 26px 이상으로 렌더링된다 | computed style 확인 |
| AC-R04-06 | clamp()를 사용하여 중간 뷰포트에서 부드럽게 스케일링된다 | 768px 뷰포트 확인 |

---

## Phase 2: Migration

### AC-R05: react-device-detect 제거

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R05-01 | src/ 디렉토리에서 `react-device-detect` import가 0건이다 | `grep -r "react-device-detect" src/` (test 제외) |
| AC-R05-02 | package.json의 dependencies에서 react-device-detect가 제거되었다 | package.json 확인 |
| AC-R05-03 | React 컴포넌트 내 isMobile 사용은 useResponsive hook으로 대체되었다 | 코드 리뷰 |
| AC-R05-04 | 유틸리티 함수 내 isMobile 사용은 인자 전달 또는 matchMedia로 대체되었다 | 코드 리뷰 |
| AC-R05-05 | 데스크톱 브라우저에서 창 리사이즈 시 레이아웃이 실시간 반응한다 | 수동 테스트 |
| AC-R05-06 | iPad/태블릿 UA에서도 뷰포트 기반으로 올바르게 동작한다 | UA 시뮬레이션 |

### AC-R06: 페이지 컨테이너 통일

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R06-01 | 모든 페이지 컴포넌트가 PageShell 또는 동등한 컨테이너로 감싸져 있다 | 코드 리뷰 |
| AC-R06-02 | 하드코딩된 max-w-* 클래스가 PageShell maxWidth prop으로 대체되었다 | grep 확인 |
| AC-R06-03 | 1920px 뷰포트에서 콘텐츠가 화면 중앙에 위치한다 | 시각적 확인 |
| AC-R06-04 | 320px 뷰포트에서 좌우 패딩이 16px 이상이다 | 시각적 확인 |

### AC-R07: 장바구니 반응형

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R07-01 | 모바일(< 1024px)에서 기존 단일 컬럼 레이아웃이 유지된다 | 768px 뷰포트 |
| AC-R07-02 | 데스크톱(≥ 1024px)에서 상품 목록과 주문 요약이 좌우로 분할된다 | 1280px 뷰포트 |
| AC-R07-03 | 주문 요약 사이드바가 스크롤 시 sticky 동작한다 | 스크롤 테스트 |
| AC-R07-04 | 상품 선택/삭제/수량 변경 기능이 모든 뷰포트에서 정상 동작한다 | 기능 테스트 |
| AC-R07-05 | 주문하기 버튼이 모든 뷰포트에서 접근 가능하다 | UI 확인 |

### AC-R08: 주문서 반응형

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R08-01 | 모바일에서 기존 단일 컬럼 레이아웃이 유지된다 | 768px 뷰포트 |
| AC-R08-02 | 데스크톱에서 주문 정보와 결제 요약이 좌우로 분할된다 | 1280px 뷰포트 |
| AC-R08-03 | 폼 필드가 데스크톱에서 적절한 너비로 표시된다 | 시각적 확인 |
| AC-R08-04 | 결제하기 버튼이 모든 뷰포트에서 접근 가능하다 | UI 확인 |
| AC-R08-05 | 배송지 입력, 쿠폰, 결제수단 선택 기능이 정상 동작한다 | 기능 테스트 |

---

## Phase 3: Enhancement

### AC-R09: 상품 상세 반응형

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R09-01 | 데스크톱에서 이미지와 구매 옵션이 좌우로 분할된다 | 1280px 뷰포트 |
| AC-R09-02 | 모바일에서 기존 수직 스택 레이아웃이 유지된다 | 375px 뷰포트 |
| AC-R09-03 | 탭 콘텐츠(상세/후기/Q&A)가 전체 너비를 사용한다 | 시각적 확인 |
| AC-R09-04 | 인쇄 옵션 구매 UI(HuniPurchase)가 데스크톱에서 정상 표시된다 | 기능 테스트 |

### AC-R10: 마이페이지 반응형

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R10-01 | 데스크톱에서 사이드바 네비게이션이 표시된다 | 1280px 뷰포트 |
| AC-R10-02 | 모바일에서 기존 리스트 레이아웃이 유지된다 | 375px 뷰포트 |
| AC-R10-03 | 주문/적립금/쿠폰 카드가 그리드로 표시된다 | 데스크톱 확인 |

### AC-R11: 인증 페이지 반응형

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R11-01 | 데스크톱에서 폼이 중앙 정렬된 카드 형태로 표시된다 | 1280px 뷰포트 |
| AC-R11-02 | 폼 최대 너비가 480px 이하이다 | computed style |
| AC-R11-03 | 모바일에서 전체 너비를 사용한다 | 375px 뷰포트 |
| AC-R11-04 | SignIn, SignUp, FindId, FindPassword 모두 적용 | 각 페이지 확인 |

### AC-R12: 폼 반응형 레이아웃

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R12-01 | FormLayout 컴포넌트가 존재한다 | 파일 확인 |
| AC-R12-02 | 모바일에서 라벨과 입력 필드가 수직으로 쌓인다 | 375px 뷰포트 |
| AC-R12-03 | 데스크톱에서 라벨과 입력 필드가 수평으로 배치된다 | 1280px 뷰포트 |
| AC-R12-04 | Claim, MemberModification 페이지에 적용 | 각 페이지 확인 |

---

## Phase 4: Polish

### AC-R13: 반응형 간격

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R13-01 | 섹션 간격이 모바일 24px / 데스크톱 40px로 적용된다 | computed style |
| AC-R13-02 | 카드 간격이 모바일 12px / 데스크톱 24px로 적용된다 | computed style |

### AC-R14: 레이아웃 무결성 검증

| ID | 기준 | 검증 방법 |
|----|------|----------|
| AC-R14-01 | Storybook에 320/768/1024/1440px 뷰포트 프리셋이 존재한다 | Storybook 확인 |
| AC-R14-02 | 주요 페이지(Main, Cart, ProductDetail, MyPage)에 viewport 스토리가 존재한다 | Storybook 확인 |
| AC-R14-03 | 전역 `overflow-x: hidden`이 body에 적용되어 있다 | CSS 확인 |

---

## 검증 체크리스트 (최종 릴리즈 전)

### 뷰포트별 확인 (모든 핵심 페이지)

| 뷰포트 | 너비 | 확인 항목 |
|--------|------|----------|
| iPhone SE | 320px | 수평 스크롤 없음, 터치 영역 적절 |
| iPhone 14 | 390px | 기존 모바일 레이아웃 보존 |
| iPad | 768px | 태블릿 전환 정상 |
| iPad Pro | 1024px | 데스크톱 레이아웃 전환 |
| Laptop | 1280px | 콘텐츠 중앙 정렬 |
| Desktop | 1920px | 과도한 여백 없음, 콘텐츠 중앙 |

### 핵심 사용자 시나리오

| 시나리오 | 모바일 | 데스크톱 |
|---------|--------|---------|
| 메인 → 카테고리 → 상품 → 장바구니 → 주문 | ✅ | ✅ |
| 로그인 → 마이페이지 → 주문내역 → 교환/반품 | ✅ | ✅ |
| 회원가입 → 아이디/비밀번호 찾기 | ✅ | ✅ |
| 인쇄 상품 옵션 선택 → 주문 | ✅ | ✅ |
