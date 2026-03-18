# SPEC-SKIN-005 v2: 관리자 기반/주문관리 디자인시스템 마이그레이션 - 구현 계획

> **SPEC ID**: SPEC-SKIN-005
> **버전**: 2.0.0

---

## HISTORY

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2026-03-14 | 초기 구현 계획 |
| 2.0.0 | 2026-03-17 | Huni 디자인시스템 마이그레이션 + 백엔드 연동 계획 재작성 |

---

## 1. 마일스톤

### Primary Goal: 토큰/공통 컴포넌트 전환 + 관리자 인증 연동

- `--po-*` -> `--huni-*` 토큰 전환 (전체 관리자 파일)
- `<hr>` -> `Divider`, lucide -> `Icon` 전환
- 커스텀 로딩 -> `Skeleton` 전환
- 커스텀 토글 -> `Switch` 전환
- 관리자 인증 API 연동 (JWT, RBAC 4단계)
- 관리자 등록/관리 API 연동

### Secondary Goal: 핵심 주문관리 마이그레이션 + API 연동

- shadcn Dialog -> Huni `Dialog` 전환
- `<input>` -> `TextField`, label+input -> `Field` 전환
- shadcn Badge -> Huni `Chip` (주문 상태 뱃지) 전환
- alert/toast -> `Snackbar` 전환
- 주문 목록 API 연동 (검색/필터/페이징)
- 주문 상세 API 연동
- 파일검수 워크플로우 API 연동 (자동+수동)
- 주문상태변경 API 연동 (단건/일괄) + 알림톡

### Final Goal: 부가 기능 마이그레이션 + 나머지 API

- shadcn Tabs -> Huni `Tabs` 전환
- 커스텀 페이지네이션 -> Huni `Pagination` 전환
- 후불결제 API 연동
- 증빙서류 API 연동
- SMS/알림톡 발송 API 연동 (NHN Cloud)
- 주문서 출력 (PDF)
- Excel 다운로드 기능
- 테스트 커버리지 85% 달성

---

## 2. 기술적 접근

### 2.1 마이그레이션 전략

- **UI 마이그레이션**: 파일 단위 순차 대체, 각 단계 테스트 검증
- **API 연동**: Mock -> 실제 API 전환, 인터페이스 유지
- **원칙**: UI 마이그레이션과 API 연동을 병행하되, 독립적으로 진행 가능한 구조

### 2.2 파일별 변환 순서

| 순서 | 대상 | 대체 내용 | 비고 |
|------|------|-----------|------|
| 1 | 전체 CSS | `--po-*` -> `--huni-*` | 토큰 일괄 치환 |
| 2 | 공통 유틸 | lucide -> Icon, hr -> Divider | 전체 영향 |
| 3 | useAdminAuth | Mock -> JWT 인증 API | RBAC 4단계 |
| 4 | AdminSidebar | 내부 요소 Switch/Icon 대체 | 레이아웃 |
| 5 | 로딩 컴포넌트 | 커스텀 -> Skeleton | 전체 |
| 6 | StatusBadge | shadcn Badge -> Chip | 상태 뱃지 |
| 7 | SearchBar | shadcn Input -> TextField | 검색 |
| 8 | OrderDetailPanel | shadcn Dialog -> Dialog + Tabs | 주문 상세 |
| 9 | FilePreview | shadcn Dialog -> Dialog | 파일 미리보기 |
| 10 | SMSDialog | shadcn Dialog -> Dialog + TextField + Field | SMS 발송 |
| 11 | BulkActionBar | alert -> Snackbar | 일괄 처리 피드백 |
| 12 | 페이지네이션 | 커스텀 -> Pagination | 목록 페이지 |
| 13 | API 연동 | Mock -> 실제 API | 14개 엔드포인트 |

### 2.3 백엔드 API 연동 계획

| API | Mock 상태 | 연동 대상 | 비고 |
|-----|-----------|-----------|------|
| POST /admin/login | Mock JWT | Shopby Admin 또는 Custom | RBAC 4단계 |
| GET/POST /admin/members | Mock 배열 | Custom API | 관리자 CRUD |
| GET /admin/orders | Mock 배열 | Shopby Admin API | 필터/검색/페이징 |
| GET /admin/orders/{no} | Mock 객체 | Shopby Admin API | 주문 상세 |
| PUT /admin/orders/{no}/status | Mock 응답 | Shopby Admin API | 상태 변경 |
| PUT /admin/orders/batch-status | Mock 응답 | Shopby Admin API | 일괄 변경 |
| PUT /admin/orders/{no}/file-check | Mock 응답 | Custom API | 파일 검수 |
| GET /admin/orders/{no}/print | Mock HTML | Custom API | 주문서 출력 |
| GET /admin/orders/deferred-payment | Mock 배열 | Custom API | 후불결제 |
| PUT /admin/orders/{no}/payment | Mock 응답 | Custom API | 후불결제 처리 |
| GET /admin/receipts | Mock 배열 | Custom API | 증빙 목록 |
| PUT /admin/receipts/{id}/issue | Mock 응답 | Custom API | 증빙 발급 |
| POST /admin/sms/send | Mock 응답 | NHN 알림톡 API | SMS 발송 |
| POST /admin/orders/{no}/reupload | Mock 응답 | Custom API | 재업로드 요청 |

### 2.4 아키텍처 변경

```
src/components/admin/    -- 기존 유지, 내부 컴포넌트 대체
src/pages/admin/         -- 기존 유지, API 연동 추가
src/hooks/useAdminAuth.js -- Mock -> 실제 JWT 인증
src/services/admin/      -- 신규: API 서비스 레이어
src/router/index.js      -- 기존 유지, RBAC 가드 강화
src/__tests__/admin/     -- 신규: 테스트 파일
```

---

## 3. 리스크

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| Shopby Admin API 미지원 기능 | High | Custom API로 대체 개발 |
| NHN 알림톡 API 연동 복잡도 | Medium | SMS fallback 준비, 단계적 연동 |
| RBAC 권한 체계 미확정 사항 | Medium | POLICY-B1-ADMIN 추천안 기반 구현, 추후 조정 |
| 파일검수 자동화 엔진 부재 | Medium | 1차 수동검수만, 자동검수는 2차 |
| 테스트 커버리지 0% -> 85% 달성 | Medium | 핵심 기능 우선 테스트, 점진적 확대 |
| Chip 컴포넌트 상태 매핑 | Low | 11단계 -> 고객 9단계 매핑 테이블 활용 |

---

## 4. 의존성

| 의존성 | 상태 | 비고 |
|--------|------|------|
| SPEC-DS-006 (Huni Design System v2) | 완성 | 14개 컴포넌트 + 4개 유틸리티 |
| SPEC-SKIN-005 v1 (기존 프로토타입) | 완료 | 9/9 IA UI, 31파일 |
| POLICY-B1-ADMIN | 작성중 | RBAC 4단계, 일부 미결정 사항 |
| POLICY-A6B8-ORDER | 작성 완료 | 11단계 상태, 11종 알림톡 |
| Shopby Admin API | 확인 필요 | API 가용성 및 범위 확인 |
| NHN 알림톡 API | 확인 필요 | API 키 발급 및 템플릿 등록 |

---

## 5. 관련 트레이서빌리티 태그

- SPEC-SKIN-005
- SPEC-DS-006
- POLICY-B1-ADMIN
- POLICY-A6B8-ORDER
