# SPEC-PLUGIN-001: 인수 기준

- **SPEC ID**: SPEC-PLUGIN-001
- **제목**: 후니프린팅 정책 자문 플러그인 패키지
- **상태**: Planned

---

## 1. 인수 기준 개요

본 문서는 SPEC-PLUGIN-001의 모든 요구사항에 대한 인수 기준을 Given-When-Then 형식으로 정의한다.

---

## 2. 테스트 시나리오

### AC-1: plugin.json 매니페스트 유효성 (REQ-1)

**Scenario: 플러그인 매니페스트가 유효한 구조를 갖추고 있다**

```gherkin
Given 플러그인 루트 디렉토리에 .claude-plugin/plugin.json이 존재할 때
When /plugin validate . 명령을 실행하면
Then 유효성 검증을 통과해야 한다
And plugin.json에 name, description, version 필드가 존재해야 한다
And version 필드가 시맨틱 버저닝 형식이어야 한다
```

**Scenario: .claude-plugin/ 디렉토리에는 plugin.json만 존재한다**

```gherkin
Given .claude-plugin/ 디렉토리를 검사할 때
When 디렉토리 내 파일 목록을 확인하면
Then plugin.json 파일만 존재해야 한다
And 다른 컴포넌트 파일은 존재하지 않아야 한다
```

### AC-2: 플러그인 디렉토리 구조 (REQ-1, REQ-8)

**Scenario: 모든 필수 디렉토리와 파일이 존재한다**

```gherkin
Given 플러그인 루트 디렉토리를 검사할 때
When 디렉토리 구조를 확인하면
Then 다음 디렉토리가 존재해야 한다: agents/, skills/, commands/, references/
And agents/expert-printing-policy.md가 존재해야 한다
And skills/innojini-shopby-policy-advisor/SKILL.md가 존재해야 한다
And skills/innojini-shopby-policy-advisor/references/industry-benchmarks.md가 존재해야 한다
And skills/innojini-shopby-policy-advisor/references/shopby-capability-matrix.md가 존재해야 한다
And commands/policy.md가 존재해야 한다
And references/feature-mapping.md가 존재해야 한다
And README.md, CHANGELOG.md, LICENSE가 존재해야 한다
```

**Scenario: plugin.json 내 모든 경로가 "./"로 시작한다**

```gherkin
Given plugin.json 파일을 읽을 때
When 경로 필드(commands, agents, skills 등)를 검사하면
Then 모든 경로가 "./"로 시작해야 한다
```

### AC-3: /policy 슬래시 커맨드 (REQ-2)

**Scenario: 정책 질의에 대한 응답을 제공한다**

```gherkin
Given 플러그인이 설치된 상태에서
When 사용자가 "/policy 배송 정책에 대해 알려주세요"를 입력하면
Then 시스템은 배송 관련 shopby 기능 분류를 포함한 응답을 제공해야 한다
And 응답에 NATIVE/SKIN/CUSTOM/EXTERNAL 분류가 포함되어야 한다
And 한국 인쇄업계 배송 벤치마크가 포함되어야 한다
And 정책 권고사항이 포함되어야 한다
```

**Scenario: 인수 없이 /policy만 입력한 경우**

```gherkin
Given 플러그인이 설치된 상태에서
When 사용자가 "/policy"만 입력하면
Then 시스템은 13개 정책 도메인 목록을 안내하고 질의 방법을 설명해야 한다
```

### AC-4: 에이전트 동작 (REQ-3)

**Scenario: 에이전트가 플러그인에서 정상 동작한다**

```gherkin
Given 플러그인이 설치된 상태에서
When expert-printing-policy 에이전트를 호출하면
Then 에이전트가 정상적으로 활성화되어야 한다
And 13개 정책 도메인에 대한 자문이 가능해야 한다
And NATIVE/SKIN/CUSTOM/EXTERNAL 기능 분류를 수행해야 한다
```

**Scenario: 에이전트가 번들된 참조 데이터에 접근 가능하다**

```gherkin
Given expert-printing-policy 에이전트가 활성화된 상태에서
When 에이전트가 참조 데이터를 로드하면
Then references/feature-mapping.md에 접근 가능해야 한다
And skills/innojini-shopby-policy-advisor/references/industry-benchmarks.md에 접근 가능해야 한다
And skills/innojini-shopby-policy-advisor/references/shopby-capability-matrix.md에 접근 가능해야 한다
```

### AC-5: 버전 관리 (REQ-4)

**Scenario: 시맨틱 버저닝이 적용되어 있다**

```gherkin
Given plugin.json을 확인할 때
When version 필드를 검사하면
Then MAJOR.MINOR.PATCH 형식이어야 한다 (예: "1.0.0")
And Git 태그가 "v1.0.0" 형식으로 존재해야 한다
```

**Scenario: CHANGELOG.md에 버전 이력이 기록되어 있다**

```gherkin
Given CHANGELOG.md를 확인할 때
When 내용을 검사하면
Then v1.0.0 초기 릴리스 항목이 존재해야 한다
And 변경 내역이 카테고리별로 정리되어 있어야 한다
```

### AC-6: 설치 및 업데이트 (REQ-5)

**Scenario: GitHub에서 플러그인 설치가 가능하다**

```gherkin
Given GitHub 저장소 innojini/shopby-policy-plugin이 존재할 때
When /plugin install github:innojini/shopby-policy-plugin 명령을 실행하면
Then 플러그인이 성공적으로 설치되어야 한다
And 모든 컴포넌트(에이전트, 스킬, 커맨드, 참조 데이터)가 사용 가능해야 한다
```

**Scenario: 플러그인 재설치를 통한 업데이트**

```gherkin
Given 플러그인이 이미 설치된 상태에서
When GitHub 저장소에 새 버전이 푸시된 후
And /plugin install github:innojini/shopby-policy-plugin 명령을 재실행하면
Then 최신 버전으로 업데이트되어야 한다
```

### AC-7: 참조 데이터 번들링 (REQ-6)

**Scenario: 참조 데이터가 상대 경로로 접근 가능하다**

```gherkin
Given 플러그인이 설치된 상태에서
When 에이전트 또는 스킬이 참조 데이터를 로드할 때
Then 플러그인 내 상대 경로로 모든 참조 파일에 접근 가능해야 한다
And feature-mapping.md에 94개 IA 기능 매핑이 포함되어야 한다
And industry-benchmarks.md에 한국 인쇄업계 벤치마크가 포함되어야 한다
And shopby-capability-matrix.md에 shopby 기능 매트릭스가 포함되어야 한다
```

### AC-8: 정책 문서 템플릿 (REQ-7)

**Scenario: 정책 문서 템플릿이 존재한다**

```gherkin
Given 플러그인 디렉토리를 검사할 때
When templates/ 디렉토리를 확인하면
Then policy-document.md 템플릿이 존재해야 한다
And 템플릿에 정책 도메인, 기능 분류, 벤치마크, 권고사항 섹션이 포함되어야 한다
```

### AC-9: 외부 의존성 분리 (REQ-9)

**Scenario: 외부 문서 없이도 기본 자문이 가능하다**

```gherkin
Given shopby API 문서가 존재하지 않는 프로젝트에 플러그인이 설치된 상태에서
When 정책 자문을 요청하면
Then 번들된 참조 데이터를 기반으로 자문을 제공해야 한다
And 상세 API 정보가 필요한 경우 외부 문서 설치 안내를 포함해야 한다
```

### AC-10: 보안 검증 (REQ-10)

**Scenario: 민감 데이터가 포함되지 않았다**

```gherkin
Given 플러그인 전체 파일을 검사할 때
When API 키, 비밀번호, 개인정보 패턴을 검색하면
Then 민감한 데이터가 발견되지 않아야 한다
```

---

## 3. 품질 게이트 기준

### 구조 검증

- [ ] `.claude-plugin/plugin.json` 매니페스트 유효성 통과
- [ ] 모든 필수 디렉토리 존재 (agents/, skills/, commands/, references/)
- [ ] 모든 필수 파일 존재 (6.2에 명시된 전체 목록)
- [ ] `plugin.json` 내 경로가 모두 `./`로 시작

### 기능 검증

- [ ] `/policy` 슬래시 커맨드 동작 확인
- [ ] `expert-printing-policy` 에이전트 호출 및 응답 확인
- [ ] 참조 데이터 상대 경로 접근 확인
- [ ] 13개 정책 도메인 자문 가능 확인
- [ ] NATIVE/SKIN/CUSTOM/EXTERNAL 기능 분류 동작 확인

### 배포 검증

- [ ] GitHub 저장소에서 `/plugin install` 설치 성공
- [ ] README.md에 설치 방법 및 사용법 포함
- [ ] CHANGELOG.md에 v1.0.0 기록
- [ ] LICENSE 파일 존재 (MIT)
- [ ] Git 태그 `v1.0.0` 존재

### 보안 검증

- [ ] 민감 데이터 미포함 확인
- [ ] `.gitignore` 적절히 설정

---

## 4. 완료 정의 (Definition of Done)

1. 모든 인수 기준(AC-1 ~ AC-10)이 통과되었다
2. `/plugin validate .` 명령이 성공한다
3. 새 프로젝트에서 `/plugin install`로 설치 후 `/policy` 커맨드가 동작한다
4. README.md가 설치부터 사용까지 완전한 가이드를 제공한다
5. v1.0.0 Git 태그가 생성되었다

---

## 5. 추적성

| TAG | 인수 기준 | 요구사항 |
|-----|-----------|----------|
| SPEC-PLUGIN-001 | AC-1, AC-2 | REQ-1, REQ-8 |
| SPEC-PLUGIN-001 | AC-3 | REQ-2 |
| SPEC-PLUGIN-001 | AC-4 | REQ-3 |
| SPEC-PLUGIN-001 | AC-5 | REQ-4 |
| SPEC-PLUGIN-001 | AC-6 | REQ-5 |
| SPEC-PLUGIN-001 | AC-7 | REQ-6 |
| SPEC-PLUGIN-001 | AC-8 | REQ-7 |
| SPEC-PLUGIN-001 | AC-9 | REQ-9 |
| SPEC-PLUGIN-001 | AC-10 | REQ-10 |
