import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ListingDraftState {
  step: number
  title: string
  classification: 'rent' | 'sale'
  propertyTypeId: string
  stateId: string
  cityId: string
  area: string
  address: string
  basePrice: number
  paymentFrequency: 'yearly' | 'monthly' | 'one_time'
  agencyFee: number
  legalFee: number
  cautionFee: number
  serviceCharge: number
  bedrooms: number
  bathrooms: number
  toilets: number
  description: string
  amenities: string[]
  images: string[]
  videoTourUrl: string
}

const initialState: ListingDraftState = {
  step: 0,
  title: '',
  classification: 'rent',
  propertyTypeId: '',
  stateId: '',
  cityId: '',
  area: '',
  address: '',
  basePrice: 0,
  paymentFrequency: 'yearly',
  agencyFee: 0,
  legalFee: 0,
  cautionFee: 0,
  serviceCharge: 0,
  bedrooms: 1,
  bathrooms: 1,
  toilets: 1,
  description: '',
  amenities: [],
  images: [],
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
