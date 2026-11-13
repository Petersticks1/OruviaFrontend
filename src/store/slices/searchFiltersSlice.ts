import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AmenityKey, ListingType } from '@/types/domain'

export interface SearchFiltersState {
  location: string
  citySlug: string
  type: ListingType | 'all'
  propertyTypeSlug: string
  category: string
  minPrice: number
  maxPrice: number
  beds: number
  baths: number
  verifiedOnly: boolean
  virtualTourOnly: boolean
  amenities: AmenityKey[]
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'newest'
}

const initialState: SearchFiltersState = {
  location: '',
  citySlug: '',
  type: 'all',
  propertyTypeSlug: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 150_000_000,
  beds: 0,
  baths: 0,
  verifiedOnly: false,
  virtualTourOnly: false,
  amenities: [],
  sortBy: 'recommended',
}

export const searchFiltersSlice = createSlice({
  name: 'searchFilters',
  initialState,
  reducers: {
    setLocationFilter(state, action: PayloadAction<string>) {
      state.location = action.payload
    },
    setCitySlugFilter(state, action: PayloadAction<string>) {
      state.citySlug = action.payload
    },
    setListingTypeFilter(state, action: PayloadAction<ListingType | 'all'>) {
      state.type = action.payload
    },
    setPropertyTypeSlugFilter(state, action: PayloadAction<string>) {
      state.propertyTypeSlug = action.payload
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.category = action.payload
    },
    setPriceRangeFilter(state, action: PayloadAction<[number, number]>) {
      state.minPrice = action.payload[0]
      state.maxPrice = action.payload[1]
    },
    setBedsFilter(state, action: PayloadAction<number>) {
      state.beds = action.payload
    },
    setBathsFilter(state, action: PayloadAction<number>) {
      state.baths = action.payload
    },
    setVerifiedOnlyFilter(state, action: PayloadAction<boolean>) {
      state.verifiedOnly = action.payload
    },
    setVirtualTourOnlyFilter(state, action: PayloadAction<boolean>) {
      state.virtualTourOnly = action.payload
    },
    toggleAmenityFilter(state, action: PayloadAction<AmenityKey>) {
      const idx = state.amenities.indexOf(action.payload)
      if (idx >= 0) {
        state.amenities.splice(idx, 1)
      } else {
        state.amenities.push(action.payload)
      }
    },
    setSortBy(
      state,
      action: PayloadAction<'recommended' | 'price_asc' | 'price_desc' | 'newest'>,
    ) {
      state.sortBy = action.payload
    },
    resetSearchFilters() {
      return initialState
    },
  },
})

export const {
  setLocationFilter,
  setCitySlugFilter,
  setListingTypeFilter,
  setPropertyTypeSlugFilter,
  setCategoryFilter,
  setPriceRangeFilter,
  setBedsFilter,
  setBathsFilter,
  setVerifiedOnlyFilter,
  setVirtualTourOnlyFilter,
  toggleAmenityFilter,
  setSortBy,
  resetSearchFilters,
} = searchFiltersSlice.actions

export default searchFiltersSlice.reducer
