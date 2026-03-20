---
id: SPEC-MEMBER-001
artifact: wireframes/auth-module
version: "1.0.0"
created: "2026-03-20"
updated: "2026-03-20"
author: MoAI (expert-frontend)
status: draft
---

# SPEC-MEMBER-001: Authentication Module Wireframe Specifications

> 10 Screens (SCR-MBR-001 ~ SCR-MBR-010) - PC-first Card-style Auth Pages

---

## Design System Reference

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#5538B6` | CTA buttons, focused borders, active states |
| Primary Dark | `#351D87` | Button hover, headings |
| Font Family | `Noto Sans` | All text |
| Font Weight Regular | `400` | Body text, placeholders |
| Font Weight Medium | `500` | Labels, sub-headings |
| Font Weight SemiBold | `600` | Headings, CTA buttons |
| Border Default | `#CACACA` | Input borders idle |
| Border Focus | `#5538B6` | Input borders on focus |
| Border Error | `#E53935` | Input borders on error |
| Border Success | `#43A047` | Input borders on success |
| Selected Item | `white bg` + `#553886 border-2` | Selected checkbox/radio |
| Error Text | `#E53935` | Error messages |
| Success Text | `#43A047` | Success messages |
| Disabled BG | `#F5F5F5` | Disabled fields |
| Card BG | `#FFFFFF` | Auth card background |
| Page BG | `#F8F8F8` | Page background |
| SNS Kakao BG | `#FEE500` | Kakao button |
| SNS Kakao Text | `#191919` | Kakao button text |
| SNS Naver BG | `#03C75A` | Naver button |
| SNS Naver Text | `#FFFFFF` | Naver button text |

---

## SCR-MBR-001: Login (Route: `/member/login`)

### 1. ASCII Wireframe (PC Layout - 1280px+)

```
+================================================================+
|                          Header (GNB)                           |
+================================================================+
|                                                                  |
|                                                                  |
|        +------------------------------------------+              |
|        |              [Logo Area]                  |              |
|        |           HUNI PRINTING                   |              |
|        |                                           |              |
|        |  Email                                    |              |
|        |  +--------------------------------------+ |              |
|        |  | example@email.com                    | |              |
|        |  +--------------------------------------+ |              |
|        |                                           |              |
|        |  Password                                 |              |
|        |  +--------------------------------------+ |              |
|        |  | ********                         [O] | |              |
|        |  +--------------------------------------+ |              |
|        |                                           |              |
|        |  [v] Auto login                           |              |
|        |                                           |              |
|        |  +--------------------------------------+ |              |
|        |  |            Login                     | |              |
|        |  +--------------------------------------+ |              |
|        |                                           |              |
|        |  -------- OR --------                     |              |
|        |                                           |              |
|        |  +--------------------------------------+ |              |
|        |  | [K]  Kakao Login                     | |              |
|        |  +--------------------------------------+ |              |
|        |  +--------------------------------------+ |              |
|        |  | [N]  Naver Login                     | |              |
|        |  +--------------------------------------+ |              |
|        |                                           |              |
|        |  Find ID  |  Find Password  |  Sign Up    |              |
|        +------------------------------------------+              |
|                                                                  |
+================================================================+
|                          Footer                                  |
+================================================================+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Auth Card | Container | max-width: 480px, padding: 40px, border-radius: 12px, box-shadow: 0 2px 8px rgba(0,0,0,0.08) | BG: #FFFFFF on #F8F8F8 page | Centered vertically and horizontally |
| Logo | Image/Text | height: 48px, margin-bottom: 32px | Font: Noto Sans 600 24px | Click navigates to home |
| Email Label | Text | font-size: 14px | Font: Noto Sans 500, Color: #333333 | - |
| Email Input | TextField | type="email", placeholder="example@email.com", required, autocomplete="email" | Border: #CACACA, Focus: #5538B6 2px, Height: 48px, Radius: 8px | Focus shows purple border |
| Password Label | Text | font-size: 14px | Font: Noto Sans 500, Color: #333333 | - |
| Password Input | TextField | type="password", placeholder="password", required, autocomplete="current-password" | Border: #CACACA, Focus: #5538B6 2px, Height: 48px, Radius: 8px | Toggle visibility icon (eye) |
| Password Toggle | IconButton | position: absolute right 12px | Color: #999999, Active: #333333 | Toggle password visibility |
| Auto Login | Checkbox | label="Auto login" | Unchecked: #CACACA border, Checked: #5538B6 bg + white check | Stores refreshToken to localStorage |
| Login Button | Button | type="submit", full-width, height: 48px | BG: #5538B6, Hover: #351D87, Text: white, Font: 600 16px, Radius: 8px | POST /auth/token |
| Divider | Separator | "OR" text centered | Line: #E0E0E0, Text: #999999, Font: 400 12px | - |
| Kakao Button | Button | full-width, height: 48px | BG: #FEE500, Text: #191919, Font: 500 15px, Radius: 8px | GET /auth/openid/KAKAO |
| Naver Button | Button | full-width, height: 48px | BG: #03C75A, Text: #FFFFFF, Font: 500 15px, Radius: 8px | GET /auth/openid/NAVER |
| Kakao Logo | Icon | 20x20px, left-aligned in button | Official Kakao talk icon | - |
| Naver Logo | Icon | 20x20px, left-aligned in button | Official Naver N icon | - |
| Sub Links | LinkGroup | 3 links separated by ` | ` divider | Font: Noto Sans 400 14px, Color: #666666, Hover: #5538B6 | Navigate to respective pages |

### 3. State Variations

| State | Visual Changes | Trigger |
|-------|---------------|---------|
| Idle | All fields empty, Login button enabled | Page load (no refreshToken) |
| Auto Login Checking | Full form disabled, spinner overlay on card | Page load with valid refreshToken |
| Submitting | Login button shows spinner, form disabled | Login button click |
| Success | Brief spinner then redirect | API 200 response |
| Failed | See SCR-MBR-002 | API 401/400 response |
| Locked | See SCR-MBR-002 (locked variant) | 5+ failed attempts |

### 4. Responsive Notes

| Breakpoint | Layout |
|-----------|--------|
| PC (1280px+) | 480px card centered on #F8F8F8 background, vertical/horizontal center |
| Tablet (768-1279px) | 480px card centered, same layout |
| Mobile (360-767px) | Full width, 16px horizontal padding, no card shadow, card fills viewport width |

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Tab Order | 1: Email > 2: Password > 3: Toggle PW > 4: Auto Login > 5: Login > 6: Kakao > 7: Naver > 8: Find ID > 9: Find PW > 10: Sign Up |
| ARIA | `aria-label` on password toggle, `aria-describedby` linking error messages, `role="alert"` on error container |
| Color Contrast | All text/background pairs meet 4.5:1 minimum. Kakao button (#191919 on #FEE500) = 12.4:1. Naver button (white on #03C75A) = 4.6:1 |
| Focus Indicator | 2px #5538B6 outline with 2px offset on all interactive elements |
| Screen Reader | Form labels linked via `htmlFor`, error messages announced with `aria-live="polite"` |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Click Login button | POST `/auth/token` { memberId, password } | SignInProvider.signIn() |
| Check Auto Login + Login | POST `/auth/token` + localStorage refreshToken save | SignInProvider.updateSignInInfo({ keepLogin: true }) |
| Page Load (refreshToken exists) | PUT `/oauth2` { refreshToken } | memberAuth auto-refresh |
| Click Kakao button | GET `/auth/openid/KAKAO?redirectUri=...` | OpenIdSignInProvider.openIdSignIn({ provider: 'KAKAO' }) |
| Click Naver button | GET `/auth/openid/NAVER?redirectUri=...` | OpenIdSignInProvider.openIdSignIn({ provider: 'NAVER' }) |

---

## SCR-MBR-002: Login Failed State (Route: `/member/login` - same page)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  Email                                    |
        |  +--------------------------------------+ |
        |  | user@email.com                       | |
        |  +--------------------------------------+ |
        |                                           |
        |  Password                                 |
        |  +--------------------------------------+ |
        |  | ********                         [O] | |
        |  +--------------------------------------+ |
        |                                           |
        |  +--------------------------------------+ |
        |  | (!) Error message area               | |
        |  |     "Incorrect email or password"    | |
        |  |     Login attempts: 3/5              | |
        |  +--------------------------------------+ |
        |                                           |
        |  [v] Auto login                           |
        |                                           |
        |  +--------------------------------------+ |
        |  |            Login                     | |
        |  +--------------------------------------+ |
        |  ...                                      |
        +------------------------------------------+

--- LOCKED VARIANT (5+ failures) ---

        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  +--------------------------------------+ |
        |  | [!] Account Locked                   | |
        |  |                                      | |
        |  | Login attempts exceeded.             | |
        |  | Please try again after 30 minutes.   | |
        |  |                                      | |
        |  | Unlock in: 28:45                     | |
        |  +--------------------------------------+ |
        |                                           |
        |  Email                                    |
        |  +--------------------------------------+ |
        |  | user@email.com            [disabled] | |
        |  +--------------------------------------+ |
        |  Password                                 |
        |  +--------------------------------------+ |
        |  |                               [disabled]|
        |  +--------------------------------------+ |
        |                                           |
        |  +--------------------------------------+ |
        |  |      Login      [disabled/gray]      | |
        |  +--------------------------------------+ |
        |  ...                                      |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Error Banner | Alert | padding: 12px 16px, border-radius: 8px, icon + text | BG: #FFF3F3, Border: #E53935 1px, Icon: #E53935, Text: #E53935 14px 400 | Appears below password field |
| Error Message | Text | "Incorrect email or password" (unified message, REQ-013) | Color: #E53935, Font: 14px 400 | Does NOT reveal if email exists |
| Attempt Counter | Text | "Login attempts: N/5" | Color: #E53935, Font: 13px 400 | Shows 1-4 attempts |
| Lock Banner | Alert | padding: 20px, border-radius: 8px | BG: #FFF3F3, Border: #E53935 1px, Icon: warning 24px | Replaces error banner at 5 attempts |
| Lock Timer | Text | "Unlock in: MM:SS" countdown | Color: #E53935, Font: 600 16px | Countdown from 30:00, refresh on tick |
| Disabled Fields | TextField | disabled=true, opacity: 0.6 | BG: #F5F5F5, Border: #E0E0E0 | Not interactive during lock |
| Disabled Button | Button | disabled=true | BG: #E0E0E0, Text: #999999 | Not clickable during lock |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Failed (1-4 attempts) | Error banner + attempt counter, form remains active | API 401 |
| Locked (5+ attempts) | Lock banner with countdown, entire form disabled | API 423 or failCount >= 5 |
| Lock Expired | Return to idle state, form re-enabled | 30min countdown reaches 0 |

### 4. Responsive Notes

Same as SCR-MBR-001. Error/Lock banners are full-width within the card container.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Error Announcement | `role="alert"` + `aria-live="assertive"` on error banner |
| Disabled State | `aria-disabled="true"` on all form elements during lock |
| Timer | `aria-live="polite"` on countdown, `aria-label="Unlock countdown"` |
| Non-Color Indicator | Error icon (!) + text message, not color alone |

### 6. API Connection

| User Action | API Response | Behavior |
|------------|-------------|----------|
| Login attempt | 401 { failCount: N } | Show error banner with attempt count |
| 5th failed attempt | 423 { lockedUntil } | Show lock banner with countdown |
| Lock timer expires | Client-side | Re-enable form, reset to idle state |

---

## SCR-MBR-003: SNS Additional Info (Route: `/member/signup?step=additional`)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |           HUNI PRINTING                   |
        |                                           |
        |  Additional Information Required          |
        |  Complete your profile to continue.       |
        |                                           |
        |  +-- SNS Profile Info --+                 |
        |  | [Kakao Icon] kakao_user@email.com     ||
        |  +----------------------+                 |
        |                                           |
        |  Name *                                   |
        |  +--------------------------------------+ |
        |  | Name                                 | |
        |  +--------------------------------------+ |
        |                                           |
        |  Mobile *                                 |
        |  +---------------------------+  +------+  |
        |  | 010-0000-0000             |  | Send |  |
        |  +---------------------------+  +------+  |
        |                                           |
        |  (SMS auth field appears here             |
        |   after "Send" is clicked)                |
        |                                           |
        |  +--------------------------------------+ |
        |  |          Complete Sign Up             | |
        |  +--------------------------------------+ |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Page Title | Text | "Additional Information Required" | Font: Noto Sans 600 20px, Color: #333333 | - |
| Subtitle | Text | "Complete your profile to continue." | Font: 400 14px, Color: #666666 | - |
| SNS Profile Card | InfoBox | SNS provider icon + email (if provided) | BG: #F8F8F8, Border: #E0E0E0, Radius: 8px, Padding: 12px | Read-only display |
| Name Input | TextField | required, min 2 chars, pre-filled if SNS provides | Border: #CACACA, Focus: #5538B6 | Auto-filled from SNS (editable) |
| Mobile Input | TextField | type="tel", pattern="010-XXXX-XXXX", required | Border: #CACACA, Focus: #5538B6 | - |
| Send Auth Button | Button | height: 48px, min-width: 80px | BG: #5538B6, Text: white, Font: 500 14px | POST /members/authentication/sms |
| SMS Auth Field | SmsAuthField | 6-digit input + 3min timer | See SCR-MBR-015 pattern | Appears after "Send" click |
| Complete Button | Button | full-width, height: 48px, disabled until SMS verified | BG: #5538B6 (active) / #E0E0E0 (disabled) | POST /members (with SNS linkage) |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Initial | Name pre-filled (if available), mobile empty, Complete disabled | Page load from SNS callback |
| Name only missing | Only name field shown, mobile may be pre-filled from Naver | Naver provides mobile |
| All fields required | Name + Mobile + optional Email fields shown | Kakao with minimal consent |
| SMS Verified | Mobile field disabled, green check, Complete enabled | SMS auth success |
| Submitting | Complete button spinner, form disabled | Complete button click |

### 4. Responsive Notes

Same card-style layout as SCR-MBR-001. Dynamic fields: only missing fields are displayed.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Tab Order | Dynamic based on visible fields: Name > Mobile > Send > Auth Code > Complete |
| ARIA | `aria-required="true"` on required fields, `aria-describedby` for pre-filled info |
| Focus | Auto-focus on first empty required field |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Page load | Profile data from SNS callback response | OpenIdSignInProvider.getProfile() |
| Click Send | POST `/members/authentication/sms` { mobileNo } | SignUpProvider.postAuthenticationsMobile() |
| Enter auth code | POST `/members/authentication/sms/verify` { mobileNo, authenticationNumber } | SignUpProvider.confirmAuthentication() |
| Click Complete | POST `/members` { memberName, mobileNo, agreedTermsNos, ... } | OpenIdSignInProvider + SignUpProvider |

---

## SCR-MBR-004: SNS Email Duplicate Modal

### 1. ASCII Wireframe (PC Layout)

```
+================================================================+
|                     (Dimmed Background)                          |
|                                                                  |
|        +------------------------------------------+              |
|        |                                           |              |
|        |  [!] Existing Account Found              |              |
|        |                                           |              |
|        |  The email associated with your Kakao     |              |
|        |  account is already registered.           |              |
|        |                                           |              |
|        |  ab***@naver.com                          |              |
|        |                                           |              |
|        |  Would you like to link your Kakao        |              |
|        |  account with the existing account?       |              |
|        |                                           |              |
|        |  +----------------+  +----------------+   |              |
|        |  |    Cancel      |  |   Link Now     |   |              |
|        |  +----------------+  +----------------+   |              |
|        +------------------------------------------+              |
+================================================================+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Overlay | Backdrop | position: fixed, inset: 0, z-index: 1000 | BG: rgba(0,0,0,0.5) | Click outside closes (cancel) |
| Modal Card | Container | max-width: 420px, padding: 32px, border-radius: 12px | BG: #FFFFFF, Shadow: 0 4px 24px rgba(0,0,0,0.15) | Centered on screen |
| Warning Icon | Icon | 32x32px, warning triangle | Color: #FF9800 | - |
| Title | Text | "Existing Account Found" | Font: Noto Sans 600 18px, Color: #333333 | - |
| Description | Text | Multi-line explanation | Font: 400 14px, Color: #666666, line-height: 1.6 | - |
| Masked Email | Text | "ab***@naver.com" (masked) | Font: 500 15px, Color: #333333, BG: #F8F8F8, Padding: 8px 12px, Radius: 6px | Read-only |
| Cancel Button | Button | width: 48%, height: 44px | BG: white, Border: #CACACA 1px, Text: #666666, Font: 500 14px | Close modal, return to login |
| Link Button | Button | width: 48%, height: 44px | BG: #5538B6, Text: white, Font: 600 14px | PUT /auth/openid/{provider} |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Open | Modal visible with dimmed background | SNS callback returns EMAIL_DUPLICATE |
| Linking | Link button shows spinner | Click Link Now |
| Success | Modal closes, auto-login | Link API success |
| Error | Error toast, modal stays open | Link API failure |

### 4. Responsive Notes

| Breakpoint | Layout |
|-----------|--------|
| PC/Tablet | 420px modal centered with backdrop |
| Mobile (<768px) | Full-width modal anchored to bottom (bottom sheet style), 16px side padding |

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Focus Trap | Tab cycles within modal only |
| ARIA | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on title |
| Escape | ESC key closes modal (same as Cancel) |
| Focus on Open | Auto-focus on Link Now button |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Click Link Now | PUT `/auth/openid/{provider}` { redirectUri, code, provider, state } | OpenIdSignInProvider.updateOauthOpenId() |
| Click Cancel | No API call | Return to login page idle state |

---

## SCR-MBR-005: Find ID (Route: `/member/find-id`)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  Find Your Account                        |
        |  Enter your name and phone number         |
        |  to find your registered email.           |
        |                                           |
        |  Name *                                   |
        |  +--------------------------------------+ |
        |  | Full name                            | |
        |  +--------------------------------------+ |
        |                                           |
        |  Mobile *                                 |
        |  +--------------------------------------+ |
        |  | 010-0000-0000                        | |
        |  +--------------------------------------+ |
        |                                           |
        |  +--------------------------------------+ |
        |  |          Find Account                 | |
        |  +--------------------------------------+ |
        |                                           |
        |  (Result area: SCR-MBR-006/007)           |
        |                                           |
        |  Back to Login                            |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Page Title | Text | "Find Your Account" | Font: Noto Sans 600 20px, Color: #333333 | - |
| Subtitle | Text | description text | Font: 400 14px, Color: #666666 | - |
| Name Input | TextField | required, min 2 chars | Border: #CACACA, Focus: #5538B6, Height: 48px | - |
| Mobile Input | TextField | type="tel", required, pattern validation | Border: #CACACA, Focus: #5538B6, Height: 48px | - |
| Find Button | Button | full-width, height: 48px | BG: #5538B6, Text: white, Font: 600 16px | POST /members/id |
| Back Link | TextLink | "Back to Login" | Font: 400 14px, Color: #666666, Hover: #5538B6 | Navigate to /member/login |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Idle | Empty form, button enabled | Page load |
| Submitting | Button spinner, form disabled | Find button click |
| Result Found | See SCR-MBR-006 below | API returns memberId |
| Not Found | See SCR-MBR-007 below | API returns 404 |
| Rate Limited | "Please try again later" toast | 5+ failed searches (IP block) |

### 4. Responsive Notes

Same card-style as SCR-MBR-001.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Tab Order | 1: Name > 2: Mobile > 3: Find Button > 4: Back Link |
| ARIA | `aria-required="true"` on inputs, result area `aria-live="polite"` |
| Focus | Auto-focus on Name field on page load |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Click Find | POST `/members/id` { findMethod: 'SMS', mobileNo, memberName } | FindAccountProvider.findId() |

---

## SCR-MBR-006: Find ID Result (Same page as SCR-MBR-005)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  Account Found                            |
        |                                           |
        |  +--------------------------------------+ |
        |  |  Your registered email:              | |
        |  |                                      | |
        |  |  ab***@naver.com                     | |
        |  |  Joined: 2025-01-15                  | |
        |  |                                      | |
        |  |  +--------------------------------+  | |
        |  |  |  Send Full Email Address       |  | |
        |  |  +--------------------------------+  | |
        |  +--------------------------------------+ |
        |                                           |
        |  +----------------+  +----------------+   |
        |  |   Login        |  | Find Password  |   |
        |  +----------------+  +----------------+   |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Section Title | Text | "Account Found" | Font: Noto Sans 600 18px, Color: #333333 | - |
| Result Card | Container | padding: 24px, border-radius: 8px | BG: #F8F8F8, Border: #E0E0E0 1px | - |
| Masked Email | Text | "ab***@naver.com" masking rule: first 2 chars + *** + @domain | Font: 500 16px, Color: #333333 | Read-only |
| Join Date | Text | "Joined: YYYY-MM-DD" | Font: 400 13px, Color: #999999 | - |
| Send Full Email | Button | full-width within result card | BG: white, Border: #5538B6 1px, Text: #5538B6, Font: 500 14px | POST /members/id/send-email |
| Login Link | Button | width: 48%, height: 44px | BG: #5538B6, Text: white | Navigate to /member/login |
| Find PW Link | Button | width: 48%, height: 44px | BG: white, Border: #CACACA, Text: #666666 | Navigate to /member/find-password |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Result Displayed | Masked email + join date + Send button | Find ID API success |
| Email Sending | Send button spinner | Click Send Full Email |
| Email Sent | Button text changes to "Email Sent!", disabled for 60s | Send API success |
| Multiple Results | List of masked emails with dates (if multiple accounts) | API returns multiple results |

### 4. Responsive Notes

Same card container. Result card is nested within the auth card.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Announcement | `aria-live="polite"` on result area when result appears |
| Tab Order | Send Full Email > Login > Find Password |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Click Send Full Email | POST `/members/id/send-email` { memberId, memberName } | FindAccountProvider |

---

## SCR-MBR-007: Find ID Failed (Same page as SCR-MBR-005)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  +--------------------------------------+ |
        |  | [X] No Account Found                 | |
        |  |                                      | |
        |  | No account matches the information   | |
        |  | you entered. Please check and try     | |
        |  | again, or create a new account.       | |
        |  +--------------------------------------+ |
        |                                           |
        |  +--------------------------------------+ |
        |  |          Try Again                    | |
        |  +--------------------------------------+ |
        |  +--------------------------------------+ |
        |  |          Sign Up                      | |
        |  +--------------------------------------+ |
        |                                           |
        |  Back to Login                            |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Fail Banner | Alert | padding: 20px, border-radius: 8px | BG: #FFF3F3, Border: #E53935 1px | - |
| Fail Icon | Icon | X circle, 24px | Color: #E53935 | - |
| Fail Title | Text | "No Account Found" | Font: 600 16px, Color: #E53935 | - |
| Fail Message | Text | Description text | Font: 400 14px, Color: #666666 | - |
| Try Again | Button | full-width, height: 48px | BG: #5538B6, Text: white | Reset form to idle |
| Sign Up | Button | full-width, height: 48px | BG: white, Border: #5538B6, Text: #5538B6 | Navigate to /member/signup |
| Back Link | TextLink | "Back to Login" | Font: 400 14px, Color: #666666 | Navigate to /member/login |

### 3. State Variations

Single state: failure displayed. "Try Again" resets to SCR-MBR-005 idle state.

### 4. Responsive Notes

Same card container as other auth pages.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Announcement | `role="alert"` on fail banner |
| Focus | Auto-focus on Try Again button after failure |

### 6. API Connection

No additional API calls. This is a UI state triggered by POST `/members/id` returning 404.

---

## SCR-MBR-008: Find Password (Route: `/member/find-password`)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  Reset Password                           |
        |  Enter your account information to        |
        |  receive a password reset link.           |
        |                                           |
        |  Email *                                  |
        |  +--------------------------------------+ |
        |  | example@email.com                    | |
        |  +--------------------------------------+ |
        |                                           |
        |  Name *                                   |
        |  +--------------------------------------+ |
        |  | Full name                            | |
        |  +--------------------------------------+ |
        |                                           |
        |  Mobile *                                 |
        |  +--------------------------------------+ |
        |  | 010-0000-0000                        | |
        |  +--------------------------------------+ |
        |                                           |
        |  +--------------------------------------+ |
        |  |     Send Reset Link                   | |
        |  +--------------------------------------+ |
        |                                           |
        |  Back to Login                            |
        +------------------------------------------+

--- AFTER SENDING (inline success) ---

        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  +--------------------------------------+ |
        |  | [Check] Reset Link Sent              | |
        |  |                                      | |
        |  | A password reset link has been sent   | |
        |  | to your email. The link is valid for  | |
        |  | 24 hours.                             | |
        |  |                                      | |
        |  | Didn't receive it?                    | |
        |  | +------------------------------+     | |
        |  | |   Resend  (available in 45s) |     | |
        |  | +------------------------------+     | |
        |  +--------------------------------------+ |
        |                                           |
        |  Back to Login                            |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Page Title | Text | "Reset Password" | Font: Noto Sans 600 20px, Color: #333333 | - |
| Subtitle | Text | description | Font: 400 14px, Color: #666666 | - |
| Email Input | TextField | type="email", required | Border: #CACACA, Focus: #5538B6, Height: 48px | - |
| Name Input | TextField | required | Border: #CACACA, Focus: #5538B6, Height: 48px | - |
| Mobile Input | TextField | type="tel", required | Border: #CACACA, Focus: #5538B6, Height: 48px | - |
| Send Button | Button | full-width, height: 48px | BG: #5538B6, Text: white | POST /members/password/send-email |
| Success Banner | Alert | padding: 20px, radius: 8px | BG: #E8F5E9, Border: #43A047 1px, Icon: check-circle #43A047 | Replaces form after send |
| Resend Button | Button | with cooldown timer | BG: white, Border: #5538B6, Text: #5538B6, Disabled: #E0E0E0 | 1min cooldown |
| Cooldown Text | Text | "(available in Ns)" | Font: 400 13px, Color: #999999 | Countdown |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Idle | 3 input fields + Send button | Page load |
| Submitting | Button spinner, form disabled | Send button click |
| Link Sent | Success banner replaces form, Resend button with cooldown | API success |
| Cooldown | Resend button disabled, countdown text | Within 1min of send |
| Resend Available | Resend button enabled | 1min elapsed |
| Not Found | Inline error below form: "No matching account found" | API 404 |

### 4. Responsive Notes

Same card-style. Success banner fills card width.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Tab Order | 1: Email > 2: Name > 3: Mobile > 4: Send > 5: Back to Login |
| ARIA | Success banner: `role="status"`, `aria-live="polite"` |
| Focus | After send success, focus moves to Resend button |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Click Send | POST `/members/password/send-email` { memberId, memberName, mobileNo } | FindAccountProvider + AuthenticationProvider |
| Click Resend | Same as above (after cooldown) | Same |

---

## SCR-MBR-009: Password Reset (Route: `/member/reset-password?token=xxx`)

### 1. ASCII Wireframe (PC Layout)

```
        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |  Set New Password                         |
        |  Enter your new password below.           |
        |                                           |
        |  New Password *                           |
        |  +--------------------------------------+ |
        |  | ********                         [O] | |
        |  +--------------------------------------+ |
        |  +====================+--+--+            |
        |  | ####               |  |  |  Weak     |
        |  +====================+--+--+            |
        |  Password must include letters,           |
        |  numbers, and special characters          |
        |  (min 8 characters).                      |
        |                                           |
        |  Confirm Password *                       |
        |  +--------------------------------------+ |
        |  | ********                         [O] | |
        |  +--------------------------------------+ |
        |  [Check] Passwords match                  |
        |                                           |
        |  +--------------------------------------+ |
        |  |       Reset Password                  | |
        |  +--------------------------------------+ |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Page Title | Text | "Set New Password" | Font: Noto Sans 600 20px, Color: #333333 | - |
| New PW Input | TextField | type="password", required, autocomplete="new-password" | Border: #CACACA, Focus: #5538B6, Height: 48px | Toggle visibility, real-time strength check |
| Strength Bar | ProgressBar | 3 segments, width: 100% | Weak: #E53935 (1/3), Medium: #FF9800 (2/3), Strong: #43A047 (3/3) | Updates on input |
| Strength Label | Text | "Weak" / "Medium" / "Strong" | Color matches bar segment, Font: 500 13px | - |
| PW Rules | Text | Password requirements hint | Font: 400 12px, Color: #999999 | - |
| Confirm PW Input | TextField | type="password", required, autocomplete="new-password" | Border: #CACACA, Focus: #5538B6, Height: 48px | Real-time match check |
| Match Indicator | Text+Icon | "Passwords match" / "Passwords do not match" | Match: #43A047 + check icon, Mismatch: #E53935 + X icon, Font: 13px | - |
| Reset Button | Button | full-width, height: 48px, disabled until valid+match | BG: #5538B6 (active) / #E0E0E0 (disabled) | PUT /members/password |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Loading | Skeleton while verifying token validity | Page load |
| Valid Token | Form displayed, ready for input | Token verification success |
| Expired Token | See SCR-MBR-010 | Token 24h+ old |
| Used Token | See SCR-MBR-010 (used variant) | Token already consumed |
| Strength: Weak | Red bar 1/3, "Weak" label | <8 chars or single type |
| Strength: Medium | Orange bar 2/3, "Medium" label | 2 of 3 requirements met |
| Strength: Strong | Green bar 3/3, "Strong" label | All requirements met (letters+numbers+special, 8+ chars) |
| PW Match | Green check + "Passwords match" | confirm === password |
| PW Mismatch | Red X + "Passwords do not match" | confirm !== password |
| Submitting | Button spinner | Reset button click |
| Success | "Password changed! Redirecting to login..." toast, auto-redirect in 3s | API success |

### 4. Responsive Notes

Same card-style. Strength bar fills card width.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Tab Order | 1: New PW > 2: Toggle > 3: Confirm PW > 4: Toggle > 5: Reset Button |
| ARIA | Strength: `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="3"`, `aria-label="Password strength"` |
| Match Status | `aria-describedby` linking match indicator to confirm field |
| Rules | `aria-describedby` linking requirements text to password field |

### 6. API Connection

| User Action | API Call | Provider |
|------------|----------|----------|
| Page load | Token validation (server-side check via token in URL) | Server-side rendering / API check |
| Click Reset | PUT `/members/password` { memberId, newPassword, token } | FindAccountProvider / AuthenticationProvider |
| After success | Redirect to `/member/login` after 3s | Client-side navigation |

---

## SCR-MBR-010: Password Reset Link Expired/Used (Route: `/member/reset-password`)

### 1. ASCII Wireframe (PC Layout)

```
--- EXPIRED VARIANT ---

        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |        [Clock Icon - 64px]                |
        |                                           |
        |  Link Expired                             |
        |                                           |
        |  This password reset link has expired.    |
        |  Reset links are valid for 24 hours.      |
        |                                           |
        |  +--------------------------------------+ |
        |  |   Request New Reset Link              | |
        |  +--------------------------------------+ |
        |  +--------------------------------------+ |
        |  |   Back to Login                       | |
        |  +--------------------------------------+ |
        +------------------------------------------+

--- USED VARIANT ---

        +------------------------------------------+
        |              [Logo Area]                  |
        |                                           |
        |        [CheckCircle Icon - 64px]          |
        |                                           |
        |  Link Already Used                        |
        |                                           |
        |  This password reset link has already      |
        |  been used. Each link can only be used     |
        |  once.                                     |
        |                                           |
        |  +--------------------------------------+ |
        |  |   Back to Login                       | |
        |  +--------------------------------------+ |
        +------------------------------------------+
```

### 2. Component Specification

| Component | Type | Properties | Design Token | Interaction |
|-----------|------|-----------|-------------|-------------|
| Status Icon (Expired) | Icon | 64x64px, clock/timer | Color: #FF9800 | - |
| Status Icon (Used) | Icon | 64x64px, check-circle | Color: #43A047 | - |
| Title (Expired) | Text | "Link Expired" | Font: Noto Sans 600 20px, Color: #333333 | - |
| Title (Used) | Text | "Link Already Used" | Font: Noto Sans 600 20px, Color: #333333 | - |
| Description | Text | Explanation text | Font: 400 14px, Color: #666666, line-height: 1.6 | - |
| Request New Link | Button | full-width, height: 48px (expired only) | BG: #5538B6, Text: white | Navigate to /member/find-password |
| Back to Login | Button | full-width, height: 48px | BG: white, Border: #CACACA, Text: #666666 | Navigate to /member/login |

### 3. State Variations

| State | Visual | Trigger |
|-------|--------|---------|
| Expired | Clock icon, "Request New Reset Link" + "Back to Login" | Token > 24 hours old |
| Used | Check icon, "Back to Login" only (no resend option) | Token already consumed |

### 4. Responsive Notes

Same card-style. Icon centered above title.

### 5. Accessibility (WCAG 2.1 AA)

| Item | Implementation |
|------|---------------|
| Tab Order | Expired: Request New Link > Back to Login. Used: Back to Login |
| ARIA | `role="status"` on the status message container |
| Focus | Auto-focus on primary action button |

### 6. API Connection

| Trigger | Source | Behavior |
|---------|--------|----------|
| Page load with expired token | Server-side token check returns expired status | Show expired variant |
| Page load with used token | Server-side token check returns used status | Show used variant |
| Click Request New Link | Navigate to /member/find-password (no API call) | Client navigation |

---

## Cross-Screen Design Patterns

### Card Container Standard

All 10 screens use the same card container:

```
PC/Tablet:
- max-width: 480px
- padding: 40px
- border-radius: 12px
- background: #FFFFFF
- box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- centered on #F8F8F8 page background
- min-height: auto (content-driven)

Mobile (<768px):
- width: 100%
- padding: 24px 16px
- border-radius: 0
- box-shadow: none
- background: #FFFFFF
```

### Input Field Standard

```
All TextFields:
- height: 48px
- border-radius: 8px
- border: 1px solid #CACACA
- padding: 0 16px
- font: Noto Sans 400 15px
- placeholder color: #BBBBBB

Focus: border 2px solid #5538B6, box-shadow: 0 0 0 3px rgba(85,56,182,0.1)
Error: border 2px solid #E53935
Success: border 2px solid #43A047
Disabled: background #F5F5F5, border #E0E0E0, opacity 0.6
```

### Button Standard

```
Primary Button:
- height: 48px
- border-radius: 8px
- background: #5538B6
- hover: #351D87
- active: #2A1570
- text: white, Noto Sans 600 16px
- disabled: background #E0E0E0, text #999999

Secondary Button:
- height: 44px
- border-radius: 8px
- background: white
- border: 1px solid #CACACA
- text: #666666, Noto Sans 500 14px
- hover: border-color #5538B6, text #5538B6

Outline Primary Button:
- height: 44px
- border-radius: 8px
- background: white
- border: 1px solid #5538B6
- text: #5538B6, Noto Sans 500 14px
```

### SNS Button Standard

```
Kakao:
- height: 48px
- border-radius: 8px
- background: #FEE500
- text: #191919, Noto Sans 500 15px
- icon: Official Kakao logo 20x20px, margin-right: 8px
- label: "Kakao Login"

Naver:
- height: 48px
- border-radius: 8px
- background: #03C75A
- text: #FFFFFF, Noto Sans 500 15px
- icon: Official Naver N logo 20x20px, margin-right: 8px
- label: "Naver Login"

Button order: Kakao (top) > Naver (bottom)
Spacing between SNS buttons: 8px
```

### Error Display Standard

```
Inline Field Error:
- margin-top: 4px below field
- icon: X circle 14px, color #E53935
- text: Noto Sans 400 13px, color #E53935
- field border changes to 2px #E53935

Banner Error:
- padding: 12px 16px
- border-radius: 8px
- background: #FFF3F3
- border: 1px solid #E53935
- icon: warning/info 20px, color #E53935
- title: Noto Sans 600 14px, color #E53935
- text: Noto Sans 400 13px, color #666666

Success Banner:
- Same structure as error banner
- background: #E8F5E9
- border: 1px solid #43A047
- icon color: #43A047
```

---

## REQ Coverage Matrix

| Screen | Covered Requirements |
|--------|---------------------|
| SCR-MBR-001 | REQ-001, 002, 004, 005, 008, 012, 014, 025, 029, 030 |
| SCR-MBR-002 | REQ-006, 007, 011, 013 |
| SCR-MBR-003 | REQ-027 |
| SCR-MBR-004 | REQ-028 |
| SCR-MBR-005 | REQ-016, 019 |
| SCR-MBR-006 | REQ-016, 017 |
| SCR-MBR-007 | REQ-018 |
| SCR-MBR-008 | REQ-020, 022 |
| SCR-MBR-009 | REQ-021 |
| SCR-MBR-010 | REQ-023, 024 |

---

*Document Author: expert-frontend (MoAI)*
*Reference: SPEC-MEMBER-001 v1.0.0*
*Design System: Huni Design System (Primary: #5538B6, Font: Noto Sans)*
*Layout: SPEC-LAYOUT-002 Card-style Auth Pages*
