# DreamRoute design system

This document defines the shared design foundation. Tokens are implemented in `src/index.css`; page-by-page adoption follows through the redesign phases. Values are starting defaults and should be adjusted only for measured contrast or product needs.

## Typography

- **UI family:** Inter, with system sans-serif fallbacks. It is already loaded by `index.html`.
- **Legacy fonts:** Kaisei Tokumin and Arimo remain available temporarily for existing pages; new UI should not add use of either without a deliberate content/design reason.
- **Scale:** page title 30–36px (responsive), section heading 20–24px, card/row heading 16–18px, body 14–16px, supporting text 12–14px, control label 14px.
- **Weights:** 400 body, 500 labels, 600 section headings, 700 page titles and emphasis. Avoid bolding whole paragraphs.
- **Line-height:** 1.5 body, 1.2–1.3 headings, 1.4 compact labels/support text. Use natural wrapping and avoid tracking on body copy.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--background` | `#F5F7F8` | App canvas |
| `--foreground` | `#222831` | Default text |
| `--card` / `--popover` | `#FFFFFF` | Work surfaces and floating content |
| `--card-foreground` / `--popover-foreground` | `#222831` | Surface text |
| `--primary` | `#007F86` | Accessible primary controls and links |
| `--primary-foreground` | `#FFFFFF` | Text/icons on primary |
| `--brand-teal` | `#00ADB5` | Brand accent; check contrast for small text |
| `--secondary` | `#E8EFF0` | Quiet secondary controls/surfaces |
| `--muted` | `#EEF2F3` | Disabled/low-emphasis surface |
| `--muted-foreground` | `#56636A` | Secondary copy |
| `--accent` | `#E5F4F4` | Selected/hover surface |
| `--destructive` | `#B4232C` | Destructive action/error |
| `--border` / `--input` | `#D5DEE1` | Boundaries and controls |
| `--ring` / `--focus-ring` | `#007F86` | Keyboard focus |
| `--brand-slate` | `#393E46` | Navigation and brand emphasis |
| `--brand-deep` | `#222831` | Limited deep-slate region |
| `--brand-neutral` | `#EEEEEE` | Brand neutral reference |
| `--brand-coral` | `#FF6B6F` | Sparse highlight |
| `--sidebar` / `--sidebar-foreground` | `#393E46` / `#F5F7F8` | Dark navigation surface and text |
| `--sidebar-primary` / `--sidebar-primary-foreground` | `#005E64` / `#FFFFFF` | Selected sidebar action |
| `--sidebar-accent` / `--sidebar-accent-foreground` | `#4A535D` / `#FFFFFF` | Sidebar hover/active surface |
| `--sidebar-border` / `--sidebar-ring` | `#525C66` / `#72D8DC` | Sidebar boundaries and focus |

Status colors use green for success, amber for warning, red for error, and blue for information, always paired with text/icon/shape cues. The application-specific primitive color aliases are mapped from semantic CSS variables, not repeated as new per-page hex values.

### Dark mode

The application supports explicit light and dark modes through `next-themes`. Light is the default; the selected mode is saved in browser storage and does not follow the operating-system preference. Dark mode overrides the semantic surface, text, border, status, and sidebar tokens in `.dark`, so components using semantic classes adapt without duplicating theme logic. Theme controls are available in the public navigation, authentication/onboarding flows, workspace header, and Settings appearance section. Keep new surfaces on semantic tokens; reserve literal colors for intentional artwork or brand regions.

| Token group | Dark-mode direction |
|---|---|
| Canvas and surfaces | Deep slate canvas with raised charcoal cards/popovers |
| Text | High-contrast cool white primary text and muted blue-gray secondary text |
| Primary and focus | Bright teal with dark foreground for filled actions |
| Borders and inputs | Mid-slate boundaries with a distinct teal focus ring |
| Status colors | Lightened success, warning, error, and info values for dark surfaces |
| Sidebar | Deep slate navigation with brighter text and active teal |

## Spacing and layout

- Use a 4px base rhythm: 4, 8, 12, 16, 24, 32, 48, 64px.
- Typical content gutters: 16px on narrow screens, 24px tablet, 32px desktop.
- Default readable content width: 1120px; long-form reading/forms may use 640–760px; data tables may use the full available width with controlled horizontal overflow.
- Page header to first section: 24–32px. Related controls: 8–16px. Section separation: 24–40px.
- Initial shell targets: sidebar 256px expanded, top bar 64–72px. These are targets for Phase 2, not a Phase 1 layout change.
- Breakpoints follow Tailwind defaults: 640px, 768px, 1024px, and 1280px. Validate behavior at 320px, 375px, 768px, 1024px, and desktop widths.
- Use mobile-first layouts; avoid fixed content widths, fixed desktop offsets on mobile, and content-height assumptions.

## Shape, elevation, and motion

- Controls: 6–8px radius; cards/dialogs: 8–12px; pills only for compact status/filter labels.
- Prefer one light border and a subtle shadow over layered shadows or glass effects.
- Use short state transitions (roughly 120–200ms) only on interactive elements. Do not apply transitions indiscriminately to every element.
- Respect `prefers-reduced-motion`; remove nonessential movement and retain immediate state feedback.

## Component standards

- **Buttons:** use the existing CVA `Button`; primary, secondary, outline, ghost, destructive, and link variants must be visually distinct. Keep a 40px minimum height (44px preferred for touch), visible focus, disabled state, and pending label where an action awaits a request.
- **Inputs/selects/textareas:** use the existing wrappers when available; every control gets a visible associated label, error description, focus indicator, and disabled state. Placeholder text is not a label.
- **Cards:** use for grouped content, not as a default wrapper for each line of data. Use consistent padding and semantic surface tokens.
- **Dialogs/dropdowns:** preserve Radix keyboard/focus behavior; provide a title, clear close affordance, and small-screen viewport constraints.
- **Tables/lists:** retain semantic table headers; make overflow intentional and keep actions accessible at narrow widths.
- **Status/loading/empty/error:** show data state explicitly, distinguish empty from failed, and provide a next action when recovery is possible. Do not replace failed data with fake values.
- **Icons:** Lucide is the preferred UI icon set; pair nondecorative icons with an accessible name and do not substitute emoji for navigation/status icons.

## Accessibility

- Use semantic landmarks and one clear page-level heading; maintain logical heading order.
- Ensure keyboard reachability and visible `:focus-visible` indication; avoid removing outlines without a replacement.
- Meet WCAG AA contrast for normal text and controls; the original brand teal is not assumed to be a compliant text color against white.
- Associate labels and validation messages with controls; announce asynchronous results without moving focus unexpectedly.
- Use actual buttons for actions and links for navigation. Preserve Radix dialog/menu focus management.
- Support reduced motion and do not make color the sole carrier of meaning.

## Rollout

Phases 1 and 4 wire the semantic tokens to Tailwind UI classes and provide the persistent two-mode theme. Later phases continue migrating page families; the system is not considered fully adopted until those screens are verified.
