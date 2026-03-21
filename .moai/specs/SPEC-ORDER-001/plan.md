---
id: SPEC-ORDER-001
artifact: plan
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (manager-spec)
status: draft
---

# SPEC-ORDER-001: 구현 계획서

> A6B8-ORDER 주문관리 도메인 구현 전략

---

## 1. 구현 개요

### 1.1 범위

후니프린팅 shopby Enterprise 기반 주문관리 도메인의 15개 기능을 6개 모듈로 나누어 구현한다. shopby NATIVE/SKIN Provider와 CUSTOM 개발을 혼합하는 Hybrid 전략을 따르며, 인쇄 도메인 특화 기능(파일 업로드/검수, 공정 상태 트래킹)은 자체 BFF(Backend For Frontend)를 통해 구현한다.

### 1.2 접근 방식

- **Hybrid Tier 전략**: Tier 1(NATIVE/SKIN)으로 배송/결제/주문완료 처리, Tier 2(CUSTOM)로 파일/검수/후불/SMS 처리
- **BFF 패턴**: 인쇄 특화 로직(파일 검증, 공정 상태)은 별도 BFF API 서버를 통해 shopby API와 외부 서비스(PitStop, S3, 알림톡)를 오케스트레이션
- **PC 우선 설계**: 인쇄 파일 업로드 특성상 PC 환경 최적화, 모바일은 주문조회/상태확인 중심
- **shopby Provider 최대 활용**: 배송, 결제, 주문완료 등 표준 프로세스는 shopby Provider로 처리

### 1.3 개발 방법론

DDD (ANALYZE-PRESERVE-IMPROVE) 방식 적용. shopby 기존 주문/결제 Provider 코드를 보존하면서 인쇄 특화 기능을 점진적으로 추가한다.

---

## 2. 아키텍처 결정사항

### 2.1 Hybrid Tier 배치

| Tier | 해당 기능 | 구현 방식 |
|------|----------|----------|
| Tier 1 (NATIVE) | 배송정보, 배송지목록, 주문완료, 메일발송 | shopby Provider 활용 |
| Tier 1 (SKIN) | 보관함/장바구니, 주문관리 목록, 주문서출력, 상태변경, 증빙서류 | shopby API + 스킨 커스텀 |
| Tier 1 (EXTERNAL) | 결제하기 (KG이니시스) | shopby 결제 모듈 + PG 연동 |
| Tier 2 (CUSTOM) | 파일업로드/검수, 파일확인처리, 재업로드요청, 후불결제, 고객SMS | 자체 BFF + 외부 서비스 연동 |

### 2.2 BFF 서버 설계

- **역할**: shopby API, PitStop Server, AWS S3, 카카오 알림톡, 팝빌 API 오케스트레이션
- **기술 스택**: Node.js (Next.js API Routes 또는 Express)
- **주요 엔드포인트**:
  - `/api/files/upload` - 파일 업로드 (S3 Presigned URL 발급)
  - `/api/files/validate` - PitStop 검증 요청/결과 조회
  - `/api/orders/status` - 인쇄 공정 상태 관리 (커스텀 상태 코드)
  - `/api/notifications/send` - 알림톡/SMS 통합 발송
  - `/api/b2b/deferred-payment` - 후불결제 관리

### 2.3 파일 스토리지 전략

- **업로드 경로**: Client -> BFF (Presigned URL 발급) -> S3 Direct Upload
- **보관 정책**: 주문 파일은 주문 완료 후 1년 보관, 보관함 파일은 30일 보관
- **접근 제어**: S3 Presigned URL (15분 만료), IAM 역할 기반 접근

### 2.4 상태 매핑 전략

| shopby 기본 상태 | 인쇄 커스텀 상태 | 설명 |
|-----------------|----------------|------|
| 입금확인 | ORDER_RECEIVED | 주문 접수 |
| 상품준비중 | FILE_CHECKING | 파일 확인 중 |
| 상품준비중 | PRINT_READY | 인쇄 준비 |
| 배송준비중 | PRINTING | 인쇄 중 |
| 배송준비중 | POST_PROCESSING | 후가공 |
| 배송준비중 | PACKAGING | 포장 |
| 배송중 | SHIPPED | 출고 |
| 배송완료 | DELIVERING | 배송 중 |

---

## 3. 구현 마일스톤

### Phase 1 (Primary): 핵심 주문 플로우

**목표**: 기본 주문-결제-완료 플로우 동작

| TAG | 기능 | 모듈 | Tier | 관련 REQ |
|-----|------|------|------|---------|
| TAG-ORDER-001 | 배송정보입력 | 배송/결제 | NATIVE | REQ-ORDER-020~027 |
| TAG-ORDER-002 | 결제하기 (KG이니시스) | 배송/결제 | EXTERNAL | REQ-ORDER-028~031 |
| TAG-ORDER-003 | 주문완료 + 알림 | 배송/결제 | NATIVE | REQ-ORDER-032~034 |
| TAG-ORDER-004 | 주문관리 기본 (목록/상세) | 주문관리 | SKIN | REQ-ORDER-036~038 |

### Phase 2 (Primary): 인쇄 파일 시스템

**목표**: 파일 업로드/검수 파이프라인 구축

| TAG | 기능 | 모듈 | Tier | 관련 REQ |
|-----|------|------|------|---------|
| TAG-ORDER-005 | 파일 업로드 모듈 | 파일 업로드 | CUSTOM | REQ-ORDER-001~005, REQ-ORDER-013 |
| TAG-ORDER-006 | PitStop 검증 연동 | 파일 업로드 | CUSTOM | REQ-ORDER-006~009, REQ-ORDER-012 |
| TAG-ORDER-007 | 관리자 파일확인처리 | 파일확인 | CUSTOM | REQ-ORDER-044~050 |

### Phase 3 (Primary): 주문 운영

**목표**: 관리자 주문 운영 기능 완성

| TAG | 기능 | 모듈 | Tier | 관련 REQ |
|-----|------|------|------|---------|
| TAG-ORDER-008 | 주문상태변경 + 알림 | 주문관리 | SKIN | REQ-ORDER-039~041 |
| TAG-ORDER-009 | 보관함/재주문 | 보관함 | SKIN+CUSTOM | REQ-ORDER-014~019 |
| TAG-ORDER-010 | 주문서출력 | 주문관리 | SKIN | REQ-ORDER-042 |
| TAG-ORDER-011 | 고객 SMS 발송 | SMS | CUSTOM | REQ-ORDER-057~059 |

### Phase 4 (Secondary): 확장 기능

**목표**: B2B 후불결제, 증빙서류

| TAG | 기능 | 모듈 | Tier | 관련 REQ |
|-----|------|------|------|---------|
| TAG-ORDER-012 | 후불결제 시스템 | 후불결제 | CUSTOM | REQ-ORDER-051~054 |
| TAG-ORDER-013 | 증빙서류발급 (팝빌) | 증빙 | SKIN | REQ-ORDER-055~056 |
| TAG-ORDER-014 | PDF 템플릿/가이드라인 | 파일 업로드 | CUSTOM | REQ-ORDER-010~011 |

---

## 4. 기술 스택 결정

### 4.1 프론트엔드

| 항목 | 기술 | 용도 |
|------|------|------|
| UI 프레임워크 | React (Aurora Skin 기반) | 기존 코드베이스 유지 |
| 파일 업로드 | react-dropzone + S3 multipart | 드래그앤드롭, 대용량 지원 |
| 결제 모듈 | shopby 결제 Provider + KG이니시스 SDK | PG 연동 |
| 상태관리 | shopby Provider + React Context | 인쇄 상태 관리 |

### 4.2 BFF (Backend For Frontend)

| 항목 | 기술 | 용도 |
|------|------|------|
| 런타임 | Node.js (Next.js API Routes) | BFF 서버 |
| 파일 스토리지 | AWS S3 + Presigned URL | 인쇄 파일 저장 |
| 파일 검증 | PitStop Server REST API | PDF 프리플라이트 |
| 알림 | 카카오 알림톡 API + SMS API | 고객 알림 |
| 증빙 | 팝빌 API | 세금계산서/현금영수증 |

### 4.3 외부 서비스

| 서비스 | 용도 | 연동 방식 |
|--------|------|----------|
| KG이니시스 | PG 결제 | shopby 결제 모듈 경유 |
| 네이버페이 | 간편결제 | shopby 결제 모듈 경유 |
| PitStop Server | PDF 프리플라이트 | REST API / Hot Folder |
| AWS S3 | 인쇄 파일 저장 | AWS SDK + Presigned URL |
| 카카오 알림톡 | 고객 알림 | 비즈메시지 API |
| 팝빌 | 전자세금계산서 | Popbill API |

---

## 5. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|-------|----------|
| PitStop 라이선스 비용 | 높음 | 자체 PDF 파싱(pdf-lib) 대안 검토, MVP는 수동 검수 fallback |
| 대용량 파일 업로드 타임아웃 | 중간 | S3 multipart upload + 이어받기 구현 |
| shopby 상태와 인쇄 상태 동기화 실패 | 높음 | 이벤트 기반 동기화 + 불일치 감지 배치 |
| KG이니시스 PG 계약 지연 | 높음 | 테스트 환경 선 구축, 실결제는 계약 후 전환 |
| 알림톡 대량 발송 지연 | 낮음 | 발송 큐 도입, 실패 시 SMS 자동 폴백 |
| 후불결제 미수금 관리 | 중간 | 거래처 등급제 + 미결제 한도 설정 |

---

## 6. 전문가 자문 권장사항

### 6.1 expert-backend 자문 필요

- BFF 아키텍처 설계 (shopby API + PitStop + S3 오케스트레이션)
- 파일 업로드 파이프라인 (S3 multipart, Presigned URL, 이어받기)
- 인쇄 공정 상태 머신 설계 (shopby 상태 매핑 전략)
- 알림톡/SMS 통합 발송 모듈

### 6.2 expert-frontend 자문 필요

- 파일 업로드 UI/UX (드래그앤드롭, 프로그레스, 검증 결과 표시)
- 주문서 작성 플로우 (옵션 선택 -> 파일 업로드 -> 배송 -> 결제)
- 관리자 주문관리 대시보드 레이아웃

### 6.3 expert-devops 자문 필요

- AWS S3 버킷 구성 및 IAM 정책
- PitStop Server 인프라 배포
- 알림톡 발송 큐 인프라
