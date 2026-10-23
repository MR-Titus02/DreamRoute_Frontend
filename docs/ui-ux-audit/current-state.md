# DreamRoute frontend: current-state audit

## Scope and evidence

This audit covers the `client` repository: its React/Vite source, routes, shared layouts and components, styling, frontend API calls, and available checks. The repository does not include backend route definitions, so API request shapes below are recorded from frontend call sites only; response semantics and authorization cannot be independently verified here.

## Architecture

- **Framework:** React 19.1 with Vite 6.3 and the React plugin; the app is primarily JavaScript/JSX with a small number of TypeScript utility/UI files.
- **Routing:** React Router DOM 7.6, with routes declared centrally in `src/App.jsx`. `ProtectedRoute` checks the current auth token/user and optionally a role.
- **Styling:** Tailwind CSS 4.1 through `@tailwindcss/vite`, utility classes, and `src/index.css`. There is also a legacy `tailwind.config.js` extending a v3-style theme. `src/App.css` is empty. The stylesheet is imported by both `main.jsx` and `App.jsx`.
- **UI primitives:** Locally maintained shadcn-style wrappers around Radix primitives in `src/components/ui`; many page styles still bypass them with page-specific classes and literal colors.
- **Icons and motion:** Lucide is used in shared layouts and some screens; custom inline SVGs, emoji, and Heroicons dependency coexist. Framer Motion is used on the landing page. React Flow, a separate React Flow v11 dependency, Recharts, and a vertical timeline library support feature screens.
- **Forms and state:** Local React state and native controls dominate. React Hook Form and Zod are installed, but most inspected forms use ad hoc state and inline checks. Auth state is held in `AuthContext`; there is no app-wide data cache/provider in `main.jsx`.
- **API and payments:** Frontend requests use the shared Axios client in `src/api/axios.js`, configured with `VITE_API_URL` (including the `/api` prefix); the same-origin `/api` path is the fallback. Stripe public configuration and plan price IDs are environment values.
- **Assets and fonts:** `index.html` loads Kaisei Tokumin, Inter, and Arimo from Google Fonts. The hero background image is approximately 2.65 MB in the production build.

## Authentication and authorization

`AuthContext` restores a serialized user and token from `localStorage`, exposes login/logout, and reports initial loading. `ProtectedRoute` uses those values and checks role equality when a `role` prop is provided. The admin and institution management routes are role-gated; several learner-facing routes and institution request/payment routes are not wrapped by `ProtectedRoute` in the current router. Login, registration, and OAuth redirect determine role-specific destinations.

The API request interceptor attaches the stored auth token as a bearer token without logging its value. Backend authorization and production CORS behavior cannot be verified from this frontend repository.

## Styling and interaction findings

1. **No shared color system is wired into the UI primitives.** The global stylesheet declares font theme values but no semantic surface, text, border, or interaction tokens, while the legacy Tailwind config and pages use several overlapping color systems.
2. **Visual direction varies by page.** Most learner/admin/institution pages use dark slate backgrounds, but `Index.jsx` is a light blue/purple landing design, while other pages use near-black gradients, blue/indigo, green, or purple accents. Repeated gradients, oversized rounded cards, emoji, and one-off styling weaken product identity.
3. **Role layouts duplicate structure.** The three layouts repeat sidebar/header/footer markup and use fixed 280px offsets. Navigation links in sidebars use anchors rather than router links and active matching is exact-path only. The mobile trigger and fixed offset combination needs responsive verification.
4. **Global CSS has stale/overbroad behavior.** It applies a transition timing function to every element, defines `animate-float` twice with different keyframes, and includes unused helper styles. The roadmap highlight is the only identified consumer of the custom animation layer that needs preservation.
5. **Forms and feedback are inconsistent.** Label association, validation presentation, pending/disabled states, and error/success handling differ by screen. Several submissions use `alert`, `console.error`, or local-only success instead of a consistent inline state; some visible workflows are placeholders rather than persisted API actions.
6. **Data states are incomplete.** Some pages show a loading message, but empty/error/retry states are often missing or inconsistent. The courses screen has a useful empty state; admin/institution CRUD pages rely largely on console logging for failures.
7. **Accessibility needs systematic work.** Some labels are not connected to controls; clickable cards and rating stars are not consistently keyboard operable; some controls omit accessible names or visible focus treatment; error text is not consistently announced. Reduced-motion support is not established globally.
8. **Content credibility needs review.** The public landing page includes success metrics and institution/student counts that are hard-coded and not backed by the inspected API. `Index.jsx` contains additional unsupported claims and stats, but is not routed. Avoid carrying these figures into a redesigned public experience.
9. **Routing and integration are fragmented.** There are duplicate roadmap entries, route paths written inconsistently with/without a leading slash, one unrouted `Index.jsx`, and a `/test` page with an unregistered `/get-started` CTA. These are recorded audit observations; frontend API URL configuration is now centralized through the shared Axios client.
10. **Production size merits later measurement.** The baseline build succeeds but emits a chunk-size warning: the main JS chunk is about 868 kB minified and the hero background is about 2.65 MB. Optimize only after route usage and visual requirements are confirmed.

## Baseline verification (before Phase 1)

- `npm run build`: **passed**. Vite emitted a warning for a minified chunk above 500 kB.
- `npm run lint`: **failed** at baseline with 11 errors and 5 warnings. After Phase 3 removed unused code from the replaced landing page, it reports 7 errors and 5 warnings. Remaining findings include unused variables in `App.jsx`, `CareerPathFlow.jsx`, `PaymentMethodsPage.jsx`, `RequestInstitution.jsx`, and `Step3SkillsExperience.jsx`; config globals in `tailwind.config.js` and `vite.config.js`; plus hook/fast-refresh warnings.
- `npx vitest run src/lib/utils.spec.ts`: **passed**, 1 file / 5 tests.
- No browser-level or backend integration check has been run yet.

## Existing worktree state

At audit time, five source files were already staged as modified (`src/api/roadmap.js`, `src/pages/CareerPathFlow.jsx`, `src/pages/Courses.jsx`, `src/pages/LandingPage.jsx`, and `src/pages/Login.jsx`). They are outside this audit-document and Phase 1 CSS scope and must be preserved.

## Redesign progress update

Phase 3 replaced the routed landing page's long dark/animated presentation with a responsive light-first introduction to existing career-profile, roadmap, course-discovery, and institution workflows. Unsupported hard-coded institution/student success metrics and nonfunctional `#` footer links were removed. Signup, sign-in, institution-request navigation, and the contact form's current API URL and `{ name, email, phone, message }` payload were retained. Contact fields now have associated labels, a required contact-consent checkbox, a disabled pending state, and announced success/failure feedback.

The local backend was not available. Contact success and failure states were tested with mocked HTTP responses; a real submission and server behavior have not been verified. The endpoint path remains the existing worktree URL and was not changed as part of the redesign.
