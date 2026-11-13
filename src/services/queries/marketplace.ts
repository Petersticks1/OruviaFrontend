import { useQuery } from '@tanstack/react-query'
import { marketplaceService } from '../index'
import type {
  MarketplaceListingsParams,
  MarketplaceLocationsParams,
  PropertyTypesParams,
} from '../types'

export const QUERY_KEYS = {
  GET_LOCATIONS: 'getLocations',
  GET_PROPERTY_TYPES: 'getPropertyTypes',
  GET_MARKETPLACE_LISTINGS: 'getMarketplaceListings',
  GET_MARKETPLACE_LISTING_BY_ID_OR_SLUG: 'getMarketplaceListingByIdOrSlug',
} as const

export const UseGetLocationsQuery = (
  params?: MarketplaceLocationsParams,
  enabled: boolean = true,
) => {
  const {
    data: locationsData,
    isLoading: locationsIsLoading,
    isFetching: locationsIsFetching,
    isError: locationsIsError,
    refetch: refetchLocations,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_LOCATIONS, params],
    queryFn: async () => await marketplaceService.getLocationsService(params),
    enabled,
  })

  return {
    locationsData,
    locationsIsLoading,
    locationsIsFetching,
    locationsIsError,
    refetchLocations,
  }
}

export const UseGetPropertyTypesQuery = (
  params?: PropertyTypesParams,
  enabled: boolean = true,
) => {
  const {
    data: propertyTypesData,
    isLoading: propertyTypesIsLoading,
    isFetching: propertyTypesIsFetching,
    isError: propertyTypesIsError,
    refetch: refetchPropertyTypes,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROPERTY_TYPES, params],
    queryFn: async () => await marketplaceService.getPropertyTypesService(params),
    enabled,
  })

  return {
    propertyTypesData,
    propertyTypesIsLoading,
    propertyTypesIsFetching,
    propertyTypesIsError,
    refetchPropertyTypes,
  }
}

export const UseGetMarketplaceListingsQuery = (
  params?: MarketplaceListingsParams,
  enabled: boolean = true,
) => {
  const {
    data: marketplaceListingsData,
    isLoading: marketplaceListingsIsLoading,
    isFetching: marketplaceListingsIsFetching,
    isError: marketplaceListingsIsError,
    refetch: refetchMarketplaceListings,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_MARKETPLACE_LISTINGS, params],
    queryFn: async () => await marketplaceService.getListingsService(params),
    enabled,
  })

  return {
    marketplaceListingsData,
    marketplaceListingsIsLoading,
    marketplaceListingsIsFetching,
    marketplaceListingsIsError,
    refetchMarketplaceListings,
  }
}

export const UseGetMarketplaceListingByIdOrSlugQuery = (
  idOrSlug: string,
  enabled: boolean = true,
) => {
  const {
    data: marketplaceListingDetailData,
    isLoading: marketplaceListingDetailIsLoading,
    isFetching: marketplaceListingDetailIsFetching,
    isError: marketplaceListingDetailIsError,
    refetch: refetchMarketplaceListingDetail,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_MARKETPLACE_LISTING_BY_ID_OR_SLUG, idOrSlug],
    queryFn: async () => await marketplaceService.getListingByIdOrSlugService(idOrSlug),
    enabled: Boolean(idOrSlug) && enabled,
  })

  return {
    marketplaceListingDetailData,
    marketplaceListingDetailIsLoading,
    marketplaceListingDetailIsFetching,
    marketplaceListingDetailIsError,
    refetchMarketplaceListingDetail,
  }
}
