# Phase 1: Audit & Foundation

## Overview
We have initialized the foundation for the Sports Web Admin Panel using Next.js App Router, React, Tailwind CSS, Lucide Icons, and strict TypeScript. 

## Architectural & Security Constraints
- **Single Backend Requirement:** The admin panel MUST use the existing Java backend. No new backend or secondary database is to be created.
- **Security Posture:** 
  - Fake authentication (e.g. dummy localStorage JWTs) is strictly prohibited.
  - Backend authorization is mandatory.
  - Session and CSRF mechanisms must adhere exactly to the backend contract.

## Current Blockers
During the initial audit, attempts to inspect the backend repository (`khatrik34/sports-web-backend`) and the public frontend repository (`khatrik34/sports-web`) were blocked (403 Forbidden / 404 Not Found). The GitHub integration currently lacks read access to these private repositories.

Without access to the backend contract:
1. We cannot establish the exact authentication flow (e.g., cookie names, CSRF headers, login endpoints).
2. We cannot securely request real data for the dashboard, articles, matches, etc.

## Immediate Next Steps
1. The GitHub connection must be updated to grant access to `khatrik34/sports-web-backend` so we can audit the API contract.
2. Once the API contract is confirmed, we will wire up `lib/api/client.ts`.
3. Following connection to the real API, we will build out the login flow and subsequently the permission-controlled management modules for articles, users, and matches.
