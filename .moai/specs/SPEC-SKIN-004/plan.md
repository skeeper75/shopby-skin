# SPEC-SKIN-004 v2: 고객센터/정보/마케팅 디자인시스템 마이그레이션 - 구현 계획

> **SPEC ID**: SPEC-SKIN-004
> **버전**: 2.0.0

---

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 구현 계획 |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 마이그레이션 계획 재작성 |

---

## 1. 마일스톤

### Primary Goal: 토큰 및 공통 컴포넌트 전환

- `--po-*` -> `--huni-*` 토큰 전환 (전체 파일)
- `<hr>` -> `Divider` 전환
- lucide 직접 import -> `Icon` 전환
- 커스텀 로딩 스피너 -> `Skeleton` 전환
- 기존 295 테스트 통과 확인

### Secondary Goal: 폼/피드백 컴포넌트 전환

- `<input>` 직접 사용 -> `TextField` 전환
- label+input 조합 -> `Field` 전환
- alert/toast -> `Snackbar` 전환
- InquiryForm 내부 요소 마이그레이션

### Final Goal: 네비게이션 컴포넌트 전환

- 커스텀 탭 UI -> `Tabs` 전환 (FAQ, 공지사항)
- 커스텀 페이지네이션 -> `Pagination` 전환 (공지사항)
- 전체 회귀 테스트 최종 확인

---

## 2. 기술적 접근

### 2.1 마이그레이션 전략

- **방식**: 파일 단위 순차 대체 (한 파일씩 변환 후 테스트)
- **원칙**: 기능 변경 없이 컴포넌트만 대체 (behavior preservation)
- **검증**: 각 파일 변환 후 관련 테스트 실행

### 2.2 파일별 변환 순서

| 순서 | 대상 파일/컴포넌트 | 대체 내용 | 영향 테스트 |
|------|-------------------|-----------|------------|
| 1 | 전체 CSS 파일 | `--po-*` -> `--huni-*` | 전체 |
| 2 | 공통 유틸 | lucide -> Icon | 전체 |
| 3 | 레이아웃 컴포넌트 | `<hr>` -> Divider | 전체 |
| 4 | 로딩 컴포넌트 | 커스텀 스피너 -> Skeleton | 관련 페이지 |
| 5 | InquiryForm | input -> TextField, label+input -> Field | InquiryForm.test.jsx |
| 6 | GuestOrderPage | input -> TextField + Field | GuestOrderPage.test.jsx |
| 7 | NoticePage | 탭 -> Tabs, 페이지네이션 -> Pagination | NoticePage.test.jsx |
| 8 | FAQPage | 탭 -> Tabs | FAQPage.test.jsx |
| 9 | 피드백 시스템 | alert/toast -> Snackbar | 관련 페이지 |

### 2.3 아키텍처 유지

기존 아키텍처 변경 없음:
- `src/components/` 디렉토리 구조 유지
- `src/pages/` 라우팅 구조 유지
- InquiryForm type prop 분기 패턴 유지
- LandingTemplate 템플릿 패턴 유지
- GuideDetail guideId 동적 라우팅 유지

---

## 3. 리스크

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| Tabs 컴포넌트 API 차이로 기존 테스트 실패 | Medium | Tabs props를 기존 동작에 맞춰 매핑, 테스트 선수정 |
| Snackbar 훅 패턴이 기존 토스트와 상이 | Low | useSnackbar hook 어댑터 작성 |
| CSS 토큰 전환 시 시각적 차이 | Low | 토큰값이 동일 색상 매핑 확인 후 일괄 치환 |
| TextField multiline과 기존 Textarea 호환성 | Low | autoResize 속성 활용 |

---

## 4. 의존성

| 의존성 | 상태 | 비고 |
|--------|------|------|
| SPEC-DS-006 (Huni Design System v2) | 완성 | 14개 컴포넌트 + 4개 유틸리티 |
| SPEC-SKIN-004 v1 (기존 구현) | 완료 | 14/14 IA, 295 tests |
| `--huni-*` 토큰 정의 | 완성 | SPEC-DS-006 토큰 체계 |

---

## 5. 관련 트레이서빌리티 태그

- SPEC-SKIN-004
- SPEC-DS-006
- POLICY-A4B5-CS
- POLICY-A7A8-CONTENT
- POLICY-A9-MARKETING
