---
id: SPEC-SKIN-009
version: 1.0.0
status: draft
created: 2026-03-18
updated: 2026-03-18
---

# SPEC-SKIN-009 인수 기준

## R1: Playwright 관리자 페이지 자동 크롤러

### AC-R1-01: 자동 로그인 성공

```gherkin
Given shopby 관리자 페이지 URL과 자격 증명이 환경 변수로 설정되어 있을 때
When 크롤러 스크립트를 실행하면
Then shopby 관리자 페이지에 자동 로그인하여 대시보드에 도달해야 한다
And 자격 증명이 소스 코드에 하드코딩되지 않아야 한다
```

### AC-R1-02: 전체 메뉴 구조 수집

```gherkin
Given 로그인이 성공한 상태에서
When 사이드바 메뉴를 자동 탐색하면
Then 모든 1depth/2depth/3depth 메뉴 항목이 JSON으로 수집되어야 한다
And 각 항목에 title, url, depth, category가 포함되어야 한다
And 결과가 ref/shopby/admin-analysis/menu-map.json에 저장되어야 한다
```

### AC-R1-03: 로그인 실패 복구

```gherkin
Given 로그인 시도가 실패했을 때
When 재시도 로직이 실행되면
Then 최대 3회까지 재시도해야 한다
And 3회 실패 시 명확한 에러 메시지를 출력하고 종료해야 한다
```

---

## R2: 전체 페이지 스크린캡처

### AC-R2-01: 카테고리별 스크린샷 저장

```gherkin
Given menu-map.json에서 URL 목록이 로드된 상태에서
When 각 페이지를 방문하여 스크린샷을 캡처하면
Then 스크린샷이 ref/shopby/admin-screenshots/{category}/{page-name}.png 경로에 저장되어야 한다
And 뷰포트가 1920x1080 해상도여야 한다
```

### AC-R2-02: 타임아웃 및 진행률

```gherkin
Given 크롤링이 진행 중일 때
When 특정 페이지 로딩이 30초를 초과하면
Then 해당 페이지를 스킵하고 로그에 기록해야 한다
And 콘솔에 [현재/전체] 형식으로 진행률을 출력해야 한다
```

### AC-R2-03: 서버 부하 방지

```gherkin
Given 여러 페이지를 연속 크롤링할 때
When 각 페이지 방문 사이에
Then 최소 2초의 간격을 두어야 한다
```

---

## R3: DOM 구조 분석 및 기능 추출

### AC-R3-01: UI 요소 추출

```gherkin
Given 각 페이지를 방문했을 때
When DOM 분석을 수행하면
Then 페이지 제목, 검색 폼 필드, 테이블 컬럼 헤더, 액션 버튼, 탭 라벨이 추출되어야 한다
And 결과가 ref/shopby/admin-analysis/pages/{category}/{page-name}.json에 저장되어야 한다
```

### AC-R3-02: JSON 메타데이터 포함

```gherkin
Given DOM 분석 결과 JSON 파일을 확인할 때
When 파일 내용을 검사하면
Then 각 JSON에 url, title, category, timestamp 필드가 포함되어야 한다
```

---

## R4: 기능 매트릭스 생성

### AC-R4-01: 4가지 분류 체계

```gherkin
Given 모든 페이지 분석이 완료된 후
When 기능 매트릭스를 생성하면
Then 각 기능이 NATIVE/SKIN/CUSTOM/SKIP 중 하나로 분류되어야 한다
And 분류 근거(스크린샷 참조, 문서 참조)가 명시되어야 한다
And 결과가 ref/shopby/admin-analysis/feature-matrix.md에 저장되어야 한다
```

### AC-R4-02: SPEC 중복 식별

```gherkin
Given 기능 매트릭스와 SPEC-SKIN-005~008을 대조할 때
When 중복 분석을 수행하면
Then shopby Native로 충분한데 CUSTOM으로 구현된 영역이 식별되어야 한다
And 아직 구현되지 않은 CUSTOM 필요 영역이 식별되어야 한다
```

---

## R5: 개발 권고안

### AC-R5-01: 개발 불필요 기능 목록

```gherkin
Given 기능 매트릭스가 완성된 후
When 권고안을 확인하면
Then NATIVE/SKIP으로 분류된 기능 목록이 "개발하지 않아도 되는 기능"으로 정리되어야 한다
And 각 기능에 대해 shopby에서 어떻게 사용할 수 있는지 간략히 안내되어야 한다
```

### AC-R5-02: 개발 필요 기능 우선순위

```gherkin
Given 권고안 문서를 확인할 때
When CUSTOM 기능 목록을 확인하면
Then 각 기능에 우선순위(P1/P2/P3)가 지정되어야 한다
And 향후 SPEC 작성이 필요한 영역이 제안되어야 한다
```

---

## Quality Gate 기준

| 항목 | 기준 | 검증 방법 |
|------|------|-----------|
| 크롤러 실행 | 에러 없이 완료 | 스크립트 실행 로그 |
| 메뉴 수집 | 최소 50개 URL | menu-map.json 항목 수 |
| 스크린샷 | 최소 50장 캡처 | admin-screenshots/ 파일 수 |
| DOM 분석 | 최소 50개 JSON | pages/ 파일 수 |
| 기능 매트릭스 | 4분류 모두 포함 | feature-matrix.md 확인 |
| 권고안 | 구체적 액션 포함 | recommendations.md 확인 |
