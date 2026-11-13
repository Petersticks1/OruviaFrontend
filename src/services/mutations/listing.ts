import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsService } from '../index'
import { QUERY_KEYS as LISTING_QUERY_KEYS } from '../queries/listing'
import { QUERY_KEYS as MARKETPLACE_QUERY_KEYS } from '../queries/marketplace'
import type {
  CreateListingPayload,
  UpdateListingAvailabilityVariables,
  UpdateListingVariables,
  UploadListingMediaPayload,
} from '../types'
import { getApiErrorMessage } from '../utils'
import { showOruviaToast } from '../../utils/toast'

// ── Agent Listing Mutations ───────────────────────────────────────────────────

// POST /agents/listings/media
export const UseUploadAgentListingMediaMutation = () => {
  const {
    isPending: uploadAgentListingMediaIsPending,
    mutate: uploadAgentListingMediaMutation,
    mutateAsync: uploadAgentListingMediaMutationAsync,
  } = useMutation({
    mutationFn: async (payload: UploadListingMediaPayload) =>
      await listingsService.uploadAgentListingMediaService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Listing media uploaded successfully!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to upload listing media.'))
    },
  })

  return {
    uploadAgentListingMediaIsPending,
    uploadAgentListingMediaMutation,
    uploadAgentListingMediaMutationAsync,
  }
}

// POST /agents/listings
export const UseCreateAgentListingMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: createAgentListingIsPending,
    mutate: createAgentListingMutation,
    mutateAsync: createAgentListingMutationAsync,
  } = useMutation({
    mutationFn: async (payload: CreateListingPayload) =>
      await listingsService.createAgentListingService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Listing created and submitted for review!')
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_AGENT_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to create listing.'))
    },
  })

  return {
    createAgentListingIsPending,
    createAgentListingMutation,
    createAgentListingMutationAsync,
  }
}

// PATCH /agents/listings/{id}
export const UseUpdateAgentListingMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateAgentListingIsPending,
    mutate: updateAgentListingMutation,
    mutateAsync: updateAgentListingMutationAsync,
  } = useMutation({
    mutationFn: async ({ id, payload }: UpdateListingVariables) =>
      await listingsService.updateAgentListingService(id, payload),
    onSuccess: (data, variables) => {
      showOruviaToast('success', data?.message || 'Listing updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_AGENT_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [LISTING_QUERY_KEYS.GET_AGENT_LISTING_BY_ID, variables.id],
      })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to update listing.'))
    },
  })

  return {
    updateAgentListingIsPending,
    updateAgentListingMutation,
    updateAgentListingMutationAsync,
  }
}

// DELETE /agents/listings/{id}
export const UseDeleteAgentListingMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: deleteAgentListingIsPending,
    mutate: deleteAgentListingMutation,
    mutateAsync: deleteAgentListingMutationAsync,
  } = useMutation({
    mutationFn: async (id: string) => await listingsService.deleteAgentListingService(id),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Listing deleted successfully!',
      )
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_AGENT_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to delete listing.'))
    },
  })

  return {
    deleteAgentListingIsPending,
    deleteAgentListingMutation,
    deleteAgentListingMutationAsync,
  }
}

// PATCH /agents/listings/{id}/availability
export const UseUpdateAgentListingAvailabilityMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateAgentListingAvailabilityIsPending,
    mutate: updateAgentListingAvailabilityMutation,
    mutateAsync: updateAgentListingAvailabilityMutationAsync,
  } = useMutation({
    mutationFn: async ({ id, payload }: UpdateListingAvailabilityVariables) =>
      await listingsService.updateAgentListingAvailabilityService(id, payload),
    onSuccess: (data, variables) => {
      showOruviaToast('success', data?.message || 'Listing availability updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_AGENT_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [LISTING_QUERY_KEYS.GET_AGENT_LISTING_BY_ID, variables.id],
      })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to update listing availability.'))
    },
  })

  return {
    updateAgentListingAvailabilityIsPending,
    updateAgentListingAvailabilityMutation,
    updateAgentListingAvailabilityMutationAsync,
  }
}

// ── Landlord Listing Mutations ────────────────────────────────────────────────

// POST /landlords/listings/media
export const UseUploadLandlordListingMediaMutation = () => {
  const {
    isPending: uploadLandlordListingMediaIsPending,
    mutate: uploadLandlordListingMediaMutation,
    mutateAsync: uploadLandlordListingMediaMutationAsync,
  } = useMutation({
    mutationFn: async (payload: UploadListingMediaPayload) =>
      await listingsService.uploadLandlordListingMediaService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Listing media uploaded successfully!')
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to upload listing media.'))
    },
  })

  return {
    uploadLandlordListingMediaIsPending,
    uploadLandlordListingMediaMutation,
    uploadLandlordListingMediaMutationAsync,
  }
}

// POST /landlords/listings
export const UseCreateLandlordListingMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: createLandlordListingIsPending,
    mutate: createLandlordListingMutation,
    mutateAsync: createLandlordListingMutationAsync,
  } = useMutation({
    mutationFn: async (payload: CreateListingPayload) =>
      await listingsService.createLandlordListingService(payload),
    onSuccess: (data) => {
      showOruviaToast('success', data?.message || 'Listing created and submitted for review!')
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_LANDLORD_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to create listing.'))
    },
  })

  return {
    createLandlordListingIsPending,
    createLandlordListingMutation,
    createLandlordListingMutationAsync,
  }
}

// PATCH /landlords/listings/{id}
export const UseUpdateLandlordListingMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateLandlordListingIsPending,
    mutate: updateLandlordListingMutation,
    mutateAsync: updateLandlordListingMutationAsync,
  } = useMutation({
    mutationFn: async ({ id, payload }: UpdateListingVariables) =>
      await listingsService.updateLandlordListingService(id, payload),
    onSuccess: (data, variables) => {
      showOruviaToast('success', data?.message || 'Listing updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_LANDLORD_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [LISTING_QUERY_KEYS.GET_LANDLORD_LISTING_BY_ID, variables.id],
      })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to update listing.'))
    },
  })

  return {
    updateLandlordListingIsPending,
    updateLandlordListingMutation,
    updateLandlordListingMutationAsync,
  }
}

// DELETE /landlords/listings/{id}
export const UseDeleteLandlordListingMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: deleteLandlordListingIsPending,
    mutate: deleteLandlordListingMutation,
    mutateAsync: deleteLandlordListingMutationAsync,
  } = useMutation({
    mutationFn: async (id: string) => await listingsService.deleteLandlordListingService(id),
    onSuccess: (data) => {
      showOruviaToast(
        'success',
        data?.data?.message || data?.message || 'Listing deleted successfully!',
      )
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_LANDLORD_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to delete listing.'))
    },
  })

  return {
    deleteLandlordListingIsPending,
    deleteLandlordListingMutation,
    deleteLandlordListingMutationAsync,
  }
}

// PATCH /landlords/listings/{id}/availability
export const UseUpdateLandlordListingAvailabilityMutation = () => {
  const queryClient = useQueryClient()
  const {
    isPending: updateLandlordListingAvailabilityIsPending,
    mutate: updateLandlordListingAvailabilityMutation,
    mutateAsync: updateLandlordListingAvailabilityMutationAsync,
  } = useMutation({
    mutationFn: async ({ id, payload }: UpdateListingAvailabilityVariables) =>
      await listingsService.updateLandlordListingAvailabilityService(id, payload),
    onSuccess: (data, variables) => {
      showOruviaToast('success', data?.message || 'Listing availability updated successfully!')
      void queryClient.invalidateQueries({ queryKey: [LISTING_QUERY_KEYS.GET_LANDLORD_LISTINGS] })
      void queryClient.invalidateQueries({
        queryKey: [LISTING_QUERY_KEYS.GET_LANDLORD_LISTING_BY_ID, variables.id],
      })
      void queryClient.invalidateQueries({
        queryKey: [MARKETPLACE_QUERY_KEYS.GET_MARKETPLACE_LISTINGS],
      })
    },
    onError: (error: unknown) => {
      showOruviaToast('error', getApiErrorMessage(error, 'Failed to update listing availability.'))
    },
  })

  return {
    updateLandlordListingAvailabilityIsPending,
    updateLandlordListingAvailabilityMutation,
    updateLandlordListingAvailabilityMutationAsync,
  }
}
