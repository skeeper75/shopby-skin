# SPEC-PLUGIN-001: 후니프린팅 정책 자문 플러그인 패키지

- **SPEC ID**: SPEC-PLUGIN-001
- **제목**: 후니프린팅 정책 자문 Claude Code 플러그인 패키지
- **생성일**: 2026-03-15
- **상태**: Planned
- **우선순위**: High
- **담당**: builder-plugin

---

## 1. 개요

기존 shopby.skin 프로젝트에 로컬로만 존재하는 후니프린팅 정책 자문 시스템(스킬, 에이전트, 참조 데이터)을 Claude Code 플러그인 패키지로 변환하여 GitHub 저장소를 통해 팀원들에게 배포 가능하도록 한다.

## 2. 배경

### 현재 상태

후니프린팅 사이트 리뉴얼 프로젝트에서 shopby Enterprise 플랫폼 기반의 정책 자문 시스템이 운영 중이다:

| 에셋 | 위치 | 크기 |
|------|------|------|
| 스킬 (SKILL.md + references) | `.claude/skills/innojini-shopby-policy-advisor/` | ~32KB (3파일) |
| 에이전트 | `.claude/agents/innojini/expert-printing-policy.md` | ~6.6KB |
| IA 기능 매핑 | `ref/huni/feature-mapping.md` | ~29KB (94개 기능) |
| 정책 문서 | `.moai/policies/POLICY-SHIPPING-PAYMENT-REVIEW-*.md` | ~41KB (2파일) |

### 문제점

- 스킬/에이전트가 로컬 프로젝트에만 존재하여 팀원 공유 불가
- 버전 관리 및 업데이트 메커니즘 부재
- 다른 프로젝트에서 사용하려면 수동 복사 필요
- 참조 데이터 경로가 프로젝트 구조에 종속적

### 해결 방향

Claude Code 플러그인 시스템을 활용하여 GitHub 저장소 기반 배포 패키지로 변환한다.

## 3. 환경 (Environment)

- **플랫폼**: Claude Code v2.1.49+
- **플러그인 시스템**: `.claude-plugin/plugin.json` 매니페스트 기반
- **배포 채널**: GitHub 저장소 (`github:innojini/shopby-policy-plugin`)
- **설치 방식**: `/plugin install github:innojini/shopby-policy-plugin`
- **대상 사용자**: shopby Enterprise 기반 인쇄 사이트 개발팀

## 4. 가정 (Assumptions)

- Claude Code 플러그인 시스템이 안정적으로 동작한다
- 플러그인 내 상대 경로로 참조 데이터에 접근 가능하다
- 에이전트의 `skills` 프론트매터를 통해 플러그인 내 스킬 참조가 가능하다
- GitHub public 저장소로 배포하며, 팀원들이 `/plugin install`로 설치할 수 있다
- 기존 shopby 관련 참조 문서(API 문서, 어드민 문서)는 플러그인에 포함하지 않고 사용자 프로젝트에 존재한다고 가정한다

## 5. 요구사항 (Requirements)

### REQ-1: 플러그인 패키지 구조 (Ubiquitous)

시스템은 **항상** 아래의 표준 Claude Code 플러그인 디렉토리 구조를 따라야 한다.

```
innojini-shopby-policy-plugin/
├── .claude-plugin/
│   └── plugin.json          # 플러그인 매니페스트 (유일한 파일)
├── agents/
│   └── expert-printing-policy.md   # 정책 자문 에이전트
├── skills/
│   └── innojini-shopby-policy-advisor/
│       ├── SKILL.md                # 메인 스킬 정의
│       └── references/
│           ├── industry-benchmarks.md      # 한국 인쇄업계 벤치마크
│           └── shopby-capability-matrix.md # shopby 기능 매트릭스
├── commands/
│   └── policy.md             # /policy 슬래시 커맨드
├── references/
│   └── feature-mapping.md    # 94개 IA 기능 매핑
├── templates/
│   └── policy-document.md    # 정책 문서 템플릿
├── README.md
├── CHANGELOG.md
└── LICENSE
```

**핵심 제약**: `.claude-plugin/` 디렉토리에는 `plugin.json`만 존재해야 하며, 모든 컴포넌트는 플러그인 루트에 위치한다.

### REQ-2: 슬래시 커맨드 (Event-Driven)

**WHEN** 팀원이 `/policy` 뒤에 질의를 입력하면,
**THEN** 시스템은 정책 자문 스킬을 활성화하고 다음을 포함한 응답을 제공해야 한다:
- shopby 기능 분류 (NATIVE/SKIN/CUSTOM/EXTERNAL)
- 한국 인쇄업계 벤치마크 데이터
- 정책 권고사항 및 구현 방향

### REQ-3: 에이전트 접근성 (Event-Driven)

**WHEN** 팀원이 expert-printing-policy 에이전트를 호출하면,
**THEN** 시스템은 로컬 버전과 동일한 정책 자문 기능을 제공해야 하며, 플러그인 내 번들된 모든 참조 데이터에 접근 가능해야 한다.

에이전트 요구 기능:
- 13개 정책 도메인 자문
- NATIVE/SKIN/CUSTOM/EXTERNAL 기능 분류
- 업계 벤치마크 기반 권고
- MCP 도구 접근 (Sequential Thinking, Context7)

### REQ-4: 버전 관리 (Ubiquitous)

시스템은 **항상** 다음의 버전 관리 체계를 따라야 한다:
- `plugin.json`의 `version` 필드에 시맨틱 버저닝 적용
- Git 태그를 통한 릴리스 버전 추적
- **WHEN** 새 버전이 출시되면, **THEN** `CHANGELOG.md`에 변경 내역을 기록해야 한다

### REQ-5: 설치 및 업데이트 (Event-Driven)

**WHEN** 팀원이 `/plugin install github:innojini/shopby-policy-plugin`을 실행하면,
**THEN** 시스템은 모든 플러그인 컴포넌트(스킬, 에이전트, 커맨드, 참조 데이터)를 설치해야 한다.

**WHEN** 플러그인이 GitHub에서 업데이트되면,
**THEN** 재설치를 통해 최신 버전을 가져올 수 있어야 한다.

### REQ-6: 참조 데이터 번들링 (Ubiquitous)

시스템은 **항상** 다음의 참조 데이터를 플러그인 패키지 내에 번들링해야 한다:
- `feature-mapping.md`: 94개 IA 기능 매핑 데이터
- `industry-benchmarks.md`: 한국 인쇄업계 벤치마크
- `shopby-capability-matrix.md`: shopby 기능 매트릭스

에이전트와 스킬은 상대 경로를 통해 이 데이터에 접근해야 한다.

### REQ-7: 정책 문서 템플릿 (Optional)

**가능하면** 팀원이 표준화된 정책 문서를 생성할 수 있도록 정책 문서 템플릿을 포함하여 제공한다.

### REQ-8: 경로 이관 (Ubiquitous)

시스템은 **항상** 플러그인 내 모든 파일 참조 경로를 상대 경로로 변환해야 한다:
- 기존: `ref/huni/feature-mapping.md` (프로젝트 종속 절대 경로)
- 변환: `./references/feature-mapping.md` (플러그인 루트 기준 상대 경로)

`plugin.json`의 모든 경로는 `./`로 시작해야 한다.

### REQ-9: 외부 의존성 분리 (State-Driven)

**IF** 플러그인이 설치된 프로젝트에 shopby API 문서, 어드민 문서, Aurora Skin 가이드가 존재하지 않으면,
**THEN** 에이전트는 번들된 참조 데이터만으로 자문을 제공하고, 외부 참조가 필요한 질의에 대해 해당 문서의 위치를 안내해야 한다.

### REQ-10: 보안 및 접근 제어 (Unwanted)

시스템은 다음을 **하지 않아야 한다**:
- 민감한 고객 데이터나 API 키를 플러그인 패키지에 포함
- 프로젝트 외부 파일시스템에 쓰기 작업 수행
- 사용자 동의 없이 외부 서비스에 데이터 전송

## 6. 사양 (Specifications)

### 6.1 plugin.json 매니페스트

```json
{
  "name": "shopby-policy-plugin",
  "description": "shopby Enterprise 기반 인쇄 사이트 정책 자문 플러그인. 13개 정책 도메인 자문, IA 기능 분류(NATIVE/SKIN/CUSTOM/EXTERNAL), 한국 인쇄업계 벤치마크 제공.",
  "version": "1.0.0",
  "author": {
    "name": "innojini"
  },
  "homepage": "https://github.com/innojini/shopby-policy-plugin",
  "repository": "https://github.com/innojini/shopby-policy-plugin.git",
  "license": "MIT",
  "keywords": [
    "shopby",
    "printing",
    "policy",
    "ecommerce",
    "korean-printing",
    "policy-advisor"
  ]
}
```

### 6.2 슬래시 커맨드 구조

`commands/policy.md`:
- `$ARGUMENTS`를 통해 사용자 질의 수신
- 정책 자문 스킬 참조 및 활성화
- 13개 도메인 키워드 기반 자동 분류

### 6.3 에이전트 이관 사항

기존 에이전트에서 변경이 필요한 항목:

| 항목 | 기존 | 플러그인 |
|------|------|----------|
| 참조 경로 | `ref/huni/feature-mapping.md` | `./references/feature-mapping.md` |
| 스킬 경로 | `.claude/skills/innojini-shopby-policy-advisor/` | `./skills/innojini-shopby-policy-advisor/` |
| 외부 문서 | 프로젝트 내 존재 가정 | 선택적 참조 + 안내 메시지 |

### 6.4 기능 분류 체계 (유지)

| 코드 | 이름 | 설명 |
|------|------|------|
| NATIVE | shopby Native | shopby 어드민에서 설정 가능 |
| SKIN | Skin Custom | shopby API 존재, Aurora React 스킨 커스터마이징 필요 |
| CUSTOM | Custom Dev | shopby 미지원, 풀 커스텀 개발 필요 |
| EXTERNAL | External Integration | 외부 서비스 계약 + 연동 필요 |

### 6.5 13개 정책 도메인 (유지)

1. 회원/인증 정책
2. 상품 관리 정책
3. 가격/견적 정책
4. 주문/결제 정책
5. 배송 정책
6. 디자인 시안 관리 정책
7. 게시판/커뮤니티 정책
8. 쿠폰/프로모션 정책
9. 검색/SEO 정책
10. 모바일 최적화 정책
11. 고객 서비스 정책
12. 데이터/분석 정책
13. 보안/규정 준수 정책

## 7. 추적성 (Traceability)

| TAG | 설명 |
|-----|------|
| SPEC-PLUGIN-001 | 본 SPEC 문서 |
| REQ-1 ~ REQ-10 | 요구사항 10개 |

### 관련 에셋

- `.claude/agents/innojini/expert-printing-policy.md` - 원본 에이전트
- `.claude/skills/innojini-shopby-policy-advisor/` - 원본 스킬
- `ref/huni/feature-mapping.md` - 원본 기능 매핑
- `.moai/policies/POLICY-SHIPPING-PAYMENT-REVIEW-*.md` - 정책 문서 참고

### 전문가 자문 권고

- **builder-plugin**: 플러그인 패키지 구조 및 매니페스트 작성에 대한 전문 자문 권고
- **expert-frontend**: 슬래시 커맨드 UX 설계에 대한 자문 권고 (선택적)
