# DreamRoute visual direction

## Decision

Use a **light-first mixed system**: neutral, readable work surfaces for forms, tables, and learner dashboards; restrained deep-slate navigation and occasional dark brand sections for orientation and emphasis. Do not apply a full dark theme just because deep background colors exist in the brand palette. This approach keeps data-heavy screens legible while retaining DreamRoute's existing slate identity.

The public-facing landing page may use a darker hero as a brand moment, but the page body should remain quiet and content-led. Dark surfaces should be deliberate and limited, not a default applied to every screen.

## Brand hierarchy

- **Primary action:** accessible deep teal derived from DreamRoute teal, with the original `#00ADB5` retained as a brand accent and for large/high-contrast decorative surfaces. Use dark text on lighter teal fills when needed to meet contrast.
- **Navigation / emphasis:** dark slate `#393E46`; deepest slate `#222831` reserved for selected navigation/brand areas, not page-wide backgrounds.
- **Canvas / surfaces:** cool light neutral based on `#EEEEEE`, with white for elevated or focused surfaces.
- **Accent:** coral `#FF6B6F` for rare, meaningful highlights only; not as a second primary action color.
- **Status:** distinct success, warning, error, and information tokens; status meaning must not rely on color alone.

## Product feel

Lead with clear typography, predictable page headers, calm neutral surfaces, and a single visible primary action. Prefer structured lists, tables, timelines, and compact summaries over repeating a card grid for every content type. Motion should clarify state or orientation; avoid ambient animated decoration, scaling hover effects, and glow effects as default treatments.

## Content integrity

Only show data returned by current APIs as factual product metrics. Do not repeat the static landing-page institution/student metrics or the unrouted prototype's stats as if verified. Preserve existing product claims only when their meaning can be supported by the actual product.

## Navigation and role context

Use the same shell grammar across existing learner, admin, and institution experiences, while retaining only the role-specific links already present. Keep public auth and payment/redirect screens focused. Active location, page title, and mobile navigation should be clear without inventing roles or permissions.

## Implementation guardrails

- Keep React, React Router, Tailwind CSS 4, Radix wrappers, Lucide, and current API/auth integrations.
- Add semantic CSS variables and map the existing primitive class vocabulary to them; do not add another styling framework.
- Use Inter as the product UI family; retain loaded legacy fonts only where existing screens explicitly depend on them until page migration proves they are unused.
- Migrate page families in phases and verify responsive behavior and functionality after each migration.
- Do not change backend contracts, authentication semantics, or payment behavior during visual work.
