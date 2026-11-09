# Oruvia Backend API Gaps & Integration Notes

The backend `/docs/api` specification is not yet available in the repository. Following the engineering rules in `context/context.md`, all missing backend endpoints and contracts are logged here, and the UI degrades gracefully or uses the typed `apiClient` and feature mappers so backend endpoints can be plugged in seamlessly once ready.

| Feature | Missing Specification | Current Handling / Workaround |
| --- | --- | --- |
| Listings Discovery (`GET /listings`, `GET /listings/:id`) | Full OpenAPI / REST schema not yet in `/docs/api` | Typed `Listing` domain model in `src/types/domain.ts`, mapper layer in `src/features/listings/api/mappers.ts`, and TanStack Query `queryOptions` with seed catalog fallback when `VITE_API_URL` is unreachable. |
| Auth & Roles (`POST /auth/login`, `POST /auth/signup`, `POST /auth/otp`) | Auth payload and token refresh contract | Redux `authSlice` stores session user (`Seeker`, `Agent`, `Landlord`, `Admin`) + Bearer token; interactive role-switcher in Auth views and Header user menu for instant demoing. |
| Inspection Requests (`POST /inspections`, `PATCH /inspections/:id`) | Inspection booking & virtual tour link schema | Typed `Inspection` model and optimistic status transitions (`pending`, `confirmed`, `rescheduled`, `declined`, `completed`). |
| Favourites (`POST /favourites`, `DELETE /favourites/:listingId`) | Wishlist sync endpoint | Optimistic wishlist toggle via Redux & TanStack Query cache with instant heart pop animation. |
| In-App Messaging (`GET /threads`, `POST /threads/:id/messages`) | Realtime / REST messaging contract | Feature flag `VITE_FF_REALTIME` with in-app thread UI and WhatsApp deep-link fallback. |
| Payments (`VITE_FF_PAYMENTS`) | Paystack / Flutterwave inspection fee webhook | Gated behind `VITE_FF_PAYMENTS=false` feature flag. |

