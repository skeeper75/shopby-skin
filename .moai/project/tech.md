# 기술 스택 - Aurora Skin

---

## 기술 스택 개요

Aurora Skin은 현대적인 React 생태계를 기반으로 구축된 e-커머스 프론트엔드 스킨입니다.

| 구분 | 기술 | 버전 |
|------|------|------|
| 언어 | JavaScript (ES6+), JSX | ES2022 |
| UI 프레임워크 | React | 18.2.0 |
| 라우팅 | React Router | 6.4.3 |
| 상태 관리 | React Context API | (내장) |
| 스타일링 | Plain CSS + CSS Variables | - |
| 국제화 | i18next | 최신 |
| 번들러 | Webpack | 5.75.0 |
| 트랜스파일러 | Babel | 7.20.x |
| 패키지 매니저 | Yarn 1 (권장) / npm | 10.7.0+ |
| 핵심 의존성 | @shopby/react-components | git 패키지 |

---

## 핵심 라이브러리 상세

### UI 및 라우팅

**React 18.2**
- Concurrent Mode 지원으로 렌더링 성능 향상
- `createRoot` API 사용
- 자동 배치(Automatic Batching)로 불필요한 리렌더링 감소

**React Router 6.4.3**
- Data API 기반 라우팅 (`createBrowserRouter`)
- 중첩 라우트(Nested Routes)로 레이아웃 공유
- 코드 스플리팅과 지연 로딩(Lazy Loading) 지원

### 상태 관리

**React Context API (Provider 패턴)**
- 별도의 외부 상태 관리 라이브러리 없이 Context만 사용
- 10단계 중첩 Provider 체인으로 관심사 분리
- 커스텀 훅으로 Context 접근 추상화

선택 이유: 쇼핑몰 스킨의 특성상 전역 상태보다 지역 상태 비중이 높고, Redux 등의 추가 라이브러리 없이 Context만으로 충분한 관리가 가능합니다.

### 스타일링

**Plain CSS + CSS Variables**
- CSS 변수(`--primary-color`, `--font-size-base` 등)를 활용한 테마 시스템
- 별도의 CSS-in-JS 또는 CSS Modules 없이 순수 CSS 사용
- 컴포넌트 디렉토리별 CSS 파일로 스타일 지역성 확보
- 미디어 쿼리로 모바일/PC 반응형 레이아웃 구현

### 국제화

**i18next**
- 기본 언어: 한국어 (`ko`)
- 번역 키는 `src/constants/translations/ko.json`에 정의
- React 컴포넌트 내에서 `t()` 함수로 번역 텍스트 사용

### 커스텀 컴포넌트 라이브러리

**@shopby/react-components**
- Git 저장소에서 직접 설치: `git+https://skins.shopby.co.kr/developers/react-components.git`
- Shopby 플랫폼 전용 공통 컴포넌트 제공
- Aurora Skin의 핵심 빌딩 블록

---

## 빌드 시스템

### Webpack 5.75.0

**개발 빌드 (`webpack.dev.js`)**
- Webpack Dev Server로 로컬 개발 서버 실행
- Hot Module Replacement(HMR)로 수정 내용 즉시 반영
- Source Map 생성으로 디버깅 용이
- 빠른 재빌드를 위한 캐시 설정

**프로덕션 빌드 (`webpack.prod.js`)**
- 코드 미니파이(Minification) 및 트리 쉐이킹(Tree Shaking)
- 청크(Chunk) 분리로 초기 로딩 최적화
- 에셋 해시 네이밍으로 CDN 캐시 무효화 제어
- CSS 파일 추출 및 최적화

### Babel 7.20.x

**변환 범위**
- ES6+ 문법을 하위 호환 JavaScript로 트랜스파일
- JSX 변환 (`@babel/plugin-transform-react-jsx`)
- 최신 JavaScript 기능(Optional Chaining, Nullish Coalescing 등) 지원
- `babel.config.js`에서 프리셋 및 플러그인 설정

---

## 개발 환경 요구사항

### 필수 환경

| 항목 | 버전 | 비고 |
|------|------|------|
| Node.js | v20.15.0 이상 | LTS 버전 권장 |
| Yarn | v1.x (Classic) | 권장 패키지 매니저 |
| npm | v10.7.0 이상 | Yarn 대안으로 사용 가능 |
| Git | 최신 | @shopby/react-components git 패키지 설치 필요 |

### 권장 개발 도구
- VSCode (ESLint, Prettier 확장 설치 권장)
- Chrome DevTools (React DevTools 확장 설치 권장)

### 로컬 실행 방법

```bash
# 패키지 설치 (Yarn 권장)
yarn install

# 개발 서버 시작
yarn start

# 프로덕션 빌드
yarn build
```

### `public/environment.json` 설정

로컬 개발 시 API 연동을 위해 `environment.json`을 설정합니다:

```json
{
  "clientId": "개발용_클라이언트_ID",
  "profile": "dev",
  "tc": "https://dev-api.shopby.co.kr"
}
```

---

## 코드 품질 도구

### ESLint

**설정 파일**: `.eslintrc.json`

- **규칙셋**: TUI(Toast UI) ESLint 설정 기반
- **대상**: `src/` 하위 모든 `.js`, `.jsx` 파일
- **주요 규칙**: React Hooks 규칙, 미사용 변수 금지, 세미콜론 일관성

### Prettier

**설정 파일**: `.prettierrc.json`

- 코드 포맷 자동화 (들여쓰기, 따옴표 스타일, 줄 길이 등)
- ESLint와 통합하여 포맷 충돌 방지

### Husky + lint-staged

**역할**: Git 커밋 전 자동 품질 검사

- `pre-commit` 훅: `lint-staged`를 실행하여 변경된 파일에만 ESLint + Prettier 적용
- 품질 기준 미달 시 커밋 차단

```
커밋 시도
    ↓
Husky pre-commit 훅 실행
    ↓
lint-staged: 스테이징된 파일 대상
    ├── ESLint --fix 적용
    └── Prettier --write 적용
    ↓
검사 통과 시 커밋 완료
```

---

## 배포 설정

### CI/CD 파이프라인

**플랫폼**: GitLab CI/CD

- `.gitlab-ci.yml`에 파이프라인 정의
- 브랜치 전략에 따른 자동 빌드 및 배포
- 개발 → 스테이징 → 운영 환경 순차 배포

### CDN 배포

**배포 대상**: `shopby-skin.cdn-nhncommerce.com`

- NHN Commerce CDN에 빌드 결과물 업로드
- Webpack 빌드 시 생성된 파일 해시로 캐시 무효화
- 전국 CDN 엣지 서버를 통한 빠른 정적 파일 서빙

### 환경 분리

| 환경 | profile 값 | 용도 |
|------|-----------|------|
| 개발 | `dev` | 로컬 개발 및 기능 테스트 |
| 스테이징 | `stage` | QA 및 통합 테스트 |
| 운영 | `prod` | 실서비스 제공 |

`public/environment.json`의 `profile` 값에 따라 API 서버 엔드포인트가 분기됩니다.

---

## 의존성 관리

### 핵심 의존성 (dependencies)

```
react: ^18.2.0
react-dom: ^18.2.0
react-router-dom: ^6.4.3
i18next: 최신
react-i18next: 최신
@shopby/react-components: git+https://...
```

### 개발 의존성 (devDependencies)

```
webpack: ^5.75.0
webpack-cli: 최신
webpack-dev-server: 최신
@babel/core: ^7.20.x
@babel/preset-env: 최신
@babel/preset-react: 최신
babel-loader: 최신
eslint: 최신
eslint-config-tui: 최신 (TUI 규칙셋)
prettier: 최신
husky: 최신
lint-staged: 최신
css-loader: 최신
style-loader: 최신
mini-css-extract-plugin: 최신
```

### 패키지 설치 시 주의사항

`@shopby/react-components`는 사내 GitLab 저장소에서 설치됩니다. 외부 개발 환경에서는 해당 저장소 접근 권한이 필요하며, 접근이 불가한 경우 의존성 설치가 실패할 수 있습니다.

---

## 기술 선택 근거

| 선택 | 이유 |
|------|------|
| React 18 | 안정적인 생태계, Concurrent Mode로 UX 향상 가능 |
| Context API | 외부 라이브러리 없이 충분한 상태 관리 가능한 규모 |
| Webpack 5 | 성숙한 번들러, 풍부한 플러그인 생태계 |
| Plain CSS | 진입 장벽 낮음, 복잡한 추상화 없이 직관적인 스타일 관리 |
| i18next | 검증된 국제화 솔루션, 한국어 기본 지원 |
| Yarn 1 | 결정적(Deterministic) 의존성 해결, 팀 내 일관성 확보 |

---

## 관리자 백오피스 기술 스택 (SPEC-SKIN-005)

관리자 백오피스 영역은 사용자 프론트엔드와 별도의 스타일링 체계를 적용합니다.

| 구분 | 기술 | 비고 |
|------|------|------|
| 스타일링 | Tailwind CSS | 관리자 영역 전용 유틸리티 CSS |
| UI 컴포넌트 | shadcn/ui 패턴 | 커스텀 관리자 컴포넌트 (12종) |
| 디자인 토큰 | Huni Design Tokens | 브랜드 컬러 #5538B6 기반 |
| 인증 | useAdminAuth 훅 | Mock 인증 (프로토타입 단계) |
| 데이터 테이블 | 커스텀 DataTable | 검색/필터/페이징/일괄처리 지원 |
| 반응형 | Desktop 전용 (≥1024px) | 태블릿 사이드바 접힘 모드 |

### 관리자 영역 vs 사용자 영역 차이

| 관점 | 사용자 영역 | 관리자 영역 |
|------|------------|------------|
| 스타일링 | Plain CSS + CSS Variables | Tailwind CSS |
| 레이아웃 | Header + Footer + Content | Sidebar + Header + Content |
| 반응형 | 모바일/PC | Desktop 전용 |
| 인증 | AuthProvider (JWT) | useAdminAuth (Mock → API 연동 예정) |
| 상태관리 | Context API (10 Providers) | useState (컴포넌트 로컬) |
