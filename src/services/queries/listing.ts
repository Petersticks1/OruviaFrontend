import { useQuery } from '@tanstack/react-query'
import { listingsService } from '../index'
import { useOruviaAppSelector } from '../../Redux/store'
import type { ListerListingsQueryParams } from '../types'

export const QUERY_KEYS = {
  GET_AGENT_LISTINGS: 'getAgentListings',
  GET_AGENT_LISTING_BY_ID: 'getAgentListingById',
  GET_LANDLORD_LISTINGS: 'getLandlordListings',
  GET_LANDLORD_LISTING_BY_ID: 'getLandlordListingById',
} as const

// ── Agent Listings Queries ────────────────────────────────────────────────────

export const UseGetAgentListingsQuery = (
  params?: ListerListingsQueryParams,
  enabled: boolean = true,
) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: agentListingsData,
    isLoading: agentListingsIsLoading,
    isFetching: agentListingsIsFetching,
    isError: agentListingsIsError,
    refetch: refetchAgentListings,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_AGENT_LISTINGS, params],
    queryFn: async () => await listingsService.getAgentListingsService(params),
    enabled: !!token && enabled,
  })

  return {
    agentListingsData,
    agentListingsIsLoading,
    agentListingsIsFetching,
    agentListingsIsError,
    refetchAgentListings,
  }
}

export const UseGetAgentListingByIdQuery = (id: string, enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: agentListingDetailData,
    isLoading: agentListingDetailIsLoading,
    isFetching: agentListingDetailIsFetching,
    isError: agentListingDetailIsError,
    refetch: refetchAgentListingDetail,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_AGENT_LISTING_BY_ID, id],
    queryFn: async () => await listingsService.getAgentListingByIdService(id),
    enabled: !!token && Boolean(id) && enabled,
  })

  return {
    agentListingDetailData,
    agentListingDetailIsLoading,
    agentListingDetailIsFetching,
    agentListingDetailIsError,
    refetchAgentListingDetail,
  }
}

// ── Landlord Listings Queries ─────────────────────────────────────────────────

export const UseGetLandlordListingsQuery = (
  params?: ListerListingsQueryParams,
  enabled: boolean = true,
) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: landlordListingsData,
    isLoading: landlordListingsIsLoading,
    isFetching: landlordListingsIsFetching,
    isError: landlordListingsIsError,
    refetch: refetchLandlordListings,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_LANDLORD_LISTINGS, params],
    queryFn: async () => await listingsService.getLandlordListingsService(params),
    enabled: !!token && enabled,
  })

  return {
    landlordListingsData,
    landlordListingsIsLoading,
    landlordListingsIsFetching,
    landlordListingsIsError,
    refetchLandlordListings,
  }
}

export const UseGetLandlordListingByIdQuery = (id: string, enabled: boolean = true) => {
  const token = useOruviaAppSelector((state) => state.auth.token)
  const {
    data: landlordListingDetailData,
    isLoading: landlordListingDetailIsLoading,
    isFetching: landlordListingDetailIsFetching,
    isError: landlordListingDetailIsError,
    refetch: refetchLandlordListingDetail,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_LANDLORD_LISTING_BY_ID, id],
    queryFn: async () => await listingsService.getLandlordListingByIdService(id),
    enabled: !!token && Boolean(id) && enabled,
  })

  return {
    landlordListingDetailData,
    landlordListingDetailIsLoading,
    landlordListingDetailIsFetching,
    landlordListingDetailIsError,
    refetchLandlordListingDetail,
  }
}

