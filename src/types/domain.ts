export type UserRole = 'seeker' | 'agent' | 'landlord' | 'admin'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  whatsappNumber?: string
  role: UserRole
  verified: boolean
  verificationStatus?: 'unverified' | 'pending' | 'approved' | 'rejected'
  verificationBadge?: string | null
  avatarUrl?: string
  bio?: string
  agencyName?: string
  companyName?: string
  licenseNumber?: string
  preferredLocation?: string
  isEmailVerified?: boolean
  rating: number
  reviewCount: number
  responseRate: number
  responseTime: string
  joinedAt: string
  listingsCount: number
}

export type PropertyCategory =
  | 'apartment'
  | 'duplex'
  | 'bungalow'
  | 'self-contain'
  | 'land'
  | 'office'
  | 'shop'
  | 'residential'
  | 'commercial'

export type ListingType = 'rent' | 'sale'

export type ListingStatus =
  | 'active'
  | 'available'
  | 'rented'
  | 'sold'
  | 'unavailable'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'draft'

export type AmenityKey =
  | 'wifi'
  | 'power_24_7'
  | 'solar_inverter'
  | 'borehole_water'
  | 'parking'
  | 'gated_security'
  | 'cctv'
  | 'swimming_pool'
  | 'gym'
  | 'air_conditioning'
  | 'fitted_kitchen'
  | 'boys_quarters'
  | 'balcony'
  | 'serviced'

export interface ListingImage {
  id: string
  url: string
  alt: string
}

export interface Listing {
  id: string
  slug?: string
  title: string
  type: ListingType
  category: PropertyCategory
  propertyTypeId?: string
  propertyTypeName?: string
  propertyTypeSlug?: string
  propertyCategory?: 'residential' | 'commercial' | 'land'
  price: number
  pricePeriod: 'year' | 'month' | 'total'
  serviceCharge?: number
  cautionFee?: number
  agencyFee?: number
  legalFee?: number
  totalInitialPackage?: number
  agencyFeePercent?: number
  legalFeePercent?: number
  location: string
  neighbourhood: string
  address?: string
  city: string
  cityId?: string
  citySlug?: string
  state: string
  stateId?: string
  stateSlug?: string
  lat: number
  lng: number
  beds: number
  baths: number
  toilets?: number
  areaSqm: number
  description: string
  amenities: Array<AmenityKey | string>
  images: ListingImage[]
  videoTourUrl?: string
  verified: boolean
  status: ListingStatus
  availabilityStatus?: 'available' | 'rented' | 'sold' | 'unavailable'
  moderationStatus?: 'pending_review' | 'approved' | 'rejected' | 'suspended'
  rejectionReason?: string | null
  rating: number
  reviewCount: number
  featured?: boolean
  createdAt: string
  lister: UserProfile
}

export type InspectionMode = 'physical' | 'virtual'

export type InspectionStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'declined'
  | 'completed'
  | 'cancelled'

export interface Inspection {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  listingLocation: string
  seekerId: string
  seekerName: string
  seekerPhone: string
  seekerAvatar?: string
  listerId: string
  listerName: string
  listerRole: 'agent' | 'landlord'
  dateTime: string
  mode: InspectionMode
  status: InspectionStatus
  note?: string
  meetingLink?: string
  createdAt: string
}

export interface MessageItem {
  id: string
  threadId: string
  senderId: string
  senderName: string
  body: string
  createdAt: string
}

export interface Thread {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  listingPrice: number
  listingType: ListingType
  participantId: string
  participantName: string
  participantRole: UserRole
  participantVerified: boolean
  participantPhone: string
  participantAvatar?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: MessageItem[]
}

export interface Review {
  id: string
  reviewerId: string
  reviewerName: string
  reviewerAvatar?: string
  reviewerRole: UserRole
  targetUserId: string
  listingTitle?: string
  rating: number
  comment: string
  createdAt: string
}

export type NotificationType =
  | 'inspection_requested'
  | 'inspection_confirmed'
  | 'inspection_rescheduled'
  | 'message_received'
  | 'verification_approved'
  | 'listing_saved'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  actionHref?: string
}

export type UnifiedStatus =
  | ListingStatus
  | InspectionStatus
  | 'verified'
  | 'unverified'
  | 'flagged'
