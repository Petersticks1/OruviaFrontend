import { queryOptions } from '@tanstack/react-query'
import {
  SEED_INSPECTIONS,
  SEED_LISTINGS,
  SEED_NOTIFICATIONS,
  SEED_REVIEWS,
  SEED_THREADS,
} from './catalog'
import { mapRawListingToDomain } from './mappers'
import type { SearchFiltersState } from '@/store/slices/searchFiltersSlice'
import type { Inspection, Listing, Notification, Review, Thread } from '@/types/domain'

export const listingKeys = {
  all: ['listings'] as const,
  filtered: (filters?: Partial<SearchFiltersState>) => ['listings', filters ?? {}] as const,
  detail: (id: string) => ['listings', 'detail', id] as const,
  inspections: ['inspections'] as const,
  threads: ['threads'] as const,
  reviews: (userId?: string) => ['reviews', userId ?? 'all'] as const,
  notifications: ['notifications'] as const,
}

export function filterListings(
  listings: readonly Listing[],
  filters?: Partial<SearchFiltersState>,
): Listing[] {
  if (!filters) return [...listings]

  const result = listings.filter((item) => {
    if (filters.location && filters.location.trim() !== '') {
      const q = filters.location.toLowerCase().trim()
      const matchesLocation =
        item.location.toLowerCase().includes(q) ||
        item.neighbourhood.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      if (!matchesLocation) return false
    }

    if (filters.type && filters.type !== 'all' && item.type !== filters.type) {
      return false
    }

    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
      return false
    }

    if (filters.minPrice !== undefined && item.price < filters.minPrice) {
      return false
    }

    if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
      return false
    }

    if (filters.beds !== undefined && filters.beds > 0 && item.beds < filters.beds) {
      return false
    }

    if (filters.baths !== undefined && filters.baths > 0 && item.baths < filters.baths) {
      return false
    }

    if (filters.verifiedOnly && !item.verified) {
      return false
    }

    if (filters.virtualTourOnly && !item.videoTourUrl) {
      return false
    }

    if (filters.amenities && filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((a) => item.amenities.includes(a))
      if (!hasAll) return false
    }

    return true
  })

  if (filters.sortBy === 'price_asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (filters.sortBy === 'price_desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (filters.sortBy === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return result
}

export const listingsQueryOptions = (filters?: Partial<SearchFiltersState>) =>
  queryOptions({
    queryKey: listingKeys.filtered(filters),
    queryFn: async (): Promise<Listing[]> => {
      const mapped = SEED_LISTINGS.map(mapRawListingToDomain)
      return filterListings(mapped, filters)
    },
    staleTime: 60_000,
  })

export const listingDetailQueryOptions = (listingId: string) =>
  queryOptions({
    queryKey: listingKeys.detail(listingId),
    queryFn: async (): Promise<Listing | null> => {
      const found = SEED_LISTINGS.find((item) => item.id === listingId)
      return found ? mapRawListingToDomain(found) : null
    },
    staleTime: 60_000,
  })

export const inspectionsQueryOptions = () =>
  queryOptions({
    queryKey: listingKeys.inspections,
    queryFn: async (): Promise<Inspection[]> => [...SEED_INSPECTIONS],
    staleTime: 60_000,
  })

export const threadsQueryOptions = () =>
  queryOptions({
    queryKey: listingKeys.threads,
    queryFn: async (): Promise<Thread[]> => [...SEED_THREADS],
    staleTime: 60_000,
  })

export const reviewsQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: listingKeys.reviews(userId),
    queryFn: async (): Promise<Review[]> => {
      if (!userId) return [...SEED_REVIEWS]
      return SEED_REVIEWS.filter((r) => r.targetUserId === userId)
    },
    staleTime: 60_000,
  })

export const notificationsQueryOptions = () =>
  queryOptions({
    queryKey: listingKeys.notifications,
    queryFn: async (): Promise<Notification[]> => [...SEED_NOTIFICATIONS],
    staleTime: 60_000,
  })

