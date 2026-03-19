---
description: "후니프린팅 화면 설계 가이드 조회. 화면 ID, 도메인 개요, 템플릿, 컴포넌트, 정책, 패턴을 조회합니다."
argument-hint: "SCR-A1-LOGIN | SCR-B4 | template NATIVE | component StepIndicator | policy | pattern wizard"
---

Use the huni-screen-designer subagent to process the user's screen design guide query.

Pass the following arguments to the agent: $ARGUMENTS

The agent will:
1. Parse the argument type (screen ID, domain prefix, template, component, policy, or pattern)
2. Load the appropriate file from `.claude/skills/innojini-huni-screen-guide/`
3. Return the design guide in structured Korean format

Usage examples:
- `/huni-screen SCR-A1-LOGIN` - Login screen detailed design spec
- `/huni-screen SCR-B4` - B-4 Product Management domain overview (all screens)
- `/huni-screen template NATIVE` - NATIVE screen design template
- `/huni-screen component StepIndicator` - StepIndicator component catalog entry
- `/huni-screen policy` - Policy defaults (shipping, payment, coupon, review, grades)
- `/huni-screen pattern wizard` - Wizard/step design pattern guide
