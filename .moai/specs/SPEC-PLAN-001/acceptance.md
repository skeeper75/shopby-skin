---
id: SPEC-PLAN-001
type: acceptance
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
tags: [planning, policy, roadmap, architecture]
---

# SPEC-PLAN-001 수용 기준

## 시나리오 1: 운영정책 결정 완료

### 1.1 런칭 필수 정책 결정

```gherkin
Given 14개 런칭 필수 운영정책이 미결정 상태일 때
  And 각 정책에 추천안, 선택지, 벤치마크 근거가 제공되어 있을 때
When 운영자가 14개 정책 각각에 대해 추천안을 검토하고 결정하면
Then 모든 런칭 필수 정책이 '결정' 또는 '보류(사유 명시)' 상태가 된다
  And 배송비 6개 정책(무료배송 기준, 배송비 금액, 배너 제외, 혼합주문, 제주, 도서산간)이 확정된다
  And 결제 3개 정책(PG사, 간편결제, PG 수수료)이 확정된다
  And 쿠폰 3개 정책(신규가입, 동시사용, 유효기간)이 확정된다
  And 리뷰 2개 정책(노출 방식, 작성 보상)이 확정된다
```

### 1.2 런칭 후 조정 정책 확인

```gherkin
Given 11개 런칭 후 조정 정책에 추천안이 제시되어 있을 때
When 운영자가 추천안을 검토하면
Then 각 정책이 '추천안 수용', '수정 후 결정', 또는 '런칭 후 검토' 상태가 된다
  And 배치 개발이 필요한 정책(리뷰유도 시점, 재구매 기준, VIP 기준)의 개발 범위가 명확해진다
```

### 1.3 정책 완성도 검증

```gherkin
Given 25개 운영정책 검토가 완료되었을 때
When 정책 완성도를 검증하면
Then 25개 정책 중 미결정 상태가 0건이다
  And 화면설계에 필요한 정책 입력값(배송비 금액, 쿠폰 금액, 적립금 금액 등)이 100% 확보된다
  And shopby 설정만으로 가능한 정책(10개)은 설정 방법이 명시된다
  And 개발이 필요한 정책(15개)은 개발 유형(커스텀/배치/연동)이 분류된다
```

---

## 시나리오 2: 도메인별 SPEC 계획 수립

### 2.1 기능 도메인 분류 확정

```gherkin
Given 88개 기능이 features-data.json에 정의되어 있을 때
When 도메인별 분류를 최종 확정하면
Then 7개 도메인에 88개 기능이 누락 없이 배분된다
  And 각 도메인의 기능 수가 7~18개 범위 내에 있다
  And 각 기능의 shopby 분류(NATIVE/SKIN/CUSTOM/EXTERNAL)가 확정된다
  And 각 기능의 우선순위(P1/P2/P3)가 확정된다
```

### 2.2 후속 SPEC 계획 확정

```gherkin
Given 88개 기능이 도메인별로 분류되었을 때
  And 25개 운영정책 결정이 완료되었을 때
When 후속 SPEC 생성 계획을 확정하면
Then 7개 도메인별 SPEC의 ID(예정), 범위, 우선순위가 정의된다
  And 각 SPEC은 10~18개 기능 범위 내에 있다
  And SPEC 간 기능 중복이 0건이다
  And SPEC 간 의존 관계(회원->주문, 상품->주문 등)가 명확히 정의된다
```

### 2.3 SPEC 접근 전략 확정

```gherkin
Given 7개 후속 SPEC이 정의되었을 때
When 각 SPEC의 접근 전략을 확인하면
Then NATIVE/SKIN 위주 SPEC은 'shopby API 기반' 전략이 명시된다
  And CUSTOM 위주 SPEC은 '인쇄 도메인 리서치 기반' 전략이 명시된다
  And Hybrid SPEC(NATIVE+CUSTOM 혼합)은 두 전략의 적용 범위가 구분된다
  And 각 SPEC의 시작 전 전제 조건(정책 결정, 계약 완료 등)이 명시된다
```

---

## 시나리오 3: CUSTOM 모듈 정의

### 3.1 P1 CUSTOM 모듈 상세 정의

```gherkin
Given 5개 P1 CUSTOM 모듈이 식별되었을 때
  And 인쇄 도메인 리서치(research-printing.md)가 완료되었을 때
When 각 모듈의 상세 정의를 작성하면
Then 모듈별 기능 범위가 문서화된다
  And 모듈별 기술 접근 방식(NestJS BFF, AWS S3, PitStop 등)이 명시된다
  And 모듈별 의존성(주문 프로세스, PG 연동, 상품관리 등)이 명확히 정의된다
  And shopby 외 별도 개발 범위가 명확히 구분된다
  And 각 모듈이 독립 SPEC으로 생성 가능한 수준의 정보를 포함한다
```

### 3.2 CUSTOM 접근 전략 검증

```gherkin
Given 9개 CUSTOM 모듈의 기획이 작성되었을 때
When 각 모듈의 접근 전략을 검증하면
Then 모든 CUSTOM 모듈 기획이 인쇄 도메인 리서치에 기반한다
  And shopby 문서에만 의존한 CUSTOM 기획이 0건이다
  And 경쟁사 벤치마크(레드프린팅, 와우프레스 등) 참조가 포함된다
  And 인쇄 전문 지식(용지/소재, 후가공, 가격 구조)이 반영된다
```

### 3.3 CUSTOM 모듈 규모 검증

```gherkin
Given 9개 CUSTOM 모듈이 정의되었을 때
When 모듈별 개발 규모를 검증하면
Then XL 모듈(3개: 파일 업로드/검수, 종속옵션+가격엔진, 원장관리)의 분할 전략이 수립된다
  And L 모듈(4개)의 구현 범위가 명확하다
  And M 모듈(2개)의 구현 범위가 명확하다
  And 각 모듈의 인력 구성(FE/BE/FE+BE)이 명시된다
```

---

## 시나리오 4: shopby 기반 접근 검증

### 4.1 NATIVE 기능 검증

```gherkin
Given NATIVE 40개 기능이 'shopby 기본 제공'으로 분류되었을 때
When shopby API 및 설정 가능 여부를 검증하면
Then 각 기능별 shopby 구현 방식(설정/API)이 확정된다
  And shopby 관리자에서 직접 설정 가능한 기능 목록이 확정된다
  And shopby API 호출이 필요한 기능의 엔드포인트가 식별된다
  And shopby에서 미지원하는 기능(발견 시)은 SKIN 또는 CUSTOM으로 재분류된다
```

### 4.2 SKIN 기능 검증

```gherkin
Given SKIN 24개 기능이 'shopby API + 커스텀 UI'로 분류되었을 때
When 스킨 커스텀 범위를 검증하면
Then 각 기능의 shopby API 활용 범위와 UI 커스텀 범위가 구분된다
  And Aurora Skin 기존 컴포넌트 활용 가능 항목이 식별된다
  And 신규 스킨 컴포넌트 개발이 필요한 항목이 식별된다
  And CSS 오버라이드가 필요한 항목에 @MX:WARN 대상이 식별된다
```

---

## 시나리오 5: 아키텍처 결정사항 확정

### 5.1 3-Tier Hybrid 전략 확정

```gherkin
Given Hybrid 전략(Aurora Skin + CUSTOM 독립 모듈)이 채택되었을 때
When 아키텍처 결정사항을 문서화하면
Then Tier 1(NATIVE/SKIN): Aurora Skin 기반, shopby Provider, CSS Variables가 명시된다
  And Tier 2(CUSTOM): 독립 모듈, Tailwind CSS + Radix UI, NestJS BFF가 명시된다
  And Tier 3(관리자): Tailwind CSS + shadcn/ui, AdminLayout 독자 체계가 명시된다
  And 각 Tier의 대상 기능 목록과 수량이 확정된다
```

### 5.2 설계 원칙 확정

```gherkin
Given PC-First/Mobile-First 설계 원칙이 수립되었을 때
When 대상 화면을 분류하면
Then 인쇄 특화 화면(상품옵션, 파일업로드, 가격시뮬레이터, 관리자)은 PC-First로 분류된다
  And 일반 쇼핑몰 화면(로그인, 회원가입, 마이페이지, 결제)은 Mobile-First로 분류된다
  And 상품 옵션 선택은 단일 페이지 스크롤 폼(option_NEW) 패턴이 적용된다
  And Step Wizard 방식이 사용되지 않음이 명시된다
```

---

## 시나리오 6: 전체 기획서 완성도 검증

### 6.1 화면설계 입력 정보 완성도

```gherkin
Given SPEC-PLAN-001 기획서가 완성되었을 때
When 화면설계(SPEC-SCREEN-001) 입력 정보 완성도를 측정하면
Then 기능 요구사항 88개가 EARS 형식으로 상세 정의된다 (목표: 100%)
  And 운영정책 25개가 결정 또는 추천안 확정된다 (목표: 100%)
  And CUSTOM 개발 9개가 기능 상세 + 접근 전략이 정의된다 (목표: 100%)
  And 후속 SPEC 7개의 생성 계획이 수립된다 (목표: 100%)
```

### 6.2 문서 간 정합성

```gherkin
Given spec.md, plan.md, acceptance.md 3개 파일이 작성되었을 때
When 문서 간 정합성을 검증하면
Then spec.md의 88개 기능 수와 features-data.json의 기능 수가 일치한다
  And spec.md의 25개 정책과 policies-data.json의 정책이 1:1 대응한다
  And spec.md의 9개 CUSTOM 모듈과 custom-dev-data.json의 모듈이 1:1 대응한다
  And plan.md의 태스크가 spec.md의 모든 모듈을 커버한다
  And acceptance.md의 시나리오가 spec.md의 주요 요구사항을 검증한다
```

---

## Definition of Done

SPEC-PLAN-001이 '완료'되려면 다음 조건을 모두 만족해야 한다:

- [ ] 25개 운영정책 결정 완료 (결정 또는 보류+사유)
- [ ] 88개 기능 도메인 분류 및 우선순위 최종 확정
- [ ] 9개 CUSTOM 모듈 기능 범위 및 접근 전략 정의
- [ ] 7개 후속 SPEC 생성 계획(ID, 범위, 접근 방식) 확정
- [ ] 아키텍처 결정사항 문서화 (3-Tier, 기술 스택, 설계 원칙)
- [ ] 외부 서비스 계약/연동 사항 정리 (PG, 알림톡, 팝빌, PitStop, S3)
- [ ] 문서 간 정합성 검증 통과 (spec/plan/acceptance 일관성)

## 검증 방법

| 항목 | 검증 방법 | 검증 주체 |
|------|----------|----------|
| 정책 결정 완성도 | policies-data.json의 status 필드 전수 확인 | 지니님 |
| 기능 분류 정확도 | features-data.json과 spec.md 교차 검증 | 개발팀 |
| CUSTOM 정의 충분성 | 독립 SPEC 생성 가능 수준인지 검토 | 개발팀 |
| 아키텍처 정합성 | SPEC-SCREEN-001, SPEC-DESIGN-001과 일관성 확인 | 개발팀 |
| 문서 품질 | EARS 형식 준수, Given/When/Then 완성도 | MoAI (manager-spec) |
