# DreamRoute phased implementation plan

The sequence preserves existing routes and integrations. Visual work must not normalize or alter an API, auth, permission, or payment contract without backend verification.

## Phase 0 — Audit and baseline (complete)

- Inventory routes, screens, shared components, dependencies, styling, auth, and frontend API call sites.
- Record build/lint/test baseline and known technical limitations.
- Deliver `current-state.md`, `page-inventory.md`, `design-direction.md`, and this plan.
- Acceptance: all routes in `App.jsx` and discovered non-routed screens are listed; baseline is reproducible; no functionality changed during the audit.

## Phase 1 — Design system and frontend foundations (complete)

- Wire the semantic CSS variables required by the existing Radix/shadcn-style primitives.
- Establish the light-first mixed palette, Inter body type, focus-visible behavior, and reduced-motion handling in the global stylesheet.
- Remove unused/duplicated global styling without removing the roadmap's intentional step highlight.
- Document spacing/type/layout and component rules in `design-system.md`.
- Acceptance: production build succeeds; existing utility tests pass; core semantic primitive classes resolve to shared tokens; no staged/user work is modified.
- Scope: `src/index.css`, design-system documentation. Do not combine this with shell/page redesign.

## Phase 2 — Application shell and navigation (complete)

- Unify common structure across `DashboardLayout`, `AdminLayout`, and `InstitutionLayout` while keeping role-specific links and existing access boundaries.
- Replace full-page navigation anchors with router-aware navigation where appropriate; support nested active routes and establish usable mobile sidebar behavior.
- Standardize page title/content region, account menu, footer, and chatbot placement.
- Verify all routes, logout, role redirects, keyboard navigation, and narrow viewport behavior.
- During implementation, the existing Tailwind 4 sidebar width utilities were found not to compile; the Radix sidebar wrapper now uses variable-width utility syntax supported by Tailwind 4. A focused Settings screen overflow was also corrected.
- Verification covered desktop and mobile geometry, mobile sidebar dialog accessibility and route transition, and the learner/admin/institution navigation inventories. Backend-backed API behavior and exhaustive route regression remain for Phase 10 because the backend service is not running in this workspace.

## Phase 3 — Public-facing experience (complete)

- Redesign the routed `LandingPage` based on real implemented workflows; retain signup, contact, and institution-request entry points.
- Remove unsupported success metrics/claims, reduce ambient animation and excess gradients, and optimize the oversized hero image only with visual validation.
- Keep `Index.jsx` and `/test` identified as prototypes until ownership/product scope is confirmed; do not create new routes automatically.
- Replaced the routed landing page with a responsive light-first hero, workflow overview, grounded feature descriptions, institution application CTA, accessible contact form, and working internal navigation. Removed unsupported metrics, decorative motion, and placeholder footer links; the unused 2.65 MB hero image is no longer loaded by this page.
- Kept the existing contact endpoint URL and its four-field request payload. No backend endpoint or response contract was added or changed.
- Verification: landing page lint passed; production build and existing utility tests passed; browser checks covered 320/390/768/1440px, signup and institution-request routes, and mocked contact success/error with exact payload keys. Backend submission could not be verified because the API service is unavailable.

## Phase 4 — Authentication and onboarding (complete)

- Migrate login, signup, OAuth return, forgot/reset password, profile steps, and institution request screens to shared form patterns.
- Preserve existing endpoints, payloads, login behavior, role redirects, and onboarding generation sequence.
- Add accessible validation, pending/success/error states, labels, password reveal semantics, and interrupted-flow recovery.
- Implemented persistent light/dark mode with light as the default, semantic dark token overrides, and theme controls on the landing page, auth/onboarding screens, workspace shell, and Settings.
- Migrated the auth and onboarding form surfaces to semantic colors and improved labels, validation/error announcements, and pending states. Existing login/register/reset/institution request contracts and the three-request onboarding sequence were preserved.
- Verification: targeted ESLint passed; production build passed with the existing large-chunk warning; utility tests passed (5/5); browser checks confirmed dark/light switching, persistence across reload and routes, and no horizontal overflow at 320px or 390px on landing, auth, and institution-request screens.
- Backend-dependent submissions were not tested because the local API is unavailable.

## Phase 5 — Main application dashboards (next)

- Redesign learner, admin, and institution dashboards using only current API data.
- Make empty/loading/error states explicit; retain real roadmap progress, admin activity, and institution course counts.
- Remove unsupported or static metrics rather than replacing them with invented values.

## Phase 6 — Core product features

- Prioritize roadmap and career visualization, then course discovery and the chatbot.
- Inspect live frontend contracts first; preserve roadmap status, course/institution associations, premium gating, filters, pagination, and graph interactions.
- Verify success, empty, failure, and retry behavior for each feature.

## Phase 7 — Forms, tables, and secondary workflows

- Migrate admin CRUD, institution course management/settings, learner settings/analytics, feedback, course submission, and plans/payment screens.
- Separate implemented API behavior from local-only prototypes; do not imply persistence where no endpoint exists.
- Improve table/list patterns, validation, confirmation, and user-visible result messages.

## Phase 8 — Responsive design and accessibility

- Review every migrated route at mobile, tablet, and desktop breakpoints.
- Audit keyboard, focus order, semantic names, contrast, modal behavior, touch targets, reduced motion, and overflow.
- Fix regressions discovered; do not treat framework utilities as evidence of responsiveness.

## Phase 9 — Performance and production polish

- Measure route chunks and image transfer size; consider route-level lazy loading and image optimization only when verified against real usage and browser output.
- Check console output, duplicate requests, animation cost, layout stability, and loading experience.
- Keep changes evidence-based and avoid introducing dependencies without a demonstrated need.

## Phase 10 — Final verification

- Run production build, lint, existing tests, and available browser checks.
- Regress routes, auth/role navigation, forms, API-backed workflows, and responsive states.
- Create `final-review.md` with verified changes, outstanding issues, results, and limitations.

## Dependencies and constraints

- Phases 2–7 depend on Phase 1 tokens and component standards; page migration is sequenced after shared shell work.
- Phase 8 follows implementation across the page families; Phase 9 follows responsive/accessibility fixes; Phase 10 closes all work.
- Backend route definitions are unavailable in this frontend workspace. Treat endpoint details as observed client behavior only; confirm server semantics before modifying requests or displaying new data.
- Current checkout already contains staged changes in five unrelated source files. Keep them intact and do not include them in redesign edits.
