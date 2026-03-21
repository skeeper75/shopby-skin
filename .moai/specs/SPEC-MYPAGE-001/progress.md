## SPEC-MYPAGE-001 Progress

- Started: 2026-03-20
- Scope: 16 features, 7 modules + Account module (MEMBER 연계)
- Development Mode: DDD (ANALYZE-PRESERVE-IMPROVE)
- Approach: Hybrid (NATIVE/SKIN + CUSTOM 2개)

### Phase 2: 기능분석 (완료)
- spec.md: 45개 EARS 요구사항 (7개 모듈 + 회원계정)
- requirements-analysis.md: 9개 KD 상세 분석 (3개 확정, 6개 미결정)
- plan.md: 13개 TAG 구현 계획 (5 Phase)
- acceptance.md: 21개 수용 기준
- screens.md: 26개 화면 인벤토리 (P1 16개 + P2 10개)
- interactions.md: 4개 상태머신, 25+ 조건부 규칙
- api-mapping.md: 33개 API 매핑 (NATIVE 15 + CUSTOM 12 + 파일 1 + MEMBER 5)

### 확정 정책 반영
- KD-MYP-03: 리뷰 보상 적립금 텍스트 1,000원 / 포토 2,000원 (확정)
- KD-MYP-06: 적립금 즉시 자동지급 (확정)
- KD-MYP-07: 삭제 시 자동 회수 (확정)
- 쿠폰: 동시사용 상품1+주문1, 유효기간 30일 (확정)

### CUSTOM 모듈 (자체 개발)
1. 주문상세 편집 미리보기 (썸네일 이미지)
2. 프린팅머니 충전 (PG 결제 -> shopby 적립금 전환)

### 외부 연동
- 팝빌 API: 세금계산서/현금영수증 발급
- PG사 (이니시스): 프린팅머니 충전 결제

### 의존 SPEC
- SPEC-MEMBER-001: 인증/프로필/탈퇴 (확정, 활용)
- SPEC-ORDER-001: 주문 데이터 (미정, shopby API 선행)
- SPEC-PAYMENT-001: PG 결제 모듈 (미정, Mock 선행)

### 다음 단계
- Phase 3: 화면설계 (와이어프레임)
- Phase 4: Pencil .pen 디자인
- Phase 5: /moai run SPEC-MYPAGE-001 (DDD 구현)
