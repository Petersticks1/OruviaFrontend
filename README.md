# Oruvia Frontend

**Oruvia** (`oruvia.ng`) is a trust-first, mobile-optimized Nigerian property marketplace connecting **Property Seekers**, **Licensed Agents**, and **Direct Landlords** across Ogun State (Abeokuta, Mowe-Ofada, Sagamu, Ota), Lagos, Oyo, FCT Abuja, and beyond.

Inspired by Airbnb's visual clarity and discovery experience, Oruvia eliminates opaque middlemen fees, duplicate fake listings, and wasted inspection trips by pairing verified property titles/listers with upfront Naira fee breakdowns and physical/virtual inspection scheduling.

---

## ✨ Key Features

- **Airbnb-Inspired Discovery & Search**:
  - Sticky shrinking header pill search (`Where`, `Rent / Buy`, `Budget & Beds`) and horizontal category filter rail (`All Homes`, `Apartments`, `Duplexes`, `Bungalows`, `Self-Contain`, `Land`, `Offices`, `Shops`, `Verified Only`, `Virtual Tour`).
  - Interactive split-view map pins (`₦3.5M` pills) and responsive property card grids with multi-slide photo carousels.
- **Transparent Naira Pricing**:
  - Full cost breakdown upfront (Annual/Total Rent or Sale Price, Service Charge, Caution Fee, Agency Fee %, and Legal Fee %) formatted in Nigerian Naira (`₦3,500,000` and compact `₦3.5M`).
- **Role-Based Workflows**:
  - **Seekers**: Browse & filter properties, save favourites, schedule physical or live virtual inspections (Google Meet / WhatsApp Video), message listers in-app or via pre-filled WhatsApp click-to-chat, and submit verified reviews.
  - **Agents & Landlords**: 6-step listing creation wizard with media uploads, availability toggles (`active`, `under_offer`, `rented`, `sold`), listing management table, and NIN/CAC/Title verification submission.
  - **Admins**: Moderation queue for verifying lister identities, property title documents, and flagged listings.
- **Nigeria-First Performance & Offline-Resilient Icons**:
  - Bundled `@iconify-json/solar` and `@iconify-json/mdi` collections via a single `<Icon />` wrapper (`src/components/ui/Icon.tsx`) so icons render instantly with zero external CDN requests on 3G/4G networks.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 + TypeScript 7 (Strict Mode) + Vite 8 |
| **Styling & Design System** | Tailwind CSS v4 (`@theme` CSS custom properties in `src/styles/globals.css`), `class-variance-authority` (CVA), `clsx`, `tailwind-merge` |
| **Routing** | `@tanstack/react-router` (type-safe routes, search param validation, role guards, route-level lazy code splitting) |
| **Server State & API** | `@tanstack/react-query` v5 + `axios` (centralized interceptors, `authorizedRequest` & `unauthorizedRequest`) |
| **Client State** | `@reduxjs/toolkit` + `react-redux` (auth state, search filters, saved listings, UI modals & toasts) |
| **Forms & Validation** | `react-hook-form` + `zod` v4 + `@hookform/resolvers` |
| **Data Tables** | `@tanstack/react-table` v9 |
| **Icons** | `@iconify/react` with offline `@iconify-json/solar` & `@iconify-json/mdi` |
| **Testing & Linting** | `vitest` + `@testing-library/react` + `oxlint` + `prettier` |

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── ui/               # Layer 1: Low-level primitives (Button, Input, Select, Modal, Drawer, Tabs, Pill, Icon, etc.)
│   ├── cards/            # Layer 2: Domain cards (PropertyCard, ListerCard, InspectionCard, ReviewCard, StatCard)
│   ├── shared/           # Layer 3: Feature composites (SearchBar, FilterDrawer, ImageGallery, MapPreview, ShareSheet, etc.)
│   └── layout/           # App shells (Navbar, BottomNav, Footer, DashboardSidebar, PageContainer)
├── features/
│   └── listings/api/     # Seed catalog & local fallback data for development
├── Redux/                # Redux store & auth reducer bridge for Axios interceptors
├── routes/
│   ├── router.tsx        # TanStack Router tree, search validation & role guards
│   └── views/            # Lazy-loaded route views (Home, Search, ListingDetail, Dashboard, NewListing, Verify, Admin, etc.)
├── services/
│   ├── axosIndex.ts      # Axios instance, 401/429/network interceptors, authorizedRequest & unauthorizedRequest
│   ├── axios.ts          # Barrel re-export for Axios client
│   ├── seekers.services.ts     # Seekers auth & profile API service class
│   ├── agents.services.ts      # Agents auth & profile API service class
│   ├── landlords.services.ts   # Landlords auth & profile API service class
│   ├── marketplace.services.ts # Public locations, property-types & listings API service class
│   ├── listings.services.ts    # Agent & Landlord listing CRUD, media upload & availability service class
│   ├── queries/          # TanStack Query hooks (seekers, agents, landlords, marketplace, listing)
│   ├── mutations/        # TanStack Mutation hooks (seekers, agents, landlords, listing)
│   └── types/            # Shared API payload contracts & Backend Badge Enums
├── store/
│   └── slices/           # Redux Toolkit slices (authSlice, filterSlice, savedSlice, uiSlice, catalogSlice)
├── styles/
│   └── globals.css       # Single source of truth for colors, typography, radii, shadows & animations
├── test/                 # Vitest unit & architectural guardrail test suites
├── types/                # Frontend domain models
└── utils/                # Naira formatters (formatNaira, formatCompactNaira), cn(), WhatsApp URL builder, toast helpers
```

---

## 🔌 API Service Layer (`src/services`)

All API calls flow through `authorizedRequest` and `unauthorizedRequest` in `src/services/axios.ts` with typed Service classes, TanStack Query hooks (`src/services/queries/*`), and TanStack Mutation hooks (`src/services/mutations/*`).

### 1. Auth & Profile Services (`SeekersService`, `AgentsService`, `LandlordsService`)
Implemented in `src/services/{seekers,agents,landlords}.services.ts` for `/api/v1/{seekers|agents|landlords}/*`:
- `POST /register`
- `POST /verify-email`
- `POST /resend-verification-code`
- `POST /login`
- `POST /forgot-password`
- `POST /reset-password`
- `POST /change-password`
- `GET /me`
- `PATCH /me`

### 2. Public Marketplace Service (`MarketplaceService`)
Implemented in `src/services/marketplace.services.ts`:
- `GET /api/v1/locations` (`UseGetLocationsQuery`)
- `GET /api/v1/property-types` (`UseGetPropertyTypesQuery`)
- `GET /api/v1/listings` (`UseGetMarketplaceListingsQuery`)
- `GET /api/v1/listings/{idOrSlug}` (`UseGetMarketplaceListingByIdOrSlugQuery`)

### 3. Lister Listings Service (`ListingsService`)
Implemented in `src/services/listings.services.ts` for both `/api/v1/agents/listings*` and `/api/v1/landlords/listings*`:
- `POST /media` — Upload listing images/media (`UseUploadAgentListingMediaMutation`, `UseUploadLandlordListingMediaMutation`)
- `GET /` — List agent/landlord properties (`UseGetAgentListingsQuery`, `UseGetLandlordListingsQuery`)
- `POST /` — Create a new listing (`UseCreateAgentListingMutation`, `UseCreateLandlordListingMutation`)
- `GET /{id}` — Get single listing detail (`UseGetAgentListingByIdQuery`, `UseGetLandlordListingByIdQuery`)
- `PATCH /{id}` — Update listing details (`UseUpdateAgentListingMutation`, `UseUpdateLandlordListingMutation`)
- `DELETE /{id}` — Delete listing (`UseDeleteAgentListingMutation`, `UseDeleteLandlordListingMutation`)
- `PATCH /{id}/availability` — Update listing availability status (`UseUpdateAgentListingAvailabilityMutation`, `UseUpdateLandlordListingAvailabilityMutation`)

### 4. Shared Backend Badge & Status Enums
Defined in `src/services/types/index.ts` for strict alignment with the Backend team:
- `ListingBadgeEnum` (`VERIFIED`, `TITLE_VERIFIED`, `DIRECT_LANDLORD`, `LICENSED_AGENT`, `VIRTUAL_TOUR_AVAILABLE`, `NEWLY_BUILT`, `SERVICED_ESTATE`, `NO_AGENCY_FEE`, `FEATURED`, `FAST_RESPONSE`)
- `ListerVerificationBadgeEnum` (`UNVERIFIED`, `PENDING_VERIFICATION`, `ID_VERIFIED`, `LICENSED_AGENT`, `VERIFIED_LANDLORD`, `PREMIER_LISTER`, `SUSPENDED`)
- `ListingStatusEnum` (`draft`, `pending_review`, `active`, `under_offer`, `rented`, `sold`, `flagged`, `archived`)
- `InspectionStatusEnum` & `InspectionModeEnum` (`physical`, `virtual`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **pnpm** `>= 9.x`

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the project root (or copy from `.env.example` if present):
```env
VITE_API_URL=http://localhost:8000/api/v1
```
> If `VITE_API_URL` is omitted, the Axios client defaults to `/api/v1` for local Vite proxy development.

### 3. Start the Development Server
```bash
pnpm dev
```

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start the Vite development server with HMR |
| `pnpm build` | Run TypeScript typechecking (`tsc --noEmit`) and build production bundle |
| `pnpm typecheck` | Run `tsc --noEmit` across the codebase |
| `pnpm lint` | Run `oxlint src` (enforces zero `any` and React hooks rules) |
| `pnpm test` | Run Vitest unit and architectural guardrail tests (`src/test/*`) |
| `pnpm format` | Format all `.ts`, `.tsx`, and `.css` files with Prettier |
| `pnpm preview` | Preview the production build locally |

---

## 🏛 Architectural Guardrails

Enforced automatically by `src/test/architecture.test.tsx` and `.oxlintrc.json`:
1. **Single Token Source of Truth**: No raw hex colors (`#...`) are permitted in `.ts` or `.tsx` files outside `src/styles/globals.css`. Always use semantic Tailwind utilities (`bg-brand`, `text-ink`, `border-line`, etc.).
2. **Unified Offline Icon Wrapper**: `@iconify/react` may only be imported inside `src/components/ui/Icon.tsx`. Feature and UI components must use `<Icon name="solar:..." />`.
3. **Strict TypeScript**: `noImplicitAny`, `strictNullChecks`, and `"typescript/no-explicit-any": "error"` are enforced across all files.
