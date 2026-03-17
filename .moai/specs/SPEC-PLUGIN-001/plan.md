# SPEC-PLUGIN-001: 구현 계획

- **SPEC ID**: SPEC-PLUGIN-001
- **제목**: 후니프린팅 정책 자문 플러그인 패키지
- **상태**: Planned

---

## 1. 구현 전략

### 접근 방식

기존 로컬 에셋(스킬, 에이전트, 참조 데이터)을 Claude Code 플러그인 표준 구조로 이관한다. 핵심은 파일 경로 변환과 자립적 참조 데이터 번들링이다.

### 기술 스택

- **플러그인 시스템**: Claude Code Plugin System (`.claude-plugin/plugin.json`)
- **배포**: GitHub Repository + Git Tags
- **버전 관리**: Semantic Versioning (SemVer)
- **라이선스**: MIT

---

## 2. 마일스톤

### Primary Goal: 플러그인 기본 구조 생성

**범위**: REQ-1, REQ-8

- 새 GitHub 저장소 생성 (`innojini/shopby-policy-plugin`)
- `.claude-plugin/plugin.json` 매니페스트 작성
- 플러그인 디렉토리 구조 생성
- 기존 에셋을 플러그인 구조로 복사

**산출물**:
- `plugin.json` 매니페스트 파일
- 올바른 디렉토리 구조

### Secondary Goal: 에셋 이관 및 경로 변환

**범위**: REQ-3, REQ-6, REQ-9

- 에이전트 정의 이관 및 경로 수정
  - 참조 파일 경로를 플러그인 상대 경로로 변환
  - 외부 문서 참조를 선택적 참조로 변경
  - 스킬 참조를 플러그인 내부 경로로 수정
- 스킬 이관 및 경로 수정
  - SKILL.md 내 참조 경로 변환
  - references/ 디렉토리 포함 확인
- 참조 데이터 이관
  - `feature-mapping.md`를 `references/`로 복사
  - 업계 벤치마크 및 shopby 매트릭스 포함 확인

**산출물**:
- 경로 변환 완료된 에이전트 정의
- 경로 변환 완료된 스킬 정의
- 번들된 참조 데이터

### Tertiary Goal: 슬래시 커맨드 및 템플릿 생성

**범위**: REQ-2, REQ-7

- `/policy` 슬래시 커맨드 생성
  - `commands/policy.md` 작성
  - `$ARGUMENTS` 파라미터 처리
  - 정책 자문 스킬 연동
- 정책 문서 템플릿 생성
  - 기존 정책 문서(POLICY-SHIPPING-PAYMENT-REVIEW-*)를 참고하여 범용 템플릿 작성
  - `templates/policy-document.md` 생성

**산출물**:
- 동작하는 `/policy` 슬래시 커맨드
- 정책 문서 템플릿

### Final Goal: 문서화 및 배포 준비

**범위**: REQ-4, REQ-5, REQ-10

- README.md 작성
  - 설치 방법 (`/plugin install github:innojini/shopby-policy-plugin`)
  - 사용법 (`/policy` 커맨드, 에이전트 호출 방법)
  - 기능 분류 체계 설명
  - 13개 정책 도메인 목록
- CHANGELOG.md 작성 (v1.0.0 초기 릴리스)
- LICENSE 파일 생성 (MIT)
- 보안 검토
  - 민감 데이터 포함 여부 확인
  - `.gitignore` 설정
- `/plugin validate .` 실행하여 플러그인 유효성 검증
- Git 태그 생성 (`v1.0.0`)

**산출물**:
- 완성된 README.md
- CHANGELOG.md (v1.0.0)
- 유효성 검증 통과된 플러그인

---

## 3. 기술 접근

### 경로 변환 전략

기존 에이전트의 참조 경로를 플러그인 구조에 맞게 변환한다:

| 기존 경로 | 플러그인 경로 | 비고 |
|-----------|--------------|------|
| `ref/huni/feature-mapping.md` | `./references/feature-mapping.md` | 플러그인 내 번들 |
| `ref/shopby/shopby_enterprise_docs/` | (외부 참조) | 사용자 프로젝트에 의존 |
| `ref/shopby/shopby-api/` | (외부 참조) | 사용자 프로젝트에 의존 |
| `ref/shopby/aurora-react-skin-guide/` | (외부 참조) | 사용자 프로젝트에 의존 |
| `.claude/skills/innojini-shopby-policy-advisor/` | `./skills/innojini-shopby-policy-advisor/` | 플러그인 내 스킬 |

### 외부 의존성 처리

shopby 공식 문서(API 문서, 어드민 문서, Aurora Skin 가이드)는 용량이 크고 라이선스 문제가 있을 수 있으므로 플러그인에 포함하지 않는다. 대신:

1. 에이전트 프롬프트에 선택적 참조 로직 추가
2. 외부 문서가 없는 경우 번들 데이터만으로 자문 제공
3. 외부 문서 필요 시 설치 안내 메시지 출력

### 스킬 내 `${CLAUDE_SKILL_DIR}` 활용

플러그인 스킬에서 참조 파일 접근 시 `${CLAUDE_SKILL_DIR}` 변수를 활용하여 안정적인 경로 참조를 보장한다.

### 에이전트 내 `${CLAUDE_PLUGIN_ROOT}` 활용

플러그인 에이전트에서 플러그인 루트 디렉토리 참조 시 `${CLAUDE_PLUGIN_ROOT}` 변수를 활용한다.

---

## 4. 아키텍처 설계 방향

### 플러그인 컴포넌트 관계

```
plugin.json (매니페스트)
    │
    ├── commands/policy.md
    │       │
    │       └── 참조 ──→ skills/innojini-shopby-policy-advisor/SKILL.md
    │
    ├── agents/expert-printing-policy.md
    │       │
    │       ├── skills: innojini-shopby-policy-advisor
    │       └── 참조 ──→ references/feature-mapping.md
    │
    ├── skills/innojini-shopby-policy-advisor/
    │       ├── SKILL.md
    │       └── references/
    │           ├── industry-benchmarks.md
    │           └── shopby-capability-matrix.md
    │
    ├── references/
    │       └── feature-mapping.md
    │
    └── templates/
            └── policy-document.md
```

### 데이터 흐름

1. 사용자가 `/policy 배송 정책` 입력
2. `commands/policy.md`가 활성화되어 정책 자문 스킬 참조
3. 스킬이 `references/` 내 벤치마크 및 매트릭스 데이터 로드
4. 기능 분류 (NATIVE/SKIN/CUSTOM/EXTERNAL) 수행
5. 업계 벤치마크 기반 정책 권고사항 생성
6. 구조화된 응답 제공

---

## 5. 위험 요소 및 대응

| 위험 | 영향도 | 대응 |
|------|--------|------|
| 플러그인 내 상대 경로가 설치 환경에서 동작하지 않음 | 높음 | `${CLAUDE_PLUGIN_ROOT}` 변수 활용, 설치 후 경로 테스트 |
| 외부 shopby 문서 부재 시 자문 품질 저하 | 중간 | 번들 데이터 충실화, 외부 문서 안내 메시지 |
| 플러그인 크기가 과도하게 커짐 | 낮음 | 현재 총 ~85KB 수준으로 문제 없음 |
| 에이전트 MCP 도구가 플러그인 환경에서 비활성화 | 중간 | `mcpServers` 프론트매터로 MCP 요구사항 명시 |
| plugin.json 스키마 변경 | 낮음 | Claude Code 공식 문서 추적, 버전별 호환성 테스트 |

---

## 6. 추적성

| TAG | 마일스톤 | 요구사항 |
|-----|----------|----------|
| SPEC-PLUGIN-001 | Primary Goal | REQ-1, REQ-8 |
| SPEC-PLUGIN-001 | Secondary Goal | REQ-3, REQ-6, REQ-9 |
| SPEC-PLUGIN-001 | Tertiary Goal | REQ-2, REQ-7 |
| SPEC-PLUGIN-001 | Final Goal | REQ-4, REQ-5, REQ-10 |
