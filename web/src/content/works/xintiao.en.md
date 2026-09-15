---
title: "Xintiao — Native WeChat Mini Program"
category: "digital"
summary: "A lightweight tool centered on today’s earned income, connecting a salary calendar, daily records and three-step onboarding."
role: "Product, interaction, visual and WeChat adaptation participation"
credits: "Salary core reused from MrBaoboer/PayDance under AGPL-3.0-only; not an official PayDance product; presented as collaborative work"
status: "Native mini-program development and validation"
cover: "/works/refinement-digital/xintiao/home-native.png"
tags: ["WeChat mini program","Product interaction","Open-source reuse","Local data"]
---

## Background

Xintiao opens directly on today's earned amount, with calendar and detail views available when needed. Work state, countdown, progress and summary figures explain the amount. The character and small desk tools provide feedback while income remains the main focus.

## My role

Participation covers product structure, interaction, visual design and adaptation to WeChat. The salary core comes from [MrBaoboer/PayDance](https://github.com/MrBaoboer/PayDance), including salary configuration, work spans, overnight shifts, snapshots and validation. Original attribution and AGPL-3.0-only notices remain. Xintiao is an independent mini-program project based on that core, not an official PayDance product; the core is not claimed as original work from scratch.

## Key question

Income must follow work-span rules rather than animation, including overnight shifts and lunch breaks. Initial setup needs to be understandable without interrupting everyday review.

## Design process

Three onboarding steps establish salary type, work hours and lunch breaks, validating the relevant inputs at each step. Completion returns to Today. The amount is recomputed from real time; the heartbeat controls refresh frequency rather than accumulating income in the background. Overnight shifts follow the reused salary core's work-span logic.

The primary navigation is Today / Days. Days connects a calendar and monthly summaries to daily income estimates, hours, overtime, mood and a short note. Settings have a separate entry. Appearance settings collect theme, currency symbol and reduced motion options while preserving the amount and state hierarchy.

## Final work

The toaster character uses different poses for onboarding and state feedback. The current asset set contains ten PNG poses, presented through a shared component. Native pages, components, subpackages and local storage form the WeChat implementation; it is not webpage imagery inside a WebView.

![Xintiao native home screen](/works/refinement-digital/xintiao/home-native.png)

*Actual WeChat DevTools runtime capture with the default ¥10,000 monthly salary, 22 workdays and 09:30–18:30 shift. These are demonstration inputs, not personal income.*

![Salary configuration in Xintiao onboarding](/works/refinement-digital/xintiao/onboarding-native.png)

*Choose monthly, daily or hourly pay, then set work hours and lunch. This capture shows the first of three steps.*

![Xintiao salary details](/works/refinement-digital/xintiao/detail-native.png)

*The detail view separates normal hours, overtime and earning speed to explain the estimate.*

![Xintiao calendar with no completed records](/works/refinement-digital/xintiao/calendar-native.png)

*The new demonstration configuration has no completed records; the calendar shows its actual empty state.*

![Xintiao appearance and animation settings](/works/refinement-digital/xintiao/appearance-native.png)

*Actual appearance settings. The simulator saved the Dark choice, but pages remained light after navigation; dark rendering remains an issue to resolve.*

## Outcome and stage

The native project contains 14 pages and 7 shared main-package components covering the home, calendar, daily records, settings and subpackage tools. The isolated copy passed build checks and all 338 tests across 19 files. Three-step onboarding, the live home screen, salary details, calendar and appearance settings were exercised in WeChat DevTools.

The project remains in local development, with runtime verification covering the development-tool simulator. Theme rendering, device behavior and release readiness need further verification. Reminders are in-app, and WeChat subscription messages are not integrated. User scale, WeChat publication approval and real-world payroll accuracy are not established.

### Sources

today-salary-miniapp README, NOTICE, salary-core headers, native pages/components, current storage code, isolated build/test reports and native captures from WeChat DevTools 2.02.2608060 on 2026-09-15. The original project was not modified.
