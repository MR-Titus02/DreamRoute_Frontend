# Redesign progress

## Phase 0 — Audit and baseline

**Status:** Complete.

- Audited the frontend structure, routes, layouts, shared UI, auth context, API call sites, style setup, and product workflows.
- Created `current-state.md`, `page-inventory.md`, `design-direction.md`, and `implementation-plan.md`.
- Baseline: build passes with a chunk-size warning; lint reports 11 errors and 5 warnings; the utility test file passes (5 tests).
- No application behavior was changed during the audit.

## Phase 1 — Design system and frontend foundations

**Status:** Complete.

- Scope: semantic design tokens and global typography/focus/motion foundations in `src/index.css`; documented in `design-system.md`.
- Mapped the existing shadcn/Radix semantic colors, including the sidebar primitive contract; set a light neutral canvas, dark slate navigation tokens, accessible teal primary, type defaults, visible focus, and reduced-motion behavior.
- Removed unused duplicate float/focus/gradient helper styles and retained a restrained roadmap step highlight.
- Verification: production build passes; utility tests pass (1 file / 5 tests). Build still reports the pre-existing main-chunk size warning.
- Preserve staged edits present before this task.

## Phase 2 — Application shell and navigation

**Status:** Complete for the shared shell scope.

- Consolidated the three duplicated shells into `src/layouts/WorkspaceLayout.jsx`, retaining the existing learner/admin/institution menu entries, learner career tools, learner/institution chatbot placement, and role-specific settings links.
- Replaced hard-coded 280px offsets with the sidebar primitive's responsive layout; corrected its CSS-variable width utility syntax for Tailwind 4 so desktop space is reserved correctly.
- Added route-aware current-page context, router navigation, mobile sheet close-on-navigation, an accessible dialog title/description, and responsive sidebar toggling.
- Removed the admin account menu's `/admin/settings` link because no such route is registered. No route, role, or permission was added or removed.
- Fixed the existing learner Settings form's one-column grid and narrow-screen action layout after the browser check found horizontal overflow.
- Browser checks: at 1440px viewport the desktop sidebar reserves 256px and the main column begins at x=256; at 390px viewport there is no horizontal overflow (375px document client/scroll widths); mobile navigation opens with an accessible dialog name and closes on route navigation; learner navigation to Courses and admin/institution role-specific link lists were verified with temporary test profiles, then browser storage was cleared.
- Production build and utility tests pass. Changed JavaScript layout files pass targeted ESLint. `sidebar.tsx` is outside the current ESLint file configuration, but the editor diagnostics and production build pass.
- Browser backend requests could not complete because the local API at port 5001 is not running. As a result, data-dependent screens cannot be fully validated; the Courses screen currently presents an empty-result message after a network failure, which remains for the data-state phase.

## Phase 3 — Public-facing experience

**Status:** Complete.

- Redesigned the routed landing page in `src/pages/LandingPage.jsx` as a responsive light-first product introduction focused on workflows present in the frontend: profile setup, generated career paths, roadmap progress, course discovery, and institution course management.
- Retained the existing sign-in, signup, institution-request, and contact entry points. Preserved the current contact endpoint URL and `{ name, email, phone, message }` payload; no API contract was changed.
- Removed unsupported static satisfaction/student/institution counts, invented dashboard metrics, excessive ambient motion/gradients, the unused oversized hero image, and placeholder footer `href="#"` links.
- Improved responsive top navigation and semantic form labels, required consent text, submit pending state, and announced success/error feedback.
- Verification: `npx eslint src/pages/LandingPage.jsx` passed; `npm run build` passed (pre-existing large main-chunk warning remains); utility tests passed (5/5). Browser checks passed at 320, 390, 768, and 1440px with no horizontal page overflow; signup and institution-request CTAs reached their existing routes; mocked contact success and failure feedback worked and the outgoing payload retained exactly the four existing keys.
- Full-repository lint remains blocked by unrelated findings: 7 errors and 5 warnings, down from the audited baseline of 11 errors and 5 warnings after unused code in the replaced landing page was removed. The remaining lint issues are outside Phase 3 scope.
- The backend service was unavailable, so real contact submission was not tested. Temporary mock requests did not reach the backend.

## Phase 4 — Authentication, onboarding, and theme modes

**Status:** Complete for the migrated auth/onboarding screen scope.

- Added the existing `next-themes` provider at the application root, with explicit light/dark modes, light as the default, persisted user choice, and semantic dark token overrides in `src/index.css`.
- Added an accessible theme toggle to the landing page, login/signup/password recovery/institution request/profile setup screens, workspace header, and Settings appearance section. The selected mode now changes the redesigned surfaces and remains selected after reload/navigation.
- Migrated login, signup, OAuth status, forgot/reset password, three-step profile setup, institution request, and Settings surfaces to semantic theme classes. Improved labels, validation and request feedback, and disabled/pending button states without changing backend request endpoints, payloads, role redirects, or the onboarding request order.
- Verification: targeted ESLint passed; production build passed (existing large-chunk warning remains); utility tests passed (5/5). Browser checks confirmed both modes, local persistence across reload and routes, and no horizontal overflow at 320px/390px for landing, auth, and institution-request pages.
- Backend-backed auth, reset, profile generation, and institution request submission could not be verified because the local API is unavailable.

## Next phase

**Phase 5 — Main application dashboards.** Redesign learner, admin, and institution dashboards using only existing API data, with explicit loading, empty, and error states.
