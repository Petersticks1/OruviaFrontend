import { unauthorizedRequest } from './axios'
import type {
  APISuccessResponse,
  MarketplaceListingsParams,
  MarketplaceLocationsParams,
} from './types'

const buildQueryString = (params?: object): string => {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export class MarketplaceService {
  static getLocations = '/locations'
  static getPropertyTypes = '/property-types'
  static getListings = '/listings'
  static getListingByIdOrSlug = (idOrSlug: string) => `/listings/${idOrSlug}`

  async getLocationsService(params?: MarketplaceLocationsParams) {
    try {
      return await unauthorizedRequest<null, APISuccessResponse>(
        'GET',
        `${MarketplaceService.getLocations}${buildQueryString(params)}`,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getLocationsService:', error)
      throw error
    }
  }

  async getPropertyTypesService() {
    try {
      return await unauthorizedRequest<null, APISuccessResponse>(
        'GET',
        MarketplaceService.getPropertyTypes,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getPropertyTypesService:', error)
      throw error
    }
  }

  async getListingsService(params?: MarketplaceListingsParams) {
    try {
      return await unauthorizedRequest<null, APISuccessResponse>(
        'GET',
        `${MarketplaceService.getListings}${buildQueryString(params)}`,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getListingsService:', error)
      throw error
    }
  }

  async getListingByIdOrSlugService(idOrSlug: string) {
    try {
      return await unauthorizedRequest<null, APISuccessResponse>(
        'GET',
        MarketplaceService.getListingByIdOrSlug(idOrSlug),
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getListingByIdOrSlugService:', error)
      throw error
    }
  }
}

