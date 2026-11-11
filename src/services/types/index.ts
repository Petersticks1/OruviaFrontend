/**
 * Backend-shared Enums & API Response Contracts for Oruvia
 * Share directly with the Backend team for Postgres/Neon enums & REST payloads.
 */

export interface APISuccessResponse<T = unknown> {
  status?: boolean | string
  message?: string
  data: T
}

// ── Shared Auth & Password Payloads ───────────────────────────────────────────

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface ResendVerificationCodePayload {
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email?: string
  code?: string
  token?: string
  newPassword: string
  confirmPassword?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

// ── Seekers Payloads ──────────────────────────────────────────────────────────

export interface RegisterSeekerPayload {
  firstName?: string
  lastName?: string
  fullName?: string
  email: string
  phone?: string
  password: string
}

export type SeekerLoginPayload = LoginPayload

export interface UpdateSeekerProfilePayload {
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  bio?: string
  avatarUrl?: string
  preferredLocations?: string[]
}

// ── Agents Payloads ───────────────────────────────────────────────────────────

export interface RegisterAgentPayload {
  firstName?: string
  lastName?: string
  fullName?: string
  email: string
  phone?: string
  password: string
  agencyName?: string
  licenseNumber?: string
}

export type AgentLoginPayload = LoginPayload

export interface UpdateAgentProfilePayload {
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  bio?: string
  avatarUrl?: string
  agencyName?: string
  licenseNumber?: string
  officeAddress?: string
}

// ── Landlords Payloads ────────────────────────────────────────────────────────

export interface RegisterLandlordPayload {
  firstName?: string
  lastName?: string
  fullName?: string
  email: string
  phone?: string
  password: string
}

export type LandlordLoginPayload = LoginPayload

export interface UpdateLandlordProfilePayload {
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  bio?: string
  avatarUrl?: string
  address?: string
}

// ── Marketplace & Listings Payloads ───────────────────────────────────────────

export interface MarketplaceLocationsParams {
  search?: string
  state?: string
  city?: string
  page?: number
  limit?: number
}

export interface MarketplaceListingsParams {
  page?: number
  limit?: number
  search?: string
  q?: string
  state?: string
  city?: string
  locationId?: string
  propertyType?: string
  propertyTypeId?: string
  category?: string
  type?: 'rent' | 'sale'
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  verified?: boolean
  featured?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ListerListingsQueryParams {
  page?: number
  limit?: number
  status?: ListingStatusType
  search?: string
  type?: 'rent' | 'sale'
  propertyType?: string
}

export type UploadListingMediaPayload =
  | FormData
  | {
      files?: File[]
      media?: string[]
    }

export interface CreateListingPayload {
  title: string
  description: string
  type?: 'rent' | 'sale'
  listingType?: 'rent' | 'sale'
  category?: string
  propertyType?: string
  propertyTypeId?: string
  price: number
  pricePeriod?: 'year' | 'month' | 'total'
  serviceCharge?: number
  cautionFee?: number
  agencyFeePercent?: number
  legalFeePercent?: number
  location?: string
  address?: string
  neighbourhood?: string
  city?: string
  state?: string
  locationId?: string
  lat?: number
  lng?: number
  beds?: number
  bedrooms?: number
  baths?: number
  bathrooms?: number
  areaSqm?: number
  amenities?: string[]
  images?: Array<{ id?: string; url: string; alt?: string }> | string[]
  mediaIds?: string[]
  videoTourUrl?: string
  status?: ListingStatusType
}

export type UpdateListingPayload = Partial<CreateListingPayload>

export interface UpdateListingAvailabilityPayload {
  isAvailable?: boolean
  available?: boolean
  status?: ListingStatusType
  availableFrom?: string
}

export interface UpdateListingVariables {
  id: string
  payload: UpdateListingPayload
}

export interface UpdateListingAvailabilityVariables {
  id: string
  payload: UpdateListingAvailabilityPayload
}

/**
 * 1. LISTING TRUST & HIGHLIGHT BADGES (`listing.badges[]`)
 * Displayed on `PropertyCard` (top-left overlay) and `ListingDetailView` header.
 */
export const ListingBadgeEnum = {
  VERIFIED: 'VERIFIED',
  TITLE_VERIFIED: 'TITLE_VERIFIED',
  DIRECT_LANDLORD: 'DIRECT_LANDLORD',
  LICENSED_AGENT: 'LICENSED_AGENT',
  VIRTUAL_TOUR_AVAILABLE: 'VIRTUAL_TOUR_AVAILABLE',
  NEWLY_BUILT: 'NEWLY_BUILT',
  SERVICED_ESTATE: 'SERVICED_ESTATE',
  NO_AGENCY_FEE: 'NO_AGENCY_FEE',
  FEATURED: 'FEATURED',
  FAST_RESPONSE: 'FAST_RESPONSE',
} as const

export type ListingBadgeType = (typeof ListingBadgeEnum)[keyof typeof ListingBadgeEnum]

/**
 * 2. LISTER / USER VERIFICATION BADGES (`user.verification_badge`)
 * Displayed on `VerifiedBadge`, `ListerCard`, and `ProfileView`.
 */
export const ListerVerificationBadgeEnum = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  ID_VERIFIED: 'ID_VERIFIED',
  LICENSED_AGENT: 'LICENSED_AGENT',
  VERIFIED_LANDLORD: 'VERIFIED_LANDLORD',
  PREMIER_LISTER: 'PREMIER_LISTER',
  SUSPENDED: 'SUSPENDED',
} as const

export type ListerVerificationBadgeType =
  (typeof ListerVerificationBadgeEnum)[keyof typeof ListerVerificationBadgeEnum]

/**
 * 3. LISTING LIFECYCLE STATUS BADGES (`listing.status`)
 * Displayed on `StatusBadge` in Lister Dashboard, Admin Queue, and Listing Detail.
 */
export const ListingStatusEnum = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  ACTIVE: 'active',
  UNDER_OFFER: 'under_offer',
  RENTED: 'rented',
  SOLD: 'sold',
  FLAGGED: 'flagged',
  ARCHIVED: 'archived',
} as const

export type ListingStatusType = (typeof ListingStatusEnum)[keyof typeof ListingStatusEnum]

/**
 * 4. INSPECTION STATUS & MODE BADGES (`inspection.status`, `inspection.mode`)
 * Displayed on `InspectionCard`.
 */
export const InspectionStatusEnum = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  RESCHEDULED: 'rescheduled',
  COMPLETED: 'completed',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
} as const

export type InspectionStatusType =
  (typeof InspectionStatusEnum)[keyof typeof InspectionStatusEnum]

export const InspectionModeEnum = {
  PHYSICAL: 'physical',
  VIRTUAL: 'virtual',
} as const

export type InspectionModeType = (typeof InspectionModeEnum)[keyof typeof InspectionModeEnum]
