---
id: SPEC-MEMBER-001
version: "1.0.0"
status: draft
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI
priority: P1
issue_number: 0
---

# SPEC-MEMBER-001: A1A2-MEMBER 로그인/회원 도메인

> 후니프린팅 shopby Enterprise 기반 회원 인증/관리 시스템 (18개 기능, 4개 모듈)

---

## HISTORY

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2026-03-20 | MoAI (manager-spec) | 초기 SPEC 작성 - 4개 모듈, 18개 기능 정의 |

---

## 1. 개요

### 1.1 목적

후니프린팅 shopby Enterprise 마이그레이션에서 로그인/회원(A1A2-MEMBER) 도메인의 전체 기능을 정의한다. 이메일 기반 인증, SNS 로그인, 회원가입, 회원관리, 관리자 회원운영 기능을 포괄하며, shopby NATIVE Provider를 최대한 활용하는 Tier 1 중심 구현 전략을 따른다.

### 1.2 범위

- **포함**: 일반 로그인, SNS 로그인(카카오/네이버), 아이디/비밀번호 찾기, 회원가입(약관~완료), 비회원 주문, 회원등급, 관리자 회원운영(탈퇴/쿠폰/프린팅머니)
- **제외**: 구글/애플 OAuth(P2 별도 SPEC), PG 결제 연동(SPEC-PAYMENT), 배송지 관리(SPEC-MYPAGE)

### 1.3 SPEC-PLAN-001과의 관계

본 SPEC은 SPEC-PLAN-001 v1.1.0 마스터 기획서의 A1A2-MEMBER 도메인 정책을 구현 수준으로 구체화한 문서이다. 정책 체크리스트의 A-1-1 ~ A-2-5, B-6-1 ~ B-6-4 항목을 포괄한다.

---

## 2. 핵심 의사결정 요약

| KD ID | 항목 | 권장 결정 | 근거 요약 | 상태 |
|-------|------|----------|----------|------|
| KD-01 | 로그인 식별자 | 이메일 방식 | B2B/B2C 기억 부담 감소, SNS 연동 용이 | 확정 |
| KD-02 | 아이디 찾기 노출 | 마스킹 + 이메일 발송 옵션 | 개인정보 보호 + 고객 편의 양립 | 확정 |
| KD-03 | 비밀번호 찾기 | 이메일 재설정 링크 | OWASP 권장, SMS 비용 절감 | 확정 |
| KD-04 | 14세 확인 | 체크박스 사용 | 정보통신망법 제31조 준수 | 확정 |
| KD-05 | 가입 필드 | 이메일+비밀번호+이름+휴대전화 필수 | 가입 장벽 최소화 | 확정 |
| KD-06 | 휴대전화 인증 | SMS 인증번호 | 초기 비용 최소화, PASS는 P2 검토 | 확정 |
| KD-07 | 비회원 주문 | 제한적 허용 (굿즈만) | 인쇄물은 파일관리 필요로 회원 필수 | 확정 |
| KD-08 | 회원등급 | 4단계 (일반/실버/골드/VIP) | 관리 복잡성과 고객 인지도 균형 | 확정 |

> KD-01~08 전체 확정 (2026-03-20). 상세 분석은 `requirements-analysis.md` 참조.

---

## 3. EARS 요구사항

### 3.1 모듈 1: 인증 (Authentication) - 5개 기능

#### REQ-MEMBER-001 [Ubiquitous] 이메일 인증 기본 원칙

시스템은 항상 이메일+비밀번호 조합으로 사용자를 인증해야 한다.

#### REQ-MEMBER-002 [Ubiquitous] JWT 토큰 발급

시스템은 항상 인증 성공 시 JWT accessToken(30분)과 refreshToken을 발급해야 한다.

#### REQ-MEMBER-003 [Ubiquitous] 비밀번호 평문 저장 금지

시스템은 비밀번호를 평문으로 저장하지 않아야 한다.

#### REQ-MEMBER-004 [Ubiquitous] HTTPS 전송

시스템은 항상 HTTPS를 통해 인증 데이터를 전송해야 한다.

#### REQ-MEMBER-005 [Event-Driven] 정상 로그인

WHEN 사용자가 올바른 이메일과 비밀번호를 입력하고 로그인 버튼을 클릭하면 THEN 시스템은 accessToken과 refreshToken을 발급하고 메인 페이지로 이동해야 한다.

#### REQ-MEMBER-006 [Event-Driven] 로그인 실패 메시지

WHEN 사용자가 잘못된 이메일 또는 비밀번호를 입력하면 THEN 시스템은 "이메일 또는 비밀번호가 일치하지 않습니다" 오류 메시지를 표시해야 한다.

#### REQ-MEMBER-007 [Event-Driven] 로그인 실패 잠금

WHEN 로그인 실패가 5회 누적되면 THEN 시스템은 해당 계정을 일시적으로 잠금 처리하고 잠금 해제 시간(30분)을 안내해야 한다.

#### REQ-MEMBER-008 [Event-Driven] 자동 로그인

WHEN 자동 로그인 체크박스를 선택하고 로그인하면 THEN 시스템은 refreshToken을 localStorage에 저장하여 세션 만료 후에도 자동 갱신해야 한다.

#### REQ-MEMBER-009 [Event-Driven] 토큰 자동 갱신

WHEN accessToken이 만료되면 THEN 시스템은 refreshToken으로 자동으로 accessToken을 갱신해야 한다.

#### REQ-MEMBER-010 [Event-Driven] 로그아웃

WHEN 로그아웃 버튼을 클릭하면 THEN 시스템은 토큰을 삭제하고 로그인 페이지로 이동해야 한다.

#### REQ-MEMBER-011 [State-Driven] 잠금 상태 로그인 거부

IF 계정이 잠금 상태이면 THEN 시스템은 로그인을 거부하고 잠금 해제 시간을 표시해야 한다.

#### REQ-MEMBER-012 [State-Driven] 로그인 상태 리다이렉트

IF 로그인된 상태에서 로그인 페이지에 접근하면 THEN 시스템은 메인 페이지로 리다이렉트해야 한다.

#### REQ-MEMBER-013 [Unwanted] 계정 열거 공격 방지

시스템은 로그인 실패 시 이메일 존재 여부를 노출하지 않아야 한다.

#### REQ-MEMBER-014 [Unwanted] 비밀번호 URL 전달 금지

시스템은 비밀번호를 URL 파라미터로 전달하지 않아야 한다.

#### REQ-MEMBER-015 [Unwanted] 토큰 보안 저장

시스템은 accessToken을 httpOnly 없이 쿠키에 저장하지 않아야 한다.

#### REQ-MEMBER-016 [Event-Driven] 아이디 찾기 조회

WHEN 사용자가 이름과 휴대전화번호를 입력하고 확인 버튼을 클릭하면 THEN 시스템은 일치하는 이메일을 마스킹하여 표시해야 한다 (예: ab***@naver.com).

#### REQ-MEMBER-017 [Event-Driven] 아이디 찾기 이메일 발송

WHEN 마스킹된 이메일이 표시된 상태에서 "이메일 전체 발송" 버튼을 클릭하면 THEN 시스템은 해당 이메일로 전체 이메일 주소를 발송해야 한다.

#### REQ-MEMBER-018 [Event-Driven] 아이디 찾기 실패

WHEN 입력한 이름+휴대전화 조합에 해당하는 계정이 없으면 THEN 시스템은 "일치하는 계정을 찾을 수 없습니다" 메시지를 표시해야 한다.

#### REQ-MEMBER-019 [Unwanted] 아이디 찾기 반복 차단

시스템은 존재하지 않는 계정 조회를 5회 이상 반복할 경우 일시적으로 해당 IP의 요청을 차단해야 한다.

#### REQ-MEMBER-020 [Event-Driven] 비밀번호 재설정 링크 발송

WHEN 사용자가 이메일, 이름, 휴대전화를 입력하고 재설정 링크 발송 버튼을 클릭하면 THEN 시스템은 해당 이메일로 비밀번호 재설정 링크를 발송해야 한다.

#### REQ-MEMBER-021 [Event-Driven] 비밀번호 재설정 페이지

WHEN 비밀번호 재설정 링크를 클릭하면 THEN 시스템은 새 비밀번호 입력 화면을 표시해야 한다.

#### REQ-MEMBER-022 [Event-Driven] 재설정 링크 재발송 제한

WHEN 재설정 링크 발송 후 1분 이내에 재발송 버튼을 클릭하면 THEN 시스템은 "1분 후에 다시 시도해주세요" 메시지를 표시하고 발송을 차단해야 한다.

#### REQ-MEMBER-023 [State-Driven] 재설정 링크 만료

IF 비밀번호 재설정 링크가 24시간 경과하면 THEN 시스템은 해당 링크를 만료 처리하고 재발송을 안내해야 한다.

#### REQ-MEMBER-024 [State-Driven] 재설정 링크 재사용 차단

IF 재설정 링크가 이미 사용된 경우 THEN 시스템은 "이미 사용된 링크입니다" 오류를 표시해야 한다.

#### REQ-MEMBER-025 [Event-Driven] 카카오 로그인 시작

WHEN 카카오 로그인 버튼을 클릭하면 THEN 시스템은 카카오 OAuth 인증 페이지로 이동해야 한다.

#### REQ-MEMBER-026 [Event-Driven] SNS 인증 콜백 처리

WHEN 카카오/네이버 인증 완료 후 콜백을 받으면 THEN 시스템은 기존 계정 연동 여부를 확인하고 자동 로그인 처리해야 한다.

#### REQ-MEMBER-027 [Event-Driven] SNS 최초 로그인 추가 정보

WHEN SNS 최초 로그인이고 필수 정보(이름, 휴대전화)가 없으면 THEN 시스템은 추가 정보 입력 화면을 표시해야 한다.

#### REQ-MEMBER-028 [Event-Driven] SNS 이메일 중복 안내

WHEN SNS 이메일이 기존 일반 계정과 동일하면 THEN 시스템은 "이미 가입된 이메일입니다. 기존 계정과 연동할까요?" 안내를 표시해야 한다.

#### REQ-MEMBER-029 [Event-Driven] 네이버 로그인 시작

WHEN 네이버 로그인 버튼을 클릭하면 THEN 시스템은 네이버 OAuth 인증 페이지로 이동해야 한다.

#### REQ-MEMBER-030 [Ubiquitous] SNS 버튼 디자인 가이드

시스템은 항상 카카오(노란색 배경) 및 네이버(초록색 배경) 공식 디자인 가이드를 준수한 버튼을 사용해야 한다.

#### REQ-MEMBER-031 [Optional] 구글/애플 OAuth

WHERE 구글/애플 로그인이 P2에서 도입될 경우 시스템은 해당 플랫폼의 공식 OAuth 2.0 흐름을 구현해야 한다.

---

### 3.2 모듈 2: 회원가입 (Registration) - 5개 기능

#### REQ-MEMBER-032 [Ubiquitous] 가입 첫 단계 약관동의

시스템은 항상 가입 절차의 첫 단계에서 약관동의 화면을 표시해야 한다.

#### REQ-MEMBER-033 [Ubiquitous] 필수 약관 표시

시스템은 항상 이용약관과 개인정보처리방침을 필수 약관으로, 마케팅 정보 수신동의를 선택 약관으로 표시해야 한다.

#### REQ-MEMBER-034 [Ubiquitous] 14세 이상 확인

시스템은 항상 14세 이상 확인 체크박스를 표시해야 한다.

#### REQ-MEMBER-035 [Event-Driven] 전체 동의 체크박스

WHEN "전체 동의" 체크박스를 클릭하면 THEN 시스템은 모든 약관(필수+선택+14세 확인)을 일괄 선택/해제해야 한다.

#### REQ-MEMBER-036 [Event-Driven] 약관 내용 보기

WHEN 약관 제목 영역의 "보기" 버튼을 클릭하면 THEN 시스템은 해당 약관 내용을 아코디언으로 펼쳐야 한다.

#### REQ-MEMBER-037 [Event-Driven] 필수 약관 동의 시 다음 활성화

WHEN 모든 필수 약관에 동의하면 THEN 시스템은 "다음" 버튼을 활성화해야 한다.

#### REQ-MEMBER-038 [Unwanted] 필수 약관 미동의 진행 차단

시스템은 필수 약관에 미동의한 상태에서 다음 단계 진행을 허용하지 않아야 한다.

#### REQ-MEMBER-039 [Unwanted] 약관 내용 없는 표시 금지

시스템은 약관 내용 없이 약관 제목만 표시하지 않아야 한다.

#### REQ-MEMBER-040 [Ubiquitous] 필수 입력 항목

시스템은 항상 이메일, 비밀번호, 비밀번호 확인, 이름, 휴대전화를 필수 입력 항목으로 요구해야 한다.

#### REQ-MEMBER-041 [Ubiquitous] 비밀번호 규칙 검증

시스템은 항상 비밀번호를 영문, 숫자, 특수문자 조합 8자 이상으로 검증해야 한다.

#### REQ-MEMBER-042 [Ubiquitous] 이메일 형식 검증

시스템은 항상 이메일 형식을 RFC 5322 표준으로 검증해야 한다.

#### REQ-MEMBER-043 [Event-Driven] 이메일 중복확인 자동 실행

WHEN 이메일 입력 필드에 300ms 이상 입력이 없으면 THEN 시스템은 이메일 중복 확인을 자동으로 실행해야 한다 (debounce).

#### REQ-MEMBER-044 [Event-Driven] 비밀번호 강도 표시

WHEN 비밀번호를 입력하면 THEN 시스템은 비밀번호 강도를 실시간으로 "약함/보통/강함"으로 표시해야 한다.

#### REQ-MEMBER-045 [Event-Driven] 가입 완료 처리

WHEN "가입하기" 버튼을 클릭하면 THEN 시스템은 모든 필수 필드 검증 후 회원 가입 API를 호출하고 가입 완료 페이지를 표시해야 한다.

#### REQ-MEMBER-046 [State-Driven] 이메일 미확인 시 가입 차단

IF 이메일 중복 확인이 완료되지 않은 경우 THEN 시스템은 "가입하기" 버튼을 비활성화해야 한다.

#### REQ-MEMBER-047 [State-Driven] 휴대전화 미인증 시 가입 차단

IF 휴대전화 인증이 완료되지 않은 경우 THEN 시스템은 "가입하기" 버튼을 비활성화해야 한다.

#### REQ-MEMBER-048 [Event-Driven] 이메일 중복확인 API 호출

WHEN 이메일 형식이 올바르고 debounce 시간이 경과하면 THEN 시스템은 `/members/id/exist` API를 호출하여 중복 여부를 확인해야 한다.

#### REQ-MEMBER-049 [Event-Driven] 이메일 사용 가능 표시

WHEN 이메일이 사용 가능하면 THEN 시스템은 초록색 체크 아이콘과 "사용 가능한 이메일입니다" 메시지를 표시해야 한다.

#### REQ-MEMBER-050 [Event-Driven] 이메일 중복 표시

WHEN 이메일이 이미 사용 중이면 THEN 시스템은 빨간색 X 아이콘과 "이미 사용 중인 이메일입니다" 메시지를 표시해야 한다.

#### REQ-MEMBER-051 [Ubiquitous] 이메일 형식 사전 검증

시스템은 항상 이메일 형식 검증 후 API를 호출해야 한다.

#### REQ-MEMBER-052 [Ubiquitous] API 호출 빈도 제한

시스템은 항상 이메일 중복확인 API 호출 빈도를 초당 10회 이내로 제한해야 한다.

#### REQ-MEMBER-053 [Event-Driven] SMS 인증번호 발송

WHEN "인증번호 발송" 버튼을 클릭하면 THEN 시스템은 해당 휴대전화로 6자리 인증번호 SMS를 발송하고 3분 타이머를 시작해야 한다.

#### REQ-MEMBER-054 [Event-Driven] SMS 인증 성공

WHEN 올바른 인증번호를 입력하면 THEN 시스템은 "인증이 완료되었습니다" 메시지를 표시하고 휴대전화 필드를 비활성화해야 한다.

#### REQ-MEMBER-055 [Event-Driven] SMS 인증 실패

WHEN 잘못된 인증번호를 입력하면 THEN 시스템은 "인증번호가 일치하지 않습니다" 오류를 표시해야 한다.

#### REQ-MEMBER-056 [Event-Driven] SMS 타이머 만료

WHEN 3분 타이머가 만료되면 THEN 시스템은 "인증번호가 만료되었습니다. 재발송 해주세요" 메시지를 표시해야 한다.

#### REQ-MEMBER-057 [Event-Driven] SMS 재발송 제한

WHEN 인증번호 발송 후 1분 이내 재발송 시도하면 THEN 시스템은 재발송을 차단하고 남은 시간을 안내해야 한다.

#### REQ-MEMBER-058 [Unwanted] 만료 인증번호 사용 차단

시스템은 3분 만료 후에도 이전 인증번호로 인증을 허용하지 않아야 한다.

#### REQ-MEMBER-059 [Event-Driven] 가입완료 메일 자동 발송

WHEN 회원 가입 API(`/members` POST)가 성공하면 THEN shopby는 자동으로 가입 완료 이메일을 발송해야 한다.

#### REQ-MEMBER-060 [Event-Driven] 신규 가입 혜택 안내

WHEN 가입 완료 화면이 표시되면 THEN 시스템은 신규 가입 혜택(쿠폰 5,000원)을 안내해야 한다.

#### REQ-MEMBER-061 [Optional] 신규 가입 쿠폰 표시

WHERE 신규 가입 쿠폰이 설정된 경우 시스템은 가입 완료 화면에 쿠폰 금액을 표시해야 한다.

---

### 3.3 모듈 3: 회원관리 (Member Management) - 3개 기능

#### REQ-MEMBER-062 [Ubiquitous] 비회원 주문 필수 정보

시스템은 항상 비회원 주문 시 이름, 휴대전화, 이메일을 필수 수집해야 한다.

#### REQ-MEMBER-063 [Ubiquitous] 비회원 주문 조회 방식

시스템은 항상 비회원 주문 조회를 주문번호+휴대전화 조합으로 제공해야 한다.

#### REQ-MEMBER-064 [Event-Driven] 비회원 굿즈 주문 허용

WHEN 비회원이 단순 굿즈 상품을 주문하려 할 때 THEN 시스템은 비회원 정보 입력 화면을 제공해야 한다.

#### REQ-MEMBER-065 [Event-Driven] 비회원 인쇄물 주문 차단

WHEN 비회원이 인쇄물/제본 상품을 주문하려 할 때 THEN 시스템은 "인쇄물 주문은 회원만 가능합니다" 안내와 함께 로그인/가입 화면으로 유도해야 한다.

#### REQ-MEMBER-066 [Event-Driven] 비회원 주문 완료 알림

WHEN 비회원 주문이 완료되면 THEN 시스템은 주문번호를 이메일 및 SMS로 발송해야 한다.

#### REQ-MEMBER-067 [State-Driven] 비회원 쿠폰 사용 차단

IF 비회원 주문 상태에서 쿠폰 사용을 시도하면 THEN 시스템은 "쿠폰은 회원만 사용 가능합니다" 메시지를 표시해야 한다.

#### REQ-MEMBER-068 [State-Driven] 비회원 프린팅머니 사용 차단

IF 비회원 주문 상태에서 프린팅머니 사용을 시도하면 THEN 시스템은 "프린팅머니는 회원만 사용 가능합니다" 메시지를 표시해야 한다.

#### REQ-MEMBER-069 [Unwanted] 비회원 정보 보관 기간 제한

시스템은 비회원 주문 정보를 90일 초과하여 보관하지 않아야 한다.

#### REQ-MEMBER-070 [Ubiquitous] 4단계 회원등급 체계

시스템은 항상 4단계 등급 체계(일반/실버/골드/VIP)를 유지해야 한다.

#### REQ-MEMBER-071 [Ubiquitous] 등급 산정 기준

시스템은 항상 3개월 구매금액을 기준으로 등급을 산정해야 한다.

#### REQ-MEMBER-072 [Ubiquitous] 등급 자동 재산정

시스템은 항상 등급 산정 주기에 따라 자동으로 등급을 재산정해야 한다.

#### REQ-MEMBER-073 [Event-Driven] 마이페이지 등급 표시

WHEN 회원이 마이페이지 상단을 방문하면 THEN 시스템은 현재 등급 배지와 "다음 등급까지 N원 남았습니다" 프로그레스 바를 표시해야 한다.

#### REQ-MEMBER-074 [Event-Driven] 등급 상승 알림

WHEN 등급이 상승하면 THEN 시스템은 등급 상승 알림 이메일 또는 SMS를 발송해야 한다.

#### REQ-MEMBER-075 [Event-Driven] 등급 혜택 비교표

WHEN 등급별 혜택 페이지를 방문하면 THEN 시스템은 전체 등급 조건 및 혜택 비교표를 표시해야 한다.

#### REQ-MEMBER-076 [State-Driven] VIP 무료배송

IF VIP 등급 회원이 주문하면 THEN 시스템은 자동으로 무료배송 혜택을 적용해야 한다.

#### REQ-MEMBER-077 [Ubiquitous] 관리자 회원정보 제공

시스템은 항상 관리자에게 회원의 기본 정보, 주문내역, 등급 정보를 제공해야 한다.

#### REQ-MEMBER-078 [Event-Driven] 관리자 회원 검색

WHEN 관리자가 회원 목록에서 검색하면 THEN 시스템은 이름, 이메일, 휴대전화로 필터링된 결과를 표시해야 한다.

#### REQ-MEMBER-079 [Event-Driven] 관리자 회원 상세

WHEN 관리자가 특정 회원의 상세 정보를 클릭하면 THEN 시스템은 회원의 전체 주문내역, 쿠폰, 프린팅머니 잔액을 표시해야 한다.

---

### 3.4 모듈 4: 관리자 회원운영 (Admin Operations) - 5개 기능

#### REQ-MEMBER-080 [Ubiquitous] 탈퇴 회원 보관

시스템은 항상 탈퇴 회원 정보를 전자상거래법에 따라 5년간 보관해야 한다.

#### REQ-MEMBER-081 [Ubiquitous] 탈퇴 회원 마스킹

시스템은 항상 탈퇴 회원의 개인식별정보를 마스킹하여 보관해야 한다.

#### REQ-MEMBER-082 [Event-Driven] 탈퇴 회원 목록 조회

WHEN 관리자가 탈퇴 회원 목록을 조회하면 THEN 시스템은 탈퇴일, 탈퇴 사유, 마스킹된 정보를 표시해야 한다.

#### REQ-MEMBER-083 [Event-Driven] 미완료 주문 탈퇴 거부

WHEN 미완료 주문이 있는 회원이 탈퇴를 요청하면 THEN 시스템은 탈퇴를 거부하고 "진행 중인 주문이 있어 탈퇴가 불가합니다" 메시지를 표시해야 한다.

#### REQ-MEMBER-084 [Event-Driven] 탈퇴 시 잔여 혜택 소멸

WHEN 회원이 탈퇴를 완료하면 THEN 시스템은 해당 회원의 잔여 쿠폰과 프린팅머니를 즉시 소멸시켜야 한다.

#### REQ-MEMBER-085 [State-Driven] 재가입 제한

IF 탈퇴 후 30일 이내이면 THEN 시스템은 동일 이메일로 재가입을 차단해야 한다.

#### REQ-MEMBER-086 [Ubiquitous] 프린팅머니 내역 관리

시스템은 항상 프린팅머니 지급/차감 내역을 관리자에게 제공해야 한다.

#### REQ-MEMBER-087 [Ubiquitous] 프린팅머니 최소 단위

시스템은 항상 프린팅머니 사용 시 최소 1원 단위로 처리해야 한다.

#### REQ-MEMBER-088 [Event-Driven] 프린팅머니 지급

WHEN 관리자가 특정 회원에게 프린팅머니를 지급하면 THEN 시스템은 지급 사유와 금액을 기록해야 한다.

#### REQ-MEMBER-089 [Event-Driven] 프린팅머니 차감

WHEN 관리자가 프린팅머니를 차감하면 THEN 시스템은 차감 사유와 금액을 기록하고 해당 회원에게 알림을 발송해야 한다.

#### REQ-MEMBER-090 [Event-Driven] 프린팅머니 일괄 지급

WHEN 관리자가 일괄 지급 기능을 사용하면 THEN 시스템은 지정 조건(등급, 구매이력 등)에 해당하는 회원 전체에게 프린팅머니를 지급해야 한다.

#### REQ-MEMBER-091 [State-Driven] 탈퇴 시 프린팅머니 소멸

IF 회원이 탈퇴하면 THEN 시스템은 잔여 프린팅머니를 즉시 소멸시켜야 한다.

#### REQ-MEMBER-092 [State-Driven] 프린팅머니 잔액 부족 처리

IF 프린팅머니 잔액이 주문 금액보다 적으면 THEN 시스템은 차액을 다른 결제 수단으로 처리할 수 있도록 해야 한다.

#### REQ-MEMBER-093 [Ubiquitous] 쿠폰 생성 설정

시스템은 항상 쿠폰 발행 시 쿠폰 코드, 할인 금액, 유효기간, 최소 주문금액을 설정할 수 있어야 한다.

#### REQ-MEMBER-094 [Ubiquitous] 쿠폰 대상 설정

시스템은 항상 쿠폰의 사용 대상(전체/특정 상품/특정 카테고리)을 설정할 수 있어야 한다.

#### REQ-MEMBER-095 [Event-Driven] 쿠폰 생성

WHEN 관리자가 신규 쿠폰을 생성하면 THEN 시스템은 쿠폰 코드를 자동 생성하고 유효성을 검증해야 한다.

#### REQ-MEMBER-096 [Event-Driven] 쿠폰 개별 발급

WHEN 관리자가 쿠폰을 특정 회원에게 발급하면 THEN 시스템은 해당 회원의 쿠폰 지갑에 추가해야 한다.

#### REQ-MEMBER-097 [Event-Driven] 쿠폰 만료 비활성화

WHEN 쿠폰 유효기간이 만료되면 THEN 시스템은 해당 쿠폰을 자동으로 비활성화해야 한다.

#### REQ-MEMBER-098 [Event-Driven] 신규 가입 쿠폰 자동 발급

WHEN 신규 회원이 가입 완료하면 THEN 시스템은 신규 가입 쿠폰(5,000원, 최소 주문금액 30,000원)을 자동 발급해야 한다.

#### REQ-MEMBER-099 [Optional] 출력상품 전용 쿠폰

WHERE 출력상품 전용 쿠폰 설정이 가능할 경우 시스템은 인쇄/제본 카테고리에만 적용되는 쿠폰을 발행할 수 있어야 한다.

---

## 4. 기술 제약사항

### 4.1 shopby API 의존성

- 모든 인증/회원 API는 shopby Enterprise API에 의존하며, 직접 데이터베이스 접근은 불가
- shopby Provider(`@shopby/react-components`)가 API 추상화를 담당하며, 직접 API 호출보다 Provider 사용을 우선
- SMS 인증은 NHN Cloud 등 외부 SMS 업체 연동이 필요하며 별도 계약 필수
- shopby 관리자에서 자동메일, 쿠폰 규칙, 등급 산정 주기 등의 사전 설정이 필요

### 4.2 Provider 체인 제약

- 기존 App Root의 10개 Provider 체인 순서를 변경하지 않음
- 신규 Provider는 페이지 수준에서만 추가 (글로벌 체인 수정 금지)
- AuthProvider(5번째)가 MemberProvider를 래핑하는 구조를 유지

### 4.3 기존 코드 제약

- `src/utils/api.js`의 `reRequestShopApi` 함수에 토큰 갱신 없이 재시도하는 잠재 버그 존재 (TAG-001에서 최우선 검증)
- 관리자 인증(`src/services/adminAuth.js`)은 현재 Mock 체계이며, 실제 API 연동은 별도 SPEC으로 분리
- 기존 컴포넌트(Timer, TermsContent, PasswordChanger 등) 재사용 우선

### 4.4 디자인 제약

- PC 우선 설계 (인쇄 업종 특성상 PC 주문 비중 높음)
- 인증 페이지 카드 스타일 UI 유지 (SPEC-LAYOUT-002 계승)
- Huni Design System의 Field/TextField 컴포넌트 사용

---

## 5. 추적성

### 5.1 상위 문서

| 참조 문서 | 관계 |
|----------|------|
| SPEC-PLAN-001 v1.1.0 | 마스터 기획서 - 정책 A-1-1 ~ B-6-4 |
| 정책 체크리스트 | KD-01 ~ KD-08 의사결정 근거 |

### 5.2 보충 문서

| 문서 | 위치 | 내용 |
|------|------|------|
| 요구사항 분석 | `requirements-analysis.md` | 8개 KD 상세 분석, 엣지 케이스, 리스크 |
| 아키텍처 설계 | `architecture-design.md` | 3-Tier 배치, Provider 전략, 파일 영향도, MX 태그 |

### 5.3 관련 SPEC

| SPEC ID | 관계 | 영향 |
|---------|------|------|
| SPEC-LAYOUT-001/002 | 선행 완료 | 반응형 레이아웃, 카드 스타일 UI 기반 |
| SPEC-ORDER (예정) | 후행 의존 | 비회원 주문, 회원 정보 연동 |
| SPEC-MYPAGE (예정) | 후행 의존 | 로그인 상태 기반 접근 제어 |
| SPEC-PAYMENT (예정) | 후행 의존 | 프린팅머니 결제 연동 |

### 5.4 요구사항 커버리지

| 모듈 | 기능 수 | REQ 범위 | 우선순위 |
|------|---------|----------|---------|
| 인증 | 5 | REQ-MEMBER-001 ~ 031 | P1 (구글/애플 P2) |
| 회원가입 | 5 | REQ-MEMBER-032 ~ 061 | P1 |
| 회원관리 | 3 | REQ-MEMBER-062 ~ 079 | P1 (관리자 P2) |
| 관리자 회원운영 | 5 | REQ-MEMBER-080 ~ 099 | P1 (탈퇴/쿠폰내역 P2) |
