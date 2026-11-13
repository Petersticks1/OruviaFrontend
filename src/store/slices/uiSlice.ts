import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const SAVED_STORAGE_KEY = 'oruvia_saved_listings'

export type ToastTone = 'default' | 'success' | 'danger' | 'info'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  tone?: ToastTone
}

export interface PendingIntent {
  type: 'save_listing' | 'request_inspection' | 'message_lister'
  listingId: string
  redirectTo?: string
}

export interface UiState {
  toasts: ToastMessage[]
  activeModal: string | null
  mobileSearchOpen: boolean
  filterModalOpen: boolean
  mapView: boolean
  pendingIntent: PendingIntent | null
  savedListingIds: string[]
}

function loadSavedListings(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string')
    }
  } catch {
    // Ignore storage errors
  }
  return []
}

function persistSavedListings(ids: string[]): void {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Ignore storage errors
  }
}

const initialState: UiState = {
  toasts: [],
  activeModal: null,
  mobileSearchOpen: false,
  filterModalOpen: false,
  mapView: false,
  pendingIntent: null,
  savedListingIds: loadSavedListings(),
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<ToastMessage, 'id'> & { id?: string }>) {
      const id = action.payload.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      state.toasts.push({
        ...action.payload,
        id,
      })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearToasts(state) {
      state.toasts = []
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload
    },
    closeModal(state) {
      state.activeModal = null
    },
    setMobileSearchOpen(state, action: PayloadAction<boolean>) {
      state.mobileSearchOpen = action.payload
    },
    setFilterModalOpen(state, action: PayloadAction<boolean>) {
      state.filterModalOpen = action.payload
    },
    toggleMapView(state) {
      state.mapView = !state.mapView
    },
    setMapView(state, action: PayloadAction<boolean>) {
      state.mapView = action.payload
    },
    setPendingIntent(state, action: PayloadAction<PendingIntent | null>) {
      state.pendingIntent = action.payload
    },
    toggleSavedListing(state, action: PayloadAction<string>) {
      const id = action.payload
      const idx = state.savedListingIds.indexOf(id)
      if (idx >= 0) {
        state.savedListingIds.splice(idx, 1)
      } else {
        state.savedListingIds.push(id)
      }
      persistSavedListings(state.savedListingIds)
    },
    resetUiSession(state) {
      state.activeModal = null
      state.mobileSearchOpen = false
      state.filterModalOpen = false
      state.pendingIntent = null
      state.savedListingIds = []
      try {
        localStorage.removeItem(SAVED_STORAGE_KEY)
      } catch {
        // Ignore storage errors
      }
    },
  },
})

export const {
  addToast,
  removeToast,
  clearToasts,
  openModal,
  closeModal,
  setMobileSearchOpen,
  setFilterModalOpen,
  toggleMapView,
  setMapView,
  setPendingIntent,
  toggleSavedListing,
  resetUiSession,
} = uiSlice.actions

export default uiSlice.reducer
