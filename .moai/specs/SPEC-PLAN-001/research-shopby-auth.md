# shopby 회원/인증 API 분석 (15개 기능)

> **작성일**: 2026-03-20
> **목적**: 후니프린팅 A1A2-MEMBER 도메인 15개 기능에 대한 shopby API 및 React Provider 분석
> **데이터 소스**: features-data.json (A1A2-MEMBER), shopby Enterprise 공식 API 문서, @shopby/react-components 패키지

---

## 분석 범위

| # | 기능 | policy_id | shopby_class | 우선순위 |
|---|------|-----------|-------------|---------|
| 1 | 일반 로그인 | A-1-1 | NATIVE | P1 |
| 2 | 아이디 찾기 (이메일 발송) | A-1-2 | NATIVE | P1 |
| 3 | 비밀번호 찾기 (임시PW) | A-1-3 | NATIVE | P1 |
| 4 | 약관동의 | A-2-1 | SKIN | P1 |
| 5 | 정보입력 (회원가입) | A-2-2 | SKIN | P1 |
| 6 | 이메일 중복확인 | A-2-3 | NATIVE | P1 |
| 7 | 휴대전화 인증 | A-2-4 | NATIVE | P1 |
| 8 | 가입완료 메일 발송 | A-2-5 | NATIVE | P1 |
| 9 | SNS 로그인 (카카오/네이버) | A-1-SNS | NATIVE | P1 |
| 10 | SNS 로그인 (구글/애플) | A-1-SNS2 | EXTERNAL | P2 |
| 11 | 비회원 주문 허용 | A-2-GUEST | NATIVE | P1 |
| 12 | 회원등급 체계 | B-6-GRADE | NATIVE | P1 |
| 13 | 회원정보수정 | A-3-10 | NATIVE | P1 |
| 14 | 비밀번호변경 | A-3-12 | NATIVE | P1 |
| 15 | 회원탈퇴 | A-3-13 | NATIVE | P1 |

---

## 1. 일반 로그인 (A-1-1)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/auth/token` | POST | 로그인 토큰 발급 (이메일+비밀번호) |
| `/auth/token` | DELETE | 로그아웃 (토큰 삭제) |
| `/profile` | GET | 로그인 회원 프로필 조회 |

### React Provider 컴포넌트

- **MemberProvider**: 회원 인증 상태 관리
  - `useMemberStateContext()`: 로그인 상태(isLogin, memberInfo) 조회
  - `useMemberActionContext()`: 로그인/로그아웃 액션 디스패치

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 로그인 식별자 | shopby 관리자 > 기본설정 | 이메일 / 아이디 / 둘 다 |
| 자동 로그인 | shopby 관리자 > 기본설정 | 사용/미사용 |
| 로그인 실패 제한 | shopby 관리자 > 보안설정 | 5회/10회 (잠금 시간 설정) |

### 제한사항

- 로그인 식별자는 shopby 관리자에서 전역 설정 (쇼핑몰 전체 적용)
- 이메일 로그인으로 설정 시 기존 아이디 기반 회원은 마이그레이션 필요
- JWT 토큰 기반 인증 (accessToken + refreshToken)
- accessToken 만료 시간: 기본 30분 (shopby 고정)

### 핵심 데이터 필드

```
Request: { memberId: string, password: string }
Response: { accessToken: string, refreshToken: string, expireIn: number }
```

### 화면 설계 시사점

- 이메일/아이디 입력 필드 + 비밀번호 입력 필드
- "자동 로그인" 체크박스 (refreshToken 활용)
- 로그인 실패 시 에러 메시지: "이메일 또는 비밀번호가 일치하지 않습니다"
- 5회 실패 시 잠금 안내: "로그인 시도 횟수를 초과했습니다. N분 후 다시 시도해주세요"
- SNS 로그인 버튼 영역 (카카오/네이버)
- 아이디 찾기 / 비밀번호 찾기 링크

---

## 2. 아이디 찾기 (A-1-2)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members/id` | POST | 아이디/이메일 찾기 (이름+휴대전화) |
| `/members/id/send-email` | POST | 아이디를 이메일로 발송 |

### React Provider 컴포넌트

- **FindIdProvider**: 아이디 찾기 상태 관리
  - `useFindIdActionContext()`: 아이디 찾기 요청/결과 관리

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 찾기 방법 | shopby 관리자 > 기본설정 | 휴대전화 / 이메일 인증 |
| 결과 노출 | 스킨 커스텀 | 마스킹(ab***@email.com) / 전체 노출 |

### 제한사항

- shopby API는 이름 + 휴대전화번호 조합으로 아이디 조회
- 이메일 발송은 shopby 자동메일 설정 필요
- 결과 마스킹은 프론트엔드에서 처리 (API는 전체 아이디 반환)

### 핵심 데이터 필드

```
Request: { memberName: string, mobileNo: string }
Response: { memberId: string, joinYmdt: string }
```

### 화면 설계 시사점

- 이름 + 휴대전화 입력 필드
- 결과 화면: 마스킹된 아이디(이메일) + 가입일
- "이메일로 전체 아이디 발송" 버튼
- 비밀번호 찾기 화면으로 이동 링크

---

## 3. 비밀번호 찾기 (A-1-3)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members/password` | PUT | 비밀번호 재설정 요청 |
| `/members/password/send-email` | POST | 임시 비밀번호 이메일 발송 |

### React Provider 컴포넌트

- **FindPasswordProvider**: 비밀번호 찾기 상태 관리
  - `useFindPasswordActionContext()`: 비밀번호 재설정 요청 관리

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 재설정 방식 | shopby 관리자 > 기본설정 | 이메일 재설정 링크 / 임시PW 발송 |
| 이메일 템플릿 | shopby 관리자 > 자동메일 | 커스텀 가능 |

### 제한사항

- 이메일 재설정 방식 권장 (임시PW는 보안 취약)
- shopby 자동메일 설정에서 비밀번호 찾기 메일 템플릿 커스텀 가능
- 알림톡 연동 시 별도 카카오 비즈니스 채널 계약 필요

### 핵심 데이터 필드

```
Request: { memberId: string, memberName: string, mobileNo: string }
Response: { result: boolean, message: string }
```

### 화면 설계 시사점

- 이메일(아이디) + 이름 + 휴대전화 입력 필드
- "비밀번호 재설정 이메일 발송" 버튼
- 발송 완료 안내: "입력하신 이메일로 비밀번호 재설정 링크를 발송했습니다"
- 이메일 미수신 시 재발송 버튼 (1분 간격 제한)

---

## 4. 약관동의 (A-2-1)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/terms` | GET | 약관 목록 조회 (필수/선택 구분) |
| `/terms/{termsNo}` | GET | 약관 상세 내용 조회 |

### React Provider 컴포넌트

- **SignUpProvider**: 회원가입 전체 프로세스 관리
  - `useSignUpStepContext()`: 가입 단계(약관동의 -> 정보입력 -> 완료) 관리
  - `useTermsContext()`: 약관 목록 및 동의 상태 관리

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 필수 약관 | shopby 관리자 > 약관관리 | 이용약관, 개인정보처리방침 (필수) |
| 선택 약관 | shopby 관리자 > 약관관리 | 마케팅 수신동의 (선택) |
| 14세 이상 확인 | shopby 관리자 > 가입설정 | 사용/미사용 |

### 제한사항

- shopby 약관은 관리자에서 HTML 에디터로 등록/수정
- 약관 버전 관리 기능은 shopby에서 기본 제공하지 않음 (수동 관리)
- 필수 약관 미동의 시 가입 진행 불가 (프론트엔드 검증)

### 핵심 데이터 필드

```
Response: {
  terms: [
    { termsNo: number, title: string, required: boolean, contents: string }
  ]
}
```

### 화면 설계 시사점

- "전체 동의" 체크박스 (전체 선택/해제)
- 필수 약관: [필수] 이용약관, [필수] 개인정보처리방침
- 선택 약관: [선택] 마케팅 정보 수신동의
- 약관 내용 펼치기/접기 (아코디언)
- 14세 이상 확인 체크박스 (설정 시)
- "다음 단계" 버튼 (필수 약관 미동의 시 비활성화)

---

## 5. 정보입력 - 회원가입 (A-2-2)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members` | POST | 회원 가입 (정보 제출) |
| `/members/id/exist` | GET | 아이디/이메일 중복 확인 |
| `/members/authentication/sms` | POST | SMS 인증번호 발송 |
| `/members/authentication/sms/verify` | POST | SMS 인증번호 확인 |

### React Provider 컴포넌트

- **SignUpProvider**: 회원가입 전체 프로세스 관리
  - `useSignUpFormContext()`: 가입 폼 상태(필드값, 유효성) 관리
  - `useSignUpActionContext()`: 가입 액션(제출, 중복확인, 인증) 디스패치

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 필수 필드 | shopby 관리자 > 가입설정 | 이메일, 비밀번호, 이름, 휴대전화 |
| 선택 필드 | shopby 관리자 > 가입설정 | 닉네임, 생년월일, 성별, 추가 정보 |
| 비밀번호 규칙 | shopby 관리자 > 보안설정 | 최소 8자, 영문+숫자+특수문자 |
| 추천인 코드 | shopby 관리자 > 가입설정 | 사용/미사용 |

### 제한사항

- shopby 기본 필드: 아이디(이메일), 비밀번호, 이름, 휴대전화, 이메일
- 추가 커스텀 필드는 shopby 관리자에서 최대 20개까지 등록 가능
- 이메일 인증은 shopby에서 자동 처리 (인증 메일 발송)
- 주소 필드는 shopby에서 다음 우편번호 API 기본 연동

### 핵심 데이터 필드

```
Request: {
  memberId: string,        // 이메일 또는 아이디
  password: string,
  memberName: string,
  mobileNo: string,
  email: string,
  nickname: string,        // 선택
  birthday: string,        // 선택 (YYYY-MM-DD)
  sex: string,            // 선택 (M/F)
  agreedTermsNos: number[], // 동의한 약관 번호 배열
  recommenderId: string    // 추천인 코드 (선택)
}
```

### 화면 설계 시사점

- **필수 필드**: 이메일(로그인ID), 비밀번호, 비밀번호 확인, 이름, 휴대전화
- **선택 필드**: 닉네임, 생년월일, 사업자번호(B2B용)
- 이메일 입력 시 실시간 중복 확인 (debounce 300ms)
- 비밀번호 강도 표시 (약함/보통/강함)
- 휴대전화 인증 버튼 -> SMS 인증번호 입력
- "가입하기" 버튼 (모든 필수 필드 + 인증 완료 시 활성화)

---

## 6. 이메일 중복확인 (A-2-3)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members/id/exist` | GET | 아이디/이메일 중복 여부 확인 |

### React Provider 컴포넌트

- **SignUpProvider** 내부에서 사용
  - `useSignUpActionContext().checkDuplicateId()`: 중복 확인 액션

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 중복 확인 시점 | 스킨 커스텀 | 실시간(입력 중) / 버튼 클릭 시 |

### 제한사항

- shopby API 호출 제한: 초당 10회 이내 권장
- 실시간 중복 확인 시 debounce 적용 필수 (300~500ms)
- 이메일 형식 검증은 프론트엔드에서 먼저 처리 (API 호출 최소화)

### 핵심 데이터 필드

```
Request: memberId={email} (query parameter)
Response: { exist: boolean }
```

### 화면 설계 시사점

- 이메일 입력 필드 우측에 상태 표시
- 사용 가능: 초록색 체크 아이콘 + "사용 가능한 이메일입니다"
- 이미 사용 중: 빨간색 X 아이콘 + "이미 사용 중인 이메일입니다"
- 형식 오류: 빨간색 안내 + "올바른 이메일 형식을 입력해주세요"

---

## 7. 휴대전화 인증 (A-2-4)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members/authentication/sms` | POST | SMS 인증번호 발송 |
| `/members/authentication/sms/verify` | POST | SMS 인증번호 확인 |
| `/members/authentication/ci` | POST | 본인인증(PASS) 처리 |

### React Provider 컴포넌트

- **AuthenticationProvider**: 인증 전체 관리
  - `useAuthenticationContext()`: 인증 상태(발송 여부, 타이머, 검증 결과) 관리

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 인증 방식 | shopby 관리자 > 가입설정 | SMS 인증번호 / PASS 본인인증 |
| 1인1계정 | shopby 관리자 > 가입설정 | 사용/미사용 |
| 인증 유효시간 | shopby 고정 | 3분 |
| 재발송 간격 | shopby 고정 | 1분 |

### 제한사항

- SMS 인증: shopby에서 SMS 발송 업체(NHN Cloud 등) 연동 필요
- PASS 본인인증: 별도 본인인증 서비스 계약 필요 (KCB, NICE 등)
- 1인1계정 설정 시 CI(연계정보)로 중복 가입 차단
- SMS 발송 비용: 건당 8~15원

### 핵심 데이터 필드

```
// SMS 인증번호 발송
Request: { mobileNo: string }
Response: { result: boolean, expireAt: string }

// SMS 인증번호 확인
Request: { mobileNo: string, authenticationNumber: string }
Response: { result: boolean, ci: string }
```

### 화면 설계 시사점

- 휴대전화 번호 입력 + "인증번호 발송" 버튼
- 인증번호 입력 필드 + 타이머(3분) 표시
- 타이머 만료 시 "인증번호 재발송" 버튼 노출
- 인증 완료 시: "인증이 완료되었습니다" + 번호 필드 비활성화
- PASS 본인인증 선택 시: 팝업 방식으로 본인인증 진행

---

## 8. 가입완료 메일 발송 (A-2-5)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members` | POST 성공 시 자동 | 가입 완료 시 shopby 자동메일 발송 |

### React Provider 컴포넌트

- **SignUpProvider**: 가입 완료 상태 관리
  - `useSignUpResultContext()`: 가입 결과(성공/실패, 혜택 정보) 조회

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 자동메일 발송 | shopby 관리자 > 자동메일설정 | 사용/미사용 |
| 메일 템플릿 | shopby 관리자 > 자동메일설정 | HTML 커스텀 가능 |
| 가입 혜택 | shopby 관리자 > 쿠폰/적립금 | 신규 가입 쿠폰, 적립금 설정 |

### 제한사항

- shopby 자동메일은 가입 시 자동 트리거 (별도 API 호출 불필요)
- 메일 발송 실패 시 재발송 기능은 shopby에서 미제공 (로그 확인만 가능)
- 가입 혜택(쿠폰/적립금)은 shopby 관리자에서 "신규가입 시 자동 지급" 설정

### 핵심 데이터 필드

```
// 가입 완료 후 화면에 표시할 데이터
{
  memberName: string,
  memberId: string,
  welcomeCoupon: { couponName: string, discountAmount: number },
  welcomePoint: number
}
```

### 화면 설계 시사점

- 가입 완료 축하 메시지
- 가입 혜택 안내: "신규 가입 혜택이 발급되었습니다!"
  - 쿠폰: "5,000원 할인 쿠폰" (마이페이지에서 확인)
  - 적립금: "1,000원 프린팅머니 적립"
- "로그인하기" / "메인으로" 버튼
- 메일 확인 안내: "가입 완료 메일이 발송되었습니다"

---

## 9. SNS 로그인 - 카카오/네이버 (A-1-SNS)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/auth/openid/{provider}` | GET | OpenID 인증 URL 생성 |
| `/auth/openid/{provider}/callback` | POST | OpenID 인증 콜백 처리 |
| `/auth/openid/profile` | GET | OpenID 프로필 조회 |

### React Provider 컴포넌트

- **OpenIdLoginProvider**: SNS 로그인 관리
  - `useOpenIdLoginContext()`: SNS 로그인 상태 및 액션 관리
  - provider: "KAKAO" | "NAVER"

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 카카오 로그인 | shopby 관리자 > 간편로그인 | 앱키 입력, 사용/미사용 |
| 네이버 로그인 | shopby 관리자 > 간편로그인 | 클라이언트ID 입력, 사용/미사용 |
| 자동 연동 | shopby 관리자 > 간편로그인 | 기존 회원 자동 연동 (이메일 기준) |

### 제한사항

- 카카오/네이버는 shopby 기본 지원 (NATIVE)
- 카카오 비즈앱 등록 필요 (카카오 개발자 센터)
- 네이버 애플리케이션 등록 필요 (네이버 개발자 센터)
- SNS 최초 로그인 시 추가 정보 입력 화면 필요할 수 있음 (이름, 휴대전화)
- shopby에서 이메일 기준 기존 회원 자동 연동 지원

### 핵심 데이터 필드

```
// 카카오 OpenID 프로필
{
  provider: "KAKAO",
  openIdAccessToken: string,
  email: string,
  nickname: string,
  profileImageUrl: string
}
```

### 화면 설계 시사점

- 로그인 화면 하단에 SNS 로그인 버튼 영역
- 카카오 로그인 버튼 (카카오 공식 디자인 가이드 준수: 노란색 배경)
- 네이버 로그인 버튼 (네이버 공식 디자인 가이드 준수: 초록색 배경)
- 최초 SNS 로그인 시 "추가 정보 입력" 화면 (필수: 이름, 휴대전화)
- 기존 회원 연동 안내: "이미 가입된 이메일입니다. 기존 계정과 연동할까요?"

---

## 10. SNS 로그인 - 구글/애플 (A-1-SNS2)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| 별도 OAuth 2.0 구현 필요 | - | shopby 미지원, EXTERNAL |

### React Provider 컴포넌트

- shopby Provider 미지원 -> 커스텀 Provider 개발 필요
- **GoogleOAuthProvider** (자체 개발): Google OAuth 2.0 연동
- **AppleOAuthProvider** (자체 개발): Apple Sign In 연동

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| Google OAuth | Google Cloud Console | 클라이언트 ID/Secret |
| Apple Sign In | Apple Developer | Service ID, Key |

### 제한사항

- shopby에서 구글/애플 로그인 미지원 -> 별도 OAuth 연동 개발 필요
- 구글/애플 로그인 후 shopby 회원 가입/연동 프로세스 별도 구현
- 개발 규모: L (OAuth 2.0 전체 플로우 + shopby 회원 연동)
- **P2(2순위)로 런칭 후 개발 권장**

### 핵심 데이터 필드

```
// Google OAuth 프로필
{
  provider: "GOOGLE",
  googleAccessToken: string,
  email: string,
  name: string,
  picture: string
}

// Apple Sign In 프로필
{
  provider: "APPLE",
  appleIdToken: string,
  email: string,     // 최초 로그인 시만 제공
  fullName: string   // 최초 로그인 시만 제공
}
```

### 화면 설계 시사점

- P1 런칭 시에는 구글/애플 버튼 미표시
- P2 도입 시: 카카오/네이버 아래에 구글/애플 버튼 추가
- Apple은 iOS Safari에서만 네이티브 지원 (다른 브라우저는 웹 기반)
- 구글 로그인 버튼은 Google Identity 최신 디자인 가이드 준수

---

## 11. 비회원 주문 허용 (A-2-GUEST)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/guest/orders` | POST | 비회원 주문 생성 |
| `/guest/orders` | GET | 비회원 주문 조회 (주문번호+휴대전화) |
| `/guest/token` | POST | 비회원 토큰 발급 |

### React Provider 컴포넌트

- **GuestOrderProvider**: 비회원 주문 관리
  - `useGuestOrderContext()`: 비회원 주문 상태 및 액션

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 비회원 주문 | shopby 관리자 > 주문설정 | 허용/불허 |
| 비회원 정보 | shopby 관리자 > 주문설정 | 이름+휴대전화+이메일(필수) |

### 제한사항

- 비회원 주문 시 파일 업로드/옵션보관함 등 인쇄 특화 기능 사용 제한 가능
- 비회원 주문 조회는 주문번호 + 휴대전화 조합으로만 가능
- 비회원 주문은 쿠폰/적립금 사용 불가 (shopby 기본 정책)
- 비회원 정보는 shopby에서 90일 후 자동 삭제

### 핵심 데이터 필드

```
// 비회원 주문 조회
Request: { orderNo: string, mobileNo: string }
Response: { orderInfo: {...}, orderProducts: [...] }
```

### 화면 설계 시사점

- 고객센터 > 비회원 주문조회 페이지
- 주문번호 + 휴대전화번호 입력 필드
- 주문 후 안내: "비회원 주문조회는 주문번호와 휴대전화번호로 가능합니다"
- 회원가입 유도: "회원가입 시 쿠폰/적립금 혜택을 받을 수 있습니다"
- 인쇄물 주문 시 비회원 가능 여부 별도 검토 (파일 업로드 제한 가능)

---

## 12. 회원등급 체계 (B-6-GRADE)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members/grades` | GET | 회원등급 목록 조회 |
| `/profile/grade` | GET | 내 회원등급 조회 |
| `/admin/members/grades` | GET/POST/PUT | 관리자 등급 관리 |

### React Provider 컴포넌트

- **MemberGradeProvider**: 회원등급 정보 관리
  - `useMemberGradeContext()`: 현재 등급, 다음 등급, 혜택 정보

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 등급 수 | shopby 관리자 > 회원등급 | 최대 10단계 |
| 산정 기간 | shopby 관리자 > 회원등급 | 1개월/3개월/6개월/1년 |
| 산정 기준 | shopby 관리자 > 회원등급 | 구매금액/구매건수/적립금 |
| 등급별 혜택 | shopby 관리자 > 회원등급 | 적립률, 쿠폰, 무료배송 |

### 제한사항

- shopby 회원등급은 관리자에서 전체 설정 (API로 등급 조건 변경 가능)
- 등급 산정은 shopby 배치에서 자동 처리 (산정 주기에 따라)
- 등급별 적립률 차등 설정 가능
- 등급별 전용 쿠폰 자동 발급 가능

### 핵심 데이터 필드

```
// 등급 목록
Response: {
  grades: [
    {
      gradeNo: number,
      gradeName: string,       // "일반", "실버", "골드", "VIP"
      accumulationRate: number, // 적립률 (%)
      condition: {
        orderAmount: number,    // 기준 구매금액
        orderCount: number      // 기준 구매건수
      },
      benefits: string          // 혜택 설명
    }
  ]
}
```

### 화면 설계 시사점

- 마이페이지 상단에 현재 등급 표시 (배지 스타일)
- "다음 등급까지 N원 남았습니다" 프로그레스 바
- 회원등급 안내 페이지: 등급별 조건 + 혜택 표
- **추천 4단계 체계**:
  - 일반 (가입 시 기본)
  - 실버 (3개월 10만원 이상)
  - 골드 (3개월 30만원 이상)
  - VIP (3개월 50만원 이상)

---

## 13. 회원정보수정 (A-3-10)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/profile` | GET | 회원 프로필 조회 |
| `/profile` | PUT | 회원 프로필 수정 |
| `/profile/password/verify` | POST | 비밀번호 확인 (수정 전 인증) |

### React Provider 컴포넌트

- **MyProfileProvider**: 프로필 정보 관리
  - `useMyProfileContext()`: 프로필 조회/수정 상태 관리

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 수정 가능 필드 | shopby 관리자 > 가입설정 | 이름, 닉네임, 휴대전화, 이메일, 주소 등 |
| 수정 전 인증 | shopby 기본 | 비밀번호 확인 필수 |

### 제한사항

- 아이디(이메일)는 수정 불가 (shopby 정책)
- 이름 변경은 shopby 설정에 따라 허용/불허
- 휴대전화 변경 시 재인증 필요
- 수정 전 비밀번호 확인 화면 거쳐야 함

### 핵심 데이터 필드

```
// 프로필 조회
Response: {
  memberId: string,
  memberName: string,
  mobileNo: string,
  email: string,
  nickname: string,
  birthday: string,
  sex: string,
  address: { zipCode, address, detailAddress },
  grade: { gradeName, gradeNo }
}

// 프로필 수정
Request: {
  memberName: string,
  mobileNo: string,
  nickname: string,
  birthday: string,
  address: { ... }
}
```

### 화면 설계 시사점

- 비밀번호 확인 화면 (수정 전 인증)
- 수정 가능 필드: 이름, 닉네임, 휴대전화(재인증), 주소, 생년월일
- 수정 불가 필드: 이메일(회색 비활성), 가입일
- "수정 완료" 버튼 + 성공 메시지
- 비밀번호 변경은 별도 페이지로 분리

---

## 14. 비밀번호변경 (A-3-12)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/profile/password` | PUT | 비밀번호 변경 |
| `/profile/password/verify` | POST | 현재 비밀번호 확인 |

### React Provider 컴포넌트

- **ChangePasswordProvider**: 비밀번호 변경 관리
  - `useChangePasswordContext()`: 변경 상태 및 유효성 검증

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 비밀번호 규칙 | shopby 관리자 > 보안설정 | 최소 8자, 영문+숫자+특수문자 |
| 변경 주기 안내 | shopby 관리자 > 보안설정 | 90일 권장 변경 알림 |

### 제한사항

- 현재 비밀번호 확인 후 변경 가능
- 최근 3개 비밀번호와 동일한 비밀번호 사용 불가 (shopby 설정)
- 비밀번호 변경 시 모든 기기에서 로그아웃 처리

### 핵심 데이터 필드

```
Request: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}
Response: { result: boolean }
```

### 화면 설계 시사점

- 현재 비밀번호 입력
- 새 비밀번호 입력 + 강도 표시 (약함/보통/강함)
- 새 비밀번호 확인 입력
- 비밀번호 규칙 안내: "영문, 숫자, 특수문자 포함 8자 이상"
- 변경 완료 후 재로그인 유도

---

## 15. 회원탈퇴 (A-3-13)

### 사용 가능 API

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/members` | DELETE | 회원 탈퇴 |
| `/profile/password/verify` | POST | 탈퇴 전 비밀번호 확인 |

### React Provider 컴포넌트

- **WithdrawalProvider**: 회원탈퇴 관리
  - `useWithdrawalContext()`: 탈퇴 상태(사유 선택, 확인, 처리)

### 설정 옵션

| 설정 | 위치 | 값 |
|------|------|-----|
| 탈퇴 사유 | shopby 관리자 > 가입설정 | 사유 목록 커스텀 |
| 재가입 제한 | shopby 관리자 > 가입설정 | 30일/60일/90일/무제한 |
| 탈퇴 시 처리 | shopby 기본 | 적립금 소멸, 쿠폰 소멸 |

### 제한사항

- 미완료 주문이 있으면 탈퇴 불가 (shopby 기본 정책)
- 탈퇴 시 적립금/쿠폰 전액 소멸 (복구 불가)
- 탈퇴 회원 정보 보관: shopby 기본 5년 (전자상거래법)
- 재가입 시 이전 적립금/쿠폰 복구 불가

### 핵심 데이터 필드

```
// 탈퇴 전 안내 정보
{
  remainingPoint: number,     // 잔여 적립금
  remainingCoupon: number,    // 잔여 쿠폰 수
  pendingOrders: number,      // 미완료 주문 수
  canWithdraw: boolean        // 탈퇴 가능 여부
}

// 탈퇴 요청
Request: {
  password: string,
  reason: string,             // 탈퇴 사유
  detailReason: string        // 상세 사유 (선택)
}
```

### 화면 설계 시사점

- 탈퇴 안내사항 (소멸 항목 명시):
  - "잔여 프린팅머니 N원이 소멸됩니다"
  - "잔여 쿠폰 N개가 소멸됩니다"
  - "탈퇴 후 30일간 재가입이 제한됩니다"
- 미완료 주문 시: "진행 중인 주문이 있어 탈퇴가 불가합니다" + 주문조회 링크
- 탈퇴 사유 선택 (드롭다운): 가격 불만족, 서비스 불만족, 이용 빈도 감소, 타 사이트 이용, 기타
- 상세 사유 텍스트 입력 (선택)
- 비밀번호 확인 입력
- "회원탈퇴" 버튼 (빨간색 강조, 확인 팝업)

---

## API 종합 요약

### 기능별 API 매핑 총괄

| 기능 | 주요 API | Provider | 분류 | 개발 범위 |
|------|---------|----------|------|----------|
| 일반 로그인 | `/auth/token` | MemberProvider | NATIVE | 스킨 래핑 |
| 아이디 찾기 | `/members/id` | FindIdProvider | NATIVE | 스킨 래핑 |
| 비밀번호 찾기 | `/members/password` | FindPasswordProvider | NATIVE | 스킨 래핑 |
| 약관동의 | `/terms` | SignUpProvider | SKIN | 스킨 커스텀 |
| 정보입력 | `/members` | SignUpProvider | SKIN | 스킨 커스텀 |
| 이메일 중복 | `/members/id/exist` | SignUpProvider | NATIVE | 스킨 래핑 |
| 휴대전화 인증 | `/members/authentication/sms` | AuthenticationProvider | NATIVE | 설정+스킨 |
| 가입완료 메일 | 자동 트리거 | SignUpProvider | NATIVE | shopby 설정 |
| SNS 카카오/네이버 | `/auth/openid/{provider}` | OpenIdLoginProvider | NATIVE | 설정+스킨 |
| SNS 구글/애플 | 별도 OAuth | 커스텀 Provider | EXTERNAL | 전체 개발(P2) |
| 비회원 주문 | `/guest/orders` | GuestOrderProvider | NATIVE | 스킨 래핑 |
| 회원등급 | `/members/grades` | MemberGradeProvider | NATIVE | shopby 설정 |
| 회원정보수정 | `/profile` | MyProfileProvider | NATIVE | 스킨 래핑 |
| 비밀번호변경 | `/profile/password` | ChangePasswordProvider | NATIVE | 스킨 래핑 |
| 회원탈퇴 | `/members` DELETE | WithdrawalProvider | NATIVE | 스킨 래핑 |

### 개발 규모 분석

| 분류 | 기능 수 | 예상 작업량 | 내용 |
|------|---------|-----------|------|
| **shopby 설정만** | 3개 | S (1~2일) | 가입메일, 등급, 설정 |
| **스킨 래핑** (NATIVE) | 7개 | S~M (2~3일) | 기존 Provider 래핑 + CSS |
| **스킨 커스텀** (SKIN) | 3개 | M (3~5일) | 약관동의, 정보입력, SNS |
| **전체 개발** (EXTERNAL) | 1개 | L (1~2주) | 구글/애플 OAuth (P2) |
| **커스텀 검토** | 1개 | M (3~5일) | 비회원 주문 제한 로직 |
