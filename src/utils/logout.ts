import { queryClient } from '@/app/queryClient'
import { store } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { resetListingDraft } from '@/store/slices/listingDraftSlice'
import { resetSearchFilters } from '@/store/slices/searchFiltersSlice'
import { resetUiSession } from '@/store/slices/uiSlice'

/**
 * Clears all local session state, browser storage, Redux slices,
 * and in-memory TanStack Query caches.
 * Note: The Oruvia API uses stateless JWTs and does not expose a server-side
 * /logout or token-revocation endpoint.
 */
export function performFullLogout(): void {
  // 1. Cancel active queries and wipe TanStack Query cache
  void queryClient.cancelQueries()
  queryClient.clear()

  // 2. Reset Redux stores
  store.dispatch(logout())
  store.dispatch(resetUiSession())
  store.dispatch(resetListingDraft())
  store.dispatch(resetSearchFilters())

  // 3. Wipe localStorage and sessionStorage
  try {
    localStorage.clear()
  } catch {
    // Ignore storage access errors
  }

  try {
    sessionStorage.clear()
  } catch {
    // Ignore storage access errors
  }
}
