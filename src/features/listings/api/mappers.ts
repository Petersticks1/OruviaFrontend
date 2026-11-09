import type { Listing } from '@/types/domain'

export interface RawListingDto {
  id: string
  title: string
  listing_type?: 'rent' | 'sale'
  type?: 'rent' | 'sale'
  category?: Listing['category']
  price_ngn?: number
  price?: number
  price_period?: Listing['pricePeriod']
  pricePeriod?: Listing['pricePeriod']
  location: string
  neighbourhood?: string
  city?: string
  state?: string
  lat: number
  lng: number
  beds: number
  baths: number
  area_sqm?: number
  areaSqm?: number
  description: string
  amenities: Listing['amenities']
  images: Listing['images']
  video_tour_url?: string
  videoTourUrl?: string
  verified: boolean
  status: Listing['status']
  rating: number
  review_count?: number
  reviewCount?: number
  created_at?: string
  createdAt?: string
  lister: Listing['lister']
}

export function mapRawListingToDomain(dto: RawListingDto | Listing): Listing {
  if ('pricePeriod' in dto && 'areaSqm' in dto) {
    return dto as Listing
  }
  const raw = dto as RawListingDto
  return {
    id: raw.id,
    title: raw.title,
    type: raw.listing_type ?? raw.type ?? 'rent',
    category: raw.category ?? 'apartment',
    price: raw.price_ngn ?? raw.price ?? 0,
    pricePeriod: raw.price_period ?? raw.pricePeriod ?? 'year',
    location: raw.location,
    neighbourhood: raw.neighbourhood ?? raw.location,
    city: raw.city ?? 'Abeokuta',
    state: raw.state ?? 'Ogun',
    lat: raw.lat,
    lng: raw.lng,
    beds: raw.beds,
    baths: raw.baths,
    areaSqm: raw.area_sqm ?? raw.areaSqm ?? 100,
    description: raw.description,
    amenities: raw.amenities,
    images: raw.images,
    videoTourUrl: raw.video_tour_url ?? raw.videoTourUrl,
    verified: raw.verified,
    status: raw.status,
    rating: raw.rating,
    reviewCount: raw.review_count ?? raw.reviewCount ?? 0,
    createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
    lister: raw.lister,
  }
}
