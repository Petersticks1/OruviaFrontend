import { authorizedRequest } from './axios'
import { buildQueryString } from './utils'
import type {
  APISuccessResponse,
  CreateListingPayload,
  ListerListingsQueryParams,
  PropertyListingDto,
  UpdateListingAvailabilityPayload,
  UpdateListingPayload,
  UploadedListingMediaDto,
  UploadListingMediaPayload,
} from './types'

export class ListingsService {
  // ── Agents Listing Endpoints ────────────────────────────────────────────────
  static uploadAgentListingMedia = '/agents/listings/media'
  static getAgentListings = '/agents/listings'
  static createAgentListing = '/agents/listings'
  static getAgentListingById = (id: string) => `/agents/listings/${id}`
  static updateAgentListing = (id: string) => `/agents/listings/${id}`
  static deleteAgentListing = (id: string) => `/agents/listings/${id}`
  static updateAgentListingAvailability = (id: string) => `/agents/listings/${id}/availability`

  // ── Landlords Listing Endpoints ─────────────────────────────────────────────
  static uploadLandlordListingMedia = '/landlords/listings/media'
  static getLandlordListings = '/landlords/listings'
  static createLandlordListing = '/landlords/listings'
  static getLandlordListingById = (id: string) => `/landlords/listings/${id}`
  static updateLandlordListing = (id: string) => `/landlords/listings/${id}`
  static deleteLandlordListing = (id: string) => `/landlords/listings/${id}`
  static updateLandlordListingAvailability = (id: string) =>
    `/landlords/listings/${id}/availability`

  // ── Agent Listing Services ──────────────────────────────────────────────────

  async uploadAgentListingMediaService(payload: UploadListingMediaPayload) {
    try {
      return await authorizedRequest<
        UploadListingMediaPayload,
        APISuccessResponse<UploadedListingMediaDto>
      >('POST', ListingsService.uploadAgentListingMedia, payload)
    } catch (error: unknown) {
      console.error('Error in uploadAgentListingMediaService:', error)
      throw error
    }
  }

  async getAgentListingsService(params?: ListerListingsQueryParams) {
    try {
      return await authorizedRequest<null, APISuccessResponse<PropertyListingDto[]>>(
        'GET',
        `${ListingsService.getAgentListings}${buildQueryString(params)}`,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getAgentListingsService:', error)
      throw error
    }
  }

  async createAgentListingService(payload: CreateListingPayload) {
    try {
      return await authorizedRequest<CreateListingPayload, APISuccessResponse<PropertyListingDto>>(
        'POST',
        ListingsService.createAgentListing,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in createAgentListingService:', error)
      throw error
    }
  }

  async getAgentListingByIdService(id: string) {
    try {
      return await authorizedRequest<null, APISuccessResponse<PropertyListingDto>>(
        'GET',
        ListingsService.getAgentListingById(id),
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getAgentListingByIdService:', error)
      throw error
    }
  }

  async updateAgentListingService(id: string, payload: UpdateListingPayload) {
    try {
      return await authorizedRequest<UpdateListingPayload, APISuccessResponse<PropertyListingDto>>(
        'PATCH',
        ListingsService.updateAgentListing(id),
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in updateAgentListingService:', error)
      throw error
    }
  }

  async deleteAgentListingService(id: string) {
    try {
      return await authorizedRequest<null, APISuccessResponse<{ message?: string }>>(
        'DELETE',
        ListingsService.deleteAgentListing(id),
        null,
      )
    } catch (error: unknown) {
      console.error('Error in deleteAgentListingService:', error)
      throw error
    }
  }

  async updateAgentListingAvailabilityService(
    id: string,
    payload: UpdateListingAvailabilityPayload,
  ) {
    try {
      return await authorizedRequest<
        UpdateListingAvailabilityPayload,
        APISuccessResponse<PropertyListingDto>
      >('PATCH', ListingsService.updateAgentListingAvailability(id), payload)
    } catch (error: unknown) {
      console.error('Error in updateAgentListingAvailabilityService:', error)
      throw error
    }
  }

  // ── Landlord Listing Services ───────────────────────────────────────────────

  async uploadLandlordListingMediaService(payload: UploadListingMediaPayload) {
    try {
      return await authorizedRequest<
        UploadListingMediaPayload,
        APISuccessResponse<UploadedListingMediaDto>
      >('POST', ListingsService.uploadLandlordListingMedia, payload)
    } catch (error: unknown) {
      console.error('Error in uploadLandlordListingMediaService:', error)
      throw error
    }
  }

  async getLandlordListingsService(params?: ListerListingsQueryParams) {
    try {
      return await authorizedRequest<null, APISuccessResponse<PropertyListingDto[]>>(
        'GET',
        `${ListingsService.getLandlordListings}${buildQueryString(params)}`,
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getLandlordListingsService:', error)
      throw error
    }
  }

  async createLandlordListingService(payload: CreateListingPayload) {
    try {
      return await authorizedRequest<CreateListingPayload, APISuccessResponse<PropertyListingDto>>(
        'POST',
        ListingsService.createLandlordListing,
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in createLandlordListingService:', error)
      throw error
    }
  }

  async getLandlordListingByIdService(id: string) {
    try {
      return await authorizedRequest<null, APISuccessResponse<PropertyListingDto>>(
        'GET',
        ListingsService.getLandlordListingById(id),
        null,
      )
    } catch (error: unknown) {
      console.error('Error in getLandlordListingByIdService:', error)
      throw error
    }
  }

  async updateLandlordListingService(id: string, payload: UpdateListingPayload) {
    try {
      return await authorizedRequest<UpdateListingPayload, APISuccessResponse<PropertyListingDto>>(
        'PATCH',
        ListingsService.updateLandlordListing(id),
        payload,
      )
    } catch (error: unknown) {
      console.error('Error in updateLandlordListingService:', error)
      throw error
    }
  }

  async deleteLandlordListingService(id: string) {
    try {
      return await authorizedRequest<null, APISuccessResponse<{ message?: string }>>(
        'DELETE',
        ListingsService.deleteLandlordListing(id),
        null,
      )
    } catch (error: unknown) {
      console.error('Error in deleteLandlordListingService:', error)
      throw error
    }
  }

  async updateLandlordListingAvailabilityService(
    id: string,
    payload: UpdateListingAvailabilityPayload,
  ) {
    try {
      return await authorizedRequest<
        UpdateListingAvailabilityPayload,
        APISuccessResponse<PropertyListingDto>
      >('PATCH', ListingsService.updateLandlordListingAvailability(id), payload)
    } catch (error: unknown) {
      console.error('Error in updateLandlordListingAvailabilityService:', error)
      throw error
    }
  }
}
