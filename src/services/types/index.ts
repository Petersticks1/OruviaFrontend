/**
 * Backend-shared Enums & API Response Contracts for Oruvia
 * Aligned directly with https://api.oruvia.workers.dev/openapi.json
 */

export interface PaginationMeta {
  page: number
  per_page: number
  total_records: number
  total_pages: number
}

export interface APISuccessResponse<T = unknown> {
  success?: boolean
  status?: boolean | string
  message?: string
  data: T
  meta?: PaginationMeta
}

// ── Profile & Auth Response DTOs ──────────────────────────────────────────────

export interface SeekerProfileDto {
  id: string
  account_type: 'seeker'
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  preferred_location: string | null
  is_email_verified: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AgentProfileDto {
  id: string
  account_type: 'agent'
  full_name: string
  email: string
  phone: string | null
  whatsapp_number: string | null
  agency_name: string | null
  license_number: string | null
  bio: string | null
  avatar_url: string | null
  is_email_verified: boolean
  email_verified_at: string | null
  is_verified: boolean
  verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
  verification_badge: 'verified_agent' | 'licensed_agent' | null
  created_at: string
  updated_at: string
}

export interface LandlordProfileDto {
  id: string
  account_type: 'landlord'
  full_name: string
  email: string
  phone: string | null
  whatsapp_number: string | null
  company_name: string | null
  bio: string | null
  avatar_url: string | null
  is_email_verified: boolean
  email_verified_at: string | null
  is_verified: boolean
  verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
  verification_badge: 'verified_landlord' | 'verified_owner' | null
  created_at: string
  updated_at: string
}

export interface SeekerAuthData {
  seeker: SeekerProfileDto
  access_token: string
  expires_in: number
}

export interface AgentAuthData {
  agent: AgentProfileDto
  access_token: string
  expires_in: number
}

export interface LandlordAuthData {
  landlord: LandlordProfileDto
  access_token: string
  expires_in: number
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
  email: string
  code: string
  new_password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

// ── Seekers Payloads ──────────────────────────────────────────────────────────

export interface RegisterSeekerPayload {
  full_name: string
  email: string
  password: string
  phone?: string
  preferred_location?: string
}

export type SeekerLoginPayload = LoginPayload

export interface UpdateSeekerProfilePayload {
  full_name?: string
  phone?: string | null
  avatar_url?: string | null
  preferred_location?: string | null
}

// ── Agents Payloads ───────────────────────────────────────────────────────────

export interface RegisterAgentPayload {
  full_name: string
  email: string
  password: string
  phone?: string
  whatsapp_number?: string
  agency_name?: string
  license_number?: string
  bio?: string
}

export type AgentLoginPayload = LoginPayload

export interface UpdateAgentProfilePayload {
  full_name?: string
  phone?: string | null
  avatar_url?: string | null
  whatsapp_number?: string | null
  agency_name?: string | null
  license_number?: string | null
  bio?: string | null
}

// ── Landlords Payloads ────────────────────────────────────────────────────────

export interface RegisterLandlordPayload {
  full_name: string
  email: string
  password: string
  phone?: string
  whatsapp_number?: string
  company_name?: string
  bio?: string
}

export type LandlordLoginPayload = LoginPayload

export interface UpdateLandlordProfilePayload {
  full_name?: string
  phone?: string | null
  avatar_url?: string | null
  whatsapp_number?: string | null
  company_name?: string | null
  bio?: string | null
}

// ── KYC DTOs ──────────────────────────────────────────────────────────────────

export type KycIdType = 'nin' | 'international_passport' | 'drivers_license' | 'voters_card'
export type LandlordProofType =
  | 'utility_bill'
  | 'c_of_o'
  | 'deed_of_assignment'
  | 'survey_plan'
  | 'governors_consent'

export interface AgentKycStatusDto {
  is_verified: boolean
  verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
  verification_badge: 'verified_agent' | 'licensed_agent' | null
  kyc_submission: {
    id: string
    agent_id: string
    id_type: KycIdType
    id_number: string
    id_document_url: string
    selfie_url: string
    agency_name: string | null
    license_number: string | null
    license_document_url: string | null
    office_address: string
    city: string
    state: string
    status: string
    qualified_badge: 'verified_agent' | 'licensed_agent'
    rejection_reason: string | null
    submitted_at: string
    reviewed_at: string | null
    created_at: string
    updated_at: string
  } | null
}

export interface LandlordKycStatusDto {
  is_verified: boolean
  verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
  verification_badge: 'verified_landlord' | 'verified_owner' | null
  kyc_submission: {
    id: string
    landlord_id: string
    id_type: KycIdType
    id_number: string
    id_document_url: string
    selfie_url: string
    proof_type: LandlordProofType
    proof_document_url: string
    residential_address: string
    city: string
    state: string
    status: string
    qualified_badge: 'verified_landlord' | 'verified_owner'
    rejection_reason: string | null
    submitted_at: string
    reviewed_at: string | null
    created_at: string
    updated_at: string
  } | null
}

// ── Catalog & Property Listing DTOs ───────────────────────────────────────────

export interface CityDto {
  id: string
  stateId?: string
  state_id?: string
  name: string
  slug: string
  isActive?: boolean
  is_active?: boolean
}

export interface StateWithCitiesDto {
  id: string
  name: string
  slug: string
  isActive?: boolean
  is_active?: boolean
  cities: CityDto[]
}

export interface PropertyTypeDto {
  id: string
  slug: string
  name: string
  category: 'residential' | 'commercial' | 'land'
  description: string | null
  defaultBedrooms?: number | null
  default_bedrooms?: number | null
  displayOrder?: number
  display_order?: number
  isActive?: boolean
  is_active?: boolean
}

export interface PropertyListingDto {
  id: string
  lister_role: 'agent' | 'landlord'
  lister: {
    role: 'agent' | 'landlord'
    id: string
    name: string
    email: string
    phone: string | null
    whatsapp_number: string | null
    business_name: string | null
    avatar_url: string | null
    is_verified: boolean
    verification_status: string
    verification_badge: string | null
  } | null
  title: string
  slug: string
  description: string
  classification: 'rent' | 'sale'
  state: {
    id: string
    name: string
    slug: string
  }
  city: {
    id: string
    name: string
    slug: string
  }
  area: string
  address: string
  location_coordinates: {
    latitude: number
    longitude: number
  } | null
  property_type: {
    id: string
    name: string
    slug: string
    category: 'residential' | 'commercial' | 'land'
  }
  pricing: {
    base_price: number
    payment_frequency: 'yearly' | 'monthly' | 'one_time'
    agency_fee: number
    legal_fee: number
    caution_fee: number
    service_charge: number
    total_initial_package: number
  }
  specifications: {
    bedrooms: number
    bathrooms: number
    toilets: number
    amenities: string[]
  }
  media: {
    images: string[]
    video_tour_url: string | null
  }
  status: {
    availability_status: 'available' | 'rented' | 'sold' | 'unavailable'
    moderation_status: 'pending_review' | 'approved' | 'rejected' | 'suspended'
    rejection_reason: string | null
    reviewed_at: string | null
    published_at: string | null
  }
  created_at: string
  updated_at: string
}

export interface UploadedListingMediaDto {
  images: string[]
  video_tour_url?: string | null
  video?: string | null
}

// ── Marketplace & Listings Query / Mutation Payloads ──────────────────────────

export interface MarketplaceLocationsParams {
  search?: string
  state?: string
  city?: string
}

export interface PropertyTypesParams {
  category?: 'residential' | 'commercial' | 'land'
}

export interface MarketplaceListingsParams {
  city_slug?: string
  property_type_slug?: string
  classification?: 'rent' | 'sale'
  category?: 'residential' | 'commercial' | 'land'
  min_price?: number
  max_price?: number
  bedrooms?: number
  q?: string
  sort?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  per_page?: number
}

export interface ListerListingsQueryParams {
  moderation_status?: 'pending_review' | 'approved' | 'rejected' | 'suspended'
  availability_status?: 'available' | 'rented' | 'sold' | 'unavailable'
}

export type UploadListingMediaPayload = FormData

export interface CreateListingPayload {
  title: string
  description: string
  classification: 'rent' | 'sale'
  property_type_id: string
  state_id: string
  city_id: string
  area: string
  address: string
  latitude?: number
  longitude?: number
  base_price: number
  payment_frequency?: 'yearly' | 'monthly' | 'one_time'
  agency_fee?: number
  legal_fee?: number
  caution_fee?: number
  service_charge?: number
  bedrooms?: number
  bathrooms?: number
  toilets?: number
  amenities?: string[]
  images: string[]
  video_tour_url?: string
}

export type UpdateListingPayload = Partial<CreateListingPayload>

export interface UpdateListingAvailabilityPayload {
  availability_status: 'available' | 'rented' | 'sold' | 'unavailable'
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
