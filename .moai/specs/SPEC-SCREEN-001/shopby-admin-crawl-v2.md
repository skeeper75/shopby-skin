# Shopby 관리자 화면 크롤링 리포트 v2

> 생성일: 2026-03-18T23:28:26.594Z
> 로그인: 실패 (SSO 인증 필요)
> 캡처: 1개 화면

## 로그인 실패 분석

shopby 서비스어드민은 2단계 인증 플로우를 사용합니다:

1. `service.shopby.co.kr/login`: shopby 서비스어드민 자체 로그인 폼
2. `accounts.nhn-commerce.com`: NHN Commerce 통합회원 SSO 인증

자격증명 "huniprinting"은 1단계에서 입력되지만, 2단계 SSO에서 
NHN Commerce 통합계정 자격증명이 별도로 필요할 수 있습니다.

### 권장 사항

- NHN Commerce 통합계정 자격증명을 확인하세요 (shopby 계정과 다를 수 있음)
- 또는 shopby 어드민에 직접 로그인하여 브라우저 쿠키를 export한 후 Playwright에 주입하세요

### 최종 페이지 내용

```
통합회원 로그인
아이디
비밀번호
아이디 저장
로그인
회원가입
 
아이디 찾기
 
비밀번호 찾기
회사소개 이용약관 개인정보처리방침

ⓒ NHN COMMERCE Corp. All Rights Reserved.
```
