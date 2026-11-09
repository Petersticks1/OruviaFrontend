import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import listingDraftReducer from './slices/listingDraftSlice'
import searchFiltersReducer from './slices/searchFiltersSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    searchFilters: searchFiltersReducer,
    ui: uiReducer,
    listingDraft: listingDraftReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

