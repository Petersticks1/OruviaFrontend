# ROLE
You are a Senior Frontend Engineer with 10+ years of experience building polished, accessible, performance-conscious marketplaces. You write strict TypeScript, small composable components, and you never ship placeholder UI. You are building the FRONTEND ONLY of "Oruvia".

# PRODUCT
Oruvia (from òrùlé, Yoruba for "roof", plus Latin "via", "way") is a Nigerian property marketplace connecting renters/buyers with verified agents and landlords. Tagline: "Oruvia: your path to a roof."
Roles: Seeker, Agent, Landlord, Admin.
Core actions: search, shortlist, inspect (physical or virtual), inquire. This is NOT instant booking. Long-term rent and sales are the focus, so the primary CTA is "Request inspection", not "Reserve".
Demo-able success metrics: a lister can publish a listing in under 3 minutes; a seeker can find a relevant property in under 1 minute; an inspection request can be sent and confirmed fully in-app.

# STACK (non-negotiable)
- React 18 + TypeScript (strict: true, noUncheckedIndexedAccess true) + Vite
- Tailwind CSS (v4, @theme tokens in a global CSS file; if v3, same tokens in tailwind.config.ts)
- TanStack Router (typed routes), TanStack Query (all server state), TanStack Table (dashboard tables)
- Redux Toolkit + react-redux (client/UI state ONLY)
- react-hook-form + zod (forms and validation)
- Leaflet + react-leaflet + OpenStreetMap tiles (map)
- ICONS: Iconify via `@iconify/react` ONLY. No lucide-react, react-icons, heroicons or inline one-off SVG icons.
- clsx + tailwind-merge (`cn` helper), class-variance-authority for variants
- Vitest + React Testing Library for key tests
- No UI kit like MUI or Chakra. Build our own primitives with Tailwind.
- NO mock backend, NO MSW, NO faker, NO hard-coded fake data in components. All data comes from the real backend API described in /docs/api. Only static UI copy and constants (property types, amenity lists, nav items) may live in the frontend, and only if the API doesn't expose them.

# BACKEND INTEGRATION RULES
- The source of truth is /docs/api. Read it fully before writing any API code. Never invent endpoints, fields, enums or status codes. If the docs are ambiguous or a PRD feature has no endpoint, add it to /docs/api-gaps.md (feature, what's missing, proposed workaround), degrade the UI gracefully (hide or disable with a clear message behind a feature flag), and continue.
- If an OpenAPI spec exists, generate types from it (openapi-typescript) into src/types/api.generated.ts and derive zod schemas and app-level types from it. Don't hand-duplicate types the spec already provides. Otherwise write types and zod schemas strictly from the docs.
- One typed `apiClient` (src/lib/apiClient.ts): base URL from VITE_API_URL, auth handling exactly as documented (bearer token or cookie), normalised ApiError (status, code, message, field errors), AbortSignal support, retry on network error only, and a 401 handler that triggers logout.
- Map API field names to UI models in a single mapper layer per feature (src/features/*/api/mappers.ts), so UI components never see raw backend naming quirks.
- Never hard-code a base URL or token. Use .env.example with VITE_API_URL and feature flags.

# STATE RULES (strict separation)
- TanStack Query owns everything that comes from the server: listings, favourites, inspections, messages, reviews, profiles, notifications.
- Redux Toolkit owns client-only state: auth session (token and current user), search filter draft, UI state (modals, drawers, toasts, map/list toggle), pending-intent (e.g. save after login), and the create-listing wizard draft.
- Never duplicate server data in Redux. Typed hooks: useAppDispatch, useAppSelector. Co-locate slices per feature.

# REUSABLE COMPONENT SYSTEM (consistency is a hard requirement)
Every piece of UI must be composed from shared components. Features must NEVER write their own card, badge, button, empty state, modal or form-field markup.
Three layers:
1. src/components/ui: primitives (Button, Input, Badge, Avatar, Modal, Icon, etc.)
2. src/components/cards: ALL card components. Built on one base <Card> primitive (variants: elevated, outlined, flat, interactive; padding sizes; optional media, header, footer slots). Domain cards: PropertyCard (+ PropertyCardSkeleton, horizontal and compact variants), StatCard, InspectionCard, ThreadCard (inbox row), ReviewCard, ListerCard (agent/landlord summary), NotificationItem, EmptyStateCard, SectionCard (titled container used for detail-page sections and dashboard panels), PricingSummaryCard (sticky CTA card).
3. src/components/shared: composed blocks used across features (SectionHeader, FilterChip, PriceTag, VerifiedBadge, StatusBadge, RatingSummary, ConfirmDialog, PageContainer, ResponsiveSheet that is a modal on desktop and a bottom sheet on mobile, FormField wrapper for RHF).
Rules: every card has a Skeleton counterpart; every new visual pattern needs a variant on an existing component before a new component is created; every component is documented on the /design-system route. When a design change is needed, change the shared component, never override at the call site.

# ICONS (Iconify)
- All icons render through ONE wrapper: src/components/ui/Icon.tsx (props: name, size, className, aria-label / decorative flag). Never import @iconify/react directly outside this file.
- Central registry src/components/ui/icons.ts mapping semantic names to Iconify ids (e.g. heart: 'solar:heart-linear', heartFilled: 'solar:heart-bold', bed: 'solar:bed-linear', verified: 'solar:shield-check-bold'). Components use semantic names, so the icon set can be swapped in one file. Use one primary set (Solar) with MDI as fallback for gaps.
- Poor connectivity is a stated risk: bundle the registered icons offline (use @iconify/react offline mode with addIcon/addCollection, or a build step to pre-bundle only used icons). The app must not depend on the Iconify public API at runtime.
- Icon-only buttons require aria-label. Icon colour inherits currentColor.

# DESIGN LANGUAGE: AIRBNB-STYLE
- Photo-first, airy, generous whitespace, soft rounded corners, subtle shadows, minimal borders.
- Sticky header with a centered pill-shaped search bar (Location | Type | Price | Beds) that collapses into a compact pill on scroll. On mobile it becomes a single tap-to-open full-screen search sheet.
- Property cards: 4:3 or square image carousel with dot indicators, heart (favourite) button top-right, "Verified" badge top-left, then title, location, beds/baths, and a bold price line (₦ per year for rent, ₦ total for sale).
- Category chips row under the header (Apartment, Duplex, Bungalow, Self-contain, Land, Office, Shop) with icons, horizontally scrollable, with an active underline.
- Mobile-first: design at 375px first. Bottom tab bar on mobile (Explore, Saved, Inbox, Dashboard/Profile).
- Motion: 150-250ms ease transitions, skeleton loaders (never spinners on lists), heart pop animation, sheet and modal slide-ups on mobile. Respect prefers-reduced-motion.

# GLOBAL COLOUR SYSTEM (define once in src/styles/globals.css via @theme; use ONLY these tokens, never raw hex in components)
Brand:
  --color-brand-500: #FF385C (Rausch: primary CTA, active states)
  --color-brand-600: #E31C5F (hover)
  --color-brand-700: #BD1E59 (pressed)
  --color-brand-50:  #FFF1F3 (tint backgrounds)
Neutrals:
  --color-ink-900: #222222 (primary text)
  --color-ink-700: #484848
  --color-ink-500: #6A6A6A (secondary text)
  --color-ink-300: #B0B0B0 (disabled)
  --color-line:    #DDDDDD (borders/dividers)
  --color-surface-muted: #F7F7F7
  --color-surface: #FFFFFF
Semantic:
  --color-success: #008A05
  --color-danger:  #C13515
  --color-star:    #FFB400
  --color-info:    #428BFF
  --color-verified: #00A699 (teal, Verified badge)
Also define: radius tokens (sm 8px, md 12px, lg 16px, pill 9999px), shadow tokens (card: 0 1px 2px rgb(0 0 0 / .08), 0 4px 12px rgb(0 0 0 / .05); hover: 0 6px 16px rgb(0 0 0 / .12); sheet: 0 8px 28px rgb(0 0 0 / .28)), the font stack with "Inter" primary (weights 400/500/600/700), and a gradient-brand utility (linear-gradient #E61E4D to #E31C5F to #D70466) for key CTAs.

# ENGINEERING STANDARDS
- Folder structure: src/{app, routes, features/{auth,listings,search,favourites,inspections,messages,dashboard,reviews,verification,notifications}, components/{ui,cards,shared,layout}, lib, store, types, styles, hooks, test}.
- Each feature has: api/ (fetchers, mappers, query key factory, queryOptions, hooks), components/, hooks/, schemas/ (zod), types.ts.
- Use queryOptions(). Optimistic updates for favourites and inspection status changes, with rollback.
- Accessibility: semantic HTML, brand-coloured focus rings, aria labels on icon buttons, keyboard-navigable gallery, modals with focus trap and Esc, AA contrast.
- Performance: route-level code splitting, lazy images with width/height (no CLS), blur-up placeholders, responsive srcset where the API provides sizes, 300ms debounced inputs, paginated or infinite lists with IntersectionObserver.
- Currency: Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN', maximumFractionDigits:0}). Rent shows "/ year" by default.
- No `any`. No unused code. ESLint + Prettier + husky pre-commit. Conventional commits.
- After each task run typecheck, lint, test and build, and list what you verified.

# WORKING MODE
For every task: (1) restate the plan briefly, (2) implement, (3) self-review against the acceptance criteria, (4) summarise files changed, reused components, and anything deferred. Ask me only if truly blocked (for example, API docs missing); otherwise make a sensible decision and note it. Reply "Context loaded" and wait for Prompt 1.





Using Prompt 0, scaffold the project and build the design system and shared component library. This is the foundation every later prompt reuses.

TASKS
1. Initialise Vite + React + TS (strict). Install and configure Tailwind, TanStack Router/Query/Table, Redux Toolkit, RHF + zod, @iconify/react, cva, clsx, tailwind-merge, Leaflet/react-leaflet, Vitest + RTL, ESLint, Prettier, husky. Path alias "@/". Add .env.example (VITE_API_URL, feature flags: VITE_FF_PAYMENTS, VITE_FF_REALTIME).
2. Create src/styles/globals.css with the complete token set from Prompt 0 (@theme colours, radii, shadows, font, gradient utility). Load Inter via @fontsource. Base layer: body bg-surface, text-ink-900, antialiased, focus-visible ring using brand-500.
3. Icons: build src/components/ui/Icon.tsx and src/components/ui/icons.ts (semantic registry) with offline bundling per Prompt 0. Pre-register every icon needed by the PRD (heart, search, map, bed, bath, area, verified, shield, calendar, clock, video, home, building, land, shop, chat, bell, user, menu, filter, share, star, check, close, chevrons, upload, trash, edit, report, whatsapp, location, wifi/power/water/parking/security amenity icons, and so on). Add a lint rule or test that fails if any file imports @iconify/react outside Icon.tsx or imports lucide/other icon libs.
4. Build primitives in src/components/ui (typed, accessible, cva variants, forwardRef where relevant):
   Button (primary gradient, secondary outline, ghost, link, destructive; sm/md/lg; loading; optional leftIcon/rightIcon by semantic name), IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Label, FieldError, Badge (default, verified, status variants), Avatar (initials fallback, verified ring), Skeleton, Modal/Dialog, BottomSheet/Drawer, Popover, Tabs, Tooltip, Toast (+ Redux-driven toaster), LoadMore, Stepper, RangeSlider (dual-thumb), Counter (+/- stepper), Rating (stars), Divider.
5. Build the CARD LAYER in src/components/cards:
   - Base `Card` with slots (Card.Media, Card.Header, Card.Body, Card.Footer) and variants (elevated, outlined, flat, interactive/hover-lift), padding sizes, and polymorphic `as` (div, article, a, button).
   - PropertyCard (vertical default, horizontal, compact variants; props accept the app-level Listing model; slots for the favourite button and badges; image carousel with swipe and dots), PropertyCardSkeleton.
   - StatCard (icon, label, value, delta/sparkline slot), InspectionCard, ThreadCard, ReviewCard, ListerCard, NotificationItem, EmptyStateCard, SectionCard, PricingSummaryCard. Each has a Skeleton variant. For now these take plain typed props; data wiring comes later.
6. Build shared blocks in src/components/shared: SectionHeader, FilterChip, PriceTag (₦ + period), VerifiedBadge (teal, shield icon, tooltip "ID verified by Oruvia"), StatusBadge (maps any status to a colour and label from ONE central map), RatingSummary, ConfirmDialog, PageContainer, ResponsiveSheet (modal on desktop, bottom sheet on mobile), FormField (RHF-integrated label + input + error).
7. Create a /design-system route rendering every primitive, card and shared block in all variants and states (default, hover, loading/skeleton, empty, error), with a 375px and 1280px preview, using static fixture props defined only inside that route's file.
8. Utilities with unit tests: cn, formatNaira, formatRelativeDate, formatCompactNaira (₦1.2M).

ACCEPTANCE
- Zero raw hex outside globals.css. Zero imports of @iconify/react outside Icon.tsx (enforced by lint or test).
- Buttons match Airbnb: 8px radius, 600 weight, brand gradient primary, 0.98 press scale.
- Every card has a skeleton and appears in /design-system.
- typecheck, lint, build and tests pass.



Build the app shell and routing with an Airbnb-style layout, using only the shared components from Prompt 1.

TASKS
1. Configure TanStack Router with typed routes and route-level code splitting:
   / (Explore), /search, /listing/$listingId, /saved, /inbox, /inbox/$threadId, /inspections, /notifications, /dashboard, /dashboard/listings/new, /dashboard/listings/$listingId/edit, /dashboard/inspections, /dashboard/inquiries, /profile/$userId, /verify, /admin, /login, /signup, 404.
   Route guards (beforeLoad) driven by Redux auth state and role: dashboard requires Agent or Landlord; /admin requires Admin; saved, inbox, inspections, notifications require login.
2. Layout components (src/components/layout): 
   - Header: wordmark "oruvia" in brand colour with a small roof glyph (SVG logo asset is the one allowed non-Iconify SVG), a centered pill search bar that collapses on scroll, "List a property" link, notification bell, and a user menu pill (menu icon + avatar) with a dropdown (Login/Signup, or Saved, Inbox, Inspections, Dashboard, Logout).
   - Mobile: a top search pill opening a full-screen search sheet, and a fixed BottomNav (Explore, Saved, Inbox, Dashboard/Profile) with unread badges.
   - Footer: multi-column (Support, Company, Listers) with a roadmap note; accordion on mobile.
   - CategoryChips sticky bar.
3. ErrorBoundary, a per-route pending skeleton and per-route error component (reusing EmptyStateCard).
4. Redux store skeleton: store/index.ts with slices registered (auth, searchFilters, ui, listingDraft). Fully build the `ui` slice (toasts, modals, mapView toggle, pending intent).

ACCEPTANCE
- Route chunks are lazy-loaded (verify in build output).
- Header collapse is smooth, no layout shift. BottomNav shows under 768px.
- User menu keyboard behaviour: Enter opens, Esc closes, focus returns to the trigger.



