---
id: SPEC-INFRA-001
type: acceptance
version: 1.0.0
tags: [infra, vercel, deployment]
---

# SPEC-INFRA-001: 인수 기준 (Acceptance Criteria)

## 1. 핵심 시나리오

### AC-01: Vercel 빌드 성공

```gherkin
Given Vercel 프로젝트가 GitHub 저장소에 연결되어 있고
  And .vendors/ 디렉토리에 @shopby/react-components-v1.16.5.tgz가 존재하고
  And .vendors/ 디렉토리에 @shopby/shared-v1.16.5.tgz가 존재하고
  And Vercel 환경 변수에 SHOPBY_CLIENT_ID, SHOPBY_PROFILE, SHOPBY_TC가 설정되어 있을 때
When Vercel 빌드가 트리거되면
Then npm install이 에러 없이 완료되고
  And scripts/generate-env.js가 public/environment.json을 생성하고
  And webpack 빌드가 성공하여 dist/ 디렉토리에 결과물이 생성된다
```

### AC-02: SPA 라우팅 정상 동작

```gherkin
Given Vercel 프리뷰 배포가 완료된 상태에서
When 사용자가 /products/123 경로로 직접 URL을 입력하여 접속하면
Then 404 에러 없이 index.html이 서빙되고
  And React Router가 /products/123 경로를 정상적으로 렌더링한다
```

### AC-03: 환경 변수 기반 environment.json 생성

```gherkin
Given Vercel 환경 변수에 SHOPBY_CLIENT_ID="test-client"와 SHOPBY_PROFILE="dev"가 설정되어 있을 때
When vercel-build 스크립트가 실행되면
Then public/environment.json 파일이 생성되고
  And JSON 내용에 clientId가 "test-client"이고 profile이 "dev"인 값이 포함된다
```

### AC-04: PR 프리뷰 배포 자동 생성

```gherkin
Given main 브랜치에서 feature 브랜치를 생성하고
  And 코드 변경을 커밋하여 Push한 후
When GitHub에 Pull Request를 생성하면
Then Vercel이 자동으로 프리뷰 빌드를 실행하고
  And PR에 프리뷰 배포 URL이 코멘트로 추가된다
```

---

## 2. 엣지 케이스

### AC-05: 필수 환경 변수 미설정 시 빌드 실패

```gherkin
Given Vercel 환경 변수에 SHOPBY_CLIENT_ID가 설정되지 않았을 때
When Vercel 빌드가 트리거되면
Then generate-env.js 스크립트가 명확한 오류 메시지를 출력하고
  And 빌드 프로세스가 비정상 종료 코드(exit 1)로 실패한다
```

### AC-06: 외부 CDN 스크립트 프리뷰 환경 비활성화

```gherkin
Given Vercel 프리뷰 환경(VERCEL_ENV="preview")에서 배포된 상태에서
When 메인 페이지를 로드하면
Then Naver Pay 버튼 스크립트(shopby-external-script.js)가 로드되지 않고
  And Netfunnel 스크립트가 로드되지 않고
  And 콘솔에 스크립트 관련 에러가 발생하지 않는다
```

### AC-07: API CORS 프록시 동작

```gherkin
Given Vercel 프리뷰 배포에서 API 프록시가 설정된 상태에서
When 프론트엔드가 /api/shopby/products 엔드포인트를 호출하면
Then Vercel Rewrites를 통해 Shopby API 서버로 프록시되고
  And CORS 에러 없이 응답 데이터를 수신한다
```

### AC-08: 벤더링된 패키지 정합성 검증

```gherkin
Given .vendors/ 디렉토리의 .tgz 파일이 Git에 커밋된 상태에서
When 새로운 환경에서 npm install을 실행하면
Then @shopby/react-components가 node_modules에 정상 설치되고
  And @shopby/shared가 node_modules에 정상 설치되고
  And 두 패키지의 모든 export가 기존과 동일하게 동작한다
```

---

## 3. 품질 게이트

### QG-01: 빌드 성공률

- Vercel 빌드가 **100% 성공**해야 함 (환경 변수 올바른 설정 전제)
- 빌드 소요 시간: **5분 이내** (Vercel 무료 플랜 제한 고려)

### QG-02: 페이지 로드

- 프리뷰 배포 URL 접속 시 **메인 페이지 로드 완료**
- 브라우저 콘솔에 **JavaScript 에러 0건** (외부 스크립트 제외)
- 페이지 로드 후 **빈 화면(white screen) 없음**

### QG-03: 라우팅 동작

- 최소 **5개 주요 경로** 직접 접속 시 정상 렌더링:
  - `/` (메인)
  - `/products` (상품 목록)
  - `/cart` (장바구니)
  - `/sign-in` (로그인)
  - `/my-page` (마이페이지)

### QG-04: 파일 무결성

- `dist/` 출력 파일 목록이 기존 CDN 빌드와 **동일한 구조**
- 번들 사이즈 차이 **10% 이내**

---

## 4. 검증 방법 및 도구

| 검증 항목 | 도구 | 방법 |
|----------|------|------|
| 빌드 성공 | Vercel Dashboard | 빌드 로그 확인 |
| SPA 라우팅 | 브라우저 | 주요 경로 직접 URL 접속 테스트 |
| 환경 변수 | curl + jq | `curl {preview-url}/environment.json` 응답 확인 |
| API 프록시 | 브라우저 DevTools | Network 탭에서 API 요청/응답 확인 |
| 외부 스크립트 | 브라우저 DevTools | Network 탭에서 스크립트 미로드 확인 |
| 벤더 패키지 | CI 환경 | `npm ci && npm run build` 성공 확인 |

---

## 5. Definition of Done

- [ ] `vercel.json` 파일이 생성되고 SPA rewrites가 설정됨
- [ ] `.vendors/` 디렉토리에 @shopby 패키지 .tgz 파일이 커밋됨
- [ ] `package.json`의 @shopby 의존성이 `file:` 프로토콜로 변경됨
- [ ] `scripts/generate-env.js`가 작성되고 환경 변수 검증 포함
- [ ] Vercel 프리뷰 빌드가 성공적으로 완료됨
- [ ] 프리뷰 URL에서 메인 페이지가 정상 로드됨
- [ ] SPA 라우팅이 5개 이상 주요 경로에서 정상 동작
- [ ] PR 생성 시 자동 프리뷰 배포 URL이 코멘트됨
- [ ] 외부 스크립트가 프리뷰 환경에서 비활성화됨
- [ ] API 프록시가 프리뷰 환경에서 정상 동작함
