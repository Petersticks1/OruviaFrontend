import { QUERY_KEYS as SEEKER_QUERY_KEYS, UseGetSeekerMeQuery } from './seekers'
import { QUERY_KEYS as AGENT_QUERY_KEYS, UseGetAgentMeQuery } from './agents'
import { QUERY_KEYS as LANDLORD_QUERY_KEYS, UseGetLandlordMeQuery } from './landlords'
import {
  QUERY_KEYS as MARKETPLACE_QUERY_KEYS,
  UseGetLocationsQuery,
  UseGetPropertyTypesQuery,
  UseGetMarketplaceListingsQuery,
  UseGetMarketplaceListingByIdOrSlugQuery,
} from './marketplace'
import {
  QUERY_KEYS as LISTING_QUERY_KEYS,
  UseGetAgentListingsQuery,
  UseGetAgentListingByIdQuery,
  UseGetLandlordListingsQuery,
  UseGetLandlordListingByIdQuery,
} from './listing'

export const QUERY_KEYS = {
  ...SEEKER_QUERY_KEYS,
  ...AGENT_QUERY_KEYS,
  ...LANDLORD_QUERY_KEYS,
  ...MARKETPLACE_QUERY_KEYS,
  ...LISTING_QUERY_KEYS,
} as const

export {
  SEEKER_QUERY_KEYS,
  AGENT_QUERY_KEYS,
  LANDLORD_QUERY_KEYS,
  MARKETPLACE_QUERY_KEYS,
  LISTING_QUERY_KEYS,
  UseGetSeekerMeQuery,
  UseGetAgentMeQuery,
  UseGetLandlordMeQuery,
  UseGetLocationsQuery,
  UseGetPropertyTypesQuery,
  UseGetMarketplaceListingsQuery,
  UseGetMarketplaceListingByIdOrSlugQuery,
  UseGetAgentListingsQuery,
  UseGetAgentListingByIdQuery,
  UseGetLandlordListingsQuery,
  UseGetLandlordListingByIdQuery,
}
