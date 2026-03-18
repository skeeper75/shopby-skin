---
id: SPEC-INFRA-001
type: research
version: 1.0.0
tags: [infra, vercel, deployment, research]
---

# SPEC-INFRA-001: 리서치 결과

## 1. 빌드 시스템 분석

### Webpack 설정 구조

Aurora Skin은 Webpack 5.75 기반의 멀티 설정 빌드 시스템을 사용합니다.

**설정 파일 구성**:
- `webpack.config.js`: 공통 설정 (엔트리, 로더, 플러그인)
- `webpack.dev.js`: 개발 환경 설정 (DevServer, HMR, Source Map)
- `webpack.prod.js`: 프로덕션 설정 (Minification, 청크 분리, CDN 스크립트 주입)

**빌드 명령어**:
- 개발: `npm start` -> `webpack serve --config webpack.dev.js`
- 프로덕션: `npm run build` -> `webpack --config webpack.config.js --node-env production --mode=production --env MODE=prod`

**주요 빌드 특성**:
- 엔트리 포인트: `src/index.js`
- 출력 디렉토리: `dist/`
- `PUBLIC_PATH` 환경 변수가 Webpack의 `output.publicPath`를 결정
- HtmlWebpackPlugin이 `public/index.html` 템플릿에서 HTML 생성
- `NAVER_PAY_BUTTON_SCRIPT` 환경 변수가 HTML 템플릿에 주입됨

**프로덕션 빌드 특이사항**:
- `webpack.prod.js`에서 외부 CDN 스크립트를 HTML에 주입:
  - `shopby-external-script.js` (from `shopby-skin.cdn-nhncommerce.com`)
  - `netfunnel.js` (from `shopby-skin.cdn-nhncommerce.com`)
- 이 스크립트들은 `<script>` 태그로 직접 삽입되며, 도메인 제한이 있을 수 있음

---

## 2. 의존성 분석

### @shopby 내부 패키지

**@shopby/react-components (v1.16.5)**:
- 소스: `git+https://skins.shopby.co.kr/developers/react-components.git#v1.16.5`
- 역할: Shopby 플랫폼 전용 공통 UI 컴포넌트 라이브러리
- Aurora Skin의 핵심 빌딩 블록으로, 거의 모든 페이지에서 사용
- NHN Commerce 사내 GitLab에서 호스팅 (외부 접근 불가)

**@shopby/shared (v1.16.5)**:
- 소스: `git+https://skins.shopby.co.kr/developers/shared.git#v1.16.5`
- 역할: 공통 유틸리티, 타입 정의, API 클라이언트 등 공유 코드
- react-components와 동일 버전(v1.16.5)으로 고정

**Vercel 빌드 서버 접근 문제**:
- `skins.shopby.co.kr`은 NHN Commerce 내부 네트워크 전용
- Vercel 빌드 서버는 공인 인터넷에서 실행되므로 해당 URL에 접근 불가
- `npm install` 단계에서 git 의존성 해결 실패 -> 빌드 전체 실패

**해결 전략 비교**:

| 전략 | 장점 | 단점 | 적합성 |
|------|------|------|--------|
| .tgz 벤더링 | 즉시 적용 가능, 외부 의존 없음 | Git 저장소 크기 증가, 수동 업데이트 | **최적** |
| GitHub Packages 미러 | 자동화 가능 | 추가 CI, 토큰 관리 | 중기 |
| Verdaccio 프라이빗 레지스트리 | 완전 자동화 | 서버 운영 비용, 인프라 관리 | 장기 |
| 소스 직접 복사 | 가장 단순 | 유지보수 어려움, 라이선스 문제 | 비권장 |

### 주요 런타임 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| react | 18.2.0 | UI 프레임워크 |
| react-dom | 18.2.0 | DOM 렌더링 |
| react-router-dom | 6.4.3 | SPA 라우팅 (BrowserRouter) |
| i18next | 22.0.6 | 국제화 |
| @radix-ui/* | 각종 | UI 프리미티브 (Accordion, Checkbox, Dialog 등) |
| tailwindcss | 3.4.x | 관리자 영역 CSS |

### 개발/테스트 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| vitest | 3.2.4 | 단위 테스트 |
| playwright | 1.58.2 | E2E 테스트 |
| storybook | 8.6.x | 컴포넌트 문서화/시각 테스트 |
| chromatic | - | Storybook 시각 회귀 테스트 (GitHub Actions) |

---

## 3. 환경 설정 분석

### 환경 변수 파일

**`.env` 파일 체계**:
- `.env.production`: 프로덕션 환경 변수
- `.env.development`: 개발 환경 변수
- `.env.beta`: 베타 환경 변수

**`public/environment.json` (런타임 설정)**:
```json
{
  "clientId": "개발용_클라이언트_ID",
  "profile": "dev",
  "tc": "https://dev-api.shopby.co.kr"
}
```

이 파일은 빌드 타임이 아닌 **런타임에 로드**됩니다:
- 앱 초기화 시 `fetch('/environment.json')`으로 로드
- `clientId`: Shopby API 인증에 사용되는 클라이언트 식별자
- `profile`: 환경 프로필 (`dev`, `stage`, `real`)
- `tc`: API 서버 기본 URL

**Vercel 환경 적용 전략**:
- `.env.*` 파일의 변수 -> Vercel Environment Variables로 매핑
- `environment.json` -> 빌드 스크립트(`generate-env.js`)로 동적 생성
- Vercel은 프리뷰/프로덕션별로 환경 변수를 분리 관리 가능

### PUBLIC_PATH 환경 변수

- Webpack의 `output.publicPath`를 결정
- CDN 배포 시: `https://shopby-skin.cdn-nhncommerce.com/path/`
- Vercel 배포 시: `/` (루트 상대경로)
- 이 값이 잘못 설정되면 모든 정적 에셋(JS, CSS, 이미지) 로드 실패

### NAVER_PAY_BUTTON_SCRIPT 환경 변수

- HtmlWebpackPlugin 템플릿에서 네이버페이 버튼 스크립트 URL을 주입
- 프리뷰 환경에서는 빈 문자열 또는 스텁 URL로 설정하여 비활성화

---

## 4. 현재 CI/CD 상태

### GitLab CI/CD (기존 메인 파이프라인)

- `.gitlab-ci.yml`에 정의된 빌드/배포 파이프라인
- 빌드 결과물을 NHN Commerce CDN에 업로드
- 개발/스테이징/운영 환경 순차 배포
- 사내 GitLab 러너에서 실행 -> @shopby 패키지 접근 가능

### GitHub Actions (보조 파이프라인)

- `.github/workflows/`에 정의
- **Chromatic**: Storybook 시각 회귀 테스트 전용
- PR 이벤트에 트리거되어 Storybook 빌드 후 Chromatic에 업로드
- @shopby 패키지 설치가 필요한지 확인 필요 (Storybook 빌드에 포함될 수 있음)

### Vercel 배포 추가 시 영향

- GitHub Actions (Chromatic)과 Vercel 배포는 **독립적으로 동작**
- 두 시스템 모두 PR 이벤트에 트리거되나 충돌 없음
- Vercel은 자체 빌드 시스템 사용 (GitHub Actions 불필요)
- 기존 GitLab CI/CD에는 영향 없음 (별도 플랫폼)

---

## 5. 위험 및 제약 사항 상세

### 위험 1: 내부 Git 의존성 [HIGH - 빌드 차단]

**현상**: `npm install` 시 `skins.shopby.co.kr` 접근 실패로 빌드 중단
**영향**: 빌드 자체가 불가능 -> Vercel 배포 완전 차단
**발생 확률**: 100% (확정적 문제)
**완화 방안**: .tgz 벤더링으로 해결 (마일스톤 1에서 처리)
**잔여 위험**: 벤더 패키지와 원본 패키지의 peer dependency 불일치 가능성

### 위험 2: Shopby API CORS [MEDIUM - 기능 제한]

**현상**: `*.vercel.app` 도메인에서 Shopby API 호출 시 CORS 에러
**영향**: API 연동 기능 전체 미동작 (상품 조회, 인증 등)
**발생 확률**: 높음 (API 서버의 CORS 정책에 따라 다름)
**완화 방안 A**: Vercel Rewrites로 API 프록시 (동일 도메인으로 우회)
**완화 방안 B**: Shopby API 팀에 CORS 허용 도메인 추가 요청
**잔여 위험**: 프록시 설정의 복잡성, 쿠키/인증 헤더 전달 이슈

### 위험 3: 외부 CDN 스크립트 [MEDIUM - 부분 기능 제한]

**현상**: Naver Pay, Netfunnel 스크립트가 등록되지 않은 도메인에서 미동작
**영향**: 결제 기능, 대기열 시스템 미동작 (프리뷰 환경 한정)
**발생 확률**: 높음 (도메인 등록 필요한 외부 서비스)
**완화 방안**: 프리뷰 환경에서 조건부 비활성화 (비즈니스 기능 일부 제한 수용)
**잔여 위험**: 비활성화로 인한 JavaScript 에러 발생 가능 (window.xxx undefined)

### 위험 4: SPA 라우팅 [LOW - 설정으로 해결]

**현상**: BrowserRouter 사용으로 직접 URL 접근 시 404
**영향**: 딥링크, 새로고침 시 페이지 미표시
**발생 확률**: 100% (설정 없이는 확정적)
**완화 방안**: `vercel.json`의 rewrites 설정으로 해결
**잔여 위험**: 거의 없음 (표준 SPA 배포 패턴)

### 위험 5: 빌드 시간 초과 [LOW]

**현상**: Webpack 빌드가 Vercel 무료 플랜 빌드 시간 제한(45초 ~ 수 분) 초과
**영향**: 빌드 실패
**발생 확률**: 낮음 (일반적인 React SPA 빌드는 2-3분 이내)
**완화 방안**: Vercel Pro 플랜 또는 빌드 최적화 (캐시 활용)
**잔여 위험**: 패키지 설치 시간이 길어질 경우 가능성 있음

---

## 6. Vercel 플랫폼 특성

### Vercel과 Aurora Skin 호환성

| 특성 | Aurora Skin | Vercel 지원 |
|------|------------|-------------|
| 프레임워크 | Webpack 5 (커스텀) | `framework: null`로 지원 |
| 빌드 결과 | 정적 파일 (HTML, JS, CSS) | Static Hosting으로 서빙 |
| 라우팅 | BrowserRouter (클라이언트) | Rewrites로 SPA 지원 |
| Node.js 버전 | 20.x | 20.x 지원 |
| 패키지 매니저 | npm | 기본 지원 |
| 환경 변수 | .env 파일 + environment.json | Dashboard에서 관리 |

### Vercel 무료 플랜 제한사항

- 빌드: 무제한 (빌드 시간 제한 있음)
- 대역폭: 100GB/월
- 팀: 1명 (개인 프로젝트)
- 프리뷰 배포: PR당 1개 자동 생성
- 커스텀 도메인: 가능
- 서버리스 함수: 12개/프로젝트

### Vercel 자동 기능

- **GitHub Integration**: PR 생성 시 자동 프리뷰 배포
- **HTTPS**: 자동 SSL 인증서 발급
- **CDN**: 전세계 엣지 서버 자동 배포
- **캐시**: 정적 에셋 자동 캐싱
- **롤백**: 이전 배포로 즉시 롤백 가능
