import type { IconName } from '@/components/ui/icons'
import type { AmenityKey, PropertyCategory, UnifiedStatus } from '@/types/domain'

export interface CategoryMeta {
  id: PropertyCategory | 'all'
  label: string
  icon: IconName
}

export const PROPERTY_CATEGORIES: readonly CategoryMeta[] = [
  { id: 'all', label: 'All homes', icon: 'home' },
  { id: 'apartment', label: 'Apartment', icon: 'building' },
  { id: 'duplex', label: 'Duplex', icon: 'duplex' },
  { id: 'bungalow', label: 'Bungalow', icon: 'bungalow' },
  { id: 'self-contain', label: 'Self-contain', icon: 'selfContain' },
  { id: 'land', label: 'Land', icon: 'land' },
  { id: 'office', label: 'Office', icon: 'office' },
  { id: 'shop', label: 'Shop', icon: 'shop' },
] as const

export interface AmenityMeta {
  key: AmenityKey
  label: string
  icon: IconName
}

export const AMENITIES_CATALOG: Record<AmenityKey, AmenityMeta> = {
  wifi: { key: 'wifi', label: 'Fibre Wi-Fi ready', icon: 'wifi' },
  power_24_7: { key: 'power_24_7', label: '24/7 Estate Power', icon: 'power' },
  solar_inverter: { key: 'solar_inverter', label: 'Solar & Inverter', icon: 'solar' },
  borehole_water: { key: 'borehole_water', label: 'Treated Borehole Water', icon: 'water' },
  parking: { key: 'parking', label: 'Ample Parking (2+ cars)', icon: 'parking' },
  gated_security: { key: 'gated_security', label: '24/7 Gated Security', icon: 'security' },
  cctv: { key: 'cctv', label: 'CCTV Surveillance', icon: 'video' },
  swimming_pool: { key: 'swimming_pool', label: 'Swimming Pool', icon: 'pool' },
  gym: { key: 'gym', label: 'Fitness Gym', icon: 'gym' },
  air_conditioning: { key: 'air_conditioning', label: 'Pre-installed AC', icon: 'ac' },
  fitted_kitchen: { key: 'fitted_kitchen', label: 'Fitted Modern Kitchen', icon: 'kitchen' },
  boys_quarters: { key: 'boys_quarters', label: 'En-suite Boys Quarters (BQ)', icon: 'home' },
  balcony: { key: 'balcony', label: 'Private Balcony', icon: 'balcony' },
  serviced: { key: 'serviced', label: 'Fully Serviced Estate', icon: 'verified' },
}

export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'verified'

export interface StatusConfig {
  label: string
  tone: StatusTone
  icon?: IconName
}

export const CENTRAL_STATUS_MAP: Record<UnifiedStatus, StatusConfig> = {
  active: { label: 'Available', tone: 'success', icon: 'check' },
  available: { label: 'Available', tone: 'success', icon: 'check' },
  approved: { label: 'Approved', tone: 'success', icon: 'check' },
  rented: { label: 'Rented', tone: 'neutral', icon: 'home' },
  sold: { label: 'Sold', tone: 'neutral', icon: 'check' },
  unavailable: { label: 'Unavailable', tone: 'neutral', icon: 'close' },
  pending_review: { label: 'In Review', tone: 'warning', icon: 'clock' },
  rejected: { label: 'Rejected', tone: 'danger', icon: 'close' },
  suspended: { label: 'Suspended', tone: 'danger', icon: 'report' },
  draft: { label: 'Draft', tone: 'neutral', icon: 'edit' },
  pending: { label: 'Pending confirmation', tone: 'warning', icon: 'clock' },
  confirmed: { label: 'Confirmed', tone: 'success', icon: 'check' },
  rescheduled: { label: 'Rescheduled', tone: 'info', icon: 'calendar' },
  declined: { label: 'Declined', tone: 'danger', icon: 'close' },
  completed: { label: 'Completed', tone: 'success', icon: 'check' },
  cancelled: { label: 'Cancelled', tone: 'neutral', icon: 'close' },
  verified: { label: 'Verified', tone: 'verified', icon: 'verified' },
  unverified: { label: 'Unverified', tone: 'neutral', icon: 'shield' },
  flagged: { label: 'Flagged', tone: 'danger', icon: 'report' },
}
