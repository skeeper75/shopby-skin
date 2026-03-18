---
id: SPEC-INFRA-001
type: plan
version: 1.0.0
tags: [infra, vercel, deployment]
---

# SPEC-INFRA-001: 구현 계획

## 1. 작업 분해 (Task Decomposition)

### 마일스톤 1: 내부 의존성 벤더링 [Priority High]

> 의존성: 없음 (첫 번째 작업)

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 1.1 | `@shopby/react-components` 로컬 패킹 | `.vendors/shopby-react-components-v1.16.5.tgz` |
| 1.2 | `@shopby/shared` 로컬 패킹 | `.vendors/shopby-shared-v1.16.5.tgz` |
| 1.3 | `package.json` 의존성 경로 변경 (git URL -> file: 참조) | 수정된 `package.json` |
| 1.4 | 클린 설치 검증 (`rm -rf node_modules && npm install`) | 설치 성공 확인 |
| 1.5 | 빌드 검증 (`npm run build` 성공 확인) | `dist/` 디렉토리 생성 |

**기술 결정: 벤더링(Vendoring) 접근법**

- **선택**: `.tgz` 파일을 Git 저장소에 커밋하는 벤더링 방식
- **대안 1 (기각)**: GitHub Packages에 미러링 - 추가 CI 파이프라인과 토큰 관리 필요
- **대안 2 (기각)**: Verdaccio 프라이빗 레지스트리 - 운영 오버헤드 과다
- **대안 3 (기각)**: Git Submodule - 사내 GitLab 접근 권한 문제 동일
- **선택 근거**: 가장 단순하고 외부 의존성 없이 즉시 적용 가능. 패키지 업데이트 시 `.tgz` 재생성 필요하나, v1.16.5로 고정된 상황에서 유지보수 부담 낮음

**벤더링 절차**:
```
1. 로컬에서 @shopby 패키지가 설치된 node_modules에서 npm pack 실행
2. 생성된 .tgz 파일을 .vendors/ 디렉토리로 이동
3. package.json의 해당 의존성을 file:.vendors/{filename}.tgz로 변경
4. .gitignore에서 .vendors/ 디렉토리가 추적되도록 확인
```

---

### 마일스톤 2: Vercel 프로젝트 설정 [Priority High]

> 의존성: 마일스톤 1 완료 후

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 2.1 | `vercel.json` 생성 (빌드 설정, SPA rewrites) | `vercel.json` |
| 2.2 | Vercel용 빌드 스크립트 작성 (`vercel-build`) | `package.json` scripts 추가 |
| 2.3 | Vercel 프로젝트 연결 (`vercel link`) | `.vercel/` 설정 |
| 2.4 | 로컬 테스트 (`vercel dev`) | 로컬 프리뷰 동작 확인 |

**vercel.json 설계**:
```
{
  "framework": null,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ]
}
```

---

### 마일스톤 3: 환경 변수 관리 [Priority High]

> 의존성: 마일스톤 2와 병렬 가능

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 3.1 | `scripts/generate-env.js` 작성 | 환경 변수 -> `environment.json` 생성 스크립트 |
| 3.2 | `package.json`에 `prebuild` 스크립트 추가 | `vercel-build` 실행 전 자동 호출 |
| 3.3 | Vercel Dashboard에 환경 변수 등록 가이드 작성 | 문서화 |
| 3.4 | 환경 변수 미설정 시 빌드 실패 처리 | 검증 로직 |

**generate-env.js 설계**:
```
입력: 환경 변수 SHOPBY_CLIENT_ID, SHOPBY_PROFILE, SHOPBY_TC
출력: public/environment.json
검증: 필수 변수 미설정 시 process.exit(1) + 명확한 오류 메시지
```

**vercel-build 스크립트 체인**:
```
"vercel-build": "node scripts/generate-env.js && npm run build"
```

---

### 마일스톤 4: 외부 스크립트 및 CORS 대응 [Priority Medium]

> 의존성: 마일스톤 2 완료 후

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 4.1 | Webpack 설정에 `VERCEL_ENV` DefinePlugin 변수 추가 | `webpack.config.js` 수정 |
| 4.2 | HtmlWebpackPlugin 템플릿에서 조건부 스크립트 로드 | `public/index.html` 또는 템플릿 수정 |
| 4.3 | Vercel Rewrites로 API 프록시 설정 | `vercel.json` rewrites 추가 |
| 4.4 | CORS 우회 동작 검증 | 프리뷰 환경에서 API 호출 테스트 |

**API 프록시 설계**:
```
vercel.json rewrites 추가:
- /api/shopby/:path* -> https://{환경별 API 서버}/:path*
- 프론트엔드 코드에서 API base URL을 상대경로(/api/shopby)로 분기
```

**외부 스크립트 조건부 로드**:
```
VERCEL_ENV 확인:
- "preview" 또는 "development": 외부 스크립트 스텁(stub) 사용
- "production" 또는 undefined: 기존 CDN 스크립트 로드
```

---

### 마일스톤 5: 배포 파이프라인 완성 [Priority Medium]

> 의존성: 마일스톤 1~3 완료 후

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 5.1 | Vercel GitHub Integration 활성화 | PR 자동 프리뷰 배포 |
| 5.2 | 프리뷰/프로덕션 환경 변수 분리 설정 | Vercel Dashboard 설정 |
| 5.3 | 프리뷰 배포 URL로 smoke 테스트 수행 | 페이지 로드 + 라우팅 검증 |
| 5.4 | 기존 GitHub Actions (Chromatic)과의 공존 확인 | CI 충돌 없음 확인 |

---

## 2. 작업 간 의존성 맵

```
마일스톤 1 (의존성 벤더링)
    |
    v
마일스톤 2 (Vercel 설정) -----> 마일스톤 4 (스크립트/CORS)
    |                                  |
    v                                  v
마일스톤 3 (환경 변수) ---------> 마일스톤 5 (파이프라인)
(2와 병렬 가능)
```

---

## 3. 위험 요소 및 대응 계획

### 위험 1: @shopby 패키지 벤더링 실패 [HIGH]

- **원인**: `.tgz` 패킹 시 내부 의존성 또는 peer dependency 누락
- **대응**: 로컬에서 `npm pack` 후 새 디렉토리에서 `npm install file:xxx.tgz` 검증
- **대안**: 패키지 소스를 `src/vendors/` 디렉토리에 직접 복사하고 Webpack alias로 해결

### 위험 2: Shopby API CORS 차단 [MEDIUM]

- **원인**: API 서버가 `*.vercel.app` 도메인을 허용하지 않음
- **대응 A**: Vercel Rewrites로 `/api/shopby/*` 프록시 설정
- **대응 B**: Shopby API 팀에 `*.vercel.app` CORS 허용 요청
- **대안**: 프리뷰 환경 전용 mock API 서버 사용

### 위험 3: 외부 CDN 스크립트 도메인 제한 [MEDIUM]

- **원인**: Naver Pay, Netfunnel 스크립트가 등록된 도메인에서만 동작
- **대응**: 프리뷰 환경에서 해당 스크립트 비활성화 (비즈니스 기능 제한 수용)
- **대안**: 스크립트 동작을 시뮬레이션하는 스텁(stub) 파일 제공

### 위험 4: Webpack 빌드 환경 차이 [LOW]

- **원인**: Vercel 빌드 서버와 로컬 환경의 Node.js 버전/OS 차이
- **대응**: `vercel.json`에 Node.js 버전 명시, `engines` 필드 설정
- **검증**: `vercel build` 로컬 CLI로 사전 테스트

---

## 4. 참고 구현

### vercel.json 레퍼런스

Vercel 공식 문서의 SPA 설정 가이드를 참조하여 rewrites, headers, build 설정을 구성합니다.

### 벤더링 참고 사례

npm의 `file:` 프로토콜을 사용한 로컬 패키지 참조는 npm 공식 문서에서 지원하는 표준 방식입니다. `npm pack` 명령어로 생성된 `.tgz` 파일을 `file:` 프로토콜로 참조하면 일반 레지스트리 패키지와 동일하게 설치됩니다.

### environment.json 동적 생성 참고

Vercel의 `Build & Development Settings`에서 `Build Command`를 커스텀 스크립트로 설정하면 빌드 전 환경 파일을 생성할 수 있습니다. 이는 CRA의 `REACT_APP_*` 패턴과 유사한 접근법입니다.
