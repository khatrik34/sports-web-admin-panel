# Admin Panel Progress

## Phase 1: Authentication & Foundation
- [x] Next.js 15 project setup (TypeScript, Tailwind, React 19).
- [x] API proxy `/api/proxy/[...path]` established to hide backend from browser and handle cookies.
- [x] Secure session cookie storage (`/api/auth/login`, `/api/auth/logout`, `lib/session.ts`) avoiding `localStorage`.
- [x] Login screen with React Hook Form, Zod validation, and error surfacing. Note: handles `too_many_attempts` 429 correctly.
- [x] Middleware protecting paths (redirects to `/login` if no cookie).
- [x] Dashboard shell (`app/(admin)/layout.tsx`) reflecting RBAC permissions and user details.
- [x] **Change Password Screen:** Intercepts `mustChangePassword` flag and forces navigation to `/change-password` successfully invalidating all sessions. Reacts to `password_change_required` 403 globally over API.

## Phase 2: Content Management
- [x] News List (`/admin/news` integration)
- [x] News Editor (`/news/new` and `/news/[id]`) - Form for drafts, categories, and SEO data for public site.
- [x] News Categories (`/news-categories`)

## Phase 3: Cricket Entities & Advanced Management
- [x] Teams (`/admin/teams` list and activate/deactivate toggle)
- [x] Players (`/players` list and toggle)
- [x] Series / Tournaments (`/tournaments` list)
- [x] Fixtures (`/admin/matches` list and show/hide toggle)
- [x] Match Scorecard Editor (`/admin/matches/[id]`) - Advanced JSON editor for full innings tree
- [x] Ball-by-ball Commentary (`/admin/matches/[id]`) - Form to publish over events.
- [x] Media Library (`/admin/media` integration) - Asset URL registration with Alt tags.
- [x] Videos Library (`/admin/videos` integration) - Video embed links and status management.
- [x] SEO Redirects (`/admin/seo` integration) - Path redirect manager for public site.
- [x] Homepage Builder (`/admin/homepage` integration) - Dynamic sections manager.

## Phase 4: System Management & Security Enforcement
- [x] Users (`/admin/users` list integration)
- [x] Roles (`/admin/roles` list integration)
- [x] Audit Logs (`/admin/audit-logs` list integration)
- [x] Enforced Global Password Changes on `403 password_change_required`
- [x] Login rate-limiting UI message for `429 too_many_attempts`

## Cross-Repo Tracking
- **Backend Chat:** The Admin Panel is completely wired up to the Phase 1, 2, 3 & 4 Admin API endpoints. It strictly uses `HttpOnly` cookies. No dummy data or fake endpoints are used. 
- **Website Chat:** SEO fields (`metaTitle`, `metaDescription`), media alt tags, redirect paths, and homepage builder sections are successfully integrated and ready for the public site to consume. Note: The new `/api/v1/public/search` endpoint exists and the website team can start using it for global search!
