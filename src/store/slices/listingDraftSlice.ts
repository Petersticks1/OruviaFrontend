import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AmenityKey, ListingType, PropertyCategory } from '@/types/domain'

export interface ListingDraftState {
  step: number
  title: string
  type: ListingType
  category: PropertyCategory
  price: number
  serviceCharge: number
  location: string
  neighbourhood: string
  city: string
  state: string
  beds: number
  baths: number
  areaSqm: number
  description: string
  amenities: AmenityKey[]
  photoUrls: string[]
  videoTourUrl: string
}

const initialState: ListingDraftState = {
  step: 0,
  title: '',
  type: 'rent',
  category: 'apartment',
  price: 2_500_000,
  serviceCharge: 250_000,
  location: 'Ibara GRA, Abeokuta, Ogun',
  neighbourhood: 'Ibara GRA',
  city: 'Abeokuta',
  state: 'Ogun',
  beds: 3,
  baths: 3,
  areaSqm: 145,
  description: '',
  amenities: ['power_24_7', 'borehole_water', 'gated_security', 'parking'],
  photoUrls: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
  ],
  videoTourUrl: '',
}

export const listingDraftSlice = createSlice({
  name: 'listingDraft',
  initialState,
  reducers: {
    updateListingDraft(state, action: PayloadAction<Partial<ListingDraftState>>) {
      Object.assign(state, action.payload)
    },
    setDraftStep(state, action: PayloadAction<number>) {
      state.step = action.payload
    },
    resetListingDraft() {
      return initialState
    },
  },
})

export const { updateListingDraft, setDraftStep, resetListingDraft } = listingDraftSlice.actions
export default listingDraftSlice.reducer

