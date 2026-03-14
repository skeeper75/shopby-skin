# SPEC-SKIN-005: 관리자 기반/주문관리 - 구현 계획

> **SPEC ID**: SPEC-SKIN-005

## 1. 마일스톤

### Primary Goal: 관리자 기반 + 주문 목록
- 관리자 레이아웃 (사이드바 + 헤더 + 대시보드)
- 관리자 로그인/권한 시스템
- 주문 목록 DataTable (검색/필터/페이징)
- 주문 상세 패널

### Secondary Goal: 주문 운영
- 파일확인/미리보기
- 주문상태변경 (단건/일괄) + SMS 연동
- 주문서 인쇄

### Final Goal: 부가 관리
- 후불결제 관리
- 증빙서류발급 관리
- SMS/알림톡 발송

## 2. 기술적 접근
- 관리자 레이아웃: shadcn/ui의 Sidebar + Sheet 활용
- DataTable: TanStack Table + shadcn/ui Table 조합
- PDF 뷰어: react-pdf 또는 iframe 기반

## 3. 리스크

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| 관리자 백엔드 API 부재 | High | Shopby Admin API 활용 가능 여부 확인 |
| NHN 알림톡 연동 | Medium | SMS fallback 준비 |
