# Admin Panel Progress

## Phase 1: Authentication & Foundation
- [x] Next.js 15 project setup (TypeScript, Tailwind, React 19).
- [x] API proxy `/api/proxy/[...path]` established to hide backend from browser and handle cookies.
- [x] Secure session cookie storage (`/api/auth/login`, `/api/auth/logout`, `lib/session.ts`) avoiding `localStorage`.
- [x] Login screen with React Hook Form, Zod validation, and error surfacing.
- [x] Middleware protecting paths (redirects to `/login` if no cookie).
- [x] Dashboard shell (`app/(admin)/layout.tsx`) reflecting RBAC permissions and user details.
- [x] Checked build, lint, and typecheck commands. All pass.

## Phase 2: Content Management
- [x] News List (`/admin/news` integration)
- [ ] News Editor (draft/schedule/publish/unpublish/archive, SEO fields, cover image URL + alt, category)
- [ ] News Categories
- [ ] Media/Videos (Coming Soon - Phase 3 dependency)

## Phase 3: Cricket Entities
- [x] Teams (`/admin/teams` list and activate/deactivate toggle)
- [ ] Players
- [ ] Series & Points Table (`/admin/tournaments` editor)
- [x] Fixtures (`/admin/matches` list and show/hide toggle)

## Phase 4: System Management
- [x] Users (`/admin/users` list integration)
- [ ] Roles
- [x] Audit Logs (`/admin/audit-logs` list integration)

## Backend Dependencies & Notes
- We await real Phase 3 implementations on the backend for features like Media/Videos, so we hide them or label them as "Phase 3".
- `user.mustChangePassword` shows a warning in the layout, but the actual change password endpoint is pending.
