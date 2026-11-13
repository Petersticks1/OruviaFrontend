import { unauthorizedRequest } from './axios'
import { buildQueryString } from './utils'
import type {
  APISuccessResponse,
  MarketplaceListingsParams,
  MarketplaceLocationsParams,
  PropertyListingDto,
  PropertyTypeDto,
  PropertyTypesParams,
  StateWithCitiesDto,
} from './types'

export class MarketplaceService {
  static getLocations = '/locations'
  static getPropertyTypes = '/property-types'
  static getListings = '/listings'
  static getListingByIdOrSlug = (idOrSlug: string) => `/listings/${idOrSlug}`

  async getLocationsService(params?: MarketplaceLocationsParams) {
    try {
      return await unauthorizedRequest<null, APISuccessResponse<StateWithCitiesDto[]>>(
        'GET',
        `${MarketplaceService.getLocations}${buildQueryString(params)}`,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getLocationsService:', error)
      throw error
    }
  }

  async getPropertyTypesService(params?: PropertyTypesParams) {
    try {
      return await unauthorizedRequest<null, APISuccessResponse<PropertyTypeDto[]>>(
        'GET',
        `${MarketplaceService.getPropertyTypes}${buildQueryString(params)}`,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getPropertyTypesService:', error)
      throw error
    }
  }

  async getListingsService(params?: MarketplaceListingsParams) {
    try {
      return await unauthorizedRequest<null, APISuccessResponse<PropertyListingDto[]>>(
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
      return await unauthorizedRequest<null, APISuccessResponse<PropertyListingDto>>(
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
