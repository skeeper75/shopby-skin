# SPEC-SKIN-001 리서치 결과

> 작성일: 2026-03-14
> 대상 프로젝트: @shopby/react-skin (Aurora Skin v1.16.5)
> 기술 스택 결정: shadcn/ui + Tailwind CSS

---

## 1. 현재 프로젝트 상태 분석

### 1.1 기술 스택 현황

| 항목 | 현재 버전 | 비고 |
|------|-----------|------|
| React | 18.2.0 | Concurrent Mode 지원 |
| React Router | 6.4.3 | createBrowserRouter 사용 |
| Webpack | 5.75.0 | HMR, 코드 스플리팅 지원 |
| Babel | 7.20.x | ES6+ 트랜스파일 |
| CSS | Plain CSS + CSS Variables | CSS-in-JS 미사용 |
| 상태관리 | React Context API | 10단계 Provider 체인 |
| 핵심 라이브러리 | @shopby/react-components | Git 패키지 (사내 저장소) |

### 1.2 프로젝트 규모

- 컴포넌트: 75개 디렉토리 (`src/components/`)
- 페이지: 35개 디렉토리 (`src/pages/`)
- 커스텀 훅: 5개 (`src/hooks/`)
- 유틸리티: 5개 (`src/utils/`)

---

## 2. 반응형 디자인 현황 (핵심 문제)

### 2.1 react-device-detect 의존성

- **사용 방식**: `isMobile` 플래그로 User-Agent 기반 정적 기기 감지
- **영향 범위**: 28개 파일에서 사용 중
- **근본 문제**: 브라우저 리사이즈에 반응하지 않음
- **결론**: Tailwind CSS 반응형 유틸리티 + CSS 미디어 쿼리로 전환 필요

### 2.2 CSS 미디어 쿼리 부재

- 전체 프로젝트에서 `@media` 쿼리 **0건**
- 모든 반응형 처리가 `@shopby/react-components` 라이브러리에 위임됨

### 2.3 브레이크포인트 미정의

- 데스크톱/태블릿/모바일 구분을 위한 브레이크포인트 시스템 없음

### 2.4 고정 이미지 사이즈

- `resize="220x220"` 등 하드코딩된 이미지 크기 다수

### 2.5 플랫폼별 API 호출 분리

- PC: `SCPC0001` ~ `SCPC0005`
- Mobile: `SCMO0001` ~ `SCMO0005`

---

## 3. 수정 대상 핵심 파일

| 파일 | 줄 수 | 역할 | 수정 사유 |
|------|-------|------|-----------|
| `src/components/Layout/Layout.jsx` | 179 | 메인 레이아웃, 플랫폼 감지 | react-device-detect 제거, Tailwind 반응형 |
| `src/components/Header/Header.jsx` | 159 | 헤더 렌더링 | shadcn/ui NavigationMenu로 교체 |
| `src/components/LayoutProvider/LayoutProvider.jsx` | 58 | 레이아웃 상태 관리 | 반응형 상태 제공 |
| `src/components/CategoryNav/CategoryNav.jsx` | 18 | 사이드 네비게이션 | shadcn/ui Sheet 활용 |
| `src/components/BottomNav/BottomNav.jsx` | 28 | 모바일 하단 네비게이션 | Tailwind 반응형 숨김 처리 |
| `src/components/GalleryListPage/GalleryListPage.jsx` | 146 | 상품 그리드 | Tailwind grid 반응형 컬럼 |
| `src/pages/Main/MainContents.jsx` | 57 | 메인 페이지 섹션 | 홈페이지 리디자인 |
| `src/assets/style.css` | - | 전역 스타일 | Tailwind directives 추가 |
| `config/webpack.common.js` | - | Webpack 설정 | PostCSS/Tailwind 로더 추가 |

---

## 4. 참조 사이트 분석 (buysangsang.com / 후니프린팅)

### 4.1 사이트 개요

- **업종**: 인쇄 전문 이커머스 (엽서, 스티커, 명함, 포스터, 달력 등)
- **플랫폼**: Shopby 기반 쇼핑몰
- **특징**: 인쇄물 커스텀 주문 + 일반 상품 판매 병행

### 4.2 UI/UX 특성

| 특성 | 상세 |
|------|------|
| 메가 메뉴 | 12개 이상 최상위 카테고리, 서브 카테고리 포함 |
| 상품 그리드 | 반응형 컬럼 (데스크톱 4열, 태블릿 3열, 모바일 2열) |
| 탭 기반 베스트셀러 | 카테고리별 탭 필터링 |
| 스티키 헤더 | 스크롤 시 헤더 고정 |
| 컬러 스킴 | 보라색 기본 (#4B3F96) |

### 4.3 인쇄 전문 쇼핑몰 특수 기능

- 상품 옵션 시스템: 용지 종류, 사이즈, 수량, 후가공
- 파일 업로드: 인쇄용 디자인 파일 업로드
- 가격 계산기: 옵션 조합에 따른 동적 가격 산출

---

## 5. 기술 스택 결정: shadcn/ui + Tailwind CSS

### 5.1 선택 근거

| 기술 | 역할 | 선택 이유 |
|------|------|-----------|
| Tailwind CSS | 유틸리티 CSS | 반응형 breakpoint 내장, 빠른 스타일링, 커스텀 테마 |
| shadcn/ui | UI 컴포넌트 | Radix UI 기반 접근성, 커스텀 가능, Tailwind 통합 |
| PostCSS | CSS 처리 | Tailwind 빌드, autoprefixer |
| clsx/tailwind-merge | 클래스 유틸리티 | 조건부 Tailwind 클래스 관리 |

### 5.2 @shopby/react-components와의 공존 전략

- @shopby/react-components의 Provider/Hook은 그대로 유지 (상태 관리)
- UI 컴포넌트(ThumbList, Button 등)를 점진적으로 shadcn/ui로 교체
- 라이브러리 CSS와 Tailwind CSS 충돌 방지를 위한 prefix 또는 layer 관리

### 5.3 Provider 체인 구조

```
ModalProvider
  → MallProvider
    → OrderConfigProvider
      → BoardConfigurationProvider
        → AuthProvider
          → TermsProvider
            → CurrencyWrap
              → NaverShoppingConfigurationProvider
                → DesignPopupProvider
                  → EventProviderV2
                    → Layout (라우터)
```

---

## 6. 위험 요소 및 제약 조건

### 높은 위험

| 위험 | 완화 방안 |
|------|-----------|
| @shopby/react-components CSS와 Tailwind 충돌 | Tailwind prefix 설정, CSS layer 분리 |
| 28개 파일 react-device-detect 제거 | 단계별 마이그레이션 |
| PC/모바일 API 섹션 코드 통합 | matchMedia로 동적 전환 |

### 제약 조건

- @shopby/react-components 수정 불가 (래핑/오버라이드만 가능)
- Shopby API 스펙 변경 불가
- Webpack 5 기반 유지
- JavaScript(JSX) 유지 (TypeScript 전환 범위 밖)
