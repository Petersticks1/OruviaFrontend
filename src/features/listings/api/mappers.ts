import type { AMENITIES_CATALOG } from '@/lib/constants'
import type {
  AgentProfileDto,
  LandlordProfileDto,
  MarketplaceListingsParams,
  PropertyListingDto,
  SeekerProfileDto,
} from '@/services/types'
import type { SearchFiltersState } from '@/store/slices/searchFiltersSlice'
import type {
  AmenityKey,
  Listing,
  ListingStatus,
  PropertyCategory,
  UserProfile,
} from '@/types/domain'

function mapPropertyTypeSlugToCategory(
  slug: string,
  category: 'residential' | 'commercial' | 'land',
): PropertyCategory {
  if (category === 'land' || slug === 'land') return 'land'
  if (category === 'commercial' || slug === 'commercial') return 'shop'
  if (slug.includes('duplex')) return 'duplex'
  if (slug.includes('bungalow')) return 'bungalow'
  if (slug.includes('self_contain') || slug === 'single_room') return 'self-contain'
  return 'apartment'
}

function mapPaymentFrequencyToPeriod(
  freq?: 'yearly' | 'monthly' | 'one_time',
): 'year' | 'month' | 'total' {
  if (freq === 'monthly') return 'month'
  if (freq === 'one_time') return 'total'
  return 'year'
}

function mapListingStatus(status: PropertyListingDto['status']): ListingStatus {
  if (status.moderation_status === 'pending_review') return 'pending_review'
  if (status.moderation_status === 'rejected') return 'rejected'
  if (status.moderation_status === 'suspended') return 'suspended'
  if (status.availability_status === 'available') return 'active'
  return status.availability_status
}

export function mapProfileDtoToDomain(
  dto: SeekerProfileDto | AgentProfileDto | LandlordProfileDto,
): UserProfile {
  if (dto.account_type === 'seeker') {
    return {
      id: dto.id,
      name: dto.full_name,
      email: dto.email,
      phone: dto.phone ?? '',
      role: 'seeker',
      verified: dto.is_email_verified,
      isEmailVerified: dto.is_email_verified,
      avatarUrl: dto.avatar_url ?? undefined,
      preferredLocation: dto.preferred_location ?? undefined,
      rating: 0,
      reviewCount: 0,
      responseRate: 100,
      responseTime: 'within an hour',
      joinedAt: dto.created_at,
      listingsCount: 0,
    }
  }

  if (dto.account_type === 'agent') {
    return {
      id: dto.id,
      name: dto.full_name,
      email: dto.email,
      phone: dto.phone ?? '',
      whatsappNumber: dto.whatsapp_number ?? undefined,
      role: 'agent',
      verified: dto.is_verified,
      verificationStatus: dto.verification_status,
      verificationBadge: dto.verification_badge,
      isEmailVerified: dto.is_email_verified,
      avatarUrl: dto.avatar_url ?? undefined,
      agencyName: dto.agency_name ?? undefined,
      licenseNumber: dto.license_number ?? undefined,
      bio: dto.bio ?? undefined,
      rating: 0,
      reviewCount: 0,
      responseRate: 100,
      responseTime: 'within 30 mins',
      joinedAt: dto.created_at,
      listingsCount: 0,
    }
  }

  return {
    id: dto.id,
    name: dto.full_name,
    email: dto.email,
    phone: dto.phone ?? '',
    whatsappNumber: dto.whatsapp_number ?? undefined,
    role: 'landlord',
    verified: dto.is_verified,
    verificationStatus: dto.verification_status,
    verificationBadge: dto.verification_badge,
    isEmailVerified: dto.is_email_verified,
    avatarUrl: dto.avatar_url ?? undefined,
    companyName: dto.company_name ?? undefined,
    bio: dto.bio ?? undefined,
    rating: 0,
    reviewCount: 0,
    responseRate: 100,
    responseTime: 'within 30 mins',
    joinedAt: dto.created_at,
    listingsCount: 0,
  }
}

export function mapPropertyListingDtoToDomain(dto: PropertyListingDto): Listing {
  const listerInfo = dto.lister
  const lister: UserProfile = listerInfo
    ? {
        id: listerInfo.id,
        name: listerInfo.name,
        email: listerInfo.email,
        phone: listerInfo.phone ?? listerInfo.whatsapp_number ?? '',
        whatsappNumber: listerInfo.whatsapp_number ?? undefined,
        role: listerInfo.role,
        verified: listerInfo.is_verified,
        verificationStatus:
          listerInfo.verification_status as UserProfile['verificationStatus'],
        verificationBadge: listerInfo.verification_badge,
        avatarUrl: listerInfo.avatar_url ?? undefined,
        agencyName: listerInfo.business_name ?? undefined,
        rating: 0,
        reviewCount: 0,
        responseRate: 100,
        responseTime: 'within 30 mins',
        joinedAt: dto.created_at,
        listingsCount: 0,
      }
    : {
        id: '',
        name: 'Verified Lister',
        email: '',
        phone: '',
        role: dto.lister_role,
        verified: false,
        rating: 0,
        reviewCount: 0,
        responseRate: 100,
        responseTime: 'within 30 mins',
        joinedAt: dto.created_at,
        listingsCount: 0,
      }

  const basePrice = dto.pricing?.base_price ?? 0
  const agencyFee = dto.pricing?.agency_fee ?? 0
  const legalFee = dto.pricing?.legal_fee ?? 0
  const cautionFee = dto.pricing?.caution_fee ?? 0
  const serviceCharge = dto.pricing?.service_charge ?? 0

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    type: dto.classification,
    category: mapPropertyTypeSlugToCategory(
      dto.property_type?.slug ?? '',
      dto.property_type?.category ?? 'residential',
    ),
    propertyTypeId: dto.property_type?.id,
    propertyTypeName: dto.property_type?.name,
    propertyTypeSlug: dto.property_type?.slug,
    propertyCategory: dto.property_type?.category,
    price: basePrice,
    pricePeriod: mapPaymentFrequencyToPeriod(dto.pricing?.payment_frequency),
    serviceCharge,
    cautionFee,
    agencyFee,
    legalFee,
    totalInitialPackage: dto.pricing?.total_initial_package,
    agencyFeePercent:
      basePrice > 0 && agencyFee > 0 ? Math.round((agencyFee / basePrice) * 100) : 0,
    legalFeePercent:
      basePrice > 0 && legalFee > 0 ? Math.round((legalFee / basePrice) * 100) : 0,
    location: `${dto.area}, ${dto.city?.name ?? ''}, ${dto.state?.name ?? ''}`.replace(
      /^,\s*|,\s*$/g,
      '',
    ),
    neighbourhood: dto.area,
    address: dto.address,
    city: dto.city?.name ?? '',
    cityId: dto.city?.id,
    citySlug: dto.city?.slug,
    state: dto.state?.name ?? '',
    stateId: dto.state?.id,
    stateSlug: dto.state?.slug,
    lat: dto.location_coordinates?.latitude ?? 7.1475,
    lng: dto.location_coordinates?.longitude ?? 3.3619,
    beds: dto.specifications?.bedrooms ?? 0,
    baths: dto.specifications?.bathrooms ?? 0,
    toilets: dto.specifications?.toilets ?? 0,
    areaSqm: 0,
    description: dto.description,
    amenities: dto.specifications?.amenities ?? [],
    images: (dto.media?.images ?? []).map((url, idx) => ({
      id: `${dto.id}-img-${idx}`,
      url,
      alt: `${dto.title} photo ${idx + 1}`,
    })),
    videoTourUrl: dto.media?.video_tour_url ?? undefined,
    verified: Boolean(listerInfo?.is_verified),
    status: mapListingStatus(dto.status),
    availabilityStatus: dto.status?.availability_status,
    moderationStatus: dto.status?.moderation_status,
    rejectionReason: dto.status?.rejection_reason,
    rating: 0,
    reviewCount: 0,
    createdAt: dto.created_at,
    lister,
  }
}

export function buildMarketplaceListingsParams(
  filters: Partial<SearchFiltersState>,
): MarketplaceListingsParams {
  const params: MarketplaceListingsParams = {
    page: 1,
    per_page: 50,
  }

  if (filters.location && filters.location.trim() !== '') {
    params.q = filters.location.trim()
  }
  if (filters.citySlug && filters.citySlug.trim() !== '') {
    params.city_slug = filters.citySlug.trim()
  }
  if (filters.type && filters.type !== 'all') {
    params.classification = filters.type
  }
  if (
    filters.category &&
    (filters.category === 'residential' ||
      filters.category === 'commercial' ||
      filters.category === 'land')
  ) {
    params.category = filters.category
  }
  if (filters.propertyTypeSlug && filters.propertyTypeSlug.trim() !== '') {
    params.property_type_slug = filters.propertyTypeSlug.trim()
  }
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params.min_price = filters.minPrice
  }
  if (filters.maxPrice !== undefined && filters.maxPrice < 150_000_000) {
    params.max_price = filters.maxPrice
  }
  if (filters.beds !== undefined && filters.beds > 0) {
    params.bedrooms = filters.beds
  }
  if (filters.sortBy === 'price_asc') params.sort = 'price_asc'
  if (filters.sortBy === 'price_desc') params.sort = 'price_desc'
  if (filters.sortBy === 'newest') params.sort = 'newest'

  return params
}

const AMENITY_MATCH_WORDS: Record<AmenityKey, string[]> = {
  wifi: ['wifi', 'wi-fi', 'fibre', 'internet'],
  power_24_7: ['power', 'electricity', 'generator', 'prepaid'],
  solar_inverter: ['solar', 'inverter'],
  borehole_water: ['borehole', 'water'],
  parking: ['parking'],
  gated_security: ['gated', 'security', 'gatehouse'],
  cctv: ['cctv', 'surveillance'],
  swimming_pool: ['pool'],
  gym: ['gym', 'fitness'],
  air_conditioning: ['ac', 'air condition'],
  fitted_kitchen: ['kitchen'],
  boys_quarters: ['bq', 'boys quarters'],
  balcony: ['balcony'],
  serviced: ['serviced'],
}

export function filterListingsClientSide(
  listings: readonly Listing[],
  filters?: Partial<SearchFiltersState>,
): Listing[] {
  if (!filters) return [...listings]

  return listings.filter((item) => {
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
      const normalizedItemAmenities = item.amenities.map((a) => String(a).toLowerCase())
      const matchesAll = filters.amenities.every((key: keyof typeof AMENITIES_CATALOG) => {
        const keywords = AMENITY_MATCH_WORDS[key] ?? [key]
        return normalizedItemAmenities.some((label) =>
          keywords.some((kw) => label.includes(kw)),
        )
      })
      if (!matchesAll) return false
    }
    return true
  })
}
