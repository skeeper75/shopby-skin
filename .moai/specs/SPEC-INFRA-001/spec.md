---
id: SPEC-INFRA-001
title: Vercel Deployment Configuration
version: 1.0.0
status: completed
created: 2026-03-18
updated: 2026-03-18
author: MoAI
priority: P1
issue_number: 0
tags: [infra, vercel, deployment, ci-cd]
lifecycle: spec-first
---

# SPEC-INFRA-001: Vercel 배포 설정 (Aurora Skin)

## 1. 환경 (Environment)

### 1.1 현재 상태

- Aurora Skin은 React 18.2 기반 SPA로 Webpack 5.75을 통해 빌드
- 현재 배포 대상은 NHN Commerce CDN (`shopby-skin.cdn-nhncommerce.com`)
- GitLab CI/CD 파이프라인으로 빌드/배포 수행 중
- GitHub Actions는 Chromatic(Storybook 시각 회귀 테스트) 전용으로 사용

### 1.2 대상 환경

- **배포 플랫폼**: Vercel (프리뷰 배포 용도)
- **빌드 런타임**: Node.js 20.x (LTS)
- **패키지 매니저**: npm
- **빌드 출력**: `dist/` 디렉토리 (정적 파일)
- **프레임워크**: Webpack 5 SPA (Next.js 아님)

### 1.3 제약 조건

| 제약 | 수준 | 설명 |
|------|------|------|
| 내부 Git 의존성 접근 불가 | HARD | `@shopby/react-components`, `@shopby/shared`는 사내 GitLab 전용 |
| Shopby API CORS | MEDIUM | `*.vercel.app` 도메인이 API CORS 허용 목록에 없을 수 있음 |
| 외부 CDN 스크립트 | MEDIUM | Naver Pay, Netfunnel 스크립트가 도메인 제한될 수 있음 |
| SPA 라우팅 | LOW | BrowserRouter 사용으로 서버측 리다이렉트 필요 |

---

## 2. 가정 (Assumptions)

| ID | 가정 | 신뢰도 | 검증 방법 |
|----|------|--------|----------|
| A1 | Vercel 무료 플랜으로 프리뷰 배포가 충분하다 | HIGH | Vercel 문서 확인 |
| A2 | @shopby 패키지는 빌드 시점에 벤더링(vendoring)으로 해결할 수 있다 | MEDIUM | 로컬에서 npm pack 후 테스트 |
| A3 | `environment.json`은 빌드 스크립트로 동적 생성 가능하다 | HIGH | 스크립트 작성 후 검증 |
| A4 | Shopby API에 프록시 설정으로 CORS 문제를 우회할 수 있다 | MEDIUM | Vercel Rewrites로 테스트 |
| A5 | Naver Pay/Netfunnel 스크립트는 프리뷰에서 비활성화해도 무방하다 | HIGH | 비즈니스 요건 확인 |

---

## 3. 요구사항 (Requirements)

### 모듈 1: Vercel 프로젝트 설정

**REQ-INFRA-001-01** (Ubiquitous)
시스템은 **항상** `vercel.json` 설정 파일을 통해 빌드 명령어, 출력 디렉토리, SPA 라우팅 리다이렉트를 정의해야 한다.

**REQ-INFRA-001-02** (Event-Driven)
**WHEN** 사용자가 `/*` 경로로 직접 접근하면 **THEN** Vercel은 `index.html`로 리라이트하여 SPA 라우팅이 정상 동작해야 한다.

**REQ-INFRA-001-03** (State-Driven)
**IF** 빌드 환경이 Vercel이면 **THEN** `PUBLIC_PATH` 환경 변수는 `/`로 설정되어야 한다.

---

### 모듈 2: 내부 Git 의존성 해결

**REQ-INFRA-001-04** (Ubiquitous)
시스템은 **항상** `@shopby/react-components`와 `@shopby/shared` 패키지를 Vercel 빌드 서버에서 접근 가능한 형태로 제공해야 한다.

**REQ-INFRA-001-05** (Event-Driven)
**WHEN** Vercel 빌드가 시작되면 **THEN** 벤더링된 로컬 패키지(`.vendors/` 디렉토리)를 사용하여 `npm install`이 성공해야 한다.

**REQ-INFRA-001-06** (Unwanted)
시스템은 벤더링된 패키지의 `.tgz` 파일에 **민감한 인증 정보를 포함하지 않아야 한다**.

---

### 모듈 3: 환경 변수 관리

**REQ-INFRA-001-07** (Event-Driven)
**WHEN** Vercel 빌드가 실행되면 **THEN** `prebuild` 스크립트가 `public/environment.json` 파일을 Vercel 환경 변수(`SHOPBY_CLIENT_ID`, `SHOPBY_PROFILE`)로부터 동적 생성해야 한다.

**REQ-INFRA-001-08** (State-Driven)
**IF** `SHOPBY_CLIENT_ID` 환경 변수가 설정되지 않았으면 **THEN** 빌드는 명확한 오류 메시지와 함께 실패해야 한다.

**REQ-INFRA-001-09** (Ubiquitous)
시스템은 **항상** `.env.production` 파일의 환경 변수를 Vercel Environment Variables로 매핑하여 관리해야 한다.

---

### 모듈 4: 배포 파이프라인

**REQ-INFRA-001-10** (Event-Driven)
**WHEN** GitHub에 Pull Request가 생성되면 **THEN** Vercel이 자동으로 프리뷰 배포를 생성하고 PR에 배포 URL을 코멘트해야 한다.

**REQ-INFRA-001-11** (Event-Driven)
**WHEN** `main` 브랜치에 병합되면 **THEN** Vercel이 프로덕션 도메인에 자동 배포해야 한다.

**REQ-INFRA-001-12** (State-Driven)
**IF** 빌드가 실패하면 **THEN** 이전 성공한 배포가 유지되어야 하며 실패 알림이 발송되어야 한다.

---

### 모듈 5: 외부 스크립트 및 CORS 대응

**REQ-INFRA-001-13** (State-Driven)
**IF** 배포 도메인이 `*.vercel.app`이면 **THEN** Naver Pay 버튼 스크립트와 Netfunnel 스크립트를 조건부로 비활성화해야 한다.

**REQ-INFRA-001-14** (Event-Driven)
**WHEN** 프론트엔드가 Shopby API를 호출하면 **THEN** Vercel Rewrites를 통한 API 프록시로 CORS 문제를 우회해야 한다.

**REQ-INFRA-001-15** (Unwanted)
시스템은 프리뷰 배포에서 **실서비스(production profile) API에 직접 요청하지 않아야 한다**.

---

## 4. 사양 (Specifications)

### 4.1 vercel.json 구조

```
설정 항목:
- framework: null (커스텀 Webpack 빌드)
- buildCommand: npm run vercel-build
- outputDirectory: dist
- installCommand: npm install
- rewrites: [{ source: "/(.*)", destination: "/index.html" }]
- headers: 캐시 제어 헤더 (정적 에셋 1년, HTML no-cache)
```

### 4.2 벤더링 전략

```
접근 방식: 로컬 .tgz 벤더링
- .vendors/ 디렉토리에 @shopby/react-components와 @shopby/shared의 .tgz 아카이브 보관
- package.json에서 git URL 대신 file:.vendors/shopby-react-components-v1.16.5.tgz 참조
- .vendors/ 디렉토리는 Git 저장소에 커밋
```

### 4.3 환경 변수 매핑

| .env 변수 | Vercel 환경 변수 | 용도 |
|-----------|-----------------|------|
| (없음) | `SHOPBY_CLIENT_ID` | environment.json의 clientId |
| (없음) | `SHOPBY_PROFILE` | environment.json의 profile (dev/stage) |
| (없음) | `SHOPBY_TC` | environment.json의 tc (API 서버 URL) |
| `PUBLIC_PATH` | `PUBLIC_PATH` | Webpack publicPath 설정 |
| `NAVER_PAY_BUTTON_SCRIPT` | `NAVER_PAY_BUTTON_SCRIPT` | 네이버페이 스크립트 URL |

### 4.4 API 프록시 설정

```
Vercel Rewrites를 통한 API 프록시:
- source: /api/shopby/:path*
- destination: https://{SHOPBY_TC}/:path*
- 프리뷰 환경에서만 활성화
```

### 4.5 외부 스크립트 조건부 로드

```
조건부 로드 전략:
- VERCEL_ENV 환경 변수 확인
- preview/development 환경: 외부 CDN 스크립트 비활성화
- production 환경: 기존 동작 유지
- HtmlWebpackPlugin 템플릿에서 조건 분기 처리
```

---

## 5. 추적성 (Traceability)

| 요구사항 ID | 관련 파일 | 구현 상태 |
|------------|----------|----------|
| REQ-INFRA-001-01 | vercel.json | 구현완료 |
| REQ-INFRA-001-02 | vercel.json (rewrites) | 구현완료 |
| REQ-INFRA-001-03 | config/webpack.prod.js | 구현완료 |
| REQ-INFRA-001-04~06 | .vendors/, package.json, scripts/vendor-packages.sh | 구현완료 |
| REQ-INFRA-001-07~09 | scripts/generate-env.js, config/.env.production | 구현완료 |
| REQ-INFRA-001-10~12 | Vercel GitHub Integration (자동), vercel.json | 구현완료 (AC-04는 수동 설정) |
| REQ-INFRA-001-13~15 | vercel.json, webpack.prod.js, public/index.html | 구현완료 |

---

## 6. 구현 노트 (Implementation Notes)

### 6.1 범위 확대 (Scope Expansions)

원래 계획에서 다음 항목들이 추가로 구현되었습니다:

1. **config/.env.production 자동 생성**:
   - 발견: webpack.common.js의 dotenv 의존성이 `.env.production` 파일을 로드함
   - 해결: generate-env.js에서 Vercel 환경 변수로부터 이 파일을 동적 생성하도록 확대
   - 파일 경로: `config/.env.production` (런타임에 생성)

2. **vendor-packages.sh 자동화 스크립트**:
   - 발견: npm pack으로 .tgz 생성과 버전 관리의 반복 수작업 필요성 확인
   - 해결: 단순 수동 npm pack 대신, 전체 벤더링 프로세스를 자동화하는 쉘 스크립트 작성
   - 용도: 로컬 개발 환경에서 `npm run vendor` 명령으로 패키지 업데이트 시 사용

3. **vercel.json에 $schema 추가**:
   - IDE 자동완성 및 유효성 검사 지원을 위해 공식 Vercel JSON 스키마 참조 추가
   - IDE와 개발 경험 개선

### 6.2 기술적 결정사항 (Technical Decisions)

1. **벤더링 방식: 로컬 .tgz 파일 커밋**
   - 대안 검토: npm-shrinkwrap.json 사용, private npm registry, git submodule
   - 선택 이유:
     - Vercel 빌드 서버에서 사내 GitLab 접근 불가능 (HARD 제약)
     - 로컬 .tgz 커밋이 가장 간단하고 신뢰할 수 있는 해결책
     - .gitkeep으로 디렉토리 구조 보존

2. **환경 변수 매핑 계층화**:
   - Vercel 환경 변수 → .env.production (webpack.common.js 로드)
   - .env.production → webpack 컴파일 타임 치환 → environment.json (런타임 접근)
   - 이중 계층화로 안정성과 명확성 확보

3. **SPA 라우팅: vercel.json의 rewrites 사용**:
   - 정규식 기반 라우팅으로 `index.html` 폴백 처리
   - 정적 에셋(js, css, json 등)은 제외하여 성능 보장

4. **외부 스크립트 조건부 로드**:
   - VERCEL_ENV 환경 변수로 런타임 판단
   - webpack HtmlWebpackPlugin 템플릿에서 조건 처리
   - 프리뷰/개발 환경에서만 비활성화 (프로덕션은 기존 동작 유지)

5. **API 프록시 전략**:
   - Vercel Rewrites로 `/api/shopby/*` → `shop-api.e-ncp.com` 프록시
   - CORS 에러 우회 및 보안성 확보 (API 서버 URL 노출 방지)

### 6.3 보류된 항목 (Deferred Items)

1. **AC-04: PR 프리뷰 배포 자동 생성**
   - 상태: ⏳ 수동 설정 필요
   - 이유: Vercel Dashboard에서 GitHub Integration 설정이 필수 (API로 자동화 불가)
   - 설정 단계:
     1. Vercel 대시보드 로그인
     2. 프로젝트 설정 → Git 탭
     3. "Connect Git Repository" 클릭
     4. GitHub 저장소 선택 및 인증
   - 이후: PR 생성 시 자동으로 프리뷰 배포 생성 및 코멘트 추가됨

### 6.4 MX 태그 적용 현황

구현된 파일에 다음 MX 태그가 적용되었습니다:

**generate-env.js**
- `@MX:ANCHOR`: 빌드 프로세스의 중요 진입점 (npm run vercel-build 직접 호출)
- `@MX:WARN`: dotenv 로드 실패 시 프로세스 크래시 위험 (환경 변수 누락 감지)
- `@MX:NOTE`: 환경 변수 검증 로직과 TypeScript enum 일관성 유지 필요

**webpack.prod.js**
- `@MX:ANCHOR`: Webpack 플러그인 팩토리 (고 fan-in 함수)
- `@MX:NOTE`: VERCEL_ENV 환경 변수 조건부 처리로 배포 환경별 동작 제어

### 6.5 테스트 및 검증

로컬 검증 완료:
- vercel.json 유효성 검사 (JSON 스키마 준수)
- generate-env.js 환경 변수 검증 로직 테스트
- SPA 라우팅 rewrites 정규식 검증
- 벤더링된 패키지 npm install 동작 확인

Vercel 빌드 검증:
- 빌드 성공 여부 (environment.json 생성 확인)
- 프리뷰 배포 기본 동작 (메인 페이지 로드)
- SPA 라우팅 동작 (주요 경로 직접 접속 테스트)
