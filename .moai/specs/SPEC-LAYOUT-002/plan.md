# SPEC-LAYOUT-002: 구현 계획

## 개요

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-LAYOUT-002 |
| 상위 SPEC | SPEC-LAYOUT-001 |
| 수정 파일 수 | ~9개 |
| 신규 파일 수 | 0개 |

## 마일스톤

### 1차 목표 (Primary Goal): CRITICAL 이슈 수정

#### M1-1: 메인 페이지 콘텐츠 폭 확장 (REQ-C01)

**사전 조사**:
- `.vendors/` 디렉토리에서 @shopby/react-components의 CSS 클래스명 조사
- 메인 페이지에서 사용되는 배너, 카테고리, 상품 섹션의 컨테이너 클래스 식별
- 폭을 제한하는 CSS 속성 파악 (max-width, width 등)

**구현**:
- `src/globals.css`에 `@media (min-width: 1024px)` 블록 추가
- 식별된 @shopby 컨테이너 클래스에 `max-width: 100% !important` 또는 적절한 값 적용
- 중첩된 컨테이너가 있을 경우 각 레벨별 오버라이드

**검증**:
- 1280px 뷰포트에서 콘텐츠 폭 1000px+ 확인
- 375px 뷰포트에서 레이아웃 변화 없음 확인
- 중간 뷰포트(768px)에서 자연스러운 전환 확인

#### M1-2: 인증 페이지 카드 스타일 (REQ-C02)

**구현**:
- 5개 인증 페이지의 폼 래퍼에 Tailwind 조건부 클래스 추가
- 공통 패턴: `lg:max-w-[480px] lg:mx-auto lg:shadow-md lg:rounded-lg lg:bg-white lg:p-8`
- 각 페이지의 JSX 구조를 확인하여 적절한 삽입 위치 결정

**검증**:
- 5개 페이지 모두 데스크톱에서 카드 형태 확인
- 모바일에서 전체 너비 유지 확인

#### M1-3: 서브페이지 데스크톱 헤더 (REQ-C03)

**사전 조사**:
- `src/components/Layout/` 내 헤더 렌더링 로직 분석
- 뒤로가기 화살표 컴포넌트/요소 식별
- 제목 정렬 방식 파악

**구현**:
- 뒤로가기 버튼: `lg:hidden` 클래스 추가
- 데스크톱 제목: `lg:text-left` 정렬 변경
- useResponsive hook으로 조건부 렌더링 (필요 시)

**검증**:
- 1280px에서 뒤로가기 숨김, 제목 좌측 정렬 확인
- 375px에서 기존 모바일 헤더 패턴 유지 확인
- FAQ, Notice, CustomerCenter 등 서브페이지에서 동작 확인

### 2차 목표 (Secondary Goal): HIGH 이슈 수정

#### M2-1: FAQ 런타임 에러 수정 (REQ-H01)

**사전 조사**:
- `src/pages/FAQ/FAQ.jsx`에서 `page` 관련 로직 분석
- SPEC-LAYOUT-001 마이그레이션 중 변경된 부분 git diff 확인
- 에러 발생 경로 추적

**구현**:
- page 데이터 타입 유효성 검증 수정
- 방어적 기본값 적용 (fallback)

**검증**:
- FAQ 페이지 접근 시 에러 모달 미표시 확인
- FAQ 목록 탐색 정상 동작 확인

#### M2-2: react-device-detect 의존성 제거 (REQ-H02)

**구현**:
- `package.json`에서 `react-device-detect` 항목 제거
- `npm install`로 `package-lock.json` 갱신

**검증**:
- `npm run build` 성공 확인
- 전체 소스에서 react-device-detect import 잔존 여부 grep 확인

### 최종 목표 (Final Goal): 검증 체크리스트 작성

#### M3-1: 수동 QA 체크리스트 (REQ-V01)

**구현**:
- acceptance.md에 인증/데이터 필요 페이지별 수동 검증 항목 작성
- 데스크톱(1280px) + 모바일(375px) 양방향 검증 포함

## 기술 접근

### CSS 오버라이드 전략 (REQ-C01)

@shopby/react-components는 벤더 패키지이므로 소스를 수정할 수 없다. 다음 전략을 사용:

1. **선택자 특이성(Specificity) 활용**: globals.css에서 @shopby 클래스를 대상으로 높은 특이성 선택자 사용
2. **미디어 쿼리 조건부**: `@media (min-width: 1024px)` 내에서만 오버라이드 적용
3. **!important 최소 사용**: 특이성으로 해결 안 되는 경우에만 !important 사용

### 카드 스타일 패턴 (REQ-C02)

Tailwind 반응형 프리픽스를 활용한 일관된 카드 패턴:
- 래핑 방식: 기존 폼 컨테이너에 클래스 추가 (새 래퍼 생성 최소화)
- 배경색: 페이지 배경과 카드 배경 분리를 위해 페이지 bg-gray-50, 카드 bg-white 패턴

### 헤더 수정 전략 (REQ-C03)

Layout 컴포넌트의 헤더는 전체 서브페이지에 공통으로 적용되므로:
- Layout 한 곳만 수정하면 모든 서브페이지에 반영
- CSS-only 접근 우선 (lg:hidden / hidden lg:block)
- JS 로직 변경은 CSS로 해결 불가한 경우에만

## 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| @shopby CSS 선택자가 높은 특이성 사용 | C01 오버라이드 실패 | !important 사용 또는 :where() 특이성 낮추기 |
| 인증 페이지 내부 구조가 일관되지 않음 | C02 패턴 적용 어려움 | 페이지별 개별 래퍼 전략으로 전환 |
| Layout 헤더가 조건부 렌더링 의존 | C03 CSS-only 접근 불가 | useResponsive 기반 JS 조건부 렌더링 |
| FAQ 에러 원인이 Layout 마이그레이션 외부 | H01 스코프 확대 | 에러 경계를 최소화하고 방어적 코딩 |

## 전문가 상담 권고

### expert-frontend 상담 권고

이 SPEC은 CSS 오버라이드, Tailwind 조건부 클래스, 레이아웃 컴포넌트 수정을 포함합니다. 다음 항목에 대해 expert-frontend 상담을 권고합니다:

- @shopby/react-components CSS 오버라이드의 선택자 전략
- Layout 헤더 조건부 렌더링 최적 접근법
- 카드 스타일 패턴의 디자인 일관성
